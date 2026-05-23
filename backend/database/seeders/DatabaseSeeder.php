<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Seed fields + all subjects
        $this->call(FieldSeeder::class);

        // 2. Seed DTM content (topics + questions for Matematika)
        $this->call(DtmContentSeeder::class);

        // 3. Create default users
        $field = \App\Models\Field::where('name', "Dasturiy injiniring va sun'iy intellekt")->first();
        $subject = \App\Models\Subject::where('name', 'Matematika')->first();

        User::create([
            'name' => 'Admin',
            'surname' => 'Adminov',
            'email' => 'admin@abiturai.uz',
            'password' => Hash::make('admin123'),
            'gender' => 'male',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Malika',
            'surname' => 'Karimova',
            'email' => 'teacher@abiturai.uz',
            'password' => Hash::make('teacher123'),
            'gender' => 'female',
            'role' => 'teacher',
            'subject_id' => $subject->id,
        ]);

        User::create([
            'name' => 'Ali',
            'surname' => 'Valiyev',
            'email' => 'student@abiturai.uz',
            'password' => Hash::make('student123'),
            'gender' => 'male',
            'role' => 'student',
            'field_id' => $field->id,
        ]);
    }
}
