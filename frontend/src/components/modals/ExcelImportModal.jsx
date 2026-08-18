import React, { useState, useRef } from "react";
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ExcelImportModal({
  show,
  onClose,
  projectId = 1,
  onImportSuccess,
  language = "en"
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.match(/\.(xlsx|xls)$/i)) {
        setSelectedFile(file);
      } else {
        toast.error(language === "en" ? "Please select a valid Excel file (.xlsx)" : "Format file harus Excel (.xlsx)");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.match(/\.(xlsx|xls)$/i)) {
        setSelectedFile(file);
      } else {
        toast.error(language === "en" ? "Please select a valid Excel file (.xlsx)" : "Format file harus Excel (.xlsx)");
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      toast.loading(language === "en" ? "Parsing Excel & recalculating model..." : "Membaca file Excel & menghitung ulang model...", { id: "import-excel" });

      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      formData.append("excel", selectedFile, selectedFile.name);

      const token = sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
      
      if (!token) {
        toast.error(language === "en" ? "Session expired. Please log in again." : "Sesi telah berakhir. Silakan login kembali.", { id: "import-excel" });
        setUploading(false);
        return;
      }

      const res = await fetch(`/api/projects/${projectId}/import-excel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData
      });

      const json = await res.json();

      if (res.ok || json.success) {
        toast.success(language === "en" ? "Excel assumptions imported successfully!" : "Berhasil mengimpor data asumsi dari Excel!", { id: "import-excel" });
        if (onImportSuccess) {
          onImportSuccess(json);
        }
        setSelectedFile(null);
        onClose();
      } else {
        throw new Error(json.message || json.error || "Import failed");
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error((language === "en" ? "Failed to import Excel: " : "Gagal mengimpor Excel: ") + (err.message || ""), { id: "import-excel" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === "en" ? "Import Assumptions from Excel" : "Impor Asumsi Keuangan dari Excel"}
              </h3>
              <p className="text-xs text-slate-500">
                {language === "en" ? "Upload .xlsx file to automatically populate 5-year assumptions" : "Unggah file .xlsx untuk mengisi asumsi 5-tahun secara otomatis"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
              dragActive 
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" 
                : selectedFile 
                  ? "border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/10" 
                  : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <>
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 underline">
                  {language === "en" ? "Click or drop another file to replace" : "Klik atau drag file lain untuk mengganti"}
                </p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === "en" ? "Click to upload or drag & drop" : "Klik untuk memilih file atau drag & drop"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === "en" ? "Excel Spreadsheet (.xlsx, .xls) up to 10MB" : "File Spreadsheet Excel (.xlsx, .xls) hingga 10MB"}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Info Card */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === "en" 
                ? "The system will read sheet '02_Assumptions' or scan assumption rows automatically. All metrics for 2025–2029 will be auto-calculated upon import."
                : "Sistem akan membaca sheet '02_Assumptions' atau memindai baris asumsi secara otomatis. Seluruh proyeksi 2025–2029 akan dihitung ulang secara instan."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {language === "en" ? "Cancel" : "Batal"}
          </button>
          <button
            onClick={handleUploadSubmit}
            disabled={!selectedFile || uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{language === "en" ? "Importing..." : "Mengimpor..."}</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                <span>{language === "en" ? "Import & Recalculate" : "Impor & Hitung Ulang"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
