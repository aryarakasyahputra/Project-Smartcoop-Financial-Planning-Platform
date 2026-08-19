<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class ExcelExportService
{
    private function getVal(array $data, array $keys, mixed $default = null): mixed
    {
        foreach ($keys as $k) {
            if (isset($data[$k]) && $data[$k] !== null) {
                return $data[$k];
            }
        }
        return $default;
    }

    /**
     * Generate 5-year Excel Financial Model using native PhpSpreadsheet.
     * Works 100% natively on Vercel, Railway, VPS & Cloud Serverless environments without Python dependencies.
     * 
     * @param array $payload
     * @param string $templatePath
     * @param string $outputPath
     * @return bool
     */
    public function generateModel(array $payload, string $templatePath, string $outputPath): bool
    {
        $assumptionsByYear = $payload['assumptions'] ?? [];
        $companyName = $payload['company_name'] ?? 'Smartcoop';
        $currency = strtoupper((string)($payload['currency'] ?? 'IDR'));
        $lang = strtolower((string)($payload['lang'] ?? 'en'));

        if ($currency === 'USD') {
            $rate = 1.0 / 17000.0;
            $numFormat = '"$"#,##0';
        } elseif ($currency === 'EUR') {
            $rate = 1.0 / 20000.0;
            $numFormat = '"€"#,##0';
        } else {
            $currency = 'IDR';
            $rate = 1.0;
            $numFormat = '"Rp "#,##0';
        }

        $payloadYears = [];
        foreach (array_keys($assumptionsByYear) as $k) {
            if (is_numeric($k)) {
                $payloadYears[] = (int)$k;
            }
        }
        sort($payloadYears);
        if (empty($payloadYears)) {
            $payloadYears = [2025, 2026, 2027, 2028, 2029];
        }

        if (file_exists($templatePath)) {
            $spreadsheet = IOFactory::load($templatePath);
        } else {
            $spreadsheet = new Spreadsheet();
            $coverSheet = $spreadsheet->getActiveSheet();
            $coverSheet->setTitle('01_Cover');
            $sheetsToCreate = [
                '02_Assumptions', '03_Customer_Growth', '04_Revenue_Engine', '05_COGS',
                '06_HR_Planning', '07_OPEX', '08_EBITDA', '09_Cash_Flow', '10_SaaS_Metrics',
                '11_Valuation', '14_Dashboard'
            ];
            foreach ($sheetsToCreate as $sname) {
                $spreadsheet->createSheet()->setTitle($sname);
            }
        }

        // 1. Update Cover Title & Subtitles according to Language & Currency
        $sheetCover = $spreadsheet->getSheetByName('01_Cover');
        if ($sheetCover) {
            if ($lang === 'id') {
                $sheetCover->setCellValue('B3', "Model Keuangan Pro-Forma v2.0 ({$currency}) — {$companyName}");
                $sheetCover->setCellValue('B4', "Model Proyeksi Keuangan Koperasi 5-Tahun ({$currency})");
            } else {
                $sheetCover->setCellValue('B3', "Financial Model v2.0 ({$currency}) — {$companyName}");
                $sheetCover->setCellValue('B4', "5-Year Financial Projection Model ({$currency})");
            }
        }

        $modelSheets = [
            '02_Assumptions', '03_Customer_Growth', '04_Revenue_Engine', '05_COGS',
            '06_HR_Planning', '07_OPEX', '08_EBITDA', '09_Cash_Flow', '10_SaaS_Metrics',
            '11_Valuation'
        ];

        $numYears = count($payloadYears);

        // Update headers across model sheets
        foreach ($modelSheets as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            if (!$sheet) continue;

            for ($i = 0; $i < $numYears; $i++) {
                $colIdx = 2 + $i;
                $sheet->setCellValue([$colIdx, 3], $payloadYears[$i]);
            }
        }

        $sheetA = $spreadsheet->getSheetByName('02_Assumptions');
        $sheetHr = $spreadsheet->getSheetByName('06_HR_Planning');
        $sheetOpex = $spreadsheet->getSheetByName('07_OPEX');

        // Monetary row mapping
        $monetaryRowMap = [
            '02_Assumptions' => [13, 15, 16, 19, 22, 24, 26, 27, 30, 31, 32, 37, 38],
            '04_Revenue_Engine' => [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            '05_COGS' => [5, 6, 7, 8, 9, 10, 11],
            '06_HR_Planning' => [12, 13],
            '07_OPEX' => [5, 6, 7, 8, 9, 10, 11, 12, 13],
            '08_EBITDA' => [5, 6, 7, 9, 10],
            '09_Cash_Flow' => [5, 6, 7, 8, 9],
            '10_SaaS_Metrics' => [5, 6, 7, 11, 12, 14],
            '11_Valuation' => [5, 6, 10, 11, 12, 13, 14],
            '14_Dashboard' => [14, 15, 17, 19]
        ];

        foreach ($monetaryRowMap as $sheetName => $rows) {
            $st = $spreadsheet->getSheetByName($sheetName);
            if (!$st) continue;
            foreach ($rows as $r) {
                for ($i = 0; $i < $numYears; $i++) {
                    $colIdx = 2 + $i;
                    $st->getStyle([$colIdx, $r])->getNumberFormat()->setFormatCode($numFormat);
                }
            }
        }

        // Populate assumption values for each year
        if ($sheetA) {
            for ($i = 0; $i < $numYears; $i++) {
                $yr = $payloadYears[$i];
                $colIdx = 2 + $i;
                $colLetter = Coordinate::stringFromColumnIndex($colIdx);
                $prevColLetter = $i > 0 ? Coordinate::stringFromColumnIndex($colIdx - 1) : null;

                $data = $assumptionsByYear[(string)$yr] ?? $assumptionsByYear[$yr] ?? [];

                // Row 6: Beginning Active Cooperatives
                if ($i === 0) {
                    $begCoops = $this->getVal($data, ['beginning_cooperatives', 'initial_cooperatives', 'beginningCoops']);
                    if ($begCoops !== null) $sheetA->setCellValue([$colIdx, 6], (float)$begCoops);
                } else {
                    $sheetA->setCellValue([$colIdx, 6], "='03_Customer_Growth'!{$prevColLetter}8");
                }

                // Row 7: New Cooperatives Acquired
                $v = $this->getVal($data, ['new_coops_acquired', 'newCoops']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 7], (float)$v);

                // Row 8: Monthly Churn Rate (Percentage -> divide by 100)
                $v = $this->getVal($data, ['monthly_churn_rate', 'monthlyChurnRate']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 8], (float)$v / 100.0);

                // Row 9: Average Members / Cooperative
                $v = $this->getVal($data, ['avg_members_per_coop', 'avgMembersPerCoop', 'avgMembers']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 9], (float)$v);

                // Row 10: Subscription Paying % (Percentage -> divide by 100)
                $v = $this->getVal($data, ['subscription_paying_frac', 'subscriptionPayingFrac']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 10], (float)$v / 100.0);

                // Row 13: Setup Fee
                $v = $this->getVal($data, ['setup_fee', 'setup_fee_per_coop', 'setupFee']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 13], (float)$v * $rate);

                // Row 14: Paid Implementation Coops
                $v = $this->getVal($data, ['paid_implementation_coops', 'paidImplementationCoops']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 14], (float)$v);

                // Row 15: Monthly Subscription Fee
                $v = $this->getVal($data, ['monthly_subscription_fee', 'saas_subscription_fee_per_coop', 'monthlySubscriptionFee']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 15], (float)$v * $rate);

                // Row 16: iOS Add-on Monthly Fee
                $v = $this->getVal($data, ['ios_addon_monthly_fee', 'ios_addon_fee_per_coop', 'iosAddonMonthlyFee']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 16], (float)$v * $rate);

                // Row 17: iOS Adoption %
                $v = $this->getVal($data, ['ios_adoption_frac', 'ios_adoption_rate', 'iosAdoptionRate']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 17], (float)$v / 100.0);

                // Row 18: White Label Projects
                $v = $this->getVal($data, ['white_label_projects', 'white_label_projects_count', 'whiteLabelProjects']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 18], (float)$v);

                // Row 19: White Label Fee / Project
                $v = $this->getVal($data, ['white_label_fee_per_project', 'white_label_price_per_project', 'whiteLabelFeePerProject']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 19], (float)$v * $rate);

                // Row 20: PPOB Active Cooperatives %
                $v = $this->getVal($data, ['ppob_active_coops_frac', 'ppob_adoption_rate', 'ppobAdoptionRate']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 20], (float)$v / 100.0);

                // Row 21: PPOB Transactions / Active Coop / Month
                $v = $this->getVal($data, ['ppob_tx_per_coop_month', 'ppob_transactions_per_coop_month', 'ppobTxPerCoopMonth']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 21], (float)$v);

                // Row 22: Average PPOB Fee / Transaction
                $v = $this->getVal($data, ['avg_ppob_fee_per_tx', 'ppob_fee_per_transaction', 'avgPpobFeePerTx']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 22], (float)$v * $rate);

                // Row 23: Academy Participants % of Members
                $v = $this->getVal($data, ['academy_participants_frac', 'academy_adoption_rate', 'academyAdoptionRate']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 23], (float)$v / 100.0);

                // Row 24: Academy Average Price / Participant
                $v = $this->getVal($data, ['academy_avg_price_per_participant', 'academy_price_per_participant', 'academyPricePerParticipant']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 24], (float)$v * $rate);

                // Row 25: Offline Trainings / Month
                $v = $this->getVal($data, ['offline_trainings_per_month', 'offlineTrainingsPerMonth']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 25], (float)$v);

                // Row 26: Offline Training Fee / Cooperative
                $v = $this->getVal($data, ['offline_training_fee_per_coop', 'offlineTrainingFeePerCoop']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 26], (float)$v * $rate);

                // Row 27: Enterprise / Banking / API Revenue
                $v = $this->getVal($data, ['enterprise_api_revenue', 'enterprise_api_contracts_revenue', 'enterpriseApiRevenue']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 27], (float)$v * $rate);

                // Row 30: Cloud Cost / Active Coop / Month
                $v = $this->getVal($data, ['cloud_cost_per_coop_month', 'cloudCostPerCoopMonth']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 30], (float)$v * $rate);

                // Row 31: Implementation Cost
                $v = $this->getVal($data, ['implementation_cost_per_coop', 'implementationCostPerCoop']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 31], (float)$v * $rate);

                // Row 32: Support Cost
                $v = $this->getVal($data, ['support_cost_per_coop_month', 'supportCostPerCoopMonth']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 32], (float)$v * $rate);

                // Row 33: Payment / API Variable Cost %
                $v = $this->getVal($data, ['payment_api_var_cost_frac', 'paymentApiVarCostFrac']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 33], (float)$v / 100.0);

                // Row 34: Other Cost of Revenue %
                $v = $this->getVal($data, ['other_cost_of_revenue_frac', 'otherCostOfRevenueFrac']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 34], (float)$v / 100.0);

                // Row 37: Seed Investment
                $v = $this->getVal($data, ['seed_investment', 'seedInvestment']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 37], (float)$v * $rate);

                // Row 38: Pre-Money Valuation
                $v = $this->getVal($data, ['pre_money_valuation', 'preMoneyValuation']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 38], (float)$v * $rate);

                // Row 39: Exit Revenue Multiple - Conservative
                $v = $this->getVal($data, ['exit_revenue_multiple_conservative', 'exitRevenueMultipleConservative']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 39], (float)$v);

                // Row 40: Exit Revenue Multiple - Base Case
                $v = $this->getVal($data, ['exit_revenue_multiple_base', 'exitRevenueMultipleBase']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 40], (float)$v);

                // Row 41: Exit Revenue Multiple - Optimistic
                $v = $this->getVal($data, ['exit_revenue_multiple_optimistic', 'exitRevenueMultipleOptimistic']);
                if ($v !== null) $sheetA->setCellValue([$colIdx, 41], (float)$v);

                // ----------------------------------------------------
                // 06_HR_Planning Sheet
                // ----------------------------------------------------
                if ($sheetHr) {
                    $v = $this->getVal($data, ['hr_engineering_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 5], (float)$v);

                    $v = $this->getVal($data, ['hr_sales_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 6], (float)$v);

                    $v = $this->getVal($data, ['hr_marketing_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 7], (float)$v);

                    $v = $this->getVal($data, ['hr_support_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 8], (float)$v);

                    $v = $this->getVal($data, ['hr_finance_admin_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 9], (float)$v);

                    $v = $this->getVal($data, ['hr_management_fte']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 10], (float)$v);

                    $v = $this->getVal($data, ['hr_avg_salary_monthly']);
                    if ($v !== null) $sheetHr->setCellValue([$colIdx, 12], (float)$v * $rate);
                }

                // ----------------------------------------------------
                // 07_OPEX Sheet
                // ----------------------------------------------------
                if ($sheetOpex) {
                    $v = $this->getVal($data, ['payroll_cost', 'payrollCost']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 5], (float)$v * $rate);

                    $v = $this->getVal($data, ['sales_marketing_spend', 'salesMarketingSpend']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 6], (float)$v * $rate);

                    $v = $this->getVal($data, ['office_utilities_internet', 'officeUtilitiesInternet']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 7], (float)$v * $rate);

                    $v = $this->getVal($data, ['software_tools_subscriptions', 'softwareToolsSubscriptions']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 8], (float)$v * $rate);

                    $v = $this->getVal($data, ['legal_accounting_compliance', 'legalAccountingCompliance']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 9], (float)$v * $rate);

                    $v = $this->getVal($data, ['travel_events', 'travelEvents']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 10], (float)$v * $rate);

                    $v = $this->getVal($data, ['recruitment_training', 'recruitmentTraining']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 11], (float)$v * $rate);

                    $v = $this->getVal($data, ['other_ga', 'otherGa']);
                    if ($v !== null) $sheetOpex->setCellValue([$colIdx, 12], (float)$v * $rate);
                }
            }
        }

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->setPreCalculateFormulas(false); // Preserve live Excel formulas
        $writer->save($outputPath);

        return file_exists($outputPath);
    }
}
