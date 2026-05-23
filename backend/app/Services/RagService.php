<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RagService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.rag.url', 'http://localhost:8001');
    }

    /**
     * Query RAG with optional subject filter
     */
    public function query(string $question, ?string $subject = null, int $nResults = 3): ?array
    {
        try {
            $payload = [
                'question' => $question,
                'n_results' => $nResults,
            ];

            if ($subject) {
                $payload['subject'] = $subject;
            }

            $response = Http::timeout(10)->post("{$this->baseUrl}/query", $payload);

            return $response->successful() ? $response->json() : null;
        } catch (ConnectionException $e) {
            Log::warning('RAG service unavailable: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Find similar topics by text or topic_id
     */
    public function similar(?string $text = null, ?string $topicId = null, int $nResults = 3): ?array
    {
        try {
            $payload = ['n_results' => $nResults];

            if ($topicId) {
                $payload['topic_id'] = $topicId;
            } elseif ($text) {
                $payload['text'] = $text;
            } else {
                return null;
            }

            $response = Http::timeout(10)->post("{$this->baseUrl}/similar", $payload);

            return $response->successful() ? $response->json() : null;
        } catch (ConnectionException $e) {
            Log::warning('RAG service unavailable: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Upload file (PDF/DOCX/TXT) for processing into RAG
     */
    public function processFile(UploadedFile $file, string $subject, ?string $title = null): ?array
    {
        try {
            $response = Http::timeout(30)
                ->attach('file', $file->getContent(), $file->getClientOriginalName())
                ->post("{$this->baseUrl}/process", [
                    'subject' => $subject,
                    'title' => $title ?? '',
                ]);

            return $response->successful() ? $response->json() : null;
        } catch (ConnectionException $e) {
            Log::warning('RAG service unavailable: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Bulk seed topics into RAG
     */
    public function seed(array $topics): bool
    {
        try {
            $response = Http::timeout(30)->post("{$this->baseUrl}/seed", [
                'topics' => $topics,
            ]);

            return $response->successful();
        } catch (ConnectionException $e) {
            Log::warning('RAG service unavailable: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check RAG service health
     */
    public function health(): ?array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");

            return $response->successful() ? $response->json() : null;
        } catch (ConnectionException $e) {
            return null;
        }
    }
}
