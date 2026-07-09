import React, { useEffect, useState } from "react";
import { LogOut, Building } from "lucide-react";
import FounderDashboard from "./founder/FounderDashboard.jsx";
import CfoDashboard from "./cfo/CfoDashboard.jsx";
import InvestorDashboard from "./investor/InvestorDashboard.jsx";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.pathname = "/login";
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
          const roleName = data.role?.name;

          // Guard: if user is admin, redirect to admin dashboard
          if (roleName === "admin") {
            window.location.pathname = "/admin/dashboard";
            return;
          }

          // Check if user has completed onboarding (has at least one company access)
          // ONLY founders need to go to /onboarding if they have no company access.
          if ((!data.company_accesses || data.company_accesses.length === 0) && roleName === "founder") {
            window.location.pathname = "/onboarding";
            return;
          }
          setUserData(data);
        } else {
          sessionStorage.removeItem("token");
          window.location.pathname = "/login";
        }
      } catch (err) {
        setError("Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Logout failed on server:", err);
      }
    }
    sessionStorage.removeItem("token");
    window.location.pathname = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-card border border-destructive/20 rounded-xl text-center">
          <p className="text-destructive font-semibold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Check if user has no company access (waiting room case)
  const isCompanyEmpty = !userData?.company_accesses || userData.company_accesses.length === 0;

  if (isCompanyEmpty && userData?.role?.name !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
            <Building className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Menunggu Undangan Akses</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Akun Anda dengan role <strong className="capitalize">{userData?.role?.name}</strong> belum terhubung ke workspace perusahaan mana pun.
          </p>
          <div className="p-4 bg-muted rounded-xl mb-6 text-xs text-left text-muted-foreground space-y-2">
            <p><strong>Bagaimana cara terhubung?</strong></p>
            <p>Silakan hubungi Founder perusahaan Anda agar email <strong>{userData?.email}</strong> ditambahkan ke daftar anggota tim perusahaan mereka.</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar & Login Ulang
          </button>
        </div>
      </div>
    );
  }

  const roleName = userData?.role?.name;

  if (roleName === "founder") {
    return <FounderDashboard userData={userData} handleLogout={handleLogout} />;
  } else if (roleName === "finance") {
    return <CfoDashboard userData={userData} handleLogout={handleLogout} />;
  } else if (roleName === "investor viewer") {
    return <InvestorDashboard userData={userData} handleLogout={handleLogout} />;
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl text-center">
        <p className="font-semibold mb-4 text-foreground">Role tidak dikenali: {roleName}</p>
        <button onClick={handleLogout} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold">
          Keluar
        </button>
      </div>
    </div>
  );
}
