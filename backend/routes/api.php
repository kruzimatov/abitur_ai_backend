<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\FeynmanController;
use App\Http\Controllers\GeneratorController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\TutorController;
use Illuminate\Support\Facades\Route;

// ─── Public (no auth needed) ───
Route::get('/fields', [FieldController::class, 'index']);
Route::get('/fields/{id}', [FieldController::class, 'show']);

// ─── Auth (public) ───
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// ─── All authenticated users ───
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}/topics', [SubjectController::class, 'topics']);
    Route::get('/topics/{id}', [TopicController::class, 'show']);
});

// ─── Student routes ───
Route::middleware(['auth:api', 'role:student,teacher,admin'])->group(function () {
    Route::get('/dashboard/student', [DashboardController::class, 'student']);

    Route::post('/quiz/{topicId}/start', [QuizController::class, 'start']);
    Route::post('/quiz/submit', [QuizController::class, 'submit']);
    Route::get('/quiz/result/{id}', [QuizController::class, 'result']);
    Route::get('/quiz/history', [QuizController::class, 'history']);

    Route::post('/tutor/ask', [TutorController::class, 'ask']);
    Route::post('/feynman/evaluate', [FeynmanController::class, 'evaluate']);
});

// ─── Teacher routes ───
Route::middleware(['auth:api', 'role:teacher,admin'])->group(function () {
    Route::post('/generator/create', [GeneratorController::class, 'create']);

    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);

    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{id}', [TopicController::class, 'update']);

    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
});

// ─── Admin routes ───
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);

    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
    Route::delete('/topics/{id}', [TopicController::class, 'destroy']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
});
