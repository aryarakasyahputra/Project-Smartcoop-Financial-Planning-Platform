<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use App\Models\AssumptionValue;
use App\Services\FinancialModelService;

class FinanceUserFinancialModelSeeder extends Seeder
{
    /**
     * Run the database seeds with exact parameters from financial model Excel spec
     * specifically for the user finance@test.com.
     */
    public function run(): void
    {
        $user = User::where('email', 'finance@test.com')->first();
        if (!$user) {
            $this->command->error('User finance@test.com not found.');
            return;
        }

        $companyIds = $user->companyAccesses()->pluck('company_id')->toArray();
        $projects = Project::whereIn('company_id', $companyIds)->get();

        if ($projects->isEmpty()) {
            $this->command->info('No projects found for finance@test.com. Creating a default company and project...');
            
            // Check if user has any company at all
            if (empty($companyIds)) {
                $company = \App\Models\Company::firstOrCreate(['name' => 'Finance Test Company']);
                \App\Models\UserCompanyAccess::firstOrCreate([
                    'user_id' => $user->id,
                    'company_id' => $company->id
                ]);
            } else {
                $company = \App\Models\Company::find($companyIds[0]);
            }

            $project = Project::firstOrCreate([
                'company_id' => $company->id,
                'name' => 'Proyeksi Keuangan Finance'
            ]);
            
            $projects = collect([$project]);
        }

        $financialService = new FinancialModelService();

        // Exact data mapping per year from 2025 to 2029 for finance@test.com
        $modelData = [
            2025 => [
                'beginning_cooperatives' => 215,
                'new_coops_acquired' => 35,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 620,
                'subscription_paying_frac' => 80.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 31,
                'monthly_subscription_fee' => 300000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 0.0,
                'white_label_projects' => 5,
                'white_label_fee_per_project' => 20000000,
                'ppob_active_coops_frac' => 2.0,
                'ppob_tx_per_coop_month' => 10,
                'avg_ppob_fee_per_tx' => 500,
                'academy_participants_frac' => 0.0,
                'academy_avg_price_per_participant' => 149000,
                'offline_trainings_per_month' => 10,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 30000000,
                
                'cloud_cost_per_coop_month' => 70000,
                'implementation_cost_per_coop' => 1500000,
                'support_cost_per_coop_month' => 25000,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 1.0,
                
                'seed_investment' => 10000000000,
                'pre_money_valuation' => 33000000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                // HR & OPEX 2025
                'hr_engineering_fte' => 5,
                'hr_sales_fte' => 2,
                'hr_marketing_fte' => 1,
                'hr_support_fte' => 4,
                'hr_finance_admin_fte' => 1,
                'hr_management_fte' => 2,
                'hr_avg_salary_monthly' => 7500000,
                
                'sales_marketing_spend' => 50000000,
                'office_utilities_internet' => 120000000,
                'software_tools_subscriptions' => 45000000,
                'legal_accounting_compliance' => 20000000,
                'travel_events' => 55000000,
                'recruitment_training' => 30000000,
                'other_ga' => 50000000,
            ],
            2026 => [
                'beginning_cooperatives' => 248,
                'new_coops_acquired' => 40,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 580,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 40000000,
                'paid_implementation_coops' => 35,
                'monthly_subscription_fee' => 375000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 10.0,
                'white_label_projects' => 8,
                'white_label_fee_per_project' => 22500000,
                'ppob_active_coops_frac' => 7.0,
                'ppob_tx_per_coop_month' => 10,
                'avg_ppob_fee_per_tx' => 550,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 149000,
                'offline_trainings_per_month' => 12,
                'offline_training_fee_per_coop' => 2500000,
                'enterprise_api_revenue' => 75000000,
                
                'cloud_cost_per_coop_month' => 60000,
                'implementation_cost_per_coop' => 1500000,
                'support_cost_per_coop_month' => 30000,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 2.0,
                
                'seed_investment' => 10000000000,
                'pre_money_valuation' => 33000000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 6,
                'hr_sales_fte' => 5,
                'hr_marketing_fte' => 3,
                'hr_support_fte' => 5,
                'hr_finance_admin_fte' => 2,
                'hr_management_fte' => 3,
                'hr_avg_salary_monthly' => 8000000,
                
                'sales_marketing_spend' => 50000000,
                'office_utilities_internet' => 150000000,
                'software_tools_subscriptions' => 85000000,
                'legal_accounting_compliance' => 30000000,
                'travel_events' => 60000000,
                'recruitment_training' => 75000000,
                'other_ga' => 50000000,
            ],
            2027 => [
                'beginning_cooperatives' => 286,
                'new_coops_acquired' => 120,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 500,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 25000000,
                'paid_implementation_coops' => 110,
                'monthly_subscription_fee' => 550000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 25.0,
                'white_label_projects' => 20,
                'white_label_fee_per_project' => 25000000,
                'ppob_active_coops_frac' => 18.0,
                'ppob_tx_per_coop_month' => 10,
                'avg_ppob_fee_per_tx' => 600,
                'academy_participants_frac' => 0.2,
                'academy_avg_price_per_participant' => 125000,
                'offline_trainings_per_month' => 20,
                'offline_training_fee_per_coop' => 3000000,
                'enterprise_api_revenue' => 150000000,
                
                'cloud_cost_per_coop_month' => 50000,
                'implementation_cost_per_coop' => 1500000,
                'support_cost_per_coop_month' => 40000,
                'payment_api_var_cost_frac' => 18.0,
                'other_cost_of_revenue_frac' => 2.0,
                
                'seed_investment' => 10000000000,
                'pre_money_valuation' => 33000000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 8,
                'hr_sales_fte' => 7,
                'hr_marketing_fte' => 4,
                'hr_support_fte' => 8,
                'hr_finance_admin_fte' => 2,
                'hr_management_fte' => 4,
                'hr_avg_salary_monthly' => 8000000,
                
                'sales_marketing_spend' => 500000000,
                'office_utilities_internet' => 240000000,
                'software_tools_subscriptions' => 150000000,
                'legal_accounting_compliance' => 75000000,
                'travel_events' => 150000000,
                'recruitment_training' => 100000000,
                'other_ga' => 100000000,
            ],
            2028 => [
                'beginning_cooperatives' => 403,
                'new_coops_acquired' => 300,
                'monthly_churn_rate' => 1.5,
                'avg_members_per_coop' => 650,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 15000000,
                'paid_implementation_coops' => 290,
                'monthly_subscription_fee' => 750000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 35.0,
                'white_label_projects' => 75,
                'white_label_fee_per_project' => 25000000,
                'ppob_active_coops_frac' => 20.0,
                'ppob_tx_per_coop_month' => 12,
                'avg_ppob_fee_per_tx' => 600,
                'academy_participants_frac' => 0.5,
                'academy_avg_price_per_participant' => 125000,
                'offline_trainings_per_month' => 35,
                'offline_training_fee_per_coop' => 3000000,
                'enterprise_api_revenue' => 350000000,
                
                'cloud_cost_per_coop_month' => 45000,
                'implementation_cost_per_coop' => 1250000,
                'support_cost_per_coop_month' => 55000,
                'payment_api_var_cost_frac' => 16.0,
                'other_cost_of_revenue_frac' => 2.0,
                
                'seed_investment' => 10000000000,
                'pre_money_valuation' => 33000000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 11,
                'hr_sales_fte' => 10,
                'hr_marketing_fte' => 5,
                'hr_support_fte' => 10,
                'hr_finance_admin_fte' => 3,
                'hr_management_fte' => 4,
                'hr_avg_salary_monthly' => 9000000,
                
                'sales_marketing_spend' => 750000000,
                'office_utilities_internet' => 350000000,
                'software_tools_subscriptions' => 225000000,
                'legal_accounting_compliance' => 100000000,
                'travel_events' => 350000000,
                'recruitment_training' => 125000000,
                'other_ga' => 175000000,
            ],
            2029 => [
                'beginning_cooperatives' => 697,
                'new_coops_acquired' => 710,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 750,
                'subscription_paying_frac' => 100.0,
                
                'setup_fee' => 10000000,
                'paid_implementation_coops' => 700,
                'monthly_subscription_fee' => 850000,
                'ios_addon_monthly_fee' => 200000,
                'ios_adoption_frac' => 35.0,
                'white_label_projects' => 100,
                'white_label_fee_per_project' => 27500000,
                'ppob_active_coops_frac' => 30.0,
                'ppob_tx_per_coop_month' => 12,
                'avg_ppob_fee_per_tx' => 650,
                'academy_participants_frac' => 0.5,
                'academy_avg_price_per_participant' => 150000,
                'offline_trainings_per_month' => 70,
                'offline_training_fee_per_coop' => 3500000,
                'enterprise_api_revenue' => 500000000,
                
                'cloud_cost_per_coop_month' => 40000,
                'implementation_cost_per_coop' => 1250000,
                'support_cost_per_coop_month' => 60000,
                'payment_api_var_cost_frac' => 15.0,
                'other_cost_of_revenue_frac' => 2.0,
                
                'seed_investment' => 10000000000,
                'pre_money_valuation' => 33000000000,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
                
                'hr_engineering_fte' => 11,
                'hr_sales_fte' => 13,
                'hr_marketing_fte' => 7,
                'hr_support_fte' => 11,
                'hr_finance_admin_fte' => 3,
                'hr_management_fte' => 5,
                'hr_avg_salary_monthly' => 9000000,
                
                'sales_marketing_spend' => 1250000000,
                'office_utilities_internet' => 450000000,
                'software_tools_subscriptions' => 350000000,
                'legal_accounting_compliance' => 125000000,
                'travel_events' => 500000000,
                'recruitment_training' => 150000000,
                'other_ga' => 225000000,
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
            $this->command->info("Seeded and recalculated financial model for finance@test.com's Project: {$project->name} (ID: {$project->id})");
        }

        $this->command->info('Finance User Financial Model Seeder completed successfully!');
    }
}
