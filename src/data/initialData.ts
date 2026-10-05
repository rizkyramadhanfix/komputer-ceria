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
];

// ==========================================
// DAFTAR BANK KUIS INTERAKTIF LENGKAP
// ==========================================
export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Jago Shortcut Microsoft Word',
    category: 'Aplikasi Kantor',
    description: 'Uji kecepatan jarimu menghafal tombol shortcut ajaib di Microsoft Word agar tugas selesai secepat kilat!',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1-1',
        questionText: 'Kombinasi tombol keyboard yang digunakan untuk membuat tulisan menjadi tebal (Bold) adalah...',
        options: ['Ctrl + B', 'Ctrl + D', 'Ctrl + T', 'Ctrl + I'],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Ctrl + B (Bold) digunakan untuk menebalkan teks yang dipilih.',
        weight: 20,
      },
      {
        id: 'q1-2',
        questionText: 'Shortcut apakah yang digunakan untuk menyimpan dokumen (Save) yang sedang kamu ketik?',
        options: ['Ctrl + O', 'Ctrl + S', 'Ctrl + P', 'Ctrl + A'],
        correctAnswerIndex: 1,
        explanation: 'Tepat sekali! Ctrl + S (Save) digunakan untuk menyimpan perubahan dokumen.',
        weight: 20,
      },
      {
        id: 'q1-3',
        questionText: 'Apa fungsi dari shortcut Ctrl + Z pada komputer?',
        options: ['Membatalkan perintah terakhir (Undo)', 'Menutup aplikasi', 'Memotong teks', 'Menyimpan dokumen'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Ctrl + Z adalah fungsi Undo untuk membatalkan kesalahan perintah sebelumnya.',
        weight: 20,
      },
      {
        id: 'q1-4',
        questionText: 'Untuk menyalin teks tanpa menghapus aslinya, tombol yang ditekan adalah...',
        options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + K'],
        correctAnswerIndex: 2,
        explanation: 'Keren! Ctrl + C (Copy) berfungsi menyalin teks ke papan klip.',
        weight: 20,
      },
      {
        id: 'q1-5',
        questionText: 'Pasangan dari tombol Copy (Ctrl + C) untuk menempelkan hasil salinan adalah...',
        options: ['Ctrl + V', 'Ctrl + P', 'Ctrl + L', 'Ctrl + A'],
        correctAnswerIndex: 0,
        explanation: 'Mantap! Ctrl + V (Paste) digunakan untuk menempelkan teks atau gambar yang disalin.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Detektif Perangkat Keras (Hardware Master)',
    category: 'Hardware',
    description: 'Buktikan kemampuanmu mengenali komponen otak komputer, memori, perangkat input, dan perangkat output!',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q2-1',
        questionText: 'Perangkat keras yang berfungsi sebagai otak utama pengolah data pada komputer adalah...',
        options: ['CPU (Processor)', 'Monitor', 'Keyboard', 'Speaker'],
        correctAnswerIndex: 0,
        explanation: 'Luar biasa! CPU (Central Processing Unit) adalah otak pemroses seluruh data komputer.',
        weight: 20,
      },
      {
        id: 'q2-2',
        questionText: 'Berikut ini yang termasuk ke dalam kelompok Perangkat Keluaran (Output Device) adalah...',
        options: ['Keyboard dan Mouse', 'Monitor dan Printer', 'Microphone dan Scanner', 'Flashdisk dan RAM'],
        correctAnswerIndex: 1,
        explanation: 'Benar! Monitor dan Printer menampilkan dan mencetak informasi hasil kerja komputer.',
        weight: 20,
      },
      {
        id: 'q2-3',
        questionText: 'Memori komputer yang bersifat sementara dan akan terhapus saat komputer dimatikan adalah...',
        options: ['Harddisk', 'Flashdisk', 'RAM (Random Access Memory)', 'CD-ROM'],
        correctAnswerIndex: 2,
        explanation: 'Tepat! RAM adalah memori volatile yang bekerja saat aplikasi sedang aktif dibuka.',
        weight: 20,
      },
      {
        id: 'q2-4',
        questionText: 'Papan sirkuit elektronik utama tempat semua komponen CPU, RAM, dan kabel terhubung disebut...',
        options: ['Motherboard', 'Keyboard', 'Harddisk', 'Monitor'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Motherboard adalah papan induk sirkuit utama komputer.',
        weight: 20,
      },
      {
        id: 'q2-5',
        questionText: 'Perangkat yang digunakan untuk mencetak teks atau gambar dari komputer ke kertas fisik adalah...',
        options: ['Scanner', 'Printer', 'Webcam', 'Plotter'],
        correctAnswerIndex: 1,
        explanation: 'Betul! Printer mencetak dokumen digital ke lembaran kertas nyata.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Petualang Windows & Manajemen File Folder',
    category: 'Dasar Komputer',
    description: 'Uji keahlianmu mengelola file, folder, Recycle Bin, dan navigasi antarmuka Windows.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q3-1',
        questionText: 'Kombinasi tombol shortcut keyboard untuk membuka File Explorer di Windows secara cepat adalah...',
        options: ['Windows + E', 'Windows + D', 'Windows + R', 'Windows + L'],
        correctAnswerIndex: 0,
        explanation: 'Hebat! Tombol Windows + E (Explorer) langsung membuka jendela File Explorer.',
        weight: 20,
      },
      {
        id: 'q3-2',
        questionText: 'Tempat penampungan digital untuk file yang baru saja dihapus sementara di Windows adalah...',
        options: ['Recycle Bin', 'Control Panel', 'Task Manager', 'Downloads'],
        correctAnswerIndex: 0,
        explanation: 'Tepat! Recycle Bin menyimpan file terhapus sehingga masih bisa dipulihkan (Restore).',
        weight: 20,
      },
      {
        id: 'q3-3',
        questionText: 'Ekstensi file (.extension) standar untuk dokumen Microsoft Word modern adalah...',
        options: ['.docx', '.mp3', '.jpg', '.xlsx'],
        correctAnswerIndex: 0,
        explanation: 'Benar! File dokumen Microsoft Word memiliki ekstensi .docx.',
        weight: 20,
      },
      {
        id: 'q3-4',
        questionText: 'Tombol keyboard pintas yang digunakan untuk mengganti nama (Rename) file yang dipilih adalah...',
        options: ['F1', 'F2', 'F5', 'F12'],
        correctAnswerIndex: 1,
        explanation: 'Keren! Menekan tombol fungsi F2 langsung mengaktifkan mode ganti nama file.',
        weight: 20,
      },
      {
        id: 'q3-5',
        questionText: 'Langkah yang benar saat ingin mematikan komputer desktop adalah...',
        options: [
          'Langsung mencabut kabel colokan listrik',
          'Klik Start -> Power -> Shut down',
          'Menekan tombol power monitor saja',
          'Membiarkannya menyala semalaman'
        ],
        correctAnswerIndex: 1,
        explanation: 'Bagus sekali! Selalu gunakan menu Start -> Shut down agar sistem dan file tetap aman.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-4',
    title: 'Jawara Mengetik 10 Jari & Posisi Keyboard',
    category: 'Format Word',
    description: 'Tunjukkan pemahamanmu mengenai posisi jari Home Row, tombol khusus, dan teknik mengetik cepat.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q4-1',
        questionText: 'Dua tombol pada keyboard yang memiliki tanda tonjolan kecil sebagai jangkar telunjuk adalah...',
        options: ['Tombol F dan J', 'Tombol A dan L', 'Tombol G dan H', 'Tombol C dan M'],
        correctAnswerIndex: 0,
        explanation: 'Pintar! Tombol F (telunjuk kiri) dan J (telunjuk kanan) adalah penanda posisi dasar Home Row.',
        weight: 20,
      },
      {
        id: 'q4-2',
        questionText: 'Jari apakah yang bertugas menekan tombol Spacebar (Spasi)?',
        options: ['Jari Telunjuk', 'Jari Kelingking', 'Kedua Ibu Jari (Jempol)', 'Jari Manis'],
        correctAnswerIndex: 2,
        explanation: 'Tepat! Kedua ibu jari bertugas menekan tombol spasi panjang di bagian bawah.',
        weight: 20,
      },
      {
        id: 'q4-3',
        questionText: 'Untuk membuat SATU huruf kapital saat mengetik tanpa menyalakan Caps Lock, kita menahan tombol...',
        options: ['Tombol Shift', 'Tombol Tab', 'Tombol Alt', 'Tombol Ctrl'],
        correctAnswerIndex: 0,
        explanation: 'Benar! Menahan tombol Shift bersamaan dengan huruf akan menghasilkan satu huruf kapital.',
        weight: 20,
      },
      {
        id: 'q4-4',
        questionText: 'Tombol yang berfungsi membuat baris baru ke bawah atau mengeksekusi perintah adalah...',
        options: ['Backspace', 'Enter', 'Spacebar', 'Escape'],
        correctAnswerIndex: 1,
        explanation: 'Keren! Tombol Enter memindahkan kursor ke baris baru di bawahnya.',
        weight: 20,
      },
      {
        id: 'q4-5',
        questionText: 'Perbedaan tombol Backspace dan Delete dalam menghapus teks adalah...',
        options: [
          'Backspace menghapus karakter di sebelah kiri kursor, Delete di sebelah kanan kursor',
          'Delete menghapus seluruh dokumen sekaligus',
          'Backspace hanya menghapus angka',
          'Keduanya tidak memiliki perbedaan'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tepat sekali! Backspace menghapus karakter di kiri kursor, sedangkan Delete menghapus di kanan kursor.',
        weight: 20,
      },
    ],
  },
  {
    id: 'quiz-5',
    title: 'Polisi Siber & Internet Sehat Ceria',
    category: 'Internet & Etika',
    description: 'Kuis kesadaran keamanan digital: cara melindungi kata sandi, mengenali bahaya phishing, dan netiket online.',
    allocatedPoints: 100,
    timeLimitMinutes: 10,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q5-1',
        questionText: 'Sikap yang benar jika menerima pesan WhatsApp dari nomor tak dikenal yang menyatakan kamu menang uang 100 juta adalah...',
        options: [
          'Langsung klik link tautan yang diberikan',
          'Kirimkan foto kartu identitas dan nomor rekening',
          'Abaikan dan laporkan pesan mencurigakan tersebut ke orang tua/guru',
          'Bagikan pesan ke seluruh grup teman sekelas'
        ],
        correctAnswerIndex: 2,
        explanation: 'Sangat bijak! Itu adalah modus penipuan phishing. Jangan pernah membuka link mencurigakan!',
        weight: 20,
      },
      {
        id: 'q5-2',
        questionText: 'Manakah contoh kata sandi (password) yang paling aman dan kuat?',
        options: ['12345678', 'namasaya', 'K0mput3r_C3r1a!#26', 'password123'],
        correctAnswerIndex: 2,
        explanation: 'Hebat! Password yang kuat menggabungkan huruf besar, huruf kecil, angka, dan simbol unik.',
        weight: 20,
      },
      {
        id: 'q5-3',
        questionText: 'Etika yang baik saat berkomunikasi dan berteman di ruang digital atau media sosial adalah...',
        options: [
          'Menulis komentar kasar dan mengejek teman',
          'Menggunakan bahasa santun, saling menghargai, dan tidak menyebarkan hoaks',
          'Membagikan password akun teman ke publik',
          'Mengambil foto orang lain tanpa izin'
        ],
        correctAnswerIndex: 1,
        explanation: 'Pintar! Bersikap santun dan saling menghargai menciptakan lingkungan internet yang positif dan ceria.',
        weight: 20,
      },
      {
        id: 'q5-4',
        questionText: 'Ikon gembok terkunci pada bilah alamat browser web (HTTPS) menandakan bahwa...',
        options: [
          'Website tersebut rusak',
          'Koneksi komunikasi data terenkripsi dan aman',
          'Komputer sedang kehabisan baterai',
          'Website tidak memiliki internet'
        ],
        correctAnswerIndex: 1,
        explanation: 'Tepat! Protokol HTTPS dengan ikon gembok memastikan data terlindungi secara aman.',
        weight: 20,
      },
      {
        id: 'q5-5',
        questionText: 'Apa yang wajib dilakukan setelah selesai menggunakan komputer di laboratorium sekolah atau warnet?',
        options: [
          'Membiarkan akun email dan media sosial tetap login',
          'Melakukan Logout (Keluar) dari semua akun pribadi',
          'Menghapus sistem operasi komputer',
          'Mengubah wallpaper komputer tanpa izin'
        ],
        correctAnswerIndex: 1,
        explanation: 'Bagus! Selalu logout dari akunmu agar tidak disalahgunakan oleh pengguna berikutnya.',
        weight: 20,
      },
    ],
  },
];

// ==========================================
// DAFTAR TUGAS LATIHAN MENGETIK MICROSOFT WORD
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
    instructions: 'Ketik ulang naskah surat resmi berikut dengan format kop surat, penomoran teratur, dan perataan teks yang rapi.',
    targetPlainText: `SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR\nJl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000\n\nNomor: 045/SDN2/KOMP/IX/2026\nLampiran: 1 (satu) Berkas Jadwal\nHal: Undangan Rapat Sosialisasi Program Literasi Komputer\n\nKepada Yth.\nBapak/Ibu Orang Tua / Wali Murid Kelas 5 dan 6\nDi Tempat\n\nDengan hormat,\n\nSehubungan dengan dimulainya tahun ajaran baru dan peluncuran kurikulum ekstrakurikuler komputer modern, kami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang akan dilaksanakan pada:\n\nHari, Tanggal: Sabtu, 24 Oktober 2026\nWaktu: Pukul 09.00 - 11.30 WIB\nTempat: Ruang Laboratorium Komputer Ceria Lt. 2\nAgenda Rapat: Sosialisasi modul pembelajaran digital, teknik mengetik 10 jari, dan pengenalan sistem portofolio siswa.\n\nMengingat pentingnya agenda tersebut bagi kelancaran belajar putra-putri kita, kehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya.\n\nDemikian surat undangan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.\n\nHormat kami,\nKepala Sekolah & Pembina Komputer`,
    targetDocument: `<div style="text-align: center; border-bottom: 2px solid #334155; padding-bottom: 6px; margin-bottom: 12px;"><h3 style="margin: 0; font-weight: bold; color: #1e3a8a;">SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR</h3><p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Jl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000</p></div><p><b>Nomor:</b> 045/SDN2/KOMP/IX/2026<br/><b>Lampiran:</b> 1 (satu) Berkas Jadwal<br/><b>Hal:</b> Undangan Rapat Sosialisasi Program Literasi Komputer</p><br/><p>Kepada Yth.<br/><b>Bapak/Ibu Orang Tua / Wali Murid Kelas 5 dan 6</b><br/>Di Tempat</p><br/><p>Dengan hormat,</p><p style="text-indent: 28px; text-align: justify;">Sehubungan dengan dimulainya tahun ajaran baru dan peluncuran kurikulum ekstrakurikuler komputer modern, kami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang akan dilaksanakan pada:</p><div style="margin-left: 28px; margin-top: 6px; margin-bottom: 6px;"><p style="margin: 2px 0;"><b>Hari, Tanggal:</b> Sabtu, 24 Oktober 2026</p><p style="margin: 2px 0;"><b>Waktu:</b> Pukul 09.00 - 11.30 WIB</p><p style="margin: 2px 0;"><b>Tempat:</b> Ruang Laboratorium Komputer Ceria Lt. 2</p><p style="margin: 2px 0;"><b>Agenda Rapat:</b> Sosialisasi modul pembelajaran digital, teknik mengetik 10 jari, dan pengenalan sistem portofolio siswa.</p></div><p style="text-indent: 28px; text-align: justify;">Mengingat pentingnya agenda tersebut bagi kelancaran belajar putra-putri kita, kehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya.</p><p style="text-indent: 28px; text-align: justify;">Demikian surat undangan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.</p><br/><p align="right">Hormat kami,<br/><br/><br/><b>Kepala Sekolah & Pembina Komputer</b></p>`,
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
    instructions: 'Ketik naskah jadwal pelajaran berikut dengan format judul tebal di tengah, daftar kegiatan berurutan, dan poin tata tertib.',
    targetPlainText: `JADWAL PRAKTIKUM & TATA TERTIB LABORATORIUM KOMPUTER CERIA\nTAHUN AJARAN 2026/2027\n\nJadwal Kegiatan Pembelajaran:\n1. Hari Senin (08.00 - 09.30) : Pengenalan Perangkat Keras dan Perakitan Komputer\n2. Hari Selasa (08.00 - 09.30) : Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari\n3. Hari Rabu (08.00 - 09.30) : Pemformatan Dokumen dan Tabel Microsoft Word\n4. Hari Kamis (08.00 - 09.30) : Dasar Rumus dan Lembar Kerja Microsoft Excel\n5. Hari Jumat (08.00 - 09.30) : Keamanan Siber, Netiket, dan Kuis Interaktif\n6. Hari Sabtu (08.00 - 10.00) : Praktikum Mandiri, Desain Kreatif, dan Liga Mengetik\n\nTata Tertib Wajib Laboratorium Komputer:\n- Seluruh siswa wajib hadir tepat waktu dan melepas alas kaki di rak yang telah disediakan.\n- Dilarang keras membawa makanan, minuman, dan benda cair ke meja komputer.\n- Gunakan keyboard, mouse, dan monitor dengan wajar tanpa menekan tuts terlalu keras.\n- Lakukan proses penyimpanan (Save) dokumen secara berkala untuk menghindari kehilangan data.\n- Matikan komputer melalui prosedur Shut down yang benar sebelum meninggalkan ruangan.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">JADWAL PRAKTIKUM & TATA TERTIB LABORATORIUM KOMPUTER CERIA</h3><p align="center" style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 0;">Tahun Ajaran 2026/2027</p><hr/><h4 style="font-weight: bold; color: #0f172a; margin-top: 10px; margin-bottom: 4px;">Jadwal Kegiatan Pembelajaran:</h4><ol style="margin-top: 4px; padding-left: 20px; line-height: 1.6;"><li><b>Hari Senin (08.00 - 09.30)</b> : Pengenalan Perangkat Keras dan Perakitan Komputer</li><li><b>Hari Selasa (08.00 - 09.30)</b> : Pelatihan Kecepatan dan Ketepatan Mengetik 10 Jari</li><li><b>Hari Rabu (08.00 - 09.30)</b> : Pemformatan Dokumen dan Tabel Microsoft Word</li><li><b>Hari Kamis (08.00 - 09.30)</b> : Dasar Rumus dan Lembar Kerja Microsoft Excel</li><li><b>Hari Jumat (08.00 - 09.30)</b> : Keamanan Siber, Netiket, dan Kuis Interaktif</li><li><b>Hari Sabtu (08.00 - 10.00)</b> : Praktikum Mandiri, Desain Kreatif, dan Liga Mengetik</li></ol><h4 style="font-weight: bold; color: #b91c1c; margin-top: 10px; margin-bottom: 4px;">Tata Tertib Wajib Laboratorium Komputer:</h4><ul style="margin-top: 4px; padding-left: 20px; line-height: 1.6; list-style-type: square;"><li>Seluruh siswa wajib hadir tepat waktu dan melepas alas kaki di rak yang telah disediakan.</li><li>Dilarang keras membawa makanan, minuman, dan benda cair ke meja komputer.</li><li>Gunakan keyboard, mouse, dan monitor dengan wajar tanpa menekan tuts terlalu keras.</li><li>Lakukan proses penyimpanan (Save) dokumen secara berkala untuk menghindari kehilangan data.</li><li>Matikan komputer melalui prosedur Shut down yang benar sebelum meninggalkan ruangan.</li></ul>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-3',
    title: 'Cerita Edukatif: "Petualangan Kucing Robot Di Dunia Koding"',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    instructions: 'Ketik naskah cerita inspiratif berikut dengan format paragraf menjorok dan perataan Justify (Rata Kiri-Kanan).',
    targetPlainText: `PETUALANGAN KUCING ROBOT DI DUNIA KODING\nKarya: Sahabat Komputer Ceria\n\nDi sebuah kota digital bernama Byteville, hiduplah seekor kucing robot pintar bernama Pixel. Pixel memiliki bulu bercahaya biru neon dan ekor antena lentur yang dapat memancarkan gelombang sinyal internet tercepat di dunia. Setiap fajar menyingsing, Pixel berkeliling ke sekolah-sekolah untuk membagikan semangat belajar teknologi kepada anak-anak.\n\n"Belajar komputer dan logika koding itu sesungguhnya sangat menyenangkan," kata Pixel sambil tersenyum ramah kepada para siswa. "Sama halnya seperti menyusun balok-balok lego warna-warni, kita hanya perlu menempatkan instruksi langkah demi langkah secara runtut dan teratur agar komputer dapat mengerti apa yang kita inginkan."\n\nSuatu siang, perpustakaan digital Byteville mendadak mengalami kendala teknis karena sebuah tanda titik koma yang terhapus dari baris kode utama. Dengan ketenangan dan ketangkasan mengetik sepuluh jari, Pixel bersama anak-anak kelas komputer bergotong royong memeriksa setiap baris perintah dan berhasil memperbaiki naskah program tersebut sebelum jam pelajaran berakhir.\n\nPeristiwa itu mengajarkan sebuah pelajaran berharga bahwa ketelitian, ketekunan, dan rasa ingin tahu yang tinggi adalah kunci utama untuk menaklukkan kecanggihan teknologi. Sejak saat itu, seluruh siswa semakin antusias berlatih mengetik dan berkreasi membuat karya digital yang membanggakan.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">PETUALANGAN KUCING ROBOT DI DUNIA KODING</h3><p align="center" style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 0;">Karya: Sahabat Komputer Ceria</p><br/><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Di sebuah kota digital bernama Byteville, hiduplah seekor kucing robot pintar bernama <b>Pixel</b>. Pixel memiliki bulu bercahaya biru neon dan ekor antena lentur yang dapat memancarkan gelombang sinyal internet tercepat di dunia. Setiap fajar menyingsing, Pixel berkeliling ke sekolah-sekolah untuk membagikan semangat belajar teknologi kepada anak-anak.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;"><i>"Belajar komputer dan logika koding itu sesungguhnya sangat menyenangkan,"</i> kata Pixel sambil tersenyum ramah kepada para siswa. <i>"Sama halnya seperti menyusun balok-balok lego warna-warni, kita hanya perlu menempatkan instruksi langkah demi langkah secara runtut dan teratur agar komputer dapat mengerti apa yang kita inginkan."</i></p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Suatu siang, perpustakaan digital Byteville mendadak mengalami kendala teknis karena sebuah tanda titik koma yang terhapus dari baris kode utama. Dengan ketenangan dan ketangkasan mengetik sepuluh jari, Pixel bersama anak-anak kelas komputer bergotong royong memeriksa setiap baris perintah dan berhasil memperbaiki naskah program tersebut sebelum jam pelajaran berakhir.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Peristiwa itu mengajarkan sebuah pelajaran berharga bahwa <b>ketelitian, ketekunan, dan rasa ingin tahu yang tinggi</b> adalah kunci utama untuk menaklukkan kecanggihan teknologi. Sejak saat itu, seluruh siswa semakin antusias berlatih mengetik dan berkreasi membuat karya digital yang membanggakan.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-4',
    title: 'Laporan Sains & Teknologi: Arsitektur Komputer Modern',
    category: 'Dasar Komputer',
    difficulty: 'Mahir',
    allocatedPoints: 100,
    minAccuracy: 85,
    targetWpm: 35,
    instructions: 'Ketik laporan observasi perangkat keras komputer dengan format subjudul angka, teks tebal, dan paragraf penjelas.',
    targetPlainText: `LAPORAN PENGAMATAN LABORATORIUM KOMPUTER\nTopik: Anatomi dan Arsitektur Komputer Desktop Modern\n\n1. Unit Pemrosesan Pusat (Central Processing Unit / CPU)\nProcessor bertindak sebagai otak utama dari seluruh arsitektur komputer. Komponen ini bertanggung jawab mengeksekusi miliaran instruksi komputasi per detik dan bekerja sama dengan chipset motherboard untuk mengoordinasikan arus data secara stabil.\n\n2. Memori Utama (RAM) dan Media Penyimpanan (SSD NVMe)\nRandom Access Memory (RAM) bertugas menyimpan data sementara aplikasi yang sedang aktif agar dapat diakses seketika tanpa hambatan. Sementara itu, Solid State Drive (SSD) berbasis teknologi chip flash menyimpan sistem operasi dan berkas pengguna secara permanen dengan kecepatan transfer berkali lipat lebih cepat daripada cakram magnetik konvensional.\n\n3. Unit Pemroses Grafis (GPU) dan Monitor Tampilan\nKartu grafis modern bertugas merender tampilan visual dua dimensi maupun objek tiga dimensi secara halus. Output visual tersebut diproyeksikan ke monitor berpanel IPS dengan refresh rate optimal agar mata pengguna tetap nyaman selama beraktivitas.\n\n4. Perangkat Input Ergonomis dan Antarmuka Interaktif\nPapan ketik mekanikal dan mouse optik presisi tinggi memastikan setiap sentuhan jari terkonversi menjadi perintah digital yang responsif, akurat, dan minim kesalahan ketik.\n\nKesimpulan Observasi:\nKombinasi harmonis antara perangkat keras yang terawat baik dan penerapan sistem operasi yang bersih akan menghasilkan performa komputasi optimal yang mendukung produktivitas belajar siswa.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">LAPORAN PENGAMATAN LABORATORIUM KOMPUTER</h3><p align="center" style="font-size: 11px; text-decoration: underline; color: #475569; margin-top: 0;">Topik: Anatomi dan Arsitektur Komputer Desktop Modern</p><br/><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">1. Unit Pemrosesan Pusat (Central Processing Unit / CPU)</h4><p style="text-align: justify; line-height: 1.6; margin-top: 2px;">Processor bertindak sebagai otak utama dari seluruh arsitektur komputer. Komponen ini bertanggung jawab mengeksekusi miliaran instruksi komputasi per detik dan bekerja sama dengan chipset motherboard untuk mengoordinasikan arus data secara stabil.</p><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">2. Memori Utama (RAM) dan Media Penyimpanan (SSD NVMe)</h4><p style="text-align: justify; line-height: 1.6; margin-top: 2px;">Random Access Memory (RAM) bertugas menyimpan data sementara aplikasi yang sedang aktif agar dapat diakses seketika tanpa hambatan. Sementara itu, Solid State Drive (SSD) berbasis teknologi chip flash menyimpan sistem operasi dan berkas pengguna secara permanen dengan kecepatan transfer berkali lipat lebih cepat daripada cakram magnetik konvensional.</p><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">3. Unit Pemroses Grafis (GPU) dan Monitor Tampilan</h4><p style="text-align: justify; line-height: 1.6; margin-top: 2px;">Kartu grafis modern bertugas merender tampilan visual dua dimensi maupun objek tiga dimensi secara halus. Output visual tersebut diproyeksikan ke monitor berpanel IPS dengan refresh rate optimal agar mata pengguna tetap nyaman selama beraktivitas.</p><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">4. Perangkat Input Ergonomis dan Antarmuka Interaktif</h4><p style="text-align: justify; line-height: 1.6; margin-top: 2px;">Papan ketik mekanikal dan mouse optik presisi tinggi memastikan setiap sentuhan jari terkonversi menjadi perintah digital yang responsif, akurat, dan minim kesalahan ketik.</p><br/><p style="text-align: justify; line-height: 1.6;"><b>Kesimpulan Observasi:</b><br/><i>Kombinasi harmonis antara perangkat keras yang terawat baik dan penerapan sistem operasi yang bersih akan menghasilkan performa komputasi optimal yang mendukung produktivitas belajar siswa.</i></p>`,
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
    instructions: 'Ketik naskah proposal kegiatan berikut dengan format subjudul tebal, butir tujuan, dan estimasi waktu yang teratur.',
    targetPlainText: `PROPOSAL KEGIATAN PEKAN KREATIVITAS DIGITAL PELAJAR\nTEMA: "BERKARYA NYATA MENUJU GENERASI EMAS DIGITAL"\n\nI. Latar Belakang Kegiatan\nPerkembangan teknologi informasi saat ini menuntut generasi muda untuk tidak sekadar menjadi konsumen digital, melainkan mampu menjadi pencipta karya yang berdaya guna. Melalui ajang Pekan Kreativitas Digital, siswa diajak untuk mengekspresikan bakat dan keterampilan komputer secara sportif dan kompetitif.\n\nII. Tujuan Penyelenggaraan\n1. Menumbuhkan minat dan rasa percaya diri siswa dalam mengoperasikan aplikasi komputer perkantoran dan desain visual.\n2. Melatih ketangkasan serta kecepatan mengetik sepuluh jari sebagai modal berharga tugas sekolah masa kini.\n3. Mempererat tali persahabatan antaranggota ekstrakurikuler komputer melalui kompetisi yang sehat.\n\nIII. Cabang Lomba yang Diselenggarakan\n- Lomba Kecepatan dan Akurasi Mengetik Naskah Word (Liga 10 Jari)\n- Lomba Desain Poster Digital Menggunakan Aplikasi Paint dan Canva\n- Lomba Cerdas Cermat Komputer dan Keamanan Siber Cilik\n\nIV. Waktu dan Lokasi Pelaksanaan\nHari, Tanggal: Senin - Rabu, 16 - 18 November 2026\nWaktu: Pukul 13.30 - 16.00 WIB\nTempat: Gedung Laboratorium Komputer dan Multimedia Sekolah\n\nDemikian rancangan proposal kegiatan ini kami susun dengan sungguh-sungguh. Bimbingan dan dukungan dari Bapak/Ibu guru sangat kami harapkan demi kesuksesan agenda ini.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">PROPOSAL KEGIATAN PEKAN KREATIVITAS DIGITAL PELAJAR</h3><p align="center" style="font-size: 11px; font-weight: bold; color: #b45309; margin-top: 0;">TEMA: "BERKARYA NYATA MENUJU GENERASI EMAS DIGITAL"</p><hr/><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">I. Latar Belakang Kegiatan</h4><p style="text-indent: 28px; text-align: justify; line-height: 1.6; margin-top: 2px;">Perkembangan teknologi informasi saat ini menuntut generasi muda untuk tidak sekadar menjadi konsumen digital, melainkan mampu menjadi pencipta karya yang berdaya guna. Melalui ajang Pekan Kreativitas Digital, siswa diajak untuk mengekspresikan bakat dan keterampilan komputer secara sportif dan kompetitif.</p><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">II. Tujuan Penyelenggaraan</h4><ol style="margin-top: 2px; padding-left: 20px; line-height: 1.6;"><li>Menumbuhkan minat dan rasa percaya diri siswa dalam mengoperasikan aplikasi komputer perkantoran dan desain visual.</li><li>Melatih ketangkasan serta kecepatan mengetik sepuluh jari sebagai modal berharga tugas sekolah masa kini.</li><li>Mempererat tali persahabatan antaranggota ekstrakurikuler komputer melalui kompetisi yang sehat.</li></ol><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">III. Cabang Lomba yang Diselenggarakan</h4><ul style="margin-top: 2px; padding-left: 20px; line-height: 1.6; list-style-type: square;"><li>Lomba Kecepatan dan Akurasi Mengetik Naskah Word (Liga 10 Jari)</li><li>Lomba Desain Poster Digital Menggunakan Aplikasi Paint dan Canva</li><li>Lomba Cerdas Cermat Komputer dan Keamanan Siber Cilik</li></ul><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">IV. Waktu dan Lokasi Pelaksanaan</h4><p style="margin-left: 20px; line-height: 1.6;"><b>Hari, Tanggal:</b> Senin - Rabu, 16 - 18 November 2026<br/><b>Waktu:</b> Pukul 13.30 - 16.00 WIB<br/><b>Tempat:</b> Gedung Laboratorium Komputer dan Multimedia Sekolah</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Demikian rancangan proposal kegiatan ini kami susun dengan sungguh-sungguh. Bimbingan dan dukungan dari Bapak/Ibu guru sangat kami harapkan demi kesuksesan agenda ini.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-6',
    title: 'Artikel Edukasi: "Netiket & Panduan Bijak Menjaga Jejak Digital"',
    category: 'Dasar Komputer',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    instructions: 'Ketik artikel panduan berinternet sehat berikut dengan format subjudul bernomor dan kutipan berbingkai rapi.',
    targetPlainText: `ETIKA BERINTERNET (NETIKET) DAN JEJAK DIGITAL POSITIF\nDisusun oleh Tim Edukasi Siber Komputer Ceria\n\nRuang maya internet adalah dunia kedua bagi masyarakat modern saat ini. Segala aktivitas, tulisan komentar, maupun foto yang kita unggah akan meninggalkan jejak digital permanen yang sulit untuk dihapus sepenuhnya. Oleh karena itu, memahami etika berkomunikasi digital (Netiket) merupakan benteng utama bagi keselamatan generasi muda.\n\nEmpat Prinsip Emas Berselancar Sehat di Dunia Maya:\n\n1. Terapkan Rumus T.H.I.N.K Sebelum Menulis Komentar\nPastikan apa yang kita ketik memenuhi kriteria: True (Benar faktanya), Helpful (Membantu sesama), Inspiring (Menginspirasi), Necessary (Diperlukan), dan Kind (Santun tanpa menyinggung perasaan orang lain).\n\n2. Lindungi Informasi Rahasia Akun Pribadi\nJangan pernah membagikan kata sandi (password), nomor induk siswa, nomor telepon keluarga, maupun alamat tempat tinggal kepada orang asing di internet atau game online.\n\n3. Hargai Hak Cipta dan Karya Orang Lain\nKetika menyalin informasi atau mengunduh gambar untuk kebutuhan tugas sekolah, biasakan untuk selalu menyertakan nama pencipta dan tautan sumber referensi resmi.\n\n4. Berani Melaporkan Modus Kejahatan Siber\nApabila menerima tautan mencurigakan yang meminta data rahasia atau menjumpai perilaku perundungan maya (cyberbullying), segera laporkan kepada orang tua atau guru pembina.\n\nKesimpulan:\nMari bersama-sama membangun lingkungan digital Indonesia yang cerdas, aman, ramah, dan penuh dengan karya-karya yang membanggakan bangsa.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">ETIKA BERINTERNET (NETIKET) DAN JEJAK DIGITAL POSITIF</h3><p align="center" style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 0;">Disusun oleh Tim Edukasi Siber Komputer Ceria</p><br/><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Ruang maya internet adalah dunia kedua bagi masyarakat modern saat ini. Segala aktivitas, tulisan komentar, maupun foto yang kita unggah akan meninggalkan jejak digital permanen yang sulit untuk dihapus sepenuhnya. Oleh karena itu, memahami etika berkomunikasi digital (Netiket) merupakan benteng utama bagi keselamatan generasi muda.</p><h4 style="font-weight: bold; color: #0284c7; margin-top: 10px; margin-bottom: 4px;">Empat Prinsip Emas Berselancar Sehat di Dunia Maya:</h4><p style="text-align: justify; line-height: 1.6;"><b>1. Terapkan Rumus T.H.I.N.K Sebelum Menulis Komentar</b><br/>Pastikan apa yang kita ketik memenuhi kriteria: True (Benar faktanya), Helpful (Membantu sesama), Inspiring (Menginspirasi), Necessary (Diperlukan), dan Kind (Santun tanpa menyinggung perasaan orang lain).</p><p style="text-align: justify; line-height: 1.6;"><b>2. Lindungi Informasi Rahasia Akun Pribadi</b><br/>Jangan pernah membagikan kata sandi (password), nomor induk siswa, nomor telepon keluarga, maupun alamat tempat tinggal kepada orang asing di internet atau game online.</p><p style="text-align: justify; line-height: 1.6;"><b>3. Hargai Hak Cipta dan Karya Orang Lain</b><br/>Ketika menyalin informasi atau mengunduh gambar untuk kebutuhan tugas sekolah, biasakan untuk selalu menyertakan nama pencipta dan tautan sumber referensi resmi.</p><p style="text-align: justify; line-height: 1.6;"><b>4. Berani Melaporkan Modus Kejahatan Siber</b><br/>Apabila menerima tautan mencurigakan yang meminta data rahasia atau menjumpai perilaku perundungan maya (cyberbullying), segera laporkan kepada orang tua atau guru pembina.</p><br/><div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px; font-size: 12px; color: #166534;"><b>Kesimpulan:</b> Mari bersama-sama membangun lingkungan digital Indonesia yang cerdas, aman, ramah, dan penuh dengan karya-karya yang membanggakan bangsa.</div>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-7',
    title: 'Standar Operasional Prosedur (SOP) Perawatan Komputer',
    category: 'Aplikasi Kantor',
    difficulty: 'Mahir',
    allocatedPoints: 95,
    minAccuracy: 85,
    targetWpm: 32,
    instructions: 'Ketik naskah prosedur operasional berikut dengan format tiga tahapan terstruktur dan daftar poin penjelas.',
    targetPlainText: `STANDAR OPERASIONAL PROSEDUR (SOP) LABORATORIUM KOMPUTER\nBAGIAN: PENGGUNAAN DAN PERAWATAN PERANGKAT KERAS SEKOLAH\n\nTahap 1: Persiapan Sebelum Menyalakan Komputer\n1. Pastikan area meja komputer dan lantai dalam keadaan kering dan bersih dari tumpahan cairan.\n2. Periksa colokan kabel power pada stopkontak dan stabilizer untuk memastikan aliran listrik tersambung dengan aman.\n3. Tekan tombol Power pada unit CPU terlebih dahulu, kemudian nyalakan layar monitor dan tunggu proses booting sistem operasi selesai sempurna.\n\nTahap 2: Selama Sesi Praktikum Berlangsung\n1. Masuk ke akun siswa menggunakan username dan kata sandi yang telah dibagikan secara resmi.\n2. Dilarang mengubah konfigurasi sistem operasi atau wallpaper komputer tanpa izin guru pembina.\n3. Jangan mencabut flashdisk secara mendadak; gunakan selalu fitur "Eject / Safely Remove Hardware" pada taskbar Windows.\n4. Apabila terjadi kendala blue screen atau aplikasi berhenti mendadak, segera hubungi instruktur lab.\n\nTahap 3: Prosedur Selesai dan Shutdown\n1. Simpan seluruh dokumen pekerjaan ke folder pribadi dan tutup seluruh jendela aplikasi yang terbuka.\n2. Klik menu Start, pilih ikon Power, lalu klik tombol "Shut down". Tunggu hingga lampu indikator CPU padam sepenuhnya.\n3. Matikan monitor melalui tombol fisik di sisi bawah layar, rapikan posisi mouse dan keyboard, lalu masukkan kursi ke bawah meja dengan rapi.`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">STANDAR OPERASIONAL PROSEDUR (SOP) LABORATORIUM KOMPUTER</h3><p align="center" style="font-size: 11px; font-weight: bold; color: #64748b; margin-top: 0;">BAGIAN: PENGGUNAAN DAN PERAWATAN PERANGKAT KERAS SEKOLAH</p><hr/><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">Tahap 1: Persiapan Sebelum Menyalakan Komputer</h4><ol style="margin-top: 2px; padding-left: 20px; line-height: 1.6;"><li>Pastikan area meja komputer dan lantai dalam keadaan kering dan bersih dari tumpahan cairan.</li><li>Periksa colokan kabel power pada stopkontak dan stabilizer untuk memastikan aliran listrik tersambung dengan aman.</li><li>Tekan tombol Power pada unit CPU terlebih dahulu, kemudian nyalakan layar monitor dan tunggu proses booting sistem operasi selesai sempurna.</li></ol><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">Tahap 2: Selama Sesi Praktikum Berlangsung</h4><ol style="margin-top: 2px; padding-left: 20px; line-height: 1.6;"><li>Masuk ke akun siswa menggunakan username dan kata sandi yang telah dibagikan secara resmi.</li><li>Dilarang mengubah konfigurasi sistem operasi atau wallpaper komputer tanpa izin guru pembina.</li><li>Jangan mencabut flashdisk secara mendadak; gunakan selalu fitur "Eject / Safely Remove Hardware" pada taskbar Windows.</li><li>Apabila terjadi kendala blue screen atau aplikasi berhenti mendadak, segera hubungi instruktur lab.</li></ol><h4 style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">Tahap 3: Prosedur Selesai dan Shutdown</h4><ol style="margin-top: 2px; padding-left: 20px; line-height: 1.6;"><li>Simpan seluruh dokumen pekerjaan ke folder pribadi dan tutup seluruh jendela aplikasi yang terbuka.</li><li>Klik menu Start, pilih ikon Power, lalu klik tombol "Shut down". Tunggu hingga lampu indikator CPU padam sepenuhnya.</li><li>Matikan monitor melalui tombol fisik di sisi bawah layar, rapikan posisi mouse dan keyboard, lalu masukkan kursi ke bawah meja dengan rapi.</li></ol>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-8',
    title: 'Naskah Pidato Pelajar: "Generasi Muda Tangguh Cerdas Digital"',
    category: 'Format Word',
    difficulty: 'Mahir',
    allocatedPoints: 100,
    minAccuracy: 85,
    targetWpm: 35,
    instructions: 'Ketik naskah pidato resmi berikut dengan format paragraf pidato, penekanan teks tebal, dan salam penutup santun.',
    targetPlainText: `GENERASI MUDA TANGGUH CERDAS DIGITAL MENATAP MASA DEPAN\nNaskah Pidato Perwakilan Siswa Ekstrakurikuler Komputer\n\nSelamat pagi kepada Bapak dan Ibu guru yang kami muliakan, serta rekan-rekan seperjuangan yang kami banggakan.\n\nMarilah kita panjatkan puji dan rasa syukur ke hadirat Tuhan Yang Maha Kuasa, karena berkat limpahan rahmat-Nya kita dapat berkumpul di ruangan laboratorium komputer yang penuh inspirasi ini dalam keadaan sehat walafiat.\n\nHadirin yang kami hormati,\nKita saat ini tengah berdiri di ambang peradaban modern abad kedua puluh satu, di mana kecerdasan buatan, jaringan internet, dan teknologi komputasi telah merasuk ke dalam setiap sendi kehidupan manusia. Komputer tidak lagi sekadar menjadi perangkat untuk mengetik lembaran tugas atau menonton video hiburan, melainkan telah bermetamorfosis menjadi jendela ilmu pengetahuan dunia tanpa batas.\n\nUntuk menyongsong masa depan yang gemilang tersebut, ada tiga kunci utama yang harus kita genggam teguh bersama-sama:\nPertama, miliki rasa ingin tahu yang tidak pernah padam untuk terus mempelajari hal-hal baru di bidang teknologi.\nKedua, biasakan diri untuk bekerja dengan teliti, disiplin, dan pantang berputus asa ketika menghadapi kegagalan program.\nKetiga, jadikan etika dan moral digital sebagai pedoman utama agar setiap karya yang kita ciptakan membawa maslahat bagi nusa dan bangsa.\n\nMari kita manfaatkan setiap detik di laboratorium komputer ceria ini untuk menempa potensi diri, menari lincah di atas papan ketik sepuluh jari, dan mencetak prestasi gemilang yang mengharumkan nama sekolah tercinta.\n\nSekian pidato yang dapat kami sampaikan. Mohon maaf atas segala kekhilafan kata. Terima kasih atas perhatian hadirin sekalian.\n\nSelamat pagi dan salam semangat teknologi!`,
    targetDocument: `<h3 align="center" style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">GENERASI MUDA TANGGUH CERDAS DIGITAL MENATAP MASA DEPAN</h3><p align="center" style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 0;">Naskah Pidato Perwakilan Siswa Ekstrakurikuler Komputer</p><br/><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Selamat pagi kepada Bapak dan Ibu guru yang kami muliakan, serta rekan-rekan seperjuangan yang kami banggakan.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Marilah kita panjatkan puji dan rasa syukur ke hadirat Tuhan Yang Maha Kuasa, karena berkat limpahan rahmat-Nya kita dapat berkumpul di ruangan laboratorium komputer yang penuh inspirasi ini dalam keadaan sehat walafiat.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Hadirin yang kami hormati,<br/>Kita saat ini tengah berdiri di ambang peradaban modern abad kedua puluh satu, di mana kecerdasan buatan, jaringan internet, dan teknologi komputasi telah merasuk ke dalam setiap sendi kehidupan manusia. Komputer tidak lagi sekadar menjadi perangkat untuk mengetik lembaran tugas atau menonton video hiburan, melainkan telah bermetamorfosis menjadi jendela ilmu pengetahuan dunia tanpa batas.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Untuk menyongsong masa depan yang gemilang tersebut, ada <b>tiga kunci utama</b> yang harus kita genggam teguh bersama-sama:<br/><b>Pertama</b>, miliki rasa ingin tahu yang tidak pernah padam untuk terus mempelajari hal-hal baru di bidang teknologi.<br/><b>Kedua</b>, biasakan diri untuk bekerja dengan teliti, disiplin, dan pantang berputus asa ketika menghadapi kegagalan program.<br/><b>Ketiga</b>, jadikan etika dan moral digital sebagai pedoman utama agar setiap karya yang kita ciptakan membawa maslahat bagi nusa dan bangsa.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Mari kita manfaatkan setiap detik di laboratorium komputer ceria ini untuk menempa potensi diri, menari lincah di atas papan ketik sepuluh jari, dan mencetak prestasi gemilang yang mengharumkan nama sekolah tercinta.</p><p style="text-indent: 28px; text-align: justify; line-height: 1.6;">Sekian pidato yang dapat kami sampaikan. Mohon maaf atas segala kekhilafan kata. Terima kasih atas perhatian hadirin sekalian.<br/><br/><b>Selamat pagi dan salam semangat teknologi!</b></p>`,
    createdAt: new Date().toISOString(),
  },
];
