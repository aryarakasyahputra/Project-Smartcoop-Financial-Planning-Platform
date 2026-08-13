<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use App\Services\FinancialModelService;

class AssumptionController extends Controller
{
    protected FinancialModelService $service;

    public function __construct(FinancialModelService $service)
    {
        $this->service = $service;
    }

    protected function checkProjectAccess($projectId)
    {
        $user = Auth::user();
        if ($user->role->name === 'admin') {
            return true;
        }

        $project = Project::findOrFail($projectId);
        $hasAccess = $user->companyAccesses()->where('company_id', $project->company_id)->exists();

        if (!$hasAccess) {
            abort(403, 'Anda tidak memiliki akses ke project ini.');
        }

        return true;
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
        $this->checkProjectAccess($projectId);

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
        $this->checkProjectAccess($projectId);
        $data = $request->all();
        
        // Cek apakah payload merupakan data terstruktur per-tahun (memiliki key berupa angka/tahun)
        $hasYears = false;
        foreach (array_keys($data) as $key) {
            if (is_numeric($key)) {
                $hasYears = true;
                break;
            }
        }

        try {
            if ($hasYears) {
                // Update terstruktur per tahun
                $summaries = $this->service->recalculate($projectId, $data);
            } else {
                // Update flat (duplikat nilai ke semua tahun default) untuk backward compatibility
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
        $this->checkProjectAccess($projectId);
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
