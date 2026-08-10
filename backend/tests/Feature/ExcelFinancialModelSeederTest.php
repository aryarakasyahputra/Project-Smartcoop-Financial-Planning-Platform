<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\DatabaseSeeder;
use App\Models\User;
use App\Models\UserCompanyAccess;
use App\Models\Project;
use App\Models\AssumptionValue;
use App\Models\RevenueProjection;
use App\Models\CostProjection;
use App\Models\FinancialSummary;

class ExcelFinancialModelSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_excel_financial_model_seeder_creates_data_for_finance_user(): void
    {
        $this->seed(DatabaseSeeder::class);

        $financeUser = User::where('email', 'finance@test.com')->first();
        $this->assertNotNull($financeUser, 'Finance user should exist.');

        $companyAccess = UserCompanyAccess::where('user_id', $financeUser->id)->first();
        $this->assertNotNull($companyAccess, 'Finance user company access should exist.');

        $project = Project::where('company_id', $companyAccess->company_id)->first();
        $this->assertNotNull($project, 'Finance user project should exist.');

        // Verify Assumption Values for 2025-2029
        $years = [2025, 2026, 2027, 2028, 2029];
        foreach ($years as $year) {
            $assumption = AssumptionValue::where('project_id', $project->id)->where('year', $year)->first();
            $this->assertNotNull($assumption, "Assumption for year {$year} should exist.");
        }

        // Verify 2025 specific values from image 1 & 3 & 4
        $a2025 = AssumptionValue::where('project_id', $project->id)->where('year', 2025)->first();
        $this->assertEquals(215, $a2025->beginning_cooperatives);
        $this->assertEquals(35, $a2025->new_coops_acquired);
        $this->assertEquals(1.0, $a2025->monthly_churn_rate);
        $this->assertEquals(620, $a2025->avg_members_per_coop);
        $this->assertEquals(80.0, $a2025->subscription_paying_frac);

        $this->assertEquals(40000000, $a2025->setup_fee);
        $this->assertEquals(31, $a2025->paid_implementation_coops);
        $this->assertEquals(300000, $a2025->monthly_subscription_fee);
        $this->assertEquals(200000, $a2025->ios_addon_monthly_fee);
        $this->assertEquals(0.0, $a2025->ios_adoption_frac);
        $this->assertEquals(5, $a2025->white_label_projects);
        $this->assertEquals(20000000, $a2025->white_label_fee_per_project);
        $this->assertEquals(2.0, $a2025->ppob_active_coops_frac);
        $this->assertEquals(10, $a2025->ppob_tx_per_coop_month);
        $this->assertEquals(500, $a2025->avg_ppob_fee_per_tx);
        $this->assertEquals(0.0, $a2025->academy_participants_frac);
        $this->assertEquals(149000, $a2025->academy_avg_price_per_participant);
        $this->assertEquals(10, $a2025->offline_trainings_per_month);
        $this->assertEquals(2500000, $a2025->offline_training_fee_per_coop);
        $this->assertEquals(30000000, $a2025->enterprise_api_revenue);

        $this->assertEquals(70000, $a2025->cloud_cost_per_coop_month);
        $this->assertEquals(1500000, $a2025->implementation_cost_per_coop);
        $this->assertEquals(25000, $a2025->support_cost_per_coop_month);
        $this->assertEquals(20.0, $a2025->payment_api_var_cost_frac);
        $this->assertEquals(1.0, $a2025->other_cost_of_revenue_frac);

        $this->assertEquals(10000000000, $a2025->seed_investment);
        $this->assertEquals(33000000000, $a2025->pre_money_valuation);

        $this->assertEquals(5, $a2025->hr_engineering_fte);
        $this->assertEquals(2, $a2025->hr_sales_fte);
        $this->assertEquals(1, $a2025->hr_marketing_fte);
        $this->assertEquals(4, $a2025->hr_support_fte);
        $this->assertEquals(1, $a2025->hr_finance_admin_fte);
        $this->assertEquals(2, $a2025->hr_management_fte);
        $this->assertEquals(7500000, $a2025->hr_avg_salary_monthly);

        $this->assertEquals(50000000, $a2025->sales_marketing_spend);
        $this->assertEquals(120000000, $a2025->office_utilities_internet);
        $this->assertEquals(45000000, $a2025->software_tools_subscriptions);
        $this->assertEquals(20000000, $a2025->legal_accounting_compliance);
        $this->assertEquals(55000000, $a2025->travel_events);
        $this->assertEquals(30000000, $a2025->recruitment_training);
        $this->assertEquals(50000000, $a2025->other_ga);

        // Verify total OPEX calculation for 2025 (1,720,000,000)
        $cost2025 = CostProjection::where('project_id', $project->id)->where('year', 2025)->first();
        $this->assertNotNull($cost2025);
        $this->assertEquals(1720000000, $cost2025->total_opex);

        // Verify summaries created for all 5 years
        $summariesCount = FinancialSummary::where('project_id', $project->id)->count();
        $this->assertEquals(5, $summariesCount);
    }
}
