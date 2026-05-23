<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Models\Subject;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function student(Request $request)
    {
        $userId = $request->user()->id;

        $attempts = QuizAttempt::where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->get();

        $totalQuizzes = $attempts->count();
        $avgScore = $totalQuizzes > 0
            ? round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
            : 0;

        $recentAttempts = QuizAttempt::with('topic:id,title')
            ->where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(5)
            ->get(['id', 'topic_id', 'score', 'total', 'completed_at']);

        $subjectsCount = Subject::count();

        return response()->json([
            'total_quizzes' => $totalQuizzes,
            'avg_score' => $avgScore,
            'subjects_count' => $subjectsCount,
            'recent_attempts' => $recentAttempts,
        ]);
    }

    public function admin()
    {
        return response()->json([
            'total_users' => \App\Models\User::count(),
            'total_subjects' => Subject::count(),
            'total_topics' => \App\Models\Topic::count(),
            'total_questions' => \App\Models\Question::count(),
            'total_quiz_attempts' => QuizAttempt::count(),
        ]);
    }
}
