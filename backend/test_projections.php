<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$rp = \App\Models\RevenueProjection::where('project_id', 3)->where('year', 2025)->first();
$cp = \App\Models\CostProjection::where('project_id', 3)->where('year', 2025)->first();
echo "Revenue Projections:\n";
print_r($rp->toArray());
echo "\nCost Projections:\n";
print_r($cp->toArray());
