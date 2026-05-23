<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\Topic;
use App\Services\DiagnosisService;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function start($topicId)
    {
        $topic = Topic::findOrFail($topicId);
        $questions = $topic->questions()
            ->inRandomOrder()
            ->limit(10)
            ->get(['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d']);

        return response()->json([
            'topic' => $topic->only('id', 'title'),
            'questions' => $questions,
        ]);
    }

    public function submit(Request $request, DiagnosisService $diagnosisService)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_answer' => 'required|in:A,B,C,D',
        ]);

        $questionIds = collect($validated['answers'])->pluck('question_id');
        $questions = Question::whereIn('id', $questionIds)->get()->keyBy('id');

        $score = 0;
        $wrongAnswers = [];

        $attempt = QuizAttempt::create([
            'user_id' => $request->user()->id,
            'topic_id' => $validated['topic_id'],
            'score' => 0,
            'total' => count($validated['answers']),
        ]);

        foreach ($validated['answers'] as $answer) {
            $question = $questions[$answer['question_id']];
            $isCorrect = $question->correct_answer === $answer['selected_answer'];

            if ($isCorrect) {
                $score++;
            } else {
                $wrongAnswers[] = [
                    'question' => $question->question_text,
                    'student_answer' => $answer['selected_answer'],
                    'correct_answer' => $question->correct_answer,
                    'explanation' => $question->explanation,
                ];
            }

            QuizAnswer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $answer['question_id'],
                'selected_answer' => $answer['selected_answer'],
                'is_correct' => $isCorrect,
            ]);
        }

        $diagnosis = null;
        if (! empty($wrongAnswers)) {
            $diagnosis = $diagnosisService->diagnose($wrongAnswers);
        }

        $attempt->update([
            'score' => $score,
            'diagnosis' => $diagnosis,
            'completed_at' => now(),
        ]);

        return response()->json([
            'attempt_id' => $attempt->id,
            'score' => $score,
            'total' => count($validated['answers']),
            'diagnosis' => $diagnosis,
        ]);
    }

    public function result($id)
    {
        $attempt = QuizAttempt::with(['answers.question', 'topic:id,title'])
            ->where('user_id', request()->user()->id)
            ->findOrFail($id);

        return response()->json($attempt);
    }

    public function history(Request $request)
    {
        $attempts = QuizAttempt::with('topic:id,title')
            ->where('user_id', $request->user()->id)
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(20)
            ->get(['id', 'topic_id', 'score', 'total', 'completed_at']);

        return response()->json($attempts);
    }
}
