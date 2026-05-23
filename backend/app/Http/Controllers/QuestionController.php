<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Question::with('topic:id,title');

        if ($request->has('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        $question = Question::with('topic:id,title')->findOrFail($id);

        return response()->json($question);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'question_text' => 'required|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'option_c' => 'required|string',
            'option_d' => 'required|string',
            'correct_answer' => 'required|in:A,B,C,D',
            'explanation' => 'nullable|string',
        ]);

        $question = Question::create($validated);

        return response()->json($question, 201);
    }

    public function update(Request $request, $id)
    {
        $question = Question::findOrFail($id);

        $validated = $request->validate([
            'topic_id' => 'sometimes|exists:topics,id',
            'question_text' => 'sometimes|string',
            'option_a' => 'sometimes|string',
            'option_b' => 'sometimes|string',
            'option_c' => 'sometimes|string',
            'option_d' => 'sometimes|string',
            'correct_answer' => 'sometimes|in:A,B,C,D',
            'explanation' => 'nullable|string',
        ]);

        $question->update($validated);

        return response()->json($question);
    }

    public function destroy($id)
    {
        Question::findOrFail($id)->delete();

        return response()->json(['message' => 'Question deleted']);
    }
}
