<?php

namespace App\Services;

class DiagnosisService
{
    public function __construct(private GeminiService $gemini) {}

    public function diagnose(array $wrongAnswers): ?array
    {
        $wrongJson = json_encode($wrongAnswers, JSON_UNESCAPED_UNICODE);

        $prompt = <<<PROMPT
Sen DTM imtihoniga tayyorlaydigan tajribali repetitor san.
O'quvchining noto'g'ri javoblarini tahlil qil va har biri uchun
aniq xato fikrlash mantig'ini topib ber.

Noto'g'ri javoblar: {$wrongJson}

JSON formatda qaytar (array):
[
  {
    "question": "savol matni",
    "student_answer": "B",
    "correct_answer": "C",
    "misconception": "Xato fikrlash haqida 1 jumla",
    "why_student_chose": "Nima uchun bu variantni tanlagan",
    "correct_reasoning": "To'g'ri yondashuv",
    "tip": "Bunday xatoning oldini olish maslahati"
  }
]

Barchasi O'zbek tilida. Faqat JSON array qaytar, boshqa hech narsa emas.
PROMPT;

        return $this->gemini->generateContent($prompt);
    }
}
