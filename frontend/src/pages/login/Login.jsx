import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "not_invited") {
      setError("Akun Google ini belum diundang ke perusahaan manapun.");
    } else if (errorParam === "google_auth_failed") {
      setError("Gagal melakukan autentikasi dengan Google.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("token", data.access_token);
        const roleName = data.user?.role?.name || "Unknown Role";
        setSuccess(`Kamu berhasil login sebagai ${roleName.toUpperCase()}. Mengalihkan...`);
        
        setTimeout(() => {
          if (!data.user?.company_accesses || data.user.company_accesses.length === 0) {
            navigate("/onboarding");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Tombol Kembali - dipindah ke luar card */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Kembali ke Beranda</span>
      </Link>

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
          <h1 className="text-2xl font-bold text-foreground">Selamat Datang</h1>
          <p className="text-sm text-muted-foreground mt-2">Silakan masuk ke akun Anda</p>
        </div>


        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-500 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="admin@test.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            {loading ? "Memproses..." : "Masuk"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#005fa4] font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>Atau login dengan Google (Khusus Undangan)</p>
          <a
            href="http://localhost:8000/api/auth/google/redirect"
            className="w-full mt-4 inline-flex justify-center items-center gap-2 rounded-full border border-border bg-card text-foreground px-6 py-3 text-sm font-semibold hover:bg-muted transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Lanjutkan dengan Google
          </a>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>Test Accounts:</p>
          <p className="mt-1">admin@test.com | founder@test.com</p>
          <p>finance@test.com | investorviewer@test.com</p>
          <p className="mt-1 font-mono text-xs">(password: password)</p>
        </div>
      </div>
    </div>
  );
}
