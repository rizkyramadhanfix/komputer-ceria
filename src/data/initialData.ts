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
  phonePrimary: '0812-3456-7890',
  phoneSecondary: '0857-1122-3344',
  email: 'ekskul.komputer@sekolah.sch.id',
  address: 'Sekretariat Pusat Laboratorium Komputer Ceria, Gedung Ekstrakurikuler Indonesia',
  operationalHours: 'Senin - Sabtu: Pukul 08.00 - 16.00 WIB',
  socialIg: '@komputerceria_official',
  socialYt: 'Komputer Ceria Channel',
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
      description: 'Langkah awal mengenal dunia komputer dan teknologi informasi.',
    },
    {
      tier: 'Bronze',
      label: 'Bronze Achiever',
      minPoints: 100,
      color: 'amber',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-400 dark:border-amber-700',
      textColor: 'text-amber-800 dark:text-amber-300',
      description: 'Mulai menguasai dasar-dasar perangkat keras dan pengetikan.',
    },
    {
      tier: 'Silver',
      label: 'Silver Specialist',
      minPoints: 250,
      color: 'blue',
      accentBg: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-400 dark:border-sky-700',
      textColor: 'text-sky-800 dark:text-sky-300',
      description: 'Mahir dalam aplikasi perkantoran, format dokumen, dan kuis komputer.',
    },
    {
      tier: 'Gold',
      label: 'Gold Master',
      minPoints: 500,
      color: 'yellow',
      accentBg: 'bg-yellow-50 dark:bg-yellow-950/40',
      borderColor: 'border-yellow-500 dark:border-yellow-600',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      description: 'Tangkas mengetik 10 jari dengan akurasi tinggi dan penguasaan materi mendalam.',
    },
    {
      tier: 'Diamond',
      label: 'Diamond Champion',
      minPoints: 1000,
      color: 'indigo',
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-400 dark:border-indigo-600',
      textColor: 'text-indigo-800 dark:text-indigo-300',
      description: 'Peringkat tertinggi! Menjadi teladan dan juara ekstrakurikuler komputer.',
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
    title: 'Surat Izin Resmi Sekolah (Format Standar)',
    category: 'Format Word',
    difficulty: 'Mudah',
    allocatedPoints: 80,
    minAccuracy: 75,
    targetWpm: 25,
    instructions: 'Ketik ulang naskah surat izin sekolah berikut ini dengan format perataan teks yang rapi dan benar.',
    targetPlainText: `Bogor, 12 Oktober 2026\n\nHal: Permohonan Izin Tidak Masuk Sekolah\n\nKepada Yth.\nBapak/Ibu Guru Wali Kelas 5\nSD Negeri Sukadamai 2 Bogor\n\nDengan hormat,\n\nDengan surat ini, saya orang tua/wali murid dari:\nNama: Budi Pratama\nKelas: 5 (Lima)\n\nMemberitahukan bahwa anak kami tidak dapat mengikuti kegiatan belajar mengajar pada hari ini karena sedang kurang sehat dan beristirahat di rumah.\n\nDemikian surat permohonan izin ini kami sampaikan. Atas perhatian Bapak/Ibu Guru, kami ucapkan terima kasih.\n\nHormat kami,\nOrang Tua Murid`,
    targetDocument: `<p align="right"><b>Bogor, 12 Oktober 2026</b></p><br/><p><b>Hal:</b> Permohonan Izin Tidak Masuk Sekolah</p><p>Kepada Yth.<br/><b>Bapak/Ibu Guru Wali Kelas 5</b><br/>SD Negeri Sukadamai 2 Bogor</p><br/><p>Dengan hormat,</p><p style="text-indent: 30px;">Dengan surat ini, saya orang tua/wali murid dari:</p><p style="margin-left: 30px;"><b>Nama:</b> Budi Pratama<br/><b>Kelas:</b> 5 (Lima)</p><p style="text-indent: 30px;">Memberitahukan bahwa anak kami tidak dapat mengikuti kegiatan belajar mengajar pada hari ini karena sedang kurang sehat dan beristirahat di rumah.</p><p style="text-indent: 30px;">Demikian surat permohonan izin ini kami sampaikan. Atas perhatian Bapak/Ibu Guru, kami ucapkan terima kasih.</p><br/><p align="right">Hormat kami,<br/><br/><br/><b>( Orang Tua Murid )</b></p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-2',
    title: 'Tabel Jadwal Pelajaran Mingguan Ceria',
    category: 'Aplikasi Kantor',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    instructions: 'Ketik naskah jadwal pelajaran berikut dengan format judul tebal di tengah dan daftar mata pelajaran yang teratur.',
    targetPlainText: `JADWAL EKSTRAKURIKULER & PELAJARAN KOMPUTER CERIA\nTAHUN AJARAN 2026/2027\n\n1. Hari Senin (08.00 - 09.30) : Pengenalan Perangkat Keras Komputer\n2. Hari Selasa (08.00 - 09.30) : Latihan Mengetik Cepat 10 Jari\n3. Hari Rabu (08.00 - 09.30) : Pemformatan Teks Microsoft Word\n4. Hari Kamis (08.00 - 09.30) : Tabel dan Gambar Microsoft Word\n5. Hari Jumat (08.00 - 09.30) : Cyber Safety dan Kuis Interaktif\n6. Hari Sabtu (08.00 - 10.00) : Praktikum Mandiri dan Liga Mengetik\n\nCatatan Penting:\n- Seluruh siswa wajib hadir tepat waktu di laboratorium komputer.\n- Dilarang membawa makanan dan minuman ke meja komputer.\n- Matikan komputer sesuai prosedur sebelum meninggalkan ruangan.`,
    targetDocument: `<h2 align="center"><b>JADWAL EKSTRAKURIKULER & PELAJARAN KOMPUTER CERIA</b></h2><p align="center"><i>Tahun Ajaran 2026/2027</i></p><hr/><br/><ol><li><b>Hari Senin (08.00 - 09.30)</b> : Pengenalan Perangkat Keras Komputer</li><li><b>Hari Selasa (08.00 - 09.30)</b> : Latihan Mengetik Cepat 10 Jari</li><li><b>Hari Rabu (08.00 - 09.30)</b> : Pemformatan Teks Microsoft Word</li><li><b>Hari Kamis (08.00 - 09.30)</b> : Tabel dan Gambar Microsoft Word</li><li><b>Hari Jumat (08.00 - 09.30)</b> : Cyber Safety dan Kuis Interaktif</li><li><b>Hari Sabtu (08.00 - 10.00)</b> : Praktikum Mandiri dan Liga Mengetik</li></ol><br/><h4><b>Catatan Penting:</b></h4><ul><li>Seluruh siswa wajib hadir tepat waktu di laboratorium komputer.</li><li>Dilarang membawa makanan dan minuman ke meja komputer.</li><li>Matikan komputer sesuai prosedur sebelum meninggalkan ruangan.</li></ul>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-3',
    title: 'Cerita Inspiratif: "Petualangan Kucing Robot Di Dunia Koding"',
    category: 'Format Word',
    difficulty: 'Sedang',
    allocatedPoints: 90,
    minAccuracy: 80,
    targetWpm: 30,
    instructions: 'Ketik naskah cerita fiksi berikut dengan format paragraf menjorok dan perataan Justify (Rata Kiri-Kanan).',
    targetPlainText: `PETUALANGAN KUCING ROBOT DI DUNIA KODING\nKarya: Sahabat Komputer Ceria\n\nDi sebuah kota digital bernama Byteville, hiduplah seekor kucing robot bernama Pixel. Pixel memiliki bulu bercahaya biru neon dan ekor antena yang dapat menangkap sinyal Wi-Fi tercepat di dunia.\n\nSetiap pagi, Pixel membantu anak-anak sekolah menyusun algoritma logika. "Koding itu seperti menyusun balok lego," kata Pixel sambil tersenyum ramah. "Kita hanya perlu meletakkan instruksi langkah demi langkah dengan urutan yang benar."\n\nSuatu hari, server utama perpustakaan Byteville mengalami error karena tanda titik koma yang hilang. Dengan ketelitian dan ketangkasan mengetik sepuluh jari, Pixel dan kawan-kawan berhasil memperbaiki kode program tersebut.\n\nSejak saat itu, seluruh penduduk kota belajar mengetik dengan tekun dan gembira. Mereka menyadari bahwa teknologi adalah sahabat terbaik manusia jika digunakan dengan cerdas dan penuh kebaikan.`,
    targetDocument: `<h3 align="center"><b>PETUALANGAN KUCING ROBOT DI DUNIA KODING</b></h3><p align="center"><i>Karya: Sahabat Komputer Ceria</i></p><br/><p style="text-indent: 30px; text-align: justify;">Di sebuah kota digital bernama Byteville, hiduplah seekor kucing robot bernama <b>Pixel</b>. Pixel memiliki bulu bercahaya biru neon dan ekor antena yang dapat menangkap sinyal Wi-Fi tercepat di dunia.</p><p style="text-indent: 30px; text-align: justify;">Setiap pagi, Pixel membantu anak-anak sekolah menyusun algoritma logika. <i>"Koding itu seperti menyusun balok lego,"</i> kata Pixel sambil tersenyum ramah. <i>"Kita hanya perlu meletakkan instruksi langkah demi langkah dengan urutan yang benar."</i></p><p style="text-indent: 30px; text-align: justify;">Suatu hari, server utama perpustakaan Byteville mengalami error karena tanda titik koma yang hilang. Dengan ketelitian dan ketangkasan mengetik sepuluh jari, Pixel dan kawan-kawan berhasil memperbaiki kode program tersebut.</p><p style="text-indent: 30px; text-align: justify;">Sejak saat itu, seluruh penduduk kota belajar mengetik dengan tekun dan gembira. Mereka menyadari bahwa teknologi adalah sahabat terbaik manusia jika digunakan dengan cerdas dan penuh kebaikan.</p>`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tp-4',
    title: 'Laporan Sains: Bagian-Bagian Komputer & Fungsinya',
    category: 'Dasar Komputer',
    difficulty: 'Mahir',
    allocatedPoints: 100,
    minAccuracy: 85,
    targetWpm: 35,
    instructions: 'Ketik laporan pengamatan komputer dengan format subjudul, huruf tebal, dan daftar poin terstruktur.',
    targetPlainText: `LAPORAN PENGAMATAN LABORATORIUM KOMPUTER\nTopik: Anatomi dan Arsitektur Komputer Modern\n\n1. UNIT PEMROSESAN (PROCESSOR & MOTHERBOARD)\nCPU berfungsi sebagai unit pengolah pusat yang menerjemahkan instruksi biner. Motherboard menjadi jembatan penghubung utama bagi memori RAM dan media penyimpanan berkecepatan tinggi.\n\n2. UNIT MEMORI & PENYIMPANAN (STORAGE)\nSolid State Drive (SSD) menggunakan chip memori flash semikonduktor yang memungkinkan booting sistem operasi dalam hitungan detik tanpa suara bising piringan magnetik.\n\n3. UNIT INPUT DAN OUTPUT\nKeyboard mekanikal dan mouse optik memberikan presisi tinggi bagi pengguna dalam memberikan komando input secara akurat dan responsif.\n\nKesimpulan Praktikum:\nIntegrasi harmonis antara perangkat keras berkualitas dan sistem operasi yang terawat menjamin kinerja komputasi yang optimal bagi pelajar di era modern.`,
    targetDocument: `<h3 align="center"><b>LAPORAN PENGAMATAN LABORATORIUM KOMPUTER</b></h3><p align="center"><u>Topik: Anatomi dan Arsitektur Komputer Modern</u></p><br/><h4><b>1. UNIT PEMROSESAN (PROCESSOR & MOTHERBOARD)</b></h4><p style="text-align: justify;">CPU berfungsi sebagai unit pengolah pusat yang menerjemahkan instruksi biner. Motherboard menjadi jembatan penghubung utama bagi memori RAM dan media penyimpanan berkecepatan tinggi.</p><h4><b>2. UNIT MEMORI & PENYIMPANAN (STORAGE)</b></h4><p style="text-align: justify;">Solid State Drive (SSD) menggunakan chip memori flash semikonduktor yang memungkinkan booting sistem operasi dalam hitungan detik tanpa suara bising piringan magnetik.</p><h4><b>3. UNIT INPUT DAN OUTPUT</b></h4><p style="text-align: justify;">Keyboard mekanikal dan mouse optik memberikan presisi tinggi bagi pengguna dalam memberikan komando input secara akurat dan responsif.</p><br/><p><b>Kesimpulan Praktikum:</b><br/><i>Integrasi harmonis antara perangkat keras berkualitas dan sistem operasi yang terawat menjamin kinerja komputasi yang optimal bagi pelajar di era modern.</i></p>`,
    createdAt: new Date().toISOString(),
  },
];
