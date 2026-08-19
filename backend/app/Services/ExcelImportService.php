<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class ExcelImportService
{
    private array $standardRowMap = [
        6 => "beginning_cooperatives",
        7 => "new_coops_acquired",
        8 => "monthly_churn_rate",
        9 => "avg_members_per_coop",
        10 => "subscription_paying_frac",
        13 => "setup_fee",
        14 => "paid_implementation_coops",
        15 => "monthly_subscription_fee",
        16 => "ios_addon_monthly_fee",
        17 => "ios_adoption_frac",
        18 => "white_label_projects",
        19 => "white_label_fee_per_project",
        20 => "ppob_active_coops_frac",
        21 => "ppob_tx_per_coop_month",
        22 => "avg_ppob_fee_per_tx",
        23 => "academy_participants_frac",
        24 => "academy_avg_price_per_participant",
        25 => "offline_trainings_per_month",
        26 => "offline_training_fee_per_coop",
        27 => "enterprise_api_revenue",
        30 => "cloud_cost_per_coop_month",
        31 => "implementation_cost_per_coop",
        32 => "support_cost_per_coop_month",
        33 => "payment_api_var_cost_frac",
        34 => "other_cost_of_revenue_frac",
        37 => "seed_investment",
        38 => "pre_money_valuation",
        39 => "exit_revenue_multiple_conservative",
        40 => "exit_revenue_multiple_base",
        41 => "exit_revenue_multiple_optimistic",
    ];

    private array $hrRowMap = [
        5 => "hr_engineering_fte",
        6 => "hr_sales_fte",
        7 => "hr_marketing_fte",
        8 => "hr_support_fte",
        9 => "hr_finance_admin_fte",
        10 => "hr_management_fte",
        12 => "hr_avg_salary_monthly",
        13 => "payroll_cost",
    ];

    private array $opexRowMap = [
        5 => "payroll_cost",
        6 => "sales_marketing_spend",
        7 => "office_utilities_internet",
        8 => "software_tools_subscriptions",
        9 => "legal_accounting_compliance",
        10 => "travel_events",
        11 => "recruitment_training",
        12 => "other_ga",
    ];

    private array $fracKeys = [
        "monthly_churn_rate",
        "subscription_paying_frac",
        "ios_adoption_frac",
        "ppob_active_coops_frac",
        "academy_participants_frac",
        "payment_api_var_cost_frac",
        "other_cost_of_revenue_frac",
    ];

    private function cleanNum(mixed $val): float
    {
        if ($val === null) {
            return 0.0;
        }
        if (is_numeric($val)) {
            return (float)$val;
        }
        if (is_string($val)) {
            $cleaned = preg_replace('/[Rp$€,%\s]/', '', $val);
            if (is_numeric($cleaned)) {
                return (float)$cleaned;
            }
        }
        return 0.0;
    }

    private function findYearCols(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        $yearCols = [];
        $highestRow = min(15, $sheet->getHighestRow());
        $highestCol = min(30, \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($sheet->getHighestColumn()));

        for ($r = 1; $r <= $highestRow; $r++) {
            for ($c = 1; $c <= $highestCol; $c++) {
                $val = $sheet->getCell([$c, $r])->getValue();
                if ($val !== null) {
                    $valStr = trim((string)$val);
                    if (preg_match('/^(20\d{2})$/', $valStr, $m)) {
                        $y = (int)$m[1];
                        if (!isset($yearCols[$y])) {
                            $yearCols[$y] = $c;
                        }
                    }
                }
            }
        }

        if (empty($yearCols)) {
            $defaultYears = [2025, 2026, 2027, 2028, 2029];
            foreach ($defaultYears as $idx => $y) {
                $yearCols[$y] = 2 + $idx;
            }
        }

        return $yearCols;
    }

    /**
     * Import Excel assumption file natively in PHP.
     * Works 100% on Vercel, Railway & Cloud Serverless without Python.
     * 
     * @param string $excelPath
     * @return array
     */
    public function parseExcel(string $excelPath): array
    {
        $spreadsheet = IOFactory::load($excelPath);

        $mainSheet = null;
        $targetNames = ['02_assumptions', 'assumptions', 'asumsi'];
        foreach ($spreadsheet->getSheetNames() as $name) {
            $lower = strtolower($name);
            foreach ($targetNames as $t) {
                if (str_contains($lower, $t)) {
                    $mainSheet = $spreadsheet->getSheetByName($name);
                    break 2;
                }
            }
        }
        if (!$mainSheet) {
            $mainSheet = $spreadsheet->getActiveSheet();
        }

        $yearCols = $this->findYearCols($mainSheet);
        ksort($yearCols);
        $sortedYears = array_keys($yearCols);

        $resultByYear = [];
        foreach ($sortedYears as $y) {
            $resultByYear[$y] = [];
        }

        // 1. Read main assumption sheet
        foreach ($this->standardRowMap as $rowIdx => $key) {
            foreach ($yearCols as $y => $colIdx) {
                $rawVal = $mainSheet->getCell([$colIdx, $rowIdx])->getCalculatedValue();
                $resultByYear[$y][$key] = $this->cleanNum($rawVal);
            }
        }

        // 2. Read 06_HR_Planning sheet if present
        $hrSheet = null;
        foreach ($spreadsheet->getSheetNames() as $name) {
            $lower = strtolower($name);
            if (str_contains($lower, 'hr_planning') || str_contains($lower, 'hr') || str_contains($lower, 'payroll')) {
                $hrSheet = $spreadsheet->getSheetByName($name);
                break;
            }
        }
        if ($hrSheet) {
            $hrYearCols = $this->findYearCols($hrSheet);
            foreach ($this->hrRowMap as $rowIdx => $key) {
                foreach ($sortedYears as $y) {
                    $colIdx = $hrYearCols[$y] ?? $yearCols[$y] ?? null;
                    if ($colIdx) {
                        $rawVal = $hrSheet->getCell([$colIdx, $rowIdx])->getCalculatedValue();
                        $resultByYear[$y][$key] = $this->cleanNum($rawVal);
                    }
                }
            }
        }

        // 3. Read 07_OPEX sheet if present
        $opexSheet = null;
        foreach ($spreadsheet->getSheetNames() as $name) {
            $lower = strtolower($name);
            if (str_contains($lower, 'opex') || str_contains($lower, 'operating')) {
                $opexSheet = $spreadsheet->getSheetByName($name);
                break;
            }
        }
        if ($opexSheet) {
            $opexYearCols = $this->findYearCols($opexSheet);
            foreach ($this->opexRowMap as $rowIdx => $key) {
                foreach ($sortedYears as $y) {
                    $colIdx = $opexYearCols[$y] ?? $yearCols[$y] ?? null;
                    if ($colIdx) {
                        $rawVal = $opexSheet->getCell([$colIdx, $rowIdx])->getCalculatedValue();
                        $val = $this->cleanNum($rawVal);
                        if ($key !== 'payroll_cost' || $val > 0) {
                            $resultByYear[$y][$key] = $val;
                        }
                    }
                }
            }
        }

        // Normalize percentage fractions (e.g. 0.01 -> 1.0 %, 0.4 -> 40.0 %)
        foreach ($sortedYears as $y) {
            foreach ($this->fracKeys as $k) {
                if (isset($resultByYear[$y][$k])) {
                    $val = $resultByYear[$y][$k];
                    if ($val > 0 && $val <= 1.0) {
                        $resultByYear[$y][$k] = round($val * 100.0, 4);
                    }
                }
            }
        }

        return [
            'success' => true,
            'sheet_name' => $mainSheet->getTitle(),
            'years' => $sortedYears,
            'assumptions' => $resultByYear
        ];
    }
}
