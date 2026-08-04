import React, { useState, useEffect } from "react";
import { ArrowRight, Building2, AlertCircle, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Onboarding() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snapLoading, setSnapLoading] = useState(false);

  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planFromQuery = searchParams.get("plan");
  const selectedPlan = planFromQuery || sessionStorage.getItem("selected_plan") || "starter";

  // Load Midtrans Snap JS dynamically
  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "SB-Mid-client-demo-key";

    if (!document.querySelector(`script[src="${snapScriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = snapScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/me", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.role?.name !== "founder") {
            navigate("/dashboard");
            return;
          }
          if (data.company_accesses && data.company_accesses.length > 0) {
            navigate("/dashboard");
            return;
          }
          setCheckingRole(false);
        } else {
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        setError("Gagal memverifikasi hak akses pengguna.");
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [navigate]);

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Sesi Anda telah kedaluwarsa. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create company via Onboarding API
      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({
          company_name: companyName,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal menyimpan data onboarding");
        setLoading(false);
        return;
      }

      setSuccess("Profil Perusahaan Berhasil Dibuat!");

      // 2. Handle Payment Flow if Professional Plan selected
      if (selectedPlan === "professional") {
        setSnapLoading(true);
        try {
          const snapRes = await fetch("/api/payments/snap-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ plan: "professional" })
          });
          const snapData = await snapRes.json();

          if (snapData.snap_token && window.snap) {
            window.snap.pay(snapData.snap_token, {
              onSuccess: function (result) {
                navigate("/dashboard");
              },
              onPending: function (result) {
                navigate("/dashboard");
              },
              onError: function (result) {
                navigate("/dashboard");
              },
              onClose: function () {
                navigate("/dashboard");
              }
            });
            return;
          }
        } catch (paymentErr) {
          console.warn("Midtrans Snap payment popup notice:", paymentErr);
        }
      }

      // Fallback redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (err) {
      setError("Terjadi kesalahan koneksi saat memproses onboarding.");
    } finally {
      setLoading(false);
      setSnapLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <div className="text-center mb-8">
          <Link to="/" className="flex flex-col items-center leading-none mb-6">
            <span className="text-[32px] font-bold text-[#005fa4]">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[12px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase ml-1">
              financial
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Satu langkah lagi...</h1>
          <p className="text-sm text-muted-foreground mt-2">Daftarkan profil perusahaan Anda untuk memulai pemodelan keuangan</p>
          
          {selectedPlan === "professional" && (
            <div className="mt-4 p-3 rounded-lg bg-[#005fa4]/10 border border-[#005fa4]/20 flex items-center justify-center gap-2 text-xs font-semibold text-[#005fa4]">
              <CreditCard className="h-4 w-4" /> Paket Terpilih: Professional (Rp 499k/bulan)
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-up">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 animate-fade-up">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-500 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleOnboarding} className="space-y-6">
          {/* Nama Perusahaan */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Perusahaan</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="PT Maju Bersama"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || snapLoading}
            className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            {loading ? "Memproses..." : selectedPlan === "professional" ? "Lanjut ke Pembayaran Midtrans" : "Lanjutkan ke Dashboard"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
