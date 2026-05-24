# AbiturAI Frontend-Backend Integration Plan

## Context
The frontend (React 19 + TypeScript + Vite + Tailwind) has beautiful UI but **zero API integration** — all data is hardcoded, login uses a local array of 3 users, and every page renders static dummy data. The backend (Laravel 12 + JWT + MySQL) is 100% complete with 46+ endpoints tested and working on `localhost:8080`. This plan connects them.

---

## Phase 1: Foundation (API Client + Types + Services)
**Commit after this phase**

### Install
```
cd frontend && npm install axios
```

### Create files:
| File | Purpose |
|------|---------|
| `frontend/.env` | `VITE_API_URL=/api` |
| `frontend/src/types/index.ts` | All TypeScript interfaces matching backend response shapes (User, AuthResponse, DashboardData, Subject, Topic, Question, QuizStartResponse, QuizSubmitResponse, ChatSession, ChatMessage, etc.) |
| `frontend/src/services/api.ts` | Axios instance with baseURL from env, request interceptor (attach Bearer token from localStorage), response interceptor (redirect to /login on 401) |
| `frontend/src/services/auth.ts` | `login()`, `register()`, `logout()`, `getUser()`, `getFields()` |
| `frontend/src/services/dashboard.ts` | `getStudentDashboard()` |
| `frontend/src/services/subjects.ts` | `getSubjects()`, `getSubjectTopics()`, `getTopic()` |
| `frontend/src/services/quiz.ts` | `startQuiz()`, `submitQuiz()`, `getQuizResult()`, `getQuizHistory()` |
| `frontend/src/services/chat.ts` | `getChatHistory()`, `createChat()`, `getChat()`, `askChat()`, `deleteChat()`, `askTutor()` |
| `frontend/src/services/profile.ts` | `getProfile()`, `updateProfile()` |
| `frontend/src/services/progress.ts` | `getSubjectProgress()`, `getRecommendations()`, `getStreak()` |
| `frontend/src/utils/subjectColors.ts` | Maps subject names to theme colors (teal/purple/amber/red/green) consistently |

### Modify:
- `frontend/vite.config.ts` — Add `server.proxy: { '/api': 'http://localhost:8080' }`

---

## Phase 2: Auth (Real JWT Login/Register/Logout)
**Commit after this phase**

### Create:
| File | Purpose |
|------|---------|
| `frontend/src/contexts/AuthContext.tsx` | AuthProvider with user/token state, login/register/logout methods, token validation on mount via GET /api/user |
| `frontend/src/hooks/useAuth.ts` | `useContext(AuthContext)` wrapper |

### Modify:
| File | Change |
|------|--------|
| `frontend/src/main.tsx` | Wrap App with `<AuthProvider>` |
| `frontend/src/components/Login/index.tsx` | Replace hardcoded users array with `useAuth().login({email, password})`. Change username field to email field. Add loading state. |
| `frontend/src/components/Registration/index.tsx` | Add real form state, fetch fields from GET /api/fields for dropdown, add gender/role selection, wire to `useAuth().register()` |
| `frontend/src/pages/Auth/Private/PrivateRoute.tsx` | Replace `localStorage.getItem("is_auth")` with `useAuth()`, add loading spinner |
| `frontend/src/pages/Auth/Public/PublicRoute.tsx` | Same — use `useAuth()` |

---

## Phase 3: Sidebar + Dashboard
**Commit after this phase**

### Modify `frontend/src/components/Aside/index.tsx`:
- Show real user name from `useAuth().user.firstname` instead of "Kumush"
- Show role label instead of "Standart plan"
- Role-based menu filtering (students see student items, teachers see teacher items)
- Add logout button

### Refactor Dashboard — create `frontend/src/pages/Dashboard/components/`:
| Component | Props | Source |
|-----------|-------|--------|
| `DashboardTopbar.tsx` | userName, daysUntilDtm, streak | Extract from Dashboard lines ~200-240 |
| `StatsRow.tsx` | totalQuizzes, avgScore, streak | Extract stats cards section |
| `SubjectsGrid.tsx` | subjects: SubjectProgress[] | Extract subject cards section |
| `TopicsList.tsx` | topics: TopicProgress[] | Extract topics section |
| `RecentTests.tsx` | attempts: QuizAttempt[] | Extract recent tests section |
| `StreakCalendar.tsx` | calendar: StreakDay[], streak | Extract calendar section |
| `RecommendationsList.tsx` | recommendations[] | Extract recommendations section |
| `DashboardChat.tsx` | - | Extract mini AI chat, connect to POST /api/tutor/ask |
| `ProgressSummary.tsx` | subjects: SubjectProgress[] | Extract progress bars |

### Modify `frontend/src/pages/Dashboard/index.tsx`:
- Remove ALL hardcoded data (stats, subjects, topics arrays)
- Add `useEffect` → `dashboardService.getStudentDashboard()`
- Add loading/error states
- Render sub-components with API data as props
- **Target: 859 lines → ~100 lines**

---

## Phase 4: Subjects + Topics + Quiz Flow
**Commit after this phase**

### Modify `frontend/src/pages/Subjects/index.tsx`:
- Replace hardcoded 4 subjects with `subjectService.getSubjects()`
- Merge with `progressService.getSubjectProgress()` for progress data
- Link each subject to `/topics?subject={id}`

### Modify `frontend/src/pages/Topics/index.tsx`:
- Read `?subject=` from URL query params
- Fetch topics via `subjectService.getSubjectTopics(subjectId)`
- Merge with progress data for status/score per topic
- Link "Boshlash" to `/mock-testlar?topic={id}`

### Modify `frontend/src/pages/MockTests/index.tsx`:
- **Start screen**: Read `?topic=` from URL, fetch topic info, call `quizService.startQuiz(topicId)` on button click
- **Test screen**: Render API questions (`question_text`, `option_a/b/c/d`), track answers as `{question_id, selected_answer: 'A'|'B'|'C'|'D'}`. Connect AI hint panel to `POST /api/tutor/ask`
- **Submit**: Call `quizService.submitQuiz({topic_id, answers})`, display real score/percentage/diagnosis
- **Result screen**: Show AI diagnosis from API (misconception, correct_reasoning, tip per wrong answer)

### Modify `frontend/src/app/router/index.tsx`:
- No route changes needed — pages read query params

---

## Phase 5: AI Tutor (Real Chat)
**Commit after this phase**

### Modify `frontend/src/pages/AITutor/index.tsx`:
- **Left panel**: Replace hardcoded `chatHistoryData` with `chatService.getChatHistory()`. Group by date. Wire "Yangi suhbat" to `chatService.createChat(subjectId)`
- **Chat area**: Load messages via `chatService.getChat(id)`. Map `{role, content, sources, created_at}` to existing message UI
- **Send message**: Call `chatService.askChat(sessionId, question)`. Show typing indicator during API call. Append both user_message and ai_message to state
- **Context chips**: Load from `subjectService.getSubjects()` instead of hardcoded 4. Chip selection sets subject for new chat creation
- **Delete chat**: Wire to `chatService.deleteChat(id)`

---

## Phase 6: History + Progress Pages
**Commit after this phase**

### Build `frontend/src/pages/History/index.tsx` (currently empty):
- Call `quizService.getQuizHistory()` — paginated
- Show list of attempts: topic name, score/total, percentage, date
- Pagination controls
- Use same dark theme card style as Dashboard

### Build `frontend/src/pages/Progress/index.tsx` (currently empty):
- Call `progressService.getSubjectProgress()` — per-subject with topic breakdown
- Call `progressService.getRecommendations()` — weak topic suggestions
- Subject cards with progress bars, expand to show per-topic details
- Recommendations section at top

---

## Key Technical Decisions
- **HTTP client**: axios with interceptors (token + 401 redirect)
- **State**: React Context for auth only, local useState for page data (no redux/zustand)
- **API URL**: Vite proxy in dev (`/api` → `localhost:8080`), env var for production
- **Token storage**: localStorage key `token`
- **Color mapping**: Deterministic by subject name hash → palette index
- **Quiz answers**: Convert index (0-3) to letter ('A'-'D') before submitting
- **Error handling**: antd `message.error()` for user-facing errors

## Files Summary
- **New files**: ~25 (types, services, context, hooks, utils, dashboard components)
- **Modified files**: ~15 (existing pages, components, config)
- **Delete**: `frontend/src/.env` (wrong location, has hardcoded creds)

## Verification
After each phase:
1. Run `npm run dev` and verify no build errors
2. Test in browser — login with `admin@abiturai.uz` / `admin123`
3. Verify API calls in browser DevTools Network tab
4. Check console for errors
5. Git commit and push
