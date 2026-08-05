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
        if (!Schema::hasColumn('assumption_values', 'initial_opening_cash')) {
            Schema::table('assumption_values', function (Blueprint $table) {
                $table->decimal('initial_opening_cash', 18, 2)->default(0.00)->nullable()->after('seed_investment');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('assumption_values', 'initial_opening_cash')) {
            Schema::table('assumption_values', function (Blueprint $table) {
                $table->dropColumn('initial_opening_cash');
            });
        }
    }
};
