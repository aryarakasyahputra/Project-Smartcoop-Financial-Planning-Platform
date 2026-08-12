import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  LogOut, Building, LayoutDashboard, LineChart as LineChartIcon, Users, 
  RefreshCw, Globe
} from "lucide-react";

import FounderOverviewTab from "./components/FounderOverviewTab";
import FounderProjectionsTab from "./components/FounderProjectionsTab";
import FounderTeamTab from "./components/FounderTeamTab";

import { toast } from "sonner";
import { simulateProjections, formatRupiah } from "../cfo/utils/financialModel";
import { useValuationModel } from "../cfo/utils/valuationHelper";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function getScenarioAssumptions(baseAssumptions, scenario) {
  if (scenario === "base") return baseAssumptions;
  
  const modified = {};
  const years = [2025, 2026, 2027, 2028, 2029];
  
  years.forEach(year => {
    const a = baseAssumptions[year] || {};
    modified[year] = { ...a };
    
    if (scenario === "optimistic") {
      if (a.new_coops_acquired !== undefined) {
        modified[year].new_coops_acquired = Math.round(a.new_coops_acquired * 1.20);
      }
      if (a.monthly_churn_rate !== undefined) {
        modified[year].monthly_churn_rate = a.monthly_churn_rate * 0.8;
      }
      if (a.monthly_subscription_fee !== undefined) {
        modified[year].monthly_subscription_fee = Math.round(a.monthly_subscription_fee * 1.10);
      }
      if (a.setup_fee !== undefined) {
        modified[year].setup_fee = Math.round(a.setup_fee * 1.10);
      }
    } else if (scenario === "pessimistic") {
      if (a.new_coops_acquired !== undefined) {
        modified[year].new_coops_acquired = Math.round(a.new_coops_acquired * 0.80);
      }
      if (a.monthly_churn_rate !== undefined) {
        modified[year].monthly_churn_rate = a.monthly_churn_rate * 1.25;
      }
      if (a.monthly_subscription_fee !== undefined) {
        modified[year].monthly_subscription_fee = Math.round(a.monthly_subscription_fee * 0.90);
      }
      if (a.setup_fee !== undefined) {
        modified[year].setup_fee = Math.round(a.setup_fee * 0.90);
      }
    }
  });
  
  return modified;
}

export default function FounderDashboard({ userData, handleLogout }) {
  const { language, setLanguage, t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const formatRupiah = formatCurrency;
  const [activeTab, setActiveTab] = useState("overview");
  const [activeScenario, setActiveScenario] = useState("base");
  const [chartMetric, setChartMetric] = useState("revenue");
  
  const [baseAssumptions, setBaseAssumptions] = useState({});
  const [projectionData, setProjectionData] = useState([]);
  const [loadingProjections, setLoadingProjections] = useState(true);
  const [hoveredYear, setHoveredYear] = useState(null);

  // Members & Invitations State
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("3");
  const [inviting, setInviting] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deletingMember, setDeletingMember] = useState(false);
  const maxSeats = 5;

  const companyAccess = userData?.company_accesses?.[0];
  const primaryCompany = companyAccess?.company;
  const projectId = primaryCompany?.projects?.[0]?.id || primaryCompany?.id;

  const getToken = () => sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");

  // Fetch Base Assumptions
  useEffect(() => {
    async function fetchAssumptions() {
      if (!projectId) return;
      try {
        setLoadingProjections(true);
        const token = getToken();
        const res = await fetch(`/api/projects/${projectId}/assumptions`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        const json = await res.json();
        const rawList = json.assumptions || json.data || [];
        if (rawList && Array.isArray(rawList) && rawList.length > 0) {
          const formatted = {};
          rawList.forEach(item => {
            const parsedItem = {};
            for (const key in item) {
              if (typeof item[key] === 'string' && !isNaN(item[key]) && item[key].trim() !== '') {
                parsedItem[key] = Number(item[key]);
              } else {
                parsedItem[key] = item[key];
              }
            }
            formatted[item.year] = parsedItem;
          });
          setBaseAssumptions(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch assumptions:", err);
      } finally {
        setLoadingProjections(false);
      }
    }
    fetchAssumptions();
  }, [projectId]);

  // Base Projections (matching CFO Dashboard)
  const baseProjections = useMemo(() => {
    if (Object.keys(baseAssumptions).length > 0) {
      return simulateProjections(baseAssumptions);
    }
    return [];
  }, [baseAssumptions]);

  // Recalculate Projections on Scenario or Base Assumptions Change for charts
  useEffect(() => {
    if (Object.keys(baseAssumptions).length > 0) {
      const scenarioAssumptions = getScenarioAssumptions(baseAssumptions, activeScenario);
      const computed = simulateProjections(scenarioAssumptions);
      setProjectionData(computed);
    }
  }, [baseAssumptions, activeScenario]);

  // Valuation Hook uses baseProjections to align Exit ROI with CFO Section 10
  const valuation = useValuationModel(baseProjections);

  // Fetch Members & Pending Invitations
  const fetchMembersAndInvitations = useCallback(async () => {
    if (!primaryCompany?.id) return;
    const token = getToken();
    
    // Fetch Members
    try {
      setLoadingMembers(true);
      const res = await fetch(`/api/companies/${primaryCompany.id}/members`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      const list = json.members || json.data || (Array.isArray(json) ? json : []);
      setMembers(list);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoadingMembers(false);
    }

    // Fetch Invitations
    try {
      setLoadingInvitations(true);
      const res = await fetch(`/api/companies/${primaryCompany.id}/invitations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      const list = json.invitations || json.data || (Array.isArray(json) ? json : []);
      setPendingInvitations(list.filter(inv => inv.status === 'pending'));
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    } finally {
      setLoadingInvitations(false);
    }
  }, [primaryCompany?.id]);

  useEffect(() => {
    fetchMembersAndInvitations();
  }, [fetchMembersAndInvitations]);

  // Invite Handler
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!primaryCompany?.id) return;
    
    if (members.length + pendingInvitations.length >= maxSeats) {
      toast.error(language === "en" ? "Team License Limit Reached!" : "Batas Lisensi Tim Tercapai!", {
        description: language === "en" ? `You have used all ${maxSeats} team license seats.` : `Anda telah menggunakan seluruh ${maxSeats} kuota lisensi tim.`
      });
      return;
    }

    try {
      setInviting(true);
      const token = getToken();
      const res = await fetch(`/api/invitations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: inviteEmail,
          role_id: parseInt(inviteRole, 10),
          company_id: primaryCompany.id
        })
      });
      const json = await res.json();
      if (res.ok || json.invitation || json.success) {
        toast.success(language === "en" ? "Invitation Sent Successfully!" : "Undangan Berhasil Dikirim!", {
          description: json.message || (language === "en" ? `Invitation link sent to ${inviteEmail}` : `Link undangan telah dikirimkan ke ${inviteEmail}`)
        });
        setInviteEmail("");
        fetchMembersAndInvitations();
      } else {
        toast.error(language === "en" ? "Failed to Send Invitation" : "Gagal Mengirim Undangan", {
          description: json.message || (language === "en" ? "Email already invited or server error occurred." : "Email sudah diundang atau terjadi kesalahan server.")
        });
      }
    } catch (err) {
      console.error("Failed to invite:", err);
      toast.error(language === "en" ? "Server Error Occurred" : "Terjadi Kesalahan Server");
    } finally {
      setInviting(false);
    }
  };

  // Resend Invitation Handler
  const handleResendInvitation = async (invitationId) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      if (res.ok || json.success) {
        toast.success(language === "en" ? "Invitation Resent!" : "Undangan Dikirim Ulang!", { description: json.message });
      } else {
        toast.error(language === "en" ? "Failed to Resend" : "Gagal Mengirim Ulang", { description: json.message });
      }
    } catch (err) {
      console.error("Failed to resend invitation:", err);
      toast.error(language === "en" ? "Server connection error." : "Kesalahan koneksi server.");
    }
  };

  // Cancel Invitation Handler
  const handleCancelInvitation = async (invitationId) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      if (res.ok || json.success) {
        toast.success(language === "en" ? "Invitation Cancelled!" : "Undangan Dibatalkan!", { description: json.message });
        fetchMembersAndInvitations();
      } else {
        toast.error(language === "en" ? "Failed to Cancel" : "Gagal Membatalkan", { description: json.message });
      }
    } catch (err) {
      console.error("Failed to cancel invitation:", err);
      toast.error(language === "en" ? "Server connection error." : "Kesalahan koneksi server.");
    }
  };

  // Remove Member Handler
  const confirmRemoveMember = async () => {
    if (!memberToDelete || !primaryCompany?.id) return;
    try {
      setDeletingMember(true);
      const token = getToken();
      const res = await fetch(`/api/companies/${primaryCompany.id}/members/${memberToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      if (res.ok || json.success) {
        toast.success(language === "en" ? "Member Access Removed" : "Akses Anggota Dihapus", { description: json.message });
        setMemberToDelete(null);
        fetchMembersAndInvitations();
      } else {
        toast.error(language === "en" ? "Failed to Remove Access" : "Gagal Menghapus Akses", { description: json.message });
      }
    } catch (err) {
      console.error("Failed to delete member:", err);
      toast.error(language === "en" ? "Server connection error." : "Terjadi kesalahan koneksi server.");
    } finally {
      setDeletingMember(false);
    }
  };

  // 2029 Data Calculation for KPI Cards
  const data2029 = useMemo(() => {
    if (!projectionData || projectionData.length === 0) return {};
    return projectionData[projectionData.length - 1] || {};
  }, [projectionData]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    return projectionData.map(d => ({
      year: d.year,
      revenueB: Number((d.totalRevenue / 1_000_000_000).toFixed(2)),
      arrB: Number((d.arr / 1_000_000_000).toFixed(2)),
      ebitdaB: Number((d.ebitda / 1_000_000_000).toFixed(2)),
      endingCashB: Number((d.endingCash / 1_000_000_000).toFixed(2)),
      endingCoops: d.endingCoops
    }));
  }, [projectionData]);

  // Highlight column helper
  const getColHighlightClass = (year) => {
    return "";
  };

  // Exit Val calculations based on scenario
  const activeExitVal = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.exitValOpt || 0;
    if (activeScenario === "pessimistic") return valuation.exitValCons || 0;
    return valuation.exitValBase || 0; // Base case
  }, [activeScenario, valuation]);

  const activeMOIC = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.moicOpt || 0;
    if (activeScenario === "pessimistic") return valuation.moicCons || 0;
    return valuation.moicBase || 0;
  }, [activeScenario, valuation]);

  const activeIRR = useMemo(() => {
    if (activeScenario === "optimistic") return valuation.irrOpt || 0;
    if (activeScenario === "pessimistic") return valuation.irrCons || 0;
    return valuation.irrBase || 0;
  }, [activeScenario, valuation]);

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* Ocean Blue Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#003d6b] via-[#005fa4] to-[#002d50] text-white flex flex-col justify-between p-6 shrink-0 shadow-2xl relative z-20">
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex flex-col items-start leading-none group pt-1">
            <span className="text-[24px] font-extrabold text-white tracking-tight flex items-center">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[8.5px] font-bold text-blue-200/80 tracking-[0.22em] uppercase mt-1">
              FOUNDER PANEL
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <LayoutDashboard className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "overview" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} />
                <span className="truncate text-xs sm:text-sm">
                  {language === "en" ? "Workspace Overview" : "Ringkasan Workspace"}
                </span>
              </div>
              {activeTab === "overview" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>

            <button 
              onClick={() => setActiveTab("projections")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "projections" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <LineChartIcon className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "projections" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} />
                <span className="truncate text-xs sm:text-sm">
                  {language === "en" ? "Financial Projections" : "Proyeksi Keuangan"}
                </span>
              </div>
              {activeTab === "projections" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>

            <button 
              onClick={() => setActiveTab("team")}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border-l-4 transition-all duration-200 cursor-pointer ${
                activeTab === "team" 
                  ? "bg-white/15 backdrop-blur-md text-white font-bold border-[#FFD700] shadow-md shadow-black/10" 
                  : "border-transparent text-blue-100/75 hover:bg-white/10 hover:text-white font-semibold"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Users className={`h-4 w-4 shrink-0 transition-colors ${activeTab === "team" ? "text-[#FFD700]" : "text-blue-200/60 group-hover:text-white"}`} />
                <span className="truncate text-xs sm:text-sm">
                  {language === "en" ? "Team Management" : "Manajemen Tim"}
                </span>
              </div>
              {activeTab === "team" && <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-2xs shrink-0 ml-1" />}
            </button>
          </nav>
        </div>

        {/* Profile Info & Logout */}
        <div className="mt-8 pt-6 border-t border-white/15 space-y-4">
          {/* Currency & Language Switcher */}
          <div className="flex items-center gap-2">
            <CurrencySwitcher variant="sidebar" />
            <LanguageSwitcher variant="sidebar" />
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-[#FFD700] text-[#003d6b] flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
              {userData?.name?.charAt(0).toUpperCase() || "F"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userData?.name}</p>
              <p className="text-[10px] font-bold text-[#FFD700] capitalize flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> Founder (Owner)
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-black/20 transition-all duration-200 cursor-pointer border-none"
          >
            <LogOut className="h-4 w-4 text-white" /> 
            <span>{language === "en" ? "Logout" : "Keluar"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        {/* Header */}
        <header id="overview" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "overview" 
                ? (language === "en" ? "Founder Workspace" : "Founder Workspace") 
                : activeTab === "projections" 
                  ? (language === "en" ? "Financial Projection Model" : "Model Proyeksi Keuangan") 
                  : (language === "en" ? "Team Management" : "Manajemen Tim")
              }
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" 
                ? (language === "en" ? "Manage your company, growth scenarios, and operations." : "Kelola perusahaan, skenario pertumbuhan, dan operasional Anda.") 
                : activeTab === "projections" 
                  ? (language === "en" ? "Comprehensive P&L projections based on CFO assumptions." : "Proyeksi laba rugi komprehensif berdasarkan asumsi yang telah diatur oleh tim CFO.") 
                  : (language === "en" ? "Manage team members and their workspace access permissions." : "Kelola anggota tim dan hak akses mereka pada workspace Anda.")
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {primaryCompany && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl shadow-2xs">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{primaryCompany.name}</span>
              </div>
            )}
          </div>
        </header>

        {activeTab === "overview" && (
          <FounderOverviewTab
            activeScenario={activeScenario}
            setActiveScenario={setActiveScenario}
            data2029={data2029}
            valuation={valuation}
            activeExitVal={activeExitVal}
            activeMOIC={activeMOIC}
            activeIRR={activeIRR}
            chartMetric={chartMetric}
            setChartMetric={setChartMetric}
            chartData={chartData}
            projectionData={projectionData}
            hoveredYear={hoveredYear}
            setHoveredYear={setHoveredYear}
            getColHighlightClass={getColHighlightClass}
          />
        )}

        {activeTab === "projections" && (
          <FounderProjectionsTab
            loadingProjections={loadingProjections}
            projectionData={projectionData}
            formatRupiah={formatRupiah}
            valuation={valuation}
          />
        )}

        {activeTab === "team" && (
          <FounderTeamTab
            members={members}
            pendingInvitations={pendingInvitations}
            maxSeats={maxSeats}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteRole={inviteRole}
            setInviteRole={setInviteRole}
            inviting={inviting}
            handleInviteSubmit={handleInviteSubmit}
            primaryCompany={primaryCompany}
            loadingMembers={loadingMembers}
            setMemberToDelete={setMemberToDelete}
            userData={userData}
            loadingInvitations={loadingInvitations}
            handleResendInvitation={handleResendInvitation}
            handleCancelInvitation={handleCancelInvitation}
            memberToDelete={memberToDelete}
            deletingMember={deletingMember}
            confirmRemoveMember={confirmRemoveMember}
          />
        )}
      </main>
    </div>
  );
}
