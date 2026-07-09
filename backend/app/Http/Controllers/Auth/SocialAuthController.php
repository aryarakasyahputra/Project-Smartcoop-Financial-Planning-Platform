<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Invitation;
use App\Models\UserCompanyAccess;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver('google');
        return $driver->stateless()->redirect();
    }

    public function callback()
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');
            $googleUser = $driver->stateless()->user();
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=google_auth_failed');
        }

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Update google details just in case
            $user->update([
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
            ]);
        } else {
            // Check if user has an invitation
            $invitation = Invitation::where('email', $googleUser->getEmail())
                ->where('status', 'pending')
                ->first();

            if ($invitation) {
                // Create the user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'role_id' => $invitation->role_id,
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);

                // Grant access to the company
                UserCompanyAccess::create([
                    'user_id' => $user->id,
                    'company_id' => $invitation->company_id,
                    'role_id' => $invitation->role_id,
                ]);

                // Mark invitation as accepted
                $invitation->update(['status' => 'accepted']);
            } else {
                // Auto-register as founder if not invited (to support easy demo logins)
                $founderRole = \App\Models\Role::where('name', 'founder')->first();
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'role_id' => $founderRole ? $founderRole->id : 2,
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }
        }

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirect back to frontend with the token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect($frontendUrl . '/auth/callback?token=' . $token);
    }
}
