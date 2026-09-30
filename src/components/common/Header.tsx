import React, { useState } from 'react';
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  RotateCw, 
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getDashboardConfig } from '../../services/storageService';
import { Avatar } from './Avatar';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuthModal: (mode: 'admin' | 'superadmin' | 'pembina' | 'student-login' | 'student-register') => void;
  onOpenProfileModal?: () => void;
  onOpenAnnouncementModal?: () => void;
  onOpenContactModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAnnouncementModal,
  onOpenContactModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout, isAdmin, isSuperAdmin, isPembina, isStudent, assignedSchool } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dashboardConfig = getDashboardConfig();

  const handleNavClick = (view: string) => {
    onNavigate(view);
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
                  currentView === 'gallery' || currentView === 'student-gallery' ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>Karya Siswa</span>
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
              {/* Menu Dashboard Utama */}
              <button
                onClick={() => handleNavClick('student-dashboard')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 ${
                  currentView === 'student-dashboard' ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              {/* Menu Leaderboard */}
              <button
                onClick={() => handleNavClick('student-leaderboard')}
                className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 ${
                  currentView === 'student-leaderboard' ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard</span>
              </button>

              {/* Dropdown: Belajar & Kuis */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('belajar')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['student-lessons', 'student-quizzes', 'student-quiz-duel'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <span>Materi & Kuis</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'belajar' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  <button onClick={() => handleNavClick('student-lessons')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Daftar Materi</span>
                  </button>
                  <button onClick={() => handleNavClick('student-quizzes')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Kuis Mandiri</span>
                  </button>
                  <button onClick={() => handleNavClick('student-quiz-duel')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                    <span>Duel Cerdas Cermat</span>
                  </button>
                </div>
              </div>

              {/* Dropdown: Latihan Mengetik */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('mengetik')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['student-typing', 'student-typing-hero', 'student-typing-race'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <span>Latihan Mengetik</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'mengetik' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  <button onClick={() => handleNavClick('student-typing')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Mengetik MS Word</span>
                  </button>
                  <button onClick={() => handleNavClick('student-typing-hero')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <span>Typing Hero RPG</span>
                  </button>
                  <button onClick={() => handleNavClick('student-typing-race')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 text-pink-500" />
                    <span>Balap Ketik Mobil</span>
                  </button>
                  <button onClick={() => handleNavClick('student-tournaments')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Turnamen Liga Ketik</span>
                  </button>
                </div>
              </div>

              {/* Dropdown: Arena Game */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('game')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['student-games', 'student-pc-doctor', 'student-pixel-art', 'student-spreadsheet', 'student-pc-builder', 'student-coding-lab', 'student-file-explorer', 'student-network-builder', 'student-cyber-safety'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <span>Arena Game</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'game' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 max-h-96 overflow-y-auto"
                >
                  <button onClick={() => handleNavClick('student-pc-doctor')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dokter PC (Troubleshooting)</span>
                  </button>
                  <button onClick={() => handleNavClick('student-pixel-art')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Studio Pixel Art 8-Bit</span>
                  </button>
                  <button onClick={() => handleNavClick('student-spreadsheet')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Petualangan Excel Cilik</span>
                  </button>
                  <button onClick={() => handleNavClick('student-pc-builder')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <Cpu className="w-3.5 h-3.5 text-amber-600" />
                    <span>Rakit PC Simulator</span>
                  </button>
                  <button onClick={() => handleNavClick('student-coding-lab')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lab Koding Blockly</span>
                  </button>
                  <button onClick={() => handleNavClick('student-file-explorer')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-blue-400" />
                    <span>Misi File Explorer</span>
                  </button>
                  <button onClick={() => handleNavClick('student-network-builder')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Rakit Jaringan Network</span>
                  </button>
                  <button onClick={() => handleNavClick('student-cyber-safety')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-rose-500" />
                    <span>Edukasi Keamanan Siber</span>
                  </button>
                  <button onClick={() => handleNavClick('student-games')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Kata Jatuh (Falling Words)</span>
                  </button>
                </div>
              </div>

              {/* Lainnya */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('lainnya')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['student-gallery', 'student-reward-shop', 'student-glossary', 'student-shortcuts', 'student-forum', 'student-star-shop'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <span>Lainnya</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'lainnya' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
                  <button onClick={() => handleNavClick('student-gallery')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Image className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Galeri Karya Siswa</span>
                  </button>
                  <button onClick={() => handleNavClick('student-reward-shop')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    <span>Toko Hadiah Sekolah</span>
                  </button>
                  <button onClick={() => handleNavClick('student-glossary')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <BookA className="w-3.5 h-3.5 text-sky-500" />
                    <span>Kamus A-Z Teknologi</span>
                  </button>
                  <button onClick={() => handleNavClick('student-shortcuts')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Koleksi Shortcut</span>
                  </button>
                  <button onClick={() => handleNavClick('student-forum')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Forum Diskusi</span>
                  </button>
                  <button onClick={() => handleNavClick('student-star-shop')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                    <span>Toko Hadiah Avatar</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {isAdmin && (
            <>
              {/* Dropdown: Data Master */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('admin-data')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['admin-pembina', 'admin-students', 'admin-lessons', 'admin-quizzes', 'admin-typing'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
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
                  {isSuperAdmin && (
                    <button onClick={() => handleNavClick('admin-pembina')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800">
                      <School className="w-3.5 h-3.5 text-purple-500" />
                      <span>Manajemen Akun Pembina</span>
                    </button>
                  )}
                  <button onClick={() => handleNavClick('admin-students')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isPembina ? `Siswa ${assignedSchool || ''}` : 'Manajemen Siswa'}</span>
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
                  <button onClick={() => handleNavClick('admin-tournaments')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-t border-slate-100 dark:border-slate-800/80 mt-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Turnamen Liga Ketik</span>
                  </button>
                </div>
              </div>

              {/* Dropdown: Monitoring */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setActiveDropdown('admin-monitor')}
                  className={`transition-all hover:text-indigo-600 dark:hover:text-indigo-400 py-1 flex items-center gap-1 cursor-pointer ${
                    ['admin-login-activity', 'admin-submissions', 'admin-gallery', 'admin-forum', 'admin-games'].includes(currentView) ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Monitoring</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'admin-monitor' ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50"
                >
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

          {/* REQUIRED: Menu refresh halaman bentuknya logo saja di pojok kanan atas sebelum tombol keluar */}
          <button
            onClick={() => window.location.reload()}
            title="Segarkan Halaman"
            aria-label="Segarkan Halaman"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
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
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 max-w-[140px] truncate">
                    {currentUser.name}
                  </span>
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
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuthModal('student-login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                🎓 Login Siswa
              </button>
              <button
                onClick={() => onOpenAuthModal('pembina')}
                className="px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                🏫 Login Pembina
              </button>
              <button
                onClick={() => onOpenAuthModal('superadmin')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                👑 Login Superadmin
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
                  className="w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  <span>Karya Siswa</span>
                </button>
              </>
            )}

            {isStudent && (
              <>
                <button
                  onClick={() => handleNavClick('student-dashboard')}
                  className="w-full text-left py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Materi & Kuis</p>
                  <button onClick={() => handleNavClick('student-lessons')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Daftar Materi</button>
                  <button onClick={() => handleNavClick('student-quizzes')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Kuis Mandiri</button>
                  <button onClick={() => handleNavClick('student-quiz-duel')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Duel Cerdas Cermat</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Latihan Mengetik</p>
                  <button onClick={() => handleNavClick('student-typing')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Mengetik MS Word</button>
                  <button onClick={() => handleNavClick('student-typing-hero')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Typing Hero RPG</button>
                  <button onClick={() => handleNavClick('student-typing-race')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Balap Ketik Mobil</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Arena Game & Simulasi</p>
                  <button onClick={() => handleNavClick('student-pc-doctor')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Dokter PC (Troubleshooting)</button>
                  <button onClick={() => handleNavClick('student-pixel-art')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Studio Pixel Art 8-Bit</button>
                  <button onClick={() => handleNavClick('student-spreadsheet')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Petualangan Excel Cilik</button>
                  <button onClick={() => handleNavClick('student-games')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Kata Jatuh</button>
                  <button onClick={() => handleNavClick('student-pc-builder')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Rakit PC Simulator</button>
                  <button onClick={() => handleNavClick('student-coding-lab')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Lab Koding Blockly</button>
                  <button onClick={() => handleNavClick('student-file-explorer')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Misi File Explorer</button>
                  <button onClick={() => handleNavClick('student-network-builder')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Rakit Jaringan</button>
                  <button onClick={() => handleNavClick('student-cyber-safety')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Keamanan Siber</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Fitur Lainnya</p>
                  <button onClick={() => handleNavClick('student-gallery')} className="w-full text-left py-2 px-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Galeri Karya Siswa</button>
                  <button onClick={() => handleNavClick('student-reward-shop')} className="w-full text-left py-2 px-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700">Toko Hadiah Sekolah</button>
                  <button onClick={() => handleNavClick('student-glossary')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Kamus A-Z Teknologi</button>
                  <button onClick={() => handleNavClick('student-shortcuts')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Koleksi Shortcut</button>
                  <button onClick={() => handleNavClick('student-forum')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Forum Diskusi</button>
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
                  {isSuperAdmin && (
                    <button onClick={() => handleNavClick('admin-pembina')} className="w-full text-left py-2 px-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700">Manajemen Akun Pembina</button>
                  )}
                  <button onClick={() => handleNavClick('admin-students')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Manajemen Siswa</button>
                  <button onClick={() => handleNavClick('admin-lessons')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Materi Belajar</button>
                  <button onClick={() => handleNavClick('admin-quizzes')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Bank Kuis</button>
                  <button onClick={() => handleNavClick('admin-typing')} className="w-full text-left py-2 px-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">Tugas Mengetik</button>
                  <button onClick={() => handleNavClick('admin-tournaments')} className="w-full text-left py-2 px-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500 animate-pulse" />Turnamen Liga Ketik</button>
                </div>

                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Monitoring</p>
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
                className="w-full py-2 text-center text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>🎓 Login Siswa</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('pembina');
                }}
                className="w-full py-2 text-center text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>🏫 Login Pembina Sekolah</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('superadmin');
                }}
                className="w-full py-2 text-center text-xs font-bold text-white bg-indigo-600 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>👑 Login Superadmin</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

