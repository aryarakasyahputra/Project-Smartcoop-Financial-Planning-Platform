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
        // 1. Table assumption_values
        Schema::create('assumption_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            
            // Customer Growth Drivers
            $table->integer('new_coops_acquired')->default(35);
            $table->decimal('monthly_churn_rate', 5, 2)->default(2.00);
            $table->integer('avg_members_per_coop')->default(700);
            $table->decimal('subscription_paying_frac', 5, 2)->default(100.00);
            
            // Pricing & Revenue Drivers
            $table->decimal('setup_fee', 15, 2)->default(40000000.00);
            $table->integer('paid_implementation_coops')->default(30);
            $table->decimal('monthly_subscription_fee', 15, 2)->default(500000.00);
            $table->decimal('ios_addon_monthly_fee', 15, 2)->default(200000.00);
            $table->decimal('ios_adoption_frac', 5, 2)->default(40.00);
            $table->integer('white_label_projects')->default(0);
            $table->decimal('white_label_fee_per_project', 15, 2)->default(20000000.00);
            $table->decimal('ppob_active_coops_frac', 5, 2)->default(60.00);
            $table->integer('ppob_tx_per_coop_month')->default(20);
            $table->decimal('avg_ppob_fee_per_tx', 15, 2)->default(1000.00);
            $table->decimal('academy_participants_frac', 6, 3)->default(0.10);
            $table->decimal('academy_avg_price_per_participant', 15, 2)->default(200000.00);
            $table->integer('offline_trainings_per_month')->default(0);
            $table->decimal('offline_training_fee_per_coop', 15, 2)->default(2500000.00);
            $table->decimal('enterprise_api_revenue', 15, 2)->default(0.00);
            
            // Cost & Margin Drivers
            $table->decimal('cloud_cost_per_coop_month', 15, 2)->default(80000.00);
            $table->decimal('implementation_cost_per_coop', 15, 2)->default(6000000.00);
            $table->decimal('support_cost_per_coop_month', 15, 2)->default(75000.00);
            $table->decimal('payment_api_var_cost_frac', 5, 2)->default(20.00);
            $table->decimal('other_cost_of_revenue_frac', 5, 2)->default(8.00);
            
            // OPEX details
            $table->decimal('payroll_cost', 15, 2)->default(0.00);
            $table->decimal('sales_marketing_spend', 15, 2)->default(0.00);
            $table->decimal('office_utilities_internet', 15, 2)->default(0.00);
            $table->decimal('software_tools_subscriptions', 15, 2)->default(0.00);
            $table->decimal('legal_accounting_compliance', 15, 2)->default(0.00);
            $table->decimal('travel_events', 15, 2)->default(0.00);
            $table->decimal('recruitment_training', 15, 2)->default(0.00);
            $table->decimal('other_ga', 15, 2)->default(0.00);
            
            // Fundraising & Valuation
            $table->decimal('seed_investment', 15, 2)->default(8250000000.00);
            $table->decimal('pre_money_valuation', 15, 2)->default(46200000000.00);
            $table->decimal('exit_revenue_multiple_conservative', 5, 2)->default(3.00);
            $table->decimal('exit_revenue_multiple_base', 5, 2)->default(5.00);
            $table->decimal('exit_revenue_multiple_optimistic', 5, 2)->default(7.00);
            
            $table->timestamps();
        });

        // 2. Table revenue_projections
        Schema::create('revenue_projections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->decimal('setup_implementation_revenue', 15, 2)->default(0);
            $table->decimal('saas_subscription_revenue', 15, 2)->default(0);
            $table->decimal('ios_addon_revenue', 15, 2)->default(0);
            $table->decimal('white_label_revenue', 15, 2)->default(0);
            $table->decimal('ppob_transaction_revenue', 15, 2)->default(0);
            $table->decimal('academy_revenue', 15, 2)->default(0);
            $table->decimal('offline_training_revenue', 15, 2)->default(0);
            $table->decimal('enterprise_api_revenue', 15, 2)->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->decimal('arr', 15, 2)->default(0);
            $table->decimal('arpu', 15, 2)->default(0);
            $table->timestamps();
        });

        // 3. Table cost_projections
        Schema::create('cost_projections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->decimal('cloud_infrastructure_cost', 15, 2)->default(0);
            $table->decimal('implementation_onboarding_cost', 15, 2)->default(0);
            $table->decimal('customer_support_cost', 15, 2)->default(0);
            $table->decimal('payment_api_variable_cost', 15, 2)->default(0);
            $table->decimal('other_cost_of_revenue', 15, 2)->default(0);
            $table->decimal('total_cogs', 15, 2)->default(0);
            $table->decimal('gross_profit', 15, 2)->default(0);
            $table->decimal('gross_margin', 5, 2)->default(0);
            $table->decimal('payroll_opex', 15, 2)->default(0);
            $table->decimal('sales_marketing_opex', 15, 2)->default(0);
            $table->decimal('office_utilities_opex', 15, 2)->default(0);
            $table->decimal('software_tools_opex', 15, 2)->default(0);
            $table->decimal('legal_accounting_opex', 15, 2)->default(0);
            $table->decimal('travel_events_opex', 15, 2)->default(0);
            $table->decimal('recruitment_training_opex', 15, 2)->default(0);
            $table->decimal('other_ga_opex', 15, 2)->default(0);
            $table->decimal('total_opex', 15, 2)->default(0);
            $table->timestamps();
        });

        // 4. Table financial_summaries
        Schema::create('financial_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->integer('active_cooperatives')->default(0);
            $table->integer('total_cooperative_members')->default(0);
            $table->decimal('revenue', 15, 2)->default(0);
            $table->decimal('cogs', 15, 2)->default(0);
            $table->decimal('opex', 15, 2)->default(0);
            $table->decimal('ebitda', 15, 2)->default(0);
            $table->decimal('ebitda_margin', 5, 2)->default(0);
            $table->decimal('ending_cash', 15, 2)->default(0);
            $table->decimal('runway_months', 5, 2)->default(0);
            $table->decimal('mrr', 15, 2)->default(0);
            $table->decimal('arr', 15, 2)->default(0);
            $table->decimal('estimated_cac', 15, 2)->default(0);
            $table->decimal('estimated_ltv', 15, 2)->default(0);
            $table->decimal('ltv_cac_ratio', 10, 2)->default(0);
            $table->decimal('cac_payback_months', 5, 2)->default(0);
            $table->decimal('rule_of_40', 8, 4)->default(0);
            $table->decimal('enterprise_value_conservative', 15, 2)->default(0);
            $table->decimal('enterprise_value_base', 15, 2)->default(0);
            $table->decimal('enterprise_value_optimistic', 15, 2)->default(0);
            $table->decimal('post_money_valuation', 15, 2)->default(0);
            $table->decimal('implied_seed_equity_frac', 8, 4)->default(0);
            $table->decimal('investor_moic_conservative', 8, 4)->default(0);
            $table->decimal('investor_moic_base', 8, 4)->default(0);
            $table->decimal('investor_moic_optimistic', 8, 4)->default(0);
            $table->decimal('investor_irr_conservative', 8, 4)->default(0);
            $table->decimal('investor_irr_base', 8, 4)->default(0);
            $table->decimal('investor_irr_optimistic', 8, 4)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_summaries');
        Schema::dropIfExists('cost_projections');
        Schema::dropIfExists('revenue_projections');
        Schema::dropIfExists('assumption_values');
    }
};
