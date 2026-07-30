<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\AssumptionValue;
use App\Services\FinancialModelService;

class ExcelFinancialModelSeeder extends Seeder
{
    /**
     * Run the database seeds with exact parameters from financial model Excel spec.
     */
    public function run(): void
    {
        $projects = Project::all();
        
        if ($projects->isEmpty()) {
            $this->command->info('No projects found. Please create a project first.');
            return;
        }

        $financialService = new FinancialModelService();

        // Exact data mapping per year from 2025 to 2029
        $modelData = [
            2025 => [
                'beginning_cooperatives' => 215,
                'new_coops_acquired' => 35,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 711,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 25,
                'monthly_subscription_fee' => 500000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 3,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000,
                'offline_trainings_per_month' => 7,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 672000000,
                
                'cloud_cost_per_coop_month' => 80000,
                'implementation_cost_per_coop' => 6000000,
                'support_cost_per_coop_month' => 75000,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 8.0,
                
                'seed_investment' => 8250000000,
                'pre_money_valuation' => 46200000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 5,
                'hr_sales_fte' => 3,
                'hr_marketing_fte' => 2,
                'hr_support_fte' => 4,
                'hr_finance_admin_fte' => 2,
                'hr_management_fte' => 3,
                'hr_avg_salary_monthly' => 10500000,
                
                'sales_marketing_spend' => 400000000,
                'office_utilities_internet' => 180000000,
                'software_tools_subscriptions' => 120000000,
                'legal_accounting_compliance' => 80000000,
                'travel_events' => 150000000,
                'recruitment_training' => 70000000,
                'other_ga' => 100000000,
            ],
            2026 => [
                'beginning_cooperatives' => 0, // calculated from previous year ending coops (246)
                'new_coops_acquired' => 35,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 700,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 30,
                'monthly_subscription_fee' => 500000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 4,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000,
                'offline_trainings_per_month' => 8,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 669000000,
                
                'cloud_cost_per_coop_month' => 80000,
                'implementation_cost_per_coop' => 6000000,
                'support_cost_per_coop_month' => 75000,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 8.0,
                
                'seed_investment' => 8250000000,
                'pre_money_valuation' => 46200000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 6,
                'hr_sales_fte' => 4,
                'hr_marketing_fte' => 3,
                'hr_support_fte' => 5,
                'hr_finance_admin_fte' => 3,
                'hr_management_fte' => 3,
                'hr_avg_salary_monthly' => 11000000,
                
                'sales_marketing_spend' => 600000000,
                'office_utilities_internet' => 220000000,
                'software_tools_subscriptions' => 150000000,
                'legal_accounting_compliance' => 100000000,
                'travel_events' => 180000000,
                'recruitment_training' => 90000000,
                'other_ga' =>130000000,
            ],
            2027 => [
                'beginning_cooperatives' => 0, // calculated from previous year ending coops (276)
                'new_coops_acquired' => 250,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 410,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 130,
                'monthly_subscription_fee' => 500000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 8,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000,
                'offline_trainings_per_month' => 10,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 747000000,
                
                'cloud_cost_per_coop_month' => 70000,
                'implementation_cost_per_coop' => 5500000,
                'support_cost_per_coop_month' => 70000,
                'payment_api_var_cost_frac' => 18.0,
                'other_cost_of_revenue_frac' => 7.0,
                
                'seed_investment' => 8250000000,
                'pre_money_valuation' => 46200000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 8,
                'hr_sales_fte' => 7,
                'hr_marketing_fte' => 4,
                'hr_support_fte' => 8,
                'hr_finance_admin_fte' => 4,
                'hr_management_fte' => 4,
                'hr_avg_salary_monthly' => 11500000,
                
                'sales_marketing_spend' => 900000000,
                'office_utilities_internet' => 300000000,
                'software_tools_subscriptions' => 220000000,
                'legal_accounting_compliance' => 150000000,
                'travel_events' => 300000000,
                'recruitment_training' => 150000000,
                'other_ga' => 200000000,
            ],
            2028 => [
                'beginning_cooperatives' => 0, // calculated from previous year ending coops (520)
                'new_coops_acquired' => 400,
                'monthly_churn_rate' => 1.5,
                'avg_members_per_coop' => 480,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 180,
                'monthly_subscription_fee' => 500000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 15,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 65.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000,
                'offline_trainings_per_month' => 12,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 3660000000,
                
                'cloud_cost_per_coop_month' => 60000,
                'implementation_cost_per_coop' => 5000000,
                'support_cost_per_coop_month' => 60000,
                'payment_api_var_cost_frac' => 16.0,
                'other_cost_of_revenue_frac' => 6.0,
                
                'seed_investment' => 8250000000,
                'pre_money_valuation' => 46200000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 11,
                'hr_sales_fte' => 10,
                'hr_marketing_fte' => 5,
                'hr_support_fte' => 12,
                'hr_finance_admin_fte' => 5,
                'hr_management_fte' => 4,
                'hr_avg_salary_monthly' => 12000000,
                
                'sales_marketing_spend' => 1500000000,
                'office_utilities_internet' => 400000000,
                'software_tools_subscriptions' => 350000000,
                'legal_accounting_compliance' => 200000000,
                'travel_events' => 500000000,
                'recruitment_training' => 250000000,
                'other_ga' => 300000000,
            ],
            2029 => [
                'beginning_cooperatives' => 0, // calculated from previous year ending coops (912)
                'new_coops_acquired' => 500,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 536,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 260,
                'monthly_subscription_fee' => 500000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 25,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 70.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000,
                'offline_trainings_per_month' => 15,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 10554000000,
                
                'cloud_cost_per_coop_month' => 50000,
                'implementation_cost_per_coop' => 4500000,
                'support_cost_per_coop_month' => 55000,
                'payment_api_var_cost_frac' => 15.0,
                'other_cost_of_revenue_frac' => 5.0,
                
                'seed_investment' => 8250000000,
                'pre_money_valuation' => 46200000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 15,
                'hr_sales_fte' => 14,
                'hr_marketing_fte' => 7,
                'hr_support_fte' => 18,
                'hr_finance_admin_fte' => 6,
                'hr_management_fte' => 5,
                'hr_avg_salary_monthly' => 12500000,
                
                'sales_marketing_spend' => 2200000000,
                'office_utilities_internet' => 550000000,
                'software_tools_subscriptions' => 500000000,
                'legal_accounting_compliance' => 300000000,
                'travel_events' => 800000000,
                'recruitment_training' => 350000000,
                'other_ga' => 500000000,
            ],
        ];

        foreach ($projects as $project) {
            foreach ($modelData as $year => $data) {
                AssumptionValue::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    $data
                );
            }

            // Recalculate projections for the project
            $financialService->recalculate($project->id, $modelData);
            $this->command->info("Seeded and recalculated financial model for Project: {$project->name} (ID: {$project->id})");
        }

        $this->command->info('Excel Financial Model Seeder completed successfully!');
    }
}
