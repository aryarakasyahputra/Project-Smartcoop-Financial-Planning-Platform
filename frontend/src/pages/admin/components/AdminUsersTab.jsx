import React, { useState, useEffect } from "react";
import { Users, Shield, MoreVertical, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Gagal memuat daftar pengguna");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!confirm("Apakah Anda yakin ingin menangguhkan pengguna ini?")) return;
    
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        toast.success("Status pengguna berhasil diperbarui");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Gagal memperbarui status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data pengguna...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Manajemen Pengguna</h2>
          <p className="text-sm text-muted-foreground">Kelola semua akun pengguna yang terdaftar di platform.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Pengguna</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Perusahaan</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Role</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.company_accesses && user.company_accesses.length > 0 ? (
                    <span className="font-medium">{user.company_accesses[0].company.name}</span>
                  ) : (
                    <span className="text-muted-foreground italic">Belum terhubung</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                    user.role?.name === 'admin' ? 'bg-red-500/10 text-red-500' :
                    user.role?.name === 'founder' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {user.role?.name || 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleSuspend(user.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Suspend User"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
