<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserCompanyAccess;

class TeamController extends Controller
{
    public function index($companyId, Request $request)
    {
        $user = $request->user();
        
        // Ensure user has access to this company and is a founder
        $access = UserCompanyAccess::where('user_id', $user->id)
            ->where('company_id', $companyId)
            ->first();

        if (!$access || $user->role->name !== 'founder') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $members = UserCompanyAccess::with('user.role')
            ->where('company_id', $companyId)
            ->get()
            ->map(function ($access) {
                return $access->user;
            });

        return response()->json([
            'members' => $members
        ]);
    }

    public function destroy($companyId, $userId, Request $request)
    {
        $user = $request->user();

        // Ensure user has access to this company and is a founder
        $access = UserCompanyAccess::where('user_id', $user->id)
            ->where('company_id', $companyId)
            ->first();

        if (!$access || $user->role->name !== 'founder') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot remove yourself
        if ($user->id == $userId) {
            return response()->json(['message' => 'Cannot remove yourself from the company'], 400);
        }

        $targetAccess = UserCompanyAccess::where('company_id', $companyId)
            ->where('user_id', $userId)
            ->first();

        if ($targetAccess) {
            $targetAccess->delete();
            return response()->json(['message' => 'User removed from company successfully']);
        }

        return response()->json(['message' => 'User not found in this company'], 404);
    }
}
