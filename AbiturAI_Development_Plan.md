# AbiturAI — Backend Development Plan

**Version:** 1.0  
**Date:** May 23, 2026  
**Team:** 2 Backend Developers  
**Stack:** Laravel 12 (PHP) + FastAPI (Python RAG)

---

## 1. Project Overview

AbiturAI is an AI-powered DTM exam preparation platform for Uzbek students. The platform provides mock tests, AI tutoring (RAG-based), Feynman technique evaluation, and AI-powered question generation for teachers.

**Developers:**

| Developer | Role | Tech Stack | Focus Area |
|-----------|------|------------|------------|
| Developer 1 (You) | Laravel Backend | Laravel 12, MySQL, JWT Auth | Core API, Auth, CRUD, Dashboard, Profile |
| Developer 2 (Lilly) | Python RAG Service | FastAPI, ChromaDB, Gemini API | AI Services, RAG Pipeline, Embeddings |

**Repository:** https://github.com/kruzimatov/abitur_ai_backend.git

---

## 2. Frontend Analysis

Based on 6 HTML mockup source files analyzed from the `sources/` directory:

- `abiturai_landing.html` — Marketing landing page (public)
- `abiturai_dashboard.html` — Student dashboard with stats, subjects, streak, AI tutor widget
- `abiturai_teacher.html` — Teacher panel with content management, AI assistant, analytics
- `abiturai_test.html` — Mock test flow (start screen, test in progress, results)
- `abiturai_tutor.html` — Full-page AI Tutor chat with history panel, context chips
- `abiturai_spec.html` — UI specification document with all 14 pages, 4 AI features, user flows

### 2.1 Pages Expected by Frontend

| # | Page | URL | Role | Backend Status |
|---|------|-----|------|----------------|
| 1 | Landing Page | `/` | Public | N/A (static frontend) |
| 2 | Login | `/login/` | Public | DONE — `POST /api/auth/login` |
| 3 | Register | `/register/` | Public | DONE — `POST /api/auth/register` |
| 4 | Dashboard | `/dashboard/` | Student | PARTIAL — needs streak, subject progress |
| 5 | Subjects List | `/subjects/` | Student | DONE — `GET /api/subjects` |
| 6 | Topic List | `/subjects/<id>/` | Student | DONE — `GET /api/subjects/{id}/topics` |
| 7 | Darslik (Lesson) | `/topics/<id>/` | Student | DONE — `GET /api/topics/{id}` |
| 8 | Mock Test | `/topics/<id>/quiz/` | Student | DONE — `POST /api/quiz/start/{topicId}` |
| 9 | Test Result | `/results/<id>/` | Student | DONE — `GET /api/quiz/{id}/result` |
| 10 | AI Tutor | `/tutor/` | Student | PARTIAL — has `/api/tutor/ask` but no chat history |
| 11 | Profile | `/profile/` | Student | MISSING — no endpoint |
| 12 | Teacher Dashboard | `/teacher/` | Teacher | PARTIAL — missing teacher analytics |
| 13 | Add Question | `/teacher/questions/add/` | Teacher | DONE — generator exists |
| 14 | Analytics | `/teacher/analytics/` | Teacher | MISSING — no endpoint |

### 2.2 AI Features (4 total)

| # | Feature | Description | Who Uses | Status |
|---|---------|-------------|----------|--------|
| AI-01 | AI Xato Tahlili | Error diagnosis after test submit | Student | DONE — DiagnosisService |
| AI-02 | RAG AI Tutor | DTM material-based chat answers | Student | DONE — TutorController + RagService |
| AI-03 | Explain It Back | Feynman technique evaluation | Student | DONE — FeynmanController |
| AI-04 | AI Savol Generatori | Generate DTM questions from text | Teacher | DONE — GeneratorController |

### 2.3 Missing API Endpoints

**Student endpoints needed:**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/profile` | Student profile with stats |
| 2 | PUT | `/api/profile` | Update profile (firstname, lastname, gender) |
| 3 | GET | `/api/progress/subjects` | Per-subject progress breakdown |
| 4 | GET | `/api/streak` | Current streak + 30-day calendar |
| 5 | GET | `/api/tutor/history` | Chat sessions list |
| 6 | POST | `/api/tutor/chat` | Create new chat session |
| 7 | GET | `/api/tutor/chat/{id}` | Get messages in a session |
| 8 | POST | `/api/tutor/chat/{id}/ask` | Send message in session, get AI reply |
| 9 | DELETE | `/api/tutor/chat/{id}` | Delete a chat session |
| 10 | GET | `/api/recommendations` | AI-powered weak topic recommendations |

**Teacher endpoints needed:**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 11 | GET | `/api/teacher/dashboard` | Teacher dashboard stats |
| 12 | GET | `/api/teacher/analytics` | Per-topic scores, student rankings |
| 13 | GET | `/api/teacher/students` | Students studying teacher's subject |
| 14 | GET | `/api/teacher/content` | Teacher's topics and questions |

---

## 3. Database Changes Needed

### 3.1 New Models and Migrations

**UserTopicProgress** — Tracks per-topic progress for each student

| Column | Type | Description |
|--------|------|-------------|
| id | bigint, PK | Auto-increment |
| user_id | FK -> users | Student |
| topic_id | FK -> topics | Topic |
| best_score | integer | Best score achieved (out of 10) |
| attempts_count | integer, default 0 | Number of attempts |
| last_attempt_at | timestamp, nullable | When last attempted |
| status | enum | new, in_progress, completed |

**ChatSession** — Stores AI Tutor chat sessions

| Column | Type | Description |
|--------|------|-------------|
| id | bigint, PK | Auto-increment |
| user_id | FK -> users | Student |
| subject_id | FK -> subjects, nullable | Context subject filter |
| title | string | Auto-generated from first message |
| created_at | timestamp | Session start |
| updated_at | timestamp | Last activity |

**ChatMessage** — Individual messages within a chat session

| Column | Type | Description |
|--------|------|-------------|
| id | bigint, PK | Auto-increment |
| chat_session_id | FK -> chat_sessions | Parent session |
| role | enum | user, ai |
| content | text | Message text |
| sources | JSON, nullable | RAG source references |
| created_at | timestamp | When sent |

**UserStreak** — Daily streak tracking

| Column | Type | Description |
|--------|------|-------------|
| id | bigint, PK | Auto-increment |
| user_id | FK -> users, unique | One per student |
| current_streak | integer, default 0 | Current consecutive days |
| longest_streak | integer, default 0 | All-time record |
| last_active_date | date, nullable | Last day they were active |

**StreakDay** — Calendar of active days

| Column | Type | Description |
|--------|------|-------------|
| id | bigint, PK | Auto-increment |
| user_id | FK -> users | Student |
| date | date | The active date |
| quizzes_done | integer, default 1 | How many quizzes done that day |

### 3.2 Existing Model Changes

**Question model** — Add difficulty field:

| Column | Type | Description |
|--------|------|-------------|
| difficulty | enum | easy, medium, hard (default: medium) |

---

## 4. Development Phases

---

### PHASE 1 — Foundation & New Models

**Duration:** 2-3 hours  
**Goal:** Create new database models and fix foundation

#### Developer 1 (YOU — Laravel):

| # | Task | Files to create/edit |
|---|------|---------------------|
| 1 | DONE: Rename name/surname to firstname/lastname | User model, AuthController, migrations, seeders, swagger |
| 2 | DONE: Remove icon from subjects | Subject model, migrations, seeders, controllers, swagger |
| 3 | Create `UserTopicProgress` model + migration | `app/Models/UserTopicProgress.php`, migration file |
| 4 | Create `ChatSession` model + migration | `app/Models/ChatSession.php`, migration file |
| 5 | Create `ChatMessage` model + migration | `app/Models/ChatMessage.php`, migration file |
| 6 | Create `UserStreak` model + migration | `app/Models/UserStreak.php`, migration file |
| 7 | Create `StreakDay` model + migration | `app/Models/StreakDay.php`, migration file |
| 8 | Add `difficulty` column to questions migration | New migration: `add_difficulty_to_questions` |
| 9 | Add relationships to User model | `user->topicProgress()`, `user->chatSessions()`, `user->streak()` |
| 10 | Run `migrate:fresh --seed` and verify | Terminal |

#### Developer 2 (LILLY — Python RAG):

| # | Task | Files to create/edit |
|---|------|---------------------|
| 1 | Run `python seed.py` to seed vectorstore | `rag_service/seed.py` |
| 2 | Verify `GET /health` returns `documents > 0` | Browser or curl |
| 3 | Test `POST /query` with a sample question | curl or Postman |
| 4 | Add optional `subject` parameter to `/query` | `rag_service/main.py` — filter ChromaDB by metadata |
| 5 | Add `subject_name` and `topic_title` to ChromaDB metadata when seeding | `rag_service/seed.py` or `main.py` |

---

### PHASE 2 — Student Features (Profile, Dashboard, Streak, Progress)

**Duration:** 4-5 hours  
**Goal:** Complete student-facing API endpoints

#### Developer 1 (YOU — Laravel):

**A) Profile Endpoints:**

| # | Task | Details |
|---|------|---------|
| 1 | Create `ProfileController` | New file: `app/Http/Controllers/ProfileController.php` |
| 2 | `GET /api/profile` | Returns: user data + total_quizzes, avg_score, current_streak, longest_streak, subjects with progress percentages |
| 3 | `PUT /api/profile` | Update: firstname, lastname, gender. Validate and save |
| 4 | Add routes | In `routes/api.php` under authenticated student group |

**B) Enhanced Dashboard:**

| # | Task | Details |
|---|------|---------|
| 5 | Enhance `DashboardController::student()` | Add `subjects_progress` array: each subject with total_topics, completed_topics, avg_score, percentage |
| 6 | Add streak data to dashboard | Include current_streak, longest_streak, today_done boolean |
| 7 | Add recommendations | Include top 3 weakest topics (lowest score or never attempted) |

**C) Streak System:**

| # | Task | Details |
|---|------|---------|
| 8 | Create `StreakService` | New file: `app/Services/StreakService.php` |
| 9 | `recordActivity($userId)` method | Called after quiz submit. Updates streak count, creates StreakDay record |
| 10 | `GET /api/streak` endpoint | Returns: current_streak, longest_streak, calendar (last 30 days with done/missed) |
| 11 | Auto-call streak on quiz submit | In `QuizController::submit()`, call `StreakService::recordActivity()` |

**D) Subject Progress:**

| # | Task | Details |
|---|------|---------|
| 12 | `GET /api/progress/subjects` | For each subject in student's field: topic count, completed topics, avg score, percentage |
| 13 | Update `QuizController::submit()` | After quiz, create/update `UserTopicProgress` record with score and status |

**E) Recommendations:**

| # | Task | Details |
|---|------|---------|
| 14 | `GET /api/recommendations` | Return top 3-5 topics where student scored lowest or hasn't attempted |

#### Developer 2 (LILLY — Python RAG):

| # | Task | Details |
|---|------|---------|
| 1 | Add `sources` to `/query` response | Return array: `[{ document: "topic_title", section: "content_preview_50_chars" }]` |
| 2 | Improve chunking in seed | Split long topics into 500-char chunks with 50-char overlap |
| 3 | Add metadata to chunks | Include `subject_name`, `topic_title`, `chunk_index` in ChromaDB metadata |
| 4 | Add `POST /similar` endpoint | Accept `topic_id` or text, return 3 most similar topics — used for recommendations |

---

### PHASE 3 — Chat & Tutor System

**Duration:** 3-4 hours  
**Goal:** Persistent chat sessions for AI Tutor

#### Developer 1 (YOU — Laravel):

| # | Task | Details |
|---|------|---------|
| 1 | Create `ChatController` | New file: `app/Http/Controllers/ChatController.php` |
| 2 | `GET /api/tutor/history` | List chat sessions for current user (last 20), ordered by latest activity |
| 3 | `POST /api/tutor/chat` | Create new session. Accept optional `subject_id`. Auto-title = "Yangi suhbat" |
| 4 | `GET /api/tutor/chat/{id}` | Get all messages in a session. Verify ownership |
| 5 | `POST /api/tutor/chat/{id}/ask` | Save user message, call RagService with subject context, save AI response, return both |
| 6 | `DELETE /api/tutor/chat/{id}` | Soft-delete or hard-delete session |
| 7 | Auto-title update | After first user message, update session title to first 50 chars of message |
| 8 | Refactor `TutorController::ask()` | Keep existing stateless `/api/tutor/ask` working, but also support session-based flow |
| 9 | Add routes | All under `middleware(['auth:api', 'role:student'])` |

#### Developer 2 (LILLY — Python RAG):

| # | Task | Details |
|---|------|---------|
| 1 | Ensure `/query` accepts `subject` filter | Filter ChromaDB results by `subject_name` metadata |
| 2 | Return structured sources | `{ results: [...], sources: [{ title, section }] }` |
| 3 | Test with multiple subjects | Make sure filtering works correctly when data exists |

---

### PHASE 4 — Teacher Features

**Duration:** 3-4 hours  
**Goal:** Complete teacher dashboard and analytics

#### Developer 1 (YOU — Laravel):

| # | Task | Details |
|---|------|---------|
| 1 | Create `TeacherController` | New file: `app/Http/Controllers/TeacherController.php` |
| 2 | `GET /api/teacher/dashboard` | Stats: active_students (30 day), total_topics, total_questions, avg_score on teacher's subject |
| 3 | `GET /api/teacher/analytics` | topic_scores: each topic's avg score + attempts. student_rankings: top 10 students by avg score |
| 4 | `GET /api/teacher/students` | Paginated list of students whose field includes teacher's subject. Each with: name, total tests, avg score, last active |
| 5 | `GET /api/teacher/content` | Topics and questions under teacher's subject. Include: title, questions_count, total_attempts |
| 6 | Add routes | All under `middleware(['auth:api', 'role:teacher'])` |
| 7 | Update swagger.yaml | Document all new teacher endpoints |

#### Developer 2 (LILLY — Python RAG):

| # | Task | Details |
|---|------|---------|
| 1 | Add more subject data to `seed_data.json` | At least 2 more subjects: Fizika (2 topics, 10 questions), Kimyo (2 topics, 10 questions) |
| 2 | Update `seed.py` to handle multiple subjects | Make sure seed script processes all subjects correctly |
| 3 | Re-seed ChromaDB after adding new data | Run `python seed.py` with updated data |

---

### PHASE 5 — Polish & Deploy

**Duration:** 2-3 hours  
**Goal:** Production readiness

#### Developer 1 (YOU — Laravel):

| # | Task | Details |
|---|------|---------|
| 1 | Add pagination to quiz history | `GET /api/quiz/history?page=1&per_page=10` |
| 2 | Consistent error response format | All errors return `{ message, errors? }` with proper HTTP codes |
| 3 | Update Swagger for ALL new endpoints | Document: profile, streak, progress, chat, teacher endpoints |
| 4 | CORS config for production | Add production domain to `config/cors.php` |
| 5 | Environment config | Create `.env.example` with all required variables |
| 6 | Write `SETUP.md` | Setup instructions for both Laravel and RAG services |
| 7 | Final testing | Test all endpoints with curl or Postman |

#### Developer 2 (LILLY — Python RAG):

| # | Task | Details |
|---|------|---------|
| 1 | Dockerize RAG service | Create `Dockerfile` and `docker-compose.yml` |
| 2 | Make ChromaDB path configurable | Use `CHROMA_PATH` env variable, default to `./vectorstore` |
| 3 | Add error handling | Try-catch on all endpoints, return proper error JSON |
| 4 | Add logging | Log queries and response times |
| 5 | Write RAG service README | Document all endpoints, setup, seeding instructions |

---

## 5. Integration Points

These are moments where Developer 1 and Developer 2 must coordinate:

| # | What | When | Details |
|---|------|------|---------|
| 1 | RAG query format | Phase 1 | Agree on request/response JSON structure for `POST /query` |
| 2 | Source tags format | Phase 2 | Lilly returns `sources[]`, you pass it to frontend in chat messages |
| 3 | Subject filter | Phase 2-3 | You send `subject: "Matematika"`, she filters ChromaDB by metadata |
| 4 | Seed data flow | Phase 4 | New subjects you add to `seed_data.json` auto-flow to RAG via `seed.py` |
| 5 | Health check | Phase 5 | Laravel calls `GET http://localhost:8001/health` to verify RAG is running |

---

## 6. Time Estimate Summary

| Phase | Developer 1 (Laravel) | Developer 2 (Python RAG) | Total |
|-------|----------------------|--------------------------|-------|
| Phase 1: Foundation | 2-3 hours | 1-2 hours | 3-4 hours |
| Phase 2: Student Features | 4-5 hours | 2-3 hours | 5-6 hours |
| Phase 3: Chat System | 3-4 hours | 1-2 hours | 4-5 hours |
| Phase 4: Teacher Features | 3-4 hours | 2-3 hours | 4-5 hours |
| Phase 5: Polish & Deploy | 2-3 hours | 2-3 hours | 3-4 hours |
| **TOTAL** | **~15 hours** | **~8 hours** | **~20 hours** |

---

## 7. Already Completed (Before This Plan)

The following is already built and working:

**Authentication:**
- JWT-based auth (register, login, logout, refresh, current user)
- Role-based middleware (student, teacher, admin)
- Field-of-study selection for students, subject selection for teachers

**Database:**
- 12 migrations, all running successfully
- 7 subjects, 5 fields with subject-pivot mappings
- 3 seed users (admin, teacher, student)
- 1 subject with full content (Matematika: 3 topics, 30 questions)

**API Endpoints (31 total, all working):**
- Public: GET /fields, GET /fields/{id}
- Auth: register, login, logout, refresh, current user
- Subjects: index, show topics, CRUD (teacher/admin)
- Topics: show, CRUD (teacher/admin)
- Questions: index (paginated, filterable), CRUD (teacher/admin)
- Quiz: start, submit, result, history
- AI: tutor ask, feynman evaluate, generator create
- Dashboard: student stats, admin stats

**AI Services:**
- GeminiService (Gemini 2.0 Flash REST API)
- DiagnosisService (error analysis after quiz)
- RagService (HTTP client to Python sidecar)
- FeynmanService (Feynman technique evaluation)
- GeneratorService (DTM question generation from text)

**Python RAG Service:**
- FastAPI with /seed, /query, /health endpoints
- ChromaDB persistent vectorstore
- Seed script for easy data loading

---

## 8. Credentials (Development Only)

| Service | Credential | Value |
|---------|-----------|-------|
| MySQL | Database | abiturai |
| MySQL | User | root |
| MySQL | Password | Hyper.rixy12 |
| Admin Login | Email | admin@abiturai.uz |
| Admin Login | Password | admin123 |
| Teacher Login | Email | teacher@abiturai.uz |
| Teacher Login | Password | teacher123 |
| Student Login | Email | student@abiturai.uz |
| Student Login | Password | student123 |
| Laravel Server | URL | http://localhost:8080 |
| Swagger Docs | URL | http://localhost:8080/api/documentation |
| RAG Service | URL | http://localhost:8001 |

---

*Document generated on May 23, 2026*  
*AbiturAI Team — Build with AI Hackathon*
