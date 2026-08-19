<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/import-excel-temp', function () { require base_path('..\\scratch\\import_excel.php'); return 'ok'; });

Route::get('/setup-app', function () {
    \Illuminate\Support\Facades\Artisan::call('key:generate');
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('storage:link');
    return 'Setup & Seeder Berhasil! Seluruh tabel dan akun tes (finance@test.com, founder@test.com, admin@test.com dengan password: password) sudah siap!';
});
