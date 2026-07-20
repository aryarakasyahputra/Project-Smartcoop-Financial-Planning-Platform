import React, { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Users, CreditCard, Activity } from "lucide-react";
import { toast, Toaster } from "sonner";
import AdminOverviewTab from "./components/AdminOverviewTab";
import AdminUsersTab from "./components/AdminUsersTab";
import AdminBillingTab from "./components/AdminBillingTab";
import AdminAuditTab from "./components/AdminAuditTab";

export default function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.pathname = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/me", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          const roleName = data.role?.name;

          // Route Guard: only permit admin role
          if (roleName !== "admin") {
            window.location.pathname = "/dashboard";
            return;
          }

          setUserData(data);
        } else {
          sessionStorage.removeItem("token");
          window.location.pathname = "/login";
        }
      } catch (err) {
        setError("Gagal memuat data administrator.");
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
        await fetch("http://localhost:8000/api/logout", {
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
          <p className="text-sm text-muted-foreground">Memuat panel admin...</p>
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary/20">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col justify-between shadow-sm z-10 flex-shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold text-primary">smart<span className="text-[#f28c1f]">coop</span></span>
            <span className="text-[10px] font-medium text-red-500 tracking-[0.2em] uppercase ml-0.5 mt-1">admin panel</span>
          </div>

          {/* Nav links */}
          <nav className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Management</p>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-left leading-tight ${activeTab === "overview" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" /> 
              <span>System Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-left leading-tight ${activeTab === "users" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Users className="h-4 w-4 flex-shrink-0" /> 
              <span>Users & Roles</span>
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-left leading-tight ${activeTab === "billing" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <CreditCard className="h-4 w-4 flex-shrink-0" /> 
              <span>Billing & Plans</span>
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-left leading-tight ${activeTab === "audit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Activity className="h-4 w-4 flex-shrink-0" /> 
              <span>Audit Log</span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-border">
            <div className="h-9 w-9 rounded-full bg-red-500/10 flex flex-shrink-0 items-center justify-center text-red-500 font-bold uppercase">
              {userData?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{userData?.name}</p>
              <p className="text-xs text-muted-foreground truncate">Platform Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && <AdminOverviewTab />}
          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "billing" && <AdminBillingTab />}
          {activeTab === "audit" && <AdminAuditTab />}
        </div>
      </main>
    </div>
  );
}
