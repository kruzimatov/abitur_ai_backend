<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class DtmContentSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(base_path('seed_data.json')), true);

        // Map old IDs to new model IDs
        $subjectMap = [];
        $topicMap = [];

        // 1. Seed subjects
        foreach ($data['subjects'] as $subjectData) {
            $subject = Subject::firstOrCreate(
                ['name' => $subjectData['name']],
                ['description' => $subjectData['description'] ?? null]
            );
            $subjectMap[$subjectData['id']] = $subject->id;
        }

        // 2. Seed topics
        foreach ($data['topics'] as $topicData) {
            $realSubjectId = $subjectMap[$topicData['subject_id']] ?? null;
            if (! $realSubjectId) continue;

            $topic = Topic::create([
                'subject_id' => $realSubjectId,
                'title' => $topicData['title'],
                'content' => $topicData['content'],
                'order_num' => $topicData['order_num'],
            ]);
            $topicMap[$topicData['id']] = $topic->id;
        }

        // 3. Seed questions
        foreach ($data['questions'] as $questionData) {
            $realTopicId = $topicMap[$questionData['topic_id']] ?? null;
            if (! $realTopicId) continue;

            Question::create([
                'topic_id' => $realTopicId,
                'question_text' => $questionData['question_text'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'correct_answer' => $questionData['correct_answer'],
                'explanation' => $questionData['explanation'] ?? null,
            ]);
        }
    }
}
