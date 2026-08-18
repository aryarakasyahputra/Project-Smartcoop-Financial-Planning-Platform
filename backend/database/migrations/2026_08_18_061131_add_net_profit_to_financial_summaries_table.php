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
        Schema::table('financial_summaries', function (Blueprint $table) {
            $table->decimal('net_profit', 15, 2)->default(0)->after('ebitda_margin');
            $table->decimal('net_margin', 5, 2)->default(0)->after('net_profit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('financial_summaries', function (Blueprint $table) {
            $table->dropColumn(['net_profit', 'net_margin']);
        });
    }
};
