<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/FastAPI-RAG-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" />
</p>

# AbiturAI — Sun'iy Intellekt bilan DTM Tayyorgarlik Platformasi

> **Hackathon Loyihasi** | 23-24 May, 2026 | EdTech + AI

---

## Muammo

O'zbekistonda har yil **1 000 000+** abiturient DTM imtihoniga tayyorgarlik ko'radi. Ammo:

- Repetitorlar **qimmat** — oyiga 500 000 - 2 000 000 so'm
- Har bir o'quvchining **xatolariga moslashgan** tizim mavjud emas
- Zaif tomonlarni aniqlash va tahlil qilish **qo'lda** amalga oshiriladi
- **Qishloq joylardagi** talabalar sifatli tayyorgarlikdan mahrum

## Yechim

**AbiturAI** — Gemini AI va RAG texnologiyalariga asoslangan, DTM imtihoniga tayyorgarlik platformasi. Har bir o'quvchiga **shaxsiy AI repetitor**, real vaqtda **xato tahlili**, va **adaptiv o'quv rejasi** taqdim etadi.

---

## Asosiy Funksiyalar

| Funksiya | Tavsif | AI ning roli |
|----------|--------|-------------|
| **Darsliklar** | Har bir mavzu uchun darslik materiali (formulalar, misollar, qoidalar) | RAG orqali DTM materiallaridan kontekstli javoblar |
| **Mock Test** | DTM formatida 10 savollik test, 15 daqiqa taymer, real-time | AI har bir xato javobni tahlil qiladi: sabab, to'g'ri yechim, maslahat |
| **AI Tutor Chat** | Fan bo'yicha AI bilan suhbat, savollar berish | Gemini + RAG: DTM materiallariga asoslangan chuqur tushuntirishlar |
| **Feynman Usuli** | O'quvchi mavzuni o'z so'zlari bilan tushuntiradi | AI bilimni 0-100 ball bilan baholaydi, kamchiliklarni ko'rsatadi |
| **Smart Dashboard** | Streak kalendar, fan progressi, AI tavsiyalar | Zaif mavzularni aniqlash, shaxsiy mashq rejasi |
| **Ko'p Rollik Tizim** | Student, Teacher, Admin — har biri o'z paneli bilan | Teacher: AI bilan talabalar tahlili. Admin: RAG boshqaruvi |

---

## Texnologiyalar

### Frontend

| Texnologiya | Versiya | Vazifasi |
|-------------|---------|----------|
| React | 19.2 | UI framework |
| TypeScript | 6.0 | Tip xavfsizligi |
| Vite | 8.0 | Build + HMR |
| Tailwind CSS | 4.3 | Stillar |
| React Router | 7.15 | Marshrutlash |
| Axios | 1.16 | HTTP client (JWT interceptor) |
| Ant Design | 6.4 | UI komponentlar |
| Tabler Icons | 3.44 | Ikonkalar |

### Backend

| Texnologiya | Vazifasi |
|-------------|----------|
| Laravel 12 (PHP 8.5) | REST API, biznes logika |
| MySQL 8.4 | Asosiy ma'lumotlar bazasi |
| JWT Auth | Xavfsiz autentifikatsiya |
| Gemini 2.5 Flash | LLM — tutor, diagnostika, generator |
| Nginx + SSL | Ishlab chiqarish serveri |

### RAG Xizmati (AI Knowledge Base)

| Texnologiya | Vazifasi |
|-------------|----------|
| FastAPI (Python) | RAG API serveri |
| ChromaDB | Vektor ma'lumotlar bazasi |
| LangChain | Matn bo'laklash va qidirish |
| Google Embedding | Matn vektorlash |

---

## Arxitektura

```
                    ┌──────────────────────────────┐
                    │     Frontend (React 19)       │
                    │  Vercel — abiturai.vercel.app  │
                    │                                │
                    │  Student   Teacher    Admin    │
                    │  Dashboard Dashboard Dashboard │
                    │  Quiz  AI-Tutor  Topics        │
                    │  Progress  Feynman  MockTests  │
                    └──────────────┬─────────────────┘
                                   │ Axios + JWT
                    ┌──────────────┴─────────────────┐
                    │     Backend (Laravel 12)        │
                    │  AWS EC2 — abitur-api server    │
                    │                                │
                    │  53 API endpoint               │
                    │  JWT Auth + RBAC               │
                    │  15 Controller                  │
                    │  12 Model + 18 Migration        │
                    │                                │
                    │  ┌─────────┐  ┌─────────────┐  │
                    │  │ MySQL   │  │ Gemini AI   │  │
                    │  │ 8.4     │  │ 2.5 Flash   │  │
                    │  └─────────┘  └──────┬──────┘  │
                    │                      │         │
                    └──────────────────────┼─────────┘
                                           │
                    ┌──────────────────────┴─────────┐
                    │     RAG Service (FastAPI)       │
                    │     ChromaDB + LangChain        │
                    │                                │
                    │  PDF/DOCX/TXT → Chunk → Embed  │
                    │  Query → Semantic Search        │
                    │  DTM materiallaridan javob      │
                    └────────────────────────────────┘
```

---

## Sahifalar

### O'quvchi (Student)

| Sahifa | Marshrut | Tavsif |
|--------|----------|--------|
| Dashboard | `/dashboard` | Statistika, streak kalendar, fan progressi, AI tavsiyalar |
| Fanlar | `/subjects` | Fan kartochkalari, progress, mavzu soni |
| Mavzular | `/topics` | **Darslik ko'rish**: mavzu mazmuni, AI tushuntirish, savol-javob |
| Mock Test | `/mock-testlar` | **Test yechish**: savol, taymer, AI maslahat paneli, natija + diagnostika |
| AI Tutor | `/ai-tutor` | AI bilan suhbat, suhbat tarixi, fan konteksti |
| Feynman | `/darsliklar` | Mavzuni tushuntirish, AI baholash (ball, to'g'ri/noto'g'ri/yetishmayotgan) |
| Progress | `/progress` | Fan va mavzu bo'yicha batafsil tahlil |
| Natijalarim | `/leaderboard` | Shaxsiy statistika, yutuqlar, fan reytingi |
| Tarix | `/history` | O'tgan test urinishlari |

### O'qituvchi (Teacher)

| Sahifa | Marshrut | Tavsif |
|--------|----------|--------|
| Dashboard | `/teacher-dashboard` | Talabalar soni, mavzu natijalari, reyting, AI tahlil |

### Administrator (Admin)

| Sahifa | Marshrut | Tavsif |
|--------|----------|--------|
| Dashboard | `/admin-dashboard` | Tizim statistikasi, RAG holati, material yuklash |

---

## AI Integratsiyalari — Batafsil

### 1. AI Test Diagnostikasi
Test yakunida Gemini AI har bir **xato javob** uchun:
- **Noto'g'ri mantiq** (misconception) — o'quvchi nima uchun xato qilganini aniqlaydi
- **To'g'ri yechim** (correct_reasoning) — qadam-baqadam to'g'ri yechimni ko'rsatadi
- **Maslahat** (tip) — shu mavzuda qanday mashq qilish kerakligini aytadi

### 2. RAG Tutor (Gemini + ChromaDB)
- DTM darsliklari ChromaDB ga yuklanadi (PDF/DOCX/TXT)
- O'quvchi savol berganda, avval **semantik qidirish** orqali tegishli materiallar topiladi
- Topilgan kontekst Gemini AI ga beriladi — **aniq, manbaaga asoslangan** javob qaytaradi
- Suhbat tarixi saqlanadi — davomli dialog mumkin

### 3. Feynman Baholash
- O'quvchi mavzuni **o'z so'zlari bilan** tushuntiradi
- AI tushuntirishni tahlil qiladi: **0-100 ball**
- Natija: to'g'ri tushunilgan, noto'g'ri tushunilgan, va **yetishmayotgan** tushunchalar ro'yxati

### 4. AI Savol Generatori (Teacher uchun)
- O'qituvchi matn kiritadi
- AI matndan **DTM formatida** savollar yaratadi (4 ta variant, to'g'ri javob, izoh)

---

## Ma'lumotlar Bazasi

**18 ta jadval**, jumladan:

| Jadval | Vazifasi |
|--------|----------|
| `users` | Foydalanuvchilar (student/teacher/admin) |
| `subjects` | Fanlar (Matematika, Fizika, Kimyo) |
| `topics` | Mavzular + **darslik mazmuni** (longText) |
| `questions` | DTM formatidagi savollar (A/B/C/D) |
| `quiz_attempts` | Test urinishlari (ball, foiz, diagnostika) |
| `quiz_answers` | Har bir javob (tanlangan, to'g'ri/noto'g'ri) |
| `chat_sessions` | AI suhbat sessiyalari |
| `chat_messages` | Suhbat xabarlari (user/assistant) |
| `user_streaks` | Kunlik faollik (streak) |
| `streak_days` | 30 kunlik kalendar |
| `user_topic_progress` | Mavzu bo'yicha progress |

Seed ma'lumotlar: **Matematika** (3 mavzu, 30 savol), **Fizika** (2 mavzu, 10 savol), **Kimyo** (2 mavzu, 10 savol)

---

## API — 53 ta Endpoint

### Autentifikatsiya
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Kirish (JWT token) |
| POST | `/api/auth/logout` | Chiqish |
| POST | `/api/auth/refresh` | Token yangilash |

### O'quvchi
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/dashboard/student` | Dashboard ma'lumotlari |
| GET | `/api/subjects` | Fanlar ro'yxati |
| GET | `/api/subjects/:id/topics` | Fan mavzulari |
| GET | `/api/topics/:id` | Mavzu + darslik mazmuni |
| POST | `/api/quiz/:topicId/start` | Test boshlash |
| POST | `/api/quiz/submit` | Test topshirish + AI diagnostika |
| GET | `/api/quiz/history` | Test tarixi |
| POST | `/api/tutor/ask` | AI tutorga savol |
| POST | `/api/tutor/chat` | Yangi suhbat |
| POST | `/api/tutor/chat/:id/ask` | Suhbatda savol |
| POST | `/api/feynman/evaluate` | Feynman baholash |
| GET | `/api/streak` | Streak ma'lumotlari |
| GET | `/api/progress/subjects` | Fan progressi |

### O'qituvchi
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/teacher/dashboard` | O'qituvchi paneli |
| GET | `/api/teacher/analytics` | Tahlillar |
| GET | `/api/teacher/students` | Talabalar ro'yxati |
| POST | `/api/generator/create` | AI savol generatori |

### Administrator
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/dashboard/admin` | Admin paneli |
| GET | `/api/rag/health` | RAG xizmati holati |
| POST | `/api/materials/upload` | Material yuklash (PDF/DOCX/TXT) |

---

## Loyiha Tuzilmasi

```
abituraiback/
├── backend/                    # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/   # 15 ta controller
│   │   ├── Models/             # 12 ta model
│   │   └── Services/           # GeminiService, RagService
│   ├── database/
│   │   ├── migrations/         # 18 ta migratsiya
│   │   └── seeders/            # DtmContentSeeder, FieldSeeder
│   ├── routes/api.php          # 53 ta API marshrut
│   └── seed_data.json          # Seed ma'lumotlar (7 mavzu, 50 savol)
│
├── frontend/                   # React 19 + TypeScript
│   ├── src/
│   │   ├── app/router/         # Marshrutlar (role-based)
│   │   ├── components/         # Aside, Login, Registration, RoleRoute
│   │   ├── contexts/           # AuthContext (JWT)
│   │   ├── pages/              # 12 ta sahifa
│   │   │   ├── Dashboard/      # Student dashboard
│   │   │   ├── Topics/         # Darslik ko'rish + AI Q&A
│   │   │   ├── MockTests/      # Test yechish + tarix
│   │   │   ├── AITutor/        # AI suhbat
│   │   │   ├── Lessons/        # Feynman usuli
│   │   │   ├── Landing/        # Landing sahifa (tariflar)
│   │   │   └── ...
│   │   ├── services/           # API xizmatlari (axios)
│   │   ├── types/              # TypeScript interfeyslar
│   │   └── utils/              # Yordamchi funksiyalar
│   └── vite.config.ts
│
├── rag_service/                # FastAPI + ChromaDB
│   ├── main.py                 # RAG API serveri
│   ├── splitter.py             # Matn bo'laklash
│   ├── seed.py                 # Boshlang'ich ma'lumotlar
│   ├── Dockerfile              # Docker konfiguratsiyasi
│   └── requirements.txt
│
└── sources/docs/               # Darslik materiallari
    ├── seed_data.json           # Mavzular + savollar
    ├── rag_seed.json            # RAG uchun ma'lumotlar
    └── lecture_logarifm.md      # Logarifm darsligi
```

---

## Ishga Tushirish

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env          # MySQL + Gemini API kalitini sozlang
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve --port=8080
```

### Frontend (React)

```bash
cd frontend
npm install
echo "VITE_API_URL=/api" > .env.local
npm run dev                    # http://localhost:5174
```

### RAG Xizmati

```bash
cd rag_service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python seed.py                 # Ma'lumotlarni yuklash
uvicorn main:app --port=8001
```

### Test Foydalanuvchilar

| Email | Parol | Rol |
|-------|-------|-----|
| `admin@abiturai.uz` | `admin123` | Admin |
| `teacher@abiturai.uz` | `teacher123` | Teacher |
| `student@abiturai.uz` | `student123` | Student |

---

## Dizayn Tizimi

```
Dark Theme — Professional, zamonaviy, ko'zni charchatmaydigan

Ranglar:
  --bg:     #07090F     Asosiy fon
  --teal:   #00C49A     Student / Asosiy aksent
  --purple: #818CF8     AI / Teacher
  --amber:  #FBBF24     Ogohlantirishlar
  --red:    #F87171     Xatolar
  --green:  #34D399     Muvaffaqiyat

Shriftlar:
  DM Sans           — Asosiy matn
  DM Serif Display  — Sarlavhalar, raqamlar
  DM Mono           — Formulalar, taymer
```

---

## Kelajakdagi Rejalar (Roadmap)

### v2.0 — Yaqin kelajak
- **Video darsliklar** — o'qituvchilar video yuklaydi, AI avtomatik transkripsiya qiladi
- **AI ovozli javob (TTS)** — AI javobi audio formatda eshitiladi, o'quvchi tinglab o'rganadi
- **Ovozli savol (STT)** — o'quvchi mikrofon orqali AI tutorga savol beradi
- **Moslashuvchan test** — to'g'ri javob bersa qiyinroq, xato qilsa osonroq savol
- **Zaiflik xaritasi** — mavzular bo'yicha yashil/sariq/qizil vizual karta
- **Mobil responsiv** — barcha sahifalar telefon uchun optimallashtirilgan

### v3.0 — O'rta muddat
- **O'quv markaz marketplace** — o'qituvchilar kontent joylashtiradi, daromad oladi
- **Mobil ilova** (iOS + Android) — React Native
- **AI o'quv rejasi** — haftalik shaxsiy jadval generatori
- **Intervalli takrorlash** — AI unutish egri chizig'iga asoslanib eslatadi
- **Ko'p fan** — Biologiya, Tarix, Geografiya, Ona tili, Ingliz tili

### v4.0 — Uzoq muddat
- **Rasm → Kontent** — darslik sahifasini suratga oling, AI material yaratadi
- **AI video tahlil** — yuklangan video mazmuni avtomatik matn formatiga aylantiriladi, RAG ga qo'shiladi
- **Ko'p o'quvchi tahlili** — o'qituvchi 200 o'quvchini bir ekranda ko'radi
- **DTM simulyatsiya** — to'liq 90 daqiqalik real DTM formati
- **Open API** — boshqa platformalar AbiturAI AI ni ulashi mumkin
- **Gamifikatsiya** — yutuqlar, badgelar, do'stlar bilan raqobat

---

## Jamoa

| Ism | Rol | Mas'uliyat |
|-----|-----|------------|
| Xayrullo Rozimatov | Full-Stack Developer | Laravel API, React Frontend, AI integratsiya, deployment |
| Lilly | AI/RAG Engineer | FastAPI, ChromaDB, RAG pipeline, Docker |

---

## Linklar

| Resurs | URL |
|--------|-----|
| Frontend (Vercel) | [abitur-ai-frontend.vercel.app](https://abitur-ai-frontend.vercel.app) |
| Backend API | [abitur-api.khayrullo.uz](https://abitur-api.khayrullo.uz) |
| Frontend Repo | [github.com/mukhammedaliametov/abitur_ai_frontend](https://github.com/mukhammedaliametov/abitur_ai_frontend) |
| Backend Repo | [github.com/kruzimatov/abitur_ai_backend](https://github.com/kruzimatov/abitur_ai_backend) |

---

<p align="center">
  <strong>AbiturAI 2026</strong> — Sun'iy intellekt bilan DTM tayyorgarlik platformasi
  <br/>
  <em>React 19 + Laravel 12 + Gemini AI + RAG</em>
</p>
