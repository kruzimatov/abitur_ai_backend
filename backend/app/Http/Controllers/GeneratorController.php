<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Services\GeneratorService;
use Illuminate\Http\Request;

class GeneratorController extends Controller
{
    public function create(Request $request, GeneratorService $generatorService)
    {
        $validated = $request->validate([
            'text' => 'required|string|min:50',
            'count' => 'integer|min:1|max:10',
            'topic_id' => 'nullable|exists:topics,id',
        ]);

        $questions = $generatorService->generate(
            $validated['text'],
            $validated['count'] ?? 5
        );

        if (! $questions) {
            return response()->json([
                'message' => 'Savollar yaratishda xatolik yuz berdi.',
            ], 500);
        }

        if (isset($validated['topic_id'])) {
            $saved = [];
            foreach ($questions as $q) {
                $saved[] = Question::create([
                    'topic_id' => $validated['topic_id'],
                    'question_text' => $q['question'],
                    'option_a' => $q['option_a'],
                    'option_b' => $q['option_b'],
                    'option_c' => $q['option_c'],
                    'option_d' => $q['option_d'],
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => $q['explanation'] ?? null,
                ]);
            }

            return response()->json([
                'message' => count($saved).' ta savol saqlandi',
                'questions' => $saved,
            ], 201);
        }

        return response()->json(['questions' => $questions]);
    }
}
