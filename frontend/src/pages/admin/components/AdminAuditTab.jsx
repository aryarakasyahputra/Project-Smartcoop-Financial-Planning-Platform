import React, { useState, useEffect } from "react";
import { Activity, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuditTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/admin/activity-logs", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        toast.error("Gagal memuat log aktivitas");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat Audit Trail...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Audit Trail & Log Aktivitas</h2>
          <p className="text-sm text-muted-foreground">Lacak histori perubahan penting dan aktivitas keamanan di dalam platform.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Activity className="h-10 w-10 mb-3 opacity-20" />
            <p>Belum ada catatan log aktivitas saat ini.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Waktu</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Pengguna</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Tindakan (Action)</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Detail Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {log.user ? log.user.name : <span className="italic text-muted-foreground">Sistem</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 bg-muted rounded-md text-xs font-mono text-muted-foreground">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {log.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
