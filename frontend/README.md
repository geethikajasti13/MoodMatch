# MoodMatch

**Your Mood. Your Match. Your Next Story.**

MoodMatch is a full-stack JavaScript web app that recommends books, movies, and
series based on how you're feeling. Describe your mood in a sentence, and a
transparent, rule-based keyword engine interprets it and matches it against a
curated collection of real content.

Built as a college JavaScript project using **React + Vite** on the frontend and
**Node.js + Express + MongoDB Atlas + Mongoose** on the backend.

---

## Features

| Feature | Description |
|---|---|
| **Home** | A mood-description textarea with a "Find My Match" button and example prompts. |
| **Mood interpretation** | A modular, rule-based JavaScript service maps your words to moods, themes, and intensity. It uses keyword dictionaries — **not AI** — so the logic is fully transparent. |
| **Results** | Books, movies, and series ranked by how well they match your interpreted mood, with a breakdown of detected moods, intensity, and matched keywords. |
| **Discover** | Search by title/creator/genre and filter by type, genre, mood, and intensity. |
| **Content detail** | Full pages for each title with description, moods, genres, themes, and "You might also like" recommendations. |
| **My List** | Bookmark any title with one click. Bookmarks persist in your browser across sessions. |
| **REST API** | Express endpoints for content listing, filtering, detail, and recommendations, backed by MongoDB Atlas. |
| **States** | Loading skeletons, error messages with retry, and empty states everywhere data is fetched. |

---

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, Lucide icons
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas (cloud-hosted MongoDB)
- **Mood engine:** A standalone, rule-based keyword-matching module (no AI/ML)

---

## Project Structure

```
moodmatch/
├── src/                        # Frontend (React + Vite)
│   ├── components/             # Navbar, Footer, ContentCard, States
│   ├── data/content.ts         # Curated content dataset (also used as fallback)
│   ├── hooks/useBookmarks.ts   # Bookmark state hook
│   ├── pages/                  # Home, Results, Discover, ContentDetail, MyList
│   ├── services/
│   │   ├── api.ts              # API client with backend + local fallback
│   │   ├── bookmarks.ts        # localStorage bookmark service
│   │   └── moodEngine.ts       # Rule-based mood interpretation engine
│   └── types.ts                # Shared TypeScript types
├── server/                     # Backend (Express + MongoDB)
│   ├── models/Content.js       # Mongoose schema
│   ├── routes/content.js       # REST API endpoints
│   ├── seed/                   # Seed data + seeding script
│   ├── index.js                # Express server entry point
│   └── .env.example            # Backend environment template
└── .env.example                # Frontend environment template
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** installed
- A **MongoDB Atlas** account (free tier is fine) — [sign up here](https://www.mongodb.com/atlas)

### Step 1 — Clone & install frontend dependencies

```bash
npm install
```

### Step 2 — Install backend dependencies

```bash
cd server
npm install
cd ..
```

### Step 3 — Set up MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user with a username and password.
3. Under **Network Access**, allow your IP address (or `0.0.0.0/0` for development).
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. In the connection string, add your database name before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moodmatch?retryWrites=true&w=majority
   ```

### Step 4 — Configure backend environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and paste your connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/moodmatch?retryWrites=true&w=majority
PORT=5000
CLIENT_ORIGINS=http://localhost:5173
```

### Step 5 — (Optional) Configure frontend environment

```bash
cp .env.example .env
```

The defaults work for local development. Only change `VITE_API_URL` if your
backend runs on a different port.

### Step 6 — Seed the database

```bash
cd server
npm run seed
cd ..
```

This inserts all content records into your MongoDB Atlas database.

### Step 7 — Run the app

**Terminal 1 — start the backend:**
```bash
cd server
npm start
```
The API runs at `http://localhost:5000`.

**Terminal 2 — start the frontend:**
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser and start matching!

---

## Running Without a Backend (Fallback Mode)

If you just want to see the frontend without setting up MongoDB, simply run:

```bash
npm install
npm run dev
```

The app detects that the backend is unavailable and automatically uses its
bundled in-browser dataset. All features — mood matching, search, filters,
bookmarks, detail pages — work in this mode. You just won't have a real
database behind it.

To **disable** the fallback and require the backend, set `VITE_ALLOW_FALLBACK=false` in `.env`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check (used by frontend to detect backend). |
| `GET` | `/api/content` | List all content. Optional query params: `search`, `type`, `genre`, `mood`, `intensity`. |
| `GET` | `/api/content/:id` | Get a single content record by ID. |
| `POST` | `/api/recommend` | Get recommendations. Body: `{ "interpretation": { "primaryMoods": [...], "intensity": "light\|moderate\|intense" } }`. |

---

## How the Mood Engine Works

The mood engine (`src/services/moodEngine.ts`) is a **rule-based keyword matcher**:

1. It normalizes your input to lowercase.
2. It checks your text against keyword dictionaries for each mood (e.g., "cozy" →
   `cozy`, `comfort`, `warm`, `blanket`, `tea`, `rainy`…).
3. Moods with more keyword hits rank higher.
4. Intensity is inferred from keywords like "intense", "light", "deep", "cozy".
5. Content is scored by how many of its tagged moods overlap with your interpreted
   moods, weighted by rank.

**This is not AI.** It's transparent keyword matching — no machine learning, no
ratings are invented, and no claims of intelligence are made.

---

## About the Content Data

- All books, movies, and series are **real titles** with **honest metadata**
  (real authors, directors, years, genres, and page/runtime counts).
- Cover images are **representative stock photography from Pexels**, not
  official copyrighted cover art or movie posters. Each record credits its
  source.
- **No ratings are invented.** The app does not assign star ratings or scores
  to titles — it only ranks them by mood relevance.

---

## Features That Require Additional Setup

| Feature | Setup needed |
|---|---|
| **MongoDB database** | A MongoDB Atlas account and connection string in `server/.env`. Without it, the app runs in fallback mode using bundled data. |
| **Seeding the database** | Run `npm run seed` inside `server/` after configuring `MONGODB_URI`. |
| **Backend API** | Run `npm start` inside `server/`. The frontend auto-detects whether it's available. |
| **Bookmarks** | Work out of the box (stored in your browser). To sync across devices, you'd need to add user authentication and a bookmarks collection in MongoDB. |

---

## Scripts

**Frontend (project root):**
| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run TypeScript type checking |

**Backend (`server/`):**
| Command | Description |
|---|---|
| `npm start` | Start the Express server |
| `npm run dev` | Start with auto-reload on file changes |
| `npm run seed` | Populate MongoDB with content records |

---

## License

This project is created for educational purposes as a college JavaScript project.
