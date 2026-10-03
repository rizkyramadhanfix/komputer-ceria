import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints, recordShortcutCompleted } from '../../services/storageService';

interface ShortcutChallenge {
  id: string;
  name: string;
  description: string;
  keys: string[]; // e.g. ['Control', 'c']
  displayCombo: string; // 'Ctrl + C'
  icon: string;
}

interface ShortcutLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  points: number;
  challenges: ShortcutChallenge[];
}

const SHORTCUT_LEVELS: ShortcutLevel[] = [
  {
    id: 1,
    title: 'Level 1: Olah Teks & Dokumen Esensial',
    subtitle: 'Salin, Tempel, Simpan, & Batalkan',
    description: 'Pintasan paling wajib dikuasai untuk mengetik tugas sekolah dan menyimpan file.',
    points: 40,
    challenges: [
      {
        id: 'sc-copy',
        name: 'Menyalin Teks (Copy)',
        description: 'Pintasan paling penting untuk menyalin teks atau gambar yang dipilih ke clipboard.',
        keys: ['Control', 'c'],
        displayCombo: 'Ctrl + C',
        icon: '📋',
      },
      {
        id: 'sc-paste',
        name: 'Menempel Teks (Paste)',
        description: 'Menempelkan teks yang sudah disalin sebelumnya ke lembar kerja dokumen.',
        keys: ['Control', 'v'],
        displayCombo: 'Ctrl + V',
        icon: '📌',
      },
      {
        id: 'sc-cut',
        name: 'Memotong Teks (Cut)',
        description: 'Menghapus teks dari tempat asal dan menyimpannya untuk dipindahkan ke tempat baru.',
        keys: ['Control', 'x'],
        displayCombo: 'Ctrl + X',
        icon: '✂️',
      },
      {
        id: 'sc-save',
        name: 'Menyimpan Dokumen (Save)',
        description: 'Wajib ditekan secara rutin agar hasil ketikan tidak hilang saat listrik padam.',
        keys: ['Control', 's'],
        displayCombo: 'Ctrl + S',
        icon: '💾',
      },
      {
        id: 'sc-undo',
        name: 'Batalkan Perintah (Undo)',
        description: 'Jika kamu salah mengetik atau terhapus, gunakan pintasan ini untuk kembali ke keadaan sebelumnya.',
        keys: ['Control', 'z'],
        displayCombo: 'Ctrl + Z',
        icon: '↩️',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Seleksi, Pencarian & Cetak',
    subtitle: 'Pilih Semua, Cari Kata, Cetak, & Dokumen Baru',
    description: 'Kuasai pintasan produktivitas untuk mengolah naskah panjang dan mencetak berkas.',
    points: 60,
    challenges: [
      {
        id: 'sc-select-all',
        name: 'Pilih Semua (Select All)',
        description: 'Menandai seluruh teks dalam dokumen atau seluruh file dalam satu folder.',
        keys: ['Control', 'a'],
        displayCombo: 'Ctrl + A',
        icon: '🟦',
      },
      {
        id: 'sc-find',
        name: 'Mencari Kata (Find)',
        description: 'Mencari kata kunci tertentu di dalam naskah dokumen yang sangat panjang.',
        keys: ['Control', 'f'],
        displayCombo: 'Ctrl + F',
        icon: '🔍',
      },
      {
        id: 'sc-print',
        name: 'Mencetak Lembar Kerja (Print)',
        description: 'Membuka dialog cetak untuk mengirim dokumen ke mesin printer lab.',
        keys: ['Control', 'p'],
        displayCombo: 'Ctrl + P',
        icon: '🖨️',
      },
      {
        id: 'sc-redo',
        name: 'Ulangi Perintah (Redo)',
        description: 'Kebalikan dari Undo, untuk memulihkan kembali apa yang baru saja dibatalkan.',
        keys: ['Control', 'y'],
        displayCombo: 'Ctrl + Y',
        icon: '↪️',
      },
      {
        id: 'sc-new',
        name: 'Dokumen Baru (New Document)',
        description: 'Membuka lembar kerja dokumen kosong baru secara instan.',
        keys: ['Control', 'n'],
        displayCombo: 'Ctrl + N',
        icon: '📄',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Sistem Windows & Navigasi Cepat',
    subtitle: 'Task Manager, Desktop, & File Explorer',
    description: 'Trik tombol cepat keyboard para teknisi komputer profesional.',
    points: 80,
    challenges: [
      {
        id: 'sc-desktop',
        name: 'Tampilkan Layar Desktop (Win+D)',
        description: 'Meminimize seluruh jendela aplikasi yang terbuka dan langsung melihat layar desktop utama.',
        keys: ['Meta', 'd'],
        displayCombo: 'Win + D',
        icon: '🖥️',
      },
      {
        id: 'sc-explorer',
        name: 'Buka File Explorer (Win+E)',
        description: 'Membuka jendela penjelajah berkas untuk mencari folder tugas di drive komputer.',
        keys: ['Meta', 'e'],
        displayCombo: 'Win + E',
        icon: '📂',
      },
      {
        id: 'sc-task-mgr',
        name: 'Buka Task Manager (Ctrl+Shift+Esc)',
        description: 'Melihat program apa saja yang sedang berjalan di sistem dan menutup aplikasi macet.',
        keys: ['Control', 'Shift', 'Escape'],
        displayCombo: 'Ctrl + Shift + Esc',
        icon: '📊',
      },
    ],
  },
];

export const ShortcutMaster: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = SHORTCUT_LEVELS[currentLevelIdx];

  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [completedInLevel, setCompletedInLevel] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const currentChallenge = currentLevel.challenges[currentChallengeIdx];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default actions for training
      if (
        (e.ctrlKey || e.metaKey) &&
        ['s', 'p', 'f', 'a', 'z', 'b', 'i', 'u', 'c', 'v', 'y', 'n', 'd', 'e'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      const keyName = e.key;
      setPressedKeys((prev) => new Set(prev).add(keyName.toLowerCase()));

      if (showLevelVictory || showGrandVictory || !currentChallenge) return;

      // Check combo
      const requiredKeys = currentChallenge.keys.map((k) => k.toLowerCase());
      const hasAll = requiredKeys.every(
        (k) =>
          k === 'control'
            ? e.ctrlKey || e.metaKey
            : k === 'shift'
            ? e.shiftKey
            : k === 'meta'
            ? e.metaKey
            : e.key.toLowerCase() === k || pressedKeys.has(k)
      );

      if (hasAll) {
        setSuccessAnimation(true);
        setTimeout(() => setSuccessAnimation(false), 700);

        if (!completedInLevel.includes(currentChallenge.id)) {
          const nextCompleted = [...completedInLevel, currentChallenge.id];
          setCompletedInLevel(nextCompleted);

          if (currentChallengeIdx + 1 < currentLevel.challenges.length) {
            setTimeout(() => {
              setCurrentChallengeIdx((prev) => prev + 1);
            }, 600);
          } else {
            // Level finished!
            setTimeout(() => {
              finishLevel();
            }, 600);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyName = e.key;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyName.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentChallengeIdx, currentChallenge, completedInLevel, showLevelVictory, showGrandVictory, currentLevel]);

  const finishLevel = () => {
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      if (currentUser) {
        const bonus = currentLevel.points;
        awardStudentPoints(currentUser.id, bonus);
        recordShortcutCompleted(currentUser.id);
        refreshUser();
        showStarReward(
          Math.max(1, Math.floor(bonus / 10)),
          `${currentLevel.title} Selesai! Kamu menguasai semua tombol pintasan (+${bonus} Poin)!`,
          'Bintang Pintasan Master!'
        );
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < SHORTCUT_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      setCurrentChallengeIdx(0);
      setCompletedInLevel([]);
      setPressedKeys(new Set());
    } else {
      setShowGrandVictory(true);
    }
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    setCurrentChallengeIdx(0);
    setCompletedInLevel([]);
    setPressedKeys(new Set());
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const handleResetLevel = () => {
    setCurrentChallengeIdx(0);
    setCompletedInLevel([]);
    setPressedKeys(new Set());
    setShowLevelVictory(false);
  };

  const handleRestartFromBeginning = () => {
    setCurrentLevelIdx(0);
    setCurrentChallengeIdx(0);
    setCompletedInLevel([]);
    setCompletedLevels([]);
    setPressedKeys(new Set());
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Ctrl', 'Shift', 'Win', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Space'],
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" />
              Simulator Pintasan Keyboard
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-bold text-slate-500">
              Level {currentLevel.id} dari {SHORTCUT_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {currentLevel.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLevel.description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Level Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {SHORTCUT_LEVELS.map((lvl, idx) => {
              const isDone = completedLevels.includes(lvl.id);
              const isCurrent = idx === currentLevelIdx;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevelTab(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  <span>Lvl {lvl.id}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetLevel}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Challenge Card */}
      {currentChallenge && (
        <div
          className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
            successAnimation
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 scale-[1.01]'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="text-4xl p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
                {currentChallenge.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400">
                  Tantangan {currentChallengeIdx + 1} dari {currentLevel.challenges.length}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentChallenge.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  {currentChallenge.description}
                </p>
              </div>
            </div>

            {/* Target Keys Display */}
            <div className="text-center sm:text-right shrink-0 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Kombinasi Tombol:
              </span>
              <kbd className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-300 font-mono font-black text-base shadow-inner inline-block">
                {currentChallenge.displayCombo}
              </kbd>
            </div>
          </div>
        </div>
      )}

      {/* Visual Keyboard Simulation Helper */}
      <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 text-center shadow-inner">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
          Simulator Papan Tombol Fisik:
        </span>
        <div className="space-y-1.5 flex flex-col items-center">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-center flex-wrap">
              {row.map((k) => {
                const isTarget = currentChallenge?.keys.some(
                  (tk) =>
                    tk.toLowerCase() === k.toLowerCase() ||
                    (tk.toLowerCase() === 'control' && k === 'Ctrl') ||
                    (tk.toLowerCase() === 'meta' && k === 'Win') ||
                    (tk.toLowerCase() === 'escape' && k === 'Esc')
                );
                const isPressed =
                  pressedKeys.has(k.toLowerCase()) ||
                  (pressedKeys.has('control') && k === 'Ctrl') ||
                  (pressedKeys.has('meta') && k === 'Win') ||
                  (pressedKeys.has('shift') && k === 'Shift') ||
                  (pressedKeys.has('escape') && k === 'Esc');

                return (
                  <span
                    key={k}
                    className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all duration-150 ${
                      isPressed
                        ? 'bg-emerald-500 text-slate-950 scale-95 shadow-md shadow-emerald-500/30'
                        : isTarget
                        ? 'bg-indigo-600 text-white animate-pulse ring-2 ring-indigo-400'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {k}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Level Victory Modal & Lanjut Level */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Pintasan Berhasil Dikuasai!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Kamu telah menyelesaikan semua tantangan pintasan keyboard pada {currentLevel.subtitle}!
              </p>
            </div>

            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-900 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">Poin Didapatkan</span>
              <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                +{currentLevel.points} Poin (★ {Math.floor(currentLevel.points / 10)} Bintang)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleResetLevel}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < SHORTCUT_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Shortcut Master!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Gelar Produktivitas Komputer
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Shortcut Keyboard Master Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menguasai seluruh kombinasi tombol pintas teks, pencarian, cetak dokumen, hingga sistem Windows Explorer!
              </p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
