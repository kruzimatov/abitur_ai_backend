<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_topic_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->integer('best_score')->default(0);
            $table->integer('attempts_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->enum('status', ['new', 'in_progress', 'completed'])->default('new');
            $table->timestamps();

            $table->unique(['user_id', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_topic_progress');
    }
};
