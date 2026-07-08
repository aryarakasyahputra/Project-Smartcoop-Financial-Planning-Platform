<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invitation;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        $invitation = Invitation::create([
            'email' => $request->email,
            'role_id' => $request->role_id,
            'company_id' => $request->company_id,
            'token' => Str::random(32),
            'status' => 'pending',
        ]);

        // In a real app, send an email to the user here
        // Mail::to($request->email)->send(new InvitationMail($invitation));

        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation
        ], 201);
    }
}
