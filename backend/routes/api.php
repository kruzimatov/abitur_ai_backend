<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeynmanController;
use App\Http\Controllers\GeneratorController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\TutorController;
use Illuminate\Support\Facades\Route;

// ─── Auth (public) ───
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// ─── Protected routes ───
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard/student', [DashboardController::class, 'student']);
    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);

    // Subjects (read for students, CRUD for admin/teacher)
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}/topics', [SubjectController::class, 'topics']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);

    // Topics (read for students, CRUD for admin/teacher)
    Route::get('/topics/{id}', [TopicController::class, 'show']);
    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{id}', [TopicController::class, 'update']);
    Route::delete('/topics/{id}', [TopicController::class, 'destroy']);

    // Questions (CRUD for admin/teacher)
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);

    // Quiz (student)
    Route::post('/quiz/{topicId}/start', [QuizController::class, 'start']);
    Route::post('/quiz/submit', [QuizController::class, 'submit']);
    Route::get('/quiz/result/{id}', [QuizController::class, 'result']);
    Route::get('/quiz/history', [QuizController::class, 'history']);

    // AI Features
    Route::post('/tutor/ask', [TutorController::class, 'ask']);
    Route::post('/feynman/evaluate', [FeynmanController::class, 'evaluate']);
    Route::post('/generator/create', [GeneratorController::class, 'create']);
});
