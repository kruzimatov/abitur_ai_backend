<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('lastname')->nullable()->after('firstname');
            $table->enum('gender', ['male', 'female'])->nullable()->after('lastname');
            $table->foreignId('field_id')->nullable()->constrained()->nullOnDelete()->after('role');
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete()->after('field_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['field_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['lastname', 'gender', 'field_id', 'subject_id']);
        });
    }
};
