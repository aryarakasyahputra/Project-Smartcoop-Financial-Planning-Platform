<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinancialModelService;

class AssumptionController extends Controller
{
    protected FinancialModelService $service;

    public function __construct(FinancialModelService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/projects/:projectId/assumptions
     * Mengambil data asumsi aktif beserta hasil proyeksi keuangannya (Tahun 2025-2029).
     * 
     * @param mixed $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get($projectId)
    {
        try {
            $data = $this->service->getProjectData($projectId);
            return response()->json($data);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memuat data asumsi', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /api/projects/:projectId/assumptions
     * Menyimpan perubahan nilai asumsi dan memicu perhitungan ulang (Auto-Recalculation).
     * 
     * @param Request $request
     * @param mixed $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $projectId)
    {
        $data = $request->all();
        
        // Cek apakah payload merupakan data terstruktur per-tahun (2025-2029)
        $hasYears = false;
        foreach ([2025, 2026, 2027, 2028, 2029] as $y) {
            if (isset($data[$y])) {
                $hasYears = true;
                break;
            }
        }

        try {
            if ($hasYears) {
                // Update terstruktur per tahun
                $summaries = $this->service->recalculate($projectId, $data);
            } else {
                // Update flat (duplikat nilai ke semua tahun) untuk backward compatibility
                $allYearsPayload = [];
                foreach ([2025, 2026, 2027, 2028, 2029] as $y) {
                    $allYearsPayload[$y] = $data;
                }
                $summaries = $this->service->recalculate($projectId, $allYearsPayload);
            }

            return response()->json([
                'message' => 'Proyeksi berhasil dihitung ulang',
                'financial_summaries' => $summaries
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memperbarui asumsi', 'error' => $e->getMessage()], 500);
        }
    }

    public function reset($projectId)
    {
        try {
            $this->service->resetToZero($projectId);
            $data = $this->service->getProjectData($projectId);
            return response()->json([
                'message' => 'Asumsi berhasil direset ke nol',
                'data' => $data
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mereset asumsi', 'error' => $e->getMessage()], 500);
        }
    }
}
