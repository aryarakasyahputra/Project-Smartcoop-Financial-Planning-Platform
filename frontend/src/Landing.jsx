import React, { useState } from 'react';

export default function Landing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>
        {`
          .pricing-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .pricing-card:hover { transform: translateY(-8px); }
          .check-icon { font-variation-settings: 'FILL' 1; }
          .blur-bg { backdrop-filter: blur(12px); }
        `}
      </style>

      {/* TopNavBar */}
      <nav className="bg-[#faf8ff]/80 backdrop-blur-md border-b border-[#c1c7d3]/30 sticky top-0 z-50 h-20 w-full">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1280px] mx-auto h-full">
          <div className="flex items-center gap-8">
            <div className="flex flex-col leading-none">
              <span className="text-[32px] font-bold text-[#005fa4]">
                smart<span className="text-[#FFD700]">coop</span>
              </span>
              <span className="text-[12px] font-medium text-[#005fa4]/70 tracking-[0.2em] uppercase ml-1">
                financial
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#">Modul</a>
              <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#">Manfaat</a>
              <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#">Roadmap</a>
              <a className="text-[#414751] font-medium text-[14px] hover:text-[#005fa4] transition-colors duration-200" href="#">Visi</a>
              <a className="text-[#005fa4] font-bold border-b-2 border-[#005fa4] pb-1 text-[14px]" href="#">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="px-6 py-2 bg-[#005fa4] text-[#ffffff] rounded-full text-[14px] font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
              Login
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Full Screen Hero Section */}
        <section className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-16 px-4 md:px-[1.5rem] w-full text-center bg-[#eaedff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(at 0% 0%, rgb(210, 228, 255) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(255, 220, 196) 0px, transparent 50%), radial-gradient(at 100% 100%, rgb(161, 201, 255) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(226, 231, 255) 0px, transparent 50%)' }}></div>
          <h1 className="text-[36px] md:text-[72px] font-bold text-[#131b2e] max-w-5xl mx-auto relative z-10 leading-[1.1] tracking-tight">
            Rencanakan Pertumbuhan, Proyeksikan Keuangan, dan Siapkan Bisnis Anda untuk <span className="text-[#005fa4]">Investasi.</span>
          </h1>
        </section>

        {/* Pricing Grid Section */}
        <section className="px-4 md:px-[1.5rem] max-w-[1280px] mx-auto py-12">
          <div className="text-center mb-[3rem]">
            <h2 className="text-[36px] md:text-[48px] font-bold text-[#131b2e] mb-6 leading-[1.2]">Pilih Paket Sesuai Skala Bisnis</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
            {/* Starter */}
            <div className="pricing-card p-8 bg-[#ffffff] border border-[#c1c7d3]/50 rounded-xl flex flex-col h-full shadow-sm">
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
                  <span className="text-[#414751] text-[16px]">Community support</span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <span className="material-symbols-outlined text-[#717782]">cancel</span>
                  <span className="text-[#414751] text-[16px]">Fundraising tracker</span>
                </li>
              </ul>
              <button className="w-full py-4 border border-[#005fa4] text-[#005fa4] rounded-lg text-[14px] font-bold hover:bg-[#005fa4]/5 transition-colors active:scale-95">
                Mulai Gratis
              </button>
            </div>

            {/* Professional */}
            <div className="pricing-card p-8 bg-white border-2 border-[#005fa4] rounded-xl flex flex-col h-full relative shadow-xl">
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
              <button className="w-full py-4 bg-[#005fa4] text-[#ffffff] rounded-lg text-[14px] font-bold shadow-lg shadow-[#005fa4]/20 hover:opacity-90 active:scale-95 transition-all">
                Mulai Sekarang
              </button>
            </div>

            {/* Enterprise */}
            <div className="pricing-card p-8 bg-[#ffffff] border border-[#c1c7d3]/50 rounded-xl flex flex-col h-full shadow-sm">
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
                  a: "Keamanan adalah prioritas kami. Kami menggunakan enkripsi AES-256 tingkat bank dan infrastruktur cloud yang tersertifikasi SOC2 untuk memastikan data finansial sensitif Anda tetap terlindungi dan privat."
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

        {/* FAQ Section 2 (Included as requested by HTML) */}
        <section className="py-[5rem] bg-[#f2f4f6] border-t border-[#c1c7d3]/30">
          <div className="px-4 md:px-[1.5rem] max-w-4xl mx-auto">
            <div className="text-center mb-[3rem]">
              <h2 className="text-[32px] font-bold text-[#131b2e] mb-4">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-[#414751] text-[16px]">Temukan jawaban atas pertanyaan umum mengenai layanan kami.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "Bagaimana dengan keamanan data keuangan perusahaan kami?",
                  a: "Kami menggunakan enkripsi end-to-end standar industri (AES-256) untuk melindungi data Anda. Seluruh server kami tersertifikasi ISO 27001 dan SOC2 Type II, memastikan privasi data finansial Anda adalah prioritas utama kami."
                },
                {
                  q: "Apakah saya bisa melakukan upgrade atau downgrade kapan saja?",
                  a: "Ya, Anda dapat mengubah paket langganan Anda kapan saja melalui dashboard akun. Untuk upgrade, penyesuaian fitur akan langsung aktif. Untuk downgrade, perubahan akan berlaku pada siklus penagihan berikutnya."
                },
                {
                  q: "Apakah tersedia dukungan onboarding untuk tim kami?",
                  a: "Tentu. Untuk paket Professional, kami menyediakan panduan video dan dukungan prioritas. Sedangkan untuk paket Enterprise, tim kami akan membantu proses implementasi secara langsung (hands-on) hingga integrasi sistem selesai."
                },
                {
                  q: "Apa itu Driver-Based Modeling yang ada di Smartcoop?",
                  a: "Driver-Based Modeling adalah metode perencanaan keuangan yang menghubungkan variabel bisnis (driver) secara otomatis ke laporan keuangan. Jika Anda merubah satu asumsi—misalnya biaya akuisisi pelanggan—seluruh proyeksi laba rugi dan arus kas Anda akan diperbarui secara otomatis."
                }
              ].map((faq, i) => (
                <details key={i + 4} className="group bg-[#faf8ff] rounded-xl border border-[#c1c7d3]/30 p-6 [&_summary::-webkit-details-marker]:hidden">
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
      </main>

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
  );
}
