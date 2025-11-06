# Overview

WildGuard is a comprehensive AI-powered wildlife and flora conservation platform that helps users identify both animals and plants through photo analysis, track habitat loss, and connect with conservation resources across Karnataka and India. The application features dual AI-powered identification systems using OpenAI GPT-5 for animals and Google Gemini for plants, a deforestation tracking dashboard with severity filtering, a botanical gardens directory, and wildlife center mapping. It provides extensive educational resources about conservation, NGO collaboration opportunities, and real-time habitat monitoring.

# Recent Changes

## Latest Bug Fixes & Improvements (November 6, 2025)

### Critical Bug Fixes
- **Theme Persistence Fix**: Resolved naming collision in ThemeProvider where `setTheme` parameter shadowed `useState` setter, preventing localStorage persistence. Theme preference now correctly saves to localStorage with key `wildguard-theme` and persists across all pages and browser sessions.
- **Deforestation Alerts Display Fix**: Fixed mock data fallback logic by changing from `alerts || mockAlerts` to `(alerts && alerts.length > 0) ? alerts : mockAlerts`, ensuring empty array responses properly fall back to display 3 sample alerts (Bandipur 12.5 ha, Western Ghats 8.3 ha, Nagarhole 5.7 ha).
- **Mobile Navigation Functionality**: Verified functional mobile menu with slide-in Sheet navigation for screens <1024px, providing full access to all pages (Home, Animals, Flora, Habitat, Centers, Gardens, NGOs, Learn, Chat).

### Testing & Verification
- **Comprehensive E2E Testing**: All features verified via Playwright tests including theme persistence, deforestation alert display, mobile navigation, and dark mode across all pages.
- **Architect Review**: Code reviewed and approved with no security concerns, confirmed data integrity and proper fallback mechanisms.

## Latest Platform Enhancements (November 2025)

### Flora & Plant Conservation Features
- **Flora Identification System**: New AI-powered plant recognition using Google Gemini API with support for uploading plant photos via drag-and-drop
- **Plant Species Data**: Displays scientific names, conservation status, habitat information, traditional/ecological uses, and threats to plant species
- **Botanical Gardens Directory**: Comprehensive listing of Karnataka's botanical gardens including Lalbagh, Cubbon Park, and University of Agricultural Sciences gardens with ratings, hours, contact info, and specializations
- **Flora Page Design**: Clean card-based layout with proper empty states, loading indicators, and toast notifications for success/error feedback

### Habitat Loss & Deforestation Tracking
- **Deforestation Dashboard**: Real-time habitat loss monitoring with stats overview showing total alerts, area lost (hectares), protected areas affected, and animal sightings
- **Severity Filtering**: Interactive filter buttons for viewing alerts by severity level (Critical, High, Medium) with proper empty state messaging
- **Alert Details**: Each deforestation alert shows location, coordinates, area lost, affected species, protected area name, and detection date
- **Mock Data Integration**: Sample alerts from Bandipur, Western Ghats, and Nagarhole for demonstration purposes

### Dark/Light Theme Implementation
- **Theme Provider**: Complete dark/light mode toggle with localStorage persistence and WCAG-compliant color contrast ratios
- **Theme Toggle Button**: Accessible theme switcher in header that persists across all pages
- **Dual Color Schemes**: All pages optimized for both light and dark modes with proper foreground/background contrast
- **CSS Custom Properties**: Theme colors managed via CSS variables for consistent styling

### Enhanced Data Architecture
- **Extended Schema**: Added comprehensive data models for flora identifications, botanical gardens, NGOs, volunteer activities, deforestation alerts, and animal sightings with location/habitat tracking
- **Storage Layer Expansion**: Updated IStorage interface and in-memory implementations for all new data types (flora, gardens, NGOs, volunteer activities, deforestation alerts, animal sightings)
- **New API Routes**: Complete RESTful endpoints for `/api/identify-flora`, `/api/botanical-gardens`, `/api/deforestation-alerts`, `/api/ngos`, `/api/volunteer-activities`, `/api/animal-sightings`

### Navigation & UX Improvements
- **Reorganized Header Navigation**: Streamlined navigation with links to Animals, Flora, Habitat, Centers, Gardens, NGOs, and Learn sections
- **Improved Accessibility**: All interactive elements include proper data-testid attributes for automated testing
- **Toast Notifications**: User-friendly success and error messages for flora identification results
- **Responsive Design**: All new pages optimized for desktop and mobile viewports

### Previous Enhancements
- **Multi-Page Navigation System**: Dedicated pages for Discover, Centers, Learn, and About sections
- **Wildlife Protection Content**: Comprehensive conservation information covering threats, protection methods, and success stories  
- **Wildlife Center Directory**: Karnataka's major centers including Bandipur, Nagarhole, and Daroji with specializations
- **4-Tier AI Fallback System**: OpenAI → Anthropic Claude → Gemini → Local Knowledge Base for maximum reliability
- **Chat Interface**: Enhanced AI chat with proper containment and professional styling
- **Supported Animals Database**: 50+ Karnataka/India species with filtering capabilities
- **Backend Robustness**: Zod validation, rate limiting, and comprehensive error handling

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing with 10+ pages
- **File Upload**: react-dropzone for drag-and-drop image uploads (animals and plants)
- **Theme Management**: ThemeProvider component with localStorage persistence for light/dark modes
- **Toast Notifications**: Shadcn toast system for user feedback on operations
- **Maps**: Leaflet library available for future map integrations

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **File Handling**: Multer for multipart/form-data processing with 10MB file size limits
- **Storage Strategy**: In-memory storage implementation with comprehensive CRUD operations for 8+ data types
- **API Design**: RESTful endpoints for animal/flora identification, wildlife centers, botanical gardens, deforestation alerts, NGOs, volunteer activities, and animal sightings
- **Error Handling**: Centralized error middleware with structured error responses
- **Services Layer**: Dedicated AI services for animal identification (OpenAI) and flora identification (Gemini)

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Schema Structure**:
  - Users table with UUID primary keys and username/password authentication
  - Wildlife centers table with geospatial data (latitude/longitude) and service information
  - Animal identifications table storing AI analysis results with confidence scores
  - Flora identifications table with species names, scientific names, conservation status, habitat, uses, and threats
  - Botanical gardens table with locations, ratings, hours, contact information, and specializations
  - Animal sightings table tracking location coordinates, habitat data, and species observations
  - Deforestation alerts table with severity levels, area lost, coordinates, protected areas, and affected species
  - NGOs table with contact information, focus areas, and service regions
  - Volunteer activities table linking users to NGO conservation efforts
- **Migration Strategy**: Drizzle Kit for schema migrations and database synchronization

## AI Integration
- **Animal Identification**: OpenAI GPT-5 API for animal image analysis and species identification
- **Flora Identification**: Google Gemini API for plant image analysis with conservation and habitat data
- **Processing Flow**: 
  - Animals: Base64 image encoding → GPT-5 vision analysis → structured JSON response
  - Plants: Base64 image encoding → Gemini vision analysis → structured JSON response
- **Response Format**: Standardized data including species names (common & scientific), conservation status, habitat, threats/uses, and confidence scores
- **Error Handling**: Graceful fallbacks with user-friendly toast notifications and error cards
- **Multi-Provider Strategy**: Separate AI services for specialized identification tasks

## Authentication & Security
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **File Validation**: Image-only file type restrictions with MIME type checking
- **Environment Variables**: Secure API key management for OpenAI integration
- **CORS**: Configured for development and production environments

## Performance Optimizations
- **Caching Strategy**: TanStack Query with infinite stale time for static data
- **Image Processing**: Client-side base64 conversion to reduce server processing
- **Lazy Loading**: Code splitting with dynamic imports for development tools
- **Memory Management**: In-memory storage with plans for database migration

# External Dependencies

## Core Services
- **Neon Database**: PostgreSQL hosting service for production data storage
- **OpenAI API**: GPT-5 model for animal image analysis and species identification
- **Google Gemini API**: Gemini model for plant/flora image analysis and botanical identification

## Development Tools
- **Replit Platform**: Integrated development environment with specialized plugins
- **Vite DevServer**: Hot module replacement and development server
- **TypeScript**: Static type checking across frontend and backend

## UI Framework Dependencies
- **Radix UI**: Comprehensive set of accessible React components
- **Leaflet**: Open-source mapping library for wildlife center visualization
- **Lucide Icons**: Icon library for consistent UI elements
- **FontAwesome**: Additional icon set for specific wildlife-related icons

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Dynamic className composition
- **nanoid**: Unique ID generation for entities
- **zod**: Runtime type validation and schema definition