# 🚀 PANDUAN LENGKAP DEPLOY KOMPUTER CERIA KE GITHUB & VERCEL

Dokumen ini berisi panduan resmi langkah-demi-langkah untuk mengunggah web **Komputer Ceria** ke **GitHub** dan mengaktifkan **Serverless Deployment Otomatis di Vercel**.

---

## 📌 PRASYARAT
Sebelum memulai, pastikan Anda telah memiliki:
1. Akun **GitHub** ([github.com](https://github.com))
2. Akun **Vercel** ([vercel.com](https://vercel.com)) - *Direkomendasikan daftar/login menggunakan akun GitHub agar otomatis terhubung.*

---

## 📂 LANGKAH 1: UNGGAH KODE KE GITHUB

### Opsi A: Lewat Web Browser (Tanpa Instal Aplikasi Git)
1. Buka [github.com](https://github.com) dan login.
2. Klik tombol **`+`** di sudut kanan atas $\rightarrow$ pilih **New repository**.
3. Isi detail berikut:
   - **Repository name**: `komputer-ceria` (atau nama pilihan Anda)
   - **Visibility**: `Public` atau `Private`
4. Klik **Create repository**.
5. Pada halaman repositori yang baru dibuat, klik tautan **"uploading an existing file"**.
6. Seret (*drag & drop*) seluruh file dan folder proyek Anda ke area unggah.  
   *(Catatan: Jangan sertakan folder `node_modules` jika ada, karena Vercel akan memasangnya secara otomatis).*
7. Ketik pesan commit di bawah (contoh: *"Versi awal Komputer Ceria"*), lalu klik **Commit changes**.

---

### Opsi B: Menggunakan Git Command Line / VS Code Terminal
Jalankan perintah berikut di dalam terminal folder proyek Anda:

```bash
# 1. Inisialisasi repositori git lokal
git init

# 2. Tambahkan seluruh berkas proyek
git add .

# 3. Simpan perubahan awal (commit)
git commit -m "Initial Release Komputer Ceria"

# 4. Ubah nama branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repositori GitHub Anda (Ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME-ANDA/komputer-ceria.git

# 6. Unggah kode ke GitHub
git push -u origin main
```

---

## 🌐 LANGKAH 2: DEPLOY APLIKASI KE VERCEL

1. **Buka Dashboard Vercel:**
   - Masuk ke [vercel.com](https://vercel.com) dan buka halaman **Overview / Dashboard**.

2. **Impor Proyek dari GitHub:**
   - Klik tombol **Add New...** $\rightarrow$ pilih **Project**.
   - Pada bagian **Import Git Repository**, cari repositori `komputer-ceria` Anda, lalu klik **Import**.

3. **Konfigurasi Project Settings (Otomatis):**
   - **Framework Preset**: Pilih **Vite** (Vercel akan mendeteksinya secara otomatis).
   - **Root Directory**: `./` (biarkan default).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Proses Deploy:**
   - Klik tombol **Deploy**.
   - Tunggu proses *building* berjalan (sekitar 1–2 menit).
   - Selamat! Aplikasi Anda sekarang sudah **Online** dan dapat diakses publik melalui domain gratis Vercel (contoh: `https://komputer-ceria.vercel.app`).

---

## 🔒 LANGKAH 3: PENGATURAN ROUTING & SERVERLESS (`vercel.json`)

Proyek ini telah dilengkapi dengan berkas `vercel.json` di direktori utama:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

*Fungsi file ini:*
- Mencegah error **404 Not Found** saat pengguna melakukan *refresh* halaman di jalur URL mana pun.
- Memastikan semua rute Single Page Application (SPA) dan API serverless berjalan mulus di server Vercel.

---

## 🌐 LANGKAH 4: MENGHUBUNGKAN DOMAIN KUSTOM (OPSIONAL)

Jika sekolah Anda memiliki domain sendiri (seperti `komputerceria.sch.id` atau `labkomputer.com`):

1. Masuk ke Dashboard Vercel $\rightarrow$ Pilih proyek **komputer-ceria**.
2. Klik menu **Settings** di bilah atas $\rightarrow$ pilih **Domains**.
3. Ketik nama domain Anda pada kolom input lalu klik **Add**.
4. Vercel akan memberikan catatan konfigurasi **DNS Records**:
   - **Type A**: Arahkan Host `@` ke IP `76.76.21.21`
   - **CNAME**: Arahkan Host `www` ke `cname.vercel-dns.com`
5. Atur DNS tersebut di panel domain Anda (Rumahweb, Niagahoster, Domainesia, dsb).
6. Vercel akan secara otomatis menerbitkan **Sertifikat SSL (HTTPS Gratis)** dalam beberapa menit!

---

## 🔄 LANGKAH 5: UPDATE OTOMATIS (CI/CD)

Kelebihan utama terhubung ke GitHub & Vercel:
- Setiap kali Anda melakukan perubahan kode atau menambah materi dan melakukan *push* ke GitHub (`git push`), Vercel akan secara **otomatis memperbarui website online Anda** dalam hitungan detik tanpa *downtime*!
- Semua data siswa, poin bintang, kuis, dan galeri akan tetap aman dan **tersambung secara online antar seluruh komputer/HP**.
