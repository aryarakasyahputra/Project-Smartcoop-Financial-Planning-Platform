import React, { useState, useEffect } from "react";
import { Building, CreditCard, Clock, CheckCircle, Search, Users, FileText, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminBillingTab() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/admin/companies", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      } else {
        toast.error("Gagal memuat data perusahaan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (companyId, newStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`/api/admin/companies/${companyId}/subscription`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ subscription_status: newStatus })
      });
      if (res.ok) {
        toast.success("Paket berlangganan berhasil diperbarui");
        fetchCompanies();
      } else {
        toast.error("Gagal memperbarui paket");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data tagihan & perusahaan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Langganan & Tagihan</h2>
          <p className="text-sm text-muted-foreground">Atur paket lisensi (Trial, Pro, Enterprise) untuk setiap perusahaan.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Nama Perusahaan</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Total Proyek</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Status Paket</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Ubah Paket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map(company => (
              <tr key={company.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{company.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{company.projects_count} Proyek</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    company.subscription_status === 'pro' ? 'bg-[#FFD700]/10 text-[#B8860B] border border-[#FFD700]/20' :
                    company.subscription_status === 'enterprise' ? 'bg-primary/10 text-primary border border-primary/20' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {company.subscription_status === 'pro' && <CheckCircle className="h-3 w-3" />}
                    {company.subscription_status || 'trial'}
                  </span>
                  {company.subscription_ends_at && (
                    <p className="text-[10px] text-muted-foreground mt-1">Berakhir: {new Date(company.subscription_ends_at).toLocaleDateString()}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={company.subscription_status || 'trial'}
                    onChange={(e) => handleUpdateSubscription(company.id, e.target.value)}
                    className="bg-transparent border border-border rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="trial">Trial (Gratis)</option>
                    <option value="pro">Pro Plan</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
