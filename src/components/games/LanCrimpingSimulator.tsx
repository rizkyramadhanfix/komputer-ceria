import React, { useState } from 'react';
import {
  Network,
  Scissors,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle,
  Zap,
  Radio,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

interface WireColor {
  id: string;
  name: string;
  code: string; // Tailwind bg or hex
  borderCode?: string;
  stripe?: boolean;
  stripeColor?: string;
}

interface CrimpingLevel {
  id: number;
  title: string;
  shortLabel: string;
  cableType: string;
  usage: string;
  correctOrder: string[];
  orderDescription: string;
  points: number;
}

const CRIMPING_LEVELS: CrimpingLevel[] = [
  {
    id: 1,
    title: 'Level 1: Kabel Straight-Through T568B',
    shortLabel: 'Straight T568B',
    cableType: 'Straight-Through T568B',
    usage: 'Menghubungkan Komputer Siswa ke Switch / Router Lab Komputer',
    correctOrder: [
      'white-orange',
      'orange',
      'white-green',
      'blue',
      'white-blue',
      'green',
      'white-brown',
      'brown',
    ],
    orderDescription: 'Putih Oranye, Oranye, Putih Hijau, Biru, Putih Biru, Hijau, Putih Cokelat, Cokelat',
    points: 45,
  },
  {
    id: 2,
    title: 'Level 2: Kabel Straight-Through T568A',
    shortLabel: 'Straight T568A',
    cableType: 'Straight-Through Standar T568A',
    usage: 'Standar alternatif internasional jaringan gedung sekolah & kantor modern',
    correctOrder: [
      'white-green',
      'green',
      'white-orange',
      'blue',
      'white-blue',
      'orange',
      'white-brown',
      'brown',
    ],
    orderDescription: 'Putih Hijau, Hijau, Putih Oranye, Biru, Putih Biru, Oranye, Putih Cokelat, Cokelat',
    points: 50,
  },
  {
    id: 3,
    title: 'Level 3: Kabel Crossover (PC ke PC Langsung)',
    shortLabel: 'Crossover Kabel',
    cableType: 'Kabel Crossover (T568A ke T568B)',
    usage: 'Menghubungkan 2 Komputer PC secara langsung tanpa melalui Switch/Hub',
    correctOrder: [
      'white-green',
      'green',
      'white-orange',
      'blue',
      'white-blue',
      'orange',
      'white-brown',
      'brown',
    ],
    orderDescription: 'Pin 1-2 & Pin 3-6 bersilangan (Ujung 1: T568A, Ujung 2: T568B)',
    points: 60,
  },
];

const ALL_WIRES: WireColor[] = [
  { id: 'white-orange', name: 'Putih Oranye', code: '#fb923c', stripe: true, stripeColor: '#ffffff' },
  { id: 'orange', name: 'Oranye', code: '#ea580c' },
  { id: 'white-green', name: 'Putih Hijau', code: '#4ade80', stripe: true, stripeColor: '#ffffff' },
  { id: 'blue', name: 'Biru', code: '#2563eb' },
  { id: 'white-blue', name: 'Putih Biru', code: '#60a5fa', stripe: true, stripeColor: '#ffffff' },
  { id: 'green', name: 'Hijau', code: '#16a34a' },
  { id: 'white-brown', name: 'Putih Cokelat', code: '#a8715a', stripe: true, stripeColor: '#ffffff' },
  { id: 'brown', name: 'Cokelat', code: '#78350f' },
];

export const LanCrimpingSimulator: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = CRIMPING_LEVELS[currentLevelIdx];

  const [step, setStep] = useState<'peel' | 'arrange' | 'insert' | 'crimp' | 'test'>('peel');
  const [arrangedSlots, setArrangedSlots] = useState<Array<string | null>>(Array(8).fill(null));
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [isTesterRunning, setIsTesterRunning] = useState(false);
  const [activeLed, setActiveLed] = useState<number | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedLevelIds, setCompletedLevelIds] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  // Available wires left to place
  const usedIds = arrangedSlots.filter(Boolean) as string[];
  const remainingWires = ALL_WIRES.filter((w) => !usedIds.includes(w.id));

  const handlePlaceWire = (slotIndex: number) => {
    if (!selectedWireId) return;
    const nextSlots = [...arrangedSlots];
    nextSlots[slotIndex] = selectedWireId;
    setArrangedSlots(nextSlots);
    setSelectedWireId(null);
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    const nextSlots = [...arrangedSlots];
    nextSlots[slotIndex] = null;
    setArrangedSlots(nextSlots);
  };

  const handleAutoFillCheat = () => {
    setArrangedSlots([...currentLevel.correctOrder]);
    showInfo(`Urutan standar ${currentLevel.cableType} telah disusun otomatis sebagai referensi belajar.`);
  };

  const startCableTester = async () => {
    setIsTesterRunning(true);
    setTestSuccess(null);

    let allCorrect = true;
    for (let i = 0; i < 8; i++) {
      setActiveLed(i + 1);
      await new Promise((r) => setTimeout(r, 300));
      if (arrangedSlots[i] !== currentLevel.correctOrder[i]) {
        allCorrect = false;
      }
    }

    setActiveLed(null);
    setIsTesterRunning(false);
    setTestSuccess(allCorrect);

    if (allCorrect) {
      setIsCompleted(true);
      setShowLevelVictory(true);

      if (!completedLevelIds.includes(currentLevel.id)) {
        setCompletedLevelIds((prev) => [...prev, currentLevel.id]);
        if (currentUser) {
          const earned = currentLevel.points;
          const ratio = getGamificationConfig().pointsToStarRatio || 10;
          const updatedTotal = (currentUser.totalPoints || 0) + earned;
          updateUser(currentUser.id, {
            totalPoints: updatedTotal,
            totalStars: Math.floor(updatedTotal / ratio),
          });
          refreshUser();
          showStarReward(
            Math.max(1, Math.floor(earned / 10)),
            `Selamat! 8 Pin RJ-45 terhubung sempurna untuk ${currentLevel.cableType} (+${earned} Poin)!`,
            'Bintang Teknisi Krimping LAN!'
          );
        }
      }
    } else {
      showError(`Lampu tester mendeteksi pin salah / tertukar (Cross/Miswired). Periksa kembali urutan warna untuk ${currentLevel.cableType}.`);
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < CRIMPING_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      resetAll();
    } else {
      setShowGrandVictory(true);
    }
  };

  const resetAll = () => {
    setStep('peel');
    setArrangedSlots(Array(8).fill(null));
    setSelectedWireId(null);
    setIsTesterRunning(false);
    setActiveLed(null);
    setTestSuccess(null);
    setIsCompleted(false);
    setShowLevelVictory(false);
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    resetAll();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Simulator Krimping Kabel LAN</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Level {currentLevel.id} dari {CRIMPING_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentLevel.title} — {currentLevel.usage}
            </p>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {CRIMPING_LEVELS.map((lvl, idx) => {
              const isDone = completedLevelIds.includes(lvl.id);
              const isCurrent = idx === currentLevelIdx;
              return (
                <button
                  key={lvl.id}
                  onClick={() => handleSelectLevelTab(idx)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
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

          <button
            onClick={resetAll}
            className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Pill Indicator */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { id: 'peel', label: '1. Kupas Kulit UTP' },
          { id: 'arrange', label: '2. Susun 8 Warna' },
          { id: 'insert', label: '3. Pasang RJ-45' },
          { id: 'crimp', label: '4. Tekan Tang Krimping' },
          { id: 'test', label: '5. Tes Lampu Tester' },
        ].map((s, idx) => (
          <div
            key={s.id}
            className={`py-2 px-1 rounded-xl font-bold border transition-all text-[11px] ${
              step === s.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-950/80 text-slate-400 border-slate-800'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* STEP 1: PEEL */}
      {step === 'peel' && (
        <div className="py-10 px-6 text-center space-y-5 bg-slate-950/60 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Scissors className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black">Langkah 1: Mengupas Jaket Pelindung Kabel UTP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gunakan pengupas kabel (wire stripper) sekitar 2-3 cm dari ujung kabel untuk mengeluarkan 4 pasang urat kawat tembaga berpilin (*twisted pair*).
            </p>
          </div>
          <button
            onClick={() => setStep('arrange')}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Kupas Kabel & Buka Pilinan →
          </button>
        </div>
      )}

      {/* STEP 2: ARRANGE 8 WIRES */}
      {step === 'arrange' && (
        <div className="space-y-5">
          {/* Helper info standard cable */}
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] leading-relaxed">
              <strong>Standar {currentLevel.cableType}:</strong>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentLevel.correctOrder.map((id: string, i: number) => {
                  const w = ALL_WIRES.find((wire) => wire.id === id);
                  return (
                    <span key={id} className="px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-[10px] text-amber-300">
                      {i + 1}. {w?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RJ-45 Connector Slots (Pin 1 to 8) */}
          <div className="p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-300">
                Slot Pin RJ-45 (Pin 1 sampai 8 Dari Kiri ke Kanan):
              </span>
              <button
                onClick={handleAutoFillCheat}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Susunkan Otomatis (Belajar)
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl min-h-36">
              {arrangedSlots.map((wireId, idx) => {
                const wire = ALL_WIRES.find((w) => w.id === wireId);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (wireId) {
                        handleRemoveFromSlot(idx);
                      } else {
                        handlePlaceWire(idx);
                      }
                    }}
                    className={`h-28 rounded-xl border flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all ${
                      wire
                        ? 'border-amber-400/80 bg-slate-950 shadow-md'
                        : selectedWireId
                        ? 'border-dashed border-amber-500 bg-amber-950/20 hover:bg-amber-950/40'
                        : 'border-dashed border-slate-800 bg-slate-950/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-black text-slate-400">Pin #{idx + 1}</span>

                    {wire ? (
                      <div className="flex-1 w-full flex flex-col items-center justify-center gap-1">
                        <div
                          className="w-4 h-14 rounded-full border border-slate-400 shadow-inner"
                          style={{
                            backgroundColor: wire.code,
                            backgroundImage: wire.stripe
                              ? `repeating-linear-gradient(45deg, transparent, transparent 4px, ${wire.stripeColor} 4px, ${wire.stripeColor} 8px)`
                              : undefined,
                          }}
                        />
                        <span className="text-[8px] font-bold text-center text-slate-200 leading-tight">
                          {wire.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold my-auto">Kosong</span>
                    )}

                    <span className="text-[8px] text-slate-500">
                      {wire ? 'Klik Hapus' : selectedWireId ? 'Klik Isi' : 'Pilih di Bwh'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wire Color Palette to Pick */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Kabel Tersedia untuk Dipasang:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {remainingWires.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWireId(w.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedWireId === w.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-slate-400 shrink-0"
                    style={{
                      backgroundColor: w.code,
                      backgroundImage: w.stripe
                        ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${w.stripeColor} 2px, ${w.stripeColor} 4px)`
                        : undefined,
                    }}
                  />
                  <span className="truncate">{w.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              disabled={arrangedSlots.includes(null)}
              onClick={() => setStep('insert')}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40"
            >
              Lanjut ke Pemasangan Konektor RJ-45 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: INSERT & CRIMP */}
      {(step === 'insert' || step === 'crimp') && (
        <div className="py-8 px-6 text-center space-y-6 bg-slate-950/60 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 inline-block shadow-xl">
            {/* Visual RJ-45 Head */}
            <div className="w-48 h-28 bg-sky-950/40 border-2 border-sky-500/60 rounded-t-2xl p-2 mx-auto flex flex-col justify-end relative shadow-inner">
              <div className="flex justify-between px-1 mb-1">
                {arrangedSlots.map((wireId, idx) => {
                  const wire = ALL_WIRES.find((w) => w.id === wireId);
                  return (
                    <div
                      key={idx}
                      className="w-3.5 h-16 rounded-t-sm border border-slate-300"
                      style={{
                        backgroundColor: wire?.code || '#334155',
                        backgroundImage: wire?.stripe
                          ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${wire.stripeColor} 2px, ${wire.stripeColor} 4px)`
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>
              <div className="text-[9px] font-black text-sky-400 bg-sky-950/80 rounded py-0.5 text-center">
                8 PIN GOLD CONNECTOR RJ-45
              </div>
            </div>
            {/* Cable Outer Jacket */}
            <div className="w-32 h-10 bg-blue-600 rounded-b-xl mx-auto shadow-md flex items-center justify-center text-[10px] font-bold text-white">
              UTP CAT6 CABLE
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black">
              {step === 'insert' ? 'Langkah 3: Masukkan Kawat ke Konektor RJ-45' : 'Langkah 4: Menjepit dengan Tang Krimping (Crimping Tool)'}
            </h3>
            <p className="text-xs text-slate-300">
              {step === 'insert'
                ? 'Pastikan 8 urat kawat tembaga masuk mentok sampai ujung konektor tembaga RJ-45.'
                : 'Tekan tuas tang krimping dengan kuat sampai terdengar bunyi "KLIK" agar plat tembaga mengunci kawat kabel.'}
            </p>
          </div>

          {step === 'insert' ? (
            <button
              onClick={() => setStep('crimp')}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
            >
              Kawat Sudah Rata, Siap Dijepit Tang Krimping →
            </button>
          ) : (
            <button
              onClick={() => setStep('test')}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer animate-pulse"
            >
              🔒 Jepit Tang Krimping & Lanjut Uji Kabel Tester! →
            </button>
          )}
        </div>
      )}

      {/* STEP 5: TEST WITH LAN TESTER */}
      {step === 'test' && (
        <div className="space-y-5 max-w-xl mx-auto">
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl space-y-5 text-center shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-black flex items-center justify-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                LAN Master Cable Tester
              </h3>
              <p className="text-xs text-slate-400">
                Lampu LED 1 sampai 8 harus menyala berurutan dari Master ke Remote jika urutan kabel tepat.
              </p>
            </div>

            {/* LED Indicator Panel */}
            <div className="grid grid-cols-8 gap-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              {Array.from({ length: 8 }).map((_, idx) => {
                const pinNum = idx + 1;
                const isLedOn = activeLed === pinNum;
                return (
                  <div key={pinNum} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs transition-all ${
                        isLedOn
                          ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-[0_0_12px_#34d399] scale-110'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {pinNum}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">PIN {pinNum}</span>
                  </div>
                );
              })}
            </div>

            {/* Result Status */}
            {testSuccess === true && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-2xl space-y-3 animate-in zoom-in-95">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-black text-emerald-300">Kabel LAN Sempurna (1000 Mbps Gigabit Ready)!</h4>
                <p className="text-xs text-slate-300">
                  Seluruh 8 pin terhubung sesuai standar {currentLevel.cableType}. Kabel siap digunakan!
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>{currentLevelIdx < CRIMPING_LEVELS.length - 1 ? 'Lanjut ke Level Praktikum Berikutnya' : 'Lihat Gelar Teknisi LAN!'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {testSuccess === false && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl space-y-2 animate-in zoom-in-95">
                <h4 className="text-sm font-black text-rose-300">Kabel Gagal (Salah Urutan Warna)</h4>
                <p className="text-xs text-slate-300">
                  Ada kawat yang tertukar pin. Susun kembali 8 kawat sesuai urutan standar {currentLevel.cableType}.
                </p>
                <button
                  onClick={() => setStep('arrange')}
                  className="py-1.5 px-3 bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 hover:bg-slate-700 cursor-pointer"
                >
                  Perbaiki Urutan Warna
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                disabled={isTesterRunning}
                onClick={startCableTester}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isTesterRunning ? 'Sedang Memeriksa 8 Pin...' : 'Nyalakan Alat Tes LAN Cable Tester'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Level Selesai */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-amber-400 via-orange-500 to-amber-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black pt-1">
                Krimping 8 Pin Berhasil!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Kamu sukses mengupas, meratakan, memasang konektor RJ-45, dan menekan tang krimping untuk {currentLevel.cableType}!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Standar Kabel:</span>
                <span className="font-bold text-amber-300">{currentLevel.shortLabel}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Kegunaan:</span>
                <span className="text-[11px] text-slate-200 text-right max-w-[200px]">{currentLevel.usage}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                <span className="font-bold text-slate-300">Poin Hadiah:</span>
                <span className="text-base font-black font-mono text-emerald-400">+{currentLevel.points} Poin</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={resetAll}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < CRIMPING_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Teknisi!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory Semua Level */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/60 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white">
            <div className="w-20 h-20 bg-linear-to-tr from-emerald-400 to-teal-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/40">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Gelar Teknisi Jaringan Sekolah
              </span>
              <h3 className="text-2xl font-black pt-1">
                🏆 Master Krimping LAN Selesai!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Luar biasa! Kamu telah menguasai pembuatan kabel Straight T568B, Straight T568A, dan Kabel Crossover dengan akurasi 100%!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 text-xs space-y-1 text-emerald-300">
              <span className="font-extrabold block">Bintang Praktikum Jaringan Telah Ditambahkan</span>
              <p className="text-[11px] text-slate-400">Siap pasang kabel jaringan di lab komputer sekolah!</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowGrandVictory(false);
                setCurrentLevelIdx(0);
                resetAll();
              }}
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
