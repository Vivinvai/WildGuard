"""
Download sample training images from public datasets
Uses iNaturalist and other open-source wildlife datasets
"""

import requests
import os
from pathlib import Path
import json

# Sample image URLs for each category (from Wikimedia Commons and public datasets)
SAMPLE_IMAGES = {
    'tiger': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Tiger.50.jpg/800px-Tiger.50.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/800px-Walking_tiger_female.jpg',
    ],
    'elephant': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/800px-African_Bush_Elephant.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Asian_elephant_-_melbourne_zoo.jpg/800px-Asian_elephant_-_melbourne_zoo.jpg',
    ],
    'leopard': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/African_leopard_male_%28cropped%29.jpg/800px-African_leopard_male_%28cropped%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Leopard_africa.jpg/800px-Leopard_africa.jpg',
    ],
    'sloth_bear': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sloth_Bear_Washington_DC.JPG/800px-Sloth_Bear_Washington_DC.JPG',
    ],
    'wild_boar': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sus_scrofa_scrofa.jpg/800px-Sus_scrofa_scrofa.jpg',
    ],
}

def download_image(url, save_path):
    """Download image from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"  ❌ Failed to download {url}: {e}")
        return False

def download_sample_data():
    """Download sample images for training"""
    print("="*60)
    print("Downloading Sample Training Images")
    print("="*60)
    print("\n⚠️  NOTE: These are just sample images to demonstrate training.")
    print("For production, you need:")
    print("  - 100-500+ images per animal category")
    print("  - Diverse angles, lighting, and habitats")
    print("  - Karnataka-specific wildlife images\n")
    
    base_dir = Path('training_data')
    base_dir.mkdir(exist_ok=True)
    
    total_downloaded = 0
    
    for category, urls in SAMPLE_IMAGES.items():
        category_dir = base_dir / category
        category_dir.mkdir(exist_ok=True)
        
        print(f"\n📁 {category}:")
        
        for i, url in enumerate(urls, 1):
            filename = f"{category}_{i}.jpg"
            save_path = category_dir / filename
            
            if save_path.exists():
                print(f"  ✓ {filename} (already exists)")
                total_downloaded += 1
            else:
                print(f"  ⬇️  Downloading {filename}...")
                if download_image(url, save_path):
                    print(f"  ✅ {filename}")
                    total_downloaded += 1
    
    print("\n" + "="*60)
    print(f"✅ Downloaded {total_downloaded} sample images")
    print("="*60)
    print("\nDirectory structure created:")
    print(f"  {base_dir}/")
    for category in SAMPLE_IMAGES.keys():
        print(f"    {category}/")
    
    print("\n⚠️  IMPORTANT:")
    print("These sample images are ONLY for demonstration.")
    print("\nTo train a production-quality model:")
    print("1. Collect 100-500+ images per category")
    print("2. Use high-quality Karnataka wildlife images")
    print("3. Include diverse poses, angles, lighting")
    print("4. Add more categories from Karnataka wildlife")
    print("\nRecommended sources:")
    print("  - iNaturalist.org")
    print("  - Wikimedia Commons")
    print("  - Karnataka Forest Department")
    print("  - Wildlife photographers (with permission)")
    print("\nOnce you have proper training data:")
    print("  python train_model.py")

if __name__ == '__main__':
    download_sample_data()
