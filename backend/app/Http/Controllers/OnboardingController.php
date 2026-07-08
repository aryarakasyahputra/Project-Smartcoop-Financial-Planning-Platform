<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Company;
use App\Models\UserCompanyAccess;

class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $result = DB::transaction(function () use ($request, $user) {
            $company = Company::create([
                'name' => $request->company_name,
            ]);

            UserCompanyAccess::create([
                'user_id' => $user->id,
                'company_id' => $company->id,
            ]);

            return $company;
        });

        return response()->json([
            'message' => 'Onboarding completed successfully',
            'company' => $result
        ], 201);
    }
}
