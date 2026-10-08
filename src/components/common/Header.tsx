import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  Database,
  Sun, 
  UserCheck, 
  X,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Keyboard,
  Gamepad2,
  Cpu,
  Code2,
  Network,
  Folder,
  MessageSquare,
  Megaphone,
  PhoneCall,
  Shield,
  Zap,
  LayoutDashboard,
  Trophy,
  ShoppingBag,
  Star,
  Award,
  Image,
  Users,
  Palette,
  Settings,
  Eye,
  EyeOff,
  Activity,
  Stethoscope,
  Paintbrush,
  FileSpreadsheet,
  Gift,
  BookA,
  School,
  Cable,
  Binary,
  ShieldAlert,
  Bot,
  Rocket,
  Share2,
  QrCode,
  Search,
  Sparkles,
  Flame,
  HardDrive,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { getDashboardConfig } from '../../services/storageService';
import { Avatar } from './Avatar';
import { CloudSyncStatusButton } from './CloudSyncStatusButton';
import { ShareAppModal } from './ShareAppModal';
import { StudentNavigatorModal } from './StudentNavigatorModal';
import { StudentMobileBottomNav } from './StudentMobileBottomNav';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuthModal: (mode: 'admin' | 'superadmin' | 'pembina' | 'student-login' | 'student-register') => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout, isAdmin, isSuperAdmin, isPembina, isStudent, assignedSchool } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const dashboardConfig = getDashboardConfig();

  // Keyboard shortcut Ctrl+K / Cmd+K to launch quick navigator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsNavigatorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-item')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Running Announcement Text Banner */}
      {dashboardConfig.runningAnnouncement && (
        <div className="w-full bg-indigo-600 dark:bg-indigo-950 text-white text-[11px] font-medium py-1 px-4 overflow-hidden border-b border-indigo-700/60 dark:border-indigo-900 flex items-center">
          <div className="shrink-0 flex items-center gap-1 font-semibold pr-3 bg-indigo-600 dark:bg-indigo-950 z-10">
            <Bell className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="uppercase tracking-wider text-[10px] text-amber-300">Pengumuman:</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <span className="animate-marquee">{dashboardConfig.runningAnnouncement}</span>
          </div>
        </div>
      )}

      <div className={`${currentView === 'student-dashboard' ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between`}>
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {dashboardConfig.siteTitle.split(' - ')[0] || 'Komputer Ceria'}
          </span>
        </button>

        {/* Zone 2: Simplified Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          {!currentUser && (
            <>
              <button
                onClick={() => handleNavClick('landing')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 relative ${
                  currentView === 'landing' ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavClick('gallery')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                  currentView === 'gallery' || currentView === 'student-gallery' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                <span>Galeri Karya</span>
              </button>
              <button
                onClick={() => handleNavClick('leaderboard')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 relative ${
                  currentView === 'leaderboard' ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Leaderboard</span>
              </button>
              <button
                onClick={() => handleNavClick('public-announcements')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer font-bold ${
                  currentView === 'public-announcements' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Pemberitahuan</span>
              </button>
              <button
                onClick={() => handleNavClick('public-contact')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer font-bold ${
                  currentView === 'public-contact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Kontak</span>
              </button>
            </>
          )}

          {isStudent && (
            <>
              {/* 1. Dashboard Utama */}
              <button
                onClick={() => handleNavClick('student-dashboard')}
                className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                  currentView === 'student-dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </button>

              {/* 2. Galeri Karya Siswa (Mandiri & Terpisah) */}
              <button
                onClick={() => handleNavClick('student-gallery')}
                className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                  currentView === 'student-gallery' || currentView === 'gallery'
                    ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4 text-pink-500" />
                <span>Galeri Karya</span>
              </button>

              {/* 3. Belajar & Kuis (Dropdown) */}
              <div className="relative nav-dropdown-item group">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'belajar' ? null : 'belajar')}
                  className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                    ['student-lessons', 'student-quizzes', 'student-glossary', 'student-shortcuts'].includes(currentView)
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Materi & Kuis</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'belajar' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 transition-all duration-150 z-50 space-y-1 ${
                    activeDropdown === 'belajar'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  } group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0`}
                >
                  <button onClick={() => handleNavClick('student-lessons')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Daftar Materi Modul</div>
                      <div className="text-[10px] text-slate-400">Teori komputer dasar & klaim poin</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-quizzes')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Kuis Mandiri Interaktif</div>
                      <div className="text-[10px] text-slate-400">Raih skor & bintang pemahaman</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-glossary')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 flex items-center justify-center shrink-0">
                      <BookA className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Kamus A-Z Teknologi</div>
                      <div className="text-[10px] text-slate-400">Ensiklopedia istilah IT lengkap</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-shortcuts')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Koleksi Shortcut Cepat</div>
                      <div className="text-[10px] text-slate-400">Trik tombol pintas keyboard</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4. Ketik 10 Jari (Dropdown) */}
              <div className="relative nav-dropdown-item group">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'mengetik' ? null : 'mengetik')}
                  className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                    ['student-typing', 'student-typing-league', 'student-typing-hero', 'student-rhythm-typing'].includes(currentView)
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Keyboard className="w-4 h-4 text-amber-500" />
                  <span>Ketik 10 Jari</span>
                  <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-black">LIGA</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'mengetik' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 transition-all duration-150 z-50 space-y-1 ${
                    activeDropdown === 'mengetik'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  } group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0`}
                >
                  <button onClick={() => handleNavClick('student-typing-league')} className="w-full text-left p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                        🏆
                      </div>
                      <div>
                        <div className="font-black text-xs text-amber-900 dark:text-amber-200">Liga Mengetik Cepat</div>
                        <div className="text-[10px] text-amber-700 dark:text-amber-400">Kompetisi naskah & WPM live</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black">BARU</span>
                  </button>
                  <button onClick={() => handleNavClick('student-typing')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center shrink-0">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Mengetik Naskah Word</div>
                      <div className="text-[10px] text-slate-400">Latihan telunjuk - kelingking</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-typing-hero')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Typing Hero RPG</div>
                      <div className="text-[10px] text-slate-400">Pertempuran ketik lawan bug</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-rhythm-typing')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 flex items-center justify-center shrink-0">
                      🎵
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Rhythm Typing Beats</div>
                      <div className="text-[10px] text-slate-400">Refleks tuts musik D, F, J, K</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Arena Game & Koding (Mega Menu Hub) */}
              <div className="relative nav-dropdown-item group">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'game' ? null : 'game')}
                  className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                    ['student-coding-lab', 'student-robot-maze', 'student-grid-robot', 'student-code-a-pet', 'student-binary-code', 'student-pc-builder', 'student-pc-doctor', 'student-port-master', 'student-lan-crimping', 'student-network-builder', 'student-storage-master', 'student-cyber-shield', 'student-detective-hoax', 'student-anti-phishing', 'student-cyber-safety', 'student-pizza-tycoon', 'student-spreadsheet', 'student-mini-poster', 'student-file-explorer', 'student-games'].includes(currentView)
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-purple-500" />
                  <span>Arena Game</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'game' ? 'rotate-180' : ''}`} />
                </button>

                {/* Organized Mega Dropdown (4 Kategori) */}
                <div 
                  className={`absolute top-full -left-28 mt-1 w-[680px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 transition-all duration-150 z-50 space-y-4 ${
                    activeDropdown === 'game'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  } group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Kategori 1: Koding & Algoritma */}
                    <div className="space-y-1.5 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800 text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Koding & Algoritma</span>
                      </div>
                      <div className="space-y-1">
                        <button onClick={() => handleNavClick('student-coding-lab')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🧩 Lab Koding Blockly</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 rounded font-black">15 LVL</span>
                        </button>
                        <button onClick={() => handleNavClick('student-robot-maze')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🤖 Robot Maze Runner</span>
                          <span className="text-[9px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-1.5 rounded font-black">14 LVL</span>
                        </button>
                        <button onClick={() => handleNavClick('student-grid-robot')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🌐 Grid Robot Rover</span>
                          <span className="text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 rounded font-black">16 LVL</span>
                        </button>
                        <button onClick={() => handleNavClick('student-code-a-pet')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🐾 Code-A-Pet Robot</span>
                          <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 rounded font-black">8 EVO</span>
                        </button>
                        <button onClick={() => handleNavClick('student-binary-code')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>0️⃣1️⃣ Detektif Kode Biner</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 rounded font-black">8 LVL</span>
                        </button>
                      </div>
                    </div>

                    {/* Kategori 2: Hardware & Lab PC */}
                    <div className="space-y-1.5 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Hardware & Lab PC</span>
                      </div>
                      <div className="space-y-1">
                        <button onClick={() => handleNavClick('student-pc-builder')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🖥️ Rakit PC Simulator</span>
                          <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 rounded font-black">FAVORIT</span>
                        </button>
                        <button onClick={() => handleNavClick('student-pc-doctor')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🩺 Dokter PC Troubleshooting</span>
                          <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 rounded font-black">KLINIK</span>
                        </button>
                        <button onClick={() => handleNavClick('student-port-master')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🔌 Master Colokan & Port</span>
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 rounded font-black">SOKET</span>
                        </button>
                        <button onClick={() => handleNavClick('student-lan-crimping')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🌐 Crimping Kabel LAN RJ45</span>
                          <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 rounded font-black">T568B</span>
                        </button>
                        <button onClick={() => handleNavClick('student-network-builder')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>📡 Rakit Jaringan Lab</span>
                          <span className="text-[9px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 rounded font-black">WIFI</span>
                        </button>
                        <button onClick={() => handleNavClick('student-storage-master')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>💾 Master Storage Data</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 rounded font-black">GB/TB</span>
                        </button>
                      </div>
                    </div>

                    {/* Kategori 3: Keamanan Siber & Detektif */}
                    <div className="space-y-1.5 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800 text-[11px] font-black uppercase text-rose-600 dark:text-rose-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Keamanan Siber & Detektif</span>
                      </div>
                      <div className="space-y-1">
                        <button onClick={() => handleNavClick('student-cyber-shield')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🛡️ Cyber Shield Firewall</span>
                          <span className="text-[9px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-1.5 rounded font-black">AKSI</span>
                        </button>
                        <button onClick={() => handleNavClick('student-detective-hoax')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🕵️‍♂️ Detektif Hoax & Fakta</span>
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 rounded font-black">BERITA</span>
                        </button>
                        <button onClick={() => handleNavClick('student-anti-phishing')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🚨 Detektif Anti-Phishing</span>
                          <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 rounded font-black">WASPADA</span>
                        </button>
                        <button onClick={() => handleNavClick('student-cyber-safety')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🔒 Edukasi Etika Siber</span>
                          <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 rounded font-black">AMAN</span>
                        </button>
                      </div>
                    </div>

                    {/* Kategori 4: Kreatif & Simulasi */}
                    <div className="space-y-1.5 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800 text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Kreatif & Simulasi</span>
                      </div>
                      <div className="space-y-1">
                        <button onClick={() => handleNavClick('student-pizza-tycoon')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🍕 Excel Pizza Tycoon</span>
                          <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 rounded font-black">SERU</span>
                        </button>
                        <button onClick={() => handleNavClick('student-spreadsheet')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>📊 Petualangan Excel Cilik</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 rounded font-black">TABEL</span>
                        </button>
                        <button onClick={() => handleNavClick('student-mini-poster')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🖼️ Mini Poster Designer</span>
                          <span className="text-[9px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-1.5 rounded font-black">DESAIN</span>
                        </button>
                        <button onClick={() => handleNavClick('student-file-explorer')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>📁 Misi File Explorer</span>
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 rounded font-black">FOLDER</span>
                        </button>
                        <button onClick={() => handleNavClick('student-games')} className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>🔤 Kata Jatuh (Falling Words)</span>
                          <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 rounded font-black">ARKADE</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer with Quick Search CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      🎮 20 Game Edukasi Interaktif Komputer & Koding
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsNavigatorOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buka Pencarian Cepat Semua Game (Ctrl+K)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Prestasi & Toko (Dropdown) */}
              <div className="relative nav-dropdown-item group">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'prestasi' ? null : 'prestasi')}
                  className={`transition-all px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold cursor-pointer ${
                    ['student-leaderboard', 'student-reward-shop', 'student-star-shop', 'student-forum'].includes(currentView)
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span>Prestasi & Hadiah</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'prestasi' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`absolute top-full right-0 mt-1 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 transition-all duration-150 z-50 space-y-1 ${
                    activeDropdown === 'prestasi'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  } group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0`}
                >
                  <button onClick={() => handleNavClick('student-leaderboard')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Papan Peringkat</div>
                      <div className="text-[10px] text-slate-400">Klasemen poin & bintang kelas</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-reward-shop')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Toko Hadiah Sekolah</div>
                      <div className="text-[10px] text-slate-400">Tukar bintang dengan hadiah fisik</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-star-shop')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Toko Avatar & Bingkai</div>
                      <div className="text-[10px] text-slate-400">Kostum profil eksklusif siswa</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavClick('student-forum')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors border-t border-slate-100 dark:border-slate-800/80">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">Forum Diskusi Siswa</div>
                      <div className="text-[10px] text-slate-400">Tanya jawab & tips belajar</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 7. Tombol Jelajah Menu & Pencarian Cepat (Ctrl+K) */}
              <button
                onClick={() => setIsNavigatorOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all"
                title="Buka Pusat Jelajah Menu & Pencarian (Ctrl+K)"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Jelajah Menu 🚀</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              {/* Dropdown: Data Master */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('admin-data')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['admin-students', 'admin-lessons', 'admin-quizzes', 'admin-typing'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Data Master</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'admin-data' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  <button onClick={() => handleNavClick('admin-students')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Manajemen Siswa</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-lessons')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Materi Belajar</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-quizzes')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bank Kuis</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-typing')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <Keyboard className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tugas Mengetik</span>
                  </button>
                </div>
              </div>

              {/* Dropdown: Monitoring */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('admin-monitor')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['admin-typing-league', 'admin-login-activity', 'admin-submissions', 'admin-gallery', 'admin-forum', 'admin-games'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Monitoring</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'admin-monitor' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  <button onClick={() => handleNavClick('admin-typing-league')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leaderboard Liga Mengetik</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-login-activity')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Keaktifan Akun Siswa</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-submissions')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hasil & Nilai</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-gallery')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    <Image className="w-3.5 h-3.5 text-purple-500" />
                    <span>Galeri Karya Siswa</span>
                  </button>
                  <button onClick={() => handleNavClick('admin-forum')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Moderasi Forum</span>
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => handleNavClick('admin-games')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                      <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Monitor Game & Hadiah</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown: Pengaturan */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('admin-settings')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['admin-gamification', 'admin-dashboard-config', 'admin-certificate'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'admin-settings' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  {isSuperAdmin && (
                    <>
                      <button onClick={() => handleNavClick('admin-gamification')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Poin & Bintang (Global)</span>
                      </button>
                      <button onClick={() => handleNavClick('admin-dashboard-config')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                        <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Tampilan Depan (Global)</span>
                      </button>
                      <button onClick={() => handleNavClick('admin-announcements')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                        <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                        <span>Edit Pemberitahuan & Kontak</span>
                      </button>
                    </>
                  )}
                  <button onClick={() => handleNavClick('admin-certificate')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isPembina ? `Format Sertifikat ${assignedSchool || ''}` : 'Format Sertifikat Sekolah'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 Primary Actions + Theme Switcher + Refresh Icon Button + Logout */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* Modern Real-Time Cloud Sync Button & Indicator */}
          <CloudSyncStatusButton />

          {/* Share & Connect Multi-Device Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            title="Buka di Perangkat Lain (Scan QR Code & Bagikan Tautan Online)"
            className="px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Hubungkan HP</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Profile Avatar & Info Clickable */}
              <div
                onClick={() => {
                  if (isStudent && onOpenProfileModal) {
                    onOpenProfileModal();
                  } else {
                    handleNavClick(isAdmin ? 'admin-dashboard' : 'student-dashboard');
                  }
                }}
                title={isStudent ? 'Klik untuk Edit Profil & Foto' : undefined}
                className="flex items-center gap-2.5 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" frame={currentUser.equippedFrame} />
                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 max-w-[140px] truncate">
                      {currentUser.name}
                    </span>
                    {currentUser.schoolFaction && (
                      <span className="text-[10px]" title={`Tim ${currentUser.schoolFaction}`}>
                        {currentUser.schoolFaction === 'processor' && '⚡'}
                        {currentUser.schoolFaction === 'graphics' && '🎨'}
                        {currentUser.schoolFaction === 'memory' && '🧠'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isSuperAdmin
                      ? '👑 Super Administrator'
                      : isPembina
                      ? `🧑‍🏫 Pembina · ${assignedSchool || 'Sekolah'}`
                      : `${currentUser.totalPoints} pt · Edit Profil`}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Keluar / Logout"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('student-login')}
                className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Mulai Belajar</span>
              </button>
              <button
                onClick={() => onOpenAuthModal('superadmin')}
                title="Akses Pengelola Website"
                className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Login Super Admin</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-8 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {!currentUser && (
              <>
                <button
                  onClick={() => handleNavClick('landing')}
                  className="w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600"
                >
                  Beranda
                </button>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="w-full text-left py-2 text-sm font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-2"
                >
                  <Palette className="w-4 h-4 text-pink-500" />
                  <span>Galeri Karya</span>
                </button>
              </>
            )}

            {isStudent && (
              <>
                {/* Quick Search CTA in Mobile Menu */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsNavigatorOpen(true);
                  }}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs shadow-md shadow-indigo-500/20 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Pusat Jelajah Fitur & Game 🚀</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Cari →</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleNavClick('student-dashboard')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-left text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('student-gallery')}
                    className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/40 text-left text-xs font-black text-pink-600 dark:text-pink-400 flex items-center gap-2"
                  >
                    <Palette className="w-4 h-4 text-pink-500" />
                    <span>Galeri Karya</span>
                  </button>
                </div>

                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left py-2 px-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Edit Profil & Foto Siswa</span>
                  </button>
                )}

                {/* Section: Belajar & Kuis */}
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    <span>Materi & Belajar Mandiri</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button onClick={() => handleNavClick('student-lessons')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      📖 Daftar Materi
                    </button>
                    <button onClick={() => handleNavClick('student-quizzes')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      ❓ Kuis Mandiri
                    </button>
                    <button onClick={() => handleNavClick('student-glossary')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      📚 Kamus A-Z IT
                    </button>
                    <button onClick={() => handleNavClick('student-shortcuts')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      ⌨️ Koleksi Shortcut
                    </button>
                  </div>
                </div>

                {/* Section: Mengetik 10 Jari */}
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1.5 flex items-center gap-1.5">
                    <Keyboard className="w-3 h-3 text-amber-500" />
                    <span>Arena Mengetik 10 Jari</span>
                  </p>
                  <button onClick={() => handleNavClick('student-typing-league')} className="w-full text-left p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs font-black text-amber-800 dark:text-amber-300 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2">
                      <span>🏆</span>
                      <span>Liga Mengetik Cepat 10 Jari</span>
                    </span>
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black">BARU</span>
                  </button>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button onClick={() => handleNavClick('student-typing')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      📄 Naskah Word
                    </button>
                    <button onClick={() => handleNavClick('student-typing-hero')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      ⚡ Hero RPG
                    </button>
                    <button onClick={() => handleNavClick('student-rhythm-typing')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                      🎵 Rhythm Beats
                    </button>
                  </div>
                </div>

                {/* Section: Arena Game Terpopuler */}
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Gamepad2 className="w-3 h-3 text-purple-500" />
                      <span>Arena Game & Simulasi (20 Game)</span>
                    </p>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsNavigatorOpen(true);
                      }}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400"
                    >
                      Lihat Semua →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                    <button onClick={() => handleNavClick('student-coding-lab')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🧩 Blockly Lab (15 Lvl)
                    </button>
                    <button onClick={() => handleNavClick('student-robot-maze')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🤖 Robot Maze (14 Lvl)
                    </button>
                    <button onClick={() => handleNavClick('student-pc-builder')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🖥️ Rakit PC Simulator
                    </button>
                    <button onClick={() => handleNavClick('student-pc-doctor')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🩺 Dokter PC Klinik
                    </button>
                    <button onClick={() => handleNavClick('student-port-master')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🔌 Master Colokan/Port
                    </button>
                    <button onClick={() => handleNavClick('student-pizza-tycoon')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🍕 Excel Pizza Tycoon
                    </button>
                    <button onClick={() => handleNavClick('student-code-a-pet')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🐾 Code-A-Pet Robot
                    </button>
                    <button onClick={() => handleNavClick('student-detective-hoax')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🕵️‍♂️ Detektif Hoax & Fakta
                    </button>
                    <button onClick={() => handleNavClick('student-cyber-shield')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      🛡️ Cyber Shield
                    </button>
                    <button onClick={() => handleNavClick('student-binary-code')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 truncate">
                      0️⃣1️⃣ Detektif Kode Biner
                    </button>
                  </div>
                </div>

                {/* Section: Prestasi & Hadiah */}
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1.5 flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span>Prestasi, Hadiah & Forum</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button onClick={() => handleNavClick('student-leaderboard')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-bold text-amber-600 dark:text-amber-400">
                      🏆 Papan Peringkat
                    </button>
                    <button onClick={() => handleNavClick('student-reward-shop')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-bold text-emerald-600 dark:text-emerald-400">
                      🎁 Toko Hadiah Fisik
                    </button>
                    <button onClick={() => handleNavClick('student-star-shop')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-bold text-purple-600 dark:text-purple-400">
                      ✨ Toko Bingkai Avatar
                    </button>
                    <button onClick={() => handleNavClick('student-forum')} className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-bold text-indigo-600 dark:text-indigo-400">
                      💬 Forum Diskusi
                    </button>
                  </div>
                </div>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className="w-full text-left py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Panel Admin</span>
                </button>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Data Master</p>
                  <button onClick={() => handleNavClick('admin-students')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Manajemen Siswa</button>
                  <button onClick={() => handleNavClick('admin-lessons')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Materi Belajar</button>
                  <button onClick={() => handleNavClick('admin-quizzes')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Bank Kuis</button>
                  <button onClick={() => handleNavClick('admin-typing')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Tugas Mengetik</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Monitoring</p>
                  <button onClick={() => handleNavClick('admin-typing-league')} className="w-full text-left py-2 px-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700">Leaderboard Liga Mengetik</button>
                  <button onClick={() => handleNavClick('admin-login-activity')} className="w-full text-left py-2 px-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Keaktifan Akun Siswa</button>
                  <button onClick={() => handleNavClick('admin-submissions')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Hasil & Nilai</button>
                  <button onClick={() => handleNavClick('admin-gallery')} className="w-full text-left py-2 px-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700">Galeri Karya Siswa</button>
                  <button onClick={() => handleNavClick('admin-forum')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Moderasi Forum</button>
                  <button onClick={() => handleNavClick('admin-games')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Monitor Game & Hadiah</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Pengaturan</p>
                  <button onClick={() => handleNavClick('admin-gamification')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Poin & Bintang</button>
                  <button onClick={() => handleNavClick('admin-dashboard-config')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Tampilan Depan</button>
                  {isSuperAdmin && (
                    <button onClick={() => handleNavClick('admin-announcements')} className="w-full text-left py-2 px-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700">Edit Pemberitahuan & Kontak</button>
                  )}
                  <button onClick={() => handleNavClick('admin-certificate')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Format Sertifikat</button>
                </div>
              </>
            )}

            <button
              onClick={() => handleNavClick('leaderboard')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={() => handleNavClick('public-announcements')}
              className={`w-full text-left py-2 text-sm font-bold flex items-center gap-2 ${
                currentView === 'public-announcements' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-500" />
              <span>📢 Pemberitahuan Resmi</span>
            </button>
            <button
              onClick={() => handleNavClick('public-contact')}
              className={`w-full text-left py-2 text-sm font-bold flex items-center gap-2 ${
                currentView === 'public-contact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-indigo-500" />
              <span>📞 Informasi Kontak</span>
            </button>
          </div>

          {/* Real-Time Sync Button in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <CloudSyncStatusButton className="w-full flex justify-center" />
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full mt-2 py-2 px-3 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center gap-2 border border-indigo-200 dark:border-indigo-800"
            >
              <Share2 className="w-4 h-4" />
              <span>Buka di HP / Perangkat Lain (QR Code)</span>
            </button>
          </div>

          {currentUser && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 text-center text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          )}

          {!currentUser && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('student-login');
                }}
                className="w-full py-2.5 text-center text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4 text-amber-300" />
                <span>Mulai Belajar (Akses Gratis) 🚀</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('superadmin');
                }}
                className="w-full py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Login Super Admin</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share & Connect Multi-Device Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Quick Student Feature Navigator Search Modal */}
      <StudentNavigatorModal
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        onNavigate={handleNavClick}
      />

      {/* Modern Student Bottom Navigation Bar for Mobile */}
      {isStudent && (
        <StudentMobileBottomNav
          currentView={currentView}
          onNavigate={handleNavClick}
          onOpenNavigator={() => setIsNavigatorOpen(true)}
        />
      )}
    </header>
  );
};

