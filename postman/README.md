# Quizzle API Postman Collection

This directory contains a comprehensive Postman collection for testing the Quizzle daily trivia API built with Hono on Cloudflare Workers.

## Files Included

- `Quizzle-API.postman_collection.json` - Main API collection with all endpoints
- `Local-Development.postman_environment.json` - Environment for local development testing
- `Cloudflare-Production.postman_environment.json` - Environment for production testing

## Quick Start

### 1. Import into Postman

1. Open Postman
2. Click "Import"
3. Drag and drop all three JSON files or click "Upload Files"
4. Select the files and click "Import"

### 2. Configure Environment

**For Local Development:**

1. Select "Local Development" environment from the dropdown
2. Set your `jwt_token` variable with a valid JWT token
3. Ensure your local server is running (`pnpm dev`)

**For Production:**

1. Select "Cloudflare Production" environment
2. Update the `base_url` with your actual Cloudflare Worker URL
3. Set your `jwt_token` variable with a valid production JWT token

### 3. JWT Token Setup

The API requires JWT authentication for most endpoints. You'll need to:

1. Obtain a JWT token from your authentication system
2. Set it in the environment variable `jwt_token`
3. The token will be automatically included in request headers

**Token Format:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Collection Structure

### 🏥 Health Check

- **API Root** - Basic health check endpoint
  - Tests authentication vs unauthenticated responses
  - No JWT required (optional)

### 📁 Categories (Currently Implemented)

- **Get All Categories** - List all trivia categories
- **Get Category by ID** - Retrieve specific category
- **Create Category** - Add new category (Admin)
- **Update Category** - Modify existing category (Admin)
- **Delete Category** - Remove category (Admin)

### ❓ Questions (Future Implementation)

- **Get Today's Questions** - Retrieve daily questions
- **Get Question by Category** - Get question for specific category
- **Submit Answer** - Submit answer and get feedback

### 🔧 Admin (Future Implementation)

- **Questions Management** - CRUD operations for questions
- **Schedule Management** - Manage daily question scheduling

## Environment Variables

### Required Variables

- `base_url` - API base URL
- `jwt_token` - JWT authentication token

### Optional Variables

- `category_id` - Default category ID for testing (default: 1)
- `question_id` - Default question ID for testing (default: 1)
- `category_slug` - Default category slug (default: "science")
- `page` - Pagination page number (default: 1)
- `limit` - Items per page (default: 20)
- `date` - Date for queries (default: current date)
- `start_date` / `end_date` - Date ranges for schedule queries

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Payload Structure

```json
{
  "sub": "user-id",
  "role": "admin|user",
  "exp": 1729814400,
  "iat": 1729728000
}
```

### Public Endpoints (No Auth Required)

- `GET /api/` - Health check
- `GET /api/questions/today` - Today's questions (future)
- `GET /api/questions/category/{slug}` - Category questions (future)
- `POST /api/questions/{id}/answer` - Submit answers (future)

### Protected Endpoints (JWT Required)

- All `/api/categories/*` endpoints
- All `/api/admin/*` endpoints (future)

## Rate Limiting

The API implements rate limiting:

- **General endpoints:** 60 requests per minute per IP
- **Admin endpoints:** 20 requests per minute per admin user
- **Answer submissions:** 10 submissions per minute per user (future)

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1729814400
```

## Testing Features

### Automated Tests

Each request includes automated tests that verify:

- Response status codes
- Response structure and data types
- Required fields presence
- Response time performance
- JSON format validation

### Global Tests

Collection includes global tests for:

- Response time under 2000ms
- JSON content-type validation
- Basic error handling

### Pre-request Scripts

- Auto-populate common variables
- Set current date if not provided
- Generate dynamic test data

## API Response Formats

### Standard Success Response

```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

### JSON:API Format (Category by ID)

```json
{
  "data": {
    "type": "categories",
    "id": 1,
    "attributes": { /* category data */ }
  }
}
```

### Error Response

```json
{
  "message": "Error description",
  "errors": [
    { "detail": "Specific error details" }
  ]
}
```

## Development Workflow

### Local Testing

1. Start local development server: `pnpm dev`
2. Select "Local Development" environment
3. Run requests against `http://localhost:8787`

### Production Testing

1. Deploy to Cloudflare: `pnpm deploy`
2. Select "Cloudflare Production" environment
3. Update `base_url` with your worker URL
4. Run production tests

### Running Collection Tests

1. Click "Collections" → "Quizzle API"
2. Click "Run" to execute entire collection
3. Select environment and configure test settings
4. Review test results and performance metrics

## Troubleshooting

### Common Issues

**401 Unauthorized**

- Check JWT token validity and expiration
- Ensure token is set in environment variables
- Verify token format includes "Bearer " prefix

**404 Not Found**

- Verify base_URL is correct
- Check if endpoint is implemented (some are marked as "Future")
- Ensure local server is running for development

**Rate Limited (429)**

- Wait for rate limit reset
- Reduce request frequency
- Check rate limit headers for reset time

**Validation Errors (400)**

- Review request body format
- Check required fields in documentation
- Verify data types and constraints

### Getting Help

1. Check the WARP.md file for development guidance
2. Review the TRIVIA_API_REQUIREMENTS.md for API specifications
3. Check server logs for detailed error information
4. Verify environment configuration matches deployment

## Future Endpoints

The collection includes placeholder endpoints for future features:

- **Questions API** - Question retrieval and management
- **Admin Panel** - Administrative functionality
- **Answer Submission** - Interactive trivia responses
- **Schedule Management** - Daily question scheduling

These endpoints are documented with expected request/response formats but are not yet implemented in the server.

## Contributing

When adding new endpoints to the API:

1. Add corresponding requests to the Postman collection
2. Include proper authentication requirements
3. Add automated tests for validation
4. Update environment variables as needed
5. Document request/response formats with examples
6. Test against both local and production environments

## Security Notes

- Never commit JWT tokens to version control
- Use environment variables for sensitive data
- Rotate tokens regularly in production
- Monitor rate limit usage to prevent abuse
- Validate all input data through Zod schemas
