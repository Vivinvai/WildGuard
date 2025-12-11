"""
Fine-tune TensorFlow model for Karnataka Wildlife
Uses transfer learning with MobileNetV2 as base
"""

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import json
import os
from pathlib import Path

# Karnataka Wildlife Categories
KARNATAKA_ANIMALS = [
    'tiger',
    'elephant',
    'leopard',
    'sloth_bear',
    'gaur',
    'wild_boar',
    'spotted_deer',
    'sambar_deer',
    'bonnet_macaque',
    'gray_langur',
    'indian_peafowl',
    'king_cobra',
    'indian_python',
    'wild_dog',
    'jackal',
    'indian_fox',
    'blackbuck',
    'four_horned_antelope',
    'barking_deer',
    'indian_pangolin'
]

def create_model(num_classes):
    """Create transfer learning model with MobileNetV2"""
    print(f"Creating model for {num_classes} classes...")
    
    # Load pre-trained MobileNetV2
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Add custom classification layers
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])
    
    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, base_model

def prepare_training_data(data_dir):
    """Prepare training data from directory structure"""
    print(f"Loading training data from {data_dir}...")
    
    # Use ImageDataGenerator for data augmentation
    datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    train_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='sparse',
        subset='training'
    )
    
    validation_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='sparse',
        subset='validation'
    )
    
    return train_generator, validation_generator

def train_model(model, train_data, val_data, epochs=10):
    """Train the model"""
    print(f"Training model for {epochs} epochs...")
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=2,
            min_lr=0.00001
        ),
        tf.keras.callbacks.ModelCheckpoint(
            'models/karnataka_wildlife_best.h5',
            monitor='val_accuracy',
            save_best_only=True
        )
    ]
    
    # Train
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=epochs,
        callbacks=callbacks
    )
    
    return history

def fine_tune_model(model, base_model, train_data, val_data, epochs=5):
    """Fine-tune the base model layers"""
    print("Fine-tuning model...")
    
    # Unfreeze the base model
    base_model.trainable = True
    
    # Freeze all layers except the last 20
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Fine-tune
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=epochs,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=2,
                restore_best_weights=True
            )
        ]
    )
    
    return history

def save_model(model, class_names):
    """Save trained model and metadata"""
    print("Saving model...")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Save model
    model.save('models/karnataka_wildlife_model.h5')
    print("✅ Model saved to models/karnataka_wildlife_model.h5")
    
    # Save class names
    with open('models/class_names.json', 'w') as f:
        json.dump(class_names, f)
    print("✅ Class names saved to models/class_names.json")
    
    # Save as SavedModel format for TensorFlow Serving
    model.export('models/karnataka_wildlife_savedmodel')
    print("✅ SavedModel exported to models/karnataka_wildlife_savedmodel")

def create_sample_structure():
    """Create sample directory structure for training data"""
    print("\n" + "="*60)
    print("TRAINING DATA SETUP INSTRUCTIONS")
    print("="*60)
    print("\nTo train the model, organize your images like this:\n")
    print("training_data/")
    for animal in KARNATAKA_ANIMALS[:5]:
        print(f"  {animal}/")
        print(f"    image1.jpg")
        print(f"    image2.jpg")
        print(f"    ...")
    print("  ...")
    print(f"\nTotal categories: {len(KARNATAKA_ANIMALS)}")
    print("\nRecommended:")
    print("  - Minimum 50-100 images per category")
    print("  - Mix of angles, lighting, distances")
    print("  - High quality, clear images")
    print("  - Various habitats and seasons")
    print("\n" + "="*60)

if __name__ == '__main__':
    print("="*60)
    print("Karnataka Wildlife Model Training")
    print("="*60)
    print(f"TensorFlow Version: {tf.__version__}")
    print(f"Number of classes: {len(KARNATAKA_ANIMALS)}")
    print("="*60 + "\n")
    
    # Check if training data exists
    data_dir = 'training_data'
    
    if not os.path.exists(data_dir):
        print(f"⚠️  Training data directory '{data_dir}' not found!")
        create_sample_structure()
        print("\nTo start training:")
        print("1. Create the training_data directory")
        print("2. Add subdirectories for each animal species")
        print("3. Add training images to each subdirectory")
        print("4. Run this script again")
        exit(0)
    
    # Check if there are subdirectories
    subdirs = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
    if len(subdirs) == 0:
        print(f"⚠️  No animal categories found in '{data_dir}'!")
        create_sample_structure()
        exit(0)
    
    print(f"✅ Found {len(subdirs)} animal categories")
    print(f"Categories: {', '.join(subdirs)}\n")
    
    # Prepare data
    train_data, val_data = prepare_training_data(data_dir)
    
    # Create model
    num_classes = len(subdirs)
    model, base_model = create_model(num_classes)
    
    print("\nModel Architecture:")
    model.summary()
    
    # Initial training with frozen base
    print("\n" + "="*60)
    print("Phase 1: Training with frozen base model")
    print("="*60)
    history1 = train_model(model, train_data, val_data, epochs=10)
    
    # Fine-tuning
    print("\n" + "="*60)
    print("Phase 2: Fine-tuning")
    print("="*60)
    history2 = fine_tune_model(model, base_model, train_data, val_data, epochs=5)
    
    # Save model
    print("\n" + "="*60)
    print("Saving Model")
    print("="*60)
    save_model(model, train_data.class_indices)
    
    # Final evaluation
    print("\n" + "="*60)
    print("Final Evaluation")
    print("="*60)
    loss, accuracy = model.evaluate(val_data)
    print(f"Validation Loss: {loss:.4f}")
    print(f"Validation Accuracy: {accuracy:.4f}")
    
    print("\n" + "="*60)
    print("Training Complete! 🎉")
    print("="*60)
    print("\nNext steps:")
    print("1. Test the model with: python test_model.py")
    print("2. Update tensorflow_service.py to use the new model")
    print("3. Restart the AI service")
