import React, { useState } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  Layers,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

interface QuestionItem {
  id: number;
  question: string;
  category: 'Satuan Dasar' | 'Kapasitas Flashdisk' | 'Konversi Byte' | 'Perbandingan File';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const STORAGE_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: 'Urutan tingkatan kapasitas penyimpanan data dari yang TERKECIL ke TERBESAR adalah...',
    category: 'Satuan Dasar',
    options: [
      'Byte → KB → MB → GB → TB',
      'TB → GB → MB → KB → Byte',
      'KB → MB → Byte → GB → TB',
      'Byte → MB → KB → TB → GB',
    ],
    correctAnswer: 0,
    explanation: '1 Byte < 1 Kilobyte (KB) < 1 Megabyte (MB) < 1 Gigabyte (GB) < 1 Terabyte (TB).',
  },
  {
    id: 2,
    question: 'Berapa jumlah Byte dalam 1 Kilobyte (KB) standar biner komputer?',
    category: 'Konversi Byte',
    options: ['100 Byte', '512 Byte', '1.024 Byte', '10.000 Byte'],
    correctAnswer: 2,
    explanation: 'Dalam sistem biner kelipatan 2¹⁰, 1 Kilobyte setara dengan 1.024 Byte (atau ~1.000 Byte sistem desimal).',
  },
  {
    id: 3,
    question: 'Sebuah lagu MP3 rata-rata berukuran 4 MB. Berapa perkiraan lagu yang bisa disimpan dalam Flashdisk berkapasitas 4 GB (4.000 MB)?',
    category: 'Kapasitas Flashdisk',
    options: ['100 Lagu', '250 Lagu', '1.000 Lagu', '10.000 Lagu'],
    correctAnswer: 2,
    explanation: '4 GB = 4.000 MB. Maka 4.000 MB ÷ 4 MB = sekitar 1.000 Lagu MP3!',
  },
  {
    id: 4,
    question: '1 Bit adalah satuan terkecil data komputer yang hanya bernilai dua angka, yaitu...',
    category: 'Satuan Dasar',
    options: ['1 dan 2', '0 dan 1 (Biner)', 'A dan B', 'True dan Null'],
    correctAnswer: 1,
    explanation: '1 Bit (Binary Digit) merepresentasikan sinyal digital ON (1) atau OFF (0). 8 Bit bergabung membentuk 1 Byte.',
  },
  {
    id: 5,
    question: 'Manakah media penyimpanan komputer yang biasanya memiliki kapasitas TERBESAR untuk menyimpan ratusan game dan ribuan video?',
    category: 'Perbandingan File',
    options: [
      'Disket Floppy (1.44 MB)',
      'Keping CD-ROM (700 MB)',
      'Hard Disk Drive / SSD (1 TB = 1.000 GB)',
      'Keping DVD (4.7 GB)',
    ],
    correctAnswer: 2,
    explanation: 'Harddisk/SSD modern berkapasitas Terabyte (1 TB = 1.000.000 MB), jauh lebih besar daripada CD/DVD.',
  },
];

export const StorageMasterGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const q = STORAGE_QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === q.correctAnswer) {
      setScore((s) => s + 20);
      setCorrectAnswers((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < STORAGE_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    const finalScore = score + (selectedOpt === q.correctAnswer ? 20 : 0);
    if (currentUser) {
      const earned = Math.min(50, Math.floor(finalScore / 2));
      const ratio = getGamificationConfig().pointsToStarRatio || 10;
      const updatedTotal = (currentUser.totalPoints || 0) + earned;
      updateUser(currentUser.id, {
        totalPoints: updatedTotal,
        totalStars: Math.floor(updatedTotal / ratio),
      });
      refreshUser();
      showSuccess(`Kuis Satuan Data Selesai! Anda meraih ${finalScore} Pts (+${earned} Poin).`);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectAnswers(0);
    setIsFinished(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <HardDrive className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Storage Master: Byte to Gigabyte</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Satuan Data
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kuasai konsep kapasitas memori: Bit, Byte, Kilobyte (KB), Megabyte (MB), Gigabyte (GB), & Terabyte (TB).
            </p>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulang Kuis</span>
        </button>
      </div>

      {/* Visual Hierarchy Ladder Bar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-mono">
        {['1 Bit', '8 Bit = 1 Byte', '1.024 B = 1 KB', '1.024 KB = 1 MB', '1.024 MB = 1 GB', '1.024 GB = 1 TB'].map((tier, idx) => (
          <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
            {tier}
          </div>
        ))}
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          {/* Question Card */}
          <div className="p-6 bg-slate-950 border-2 border-sky-500/30 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-sky-400">Soal {currentIdx + 1} dari {STORAGE_QUESTIONS.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 text-[10px] font-bold">
                Kategori: {q.category}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {q.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {q.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                if (isAnswered) {
                  if (idx === q.correctAnswer) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswered && idx === selectedOpt && idx !== q.correctAnswer && (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
                <span className="font-bold text-sky-400 block">💡 Pembahasan:</span>
                <p className="leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{currentIdx < STORAGE_QUESTIONS.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="py-8 px-6 text-center space-y-5 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-black">Selamat! Kuis Kapasitas Selesai</h3>

          <div className="grid grid-cols-2 gap-3 text-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Jawaban Benar</span>
              <span className="font-black text-emerald-400 text-lg">{correctAnswers} / {STORAGE_QUESTIONS.length}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Skor</span>
              <span className="font-black text-sky-400 text-lg">{score} Poin</span>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            Mainkan Kuis Lagi
          </button>
        </div>
      )}
    </div>
  );
};
