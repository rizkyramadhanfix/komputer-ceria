import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Cpu,
  Fan,
  HardDrive,
  Info,
  Layers,
  Monitor,
  Power,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Tv,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints } from '../../services/storageService';

interface HardwarePart {
  id: string;
  name: string;
  category: string;
  icon: any;
  slotKey: 'motherboard' | 'cpu' | 'ram' | 'storage' | 'psu' | 'gpu' | 'cooler';
  description: string;
  specs: string;
  color: string;
}

const HARDWARE_PARTS: HardwarePart[] = [
  {
    id: 'mb-1',
    name: 'Motherboard ATX Ceria',
    category: 'Papan Utama',
    icon: Layers,
    slotKey: 'motherboard',
    description: 'Papan sirkuit utama tempat semua komponen komputer terhubung dan berkomunikasi.',
    specs: 'Socket LGA 1700, 4x DDR4 RAM, PCIe 4.0',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'cpu-1',
    name: 'Processor CPU Core-i7 Edu',
    category: 'Otak Komputer',
    icon: Cpu,
    slotKey: 'cpu',
    description: 'Otak pemroses utama komputer yang melakukan perhitungan logika dan menjalankan aplikasi.',
    specs: '8 Core 16 Thread, 4.2 GHz Boost',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'ram-1',
    name: 'Dual RAM 16GB RGB High-Speed',
    category: 'Memori Utama Cepat',
    icon: Zap,
    slotKey: 'ram',
    description: 'Memori penyimpanan sementara yang sangat cepat untuk menjalankan program yang sedang aktif.',
    specs: '2x8GB (16GB) DDR4 3200MHz',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'ssd-1',
    name: 'Storage SSD NVMe 1TB Cepat',
    category: 'Penyimpanan Data',
    icon: HardDrive,
    slotKey: 'storage',
    description: 'Media penyimpanan permanen untuk sistem operasi Windows, foto, video, naskah Word, dan game.',
    specs: 'Read 3500 MB/s, Write 3000 MB/s',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'psu-1',
    name: 'Power Supply 650W 80+ Bronze',
    category: 'Catu Daya Listrik',
    icon: Zap,
    slotKey: 'psu',
    description: 'Menyuplai dan membagi arus listrik stabil ke seluruh komponen di dalam komputer.',
    specs: '650 Watt 80+ Bronze Certified',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'gpu-1',
    name: 'Kartu Grafis GPU Gaming Ceria',
    category: 'Pemroses Gambar & Video',
    icon: Monitor,
    slotKey: 'gpu',
    description: 'Memproses grafis tampilan visual 3D, lukisan Paint, video, dan animasi di layar monitor.',
    specs: '8GB GDDR6, Dual Fan, Ray Tracing',
    color: 'from-rose-500 to-red-700',
  },
  {
    id: 'cooler-1',
    name: 'RGB Fan CPU Cooler Tower',
    category: 'Pendingin Suhu',
    icon: Fan,
    slotKey: 'cooler',
    description: 'Menjaga suhu processor tetap sejuk agar komputer tidak mengalami overheat saat digunakan belajar.',
    specs: '4 Heatpipes, 120mm Silent PWM Fan',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const PcBuilderSimulator: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo, showStarReward } = useToast();

  const [installedSlots, setInstalledSlots] = useState<{
    motherboard?: HardwarePart;
    cpu?: HardwarePart;
    ram?: HardwarePart;
    storage?: HardwarePart;
    psu?: HardwarePart;
    gpu?: HardwarePart;
    cooler?: HardwarePart;
  }>({});

  const [selectedPartInfo, setSelectedPartInfo] = useState<HardwarePart | null>(
    HARDWARE_PARTS[0]
  );
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  const totalSlotsCount = 7;
  const installedCount = Object.keys(installedSlots).length;
  const isAllInstalled = installedCount === totalSlotsCount;

  const handleInstallPart = (part: HardwarePart) => {
    // Check installation prerequisites
    if (part.slotKey !== 'motherboard' && !installedSlots.motherboard) {
      showError('Pasang Motherboard terlebih dahulu sebagai alas semua komponen!');
      return;
    }

    if (part.slotKey === 'cooler' && !installedSlots.cpu) {
      showError('Pasang Processor CPU terlebih dahulu sebelum memasang pendingin Fan Cooler!');
      return;
    }

    setInstalledSlots((prev) => ({
      ...prev,
      [part.slotKey]: part,
    }));
    setSelectedPartInfo(part);
    showSuccess(`Komponen "${part.name}" berhasil dipasang ke slot!`, 'Perakitan Komputer');
  };

  const handleRemovePart = (slotKey: keyof typeof installedSlots) => {
    if (isPoweredOn) {
      showError('Matikan komputer terlebih dahulu sebelum melepas komponen!');
      return;
    }

    setInstalledSlots((prev) => {
      const copy = { ...prev };
      delete copy[slotKey];
      // If motherboard removed, reset all
      if (slotKey === 'motherboard') {
        return {};
      }
      return copy;
    });
  };

  const handlePowerOn = () => {
    if (!isAllInstalled) {
      showError(
        `Komponen belum lengkap! Masih ada ${
          totalSlotsCount - installedCount
        } bagian yang belum dipasang.`
      );
      return;
    }

    setIsPoweredOn(true);
    setBootLog([
      '⚡ Power Supply Mengalirkan Arus Listrik 12V...',
      '🔍 POST (Power-On Self-Test) Checking Hardware...',
      '✅ Motherboard & BIOS Terdeteksi Normal',
      '✅ Processor CPU Core-i7 Running @ 4.2 GHz',
      '✅ RAM 16GB Dual-Channel Ready',
      '✅ NVMe SSD Storage Detected (1000 GB)',
      '✅ GPU Display Output Signal: OK (1080p 60Hz)',
      '🎉 Sistem Operasi Komputer Ceria Berhasil Booting!',
    ]);

    if (!hasClaimedReward && currentUser) {
      const rewardPoints = 60;
      awardStudentPoints(currentUser.id, rewardPoints);
      refreshUser();
      setHasClaimedReward(true);
      showStarReward(
        6,
        `Luar biasa! Komputer rakitan berhasil menyala! Kamu mendapatkan +${rewardPoints} Poin dan +6 Bintang!`,
        'Bintang Ahli Rakit PC!'
      );
    }
  };

  const handleReset = () => {
    setIsPoweredOn(false);
    setBootLog([]);
    setInstalledSlots({});
    setHasClaimedReward(false);
    showInfo('Simulator perakitan direset ke kondisi awal.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Cpu className="w-4 h-4" />
              Laboratorium Perangkat Keras Virtual
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              Progres: {installedCount}/{totalSlotsCount} Komponen
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Simulator Perakitan Komputer (PC Building Lab)
          </h2>
          <p className="text-xs text-slate-500">
            Pasang komponen hardware komputer ke slot casing CPU dengan urutan yang tepat dan uji tombol Power!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Rakitan</span>
          </button>

          <button
            type="button"
            onClick={handlePowerOn}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isPoweredOn
                ? 'bg-emerald-600 text-white shadow-emerald-500/30 ring-2 ring-emerald-400 animate-pulse'
                : isAllInstalled
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isPoweredOn ? 'PC MENYALA (ONLINE)' : 'Nyalakan PC'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Virtual PC Case Chassis (Interactive Slot Visualizer) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`relative rounded-2xl border-4 p-5 sm:p-6 transition-all min-h-[460px] flex flex-col justify-between overflow-hidden shadow-xl ${
              isPoweredOn
                ? 'bg-slate-950 border-cyan-500 shadow-cyan-500/20 ring-4 ring-cyan-500/20'
                : 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-700'
            }`}
          >
            {/* RGB Glass Indicator Glow */}
            {isPoweredOn && (
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none animate-pulse" />
            )}

            {/* PC Case Top Bar */}
            <div className="flex items-center justify-between z-10 border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-mono text-[11px] ml-1">
                  Gaming Chassis Tower V2 · SDN Sukadamai 2 Lab
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPoweredOn ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-400">
                  {isPoweredOn ? 'STATUS: RUNNING' : 'STATUS: STANDBY'}
                </span>
              </div>
            </div>

            {/* Simulated Motherboard Board Inside PC */}
            <div className="my-4 p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/80 z-10 space-y-3 relative">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300">
                  Papan Sirkuit Motherboard Area:
                </span>
                {!installedSlots.motherboard && (
                  <span className="text-amber-400 text-[10px] animate-pulse">
                    ⚠️ Pasang Motherboard terlebih dahulu
                  </span>
                )}
              </div>

              {/* Grid of internal slots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. Motherboard slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.motherboard
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">1. Motherboard</span>
                    <Layers className="w-4 h-4 text-emerald-400" />
                  </div>
                  {installedSlots.motherboard ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.motherboard.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('motherboard')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">Belum terpasang</p>
                  )}
                </div>

                {/* 2. CPU slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.cpu
                      ? 'bg-blue-950/60 border-blue-500 text-blue-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">2. Processor CPU</span>
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  {installedSlots.cpu ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.cpu.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('cpu')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">Socket LGA 1700</p>
                  )}
                </div>

                {/* 3. RAM slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.ram
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">3. RAM Memory</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  {installedSlots.ram ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.ram.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('ram')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">DIMM DDR4 Slot</p>
                  )}
                </div>

                {/* 4. Cooler slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.cooler
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">4. Fan Cooler</span>
                    <Fan
                      className={`w-4 h-4 text-cyan-400 ${
                        isPoweredOn ? 'animate-spin' : ''
                      }`}
                    />
                  </div>
                  {installedSlots.cooler ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.cooler.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('cooler')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">Di atas CPU</p>
                  )}
                </div>

                {/* 5. GPU slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.gpu
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">5. VGA / GPU</span>
                    <Monitor className="w-4 h-4 text-rose-400" />
                  </div>
                  {installedSlots.gpu ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.gpu.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('gpu')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">PCIe x16 Slot</p>
                  )}
                </div>

                {/* 6. Storage SSD slot */}
                <div
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    installedSlots.storage
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">6. Storage SSD</span>
                    <HardDrive className="w-4 h-4 text-purple-400" />
                  </div>
                  {installedSlots.storage ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-white text-[11px] truncate">
                        {installedSlots.storage.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemovePart('storage')}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Lepas
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-2">M.2 NVMe Slot</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Case Basement: Power Supply Unit */}
            <div
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between z-10 ${
                installedSlots.psu
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-500 border-dashed'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    installedSlots.psu ? 'text-amber-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <span className="font-semibold block text-[11px]">
                    7. Power Supply (PSU Chamber)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {installedSlots.psu
                      ? installedSlots.psu.name
                      : 'Slot PSU di bagian bawah casing'}
                  </span>
                </div>
              </div>

              {installedSlots.psu && (
                <button
                  type="button"
                  onClick={() => handleRemovePart('psu')}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Lepas
                </button>
              )}
            </div>
          </div>

          {/* Monitor Screen Output (Active when Powered On) */}
          {isPoweredOn && (
            <div className="p-4 bg-slate-950 rounded-2xl border-2 border-cyan-500 text-cyan-400 font-mono text-xs space-y-1.5 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-cyan-900/60 text-[10px]">
                <span className="flex items-center gap-1.5 text-white">
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  Monitor Visual Output (BIOS POST Boot)
                </span>
                <span className="text-emerald-400">● 60 FPS STABLE</span>
              </div>
              {bootLog.map((log, i) => (
                <p key={i} className="text-[11px] leading-relaxed">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Hardware Inventory Parts Selector & Learning Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pilih Komponen untuk Dipasang
              </h3>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Klik kartu untuk memasang
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {HARDWARE_PARTS.map((part) => {
                const isInstalled = !!installedSlots[part.slotKey];
                const IconComponent = part.icon;

                return (
                  <div
                    key={part.id}
                    onClick={() => {
                      setSelectedPartInfo(part);
                      if (!isInstalled) {
                        handleInstallPart(part);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isInstalled
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : selectedPartInfo?.id === part.id
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${part.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 block leading-none">
                          {part.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                          {part.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {part.specs}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isInstalled ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Terpasang
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                        >
                          + Pasang
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Educational Hardware Description Card */}
          {selectedPartInfo && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <Info className="w-4 h-4" />
                <span>Edukasi Fungsi: {selectedPartInfo.name}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedPartInfo.description}
              </p>
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between text-[11px] text-slate-500">
                <span>Spesifikasi Teknis:</span>
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedPartInfo.specs}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
