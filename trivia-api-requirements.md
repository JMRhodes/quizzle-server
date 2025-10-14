# Trivia API Requirements

**Project**: Quizzle Server - Daily Trivia API
**Created**: 2025-10-08
**Last Updated**: 2025-10-08

## Technology Stack

### Core Framework & Runtime

- **Hono Framework**: Fast, lightweight web framework for edge computing
- **Cloudflare Workers**: Edge runtime for global distribution
- **TypeScript**: Type-safe development with full IntelliSense

### Database & ORM

- **Cloudflare D1**: Globally distributed SQLite database
- **Drizzle ORM**: Type-safe SQL toolkit with excellent TypeScript integration
- **Zod**: Runtime validation and schema generation

### Development & Deployment

- **Vitest**: Modern testing framework with great TypeScript support
- **Wrangler**: Cloudflare's CLI for local development and deployment
- **PNPM**: Fast, efficient package manager

### Architecture Benefits

- **Edge-First**: Sub-50ms response times globally
- **Type Safety**: End-to-end TypeScript from database to API
- **Cost Effective**: Pay-per-request serverless pricing
- **Zero Config**: Minimal setup with maximum performance

## Overview

The Trivia API is designed to provide one trivia question per category per day. This ensures users get fresh content daily while maintaining engagement through consistent, predictable content delivery.

## Authentication & Authorization

### JWT Authentication System

The API uses JSON Web Tokens (JWT) for authentication. The system supports two types of access:

#### Public Endpoints (No Authentication Required)

- `GET /questions/today` - Get today's questions
- `GET /questions/category/{categoryName}` - Get question by category
- `GET /categories` - List all categories
- `POST /questions/{questionId}/answer` - Submit answers (optional user tracking)

#### Protected Endpoints (JWT Required)

- All `/admin/*` endpoints require valid JWT authentication
- Admin endpoints include question management, category management, and scheduling

#### JWT Configuration

```typescript
// Environment Variables
JWT_SECRET: string; // Secret key for signing/verifying tokens

// Middleware Implementation (already implemented)
// Applied globally to all routes in src/server.ts
app.use(jwtMiddleware);
```

#### Authentication Flow

1. Obtain JWT token through external authentication system
2. Include token in Authorization header: `Bearer <token>`
3. Middleware validates token using JWT_SECRET
4. Protected routes receive validated payload via `c.get('jwtPayload')`

#### Token Payload Structure

```typescript
type JWTPayload = {
  sub: string; // User ID
  role: string; // User role (admin, user, etc.)
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
};
```

## Core Business Logic

### Daily Question System

- **One Question Per Category Per Day**: Each trivia category gets exactly one question per calendar day
- **Date-Based Delivery**: Questions are tied to specific dates for consistency
- **Category-Based Organization**: Questions are organized into distinct categories (science, history, sports, etc.)
- **Scheduled Content**: Questions can be pre-scheduled for future dates
- **Fallback Handling**: System gracefully handles missing questions for any category/date

## API Endpoints

### Core User Endpoints

#### 1. Get Today's Questions

```
GET /questions/today
GET /questions/today?categories=science,history,sports
```

**Purpose**: Returns all daily questions for today, with optional category filtering
**Use Case**: Dashboard view showing all available questions
**Response**: Array of question objects for the current date

#### 2. Get Question by Category

```
GET /questions/category/{categoryName}
GET /questions/category/{categoryName}?date=2025-10-08
```

**Purpose**: Returns today's question for a specific category
**Use Case**: Primary endpoint for category-specific trivia retrieval
**Response**: Single question object
**Notes**: Default to today's date if no date parameter provided

#### 3. List Categories

```
GET /categories
```

**Purpose**: Returns all available trivia categories
**Use Case**: Frontend category selection, navigation
**Response**: Array of category objects with metadata

#### 4. Submit Answer (Optional)

```
POST /questions/{questionId}/answer
```

**Purpose**: Submit user answer and get immediate feedback
**Body**: `{ "answer": "user_answer" }`
**Response**: Correctness feedback and explanation
**Use Case**: Interactive trivia with instant results

### Administrative Endpoints

#### 5. Question Management

```
GET /admin/questions                    # List all questions (paginated)
POST /admin/questions                   # Create new question
PUT /admin/questions/{id}               # Update existing question
DELETE /admin/questions/{id}            # Delete question
GET /admin/questions/schedule           # View scheduled questions
```

#### 6. Category Management

```
GET /admin/categories                   # List categories
POST /admin/categories                  # Create category
PUT /admin/categories/{id}              # Update category
DELETE /admin/categories/{id}           # Delete category
```

#### 7. Schedule Management

```
GET /admin/schedule                     # View daily question schedule
POST /admin/schedule                    # Schedule questions for dates
PUT /admin/schedule/{id}                # Update scheduled question
DELETE /admin/schedule/{id}             # Remove from schedule
```

## Data Models

### Database Schema

#### Categories Table (Already Implemented)

```sql
categories: {
  id: integer PRIMARY KEY AUTOINCREMENT,
  name: text NOT NULL UNIQUE,
  slug: text NOT NULL UNIQUE,
  description: text,
  isActive: integer DEFAULT true NOT NULL, -- boolean stored as integer
  display_order: integer DEFAULT 0 NOT NULL,
  createdAt: integer DEFAULT (CURRENT_TIMESTAMP), -- timestamp stored as integer
  updatedAt: integer DEFAULT (CURRENT_TIMESTAMP)
}
```

#### Questions Table

```sql
questions: {
  id: integer PRIMARY KEY AUTOINCREMENT,
  category_id: integer REFERENCES categories(id),
  question_text: text NOT NULL,
  options: text, -- JSON string of array for multiple choice
  correct_answer: text NOT NULL,
  explanation: text,
  difficulty: text CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  metadata: text DEFAULT '{}', -- JSON string for tags, source, etc.
  is_active: integer DEFAULT true NOT NULL,
  created_at: integer DEFAULT (CURRENT_TIMESTAMP),
  updated_at: integer DEFAULT (CURRENT_TIMESTAMP)
}
```

#### Daily Questions Schedule Table

```sql
daily_questions: {
  id: integer PRIMARY KEY AUTOINCREMENT,
  question_id: integer REFERENCES questions(id),
  category_id: integer REFERENCES categories(id),
  scheduled_date: text NOT NULL, -- ISO date string (YYYY-MM-DD)
  is_active: integer DEFAULT true NOT NULL,
  created_at: integer DEFAULT (CURRENT_TIMESTAMP),

  UNIQUE(category_id, scheduled_date) -- Enforce one per category per day
}
```

#### User Responses Table (Optional)

```sql
user_responses: {
  id: integer PRIMARY KEY AUTOINCREMENT,
  user_id: text, -- If user system exists
  question_id: integer REFERENCES questions(id),
  daily_question_id: integer REFERENCES daily_questions(id),
  user_answer: text NOT NULL,
  is_correct: integer NOT NULL, -- boolean stored as integer
  response_time_ms: integer,
  created_at: integer DEFAULT (CURRENT_TIMESTAMP)
}
```

### Response Schemas

#### Question Object

```json
{
  "id": 1,
  "category": {
    "id": 1,
    "name": "Science",
    "slug": "science"
  },
  "question": "What is the chemical symbol for gold?",
  "options": ["Au", "Ag", "Go", "Gd"],
  "difficulty": "easy",
  "date": "2025-10-08",
  "metadata": {
    "source": "chemistry_basics",
    "tags": ["chemistry", "elements"],
    "explanation": "Gold's chemical symbol Au comes from its Latin name 'aurum'"
  }
}
```

#### Today's Questions Response

```json
{
  "date": "2025-10-08",
  "total_categories": 5,
  "available_questions": 4,
  "questions": [
    {
      "id": 1,
      "category": { "name": "Science", "slug": "science" },
      "question": "What is the chemical symbol for gold?",
      "options": ["Au", "Ag", "Go", "Gd"],
      "difficulty": "easy"
    }
  ],
  "missing_categories": ["sports"] // Categories without questions today
}
```

#### Categories Response

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Science",
      "slug": "science",
      "description": "Questions about physics, chemistry, biology, and more",
      "isActive": true,
      "question_count": 150,
      "last_question_date": "2025-10-08"
    }
  ]
}
```

## Technical Requirements

### Hono Framework Implementation

#### Module Structure

```
src/
├── server.ts                     # Main Hono app with middleware
├── bindings.d.ts                 # TypeScript environment bindings
├── db/
│   ├── index.ts                  # Database connection setup
│   └── schema/
│       ├── categories.ts         # Category schema with Zod validation
│       ├── questions.ts          # Questions schema
│       └── daily-questions.ts    # Daily scheduling schema
├── categories/
│   ├── categories.controller.ts  # Category route handlers
│   ├── categories.service.ts     # Category business logic
│   └── categories.controller.spec.ts # Category tests
├── questions/
│   ├── questions.controller.ts   # Question route handlers
│   ├── questions.service.ts      # Question business logic
│   ├── schedule.service.ts       # Daily scheduling logic
│   └── questions.controller.spec.ts # Question tests
└── middlewares/
    ├── jwt.ts                    # JWT authentication middleware
    └── rate-limiter.ts           # Rate limiting middleware
```

#### Key Services

##### QuestionsService

```typescript
export const questionsService = {
  getTodaysQuestions: async (categories?: string[], c: Context<Environment>): Promise<Question[]> => {},
  getQuestionByCategory: async (category: string, date?: string, c: Context<Environment>): Promise<Question> => {},
  createQuestion: async (data: z.infer<typeof insertQuestionSchema>, c: Context<Environment>): Promise<any> => {},
  scheduleQuestion: async (questionId: number, date: string, categoryId: number, c: Context<Environment>): Promise<void> => {}
};
```

##### ScheduleService

```typescript
export const scheduleService = {
  generateDailySchedule: async (date: string, c: Context<Environment>): Promise<void> => {},
  getScheduleForDate: async (date: string, c: Context<Environment>): Promise<DailyQuestion[]> => {},
  ensureQuestionsForDate: async (date: string, c: Context<Environment>): Promise<void> => {}
};
```

##### CategoriesService (Already Implemented)

```typescript
export const categoriesService = {
  getAllCategories: async (c: Context<Environment>): Promise<Category[]> => {},
  getActiveCategories: async (c: Context<Environment>): Promise<Category[]> => {},
  createCategory: async (data: z.infer<typeof insertCategorySchema>, c: Context<Environment>): Promise<any> => {}
};
```

### Performance & Caching

#### Caching Strategy (Cloudflare Workers + D1)

- **Edge Caching**: Static content cached at CDN level globally
- **Daily Questions Cache**: Today's questions cached for 1 hour using Cloudflare's Cache API
- **Categories Cache**: Active categories cached for 24 hours
- **Question Cache**: Individual questions cached for 6 hours
- **D1 Connection**: Automatic connection pooling and regional optimization

#### Database Optimization (SQLite/D1)

- Index on `daily_questions(scheduled_date, is_active)`
- Index on `questions(category_id, is_active)`
- Index on `categories(isActive, display_order)`
- Compound index on `daily_questions(category_id, scheduled_date)` for unique constraint

#### Cloudflare Workers Benefits

- **Global Distribution**: Sub-50ms response times worldwide
- **Auto-scaling**: Handles traffic spikes automatically
- **Cost Efficiency**: Pay-per-request pricing model
- **Edge Compute**: Logic runs close to users

### Business Logic Rules

#### Daily Question Generation

1. **Auto-Scheduling**: System can automatically schedule questions based on priority/rotation
2. **Manual Override**: Admins can manually schedule specific questions for specific dates
3. **Fallback Questions**: If no question scheduled, system selects from unscheduled questions in category
4. **Question Rotation**: Prevent recently used questions from being scheduled too soon

#### Category Management

1. **Active Categories**: Only active categories appear in public endpoints
2. **Display Order**: Categories can be ordered for consistent UI presentation
3. **Slug-based Access**: Categories accessible via human-readable slugs

#### Answer Validation

1. **Exact Match**: Default to exact string matching for answers
2. **Case Insensitive**: Ignore case differences in answers
3. **Trim Whitespace**: Remove leading/trailing spaces
4. **Multiple Choice**: Support for A/B/C/D style answers vs full text

## API Features

### Error Handling

- **404**: Question not found for category/date
- **400**: Invalid date format or category
- **429**: Rate limiting for answer submissions
- **500**: Database or scheduling errors

### Rate Limiting

- **Question Retrieval**: 100 requests per minute per IP
- **Answer Submission**: 10 submissions per minute per user
- **Admin Endpoints**: 20 requests per minute per admin user

### Validation

- **Date Format**: ISO 8601 date strings (YYYY-MM-DD)
- **Category Names**: Alphanumeric + hyphens, lowercase
- **Question Length**: 10-500 characters
- **Options Array**: 2-6 options for multiple choice

## Future Enhancements

### Phase 2 Features

- **User Accounts**: Track individual user progress and streaks
- **Leaderboards**: Daily, weekly, monthly scoring systems
- **Difficulty Scaling**: Adaptive difficulty based on user performance
- **Question Types**: True/false, fill-in-blank, image-based questions
- **Hints System**: Optional hints for difficult questions

### Phase 3 Features

- **Custom Categories**: Users create personal trivia categories
- **Question Submission**: Community-generated content with moderation
- **Multiplayer**: Real-time trivia competitions
- **Analytics**: Detailed performance analytics and insights
- **Mobile Push**: Notifications for daily questions

## Development Priorities

### MVP (Phase 1)

1. ✅ Core database schema (Categories implemented)
2. ✅ Basic category management endpoints
3. ✅ Authentication middleware (JWT)
4. ✅ Rate limiting and middleware setup
5. 🔄 Questions database schema (Next: implement questions table)
6. 🔄 Daily scheduling system (Next: implement daily_questions table)
7. 🔄 Basic question retrieval endpoints (Next: GET /questions/today, GET /questions/category/{categoryName})
8. 🔄 Admin question management endpoints

### Current Implementation Status

**Completed:**

- ✅ Hono framework setup with TypeScript
- ✅ D1 database integration with Drizzle ORM
- ✅ Categories table with full CRUD operations
- ✅ Zod validation for API inputs/outputs
- ✅ JWT authentication middleware
- ✅ Rate limiting middleware
- ✅ Comprehensive test suite for categories
- ✅ Cloudflare Workers deployment configuration

**In Progress:**

- 🔄 Requirements documentation updates

**Next Steps:**

- 📝 Questions table schema and migration
- 📝 Daily scheduling table schema
- 📝 Core question retrieval endpoints
- 📝 Question scheduling business logic

### Post-MVP

1. Answer submission and validation
2. Caching implementation
3. Auto-scheduling algorithms
4. Rate limiting and security
5. Performance optimization

## Testing Strategy

### Unit Tests

- Service layer business logic
- DTO validation
- Date handling utilities
- Answer validation logic

### Integration Tests

- Database operations
- API endpoint responses
- Daily scheduling workflow
- Cache invalidation

### E2E Tests

- Complete question retrieval flow
- Admin question management
- Daily rollover scenarios
- Error handling paths

---

This requirements document serves as the single source of truth for the Trivia API implementation. All development should reference and update this document as the project evolves.
