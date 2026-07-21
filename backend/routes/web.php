<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/import-excel-temp', function () { require base_path('..\\scratch\\import_excel.php'); return 'ok'; });
