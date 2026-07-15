<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\AssumptionValue;

class DummyAssumptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();
        
        if ($projects->isEmpty()) {
            $this->command->info('No projects found. Please create a project first.');
            return;
        }

        $dummyYears = [2025, 2026, 2027, 2028, 2029];
        
        foreach ($projects as $project) {
            foreach ($dummyYears as $idx => $year) {
                $acquired = 35 + ($idx * 15);
                
                AssumptionValue::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    [
                        'beginning_cooperatives' => $year === 2025 ? 215 : 0,
                        'new_coops_acquired' => $acquired,
                        'monthly_churn_rate' => 2.0 - ($idx * 0.2),
                        'avg_members_per_coop' => 700 + ($idx * 50),
                        'subscription_paying_frac' => 100,
                        
                        'setup_fee' => 40000000,
                        'paid_implementation_coops' => $acquired - 5,
                        'monthly_subscription_fee' => 500000,
                        'ios_addon_monthly_fee' => 200000,
                        'ios_adoption_frac' => 40 + ($idx * 5),
                        'white_label_projects' => 2 + $idx,
                        'white_label_fee_per_project' => 20000000,
                        'ppob_active_coops_frac' => 60 + ($idx * 5),
                        'ppob_tx_per_coop_month' => 20 + ($idx * 2),
                        'avg_ppob_fee_per_tx' => 1000,
                        'academy_participants_frac' => 0.1, // 10%
                        'academy_avg_price_per_participant' => 200000,
                        'offline_trainings_per_month' => 1 + $idx,
                        'offline_training_fee_per_coop' => 2500000,
                        'enterprise_api_revenue' => 0 + ($idx > 2 ? 150000000 : 0),
                        
                        'cloud_cost_per_coop_month' => 80000,
                        'implementation_cost_per_coop' => 6000000,
                        'support_cost_per_coop_month' => 75000,
                        'payment_api_var_cost_frac' => 20,
                        'other_cost_of_revenue_frac' => 8,
                        
                        'hr_engineering_fte' => 5 + ($idx * 2),
                        'hr_sales_fte' => 3 + ($idx * 2),
                        'hr_marketing_fte' => 2 + $idx,
                        'hr_support_fte' => 4 + ($idx * 2),
                        'hr_finance_admin_fte' => 2 + floor($idx / 2),
                        'hr_management_fte' => 3 + floor($idx / 2),
                        'hr_avg_salary_monthly' => 10500000 + ($idx * 500000),
                        
                        'sales_marketing_spend' => 150000000 + ($idx * 50000000),
                        'office_utilities_internet' => 25000000 + ($idx * 5000000),
                        'software_tools_subscriptions' => 15000000 + ($idx * 3000000),
                        'legal_accounting_compliance' => 10000000 + ($idx * 2000000),
                        'travel_events' => 5000000 + ($idx * 2000000),
                        'recruitment_training' => 8000000 + ($idx * 3000000),
                        'other_ga' => 5000000 + ($idx * 1000000),
                        
                        'seed_investment' => $year === 2025 ? 8250000000 : 0,
                        'pre_money_valuation' => 46200000000,
                        'exit_revenue_multiple_conservative' => 3,
                        'exit_revenue_multiple_base' => 5,
                        'exit_revenue_multiple_optimistic' => 7,
                    ]
                );
            }
        }
        
        $this->command->info('Dummy financial assumptions seeded successfully!');
    }
}
