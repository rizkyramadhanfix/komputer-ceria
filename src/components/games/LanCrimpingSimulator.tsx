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

// Standard T568B Order (1 to 8):
// 1. Putih-Oranye (White-Orange)
// 2. Oranye (Orange)
// 3. Putih-Hijau (White-Green)
// 4. Biru (Blue)
// 5. Putih-Biru (White-Blue)
// 6. Hijau (Green)
// 7. Putih-Cokelat (White-Brown)
// 8. Cokelat (Brown)
const CORRECT_T568B: string[] = [
  'white-orange',
  'orange',
  'white-green',
  'blue',
  'white-blue',
  'green',
  'white-brown',
  'brown',
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
  const { showSuccess, showError, showInfo } = useToast();

  const [step, setStep] = useState<'peel' | 'arrange' | 'insert' | 'crimp' | 'test'>('peel');
  const [arrangedSlots, setArrangedSlots] = useState<Array<string | null>>(Array(8).fill(null));
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [isTesterRunning, setIsTesterRunning] = useState(false);
  const [activeLed, setActiveLed] = useState<number | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

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
    setArrangedSlots([...CORRECT_T568B]);
    showInfo('Urutan standar T-568B telah disusun otomatis sebagai referensi belajar.');
  };

  const startCableTester = async () => {
    setIsTesterRunning(true);
    setTestSuccess(null);

    let allCorrect = true;
    for (let i = 0; i < 8; i++) {
      setActiveLed(i + 1);
      await new Promise((r) => setTimeout(r, 320));
      if (arrangedSlots[i] !== CORRECT_T568B[i]) {
        allCorrect = false;
      }
    }

    setActiveLed(null);
    setIsTesterRunning(false);
    setTestSuccess(allCorrect);

    if (allCorrect) {
      setIsCompleted(true);
      if (currentUser) {
        const earned = 45;
        const ratio = getGamificationConfig().pointsToStarRatio || 10;
        const updatedTotal = (currentUser.totalPoints || 0) + earned;
        updateUser(currentUser.id, {
          totalPoints: updatedTotal,
          totalStars: Math.floor(updatedTotal / ratio),
        });
        refreshUser();
      }
      showSuccess('🎉 Selamat! 8 Pin RJ-45 terhubung sempurna dengan standar T568B! (+45 Poin)');
    } else {
      showError('Lampu tester mendeteksi pin salah / tertukar (Cross/Miswired). Periksa kembali urutan warna.');
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
                Praktikum Jaringan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pelajari urutan 8 kabel UTP standar internasional T568B dan uji dengan LAN Cable Tester.
            </p>
          </div>
        </div>

        <button
          onClick={resetAll}
          className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Ulang Praktikum</span>
        </button>
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
          {/* Helper info standard T568B */}
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] leading-relaxed">
              <strong>Standar Internasional T-568B (Straight-Through):</strong>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {CORRECT_T568B.map((id, i) => {
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
              <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-2xl space-y-2 animate-in zoom-in-95">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-black text-emerald-300">Kabel LAN Sempurna (1000 Mbps Gigabit Ready)!</h4>
                <p className="text-xs text-slate-300">
                  Seluruh 8 pin terhubung sesuai standar T568B. Kabel siap digunakan untuk internet lab komputer!
                </p>
              </div>
            )}

            {testSuccess === false && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl space-y-2 animate-in zoom-in-95">
                <h4 className="text-sm font-black text-rose-300">Kabel Gagal (Salah Urutan Warna)</h4>
                <p className="text-xs text-slate-300">
                  Ada kawat yang tertukar pin. Susun kembali 8 kawat sesuai urutan standar T568B.
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
    </div>
  );
};
