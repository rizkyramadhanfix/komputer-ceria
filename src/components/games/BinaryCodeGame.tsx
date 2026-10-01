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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recordGameScore } from '../../services/storageService';

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

interface BinaryMission {
  id: string;
  type: 'decimal' | 'ascii' | 'word';
  targetValue: number;
  targetChar?: string;
  word?: string;
  wordIdx?: number;
  title: string;
  hint: string;
  story: string;
}

const MISSIONS: BinaryMission[] = [
  {
    id: 'm-1',
    type: 'decimal',
    targetValue: 5,
    title: 'Misi 1: Angka Desimal 5',
    hint: '5 adalah kombinasi dari saklar 4 dan 1 (4 + 1 = 5)',
    story: 'Sistem pintu laboratorium terkunci dengan kode angka 5. Nyalakan saklar biner yang tepat!',
  },
  {
    id: 'm-2',
    type: 'decimal',
    targetValue: 18,
    title: 'Misi 2: Angka Desimal 18',
    hint: 'Cari angka di bawah 18 terbesar: 16 + 2 = 18',
    story: 'Aktifkan daya cadangan server dengan kode biner angka 18!',
  },
  {
    id: 'm-3',
    type: 'ascii',
    targetValue: 65,
    targetChar: 'A',
    title: 'Misi 3: Huruf ASCII "A"',
    hint: 'Huruf "A" dalam tabel kode komputer bernilai 65 (64 + 1)',
    story: 'Komputer membaca huruf sebagai angka biner. Huruf A besar berangka 65.',
  },
  {
    id: 'm-4',
    type: 'decimal',
    targetValue: 42,
    title: 'Misi 4: Angka Kunci 42',
    hint: '32 + 8 + 2 = 42',
    story: 'Pecahkan kode enkripsi file rahasia dengan angka 42.',
  },
  {
    id: 'm-5',
    type: 'ascii',
    targetValue: 67,
    targetChar: 'C',
    title: 'Misi 5: Huruf ASCII "C"',
    hint: '64 + 2 + 1 = 67 (Huruf C untuk "Ceria")',
    story: 'Ketik huruf awal dari kata "Ceria" ke dalam kode biner mesin!',
  },
  {
    id: 'm-6',
    type: 'decimal',
    targetValue: 100,
    title: 'Misi 6: Angka Desimal 100',
    hint: '64 + 32 + 4 = 100',
    story: 'Isi baterai super komputer hingga kapasitas penuh 100% menggunakan kode biner!',
  },
  {
    id: 'm-7',
    type: 'ascii',
    targetValue: 75,
    targetChar: 'K',
    title: 'Misi 7: Huruf ASCII "K"',
    hint: '64 + 8 + 2 + 1 = 75 (Huruf K untuk "Komputer")',
    story: 'Sinyal rahasia membutuhkan transmisi huruf "K" secara digital.',
  },
  {
    id: 'm-8',
    type: 'decimal',
    targetValue: 255,
    title: 'Misi 8: Master Byte 255 (Semua Saklar)',
    hint: 'Nyalakan SEMUA saklar bit dari 128 hingga 1! (128+64+32+16+8+4+2+1)',
    story: 'Kekuatan 1 Byte Penuh! Hasilkan nilai maksimum 255 untuk mengaktifkan AI super canggih!',
  },
];

export const BinaryCodeGame: React.FC = () => {
  const { currentUser } = useAuth();
  const [missionIdx, setMissionIdx] = useState(0);
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentMission = MISSIONS[missionIdx % MISSIONS.length];

  // Calculate current sum based on turned-on bits
  const currentSum = bits.reduce((acc, bitOn, idx) => {
    return bitOn ? acc + BIT_VALUES[idx] : acc;
  }, 0);

  const currentByteString = bits.map((b) => (b ? '1' : '0')).join('');

  // ASCII character interpretation of currentSum if within printable range
  const currentChar =
    currentSum >= 32 && currentSum <= 126 ? String.fromCharCode(currentSum) : null;

  // Toggle single bit
  const handleToggleBit = (index: number) => {
    if (isSuccess || isGameOver) return;
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
    if (currentSum === currentMission.targetValue && !isSuccess && !isGameOver) {
      setIsSuccess(true);
      const earned = 25 + streak * 5;
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
    }
  }, [currentSum, currentMission, isSuccess, isGameOver, streak]);

  const handleNextMission = () => {
    if (missionIdx + 1 >= MISSIONS.length) {
      setIsGameOver(true);
      if (currentUser?.id) {
        recordGameScore('Detektif Kode Biner (0 dan 1)', currentUser.id, score);
      }
    } else {
      setMissionIdx((prev) => prev + 1);
      setBits([false, false, false, false, false, false, false, false]);
      setIsSuccess(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setMissionIdx(0);
    setBits([false, false, false, false, false, false, false, false]);
    setScore(0);
    setStreak(0);
    setIsSuccess(false);
    setIsGameOver(false);
    setShowHint(false);
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
                Logika Mesin
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Nyalakan saklar 8-bit untuk memecahkan sandi angka dan huruf ASCII bahasa komputer!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold tracking-wider">Skor Detektif</span>
            <span className="text-lg font-black font-mono text-amber-300">{score} Poin</span>
          </div>
          {streak > 1 && (
            <div className="bg-emerald-500/20 px-3 py-2 rounded-xl border border-emerald-400/40 text-center animate-bounce">
              <span className="text-[10px] text-emerald-200 block font-bold">Streak 🔥</span>
              <span className="text-sm font-black text-amber-300">{streak}x</span>
            </div>
          )}
        </div>
      </div>

      {isGameOver ? (
        /* Victory Screen */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-linear-to-tr from-emerald-500 to-teal-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Agen Rahasia Biner Hebat!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Kamu telah menguasai perhitungan 1 Byte (8-bit) dan bahasa mesin komputer dengan perolehan skor{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{score} Poin</span>!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sandi</span>
              <p className="text-base font-black text-slate-800 dark:text-slate-100">{MISSIONS.length} Terpecahkan</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bit Mastered</span>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">8 Bit (1 Byte)</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Sandi</span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Master Decoder</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hadiah</span>
              <p className="text-base font-black text-amber-500 font-mono">+{score} Poin</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Ulang Misi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mission Briefing Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Misi Sandi #{missionIdx + 1} dari {MISSIONS.length}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {currentMission.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Tutup Hint' : 'Bantuan Hitung'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetBits}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nol-kan (0)</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {currentMission.story}
            </p>

            {/* Target Display Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Angka:</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {currentMission.targetValue}
                  </span>
                </div>
                {currentMission.targetChar && (
                  <div className="pl-4 border-l border-slate-300 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Huruf ASCII:</span>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                      "{currentMission.targetChar}"
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Nilai Kamu:</span>
                  <span
                    className={`text-2xl font-black font-mono ${
                      currentSum === currentMission.targetValue
                        ? 'text-emerald-500'
                        : currentSum > currentMission.targetValue
                        ? 'text-rose-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {currentSum}
                  </span>
                </div>
                <div className="pl-4 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Karakter Mesin:</span>
                  <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
                    {currentChar ? `"${currentChar}"` : '·'}
                  </span>
                </div>
              </div>
            </div>

            {showHint && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-800 dark:text-amber-200 animate-in fade-in">
                💡 <strong>Kunci Petunjuk:</strong> {currentMission.hint}
              </div>
            )}
          </div>

          {/* Interactive 8-Bit Switchboard Panel */}
          <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-300">
                  PAPAN SAKLAR DIGITAL 8-BIT (1 BYTE)
                </span>
              </div>
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
                  <span>Misi Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
