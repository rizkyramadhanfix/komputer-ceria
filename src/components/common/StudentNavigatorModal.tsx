import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  Keyboard,
  Trophy,
  Palette,
  Gift,
  Bot,
  Cpu,
  Shield,
  Code2,
  Stethoscope,
  Cable,
  Binary,
  ShieldAlert,
  Flame,
  LayoutDashboard,
  MessageSquare,
  BookA,
  Folder,
  Network,
  HardDrive,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  category:
    | 'all'
    | 'coding'
    | 'hardware'
    | 'security'
    | 'typing'
    | 'learning'
    | 'creative'
    | 'reward';
  categoryLabel: string;
  badge?: string;
  badgeColor?: string;
  view: string;
  keywords: string[];
}

export const STUDENT_NAV_ITEMS: NavItem[] = [
  // Dashboard & Utama
  {
    id: 'dashboard',
    title: 'Dashboard Siswa',
    description: 'Beranda utama, profil siswa, statistik poin bintang, dan misi harian.',
    icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" />,
    category: 'all',
    categoryLabel: 'Utama',
    view: 'student-dashboard',
    keywords: ['beranda', 'home', 'profil', 'dashboard', 'misi', 'poin'],
  },
  {
    id: 'gallery',
    title: 'Galeri Karya Siswa',
    description: 'Pameran gambar Paint, Pixel Art 8-bit, dan karya ketikan naskah siswa.',
    icon: <Palette className="w-5 h-5 text-pink-500" />,
    category: 'creative',
    categoryLabel: 'Karya Siswa',
    badge: 'POPULER',
    badgeColor: 'bg-pink-500 text-white',
    view: 'student-gallery',
    keywords: ['galeri', 'gambar', 'karya', 'lukisan', 'seni', 'portofolio', 'siswa'],
  },

  // Belajar & Kuis
  {
    id: 'lessons',
    title: 'Modul Materi Belajar',
    description: 'Pelajari dasar komputer, pengenalan sistem operasi, dan klaim poin bintang.',
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    category: 'learning',
    categoryLabel: 'Materi & Kuis',
    badge: 'POIN+',
    badgeColor: 'bg-blue-500 text-white',
    view: 'student-lessons',
    keywords: ['materi', 'baca', 'modul', 'pelajaran', 'teori', 'buku'],
  },
  {
    id: 'quizzes',
    title: 'Kuis Mandiri Interaktif',
    description: 'Uji wawasan komputer dengan kuis berhadiah bintang & anti-curang.',
    icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
    category: 'learning',
    categoryLabel: 'Materi & Kuis',
    badge: 'BINTANG',
    badgeColor: 'bg-amber-500 text-white',
    view: 'student-quizzes',
    keywords: ['kuis', 'soal', 'ujian', 'latihan', 'tanya', 'skor'],
  },
  {
    id: 'glossary',
    title: 'Kamus A-Z Istilah Teknologi',
    description: 'Ensiklopedia kosakata IT: RAM, CPU, Browser, IP, DNS, Cloud dll.',
    icon: <BookA className="w-5 h-5 text-sky-500" />,
    category: 'learning',
    categoryLabel: 'Materi & Kuis',
    view: 'student-glossary',
    keywords: ['kamus', 'istilah', 'glosarium', 'arti', 'pengertian', 'definisi'],
  },
  {
    id: 'shortcuts',
    title: 'Koleksi Shortcut Keyboard',
    description: 'Panduan tombol pintas keyboard Windows & Office (Ctrl+C, Ctrl+V, dll).',
    icon: <Keyboard className="w-5 h-5 text-slate-500" />,
    category: 'learning',
    categoryLabel: 'Materi & Kuis',
    view: 'student-shortcuts',
    keywords: ['shortcut', 'tombol', 'keyboard', 'ctrl', 'pintas'],
  },

  // Mengetik 10 Jari
  {
    id: 'typing-league',
    title: 'Liga Mengetik 10 Jari',
    description: 'Arena kompetisi mengetik naskah resmi pembina dengan papan leaderboard live!',
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
    category: 'typing',
    categoryLabel: 'Mengetik',
    badge: 'HOT / BARU',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white',
    view: 'student-typing-league',
    keywords: ['liga', 'kompetisi', 'mengetik', 'wpm', 'kecepatan', 'naskah', '10 jari'],
  },
  {
    id: 'typing-word',
    title: 'Latihan Mengetik Naskah Word',
    description: 'Ketik naskah pengolah kata dengan panduan jari telunjuk sampai kelingking.',
    icon: <Keyboard className="w-5 h-5 text-indigo-500" />,
    category: 'typing',
    categoryLabel: 'Mengetik',
    view: 'student-typing',
    keywords: ['mengetik', 'word', 'naskah', 'huruf', 'latihan', 'tuts'],
  },
  {
    id: 'typing-hero',
    title: 'Typing Hero RPG',
    description: 'Lawan monster bug cyber dengan mengetik kata-kata cepat dan akurat.',
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    category: 'typing',
    categoryLabel: 'Mengetik',
    badge: 'SERU',
    badgeColor: 'bg-orange-500 text-white',
    view: 'student-typing-hero',
    keywords: ['hero', 'rpg', 'monster', 'battle', 'ketik cepat', 'game mengetik'],
  },
  {
    id: 'rhythm-typing',
    title: 'Rhythm Typing Beats',
    description: 'Game irama ketukan musik 4 tuts (D, F, J, K) melatih refleks jari tangan.',
    icon: '🎵',
    category: 'typing',
    categoryLabel: 'Mengetik',
    badge: 'MUSIK',
    badgeColor: 'bg-pink-500 text-white',
    view: 'student-rhythm-typing',
    keywords: ['irama', 'musik', 'rhythm', 'beat', 'piano', 'lagu', 'tuts', 'dfjk'],
  },

  // Game Koding & Logika
  {
    id: 'coding-lab',
    title: 'Lab Koding Blockly (15 Level)',
    description: 'Susun balok algoritma visual, logika loop, dan percabangan pandu rover.',
    icon: <Code2 className="w-5 h-5 text-emerald-500" />,
    category: 'coding',
    categoryLabel: 'Koding & Logika',
    badge: '15 LEVEL',
    badgeColor: 'bg-emerald-600 text-white',
    view: 'student-coding-lab',
    keywords: ['koding', 'blockly', 'coding', 'algoritma', 'balok', 'labirin', 'loop'],
  },
  {
    id: 'robot-maze',
    title: 'Robot Maze Runner (14 Level)',
    description: 'Navigasikan robot melewati koridor sirkuit berliku dan kumpulkan microchip.',
    icon: '🤖',
    category: 'coding',
    categoryLabel: 'Koding & Logika',
    badge: '14 LEVEL',
    badgeColor: 'bg-cyan-600 text-white',
    view: 'student-robot-maze',
    keywords: ['robot', 'maze', 'labirin', 'runner', 'chip', 'langkah', 'arah'],
  },
  {
    id: 'grid-robot',
    title: 'Grid Robot Navigator (16 Level)',
    description: 'Program robot rover di peta grid kotak koordinat dengan rintangan air dan batu.',
    icon: <Bot className="w-5 h-5 text-cyan-500" />,
    category: 'coding',
    categoryLabel: 'Koding & Logika',
    badge: '16 LEVEL',
    badgeColor: 'bg-teal-600 text-white',
    view: 'student-grid-robot',
    keywords: ['grid', 'robot', 'navigator', 'bintang', 'rover', 'kotak', 'arah'],
  },
  {
    id: 'code-a-pet',
    title: 'Code-A-Pet Robot (8 Evolusi)',
    description: 'Pelihara robot peliharaan dengan menyusun urutan koding makan, tidur & turbo!',
    icon: '🐾',
    category: 'coding',
    categoryLabel: 'Koding & Logika',
    badge: '8 EVOLUSI',
    badgeColor: 'bg-purple-600 text-white',
    view: 'student-code-a-pet',
    keywords: ['pet', 'hewan', 'peliharaan', 'tamagotchi', 'robot hewan', 'evolusi'],
  },
  {
    id: 'binary-code',
    title: 'Detektif Kode Biner (8 Level)',
    description: 'Pecahkan sandi komputer 0 dan 1, konversi angka, desimal dan kode ASCII.',
    icon: <Binary className="w-5 h-5 text-emerald-500" />,
    category: 'coding',
    categoryLabel: 'Koding & Logika',
    badge: '8 LEVEL',
    badgeColor: 'bg-emerald-500 text-white',
    view: 'student-binary-code',
    keywords: ['biner', 'binary', '01', 'bit', 'byte', 'sandi', 'angka', 'ascii'],
  },

  // Game Hardware & Lab PC
  {
    id: 'pc-builder',
    title: 'Rakit PC Simulator',
    description: 'Simulasi pasang Motherboard, CPU, RAM, GPU, SSD, Power Supply, dan Nyalakan PC!',
    icon: <Cpu className="w-5 h-5 text-amber-500" />,
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    badge: 'FAVORIT',
    badgeColor: 'bg-amber-600 text-white',
    view: 'student-pc-builder',
    keywords: ['rakit pc', 'komputer', 'hardware', 'motherboard', 'cpu', 'ram', 'vga'],
  },
  {
    id: 'pc-doctor',
    title: 'Dokter PC (Troubleshooting)',
    description: 'Diagnosis keluhan komputer: bluescreen, kipas bising, virus, dan perbaiki!',
    icon: <Stethoscope className="w-5 h-5 text-rose-500" />,
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    badge: 'KLINIK',
    badgeColor: 'bg-rose-500 text-white',
    view: 'student-pc-doctor',
    keywords: ['dokter', 'rusak', 'repair', 'servis', 'troubleshoot', 'komputer rusak'],
  },
  {
    id: 'port-master',
    title: 'Master Colokan & Port',
    description: 'Kenali USB Type-C, HDMI, DisplayPort, VGA, Jack Audio dan sambungkan kabel tepat.',
    icon: <Cable className="w-5 h-5 text-blue-500" />,
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    view: 'student-port-master',
    keywords: ['port', 'colokan', 'kabel', 'hdmi', 'usb', 'vga', 'soket', 'monitor'],
  },
  {
    id: 'lan-crimping',
    title: 'Simulator Crimping Kabel LAN',
    description: 'Urutkan 8 warna standar T568B, potong kabel, dan pasang konektor RJ45!',
    icon: '🔌',
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    badge: 'PRAKTEK',
    badgeColor: 'bg-indigo-600 text-white',
    view: 'student-lan-crimping',
    keywords: ['crimping', 'lan', 'rj45', 't568b', 'kabel internet', 'warna kabel'],
  },
  {
    id: 'network-builder',
    title: 'Rakit Jaringan Network',
    description: 'Hubungkan Switch, Router Wifi, Server, dan PC client menjadi topologi lab.',
    icon: <Network className="w-5 h-5 text-indigo-500" />,
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    view: 'student-network-builder',
    keywords: ['jaringan', 'network', 'router', 'wifi', 'switch', 'server', 'ip'],
  },
  {
    id: 'storage-master',
    title: 'Master Media Penyimpanan',
    description: 'Pahami hierarki kapasitas data (KB, MB, GB, TB) serta jenis HDD vs SSD vs Flashdisk.',
    icon: <HardDrive className="w-5 h-5 text-emerald-500" />,
    category: 'hardware',
    categoryLabel: 'Hardware & Lab',
    view: 'student-storage-master',
    keywords: ['storage', 'harddisk', 'ssd', 'kapasitas', 'gb', 'tb', 'flashdisk'],
  },

  // Game Keamanan Siber & Detektif
  {
    id: 'cyber-shield',
    title: 'Cyber Shield Firewall',
    description: 'Pertahankan server lab dari serangan malware, virus worm, dan hacker!',
    icon: <Shield className="w-5 h-5 text-cyan-500" />,
    category: 'security',
    categoryLabel: 'Keamanan Siber',
    badge: 'AKSI',
    badgeColor: 'bg-cyan-500 text-white',
    view: 'student-cyber-shield',
    keywords: ['shield', 'firewall', 'pertahanan', 'serangan', 'cyber', 'keamanan'],
  },
  {
    id: 'detective-hoax',
    title: 'Detektif Hoax & Fakta',
    description: 'Analisis berita viral, cek fakta link mencurigakan dan bongkar tipuan digital.',
    icon: '🕵️‍♂️',
    category: 'security',
    categoryLabel: 'Keamanan Siber',
    badge: 'BARU',
    badgeColor: 'bg-blue-600 text-white',
    view: 'student-detective-hoax',
    keywords: ['hoax', 'detektif', 'fakta', 'berita', 'cek fakta', 'literasi digital'],
  },
  {
    id: 'anti-phishing',
    title: 'Detektif Anti-Phishing',
    description: 'Waspadai email palsu, tautan jebakan, dan pesan penipuan berhadiah palsu.',
    icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
    category: 'security',
    categoryLabel: 'Keamanan Siber',
    view: 'student-anti-phishing',
    keywords: ['phishing', 'penipuan', 'email palsu', 'waspada', 'akun', 'password'],
  },
  {
    id: 'cyber-safety',
    title: 'Edukasi Keamanan Siber',
    description: 'Kuis interaktif keamanan jejak digital, cyberbullying, dan etika berinternet.',
    icon: <Shield className="w-5 h-5 text-indigo-500" />,
    category: 'security',
    categoryLabel: 'Keamanan Siber',
    view: 'student-cyber-safety',
    keywords: ['safety', 'aman', 'etika', 'jejak digital', 'internet sehat'],
  },

  // Simulasi Kreatif & Game Edukasi
  {
    id: 'pizza-tycoon',
    title: 'Excel Pizza Tycoon',
    description: 'Kelola restoran pizza menggunakan rumus spreadsheet (SUM, AVERAGE, Profit).',
    icon: '🍕',
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    badge: 'SERU',
    badgeColor: 'bg-amber-500 text-white',
    view: 'student-pizza-tycoon',
    keywords: ['pizza', 'tycoon', 'excel', 'bisnis', 'jualan', 'rumus', 'sum'],
  },
  {
    id: 'spreadsheet',
    title: 'Petualangan Excel Cilik',
    description: 'Belajar tabel baris kolom, mewarnai cell, dan menghitung otomatis.',
    icon: '📊',
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    view: 'student-spreadsheet',
    keywords: ['excel', 'tabel', 'rumus', 'spreadsheet', 'kolom', 'baris'],
  },
  {
    id: 'pixel-art',
    title: 'Studio Pixel Art 8-Bit',
    description: 'Gambar karakter game retro pixel 16x16 atau 24x24 dan bagikan ke galeri!',
    icon: '🎨',
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    badge: 'STUDIO',
    badgeColor: 'bg-indigo-600 text-white',
    view: 'student-pixel-art',
    keywords: ['pixel', 'art', 'gambar', 'retro', 'warna', 'kanvas', 'desain'],
  },
  {
    id: 'mini-poster',
    title: 'Mini Poster Designer',
    description: 'Desain poster kampanye hemat listrik, stop hoax, dan kebersihan lab sekolah.',
    icon: '🖼️',
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    view: 'student-mini-poster',
    keywords: ['poster', 'desain', 'spanduk', 'banner', 'gambar', 'kreasi'],
  },
  {
    id: 'file-explorer',
    title: 'Misi File Explorer',
    description: 'Simulasi membuat folder rapi, copy-paste file, zip arsip, dan mencari data.',
    icon: <Folder className="w-5 h-5 text-blue-500" />,
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    view: 'student-file-explorer',
    keywords: ['file', 'folder', 'explorer', 'dokumen', 'simpan', 'copy', 'paste'],
  },
  {
    id: 'falling-words',
    title: 'Kata Jatuh (Falling Words)',
    description: 'Game arkade ketik kata yang berjatuhan sebelum menyentuh batas bawah.',
    icon: '🎮',
    category: 'creative',
    categoryLabel: 'Simulasi & Kreatif',
    view: 'student-games',
    keywords: ['kata jatuh', 'falling', 'words', 'game arkade', 'huruf'],
  },

  // Prestasi, Toko & Komunitas
  {
    id: 'leaderboard',
    title: 'Papan Peringkat Prestasi',
    description: 'Pantau posisi skor siswa teratas, perolehan bintang, dan klasemen kelas.',
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
    category: 'reward',
    categoryLabel: 'Prestasi & Toko',
    view: 'student-leaderboard',
    keywords: ['peringkat', 'leaderboard', 'juara', 'ranking', 'skor', 'bintang'],
  },
  {
    id: 'reward-shop',
    title: 'Toko Hadiah Sekolah',
    description: 'Tukarkan bintang prestasimu dengan alat tulis, buku, dan reward nyata sekolah.',
    icon: <Gift className="w-5 h-5 text-amber-500" />,
    category: 'reward',
    categoryLabel: 'Prestasi & Toko',
    badge: 'TUKAR',
    badgeColor: 'bg-amber-600 text-white',
    view: 'student-reward-shop',
    keywords: ['toko', 'hadiah', 'tukar', 'pensil', 'buku', 'voucher', 'reward'],
  },
  {
    id: 'star-shop',
    title: 'Toko Avatar & Bingkai',
    description: 'Kustomisasi avatar profilmu dengan bingkai neon, api, dan title keren!',
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    category: 'reward',
    categoryLabel: 'Prestasi & Toko',
    view: 'student-star-shop',
    keywords: ['avatar', 'bingkai', 'title', 'kostum', 'toko bintang', 'frame'],
  },
  {
    id: 'forum',
    title: 'Forum Diskusi Siswa',
    description: 'Tanya jawab seputar materi, berbagi tips koding, dan berdiskusi dengan teman.',
    icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
    category: 'reward',
    categoryLabel: 'Prestasi & Toko',
    view: 'student-forum',
    keywords: ['forum', 'diskusi', 'tanya', 'komentar', 'komunitas', 'chat'],
  },
];

interface StudentNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const StudentNavigatorModal: React.FC<StudentNavigatorModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return STUDENT_NAV_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Query filter
      if (!q) return true;
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
      const matchesKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesTitle || matchesDesc || matchesCategory || matchesKeywords;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const CATEGORIES = [
    { id: 'all', label: '🌟 Semua Fitur', count: STUDENT_NAV_ITEMS.length },
    {
      id: 'coding',
      label: '🚀 Koding & Robot',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'coding').length,
    },
    {
      id: 'hardware',
      label: '🔧 Hardware & Lab',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'hardware').length,
    },
    {
      id: 'typing',
      label: '⌨️ Mengetik 10 Jari',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'typing').length,
    },
    {
      id: 'security',
      label: '🛡️ Keamanan Siber',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'security').length,
    },
    {
      id: 'creative',
      label: '🎨 Kreatif & Simulasi',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'creative').length,
    },
    {
      id: 'learning',
      label: '📚 Materi & Kuis',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'learning').length,
    },
    {
      id: 'reward',
      label: '🏆 Prestasi & Toko',
      count: STUDENT_NAV_ITEMS.filter((i) => i.category === 'reward').length,
    },
  ];

  const handleSelect = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-pink-50/40 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Pusat Menu & Jelajah Fitur Siswa
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  Akses Cepat 🚀
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ketik nama game, materi, atau pilih kategori untuk mulai belajar dan bermain!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari game (Blockly, Rakit PC, Pizza Tycoon), materi, kuis, atau naskah..."
              autoFocus
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 max-h-[58vh]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Tidak ada menu atau game yang cocok dengan "{searchQuery}"
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba gunakan kata kunci lain seperti <strong>"koding"</strong>, <strong>"pc"</strong>, <strong>"ketik"</strong>, atau pilih kategori <strong>"Semua Fitur"</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.view)}
                  className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900/90 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all duration-150 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform shrink-0">
                        {typeof item.icon === 'string' ? item.icon : item.icon}
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs shrink-0 ${
                            item.badgeColor || 'bg-indigo-600 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {item.categoryLabel}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Buka Aktivitas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:px-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Menampilkan <strong>{filteredItems.length}</strong> fitur & game belajar
          </span>
          <span className="hidden sm:inline">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd> untuk menutup
          </span>
        </div>
      </div>
    </div>
  );
};
