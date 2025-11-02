# Kangen Share

## Overview

Kangen Share is a community-driven web platform that enables users to request, offer, and share Kangen water. All users are providers by default and can freeze their availability to stop receiving requests. The application facilitates connections through features like request management, social following with follow/unfollow buttons on user profiles, real-time messaging, availability scheduling, and reviews. Built with a modern full-stack architecture, it emphasizes trust, community warmth, and clarity in user interactions.

## Recent Changes (November 2, 2025)

- **All users are providers**: Removed role-based provider designation; all users can receive water requests
- **Follow system**: Added follow/unfollow buttons to user profile pages with real-time status updates
- **Request Water form fixed**: Corrected field names to match schema (qtyLiters, locationText, windowStart, windowEnd)
- **Messages page enhancement**: Now supports direct navigation via /messages/:threadId URL parameter
- **User profile routes**: Added /users/:userId route for consistency alongside /profile/:userId
- **Notification payload fix**: Changed notification storage from 'payload' to 'payloadJson' field

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and caching

**UI Component System:**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom theme system with CSS variables for light/dark mode support

**Design Approach:**
- Reference-based design inspired by Airbnb (trust-building), Nextdoor (community focus), and TaskRabbit (matching patterns)
- Typography: Inter for UI elements, Merriweather for user-generated content
- Mobile-first responsive design with Tailwind breakpoints
- Accessibility-focused with ARIA attributes and keyboard navigation

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- WebSocket support via `ws` library for real-time messaging
- Session-based authentication using `express-session` with PostgreSQL session store

**API Design:**
- RESTful API endpoints organized by resource (users, requests, providers, messages, etc.)
- Middleware-based request logging and error handling
- Authentication middleware (`isAuthenticated`) for protected routes
- Role-based access control (user, provider, admin)

**Request Flow:**
1. Requests created by users with details (quantity, location, time window)
2. Status workflow: pending → accepted/rejected → completed/cancelled
3. Notifications sent to providers on request creation
4. Real-time updates via WebSocket for messaging and notifications

### Data Layer

**Database:**
- PostgreSQL as the primary relational database
- Neon serverless PostgreSQL for cloud deployment
- Drizzle ORM for type-safe database queries and schema management
- Drizzle Kit for schema migrations

**Schema Design:**
- **users**: Core user data with roles (user/provider/admin), profile info, location coordinates
- **requests**: Water sharing requests with status enum, requester/provider relationships
- **reviews**: One review per completed request, 1-5 star ratings with comments
- **follows**: Many-to-many user following relationships
- **message_threads**: Conversations between two users with unread counters
- **messages**: Individual messages within threads
- **availability_rules**: Recurring availability patterns using RRULE format
- **availability_exceptions**: Date-specific availability overrides (add/remove)
- **notifications**: In-app notification system with type-based payloads
- **sessions**: Express session storage for Replit Auth

**Data Access Pattern:**
- Storage abstraction layer (`server/storage.ts`) implementing IStorage interface
- Separation of concerns between database operations and business logic
- Query optimization using Drizzle's relational query builder

### Authentication & Authorization

**Authentication Provider:**
- Replit Auth with OpenID Connect (OIDC)
- Passport.js strategy for OIDC integration
- Session-based authentication with secure HTTP-only cookies
- Multiple login methods supported: Google, GitHub, X (Twitter), Apple, Email/Password
- Landing page displays visual icons for all available login methods

**Authorization Model:**
- Three-tier role system: user, provider, admin
- Role-based route protection
- Admin-only endpoints for moderation (user suspension, review removal)
- Per-resource authorization checks (e.g., only message participants can view thread)

### Real-time Features

**WebSocket Implementation:**
- WebSocket server running alongside Express HTTP server
- Custom hook (`useWebSocket`) for client-side connection management
- Automatic reconnection with exponential backoff (max 5 attempts)
- Message types: new_message, notifications
- Query invalidation triggers on WebSocket events for cache synchronization

**State Synchronization:**
- React Query cache invalidation on WebSocket messages
- Optimistic updates for immediate UI feedback
- Server-side broadcast to relevant connected clients

### Build & Deployment

**Development:**
- Separate client and server TypeScript compilation
- Hot module replacement (HMR) via Vite
- Path aliases for clean imports (@/, @shared/, @assets/)
- Replit-specific plugins for development banner and error overlay

**Production Build:**
- Client bundle built with Vite, output to `dist/public`
- Server bundle built with esbuild, ESM format
- Asset optimization and code splitting
- Static file serving from Express in production

**Environment Configuration:**
- DATABASE_URL for PostgreSQL connection
- SESSION_SECRET for session encryption
- ISSUER_URL for Replit OIDC provider
- REPL_ID for Replit-specific features

## External Dependencies

### Third-party Services

**Authentication:**
- Replit Auth (OpenID Connect provider)
- Requires ISSUER_URL and REPL_ID configuration

**Database:**
- Neon Serverless PostgreSQL
- Requires DATABASE_URL environment variable
- WebSocket support for serverless PostgreSQL connections

### Key Libraries

**UI & Styling:**
- @radix-ui/* primitives for accessible component foundation
- Tailwind CSS for styling system
- Lucide React for consistent iconography
- date-fns for date formatting and manipulation

**State Management:**
- @tanstack/react-query for server state and caching
- React Hook Form with Zod resolvers for form validation

**Database & Validation:**
- Drizzle ORM and drizzle-zod for database operations
- Zod for schema validation
- @neondatabase/serverless for PostgreSQL client

**Real-time Communication:**
- ws (WebSocket library) for bidirectional communication
- Custom WebSocket integration with React Query

**Session Management:**
- connect-pg-simple for PostgreSQL session store
- express-session for session middleware
- memoizee for configuration caching