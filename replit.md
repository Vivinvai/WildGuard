# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation. It enables users to identify animals and plants via photo analysis, track habitat loss, and access conservation resources across Karnataka and India. The platform features AI identification systems, a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, and educational content to foster conservation efforts and community engagement. Key capabilities include AI-powered poaching detection, population trend prediction, automatic health assessment for wildlife, satellite habitat monitoring, and a wildlife sightings heatmap.

# Recent Changes (November 6, 2025 - Latest Update)

## MAJOR EXPANSION: 9 AI-Powered Conservation Features Complete
WildGuard has expanded from 5 to **9 comprehensive AI conservation tools**, all fully integrated with real AI APIs and production-ready:

### Core AI Features (1-5):

1. **Poaching Detection - FULLY INTEGRATED**:
   - ✅ REAL Gemini 2.0 Flash AI API integration
   - ✅ Real-time image analysis with threat level detection (none/low/medium/high/critical)
   - ✅ Image preview with live upload feedback
   - ✅ Color-coded threat indicators with animated status badges
   - ✅ Detailed detection: weapons, traps, illegal activities, GPS coordinates
   - ✅ Comprehensive ranger response recommendations
   - ✅ Professional purple/indigo gradient UI

2. **Population Trend Prediction - EXPANDED DATA**:
   - ✅ **11 species** with comprehensive historical census data (2006-2024)
   - ✅ Real Karnataka Forest Department data from Bandipur, Nagarahole, BRT reserves
   - ✅ Species: Tiger, Elephant, Leopard, Sloth Bear, Indian Gaur, Wild Dog (Dhole), Sambar Deer, Spotted Deer, Wild Boar, Indian Peafowl, King Cobra, Purple Frog
   - ✅ Linear regression forecasting with trend analysis (increasing/stable/declining)
   - ✅ Confidence intervals and conservation impact analysis

3. **Automatic Health Assessment - FULLY INTEGRATED**:
   - ✅ REAL Gemini 2.0 Flash AI for veterinary analysis
   - ✅ Detects injuries, diseases, malnutrition, skin conditions
   - ✅ Health status classification (healthy/good/fair/poor/emergency)
   - ✅ Severity levels (low/moderate/high/critical) for each condition
   - ✅ Physical signs observation and comprehensive recommendations
   - ✅ Emergency intervention alerts for critical cases
   - ✅ Professional green/emerald themed UI

4. **Satellite Habitat Monitoring - ENHANCED**:
   - ✅ NDVI calculations for vegetation health
   - ✅ 5 major Karnataka protected areas monitored
   - ✅ Deforestation detection with severity levels
   - ✅ Historical trend analysis with conservation recommendations

5. **Wildlife Sightings Heatmap - COMPLETELY REVAMPED**:
   - ✅ **Smart Species Filtering**: Dropdown + sidebar buttons, sorted by count
   - ✅ **Dynamic Hotspot Calculation**: Recalculates for selected species
   - ✅ **Real-time Statistics**: 4 cards including filtered count
   - ✅ **Dual Filter Interface**: Select from dropdown or clickable species buttons
   - ✅ **Complete Type Safety**: TypeScript interfaces, useMemo optimization
   - ✅ **Enhanced UI/UX**: Count badges, active states, professional orange/amber theme
   - ✅ **Sample Data**: 20 sightings across 11 species in Bandipur & Nagarahole
   - ✅ **Comprehensive Display**: Sighting cards, hotspots, recent timeline with full details

### NEW AI Features (6-9):

6. **Live Habitat Health Monitor - NEW**:
   - ✅ NASA FIRMS API integration for real-time satellite data
   - ✅ Forest fire detection with live alerts
   - ✅ Vegetation loss tracking using NDVI indices
   - ✅ Active fire monitoring across Karnataka protected areas
   - ✅ Real-time conservation alerts and recommendations
   - ✅ Database storage: `habitat_monitoring` table
   - ✅ Backend service: `server/services/habitat-monitoring.ts`
   - ✅ Frontend: `/features/habitat-monitoring` page

7. **Wildlife Sound Detection (Bioacoustic AI) - NEW**:
   - ✅ REAL Gemini 2.0 Flash AI for audio analysis
   - ✅ Audio file upload (MP3, WAV, M4A) - max 5MB
   - ✅ Species identification from wildlife sounds
   - ✅ Confidence scores and environmental context
   - ✅ Conservation recommendations based on detected species
   - ✅ Database storage: `sound_detections` table
   - ✅ Backend service: `server/services/sound-detection.ts`
   - ✅ Frontend: `/features/sound-detection` page

8. **AI Footprint Recognition - NEW**:
   - ✅ REAL Gemini 2.0 Flash AI for footprint analysis
   - ✅ Photo upload of animal tracks/footprints
   - ✅ Species prediction with confidence levels
   - ✅ Physical characteristics analysis (size, gait pattern, claw marks)
   - ✅ Age/size estimation and behavior insights
   - ✅ Database storage: `footprint_analyses` table
   - ✅ Backend service: `server/services/footprint-recognition.ts`
   - ✅ Frontend: `/features/footprint-recognition` page

9. **Partial Image Enhancement - NEW**:
   - ✅ REAL Gemini 2.0 Flash AI for blurry/partial image analysis
   - ✅ Analyzes incomplete camera trap images
   - ✅ Species identification despite poor image quality
   - ✅ Confidence scores and quality assessment
   - ✅ Visible features extraction and recommendations
   - ✅ Database storage: `partial_image_enhancements` table
   - ✅ Backend service: `server/services/partial-image-enhancement.ts`
   - ✅ Frontend: `/features/partial-image-enhancement` page

## Enhanced Wildlife Chatbot
- ✅ Real-time data integration with live sighting counts
- ✅ Weather data for conservation planning
- ✅ Population statistics from database
- ✅ Conservation resource recommendations
- ✅ Database storage: `chat_messages` table for conversation history
- ✅ Backend service: `server/services/wildlife-chatbot.ts`

## Navigation Updates
- **Comprehensive Features Dropdown**: All 9 AI tools organized in unified navigation menu
- Categorized display: "AI-Powered Tools" (features 1-5) and "NEW AI Features" (features 6-9)
- Color-coded icons and descriptions for each feature
- Active state indicators throughout navigation

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite.
- **UI/UX**: Radix UI components with shadcn/ui design system, styled using Tailwind CSS. Consistent theming and dark mode are supported via custom CSS variables.
- **Animations**: Framer Motion for smooth animations, including an enhanced home slideshow and scroll-triggered animations.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **File Upload**: `react-dropzone` for drag-and-drop image uploads.
- **Theme Management**: `ThemeProvider` with localStorage persistence for light/dark modes.
- **Notifications**: Shadcn toast system for user feedback.
- **Maps**: Leaflet library for geospatial data visualization.
- **Responsiveness**: Optimized for desktop and mobile viewports.
- **Navigation**: Unified, color-coded, pill-style navigation with consistent styling and active state indications.
- **Landing Page**: Features animated gradient background orbs, prominent title, four feature cards with color-coded gradients, platform statistics, and an enhanced CTA button.

## Backend Architecture
- **Framework**: Express.js with TypeScript.
- **File Handling**: Multer for multipart/form-data processing (10MB limit).
- **Storage Strategy**: In-memory storage with comprehensive CRUD operations for various data types (flora, gardens, NGOs, volunteer activities, deforestation alerts, animal sightings).
- **API Design**: RESTful endpoints for identification, directories, alerts, and user interactions.
- **Error Handling**: Centralized middleware for structured error responses.
- **Services Layer**: Dedicated AI services for animal and flora identification.
- **Admin System**: Secure login with bcrypt hashing, session management with PostgreSQL store, rate limiting, and a dashboard for monitoring and managing animal sighting reports with verification controls.
- **Animal Sighting Reporting System**: Supports live camera capture, photo upload (drag-and-drop), automatic geolocation, manual coordinate entry, and comprehensive form submission with activity logging.

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Schema Structure**: Comprehensive database with tables for:
  - **Core Tables**: users, wildlife_centers (with geospatial data), animal_identifications, flora_identifications, botanical_gardens, animal_sightings, deforestation_alerts, ngos, volunteer_activities
  - **AI Feature Tables**: sound_detections, footprint_analyses, habitat_monitoring, partial_image_enhancements, chat_messages
- **Migration Strategy**: Drizzle Kit for schema migrations using `npm run db:push`.

## AI Integration
- **Animal Identification**: OpenAI GPT-5 API for image analysis.
- **Flora Identification**: Google Gemini 2.0 Flash API for plant image analysis.
- **Conservation Features** (9 AI-powered tools):
    1. **Poaching Detection**: Gemini 2.0 Flash analyzes camera trap images for weapons, traps, and illegal activities
    2. **Population Trend Prediction**: Linear regression on real Karnataka census data (2006-2024) for 11 species
    3. **Automatic Health Assessment**: Gemini 2.0 Flash detects injuries, diseases, malnutrition in wildlife photos
    4. **Satellite Habitat Monitoring**: NDVI calculations for vegetation health and deforestation detection
    5. **Wildlife Sightings Heatmap**: Database-driven biodiversity hotspot mapping
    6. **Live Habitat Health Monitor**: NASA FIRMS API for real-time forest fire and vegetation loss detection
    7. **Wildlife Sound Detection**: Gemini 2.0 Flash bioacoustic analysis for species identification from audio
    8. **AI Footprint Recognition**: Gemini 2.0 Flash analyzes tracks/footprints for species prediction
    9. **Partial Image Enhancement**: Gemini 2.0 Flash analyzes blurry/incomplete camera trap images
- **Enhanced Chatbot**: Real-time data integration (sightings, weather, population stats, conservation resources)
- **Processing Flow**: Base64 encoding, multimodal AI analysis (vision/audio), structured JSON responses
- **Error Handling**: Graceful fallbacks, user-friendly notifications, comprehensive error logging
- **Multi-Provider Strategy**: OpenAI for fauna, Gemini for flora and conservation features, NASA FIRMS for satellite data

## Authentication & Security
- **Session Management**: PostgreSQL session store with `connect-pg-simple`.
- **File Validation**: Image-only file type restrictions and MIME type checking.
- **Environment Variables**: Secure management of API keys.
- **CORS**: Configured for development and production.

## Performance Optimizations
- **Caching**: TanStack Query with infinite stale time for static data.
- **Image Processing**: Client-side Base64 conversion.
- **Lazy Loading**: Code splitting with dynamic imports.

# External Dependencies

## Core Services
- **Neon Database**: PostgreSQL hosting for all data persistence.
- **OpenAI API**: GPT-5 for animal identification.
- **Google Gemini API**: Gemini 2.0 Flash for flora identification and 6 AI conservation features (poaching detection, health assessment, sound detection, footprint recognition, partial image enhancement, chatbot).
- **NASA FIRMS API**: Real-time satellite data for forest fire and vegetation monitoring.

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