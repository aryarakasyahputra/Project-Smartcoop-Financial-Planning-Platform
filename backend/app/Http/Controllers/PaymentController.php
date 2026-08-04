<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Company;

class PaymentController extends Controller
{
    /**
     * Generate Midtrans Snap Token for user checkout.
     */
    public function getSnapToken(Request $request)
    {
        $user = $request->user();
        $plan = $request->input('plan', 'professional');
        $billingCycle = $request->input('billing_cycle', 'annual');

        $price = 499000;
        $planName = 'Paket Professional (Tahunan)';

        if ($plan === 'starter') {
            $price = 0;
            $planName = 'Paket Starter (Selamanya Gratis)';
        } elseif ($billingCycle === 'monthly') {
            $price = 599000;
            $planName = 'Paket Professional (Bulanan)';
        }

        $orderId = 'SMARTCOOP-' . time() . '-' . rand(100, 999);
        $serverKey = config('services.midtrans.server_key');
        $clientKey = config('services.midtrans.client_key');
        $isProduction = config('services.midtrans.is_production');

        $snapUrl = $isProduction 
            ? 'https://app.midtrans.com/snap/v1/transactions' 
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        $payload = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $price,
            ],
            'customer_details' => [
                'first_name' => $user->name ?? 'User',
                'email' => $user->email ?? 'user@example.com',
            ],
            'item_details' => [
                [
                    'id' => 'PLAN-' . strtoupper($plan),
                    'price' => $price,
                    'quantity' => 1,
                    'name' => $planName,
                ]
            ],
        ];

        try {
            // Attempt to call Midtrans Snap API
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            ])->post($snapUrl, $payload);

            if ($response->successful() && isset($response->json()['token'])) {
                return response()->json([
                    'snap_token' => $response->json()['token'],
                    'redirect_url' => $response->json()['redirect_url'] ?? null,
                    'order_id' => $orderId,
                    'client_key' => $clientKey,
                    'is_mock' => false,
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Midtrans Snap API Call Exception: ' . $e->getMessage());
        }

        // Fallback Mock Token for seamless development & demo
        return response()->json([
            'snap_token' => 'MOCK-SNAP-TOKEN-' . time(),
            'order_id' => $orderId,
            'client_key' => $clientKey,
            'is_mock' => true,
            'message' => 'Mode Simulasi Pembayaran (Midtrans Server Key belum di-set)'
        ]);
    }

    /**
     * Webhook Notification Handler for Midtrans payment updates.
     */
    public function handleNotification(Request $request)
    {
        $payload = $request->all();
        Log::info('Midtrans Webhook Notification Received:', $payload);

        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        if ($transactionStatus === 'capture' || $transactionStatus === 'settlement') {
            if ($fraudStatus === 'challenge') {
                Log::info("Transaction {$orderId} is challenged by Fraud Detection System.");
            } else {
                Log::info("Transaction {$orderId} successful. Updating subscription status.");
                // Update subscription status on the user's company
                if ($user = $request->user()) {
                    if ($access = $user->companyAccesses()->first()) {
                        $access->company()->update(['subscription_status' => 'active']);
                    }
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
