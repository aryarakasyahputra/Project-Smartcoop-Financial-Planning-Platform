<?php

namespace App\Services;

use App\Models\Project;
use App\Models\AssumptionValue;
use App\Models\RevenueProjection;
use App\Models\CostProjection;
use App\Models\FinancialSummary;
use Illuminate\Support\Facades\DB;

class FinancialModelService
{
    /**
     * Fetch active assumptions and projection summaries for a project.
     * If no assumptions exist, seed defaults.
     * 
     * @param mixed $projectId
     */
    public function getProjectData($projectId)
    {
        $project = Project::findOrFail($projectId);

        $years = [2025, 2026, 2027, 2028, 2029];
        $defaultAssumptions = [
            2025 => [
                'new_coops_acquired' => 35,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 711,
                'subscription_paying_frac' => 100.0,
                'setup_fee' => 40000000.0,
                'paid_implementation_coops' => 25,
                'monthly_subscription_fee' => 500000.0,
                'ios_addon_monthly_fee' => 200000.0,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 3,
                'white_label_fee_per_project' => 20000000.0,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000.0,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000.0,
                'offline_trainings_per_month' => 7,
                'offline_training_fee_per_coop' => 2500000.0,
                'enterprise_api_revenue' => 672000000.0,
                'cloud_cost_per_coop_month' => 80000.0,
                'implementation_cost_per_coop' => 6000000.0,
                'support_cost_per_coop_month' => 75000.0,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 8.0,
                'payroll_cost' => 2394000000.0,
                'sales_marketing_spend' => 400000000.0,
                'office_utilities_internet' => 180000000.0,
                'software_tools_subscriptions' => 120000000.0,
                'legal_accounting_compliance' => 80000000.0,
                'travel_events' => 150000000.0,
                'recruitment_training' => 70000000.0,
                'other_ga' => 100000000.0,
                'seed_investment' => 8250000000.0,
                'pre_money_valuation' => 46200000000.0,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
            ],
            2026 => [
                'new_coops_acquired' => 35,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 700,
                'subscription_paying_frac' => 100.0,
                'setup_fee' => 40000000.0,
                'paid_implementation_coops' => 30,
                'monthly_subscription_fee' => 500000.0,
                'ios_addon_monthly_fee' => 200000.0,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 4,
                'white_label_fee_per_project' => 20000000.0,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000.0,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000.0,
                'offline_trainings_per_month' => 8,
                'offline_training_fee_per_coop' => 2500000.0,
                'enterprise_api_revenue' => 669000000.0,
                'cloud_cost_per_coop_month' => 80000.0,
                'implementation_cost_per_coop' => 6000000.0,
                'support_cost_per_coop_month' => 75000.0,
                'payment_api_var_cost_frac' => 20.0,
                'other_cost_of_revenue_frac' => 8.0,
                'payroll_cost' => 3168000000.0,
                'sales_marketing_spend' => 600000000.0,
                'office_utilities_internet' => 220000000.0,
                'software_tools_subscriptions' => 150000000.0,
                'legal_accounting_compliance' => 100000000.0,
                'travel_events' => 180000000.0,
                'recruitment_training' => 90000000.0,
                'other_ga' => 130000000.0,
                'seed_investment' => 8250000000.0,
                'pre_money_valuation' => 46200000000.0,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
            ],
            2027 => [
                'new_coops_acquired' => 250,
                'monthly_churn_rate' => 2.0,
                'avg_members_per_coop' => 410,
                'subscription_paying_frac' => 100.0,
                'setup_fee' => 40000000.0,
                'paid_implementation_coops' => 130,
                'monthly_subscription_fee' => 500000.0,
                'ios_addon_monthly_fee' => 200000.0,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 8,
                'white_label_fee_per_project' => 20000000.0,
                'ppob_active_coops_frac' => 60.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000.0,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000.0,
                'offline_trainings_per_month' => 10,
                'offline_training_fee_per_coop' => 2500000.0,
                'enterprise_api_revenue' => 747000000.0,
                'cloud_cost_per_coop_month' => 70000.0,
                'implementation_cost_per_coop' => 5500000.0,
                'support_cost_per_coop_month' => 70000.0,
                'payment_api_var_cost_frac' => 18.0,
                'other_cost_of_revenue_frac' => 7.0,
                'payroll_cost' => 4830000000.0,
                'sales_marketing_spend' => 900000000.0,
                'office_utilities_internet' => 300000000.0,
                'software_tools_subscriptions' => 220000000.0,
                'legal_accounting_compliance' => 150000000.0,
                'travel_events' => 300000000.0,
                'recruitment_training' => 150000000.0,
                'other_ga' => 200000000.0,
                'seed_investment' => 8250000000.0,
                'pre_money_valuation' => 46200000000.0,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
            ],
            2028 => [
                'new_coops_acquired' => 400,
                'monthly_churn_rate' => 1.5,
                'avg_members_per_coop' => 480,
                'subscription_paying_frac' => 100.0,
                'setup_fee' => 40000000.0,
                'paid_implementation_coops' => 180,
                'monthly_subscription_fee' => 500000.0,
                'ios_addon_monthly_fee' => 200000.0,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 15,
                'white_label_fee_per_project' => 20000000.0,
                'ppob_active_coops_frac' => 65.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000.0,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000.0,
                'offline_trainings_per_month' => 12,
                'offline_training_fee_per_coop' => 2500000.0,
                'enterprise_api_revenue' => 3660000000.0,
                'cloud_cost_per_coop_month' => 60000.0,
                'implementation_cost_per_coop' => 5000000.0,
                'support_cost_per_coop_month' => 60000.0,
                'payment_api_var_cost_frac' => 16.0,
                'other_cost_of_revenue_frac' => 6.0,
                'payroll_cost' => 6768000000.0,
                'sales_marketing_spend' => 1500000000.0,
                'office_utilities_internet' => 400000000.0,
                'software_tools_subscriptions' => 350000000.0,
                'legal_accounting_compliance' => 200000000.0,
                'travel_events' => 500000000.0,
                'recruitment_training' => 250000000.0,
                'other_ga' => 300000000.0,
                'seed_investment' => 8250000000.0,
                'pre_money_valuation' => 46200000000.0,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
            ],
            2029 => [
                'new_coops_acquired' => 500,
                'monthly_churn_rate' => 1.0,
                'avg_members_per_coop' => 536,
                'subscription_paying_frac' => 100.0,
                'setup_fee' => 40000000.0,
                'paid_implementation_coops' => 260,
                'monthly_subscription_fee' => 500000.0,
                'ios_addon_monthly_fee' => 200000.0,
                'ios_adoption_frac' => 40.0,
                'white_label_projects' => 25,
                'white_label_fee_per_project' => 20000000.0,
                'ppob_active_coops_frac' => 70.0,
                'ppob_tx_per_coop_month' => 20,
                'avg_ppob_fee_per_tx' => 1000.0,
                'academy_participants_frac' => 0.1,
                'academy_avg_price_per_participant' => 200000.0,
                'offline_trainings_per_month' => 15,
                'offline_training_fee_per_coop' => 2500000.0,
                'enterprise_api_revenue' => 10554000000.0,
                'cloud_cost_per_coop_month' => 50000.0,
                'implementation_cost_per_coop' => 4500000.0,
                'support_cost_per_coop_month' => 55000.0,
                'payment_api_var_cost_frac' => 15.0,
                'other_cost_of_revenue_frac' => 5.0,
                'payroll_cost' => 9750000000.0,
                'sales_marketing_spend' => 2200000000.0,
                'office_utilities_internet' => 550000000.0,
                'software_tools_subscriptions' => 500000000.0,
                'legal_accounting_compliance' => 300000000.0,
                'travel_events' => 800000000.0,
                'recruitment_training' => 350000000.0,
                'other_ga' => 500000000.0,
                'seed_investment' => 8250000000.0,
                'pre_money_valuation' => 46200000000.0,
                'exit_revenue_multiple_conservative' => 3.0,
                'exit_revenue_multiple_base' => 5.0,
                'exit_revenue_multiple_optimistic' => 7.0,
            ]
        ];

        // Ensure assumptions exist for each year
        foreach ($years as $year) {
            AssumptionValue::firstOrCreate(
                ['project_id' => $project->id, 'year' => $year],
                $defaultAssumptions[$year]
            );
        }

        // Fetch assumptions ordered by year
        $assumptions = AssumptionValue::where('project_id', $project->id)->orderBy('year')->get();

        // Fetch summaries
        $summaries = FinancialSummary::where('project_id', $project->id)->orderBy('year')->get();

        // If no projections exist, run initial calculation
        if ($summaries->isEmpty()) {
            // Prepare inputs by year from $assumptions
            $inputs = [];
            foreach ($assumptions as $a) {
                $inputs[$a->year] = $a->toArray();
            }
            $summaries = $this->recalculate($project->id, $inputs);
        }

        // Fetch revenue projections
        $revProjections = RevenueProjection::where('project_id', $project->id)->orderBy('year')->get();
        // Fetch cost projections
        $costProjections = CostProjection::where('project_id', $project->id)->orderBy('year')->get();

        return [
            'assumptions' => $assumptions,
            'financial_summaries' => $summaries,
            'revenue_projections' => $revProjections,
            'cost_projections' => $costProjections,
        ];
    }

    /**
     * Save new assumptions and perform a 5-year financial simulation.
     * $newAssumptions is an associative array keyed by year (e.g. 2025 => [...], 2026 => [...])
     * 
     * @param mixed $projectId
     * @param array $newAssumptions
     * @return \Illuminate\Support\Collection
     */
    public function recalculate($projectId, array $newAssumptions)
    {
        $project = Project::findOrFail($projectId);

        return DB::transaction(function () use ($project, $newAssumptions) {
            $years = [2025, 2026, 2027, 2028, 2029];
            $summaries = [];
            
            // Baseline active cooperatives before 2025 is 215
            $prevEndingActiveCoops = 215;
            $prevTotalRevenue = 0;
            $prevEndingCash = 0;

            foreach ($years as $year) {
                // 1. Save or update assumptions for this year
                $yearAssumptions = $newAssumptions[$year] ?? [];
                
                $assumptions = AssumptionValue::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    array_filter([
                        'new_coops_acquired' => $yearAssumptions['new_coops_acquired'] ?? null,
                        'monthly_churn_rate' => $yearAssumptions['monthly_churn_rate'] ?? null,
                        'avg_members_per_coop' => $yearAssumptions['avg_members_per_coop'] ?? null,
                        'subscription_paying_frac' => $yearAssumptions['subscription_paying_frac'] ?? null,
                        'setup_fee' => $yearAssumptions['setup_fee'] ?? null,
                        'paid_implementation_coops' => $yearAssumptions['paid_implementation_coops'] ?? null,
                        'monthly_subscription_fee' => $yearAssumptions['monthly_subscription_fee'] ?? null,
                        'ios_addon_monthly_fee' => $yearAssumptions['ios_addon_monthly_fee'] ?? null,
                        'ios_adoption_frac' => $yearAssumptions['ios_adoption_frac'] ?? null,
                        'white_label_projects' => $yearAssumptions['white_label_projects'] ?? null,
                        'white_label_fee_per_project' => $yearAssumptions['white_label_fee_per_project'] ?? null,
                        'ppob_active_coops_frac' => $yearAssumptions['ppob_active_coops_frac'] ?? null,
                        'ppob_tx_per_coop_month' => $yearAssumptions['ppob_tx_per_coop_month'] ?? null,
                        'avg_ppob_fee_per_tx' => $yearAssumptions['avg_ppob_fee_per_tx'] ?? null,
                        'academy_participants_frac' => $yearAssumptions['academy_participants_frac'] ?? null,
                        'academy_avg_price_per_participant' => $yearAssumptions['academy_avg_price_per_participant'] ?? null,
                        'offline_trainings_per_month' => $yearAssumptions['offline_trainings_per_month'] ?? null,
                        'offline_training_fee_per_coop' => $yearAssumptions['offline_training_fee_per_coop'] ?? null,
                        'enterprise_api_revenue' => $yearAssumptions['enterprise_api_revenue'] ?? null,
                        'cloud_cost_per_coop_month' => $yearAssumptions['cloud_cost_per_coop_month'] ?? null,
                        'implementation_cost_per_coop' => $yearAssumptions['implementation_cost_per_coop'] ?? null,
                        'support_cost_per_coop_month' => $yearAssumptions['support_cost_per_coop_month'] ?? null,
                        'payment_api_var_cost_frac' => $yearAssumptions['payment_api_var_cost_frac'] ?? null,
                        'other_cost_of_revenue_frac' => $yearAssumptions['other_cost_of_revenue_frac'] ?? null,
                        'payroll_cost' => $yearAssumptions['payroll_cost'] ?? null,
                        'sales_marketing_spend' => $yearAssumptions['sales_marketing_spend'] ?? null,
                        'office_utilities_internet' => $yearAssumptions['office_utilities_internet'] ?? null,
                        'software_tools_subscriptions' => $yearAssumptions['software_tools_subscriptions'] ?? null,
                        'legal_accounting_compliance' => $yearAssumptions['legal_accounting_compliance'] ?? null,
                        'travel_events' => $yearAssumptions['travel_events'] ?? null,
                        'recruitment_training' => $yearAssumptions['recruitment_training'] ?? null,
                        'other_ga' => $yearAssumptions['other_ga'] ?? null,
                        'seed_investment' => $yearAssumptions['seed_investment'] ?? null,
                        'pre_money_valuation' => $yearAssumptions['pre_money_valuation'] ?? null,
                        'exit_revenue_multiple_conservative' => $yearAssumptions['exit_revenue_multiple_conservative'] ?? null,
                        'exit_revenue_multiple_base' => $yearAssumptions['exit_revenue_multiple_base'] ?? null,
                        'exit_revenue_multiple_optimistic' => $yearAssumptions['exit_revenue_multiple_optimistic'] ?? null,
                    ], function($val) { return $val !== null; })
                );

                // 2. Perform Customer Growth calculation
                $beginningCoops = $prevEndingActiveCoops;
                $newCoops = $assumptions->new_coops_acquired;
                $churnRateFrac = $assumptions->monthly_churn_rate / 100;
                
                $churnedCoops = (int) round($beginningCoops * $churnRateFrac);
                $endingActiveCoops = $beginningCoops + $newCoops - $churnedCoops;
                $avgMembers = $assumptions->avg_members_per_coop;
                $totalMembers = $endingActiveCoops * $avgMembers;

                $prevEndingActiveCoops = $endingActiveCoops;

                // 3. Perform Revenue calculations
                $setupFee = $assumptions->setup_fee;
                $paidImplementationCoops = $assumptions->paid_implementation_coops;
                $monthlySubscriptionFee = $assumptions->monthly_subscription_fee;
                $subFraction = $assumptions->subscription_paying_frac / 100;
                $iosAddonMonthlyFee = $assumptions->ios_addon_monthly_fee;
                $iosAdoptionFrac = $assumptions->ios_adoption_frac / 100;
                $whiteLabelProjects = $assumptions->white_label_projects;
                $whiteLabelFeePerProject = $assumptions->white_label_fee_per_project;
                $ppobActiveCoopsFrac = $assumptions->ppob_active_coops_frac / 100;
                $ppobTxPerCoopMonth = $assumptions->ppob_tx_per_coop_month;
                $avgPpobFeePerTx = $assumptions->avg_ppob_fee_per_tx;
                $academyParticipantsFrac = $assumptions->academy_participants_frac / 100;
                $academyAvgPricePerParticipant = $assumptions->academy_avg_price_per_participant;
                $offlineTrainingsPerMonth = $assumptions->offline_trainings_per_month;
                $offlineTrainingFeePerCoop = $assumptions->offline_training_fee_per_coop;
                $enterpriseApiRevenue = $assumptions->enterprise_api_revenue;

                $setupImplementationRevenue = $paidImplementationCoops * $setupFee;
                $saasSubscriptionRevenue = $endingActiveCoops * $subFraction * $monthlySubscriptionFee * 12;
                $iosAddonRevenue = $endingActiveCoops * $iosAdoptionFrac * $iosAddonMonthlyFee * 12;
                $whiteLabelRevenue = $whiteLabelProjects * $whiteLabelFeePerProject;
                $ppobTransactionRevenue = $endingActiveCoops * $ppobActiveCoopsFrac * $ppobTxPerCoopMonth * 12 * $avgPpobFeePerTx;
                $academyRevenue = $totalMembers * $academyParticipantsFrac * $academyAvgPricePerParticipant;
                $offlineTrainingRevenue = $offlineTrainingsPerMonth * 12 * $offlineTrainingFeePerCoop;

                $totalRevenue = $setupImplementationRevenue +
                                $saasSubscriptionRevenue +
                                $iosAddonRevenue +
                                $whiteLabelRevenue +
                                $ppobTransactionRevenue +
                                $academyRevenue +
                                $offlineTrainingRevenue +
                                $enterpriseApiRevenue;

                $arr = $saasSubscriptionRevenue + $iosAddonRevenue;
                $arpu = $endingActiveCoops > 0 ? $totalRevenue / $endingActiveCoops : 0;

                // Save to revenue_projections
                RevenueProjection::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    [
                        'setup_implementation_revenue' => $setupImplementationRevenue,
                        'saas_subscription_revenue' => $saasSubscriptionRevenue,
                        'ios_addon_revenue' => $iosAddonRevenue,
                        'white_label_revenue' => $whiteLabelRevenue,
                        'ppob_transaction_revenue' => $ppobTransactionRevenue,
                        'academy_revenue' => $academyRevenue,
                        'offline_training_revenue' => $offlineTrainingRevenue,
                        'enterprise_api_revenue' => $enterpriseApiRevenue,
                        'total_revenue' => $totalRevenue,
                        'arr' => $arr,
                        'arpu' => $arpu,
                    ]
                );

                // 4. Perform COGS calculations
                $cloudCostPerCoopMonth = $assumptions->cloud_cost_per_coop_month;
                $implementationCostPerCoop = $assumptions->implementation_cost_per_coop;
                $supportCostPerCoopMonth = $assumptions->support_cost_per_coop_month;
                $paymentApiVarCostFrac = $assumptions->payment_api_var_cost_frac / 100;
                $otherCostOfRevenueFrac = $assumptions->other_cost_of_revenue_frac / 100;

                $cloudInfrastructureCost = $endingActiveCoops * $cloudCostPerCoopMonth * 12;
                $implementationOnboardingCost = $paidImplementationCoops * $implementationCostPerCoop;
                $customerSupportCost = $endingActiveCoops * $supportCostPerCoopMonth * 12;
                $paymentApiVariableCost = $ppobTransactionRevenue * $paymentApiVarCostFrac;
                $otherCostOfRevenue = $totalRevenue * $otherCostOfRevenueFrac;

                $totalCogs = $cloudInfrastructureCost +
                             $implementationOnboardingCost +
                             $customerSupportCost +
                             $paymentApiVariableCost +
                             $otherCostOfRevenue;

                $grossProfit = $totalRevenue - $totalCogs;
                $grossMargin = $totalRevenue > 0 ? ($grossProfit / $totalRevenue) * 100 : 0;

                // 5. Perform OPEX calculations
                $payrollOpex = $assumptions->payroll_cost;
                $salesMarketingOpex = $assumptions->sales_marketing_spend;
                $officeUtilitiesOpex = $assumptions->office_utilities_internet;
                $softwareToolsOpex = $assumptions->software_tools_subscriptions;
                $legalAccountingOpex = $assumptions->legal_accounting_compliance;
                $travelEventsOpex = $assumptions->travel_events;
                $recruitmentTrainingOpex = $assumptions->recruitment_training;
                $otherGaOpex = $assumptions->other_ga;

                $totalOpex = $payrollOpex +
                             $salesMarketingOpex +
                             $officeUtilitiesOpex +
                             $softwareToolsOpex +
                             $legalAccountingOpex +
                             $travelEventsOpex +
                             $recruitmentTrainingOpex +
                             $otherGaOpex;

                // Save to cost_projections
                CostProjection::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    [
                        'cloud_infrastructure_cost' => $cloudInfrastructureCost,
                        'implementation_onboarding_cost' => $implementationOnboardingCost,
                        'customer_support_cost' => $customerSupportCost,
                        'payment_api_variable_cost' => $paymentApiVariableCost,
                        'other_cost_of_revenue' => $otherCostOfRevenue,
                        'total_cogs' => $totalCogs,
                        'gross_profit' => $grossProfit,
                        'gross_margin' => $grossMargin,
                        'payroll_opex' => $payrollOpex,
                        'sales_marketing_opex' => $salesMarketingOpex,
                        'office_utilities_opex' => $officeUtilitiesOpex,
                        'software_tools_opex' => $softwareToolsOpex,
                        'legal_accounting_opex' => $legalAccountingOpex,
                        'travel_events_opex' => $travelEventsOpex,
                        'recruitment_training_opex' => $recruitmentTrainingOpex,
                        'other_ga_opex' => $otherGaOpex,
                        'total_opex' => $totalOpex,
                    ]
                );

                // 6. Perform EBITDA & Cash Flow
                $ebitda = $grossProfit - $totalOpex;
                $ebitdaMargin = $totalRevenue > 0 ? ($ebitda / $totalRevenue) * 100 : 0;

                // Seed Inflow happens only in 2026
                $seedInflow = ($year == 2026) ? $assumptions->seed_investment : 0;
                $openingCash = ($year == 2025) ? 0 : $prevEndingCash;
                $endingCash = $openingCash + $seedInflow + $ebitda;
                
                $prevEndingCash = $endingCash;

                $monthlyBurn = abs(min($ebitda / 12, 0));
                $runwayMonths = $monthlyBurn > 0 ? $endingCash / $monthlyBurn : 999.00; // 999 represents Profitable

                // 7. Perform SaaS Metrics
                $mrr = $arr / 12;
                $estimatedCac = $newCoops > 0 ? ($salesMarketingOpex + ($payrollOpex * 0.35)) / $newCoops : 0;
                
                // LTV = (MRR * GrossMargin%) / Churn%
                $estimatedLtv = $churnRateFrac > 0 ? ($mrr * ($grossMargin / 100)) / $churnRateFrac : 0;
                $ltvCacRatio = $estimatedCac > 0 ? $estimatedLtv / $estimatedCac : 0;
                
                $mrrGross = $mrr * ($grossMargin / 100);
                $cacPaybackMonths = $mrrGross > 0 ? $estimatedCac / $mrrGross : 0;

                // Rule of 40
                if ($year == 2025) {
                    $ruleOf40 = $ebitdaMargin / 100;
                } else {
                    $growthRate = $prevTotalRevenue > 0 ? ($totalRevenue / $prevTotalRevenue) - 1 : 0;
                    $ruleOf40 = $growthRate + ($ebitdaMargin / 100);
                }
                $prevTotalRevenue = $totalRevenue;

                // 8. Valuation Ratios
                $enterpriseValueConservative = $totalRevenue * $assumptions->exit_revenue_multiple_conservative;
                $enterpriseValueBase = $totalRevenue * $assumptions->exit_revenue_multiple_base;
                $enterpriseValueOptimistic = $totalRevenue * $assumptions->exit_revenue_multiple_optimistic;
                
                $postMoneyValuation = $assumptions->pre_money_valuation + $assumptions->seed_investment;
                $impliedSeedEquityFrac = $postMoneyValuation > 0 ? $assumptions->seed_investment / $postMoneyValuation : 0;

                // Investor return calculations at 2029 Exit
                // Revenue 2029 Exit Projection:
                // Conservative: Total Revenue 2029 * 0.875
                // Base: Total Revenue 2029
                // Optimistic: Total Revenue 2029 * 1.1875
                // Wait! Since these returns are calculated based on 2029 target, we can compute them dynamically in the service based on 2029's projected revenue.
                // We'll compute them for the current year based on the 2029 model target or simply calculate it using the current year's numbers as a proxy for the exit year, 
                // but the Excel sheet explicitly calculates it based on the exit revenue of year 2029. 
                // So for any year, the 2029 exit figures can be forecasted. Let's write a formula that maps 2029 Exit Valuation!
                // Wait, to do it cleanly, let's defer IRR/MOIC calculation until the end of the loop, or calculate it using the 2029 revenue stream.
                // Let's compute 2029 revenue first. Since we are doing a loop, we can store these exit metrics in a second pass, or we can just calculate them using the current year's numbers. 
                // Actually, doing a second pass over the 5 years to fill in 2029-exit IRR/MOIC metrics for all years makes total sense! 
                // Because the Cap Table and Exit returns are based on the final Year 5 (2029) exit valuation.
                
                $summary = FinancialSummary::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    [
                        'active_cooperatives' => $endingActiveCoops,
                        'total_cooperative_members' => $totalMembers,
                        'revenue' => $totalRevenue,
                        'cogs' => $totalCogs,
                        'opex' => $totalOpex,
                        'ebitda' => $ebitda,
                        'ebitda_margin' => $ebitdaMargin,
                        'ending_cash' => $endingCash,
                        'runway_months' => $runwayMonths,
                        'mrr' => $mrr,
                        'arr' => $arr,
                        'estimated_cac' => $estimatedCac,
                        'estimated_ltv' => $estimatedLtv,
                        'ltv_cac_ratio' => $ltvCacRatio,
                        'cac_payback_months' => $cacPaybackMonths,
                        'rule_of_40' => $ruleOf40,
                        'enterprise_value_conservative' => $enterpriseValueConservative,
                        'enterprise_value_base' => $enterpriseValueBase,
                        'enterprise_value_optimistic' => $enterpriseValueOptimistic,
                        'post_money_valuation' => $postMoneyValuation,
                        'implied_seed_equity_frac' => $impliedSeedEquityFrac,
                    ]
                );

                $summaries[$year] = $summary;
            }

            // Second pass: Calculate exit returns for all years based on 2029 (Year 5) revenue
            $summary2029 = $summaries[2029];
            $rev2029 = $summary2029->revenue;
            
            $assumptions2029 = AssumptionValue::where('project_id', $project->id)->where('year', 2029)->first();
            $multipleCons = $assumptions2029->exit_revenue_multiple_conservative;
            $multipleBase = $assumptions2029->exit_revenue_multiple_base;
            $multipleOpt = $assumptions2029->exit_revenue_multiple_optimistic;
            $seedInv = $assumptions2029->seed_investment;
            $postMoneyVal = $summary2029->post_money_valuation;
            $equityFrac = $summary2029->implied_seed_equity_frac;

            // Exit valuations
            $exitValCons = ($rev2029 * 0.875) * $multipleCons;
            $exitValBase = $rev2029 * $multipleBase;
            $exitValOpt = ($rev2029 * 1.1875) * $multipleOpt;

            // Equity Values
            $eqValCons = $exitValCons * $equityFrac;
            $eqValBase = $exitValBase * $equityFrac;
            $eqValOpt = $exitValOpt * $equityFrac;

            // MOICs
            $moicCons = $seedInv > 0 ? $eqValCons / $seedInv : 0;
            $moicBase = $seedInv > 0 ? $eqValBase / $seedInv : 0;
            $moicOpt = $seedInv > 0 ? $eqValOpt / $seedInv : 0;

            // IRRs (5 Years)
            $irrCons = $moicCons > 0 ? pow($moicCons, 1/5) - 1 : 0;
            $irrBase = $moicBase > 0 ? pow($moicBase, 1/5) - 1 : 0;
            $irrOpt = $moicOpt > 0 ? pow($moicOpt, 1/5) - 1 : 0;

            foreach ($years as $year) {
                $summaries[$year]->update([
                    'investor_moic_conservative' => $moicCons,
                    'investor_moic_base' => $moicBase,
                    'investor_moic_optimistic' => $moicOpt,
                    'investor_irr_conservative' => $irrCons * 100,
                    'investor_irr_base' => $irrBase * 100,
                    'investor_irr_optimistic' => $irrOpt * 100,
                ]);
            }

            return collect(array_values($summaries));
        });
    }
}
