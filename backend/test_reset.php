<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
try {
    $service = app(\App\Services\FinancialModelService::class);
    $controller = new \App\Http\Controllers\AssumptionController($service);
    $response = $controller->reset(1);
    echo "STATUS: " . $response->getStatusCode() . "\n";
    echo "CONTENT: " . $response->getContent() . "\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} catch (\Error $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
