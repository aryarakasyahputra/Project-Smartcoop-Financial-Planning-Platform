<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invitation;
use App\Models\User;
use App\Models\UserCompanyAccess;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function index($companyId, Request $request)
    {
        $invitations = Invitation::with('role')
            ->where('company_id', $companyId)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'invitations' => $invitations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role_id' => 'required|exists:roles,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Update user role to invited role if requested
            $user->role_id = $request->role_id;
            $user->save();

            // Grant company access if not already granted
            UserCompanyAccess::firstOrCreate([
                'user_id' => $user->id,
                'company_id' => $request->company_id,
            ]);

            return response()->json([
                'message' => 'Anggota tim berhasil ditambahkan langsung ke perusahaan',
                'user' => $user->load('role')
            ], 200);
        }

        // Check if there is already a pending invitation for this email & company
        $existing = Invitation::where('email', $request->email)
            ->where('company_id', $request->company_id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            $existing->role_id = $request->role_id;
            $existing->touch();
            $existing->save();

            return response()->json([
                'message' => 'Undangan pending untuk email ini telah diperbarui & dikirim ulang',
                'invitation' => $existing->load('role')
            ], 200);
        }

        // Create new pending invitation
        $invitation = Invitation::create([
            'email' => $request->email,
            'role_id' => $request->role_id,
            'company_id' => $request->company_id,
            'token' => Str::random(32),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Undangan kolaborasi berhasil dikirim (Pending Konfirmasi)',
            'invitation' => $invitation->load('role')
        ], 201);
    }

    public function resend($id)
    {
        $invitation = Invitation::find($id);
        if (!$invitation) {
            return response()->json(['message' => 'Undangan tidak ditemukan'], 404);
        }

        $invitation->token = Str::random(32);
        $invitation->touch();
        $invitation->save();

        return response()->json([
            'message' => 'Link undangan berhasil dikirim ulang ke ' . $invitation->email
        ]);
    }

    public function destroy($id)
    {
        $invitation = Invitation::find($id);
        if ($invitation) {
            $invitation->delete();
            return response()->json(['message' => 'Undangan pending berhasil dibatalkan']);
        }

        return response()->json(['message' => 'Undangan tidak ditemukan'], 404);
    }
}
