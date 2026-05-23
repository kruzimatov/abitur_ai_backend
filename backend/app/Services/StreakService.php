<?php

namespace App\Services;

use App\Models\StreakDay;
use App\Models\UserStreak;
use Carbon\Carbon;

class StreakService
{
    public function recordActivity(int $userId): void
    {
        $today = Carbon::today();

        // Update or create today's streak day
        $streakDay = StreakDay::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if ($streakDay) {
            $streakDay->increment('quizzes_done');
        } else {
            StreakDay::create([
                'user_id' => $userId,
                'date' => $today,
            ]);
        }

        // Update streak counter
        $streak = UserStreak::firstOrCreate(
            ['user_id' => $userId],
            ['current_streak' => 0, 'longest_streak' => 0]
        );

        $yesterday = Carbon::yesterday();

        if ($streak->last_active_date === null) {
            // First ever activity
            $streak->current_streak = 1;
        } elseif ($streak->last_active_date->isSameDay($today)) {
            // Already active today — no change to streak count
            return;
        } elseif ($streak->last_active_date->isSameDay($yesterday)) {
            // Consecutive day — increment
            $streak->current_streak += 1;
        } else {
            // Streak broken — reset to 1
            $streak->current_streak = 1;
        }

        if ($streak->current_streak > $streak->longest_streak) {
            $streak->longest_streak = $streak->current_streak;
        }

        $streak->last_active_date = $today;
        $streak->save();
    }

    public function getStreak(int $userId): array
    {
        $streak = UserStreak::where('user_id', $userId)->first();

        $currentStreak = 0;
        $longestStreak = 0;

        if ($streak) {
            // Check if streak is still valid (not broken)
            $yesterday = Carbon::yesterday();
            $today = Carbon::today();

            if ($streak->last_active_date &&
                !$streak->last_active_date->isSameDay($today) &&
                !$streak->last_active_date->isSameDay($yesterday)) {
                // Streak is broken
                $streak->update(['current_streak' => 0]);
                $currentStreak = 0;
            } else {
                $currentStreak = $streak->current_streak;
            }
            $longestStreak = $streak->longest_streak;
        }

        // Get last 30 days calendar
        $startDate = Carbon::today()->subDays(29);
        $streakDays = StreakDay::where('user_id', $userId)
            ->where('date', '>=', $startDate)
            ->pluck('quizzes_done', 'date')
            ->toArray();

        $calendar = [];
        for ($i = 0; $i < 30; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dateStr = $date->toDateString();
            $calendar[] = [
                'date' => $dateStr,
                'active' => isset($streakDays[$dateStr]),
                'quizzes_done' => $streakDays[$dateStr] ?? 0,
            ];
        }

        return [
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
            'today_done' => isset($streakDays[Carbon::today()->toDateString()]),
            'calendar' => $calendar,
        ];
    }
}
