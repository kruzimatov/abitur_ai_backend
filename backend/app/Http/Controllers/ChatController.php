<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Services\GeminiService;
use App\Services\RagService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function history(Request $request)
    {
        $sessions = ChatSession::where('user_id', $request->user()->id)
            ->with('subject:id,name')
            ->withCount('messages')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get(['id', 'subject_id', 'title', 'created_at', 'updated_at']);

        return response()->json($sessions);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'nullable|exists:subjects,id',
        ]);

        $session = ChatSession::create([
            'user_id' => $request->user()->id,
            'subject_id' => $validated['subject_id'] ?? null,
            'title' => 'Yangi suhbat',
        ]);

        $session->load('subject:id,name');

        return response()->json($session, 201);
    }

    public function show(Request $request, $id)
    {
        $session = ChatSession::where('user_id', $request->user()->id)
            ->with(['messages', 'subject:id,name'])
            ->findOrFail($id);

        return response()->json($session);
    }

    public function ask(Request $request, $id, RagService $ragService, GeminiService $geminiService)
    {
        $session = ChatSession::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'question' => 'required|string|max:2000',
        ]);

        // Save user message
        $userMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => 'user',
            'content' => $validated['question'],
        ]);

        // Auto-title: update title from first message
        if ($session->title === 'Yangi suhbat') {
            $session->update([
                'title' => mb_substr($validated['question'], 0, 50),
            ]);
        }

        // Build context from recent messages in this session
        $recentMessages = ChatMessage::where('chat_session_id', $session->id)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->reverse();

        $conversationContext = '';
        foreach ($recentMessages as $msg) {
            $role = $msg->role === 'user' ? "O'quvchi" : 'AI Tutor';
            $conversationContext .= "{$role}: {$msg->content}\n\n";
        }

        // RAG query with subject context
        $ragQuery = $validated['question'];
        $subjectFilter = null;
        if ($session->subject_id) {
            $session->load('subject');
            $subjectFilter = $session->subject->name;
        }

        $ragResult = $ragService->query($ragQuery);

        $chunks = '';
        $sources = [];

        if ($ragResult && !empty($ragResult['chunks'])) {
            foreach ($ragResult['chunks'] as $i => $chunk) {
                $title = $ragResult['titles'][$i] ?? "Noma'lum";
                $chunks .= "Manba {$i}: {$title}\n{$chunk}\n\n";
                $sources[] = $title;
            }
        }

        $prompt = <<<PROMPT
Sen DTM imtihoniga tayyorlaydigan AI repetitor san.
Quyidagi DTM materiallariga asoslanib savolga javob ber.

DTM materiallari:
{$chunks}

Suhbat tarixi:
{$conversationContext}

Yangi savol: {$validated['question']}

Qoidalar:
- Faqat berilgan materiallar asosida javob ber
- O'zbek tilida javob ber
- Aniq va tushunarli tushuntir
- Misollar bilan ko'rsat
- Oldingi suhbat kontekstini hisobga ol
- Agar materiallarda javob topilmasa, shuni ayt
PROMPT;

        $answer = $geminiService->generateText($prompt);
        $answerText = $answer ?? 'Kechirasiz, hozircha javob bera olmayman.';

        // Save AI message
        $aiMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => 'ai',
            'content' => $answerText,
            'sources' => array_unique($sources),
        ]);

        $session->touch();

        return response()->json([
            'user_message' => $userMessage,
            'ai_message' => $aiMessage,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $session = ChatSession::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $session->delete();

        return response()->json([
            'message' => 'Suhbat muvaffaqiyatli o\'chirildi',
        ]);
    }
}
