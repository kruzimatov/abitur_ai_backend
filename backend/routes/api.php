<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\FeynmanController;
use App\Http\Controllers\GeneratorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\TutorController;
use Illuminate\Support\Facades\Route;

// ─── Public (no auth needed) ───
Route::get('/fields', [FieldController::class, 'index']);
Route::get('/fields/{id}', [FieldController::class, 'show']);

// ─── Auth (public) ───
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// ─── All authenticated users ───
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}/topics', [SubjectController::class, 'topics']);
    Route::get('/topics/{id}', [TopicController::class, 'show']);

    // Profile (any role)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// ─── Student routes ───
Route::middleware(['auth:api', 'role:student,teacher,admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard/student', [DashboardController::class, 'student']);

    // Quiz
    Route::post('/quiz/{topicId}/start', [QuizController::class, 'start']);
    Route::post('/quiz/submit', [QuizController::class, 'submit']);
    Route::get('/quiz/result/{id}', [QuizController::class, 'result']);
    Route::get('/quiz/history', [QuizController::class, 'history']);

    // Streak
    Route::get('/streak', function (\Illuminate\Http\Request $request) {
        $streakService = app(\App\Services\StreakService::class);
        return response()->json($streakService->getStreak($request->user()->id));
    });

    // Subject progress
    Route::get('/progress/subjects', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        $subjects = $user->field_id
            ? $user->field->subjects()->with('topics')->get()
            : \App\Models\Subject::with('topics')->get();

        $progress = $subjects->map(function ($subject) use ($user) {
            $topicIds = $subject->topics->pluck('id');
            $totalTopics = $topicIds->count();

            $topicProgress = \App\Models\UserTopicProgress::where('user_id', $user->id)
                ->whereIn('topic_id', $topicIds)
                ->get();

            $completedTopics = $topicProgress->where('status', 'completed')->count();

            return [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'total_topics' => $totalTopics,
                'completed_topics' => $completedTopics,
                'avg_score' => $topicProgress->count() > 0
                    ? round($topicProgress->avg('best_score') * 10, 1)
                    : 0,
                'percentage' => $totalTopics > 0
                    ? round(($completedTopics / $totalTopics) * 100)
                    : 0,
                'topics' => $subject->topics->map(function ($topic) use ($topicProgress) {
                    $tp = $topicProgress->firstWhere('topic_id', $topic->id);
                    return [
                        'topic_id' => $topic->id,
                        'topic_title' => $topic->title,
                        'status' => $tp ? $tp->status : 'new',
                        'best_score' => $tp ? $tp->best_score * 10 : null,
                        'attempts_count' => $tp ? $tp->attempts_count : 0,
                    ];
                }),
            ];
        });

        return response()->json($progress);
    });

    // Recommendations
    Route::get('/recommendations', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        $subjects = $user->field_id
            ? $user->field->subjects()->with('topics')->get()
            : \App\Models\Subject::with('topics')->get();

        $allTopicIds = $subjects->flatMap(fn ($s) => $s->topics->pluck('id'));
        $progress = \App\Models\UserTopicProgress::where('user_id', $user->id)
            ->whereIn('topic_id', $allTopicIds)
            ->get()
            ->keyBy('topic_id');

        $recommendations = [];

        // Unattempted topics first
        $unattempted = $allTopicIds->diff($progress->keys());
        if ($unattempted->isNotEmpty()) {
            $topics = \App\Models\Topic::with('subject:id,name')
                ->whereIn('id', $unattempted)->limit(3)->get();
            foreach ($topics as $topic) {
                $recommendations[] = [
                    'topic_id' => $topic->id,
                    'topic_title' => $topic->title,
                    'subject_name' => $topic->subject->name,
                    'best_score' => null,
                    'reason' => 'Hali urinilmagan',
                ];
            }
        }

        // Weak topics
        if (count($recommendations) < 5) {
            $weak = $progress->sortBy('best_score')->take(5 - count($recommendations));
            $weakTopics = \App\Models\Topic::with('subject:id,name')
                ->whereIn('id', $weak->pluck('topic_id'))->get()->keyBy('id');
            foreach ($weak as $p) {
                if (isset($weakTopics[$p->topic_id])) {
                    $t = $weakTopics[$p->topic_id];
                    $recommendations[] = [
                        'topic_id' => $t->id,
                        'topic_title' => $t->title,
                        'subject_name' => $t->subject->name,
                        'best_score' => $p->best_score * 10,
                        'reason' => 'Past bal',
                    ];
                }
            }
        }

        return response()->json(array_slice($recommendations, 0, 5));
    });

    // Tutor (stateless — existing)
    Route::post('/tutor/ask', [TutorController::class, 'ask']);
    Route::post('/feynman/evaluate', [FeynmanController::class, 'evaluate']);

    // Chat (session-based tutor)
    Route::get('/tutor/history', [ChatController::class, 'history']);
    Route::post('/tutor/chat', [ChatController::class, 'create']);
    Route::get('/tutor/chat/{id}', [ChatController::class, 'show']);
    Route::post('/tutor/chat/{id}/ask', [ChatController::class, 'ask']);
    Route::delete('/tutor/chat/{id}', [ChatController::class, 'destroy']);
});

// ─── Teacher routes ───
Route::middleware(['auth:api', 'role:teacher,admin'])->group(function () {
    // Teacher dashboard & analytics
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);
    Route::get('/teacher/analytics', [TeacherController::class, 'analytics']);
    Route::get('/teacher/students', [TeacherController::class, 'students']);
    Route::get('/teacher/content', [TeacherController::class, 'content']);

    // Content management
    Route::post('/generator/create', [GeneratorController::class, 'create']);

    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);

    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{id}', [TopicController::class, 'update']);

    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
});

// ─── Admin routes ───
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);

    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
    Route::delete('/topics/{id}', [TopicController::class, 'destroy']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
});
