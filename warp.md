# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Quizzle is a daily trivia API built with Hono framework running on Cloudflare Workers. It provides one trivia question per category per day, designed for global edge distribution with sub-50ms response times.

### Technology Stack

- **Runtime**: Cloudflare Workers (edge computing)
- **Framework**: Hono (fast, lightweight web framework)
- **Database**: Cloudflare D1 (globally distributed SQLite)
- **ORM**: Drizzle ORM with Zod validation
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Vitest
- **Deployment**: Wrangler CLI

## Common Commands

### Development

```bash
pnpm dev                    # Start development server with Wrangler
pnpm run cf-typegen         # Generate Cloudflare Worker types
pnpm typecheck              # Run TypeScript type checking
```

### Testing

```bash
pnpm test                   # Run tests in watch mode
pnpm run test:run           # Run tests once
pnpm run test:ui            # Run tests with UI interface
```

### Code Quality

```bash
pnpm lint                   # Run ESLint
pnpm lint:fix               # Auto-fix ESLint issues
```

### Database

```bash
# Database operations require D1 token and database ID in environment
npx drizzle-kit generate    # Generate database migrations
npx drizzle-kit migrate     # Run database migrations
```

### Deployment

```bash
pnpm deploy                 # Deploy to Cloudflare Workers with minification
```

## Architecture Overview

### Project Structure

```
src/
├── server.ts                    # Main Hono app with middleware chain
├── bindings.d.ts                # TypeScript environment bindings
├── db/
│   ├── index.ts                 # Database connection initialization
│   └── schema/                  # Drizzle schema definitions with Zod validation
├── [feature]/
│   ├── [feature].controller.ts  # HTTP route handlers with validation
│   ├── [feature].service.ts     # Business logic and database operations
│   └── [feature].spec.ts        # Unit tests
└── middlewares/
    ├── jwt.ts                   # JWT authentication (applied globally)
    └── rate-limiter.ts          # Cloudflare rate limiting
```

### Application Flow

1. **Entry Point**: `src/server.ts` creates Hono app with `/api` base path
2. **Middleware Chain**: JWT auth → Logging → Rate limiting → Route handlers
3. **Route Organization**: Controllers handle HTTP logic, services handle business logic
4. **Database**: Drizzle ORM with type-safe schema definitions and Zod validation
5. **Testing**: Vitest with service mocking and HTTP request testing

### Key Architectural Patterns

#### Environment-Driven Configuration

- All environment variables are strongly typed in `bindings.d.ts`
- Database connection uses Cloudflare D1 binding (`QUIZZLE_DB`)
- JWT secret and rate limiting configured via environment

#### Service Layer Pattern

- Controllers handle HTTP concerns (validation, responses)
- Services handle business logic and database operations
- Clear separation allows for easy testing and reusability

#### Global Middleware Application

```typescript
app
  .use(jwtMiddleware) // JWT auth on all routes
  .use(pinoLogger()) // Request logging
  .use(rateLimiter); // Rate limiting per IP
```

#### Type-Safe Database Operations

- Drizzle schema generates TypeScript types
- Zod schemas for runtime validation
- Insert/Select/Update schemas auto-generated from table definitions

## Environment Configuration

### Required Environment Variables

```bash
NODE_ENV=development
JWT_SECRET=your-jwt-secret
ACCOUNT_ID=cloudflare-account-id    # For D1 operations
DB_ID=cloudflare-database-id        # For D1 operations
D1_TOKEN=cloudflare-d1-token        # For D1 operations
```

### Cloudflare Configuration

- **D1 Database**: `QUIZZLE_DB` binding in `wrangler.jsonc`
- **Rate Limiter**: `SERVER_RATE_LIMITER` binding (60 requests/minute)
- **Compatibility Date**: 2025-10-09

## Business Logic Implementation

### Daily Trivia System

- One question per category per day (enforced by unique constraint)
- Date-based question scheduling using `daily_questions` table
- Category-based question organization
- JWT authentication for admin endpoints, public access for question retrieval

### Database Schema Design

```sql
categories: id, name, slug, description, isActive, displayOrder, timestamps
questions: id, category_id, question_text, options, correct_answer, difficulty, metadata
daily_questions: id, question_id, category_id, scheduled_date (unique per category/date)
user_responses: id, user_id, question_id, user_answer, is_correct, response_time
```

## Testing Strategy

### Unit Testing Approach

- Service layer testing with database mocking
- Controller testing with service mocking
- HTTP request/response testing using Hono test utilities
- Mock environment setup for Cloudflare bindings

### Test File Organization

- `.spec.ts` files alongside source files
- Service mocking using `vi.mock()`
- Environment bindings mocked for testing

## Development Guidelines

### Code Style

- **ESLint Config**: @antfu/eslint-config with TypeScript
- **File Naming**: kebab-case for all files except README.md
- **Import Style**: Explicit `.js` extensions required for Node.js compatibility
- **Type Definitions**: Prefer `type` over `interface`

### Error Handling

- Controllers return appropriate HTTP status codes
- Services throw descriptive errors with cause chaining
- Global error handling via Hono middleware

### Security Considerations

- JWT authentication middleware applied globally
- Rate limiting per IP address using Cloudflare bindings
- Environment variables strictly typed and validated
- SQL injection protection via Drizzle ORM parameterized queries

## Current Implementation Status

### ✅ Completed

- Hono framework setup with TypeScript
- Cloudflare Workers + D1 database integration
- Categories CRUD operations with full test coverage
- JWT authentication and rate limiting middleware
- Drizzle ORM with Zod validation schemas
- Development and deployment pipeline

### 🔄 In Development

- Questions table schema and CRUD operations
- Daily scheduling system implementation
- Core trivia API endpoints (`/questions/today`, `/questions/category/{name}`)
- Admin question management endpoints

### 📋 Planned Features

- Answer submission and validation system
- Question scheduling and rotation logic
- Enhanced caching with Cloudflare Cache API
- Performance optimization and monitoring
