<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\InvitationController;

Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'callback']);

use App\Http\Controllers\AssumptionController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);
    Route::post('/invitations', [InvitationController::class, 'store']);

    // Assumption Engine (CFO Dashboard)
    Route::get('/projects/{projectId}/assumptions', [AssumptionController::class, 'get']);
    Route::put('/projects/{projectId}/assumptions', [AssumptionController::class, 'update']);
    Route::post('/projects/{projectId}/reset', [AssumptionController::class, 'reset']);

    // Team Management (Founder Dashboard)
    Route::get('/companies/{companyId}/members', [\App\Http\Controllers\TeamController::class, 'index']);
    Route::delete('/companies/{companyId}/members/{userId}', [\App\Http\Controllers\TeamController::class, 'destroy']);
    
    // Admin Routes
    Route::middleware([\App\Http\Middleware\CheckAdmin::class])->prefix('admin')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\AdminController::class, 'getDashboardStats']);
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'getUsers']);
        Route::put('/users/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateUserStatus']);
        Route::get('/companies', [\App\Http\Controllers\AdminController::class, 'getCompanies']);
        Route::get('/companies/{id}', [\App\Http\Controllers\AdminController::class, 'getCompanyDetails']);
        Route::put('/companies/{id}/subscription', [\App\Http\Controllers\AdminController::class, 'updateCompanySubscription']);
        Route::get('/activity-logs', [\App\Http\Controllers\AdminController::class, 'getActivityLogs']);
    });
});
