import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Keyboard,
  Gamepad2,
  Palette,
} from 'lucide-react';

interface StudentMobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const StudentMobileBottomNav: React.FC<StudentMobileBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const isDashboard = currentView === 'student-dashboard';
  const isLessons = ['student-lessons', 'student-quizzes', 'student-glossary', 'student-shortcuts'].includes(currentView);
  const isTyping = ['student-typing-league', 'student-typing', 'student-typing-hero', 'student-rhythm-typing'].includes(currentView);
  const isGallery = ['student-gallery', 'gallery', 'student-pixel-art'].includes(currentView);
  const isGames = [
    'student-coding-lab',
    'student-robot-maze',
    'student-grid-robot',
    'student-code-a-pet',
    'student-binary-code',
    'student-pc-builder',
    'student-pc-doctor',
    'student-port-master',
    'student-lan-crimping',
    'student-network-builder',
    'student-storage-master',
    'student-cyber-shield',
    'student-detective-hoax',
    'student-anti-phishing',
    'student-cyber-safety',
    'student-pizza-tycoon',
    'student-spreadsheet',
    'student-mini-poster',
    'student-file-explorer',
    'student-games',
  ].includes(currentView);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {/* 1. Beranda */}
      <button
        onClick={() => onNavigate('student-dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          isDashboard
            ? 'text-indigo-600 dark:text-indigo-400 font-black scale-105'
            : 'text-slate-500 dark:text-slate-400 font-medium'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Beranda</span>
      </button>

      {/* 2. Materi */}
      <button
        onClick={() => onNavigate('student-lessons')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          isLessons
            ? 'text-blue-600 dark:text-blue-400 font-black scale-105'
            : 'text-slate-500 dark:text-slate-400 font-medium'
        }`}
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Belajar</span>
      </button>

      {/* 3. Ketik */}
      <button
        onClick={() => onNavigate('student-typing-league')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          isTyping
            ? 'text-amber-500 dark:text-amber-400 font-black scale-105'
            : 'text-slate-500 dark:text-slate-400 font-medium'
        }`}
      >
        <Keyboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Ketik 10</span>
      </button>

      {/* 4. Games */}
      <button
        onClick={() => onNavigate('student-coding-lab')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          isGames
            ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
            : 'text-slate-500 dark:text-slate-400 font-medium'
        }`}
      >
        <Gamepad2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Games</span>
      </button>

      {/* 5. Galeri */}
      <button
        onClick={() => onNavigate('student-gallery')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
          isGallery
            ? 'text-pink-600 dark:text-pink-400 font-black scale-105'
            : 'text-slate-500 dark:text-slate-400 font-medium'
        }`}
      >
        <Palette className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Galeri</span>
      </button>


    </div>
  );
};
