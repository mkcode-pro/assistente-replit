# Império Pharma - AI-Powered Ergogenic Protocol Assistant

## Overview

This is a full-stack AI-powered web application designed to provide personalized ergogenic protocol consultations in Brazilian Portuguese (PT-BR). The system features a futuristic design with glassmorphism effects, animated gradients, and AI-powered chat functionality using Google's Gemini API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with the following key components:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom futuristic design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful API with structured endpoints
- **Rate Limiting**: Express rate limiting (10 requests/minute for chat)
- **Middleware**: CORS enabled, JSON parsing, request logging

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: PostgreSQL schema with users and conversations tables
- **Storage**: In-memory storage implementation for development (MemStorage class)
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### 1. Landing Page
- Full viewport hero section with animated gradient background
- Floating molecular logo with CSS animations
- Typewriter effect for subtitle text
- Glassmorphism design elements
- Smooth scroll indicators and pulse animations

### 2. User Profile System
- Multi-step form with validation using Zod schemas
- Profile fields: gender, goals, preferences, age, experience
- Session-based user identification
- Form validation with Brazilian Portuguese error messages

### 3. AI Chat Interface
- Real-time chat with Google Gemini AI
- Context-aware responses focused on ergogenic protocols
- Futuristic message bubbles with glow effects
- Typing indicators and smooth animations
- Auto-scroll functionality

### 4. Design System
- Custom CSS variables for theming
- Dark mode support with futuristic color palette
- Glassmorphism effects with backdrop filters
- CSS animations for glow, pulse, and floating effects
- Responsive design for mobile and desktop

## Data Flow

1. **User Onboarding**: Users start at the landing page and proceed to profile creation
2. **Profile Creation**: Form data is validated and stored with session ID
3. **Chat Initialization**: AI generates initial analysis based on user profile
4. **Conversation Flow**: Messages are stored and context is maintained for AI responses
5. **Rate Limiting**: Chat requests are limited to prevent abuse

## External Dependencies

### AI Integration
- **Google Gemini AI**: Primary AI service for generating protocol recommendations
- **API Configuration**: Uses GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variables
- **Model**: gemini-1.5-flash for fast, context-aware responses

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for UI elements
- **Class Variance Authority**: Utility for component variants
- **CLSX/Tailwind Merge**: Conditional styling utilities

### Development Tools
- **Replit Integration**: Development environment optimizations
- **Cartographer**: Development mapping tool
- **Runtime Error Modal**: Enhanced error reporting

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server with middleware logging
- In-memory storage for rapid development
- TypeScript compilation with strict mode

### Production Considerations
- **Database**: Configured for PostgreSQL with Neon Database serverless
- **Environment Variables**: DATABASE_URL and GEMINI_API_KEY required
- **Build Process**: Vite build for frontend, esbuild for backend bundling
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage

### Key Features
- **Internationalization**: All content in Brazilian Portuguese (PT-BR)
- **Rate Limiting**: 10 requests per minute for chat endpoints
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Security**: Input validation, CORS configuration, session management
- **Performance**: Optimized queries, lazy loading, and efficient state management

The application is designed to be scalable, maintainable, and user-friendly while providing specialized AI-powered ergogenic protocol consultations with a distinctive futuristic aesthetic.