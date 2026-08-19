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

    /**
     * @param int|string $projectId
     */
    protected function checkProjectAccess(int|string $projectId): bool
    {
        /** @var \App\Models\User $user */
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
     * @param int|string $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(int|string $projectId)
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
     * @param int|string $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int|string $projectId)
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

    /**
     * @param int|string $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset(int|string $projectId)
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

    /**
     * GET /api/projects/:projectId/export-excel
     * Mengunduh file Excel model (Smartcoop_Financial_Model_v2.xlsx) beserta rumus aktif (live formulas).
     * 
     * @param Request $request
     * @param int|string $projectId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function exportExcel(Request $request, int|string $projectId)
    {
        $this->checkProjectAccess($projectId);
        $project = Project::with('company')->findOrFail($projectId);

        $assumptions = \App\Models\AssumptionValue::where('project_id', $project->id)->orderBy('year')->get();

        $assumptionsByYear = [];
        foreach ($assumptions as $a) {
            $assumptionsByYear[$a->year] = $a->toArray();
        }

        $companyName = $project->company->name ?? 'Smartcoop';
        $currency = $request->query('currency', 'IDR');
        $lang = $request->query('lang', 'en');
        $payload = [
            'company_name' => $companyName,
            'currency' => $currency,
            'lang' => $lang,
            'assumptions' => $assumptionsByYear,
        ];

        $tempDir = storage_path('app/temp');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $jsonPath = $tempDir . '/payload_' . $project->id . '_' . time() . '.json';
        $safeName = preg_replace('/[^A-Za-z0-9_]/', '_', $companyName);
        $outputPath = $tempDir . '/Smartcoop_Financial_Model_' . $safeName . '.xlsx';
        $templatePath = storage_path('app/Smartcoop_Financial_Model_v2.xlsx');
        if (!file_exists($templatePath)) {
            $templatePath = base_path('Smartcoop_Financial_Model_v2.xlsx');
        }
        if (!file_exists($templatePath)) {
            $templatePath = base_path('../Smartcoop_Financial_Model_v2.xlsx');
        }

        @ini_set('memory_limit', '512M');
        @set_time_limit(300);

        try {
            $exportService = app(\App\Services\ExcelExportService::class);
            $success = $exportService->generateModel($payload, $templatePath, $outputPath);
            if ($success && file_exists($outputPath)) {
                return response()->download($outputPath, basename($outputPath))->deleteFileAfterSend(true);
            }
            throw new \Exception("File output gagal dibuat di path " . $outputPath);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Excel Export Error: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal menghasilkan file Excel model: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/projects/:projectId/import-excel
     * Mengunggah file Excel model (.xlsx) untuk mengisi nilai asumsi keuangan secara otomatis.
     * 
     * @param Request $request
     * @param int|string $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function importExcel(Request $request, int|string $projectId)
    {
        $this->checkProjectAccess($projectId);

        $file = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
        } elseif ($request->hasFile('excel')) {
            $file = $request->file('excel');
        } else {
            $allFiles = $request->allFiles();
            if (!empty($allFiles)) {
                $file = reset($allFiles);
            }
        }

        if (!$file) {
            return response()->json(['message' => 'File Excel tidak ditemukan dalam request upload'], 400);
        }

        if (!$file->isValid()) {
            return response()->json(['message' => 'File upload tidak valid: ' . $file->getErrorMessage()], 400);
        }

        $ext = strtolower($file->getClientOriginalExtension());
        if ($ext !== 'xlsx' && $ext !== 'xls') {
            return response()->json(['message' => 'Format file harus berupa Excel (.xlsx atau .xls)'], 422);
        }

        $tempDir = storage_path('app/temp');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $filename = 'upload_' . $projectId . '_' . time() . '.' . $ext;
        $movedFile = $file->move($tempDir, $filename);
        $fullPath = $movedFile->getRealPath();

        try {
            $scriptPath = app_path('Services/import_excel.py');
            $command = "python " . escapeshellarg($scriptPath) . " " . escapeshellarg($fullPath) . " 2>&1";

            exec($command, $output, $returnCode);

            if ($returnCode !== 0 || empty($output)) {
                $output = [];
                $command2 = "py " . escapeshellarg($scriptPath) . " " . escapeshellarg($fullPath) . " 2>&1";
                exec($command2, $output, $returnCode);
            }

            $rawOutput = implode("\n", $output);
            $parsed = json_decode($rawOutput, true);

            if ($returnCode !== 0 || !$parsed || empty($parsed['success'])) {
                $detail = $parsed['error'] ?? $rawOutput ?? 'Unknown error';
                return response()->json([
                    'message' => 'Gagal membaca file Excel: ' . $detail,
                    'error' => $detail
                ], 422);
            }

            $assumptionsData = $parsed['assumptions'] ?? [];
            if (empty($assumptionsData)) {
                return response()->json(['message' => 'Tidak ditemukan data asumsi dalam file Excel'], 422);
            }

            // Recalculate and update database
            $summaries = $this->service->recalculate($projectId, $assumptionsData);
            $updatedProjectData = $this->service->getProjectData($projectId);

            return response()->json([
                'message' => 'Data asumsi berhasil diimpor dari file Excel',
                'years' => $parsed['years'] ?? [],
                'sheet_name' => $parsed['sheet_name'] ?? '02_Assumptions',
                'data' => $updatedProjectData,
                'financial_summaries' => $summaries
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengimpor file Excel: ' . $e->getMessage(), 'error' => $e->getMessage()], 500);
        } finally {
            if (isset($fullPath) && file_exists($fullPath)) {
                @unlink($fullPath);
            }
        }
    }
}
