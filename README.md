# 🌟 Komputer Ceria - Platform Gamifikasi Ekstrakurikuler Komputer SD

Platform pembelajaran interaktif dan gamifikasi ekstrakurikuler komputer modern berbasis web. Dilengkapi dengan modul materi interaktif, kuis berwaktu, arena latihan mengetik 10 jari, galeri karya siswa, sistem reward bintang & sertifikat berstempel, serta panel multi-peran (Superadmin, Pembina Sekolah, dan Siswa).

---

## 🚀 Fitur Utama

- 🎮 **Gamifikasi Siswa**: Sistem akumulasi poin bintang, badge lencana prestasi, naik level, avatar kustom, dan toko penukaran reward.
- ⌨️ **Latihan Mengetik 10 Jari (Typing Hero & Race)**: Latihan mengetik interaktif real-time dengan metrik WPM, akurasi, dan leaderboard kompetitif.
- 📝 **Modul Materi & Kuis Interaktif**: Pembelajaran komputer bertingkat dilengkapi ulasan jawaban instan, pembahasan, dan duel kuis.
- 🎨 **Galeri Karya & Lab Kreatif**: Kanvas menggambar/pixel art digital, laboratorium koding dasar, perakitan PC virtual (*PC Builder*), dan dokter troubleshooting PC.
- 🏫 **Multi-Sekolah Binaan & Manajemen Pembina**:
  - Superadmin dapat mendaftarkan sekolah binaan dan membuat akun Pembina.
  - Siswa otomatis terhubung ke sekolah binaan pembinanya saat mendaftar.
- 📜 **Sertifikat Kelulusan Resmi**: Cetak sertifikat otomatis dengan barcode verifikasi, stempel dinamis, dan tanda tangan digital pembina.
- 🔄 **Sinkronisasi Real-Time**: Terintegrasi penuh dengan Cloud Firestore dan cache lokal offline-first.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **Bundler & Build Tool**: Vite
- **Database & Sync**: Firebase Cloud Firestore
- **Deployment Target**: Cloudflare Pages / Vercel / Netlify / VPS

---

## 💻 Panduan Menjalankan di Lokal (Local Development)

### Prasyarat
- Node.js versi 18 atau lebih tinggi
- npm / yarn / pnpm

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/USERNAME_ANDA/komputer-ceria.git

# 2. Masuk ke direktori
cd komputer-ceria

# 3. Install dependencies
npm install

# 4. Jalankan server development
npm run dev
```

Buka browser di `http://localhost:3000` atau `http://localhost:5173`.

---

## 📦 Panduan Build & Deploy ke Cloudflare Pages

### 1. Build Proyek
```bash
npm run build
```
File siap rilis akan dihasilkan di folder **`dist/`**.

### 2. Konfigurasi di Cloudflare Pages (Git Integration)
Saat menghubungkan repository GitHub ke **Cloudflare Pages**:
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variable**: Tambahkan `NODE_VERSION` = `20`

File `public/_redirects` sudah disertakan di repositori ini untuk mendukung navigasi Single Page Application (SPA) secara mulus.

---

## 📂 Struktur Direktori

```text
├── public/                 # File statis publik (_redirects, logo, favicon)
├── src/
│   ├── components/         # Komponen UI (admin, auth, common, gallery, landing, student)
│   ├── context/            # React Context (AuthContext, ThemeContext, ToastContext)
│   ├── data/               # Data inisial dan konstanta
│   ├── services/           # Firestore & LocalStorage hybrid storage services
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root Router & State View Manager
│   └── main.tsx            # Entry point aplikasi
├── package.json            # Daftar dependencies & scripts
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi Vite
```

---

## 📄 Lisensi
Hak Cipta © 2026 Komputer Ceria. Seluruh hak cipta dilindungi.
