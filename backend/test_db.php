<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\FinancialModelService;

$service = new FinancialModelService();

echo "=== SMARTCOOP FINANCIAL PLANNING CLI MODEL ===\n";

function ask($prompt, $default) {
    echo "{$prompt} [Default: {$default}]: ";
    $input = trim(fgets(STDIN));
    return $input === '' ? $default : $input;
}

$newCoops = (int) ask("Koperasi Baru Diakuisisi / Tahun (new_coops_acquired)", 10);
$churnRate = (float) ask("Laju Churn Bulanan % (monthly_churn_rate)", 1.5);
$subFee = (float) ask("SaaS Subscription Fee / Bulan (monthly_subscription_fee)", 500000);
$payroll = (float) ask("Biaya Payroll / Tahun (payroll_cost)", 300000000);

$years = [2025, 2026, 2027, 2028, 2029];
$payload = [];
foreach ($years as $year) {
    $payload[$year] = [
        'new_coops_acquired' => $newCoops,
        'monthly_churn_rate' => $churnRate,
        'avg_members_per_coop' => 500,
        'subscription_paying_frac' => 80,
        'setup_fee' => 1000000,
        'paid_implementation_coops' => 5,
        'monthly_subscription_fee' => $subFee,
        'ios_addon_monthly_fee' => 50000,
        'ios_adoption_frac' => 20,
        'white_label_projects' => 1,
        'white_label_fee_per_project' => 15000000,
        'ppob_active_coops_frac' => 50,
        'ppob_tx_per_coop_month' => 1000,
        'avg_ppob_fee_per_tx' => 500,
        'academy_participants_frac' => 5,
        'academy_avg_price_per_participant' => 150000,
        'offline_trainings_per_month' => 2,
        'offline_training_fee_per_coop' => 2500000,
        'enterprise_api_revenue' => 120000000,
        'cloud_cost_per_coop_month' => 50000,
        'implementation_cost_per_coop' => 300000,
        'support_cost_per_coop_month' => 100000,
        'payment_api_var_cost_frac' => 10,
        'other_cost_of_revenue_frac' => 5,
        'payroll_cost' => $payroll,
        'sales_marketing_spend' => 50000000,
        'office_utilities_internet' => 12000000,
        'software_tools_subscriptions' => 18000000,
        'legal_accounting_compliance' => 24000000,
        'travel_events' => 15000000,
        'recruitment_training' => 10000000,
        'other_ga' => 12000000,
        'seed_investment' => 1000000000,
        'pre_money_valuation' => 5000000000,
        'exit_revenue_multiple_conservative' => 5,
        'exit_revenue_multiple_base' => 8,
        'exit_revenue_multiple_optimistic' => 12,
    ];
}

echo "\nMenghitung proyeksi keuangan dan menyimpan ke database...\n";
$summaries = $service->recalculate(2, $payload);

echo "\n=== HASIL PROYEKSI TAHUN 2025 - 2029 ===\n";
foreach ($summaries as $s) {
    $formattedRev = number_format($s->revenue, 0, ',', '.');
    $formattedEbitda = number_format($s->ebitda, 0, ',', '.');
    echo "Tahun: {$s->year} | Koperasi Aktif: {$s->active_cooperatives} | Pendapatan: Rp {$formattedRev} | EBITDA: Rp {$formattedEbitda}\n";
}
echo "========================================\n\n";
