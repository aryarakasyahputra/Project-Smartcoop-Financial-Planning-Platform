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
        const res = await fetch("/api/me", {
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
      
      {/* Sidebar - Smartcoop Brand Blue Theme */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#003d6b] via-[#005fa4] to-[#002d50] text-white border-b md:border-b-0 md:border-r border-blue-900/40 flex flex-col justify-between shadow-xl z-10 flex-shrink-0 relative overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-start leading-none group pt-1">
            <span className="text-[24px] font-extrabold text-white tracking-tight flex items-center">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8.5px] font-bold text-blue-200/80 tracking-[0.22em] uppercase mt-1">
              ADMIN PANEL
            </span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-extrabold text-[#FFD700] uppercase tracking-wider mb-3 px-1">Management</p>
            <button
              onClick={() => setActiveTab("overview")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutDashboard className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "overview" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} /> 
                <span className="whitespace-nowrap truncate">System Overview</span>
              </div>
              {activeTab === "overview" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "users" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Users className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "users" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} /> 
                <span className="whitespace-nowrap truncate">Users & Roles</span>
              </div>
              {activeTab === "users" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "billing" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "billing" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} /> 
                <span className="whitespace-nowrap truncate">Billing & Plans</span>
              </div>
              {activeTab === "billing" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "audit" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Activity className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "audit" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} /> 
                <span className="whitespace-nowrap truncate">Audit Log</span>
              </div>
              {activeTab === "audit" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-white/15 space-y-4">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-[#FFD700] text-[#003d6b] flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
              {userData?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userData?.name}</p>
              <p className="text-[10px] font-bold text-[#FFD700] capitalize flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> Platform Admin
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-black/20 transition-all duration-200 cursor-pointer border-none"
          >
            <LogOut className="h-4 w-4 text-white" /> 
            <span>Keluar</span>
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
