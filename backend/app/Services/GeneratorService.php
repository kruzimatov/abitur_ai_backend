<?php

namespace App\Services;

class GeneratorService
{
    public function __construct(private GeminiService $gemini) {}

    public function generate(string $inputText, int $count = 5): ?array
    {
        $prompt = <<<PROMPT
Quyidagi matn asosida {$count} ta DTM formatidagi test savol yarat.
Har biri 4 variantli, 1 ta to'g'ri javob, qisqa tushuntirma bilan.

Matn: {$inputText}

JSON formatda qaytar (array):
[
  {
    "question": "Savol matni",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "correct_answer": "A",
    "explanation": "To'g'ri javobning sababi"
  }
]

Barchasi O'zbek tilida, qiyinlik darajalari aralash.
Faqat JSON array qaytar, boshqa hech narsa emas.
PROMPT;

        return $this->gemini->generateContent($prompt);
    }
}
