import React, { useState, useEffect } from 'react';
import {
  Binary,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
  ArrowRight,
  Shield,
  Key,
  Lock,
  Unlock,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore } from '../../services/storageService';

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

interface BinaryMission {
  id: string;
  type: 'decimal' | 'ascii';
  targetValue: number;
  targetChar?: string;
  title: string;
  hint: string;
  story: string;
}

interface BinaryLevel {
  id: number;
  title: string;
  shortLabel: string;
  description: string;
  missions: BinaryMission[];
}

const BINARY_LEVELS: BinaryLevel[] = [
  {
    id: 1,
    title: 'Level 1: Dasar Saklar 4-Bit (Nilai 1 - 15)',
    shortLabel: 'Tingkat 1: 4-Bit Dasar',
    description: 'Pahami kombinasi saklar bernilai 8, 4, 2, dan 1 untuk membentuk angka desimal.',
    missions: [
      {
        id: 'm-1',
        type: 'decimal',
        targetValue: 5,
        title: 'Misi 1: Angka Desimal 5',
        hint: '5 adalah kombinasi saklar 4 dan 1 (4 + 1 = 5)',
        story: 'Sistem pintu laboratorium terkunci dengan kode angka 5. Nyalakan saklar biner yang tepat!',
      },
      {
        id: 'm-2',
        type: 'decimal',
        targetValue: 9,
        title: 'Misi 2: Angka Desimal 9',
        hint: 'Nyalakan bit 8 dan bit 1 (8 + 1 = 9)',
        story: 'Bantu robot mengumpulkan 9 koin data dengan biner!',
      },
      {
        id: 'm-3',
        type: 'decimal',
        targetValue: 15,
        title: 'Misi 3: Angka Maksimum 4-Bit (15)',
        hint: 'Nyalakan seluruh saklar 4-bit terbawah (8 + 4 + 2 + 1 = 15)',
        story: 'Kunci gerbang utama terbuka saat daya 4-bit penuh 15!',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Master 8-Bit Penuh (Nilai 16 - 255)',
    shortLabel: 'Tingkat 2: 8-Bit Penuh',
    description: 'Gunakan saklar berbobot 128, 64, 32, dan 16 untuk membentuk angka-angka besar.',
    missions: [
      {
        id: 'm-4',
        type: 'decimal',
        targetValue: 18,
        title: 'Misi 4: Angka Desimal 18',
        hint: 'Cari angka di bawah 18 terbesar: 16 + 2 = 18',
        story: 'Aktifkan daya cadangan server sekolah dengan kode biner angka 18!',
      },
      {
        id: 'm-5',
        type: 'decimal',
        targetValue: 42,
        title: 'Misi 5: Angka Kunci Enkripsi 42',
        hint: '32 + 8 + 2 = 42',
        story: 'Pecahkan kode enkripsi file rahasia sekolah dengan angka 42.',
      },
      {
        id: 'm-6',
        type: 'decimal',
        targetValue: 100,
        title: 'Misi 6: Angka Desimal 100 (Baterai Penuh)',
        hint: '64 + 32 + 4 = 100',
        story: 'Isi baterai super komputer hingga 100% menggunakan kode biner!',
      },
      {
        id: 'm-7',
        type: 'decimal',
        targetValue: 255,
        title: 'Misi 7: Nilai Penuh 1 Byte (255)',
        hint: 'Nyalakan SEMUA saklar bit dari 128 hingga 1! (128+64+32+16+8+4+2+1)',
        story: 'Kekuatan 1 Byte Penuh! Hasilkan nilai maksimum 255 untuk mengaktifkan AI!',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Dekode Huruf ASCII & Sandi Kata Rahasia',
    shortLabel: 'Tingkat 3: Kode ASCII',
    description: 'Pecahkan huruf dan pesan rahasia yang dikirimkan dalam format standar ASCII komputer.',
    missions: [
      {
        id: 'm-8',
        type: 'ascii',
        targetValue: 65,
        targetChar: 'A',
        title: 'Misi 8: Huruf ASCII "A" (Desimal 65)',
        hint: 'Huruf "A" besar bernilai 65 (64 + 1 = 65)',
        story: 'Komputer membaca huruf sebagai kode biner. Kirim sinyal huruf "A"!',
      },
      {
        id: 'm-9',
        type: 'ascii',
        targetValue: 67,
        targetChar: 'C',
        title: 'Misi 9: Huruf ASCII "C" (Desimal 67)',
        hint: '64 + 2 + 1 = 67 (Huruf C untuk "Ceria")',
        story: 'Ketik huruf awal dari kata "Ceria" ke dalam kode biner mesin!',
      },
      {
        id: 'm-10',
        type: 'ascii',
        targetValue: 75,
        targetChar: 'K',
        title: 'Misi 10: Huruf ASCII "K" (Desimal 75)',
        hint: '64 + 8 + 2 + 1 = 75 (Huruf K untuk "Komputer")',
        story: 'Sinyal rahasia membutuhkan transmisi huruf "K" untuk membuka akses data!',
      },
    ],
  },
];

export const BinaryCodeGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = BINARY_LEVELS[currentLevelIdx];

  const [missionIdx, setMissionIdx] = useState(0);
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const currentMission = currentLevel.missions[missionIdx];

  // Calculate current sum based on turned-on bits
  const currentSum = bits.reduce((acc, bitOn, idx) => {
    return bitOn ? acc + BIT_VALUES[idx] : acc;
  }, 0);

  const currentByteString = bits.map((b) => (b ? '1' : '0')).join('');

  const currentChar =
    currentSum >= 32 && currentSum <= 126 ? String.fromCharCode(currentSum) : null;

  // Toggle single bit
  const handleToggleBit = (index: number) => {
    if (isSuccess || showLevelVictory || showGrandVictory) return;
    const nextBits = [...bits];
    nextBits[index] = !nextBits[index];
    setBits(nextBits);
  };

  // Reset current bits to 0
  const handleResetBits = () => {
    setBits([false, false, false, false, false, false, false, false]);
  };

  // Verify answer
  useEffect(() => {
    if (currentSum === currentMission.targetValue && !isSuccess) {
      setIsSuccess(true);
      const earned = 25 + streak * 5;
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
    }
  }, [currentSum, currentMission, isSuccess, streak]);

  const handleNextMission = () => {
    if (missionIdx + 1 >= currentLevel.missions.length) {
      // Level completed!
      finishLevel();
    } else {
      setMissionIdx((prev) => prev + 1);
      setBits([false, false, false, false, false, false, false, false]);
      setIsSuccess(false);
      setShowHint(false);
    }
  };

  const finishLevel = () => {
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      if (currentUser?.id) {
        const bonus = 40;
        recordGameScore('Detektif Kode Biner', currentUser.id, score + bonus, Math.round((score + bonus) / 5));
        refreshUser();
        showStarReward(
          4,
          `Level ${currentLevel.id} Selesai! Kamu berhasil memecahkan seluruh sandi biner di level ini!`,
          'Bintang Detektif Biner!'
        );
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < BINARY_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      resetLevelState();
    } else {
      setShowGrandVictory(true);
    }
  };

  const resetLevelState = () => {
    setMissionIdx(0);
    setBits([false, false, false, false, false, false, false, false]);
    setIsSuccess(false);
    setShowHint(false);
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
    setScore(0);
    setStreak(0);
    setCompletedLevels([]);
    resetLevelState();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Binary className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Detektif Kode Biner (0 & 1)</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                Level {currentLevel.id} dari {BINARY_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              {currentLevel.title} — {currentLevel.description}
            </p>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {BINARY_LEVELS.map((lvl, idx) => {
            const isDone = completedLevels.includes(lvl.id);
            const isCurrent = idx === currentLevelIdx;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevelTab(idx)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-400/30'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                    : 'bg-black/30 text-emerald-100 hover:text-white border border-white/10'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                <span>Lvl {lvl.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {/* Mission Briefing Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Misi Sandi #{missionIdx + 1} dari {currentLevel.missions.length} ({currentLevel.shortLabel})
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {currentMission.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-100 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Bocoran Petunjuk'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetBits}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Bit (0)</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            {currentMission.story}
          </p>

          {showHint && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{currentMission.hint}</span>
            </div>
          )}

          {/* Current Target Display */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Desimal</span>
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {currentMission.targetValue}
                </span>
                {currentMission.targetChar && (
                  <span className="text-xs font-bold text-emerald-300 ml-2">
                    (Huruf "{currentMission.targetChar}")
                  </span>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                {isSuccess ? <Unlock className="w-6 h-6 animate-bounce" /> : <Lock className="w-6 h-6" />}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jumlah Bit Aktif Saat Ini</span>
                <span
                  className={`text-3xl font-black font-mono ${
                    currentSum === currentMission.targetValue
                      ? 'text-emerald-400'
                      : currentSum > currentMission.targetValue
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {currentSum}
                </span>
                {currentChar && (
                  <span className="text-xs font-bold text-slate-300 ml-2">
                    (ASCII: "{currentChar}")
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Status:</span>
                <span
                  className={`text-xs font-extrabold uppercase ${
                    currentSum === currentMission.targetValue ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {currentSum === currentMission.targetValue ? 'Tepat Sempurna!' : currentSum > currentMission.targetValue ? 'Kelebihan Angka' : 'Kurang'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8-Bit Switch Controller */}
        <div className="p-5 sm:p-6 bg-slate-950 border-2 border-emerald-500/30 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Saklar 8-Bit Digital Register (Klik saklar untuk ON/OFF)
            </span>
            <div className="font-mono text-xs text-emerald-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              BINER: {currentByteString}
            </div>
          </div>

          {/* 8 Bit Switches */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
            {BIT_VALUES.map((bitVal, idx) => {
              const isOn = bits[idx];
              return (
                <button
                  key={bitVal}
                  type="button"
                  onClick={() => handleToggleBit(idx)}
                  className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none ${
                    isOn
                      ? 'bg-linear-to-b from-emerald-500 to-teal-700 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] translate-y-0.5'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-850'
                  }`}
                >
                  {/* Bit Power Indicator Light */}
                  <div
                    className={`w-4 h-4 rounded-full border mb-2 transition-all ${
                      isOn
                        ? 'bg-emerald-300 border-white shadow-[0_0_8px_#6ee7b7]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />

                  {/* Bit Value */}
                  <span className="text-sm font-black font-mono tracking-tight">{bitVal}</span>

                  {/* Binary Status: 1 or 0 */}
                  <span
                    className={`text-xl font-mono font-black mt-2 px-2 py-0.5 rounded-md ${
                      isOn ? 'bg-black/30 text-emerald-200' : 'text-slate-600'
                    }`}
                  >
                    {isOn ? '1' : '0'}
                  </span>

                  <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">
                    {isOn ? 'AKTIF' : 'MATI'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Success Mission Bar */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Sandi Terpecahkan dengan Sempurna!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    Biner <code className="font-mono bg-black/40 px-1 py-0.5 rounded">{currentByteString}</code> = Desimal {currentMission.targetValue}
                    {currentMission.targetChar ? ` ("${currentMission.targetChar}")` : ''}!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextMission}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer shrink-0"
              >
                <span>{missionIdx < currentLevel.missions.length - 1 ? 'Misi Berikutnya' : `Selesaikan Level ${currentLevel.id}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Level Selesai */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-emerald-400 via-teal-500 to-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black pt-1">
                Sandi Biner {currentLevel.shortLabel} Terpecahkan!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Kamu sukses menghitung dan mengaktifkan saklar biner digital untuk seluruh sandi misi di level ini!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Misi Level:</span>
                <span className="font-bold text-emerald-300">{currentLevel.missions.length} Sandi</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Skor Terkumpul:</span>
                <span className="text-base font-black font-mono text-amber-400">{score} Poin</span>
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
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < BINARY_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Detektif Biner!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory Semua Level */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/60 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-emerald-400 via-teal-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/40">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Gelar Master Decoder Bahasa Mesin
              </span>
              <h3 className="text-2xl font-black pt-1">
                🏆 Master Sandi Biner Selesai!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Luar biasa! Kamu telah menguasai perhitungan 1 Byte (8-bit) dan bahasa mesin komputer dari angka desimal hingga sandi karakter ASCII!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 text-xs space-y-1 text-emerald-300">
              <span className="font-extrabold block">Skor Akhir: {score} Poin (+Bintang Biner)</span>
              <p className="text-[11px] text-slate-400">Kamu kini bisa membaca data komputer layaknya programmer sejati!</p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
