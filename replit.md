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
- **LOCAL-FIRST STRATEGY**: Due to cloud API quota limitations, system now prioritizes offline local AI for reliable, zero-cost operation.
- **Smart Local AI**: Custom Karnataka wildlife intelligence system (`smart-local-ai.ts`) with 50+ species database, rule-based health assessment, and poaching detection - works 100% offline.
- **Animal Identification**: Smart Local AI (primary, 70-95% confidence) → Educational fallback (50 Karnataka species with detailed conservation information).
- **Flora Identification**: PlantNet API (free, 71,520+ species) → Smart Local AI → Educational data (21+ Karnataka plants).
- **Health Assessment**: Local rule-based analysis (detect injuries, malnutrition, disease markers) → Educational fallback.
- **Poaching Detection**: Local threat scanning (weapons, traps, vehicles) → Educational fallback.
- **Free API Integration**: 
    - **PlantNet API**: Free plant identification service, specialized botanical database, no API key cost
    - **iNaturalist API**: Free species enrichment for additional conservation data
    - **Educational Fallback**: When APIs unavailable, system provides real Karnataka wildlife/flora conservation data with transparent messaging
- **Conservation Features**: Nine AI-powered tools with comprehensive fallback support:
    1. Poaching Detection (Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude)
    2. Population Trend Prediction (Linear regression on historical Karnataka data)
    3. Automatic Health Assessment (Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude)
    4. Satellite Habitat Monitoring (NDVI calculations with NASA FIRMS integration)
    5. Wildlife Sightings Heatmap (Database-driven visualization)
    6. Live Habitat Health Monitor (NASA FIRMS API for real-time fire/vegetation data)
    7. Wildlife Sound Detection (Gemini 2.0 Flash bioacoustic analysis → OpenAI → Anthropic)
    8. AI Footprint Recognition (Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude)
    9. Partial Image Enhancement (Gemini 2.0 Flash → OpenAI GPT-4o → Anthropic Claude)
- **Enhanced Chatbot**: Multi-provider support (Gemini → OpenAI → Anthropic) with real-time data integration.
- **Educational Databases**: 
    - **Fauna**: 21 Karnataka species (tiger, elephant, leopard, sloth bear, gaur, dhole, sambar, chital, king cobra, python, pangolin, peafowl, hornbill, wild boar, jackal, macaque, langur, mongoose, civet, porcupine, malabar squirrel, nilgiri tahr, striped hyena, rusty-spotted cat, jungle cat, four-horned antelope, barking deer)
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
- **OpenAI API**: GPT-4o for secondary fallback across all AI features.
- **Anthropic API**: Claude 3.5 Sonnet for tertiary fallback across all AI features.
- **NASA FIRMS API**: Real-time satellite data for forest fire and vegetation monitoring.
- **LocationIQ API**: Primary reverse geocoding service for converting coordinates to human-readable location names (with Nominatim fallback).

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