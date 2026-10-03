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
  Star,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

interface StorageQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface StorageLevel {
  id: number;
  title: string;
  shortLabel: string;
  description: string;
  questions: StorageQuestion[];
}

const STORAGE_LEVELS: StorageLevel[] = [
  {
    id: 1,
    title: 'Level 1: Satuan Dasar Data Komputer',
    shortLabel: 'Tingkat 1: Satuan Dasar',
    description: 'Pahami hierarki Bit, Byte, Kilobyte (KB), Megabyte (MB), Gigabyte (GB), & Terabyte (TB).',
    questions: [
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
        question: '1 Bit adalah satuan terkecil data digital komputer yang hanya memiliki dua kemungkinan nilai, yaitu...',
        category: 'Biner & Bit',
        options: ['Angka 1 dan 2', '0 (Mati) dan 1 (Aktif)', 'Huruf A dan B', 'True dan Null'],
        correctAnswer: 1,
        explanation: '1 Bit (Binary Digit) hanya bernilai 0 atau 1. 8 Bit bergabung membentuk 1 Byte (satu karakter huruf).',
      },
      {
        id: 3,
        question: 'Satu karakter huruf atau angka (misal huruf "A") membutuhkan kapasitas memori sebesar...',
        category: 'Byte & Karakter',
        options: ['1 Megabyte', '1 Terabyte', '1 Byte (8 Bit)', '100 Kilobyte'],
        correctAnswer: 2,
        explanation: 'Satu huruf disimpan dalam 1 Byte (setara 8 Bit kode biner ASCII).',
      },
      {
        id: 4,
        question: 'Dalam sistem biner kelipatan 2¹⁰, 1 Kilobyte (KB) tepat berisi...',
        category: 'Konversi Dasar',
        options: ['100 Byte', '500 Byte', '1.024 Byte', '10.000 Byte'],
        correctAnswer: 2,
        explanation: '1 KB = 1.024 Byte (2¹⁰ Byte) dalam kalkulasi biner sistem komputer.',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Kapasitas Media & File Sehari-hari',
    shortLabel: 'Tingkat 2: Kapasitas File',
    description: 'Hitung kapasitas flashdisk, foto dokumen, lagu MP3, dan video pembelajaran.',
    questions: [
      {
        id: 5,
        question: 'Sebuah lagu MP3 berukuran rata-rata 4 MB. Berapa kira-kira lagu yang muat dalam Flashdisk 4 GB (4.000 MB)?',
        category: 'Kapasitas Flashdisk',
        options: ['10 Lagu', '100 Lagu', 'Sekitar 1.000 Lagu', '10.000 Lagu'],
        correctAnswer: 2,
        explanation: '4 GB = 4.000 MB. Maka 4.000 MB ÷ 4 MB per lagu = sekitar 1.000 lagu MP3!',
      },
      {
        id: 6,
        question: 'Sebuah foto kamera smartphone rata-rata berukuran 5 MB. Jika Anda memiliki ruang kosong 1 GB (1.000 MB), berapa banyak foto yang dapat disimpan?',
        category: 'Foto & Gambar',
        options: ['20 Foto', '200 Foto', '2.000 Foto', '50 Foto'],
        correctAnswer: 1,
        explanation: '1 GB = 1.000 MB. Maka 1.000 MB ÷ 5 MB = 200 lembar foto!',
      },
      {
        id: 7,
        question: 'Manakah di antara media penyimpanan berikut yang memiliki kapasitas TERBESAR untuk komputer modern?',
        category: 'Media Fisik',
        options: [
          'Disket Floppy 3.5 Inch (1.44 MB)',
          'Keping CD-ROM (700 MB)',
          'Keping DVD (4.7 GB)',
          'SSD NVMe / Harddisk (1 TB = 1.000 GB)',
        ],
        correctAnswer: 3,
        explanation: 'SSD/Harddisk 1 TB berkapasitas 1.000.000 MB, ribuan kali lebih besar dari keping CD/DVD.',
      },
      {
        id: 8,
        question: 'Sebuah video rekaman presentasi pembelajaran berdurasi 1 jam beresolusi Full HD umumnya berukuran sekitar...',
        category: 'Ukuran Video',
        options: ['50 Kilobyte (KB)', '1 sampai 2 Gigabyte (GB)', '500 Terabyte (TB)', '10 Byte'],
        correctAnswer: 1,
        explanation: 'Video Full HD 1080p 1 jam rata-rata membutuhkan ruang 1 GB hingga 2 GB.',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Kecepatan Transfer & Cloud Storage',
    shortLabel: 'Tingkat 3: Kecepatan & Cloud',
    description: 'Pahami perbedaan Mbps vs MB/s, kompresi ZIP, dan penyimpanan Google Drive / Cloud.',
    questions: [
      {
        id: 9,
        question: 'Kecepatan internet diukur dalam "Mbps" (Megabit per detik). Jika kecepatan internet 80 Mbps, berapa kecepatan download file sebenarnya dalam MB/s (Megabyte per detik)?',
        category: 'Mbps vs MB/s',
        options: ['80 MB/s', '10 MB/s (karena 1 Byte = 8 Bit)', '800 MB/s', '1 MB/s'],
        correctAnswer: 1,
        explanation: 'Karena 1 Byte = 8 Bit, maka 80 Mbps ÷ 8 = 10 MB/s kecepatan download file nyata!',
      },
      {
        id: 10,
        question: 'Fitur arsip kompresi berkas (.ZIP atau .RAR) berfungsi untuk...',
        category: 'Kompresi File',
        options: [
          'Menghapus isi file secara permanen',
          'Mengecilkan ukuran data dan menggabungkan banyak berkas menjadi satu file hemat',
          'Mengubah file teks menjadi video',
          'Membuat komputer bekerja lebih lambat',
        ],
        correctAnswer: 1,
        explanation: 'Kompresi ZIP merapatkan pola data yang berulang sehingga ukuran berkas menyusut dan mudah dikirim lewat email.',
      },
      {
        id: 11,
        question: 'Akun Google Drive / Cloud Storage gratis sekolah umumnya memberikan kapasitas cloud sebesar...',
        category: 'Cloud Storage',
        options: ['15 Megabyte (MB)', '15 Gigabyte (GB)', '150 Terabyte (TB)', '1.000 Byte'],
        correctAnswer: 1,
        explanation: 'Google Drive akun standar memberikan 15 GB ruang penyimpanan cloud gratis.',
      },
      {
        id: 12,
        question: 'Berapa jumlah Gigabyte (GB) dalam 1 Terabyte (TB)?',
        category: 'Konversi Terabyte',
        options: ['10 GB', '100 GB', '1.000 GB (atau 1.024 GB Biner)', '10.000 GB'],
        correctAnswer: 2,
        explanation: '1 TB = 1.000 GB desimal (atau 1.024 GB biner). Kapasitas ini cukup untuk ratusan game dan ribuan video HD!',
      },
    ],
  },
];

export const StorageMasterGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = STORAGE_LEVELS[currentLevelIdx];

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [levelCorrectCount, setLevelCorrectCount] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const q = currentLevel.questions[questionIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === q.correctAnswer) {
      setLevelScore((s) => s + 25);
      setLevelCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionIdx < currentLevel.questions.length - 1) {
      setQuestionIdx((i) => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      finishLevel();
    }
  };

  const finishLevel = () => {
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      const earned = Math.min(50, 20 + levelCorrectCount * 10);
      if (currentUser) {
        const ratio = getGamificationConfig().pointsToStarRatio || 10;
        const updatedTotal = (currentUser.totalPoints || 0) + earned;
        updateUser(currentUser.id, {
          totalPoints: updatedTotal,
          totalStars: Math.floor(updatedTotal / ratio),
        });
        refreshUser();
        showStarReward(
          Math.max(1, Math.floor(earned / 10)),
          `Level ${currentLevel.id} Selesai! Kamu menjawab ${levelCorrectCount}/${currentLevel.questions.length} dengan benar (+${earned} Poin)!`,
          'Bintang Storage Master!'
        );
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < STORAGE_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      resetLevelState();
    } else {
      setShowGrandVictory(true);
    }
  };

  const resetLevelState = () => {
    setQuestionIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setLevelScore(0);
    setLevelCorrectCount(0);
    setShowLevelVictory(false);
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    resetLevelState();
  };

  const handleRestartFromBeginning = () => {
    setShowGrandVictory(false);
    setShowLevelVictory(false);
    setCurrentLevelIdx(0);
    setCompletedLevels([]);
    resetLevelState();
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
                Level {currentLevel.id} dari {STORAGE_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentLevel.title} — {currentLevel.description}
            </p>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STORAGE_LEVELS.map((lvl, idx) => {
            const isDone = completedLevels.includes(lvl.id);
            const isCurrent = idx === currentLevelIdx;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevelTab(idx)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/30'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Lvl {lvl.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Hierarchy Ladder Bar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-mono">
        {['1 Bit', '8 Bit = 1 Byte', '1.024 B = 1 KB', '1.024 KB = 1 MB', '1.024 MB = 1 GB', '1.024 GB = 1 TB'].map((tier, idx) => (
          <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
            {tier}
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {/* Question Card */}
        <div className="p-6 bg-slate-950 border-2 border-sky-500/30 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-sky-400">
              Pertanyaan {questionIdx + 1} dari {currentLevel.questions.length} (Level {currentLevel.id})
            </span>
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

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{questionIdx < currentLevel.questions.length - 1 ? 'Soal Selanjutnya' : `Selesaikan Level ${currentLevel.id}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal Level Selesai & Lanjut Level */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-sky-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-sky-400 via-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-sky-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/40">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black pt-1">
                Kuis {currentLevel.shortLabel} Tuntas!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Pemahamanmu tentang satuan dan kapasitas penyimpanan semakin mantap!
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Benar</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {levelCorrectCount} / {currentLevel.questions.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Poin Hadiah</span>
                <span className="text-lg font-black text-sky-400 font-mono">
                  +{Math.min(50, 20 + levelCorrectCount * 10)} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={resetLevelState}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi Level
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < STORAGE_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Storage Master!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory Semua Level */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/60 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-sky-400 via-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/40">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Gelar Master Penyimpanan Data
              </span>
              <h3 className="text-2xl font-black pt-1">
                🏆 Storage Master Tamat!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menguasai seluruh konsep Bit, Byte, Megabyte, Gigabyte, Terabyte, hingga Cloud Storage dan kecepatan transfer internet!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-indigo-500/30 text-xs space-y-1 text-indigo-300">
              <span className="font-extrabold block">Bintang & Lencana Storage Master Telah Diberikan</span>
              <p className="text-[11px] text-slate-400">Kemampuan manajemen file & memorimu sudah setara teknisi profesional!</p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-sky-500/30 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
