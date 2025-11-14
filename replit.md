# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation, primarily focusing on Karnataka, India. It leverages AI for identifying animals and plants from photos, tracking habitat loss, and providing access to conservation resources. The platform's core capabilities include AI identification systems, a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, and educational content. Its ambition is to foster conservation efforts and community engagement through advanced features like AI-powered poaching detection, population trend prediction, automatic wildlife health assessment, satellite habitat monitoring, and a wildlife sightings heatmap, along with new tools for live habitat monitoring, bioacoustic analysis, footprint recognition, and partial image enhancement.

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

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Schema Structure**: Comprehensive schema including core tables (users, wildlife\_centers, animal\_identifications, flora\_identifications, botanical\_gardens, animal\_sightings, deforestation\_alerts, ngos, volunteer\_activities) and AI feature-specific tables (sound\_detections, footprint\_analyses, habitat\_monitoring, partial\_image\_enhancements, chat\_messages).
- **Migration Strategy**: Drizzle Kit for schema migrations.

## AI Integration
- **Animal Identification**: OpenAI GPT-5 API for image analysis.
- **Flora Identification**: Google Gemini 2.0 Flash API for plant image analysis.
- **Conservation Features**: Nine AI-powered tools, including:
    1. Poaching Detection (Gemini 2.0 Flash)
    2. Population Trend Prediction (Linear regression on historical data)
    3. Automatic Health Assessment (Gemini 2.0 Flash)
    4. Satellite Habitat Monitoring (NDVI calculations)
    5. Wildlife Sightings Heatmap (Database-driven)
    6. Live Habitat Health Monitor (NASA FIRMS API)
    7. Wildlife Sound Detection (Gemini 2.0 Flash bioacoustic analysis)
    8. AI Footprint Recognition (Gemini 2.0 Flash)
    9. Partial Image Enhancement (Gemini 2.0 Flash)
- **Enhanced Chatbot**: Real-time data integration with sightings, weather, population stats, and conservation resources.
- **Processing Flow**: Base64 encoding, multimodal AI analysis (vision/audio), structured JSON responses.
- **Multi-Provider Strategy**: OpenAI for fauna, Gemini for flora and conservation features, NASA FIRMS for satellite data.

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
- **OpenAI API**: GPT-5 for animal identification.
- **Google Gemini API**: Gemini 2.0 Flash for flora identification and six AI conservation features (poaching detection, health assessment, sound detection, footprint recognition, partial image enhancement, chatbot).
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