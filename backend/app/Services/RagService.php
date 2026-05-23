<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RagService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.rag.url', 'http://localhost:8001');
    }

    public function query(string $question, int $nResults = 3): ?array
    {
        $response = Http::timeout(10)->post("{$this->baseUrl}/query", [
            'question' => $question,
            'n_results' => $nResults,
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }

    public function seed(array $topics): bool
    {
        $response = Http::timeout(30)->post("{$this->baseUrl}/seed", [
            'topics' => $topics,
        ]);

        return $response->successful();
    }
}
