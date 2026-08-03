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
            $table->decimal('founders_pre_seed_pct', 5, 2)->default(100.00)->after('exit_revenue_multiple_optimistic');
            $table->decimal('esop_pre_seed_pct', 5, 2)->default(0.00)->after('founders_pre_seed_pct');
            $table->decimal('investor_pre_seed_pct', 5, 2)->default(0.00)->after('esop_pre_seed_pct');
            $table->decimal('founders_seed_investment', 15, 2)->default(0.00)->after('investor_pre_seed_pct');
            $table->decimal('esop_seed_investment', 15, 2)->default(0.00)->after('founders_seed_investment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assumption_values', function (Blueprint $table) {
            $table->dropColumn([
                'founders_pre_seed_pct',
                'esop_pre_seed_pct',
                'investor_pre_seed_pct',
                'founders_seed_investment',
                'esop_seed_investment',
            ]);
        });
    }
};
