<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\UserTopicProgress;
use App\Services\StreakService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function student(Request $request, StreakService $streakService)
    {
        $user = $request->user();
        $userId = $user->id;

        // Basic quiz stats
        $attempts = QuizAttempt::where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->get();

        $totalQuizzes = $attempts->count();
        $avgScore = $totalQuizzes > 0
            ? round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
            : 0;

        // Recent attempts
        $recentAttempts = QuizAttempt::with('topic:id,title,subject_id')
            ->where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(5)
            ->get(['id', 'topic_id', 'score', 'total', 'completed_at']);

        // Streak
        $streak = $streakService->getStreak($userId);

        // Subject progress — get subjects for student's field, or all subjects
        $subjects = $user->field_id
            ? $user->field->subjects()->with('topics')->get()
            : Subject::with('topics')->get();

        $subjectsProgress = $subjects->map(function ($subject) use ($userId) {
            $topicIds = $subject->topics->pluck('id');
            $totalTopics = $topicIds->count();

            $progress = UserTopicProgress::where('user_id', $userId)
                ->whereIn('topic_id', $topicIds)
                ->get();

            $completedTopics = $progress->where('status', 'completed')->count();
            $avgTopicScore = $progress->count() > 0
                ? round($progress->avg('best_score') * 10, 1)
                : 0;

            return [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'total_topics' => $totalTopics,
                'completed_topics' => $completedTopics,
                'avg_score' => $avgTopicScore,
                'percentage' => $totalTopics > 0
                    ? round(($completedTopics / $totalTopics) * 100)
                    : 0,
            ];
        });

        // Recommendations — weakest topics (lowest score or never attempted)
        $allTopicIds = $subjects->flatMap(fn ($s) => $s->topics->pluck('id'));
        $attemptedProgress = UserTopicProgress::where('user_id', $userId)
            ->whereIn('topic_id', $allTopicIds)
            ->get()
            ->keyBy('topic_id');

        $recommendations = [];

        // First: unattempted topics
        $unattemptedTopicIds = $allTopicIds->diff($attemptedProgress->keys());
        if ($unattemptedTopicIds->isNotEmpty()) {
            $unattemptedTopics = Topic::with('subject:id,name')
                ->whereIn('id', $unattemptedTopicIds)
                ->limit(3)
                ->get();

            foreach ($unattemptedTopics as $topic) {
                $recommendations[] = [
                    'topic_id' => $topic->id,
                    'topic_title' => $topic->title,
                    'subject_name' => $topic->subject->name,
                    'best_score' => null,
                    'reason' => 'Hali urinilmagan',
                ];
            }
        }

        // Then: lowest scoring topics
        if (count($recommendations) < 5) {
            $weak = $attemptedProgress->sortBy('best_score')
                ->take(5 - count($recommendations));

            $weakTopics = Topic::with('subject:id,name')
                ->whereIn('id', $weak->pluck('topic_id'))
                ->get()
                ->keyBy('id');

            foreach ($weak as $p) {
                if (isset($weakTopics[$p->topic_id])) {
                    $topic = $weakTopics[$p->topic_id];
                    $recommendations[] = [
                        'topic_id' => $topic->id,
                        'topic_title' => $topic->title,
                        'subject_name' => $topic->subject->name,
                        'best_score' => $p->best_score * 10,
                        'reason' => 'Past bal',
                    ];
                }
            }
        }

        // DTM countdown
        $dtmDate = now()->year . '-08-01';
        $daysUntilDtm = (int) max(0, now()->startOfDay()->diffInDays($dtmDate, false));

        return response()->json([
            'total_quizzes' => $totalQuizzes,
            'avg_score' => $avgScore,
            'current_streak' => $streak['current_streak'],
            'longest_streak' => $streak['longest_streak'],
            'today_done' => $streak['today_done'],
            'days_until_dtm' => $daysUntilDtm,
            'subjects_progress' => $subjectsProgress,
            'recommendations' => array_slice($recommendations, 0, 5),
            'recent_attempts' => $recentAttempts,
            'streak_calendar' => $streak['calendar'],
        ]);
    }

    public function admin()
    {
        return response()->json([
            'total_users' => \App\Models\User::count(),
            'total_subjects' => Subject::count(),
            'total_topics' => Topic::count(),
            'total_questions' => \App\Models\Question::count(),
            'total_quiz_attempts' => QuizAttempt::count(),
        ]);
    }
}
