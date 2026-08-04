import React, { useState, useEffect, useRef } from 'react';
import heroBg from "../../assets/hero.png";
import {
  ArrowRight, BarChart3, Building2, Users, Calculator, TrendingUp,
  Wallet, LineChart, Target, PieChart, LayoutDashboard, Sparkles,
  CheckCircle2,
} from "lucide-react";

const BRAND_BLUE = "#2b6cb8";
const BRAND_ORANGE = "#f28c1f";

const driverChain = ["Customer", "Subscription", "Revenue", "Gross Margin", "EBITDA", "Cash Flow", "Valuation", "ROI"];

const modules = [
  { icon: Building2, title: "Profil & Struktur", desc: "Atur informasi dasar perusahaan, cap table, dan susunan tim Anda dengan rapi.", tint: "blue" },
  { icon: Calculator, title: "Simulasi Skenario Bisnis", desc: "Atur asumsi harga, target pertumbuhan, hingga biaya operasional dengan mudah tanpa merusak rumus.", tint: "orange" },
  { icon: Users, title: "Proyeksi Pelanggan", desc: "Pantau otomatis pergerakan pelanggan baru, tingkat retensi, hingga metrik churn setiap bulannya.", tint: "blue" },
  { icon: TrendingUp, title: "Kalkulator Pendapatan", desc: "Hitung otomatis seluruh sumber pemasukan Anda, dari biaya langganan hingga layanan tambahan.", tint: "orange" },
  { icon: Wallet, title: "Manajemen Biaya", desc: "Lacak dan proyeksikan pengeluaran operasional (OPEX), gaji tim, hingga COGS secara end-to-end.", tint: "blue" },
  { icon: LineChart, title: "Laporan Keuangan Otomatis", desc: "Dapatkan laporan laba rugi, cash flow, dan titik impas (BEP) instan tanpa perlu repot menyusun jurnal manual.", tint: "orange" },
  { icon: BarChart3, title: "Metrik Kinerja Bisnis", desc: "Pantau kesehatan bisnis lewat indikator penting seperti MRR, CAC, LTV, dan Burn Rate secara real-time.", tint: "blue" },
  { icon: PieChart, title: "Estimasi Valuasi", desc: "Ketahui proyeksi nilai perusahaan Anda saat ini untuk persiapan negosiasi pendanaan dengan investor.", tint: "orange" },
  { icon: Target, title: "Strategi Pendanaan", desc: "Hitung kebutuhan investasi, alokasi dana, hingga estimasi pengembalian (ROI) untuk calon investor.", tint: "blue" },
  { icon: LayoutDashboard, title: "Dashboard Utama", desc: "Pantau seluruh ringkasan KPI perusahaan Anda dalam satu layar interaktif yang mudah dipahami.", tint: "orange" },
];

const benefits = [
  { role: "Founder", items: ["Keputusan berbasis data", "Estimasi pendanaan akurat", "Simulasi pertumbuhan", "Strategi ekspansi"], accent: "blue" },
  { role: "CFO", items: ["Budget tahunan cepat", "Financial projection presisi", "Monitoring KPI", "Sumber data tunggal"], accent: "orange" },
  { role: "Investor", items: ["Pahami kondisi cepat", "Proyeksi pertumbuhan", "Analisis valuasi", "Hitung potensi ROI"], accent: "blue" },
];

function tintStyles(tint) {
  return tint === "orange"
    ? { bg: "rgba(242, 140, 31, 0.10)", color: BRAND_ORANGE, border: "rgba(242, 140, 31, 0.25)" }
    : { bg: "rgba(43, 108, 184, 0.10)", color: BRAND_BLUE, border: "rgba(43, 108, 184, 0.25)" };
}

const ScrollReveal = ({ children, delay = 0 }) => {
  const [phase, setPhase] = useState("hidden-left"); // "hidden-left", "visible", "hidden-right"
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(timeoutRef.current);
          setPhase("visible");
        } else {
          // Element leaving the viewport -> fade out to the right
          setPhase("hidden-right");
          // After the exit animation finishes, silently snap it back to the left
          timeoutRef.current = setTimeout(() => {
            setPhase("hidden-left");
          }, 700 + delay * 1000);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  let translateX = "-40px";
  let opacity = 0;
  let hasTransition = true;

  if (phase === "visible") {
    translateX = "0px";
    opacity = 1;
  } else if (phase === "hidden-right") {
    translateX = "40px";
    opacity = 0;
  } else if (phase === "hidden-left") {
    translateX = "-40px";
    opacity = 0;
    hasTransition = false; // Snap without animation while invisible
  }

  return (
    <div
      ref={ref}
      style={{
        opacity,
        transform: `translate(${translateX}, 0px)`,
        transition: hasTransition ? `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` : 'none',
        height: '100%'
      }}
    >
      {children}
    </div>
  );
};

const FlipText = ({ text, delayOffset = 0, isGradient = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="inline-block [perspective:1000px]">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block ${isVisible ? 'animate-flip-letter' : 'opacity-0'} ${isGradient ? 'animate-gradient' : ''}`}
          style={{ 
            animationDelay: `${delayOffset + i * 0.04}s`,
            ...(isGradient ? {
              background: `linear-gradient(120deg, ${BRAND_BLUE}, ${BRAND_ORANGE}, ${BRAND_BLUE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            } : {})
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

const AnimatedStat = ({ statValue, label, color }) => {
  const [count, setCount] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const match = statValue.match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset animation when leaving view
          setIsVisible(false);
          setCount(1);
          setIsDone(false);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    if (targetNumber !== null && targetNumber > 1) {
      let startTimestamp = null;
      const duration = 1500; // 1.5 seconds animation
      
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const currentCount = Math.floor(easeProgress * (targetNumber - 1)) + 1;
        setCount(currentCount);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(targetNumber);
          setIsDone(true);
        }
      };
      window.requestAnimationFrame(step);
    } else {
      // For "Real-time" or "1" where we don't count up, just wait a bit then show label
      setCount(targetNumber !== null ? targetNumber : 0);
      const timer = setTimeout(() => {
        setIsDone(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, targetNumber]);

  return (
    <div ref={ref} className="transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
      <div className="font-display text-3xl md:text-4xl font-bold" style={{ color }}>
        {targetNumber !== null ? (
          <>
            {count}{isDone && suffix}
          </>
        ) : (
          <span>{statValue}</span>
        )}
      </div>
      <div 
        className={`text-sm text-muted-foreground mt-1 transition-all duration-700 ${isDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      >
        {label}
      </div>
    </div>
  );
};

const HeroMockup = () => {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      {/* Isometric Container */}
      <div
        className="relative group"
        style={{
          transform: 'perspective(1200px) rotateX(55deg) rotateZ(-40deg) scale(1.50)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Card 1: Executive Dashboard (Kartu Utama) */}
        <div className="absolute -top-32 -left-32 w-80 h-52 bg-white/90 backdrop-blur-md rounded-xl border border-white/40 shadow-[20px_20px_40px_rgba(0,0,0,0.15)] animate-float-card-1 transition-transform duration-500 group-hover:-translate-y-4 group-hover:shadow-[30px_30px_50px_rgba(0,0,0,0.2)]">
          <img src="/assets/dashboard-utama.png" className="w-full h-full object-cover rounded-xl" alt="Executive Dashboard" />
        </div>

        {/* Card 2: Financial Summary (Kartu Bawah - Agak ke Kiri) */}
        <div className="absolute top-8 -left-48 w-72 h-40 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-[15px_15px_30px_rgba(0,0,0,0.1)] animate-float-card-2">
          <img src="/assets/ringkasan-keuangan.png" className="w-full h-full object-cover rounded-xl" alt="Financial Summary" />
        </div>

        {/* Card 3: Valuation/Scenario (Kartu Kanan - Agak ke Atas) */}
        <div className="absolute -top-16 left-32 w-64 h-48 bg-white/85 backdrop-blur-sm rounded-xl border border-white/40 shadow-[25px_25px_45px_rgba(0,0,0,0.12)] animate-float-card-3">
          <img src="/assets/analisis-skenario.png" className="w-full h-full object-cover rounded-xl" alt="Scenario Analysis" />
        </div>

      </div>
    </div>
  );
};

export default function Landing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* TopNavBar */}
      <nav className="bg-[#faf8ff]/80 backdrop-blur-md border-b border-[#c1c7d3]/30 fixed top-0 left-0 z-50 h-20 w-full">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1280px] mx-auto h-full relative">
          <a href="#" className="flex flex-col leading-none">
            <span className="text-[32px] font-bold text-[#005fa4]">
              smart<span className="text-[#FFD700]">coop</span>
            </span>
            <span className="text-[12px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase ml-1">
              financial
            </span>
          </a>
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#modules">Modul</a>
            <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#benefits">Manfaat</a>
            <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#vision">Visi</a>
            <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/register" className="px-6 py-2 bg-[#005fa4] text-white rounded-full text-[14px] font-bold hover:opacity-90 active:scale-95 transition-all">
              Coba Gratis
            </a>
            <a href="/login" className="px-6 py-2 border border-[#005fa4] text-[#005fa4] rounded-full text-[14px] font-bold hover:bg-[#005fa4]/5 active:scale-95 transition-all">
              Login
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden min-h-screen pt-20 flex items-center bg-[#eaedff]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(at 0% 0%, rgb(210, 228, 255) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(255, 220, 196) 0px, transparent 50%), radial-gradient(at 100% 100%, rgb(161, 201, 255) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(226, 231, 255) 0px, transparent 50%)' }}></div>
          {/* Floating blobs */}
          <div className="absolute top-20 -right-20 h-96 w-96 rounded-full opacity-40 blur-3xl animate-blob"
            style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}55, transparent 70%)` }} />
          <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl animate-blob"
            style={{ background: `radial-gradient(circle, ${BRAND_BLUE}55, transparent 70%)`, animationDelay: "-7s" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, var(--color-background) 100%)" }} />
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs mb-8 animate-fade-up"
                  style={{ borderColor: "rgba(242, 140, 31, 0.35)", background: "rgba(242, 140, 31, 0.08)", color: "#c56d15" }}>
                  <Sparkles className="h-3 w-3" /> Driver-Based Financial Modeling
                </div>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#131b2e] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Business Operating System untuk{" "}
                  <span className="animate-gradient" style={{
                    background: `linear-gradient(120deg, ${BRAND_BLUE}, ${BRAND_ORANGE}, ${BRAND_BLUE})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    perencanaan &amp; fundraising
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  Susun business plan, proyeksi keuangan, valuasi, dan strategi fundraising dalam satu platform terintegrasi. Ubah satu asumsi — seluruh laporan diperbarui otomatis.
                </p>
                <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <a href="#cta" className="inline-flex items-center justify-center rounded-full text-white px-6 py-3 text-sm font-semibold hover:scale-[1.03] transition-transform animate-gradient"
                    style={{ background: `linear-gradient(120deg, ${BRAND_BLUE}, ${BRAND_ORANGE}, ${BRAND_BLUE})`, boxShadow: "var(--shadow-glow)" }}>
                    Mulai Sekarang
                  </a>
                  <a href="#modules" className="inline-flex items-center gap-2 rounded-full border-2 bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-[#2b6cb8]/40 transition-colors"
                    style={{ borderColor: "rgba(43, 108, 184, 0.2)" }}>
                    Lihat Modul
                  </a>
                </div>
              </div>

              {/* Right Column: Isometric 3D Mockup */}
              <div className="lg:col-span-5 hidden lg:flex justify-center relative w-full h-[500px]">
                <HeroMockup />
              </div>

            </div>


          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border" style={{ background: "var(--gradient-primary-soft)" }}>
          <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "10+", l: "Modul Terintegrasi", c: BRAND_BLUE },
              { v: "4", l: "Roadmap Phase", c: BRAND_ORANGE },
              { v: "Real-time", l: "Auto Recalculation", c: BRAND_BLUE },
              { v: "1", l: "Sumber Data Tunggal", c: BRAND_ORANGE },
            ].map((s, i) => (
              <AnimatedStat key={s.l} statValue={s.v} label={s.l} color={s.c} />
            ))}
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl mb-14">
            <div className="text-sm font-medium mb-3" style={{ color: BRAND_ORANGE }}>Modul Utama</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Sepuluh mesin yang saling terhubung</h2>
            <p className="mt-4 text-muted-foreground">Dari input asumsi hingga investor return — setiap perubahan mengalir otomatis ke seluruh laporan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => {
              const s = tintStyles(m.tint);
              const delay = (i % 3) * 0.15;
              return (
                <ScrollReveal key={m.title} delay={delay} direction="left">
                  <div className="h-full group p-6 rounded-2xl border bg-card card-lift hover:border-[#2b6cb8]/30 transition-all duration-300"
                    style={{ boxShadow: "var(--shadow-card)", borderColor: "rgba(43, 108, 184, 0.08)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                        style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                        <m.icon className="h-5 w-5" />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono font-semibold bg-[#faf8ff] px-2.5 py-1 rounded-full border border-border">{i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 text-[#131b2e] group-hover:text-[#005fa4] transition-colors duration-300">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl mb-14">
              <div className="text-sm font-medium mb-3" style={{ color: BRAND_BLUE }}>Manfaat</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Satu platform, tiga sudut pandang</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b) => {
                const color = b.accent === "orange" ? BRAND_ORANGE : BRAND_BLUE;
                return (
                  <div key={b.role} className="p-8 rounded-2xl border bg-card card-lift relative overflow-hidden"
                    style={{ boxShadow: "var(--shadow-card)", borderColor: "rgba(43, 108, 184, 0.08)" }}>
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Bagi</div>
                    <h3 className="font-display text-2xl font-bold mb-6" style={{ color }}>{b.role}</h3>
                    <ul className="space-y-3">
                      {b.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color }} />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision / CTA */}
        <section id="vision" className="border-t border-[#c1c7d3]/30">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center">
            <div className="text-sm text-[#2b6cb8] font-medium mb-3">Visi Produk</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] text-[#131b2e]">
              <FlipText text="Platform Business Planning & " delayOffset={0} />
              <FlipText text="Fundraising Intelligence" delayOffset={1.16} isGradient={true} />
              <br className="hidden md:block" />
              <FlipText text=" pertama di Indonesia" delayOffset={2.12} />
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Membantu startup, koperasi, UMKM, hingga perusahaan menengah menyusun strategi pertumbuhan dan mempersiapkan investasi secara profesional.
            </p>

            {/* Infinite Photo Marquee */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-16 mb-16 overflow-hidden flex group">
              {/* First block */}
              <div className="flex animate-marquee shrink-0 gap-6 pr-6 group-hover:[animation-play-state:paused]">
                <img src="/assets/foto1.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Financial Planning" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80"} />
                <img src="/assets/foto2.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Business Success" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1552581234-26160f608093?w=600&q=80"} />
                <img src="/assets/foto3.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Team Meeting" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"} />
              </div>
              {/* Second block (duplicate for endless loop) */}
              <div className="flex animate-marquee shrink-0 gap-6 pr-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
                <img src="/assets/foto1.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Financial Planning" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80"} />
                <img src="/assets/foto2.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Business Success" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1552581234-26160f608093?w=600&q=80"} />
                <img src="/assets/foto3.png" className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#c1c7d3]/40" alt="Team Meeting" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"} />
              </div>
            </div>

            <div id="cta" className="mt-12 p-10 rounded-3xl border border-[#c1c7d3]/30 bg-white" style={{ boxShadow: "0 20px 50px -20px rgba(0, 0, 0, 0.05)" }}>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#131b2e]">Siap membangun financial model Anda?</h3>
              <p className="mt-3 text-muted-foreground">Jadwalkan demo dan lihat bagaimana Smartcoop mengubah spreadsheet menjadi keputusan.</p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <a href="#" className="inline-flex items-center justify-center rounded-full text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity animate-gradient"
                  style={{ background: `linear-gradient(120deg, ${BRAND_BLUE}, ${BRAND_ORANGE}, ${BRAND_BLUE})`, boxShadow: "var(--shadow-glow)" }}>
                  Request Demo
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full border border-[#c1c7d3]/30 bg-white px-6 py-3 text-sm font-semibold text-[#131b2e] hover:bg-[#faf8ff] transition-colors">
                  Hubungi Tim
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & FAQ Wrapper to restore original font */}
        <div className="font-jakarta">
          {/* Pricing Grid Section with Original Hero Text and Mesh Background */}
          <section id="pricing" className="relative overflow-hidden py-24 border-t border-[#c1c7d3]/30 bg-[#eaedff]">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(at 0% 0%, rgb(210, 228, 255) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(255, 220, 196) 0px, transparent 50%), radial-gradient(at 100% 100%, rgb(161, 201, 255) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(226, 231, 255) 0px, transparent 50%)' }}></div>
            <div className="px-4 md:px-[1.5rem] max-w-[1280px] mx-auto relative z-10">
              <div className="text-center mb-[4rem]">
                <h2 className="text-[32px] md:text-[56px] font-bold text-[#131b2e] max-w-5xl mx-auto leading-[1.15] tracking-tight mb-10">
                  Rencanakan Pertumbuhan, Proyeksikan Keuangan, dan Siapkan Bisnis Anda untuk <span className="text-[#005fa4]">Investasi.</span>
                </h2>
                <h3 className="text-[20px] md:text-[24px] font-semibold text-[#131b2e]/70 mb-6 uppercase tracking-wider">Pilih Paket Sesuai Skala Bisnis</h3>
                {/* Toggle Yearly/Monthly */}
                <div className="flex items-center justify-center gap-4">
                  <span className="text-[14px] font-semibold text-[#414751]">Bulanan</span>
                  <button
                    className="relative w-14 h-8 bg-[#e2e7ff] rounded-full p-1 transition-colors duration-300 focus:outline-none border border-[#c1c7d3]"
                    onClick={() => setIsAnnual(!isAnnual)}
                  >
                    <div className={`w-6 h-6 bg-[#005fa4] rounded-full transition-transform duration-300 transform shadow-sm ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#131b2e]">Tahunan</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#924c00] text-[#ffffff] text-[12px] font-semibold">Hemat 20%</span>
                  </div>
                </div>
              </div>
              <div className="group grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
                {/* Starter */}
                <div className="pricing-card transition-all duration-500 group-hover:opacity-40 group-hover:blur-[2px] hover:!opacity-100 hover:!blur-none hover:-translate-y-3 hover:shadow-2xl hover:z-10 p-8 bg-[#ffffff] border border-[#c1c7d3]/50 rounded-xl flex flex-col h-full relative shadow-sm">
                  <div className="mb-8">
                    <h3 className="text-[32px] font-bold text-[#131b2e] mb-2">Starter</h3>
                    <p className="text-[#414751] text-[16px]">Untuk startup tahap awal (early-stage).</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[48px] font-bold text-[#131b2e] leading-[1.2]">Rp 0</span>
                      <span className="text-[#414751] text-[16px]">/bulan</span>
                    </div>
                    <p className="text-[#414751] text-[14px] font-semibold mt-1">Selamanya gratis.</p>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Basic financial modeling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">1 User account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Maksimal 1 Project/Financial Model</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Community support</span>
                    </li>
                    <li className="flex items-start gap-3 opacity-40">
                      <span className="material-symbols-outlined text-[#717782]">cancel</span>
                      <span className="text-[#414751] text-[16px]">Fundraising tracker</span>
                    </li>
                  </ul>
                  <a href="/register?plan=starter" className="w-full py-4 border border-[#005fa4] text-[#005fa4] rounded-lg text-[14px] font-bold hover:bg-[#005fa4]/5 transition-colors active:scale-95 block text-center">
                    Mulai Gratis
                  </a>
                </div>

                {/* Professional */}
                <div className="pricing-card transition-all duration-500 group-hover:opacity-40 group-hover:blur-[2px] hover:!opacity-100 hover:!blur-none hover:-translate-y-3 hover:shadow-2xl hover:z-10 p-8 bg-white border-2 border-[#005fa4] rounded-xl flex flex-col h-full relative shadow-xl">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#005fa4] text-[#ffffff] px-4 py-1 rounded-full text-[12px] font-bold">
                    PALING POPULER
                  </div>
                  <div className="mb-8">
                    <h3 className="text-[32px] font-bold text-[#131b2e] mb-2">Professional</h3>
                    <p className="text-[#414751] text-[16px]">Untuk perusahaan yang sedang berkembang.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[48px] font-bold text-[#131b2e] leading-[1.2]">
                        {isAnnual ? 'Rp 499k' : 'Rp 599k'}
                      </span>
                      <span className="text-[#414751] text-[16px]">/bulan</span>
                    </div>
                    <p className="text-[#414751] text-[14px] font-semibold mt-1">
                      {isAnnual ? 'Ditagih tahunan (Hemat Rp 1,2jt)' : 'Ditagih per bulan'}
                    </p>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#131b2e] text-[16px] font-bold">Advanced driver-based modeling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Hingga 5 User accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Priority email support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Fundraising tracker & CRM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Custom reporting exports</span>
                    </li>
                  </ul>
                  <a href="/register?plan=professional" className="w-full py-4 bg-[#005fa4] text-[#ffffff] rounded-lg text-[14px] font-bold shadow-lg shadow-[#005fa4]/20 hover:opacity-90 active:scale-95 transition-all text-center block">
                    Mulai Sekarang
                  </a>
                </div>

                {/* Enterprise */}
                <div className="pricing-card transition-all duration-500 group-hover:opacity-40 group-hover:blur-[2px] hover:!opacity-100 hover:!blur-none hover:-translate-y-3 hover:shadow-2xl hover:z-10 p-8 bg-[#ffffff] border border-[#c1c7d3]/50 rounded-xl flex flex-col h-full relative shadow-sm">
                  <div className="mb-8">
                    <h3 className="text-[32px] font-bold text-[#131b2e] mb-2">Enterprise</h3>
                    <p className="text-[#414751] text-[16px]">Untuk operasional skala besar.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[48px] font-bold text-[#131b2e] leading-[1.2]">Custom</span>
                    </div>
                    <p className="text-[#414751] text-[14px] font-semibold mt-1">Hubungi tim sales kami.</p>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Custom integrations (ERP/CRM)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Unlimited user accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Dedicated account manager</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">Full API access & Webhooks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005fa4] check-icon">check_circle</span>
                      <span className="text-[#414751] text-[16px]">SLA & On-premise options</span>
                    </li>
                  </ul>
                  <button className="w-full py-4 border border-[#131b2e] text-[#131b2e] rounded-lg text-[14px] font-bold hover:bg-[#131b2e]/5 transition-colors active:scale-95">
                    Hubungi Sales
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section 1 */}
          <section className="py-[5rem] bg-[#f2f4f6] border-t border-[#c1c7d3]/30">
            <div className="px-4 md:px-[1.5rem] max-w-4xl mx-auto">
              <div className="text-center mb-[3rem]">
                <h2 className="text-[32px] font-bold text-[#131b2e] mb-4">Pertanyaan yang Sering Diajukan</h2>
                <p className="text-[#414751] text-[16px]">Temukan jawaban atas pertanyaan umum mengenai layanan kami.</p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "Apakah saya bisa membatalkan langganan kapan saja?",
                    a: "Ya, Anda dapat membatalkan langganan Anda kapan saja melalui pengaturan akun. Akses ke fitur berbayar akan tetap aktif hingga akhir periode penagihan saat ini."
                  },
                  {
                    q: "Bagaimana cara kerja Driver-Based Financial Modeling?",
                    a: "Driver-Based Modeling menghubungkan variabel operasional bisnis Anda (seperti jumlah pelanggan atau biaya iklan) langsung ke proyeksi keuangan. Perubahan pada satu variabel akan secara otomatis memperbarui seluruh laporan laba rugi dan arus kas Anda."
                  },
                  {
                    q: "Apakah data keuangan saya aman?",
                    a: "Keamanan adalah prioritas kami. Kami menggunakan enkripsi AES-256 tingkat bank dan infrastruktur cloud yang tersertifikasi SOC2 to memastikan data finansial sensitif Anda tetap terlindungi dan privat."
                  },
                  {
                    q: "Apakah ada biaya tersembunyi?",
                    a: "Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar. Untuk paket Enterprise, biaya kustomisasi akan didiskusikan secara transparan di awal kontrak."
                  }
                ].map((faq, i) => (
                  <details key={i} className="group bg-[#faf8ff] rounded-xl border border-[#c1c7d3]/30 p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h4 className="text-[16px] font-bold text-[#131b2e]">{faq.q}</h4>
                      <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300">expand_more</span>
                    </summary>
                    <div className="mt-4 text-[#414751] text-[16px] leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="py-[5rem] px-4 relative overflow-hidden bg-[#005fa4]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
            <div className="max-w-[1280px] mx-auto text-center relative z-10">
              <h2 className="text-[36px] md:text-[48px] font-bold text-[#ffffff] mb-6">Mulai Transformasi Finansial Bisnis Anda</h2>
              <p className="text-[20px] text-[#d2e4ff] mb-[3rem] max-w-2xl mx-auto">Bergabunglah dengan ratusan founder yang telah mengoptimalkan strategi fundraising mereka bersama smartcoop.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-white text-[#005fa4] rounded-xl text-[14px] font-bold shadow-xl hover:bg-[#d2e4ff] transition-colors active:scale-95">
                  Daftar Sekarang
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-[#d2e4ff] text-[#d2e4ff] rounded-xl text-[14px] font-bold hover:bg-white/10 transition-colors active:scale-95">
                  Jadwalkan Demo
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#ffffff] border-t border-[#c1c7d3]/50">
            <div className="py-[5rem] px-4 md:px-[1.5rem] max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[1.5rem]">
              <div className="col-span-2">
                <div className="flex flex-col leading-none mb-4">
                  <span className="text-[32px] font-bold text-[#005fa4]">smart<span className="text-[#FFD700]">coop</span></span>
                  <span className="text-[12px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase ml-1">financial</span>
                </div>
                <p className="text-[#414751] text-[16px] mb-6 max-w-xs">
                  Strategic Planning & Driver-Based Modeling untuk masa depan finansial yang lebih terukur.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[14px] text-[#131b2e] font-bold uppercase tracking-wider">Product</span>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Features</a>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Pricing</a>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Security</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[14px] text-[#131b2e] font-bold uppercase tracking-wider">Company</span>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Contact</a>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Privacy Policy</a>
                <a className="text-[#414751] text-[14px] hover:text-[#005fa4] transition-colors" href="#">Terms of Service</a>
              </div>
              <div className="flex flex-col gap-4 col-span-2">
                <span className="text-[14px] text-[#131b2e] font-bold uppercase tracking-wider">Subscribe</span>
                <p className="text-[#414751] text-[14px]">Dapatkan update terbaru mengenai strategi fundraising.</p>
                <div className="flex gap-2">
                  <input className="bg-[#faf8ff] border border-[#c1c7d3] rounded-lg px-4 py-2 flex-grow focus:outline-[#005fa4]" placeholder="Email Anda" type="email" />
                  <button className="bg-[#005fa4] text-[#ffffff] p-2 rounded-lg material-symbols-outlined">send</button>
                </div>
              </div>
            </div>
            <div className="max-w-[1280px] mx-auto px-4 md:px-[1.5rem] py-8 border-t border-[#c1c7d3]/30 text-center">
              <span className="text-[#414751] text-[14px]">© 2024 Smartcoop Finance. Strategic Planning & Driver-Based Modeling.</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
