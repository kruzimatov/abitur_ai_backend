# AbiturAI - Backend

AI-powered DTM exam preparation platform for Uzbek students.

## What it does

AbiturAI helps students prepare for DTM (university entrance exams) through mock tests, AI tutoring, and progress tracking. Teachers can manage content and track student performance.

## Tech Stack

- **Laravel 12** (PHP) - Main API
- **FastAPI** (Python) - RAG service for AI tutoring
- **MySQL** - Database
- **ChromaDB** - Vector store for DTM materials
- **Gemini 2.0 Flash** - AI model for tutoring, diagnosis, question generation
- **JWT** - Authentication

## Roles

| Role | What they can do |
|------|-----------------|
| **Student** | Take quizzes, chat with AI tutor, track progress & streaks |
| **Teacher** | Create topics & questions, generate questions with AI, view student analytics |
| **Admin** | Full access + delete operations |

## API Overview (46 endpoints)

**Auth** - Register, login, logout, token refresh

**Student Features:**
- Profile (view/edit)
- Dashboard with subject progress, streak calendar, recommendations
- Quiz (start, submit with AI error diagnosis, history)
- AI Tutor chat (session-based with conversation history)
- Feynman technique evaluation
- Streak tracking (daily activity + 30-day calendar)
- Per-subject/topic progress

**Teacher Features:**
- Dashboard (active students, topics, questions, avg score)
- Analytics (per-topic scores, student rankings)
- Student list for their subject
- Content management (topics, questions CRUD)
- AI question generator (paste text, get DTM-format questions)

**AI Features:**
- Error Diagnosis - analyzes wrong answers after quiz
- RAG Tutor - answers questions based on DTM materials
- Explain It Back - Feynman technique scoring
- Question Generator - creates DTM questions from text

## Database

18 tables including: users, subjects, topics, questions, quiz attempts, chat sessions, chat messages, user streaks, user topic progress

Currently seeded with: Matematika (3 topics, 30 questions), Fizika (2 topics, 10 questions), Kimyo (2 topics, 10 questions)

## Team

| Name | Role | Focus |
|------|------|-------|
| Xayrullo | Laravel Backend | Core API, auth, CRUD, dashboard, chat, teacher features |
| Lilly | Python RAG | AI service, ChromaDB, document processing, Docker |

## How to Run

```bash
# Laravel
cd backend
composer install
cp .env.example .env   # configure DB + Gemini API key
php artisan migrate:fresh --seed
php artisan serve --port=8080

# RAG Service
cd rag_service
pip install -r requirements.txt
python seed.py
uvicorn main:app --port=8001
```

API docs: `http://localhost:8080/api/documentation`

## Repo

https://github.com/kruzimatov/abitur_ai_backend.git
