"""
Local Wildlife Chat AI Service
Uses custom-trained neural network for wildlife conservation Q&A
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
import pickle
import os

class WildlifeChatAI:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.answer_mapping = None
        self.loaded = False
        
    def load_model(self):
        """Load the trained model and artifacts"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), 'wildlife_chat_model.keras')
            vectorizer_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')
            mapping_path = os.path.join(os.path.dirname(__file__), 'answer_mapping.pkl')
            
            if not all(os.path.exists(p) for p in [model_path, vectorizer_path, mapping_path]):
                print("⚠️ Chat model not found. Please run train_chat_model.py first.")
                return False
            
            print("📦 Loading wildlife chat model...")
            self.model = keras.models.load_model(model_path)
            
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            
            with open(mapping_path, 'rb') as f:
                self.answer_mapping = pickle.load(f)
            
            self.loaded = True
            print("✅ Wildlife chat model loaded successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error loading chat model: {e}")
            return False
    
    def get_response(self, question: str, confidence_threshold: float = 0.3) -> dict:
        """
        Get response for a question
        
        Args:
            question: User's question
            confidence_threshold: Minimum confidence to return answer (0-1)
            
        Returns:
            dict with 'answer' and 'confidence' keys
        """
        if not self.loaded:
            if not self.load_model():
                return {
                    'answer': None,
                    'confidence': 0.0,
                    'error': 'Model not available'
                }
        
        try:
            # Vectorize question
            X = self.vectorizer.transform([question]).toarray()
            
            # Predict
            predictions = self.model.predict(X, verbose=0)
            pred_idx = np.argmax(predictions)
            confidence = float(np.max(predictions))
            
            # Return answer if confidence is high enough
            if confidence >= confidence_threshold:
                return {
                    'answer': self.answer_mapping[pred_idx],
                    'confidence': confidence
                }
            else:
                return {
                    'answer': None,
                    'confidence': confidence,
                    'error': 'Low confidence'
                }
                
        except Exception as e:
            return {
                'answer': None,
                'confidence': 0.0,
                'error': str(e)
            }

# Global instance
chat_ai = WildlifeChatAI()

def get_local_chat_response(question: str) -> str:
    """
    Get chat response from local AI model
    
    Args:
        question: User's question
        
    Returns:
        Answer string or None if not confident enough
    """
    result = chat_ai.get_response(question, confidence_threshold=0.3)
    
    if result['answer']:
        print(f"✅ Local AI response (confidence: {result['confidence']*100:.1f}%)")
        return result['answer']
    else:
        print(f"⚠️ Local AI low confidence ({result.get('confidence', 0)*100:.1f}%)")
        return None

def is_local_chat_available() -> bool:
    """Check if local chat AI is available"""
    if not chat_ai.loaded:
        chat_ai.load_model()
    return chat_ai.loaded
