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
            $table->integer('hr_engineering_fte')->default(5)->after('other_cost_of_revenue_frac');
            $table->integer('hr_sales_fte')->default(3)->after('hr_engineering_fte');
            $table->integer('hr_marketing_fte')->default(2)->after('hr_sales_fte');
            $table->integer('hr_support_fte')->default(4)->after('hr_marketing_fte');
            $table->integer('hr_finance_admin_fte')->default(2)->after('hr_support_fte');
            $table->integer('hr_management_fte')->default(3)->after('hr_finance_admin_fte');
            $table->decimal('hr_avg_salary_monthly', 15, 2)->default(10500000.00)->after('hr_management_fte');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assumption_values', function (Blueprint $table) {
            $table->dropColumn([
                'hr_engineering_fte',
                'hr_sales_fte',
                'hr_marketing_fte',
                'hr_support_fte',
                'hr_finance_admin_fte',
                'hr_management_fte',
                'hr_avg_salary_monthly',
            ]);
        });
    }
};
