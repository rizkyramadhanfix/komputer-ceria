import { AnnouncementItem, CertificateConfig, ContactInfoConfig, DashboardConfig, GamificationConfig, Lesson, Quiz, TypingPractice, User } from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: '📢 Pembukaan Pendaftaran Ekstrakurikuler Komputer Ceria',
    category: 'Penting',
    content: 'Pendaftaran anggota baru Ekstrakurikuler Komputer Ceria telah resmi dibuka! Seluruh siswa sekolah binaan dapat bergabung untuk belajar pengenalan hardware, mengetik 10 jari, pemformatan Microsoft Word, dan mengumpulkan poin bintang prestasi.',
    date: new Date().toISOString().split('T')[0],
    isPinned: true,
    authorName: 'Super Administrator',
  },
  {
    id: 'ann-2',
    title: '🏆 Kompetisi Mengetik Cepat 10 Jari & Kuis Digital Interaktif',
    category: 'Lomba',
    content: 'Mari tingkatkan kecepatan jemarimu! Lomba Mengetik Cepat dan Kuis Digital diadakan antar kelas dan sekolah binaan. Kumpulkan poin tertinggi untuk menukarkan trofi dan sertifikat penghargaan resmi.',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    authorName: 'Super Administrator',
  },
  {
    id: 'ann-3',
    title: '💻 Jadwal Modul Pembelajaran & Praktikum Komputer',
    category: 'Jadwal',
    content: 'Modul materi baru mengenai Perangkat Keras, Microsoft Word, dan Keamanan Internet telah diperbarui. Siswa dapat mengakses materi dan kuis interaktif 24/7 di platform ini.',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    authorName: 'Super Administrator',
  },
];

export const DEFAULT_CONTACT_INFO: ContactInfoConfig = {
  schoolName: 'Pusat Ekstrakurikuler Komputer Ceria',
  descriptionText: 'Selamat datang di Pusat Layanan Informasi & Kontak Ekstrakurikuler Komputer Ceria. Kami siap melayani pertanyaan seputar pendaftaran siswa, jadwal praktikum laboratorium komputer, pembinaan sekolah, dan konsultasi sertifikat.',
  phonePrimary: '0812-3456-7890',
  phoneSecondary: '0857-1122-3344',
  email: 'ekskul.komputer@sekolah.sch.id',
  address: 'Sekretariat Pusat Laboratorium Komputer Ceria, Gedung Ekstrakurikuler Kota Bogor, Jawa Barat',
  operationalHours: 'Senin - Sabtu: Pukul 08.00 - 16.00 WIB',
  socialIg: '@komputerceria_official',
  socialYt: 'Komputer Ceria Channel',
};

export const DEFAULT_CERTIFICATE_CONFIG: CertificateConfig = {
  headerTitle: 'KOMPUTER CERIA',
  subHeaderTitle: 'SDN SUKADAMAI 2 BOGOR',
  certificateTitle: 'SERTIFIKAT PENGHARGAAN',
  locationAndDate: 'Kota Bogor',
  signer1Label: 'Mengetahui,',
  signer1Title: 'Pembina Ekstrakurikuler Komputer',
  signer1Name: 'Rzk Digital Studio',
  signer1Nip: 'NIP. 19900101 202201 1 001',
  signer1SignatureUrl: '',
  signer2Label: 'Mengetahui,',
  signer2Title: 'Kepala Sekolah / Penanggung Jawab',
  signer2Name: 'Kepala Sekolah',
  signer2Nip: 'NIP. 19850312 201001 1 005',
  signer2SignatureUrl: '',
  sealTitle: 'RESMI · TERVERIFIKASI',
  sealImageUrl: '',
};

export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  pointsPerLesson: 50,
  pointsPerQuizQuestion: 20,
  pointsPerTyping: 80,
  pointsToStarRatio: 10, // 10 points = 1 star
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
  runningAnnouncement: '📢 Selamat datang di Komputer Ceria! Silakan masuk ke akun siswa untuk mengakses materi pelajaran, kuis pilihan ganda, dan latihan mengetik Microsoft Word.',
  heroBannerUrl: '/src/assets/images/hero_computer_club_1790579622878.jpg',
};

// Default Superadmin login:
// 1. Superadmin: Administrator / Admin@123
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

// All dummy students, lessons, quizzes, typing practices deleted as requested
export const INITIAL_LESSONS: Lesson[] = [];

export const INITIAL_QUIZZES: Quiz[] = [];

export const INITIAL_TYPING_PRACTICES: TypingPractice[] = [];
