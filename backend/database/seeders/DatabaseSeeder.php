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
        User::create([
            'name' => 'Admin',
            'email' => 'admin@abiturai.uz',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Teacher',
            'email' => 'teacher@abiturai.uz',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
        ]);

        User::create([
            'name' => 'Student',
            'email' => 'student@abiturai.uz',
            'password' => Hash::make('student123'),
            'role' => 'student',
        ]);

        $this->call(DtmContentSeeder::class);
    }
}
