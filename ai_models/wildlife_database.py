"""
PostgreSQL Wildlife Database Integration
Enriches TensorFlow results with comprehensive PostgreSQL data
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os

class WildlifeDatabase:
    def __init__(self):
        # Try multiple connection strategies
        self.conn = None
        connection_attempts = [
            "postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB",  # Correct from .env + exact case
            "postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db",
            "postgresql://postgres:pokemon1234@localhost:5432/WILDGUARD_DATABASE",
            os.getenv('DATABASE_URL'),
            "postgresql://postgres:postgres@localhost:5432/wildguard"
        ]
        
        for db_url in connection_attempts:
            if db_url:
                try:
                    self.conn = psycopg2.connect(db_url)
                    print(f"✅ Connected to PostgreSQL database")
                    break
                except Exception as e:
                    print(f"⚠️ Connection attempt failed: {e}")
                    continue
        
        if not self.conn:
            print("⚠️ PostgreSQL not available - using fallback mode")
    
    def enrich_identification(self, species_name, tf_data):
        """
        Enrich TensorFlow result with PostgreSQL database information
        Returns complete data with conservation status, population, habitat, etc.
        """
        if not self.conn:
            return tf_data  # Return TensorFlow data if no DB
        
        try:
            cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            
            # Search for matching species (case-insensitive, partial match)
            query = """
                SELECT * FROM supported_animals 
                WHERE LOWER(species_name) LIKE LOWER(%s) 
                   OR LOWER(scientific_name) LIKE LOWER(%s)
                LIMIT 1
            """
            search_pattern = f"%{species_name}%"
            cursor.execute(query, (search_pattern, search_pattern))
            result = cursor.fetchone()
            
            if result:
                print(f"✅ Database match found: {result['species_name']}")
                # Merge TensorFlow + Database data
                return {
                    'species': result['species_name'],
                    'scientific_name': result['scientific_name'],
                    'category': result['category'],
                    'habitat': result['habitat'],
                    'conservation_status': result['conservation_status'],
                    'population': result['population'] or 'Data unavailable',
                    'threats': result['threats'],
                    'region': result['region'],
                    'description': result['description'],
                    'confidence': tf_data.get('confidence', 0.0),
                    'database_enhanced': True,
                    'source': 'PostgreSQL Database + TensorFlow'
                }
            else:
                print(f"⚠️ No database match for: {species_name}")
                return tf_data
        
        except Exception as e:
            print(f"⚠️ Database query error: {e}")
            return tf_data
    
    def get_animal_by_name(self, species_name):
        """Get animal directly by name"""
        if not self.conn:
            return None
        
        try:
            cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            query = """
                SELECT * FROM supported_animals 
                WHERE LOWER(species_name) = LOWER(%s)
                LIMIT 1
            """
            cursor.execute(query, (species_name,))
            return cursor.fetchone()
        except Exception as e:
            print(f"⚠️ Database error: {e}")
            return None
    
    def search_animals(self, query_text, limit=5):
        """Search for animals matching query"""
        if not self.conn:
            return []
        
        try:
            cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            search_query = """
                SELECT * FROM supported_animals 
                WHERE LOWER(species_name) LIKE LOWER(%s) 
                   OR LOWER(scientific_name) LIKE LOWER(%s)
                   OR LOWER(category) LIKE LOWER(%s)
                LIMIT %s
            """
            search_pattern = f"%{query_text}%"
            cursor.execute(search_query, (search_pattern, search_pattern, search_pattern, limit))
            return cursor.fetchall()
        except Exception as e:
            print(f"⚠️ Search error: {e}")
            return []
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()

# Global database instance
wildlife_db = WildlifeDatabase()
