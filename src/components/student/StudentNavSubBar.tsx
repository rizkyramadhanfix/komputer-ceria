import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Keyboard,
  Gamepad2,
  Palette,
  Trophy,
  Search,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Star,
  Zap,
  Code2,
  Cpu,
  Shield,
  Layers,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { User } from '../../types';

interface StudentNavSubBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNavigator: () => void;
  student: User;
}

interface GameOption {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  category: 'coding' | 'hardware' | 'security' | 'creative';
}

const ALL_GAMES: GameOption[] = [
  // Koding & Algoritma
  { id: 'coding-lab', name: 'Lab Koding Blockly', icon: '🧩', badge: '15 LVL', category: 'coding' },
  { id: 'robot-maze', name: 'Robot Maze Runner', icon: '🤖', badge: '14 LVL', category: 'coding' },
  { id: 'grid-robot', name: 'Grid Robot Rover', icon: '🌐', badge: '16 LVL', category: 'coding' },
  { id: 'code-a-pet', name: 'Code-A-Pet Robot', icon: '🐾', badge: '8 EVO', category: 'coding' },
  { id: 'binary-code', name: 'Detektif Kode Biner', icon: '0️⃣1️⃣', badge: '8 LVL', category: 'coding' },

  // Hardware & Lab PC
  { id: 'pc-builder', name: 'Rakit PC Simulator', icon: '🖥️', badge: 'FAVORIT', category: 'hardware' },
  { id: 'pc-doctor', name: 'Dokter PC Troubleshooting', icon: '🩺', badge: 'KLINIK', category: 'hardware' },
  { id: 'port-master', name: 'Master Colokan & Port', icon: '🔌', badge: 'SOKET', category: 'hardware' },
  { id: 'lan-crimping', name: 'Crimping Kabel LAN RJ45', icon: '🌐', badge: 'T568B', category: 'hardware' },
  { id: 'network-builder', name: 'Rakit Jaringan Lab', icon: '📡', badge: 'WIFI', category: 'hardware' },
  { id: 'storage-master', name: 'Master Storage Data', icon: '💾', badge: 'GB/TB', category: 'hardware' },

  // Keamanan Siber
  { id: 'cyber-shield', name: 'Cyber Shield Firewall', icon: '🛡️', badge: 'AKSI', category: 'security' },
  { id: 'detective-hoax', name: 'Detektif Hoax & Fakta', icon: '🕵️‍♂️', badge: 'BERITA', category: 'security' },
  { id: 'anti-phishing', name: 'Detektif Anti-Phishing', icon: '🚨', badge: 'WASPADA', category: 'security' },
  { id: 'cyber-safety', name: 'Edukasi Etika Siber', icon: '🔒', badge: 'AMAN', category: 'security' },

  // Kreatif & Simulasi
  { id: 'pizza-tycoon', name: 'Excel Pizza Tycoon', icon: '🍕', badge: 'SERU', category: 'creative' },
  { id: 'spreadsheet', name: 'Petualangan Excel Cilik', icon: '📊', badge: 'TABEL', category: 'creative' },
  { id: 'mini-poster', name: 'Mini Poster Designer', icon: '🖼️', badge: 'DESAIN', category: 'creative' },
  { id: 'file-explorer', name: 'Misi File Explorer', icon: '📁', badge: 'FOLDER', category: 'creative' },
  { id: 'games', name: 'Kata Jatuh (Falling Words)', icon: '🔤', badge: 'ARKADE', category: 'creative' },
];

export const StudentNavSubBar: React.FC<StudentNavSubBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNavigator,
  student,
}) => {
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const gameMenuRef = useRef<HTMLDivElement>(null);

  // Close game menu dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (gameMenuRef.current && !gameMenuRef.current.contains(e.target as Node)) {
        setIsGameMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabLabelAndCategory = (tab: string) => {
    switch (tab) {
      case 'overview': return { label: 'Beranda', category: 'Utama', icon: '🏠' };
      case 'lessons': return { label: 'Modul Materi', category: 'Materi & Kuis', icon: '📖' };
      case 'quizzes': return { label: 'Kuis Mandiri', category: 'Materi & Kuis', icon: '❓' };
      case 'tech-glossary': return { label: 'Kamus A-Z IT', category: 'Materi & Kuis', icon: '📚' };
      case 'shortcuts': return { label: 'Shortcut Cepat', category: 'Materi & Kuis', icon: '⌨️' };
      case 'typing-league': return { label: 'Liga Mengetik Cepat', category: 'Ketik 10 Jari', icon: '🏆' };
      case 'typing': return { label: 'Mengetik Naskah Word', category: 'Ketik 10 Jari', icon: '📝' };
      case 'typing-hero': return { label: 'Typing Hero RPG', category: 'Ketik 10 Jari', icon: '⚡' };
      case 'rhythm-typing': return { label: 'Rhythm Typing Beats', category: 'Ketik 10 Jari', icon: '🎵' };
      case 'gallery': return { label: 'Galeri Karya Siswa', category: 'Karya Siswa', icon: '🎨' };
      case 'pixel-art': return { label: 'Studio Pixel Art 8-Bit', category: 'Karya Siswa', icon: '🖌️' };
      case 'leaderboard': return { label: 'Papan Peringkat', category: 'Prestasi & Hadiah', icon: '🏅' };
      case 'reward-shop': return { label: 'Toko Hadiah Sekolah', category: 'Prestasi & Hadiah', icon: '🎁' };
      case 'star-shop': return { label: 'Toko Avatar & Bingkai', category: 'Prestasi & Hadiah', icon: '✨' };
      case 'forum': return { label: 'Forum Diskusi', category: 'Prestasi & Hadiah', icon: '💬' };
      default: {
        const foundGame = ALL_GAMES.find((g) => g.id === tab);
        if (foundGame) {
          return { label: foundGame.name, category: 'Arena Game', icon: foundGame.icon };
        }
        return { label: 'Aktivitas Belajar', category: 'Siswa', icon: '🎮' };
      }
    }
  };

  const currentInfo = getTabLabelAndCategory(activeTab);
  const isInsideGame = ALL_GAMES.some((g) => g.id === activeTab) || ['typing-hero', 'rhythm-typing'].includes(activeTab);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-3 mb-6 transition-all">
      {/* Top Bar inside SubNav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: If inside specific game/tab, show big Back button & breadcrumbs */}
        {activeTab !== 'overview' ? (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelectTab('overview')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>

            {/* Breadcrumb Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs border border-slate-200 dark:border-slate-700">
              <span>{currentInfo.icon}</span>
              <span className="text-slate-400 font-semibold">{currentInfo.category}</span>
              <span className="text-slate-400">/</span>
              <span className="text-indigo-600 dark:text-indigo-400">{currentInfo.label}</span>
            </div>

            {/* Quick Game Switcher if inside Game */}
            {isInsideGame && (
              <div className="relative" ref={gameMenuRef}>
                <button
                  onClick={() => setIsGameMenuOpen(!isGameMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Ganti Game 🎮</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isGameMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isGameMenuOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="p-2 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Pilih Game Lainnya
                    </div>
                    {ALL_GAMES.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => {
                          onSelectTab(game.id);
                          setIsGameMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          activeTab === game.id
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 font-black'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span>{game.icon}</span>
                          <span className="truncate">{game.name}</span>
                        </span>
                        {game.badge && (
                          <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 rounded font-black shrink-0">
                            {game.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* When on Overview, show Quick Category Navigation */
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => onSelectTab('lessons')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                ['lessons', 'quizzes', 'tech-glossary', 'shortcuts'].includes(activeTab)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Materi & Kuis</span>
            </button>

            <button
              onClick={() => onSelectTab('typing-league')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                ['typing-league', 'typing', 'typing-hero', 'rhythm-typing'].includes(activeTab)
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-amber-500" />
              <span>Ketik 10 Jari</span>
              <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 rounded font-black">LIGA</span>
            </button>

            <button
              onClick={() => onSelectTab('pc-doctor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                isInsideGame
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
              <span>20 Game Edukasi</span>
            </button>

            <button
              onClick={() => onSelectTab('gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                ['gallery', 'pixel-art'].includes(activeTab)
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-pink-500" />
              <span>Galeri Karya</span>
            </button>

            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                ['leaderboard', 'reward-shop', 'star-shop', 'forum'].includes(activeTab)
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prestasi & Hadiah</span>
            </button>
          </div>
        )}

        {/* Right side: Quick Explorer Button & Student Points */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={onOpenNavigator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all"
            title="Buka Pusat Pencarian Semua Fitur & Game (Ctrl+K)"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Jelajah Menu & Cari 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
