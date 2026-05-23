<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use App\Services\RagService;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    public function ask(Request $request, RagService $ragService, GeminiService $geminiService)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $ragResult = $ragService->query($validated['question']);

        $chunks = '';
        $sources = [];

        if ($ragResult && ! empty($ragResult['chunks'])) {
            foreach ($ragResult['chunks'] as $i => $chunk) {
                $title = $ragResult['titles'][$i] ?? 'Noma\'lum';
                $chunks .= "Manba {$i}: {$title}\n{$chunk}\n\n";
                $sources[] = $title;
            }
        }

        $prompt = <<<PROMPT
Sen DTM imtihoniga tayyorlaydigan AI repetitor san.
Quyidagi DTM materiallariga asoslanib savolga javob ber.

DTM materiallari:
{$chunks}

O'quvchi savoli: {$validated['question']}

Qoidalar:
- Faqat berilgan materiallar asosida javob ber
- O'zbek tilida javob ber
- Aniq va tushunarli tushuntir
- Misollar bilan ko'rsat
- Agar materiallarda javob topilmasa, shuni ayt
PROMPT;

        $answer = $geminiService->generateText($prompt);

        return response()->json([
            'answer' => $answer ?? 'Kechirasiz, hozircha javob bera olmayman.',
            'sources' => array_unique($sources),
        ]);
    }
}
