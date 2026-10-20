# MoodMatch Backend API

MoodMatch is a mood-based entertainment recommendation platform backend built with **Node.js**, **Express.js**, and **MongoDB / Mongoose**.

The backend accepts natural-language descriptions of user feelings, infers likely moods and desired experiences using rule-based algorithms, retrieves relevant content from MongoDB, ranks recommendations based on relevance scoring, and returns structured JSON responses with data-grounded explanations.

---

## Architecture & Folder Structure

```
backend/
├── models/
│   ├── Content.js          # MongoDB schema & model for movies, series, books
│   └── SavedContent.js     # Schema for user/session saved content (with duplicate prevention)
├── controllers/
│   ├── contentController.js        # Content listing, multi-criteria filtering, search & detail
│   ├── recommendationController.js # Recommendation ranking, scoring & explanation generator
│   └── savedController.js         # Saved content CRUD operations
├── routes/
│   ├── contentRoutes.js        # /api/content routes
│   ├── recommendationRoutes.js # /api/recommend routes
│   └── savedRoutes.js          # /api/saved routes
├── services/
│   └── moodService.js      # Natural language mood inference, dictionary matching & negation
├── middleware/
│   └── errorHandler.js     # Centralized error handling & 404 handler
├── seed.js                 # Sample database seeder
├── test.js                 # Comprehensive automated test suite
├── server.js               # Express application entrypoint
├── package.json
├── .env.example
└── .gitignore
```

---

## 1. Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas cluster URI)

### Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` to match your environment:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodmatch
CLIENT_URL=http://localhost:5173
```

### Running the Server

```bash
# Start in development mode (with nodemon auto-reload)
npm run dev

# Start in production mode
npm start

# Seed sample content database
npm run seed

# Run automated test suite
npm test
```

---

## 2. API Endpoints

### 2.1 Health Check

#### `GET /api/health`
Returns system status. If the database connection fails, returns HTTP 503 degraded status and logs server-side error.

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "MoodMatch API"
}
```

---

### 2.2 Content API

#### `GET /api/content`
Retrieve entertainment content with optional multi-criteria filters and search.

**Query Parameters (all optional):**
- `type`: `movie` | `series` | `book` | `all`
- `genre`: e.g. `Comedy`, `Sci-Fi`, `Drama`
- `mood`: e.g. `stressed`, `curious`, `sad`
- `platform`: e.g. `Netflix`, `Apple TV+`, `Kindle`
- `intensity`: `low` | `medium` | `high`
- `search`: Case-insensitive title search (e.g. `search=place`)
- `page` & `limit`: Optional pagination (e.g. `page=1&limit=10`)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "67b6f72f001...",
      "title": "The Good Place",
      "contentType": "series",
      "platform": "Netflix",
      "isNetflixOriginal": false,
      "genres": ["Comedy", "Fantasy", "Philosophical"],
      "moods": ["stressed", "bored", "anxious"],
      "experiences": ["comfort", "laughter", "intellectual stimulation"],
      "intensity": "low",
      "description": "Four people try to become good people in a hilarious afterlife.",
      "posterUrl": "https://...",
      "externalUrl": "https://www.netflix.com/title/80113701",
      "createdAt": "2026-10-20T10:00:00.000Z"
    }
  ]
}
```

#### `GET /api/content/:id`
Retrieve a single content item by its MongoDB ObjectId.

- Returns **200 OK** with item details.
- Returns **400 Bad Request** if `:id` is not a valid 24-character hex ObjectId.
- Returns **404 Not Found** if no item exists with that ID.

---

### 2.3 Recommendation API

#### `POST /api/recommend`
Accepts natural-language descriptions of user feelings and returns ranked content recommendations with data-grounded explanations.

**Request Body:**
```json
{
  "response": "I had a stressful day and want something comforting",
  "contentType": "all"
}
```

**Validation:**
- `response`: Required string, trimmed, non-empty, max 1000 characters.
- `contentType`: Optional; must be one of `all`, `book`, `movie`, or `series` (defaults to `all`).

**Response (200 OK):**
```json
{
  "inferredMoods": ["stressed"],
  "desiredExperiences": ["comfort"],
  "intensity": "medium",
  "recommendations": [
    {
      "_id": "67b6f72f001...",
      "title": "The Good Place",
      "contentType": "series",
      "platform": "Netflix",
      "genres": ["Comedy", "Fantasy", "Philosophical"],
      "moods": ["stressed", "bored", "anxious"],
      "experiences": ["comfort", "laughter", "intellectual stimulation"],
      "intensity": "low",
      "description": "Four people try to become good people in a hilarious afterlife.",
      "posterUrl": "https://...",
      "externalUrl": "https://www.netflix.com/title/80113701",
      "matchScore": 5,
      "matchReason": "Matches your requested comfort experience and stressed mood."
    }
  ]
}
```

---

### 2.4 Saved Content API

#### `POST /api/saved`
Save a content item for an anonymous session or user.

**Request Body:**
```json
{
  "contentId": "67b6f72f001...",
  "sessionId": "anon-session-abc-123",
  "notes": "Watch this weekend"
}
```
*(Session ID can also be provided via header `x-session-id` or query parameter `?sessionId=...`)*

- Returns **201 Created** with populated content details.
- Returns **400 Bad Request** for missing fields or invalid ObjectId.
- Returns **404 Not Found** if contentId does not exist.
- Returns **409 Conflict** if already saved in this session (prevents duplicate saves).

#### `GET /api/saved`
Retrieve all saved content for a session:
```
GET /api/saved?sessionId=anon-session-abc-123
```
or via header `x-session-id: anon-session-abc-123`.

#### `DELETE /api/saved/:contentId`
Remove a saved item from a session list:
```
DELETE /api/saved/67b6f72f001?sessionId=anon-session-abc-123
```

---

## 3. Mood Interpretation Logic (`moodService.js`)

The service runs entirely locally without third-party AI APIs or billing requirements:
1. **Normalization**: Standardizes casing, apostrophes, and whitespace.
2. **Negation Filtering**: Looks back up to 3 tokens before a matched word. If preceded by negation words (`not`, `never`, `don't`, `stop feeling`, `no longer`), the keyword is suppressed. (e.g. *"I am not sad"* does not infer *sad*).
3. **Phrase-Aware Dictionaries**:
   - Matches multi-word phrases first (e.g., *"solve a mystery"*, *"makes me laugh"*, *"burnt out"*, *"edge of my seat"*).
   - Inferred Moods: `happy`, `sad`, `stressed`, `lonely`, `hopeful`, `motivated`, `curious`, `excited`, `relaxed`, `bored`, `nostalgic`, `anxious`.
   - Desired Experiences: `comfort`, `inspiration`, `laughter`, `suspense`, `adventure`, `escapism`, `emotional connection`, `intellectual stimulation`.
4. **Intensity Detection**:
   - `high`: detected from words like *very*, *extremely*, *super*, *intensely*, *overwhelmingly*.
   - `low`: detected from words like *a bit*, *slightly*, *a little*, *mildly*, *low-key*.
   - Default: `medium`.

---

## 4. Recommendation Scoring & Ranking

Each candidate item is evaluated using a deterministic scoring formula:
- **+3 points**: for each matched mood tag.
- **+2 points**: for each matched desired experience tag.
- **+1 point**: for matching intensity level.

Explanations (`matchReason`) are **strictly data-grounded**:
- Matches experience and mood: *"Matches your requested comfort experience and stressed mood."*
- Matches experience only: *"Matches your requested comfort experience."*
- Matches mood only: *"Curated for feeling stressed."*
- Fallback: *"Suggested pick from our catalog based on broad appeal."*

---

## 5. Testing with cURL

### Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### Recommendation Query
```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"response": "I had a stressful day and want something comforting", "contentType": "all"}'
```

### Filter Content
```bash
curl -X GET "http://localhost:5000/api/content?type=movie&intensity=low"
```

### Save Content
```bash
curl -X POST http://localhost:5000/api/saved \
  -H "Content-Type: application/json" \
  -d '{"contentId": "<CONTENT_ID>", "sessionId": "session-123"}'
```
