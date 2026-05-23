<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use App\Models\UserTopicProgress;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Teacher dashboard stats
     */
    public function dashboard(Request $request)
    {
        $teacher = $request->user();
        $subjectId = $teacher->subject_id;

        if (!$subjectId) {
            return response()->json([
                'message' => 'Sizga fan biriktirilmagan',
            ], 400);
        }

        $topicIds = Topic::where('subject_id', $subjectId)->pluck('id');

        // Active students (last 30 days) — students who attempted quizzes on this subject's topics
        $activeStudents = QuizAttempt::whereIn('topic_id', $topicIds)
            ->where('completed_at', '>=', now()->subDays(30))
            ->distinct('user_id')
            ->count('user_id');

        $totalTopics = $topicIds->count();
        $totalQuestions = Question::whereIn('topic_id', $topicIds)->count();

        // Average score across all attempts on this subject
        $avgScore = QuizAttempt::whereIn('topic_id', $topicIds)
            ->whereNotNull('completed_at')
            ->get();

        $avgScoreValue = $avgScore->count() > 0
            ? round($avgScore->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
            : 0;

        // Total attempts
        $totalAttempts = $avgScore->count();

        return response()->json([
            'subject' => Subject::find($subjectId, ['id', 'name']),
            'active_students' => $activeStudents,
            'total_topics' => $totalTopics,
            'total_questions' => $totalQuestions,
            'total_attempts' => $totalAttempts,
            'avg_score' => $avgScoreValue,
        ]);
    }

    /**
     * Analytics: per-topic scores and student rankings
     */
    public function analytics(Request $request)
    {
        $teacher = $request->user();
        $subjectId = $teacher->subject_id;

        if (!$subjectId) {
            return response()->json(['message' => 'Sizga fan biriktirilmagan'], 400);
        }

        $topics = Topic::where('subject_id', $subjectId)->get();

        // Per-topic stats
        $topicScores = $topics->map(function ($topic) {
            $attempts = QuizAttempt::where('topic_id', $topic->id)
                ->whereNotNull('completed_at')
                ->get();

            return [
                'topic_id' => $topic->id,
                'topic_title' => $topic->title,
                'total_attempts' => $attempts->count(),
                'unique_students' => $attempts->unique('user_id')->count(),
                'avg_score' => $attempts->count() > 0
                    ? round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
                    : 0,
            ];
        });

        // Student rankings — top students by average score on this subject
        $topicIds = $topics->pluck('id');
        $studentAttempts = QuizAttempt::whereIn('topic_id', $topicIds)
            ->whereNotNull('completed_at')
            ->get()
            ->groupBy('user_id');

        $rankings = $studentAttempts->map(function ($attempts, $userId) {
            $user = User::find($userId, ['id', 'firstname', 'lastname']);
            if (!$user) return null;

            $avgScore = round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1);
            $totalTests = $attempts->count();
            $lastActive = $attempts->max('completed_at');

            return [
                'user_id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'avg_score' => $avgScore,
                'total_tests' => $totalTests,
                'last_active' => $lastActive,
            ];
        })
        ->filter()
        ->sortByDesc('avg_score')
        ->values()
        ->take(10);

        return response()->json([
            'topic_scores' => $topicScores,
            'student_rankings' => $rankings,
        ]);
    }

    /**
     * Students studying teacher's subject
     */
    public function students(Request $request)
    {
        $teacher = $request->user();
        $subjectId = $teacher->subject_id;

        if (!$subjectId) {
            return response()->json(['message' => 'Sizga fan biriktirilmagan'], 400);
        }

        // Get fields that include this subject
        $subject = Subject::with('topics')->find($subjectId);
        $fieldIds = $subject->belongsToMany(\App\Models\Field::class)->pluck('fields.id');

        // Students in those fields
        $topicIds = $subject->topics->pluck('id');

        $students = User::where('role', 'student')
            ->whereIn('field_id', $fieldIds)
            ->get()
            ->map(function ($student) use ($topicIds) {
                $attempts = QuizAttempt::where('user_id', $student->id)
                    ->whereIn('topic_id', $topicIds)
                    ->whereNotNull('completed_at')
                    ->get();

                return [
                    'id' => $student->id,
                    'firstname' => $student->firstname,
                    'lastname' => $student->lastname,
                    'email' => $student->email,
                    'total_tests' => $attempts->count(),
                    'avg_score' => $attempts->count() > 0
                        ? round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
                        : 0,
                    'last_active' => $attempts->max('completed_at'),
                ];
            });

        return response()->json([
            'subject' => $subject->only('id', 'name'),
            'total' => $students->count(),
            'students' => $students,
        ]);
    }

    /**
     * Teacher's content: topics and questions under their subject
     */
    public function content(Request $request)
    {
        $teacher = $request->user();
        $subjectId = $teacher->subject_id;

        if (!$subjectId) {
            return response()->json(['message' => 'Sizga fan biriktirilmagan'], 400);
        }

        $topics = Topic::where('subject_id', $subjectId)
            ->withCount('questions')
            ->orderBy('order_num')
            ->get()
            ->map(function ($topic) {
                $attempts = QuizAttempt::where('topic_id', $topic->id)
                    ->whereNotNull('completed_at')
                    ->count();

                return [
                    'id' => $topic->id,
                    'title' => $topic->title,
                    'order_num' => $topic->order_num,
                    'questions_count' => $topic->questions_count,
                    'total_attempts' => $attempts,
                    'has_content' => !empty($topic->content),
                ];
            });

        $subject = Subject::find($subjectId, ['id', 'name']);

        return response()->json([
            'subject' => $subject,
            'total_topics' => $topics->count(),
            'total_questions' => $topics->sum('questions_count'),
            'topics' => $topics,
        ]);
    }
}
