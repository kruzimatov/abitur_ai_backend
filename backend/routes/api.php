<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FeynmanController;
use App\Http\Controllers\GeneratorController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\TutorController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}/topics', [SubjectController::class, 'topics']);
    Route::get('/topics/{id}', [TopicController::class, 'show']);

    Route::post('/quiz/{topicId}/start', [QuizController::class, 'start']);
    Route::post('/quiz/submit', [QuizController::class, 'submit']);
    Route::get('/quiz/result/{id}', [QuizController::class, 'result']);
    Route::get('/quiz/history', [QuizController::class, 'history']);

    Route::post('/tutor/ask', [TutorController::class, 'ask']);
    Route::post('/feynman/evaluate', [FeynmanController::class, 'evaluate']);
    Route::post('/generator/create', [GeneratorController::class, 'create']);
});
