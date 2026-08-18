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
    public function getProjectData(mixed $projectId)
    {
        $project = Project::findOrFail($projectId);

        $years = [2025, 2026, 2027, 2028, 2029];
        $defaultAssumptions = [];
        foreach ($years as $year) {
            $defaultAssumptions[$year] = [
                'beginning_cooperatives' => 0,
                'new_coops_acquired' => 0,
                'monthly_churn_rate' => 0,
                'avg_members_per_coop' => 0,
                'subscription_paying_frac' => 0,
                'setup_fee' => 0,
                'paid_implementation_coops' => 0,
                'monthly_subscription_fee' => 0,
                'ios_addon_monthly_fee' => 0,
                'ios_adoption_frac' => 0,
                'white_label_projects' => 0,
                'white_label_fee_per_project' => 0,
                'ppob_active_coops_frac' => 0,
                'ppob_tx_per_coop_month' => 0,
                'avg_ppob_fee_per_tx' => 0,
                'academy_participants_frac' => 0,
                'academy_avg_price_per_participant' => 0,
                'offline_trainings_per_month' => 0,
                'offline_training_fee_per_coop' => 0,
                'enterprise_api_revenue' => 0,
                'cloud_cost_per_coop_month' => 0,
                'implementation_cost_per_coop' => 0,
                'support_cost_per_coop_month' => 0,
                'payment_api_var_cost_frac' => 0,
                'other_cost_of_revenue_frac' => 0,
                
                'hr_engineering_fte' => 0,
                'hr_sales_fte' => 0,
                'hr_marketing_fte' => 0,
                'hr_support_fte' => 0,
                'hr_finance_admin_fte' => 0,
                'hr_management_fte' => 0,
                'hr_avg_salary_monthly' => 0,
                
                'payroll_cost' => 0,
                'sales_marketing_spend' => 0,
                'office_utilities_internet' => 0,
                'software_tools_subscriptions' => 0,
                'legal_accounting_compliance' => 0,
                'travel_events' => 0,
                'recruitment_training' => 0,
                'other_ga' => 0,
                'seed_investment' => 0,
                'initial_opening_cash' => 0,
                'pre_money_valuation' => 0,
                'exit_revenue_multiple_conservative' => 0,
                'exit_revenue_multiple_base' => 0,
                'exit_revenue_multiple_optimistic' => 0,
                'custom_assumptions' => [],
            ];
        }

        // Fetch existing assumptions first
        $existingAssumptionsCount = AssumptionValue::where('project_id', $project->id)->count();
        if ($existingAssumptionsCount === 0) {
            // Seed defaults if nothing exists
            foreach ($years as $year) {
                AssumptionValue::firstOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    $defaultAssumptions[$year]
                );
            }
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
    public function recalculate(mixed $projectId, array $newAssumptions)
    {
        $project = Project::findOrFail($projectId);

        return DB::transaction(function () use ($project, $newAssumptions) {
            $years = array_keys($newAssumptions);
            sort($years);
            if (empty($years)) {
                $years = [2025, 2026, 2027, 2028, 2029];
            }
            $summaries = [];
            
            // Delete existing projections first (Single Source of Truth paradigm)
            RevenueProjection::where('project_id', $project->id)->delete();
            CostProjection::where('project_id', $project->id)->delete();
            FinancialSummary::where('project_id', $project->id)->delete();
            
            // Remove assumption values for years that are not in the payload
            AssumptionValue::where('project_id', $project->id)->whereNotIn('year', $years)->delete();

            // Baseline active cooperatives before first year is read from the first year assumptions input (default: 215)
            $firstYear = $years[0];
            $firstYearAssumptions = $newAssumptions[$firstYear] ?? [];
            $prevEndingActiveCoops = isset($firstYearAssumptions['beginning_cooperatives']) ? (int)$firstYearAssumptions['beginning_cooperatives'] : 215;
            $prevTotalRevenue = 0;
            $prevEndingCash = 0;

            foreach ($years as $year) {
                // 1. Save or update assumptions for this year
                $yearAssumptions = $newAssumptions[$year] ?? [];

                $engFte = isset($yearAssumptions['hr_engineering_fte']) ? (int)$yearAssumptions['hr_engineering_fte'] : null;
                $salesFte = isset($yearAssumptions['hr_sales_fte']) ? (int)$yearAssumptions['hr_sales_fte'] : null;
                $mktFte = isset($yearAssumptions['hr_marketing_fte']) ? (int)$yearAssumptions['hr_marketing_fte'] : null;
                $suppFte = isset($yearAssumptions['hr_support_fte']) ? (int)$yearAssumptions['hr_support_fte'] : null;
                $finFte = isset($yearAssumptions['hr_finance_admin_fte']) ? (int)$yearAssumptions['hr_finance_admin_fte'] : null;
                $mgmtFte = isset($yearAssumptions['hr_management_fte']) ? (int)$yearAssumptions['hr_management_fte'] : null;
                $avgSalary = isset($yearAssumptions['hr_avg_salary_monthly']) ? (float)$yearAssumptions['hr_avg_salary_monthly'] : null;

                if ($engFte !== null || $salesFte !== null || $mktFte !== null || $suppFte !== null || $finFte !== null || $mgmtFte !== null || $avgSalary !== null) {
                    $payrollCost = (($engFte ?? 0) + ($salesFte ?? 0) + ($mktFte ?? 0) + ($suppFte ?? 0) + ($finFte ?? 0) + ($mgmtFte ?? 0)) * ($avgSalary ?? 0) * 12;
                } else {
                    $payrollCost = isset($yearAssumptions['payroll_cost']) ? (float)$yearAssumptions['payroll_cost'] : null;
                }
                
                $assumptions = AssumptionValue::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    array_filter([
                        'beginning_cooperatives' => $yearAssumptions['beginning_cooperatives'] ?? null,
                        'hr_engineering_fte' => $engFte,
                        'hr_sales_fte' => $salesFte,
                        'hr_marketing_fte' => $mktFte,
                        'hr_support_fte' => $suppFte,
                        'hr_finance_admin_fte' => $finFte,
                        'hr_management_fte' => $mgmtFte,
                        'hr_avg_salary_monthly' => $avgSalary,
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
                        'payroll_cost' => $payrollCost,
                        'sales_marketing_spend' => $yearAssumptions['sales_marketing_spend'] ?? null,
                        'office_utilities_internet' => $yearAssumptions['office_utilities_internet'] ?? null,
                        'software_tools_subscriptions' => $yearAssumptions['software_tools_subscriptions'] ?? null,
                        'legal_accounting_compliance' => $yearAssumptions['legal_accounting_compliance'] ?? null,
                        'travel_events' => $yearAssumptions['travel_events'] ?? null,
                        'recruitment_training' => $yearAssumptions['recruitment_training'] ?? null,
                        'other_ga' => $yearAssumptions['other_ga'] ?? null,
                        'seed_investment' => $yearAssumptions['seed_investment'] ?? null,
                        'initial_opening_cash' => $yearAssumptions['initial_opening_cash'] ?? null,
                        'pre_money_valuation' => $yearAssumptions['pre_money_valuation'] ?? null,
                        'exit_revenue_multiple_conservative' => $yearAssumptions['exit_revenue_multiple_conservative'] ?? null,
                        'exit_revenue_multiple_base' => $yearAssumptions['exit_revenue_multiple_base'] ?? null,
                        'exit_revenue_multiple_optimistic' => $yearAssumptions['exit_revenue_multiple_optimistic'] ?? null,
                        'founders_pre_seed_pct' => $yearAssumptions['founders_pre_seed_pct'] ?? null,
                        'esop_pre_seed_pct' => $yearAssumptions['esop_pre_seed_pct'] ?? null,
                        'investor_pre_seed_pct' => $yearAssumptions['investor_pre_seed_pct'] ?? null,
                        'founders_seed_investment' => $yearAssumptions['founders_seed_investment'] ?? null,
                        'esop_seed_investment' => $yearAssumptions['esop_seed_investment'] ?? null,
                        'custom_assumptions' => $yearAssumptions['custom_assumptions'] ?? null,
                    ], function($val) { return $val !== null; })
                );

                // --- Process Custom Assumptions ---
                $customAssumptionsList = $assumptions->custom_assumptions ?? [];
                $customNewCoops = 0;
                $customRevenue = 0;
                $customCogs = 0;
                $customOpex = 0;

                foreach ($customAssumptionsList as $custom) {
                    $calculatedValue = 0;
                    if ($custom['type'] === 'fixed_value') {
                        $calculatedValue = (float) $custom['value'];
                    } elseif ($custom['type'] === 'percentage_of') {
                        $refKey = $custom['reference_variable'];
                        $refValue = $assumptions->{$refKey} ?? 0;
                        $calculatedValue = ($custom['value'] / 100) * $refValue;
                    }

                    switch ($custom['impact_category']) {
                        case 'add_to_new_coops':
                            $customNewCoops += $calculatedValue;
                            break;
                        case 'add_to_revenue':
                            $customRevenue += $calculatedValue;
                            break;
                        case 'add_to_cogs':
                            $customCogs += $calculatedValue;
                            break;
                        case 'add_to_opex':
                            $customOpex += $calculatedValue;
                            break;
                    }
                }
                // ----------------------------------

                // 2. Perform Customer Growth calculation
                $beginningCoops = $prevEndingActiveCoops;
                $newCoops = $assumptions->new_coops_acquired + $customNewCoops;
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
                                $enterpriseApiRevenue + 
                                $customRevenue;

                $arr = $saasSubscriptionRevenue + $iosAddonRevenue;
                $arpu = $endingActiveCoops > 0 ? $totalRevenue / $endingActiveCoops : 0;

                // Save to revenue_projections
                RevenueProjection::create([
                    'project_id' => $project->id,
                    'year' => $year,
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
                ]);

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
                             $otherCostOfRevenue +
                             $customCogs;

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
                             $otherGaOpex +
                             $customOpex;

                // Save to cost_projections
                CostProjection::create([
                    'project_id' => $project->id,
                    'year' => $year,
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
                ]);

                // 6. Perform EBITDA & Cash Flow
                $ebitda = $grossProfit - $totalOpex;
                $ebitdaMargin = $totalRevenue > 0 ? ($ebitda / $totalRevenue) * 100 : 0;

                // Seed Inflow happens only in 2026
                $seedInflow = ($year == 2026) ? $assumptions->seed_investment : 0;
                $initialOpeningCash = (float) ($assumptions->initial_opening_cash ?? 0);
                $openingCash = ($year == 2025) ? $initialOpeningCash : $prevEndingCash;
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
                
                $summary = FinancialSummary::create([
                    'project_id' => $project->id,
                    'year' => $year,
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
                ]);

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

    public function resetToZero(mixed $projectId)
    {
        $project = Project::findOrFail($projectId);
        $years = AssumptionValue::where('project_id', $project->id)->pluck('year')->toArray();
        if (empty($years)) {
            $years = [2025, 2026, 2027, 2028, 2029];
        }
        
        DB::transaction(function () use ($project, $years) {
            foreach ($years as $year) {
                AssumptionValue::updateOrCreate(
                    ['project_id' => $project->id, 'year' => $year],
                    [
                        'beginning_cooperatives' => 0,
                        'hr_engineering_fte' => 0,
                        'hr_sales_fte' => 0,
                        'hr_marketing_fte' => 0,
                        'hr_support_fte' => 0,
                        'hr_finance_admin_fte' => 0,
                        'hr_management_fte' => 0,
                        'hr_avg_salary_monthly' => 0,
                        'new_coops_acquired' => 0,
                        'monthly_churn_rate' => 0,
                        'avg_members_per_coop' => 0,
                        'subscription_paying_frac' => 0,
                        'setup_fee' => 0,
                        'paid_implementation_coops' => 0,
                        'monthly_subscription_fee' => 0,
                        'ios_addon_monthly_fee' => 0,
                        'ios_adoption_frac' => 0,
                        'white_label_projects' => 0,
                        'white_label_fee_per_project' => 0,
                        'ppob_active_coops_frac' => 0,
                        'ppob_tx_per_coop_month' => 0,
                        'avg_ppob_fee_per_tx' => 0,
                        'academy_participants_frac' => 0,
                        'academy_avg_price_per_participant' => 0,
                        'offline_trainings_per_month' => 0,
                        'offline_training_fee_per_coop' => 0,
                        'enterprise_api_revenue' => 0,
                        'cloud_cost_per_coop_month' => 0,
                        'implementation_cost_per_coop' => 0,
                        'support_cost_per_coop_month' => 0,
                        'payment_api_var_cost_frac' => 0,
                        'other_cost_of_revenue_frac' => 0,
                        'payroll_cost' => 0,
                        'sales_marketing_spend' => 0,
                        'office_utilities_internet' => 0,
                        'software_tools_subscriptions' => 0,
                        'legal_accounting_compliance' => 0,
                        'travel_events' => 0,
                        'recruitment_training' => 0,
                        'other_ga' => 0,
                        'seed_investment' => 0,
                        'pre_money_valuation' => 0,
                        'exit_revenue_multiple_conservative' => 0,
                        'exit_revenue_multiple_base' => 0,
                        'exit_revenue_multiple_optimistic' => 0,
                        'custom_assumptions' => [],
                    ]
                );
            }
            
            $inputs = [];
            foreach ($years as $year) {
                $inputs[$year] = AssumptionValue::where('project_id', $project->id)
                    ->where('year', $year)
                    ->first()
                    ->toArray();
            }
            $this->recalculate($project->id, $inputs);
        });
    }
}
