import React, { useState, useEffect } from "react";
import { ArrowRight, Building2, AlertCircle, CheckCircle2, CreditCard, ShieldCheck, Check, X, QrCode, Landmark, Wallet } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Onboarding() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snapLoading, setSnapLoading] = useState(false);

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planFromQuery = searchParams.get("plan");
  const [selectedPlan, setSelectedPlan] = useState(planFromQuery || sessionStorage.getItem("selected_plan") || "professional");

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

          setPaymentDetails(snapData);

          // If real Midtrans window.snap is ready & valid token returned
          if (snapData.snap_token && window.snap && typeof window.snap.pay === "function" && !snapData.is_mock) {
            window.snap.pay(snapData.snap_token, {
              onSuccess: function () { navigate("/dashboard"); },
              onPending: function () { navigate("/dashboard"); },
              onError: function () { navigate("/dashboard"); },
              onClose: function () { navigate("/dashboard"); }
            });
          } else {
            // Open built-in Midtrans Payment Gateway Modal
            setShowPaymentModal(true);
          }
          return;
        } catch (paymentErr) {
          console.warn("Midtrans Snap payment notice:", paymentErr);
          setShowPaymentModal(true);
          return;
        }
      }

      // Starter plan redirect
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

  const handleSimulatedPaymentSuccess = async () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setIsPaymentCompleted(true);
    }, 1200);
  };

  const handleFinishPayment = () => {
    setShowPaymentModal(false);
    navigate("/dashboard");
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
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
        </div>

        {/* Plan Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3 p-1 bg-muted/40 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setSelectedPlan("starter")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              selectedPlan === "starter"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Paket Starter (Rp 0)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlan("professional")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              selectedPlan === "professional"
                ? "bg-[#005fa4] text-white shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Professional (Rp 499k)
          </button>
        </div>

        {selectedPlan === "professional" && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#005fa4]/10 border border-[#005fa4]/20 flex items-center gap-3 text-xs font-semibold text-[#005fa4]">
            <CreditCard className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Paket Terpilih: Professional</p>
              <p className="text-[11px] opacity-80">Rp 499.000 / bulan (Ditagih tahunan)</p>
            </div>
          </div>
        )}

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

      {/* Midtrans Snap Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-gray-800 animate-scale-up">
            
            {/* Midtrans Header */}
            <div className="bg-[#1b2536] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#005fa4] flex items-center justify-center font-bold text-white text-lg">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Midtrans Payment Gateway</h3>
                  <p className="text-xs text-gray-300">Order ID: {paymentDetails?.order_id || "TRX-10492"}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {isPaymentCompleted ? (
              <div className="p-8 text-center space-y-4 animate-scale-up">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</h3>
                  <p className="text-xs text-gray-500 mt-1">Transaksi Midtrans Sebesar <span className="font-bold text-gray-800">Rp 499.000</span> Telah Diverifikasi</p>
                </div>
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Langganan:</span>
                    <span className="font-bold text-green-700">Aktif (Professional)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <span className="font-bold text-gray-800 uppercase">{selectedMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-700">{paymentDetails?.order_id || "TRX-10492"}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFinishPayment}
                  className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                >
                  <span>Masuk ke Dashboard Utama</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Total Payment Info */}
                <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Tagihan</span>
                    <p className="text-2xl font-extrabold text-[#005fa4]">Rp 499.000</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#005fa4] border border-blue-200 text-xs font-bold">
                    Paket Professional
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="p-5 space-y-4">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Pilih Metode Pembayaran</label>
                  
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("qris")}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedMethod === "qris" 
                          ? "border-[#005fa4] bg-blue-50/50 ring-2 ring-[#005fa4]/20" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-[#005fa4]" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">QRIS / GoPay / ShopeePay</p>
                          <p className="text-xs text-gray-500">Scan QR Code instan dari aplikasi e-wallet</p>
                        </div>
                      </div>
                      {selectedMethod === "qris" && <Check className="h-5 w-5 text-[#005fa4]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod("va")}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedMethod === "va" 
                          ? "border-[#005fa4] bg-blue-50/50 ring-2 ring-[#005fa4]/20" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-[#005fa4]" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">Transfer Virtual Account (VA)</p>
                          <p className="text-xs text-gray-500">BCA, Mandiri, BNI, BRI, Permata</p>
                        </div>
                      </div>
                      {selectedMethod === "va" && <Check className="h-5 w-5 text-[#005fa4]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod("cc")}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedMethod === "cc" 
                          ? "border-[#005fa4] bg-blue-50/50 ring-2 ring-[#005fa4]/20" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-[#005fa4]" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">Kartu Kredit / Debit</p>
                          <p className="text-xs text-gray-500">Visa, Mastercard, JCB</p>
                        </div>
                      </div>
                      {selectedMethod === "cc" && <Check className="h-5 w-5 text-[#005fa4]" />}
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Transaksi Diamankan oleh Midtrans SSL 256-bit</span>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handleSimulatedPaymentSuccess}
                    disabled={processingPayment}
                    className="w-full mt-2 py-3.5 bg-[#005fa4] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#005fa4]/20 disabled:opacity-50"
                  >
                    {processingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Memproses Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <span>Bayar Sekarang (Simulasi Midtrans)</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
