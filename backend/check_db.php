<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$columns = \Illuminate\Support\Facades\Schema::getColumnListing('assumption_values');
echo "Columns: \n" . implode("\n", $columns);
