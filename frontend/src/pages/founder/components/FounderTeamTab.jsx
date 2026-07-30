import React from "react";
import { 
  Users, UserPlus, Mail, ShieldCheck, Check, Eye, RefreshCw, Send, Building, 
  Database, Activity, Shield, Trash2, Clock, RotateCw, Ban, Inbox, AlertTriangle, X 
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function FounderTeamTab({
  members,
  pendingInvitations,
  maxSeats,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviting,
  handleInviteSubmit,
  primaryCompany,
  loadingMembers,
  setMemberToDelete,
  userData,
  loadingInvitations,
  handleResendInvitation,
  handleCancelInvitation,
  memberToDelete,
  deletingMember,
  confirmRemoveMember
}) {
  const { language } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Team Seat Usage & Plan Banner */}
      <section className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#005fa4] to-blue-600 text-white flex items-center justify-center shadow-md shadow-[#005fa4]/20 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === "en" ? "Team License Seats Usage" : "Penggunaan Kuota Lisensi Tim"}
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#005fa4] dark:text-blue-300 rounded-full border border-blue-200/60">
                  Pro Plan
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "en"
                  ? `${members.length} Active Members + ${pendingInvitations.length} Pending Invitations out of ${maxSeats} Max Seats`
                  : `${members.length} Anggota Aktif + ${pendingInvitations.length} Undangan Pending dari ${maxSeats} Kuota Batas`
                }
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">
                {language === "en" ? "Total Used" : "Total Terpakai"}
              </span>
              <span className="text-[#005fa4] font-mono">{members.length + pendingInvitations.length} / {maxSeats} Seats</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-[#005fa4] via-blue-500 to-[#FFD700] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((members.length + pendingInvitations.length) / maxSeats) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid (Invite widget + Company Status) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Invite Widget */}
        <section className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-slate-100/50 dark:shadow-none relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005fa4] via-blue-500 to-[#FFD700]" />
          
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#005fa4] to-[#004b82] text-white flex items-center justify-center shadow-lg shadow-[#005fa4]/20 shrink-0 ring-4 ring-[#005fa4]/10">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {language === "en" ? "Invite Team Collaborators" : "Undang Kolaborator Tim"}
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#005fa4]/10 dark:bg-blue-950/60 text-[#005fa4] dark:text-blue-400 rounded-full border border-[#005fa4]/20">
                  {language === "en" ? "Team Access" : "Akses Tim"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {language === "en"
                  ? "Grant direct access to your company workspace for CFOs or Investor Viewers."
                  : "Berikan akses ke workspace perusahaan Anda secara langsung untuk CFO atau Investor Viewer."
                }
              </p>
            </div>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#005fa4]" />
                {language === "en" ? "Recipient Email" : "Email Tujuan"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={language === "en" ? "e.g. cfo@company.com" : "misal: cfo@perusahaan.com"}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#005fa4] focus:ring-4 focus:ring-[#005fa4]/10 transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#005fa4]" />
                {language === "en" ? "Select Role Permission" : "Pilih Hak Akses Peran"}
              </label>
              
              <div className="grid grid-cols-1 gap-2.5">
                {/* Option 1: CFO / Finance */}
                <div 
                  onClick={() => setInviteRole("3")}
                  className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                    inviteRole === "3" 
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-[#005fa4] ring-2 ring-[#005fa4]/20 shadow-sm" 
                      : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                    inviteRole === "3" 
                      ? "bg-[#005fa4] text-white shadow-sm" 
                      : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-[#005fa4]"
                  }`}>
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Finance / CFO</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-[#005fa4] dark:text-blue-300">
                        {language === "en" ? "Full Edit Access" : "Akses Penuh Edit"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {language === "en" 
                        ? "Can edit projection assumptions, modify drivers, & view financials."
                        : "Dapat mengedit asumsi proyeksi, memodifikasi driver, & melihat finansial."
                      }
                    </p>
                  </div>
                  {inviteRole === "3" && (
                    <div className="h-5 w-5 rounded-full bg-[#005fa4] text-white flex items-center justify-center shrink-0 self-center">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Option 2: Investor Viewer */}
                <div 
                  onClick={() => setInviteRole("4")}
                  className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                    inviteRole === "4" 
                      ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-sm" 
                      : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                    inviteRole === "4" 
                      ? "bg-amber-500 text-white shadow-sm" 
                      : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-amber-500"
                  }`}>
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Investor Viewer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        {language === "en" ? "Read-Only Access" : "Hanya Baca (Read-Only)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {language === "en"
                        ? "Read-only permission to view reports, valuations & projection charts."
                        : "Hanya memiliki hak akses membaca laporan, valuasi & grafik proyeksi."
                      }
                    </p>
                  </div>
                  {inviteRole === "4" && (
                    <div className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 self-center">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={inviting || !inviteEmail || !inviteRole}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#005fa4] via-blue-600 to-[#005fa4] hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md shadow-[#005fa4]/20 hover:shadow-lg hover:shadow-[#005fa4]/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {inviting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> 
                  <span>{language === "en" ? "Sending Invitation..." : "Mengirim Undangan..."}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{language === "en" ? "Send Invitation Link" : "Kirim Link Undangan"}</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Team Members List */}
        <section className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-slate-100/50 dark:shadow-none relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005fa4] via-blue-500 to-[#FFD700]" />
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#005fa4]/10 rounded-xl flex items-center justify-center text-[#005fa4] shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === "en" ? "Team Members List" : "Daftar Anggota Tim"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === "en" ? "Manage users who have access to your company workspace." : "Kelola pengguna yang memiliki akses ke workspace perusahaan Anda."}
              </p>
            </div>
          </div>
          
          {loadingMembers ? (
             <div className="flex justify-center p-8">
               <div className="h-6 w-6 border-2 border-[#005fa4]/30 border-t-[#005fa4] rounded-full animate-spin"></div>
             </div>
          ) : members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{language === "en" ? "Name" : "Nama"}</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">{language === "en" ? "Role" : "Role"}</th>
                    <th className="px-4 py-3 font-semibold text-right">{language === "en" ? "Action" : "Aksi"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{member.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                      <td className="px-4 py-3 capitalize font-medium">{member.role?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-right">
                        {member.id !== userData?.id && member.role?.name !== 'founder' ? (
                          <button 
                            onClick={() => setMemberToDelete(member)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                            title={language === "en" ? "Remove Access" : "Hapus Akses"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Owner</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">
              {language === "en" ? "No other team members in this company yet." : "Belum ada anggota tim lain di perusahaan ini."}
            </p>
          )}
        </section>
      </div>

      {/* Pending Invitations Table */}
      <section className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-slate-100/50 dark:shadow-none relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === "en" ? "Pending Invitations" : "Undangan Menunggu Konfirmasi (Pending)"}
              </h2>
              {pendingInvitations.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full">
                  {pendingInvitations.length} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {language === "en"
                ? "List of email addresses invited but haven't completed registration/confirmation yet."
                : "Daftar email yang telah diundang tetapi belum menyelesaikan registrasi/konfirmasi."
              }
            </p>
          </div>
        </div>
        
        {loadingInvitations ? (
           <div className="flex justify-center p-8">
             <div className="h-6 w-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
           </div>
        ) : pendingInvitations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">{language === "en" ? "Recipient Email" : "Email Tujuan"}</th>
                  <th className="px-4 py-3 font-semibold">{language === "en" ? "Assigned Role" : "Role Diberikan"}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">{language === "en" ? "Date Sent" : "Tanggal Dikirim"}</th>
                  <th className="px-4 py-3 font-semibold text-right">{language === "en" ? "Action" : "Aksi"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingInvitations.map(inv => (
                  <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {inv.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#005fa4] dark:text-blue-300 border border-blue-200/60">
                        {inv.role?.name || "Member"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString(language === "en" ? "en-US" : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleResendInvitation(inv.id)}
                        className="px-2.5 py-1 text-xs font-bold text-[#005fa4] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title={language === "en" ? "Resend Invitation Link" : "Kirim Ulang Link Undangan"}
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>{language === "en" ? "Resend" : "Kirim Ulang"}</span>
                      </button>
                      <button 
                        onClick={() => handleCancelInvitation(inv.id)}
                        className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 rounded-lg border border-red-200/60 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title={language === "en" ? "Cancel Invitation" : "Batalkan Undangan"}
                      >
                        <Ban className="h-3 w-3" />
                        <span>{language === "en" ? "Cancel" : "Batalkan"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <Inbox className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs text-muted-foreground">
              {language === "en" ? "No pending invitations at this time." : "Tidak ada undangan yang sedang menunggu konfirmasi saat ini."}
            </p>
          </div>
        )}
      </section>

      {/* Custom Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-2xl max-w-md w-full p-6 md:p-7 shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
            
            <button 
              onClick={() => setMemberToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-800/60 shadow-xs shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === "en" ? "Remove Collaborator Access" : "Hapus Akses Kolaborator"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "en" 
                    ? "This action will revoke all user access permissions from your company workspace."
                    : "Tindakan ini akan mencabut seluruh hak akses pengguna dari workspace perusahaan Anda."
                  }
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#005fa4]/10 text-[#005fa4] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {memberToDelete.name?.[0] || memberToDelete.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {memberToDelete.name || (language === "en" ? "User" : "Pengguna")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {memberToDelete.email}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize shrink-0">
                {memberToDelete.role?.name || "Member"}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={deletingMember}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === "en" ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                onClick={confirmRemoveMember}
                disabled={deletingMember}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {deletingMember ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>{language === "en" ? "Removing..." : "Menghapus..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{language === "en" ? "Yes, Remove Access" : "Ya, Hapus Akses"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
