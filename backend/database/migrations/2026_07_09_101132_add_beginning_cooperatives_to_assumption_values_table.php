<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assumption_values', function (Blueprint $table) {
            $table->integer('beginning_cooperatives')->default(215)->after('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assumption_values', function (Blueprint $table) {
            $table->dropColumn('beginning_cooperatives');
        });
    }
};
