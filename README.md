# Smartcoop Financial Planning Platform

Smartcoop Financial Planning Platform merupakan aplikasi SaaS perencanaan keuangan berbasis web yang dikembangkan untuk membantu perusahaan (Cooperative/SME/Startup) dalam menyusun perencanaan bisnis (Business Planning), proyeksi keuangan driver-based, manajemen skenario bisnis, valuasi, dan strategi fundraising secara otomatis.

---

## Panduan Folder Frontend (`/frontend`)

Untuk memudahkan navigasi dan pemeliharaan kode, seluruh halaman utama aplikasi frontend telah dikelompokkan ke dalam direktori khusus: `frontend/src/pages/`.

Berikut adalah peta struktur folder frontend beserta kegunaannya:

```text
frontend/
├── public/                     # Aset publik statis (favicon, logo, dll)
│   └── assets/                 # Aset gambar mockup halaman utama
│       ├── dashboard-utama.png
│       ├── ringkasan-keuangan.png
│       └── analisis-skenario.png
├── src/
│   ├── assets/                 # Aset gambar lokal React (hero, react/vite svg)
│   ├── pages/                  # Halaman Utama Aplikasi (Utama & Alur SaaS)
│   │   ├── Landing.jsx         # Landing Page (Halaman Depan promosi & daftar modul)
│   │   ├── Login.jsx           # Halaman Masuk (Login)
│   │   ├── Register.jsx        # Halaman Pendaftaran Akun Baru (Register)
│   │   ├── Onboarding.jsx      # Halaman Pengisian Profil Perusahaan Baru (Hanya untuk Founder)
│   │   ├── Dashboard.jsx       # Dashboard Utama Koperasi/Perusahaan (untuk Founder/CFO/Investor)
│   │   │                       #  - Dilengkapi fitur Waiting Room jika belum terhubung entitas
│   │   ├── AdminDashboard.jsx  # Platform Admin Console (mengelola langganan SaaS & memantau data global)
│   │   └── AuthCallback.jsx    # Callback Login Pihak Ketiga (OAuth Google)
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

Aplikasi ini mendukung 4 peran (Role) utama yang memiliki batas akses dinamis dan aman:

1. **Founder**:
   * Mendaftar pertama kali lewat `/register`.
   * Diarahkan ke `/onboarding` untuk membuat perusahaan baru.
   * Mengakses dashboard keuangan utama.
2. **CFO & Finance**:
   * Diundang oleh Founder ke dalam perusahaan.
   * Jika mendaftar sebelum diundang, akan tertahan di **Waiting Room** di dashboard.
3. **Investor Viewer**:
   * Diundang oleh Founder hanya untuk melihat proyeksi keuangan.
   * Memiliki akses read-only di dashboard.
4. **Platform Admin**:
   * Bertindak sebagai Administrator Global.
   * Langsung diarahkan ke **Platform Admin Console** di `/dashboard` untuk memantau server, mengelola paket langganan SaaS, dan melihat data global.
