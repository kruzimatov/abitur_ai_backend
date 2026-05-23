<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Services\StreakService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request, StreakService $streakService)
    {
        $user = $request->user();
        $user->load(['field', 'subject']);

        $attempts = QuizAttempt::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->get();

        $totalQuizzes = $attempts->count();
        $avgScore = $totalQuizzes > 0
            ? round($attempts->avg(fn ($a) => ($a->score / $a->total) * 100), 1)
            : 0;

        $streak = $streakService->getStreak($user->id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'gender' => $user->gender,
                'role' => $user->role,
                'field' => $user->field ? $user->field->only('id', 'name') : null,
                'subject' => $user->subject ? $user->subject->only('id', 'name') : null,
            ],
            'stats' => [
                'total_quizzes' => $totalQuizzes,
                'avg_score' => $avgScore,
                'current_streak' => $streak['current_streak'],
                'longest_streak' => $streak['longest_streak'],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'sometimes|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female',
            'field_id' => 'sometimes|nullable|exists:fields,id',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'message' => "Profil muvaffaqiyatli yangilandi",
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'gender' => $user->gender,
                'role' => $user->role,
            ],
        ]);
    }
}
