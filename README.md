# MoodMatch

> A mood-based entertainment recommendation platform designed to suggest books, movies, TV shows, web series, and Netflix Originals based on how you describe your feelings and desired experiences in your own words.

---

## ⚡ Quick Start (Backend)

```bash
cd backend
npm install
npm run seed     # Seeds sample entertainment catalog (if MongoDB is running)
npm test         # Runs full 64-assertion test suite
npm run dev      # Starts server on port 5000 with nodemon
```

For detailed backend endpoints, environment variables, and scoring documentation, see [backend/README.md](backend/README.md).

---

## Current Project Status

**Current Status:** `Backend Complete & Tested / Frontend In Progress`

> [!NOTE]
> The Node.js + Express backend, rule-based mood interpretation engine, Mongoose models, recommendation scoring, and saved content API have been fully implemented and verified with a 64-assertion test suite. Frontend development is tracked separately.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement](#2-problem-statement)
- [3. Proposed Solution](#3-proposed-solution)
- [4. Project Objectives](#4-project-objectives)
- [5. Planned Application Features](#5-planned-application-features)
- [6. Technology Stack](#6-technology-stack)
- [7. Team Members and Role Allocation](#7-team-members-and-role-allocation)
  - [Member 1 — Frontend Developer](#member-1--frontend-developer)
  - [Member 2 — Backend Developer](#member-2--backend-developer)
  - [Member 3 — Database Developer (My Role)](#member-3--database-developer-my-role)
- [8. Deep Dive: Database Developer Responsibilities](#8-deep-dive-database-developer-responsibilities)
- [9. Planned Project Folder Structure](#9-planned-project-folder-structure)
- [10. High-Level Architecture](#10-high-level-architecture)
- [11. Planned Data Flow](#11-planned-data-flow)
- [12. Planned Database Schema and Collections](#12-planned-database-schema-and-collections)
- [13. Setup Prerequisites](#13-setup-prerequisites)
- [14. Future Setup and Run Instructions (Pending Implementation)](#14-future-setup-and-run-instructions-pending-implementation)
- [15. Development Roadmap](#15-development-roadmap)
- [16. Team Collaboration and Git Workflow](#16-team-collaboration-and-git-workflow)
- [17. Future Improvements](#17-future-improvements)

---

## 1. Project Overview

**Project Name:** MoodMatch  
**Project Type:** Mood-based entertainment recommendation website  
**Target Delivery:** Academic college project for JavaScript Framework course (modular one-day sprint architecture)

**MoodMatch** is a web platform designed to suggest books, movies, TV shows, web series, and Netflix Originals based on how users describe their current state of mind, emotions, interests, or desired experiences in their own words.

Instead of confining users to static genre pickers or predefined dropdown menus, MoodMatch allows them to type a short natural-language description (e.g., *"I had a long stressful workday and want something lighthearted, comforting, and funny"* or *"Looking for a mind-bending thriller that keeps me on edge"*). The backend interprets these descriptions using a lightweight, transparent, rule-based approach, mapping keywords and intents to matching entertainment entries stored in a MongoDB database.

---

## 2. Problem Statement

Modern streaming platforms and digital libraries offer vast libraries of content, yet users constantly suffer from **choice paralysis**. Existing recommendation engines typically rely on:
- Rigid genre classifications (e.g., "Action", "Comedy", "Drama") that fail to capture nuanced emotional requirements.
- Black-box collaborative filtering that recommends what others watched rather than what fits the user's immediate psychological state or energy level.
- Cumbersome multi-step survey forms that introduce friction when users simply want a quick, fitting suggestion.

Users often know *how they feel* or *what kind of vibe they seek*, but struggle to translate that into specific titles or rigid genre tags.

---

## 3. Proposed Solution

MoodMatch addresses choice paralysis by introducing a natural-language description interface backed by a rule-based recommendation pipeline:

1. **Free-Form Expression:** Users express what they want to feel or experience in free-form text.
2. **Deterministic Interpretation:** A transparent rule-based analyzer parses keyword tokens, mood indicators, and energy intensity markers without relying on complex, uninterpretable black-box models.
3. **Multi-Media Catalog:** Suggested items span diverse media types (books, movies, TV shows, web series, and Netflix Originals) categorized with rich emotional and thematic tags in MongoDB.
4. **Instant Relevance:** Users receive curated cards displaying summaries, mood tags, streaming platforms, and external links to explore or consume the content.

---

## 4. Project Objectives

1. **Build a user-centric web platform** that recommends entertainment based on users' described feelings, moods, and desired experiences.
2. **Explore a practical rule-based approach** to interpreting natural-language mood descriptions in a beginner-friendly and deterministic manner.
3. **Design and organize an entertainment catalog in MongoDB** with schemas supporting multi-faceted mood, genre, and intensity indexing.
4. **Develop a responsive, modern React interface** with smooth interactions, loading feedback, and clear content presentation.
5. **Connect frontend, backend, and database tiers** through clean, standardized RESTful APIs communicating via JSON.
6. **Support multi-dimensional browsing and filtering** across content types, genres, moods, and platforms.
7. **Establish a collaborative Git workflow** enabling a three-member development team to work in parallel cleanly and effectively.

---

## 5. Planned Application Features

> [!IMPORTANT]
> The features listed below are **planned** for implementation during the development phase. MoodMatch uses an accessible, rule-based keyword matching algorithm. It does **not** claim to use deep learning, artificial general intelligence, or clinically validated emotion detection.

- **Natural-Language Mood Input:** A clean, accessible text area where users describe their mood or desired atmosphere in everyday words.
- **Rule-Based Mood & Experience Interpretation:** Backend tokenization and keyword mapping linking descriptive phrases to emotional tags and themes.
- **Cross-Category Entertainment Recommendations:** Suggestions across five distinct entertainment types:
  - Books
  - Movies
  - TV Shows
  - Web Series
  - Netflix Originals
- **Relevance Scoring:** Basic scoring mechanism prioritizing items with the highest overlap of matched mood tags, experience keywords, and content intensity.
- **Content Filtering and Search:** Direct filters allowing users to refine suggestions by media type, primary genre, or mood tags.
- **Rich Content Cards:** Visual cards displaying title, media badge, genres, mood labels, synopsis, platform availability, and outbound reference links.
- **Optional Saved-Content List:** Client-side interface to bookmark or save recommended titles for later viewing/reading.
- **MongoDB-Backed Content Store:** Structured document store with curated entries and seed data.
- **Responsive Layout:** Adaptive user interface optimized for mobile, tablet, and desktop screens.

---

## 6. Technology Stack

The following technologies have been planned for MoodMatch. *All implementations will occur in designated subsequent development phases.*

| Layer | Planned Technology | Role / Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (via Vite) | Component-driven user interface and dynamic state management |
| **Frontend Styling** | Vanilla CSS / CSS Modules | Clean, responsive, modern aesthetic and layout styling |
| **Language** | JavaScript (ES6+) | Core programming language across both frontend and backend |
| **Backend** | Node.js & Express.js | Server runtime and REST API framework for routing & recommendation logic |
| **Database** | MongoDB with Mongoose | NoSQL document database and Object Data Modeling (ODM) schema layer |
| **API Protocol** | REST (JSON) | Client-server communication and structured data exchange |
| **Version Control** | Git & GitHub | Distributed version control, branch management, and collaborative tracking |
| **Tooling & Environment** | VS Code / Antigravity, npm | Development editor, package management, and script execution |
| **Database Deployment** | MongoDB Atlas / Local MongoDB | Cloud database hosting or local MongoDB Community daemon for development |

---

## 7. Team Members and Role Allocation

The MoodMatch development team consists of three members, each responsible for an architectural tier of the system.

```text
+---------------------------------------------------------------+
|                      MoodMatch Team                           |
+-------------------------------+-------------------------------+
| Member & Role                 | Primary Ownership             |
+-------------------------------+-------------------------------+
| [Enter Member 1 Name]         | Frontend Development (React)  |
| Member 1 — Frontend Developer |                               |
+-------------------------------+-------------------------------+
| [Enter Member 2 Name]         | Backend & Recommendation      |
| Member 2 — Backend Developer  | Logic (Node.js/Express)       |
+-------------------------------+-------------------------------+
| [Enter My Name]               | Database Design, Schemas,     |
| Member 3 — Database Developer | Seeding & Integration (Mongo) |
+-------------------------------+-------------------------------+
```

### Member 1 — Frontend Developer

- **Name:** `[Enter Member 1 Name]`
- **Primary Responsibility:** Frontend development and user experience.
- **Key Responsibilities:**
  - Build the user interface using React.js and Vite.
  - Design a responsive, visually appealing, and user-friendly MoodMatch layout.
  - Create the natural-language mood description input component.
  - Build recommendation cards, media badges, and content presentation components.
  - Implement search, multi-attribute filtering, category toggles, and optional saved-list interface.
  - Integrate frontend components with backend REST API endpoints.
  - Manage application loading states, empty states, and user-facing error notifications.

### Member 2 — Backend Developer

- **Name:** `[Enter Member 2 Name]`
- **Primary Responsibility:** Backend development and recommendation logic.
- **Key Responsibilities:**
  - Construct the server application using Node.js and Express.js.
  - Build RESTful API endpoints for content browsing, filtering, and mood-based recommendations.
  - Implement the rule-based mood interpretation engine.
  - Tokenize and analyze user input to extract mood descriptors and experience keywords.
  - Develop a lightweight scoring algorithm to rank relevant catalog records.
  - Validate inbound API payloads and deliver standardized JSON error responses.
  - Connect Express route controllers to the Mongoose data layer.

### Member 3 — Database Developer (My Role)

- **Name:** `[Enter My Name]`
- **Primary Responsibility:** Database design, management, data seeding, and query optimization.
- **Key Responsibilities:**
  - Design the MongoDB collection structure and indexing strategy for MoodMatch.
  - Create and maintain Mongoose schemas and data validation models.
  - Define all essential content attributes for books, movies, TV shows, web series, and Netflix Originals.
  - Plan and configure fields: title, content type, genres, moods, desired experiences, intensity, description, poster URL, platform, and external URL.
  - Curate an initial set of high-quality content records for development, testing, and demonstration.
  - Author a repeat-safe, idempotent database seeding script.
  - Configure database connection routines, error handling, and environment variable requirements with the backend developer.
  - Apply schema validations and indexes on frequently queried fields.
  - Verify that database queries efficiently support mood recommendations, category filtering, and keyword search.
  - Perform database testing and coordinate closely with frontend and backend teammates during integration.
  - Maintain up-to-date schema documentation and sample data guidelines in project docs.

---

## 8. Deep Dive: Database Developer Responsibilities

As the **Database Developer** for MoodMatch, my dedicated ownership spans the entire data lifecycle. While I work in close coordination with my team members, my specific technical deliverables include:

1. **Schema Architecture:**
   - Designing an extensible Mongoose schema that seamlessly accommodates multiple media formats (books, movies, TV shows, web series, and Netflix Originals) within a unified collection structure.
   - Normalizing categorical fields (such as `contentType` and `genres`) while supporting flexible arrays for `moods` and `desiredExperiences`.

2. **Attribute Definition:**
   - Ensuring every content item captures metadata required by both the recommendation engine and the frontend display card:
     - `title`: Name of the book, film, or series.
     - `contentType`: Enum (`Book`, `Movie`, `TV Show`, `Web Series`, `Netflix Original`).
     - `genres`: Array of standard genre classifications (e.g., `Sci-Fi`, `Psychological`, `Comedy`).
     - `moods`: Target emotional resonance tags (e.g., `uplifting`, `melancholic`, `cozy`, `tense`).
     - `desiredExperiences`: Narrative or thematic hooks (e.g., `escapism`, `intellectual challenge`, `comforting warmth`).
     - `intensity`: Integer or level indicator representing emotional or cognitive engagement depth.
     - `description`: Comprehensive synopsis of the title.
     - `posterUrl`: Clean image URL for media thumbnail rendering.
     - `platform`: Primary reading or viewing platform (e.g., `Netflix`, `Prime Video`, `Goodreads`, `Paperback`).
     - `externalUrl`: Direct link for users to learn more or watch/read the content.

3. **Curated Seed Dataset:**
   - Handcrafting a balanced initial dataset covering all 5 content types across varied mood spectrums (lighthearted, thrilling, introspective, cozy, adventurous).
   - Authoring an automated seeding script (`seed.js`) that safely clears and repopulates the development database without creating duplicate records.

4. **Query & Performance Validation:**
   - Crafting compound indexes on `contentType` and `moods` to guarantee sub-millisecond retrieval during keyword scoring lookups.
   - Collaborating with the Backend Developer to ensure Mongoose queries return clean JSON payloads formatted for direct frontend consumption.

---

## 9. Planned Project Folder Structure

The repository is organized into distinct directories separating frontend client code, backend server logic, and documentation:

```text
MoodMatch/
├── frontend/                 # Client-side React application (Vite-based)
│   └── .gitkeep              # Placeholder for Git directory tracking
├── backend/                  # Server-side Node.js & Express REST API
│   └── .gitkeep              # Placeholder for Git directory tracking
├── .gitignore                # Git ignore rules for node_modules, .env, build artifacts
└── README.md                 # Complete project documentation and architectural plan
```

### Intended Future Directory Breakdown

When implementation begins, the folders are planned to expand as follows:

```text
MoodMatch/
├── frontend/
│   ├── public/               # Static assets (favicons, icons)
│   ├── src/
│   │   ├── assets/           # Images, illustrations, styles
│   │   ├── components/       # Reusable React UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── MoodInput.jsx
│   │   │   ├── ContentCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── RecommendationList.jsx
│   │   ├── services/         # Axios / Fetch API client functions
│   │   ├── App.jsx           # Root React application component
│   │   └── main.jsx          # Vite React DOM entry point
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies and scripts
│   └── vite.config.js        # Vite build configuration
│
├── backend/
│   ├── config/               # Database and environment configurations
│   │   └── db.js             # Mongoose MongoDB connection handler
│   ├── controllers/          # Express route handler logic
│   │   ├── contentController.js
│   │   └── recommendationController.js
│   ├── models/               # Mongoose schemas and data models
│   │   └── Content.js        # Unified content schema
│   ├── routes/               # Express REST API routes
│   │   ├── contentRoutes.js
│   │   └── recommendationRoutes.js
│   ├── services/             # Rule-based mood interpretation & scoring logic
│   │   ├── moodEngine.js
│   │   └── keywordDictionary.js
│   ├── seeds/                # Seed scripts and initial JSON datasets
│   │   ├── seedData.json
│   │   └── seed.js
│   ├── .env.example          # Template for backend environment variables
│   ├── package.json          # Backend dependencies and scripts
│   └── server.js             # Main Express server entry point
│
├── .gitignore                # Root Git ignore configuration
└── README.md                 # Project documentation
```

---

## 10. High-Level Architecture

The following diagram illustrates the intended system architecture and request pipeline:

```text
User
  |
  v
React Frontend
  |
  v
Node.js + Express REST API
  |
  v
Rule-Based Mood Interpretation
  |
  v
MongoDB Database
  |
  v
Ranked Recommendations
  |
  v
React Frontend Displays Results
```

*Note: This diagram illustrates the planned architecture for the upcoming implementation phase and does not represent an active deployment.*

---

## 11. Planned Data Flow

The lifecycle of a single recommendation request proceeds through six distinct stages:

```
[1] User enters mood description in React frontend
     │
     ▼
[2] Frontend sends HTTP POST request with description payload to Express API
     │
     ▼
[3] Backend Mood Engine tokenizes text and matches against keyword rules
     │
     ▼
[4] Query constructed with matched mood tags, experiences, and intensity
     │
     ▼
[5] MongoDB retrieves matching candidate records using indexed fields
     │
     ▼
[6] Backend scores/ranks candidates and returns JSON to frontend
     │
     ▼
[7] React renders dynamic content cards with synopses, badges, and links
```

---

## 12. Planned Database Schema and Collections

### Collection: `contents`

The primary collection stores entertainment items across all media types.

| Field Name | Type | Required | Description | Example Values |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `String` | Yes | Title of the entertainment entry | `"Stranger Things"`, `"Dune"`, `"The Alchemist"` |
| `contentType` | `String` | Yes | Media type category (Enum) | `'Book'`, `'Movie'`, `'TV Show'`, `'Web Series'`, `'Netflix Original'` |
| `genres` | `[String]` | Yes | Array of associated traditional genres | `["Sci-Fi", "Mystery", "Horror"]` |
| `moods` | `[String]` | Yes | Array of emotional resonance keywords | `["tense", "nostalgic", "mysterious"]` |
| `desiredExperiences` | `[String]` | Yes | Thematic tags describing user experience | `["binge-worthy", "retro vibe", "supernatural suspense"]` |
| `intensity` | `Number` | Yes | Intensity rating from 1 (very mild) to 5 (heavy) | `4` |
| `description` | `String` | Yes | Detailed synopsis of the content | `"When a young boy vanishes, a small town uncovers a mystery..."` |
| `posterUrl` | `String` | Yes | URL pointing to poster/cover artwork | `"https://example.com/posters/stranger-things.jpg"` |
| `platform` | `String` | Yes | Primary streaming platform or distributor | `"Netflix"`, `"Prime Video"`, `"Goodreads"` |
| `externalUrl` | `String` | No | Link to stream, purchase, or read reviews | `"https://www.netflix.com/title/80057281"` |
| `createdAt` | `Date` | Auto | Timestamp of record creation | `2026-10-20T10:00:00.000Z` |

---

## 13. Setup Prerequisites

To prepare for future local development once code implementation starts, ensure the following tools are installed:

- **Node.js:** v18.x or v20.x LTS installed ([https://nodejs.org](https://nodejs.org/))
- **npm:** Package manager bundled with Node.js
- **MongoDB:** Either a local MongoDB Community Server running on `mongodb://localhost:27017` or a free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git:** Git CLI installed ([https://git-scm.com](https://git-scm.com/))
- **Code Editor:** Visual Studio Code or Google Antigravity

---

## 14. Future Setup and Run Instructions (Pending Implementation)

> [!WARNING]
> The commands below are **documentation references** for future use. Do not attempt to run these commands now, as dependencies and application scripts have not been created yet.

### Step 1: Clone the Repository
```bash
git clone https://github.com/[YOUR-USERNAME]/MoodMatch.git
cd MoodMatch
```

### Step 2: Backend Setup (Future)
```bash
cd backend
npm install
# Copy environment variables template
cp .env.example .env
# Configure PORT, MONGO_URI, and CLIENT_URL in .env
# Seed database with sample entertainment records
npm run seed
# Start backend development server
npm run dev
```

### Step 3: Frontend Setup (Future)
```bash
cd ../frontend
npm install
# Start Vite development server
npm run dev
```

---

## 15. Development Roadmap

```
Phase 1: Project Scaffolding & Architecture Documentation  ◄ [WE ARE HERE]
  ├── Repository structure initialized
  ├── .gitignore and .gitkeep files configured
  └── Comprehensive README documentation established

Phase 2: Database Modeling & Seeding (Database Developer)
  ├── Mongoose schemas and models finalized
  ├── Curated dataset spanning all 5 media formats prepared
  └── Repeat-safe database seeding script tested

Phase 3: Backend API & Rule-Based Recommendation Engine (Backend Developer)
  ├── Express server and MongoDB connection established
  ├── Keyword dictionary and rule-based matcher authored
  └── REST endpoints for content retrieval and recommendations implemented

Phase 4: Frontend UI Development & API Integration (Frontend Developer)
  ├── React components built with responsive CSS
  ├── Mood input form and filter controls created
  └── Integration with backend API endpoints completed

Phase 5: End-to-End Testing, Polish, and Academic Presentation
  ├── Cross-browser layout and responsive UI validation
  ├── Recommendation edge-case testing
  └── Project presentation and documentation finalization
```

---

## 16. Team Collaboration and Git Workflow

To maintain a clean Git commit history and avoid merge conflicts, our team adheres to the following collaboration practices:

1. **Main Branch Protection:** The `main` branch holds stable, reviewed code only. Direct commits to `main` are discouraged.
2. **Feature Branching:** Each team member develops on a dedicated branch:
   - Frontend Developer: `feature/frontend-ui`
   - Backend Developer: `feature/backend-api`
   - Database Developer: `feature/database-seed`
3. **Descriptive Commit Messages:** Commits should follow conventional formats:
   - `docs: update database schema documentation`
   - `feat: implement content model and validation`
   - `chore: configure seed script for entertainment catalog`
4. **Pull Requests & Code Reviews:** Changes are merged into `main` via pull requests after review and confirmation by teammates.

---

## 17. Future Improvements

Beyond the initial one-day sprint scope, potential future enhancements for MoodMatch include:

- **Expanded Keyword Corpus:** Broader synonym and sentiment dictionaries to recognize colloquial slang and varied phrasing.
- **User Authentication:** Optional accounts enabling users to save favorites, rate recommendations, and track watch/read history.
- **Dynamic Content Ingestion:** Integration with public APIs (e.g., TMDB, Google Books) for automated catalog updates.
- **Dark / Light Theme Toggle:** Customizable visual themes to match the user's aesthetic preference.
- **Multi-Mood Blends:** Support for complex hybrid moods (e.g., *"bittersweet nostalgia"* or *"cozy horror"*).

---

## License & Academic Disclaimer

This project is developed for educational purposes as part of the **JavaScript Framework (Semester V)** college curriculum. All media titles, synopses, and imagery references belong to their respective copyright holders.
>>>>>>> origin/main
