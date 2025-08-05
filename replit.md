# FleetPro - Fleet Management SaaS Application

## Overview

GestãoFrota (FleetPro) is a comprehensive SaaS web application for fleet management, designed to help companies manage their vehicle fleets with features including route optimization, preventive maintenance, and real-time tracking. The application is built with a modern full-stack architecture using React, TypeScript, Express.js, and PostgreSQL. The entire application has been translated to Portuguese with a modern, redesigned sidebar interface.

## User Preferences

Preferred communication style: Simple, everyday language.
Language: Portuguese (Brazil) - All UI text should be in Portuguese
Visual Structure: Modern sidebar design with different layout from current version
Recent Request: Translate entire application to Portuguese and redesign sidebar structure (Date: 2025-01-30)
Documentation: Complete technical documentation created in DOCUMENTATION.md covering architecture, database setup, and implementation details

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, utilizing a component-based architecture:
- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: Radix UI primitives with shadcn/ui components
- **State Management**: React Context for authentication and theme management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

The frontend follows a modular structure with separate concerns for:
- Pages (route components)
- Reusable UI components
- Context providers for global state
- Custom hooks for shared logic
- Type definitions for data models

### Backend Architecture
The backend uses Express.js with TypeScript in a RESTful API design:
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Data Storage**: Currently using in-memory storage with interface for easy database migration
- **API Design**: RESTful endpoints with consistent JSON responses
- **Error Handling**: Centralized error handling middleware

### Authentication System
- Simple email/password authentication
- Demo-friendly login (accepts any credentials for development)
- User session management with localStorage persistence
- Role-based access control structure in place

## Key Components

### Database Schema
The application defines four main entities:
- **Users**: Authentication and profile information
- **Vehicles**: Fleet vehicle details including status, location, and maintenance info
- **Routes**: Route planning with start/end locations, stops, and optimization data
- **Maintenance**: Preventive maintenance scheduling and tracking

### Core Features
1. **Dashboard**: Overview of fleet statistics and recent activities
2. **Vehicle Management**: Complete CRUD operations for fleet vehicles
3. **Route Planning**: Route optimization and management tools
4. **Maintenance Tracking**: Preventive maintenance scheduling and alerts
5. **Live Tracking**: Real-time vehicle location and status monitoring
6. **Reports & Analytics**: Fleet performance metrics and insights
7. **Billing & Subscriptions**: Complete SaaS monetization with Stripe integration
8. **Premium Features**: Advanced GPS tracking, AI optimization, and analytics
9. **Settings**: User profile and application preferences

### SaaS Monetization Features
1. **Subscription Plans**: Three-tier pricing with feature differentiation
2. **Payment Processing**: Secure Stripe integration for recurring billing
3. **Usage Tracking**: Real-time monitoring of plan limits and usage
4. **Premium Analytics**: Advanced reporting exclusive to paid plans
5. **GPS Tracking**: Live vehicle location monitoring (Professional+)
6. **AI Optimization**: Intelligent route planning and predictive maintenance (Enterprise)
7. **Add-on Services**: Extended functionality with modular pricing

### UI/UX Design
- **Theme System**: Light and dark mode support with smooth transitions
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation
- **Custom Design System**: Fleet-specific color palette and component styling

## Data Flow

### Client-Server Communication
1. **API Requests**: Frontend makes HTTP requests to Express.js backend
2. **Data Validation**: Zod schemas validate incoming data on both client and server
3. **Database Operations**: Drizzle ORM handles database interactions with type safety
4. **Response Handling**: Standardized JSON responses with error handling
5. **Client State**: TanStack Query manages server state with caching and synchronization

### Authentication Flow
1. User submits login credentials
2. Backend validates and returns user data (demo mode accepts any credentials)
3. Client stores user data in localStorage and context
4. Protected routes check authentication status
5. API requests include user context for authorization

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Forms**: React Hook Form with Hookform Resolvers for form management

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database Migrations**: Drizzle Kit for schema management
- **Linting**: TypeScript compiler for type checking
- **Development Server**: Express with Vite middleware for HMR

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to static assets
- **Backend**: esbuild bundles Node.js server for production
- **Assets**: Static files served from dist/public directory
- **Environment**: NODE_ENV determines development vs production behavior

### Production Configuration
- **Server**: Express serves both API and static frontend files
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Error Handling**: Production-safe error responses without sensitive information

### Development Features
- **Hot Module Replacement**: Vite HMR for instant feedback
- **Development Banner**: Replit integration for development environment
- **Runtime Error Overlay**: Enhanced error reporting in development
- **Auto-restart**: tsx for automatic server restart on changes

The architecture is designed for scalability and maintainability, with clear separation of concerns and type safety throughout the stack. The application can easily be extended with additional features while maintaining code quality and developer experience.

## Recent Changes (2025-01-30)

### Complete Portuguese Translation
- All UI text translated to Portuguese (Brazil)
- Forms, notifications, and error messages localized
- Page titles and descriptions updated
- Toast notifications and user feedback messages translated

### Modern Sidebar Redesign
- New dark gradient design with slate color scheme
- Expanded width (288px) for better content display
- Integrated user profile information in sidebar header
- Colored icons for each navigation section
- Modern hover effects and active state indicators
- Improved visual hierarchy and spacing

### Enhanced User Experience
- Modern card designs with better contrast and shadows
- Improved color scheme throughout the application
- Better responsive design for mobile and desktop
- Enhanced visual feedback for user interactions

### Monetization and Subscription System (2025-01-30)

#### Complete SaaS Monetization Implementation
- Full Stripe integration with subscription management
- Three-tier pricing model: Starter (R$99), Professional (R$299), Enterprise (R$799)
- Subscription billing page with plan comparison and usage tracking
- Premium features showcase with GPS tracking, advanced reports, and AI optimization
- Add-on services for extended functionality

#### Database Schema Enhancements
- Added subscription and billing tables (subscriptions, usage, plans)
- User subscription tracking with Stripe integration
- Usage monitoring and limits enforcement
- Payment history and billing cycle management

#### Premium Features Implementation
- Real-time GPS tracking with live vehicle locations
- Advanced analytics and reporting with fuel efficiency metrics
- AI-powered route optimization and predictive maintenance
- Cost analysis with detailed breakdown of expenses
- Professional-grade dashboard with enhanced insights

#### Backend API Extensions
- Stripe payment processing with checkout sessions
- Subscription management endpoints (create, cancel, update)
- Usage tracking and billing cycle calculations
- Premium feature access control and middleware
- Advanced reporting endpoints for analytics

#### Revenue Model
- Subscription-based recurring revenue with monthly billing
- Tiered pricing based on vehicle limits and feature access
- Add-on services for specialized functionality
- Enterprise custom solutions and white-label options
- API usage tracking for scalable pricing

### Technical Documentation
- Complete technical documentation created (DOCUMENTATION.md)
- Database migration guide from memory storage to PostgreSQL
- Architecture overview and component structure
- Security recommendations and production deployment guide
- Troubleshooting section and development workflows
- Monetization strategy documentation (MONETIZACAO_E_FUNCIONALIDADES.md)
- Local implementation guide (IMPLEMENTACAO_LOCAL.md)