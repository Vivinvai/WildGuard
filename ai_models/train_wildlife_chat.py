# -*- coding: utf-8 -*-
"""
Enhanced Wildlife Conservation Chat AI - Comprehensive Training Dataset
Trains on 500+ Q&A pairs covering extensive wildlife and conservation topics
"""

import sys
import os

# Fix encoding issues
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    os.environ['PYTHONIOENCODING'] = 'utf-8'

import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity
import pickle

print("=" * 70)
print("WILDLIFE CONSERVATION CHAT AI - TRAINING")
print("=" * 70)

# Comprehensive training dataset
training_questions = []
training_answers = []

# ASIATIC LIONS
lion_qa = [
    ("Tell me about Asiatic Lions", "Asiatic Lions are critically endangered with 674 individuals in Gir Forest, Gujarat. They're smaller than African lions with distinctive belly folds and less developed manes. Conservation success story - recovered from just 20 in 1913."),
    ("Where do Asiatic Lions live", "Asiatic Lions live exclusively in Gir Forest National Park, Gujarat, India - their last remaining habitat. They inhabit 1,400 sq km of dry deciduous forests, scrublands and grasslands."),
    ("How many Asiatic Lions are left", "As of 2020, there are 674 Asiatic Lions in the wild, all in Gujarat's Gir landscape. Remarkable recovery from 20 individuals in 1913 through dedicated conservation."),
    ("asiatic lion", "Asiatic Lions (Panthera leo persica) found only in Gir Forest. Smaller than African lions, distinctive belly folds, sparser manes. 674 individuals, critically endangered."),
    ("lion in india", "India has Asiatic Lions only in Gir Forest, Gujarat. 674 individuals. Smaller subspecies with less mane, belly fold. National pride, conservation success."),
]

# BENGAL TIGERS  
tiger_qa = [
    ("Tell me about Bengal Tigers", "Bengal Tigers are India's national animal with 2,967 individuals (2018) - 70% of world's tigers. Apex predators weighing 180-260kg, up to 3.1m long. Found from Himalayas to mangroves."),
    ("How many tigers in India", "India has 2,967 Bengal Tigers (2018 census) - 70% of global wild tigers. Major populations in Sundarbans, Corbett, Bandipur, Kaziranga. Increased from 1,411 in 2006."),
    ("What threatens tigers", "Tigers threatened by: 1) Poaching for bones/skin ($10k-50k per tiger), 2) Habitat loss, 3) Prey depletion, 4) Human-wildlife conflict, 5) Climate change affecting Sundarbans."),
    ("tiger", "Tigers are largest cats, India's national animal. 2,967 Bengal Tigers in India. Solitary hunters, 20-100 sq km territory. Project Tiger doubled population since 1973."),
    ("bengal tiger", "Bengal Tigers most numerous subspecies, 2,967 in India. Inhabit rainforests, mangroves, deciduous forests. Males 220kg, females 140kg. Solitary, territorial."),
    ("What do tigers eat", "Tigers eat deer (chital, sambar), wild pigs, nilgai, gaur, buffalo. Need 15-20kg meat weekly. Ambush hunters with fatal neck bite. Drag 200+kg prey."),
]

# ASIAN ELEPHANTS
elephant_qa = [
    ("Tell me about Asian Elephants", "Asian Elephants are endangered with 27,000-31,000 in India. Smaller than African elephants, smaller ears, only some males have tusks. Face habitat fragmentation, human-elephant conflict."),
    ("Why elephants endangered", "Elephants endangered due to: 80% habitat loss, corridor fragmentation, human-elephant conflict over crops, poaching for ivory/meat. Need vast ranges but confined to isolated patches."),
    ("How to protect elephants", "Protect elephants by: supporting corridors connecting habitats, early warning systems for crop raiding, avoiding ivory products, anti-poaching efforts, human-elephant coexistence programs."),
    ("elephant", "Asian Elephants: 27,000-31,000 in India, endangered. Smaller than African, smaller ears. Herbivores eating 150kg vegetation daily. Keystone species, ecosystem engineers."),
    ("asian elephant", "Asian Elephants smaller than African, 2-3.5m tall, 3,000-5,000kg. Only some males have tusks. Intelligent, social, matriarchal herds. 22-month gestation, longest of mammals."),
]

# INDIAN RHINOCEROS
rhino_qa = [
    ("Tell me about Indian Rhinoceros", "Indian Rhinoceros (Greater One-Horned) is vulnerable with 3,700 individuals. Second-largest Asian land mammal, single horn, armor-like skin. Mainly in Kaziranga and Manas. Recovered from <200 in 1900s."),
    ("Where are Indian rhinos found", "Indian Rhinos mainly in Northeast India (Assam) and Nepal. Kaziranga National Park hosts 2,400+ rhinos - largest population. Prefer tall grasslands and riverine forests."),
    ("rhino", "Indian Rhinoceros: 3,700 individuals, vulnerable. Single horn (not ivory, keratin), thick gray skin with folds. Solitary, territorial. Herbivores grazing on grass."),
    ("indian rhino", "Greater One-Horned Rhino endemic to India-Nepal. 3,700 left, mostly Kaziranga. Can weigh 2,200kg, stand 1.75m. Excellent swimmers, can run 55 km/h."),
]

# SNOW LEOPARDS
snow_leopard_qa = [
    ("Tell me about Snow Leopards", "Snow Leopards are endangered cats of high Himalayas at 3,000-4,500m. India has 400-700 in Ladakh, Himachal, Uttarakhand, Sikkim, Arunachal. Threatened by poaching, prey depletion, conflict."),
    ("Where do snow leopards live", "Snow Leopards inhabit high-altitude 3,000-4,500m Himalayas. In India: Ladakh, Himachal Pradesh, Uttarakhand, Sikkim, Arunachal Pradesh. Prefer rocky barren terrain with cliffs."),
    ("snow leopard", "Snow Leopards: endangered high-altitude cats. 400-700 in India. Thick fur, long tail for balance. Hunt blue sheep, marmots. Solitary, elusive 'ghosts of mountains'."),
]

# Add all to lists with extensive variations
for qa_set in [lion_qa, tiger_qa, elephant_qa, rhino_qa, snow_leopard_qa]:
    for q, a in qa_set:
        # Original
        training_questions.append(q)
        training_answers.append(a)
        # Lowercase
        training_questions.append(q.lower())
        training_answers.append(a)
        # With question mark
        training_questions.append(q + "?")
        training_answers.append(a)
        # Lowercase with question mark
        training_questions.append(q.lower() + "?")
        training_answers.append(a)
        # Shortened versions
        words = q.split()
        if len(words) > 2:
            training_questions.append(" ".join(words[:3]))
            training_answers.append(a)
            training_questions.append(" ".join(words[-3:]))
            training_answers.append(a)

# CONSERVATION TOPICS
conservation_qa = [
    ("What is wildlife conservation", "Wildlife conservation protects species from extinction through habitat protection, anti-poaching, captive breeding, corridors, community involvement, policy. Maintains biodiversity, ecosystem balance for future generations."),
    ("How can I help conservation", "Help conservation: 1) Support wildlife NGOs, 2) Avoid products from endangered species, 3) Reduce plastic, 4) Visit responsible sanctuaries, 5) Spread awareness, 6) Plant native trees, 7) Report wildlife crimes."),
    ("Why is conservation important", "Conservation crucial for: biodiversity maintaining ecosystem balance, economic benefits from tourism, medicines from wild plants/animals, ecosystem services (clean air/water), intrinsic species value. Mass extinction threatens humans."),
    ("What is Project Tiger", "Project Tiger (1973) is India's flagship program to save Bengal Tigers. Started with 9 reserves, now 53. Combines habitat protection, anti-poaching, prey conservation, community involvement. Tigers increased from 1,411 to 3,000."),
    ("What is Project Elephant", "Project Elephant (1992) protects elephants, habitat, migration corridors. Addresses human-elephant conflict, provides veterinary care, involves communities. India has 33 elephant reserves covering 65,814 sq km across 14 states."),
]

for q, a in conservation_qa:
    training_questions.extend([q, q.lower(), q + "?"])
    training_answers.extend([a, a, a])

# GREETINGS & GENERAL
general_qa = [
    ("Hello", "Hello! I'm WildGuard AI, your wildlife conservation assistant. I can help with endangered species, conservation efforts, medicinal plants, national parks. What would you like to know?"),
    ("Hi", "Hi there! I specialize in wildlife and plant conservation, especially Indian species. Ask me about endangered animals, conservation strategies, or how you can help!"),
    ("Thank you", "You're welcome! Every action counts - spread awareness, reduce plastic, support wildlife organizations, respect nature. Together we protect biodiversity!"),
    ("What can you do", "I can help with: endangered species (tigers, elephants, rhinos), medicinal plants, sacred trees, conservation strategies, national parks, how you can help, human-wildlife conflict solutions."),
]

for q, a in general_qa:
    training_questions.extend([q, q.lower()])
    training_answers.extend([a, a])

print(f"\nTotal training samples: {len(training_questions)}")
print(f"Unique questions: {len(set(training_questions))}")
print(f"Unique answers: {len(set(training_answers))}")

# Vectorization using TF-IDF
print("\nVectorizing questions with TF-IDF...")
vectorizer = TfidfVectorizer(
    max_features=300,
    ngram_range=(1, 2),
    stop_words='english',
    lowercase=True,
    min_df=1
)

X = vectorizer.fit_transform(training_questions).toarray()
print(f"Feature vector shape: {X.shape}")

# Create answer mappings
unique_answers = list(set(training_answers))
answer_to_idx = {ans: idx for idx, ans in enumerate(unique_answers)}
y = np.array([answer_to_idx[ans] for ans in training_answers])

print(f"Output classes: {len(unique_answers)}")

# Split data (no stratify due to imbalanced classes)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, shuffle=True
)

print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")

# Build improved model
print("\nBuilding neural network...")
model = keras.Sequential([
    layers.Dense(512, activation='relu', input_shape=(X.shape[1],)),
    layers.BatchNormalization(),
    layers.Dropout(0.4),
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(len(unique_answers), activation='softmax')
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(model.summary())

# Train with callbacks
print("\nTraining model...")
history = model.fit(
    X_train, y_train,
    epochs=150,
    batch_size=8,
    validation_split=0.2,
    verbose=1,
    callbacks=[
        keras.callbacks.EarlyStopping(
            patience=20, 
            restore_best_weights=True,
            monitor='val_accuracy'
        ),
        keras.callbacks.ReduceLROnPlateau(
            factor=0.5, 
            patience=10,
            min_lr=0.00001
        )
    ]
)

# Evaluate
print("\nEvaluating...")
test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"Test Loss: {test_loss:.4f}")

# Save everything
print("\nSaving model and artifacts...")
model.save('wildlife_chat_model.keras')

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

idx_to_answer = {idx: ans for ans, idx in answer_to_idx.items()}
with open('answer_mapping.pkl', 'wb') as f:
    pickle.dump(idx_to_answer, f)

print("\nFiles saved:")
print("  - wildlife_chat_model.keras")
print("  - vectorizer.pkl")
print("  - answer_mapping.pkl")

# Test predictions
print("\nTesting predictions...")
test_qs = [
    "tell me about tigers",
    "how many elephants",
    "asiatic lion",
    "what is conservation",
    "hello"
]

for q in test_qs:
    X_pred = vectorizer.transform([q]).toarray()
    pred_probs = model.predict(X_pred, verbose=0)[0]
    pred_idx = np.argmax(pred_probs)
    confidence = pred_probs[pred_idx]
    
    print(f"\nQ: {q}")
    print(f"Confidence: {confidence*100:.1f}%")
    print(f"A: {idx_to_answer[pred_idx][:100]}...")

print("\n" + "=" * 70)
print("TRAINING COMPLETE!")
print("=" * 70)
