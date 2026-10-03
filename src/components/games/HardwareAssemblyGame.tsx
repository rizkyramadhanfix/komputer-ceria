import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  MemoryStick as Memory, 
  HardDrive, 
  Fan, 
  Zap, 
  Box, 
  CheckCircle2, 
  Trophy,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Wrench
} from 'lucide-react';
import { recordGameScore } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface HardwareComponent {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  targetX: number;
  targetY: number;
  slotLabel: string;
  color: string;
  bgColor: string;
}

interface AssemblyLevel {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  points: number;
  components: HardwareComponent[];
}

const ASSEMBLY_LEVELS: AssemblyLevel[] = [
  {
    id: 1,
    title: 'Level 1: PC Office & Belajar Siswa',
    category: 'Dasar / Pemula',
    subtitle: 'Rakit Komputer Administrasi & Mengetik',
    description: 'Pasang komponen esensial komputer standar untuk mengetik, browsing, dan tugas sekolah.',
    points: 60,
    components: [
      {
        id: 'cpu-office',
        name: 'Processor (CPU) Quad-Core',
        shortName: 'CPU Socket',
        icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Otak utama komputer yang memproses seluruh perintah naskah dan software.',
        targetX: 230,
        targetY: 90,
        slotLabel: 'Soket CPU LGA/AM4',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-600',
      },
      {
        id: 'ram-office',
        name: 'RAM DDR4 8GB',
        shortName: 'RAM Slot 1',
        icon: <Memory className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Memori kerja berkecepatan tinggi tempat data aplikasi dibuka sementara.',
        targetX: 370,
        targetY: 80,
        slotLabel: 'Slot RAM DDR4',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-600',
      },
      {
        id: 'cooler-office',
        name: 'Stock Fan CPU Cooler',
        shortName: 'Heatsink Fan',
        icon: <Fan className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Kipas pendingin yang menempel di atas processor agar suhu stabil di bawah 65°C.',
        targetX: 230,
        targetY: 150,
        slotLabel: 'Dudukan Kipas CPU',
        color: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-600',
      },
      {
        id: 'ssd-office',
        name: 'SSD 256GB High-Speed',
        shortName: 'Storage SSD',
        icon: <HardDrive className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Media penyimpanan sistem operasi Windows dan berkas dokumen yang sangat cepat.',
        targetX: 420,
        targetY: 260,
        slotLabel: 'Port SATA / M.2 SSD',
        color: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-600',
      },
      {
        id: 'psu-office',
        name: 'Power Supply (PSU) 450W',
        shortName: 'PSU Box',
        icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Mengubah arus listrik PLN menjadi tegangan DC yang aman bagi seluruh komponen.',
        targetX: 60,
        targetY: 280,
        slotLabel: 'Kompartemen PSU Bawah',
        color: 'from-slate-600 to-slate-800',
        bgColor: 'bg-slate-700',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: PC Gaming Esports & Desain Multimedia',
    category: 'Menengah',
    subtitle: 'Rakit Komputer Grafis & Editing Video',
    description: 'Tambahkan kartu grafis dedicated dan sistem pendingin untuk game 3D serta edit video.',
    points: 90,
    components: [
      {
        id: 'cpu-gaming',
        name: 'Processor 8-Core High Speed',
        shortName: 'Gaming CPU',
        icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Processor kencang dengan cache besar untuk memproses komputasi game & render.',
        targetX: 230,
        targetY: 90,
        slotLabel: 'Soket CPU High-End',
        color: 'from-indigo-600 to-purple-600',
        bgColor: 'bg-indigo-600',
      },
      {
        id: 'ram-gaming',
        name: 'Dual-Channel RAM DDR4 16GB RGB',
        shortName: 'Dual RAM',
        icon: <Memory className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Dua keping RAM berjalan serempak untuk melipatgandakan bandwidth data memori.',
        targetX: 370,
        targetY: 80,
        slotLabel: 'Slot Dual-Channel RAM',
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-600',
      },
      {
        id: 'gpu-gaming',
        name: 'Kartu Grafis (GPU VGA) 8GB GDDR6',
        shortName: 'GPU PCIe Slot',
        icon: <Box className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Unit pengolah visual 3D, efek pencahayaan ray-tracing, dan resolusi tinggi 4K.',
        targetX: 190,
        targetY: 230,
        slotLabel: 'Slot PCIe x16 Grafis',
        color: 'from-violet-600 to-purple-700',
        bgColor: 'bg-violet-600',
      },
      {
        id: 'cooler-tower',
        name: 'Tower Heatpipe Air Cooler',
        shortName: 'Tower Heatsink',
        icon: <Fan className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Sirip pendingin tembaga dengan kipas ganda untuk mendinginkan beban rendering berat.',
        targetX: 230,
        targetY: 150,
        slotLabel: 'Dudukan Heatsink Tower',
        color: 'from-sky-500 to-cyan-600',
        bgColor: 'bg-sky-600',
      },
      {
        id: 'nvme-gaming',
        name: 'M.2 NVMe SSD 1TB Gen4',
        shortName: 'NVMe Slot',
        icon: <HardDrive className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Penyimpanan langsung menempel di motherboard dengan kecepatan hingga 5000 MB/s.',
        targetX: 320,
        targetY: 280,
        slotLabel: 'Soket M.2 Heatsink Shield',
        color: 'from-amber-500 to-red-600',
        bgColor: 'bg-amber-600',
      },
      {
        id: 'psu-gaming',
        name: 'PSU 650W 80+ Bronze',
        shortName: 'PSU 650W',
        icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Pasokan daya stabil berkapasitas besar dengan kabel khusus daya kartu grafis VGA.',
        targetX: 60,
        targetY: 280,
        slotLabel: 'Kompartemen PSU Gaming',
        color: 'from-slate-700 to-slate-900',
        bgColor: 'bg-slate-700',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Server Komputer & AI Workstation',
    category: 'Tingkat Mahir',
    subtitle: 'Rakit Server Sekolah & Pusat Data AI',
    description: 'Bangun arsitektur server laboratorium sekolah dengan komponen kelas enterprise.',
    points: 120,
    components: [
      {
        id: 'cpu-server',
        name: 'Processor Multi-Threading 16-Core',
        shortName: 'Enterprise CPU',
        icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Processor bertenaga masif yang sanggup melayani ratusan koneksi siswa bersamaan.',
        targetX: 230,
        targetY: 90,
        slotLabel: 'Soket Server Enterprise',
        color: 'from-indigo-600 to-blue-700',
        bgColor: 'bg-indigo-600',
      },
      {
        id: 'ram-ecc',
        name: 'Quad-Channel ECC Server RAM 64GB',
        shortName: 'ECC Memory',
        icon: <Memory className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'RAM dengan proteksi Error-Correcting Code anti-crash untuk operasional 24 jam nonstop.',
        targetX: 370,
        targetY: 80,
        slotLabel: 'Slot Quad Quad-Channel',
        color: 'from-teal-600 to-emerald-700',
        bgColor: 'bg-teal-600',
      },
      {
        id: 'liquid-cooler',
        name: 'Liquid Cooling AIO 360mm Radiator',
        shortName: 'Waterblock AIO',
        icon: <Fan className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Sistem pendingin cairan tertutup dengan pompa khusus menyerap panas ekstrem.',
        targetX: 230,
        targetY: 150,
        slotLabel: 'Blok Pendingin Cairan',
        color: 'from-cyan-600 to-blue-800',
        bgColor: 'bg-cyan-600',
      },
      {
        id: 'gpu-ai',
        name: 'GPU AI Tensor Core Accelerator',
        shortName: 'AI Accelerator',
        icon: <Box className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Kartu akselerasi khusus neural network, deep learning, dan rendering lab sekolah.',
        targetX: 190,
        targetY: 230,
        slotLabel: 'Slot PCIe Gen 5.0 Dual',
        color: 'from-purple-600 to-pink-700',
        bgColor: 'bg-purple-600',
      },
      {
        id: 'storage-raid',
        name: 'Enterprise NVMe Storage Array 4TB',
        shortName: 'RAID NVMe',
        icon: <HardDrive className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Larik SSD server berkecepatan 7.500 MB/s untuk menampung database jutaan record.',
        targetX: 320,
        targetY: 280,
        slotLabel: 'Port RAID Server Cage',
        color: 'from-amber-600 to-orange-700',
        bgColor: 'bg-amber-600',
      },
      {
        id: 'psu-modular',
        name: 'PSU 850W 80+ Gold Fully Modular',
        shortName: 'PSU Modular',
        icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
        description: 'Catu daya efisiensi tinggi 92% dengan manajemen kabel modular dan proteksi lonjakan voltase.',
        targetX: 60,
        targetY: 280,
        slotLabel: 'Bay PSU Server Silent',
        color: 'from-slate-800 to-black',
        bgColor: 'bg-slate-800',
      },
    ],
  },
];

export const HardwareAssemblyGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = ASSEMBLY_LEVELS[currentLevelIdx];

  const [assembled, setAssembled] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongPlacements, setWrongPlacements] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const currentComponent = currentLevel.components[currentStep];

  const handleAssembleSlot = (comp: HardwareComponent) => {
    if (showLevelVictory || showGrandVictory) return;

    if (comp.id === currentComponent?.id) {
      const nextAssembled = [...assembled, comp.id];
      setAssembled(nextAssembled);
      const earned = 25;
      setScore((prev) => prev + earned);

      if (currentStep < currentLevel.components.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        finishLevel(nextAssembled.length);
      }
    } else {
      setWrongPlacements((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const handleDrop = (id: string, x: number, y: number) => {
    if (showLevelVictory || showGrandVictory) return;
    const target = currentLevel.components.find((c) => c.id === id);
    if (!target) return;

    // Tolerance
    const tolerance = 70;
    const isCorrect = Math.abs(x - target.targetX) < tolerance && Math.abs(y - target.targetY) < tolerance;

    if (isCorrect && target.id === currentComponent?.id) {
      handleAssembleSlot(target);
    } else {
      setWrongPlacements((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const finishLevel = (totalComp: number) => {
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      if (currentUser?.id) {
        const bonus = currentLevel.points;
        recordGameScore('Rakit PC Simulator', currentUser.id, score + bonus, Math.round((score + bonus) / 5));
        refreshUser();
        showStarReward(
          Math.max(1, Math.floor(bonus / 10)),
          `${currentLevel.title} Selesai! Semua ${totalComp} komponen terpasang sempurna (+${bonus} Poin)!`,
          'Bintang Teknisi Rakit PC!'
        );
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < ASSEMBLY_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      resetLevelState();
    } else {
      setShowGrandVictory(true);
    }
  };

  const resetLevelState = () => {
    setAssembled([]);
    setCurrentStep(0);
    setWrongPlacements(0);
    setShowLevelVictory(false);
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    setAssembled([]);
    setCurrentStep(0);
    setWrongPlacements(0);
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const handleRestartFromBeginning = () => {
    setCurrentLevelIdx(0);
    setScore(0);
    setCompletedLevels([]);
    resetLevelState();
    setShowGrandVictory(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              Simulator Rakit PC Sekolah
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              Level {currentLevel.id} dari {ASSEMBLY_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {currentLevel.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLevel.description}
          </p>
        </div>

        {/* Level Switcher & Stats */}
        <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
            {ASSEMBLY_LEVELS.map((lvl, idx) => {
              const isDone = completedLevels.includes(lvl.id);
              const isCurrent = idx === currentLevelIdx;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevelTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  <span>Lvl {lvl.id}</span>
                </button>
              );
            })}
          </div>

          <div className="text-right px-3 border-l border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Skor</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{score}</p>
          </div>

          <button 
            type="button"
            onClick={resetLevelState}
            title="Reset Posisi Level Ini"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Motherboard Chasis Area (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Papan Motherboard & Casing Lab
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Progres: {assembled.length}/{currentLevel.components.length} Komponen
            </span>
          </div>

          {/* Interactive Motherboard Board */}
          <div className="relative w-full h-[360px] sm:h-[400px] bg-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Motherboard Grid Lines Background */}
            <div 
              className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* Circuit Lines Decorative SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <path d="M 50 280 L 150 280 L 230 180 L 230 90" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <path d="M 230 90 L 370 80" stroke="#34d399" strokeWidth="2" fill="none" />
              <path d="M 370 120 L 370 280 L 420 280" stroke="#fbbf24" strokeWidth="2" fill="none" />
            </svg>

            {/* Motherboard Component Slots */}
            {currentLevel.components.map((comp) => {
              const isInstalled = assembled.includes(comp.id);
              const isTargetForCurrent = comp.id === currentComponent?.id;

              return (
                <div
                  key={comp.id}
                  onClick={() => handleAssembleSlot(comp)}
                  style={{
                    left: `${(comp.targetX / 500) * 85 + 5}%`,
                    top: `${(comp.targetY / 400) * 80 + 5}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isInstalled
                      ? `${comp.bgColor} text-white shadow-lg ring-2 ring-emerald-400 scale-105`
                      : isTargetForCurrent
                      ? 'border-2 border-dashed border-indigo-400 bg-indigo-950/60 text-indigo-300 animate-pulse ring-4 ring-indigo-500/20'
                      : 'border-2 border-dashed border-slate-700 bg-slate-800/60 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-black/20">
                    {comp.icon}
                  </div>
                  <span className="text-[10px] font-black mt-1 leading-tight text-center max-w-[80px] truncate">
                    {isInstalled ? '✅ ' + comp.shortName : comp.slotLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 italic">
              💡 Tips: Seret komponen di samping atau klik langsung pada soket motherboard yang berkedip biru.
            </span>
          </div>
        </div>

        {/* Component to Install Rack (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Komponen Yang Harus Dipasang
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                Langkah {currentStep + 1} dari {currentLevel.components.length}
              </span>
            </div>

            {currentComponent ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentComponent.color} text-white space-y-2 shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-xs rounded-xl shadow-inner">
                      {currentComponent.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        {currentLevel.category}
                      </p>
                      <h4 className="text-base sm:text-lg font-black">{currentComponent.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-95">
                    {currentComponent.description}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Lokasi Pemasangan:</span>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{currentComponent.slotLabel}</p>
                </div>

                {/* Draggable Component Card */}
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, info) => {
                      handleDrop(currentComponent.id, info.point.x, info.point.y);
                    }}
                    whileDrag={{ scale: 1.15, zIndex: 50 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleAssembleSlot(currentComponent)}
                    className={`w-full py-4 px-5 rounded-2xl bg-gradient-to-r ${currentComponent.color} text-white flex items-center justify-between cursor-grab active:cursor-grabbing shadow-xl shadow-indigo-500/20`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        {currentComponent.icon}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-bold block uppercase opacity-80">Klik / Tarik ke Soket:</span>
                        <span className="text-sm font-black">{currentComponent.shortName}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs">
                      Pasang →
                    </span>
                  </motion.div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Education Box */}
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Tips Teknisi Komputer Ceria</p>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed mt-0.5">
                Pastikan pasta termal (thermal paste) telah dioleskan di atas CPU sebelum mengunci heatsink cooler agar transfer panas optimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Level Selesai & Lanjut Level */}
      <AnimatePresence>
        {showLevelVictory && !showGrandVictory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/40 shadow-2xl text-center space-y-5"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Level {currentLevel.id} Berhasil Dirakit!
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                  {currentLevel.subtitle} Selesai!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Semua komponen terpasang rapi dan sistem PC siap dinyalakan untuk pengujian benchmark!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Komponen Pas</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {currentLevel.components.length}/{currentLevel.components.length}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonus Poin</span>
                  <span className="text-xl font-black font-mono text-amber-500">
                    +{currentLevel.points} pt
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={resetLevelState}
                  className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Rakit Ulang
                </button>
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>{currentLevelIdx < ASSEMBLY_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Master Rakit!'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Grand Victory: Tamat Seluruh Level */}
      <AnimatePresence>
        {showGrandVictory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                <Award className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Gelar Kehormatan Hardware Lab
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                  🏆 Master Teknisi Rakit PC Tamat!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Selamat! Kamu telah sukses menguasai perakitan PC Office, PC Gaming Esports, hingga Server Lab Workstation!
                </p>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-extrabold block">Total Skor Akhir: {score} Poin</span>
                <p className="text-[11px] opacity-80">Poin Bintang dan sertifikasi lab kamu telah diperbarui!</p>
              </div>

              <button
                type="button"
                onClick={handleRestartFromBeginning}
                className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
              >
                Mainkan Lagi dari Level 1
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
