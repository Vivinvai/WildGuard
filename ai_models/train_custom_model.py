"""
Train Custom Animal Classification Model
Using Kaggle's 90 Animal Dataset + Transfer Learning
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Reduce TensorFlow warnings

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import json
from pathlib import Path
from datetime import datetime

class CustomAnimalModelTrainer:
    def __init__(self, dataset_path, model_save_path):
        self.dataset_path = Path(dataset_path) / "animals" / "animals"  # Fix nested path
        self.model_save_path = Path(model_save_path)
        self.model_save_path.mkdir(parents=True, exist_ok=True)
        
        self.img_height = 224
        self.img_width = 224
        self.batch_size = 32
        self.epochs = 20  # Adjust based on your needs
        
        print("=" * 70)
        print("🤖 CUSTOM ANIMAL MODEL TRAINER")
        print("=" * 70)
        print(f"📁 Dataset: {self.dataset_path}")
        print(f"💾 Save location: {self.model_save_path}")
        print(f"🖼️  Image size: {self.img_height}x{self.img_width}")
        print(f"📦 Batch size: {self.batch_size}")
        print(f"🔄 Epochs: {self.epochs}")
        print("=" * 70)
    
    def prepare_data(self):
        """Prepare training and validation datasets"""
        print("\n📊 Preparing datasets...")
        
        # Data augmentation for training
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest',
            validation_split=0.2  # 80% train, 20% validation
        )
        
        # Load training data
        self.train_generator = train_datagen.flow_from_directory(
            self.dataset_path,
            target_size=(self.img_height, self.img_width),
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='training',
            shuffle=True
        )
        
        # Load validation data
        self.validation_generator = train_datagen.flow_from_directory(
            self.dataset_path,
            target_size=(self.img_height, self.img_width),
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
        
        self.num_classes = len(self.train_generator.class_indices)
        self.class_names = list(self.train_generator.class_indices.keys())
        
        print(f"✅ Found {self.num_classes} animal categories")
        print(f"📈 Training samples: {self.train_generator.samples}")
        print(f"📉 Validation samples: {self.validation_generator.samples}")
        
        # Save class names
        class_mapping_path = self.model_save_path / "class_names.json"
        with open(class_mapping_path, 'w') as f:
            json.dump(self.class_names, f, indent=2)
        print(f"💾 Saved class mapping to: {class_mapping_path}")
    
    def build_model(self, base_model_type='mobilenet'):
        """Build model with transfer learning"""
        print(f"\n🏗️  Building model with {base_model_type.upper()} backbone...")
        
        # Choose base model
        if base_model_type == 'mobilenet':
            base_model = MobileNetV2(
                input_shape=(self.img_height, self.img_width, 3),
                include_top=False,
                weights='imagenet'
            )
        elif base_model_type == 'efficientnet':
            base_model = EfficientNetB0(
                input_shape=(self.img_height, self.img_width, 3),
                include_top=False,
                weights='imagenet'
            )
        
        # Freeze base model initially
        base_model.trainable = False
        
        # Build complete model
        inputs = keras.Input(shape=(self.img_height, self.img_width, 3))
        x = base_model(inputs, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dense(512, activation='relu')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax')(x)
        
        self.model = keras.Model(inputs, outputs)
        
        # Compile model
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_k_categorical_accuracy']
        )
        
        print(f"✅ Model built successfully!")
        print(f"📊 Total parameters: {self.model.count_params():,}")
        print(f"🎯 Output classes: {self.num_classes}")
    
    def train(self):
        """Train the model"""
        print("\n🚀 Starting training...\n")
        
        # Callbacks
        callbacks = [
            keras.callbacks.ModelCheckpoint(
                self.model_save_path / "best_model.keras",
                save_best_only=True,
                monitor='val_accuracy',
                mode='max',
                verbose=1
            ),
            keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=5,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=1e-7,
                verbose=1
            )
        ]
        
        # Train
        history = self.model.fit(
            self.train_generator,
            epochs=self.epochs,
            validation_data=self.validation_generator,
            callbacks=callbacks,
            verbose=1
        )
        
        # Save final model
        final_model_path = self.model_save_path / f"animal_model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.keras"
        self.model.save(final_model_path)
        print(f"\n💾 Final model saved to: {final_model_path}")
        
        # Save training history
        history_path = self.model_save_path / "training_history.json"
        with open(history_path, 'w') as f:
            json.dump({
                'accuracy': [float(x) for x in history.history['accuracy']],
                'val_accuracy': [float(x) for x in history.history['val_accuracy']],
                'loss': [float(x) for x in history.history['loss']],
                'val_loss': [float(x) for x in history.history['val_loss']],
            }, f, indent=2)
        
        print(f"📊 Training history saved to: {history_path}")
        
        return history
    
    def evaluate(self):
        """Evaluate model on validation set"""
        print("\n📈 Evaluating model...")
        
        results = self.model.evaluate(self.validation_generator, verbose=1)
        
        print("\n" + "=" * 70)
        print("🎯 FINAL RESULTS")
        print("=" * 70)
        print(f"Validation Loss: {results[0]:.4f}")
        print(f"Validation Accuracy: {results[1]*100:.2f}%")
        print(f"Top-5 Accuracy: {results[2]*100:.2f}%")
        print("=" * 70)
        
        # Save evaluation results
        eval_path = self.model_save_path / "evaluation_results.json"
        with open(eval_path, 'w') as f:
            json.dump({
                'validation_loss': float(results[0]),
                'validation_accuracy': float(results[1]),
                'top5_accuracy': float(results[2]),
                'num_classes': self.num_classes,
                'training_samples': self.train_generator.samples,
                'validation_samples': self.validation_generator.samples,
            }, f, indent=2)
        
        return results

def main():
    # Paths
    dataset_path = Path(__file__).parent.parent / "datasets" / "animal_dataset_90"
    model_save_path = Path(__file__).parent / "trained_models"
    
    if not dataset_path.exists():
        print("❌ Dataset not found!")
        print(f"📁 Expected location: {dataset_path}")
        print("\n💡 Run download_kaggle_dataset.py first!")
        return
    
    # Initialize trainer
    trainer = CustomAnimalModelTrainer(dataset_path, model_save_path)
    
    # Prepare data
    trainer.prepare_data()
    
    # Build model
    trainer.build_model(base_model_type='mobilenet')  # or 'efficientnet'
    
    # Train
    print("\n" + "=" * 70)
    print("🚀 STARTING TRAINING NOW...")
    print("=" * 70)
    # print("This may take 30-60 minutes depending on your hardware.")
    # print("Press Ctrl+C to cancel...")
    # print("=" * 70)
    
    # import time
    # time.sleep(5)
    
    history = trainer.train()
    
    # Evaluate
    trainer.evaluate()
    
    print("\n✅ Training complete!")
    print(f"📁 Models saved to: {model_save_path}")
    print("\n🎯 Next steps:")
    print("   1. Update tensorflow_service_db.py to use custom model")
    print("   2. Test with: python test_custom_model.py")

if __name__ == "__main__":
    main()
