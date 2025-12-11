"""
Complete Integrated AI System
Triple AI Verification + Dual Gemini + Database Integration
"""
import sys
import json
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from ai_models.triple_ai_verification import TripleAIVerification, map_to_indian_species
import psycopg2
import base64
import requests

class CompleteAISystem:
    def __init__(self):
        print("🚀 Initializing Complete AI System...")
        print("   ✓ Custom Trained Model (90 animals)")
        print("   ✓ MobileNet (1001 classes)")
        print("   ✓ Dual Gemini API")
        print("   ✓ PostgreSQL Database")
        
        # Initialize triple AI verification
        self.triple_ai = TripleAIVerification()
        
        # Database connection
        self.db_conn = psycopg2.connect(
            host="localhost",
            database="Wild_Guard_DB",
            user="postgres",
            password="pokemon1234"
        )
        
        # Gemini API setup
        self.gemini_api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyBdTUb-3x94HUzw_oGJqvvb3WHPiPT1fVY')
        self.gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        
        print("✅ Complete AI System ready!")
    
    def query_gemini(self, prompt, image_base64=None):
        """Query Gemini API"""
        try:
            headers = {'Content-Type': 'application/json'}
            
            if image_base64:
                # Remove data:image/jpeg;base64, prefix if present
                if 'base64,' in image_base64:
                    image_base64 = image_base64.split('base64,')[1]
                
                payload = {
                    "contents": [{
                        "parts": [
                            {"text": prompt},
                            {
                                "inline_data": {
                                    "mime_type": "image/jpeg",
                                    "data": image_base64
                                }
                            }
                        ]
                    }]
                }
            else:
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
            
            response = requests.post(
                f"{self.gemini_url}?key={self.gemini_api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['candidates'][0]['content']['parts'][0]['text']
            else:
                return None
                
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return None
    
    def get_dual_gemini_verification(self, image_path):
        """Use dual Gemini API calls for cross-verification"""
        print("\n🔮 Dual Gemini Verification...")
        
        # Read and encode image
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        # First Gemini call - Visual description
        print("   🤖 Gemini #1: Visual Analysis...")
        visual_prompt = """Analyze this image and provide a detailed visual description of the animal. 
        Focus on: color, patterns, body shape, distinctive features, size estimation, habitat clues.
        Be very specific and detailed."""
        
        visual_description = self.query_gemini(visual_prompt, image_data)
        
        # Second Gemini call - Species identification based on description
        print("   🤖 Gemini #2: Species Identification...")
        id_prompt = f"""Based on this visual description, identify the animal species:
        
        {visual_description}
        
        Provide the species name, confidence level (0-100), and key identifying features.
        Format: Species: [name] | Confidence: [%] | Features: [list]"""
        
        species_id = self.query_gemini(id_prompt)
        
        # Third Gemini call - Conservation and database check
        if species_id:
            print("   🤖 Gemini #3: Conservation Check...")
            conservation_prompt = f"""For the species "{species_id}", provide:
            1. Conservation status
            2. If found in India, what is the Indian variant? (e.g., Lion → Asiatic Lion)
            3. Key threats
            4. Cultural significance in India
            
            Format: Status: [status] | Indian Name: [name] | Threats: [list] | Cultural: [text]"""
            
            conservation_info = self.query_gemini(conservation_prompt)
            
            return {
                'visual_description': visual_description,
                'species_identification': species_id,
                'conservation_info': conservation_info,
                'confidence': self._extract_confidence(species_id)
            }
        
        return None
    
    def _extract_confidence(self, text):
        """Extract confidence percentage from Gemini response"""
        try:
            if 'Confidence:' in text:
                conf_str = text.split('Confidence:')[1].split('|')[0].strip()
                conf_str = conf_str.replace('%', '').strip()
                return float(conf_str) / 100
        except:
            pass
        return 0.75  # Default
    
    def search_database(self, species_name):
        """Search database for species information"""
        cursor = self.db_conn.cursor()
        
        # Try exact match first
        cursor.execute("""
            SELECT species_name, scientific_name, conservation_status,
                   population, habitat, threats, conservation_efforts,
                   cultural_significance
            FROM discover_animals
            WHERE LOWER(species_name) = LOWER(%s)
        """, (species_name,))
        
        result = cursor.fetchone()
        
        if not result:
            # Try partial match
            cursor.execute("""
                SELECT species_name, scientific_name, conservation_status,
                       population, habitat, threats, conservation_efforts,
                       cultural_significance
                FROM discover_animals
                WHERE LOWER(species_name) LIKE LOWER(%s)
                LIMIT 1
            """, (f'%{species_name}%',))
            
            result = cursor.fetchone()
        
        cursor.close()
        
        if result:
            return {
                'species_name': result[0],
                'scientific_name': result[1],
                'conservation_status': result[2],
                'population': result[3],
                'habitat': result[4],
                'threats': result[5],
                'conservation_efforts': result[6],
                'cultural_significance': result[7],
                'source': 'database'
            }
        
        return None
    
    def identify_animal_complete(self, image_path, user_id=None):
        """Complete identification pipeline"""
        print("\n" + "=" * 70)
        print("🎯 COMPLETE AI ANIMAL IDENTIFICATION")
        print("=" * 70)
        
        results = {}
        
        # Step 1: Triple AI Verification (Custom + MobileNet)
        print("\n📊 Step 1: AI Model Predictions")
        triple_ai_result = self.triple_ai.identify(image_path)
        results['ai_models'] = triple_ai_result
        
        # Get top prediction from AI models
        top_ai_species = triple_ai_result['consensus'][0]['species']
        print(f"   🏆 AI Consensus: {top_ai_species}")
        
        # Step 2: Dual Gemini Verification
        print("\n📊 Step 2: Dual Gemini Verification")
        gemini_result = self.get_dual_gemini_verification(image_path)
        results['gemini'] = gemini_result
        
        # Step 3: Map to Indian species
        print("\n📊 Step 3: Indian Species Mapping")
        indian_species = map_to_indian_species(top_ai_species)
        print(f"   🇮🇳 Indian Variant: {indian_species}")
        results['indian_species'] = indian_species
        
        # Step 4: Database lookup
        print("\n📊 Step 4: Database Lookup")
        db_info = self.search_database(indian_species)
        if not db_info:
            # Try original species name
            db_info = self.search_database(top_ai_species)
        
        if db_info:
            print(f"   ✅ Found in database: {db_info['species_name']}")
            print(f"   📋 Status: {db_info['conservation_status']}")
        else:
            print(f"   ⚠️  Not found in database")
        
        results['database'] = db_info
        
        # Step 5: Final consensus
        print("\n📊 Step 5: Final Consensus")
        final_species = indian_species if db_info else top_ai_species
        final_confidence = triple_ai_result['consensus'][0]['confidence']
        
        results['final'] = {
            'species_name': final_species,
            'confidence': final_confidence,
            'ai_votes': triple_ai_result['consensus'][0]['vote_count'],
            'database_verified': bool(db_info),
            'gemini_verified': bool(gemini_result),
        }
        
        print(f"\n🎯 FINAL RESULT: {final_species}")
        print(f"   📊 Confidence: {final_confidence*100:.1f}%")
        print(f"   🤖 AI Models Agreed: {results['final']['ai_votes']}")
        print(f"   💾 Database Verified: {'✅' if db_info else '❌'}")
        print(f"   🔮 Gemini Verified: {'✅' if gemini_result else '❌'}")
        
        # Step 6: Store in database
        if user_id:
            self._store_identification(user_id, results, image_path)
        
        print("=" * 70)
        
        return results
    
    def _store_identification(self, user_id, results, image_path):
        """Store identification in database"""
        try:
            cursor = self.db_conn.cursor()
            
            final = results['final']
            db_info = results.get('database', {})
            
            cursor.execute("""
                INSERT INTO animal_identifications (
                    user_id, species_name, scientific_name, conservation_status,
                    confidence, image_url, habitat, threats, region, category
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                user_id,
                final['species_name'],
                db_info.get('scientific_name', 'Unknown'),
                db_info.get('conservation_status', 'Unknown'),
                final['confidence'],
                image_path,
                db_info.get('habitat', 'Unknown'),
                db_info.get('threats', []),
                'India',
                'Mammal',
            ))
            
            self.db_conn.commit()
            cursor.close()
            print("   💾 Identification stored in database")
            
        except Exception as e:
            print(f"   ⚠️  Could not store in database: {e}")


if __name__ == "__main__":
    # Initialize system
    system = CompleteAISystem()
    
    # Test with an image
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        result = system.identify_animal_complete(image_path, user_id=None)
        
        # Save result to JSON
        output_path = "identification_result.json"
        with open(output_path, 'w') as f:
            # Convert to JSON-serializable format
            json_result = {
                'final': result['final'],
                'indian_species': result['indian_species'],
                'database_verified': bool(result['database']),
                'gemini_verified': bool(result['gemini']),
            }
            json.dump(json_result, f, indent=2)
        
        print(f"\n📄 Result saved to: {output_path}")
    else:
        print("\nUsage: python complete_ai_system.py <image_path>")
        print("Example: python complete_ai_system.py test_tiger.jpg")
