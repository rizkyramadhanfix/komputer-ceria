import { AnnouncementItem, CertificateConfig, ContactInfoConfig, DashboardConfig, GamificationConfig, Lesson, Quiz, TypingPractice, User } from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: '📢 Pembukaan Modul Baru & Tantangan Komputer Ceria',
    category: 'Penting',
    content: 'Modul materi lengkap pengenalan Hardware, Microsoft Word, Mengetik 10 Jari, Internet Sehat, dan Logika Koding telah resmi diterbitkan! Kumpulkan poin dan taklukkan bank kuis untuk menukarkan bintang prestasimu.',
    date: new Date().toISOString().split('T')[0],
    isPinned: true,
    authorName: 'Super Administrator',
  },
  {
    id: 'ann-2',
    title: '🏆 Arena Balap Liga Mengetik 10 Jari Dibuka!',
    category: 'Lomba',
    content: 'Tantang kecepatan jarimu di arena Liga Mengetik 10 Jari. Raih WPM tertinggi dan taklukkan podium juara #1 di papan skor leaderboard!',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    authorName: 'Super Administrator',
  },
  {
    id: 'ann-3',
    title: '💡 Tips Belajar Mengetik Cepat & Ergonomis',
    category: 'Informasi',
    content: 'Selalu posisikan kedua telunjukmu pada tombol F dan J (Home Row). Duduk dengan punggung tegak dan jaga jarak mata dari monitor minimal 50 cm.',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    authorName: 'Super Administrator',
  },
];

export const DEFAULT_CONTACT_INFO: ContactInfoConfig = {
  schoolName: 'Pusat Ekstrakurikuler Komputer Ceria',
  descriptionText: 'Selamat datang di Pusat Layanan Informasi & Kontak Ekstrakurikuler Komputer Ceria. Kami siap melayani pertanyaan seputar materi pelajaran komputer, kuis interaktif, praktikum laboratorium, dan sertifikat resmi.',
  phonePrimary: '0882-1962-4827',
  phoneSecondary: '0882-1962-4827',
  email: 'rizkyramadhan.fix@gmail.com',
  address: 'Dunia Virtual',
  operationalHours: 'Senin - Sabtu: Pukul 08.00 - 16.00 WIB',
  socialIg: '-',
  socialYt: '-',
};

export const DEFAULT_CERTIFICATE_CONFIG: CertificateConfig = {
  headerTitle: 'KOMPUTER CERIA',
  subHeaderTitle: 'SISTEM PEMBELAJARAN EKSTRAKURIKULER KOMPUTER',
  certificateTitle: 'SERTIFIKAT KELULUSAN & PENGHARGAAN',
  locationAndDate: 'Indonesia',
  signer1Label: 'Mengetahui,',
  signer1Title: 'Instruktur & Pengelola Komputer Ceria',
  signer1Name: 'Tim Pengajar Komputer',
  signer1Nip: 'NIP. 19900101 202201 1 001',
  signer1SignatureUrl: '',
  signer2Label: 'Mengetahui,',
  signer2Title: 'Koordinator Akademik & Sekolah',
  signer2Name: 'Kepala Sekolah / Penanggung Jawab',
  signer2Nip: 'NIP. 19850312 201001 1 005',
  signer2SignatureUrl: '',
  sealTitle: 'RESMI · TERVERIFIKASI',
  sealImageUrl: '',
};

export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  pointsPerLesson: 50,
  pointsPerQuizQuestion: 20,
  pointsPerTyping: 80,
  pointsToStarRatio: 10,
  badges: [
    {
      tier: 'Novice',
      label: 'Novice Explorer',
      minPoints: 0,
      color: 'slate',
      accentBg: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-300 dark:border-slate-700',
      textColor: 'text-slate-700 dark:text-slate-300',
      description: 'Langkah awal mengenal dunia komputer dan teknologi informasi (0 - 4999 Poin).',
    },
    {
      tier: 'Bronze',
      label: 'Bronze Achiever',
      minPoints: 5000,
      color: 'amber',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-400 dark:border-amber-700',
      textColor: 'text-amber-800 dark:text-amber-300',
      description: 'Mulai menguasai dasar-dasar perangkat keras dan pengetikan (5000 - 9999 Poin).',
    },
    {
      tier: 'Silver',
      label: 'Silver Specialist',
      minPoints: 10000,
      color: 'blue',
      accentBg: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-400 dark:border-sky-700',
      textColor: 'text-sky-800 dark:text-sky-300',
      description: 'Mahir dalam aplikasi perkantoran, format dokumen, dan kuis komputer (10000 - 24999 Poin).',
    },
    {
      tier: 'Gold',
      label: 'Gold Master',
      minPoints: 25000,
      color: 'yellow',
      accentBg: 'bg-yellow-50 dark:bg-yellow-950/40',
      borderColor: 'border-yellow-500 dark:border-yellow-600',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      description: 'Tangkas mengetik 10 jari dengan akurasi tinggi dan penguasaan materi mendalam (25000 - 49999 Poin).',
    },
    {
      tier: 'Diamond',
      label: 'Diamond Champion',
      minPoints: 50000,
      color: 'indigo',
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-400 dark:border-indigo-600',
      textColor: 'text-indigo-800 dark:text-indigo-300',
      description: 'Peringkat tertinggi! Menjadi teladan dan juara ekstrakurikuler komputer (50000+ Poin).',
    },
  ],
};

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  schoolName: 'Komputer Ceria',
  siteTitle: 'Komputer Ceria - Sistem Pembelajaran Gamifikasi',
  heroHeadline: 'Belajar Komputer Menjadi Ceria & Mengasyikkan dengan Sistem Bintang & Gamifikasi',
  heroSubheadline: 'Tingkatkan keterampilan perangkat keras, penguasaan Microsoft Word, kecepatan mengetik 10 jari, dan taklukkan kuis interaktif untuk mengumpulkan bintang emas serta raih gelar Diamond Champion di Komputer Ceria!',
  runningAnnouncement: '📢 Selamat datang di Komputer Ceria! Klik Mulai Belajar untuk mengakses materi pelajaran, kuis interaktif, latihan mengetik, dan mengumpulkan bintang prestasi secara gratis!',
  heroBannerUrl: '/src/assets/images/hero_computer_club_1790579622878.jpg',
};

// Default Superadmin login:
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-superadmin-default',
    role: 'superadmin',
    username: 'Administrator',
    password: 'Admin@123',
    name: 'Super Administrator Pusat',
    totalPoints: 0,
    totalStars: 0,
    completedLessons: [],
    createdAt: new Date().toISOString(),
  },
];

// ==========================================
// DAFTAR MODUL MATERI LENGKAP
// ==========================================
export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'Pengenalan Komputer & Perangkat Keras (Hardware)',
    category: 'Hardware',
    summary: 'Mengenal bagian utama komputer: Monitor, CPU, RAM, Keyboard, Mouse, Motherboard, dan Media Penyimpanan.',
    readingTimeMinutes: 6,
    points: 60,
    tags: ['Dasar', 'Hardware', 'Komputer'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Apa Itu Komputer?
Komputer adalah perangkat elektronik yang dapat menerima data (input), memproses data sesuai instruksi (process), menyimpan data (storage), dan menampilkan hasilnya kepada pengguna (output).

Komputer sangat membantu kegiatan sehari-hari, mulai dari mengetik tugas sekolah, menggambar, belajar, bermain game edukatif, hingga mencari informasi di internet.

---

## B. 4 Komponen Utama Komputer
Sebuah komputer desktop umumnya terdiri dari 4 perangkat inti:

1. **Monitor (Layar Tampilan)**
   - Berfungsi menampilkan tulisan, gambar, dan video dari komputer ke mata pengguna.
   - Merupakan perangkat keluaran (**Output Device**).

2. **CPU (Central Processing Unit)**
   - Merupakan otak utama pemroses seluruh instruksi dan perhitungan dalam komputer.
   - Terletak di dalam casing komputer dan terpasang pada Motherboard.

3. **Keyboard (Papan Ketik)**
   - Berfungsi memasukkan huruf, angka, simbol, dan tombol fungsi perintah ke komputer.
   - Merupakan perangkat masukan (**Input Device**).

4. **Mouse (Tetikus)**
   - Berfungsi menggerakkan kursor (pointer), memilih menu, mengklik objek, serta *drag and drop*.

---

## C. Komponen Hardware di Dalam Casing PC
- **Motherboard (Papan Induk)**: Papan sirkuit utama tempat semua komponen saling terhubung.
- **Processor (CPU)**: Otak pemikir komputer.
- **RAM (Random Access Memory)**: Memori kerja sementara berkecepatan tinggi saat aplikasi sedang dibuka.
- **Harddisk / SSD (Solid State Drive)**: Media penyimpanan permanen tempat Windows, dokumen, dan game disimpan.
- **Power Supply Unit (PSU)**: Mengalirkan daya listrik stabil ke seluruh komponen komputer.`,
  },
  {
    id: 'les-2',
    title: 'Sistem Operasi Windows & Manajemen File Folder',
    category: 'Dasar Komputer',
    summary: 'Cara mengelola file, membuat folder rapi, melakukan copy-paste, rename, serta menjaga kerapian dokumen di Windows.',
    readingTimeMinutes: 5,
    points: 50,
    tags: ['Windows', 'File Explorer', 'Folder'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Mengenal Sistem Operasi Windows
Sistem Operasi (Operating System / OS) adalah perangkat lunak utama yang mengontrol seluruh kerja perangkat keras dan memungkinkan kita menjalankan program aplikasi seperti Microsoft Word, Paint, dan Web Browser.

---

## B. Mengelola File dan Folder dengan File Explorer
- **File**: Berkas data individual yang disimpan di komputer (misal: dokumen teks, foto, lagu, video).
- **Folder**: Wadah atau map digital tempat mengelompokkan dan menyimpan banyak file agar tersusun rapi dan mudah dicari.

### Langkah Membuat Folder Baru:
1. Buka **File Explorer** (atau tekan tombol **Windows + E**).
2. Masuk ke folder **Documents** atau lokasi yang diinginkan.
3. Klik kanan pada area kosong $\\rightarrow$ Pilih **New** $\\rightarrow$ Klik **Folder**.
4. Ketik nama folder (contoh: *Tugas Komputer Kelas 5*) lalu tekan **Enter**.

---

## C. Operasi Dasar Pengelolaan File
- **Copy (Salin - Ctrl + C)**: Menggandakan file tanpa menghapus aslinya.
- **Paste (Tempel - Ctrl + V)**: Meletakkan file hasil salinan di lokasi baru.
- **Cut (Potong - Ctrl + X)**: Memindahkan file dari lokasi lama ke lokasi baru.
- **Rename (Ubah Nama - Tekan F2)**: Mengubah nama file atau folder.
- **Delete (Hapus - Tombol Delete)**: Memindahkan file ke *Recycle Bin*.`,
  },
  {
    id: 'les-3',
    title: 'Panduan Praktis Mengetik Cepat 10 Jari',
    category: 'Format Word',
    summary: 'Kuasai posisi jari Home Row (A S D F - J K L ;) dan teknik mengetik cepat tanpa melihat keyboard.',
    readingTimeMinutes: 7,
    points: 70,
    tags: ['Mengetik', '10 Jari', 'Keyboard'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Mengapa Perlu Belajar Mengetik 10 Jari?
Mengetik dengan 10 jari (*Touch Typing*) membuat pengetikan menjadi jauh lebih cepat, tidak mudah lelah, dan akurasi tinggi karena mata kita fokus menatap layar monitor, bukan mencari-cari tombol keyboard!

---

## B. Posisi Jari Rumah (Home Row Position)
Pada baris tengah keyboard terdapat tonjolan kecil di tombol **F** dan **J**. Tonjolan ini adalah tanda jangkar untuk kedua jari telunjukmu:

### 1. Tangan Kiri:
- **Kelingking Kiri**: Tombol **A**
- **Jari Manis Kiri**: Tombol **S**
- **Jari Tengah Kiri**: Tombol **D**
- **Telunjuk Kiri**: Tombol **F** (dan menjangkau **G, R, T, V, B**)

### 2. Tangan Kanan:
- **Telunjuk Kanan**: Tombol **J** (dan menjangkau **H, U, Y, N, M**)
- **Jari Tengah Kanan**: Tombol **K**
- **Jari Manis Kanan**: Tombol **L**
- **Kelingking Kanan**: Tombol **; (Titik Koma)** dan tombol **Enter / Shift Kanan**

### 3. Ibu Jari (Kedua Jempol):
- Bertugas menekan tombol **Spacebar (Spasi)**.

---

## C. Postur Duduk yang Ergonomis & Sehat
1. Duduk tegak dengan punggung bersandar nyaman di kursi.
2. Posisi siku membentuk sudut 90 derajat sejajar dengan meja keyboard.
3. Jarak pandang mata ke layar monitor sekitar 45 - 60 cm.
4. Istirahatkan mata setiap 30 menit menatap layar.`,
  },
  {
    id: 'les-4',
    title: 'Mahir Microsoft Word: Pemformatan Teks & Paragraf',
    category: 'Aplikasi Kantor',
    summary: 'Menguasai gaya huruf (Font), ukuran, warna, efek Bold, Italic, Underline, dan perataan paragraf (Alignment).',
    readingTimeMinutes: 6,
    points: 60,
    tags: ['Word', 'Format Teks', 'Paragraf'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Mengenal Microsoft Word
Microsoft Word adalah aplikasi pengolah kata (*word processor*) paling populer di dunia yang digunakan untuk membuat surat, cerita, makalah, tabel, dan dokumen resmi.

---

## B. Pemformatan Karakter dan Huruf (Font Formatting)
Pada tab **Home**, terdapat grup menu **Font**:
- **Font Family**: Memilih jenis tulisan (misal: *Calibri, Arial, Times New Roman*).
- **Font Size**: Mengatur besar kecilnya ukuran huruf (misal: 12pt untuk isi, 14-16pt untuk judul).
- **Bold (Ctrl + B)**: Menebalkan tulisan untuk judul atau kata penting.
- **Italic (Ctrl + I)**: Memiringkan tulisan (biasanya untuk istilah asing).
- **Underline (Ctrl + U)**: Memberikan garis bawah pada teks.
- **Font Color**: Mengubah warna tulisan.

---

## C. Perataan Paragraf (Paragraph Alignment)
- **Align Left (Ctrl + L)**: Rata Kiri — standar pengetikan teks biasa.
- **Center (Ctrl + E)**: Rata Tengah — ideal untuk judul dokumen atau puisi.
- **Align Right (Ctrl + R)**: Rata Kanan — untuk tanggal surat atau tanda tangan.
- **Justify (Ctrl + J)**: Rata Kanan & Kiri — membuat paragraf tampak rapi dan formal seperti di buku pelajaran.`,
  },
  {
    id: 'les-5',
    title: 'Mahir Microsoft Word: Tabel, Gambar, dan Hiasan Dokumen',
    category: 'Aplikasi Kantor',
    summary: 'Menyisipkan tabel data, gambar, shapes, page borders, dan penomoran halaman (Page Number).',
    readingTimeMinutes: 7,
    points: 70,
    tags: ['Word', 'Tabel', 'Desain Dokumen'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Membuat Tabel Data di Microsoft Word
Tabel sangat berguna untuk menyusun jadwal pelajaran, daftar nilai, dan biodata agar tertata rapi dalam baris dan kolom.

### Langkah Membuat Tabel:
1. Klik tab **Insert** pada menu ribbon atas.
2. Klik ikon **Table**.
3. Gerakkan kursor untuk memilih jumlah kolom (ke samping) dan baris (ke bawah).
4. Klik mouse untuk menempelkan tabel ke lembar kerja.
5. Untuk menggabungkan dua kotak atau lebih menjadi satu, pilih kotak lalu klik kanan $\\rightarrow$ **Merge Cells**.

---

## B. Menyisipkan Gambar & Ilustrasi
1. Klik tab **Insert** $\\rightarrow$ pilih **Pictures**.
2. Pilih file foto atau gambar yang ingin dimasukkan.
3. Agar gambar bisa digeser bebas di samping tulisan, klik gambar $\\rightarrow$ klik ikon **Wrap Text** $\\rightarrow$ pilih **In Front of Text** atau **Square**.

---

## C. Memberi Bingkai Halaman (Page Borders)
1. Klik tab **Design** $\\rightarrow$ klik **Page Borders** di pojok kanan atas.
2. Pilih model garis atau gambar hiasan seni (**Art**) yang ceria.
3. Klik **OK** untuk menerapkan bingkai ke seluruh halaman.`,
  },
  {
    id: 'les-6',
    title: 'Internet Sehat & Etika Keamanan Siber (Cyber Safety)',
    category: 'Internet & Etika',
    summary: 'Panduan aman berselancar di internet, menjaga password akun, menghindari link penipuan, dan etika bersosial media.',
    readingTimeMinutes: 6,
    points: 60,
    tags: ['Internet', 'Cyber Safety', 'Etika Digital'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Dunia Internet yang Menakjubkan
Internet menghubungkan jutaan komputer di seluruh dunia sehingga kita dapat belajar dan berkomunikasi dengan cepat. Namun seperti di dunia nyata, kita harus berhati-hati saat berada di dunia maya.

---

## B. 5 Aturan Emas Keamanan Akun (Cyber Safety)
1. **Rahasiakan Password**: Jangan pernah membagikan kata sandi akunmu kepada siapa pun kecuali orang tua.
2. **Kombinasi Password Kuat**: Buat password unik yang terdiri dari huruf besar, huruf kecil, angka, dan simbol.
3. **Waspada Link Phishing**: Jangan klik tautan mencurigakan atau pop-up yang mengklaim kamu memenangkan hadiah uang/gadget.
4. **Lindungi Data Pribadi**: Jangan menyebarkan alamat rumah, nomor telepon, atau data penting di forum publik.
5. **Logout Akun di Komputer Bersama**: Selalu klik *Keluar (Logout)* saat menggunakan komputer lab sekolah atau warnet.

---

## C. Sopan Santun & Netiket Digital
- Gunakan bahasa yang santun saat berkomentar di media sosial.
- Hargai teman dan tolak segala bentuk perundungan siber (*anti-cyberbullying*).
- Saring informasi sebelum membagikan ulang (*Stop Hoaks*).`,
  },
  {
    id: 'les-7',
    title: 'Logika Pemrograman & Berpikir Komputasional',
    category: 'Pemrograman',
    summary: 'Mengenal algoritma, urutan langkah logis, percabangan kondisi (If-Else), dan perulangan (Looping).',
    readingTimeMinutes: 7,
    points: 70,
    tags: ['Koding', 'Logika', 'Algoritma'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Apa Itu Berpikir Komputasional?
Berpikir komputasional adalah metode menyelesaikan masalah kompleks dengan memecahnya menjadi langkah-langkah sederhana yang teratur dan logis.

---

## B. 4 Pilar Berpikir Komputasional:
1. **Dekomposisi**: Memecah masalah besar menjadi bagian-bagian kecil yang lebih mudah dikerjakan.
2. **Pengenalan Pola**: Melihat kesamaan atau keteraturan pada masalah sebelumnya.
3. **Abstraksi**: Fokus pada informasi penting dan mengabaikan hal yang tidak relevan.
4. **Algoritma**: Menyusun urutan langkah-langkah sistematis untuk mencapai tujuan.

---

## C. Konsep Logika Dasar Koding
- **Urutan (Sequence)**: Langkah dijalankan dari atas ke bawah secara berurutan.
  - *Contoh: Nyalakan Komputer $\\rightarrow$ Buka Aplikasi $\\rightarrow$ Mulai Mengetik.*
- **Kondisi (Branching / If-Else)**: Komputer mengambil keputusan berdasarkan suatu syarat.
  - *Contoh: JIKA nilai $\\ge$ 75 MAKA lulus, JIKA TIDAK MAKA remidi.*
- **Perulangan (Looping)**: Mengulang perintah yang sama berkali-kali secara otomatis.
  - *Contoh: Ulangi melangkah maju sebanyak 5 kali.*`,
  },
  {
    id: 'les-8',
    title: 'Dasar Microsoft Excel Cilik: Baris, Kolom, Sel, dan Rumus SUM',
    category: 'Aplikasi Kantor',
    summary: 'Mengenal lembar sebar (spreadsheet), alamat sel seperti A1, memasukkan data angka, dan rumus penjumlahan otomatis =SUM().',
    readingTimeMinutes: 6,
    points: 65,
    tags: ['Excel', 'Spreadsheet', 'Rumus Dasar'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Apa Itu Microsoft Excel?
Microsoft Excel adalah aplikasi lembar kerja (*spreadsheet*) yang digunakan untuk mengolah data angka, membuat tabel keuangan, dan menghitung rumus matematika secara otomatis dan akurat.

---

## B. Struktur Lembar Kerja Excel
1. **Kolom (Columns)**: Kotak membujur dari atas ke bawah yang ditandai dengan huruf abjad (**A, B, C, D, ...**).
2. **Baris (Rows)**: Kotak membentang dari kiri ke kanan yang ditandai dengan angka (**1, 2, 3, 4, ...**).
3. **Sel (Cell)**: Kotak pertemuan antara kolom dan baris. Contohnya, sel **B3** adalah pertemuan antara kolom B dan baris ke-3.
4. **Range**: Kumpulan beberapa sel yang dipilih bersamaan, contohnya **A1:A5** (sel A1 sampai A5).

---

## C. Rumus Ajaib Penjumlahan (=SUM)
Semua penulisan rumus di Excel wajib diawali dengan tanda sama dengan (**=**).
- **Rumus Penjumlahan**: \`=SUM(A1:A5)\` menjumlahkan seluruh angka dari sel A1 hingga A5.
- **Rata-rata**: \`=AVERAGE(B1:B10)\` mencari nilai rata-rata dari sekelompok data.
- **Nilai Tertinggi & Terendah**: \`=MAX()\` untuk nilai terbesar dan \`=MIN()\` untuk nilai terkecil.`,
  },
  {
    id: 'les-9',
    title: 'Desain Grafis Cilik: Warna RGB, Resolusi Piksel, dan Format File',
    category: 'Dasar Komputer',
    summary: 'Mengenal konsep dasar seni digital: model warna RGB, kerapatan piksel (resolusi), dan perbedaan format PNG, JPG, dan GIF.',
    readingTimeMinutes: 5,
    points: 60,
    tags: ['Desain', 'Grafis', 'Warna RGB'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Gambar Digital & Satuan Piksel (Pixel)
Setiap gambar di layar komputer tersusun dari jutaan kotak warna sangat kecil yang disebut **Piksel** (*Picture Element*). Semakin banyak jumlah piksel pada gambar, semakin tajam dan jernih kualitasnya (*High Resolution*).

---

## B. Model Warna Cahaya Digital: RGB
Layar monitor komputer dan smartphone menggunakan model pencampuran tiga warna cahaya utama (**Red, Green, Blue** atau RGB):
- **Red (Merah)**
- **Green (Hijau)**
- **Blue (Biru)**
Ketika ketiga warna cahaya ini dinyalakan bersamaan dengan kekuatan penuh, akan tercipta warna **Putih terang**.

---

## C. Mengenal 3 Format Berkas Gambar Populer
1. **JPG / JPEG**: Format foto standar yang paling efisien untuk foto pemandangan dan manusia dengan ukuran berkas kecil.
2. **PNG**: Format gambar berkualitas tinggi yang mendukung latar belakang transparan (tembus pandang), sangat cocok untuk logo dan stiker.
3. **GIF**: Format gambar animasi bergerak pendek tanpa suara.`,
  },
  {
    id: 'les-10',
    title: 'Jaringan Komputer & Internet: Wi-Fi, Kabel LAN, dan Router',
    category: 'Hardware',
    summary: 'Memahami bagaimana komputer saling terhubung melalui gelombang nirkabel Wi-Fi, kabel UTP LAN, IP Address, dan perangkat router.',
    readingTimeMinutes: 6,
    points: 65,
    tags: ['Jaringan', 'Internet', 'Wi-Fi', 'LAN'],
    imageUrl: '',
    videoUrl: '',
    createdAt: new Date().toISOString(),
    content: `## A. Apa Itu Jaringan Komputer?
Jaringan komputer (*Computer Network*) adalah sistem yang menghubungkan dua komputer atau lebih sehingga dapat saling bertukar data, berbagi koneksi internet, dan berbagi printer bersama.

---

## B. Dua Cara Menghubungkan Komputer
1. **Jaringan Berkabel (Wired / Kabel LAN)**:
   - Menggunakan kabel jaringan tembaga (kabel UTP) dengan konektor **RJ-45**.
   - Keunggulannya: Koneksi data sangat stabil, cepat, dan tidak terganggu cuaca.
2. **Jaringan Nirkabel (Wireless / Wi-Fi)**:
   - Menghubungkan perangkat melalui gelombang radio tanpa kabel fisik.
   - Keunggulannya: Praktis, mudah dibawa berpindah ruangan (laptop dan smartphone).

---

## C. Perangkat Penting Jaringan Lab Komputer
- **Router**: Perangkat pengatur lalu lintas data yang membagikan sinyal internet ke seluruh komputer lab.
- **Switch / Hub**: Alat percabangan tempat kabel-kabel LAN dari puluhan komputer tersambung menjadi satu kesatuan.
- **IP Address (Alamat IP)**: Nomor identitas digital unik bagi setiap perangkat di jaringan (seperti nomor rumah di dunia nyata).`,
  },
];

// ==========================================
// DAFTAR BANK KUIS INTERAKTIF LENGKAP
// (Setiap kuis menguji pemahaman teks naskah latihan mengetik)
// ==========================================
export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Kuis Pemahaman Surat Resmi Undangan Rapat',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari naskah Surat Resmi Undangan: pengirim, waktu, tempat rapat, dan agenda.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1-1',
        questionText: 'Berdasarkan surat resmi tersebut, siapa nama sekolah pengirim surat undangan?',
        options: ['SDN Sukadamai 2 Bogor', 'SD Ceria Nusantara', 'SD Harapan Bangsa', 'SD Prestasi Emas'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Kop surat menunjukkan SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR.',
        weight: 20,
      },
      {
        id: 'q1-2',
        questionText: 'Kepada siapa surat undangan resmi tersebut ditujukan?',
        options: [
          'Bapak/Ibu Orang Tua Siswa Kelas 5 dan 6',
          'Kepala Dinas Pendidikan Kota',
          'Pengurus RT dan RW setempat',
          'Seluruh Siswa Kelas 1 dan 2'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Surat ditujukan kepada Bapak/Ibu Orang Tua Siswa Kelas 5 dan 6.',
        weight: 20,
      },
      {
        id: 'q1-3',
        questionText: 'Kapan hari dan tanggal rapat koordinasi sosialisasi akan diselenggarakan?',
        options: ['Sabtu, 24 Oktober 2026', 'Minggu, 10 November 2026', 'Senin, 1 Desember 2026', 'Jumat, 15 September 2026'],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Waktu pelaksanaan adalah Sabtu, 24 Oktober 2026.',
        weight: 20,
      },
      {
        id: 'q1-4',
        questionText: 'Pukul berapa rentang waktu pelaksanaan rapat koordinasi tersebut?',
        options: ['Pukul 09.00 - 11.30 WIB', 'Pukul 07.00 - 08.30 WIB', 'Pukul 13.00 - 15.00 WIB', 'Pukul 16.00 - 18.00 WIB'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Rapat dijadwalkan pada Pukul 09.00 - 11.30 WIB.',
        weight: 20,
      },
      {
        id: 'q1-5',
        questionText: 'Di ruangan manakah rapat sosialisasi tersebut akan bertempat?',
        options: [
          'Ruang Laboratorium Komputer Ceria Lt. 2',
          'Aula Serbaguna Lapangan',
          'Kantin Sekolah Lt. 1',
          'Ruang Tata Usaha'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Rapat bertempat di Ruang Laboratorium Komputer Ceria Lt. 2.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Kuis Pemahaman Jadwal & Tata Tertib Laboratorium',
    category: 'Aplikasi Kantor',
    description: 'Uji pemahamanmu dari naskah Jadwal Praktikum & Tata Tertib Lab Komputer.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q2-1',
        questionText: 'Berdasarkan jadwal praktikum, materi apakah yang dipelajari pada hari Selasa?',
        options: [
          'Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari',
          'Dasar Rumus Lembar Kerja Microsoft Excel',
          'Pengenalan Perangkat Keras dan Perakitan Komputer',
          'Menggambar Bebas dengan Paint'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Jadwal hari Selasa adalah Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari.',
        weight: 20,
      },
      {
        id: 'q2-2',
        questionText: 'Pukul berapa jam sesi pembelajaran praktikum komputer dilaksanakan?',
        options: ['Pukul 08.00 - 09.30 WIB', 'Pukul 10.00 - 12.00 WIB', 'Pukul 13.00 - 14.30 WIB', 'Pukul 06.30 - 07.30 WIB'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Praktikum dijadwalkan Pukul 08.00 - 09.30 WIB.',
        weight: 20,
      },
      {
        id: 'q2-3',
        questionText: 'Berdasarkan materi hari Rabu, siswa akan belajar tentang apa?',
        options: [
          'Pemformatan Dokumen dan Tabel Microsoft Word',
          'Bermain Game Online',
          'Menonton Video Animasi',
          'Membongkar Layar Monitor'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Materi hari Rabu adalah Pemformatan Dokumen dan Tabel Microsoft Word.',
        weight: 20,
      },
      {
        id: 'q2-4',
        questionText: 'Apa aturan tata tertib wajib yang harus dipatuhi mengenai alas kaki?',
        options: [
          'Seluruh siswa wajib melepas alas kaki di rak yang telah disediakan',
          'Siswa wajib mengenakan sepatu roda',
          'Siswa boleh memakai sandal basah',
          'Alas kaki diletakkan di atas meja komputer'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Siswa wajib melepas alas kaki di rak yang telah disediakan.',
        weight: 20,
      },
      {
        id: 'q2-5',
        questionText: 'Langkah apa yang wajib dilakukan sebelum siswa meninggalkan ruangan lab?',
        options: [
          'Matikan komputer melalui prosedur Shut down yang benar',
          'Langsung mencabut colokan kabel listrik',
          'Membiarkan komputer menyala semalaman',
          'Mengubah sandi komputer tanpa izin'
        ],
        correctAnswerIndex: 0,
        explanation: 'Bagus sekali! Wajib mematikan komputer melalui prosedur Shut down yang benar.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Kuis Pemahaman Cerita Kucing Robot Pixel',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari cerita edukatif petualangan kucing robot Pixel di dunia koding.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q3-1',
        questionText: 'Siapa nama kucing robot pintar dalam naskah cerita tersebut?',
        options: ['Pixel', 'Byte', 'Neo', 'Robo'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Kucing robot pintar tersebut bernama Pixel.',
        weight: 20,
      },
      {
        id: 'q3-2',
        questionText: 'Apa warna bulu bercahaya yang dimiliki oleh Pixel?',
        options: ['Biru neon', 'Kuning emas', 'Merah marun', 'Hijau terang'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Pixel memiliki bulu bercahaya biru neon.',
        weight: 20,
      },
      {
        id: 'q3-3',
        questionText: 'Di kota digital manakah latar cerita petualangan tersebut berlangsung?',
        options: ['Kota Byteville', 'Kota Cyberia', 'Kota Robotika', 'Kota Bit City'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Kota digital tempat tinggal Pixel bernama Byteville.',
        weight: 20,
      },
      {
        id: 'q3-4',
        questionText: 'Menurut Pixel, belajar logika koding itu menyenangkan dan mirip seperti menyusun apa?',
        options: ['Balok lego warna-warni', 'Puzzle kayu kuno', 'Rumah kartu', 'Menara pasir'],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Pixel menyebut koding mirip menyusun balok lego warna-warni.',
        weight: 20,
      },
      {
        id: 'q3-5',
        questionText: 'Tanda baca apa yang terhapus sehingga membuat komputer perpustakaan mengalami gangguan?',
        options: ['Tanda titik koma (;)', 'Tanda seru (!)', 'Tanda tanya (?)', 'Tanda petik ganda (")'],
        correctAnswerIndex: 0,
        explanation: 'Keren! Gangguan terjadi karena sebuah tanda titik koma terhapus dari baris kode.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-4',
    title: 'Kuis Pemahaman Laporan Perangkat Keras Komputer',
    category: 'Dasar Komputer',
    description: 'Uji pemahamanmu dari naskah laporan observasi perangkat keras komputer desktop.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q4-1',
        questionText: 'Komponen apakah yang bertindak sebagai otak utama pengolah perintah komputasi?',
        options: ['Central Processing Unit (CPU)', 'Monitor IPS', 'Mouse Optik', 'Keyboard Mekanikal'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! CPU bertindak sebagai otak utama pengolah perintah komputasi.',
        weight: 20,
      },
      {
        id: 'q4-2',
        questionText: 'Apa perbedaan mendasar antara memori RAM dan media penyimpanan SSD NVMe dalam teks?',
        options: [
          'RAM menyimpan data sementara saat program aktif, sedangkan SSD menyimpan berkas permanen',
          'RAM menyimpan game selamanya, sedangkan SSD hanya menyala saat malam',
          'RAM adalah kabel listrik, sedangkan SSD adalah tombol keyboard',
          'Keduanya tidak memiliki fungsi yang berbeda'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! RAM bersifat sementara saat program aktif, SSD menyimpan secara permanen.',
        weight: 20,
      },
      {
        id: 'q4-3',
        questionText: 'Perangkat apa yang bertugas memproses tampilan visual dua dimensi dan tiga dimensi?',
        options: ['Kartu Grafis (GPU)', 'Power Supply', 'Kabel LAN', 'Kipas Casing'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Kartu grafis (GPU) bertugas memproses dan merender tampilan visual.',
        weight: 20,
      },
      {
        id: 'q4-4',
        questionText: 'Jenis panel monitor apa yang disebutkan dalam laporan agar mata tetap nyaman?',
        options: ['Monitor panel IPS', 'Monitor tabung cembung', 'Layar kain proyektor', 'Layar kaca hitam putih'],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Teks menyebutkan monitor berpanel IPS dengan refresh rate optimal.',
        weight: 20,
      },
      {
        id: 'q4-5',
        questionText: 'Menurut kesimpulan laporan, apa dua hal yang menghasilkan performa komputer cepat dan stabil?',
        options: [
          'Perangkat keras terawat baik dan sistem operasi yang bersih',
          'Komputer dicolokkan ke aki mobil',
          'Komputer yang penuh debu dan kotoran',
          'Menghapus semua file sistem komputer'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Kombinasi hardware terawat dan OS bersih menghasilkan performa komputasi optimal.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-5',
    title: 'Kuis Pemahaman Proposal Pekan Kreativitas',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari naskah proposal Pekan Kreativitas Digital Pelajar.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q5-1',
        questionText: 'Apa tema resmi yang diusung dalam proposal Pekan Kreativitas Digital Pelajar?',
        options: [
          '"Berkarya Nyata Menuju Generasi Emas Digital"',
          '"Bermain Game Bersama di Laboratorium"',
          '"Mengenang Komputer Masa Kuno"',
          '"Liburan Ceria Bersama Komputer"'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Tema kegiatan adalah "Berkarya Nyata Menuju Generasi Emas Digital".',
        weight: 20,
      },
      {
        id: 'q5-2',
        questionText: 'Kapan jadwal hari dan tanggal pelaksanaan lomba pada proposal tersebut?',
        options: [
          'Senin - Rabu, 16 - 18 November 2026',
          'Sabtu - Minggu, 1 - 2 Januari 2026',
          'Kamis, 15 Oktober 2026',
          'Jumat, 25 Desember 2026'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Pelaksanaan dijadwalkan Senin - Rabu, 16 - 18 November 2026.',
        weight: 20,
      },
      {
        id: 'q5-3',
        questionText: 'Pukul berapa rentang waktu kegiatan lomba diadakan setiap harinya?',
        options: ['Pukul 13.30 - 15.30 WIB', 'Pukul 07.00 - 08.00 WIB', 'Pukul 18.00 - 20.00 WIB', 'Pukul 10.00 - 11.00 WIB'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Waktu kegiatan adalah Pukul 13.30 - 15.30 WIB.',
        weight: 20,
      },
      {
        id: 'q5-4',
        questionText: 'Di manakah tempat diselenggarakannya cabang lomba pekan kreativitas tersebut?',
        options: [
          'Laboratorium Komputer dan Multimedia Sekolah',
          'Lapangan Upacara Sekolah',
          'Kantin Utama Sekolah',
          'Pos Keamanan Gerbang Depan'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Tempat kegiatan adalah Laboratorium Komputer dan Multimedia Sekolah.',
        weight: 20,
      },
      {
        id: 'q5-5',
        questionText: 'Manakah yang merupakan salah satu cabang lomba resmi pada naskah proposal?',
        options: [
          'Lomba Kecepatan Mengetik Naskah Word (Liga 10 Jari)',
          'Lomba Balap Sepeda',
          'Lomba Tebak Suara Hewan',
          'Lomba Menyanyi Solo'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Salah satu cabang lomba adalah Lomba Kecepatan Mengetik Naskah Word (Liga 10 Jari).',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-6',
    title: 'Kuis Pemahaman Artikel Netiket & Jejak Digital',
    category: 'Internet & Etika',
    description: 'Uji pemahamanmu dari naskah artikel netiket: rumus T.H.I.N.K, privasi akun, dan etika siber.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q6-1',
        questionText: 'Mengapa jejak digital di internet perlu kita waspadai dan jaga dengan baik?',
        options: [
          'Karena meninggalkan jejak digital permanen yang sulit dihapus sepenuhnya',
          'Karena internet akan mati jika banyak mengetik',
          'Karena kuota internet akan langsung terpotong',
          'Karena layar monitor akan berubah warna'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Aktivitas internet meninggalkan jejak digital permanen yang sulit dihapus.',
        weight: 20,
      },
      {
        id: 'q6-2',
        questionText: 'Apa kepanjangan dari prinsip T.H.I.N.K sebelum menulis komentar atau pesan digital?',
        options: [
          'True, Helpful, Inspiring, Necessary, Kind',
          'Time, Hope, Internet, Network, Knowledge',
          'Technology, Hard, Information, New, Key',
          'Think, Help, Idea, Name, Keep'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! T.H.I.N.K mewakili True, Helpful, Inspiring, Necessary, dan Kind.',
        weight: 20,
      },
      {
        id: 'q6-3',
        questionText: 'Manakah contoh data rahasia pribadi yang dilarang dibagikan kepada orang asing?',
        options: [
          'Password, NISN, dan alamat rumah',
          'Judul buku paket sekolah',
          'Nama ekstrakurikuler komputer',
          'Warna gedung sekolah'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Password, NISN, dan alamat rumah merupakan data pribadi rahasia.',
        weight: 20,
      },
      {
        id: 'q6-4',
        questionText: 'Apa bentuk menghargai hak cipta saat menggunakan artikel atau gambar untuk tugas sekolah?',
        options: [
          'Selalu mencantumkan sumber referensi pencipta asli',
          'Mengakuinya sebagai karya buatan sendiri',
          'Menghapus watermark pencipta',
          'Menjual ulang gambar tersebut'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Menghargai hak cipta dilakukan dengan mencantumkan sumber referensi resmi.',
        weight: 20,
      },
      {
        id: 'q6-5',
        questionText: 'Kepada siapa siswa harus melapor jika menemukan modus kejahatan siber atau cyberbullying?',
        options: ['Orang tua atau guru pembina', 'Orang tak dikenal di game', 'Robot spam internet', 'Didiamkan saja'],
        correctAnswerIndex: 0,
        explanation: 'Sangat tepat! Laporkan segera ke orang tua atau guru pembina.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-7',
    title: 'Kuis Pemahaman SOP Perawatan & Shutdown Komputer',
    category: 'Aplikasi Kantor',
    description: 'Uji pemahamanmu dari naskah SOP Laboratorium: persiapan, perawatan, dan prosedur mematikan komputer.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q7-1',
        questionText: 'Pada Tahap 1, apa yang wajib dipastikan sebelum menyalakan daya listrik komputer?',
        options: [
          'Memastikan meja dan lantai kering dari tumpahan cairan',
          'Semua pintu ruangan dikunci gembok',
          'Layar monitor sudah panas',
          'Membawa minuman manis ke dekat keyboard'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar sekali! Meja dan lantai harus kering dari tumpahan cairan demi keamanan listrik.',
        weight: 20,
      },
      {
        id: 'q7-2',
        questionText: 'Unit manakah yang ditekan tombol power-nya terlebih dahulu saat menghidupkan komputer?',
        options: [
          'Unit CPU terlebih dahulu, kemudian nyalakan monitor',
          'Layar monitor terlebih dahulu, lalu cabut kabel',
          'Tombol spasi keyboard',
          'Speaker audio'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Tekan tombol Power pada unit CPU terlebih dahulu, lalu nyalakan monitor.',
        weight: 20,
      },
      {
        id: 'q7-3',
        questionText: 'Fitur Windows apa yang wajib digunakan sebelum mencabut flashdisk dari port USB?',
        options: [
          'Safely Remove Hardware / Eject',
          'Copy Paste',
          'Task Manager',
          'Format Disk'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Fitur "Safely Remove Hardware / Eject" melindungi data flashdisk dari kerusakan.',
        weight: 20,
      },
      {
        id: 'q7-4',
        questionText: 'Pada Tahap 3, apa yang harus dilakukan terhadap dokumen sebelum menekan tombol Shut down?',
        options: [
          'Simpan seluruh pekerjaan dokumen dan tutup semua jendela aplikasi',
          'Biarkan dokumen terbuka tanpa disimpan',
          'Hapus semua berkas dokumen',
          'Matikan saklar stopkontak langsung'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Wajib menyimpan pekerjaan dan menutup seluruh aplikasi sebelum Shutdown.',
        weight: 20,
      },
      {
        id: 'q7-5',
        questionText: 'Bagaimana posisi kursi lab yang benar setelah selesai menggunakan komputer?',
        options: [
          'Dimasukkan ke bawah meja dengan rapi',
          'Dibiarkan melintang di lorong lab',
          'Dinaikkan ke atas meja',
          'Dikeluarkan ke teras sekolah'
        ],
        correctAnswerIndex: 0,
        explanation: 'Bagus! Kursi harus dimasukkan ke bawah meja dengan rapi demi ketertiban lab.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-8',
    title: 'Kuis Pemahaman Naskah Pidato Pelajar',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari naskah pidato perwakilan siswa: tiga kunci sukses menatap masa depan teknologi.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q8-1',
        questionText: 'Dalam naskah pidato siswa, komputer diibaratkan sebagai apa?',
        options: [
          'Jendela ilmu pengetahuan dunia tanpa batas',
          'Mesin hitung toko kelontong',
          'Kamera pengawas ruangan',
          'Televisi tayangan kartun'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Komputer diibaratkan sebagai jendela ilmu pengetahuan dunia tanpa batas.',
        weight: 20,
      },
      {
        id: 'q8-2',
        questionText: 'Berdasarkan pidato, apa kunci sukses pertama bagi generasi muda digital?',
        options: [
          'Memiliki rasa ingin tahu yang tinggi untuk terus belajar hal baru',
          'Membeli perangkat komputer paling mahal',
          'Bermain media sosial sepanjang malam',
          'Menghindari latihan mengetik'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Kunci pertama adalah rasa ingin tahu yang tinggi untuk belajar hal baru.',
        weight: 20,
      },
      {
        id: 'q8-3',
        questionText: 'Sikap apa yang harus ditunjukkan menurut pidato ketika program mengalami kendala atau error?',
        options: [
          'Teliti, disiplin, dan pantang menyerah',
          'Marah dan merusak keyboard',
          'Langsung berhenti belajar koding',
          'Menyalahkan teman sekelas'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Bersikap teliti, disiplin, dan pantang menyerah ketika menghadapi kendala.',
        weight: 20,
      },
      {
        id: 'q8-4',
        questionText: 'Apa tujuan menjunjung tinggi etika moral dalam berkarya digital menurut pidato?',
        options: [
          'Agar karya kita membawa manfaat bagi nusa dan bangsa',
          'Agar menjadi selebriti instan di internet',
          'Agar mendapatkan uang banyak saja',
          'Agar tidak perlu mengikuti ujian sekolah'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Etika moral membimbing karya kita agar membawa manfaat bagi nusa dan bangsa.',
        weight: 20,
      },
      {
        id: 'q8-5',
        questionText: 'Keterampilan mengetik apakah yang disemangati untuk terus dilatih secara giat pada penutup pidato?',
        options: [
          'Mengetik 10 jari di atas papan ketik',
          'Mengetik dengan satu jari telunjuk',
          'Mengetik tanpa melihat layar monitor',
          'Mengetik menggunakan suara saja'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Seluruh siswa disemangati untuk giat berlatih mengetik 10 jari.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-9',
    title: 'Kuis Pemahaman Tabel Nilai Mengetik 10 Jari',
    category: 'Aplikasi Kantor',
    description: 'Uji pemahamanmu dari naskah tabel rekapitulasi nilai dan capaian mengetik siswa.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q9-1',
        questionText: 'Siapa siswa yang memiliki kecepatan mengetik tertinggi (42 WPM) pada tabel rekapitulasi?',
        options: [
          'Budi Santoso (Kelas 6A)',
          'Ahmad Fauzi (Kelas 5A)',
          'Siti Rahmawati (Kelas 5B)',
          'Citra Kirana (Kelas 6B)'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Budi Santoso dari Kelas 6A mencatat kecepatan tertinggi 42 WPM.',
        weight: 20,
      },
      {
        id: 'q9-2',
        questionText: 'Berapa tingkat akurasi mengetik yang diraih oleh Siti Rahmawati dari Kelas 5B?',
        options: ['98%', '95%', '90%', '85%'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Siti Rahmawati berhasil meraih akurasi 98%.',
        weight: 20,
      },
      {
        id: 'q9-3',
        questionText: 'Berapa kriteria batas kecepatan minimal yang ditentukan dalam penilaian naskah?',
        options: ['Minimal 30 WPM', 'Minimal 15 WPM', 'Minimal 50 WPM', 'Minimal 60 WPM'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Batas kriteria kecepatan minimal adalah 30 WPM.',
        weight: 20,
      },
      {
        id: 'q9-4',
        questionText: 'Berapa batas akurasi minimal yang harus dicapai siswa berdasarkan naskah tabel?',
        options: ['Akurasi minimal 90%', 'Akurasi minimal 70%', 'Akurasi minimal 50%', 'Akurasi minimal 30%'],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Kriteria akurasi minimal adalah 90%.',
        weight: 20,
      },
      {
        id: 'q9-5',
        questionText: 'Apa nilai huruf yang diperoleh oleh Citra Kirana dari Kelas 6B dengan kecepatan 40 WPM?',
        options: ['Nilai A+', 'Nilai B', 'Nilai C', 'Nilai D'],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Citra Kirana memperoleh nilai A+.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-10',
    title: 'Kuis Pemahaman Tips Kesehatan Mata & Postur',
    category: 'Dasar Komputer',
    description: 'Uji pemahamanmu dari naskah panduan merawat mata dan postur duduk saat mengetik.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q10-1',
        questionText: 'Berdasarkan teks panduan kesehatan, apa maksud dari Aturan 20-20-20?',
        options: [
          'Tiap 20 menit menatap layar, istirahatkan mata dengan melihat objek sejauh 20 kaki selama 20 detik',
          'Mengetik selama 20 jam tanpa istirahat',
          'Membeli 20 kacamata dalam waktu 20 hari',
          'Menekan tombol keyboard 20 kali dalam 20 detik'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Tiap 20 menit menatap layar, lihat objek sejauh 20 kaki (6 meter) selama 20 detik.',
        weight: 20,
      },
      {
        id: 'q10-2',
        questionText: 'Berapa jarak aman posisi layar monitor dari mata yang dianjurkan dalam naskah?',
        options: ['50 sampai 60 sentimeter', '10 sampai 15 sentimeter', '2 sampai 3 meter', '5 sentimeter saja'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Layar monitor diposisikan sekitar 50 sampai 60 sentimeter dari mata.',
        weight: 20,
      },
      {
        id: 'q10-3',
        questionText: 'Bagaimana posisi kedua telapak kaki yang benar saat duduk mengetik di depan komputer?',
        options: ['Menapak rata di lantai', 'Menggantung tinggi di udara', 'Dilipat ke atas meja komputer', 'Disilangkan di atas kursi'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Kedua telapak kaki harus menapak rata di lantai.',
        weight: 20,
      },
      {
        id: 'q10-4',
        questionText: 'Mengapa kita disarankan untuk sering berkedip saat menatap layar komputer?',
        options: [
          'Menjaga kelembapan kornea mata agar tidak perih atau lelah',
          'Agar komputer tidak mati mendadak',
          'Untuk mempercepat koneksi internet',
          'Supaya tombol keyboard mengetik otomatis'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Berkedip teratur menjaga kelembapan kornea mata agar tidak perih.',
        weight: 20,
      },
      {
        id: 'q10-5',
        questionText: 'Bagaimana posisi punggung yang dianjurkan saat duduk di depan komputer?',
        options: [
          'Tegak bersandar pada sandaran kursi',
          'Membungkuk sangat dekat dengan keyboard',
          'Tiduran terlentang di lantai lab',
          'Miring ke kiri terus menerus'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Duduklah dengan punggung tegak bersandar pada sandaran kursi.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-11',
    title: 'Kuis Pemahaman Cerita: Misteri Lembah Algoritma',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari cerita petualangan Rian, Maya, dan Bimo memecahkan teka-teki logika di Pulau Byte.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q11-1',
        questionText: 'Siapa saja nama ketiga sahabat yang mengikuti ekspedisi di Pulau Byte?',
        options: ['Rian, Maya, dan Bimo', 'Ahmad, Siti, dan Budi', 'Doni, Eka, dan Fajar', 'Gilang, Hana, dan Ian'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Tiga sahabat tersebut adalah Rian, Maya, dan Bimo.',
        weight: 20,
      },
      {
        id: 'q11-2',
        questionText: 'Teka-teki logika apakah yang tertulis di atas pintu gerbang batu kuno?',
        options: [
          'Urutan langkah algoritma membuat secangkir teh hangat',
          'Cara merakit komputer desktop dari awal',
          'Rumus perkalian matematika angka puluhan',
          'Nama-nama seluruh ibukota negara di dunia'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Teka-teki gerbang adalah menyusun urutan langkah algoritma membuat secangkir teh hangat.',
        weight: 20,
      },
      {
        id: 'q11-3',
        questionText: 'Siapa tokoh yang berpikir runut dan menyusun instruksi logis pembuatan teh?',
        options: ['Maya', 'Rian', 'Bimo', 'Pak Guru'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Maya yang gemar berpikir runut menyusun urutan langkah logis tersebut.',
        weight: 20,
      },
      {
        id: 'q11-4',
        questionText: 'Bagaimana cara Bimo memasukkan instruksi ke papan tombol gerbang digital?',
        options: [
          'Mengetik menggunakan teknik sepuluh jari tanpa kesalahan',
          'Menempelkan (copy-paste) dari kertas catatan',
          'Menggunakan perintah suara mikrofon ponsel',
          'Menekan tombol sembarangan secara acak'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Bimo mengetikkan setiap baris instruksi dengan teknik 10 jari tanpa salah.',
        weight: 20,
      },
      {
        id: 'q11-5',
        questionText: 'Harta karun berharga apakah yang mereka temukan di dalam ruangan gerbang?',
        options: [
          'Ribuan kristal bercahaya pemuat ilmu pengetahuan teknologi dunia',
          'Peti emas dan perak peninggalan zaman kuno',
          'Koleksi mainan robot dan mobil balap',
          'Buku resep masakan tradisional nusantara'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Mereka menemukan perpustakaan ribuan kristal pemuat ilmu pengetahuan teknologi.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-12',
    title: 'Kuis Pemahaman Kisah: Sahabat Pena Digital Nusantara',
    category: 'Aplikasi Kantor',
    description: 'Uji pemahamanmu dari kisah persahabatan Gede, Tari, dan Alif bertukar cerita budaya nusantara melalui Microsoft Word.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q12-1',
        questionText: 'Siapakah ketiga sahabat pena yang mewakili berbagai pelosok nusantara dalam cerita?',
        options: ['Gede, Tari, dan Alif', 'Rian, Maya, dan Bimo', 'Ahmad, Dewi, dan Putu', 'Fauzi, Citra, dan Wayan'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Tiga sahabat pena tersebut adalah Gede (Bali), Tari (Bukittinggi), dan Alif (Merauke).',
        weight: 20,
      },
      {
        id: 'q12-2',
        questionText: 'Dari daerah manakah masing-masing ketiga sahabat tersebut berasal?',
        options: [
          'Bali, Bukittinggi, dan Merauke Papua',
          'Jakarta, Bandung, dan Surabaya',
          'Medan, Palembang, dan Lampung',
          'Semarang, Yogyakarta, dan Solo'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Gede dari Bali, Tari dari Bukittinggi Sumatra Barat, dan Alif dari Merauke Papua.',
        weight: 20,
      },
      {
        id: 'q12-3',
        questionText: 'Aplikasi pengolah kata apakah yang mereka gunakan untuk menyusun dan merapikan cerita budaya?',
        options: ['Microsoft Word', 'Microsoft Excel', 'Adobe Photoshop', 'Google Chrome'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Mereka saling bertukar dokumen cerita yang diketik rapi dengan Microsoft Word.',
        weight: 20,
      },
      {
        id: 'q12-4',
        questionText: 'Cerita menarik apa yang dibagikan oleh Alif dari tanah Merauke Papua?',
        options: [
          'Satwa langka burung cenderawasih dan indahnya matahari terbit di ufuk timur',
          'Sejarah pembangunan jembatan gantung Merauke',
          'Resep masakan rendang daging sapi pedas',
          'Pertandingan sepak bola liga nasional'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Alif mengetik laporan tentang satwa cenderawasih dan matahari terbit Papua.',
        weight: 20,
      },
      {
        id: 'q12-5',
        questionText: 'Pesan moral utama apa yang dapat kita petik dari persahabatan digital mereka?',
        options: [
          'Komputer menjadi jembatan pemersatu kebinekaan dan kebersamaan generasi penerus bangsa',
          'Mengetik komputer hanya berguna untuk menghabiskan waktu luang',
          'Jarak antarpulau membuat kita tidak bisa saling berteman',
          'Hanya anak kota besar yang boleh belajar komputer'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Komputer menjadi jembatan pemersatu kebinekaan bagi generasi muda nusantara.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-13',
    title: 'Kuis Pemahaman Misi: Penyelamatan Satelit Cuaca Cilik',
    category: 'Dasar Komputer',
    description: 'Uji pemahamanmu dari ekspedisi sains Naila dan tim menyelamatkan satelit mikro cuaca Garuda-Satu.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q13-1',
        questionText: 'Apakah nama satelit mikro cuaca yang dipantau oleh Naila dan tim teknisi cilik?',
        options: ['Garuda-Satu', 'Palapa-A1', 'Nusantara-Tiga', 'Merah-Putih'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Satelit mikro cuaca tersebut bernama Garuda-Satu.',
        weight: 20,
      },
      {
        id: 'q13-2',
        questionText: 'Apa manfaat penting satelit cuaca Garuda-Satu bagi masyarakat pesisir pantai?',
        options: [
          'Memotret awan badai dan mengirimkan prakiraan cuaca bagi nelayan tradisional',
          'Menyiarkan siaran televisi anak-anak 24 jam nonstop',
          'Menghitung jumlah ikan di dalam lautan samudra',
          'Menghangatkan suhu air laut saat musim dingin'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Garuda-Satu memotret awan badai dan memberi prakiraan cuaca bagi nelayan.',
        weight: 20,
      },
      {
        id: 'q13-3',
        questionText: 'Penyebab apakah yang membuat antena pemancar satelit mengalami gangguan posisi di antariksa?',
        options: [
          'Hempasan angin matahari berkecepatan tinggi',
          'Tabrakan dengan burung camar laut',
          'Kehabisan bahan bakar minyak',
          'Hujan deras di luar angkasa'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Angin matahari berkecepatan tinggi menyebabkan posisi antena satelit bergeser.',
        weight: 20,
      },
      {
        id: 'q13-4',
        questionText: 'Apa yang dilakukan Naila dan tim dengan keyboard komputer untuk memulihkan satelit?',
        options: [
          'Mengetikkan baris kode algoritma re-kalibrasi transmisi radio darurat dengan cepat dan tepat',
          'Mematikan komputer dan menunggu satelit pulih dengan sendirinya',
          'Memainkan game luar angkasa untuk menghilangkan rasa cemas',
          'Membongkar keyboard komputer menjadi beberapa bagian'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Mereka mengetikkan kode algoritma darurat tanpa satu huruf pun keliru.',
        weight: 20,
      },
      {
        id: 'q13-5',
        questionText: 'Bagaimana hasil akhir dari misi penyelamatan satelit Garuda-Satu tersebut?',
        options: [
          'Antena kembali ke sudut optimal, sinyal pulih seratus persen, dan data cuaca terselamatkan',
          'Satelit jatuh ke samudra dan tidak dapat diperbaiki',
          'Sinyal satelit hilang total selamanya',
          'Data cuaca terhapus dan misi dibatalkan'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Misi sukses besar, sinyal pulih 100%, dan data foto cuaca terselamatkan.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-14',
    title: 'Kuis Pemahaman Cerita: Kancil & Komputer Pintar Hutan',
    category: 'Format Word',
    description: 'Uji pemahamanmu dari naskah cerita fabel Si Kancil dan Komputer Pintar Hutan Belantara.',
    allocatedPoints: 120,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q14-1',
        questionText: 'Benda apa yang ditemukan oleh Si Kancil di tepi rimba dekat pohon beringin tua?',
        options: [
          'Kotak logam ajaib berpendar cahaya biru (komputer pintar)',
          'Sebuah peti emas berisi koin kuno',
          'Kantong kain berisi buah apel manis',
          'Sepeda roda tiga yang terbuat dari kayu'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat sekali! Kancil menemukan kotak logam berpendar cahaya biru yang merupakan komputer pintar.',
        weight: 20,
      },
      {
        id: 'q14-2',
        questionText: 'Mengapa pada awalnya Kancil gagal membuka lumbung mata air saat mengetik sendiri?',
        options: [
          'Karena Kancil mengetik tergesa-gesa tanpa teliti sehingga banyak huruf salah',
          'Karena komputer kehabisan daya baterai',
          'Karena tombol keyboard rusak dan macet',
          'Karena Kancil tidak bisa membaca pesan di layar'
        ],
        correctAnswerIndex: 0,
        explanation: 'Benar! Kancil terlalu sombong dan terburu-buru sehingga akurasinya rendah dan banyak huruf tertukar.',
        weight: 20,
      },
      {
        id: 'q14-3',
        questionText: 'Siapakah sahabat Kancil yang datang menasihati dan membantunya mengetik dengan tenang?',
        options: [
          'Kura-kura yang sabar dan bijaksana',
          'Burung Elang yang terbang tinggi',
          'Gajah perkasa penguasa padang rumput',
          'Harimau belang yang suka berlari'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Kura-kura yang bijaksana datang mengingatkan Kancil tentang pentingnya ketelitian.',
        weight: 20,
      },
      {
        id: 'q14-4',
        questionText: 'Bagaimana cara Kancil dan Kura-kura bekerja sama menyelesaikan tantangan tersebut?',
        options: [
          'Kancil membaca naskah kalimat demi kalimat dengan lantang, sementara Kura-kura mengetik cermat dengan ritme stabil',
          'Kancil tidur siang sementara Kura-kura bekerja sendirian',
          'Mereka bergantian menekan tombol sembarangan tanpa membaca naskah',
          'Mereka meminta bantuan hewan lain untuk merusak kotak logam'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Kerja sama yang baik: Kancil membacakan dengan lantang, Kura-kura mengetik dengan teliti.',
        weight: 20,
      },
      {
        id: 'q14-5',
        questionText: 'Pelajaran berharga apa yang dipetik Kancil dari peristiwa tersebut?',
        options: [
          'Kecerdasan sejati lahir dari perpaduan kecepatan, ketelitian, kesabaran, dan kerendahan hati',
          'Kecepatan mengetik adalah satu-satunya hal yang penting dalam hidup',
          'Tidak perlu belajar mengetik karena mesin bisa bekerja sendiri',
          'Hanya hewan cepat yang berhak menggunakan teknologi komputer'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Ketelitian, kesabaran, dan kerja sama jauh lebih berharga daripada sekadar terburu-buru.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-15',
    title: 'Kuis Pemahaman Cerita: Petualangan Arka & Hutan Bambu',
    category: 'Dasar Komputer',
    description: 'Uji pemahamanmu dari naskah petualangan Arka, robot Bimo, dan observatorium puncak bukit.',
    allocatedPoints: 120,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q15-1',
        questionText: 'Apa tujuan utama perjalanan Arka menuju observatorium di puncak bukit bambu?',
        options: [
          'Memperbaiki sistem pompa air bersih bertenaga surya yang mogok untuk menolong warga desa',
          'Mencari sinyal internet untuk bermain video game online',
          'Menonton gerhana matahari bersama teman sekelas',
          'Menjual suku cadang robot ke pasar terdekat'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Arka memiliki tekad mulia menghidupkan kembali pompa air bertenaga surya untuk desa.',
        weight: 20,
      },
      {
        id: 'q15-2',
        questionText: 'Siapakah nama robot sensorik kecil berkaki empat ciptaan Arka yang menemaninya?',
        options: ['Bimo', 'Pixel', 'Garuda', 'Alpha'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Robot ciptaan Arka bernama Bimo.',
        weight: 20,
      },
      {
        id: 'q15-3',
        questionText: 'Di posisi tombol manakah Arka menempatkan jari-jarinya sebelum mengetik instruksi kalibrasi?',
        options: [
          'Tombol baris tengah (Home Row)',
          'Hanya tombol angka di bagian atas',
          'Tombol spasi dan enter saja',
          'Tombol panah navigasi kanan-kiri'
        ],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Posisi jari rumah (Home Row) adalah teknik mengetik 10 jari yang benar.',
        weight: 20,
      },
      {
        id: 'q15-4',
        questionText: 'Berapa besar tekanan hidrolik yang diketikkan Arka dalam perintah kalibrasi katup pipa?',
        options: ['Lima bar (5 bar)', 'Seratus bar (100 bar)', 'Dua puluh bar (20 bar)', 'Nol bar (0 bar)'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Sesuai teks cerita, Arka mengatur tekanan hidrolik sebesar lima bar.',
        weight: 20,
      },
      {
        id: 'q15-5',
        questionText: 'Apa manfaat yang dirasakan warga desa setelah Arka berhasil mengetikkan instruksi secara tepat?',
        options: [
          'Air pegunungan jernih kembali mengalir deras membasahi ladang sayur desa yang kekeringan',
          'Listrik di desa padam total',
          'Warga desa harus membeli air minum dari kota lain',
          'Ladang sayur terpaksa ditutup sementara'
        ],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! Pompa air kembali berputar normal dan mengalirkan air jernih ke ladang para petani.',
        weight: 20,
      },
    ],
  },
];

// ==========================================
// DAFTAR TUGAS LATIHAN MENGETIK MICROSOFT WORD
// (Teks terkalibrasi sedang/ringkas, terhubung langsung ke kuis)
// ==========================================
export const INITIAL_TYPING_PRACTICES: TypingPractice[] = [
  {
    id: 'tp-1',
    title: 'Surat Resmi Undangan Rapat Komite & Wali Murid',
    category: 'Format Word',
    difficulty: 'Mudah',
    allocatedPoints: 80,
    minAccuracy: 75,
    targetWpm: 25,
    relatedQuizId: 'quiz-1',
    instructions: 'Ketik ulang naskah surat resmi berikut dengan format kop surat, penomoran teratur, dan perataan teks yang rapi.',
    targetPlainText: `SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR\nJl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000\n\nNomor: 045/SDN2/KOMP/IX/2026\nHal: Undangan Rapat Sosialisasi Program Literasi Komputer\n\nKepada Yth.\nBapak/Ibu Orang Tua Siswa Kelas 5 dan 6\nDi Tempat\n\nDengan hormat,\nKami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang akan dilaksanakan pada:\nHari, Tanggal: Sabtu, 24 Oktober 2026\nWaktu: Pukul 09.00 - 11.30 WIB\nTempat: Ruang Laboratorium Komputer Ceria Lt. 2\nAgenda: Sosialisasi modul pembelajaran digital dan teknik mengetik 10 jari.\n\nKehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya. Terima kasih.\n\nHormat kami,\nKepala Sekolah & Pembina Komputer`,
    targetDocument: `<div style="text-align: center; border-bottom: 2px solid #334155; padding-bottom: 6px; margin-bottom: 10px;"><h4 style="margin: 0; font-weight: bold; color: #1e3a8a;">SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR</h4><p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Jl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000</p></div><p style="margin: 2px 0; font-size: 13px;"><b>Nomor:</b> 045/SDN2/KOMP/IX/2026<br/><b>Hal:</b> Undangan Rapat Sosialisasi Program Literasi Komputer</p><br/><p style="margin: 2px 0; font-size: 13px;">Kepada Yth.<br/><b>Bapak/Ibu Orang Tua Siswa Kelas 5 dan 6</b><br/>Di Tempat</p><br/><p style="margin: 2px 0; font-size: 13px;">Dengan hormat,</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.5; margin: 4px 0;">Kami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang akan dilaksanakan pada:</p><div style="margin-left: 24px; margin-top: 4px; margin-bottom: 4px; font-size: 13px;"><p style="margin: 2px 0;"><b>Hari, Tanggal:</b> Sabtu, 24 Oktober 2026</p><p style="margin: 2px 0;"><b>Waktu:</b> Pukul 09.00 - 11.30 WIB</p><p style="margin: 2px 0;"><b>Tempat:</b> Ruang Laboratorium Komputer Ceria Lt. 2</p><p style="margin: 2px 0;"><b>Agenda:</b> Sosialisasi modul pembelajaran digital dan teknik mengetik 10 jari.</p></div><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.5; margin: 4px 0;">Kehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya. Terima kasih.</p><br/><p align="right" style="font-size: 13px; margin: 4px 0;">Hormat kami,<br/><br/><b>Kepala Sekolah & Pembina Komputer</b></p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-2',
    title: 'Jadwal Praktikum Mingguan & Tata Tertib Laboratorium',
    category: 'Aplikasi Kantor',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-2',
    instructions: 'Ketik naskah jadwal pelajaran berikut dengan format judul tebal di tengah, daftar kegiatan berurutan, dan poin tata tertib.',
    targetPlainText: `JADWAL PRAKTIKUM & TATA TERTIB LAB KOMPUTER CERIA\n\nJadwal Kegiatan (Pukul 08.00 - 09.30 WIB):\n- Senin: Pengenalan Perangkat Keras dan Perakitan Komputer\n- Selasa: Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari\n- Rabu: Pemformatan Dokumen dan Tabel Microsoft Word\n- Kamis: Dasar Rumus Lembar Kerja Microsoft Excel\n- Jumat: Keamanan Siber dan Kuis Interaktif\n\nTata Tertib Wajib Laboratorium:\n1. Seluruh siswa wajib hadir tepat waktu dan melepas alas kaki di rak.\n2. Dilarang membawa makanan dan minuman ke meja komputer.\n3. Matikan komputer melalui prosedur Shut down yang benar sebelum keluar lab.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 6px;">JADWAL PRAKTIKUM & TATA TERTIB LAB KOMPUTER CERIA</h4><hr style="margin-bottom: 8px;"/><p style="font-weight: bold; font-size: 13px; color: #0f172a; margin: 4px 0;">Jadwal Kegiatan (Pukul 08.00 - 09.30 WIB):</p><ul style="font-size: 13px; line-height: 1.5; margin-top: 4px; padding-left: 20px;"><li><b>Senin:</b> Pengenalan Perangkat Keras dan Perakitan Komputer</li><li><b>Selasa:</b> Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari</li><li><b>Rabu:</b> Pemformatan Dokumen dan Tabel Microsoft Word</li><li><b>Kamis:</b> Dasar Rumus Lembar Kerja Microsoft Excel</li><li><b>Jumat:</b> Keamanan Siber dan Kuis Interaktif</li></ul><p style="font-weight: bold; font-size: 13px; color: #b91c1c; margin: 8px 0 4px 0;">Tata Tertib Wajib Laboratorium:</p><ol style="font-size: 13px; line-height: 1.5; margin-top: 4px; padding-left: 20px;"><li>Seluruh siswa wajib hadir tepat waktu dan melepas alas kaki di rak.</li><li>Dilarang membawa makanan dan minuman ke meja komputer.</li><li>Matikan komputer melalui prosedur Shut down yang benar sebelum keluar lab.</li></ol>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-3',
    title: 'Cerita Edukatif: Petualangan Kucing Robot Di Dunia Koding',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-3',
    instructions: 'Ketik naskah cerita inspiratif berikut dengan format paragraf menjorok dan perataan Justify (Rata Kiri-Kanan).',
    targetPlainText: `PETUALANGAN KUCING ROBOT DI DUNIA KODING\n\nDi sebuah kota digital bernama Byteville, hiduplah seekor kucing robot pintar bernama Pixel. Pixel memiliki bulu bercahaya biru neon dan ekor antena lentur penyebar sinyal internet.\n\nSetiap hari, Pixel berkeliling sekolah untuk mengajari anak-anak logika komputer. "Belajar koding itu menyenangkan, mirip menyusun balok lego warna-warni," kata Pixel ramah.\n\nSuatu hari, komputer perpustakaan mengalami gangguan karena tanda titik koma terhapus dari baris kode. Dengan ketelitian dan kecepatan mengetik sepuluh jari, Pixel bersama para siswa berhasil menemukan kesalahan kode tersebut dan memperbaikinya dengan cepat.\n\nPeristiwa itu membuktikan bahwa ketelitian dan ketekunan adalah kunci utama kesuksesan teknologi.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">PETUALANGAN KUCING ROBOT DI DUNIA KODING</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Di sebuah kota digital bernama <b>Byteville</b>, hiduplah seekor kucing robot pintar bernama <b>Pixel</b>. Pixel memiliki bulu bercahaya <i>biru neon</i> dan ekor antena lentur penyebar sinyal internet.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Setiap hari, Pixel berkeliling sekolah untuk mengajari anak-anak logika komputer. <i>"Belajar koding itu menyenangkan, mirip menyusun balok lego warna-warni,"</i> kata Pixel ramah.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Suatu hari, komputer perpustakaan mengalami gangguan karena tanda titik koma terhapus dari baris kode. Dengan ketelitian dan kecepatan mengetik sepuluh jari, Pixel bersama para siswa berhasil menemukan kesalahan kode tersebut dan memperbaikinya dengan cepat.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Peristiwa itu membuktikan bahwa <b>ketelitian dan ketekunan</b> adalah kunci utama kesuksesan teknologi.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-4',
    title: 'Laporan Sains: Anatomi & Perangkat Keras Komputer',
    category: 'Dasar Komputer',
    difficulty: 'Mahir',
    allocatedPoints: 100,
    minAccuracy: 85,
    targetWpm: 35,
    relatedQuizId: 'quiz-4',
    instructions: 'Ketik laporan observasi perangkat keras komputer dengan format subjudul angka, teks tebal, dan paragraf penjelas.',
    targetPlainText: `LAPORAN OBSERVASI PERANGKAT KERAS KOMPUTER DESKTOP\n\n1. Central Processing Unit (CPU) bertindak sebagai otak utama pengolah perintah komputasi yang bekerja sama dengan motherboard.\n2. Random Access Memory (RAM) menyimpan data sementara saat program aktif, sedangkan SSD NVMe menyimpan berkas secara permanen dengan kecepatan transfer tinggi.\n3. Kartu Grafis (GPU) memproses tampilan visual dan merendernya ke monitor panel IPS agar mata tetap nyaman.\n4. Keyboard mekanikal dan mouse optik memberikan kendali input presisi bagi pengguna.\n\nKesimpulan: Perangkat keras yang terawat baik dan sistem operasi yang bersih akan menghasilkan performa komputer yang cepat dan stabil.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">LAPORAN OBSERVASI PERANGKAT KERAS KOMPUTER DESKTOP</h4><p style="font-size: 13px; line-height: 1.5; margin: 5px 0;"><b>1. Central Processing Unit (CPU)</b> bertindak sebagai otak utama pengolah perintah komputasi yang bekerja sama dengan motherboard.</p><p style="font-size: 13px; line-height: 1.5; margin: 5px 0;"><b>2. Random Access Memory (RAM)</b> menyimpan data sementara saat program aktif, sedangkan SSD NVMe menyimpan berkas secara permanen dengan kecepatan transfer tinggi.</p><p style="font-size: 13px; line-height: 1.5; margin: 5px 0;"><b>3. Kartu Grafis (GPU)</b> memproses tampilan visual dan merendernya ke monitor panel IPS agar mata tetap nyaman.</p><p style="font-size: 13px; line-height: 1.5; margin: 5px 0;"><b>4. Keyboard mekanikal</b> dan mouse optik memberikan kendali input presisi bagi pengguna.</p><div style="margin-top: 10px; padding: 8px; background-color: #f1f5f9; border-left: 4px solid #3b82f6; font-size: 12px; color: #1e293b;"><b>Kesimpulan:</b> Perangkat keras yang terawat baik dan sistem operasi yang bersih akan menghasilkan performa komputer yang cepat dan stabil.</div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-5',
    title: 'Proposal Kegiatan: Pekan Kreativitas Digital Pelajar',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-5',
    instructions: 'Ketik naskah proposal kegiatan berikut dengan format subjudul tebal, butir tujuan, dan estimasi waktu yang teratur.',
    targetPlainText: `PROPOSAL PEKAN KREATIVITAS DIGITAL PELAJAR\nTema: "Berkarya Nyata Menuju Generasi Emas Digital"\n\nI. Tujuan Kegiatan:\n1. Melatih ketangkasan dan kecepatan mengetik 10 jari para siswa.\n2. Menumbuhkan daya kreativitas dan sportivitas melalui lomba teknologi.\n\nII. Cabang Lomba:\n- Lomba Kecepatan Mengetik Naskah Word (Liga 10 Jari)\n- Lomba Desain Poster Digital Kreatif\n- Lomba Cerdas Cermat Komputer Cilik\n\nIII. Waktu dan Tempat:\nHari, Tanggal: Senin - Rabu, 16 - 18 November 2026\nWaktu: Pukul 13.30 - 15.30 WIB\nTempat: Laboratorium Komputer dan Multimedia Sekolah\n\nDukungan dari Bapak/Ibu guru sangat kami harapkan demi kesuksesan acara ini.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">PROPOSAL PEKAN KREATIVITAS DIGITAL PELAJAR</h4><p align="center" style="font-size: 11px; font-weight: bold; color: #b45309; margin-top: 0; margin-bottom: 8px;">Tema: "Berkarya Nyata Menuju Generasi Emas Digital"</p><hr style="margin-bottom: 8px;"/><p style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 4px 0;">I. Tujuan Kegiatan:</p><ol style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li>Melatih ketangkasan dan kecepatan mengetik 10 jari para siswa.</li><li>Menumbuhkan daya kreativitas dan sportivitas melalui lomba teknologi.</li></ol><p style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 6px 0 2px 0;">II. Cabang Lomba:</p><ul style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li>Lomba Kecepatan Mengetik Naskah Word (Liga 10 Jari)</li><li>Lomba Desain Poster Digital Kreatif</li><li>Lomba Cerdas Cermat Komputer Cilik</li></ul><p style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 6px 0 2px 0;">III. Waktu dan Tempat:</p><p style="font-size: 13px; line-height: 1.5; margin: 2px 0; padding-left: 10px;"><b>Hari, Tanggal:</b> Senin - Rabu, 16 - 18 November 2026<br/><b>Waktu:</b> Pukul 13.30 - 15.30 WIB<br/><b>Tempat:</b> Laboratorium Komputer dan Multimedia Sekolah</p><p style="font-size: 12px; font-style: italic; color: #64748b; margin-top: 8px;">Dukungan dari Bapak/Ibu guru sangat kami harapkan demi kesuksesan acara ini.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-6',
    title: 'Artikel Edukasi: Netiket & Panduan Jejak Digital',
    category: 'Dasar Komputer',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-6',
    instructions: 'Ketik artikel panduan berinternet sehat berikut dengan format subjudul bernomor dan kutipan berbingkai rapi.',
    targetPlainText: `ETIKA BERINTERNET (NETIKET) DAN JEJAK DIGITAL POSITIF\n\nInternet merupakan ruang belajar kedua kita. Segala aktivitas, tulisan, dan foto yang diunggah akan meninggalkan jejak digital permanen.\n\nPedomani 4 Prinsip Berselancar Sehat:\n1. Rumus T.H.I.N.K: Pastikan kata-katamu True (Benar), Helpful (Membantu), Inspiring (Menginspirasi), Necessary (Penting), dan Kind (Santun).\n2. Lindungi Privasi: Jangan bagikan password, NISN, dan alamat rumah kepada orang asing.\n3. Hargai Hak Cipta: Selalu cantumkan sumber referensi saat mengutip artikel atau gambar.\n4. Berani Melapor: Laporkan tautan penipuan dan perilaku cyberbullying kepada orang tua atau guru.\n\nMari kita jadikan internet ruang belajar yang cerdas, aman, dan beradab.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 6px;">ETIKA BERINTERNET (NETIKET) DAN JEJAK DIGITAL POSITIF</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.5; margin: 5px 0;">Internet merupakan ruang belajar kedua kita. Segala aktivitas, tulisan, dan foto yang diunggah akan meninggalkan jejak digital permanen.</p><p style="font-weight: bold; font-size: 13px; color: #0284c7; margin: 6px 0 2px 0;">Pedomani 4 Prinsip Berselancar Sehat:</p><ol style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li><b>Rumus T.H.I.N.K:</b> Pastikan kata-katamu True (Benar), Helpful (Membantu), Inspiring (Menginspirasi), Necessary (Penting), dan Kind (Santun).</li><li><b>Lindungi Privasi:</b> Jangan bagikan password, NISN, dan alamat rumah kepada orang asing.</li><li><b>Hargai Hak Cipta:</b> Selalu cantumkan sumber referensi saat mengutip artikel atau gambar.</li><li><b>Berani Melapor:</b> Laporkan tautan penipuan dan perilaku cyberbullying kepada orang tua atau guru.</li></ol><div style="margin-top: 8px; padding: 6px 10px; background-color: #f0fdf4; border-left: 4px solid #16a34a; font-size: 12px; color: #166534;"><b>Mari kita jadikan internet ruang belajar yang cerdas, aman, dan beradab.</b></div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-7',
    title: 'SOP Laboratorium Komputer: Perawatan & Prosedur Shutdown',
    category: 'Aplikasi Kantor',
    difficulty: 'Mahir',
    allocatedPoints: 95,
    minAccuracy: 85,
    targetWpm: 32,
    relatedQuizId: 'quiz-7',
    instructions: 'Ketik naskah prosedur operasional berikut dengan format tiga tahapan terstruktur dan daftar poin penjelas.',
    targetPlainText: `SOP PENGGUNAAN DAN PERAWATAN KOMPUTER LABORATORIUM\n\nTahap 1: Persiapan Awal\n- Pastikan meja dan lantai kering dari cairan sebelum menyalakan listrik.\n- Tekan tombol Power CPU terlebih dahulu, kemudian nyalakan monitor.\n\nTahap 2: Selama Praktikum\n- Masuk menggunakan akun siswa resmi dan jangan mengubah pengaturan wallpaper tanpa izin.\n- Gunakan fitur "Safely Remove Hardware / Eject" sebelum mencabut flashdisk dari port USB.\n\nTahap 3: Prosedur Shutdown\n- Simpan seluruh pekerjaan dokumen dan tutup semua aplikasi yang aktif.\n- Klik Start, pilih tombol Power, lalu klik "Shut down".\n- Matikan monitor, rapikan keyboard serta mouse, dan masukkan kursi ke bawah meja.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 6px;">SOP PENGGUNAAN DAN PERAWATAN KOMPUTER LABORATORIUM</h4><hr style="margin-bottom: 8px;"/><p style="font-weight: bold; font-size: 13px; color: #0f172a; margin: 4px 0;">Tahap 1: Persiapan Awal</p><ul style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li>Pastikan meja dan lantai kering dari cairan sebelum menyalakan listrik.</li><li>Tekan tombol Power CPU terlebih dahulu, kemudian nyalakan monitor.</li></ul><p style="font-weight: bold; font-size: 13px; color: #0f172a; margin: 6px 0 2px 0;">Tahap 2: Selama Praktikum</p><ul style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li>Masuk menggunakan akun siswa resmi dan jangan mengubah pengaturan wallpaper tanpa izin.</li><li>Gunakan fitur <i>"Safely Remove Hardware / Eject"</i> sebelum mencabut flashdisk dari port USB.</li></ul><p style="font-weight: bold; font-size: 13px; color: #0f172a; margin: 6px 0 2px 0;">Tahap 3: Prosedur Shutdown</p><ul style="font-size: 13px; line-height: 1.5; margin-top: 2px; padding-left: 20px;"><li>Simpan seluruh pekerjaan dokumen dan tutup semua aplikasi yang aktif.</li><li>Klik Start, pilih tombol Power, lalu klik "Shut down".</li><li>Matikan monitor, rapikan keyboard serta mouse, dan masukkan kursi ke bawah meja.</li></ul>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-8',
    title: 'Naskah Pidato Pelajar: Generasi Cerdas Digital',
    category: 'Format Word',
    difficulty: 'Mahir',
    allocatedPoints: 100,
    minAccuracy: 85,
    targetWpm: 35,
    relatedQuizId: 'quiz-8',
    instructions: 'Ketik naskah pidato resmi berikut dengan format paragraf pidato, penekanan teks tebal, dan salam penutup santun.',
    targetPlainText: `PIDATO PERWAKILAN SISWA: MENYONGSONG MASA DEPAN DIGITAL\n\nSelamat pagi Bapak dan Ibu guru serta teman-teman yang saya banggakan.\nPuji syukur kita panjatkan ke hadirat Tuhan Yang Maha Kuasa atas kesehatan dan kesempatan belajar teknologi di laboratorium ceria ini.\nKomputer saat ini bukan hanya alat mengetik biasa, melainkan jendela ilmu pengetahuan dunia tanpa batas.\n\nAda tiga kunci sukses bagi generasi muda digital:\nPertama, miliki rasa ingin tahu yang tinggi untuk terus belajar hal baru.\nKedua, bersikap teliti, disiplin, dan pantang menyerah ketika program mengalami kendala.\nKetiga, junjung tinggi etika moral agar karya kita membawa manfaat bagi bangsa.\n\nMari terus giat berlatih mengetik 10 jari dan raih prestasi terbaik! Terima kasih.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 6px;">PIDATO PERWAKILAN SISWA: MENYONGSONG MASA DEPAN DIGITAL</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 5px 0;">Selamat pagi Bapak dan Ibu guru serta teman-teman yang saya banggakan. Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Kuasa atas kesehatan dan kesempatan belajar teknologi di laboratorium ceria ini. Komputer saat ini bukan hanya alat mengetik biasa, melainkan jendela ilmu pengetahuan dunia tanpa batas.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 5px 0;">Ada <b>tiga kunci sukses</b> bagi generasi muda digital:<br/><b>Pertama</b>, miliki rasa ingin tahu yang tinggi untuk terus belajar hal baru.<br/><b>Kedua</b>, bersikap teliti, disiplin, dan pantang menyerah ketika program mengalami kendala.<br/><b>Ketiga</b>, junjung tinggi etika moral agar karya kita membawa manfaat bagi bangsa.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 5px 0;">Mari terus giat berlatih mengetik 10 jari dan raih prestasi terbaik! Terima kasih.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-9',
    title: 'Tabel Rekapitulasi Nilai & Jadwal Ekstrakurikuler Komputer',
    category: 'Aplikasi Kantor',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-9',
    instructions: 'Ketik ulang tabel rekapitulasi nilai latihan mengetik berikut dengan format tabel rapi, persentase akurasi, dan WPM.',
    targetPlainText: `REKAPITULASI NILAI LATIHAN MENGETIK KELAS 5 DAN 6\nKegiatan: Ekstrakurikuler Komputer Ceria Tahun Ajaran 2026/2027\n\nDaftar Nilai Siswa Terbaik:\n1. Ahmad Fauzi (Kelas 5A): Kecepatan 38 WPM, Akurasi 96%, Nilai A\n2. Siti Rahmawati (Kelas 5B): Kecepatan 35 WPM, Akurasi 98%, Nilai A\n3. Budi Santoso (Kelas 6A): Kecepatan 42 WPM, Akurasi 95%, Nilai A+\n4. Citra Kirana (Kelas 6B): Kecepatan 40 WPM, Akurasi 97%, Nilai A+\n\nKriteria Penilaian: Kecepatan minimal 30 WPM dan akurasi minimal 90%.\nCatatan Pembina: Seluruh siswa menunjukkan peningkatan ketangkasan jari yang membanggakan.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">REKAPITULASI NILAI LATIHAN MENGETIK KELAS 5 DAN 6</h4><p align="center" style="font-size: 11px; color: #64748b; margin-top: 0; margin-bottom: 8px;">Kegiatan: Ekstrakurikuler Komputer Ceria Tahun Ajaran 2026/2027</p><table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;"><tr style="background-color: #e2e8f0;"><th style="border: 1px solid #cbd5e1; padding: 4px;">Nama Siswa</th><th style="border: 1px solid #cbd5e1; padding: 4px;">Kelas</th><th style="border: 1px solid #cbd5e1; padding: 4px;">Kecepatan</th><th style="border: 1px solid #cbd5e1; padding: 4px;">Akurasi</th><th style="border: 1px solid #cbd5e1; padding: 4px;">Nilai</th></tr><tr><td style="border: 1px solid #cbd5e1; padding: 4px;">Ahmad Fauzi</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">5A</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">38 WPM</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">96%</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">A</td></tr><tr><td style="border: 1px solid #cbd5e1; padding: 4px;">Siti Rahmawati</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">5B</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">35 WPM</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">98%</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">A</td></tr><tr><td style="border: 1px solid #cbd5e1; padding: 4px;">Budi Santoso</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">6A</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">42 WPM</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">95%</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">A+</td></tr><tr><td style="border: 1px solid #cbd5e1; padding: 4px;">Citra Kirana</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">6B</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">40 WPM</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">97%</td><td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">A+</td></tr></table><p style="font-size: 12px; margin: 4px 0;"><b>Kriteria Penilaian:</b> Kecepatan minimal 30 WPM dan akurasi minimal 90%.</p><p style="font-size: 12px; font-style: italic; color: #166534; margin: 2px 0;">Catatan Pembina: Seluruh siswa menunjukkan peningkatan ketangkasan jari yang membanggakan.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-10',
    title: 'Tips Kesehatan: Merawat Mata & Postur Saat Mengetik Komputer',
    category: 'Dasar Komputer',
    difficulty: 'Mudah',
    allocatedPoints: 85,
    minAccuracy: 75,
    targetWpm: 25,
    relatedQuizId: 'quiz-10',
    instructions: 'Ketik panduan kesehatan ergonomis berikut dengan format daftar nomor dan tips praktis.',
    targetPlainText: `PANDUAN KESEHATAN MATA DAN POSTUR DUDUK SAAT MENGETIK\n\n1. Terapkan Aturan 20-20-20: Setiap menatap layar selama 20 menit, alihkan pandangan ke objek berjarak 20 kaki (sekitar 6 meter) selama 20 detik untuk mengistirahatkan otot mata.\n2. Atur Jarak Aman Monitor: Posisikan layar monitor sekitar 50 sampai 60 sentimeter dari mata, sejajar atau sedikit di bawah garis pandang.\n3. Postur Punggung dan Kaki: Duduklah dengan punggung tegak bersandar pada sandaran kursi, dan kedua telapak kaki menapak rata di lantai.\n4. Sering Berkedip: Berkedip secara teratur menjaga kelembapan kornea mata agar tidak perih atau lelah.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">PANDUAN KESEHATAN MATA DAN POSTUR DUDUK SAAT MENGETIK</h4><ol style="font-size: 13px; line-height: 1.6; margin-top: 4px; padding-left: 20px;"><li><b>Terapkan Aturan 20-20-20:</b> Setiap menatap layar selama 20 menit, alihkan pandangan ke objek berjarak 20 kaki (sekitar 6 meter) selama 20 detik untuk mengistirahatkan otot mata.</li><li><b>Atur Jarak Aman Monitor:</b> Posisikan layar monitor sekitar 50 sampai 60 sentimeter dari mata, sejajar atau sedikit di bawah garis pandang.</li><li><b>Postur Punggung dan Kaki:</b> Duduklah dengan punggung tegak bersandar pada sandaran kursi, dan kedua telapak kaki menapak rata di lantai.</li><li><b>Sering Berkedip:</b> Berkedip secara teratur menjaga kelembapan kornea mata agar tidak perih atau lelah.</li></ol>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-11',
    title: 'Cerita Petualangan: Misteri Harta Karun Lembah Algoritma',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 110,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-11',
    instructions: 'Ketik naskah cerita fiksi ilmiah anak berikut dengan format judul di tengah, teks paragraf menjorok (text-indent), dan penekanan kata kunci tebal.',
    targetPlainText: `MISTERI HARTA KARUN DI LEMBAH ALGORITMA\n\nDi sebuah pulau tersembunyi bernama Pulau Byte, tiga sahabat cerdas bernama Rian, Maya, dan Bimo sedang mengikuti ekspedisi penjelajahan komputer. Mereka menemukan sebuah pintu gerbang batu kuno yang terkunci dengan papan tombol digital berpendar cahaya keemasan.\n\nDi atas pintu gerbang tertulis sebuah teka-teki logika: "Untuk membuka pintu perpustakaan kristal, masukkan urutan langkah algoritma membuat secangkir teh hangat dengan tepat." Maya, yang gemar berpikir runut, segera menuliskan urutan langkah logis: mengambil cangkir, merebus air hingga mendidih, mencelupkan kantong teh, menambahkan sesendok madu, dan mengaduknya perlahan.\n\nBimo mengetikkan setiap baris instruksi tersebut menggunakan teknik sepuluh jari tanpa kesalahan. Begitu tombol Enter ditekan, lampu gerbang menyala hijau dan pintu perlahan terbuka lebar. Di dalam ruangan, mereka disambut ribuan kristal bercahaya yang memuat ilmu pengetahuan teknologi dari seluruh penjuru dunia.\n\nRian tersenyum bangga dan berkata, "Ternyata algoritma dan ketelitian mengetik adalah kunci pembuka gerbang masa depan kita!"`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">MISTERI HARTA KARUN DI LEMBAH ALGORITMA</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Di sebuah pulau tersembunyi bernama <b>Pulau Byte</b>, tiga sahabat cerdas bernama <b>Rian</b>, <b>Maya</b>, dan <b>Bimo</b> sedang mengikuti ekspedisi penjelajahan komputer. Mereka menemukan sebuah pintu gerbang batu kuno yang terkunci dengan papan tombol digital berpendar cahaya keemasan.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Di atas pintu gerbang tertulis sebuah teka-teki logika: <i>"Untuk membuka pintu perpustakaan kristal, masukkan urutan langkah algoritma membuat secangkir teh hangat dengan tepat."</i> Maya, yang gemar berpikir runut, segera menuliskan urutan langkah logis: mengambil cangkir, merebus air hingga mendidih, mencelupkan kantong teh, menambahkan sesendok madu, dan mengaduknya perlahan.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Bimo mengetikkan setiap baris instruksi tersebut menggunakan teknik sepuluh jari tanpa kesalahan. Begitu tombol Enter ditekan, lampu gerbang menyala hijau dan pintu perlahan terbuka lebar. Di dalam ruangan, mereka disambut ribuan kristal bercahaya yang memuat ilmu pengetahuan teknologi dari seluruh penjuru dunia.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Rian tersenyum bangga dan berkata, <i>"Ternyata algoritma dan ketelitian mengetik adalah kunci pembuka gerbang masa depan kita!"</i></p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-12',
    title: 'Kisah Inspiratif: Sahabat Pena Digital Dari Sabang Sampai Merauke',
    category: 'Aplikasi Kantor',
    difficulty: 'Sedang',
    allocatedPoints: 110,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-12',
    instructions: 'Ketik naskah cerita persahabatan nusantara berikut dengan format kutipan dialog bercetak miring dan poin nilai kebersamaan.',
    targetPlainText: `SAHABAT PENA DIGITAL DARI SABANG SAMPAI MERAUKE\n\nKemajuan teknologi komputer telah mendekatkan anak-anak dari berbagai pelosok nusantara. Melalui program pertukaran budaya digital antarsekolah, Gede yang tinggal di Pulau Dewata Bali berkenalan dengan Tari dari Bukittinggi dan Alif dari Merauke.\n\nSetiap akhir pekan di laboratorium komputer sekolah masing-masing, mereka saling mengirimkan dokumen cerita yang diketik rapi menggunakan Microsoft Word. Gede menceritakan keindahan tradisi tari kecak dan semarak upacara ngaben. Tari membagikan kisah kemegahan Rumah Gadang serta pepatah Minang tentang gotong royong. Sementara Alif mengetik laporan menarik tentang satwa langka burung cenderawasih dan indahnya matahari terbit di ufuk timur Papua.\n\nMereka saling mengoreksi tanda baca, merapikan format margin halaman, dan menyisipkan foto dokumentasi budaya. "Jarak ribuan kilometer bukan halangan bagi kita untuk bersatu dan belajar bersama," tulis Tari di paragraf penutup suratnya.\n\nPersahabatan digital mereka membuktikan bahwa komputer bukan hanya sarana mengetik, melainkan jembatan pemersatu kebinekaan generasi penerus bangsa.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">SAHABAT PENA DIGITAL DARI SABANG SAMPAI MERAUKE</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Kemajuan teknologi komputer telah mendekatkan anak-anak dari berbagai pelosok nusantara. Melalui program pertukaran budaya digital antarsekolah, <b>Gede</b> yang tinggal di Pulau Dewata Bali berkenalan dengan <b>Tari</b> dari Bukittinggi dan <b>Alif</b> dari Merauke.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Setiap akhir pekan di laboratorium komputer sekolah masing-masing, mereka saling mengirimkan dokumen cerita yang diketik rapi menggunakan <i>Microsoft Word</i>. Gede menceritakan keindahan tradisi tari kecak dan semarak upacara ngaben. Tari membagikan kisah kemegahan Rumah Gadang serta pepatah Minang tentang gotong royong. Sementara Alif mengetik laporan menarik tentang satwa langka burung cenderawasih dan indahnya matahari terbit di ufuk timur Papua.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Mereka saling mengoreksi tanda baca, merapikan format margin halaman, dan menyisipkan foto dokumentasi budaya. <i>"Jarak ribuan kilometer bukan halangan bagi kita untuk bersatu dan belajar bersama,"</i> tulis Tari di paragraf penutup suratnya.</p><div style="margin-top: 10px; padding: 8px 12px; background-color: #f0fdf4; border-left: 4px solid #16a34a; font-size: 12px; color: #166534;"><b>Nilai Kebinekaan:</b> Persahabatan digital membuktikan bahwa komputer adalah jembatan pemersatu generasi penerus bangsa.</div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-13',
    title: 'Ekspedisi Sains: Misi Penyelamatan Satelit Cuaca Cilik',
    category: 'Dasar Komputer',
    difficulty: 'Mahir',
    allocatedPoints: 120,
    minAccuracy: 85,
    targetWpm: 35,
    relatedQuizId: 'quiz-13',
    instructions: 'Ketik naskah ekspedisi ruang angkasa berikut dengan format subjudul penomoran tahapan, istilah teknis tebal, dan kesimpulan misi.',
    targetPlainText: `EKSPEDISI SAINS: MISI PENYELAMATAN SATELIT CUACA NUSANTARA\n\nDi pusat stasiun pengendali orbit observatorium sekolah, tim teknisi cilik yang dipimpin oleh Naila sedang memantau satelit mikro cuaca bernama Garuda-Satu. Satelit ini bertugas memotret pergerakan awan badai dan mengirimkan prakiraan cuaca akurat bagi para nelayan tradisional di pesisir pantai.\n\nPagi itu, alarm darurat berbunyi nyaring di ruang kendali. Panel monitor menampilkan peringatan bahwa antena pemancar satelit mengalami gangguan posisi akibat hempasan angin matahari berkecepatan tinggi. Sinyal telemetri melemah drastis hingga tersisa sepuluh persen.\n\nNaila segera mengumpulkan timnya untuk menjalankan prosedur pemulihan darurat. Dengan sigap, Naila menyusun baris kode algoritma re-kalibrasi motorik antena, sementara Danu memeriksa kestabilan daya panel surya. Jari-jemari mereka menari lincah di atas papan ketik mekanikal, mengetikkan instruksi transmisi gelombang radio darurat tanpa satu huruf pun keliru.\n\nTepat saat hitungan mundur tersisa lima detik, baris perintah berhasil terkirim sempurna ke orbit antariksa. Antena Garuda-Satu berputar kembali ke sudut optimal, sinyal kembali normal seratus persen, dan data foto cuaca berhasil terselamatkan.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">EKSPEDISI SAINS: MISI PENYELAMATAN SATELIT CUACA NUSANTARA</h4><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Di pusat stasiun pengendali orbit observatorium sekolah, tim teknisi cilik yang dipimpin oleh <b>Naila</b> sedang memantau satelit mikro cuaca bernama <b>Garuda-Satu</b>. Satelit ini bertugas memotret pergerakan awan badai dan mengirimkan prakiraan cuaca akurat bagi para nelayan tradisional di pesisir pantai.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Pagi itu, alarm darurat berbunyi nyaring di ruang kendali. Panel monitor menampilkan peringatan bahwa antena pemancar satelit mengalami gangguan posisi akibat hempasan angin matahari berkecepatan tinggi. Sinyal telemetri melemah drastis hingga tersisa sepuluh persen.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Naila segera mengumpulkan timnya untuk menjalankan prosedur pemulihan darurat. Dengan sigap, Naila menyusun baris kode algoritma re-kalibrasi motorik antena, sementara <b>Danu</b> memeriksa kestabilan daya panel surya. Jari-jemari mereka menari lincah di atas papan ketik mekanikal, mengetikkan instruksi transmisi gelombang radio darurat tanpa satu huruf pun keliru.</p><div style="margin-top: 10px; padding: 8px 12px; background-color: #eff6ff; border-left: 4px solid #3b82f6; font-size: 12px; color: #1e40af;"><b>Hasil Misi:</b> Tepat saat hitungan mundur tersisa lima detik, baris perintah berhasil terkirim sempurna ke orbit antariksa. Antena Garuda-Satu berputar kembali ke sudut optimal, sinyal kembali normal seratus persen, dan data foto cuaca berhasil terselamatkan.</div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-14',
    title: 'Cerita Fabel: Kisah Kancil dan Komputer Pintar Hutan Belantara',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 120,
    minAccuracy: 80,
    targetWpm: 30,
    relatedQuizId: 'quiz-14',
    instructions: 'Ketik naskah cerita fabel berikut dengan format judul di tengah bergaris, paragraf menjorok (text-indent), dialog cetak miring, dan kotak hikmah.',
    targetPlainText: `KISAH KANCIL DAN KOMPUTER PINTAR HUTAN BELANTARA\n\nDi tepi rimba yang teduh dekat pohon beringin tua, Si Kancil yang lincah menemukan sebuah kotak logam berpendar cahaya biru lembut. Kotak ajaib itu ternyata adalah komputer pintar peninggalan seorang peneliti alam yang ramah. Di layarnya tertulis sebuah pesan: "Hutan sedang menghadapi musim kemarau panjang. Pintu lumbung sumber mata air di gua batu dapat dibuka jika penghuni hutan mampu mengetikkan kata sandi kebajikan secara teliti."\n\nKancil yang merasa paling pandai segera melompat ke depan papan ketik. Dengan jemari kakinya yang cepat, ia mengetik tergesa-gesa tanpa memperhatikan huruf besar dan tanda baca. "Ah, aku pasti bisa membukanya dalam sekejap mata!" serunya congkak. Namun, layar berkedip merah dan mengeluarkan bunyi peringatan: "Akurasi pengetikan kurang tepat. Terlalu banyak huruf tertukar karena terburu-buru."\n\nMelihat hal itu, Kura-kura yang bijaksana melangkah mendekat perlahan. "Sahabatku Kancil, kecepatan memang berguna, namun ketelitian dan ketenangan jauh lebih utama," ujar Kura-kura tersenyum ramah. Kancil pun tersipu malu dan menyadari kekeliruannya. Mereka berdua akhirnya sepakat bekerja sama secara harmonis. Kancil membaca naskah kalimat demi kalimat dengan lantang, sementara Kura-kura menekan tombol keyboard dengan cermat menggunakan ritme yang stabil.\n\n"Kejujuran, kerja keras, dan gotong royong adalah pelindung hutan kita," ketik mereka bersama. Begitu tanda titik terakhir dimasukkan, layar memancarkan cahaya hijau kemilau. Pintu lumbung air terbuka perlahan dan mengalirkan air jernih yang menyegarkan seluruh satwa rimba. Sejak hari itu, Kancil belajar bahwa kecerdasan sejati lahir dari perpaduan antara kecepatan, kesabaran, dan kerendahan hati.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 4px;">KISAH KANCIL DAN KOMPUTER PINTAR HUTAN BELANTARA</h4><hr style="margin-bottom: 8px;"/><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Di tepi rimba yang teduh dekat pohon beringin tua, <b>Si Kancil</b> yang lincah menemukan sebuah kotak logam berpendar cahaya biru lembut. Kotak ajaib itu ternyata adalah komputer pintar peninggalan seorang peneliti alam yang ramah. Di layarnya tertulis sebuah pesan: <i>"Hutan sedang menghadapi musim kemarau panjang. Pintu lumbung sumber mata air di gua batu dapat dibuka jika penghuni hutan mampu mengetikkan kata sandi kebajikan secara teliti."</i></p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Kancil yang merasa paling pandai segera melompat ke depan papan ketik. Dengan jemari kakinya yang cepat, ia mengetik tergesa-gesa tanpa memperhatikan huruf besar dan tanda baca. <i>"Ah, aku pasti bisa membukanya dalam sekejap mata!"</i> serunya congkak. Namun, layar berkedip merah dan mengeluarkan bunyi peringatan: <i>"Akurasi pengetikan kurang tepat. Terlalu banyak huruf tertukar karena terburu-buru."</i></p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Melihat hal itu, <b>Kura-kura</b> yang bijaksana melangkah mendekat perlahan. <i>"Sahabatku Kancil, kecepatan memang berguna, namun ketelitian dan ketenangan jauh lebih utama,"</i> ujar Kura-kura tersenyum ramah. Kancil pun tersipu malu dan menyadari kekeliruannya. Mereka berdua akhirnya sepakat bekerja sama secara harmonis. Kancil membaca naskah kalimat demi kalimat dengan lantang, sementara Kura-kura menekan tombol keyboard dengan cermat menggunakan ritme yang stabil.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;"><i>"Kejujuran, kerja keras, dan gotong royong adalah pelindung hutan kita,"</i> ketik mereka bersama. Begitu tanda titik terakhir dimasukkan, layar memancarkan cahaya hijau kemilau. Pintu lumbung air terbuka perlahan dan mengalirkan air jernih yang menyegarkan seluruh satwa rimba.</p><div style="margin-top: 10px; padding: 8px 12px; background-color: #fefce8; border-left: 4px solid #eab308; font-size: 12px; color: #854d0e;"><b>Pesan Moral:</b> Sejak hari itu, Kancil belajar bahwa kecerdasan sejati lahir dari perpaduan antara kecepatan, kesabaran, dan kerendahan hati.</div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-15',
    title: 'Petualangan Arka: Misteri Observatorium dan Pompa Air Desa',
    category: 'Dasar Komputer',
    difficulty: 'Mahir',
    allocatedPoints: 130,
    minAccuracy: 85,
    targetWpm: 35,
    relatedQuizId: 'quiz-15',
    instructions: 'Ketik naskah cerita petualangan inspiratif berikut dengan format judul di tengah, paragraf menjorok (text-indent), istilah teknis tebal, dan rangkuman hikmah.',
    targetPlainText: `PETUALANGAN ARKA: MISTERI OBSERVATORIUM DAN POMPA AIR DESA\n\nPagi itu, kabut tipis masih menyelimuti lereng bukit bambu saat Arka, seorang anak berusia sebelas tahun yang gemar merakit perangkat elektronik, memulai perjalanannya. Di punggungnya terpasang ransel berisi perkakas ringan dan Bimo, sebuah robot sensorik kecil berkaki empat ciptaannya sendiri. Arka memiliki satu tekad kuat: memperbaiki sistem pompa air bertenaga surya di observatorium puncak bukit yang telah berhenti berputar selama sepekan.\n\nKekeringan telah membuat ladang sayur warga desa mulai menguning. Setibanya di bangunan observatorium berkubah tembaga, Arka membersihkan debu tebal yang menutupi terminal komputer utama. Layar monitor tabung tua itu berderit pelan saat dinyalakan, menampilkan antarmuka berbasis teks dengan kursor hijau yang berkedip menanti perintah. "Baterai surya masih terisi delapan puluh persen, Arka! Kita hanya perlu melakukan kalibrasi ulang sistem hidrolik pipa," lapor Bimo dengan suara logamnya yang khas.\n\nArka menarik napas panjang, merilekskan kedua bahunya, dan meletakkan sepuluh jarinya tepat di atas tombol home row papan ketik mekanikal kuno itu. Dengan ketenangan penuh dan konsentrasi tinggi, Arka mulai mengetikkan serangkaian kode instruksi: membuka katup utama, mengatur tekanan hidrolik sebesar lima bar, dan menyinkronkan putaran turbin dengan arus listrik tenaga surya. Setiap huruf, angka, dan simbol titik koma diketiknya dengan presisi sempurna tanpa melihat papan ketik.\n\nSesaat setelah tombol Enter ditekan, terdengar dengungan halus generator air yang mulai berputar kembali. Dari pipa-pipa penyalur di kaki bukit, air pegunungan yang jernih dan dingin kembali memancar deras membasahi tanah ladang desa. Sorak gembira para petani terdengar samar dari kejauhan. Arka menatap pemandangan indah dari puncak bukit sambil tersenyum puas, menyadari bahwa penguasaan teknologi komputer yang dipelajarinya di sekolah dapat memberikan manfaat nyata bagi kehidupan masyarakat.`,
    targetDocument: `<h4 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 4px;">PETUALANGAN ARKA: MISTERI OBSERVATORIUM DAN POMPA AIR DESA</h4><hr style="margin-bottom: 8px;"/><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Pagi itu, kabut tipis masih menyelimuti lereng bukit bambu saat <b>Arka</b>, seorang anak berusia sebelas tahun yang gemar merakit perangkat elektronik, memulai perjalanannya. Di punggungnya terpasang ransel berisi perkakas ringan dan <b>Bimo</b>, sebuah robot sensorik kecil berkaki empat ciptaannya sendiri. Arka memiliki satu tekad kuat: memperbaiki sistem pompa air bertenaga surya di observatorium puncak bukit yang telah berhenti berputar selama sepekan.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Kekeringan telah membuat ladang sayur warga desa mulai menguning. Setibanya di bangunan observatorium berkubah tembaga, Arka membersihkan debu tebal yang menutupi terminal komputer utama. Layar monitor tabung tua itu berderit pelan saat dinyalakan, menampilkan antarmuka berbasis teks dengan kursor hijau yang berkedip menanti perintah. <i>"Baterai surya masih terisi delapan puluh persen, Arka! Kita hanya perlu melakukan kalibrasi ulang sistem hidrolik pipa,"</i> lapor Bimo dengan suara logamnya yang khas.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Arka menarik napas panjang, merilekskan kedua bahunya, dan meletakkan sepuluh jarinya tepat di atas tombol <b>home row</b> papan ketik mekanikal kuno itu. Dengan ketenangan penuh dan konsentrasi tinggi, Arka mulai mengetikkan serangkaian kode instruksi: membuka katup utama, mengatur tekanan hidrolik sebesar <b>lima bar</b>, dan menyinkronkan putaran turbin dengan arus listrik tenaga surya. Setiap huruf, angka, dan simbol titik koma diketiknya dengan presisi sempurna tanpa melihat papan ketik.</p><p style="text-indent: 24px; text-align: justify; font-size: 13px; line-height: 1.6; margin: 6px 0;">Sesaat setelah tombol Enter ditekan, terdengar dengungan halus generator air yang mulai berputar kembali. Dari pipa-pipa penyalur di kaki bukit, air pegunungan yang jernih dan dingin kembali memancar deras membasahi tanah ladang desa. Sorak gembira para petani terdengar samar dari kejauhan.</p><div style="margin-top: 10px; padding: 8px 12px; background-color: #eff6ff; border-left: 4px solid #3b82f6; font-size: 12px; color: #1e40af;"><b>Hikmah Cerita:</b> Penguasaan keterampilan komputer dan ketenangan berpikir mampu memecahkan masalah nyata dan memberi manfaat besar bagi masyarakat.</div>`,
    createdAt: new Date().toISOString(),
  },
];
