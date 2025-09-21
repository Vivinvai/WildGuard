# Overview

WildGuard (formerly WildlifeSave) is an AI-powered wildlife conservation platform that helps users identify animals through photo analysis and connect with nearby wildlife conservation centers. The application uses OpenAI's GPT-5 model to analyze uploaded animal images and provide detailed species information including conservation status, habitat, and threats. It features an interactive map to locate nearby wildlife centers, offers emergency reporting functionality for wildlife-related incidents, and provides comprehensive educational resources about wildlife protection.

# Recent Changes

## Latest Platform Enhancements
- **Multi-Page Navigation System**: Added dedicated pages for Discover, Centers, Learn, and About sections with proper routing using wouter
- **Wildlife Protection Content**: Integrated comprehensive conservation information including threats to wildlife, protection methods, conservation success stories, and actionable guidance
- **Enhanced Visual Design**: Replaced logo with Shield icon from Lucide React, added consistent shield iconography throughout the platform for visual cohesion
- **Educational Resources**: Added detailed sections covering wildlife threats (habitat loss, poaching, pollution, climate change), conservation methods, and technology's role in wildlife protection
- **Wildlife Center Directory**: Created comprehensive listing of Karnataka's major wildlife centers including Bandipur National Park, Nagarhole National Park, and Daroji Bear Sanctuary with contact information and specializations
- **Conservation Success Stories**: Featured inspiring examples like Project Tiger success, whale conservation achievements, and sea turtle protection efforts
- **How to Help Section**: Practical guidance for users on emergency reporting, ethical choices, volunteer opportunities, and social media awareness
- **4-Tier AI Fallback System**: Implemented robust OpenAI → Anthropic Claude → Gemini → Local Knowledge Base fallback for maximum reliability
- **Chat Interface Improvements**: Enhanced chat with proper containment, fixed responsive heights, and professional styling that stays within one frame
- **Supported Animals Database**: Created comprehensive database with 50+ Karnataka/India species including tigers, elephants, leopards, and API with filtering capabilities
- **Backend Robustness**: Added input validation with Zod schemas, rate limiting, error handling, and Anthropic integration for improved reliability

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **File Upload**: react-dropzone for drag-and-drop image uploads
- **Maps**: Leaflet integration for interactive wildlife center mapping

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **File Handling**: Multer for multipart/form-data processing with 10MB file size limits
- **Storage Strategy**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for animal identification and wildlife center queries
- **Error Handling**: Centralized error middleware with structured error responses

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Schema Structure**:
  - Users table with UUID primary keys and username/password authentication
  - Wildlife centers table with geospatial data (latitude/longitude) and service information
  - Animal identifications table storing AI analysis results with confidence scores
- **Migration Strategy**: Drizzle Kit for schema migrations and database synchronization

## AI Integration
- **Provider**: OpenAI GPT-5 API for image analysis and species identification
- **Processing Flow**: Base64 image encoding → GPT-5 vision analysis → structured JSON response
- **Response Format**: Standardized animal data including species names, conservation status, habitat, threats, and confidence scores
- **Error Handling**: Graceful fallbacks for API failures with user-friendly error messages

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