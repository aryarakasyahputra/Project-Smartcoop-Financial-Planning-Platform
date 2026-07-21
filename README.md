# Smartcoop Financial Planning Platform

Smartcoop Financial Planning Platform merupakan aplikasi SaaS perencanaan keuangan berbasis web yang dikembangkan untuk membantu perusahaan (Cooperative/SME/Startup) dalam menyusun perencanaan bisnis (Business Planning), proyeksi keuangan driver-based, manajemen skenario bisnis, valuasi, dan strategi fundraising secara otomatis.

---

## Panduan Folder Frontend (`/frontend`)

Untuk memudahkan navigasi dan pemeliharaan kode, seluruh halaman utama aplikasi frontend telah dikelompokkan ke dalam subdirektori berdasarkan peran dan fungsinya di `frontend/src/pages/`.

Berikut adalah peta struktur folder frontend beserta kegunaannya:

```text
frontend/
├── public/                     # Aset publik statis (favicon, logo, dll)
├── src/
│   ├── assets/                 # Aset gambar lokal React
│   ├── components/             # Komponen UI global yang dapat digunakan kembali (reusable UI)
│   ├── pages/                  # Halaman Utama Aplikasi (Utama & Alur SaaS)
│   │   ├── admin/              # Panel Admin Console (Overview, Users, Billing, Audit Log)
│   │   ├── authCallback/       # Callback Login Pihak Ketiga (OAuth Google)
│   │   ├── cfo/                # Dashboard khusus peran CFO (Financial Analyst, Drivers, Proyeksi)
│   │   ├── dashboard/          # Router Dashboard (Mengarahkan user ke dashboard sesuai Role)
│   │   ├── founder/            # Dashboard khusus peran Founder (Manajemen Tim, Pengaturan Perusahaan)
│   │   ├── investor/           # Dashboard khusus peran Investor (Akses read-only ke Proyeksi)
│   │   ├── landing/            # Landing Page promosi dan modul
│   │   ├── login/              # Halaman Masuk (Login)
│   │   ├── onboarding/         # Halaman Pengisian Profil Perusahaan Baru (Hanya untuk Founder)
│   │   └── register/           # Halaman Pendaftaran Akun Baru (Register)
│   ├── App.css                 # Gaya CSS global tambahan
│   ├── index.css               # Konfigurasi Tailwind & Animasi Custom
│   └── main.jsx                # Entrypoint & Router Aplikasi
```

---

## Cara Menjalankan Aplikasi Secara Lokal

### 1. Menjalankan Backend (Laravel)
Masuk ke terminal backend, kemudian jalankan:
```bash
php artisan serve
```
Server backend akan berjalan di: `http://localhost:8000`

### 2. Menjalankan Frontend (React + Vite)
Masuk ke terminal frontend, kemudian jalankan:
```bash
npm run dev
```
Server frontend akan berjalan di: `http://localhost:5173`

---

## Alur Kerja Hak Akses Pengguna (Role-Based SaaS Flow)

Aplikasi ini mendukung 4 peran (Role) utama yang memiliki antarmuka (UI) dan batas akses spesifik:

1. **Founder**:
   * Mendaftar pertama kali lewat `/register`.
   * Diarahkan ke `/onboarding` untuk membuat perusahaan baru.
   * Dialihkan ke **Founder Dashboard** untuk mengatur profil perusahaan dan mengundang anggota tim (CFO/Investor).
2. **CFO & Finance**:
   * Diundang oleh Founder ke dalam perusahaan.
   * Jika mendaftar sebelum diundang, akan tertahan di **Waiting Room**.
   * Dialihkan ke **CFO Dashboard** yang merupakan inti sistem perencanaan: memiliki akses ke *Financial Analyst Tab*, meracik *Assumption Drivers*, dan melihat *Proyeksi Laba Rugi*.
3. **Investor Viewer**:
   * Diundang oleh Founder atau CFO hanya untuk melihat proyeksi keuangan.
   * Dialihkan ke **Investor Dashboard** dengan antarmuka yang disederhanakan dan akses hanya baca (*read-only*).
4. **Platform Admin**:
   * Bertindak sebagai Administrator Global platform SaaS.
   * Langsung diarahkan ke **Platform Admin Console** di `/admin` untuk memantau server, mengelola paket langganan (Billing), memantau aktivitas pengguna (*Audit Log*), dan metrik analitik global.

---

## Fitur Utama

- **Model Perhitungan Keuangan Dinamis**: Perhitungan Proforma Laba Rugi, Cash Flow, dan metrik SaaS (CAC, LTV, Churn, Rule of 40) yang otomatis disimulasikan dari input *Drivers* yang dimasukkan pengguna.
- **Skenario Proyeksi & Penilaian (Valuation)**: Output ROI otomatis untuk skenario Konservatif, Base Case, dan Optimistik bagi Investor.
- **Audit Logging**: Perekaman aktivitas krusial pengguna (seperti pengubahan paket langganan dan status pengguna) demi kepatuhan keamanan (*Compliance*).
- **Arsitektur Berbasis Peran**: Pengalaman dan UI yang diisolasi antar peran untuk privasi data (misalnya Investor tidak bisa mengedit data asumsi).
