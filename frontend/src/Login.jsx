import React, { useState } from "react";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        localStorage.setItem("token", data.access_token);
        const roleName = data.user?.role?.name || "Unknown Role";
        setSuccess(`Kamu berhasil login sebagai ${roleName.toUpperCase()}`);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <div className="text-center mb-8">
          <a href="/" className="inline-block font-display font-bold text-3xl tracking-tight lowercase mb-6">
            <span style={{ color: "#2b6cb8" }}>smart</span><span style={{ color: "#f28c1f" }}>coop</span>
          </a>
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

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Test Accounts:</p>
          <p className="mt-1">admin@test.com | founder@test.com</p>
          <p>finance@test.com | investorviewer@test.com</p>
          <p className="mt-1 font-mono text-xs">(password: password)</p>
        </div>
      </div>
    </div>
  );
}
