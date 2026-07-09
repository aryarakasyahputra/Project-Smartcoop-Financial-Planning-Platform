<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $user->load(['role', 'companyAccesses.company.projects']);
            
            foreach ($user->companyAccesses as $access) {
                $company = $access->company;
                if ($company && $company->projects->isEmpty()) {
                    \App\Models\Project::create([
                        'company_id' => $company->id,
                        'name' => 'Proyeksi Keuangan Utama'
                    ]);
                }
            }
            $user->load(['role', 'companyAccesses.company.projects']);
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $founderRole = Role::where('name', 'founder')->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $founderRole ? $founderRole->id : null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load(['role', 'companyAccesses.company.projects']);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }
    
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'companyAccesses.company.projects']);
        
        foreach ($user->companyAccesses as $access) {
            $company = $access->company;
            if ($company && $company->projects->isEmpty()) {
                \App\Models\Project::create([
                    'company_id' => $company->id,
                    'name' => 'Proyeksi Keuangan Utama'
                ]);
            }
        }
        $user->load(['role', 'companyAccesses.company.projects']);
        
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
