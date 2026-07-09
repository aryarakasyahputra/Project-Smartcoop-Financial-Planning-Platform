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
});
