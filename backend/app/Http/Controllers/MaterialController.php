<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Services\RagService;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    /**
     * Upload a file (PDF/DOCX/TXT) to RAG vectorstore
     */
    public function upload(Request $request, RagService $ragService)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,docx,txt|max:10240',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'nullable|string|max:255',
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);
        $user = $request->user();

        if ($user?->isTeacher() && (int) $user->subject_id !== (int) $subject->id) {
            return response()->json([
                'message' => 'O\'qituvchi faqat o\'z faniga material yuklay oladi',
            ], 403);
        }

        $file = $request->file('file');

        $result = $ragService->processFile(
            $file,
            $subject->name,
            $validated['title'] ?? null,
        );

        if (! $result) {
            return response()->json([
                'message' => 'RAG xizmati bilan bog\'lanib bo\'lmadi. Xizmat ishga tushirilganligini tekshiring.',
            ], 503);
        }

        return response()->json([
            'message' => 'Material muvaffaqiyatli yuklandi',
            'subject' => $subject->name,
            'topic_id' => $result['topic_id'] ?? null,
            'title' => $result['title'] ?? null,
            'chunks' => $result['chunks'] ?? 0,
            'characters' => $result['characters'] ?? 0,
        ], 201);
    }

    /**
     * Find similar topics via RAG (for recommendations)
     */
    public function similar(Request $request, RagService $ragService)
    {
        $validated = $request->validate([
            'text' => 'nullable|string|max:2000',
            'topic_id' => 'nullable|string|max:100',
            'n_results' => 'nullable|integer|min:1|max:10',
        ]);

        if (empty($validated['text']) && empty($validated['topic_id'])) {
            return response()->json([
                'message' => "text yoki topic_id berilishi kerak",
            ], 422);
        }

        $result = $ragService->similar(
            $validated['text'] ?? null,
            $validated['topic_id'] ?? null,
            $validated['n_results'] ?? 3,
        );

        if (! $result) {
            return response()->json([
                'message' => 'RAG xizmati bilan bog\'lanib bo\'lmadi',
            ], 503);
        }

        return response()->json($result);
    }

    /**
     * Check RAG service health
     */
    public function health(RagService $ragService)
    {
        $result = $ragService->health();

        if (! $result) {
            return response()->json([
                'status' => 'unavailable',
                'message' => 'RAG xizmati ishlamayapti',
            ], 503);
        }

        return response()->json($result);
    }
}
