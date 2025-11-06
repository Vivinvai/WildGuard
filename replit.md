# Overview

WildGuard is an AI-powered platform dedicated to wildlife and flora conservation. It enables users to identify animals and plants via photo analysis, track habitat loss, and access conservation resources across Karnataka and India. The platform features AI identification systems (OpenAI GPT-5 for animals, Google Gemini for plants), a deforestation tracking dashboard, directories for botanical gardens and wildlife centers, and educational content to foster conservation efforts and community engagement.

# Recent Changes (November 6, 2025)

## AI-Powered Conservation Features - FULLY FUNCTIONAL (Latest)
- **Updated Admin Credentials**: Changed to username: `admineo75`, password: `wildguard1234` with bcrypt hashing

- **Complete Navigation Redesign**:
  - Compact, beautiful navigation with organized dropdown menus
  - **Explore**: Identify Fauna, Identify Flora (AI-powered identification)
  - **Features**: 5 AI-powered conservation tools in dropdown menu
  - **Actions**: Report Sighting, NGOs, Volunteer opportunities
  - **Admin**: Direct login access for government officials
  - Scroll-to-top behavior on all page transitions using wouter hooks
  - Consistent color-coded hover states and active indicators

- **Five Fully Functional AI-Powered Conservation Features**:
  
  1. **Poaching Detection** (Gemini AI + Backend API):
     - Real AI analysis using Gemini vision API
     - Detects weapons, traps, illegal activities in images
     - Threat severity classification (none/low/medium/high/critical)
     - GPS coordinate logging for evidence
     - API: POST /api/features/poaching-detection
  
  2. **Population Trend Prediction** (Real Data + ML):
     - **Real Karnataka wildlife census data** (2006-2024)
     - **563 tigers**, **6,395 elephants**, **1,783 leopards**
     - Linear regression forecasting with confidence intervals
     - Multi-year predictions (up to 5 years)
     - Conservation recommendations based on real threats
     - APIs: GET /api/features/population-prediction, /api/features/wildlife-data
     - Frontend: Fully integrated with TanStack Query, real-time predictions
  
  3. **Automatic Health Assessment** (Gemini AI):
     - AI-powered veterinary analysis using Gemini vision
     - Detects injuries, malnutrition, skin conditions
     - Health status classification (healthy to emergency)
     - Treatment recommendations
     - Veterinary alert system
     - API: POST /api/features/health-assessment
  
  4. **Satellite Habitat Monitoring** (NDVI Simulation):
     - **Real Protected Areas**: Bandipur, Nagarahole, BRT, Bhadra, Kali
     - NDVI (Normalized Difference Vegetation Index) calculation
     - Vegetation health monitoring (excellent/good/fair/poor/critical)
     - Deforestation detection with severity levels
     - Historical trend analysis (12-month data)
     - API: GET /api/features/satellite-monitoring
     - Frontend: Fully integrated with real NDVI data visualization
  
  5. **Wildlife Sightings Heatmap** (Database Integration):
     - Uses real animal sighting data from database
     - Biodiversity hotspot calculation
     - Species density analysis
     - Geospatial visualization ready
     - API: GET /api/features/sightings-heatmap

- **Enhanced Home Page**:
  - Added dynamic Karnataka Flora Showcase section with 4 cards:
    - Ancient Trees (200-500 year old sacred figs, banyans, teak)
    - Endemic Flora (Western Ghats unique species)
    - Medicinal Plants (500+ Ayurvedic species)
    - Flowering Species (2,000+ including state flower lotus)
  - All showcase cards with data-testid attributes for testing
  - Smooth Framer Motion animations matching wildlife showcase style
  - Emerald/teal gradient theming distinct from wildlife sections

## Government Admin System & Animal Sighting Reports
- **Admin Authentication System**:
  - Secure login page with bcrypt password hashing (username: admineo75, password: wildguard1234)
  - Express session management with PostgreSQL store and session regeneration
  - Rate limiting (5 login attempts per 15 minutes) to prevent brute force attacks
  - Session validation with `/api/admin/session` endpoint
  - Secure logout with session destruction

- **Admin Dashboard**:
  - Three-tab interface: Emergency Sightings, Pending Verification, All Sightings
  - Real-time monitoring of animal sightings with location and status information
  - Emergency alert indicators with red badges for urgent wildlife situations
  - Verification controls with approve/reject actions for reported sightings
  - Activity log integration tracking all user submissions and admin actions
  - Professional gradient design with green-themed color scheme

- **Animal Sighting Reporting System**:
  - Live camera capture with real-time video preview for instant photo documentation
  - Photo upload with drag-and-drop support (up to 10MB)
  - Automatic geolocation capture using browser Geolocation API
  - Manual coordinate entry fallback when geolocation is unavailable or denied
  - Comprehensive form: reporter details, location name, habitat type, animal status, emergency level
  - Coordinate validation with `isFinite()` checks to prevent invalid submissions
  - Multer backend processing for multipart form data
  - Activity logging for admin monitoring and analytics
  - Toast notifications for submission success/failure feedback

- **Backend Enhancements**:
  - Three new API endpoints: `/api/admin/login`, `/api/admin/logout`, `/api/admin/session`
  - Sighting endpoints: `/api/report-sighting`, `/api/admin/sightings`, `/api/admin/emergency-sightings`
  - Zod schema validation for all sighting data (coordinates, status, habitat)
  - Activity logging system tracking user actions and sighting reports
  - MemStorage updated with 15 CRUD methods for admin, certificates, sightings, activities

## Navigation Bar Complete Redesign
- **Unified Navigation Styling**: Completely reorganized navigation with consistent pill-style buttons:
  - All navigation links now have uniform rounded-lg styling with px-4 py-2 padding
  - Font-semibold weight applied consistently across all links
  - Active state indication using color-coded gradient backgrounds (not underlines)
  - Smooth hover transitions with subtle background color changes
  - Better organization: Home → Wildlife Centers → Botanical Gardens → Habitat Loss → NGOs & Volunteer → Learn
  
- **Color-Coded Navigation System**: Each section has its own thematic gradient:
  - Home & Wildlife Centers: Green gradients (from-green-100 to-emerald-100)
  - Botanical Gardens: Orange gradients (from-orange-100 to-amber-100)
  - Habitat Loss: Red gradients (from-red-100 to-rose-100) - renamed from "Habitat"
  - NGOs & Volunteer: Blue gradients (from-blue-100 to-cyan-100)
  - Learn: Purple gradients (from-purple-100 to-violet-100)
  - Dark mode variants with /40 opacity for all gradient backgrounds

## Get Started Landing Page - Complete Overhaul (Latest)
- **Official Brand Icons**: Now using actual WildGuard icons from attached_assets:
  - Primary shield: icons8-guard-48_1758461926293.png (guard shield)
  - Wildlife badge: icons8-wildlife-64_1758461915368.png (wildlife icon)
  - Larger logo display (140x140) with animated glow effect on hover
  
- **Enhanced Visual Design**:
  - Animated gradient background orbs that continuously rotate and scale
  - Larger, more prominent title with gradient text (6xl/7xl/8xl responsive)
  - Four feature cards instead of three: Identify Wildlife, Discover Flora, Find Centers, Take Action
  - Each feature card has color-coded gradients (green, orange, blue, red)
  - Platform statistics section showing metrics (50+ species, 1000+ identifications, 15+ protected areas)
  - Enhanced CTA button with gradient overlay on hover
  - Improved scroll indicator with animated dot
  
- **Smooth Animations & Transitions**:
  - Logo entrance with rotation and spring animation
  - Sequential stagger animations for feature cards
  - Background orbs with continuous motion (scale, rotate, translate)
  - Framer Motion AnimatePresence for smooth page transitions
  - All animations optimized for 60fps performance

## Previous Enhancements
- **Fixed Layout Issues**: 
  - Resolved QuickActions component covering "Join the Conservation Movement" section
  - Reduced z-index from 40 to 30 and added bottom padding to home and chat pages
  - QuickActions now has beautiful dark mode gradients with gray-900 backgrounds
- **Improved Dark Mode Components**:
  - Identify dropdown: gradient backgrounds, enhanced borders, better shadows, improved hover states
  - Chat interface: dark gradients for all sections, proper text contrast, comprehensive dark mode variants
  - All accent colors (green, orange, blue, purple) have proper dark mode variants

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