<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Project;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getDashboardStats()
    {
        $totalUsers = User::count();
        $activeCompanies = Company::count();
        $activeProjects = Project::count();

        // Calculate some basic dummy system status
        $systemStatus = '100% OK';

        return response()->json([
            'total_users' => $totalUsers,
            'active_companies' => $activeCompanies,
            'active_projects' => $activeProjects,
            'system_status' => $systemStatus
        ]);
    }

    public function getUsers()
    {
        $users = User::with(['role', 'companyAccesses.company'])->get();
        return response()->json($users);
    }

    public function updateUserStatus(Request $request, int $id)
    {
        // Placeholder for suspend/ban logic
        // We could add 'is_active' or 'status' to users table later
        return response()->json(['message' => 'User status updated']);
    }

    public function getCompanies()
    {
        $companies = Company::withCount('projects')->get();
        return response()->json($companies);
    }

    public function getCompanyDetails($id)
    {
        $company = Company::with([
            'projects',
            'userAccesses.user'
        ])->findOrFail($id);
        
        return response()->json($company);
    }

    public function updateCompanySubscription(Request $request, int $id)
    {
        $request->validate([
            'subscription_status' => 'required|in:trial,pro,enterprise',
        ]);

        $company = Company::findOrFail($id);
        $company->subscription_status = $request->subscription_status;
        
        // Example: if Pro, set ends_at to 1 month from now
        if ($request->subscription_status !== 'trial') {
            $company->subscription_ends_at = now()->addMonth();
        }
        
        $company->save();

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'updated_subscription',
            'description' => "Updated company {$company->name} subscription to {$request->subscription_status}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Subscription updated successfully', 'company' => $company]);
    }

    public function getActivityLogs()
    {
        $logs = ActivityLog::with('user')->orderBy('created_at', 'desc')->take(100)->get();
        return response()->json($logs);
    }
}
