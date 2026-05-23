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

        foreach ($data['subjects'] as $subjectData) {
            $subject = Subject::firstOrCreate(
                ['name' => $subjectData['name']],
                ['icon' => $subjectData['icon'], 'description' => $subjectData['description']]
            );

            foreach ($subjectData['topics'] as $topicData) {
                $topic = Topic::create([
                    'subject_id' => $subject->id,
                    'title' => $topicData['title'],
                    'content' => $topicData['content'],
                    'order_num' => $topicData['order_num'],
                ]);

                foreach ($topicData['questions'] as $questionData) {
                    Question::create([
                        'topic_id' => $topic->id,
                        ...$questionData,
                    ]);
                }
            }
        }
    }
}
