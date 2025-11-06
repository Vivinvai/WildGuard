# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation. It enables users to identify animals and plants via photo analysis, track habitat loss, and access conservation resources across Karnataka and India. The platform features AI identification systems (OpenAI GPT-5 for animals, Google Gemini for plants), a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, and educational content to foster conservation efforts and community engagement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite.
- **UI/UX**: Radix UI components with shadcn/ui design system, styled using Tailwind CSS with custom CSS variables for consistent theming and dark mode.
- **Animations**: Framer Motion for smooth 60fps animations, including an enhanced home slideshow with crossfade transitions, play/pause controls, and scroll-triggered animations using `Intersection Observer`.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **File Upload**: `react-dropzone` for drag-and-drop image uploads.
- **Theme Management**: `ThemeProvider` with localStorage persistence for light/dark modes.
- **Notifications**: Shadcn toast system for user feedback.
- **Maps**: Leaflet library integrated for geospatial data visualization.
- **Responsiveness**: Optimized for desktop and mobile viewports.

## Backend Architecture
- **Framework**: Express.js with TypeScript.
- **File Handling**: Multer for multipart/form-data processing (10MB limit).
- **Storage Strategy**: In-memory storage with comprehensive CRUD operations for various data types (flora, gardens, NGOs, volunteer activities, deforestation alerts, animal sightings).
- **API Design**: RESTful endpoints for identification, directories, alerts, and user interactions.
- **Error Handling**: Centralized middleware for structured error responses.
- **Services Layer**: Dedicated AI services for animal and flora identification.

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Schema Structure**: Includes tables for users, wildlife centers (with geospatial data), animal/flora identifications, botanical gardens, animal sightings, deforestation alerts, NGOs, and volunteer activities.
- **Migration Strategy**: Drizzle Kit for schema migrations.

## AI Integration
- **Animal Identification**: OpenAI GPT-5 API for image analysis, providing species names, conservation status, habitat, threats/uses, and confidence scores.
- **Flora Identification**: Google Gemini API for plant image analysis, providing similar botanical data.
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
- **Google Gemini API**: For plant/flora identification.

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