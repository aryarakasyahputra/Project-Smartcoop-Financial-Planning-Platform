import React from "react";
import heroBg from "./assets/hero.png";
import {
  ArrowRight, BarChart3, Building2, Users, Calculator, TrendingUp,
  Wallet, LineChart, Target, PieChart, LayoutDashboard, Sparkles,
  CheckCircle2,
} from "lucide-react";

const modules = [
  { icon: Building2, title: "Company Profile", desc: "Informasi perusahaan, cap table, struktur organisasi, produk & layanan." },
  { icon: Calculator, title: "Assumption Engine", desc: "Pusat konfigurasi seluruh asumsi bisnis — harga, growth, churn, payroll." },
  { icon: Users, title: "Customer Growth Engine", desc: "Beginning, new, churn, ending customer — dihitung otomatis." },
  { icon: TrendingUp, title: "Revenue Engine", desc: "Subscription, setup fee, white label, academy, PPOB, AI Agent, marketplace." },
  { icon: Wallet, title: "Cost Engine", desc: "COGS, operating expenses, payroll, marketing, G&A — end to end." },
  { icon: LineChart, title: "Financial Statement", desc: "Revenue, gross profit, EBITDA, cash flow, BEP, profitability." },
  { icon: BarChart3, title: "SaaS Metrics", desc: "MRR, ARR, ARPU, CAC, LTV, NRR, burn rate, runway, Rule of 40." },
  { icon: PieChart, title: "Valuation Engine", desc: "Revenue & ARR multiple, DCF, comparable, enterprise & post-money." },
  { icon: Target, title: "Fundraising Engine", desc: "Investment needed, use of funds, dilution, MOIC, IRR, exit value." },
  { icon: LayoutDashboard, title: "Executive Dashboard", desc: "Seluruh KPI perusahaan dalam dashboard interaktif real-time." },
];

const benefits = [
  { role: "Founder", items: ["Keputusan berbasis data", "Estimasi pendanaan akurat", "Simulasi pertumbuhan", "Strategi ekspansi"] },
  { role: "CFO", items: ["Budget tahunan cepat", "Financial projection presisi", "Monitoring KPI", "Sumber data tunggal"] },
  { role: "Investor", items: ["Pahami kondisi cepat", "Proyeksi pertumbuhan", "Analisis valuasi", "Hitung potensi ROI"] },
];

const roadmap = [
  { phase: "Phase 1", items: ["Business Planning", "Financial Projection", "Dashboard"] },
  { phase: "Phase 2", items: ["Valuation", "Fundraising", "Cap Table"] },
  { phase: "Phase 3", items: ["Scenario Simulation", "AI Recommendation", "Business Health Score"] },
  { phase: "Phase 4", items: ["Board Meeting Dashboard", "Investor Portal", "Digital Data Room"] },
];

const driverChain = ["Customer", "Subscription", "Revenue", "Gross Margin", "EBITDA", "Cash Flow", "Valuation", "ROI"];

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-display font-bold text-2xl tracking-tight lowercase">
            <span style={{ color: "#2b6cb8" }}>smart</span><span style={{ color: "#f28c1f" }}>coop</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#modules" className="hover:text-foreground transition-colors">Modul</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Manfaat</a>
            <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
            <a href="#vision" className="hover:text-foreground transition-colors">Visi</a>
          </nav>
          <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            Request Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" width={1920} height={1280} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-background) 85%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs text-accent-foreground mb-8">
            <Sparkles className="h-3 w-3" /> Driver-Based Financial Modeling
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] max-w-4xl text-foreground">
            Business Operating System untuk <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>perencanaan & fundraising</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Susun business plan, proyeksi keuangan, valuasi, dan strategi fundraising dalam satu platform terintegrasi. Ubah satu asumsi — seluruh laporan diperbarui otomatis.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all" style={{ boxShadow: "var(--shadow-glow)" }}>
              Mulai Sekarang <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#modules" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              Lihat Modul
            </a>
          </div>

          {/* Driver chain */}
          <div className="mt-20 p-6 rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Alur Driver-Based Model</div>
            <div className="flex flex-wrap items-center gap-2">
              {driverChain.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">{step}</div>
                  {i < driverChain.length - 1 && <ArrowRight className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "10+", l: "Modul Terintegrasi" },
            { v: "4", l: "Roadmap Phase" },
            { v: "Real-time", l: "Auto Recalculation" },
            { v: "1", l: "Sumber Data Tunggal" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-primary font-medium mb-3">Modul Utama</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Sepuluh mesin yang saling terhubung</h2>
          <p className="mt-4 text-muted-foreground">Dari input asumsi hingga investor return — setiap perubahan mengalir otomatis ke seluruh laporan.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <div key={m.title} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all" style={{ background: "var(--gradient-card)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="text-xs text-muted-foreground font-mono">0{i + 1}</div>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl mb-14">
            <div className="text-sm text-primary font-medium mb-3">Manfaat</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Satu platform, tiga sudut pandang</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.role} className="p-8 rounded-2xl border border-border bg-card" style={{ background: "var(--gradient-card)" }}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Bagi</div>
                <h3 className="font-display text-2xl font-bold mb-6 text-foreground">{b.role}</h3>
                <ul className="space-y-3">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-primary font-medium mb-3">Roadmap</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Peta pengembangan</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.map((r, i) => (
            <div key={r.phase} className="p-6 rounded-2xl border border-border bg-card relative overflow-hidden" style={{ background: "var(--gradient-card)" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--gradient-primary)", opacity: 1 - i * 0.2 }} />
              <div className="font-mono text-xs text-primary mb-2">{r.phase}</div>
              <ul className="space-y-2 mt-4">
                {r.items.map((it) => (
                  <li key={it} className="text-sm text-muted-foreground">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Vision / CTA */}
      <section id="vision" className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="text-sm text-primary font-medium mb-3">Visi Produk</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] text-foreground">
            Platform Business Planning & <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fundraising Intelligence</span> pertama di Indonesia
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Membantu startup, koperasi, UMKM, hingga perusahaan menengah menyusun strategi pertumbuhan dan mempersiapkan investasi secara profesional.
          </p>
          <div id="cta" className="mt-12 p-10 rounded-3xl border border-border bg-card" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">Siap membangun financial model Anda?</h3>
            <p className="mt-3 text-muted-foreground">Jadwalkan demo dan lihat bagaimana Smartcoop mengubah spreadsheet menjadi keputusan.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity" style={{ boxShadow: "var(--shadow-glow)" }}>
                Request Demo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
                Hubungi Tim
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg lowercase">
              <span style={{ color: "#2b6cb8" }}>smart</span><span style={{ color: "#f28c1f" }}>coop</span>
            </span>
            <span>© 2026</span>
          </div>
          <div>Powered by 4VM Digital Lab</div>
        </div>
      </footer>
    </div>
  );
}
