<?php

namespace App\Services;

class FeynmanService
{
    public function __construct(private GeminiService $gemini) {}

    public function evaluate(string $topicTitle, string $topicContent, string $studentExplanation): ?array
    {
        $prompt = <<<PROMPT
Sen DTM tayyorgarlik bo'yicha baholovchi san.
O'quvchi quyidagi mavzuni o'z so'zlari bilan tushuntirgan.

Mavzu: {$topicTitle}
Asl material: {$topicContent}
O'quvchi tushuntirishi: {$studentExplanation}

Tushunish darajasini baholab JSON qaytar:
{
  "score": 0-100,
  "correct": ["to'g'ri aytgan asosiy nuqtalar"],
  "wrong": ["xato yoki noaniq aytgan nuqtalar"],
  "missing": ["aytmagan muhim tushunchalar"],
  "feedback": "Bir paragraf shaxsiy maslahat O'zbek tilida"
}

Faqat JSON qaytar, boshqa hech narsa emas.
PROMPT;

        return $this->gemini->generateContent($prompt);
    }
}
