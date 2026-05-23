<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use App\Services\FeynmanService;
use Illuminate\Http\Request;

class FeynmanController extends Controller
{
    public function evaluate(Request $request, FeynmanService $feynmanService)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'explanation' => 'required|string|min:20',
        ]);

        $topic = Topic::findOrFail($validated['topic_id']);

        $result = $feynmanService->evaluate(
            $topic->title,
            $topic->content,
            $validated['explanation']
        );

        return response()->json($result ?? [
            'score' => 0,
            'correct' => [],
            'wrong' => [],
            'missing' => [],
            'feedback' => 'Kechirasiz, baholashda xatolik yuz berdi.',
        ]);
    }
}
