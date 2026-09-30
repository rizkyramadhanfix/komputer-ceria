import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Sparkles,
  Trophy,
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

const CHALLENGES: ShortcutChallenge[] = [
  {
    id: 'sc-copy',
    name: 'Menyalin Teks (Copy)',
    description: 'Pintasan paling penting untuk menyalin teks atau gambar yang dipilih.',
    keys: ['Control', 'c'],
    displayCombo: 'Ctrl + C',
    icon: '📋',
  },
  {
    id: 'sc-paste',
    name: 'Menempel Teks (Paste)',
    description: 'Menempelkan teks yang sudah disalin sebelumnya ke lembar kerja.',
    keys: ['Control', 'v'],
    displayCombo: 'Ctrl + V',
    icon: '📌',
  },
  {
    id: 'sc-cut',
    name: 'Memotong Teks (Cut)',
    description: 'Menghapus teks dari tempat asal dan menyimpannya untuk dipindahkan.',
    keys: ['Control', 'x'],
    displayCombo: 'Ctrl + X',
    icon: '✂️',
  },
  {
    id: 'sc-save',
    name: 'Menyimpan Dokumen (Save)',
    description: 'Wajib dilakukan agar pekerjaan tidak hilang saat komputer mati.',
    keys: ['Control', 's'],
    displayCombo: 'Ctrl + S',
    icon: '💾',
  },
  {
    id: 'sc-undo',
    name: 'Batalkan Perintah (Undo)',
    description: 'Jika kamu melakukan kesalahan, gunakan ini untuk kembali ke sebelumnya.',
    keys: ['Control', 'z'],
    displayCombo: 'Ctrl + Z',
    icon: '↩️',
  },
  {
    id: 'sc-redo',
    name: 'Ulangi Perintah (Redo)',
    description: 'Kebalikan dari Undo, untuk mengulangi apa yang baru saja dibatalkan.',
    keys: ['Control', 'y'],
    displayCombo: 'Ctrl + Y',
    icon: '↪️',
  },
  {
    id: 'sc-print',
    name: 'Mencetak (Print)',
    description: 'Membuka jendela cetak untuk mengirim dokumen ke printer.',
    keys: ['Control', 'p'],
    displayCombo: 'Ctrl + P',
    icon: '🖨️',
  },
  {
    id: 'sc-select-all',
    name: 'Pilih Semua (Select All)',
    description: 'Menandai seluruh teks atau file di dalam satu folder/halaman.',
    keys: ['Control', 'a'],
    displayCombo: 'Ctrl + A',
    icon: '🟦',
  },
  {
    id: 'sc-find',
    name: 'Mencari Kata (Find)',
    description: 'Mencari kata atau kalimat tertentu dalam dokumen yang sangat panjang.',
    keys: ['Control', 'f'],
    displayCombo: 'Ctrl + F',
    icon: '🔍',
  },
  {
    id: 'sc-new',
    name: 'Dokumen Baru (New)',
    description: 'Membuka dokumen atau jendela aplikasi baru dengan cepat.',
    keys: ['Control', 'n'],
    displayCombo: 'Ctrl + N',
    icon: '📄',
  },
  {
    id: 'sc-task-mgr',
    name: 'Task Manager (Ctrl+Shift+Esc)',
    description: 'Melihat program apa saja yang sedang berjalan di sistem Windows.',
    keys: ['Control', 'Shift', 'Escape'],
    displayCombo: 'Ctrl + Shift + Esc',
    icon: '📊',
  },
  {
    id: 'sc-desktop',
    name: 'Tampilkan Desktop (Win+D)',
    description: 'Menyembunyikan semua jendela dan langsung melihat layar desktop.',
    keys: ['Meta', 'd'],
    displayCombo: 'Win + D',
    icon: '🖥️',
  },
  {
    id: 'sc-explorer',
    name: 'File Explorer (Win+E)',
    description: 'Membuka jendela untuk mencari file atau folder di komputer.',
    keys: ['Meta', 'e'],
    displayCombo: 'Win + E',
    icon: '📂',
  }
];

export const ShortcutMaster: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const currentChallenge = CHALLENGES[currentIdx];

  // Listen to keyboard keydown and keyup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default shortcut actions during training (e.g. Ctrl+S save webpage, Ctrl+P print)
      if (
        (e.ctrlKey || e.metaKey) &&
        ['s', 'p', 'f', 'a', 'z', 'b', 'i', 'u', 'c', 'v'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      const keyName = e.key;
      setPressedKeys((prev) => new Set(prev).add(keyName.toLowerCase()));

      if (isDone || !currentChallenge) return;

      // Check if current challenge requirements are met
      const requiredKeys = currentChallenge.keys.map((k) => k.toLowerCase());
      const hasAll = requiredKeys.every(
        (k) =>
          k === 'control'
            ? e.ctrlKey || e.metaKey
            : e.key.toLowerCase() === k || pressedKeys.has(k)
      );

      if (hasAll) {
        // Solved challenge!
        setSuccessAnimation(true);
        setTimeout(() => setSuccessAnimation(false), 800);

        if (!completedList.includes(currentChallenge.id)) {
          const nextCompleted = [...completedList, currentChallenge.id];
          setCompletedList(nextCompleted);

          if (currentIdx + 1 < CHALLENGES.length) {
            setTimeout(() => {
              setCurrentIdx((prev) => prev + 1);
            }, 600);
          } else {
            // All completed!
            setIsDone(true);
            if (currentUser) {
              awardStudentPoints(currentUser.id, 50);
              recordShortcutCompleted(currentUser.id);
              refreshUser();
              showStarReward(
                5,
                'Luar biasa! Anda telah menyelesaikan seluruh tantangan Shortcut Master dan meraih +50 Poin (+5 Bintang)!',
                'Bintang Pintasan Master!'
              );
            }
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
  }, [currentIdx, currentChallenge, completedList, isDone, currentUser, refreshUser, showSuccess]);

  const handleReset = () => {
    setCurrentIdx(0);
    setCompletedList([]);
    setIsDone(false);
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Ctrl', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Space'],
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Keyboard className="w-4 h-4" />
              Simulator Pintasan Keyboard
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              Progres: {completedList.length}/{CHALLENGES.length} Selesai
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Shortcut Keyboard Master
          </h2>
          <p className="text-xs text-slate-500">
            Tekan kombinasi tombol pada keyboard fisik Anda sesuai instruksi di layar.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Tantangan</span>
        </button>
      </div>

      {!isDone ? (
        <div className="space-y-6">
          {/* Active Challenge Banner */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all text-center relative overflow-hidden ${
              successAnimation
                ? 'bg-emerald-500 text-white border-emerald-400 scale-[1.02]'
                : 'bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border-indigo-200 dark:border-indigo-800/60'
            }`}
          >
            <div className="text-4xl mb-2">{currentChallenge.icon}</div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Tantangan {currentIdx + 1} dari {CHALLENGES.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentChallenge.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1">
              {currentChallenge.description}
            </p>

            {/* Huge Glowing Combo Display */}
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 text-lg sm:text-xl font-mono font-black tracking-widest animate-pulse">
              <span>{currentChallenge.displayCombo}</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
              👉 Tekan kombinasi tombol <strong>{currentChallenge.displayCombo}</strong> di keyboard sekarang!
            </p>
          </div>

          {/* Interactive Visual Keyboard Component */}
          <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 max-w-xl mx-auto shadow-inner">
            <p className="text-[10px] font-bold uppercase text-slate-400 text-center tracking-wider mb-2">
              Visual Keyboard Indicator (Menyala saat tombol ditekan)
            </p>
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((key) => {
                  const lower = key.toLowerCase();
                  const isPressed =
                    lower === 'ctrl'
                      ? pressedKeys.has('control')
                      : lower === 'space'
                      ? pressedKeys.has(' ')
                      : pressedKeys.has(lower);

                  const isTarget =
                    lower === 'ctrl'
                      ? currentChallenge.keys.includes('Control')
                      : currentChallenge.keys.map((k) => k.toLowerCase()).includes(lower);

                  return (
                    <div
                      key={key}
                      className={`h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all shadow-xs border ${
                        key === 'Space'
                          ? 'w-32'
                          : key === 'Ctrl'
                          ? 'w-14'
                          : 'w-9 sm:w-11'
                      } ${
                        isPressed
                          ? 'bg-indigo-600 text-white border-indigo-400 scale-95 shadow-indigo-500/50'
                          : isTarget
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 animate-pulse'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {key}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CHALLENGES.map((ch, idx) => {
              const done = completedList.includes(ch.id);
              const active = idx === currentIdx;

              return (
                <button
                  key={ch.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                    done
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : null}
                  <span>{ch.displayCombo}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Completed All Screen */
        <div className="py-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Selamat! Master Shortcut Keyboard!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Anda telah berhasil menguasai seluruh pintasan keyboard penting untuk Microsoft Word dan komputer. Keterampilan ini akan membuat pekerjaan mengetik Anda berkali-kali lipat lebih cepat!
          </p>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-300">
            ★ +50 Poin Bintang & Lencana "Master Shortcut" Telah Terbuka! ★
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Latih Ulang dari Awal
          </button>
        </div>
      )}
    </div>
  );
};
