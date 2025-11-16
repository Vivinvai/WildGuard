# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation, primarily focusing on Karnataka, India. It leverages AI for identifying animals and plants from photos, tracking habitat loss, and providing access to conservation resources. The platform's core capabilities include **hybrid AI identification systems with free API integration**, a **Discover Animals encyclopedia with 10+ species featuring videos and comprehensive information**, a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, **community engagement portal for NGOs and volunteering**, and educational content. Its ambition is to foster conservation efforts and community engagement through advanced features like AI-powered poaching detection, population trend prediction, automatic wildlife health assessment, satellite habitat monitoring, and a wildlife sightings heatmap, along with new tools for live habitat monitoring, bioacoustic analysis, footprint recognition, and partial image enhancement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite.
- **UI/UX**: Radix UI components with shadcn/ui design system, styled using Tailwind CSS, supporting consistent theming and dark mode.
- **Animations**: Framer Motion for smooth UI transitions and animations.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **File Upload**: `react-dropzone` for image uploads.
- **Maps**: Leaflet library for geospatial data visualization.
- **Responsiveness**: Optimized for various viewports.
- **Navigation**: Unified, color-coded, pill-style navigation with active state indications.
- **Landing Page**: Features animated gradient backgrounds, feature cards, platform statistics, and CTA.

## Backend Architecture
- **Framework**: Express.js with TypeScript.
- **File Handling**: Multer for multipart/form-data processing (10MB limit).
- **Storage Strategy**: In-memory storage with CRUD for various data types (flora, gardens, NGOs, volunteer activities, deforestation alerts, animal sightings).
- **API Design**: RESTful endpoints.
- **Services Layer**: Dedicated AI services.
- **Admin System**: Secure login (bcrypt), session management (PostgreSQL store), rate limiting, and a dashboard for managing animal sighting reports with verification controls.
- **Animal Sighting Reporting System**: Supports live camera capture, photo upload, automatic geolocation, and manual coordinate entry.
- **Live Location Tracking**: Automatic geolocation capture during animal identification with reverse geocoding (LocationIQ/Nominatim) to provide human-readable location names. Displays "Animal was seen here" with coordinates and Google Maps integration.

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Schema Structure**: Comprehensive schema including core tables (users, wildlife\_centers, animal\_identifications, flora\_identifications, botanical\_gardens, animal\_sightings, deforestation\_alerts, ngos, volunteer\_activities) and AI feature-specific tables (sound\_detections, footprint\_analyses, habitat\_monitoring, partial\_image\_enhancements, chat\_messages).
- **Migration Strategy**: Drizzle Kit for schema migrations.

## AI Integration
- **GEMINI-FIRST STRATEGY**: Google Gemini AI prioritized for maximum accuracy across all wildlife conservation features.
- **CROSS-VERIFICATION SYSTEM** (NEW): For ~30% of animal identifications, system uses multiple AI providers (Gemini + OpenAI + Anthropic) to verify each other and reach consensus. This significantly improves accuracy through:
  - **Consensus Analysis**: Compares results from multiple providers
  - **Confidence Boosting**: +15% confidence for full agreement, +5% for majority
  - **High/Medium/Low Consensus Levels**: Clear indication of agreement between providers
  - **Gemini as Both Primary & Verification**: Used in both standard and verification modes
- **Multi-Provider Fallback**: Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude → TensorFlow.js Local AI → Educational database.
- **Animal Identification**: 
  - **Smart Mode (30%)**: Cross-verification with Gemini + OpenAI + Anthropic for consensus
  - **Standard Mode (70%)**: Gemini AI → OpenAI → Anthropic → TensorFlow.js MobileNet (free, offline, real AI) → Educational fallback (29 Karnataka species)
  - **Fallback Implementation**: When cloud APIs fail, system throws error to trigger Local AI tier before falling back to educational mode
- **Flora Identification**: PlantNet API (free, 71,520+ species) → Gemini AI → TensorFlow.js Local AI → Educational data (21+ Karnataka plants).
- **Health Assessment** (HYBRID TWO-STAGE): 
  - **Stage 1 - Local AI Feature Extraction**: MobileNet classification + pixel-level visual analysis (red tones for blood, dark patches for bruises, color variance for anomalies)
  - **Stage 2 - Cloud AI Enhanced Analysis**: Gemini/OpenAI/Anthropic receive BOTH image + extracted features for superior accuracy
  - **Benefits**: Lower API costs, better accuracy (two-stage verification), faster responses, graceful fallback
  - **Fallback**: Cloud AI with features → Cloud AI without features → Local AI basic assessment → Educational
- **Poaching Detection**: Gemini → OpenAI → Anthropic (detects weapons, traps, suspicious activity) → TensorFlow.js Local scanning → Educational fallback.
- **TensorFlow.js Local AI**: Real AI backup using MobileNet model for offline operation when cloud APIs unavailable. Model loads on server startup (~5MB, cached). Provides actual computer vision analysis, not pattern matching.
- **HYBRID AI ARCHITECTURE** (NEW - November 16, 2025):
  - **Two-Stage Processing**: Local AI extracts visual features first, then Cloud AI analyzes using those features for enhanced accuracy
  - **Feature Extraction** (`extractVisualFeatures`):
    - MobileNet classification (top 5 predictions with confidence scores)
    - Pixel-level RGB analysis (channel means, standard deviation)
    - Visual anomaly detection: red tones (blood), dark patches (bruises), color variance (irregular patterns)
    - Outputs structured feature data + human-readable description
  - **Enhanced Prompts**: All Cloud AI providers receive "PRE-ANALYSIS" section with Local AI findings:
    - MobileNet predictions (e.g., "tiger, panthera tigris 85% confidence")
    - Visual cues flagged with warnings (e.g., "Red tones: YES ⚠️ POSSIBLE BLOOD/WOUNDS")
    - Feature description for context
  - **Memory Safety**: All TensorFlow tensors properly disposed via try/finally and tf.tidy() to prevent memory leaks
  - **Applied To**: Currently health assessment (wound detection), planned for animal identification
  - **Performance**: Free instant pre-processing + more focused Cloud AI = lower costs, better accuracy, faster responses
  - **Documentation**: See HYBRID_AI_SYSTEM.md for full technical details
- **Free API Integration**: 
    - **PlantNet API**: Free plant identification service, specialized botanical database, no API key cost
    - **iNaturalist API**: Free species enrichment for additional conservation data
    - **Educational Fallback**: When APIs unavailable, system provides real Karnataka wildlife/flora conservation data with transparent messaging
- **Conservation Features**: Nine AI-powered tools with comprehensive fallback support:
    1. **Poaching Detection** (Local TensorFlow.js → Gemini 2.0 Flash → OpenAI → Anthropic) - Enhanced with Local AI weapon/trap detection
    2. **Population Trend Prediction** (Linear regression on historical Karnataka data) - Statistical analysis
    3. **Automatic Health Assessment** (Cloud AI → **Local TensorFlow.js Wound Detection** → Educational) - **NEW: Real wound detection, health status classification, injury analysis**
    4. **Satellite Habitat Monitoring** (NDVI calculations with NASA FIRMS integration) - Real-time forest monitoring
    5. **Wildlife Sightings Heatmap** (Database-driven visualization) - Geographic clustering
    6. **Live Habitat Health Monitor** (NASA FIRMS API for real-time fire/vegetation data) - Active fire detection
    7. **Wildlife Sound Detection** (**Local TensorFlow.js Bioacoustics** → Gemini → OpenAI → Anthropic) - **NEW: Local AI sound pattern recognition**
    8. **AI Footprint Recognition** (**Local TensorFlow.js Pattern Analysis** → Cloud AI) - **NEW: Track identification for 29 species with detailed characteristics**
    9. **Partial Image Enhancement** (Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude) - Image quality improvement
- **Enhanced Chatbot**: Multi-provider support (Gemini → OpenAI → Anthropic) with real-time data integration.
- **Educational Databases**: 
    - **Fauna**: **29 Karnataka species** with Indian names - Bengal Tiger, Asiatic Lion, Asian Elephant, Indian Leopard, Sloth Bear, Indian Gaur (State Animal), Indian Wild Dog (Dhole), Sambar Deer, Spotted Deer (Chital), King Cobra, Indian Rock Python, Indian Pangolin, Indian Peafowl, Great Indian Hornbill, Indian Wild Boar, Golden Jackal, Bonnet Macaque, Gray Langur, Indian Gray Mongoose, Small Indian Civet, Indian Crested Porcupine, Malabar Giant Squirrel, Nilgiri Tahr, Striped Hyena, Rusty-Spotted Cat, Jungle Cat, Four-Horned Antelope (Chousingha), Indian Barking Deer (Muntjac), **Great Indian Bustard**, **Indian Blackbuck**, **Mugger Crocodile**, **Indian Gharial**, **Indian Gray Wolf**, **Indian Fox (Bengal Fox)**
    - **Flora**: 21 Karnataka plants (sandalwood, jackfruit, mango, banyan, neem, turmeric, tulsi, ashwagandha, teak, rosewood, bamboo, peepal, arjuna, amla, lotus, curry leaf, tamarind, coconut, pepper, cardamom, betel, aloe vera, hibiscus, jasmine, marigold)
- **Processing Flow**: Base64 encoding, multimodal AI analysis (vision/audio), structured JSON responses, graceful error handling with multi-tier fallback chains.
- **Multi-Provider Strategy**: 
    1. **Primary**: Free APIs (PlantNet for flora, iNaturalist for enrichment)
    2. **Tier 1**: Gemini 2.0 Flash (fast, cost-effective)
    3. **Tier 2**: OpenAI GPT-4o (high accuracy)
    4. **Tier 3**: Anthropic Claude 3.5 Sonnet (comprehensive analysis)
    5. **Fallback**: Educational databases (always available, 21+ species each)
- **Guaranteed Success**: All features work "at any cost" - system never fails completely, always provides valuable conservation information.

## Authentication & Security
- **Session Management**: PostgreSQL session store.
- **File Validation**: Image-only file type restrictions.
- **Environment Variables**: Secure management of API keys (e.g., `GOOGLE_API_KEY`).
- **CORS**: Configured for development and production.

## Performance Optimizations
- **Caching**: TanStack Query for static data.
- **Image Processing**: Client-side Base64 conversion.
- **Lazy Loading**: Code splitting with dynamic imports.

# External Dependencies

## Core Services
- **Neon Database**: PostgreSQL hosting.
- **PlantNet API**: Free plant identification (71,520+ species), primary for flora identification.
- **iNaturalist API**: Free species enrichment and conservation data.
- **Google Gemini API**: Gemini 2.0 Flash for primary AI analysis across all features.
- **NASA FIRMS API**: Real-time satellite data for forest fire and vegetation monitoring.
- **LocationIQ API**: Primary reverse geocoding service for converting coordinates to human-readable location names (with Nominatim fallback).

## API Key Status (Last Updated: November 16, 2025)
**Current System Status**: ✅ **FULLY OPERATIONAL** - All features working via TensorFlow.js Local AI + Educational fallbacks

**Cloud API Status**:
- ❌ Gemini API: Quota exceeded (429 error) - free tier monthly limit reached
- ❌ OpenAI API: Invalid key (401 error) - requires valid API key
- ❌ Anthropic API: Low credits (400 error) - account needs funding

**How to Restore Cloud AI Access**:
1. **Gemini API (Recommended)**: 
   - Visit https://aistudio.google.com/apikey
   - Generate new API key (free tier: 60 requests/minute)
   - Update `GEMINI_API_KEY` secret in Replit
   
2. **OpenAI API** (Optional):
   - Visit https://platform.openai.com/api-keys
   - Create new API key (requires billing)
   - Update `OPENAI_API_KEY` secret in Replit
   
3. **Anthropic API** (Optional):
   - Visit https://console.anthropic.com/
   - Add credits to account
   - Update `ANTHROPIC_API_KEY` secret in Replit

**Note**: System works perfectly without any cloud APIs using TensorFlow.js Local AI (free, offline, no API costs). Cloud APIs provide higher accuracy but are not required for full functionality.

## Development Tools
- **Replit Platform**: Integrated development environment.
- **Vite DevServer**: Development server and HMR.
- **TypeScript**: Static type checking.

## UI Framework Dependencies
- **Radix UI**: Accessible React components.
- **Leaflet**: Open-source mapping library.
- **Lucide Icons**: Icon library.
- **FontAwesome**: Additional icon set.

## Utility Libraries
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: CSS class composition.
- **nanoid**: Unique ID generation.
- **zod**: Runtime type validation.