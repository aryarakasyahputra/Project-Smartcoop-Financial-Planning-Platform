# Smartcoop Financial Planning Platform

Smartcoop Financial Planning Platform merupakan aplikasi SaaS perencanaan keuangan berbasis web yang dikembangkan untuk membantu perusahaan (Cooperative/SME/Startup) dalam menyusun perencanaan bisnis (Business Planning), proyeksi keuangan driver-based, manajemen skenario bisnis, valuasi, dan strategi fundraising secara otomatis.

---

## 📂 Struktur & Panduan Folder

### 1. Frontend (`/frontend`)
Seluruh halaman utama aplikasi frontend dikelompokkan ke dalam subdirektori di `frontend/src/pages/` berdasarkan peran dan fungsinya:
* **`admin/`**: Panel Admin Console (Overview, Users, Billing, Audit Log).
* **`authCallback/`**: Callback Login Pihak Ketiga (OAuth Google).
* **`cfo/`**: Dashboard khusus peran CFO (Financial Analyst, Drivers, Proyeksi Laba Rugi).
* **`dashboard/`**: Router Dashboard (Mengarahkan user ke dashboard sesuai Role).
* **`founder/`**: Dashboard khusus peran Founder (Manajemen Tim, Pengaturan Perusahaan).
* **`investor/`**: Dashboard khusus peran Investor (Akses read-only ke Proyeksi).
* **`landing/`**: Landing Page promosi dan modul produk.
* **`login/` / `register/`**: Halaman Masuk & Pendaftaran Akun Baru.
* **`onboarding/`**: Halaman Pengisian Profil Perusahaan Baru (Khusus Founder).

### 2. Backend (`/backend`)
Menggunakan framework Laravel 11 dengan API routes terpusat untuk melayani request dari frontend React.

---

## 💻 Cara Menjalankan Aplikasi Secara Lokal

### 1. Backend (Laravel)
Masuk to folder `backend` dan jalankan:
```bash
php artisan serve
```
Server backend akan berjalan di: `http://localhost:8000`

### 2. Frontend (React + Vite)
Masuk to folder `frontend` dan jalankan:
```bash
npm run dev
```
Server frontend akan berjalan di: `http://localhost:5173`

---

## 🚀 Panduan Deployment (Production)

Aplikasi ini dikonfigurasi untuk berjalan di arsitektur cloud terpisah: **Vercel** (Frontend) dan **Railway** (Backend & MySQL).

### 1. Backend & Database (Railway)
Hubungkan repositori Git Anda ke Railway dan deploy folder `backend`.

#### A. Konfigurasi Environment Variables (Variables Tab)
Masukkan variabel-variabel berikut di panel variables backend Railway Anda:
* **Database Connection (Reference Variables):**
  * `DB_CONNECTION` = `mysql`
  * `DB_HOST` = `${{MySQL.MYSQLHOST}}`
  * `DB_PORT` = `${{MySQL.MYSQLPORT}}`
  * `DB_DATABASE` = `${{MySQL.MYSQLDATABASE}}`
  * `DB_USERNAME` = `${{MySQL.MYSQLUSER}}`
  * `DB_PASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
* **Laravel System Configuration:**
  * `APP_KEY` = *[Salin dari .env lokal Anda]*
  * `APP_ENV` = `production`
  * `APP_DEBUG` = `false`
* **Google OAuth & Frontend Integration:**
  * `FRONTEND_URL` = `https://project-smartcoop-financial-plannin.vercel.app` (URL Vercel Production Anda)
  * `GOOGLE_CLIENT_ID` = *[Google Client ID Anda]*
  * `GOOGLE_CLIENT_SECRET` = *[Google Client Secret Anda]*
  * `GOOGLE_REDIRECT_URI` = `https://project-smartcoop-financial-planning-platform-production.up.railway.app/api/auth/google/callback`

> [!NOTE]
> Database akan otomatis ter-migrasi saat deployment karena start command di `nixpacks.toml` sudah di-set untuk menjalankan `php artisan migrate --force`.

### 2. Frontend (Vercel)
Deploy folder `frontend` ke Vercel. 

#### A. Konfigurasi Routing Proxy (`vercel.json`)
Pastikan file `frontend/vercel.json` menggunakan konfigurasi rewrite berikut agar mem-proxy request API ke backend tanpa kendala CORS:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://project-smartcoop-financial-planning-platform-production.up.railway.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Konfigurasi Google Cloud Console (OAuth)
Agar tombol Google Login berfungsi, daftarkan domain production Anda pada Google Developer Console:
* **Authorized JavaScript origins:** `https://project-smartcoop-financial-planning-platform-production.up.railway.app`
* **Authorized redirect URIs:** `https://project-smartcoop-financial-planning-platform-production.up.railway.app/api/auth/google/callback`

---

## 🔑 Hak Akses Pengguna (Role-Based SaaS Flow)
1. **Founder**: Mendaftar lewat `/register`, mengisi profil di `/onboarding`, lalu mengelola tim & perusahaan di Founder Dashboard.
2. **CFO & Finance**: Diundang oleh Founder, memiliki akses ke Financial Analyst Tab, meracik Assumption Drivers, dan melihat Proyeksi Laba Rugi.
3. **Investor Viewer**: Diundang oleh Founder/CFO dengan akses baca-saja (*read-only*) untuk memantau performa keuangan.
4. **Platform Admin**: Administrator global di `/admin` untuk memantau metrik global, audit log, dan mengelola paket langganan (Billing).
