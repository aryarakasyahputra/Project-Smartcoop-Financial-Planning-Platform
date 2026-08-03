import React, { useState, useEffect } from "react";
import { Users, Building, FileText, CheckCircle, Server } from "lucide-react";
import { toast } from "sonner";

export default function AdminOverviewTab() {
  const [stats, setStats] = useState({
    total_users: 0,
    active_companies: 0,
    active_projects: 0,
    system_status: "Checking..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/admin/stats", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error("Gagal memuat statistik platform");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat ringkasan sistem...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Admin Console</h1>
        <p className="text-muted-foreground mt-1">Kelola lisensi, pengguna, dan pantau kesehatan platform Smartcoop.</p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mt-4">{stats.total_users}</h3>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Active Companies</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mt-4">{stats.active_companies}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-orange-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-orange-500 font-semibold uppercase tracking-wider">Total Projects</span>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mt-4">{stats.active_projects}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-green-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-green-500 font-semibold uppercase tracking-wider">System Status</span>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mt-4 text-green-500 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            {stats.system_status}
          </h3>
        </div>
      </div>

      {/* Quick Tips */}
      <section className="bg-muted/30 rounded-2xl border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold">Panduan Administrator</h2>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>Gunakan menu navigasi di sebelah kiri untuk mengelola berbagai aspek sistem.</p>
          <ul className="list-disc pl-5 mt-2">
            <li className="mt-2"><strong className="text-foreground">Users & Roles:</strong> Memblokir pengguna bermasalah atau mereset hak akses perusahaan.</li>
            <li className="mt-1"><strong className="text-foreground">Billing & Plans:</strong> Meningkatkan akun perusahaan dari Trial (Gratis) menjadi lisensi Pro/Enterprise.</li>
            <li className="mt-1"><strong className="text-foreground">Audit Log:</strong> Memantau jejak rekam perubahan yang terjadi di dalam platform oleh semua user.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
