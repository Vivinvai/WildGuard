# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation. It enables users to identify animals and plants via photo analysis, track habitat loss, and access conservation resources across Karnataka and India. The platform features AI identification systems, a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, and educational content to foster conservation efforts and community engagement. Key capabilities include AI-powered poaching detection, population trend prediction, automatic health assessment for wildlife, satellite habitat monitoring, and a wildlife sightings heatmap.

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
- **Schema Structure**: Includes tables for users, wildlife centers (with geospatial data), animal/flora identifications, botanical gardens, animal sightings, deforestation alerts, NGOs, and volunteer activities.
- **Migration Strategy**: Drizzle Kit for schema migrations.

## AI Integration
- **Animal Identification**: OpenAI GPT-5 API for image analysis.
- **Flora Identification**: Google Gemini API for plant image analysis.
- **Conservation Features**:
    - **Poaching Detection**: Gemini AI analyzes images for weapons, traps, and illegal activities.
    - **Population Trend Prediction**: Uses real Karnataka wildlife census data and linear regression for forecasting.
    - **Automatic Health Assessment**: Gemini AI detects injuries, malnutrition, and skin conditions in wildlife images.
    - **Satellite Habitat Monitoring**: NDVI simulation for vegetation health monitoring and deforestation detection in protected areas.
- **Processing Flow**: Base64 image encoding, AI vision analysis, structured JSON response.
- **Error Handling**: Graceful fallbacks and user-friendly notifications.
- **Multi-Provider Strategy**: Utilizes specialized AI services for optimal identification.

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
- **Neon Database**: PostgreSQL hosting.
- **OpenAI API**: For animal identification.
- **Google Gemini API**: For plant/flora identification and other AI-powered conservation features.

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