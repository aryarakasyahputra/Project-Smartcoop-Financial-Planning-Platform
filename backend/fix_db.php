<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

if (!Schema::hasColumn('assumption_values', 'beginning_cooperatives')) {
    Schema::table('assumption_values', function (Blueprint $table) {
        $table->integer('beginning_cooperatives')->default(215)->after('year');
    });
    echo "Column added successfully.\n";
} else {
    echo "Column already exists.\n";
}
