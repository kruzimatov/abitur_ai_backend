<?php

namespace Database\Seeders;

use App\Models\Field;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class FieldSeeder extends Seeder
{
    public function run(): void
    {
        // Create all subjects
        $subjects = [];
        $subjectNames = [
            'Matematika',
            'Amaliy matematika',
            'Fizika',
            'Kimyo',
            'Biologiya',
            'Ona tili',
            "O'zbekiston Tarixi",
        ];

        foreach ($subjectNames as $name) {
            $subjects[$name] = Subject::firstOrCreate(
                ['name' => $name],
                ['description' => "$name fani bo'yicha DTM tayyorgarlik"]
            );
        }

        // Create fields with subject mappings
        $fields = [
            'Amaliy matematika va kompyuter tahlili' => [
                'Amaliy matematika', 'Fizika', 'Ona tili', "O'zbekiston Tarixi", 'Matematika',
            ],
            "Dasturiy injiniring va sun'iy intellekt" => [
                'Amaliy matematika', 'Fizika', 'Ona tili', "O'zbekiston Tarixi", 'Matematika',
            ],
            'Umumiy davolash' => [
                'Kimyo', 'Biologiya', 'Ona tili', "O'zbekiston Tarixi", 'Matematika',
            ],
            'Biotexnologiya va ekologiya' => [
                'Biologiya', 'Kimyo', 'Ona tili', "O'zbekiston Tarixi", 'Matematika',
            ],
            'Sanoat farmatsiyasi va dori vositalari' => [
                'Kimyo', 'Biologiya', 'Ona tili', "O'zbekiston Tarixi", 'Matematika',
            ],
        ];

        foreach ($fields as $fieldName => $subjectList) {
            $field = Field::create(['name' => $fieldName]);

            $subjectIds = [];
            foreach ($subjectList as $subjectName) {
                $subjectIds[] = $subjects[$subjectName]->id;
            }

            $field->subjects()->attach($subjectIds);
        }
    }
}
