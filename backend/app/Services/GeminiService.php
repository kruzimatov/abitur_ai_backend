<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    private string $apiKey;
    private string $model = 'gemini-2.0-flash';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    public function generateContent(string $prompt, bool $jsonMode = true): ?array
    {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
        ];

        if ($jsonMode) {
            $payload['generationConfig'] = [
                'responseMimeType' => 'application/json',
            ];
        }

        $response = Http::timeout(30)->post($url, $payload);

        if ($response->failed()) {
            return null;
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if ($jsonMode && $text) {
            return json_decode($text, true);
        }

        return ['text' => $text];
    }

    public function generateText(string $prompt): ?string
    {
        $result = $this->generateContent($prompt, false);

        return $result['text'] ?? null;
    }
}
