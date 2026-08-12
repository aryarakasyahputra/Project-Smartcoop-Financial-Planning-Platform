# Smartcoop Financial Planning Platform

Smartcoop Financial Planning Platform merupakan aplikasi SaaS perencanaan keuangan berbasis web yang dikembangkan untuk membantu perusahaan (Cooperative/SME/Startup) dalam menyusun perencanaan bisnis (Business Planning), proyeksi keuangan driver-based, manajemen skenario bisnis, valuasi, dan strategi fundraising secara otomatis.

---

## 📂 Struktur Folder Utama

* **`/frontend`**: Aplikasi React + Vite (halaman di `src/pages/` dikelompokkan berdasarkan peran: `admin`, `cfo`, `founder`, `investor`, serta alur masuk/onboarding).
* **`/backend`**: REST API berbasis Laravel 11 untuk melayani proses bisnis dan database.

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

---

## 📝 Jurnal & Lembar Bimbingan Magang (Kerja Praktik)

Rekapitulasi materi bimbingan dan alur kegiatan magang selama **1 Bulan 10 Hari** (~40 hari / 6 minggu):

### 👤 Identitas Mahasiswa & Pembimbing

| Field | Detail Informasi |
| :--- | :--- |
| **Nama Mahasiswa** | *[Isi Nama Mahasiswa]* |
| **NIM** | *[Isi NIM Mahasiswa]* |
| **Judul Kegiatan KP** | Pengembangan Smartcoop Financial Planning Platform Berbasis Web SaaS |
| **Tempat Pelaksanaan KP** | *[Isi Nama Perusahaan / Instansi Magang]* |
| **Dosen Pembimbing Akademik** | *[Isi Nama Dosen Pembimbing]* |
| **Pembimbing Lapangan** | *[Isi Nama Pembimbing Lapangan]* |

---

### 📋 Tabel Rekapitulasi Materi Bimbingan

| No | Minggu / Tanggal | Materi Bimbingan & Aktivitas Magang | Paraf Pembimbing |
| :-: | :--- | :--- | :-: |
| **1** | **Minggu 1**<br>*(Hari ke 1 - 5)* | • Orientasi tempat magang, pengenalan budaya kerja, dan pengenalan struktur organisasi perusahaan.<br>• Mempelajari profil perusahaan, layanan bisnis, serta alur kerja tim.<br>• **Tugas Awal**: Mempelajari CMS perusahaan dan melakukan input/upload artikel perusahaan. | `[ Sign ]` |
| **2** | **Minggu 2**<br>*(Hari ke 6 - 10)* | • **Kick-off Aplikasi Smartcoop**: Pengenalan proyek *Smartcoop Financial Planning Platform*.<br>• Diskusi kebutuhan arsitektur aplikasi SaaS multi-tenant dengan 4 role (Founder, CFO, Investor, Admin).<br>• Perancangan struktur project (`/frontend` React + Vite & `/backend` Laravel 11) serta pemodelan skema database MySQL. | `[ Sign ]` |
| **3** | **Minggu 3**<br>*(Hari ke 11 - 17)* | • Bimbingan & implementasi fitur Autentikasi (Laravel Sanctum Rest API & Google OAuth 2.0).<br>• Pengaturan Hak Akses Pengguna (Role-Based Access Control / RBAC) & Middleware.<br>• Pembuatan alur Registrasi, Login, dan onboarding profil perusahaan (`/onboarding`). | `[ Sign ]` |
| **4** | **Minggu 4**<br>*(Hari ke 18 - 24)* | • Bimbingan kalkulasi Financial Model & bedah file spreadsheet `Smartcoop_Financial_Model_v2.xlsx`.<br>• Pembuatan database seeder (`ExcelFinancialModelSeeder` & `DummyAssumptionSeeder`).<br>• Pengembangan Modul CFO: *Driver-Based Assumption*, Proyeksi Laba Rugi (P&L), Valuasi Bisnis (DCF & Multiples), dan Rasio Keuangan. | `[ Sign ]` |
| **5** | **Minggu 5**<br>*(Hari ke 25 - 30)* | • Pembuatan Founder Dashboard & Sistem Undangan Tim (`InvitationController`).<br>• Pembuatan Investor Viewer Dashboard (akses read-only untuk pemantauan performa & KPI keuangan).<br>• Pembuatan Admin Platform Dashboard (manajemen user, audit log, & integrasi Payment Gateway/Billing). | `[ Sign ]` |
| **6** | **Minggu 6**<br>*(Hari ke 31 - 40)* | • Pengujian integrasi API Frontend-Backend, error handling, dan penanganan isu CORS.<br>• Setup deployment Cloud: Hosting Frontend di **Vercel** dan Backend & Database MySQL di **Railway**.<br>• Konfigurasi proxy routing (`vercel.json`), Google Cloud Console OAuth Production, dan penulisan dokumentasi teknis di `README.md`. | `[ Sign ]` |

