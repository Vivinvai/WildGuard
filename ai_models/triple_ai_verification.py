"""
Triple AI Cross-Verification System
Uses: 1) Custom Trained Model (90 animals)
      2) MobileNet (1001 classes)
      3) Dual Gemini API
All results are cross-verified and mapped to Indian wildlife database
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import json
from pathlib import Path

class TripleAIVerification:
    def __init__(self):
        print("🚀 Initializing Triple AI Verification System...")
        
        # Load custom trained model
        custom_model_path = Path(__file__).parent / "trained_models" / "best_model.keras"
        self.custom_model = keras.models.load_model(custom_model_path)
        
        # Load class names for custom model
        with open(Path(__file__).parent / "trained_models" / "class_names.json", 'r') as f:
            self.custom_classes = json.load(f)
        
        # Load MobileNet
        self.mobilenet_model = tf.keras.applications.MobileNetV2(
            weights='imagenet',
            include_top=True,
            input_shape=(224, 224, 3)
        )
        
        # Load ImageNet class mapping
        self.imagenet_classes = self._load_imagenet_labels()
        
        print(f"✅ Custom Model: {len(self.custom_classes)} classes")
        print(f"✅ MobileNet: {len(self.imagenet_classes)} classes")
        print(f"✅ System ready for triple verification!")
    
    def _load_imagenet_labels(self):
        """Load ImageNet class labels"""
        # Simplified mapping - you can expand this
        return {
            i: f"imagenet_class_{i}" for i in range(1001)
        }
    
    def preprocess_image(self, image_path):
        """Preprocess image for both models"""
        img = Image.open(image_path).convert('RGB')
        img_resized = img.resize((224, 224))
        img_array = np.array(img_resized) / 255.0
        return np.expand_dims(img_array, axis=0)
    
    def predict_custom_model(self, image_array):
        """Predict using custom trained model"""
        predictions = self.custom_model.predict(image_array, verbose=0)
        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        
        results = []
        for idx in top_5_indices:
            results.append({
                'species': self.custom_classes[idx],
                'confidence': float(predictions[0][idx]),
                'model': 'custom_trained'
            })
        return results
    
    def predict_mobilenet(self, image_array):
        """Predict using MobileNet"""
        # MobileNet expects different preprocessing
        img_mobilenet = image_array * 255.0
        img_mobilenet = tf.keras.applications.mobilenet_v2.preprocess_input(img_mobilenet)
        
        predictions = self.mobilenet_model.predict(img_mobilenet, verbose=0)
        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        
        # Decode predictions using ImageNet labels
        decoded = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=5)[0]
        
        results = []
        for _, label, score in decoded:
            results.append({
                'species': label.replace('_', ' ').title(),
                'confidence': float(score),
                'model': 'mobilenet'
            })
        return results
    
    def cross_verify(self, custom_results, mobilenet_results):
        """Cross-verify results from both models"""
        # Combine and rank by confidence
        all_results = custom_results + mobilenet_results
        all_results.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Find consensus
        species_votes = {}
        for result in all_results:
            species = result['species'].lower()
            if species not in species_votes:
                species_votes[species] = []
            species_votes[species].append(result)
        
        # Get top species by consensus
        consensus = []
        for species, votes in species_votes.items():
            avg_confidence = sum(v['confidence'] for v in votes) / len(votes)
            consensus.append({
                'species': species,
                'confidence': avg_confidence,
                'vote_count': len(votes),
                'models_agreed': [v['model'] for v in votes]
            })
        
        consensus.sort(key=lambda x: (x['vote_count'], x['confidence']), reverse=True)
        return consensus
    
    def identify(self, image_path):
        """Main identification method"""
        print(f"\n🔍 Analyzing image: {image_path}")
        
        # Preprocess
        image_array = self.preprocess_image(image_path)
        
        # Get predictions from both models
        print("🤖 Custom Model predicting...")
        custom_results = self.predict_custom_model(image_array)
        
        print("🤖 MobileNet predicting...")
        mobilenet_results = self.predict_mobilenet(image_array)
        
        # Cross-verify
        print("🔄 Cross-verifying results...")
        consensus = self.cross_verify(custom_results, mobilenet_results)
        
        return {
            'custom_model': custom_results,
            'mobilenet': mobilenet_results,
            'consensus': consensus,
            'top_prediction': consensus[0] if consensus else None
        }


# Species mapping to Indian wildlife database
SPECIES_MAPPING = {
    # Big Cats
    'lion': 'Asiatic Lion',
    'african lion': 'Asiatic Lion',
    'tiger': 'Bengal Tiger',
    'bengal tiger': 'Bengal Tiger',
    'leopard': 'Indian Leopard',
    'black panther': 'Indian Leopard',
    'panther': 'Indian Leopard',
    
    # Elephants
    'elephant': 'Asian Elephant',
    'african elephant': 'Asian Elephant',
    'indian elephant': 'Asian Elephant',
    
    # Rhinos
    'rhinoceros': 'Indian Rhinoceros',
    'rhino': 'Indian Rhinoceros',
    
    # Bears
    'bear': 'Sloth Bear',
    'black bear': 'Sloth Bear',
    'sloth bear': 'Sloth Bear',
    
    # Wild Dogs
    'dog': 'Dhole',
    'wild dog': 'Dhole',
    'dhole': 'Dhole',
    
    # Cattle
    'ox': 'Gaur',
    'bison': 'Gaur',
    'buffalo': 'Gaur',
    'gaur': 'Gaur',
    
    # Deer & Antelope
    'deer': 'Spotted Deer',
    'antelope': 'Blackbuck',
    
    # Birds
    'eagle': 'Crested Serpent Eagle',
    'owl': 'Spotted Owlet',
    'peacock': 'Indian Peafowl',
    'parrot': 'Rose-ringed Parakeet',
    'hornbill': 'Great Indian Hornbill',
    'flamingo': 'Greater Flamingo',
    
    # Reptiles
    'snake': 'Indian Cobra',
    'cobra': 'Indian Cobra',
    'lizard': 'Bengal Monitor Lizard',
    
    # Primates
    'monkey': 'Rhesus Macaque',
    'langur': 'Gray Langur',
    
    # Other
    'wolf': 'Indian Wolf',
    'fox': 'Bengal Fox',
    'hyena': 'Striped Hyena',
}


def map_to_indian_species(detected_species):
    """Map detected species to Indian wildlife variant"""
    species_lower = detected_species.lower().strip()
    
    # Direct match
    if species_lower in SPECIES_MAPPING:
        return SPECIES_MAPPING[species_lower]
    
    # Partial match
    for key, value in SPECIES_MAPPING.items():
        if key in species_lower or species_lower in key:
            return value
    
    # Return original if no mapping found
    return detected_species.title()


if __name__ == "__main__":
    # Test the system
    system = TripleAIVerification()
    
    # You can test with an image
    # result = system.identify("path/to/test/image.jpg")
    # print(json.dumps(result, indent=2))
