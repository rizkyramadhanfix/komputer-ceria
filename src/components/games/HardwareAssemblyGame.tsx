import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { recordGameScore } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface HardwareComponent {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  targetX: number;
  targetY: number;
  color: string;
}

const HARDWARE_COMPONENTS: HardwareComponent[] = [
  {
    id: 'cpu',
    name: 'Processor (CPU)',
    icon: <Cpu className="w-8 h-8" />,
    description: 'Otak komputer yang memproses semua instruksi.',
    targetX: 250,
    targetY: 100,
    color: 'bg-indigo-500',
  },
  {
    id: 'ram',
    name: 'RAM Memory',
    icon: <Memory className="w-8 h-8" />,
    description: 'Penyimpanan sementara untuk aplikasi yang berjalan.',
    targetX: 400,
    targetY: 80,
    color: 'bg-emerald-500',
  },
  {
    id: 'gpu',
    name: 'VGA Card (GPU)',
    icon: <Box className="w-8 h-8" />,
    description: 'Mengolah data grafis untuk ditampilkan di layar.',
    targetX: 100,
    targetY: 250,
    color: 'bg-amber-500',
  },
  {
    id: 'ssd',
    name: 'SSD Storage',
    icon: <HardDrive className="w-8 h-8" />,
    description: 'Menyimpan sistem operasi dan data secara permanen.',
    targetX: 450,
    targetY: 300,
    color: 'bg-rose-500',
  },
  {
    id: 'fan',
    name: 'CPU Cooler',
    icon: <Fan className="w-8 h-8" />,
    description: 'Mendinginkan suhu processor agar tidak panas.',
    targetX: 250,
    targetY: 100, // Same as CPU but placed after
    color: 'bg-sky-500',
  },
  {
    id: 'psu',
    name: 'Power Supply',
    icon: <Zap className="w-8 h-8" />,
    description: 'Penyalur daya listrik ke semua komponen.',
    targetX: 50,
    targetY: 350,
    color: 'bg-slate-700',
  },
];

export const HardwareAssemblyGame: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSuccess } = useToast();
  const [assembled, setAssembled] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongPlacements, setWrongPlacements] = useState(0);

  const currentComponent = HARDWARE_COMPONENTS[currentStep];

  const handleDrop = (id: string, x: number, y: number) => {
    if (isFinished) return;

    const target = HARDWARE_COMPONENTS.find(c => c.id === id);
    if (!target) return;

    // Tolerance for "correct" placement
    const tolerance = 50;
    const isCorrect = Math.abs(x - target.targetX) < tolerance && Math.abs(y - target.targetY) < tolerance;

    if (isCorrect) {
      setAssembled([...assembled, id]);
      setScore(prev => prev + 20);
      
      if (currentStep < HARDWARE_COMPONENTS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        finishGame();
      }
    } else {
      setWrongPlacements(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    const finalScore = score + 20; // Last step points
    if (currentUser) {
      recordGameScore('Rakit PC Simulator', currentUser.id, finalScore);
    }
    showSuccess(`Selamat! Kamu berhasil merakit PC dengan skor ${finalScore}!`);
  };

  const resetGame = () => {
    setAssembled([]);
    setCurrentStep(0);
    setIsFinished(false);
    setScore(0);
    setWrongPlacements(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
              Simulator Rakit PC
            </span>
            {isFinished && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Selesai
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Lab Komponen Komputer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tarik komponen di bawah ke posisi yang benar pada Motherboard.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-4 border-l border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Skor</p>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{score}</p>
          </div>
          <div className="text-center px-4 border-l border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Kesalahan</p>
            <p className="text-xl font-black text-rose-500 font-mono">{wrongPlacements}</p>
          </div>
          <button 
            onClick={resetGame}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2 relative aspect-[4/3] bg-slate-100 dark:bg-slate-950 rounded-3xl border-4 border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
          {/* Motherboard Background SVG-like layout */}
          <div className="absolute inset-0 p-8">
            <div className="w-full h-full border-4 border-indigo-900/20 rounded-2xl relative bg-slate-200 dark:bg-slate-900/50">
              {/* CPU Socket */}
              <div 
                className={`absolute w-24 h-24 border-2 border-dashed border-indigo-400/50 rounded-lg flex items-center justify-center transition-colors ${assembled.includes('cpu') ? 'bg-indigo-500/20 border-solid' : 'bg-indigo-400/5'}`}
                style={{ left: 250, top: 100 }}
              >
                {!assembled.includes('cpu') && <span className="text-[10px] font-bold text-indigo-400 opacity-50 uppercase">CPU Socket</span>}
                {assembled.includes('cpu') && <Cpu className="w-10 h-10 text-indigo-500" />}
                {assembled.includes('fan') && <Fan className="absolute w-16 h-16 text-sky-500 animate-spin-slow" />}
              </div>

              {/* RAM Slots */}
              <div 
                className={`absolute w-40 h-8 border-2 border-dashed border-emerald-400/50 rounded flex items-center justify-center transition-colors ${assembled.includes('ram') ? 'bg-emerald-500/20 border-solid' : 'bg-emerald-400/5'}`}
                style={{ left: 400, top: 80, transform: 'rotate(90deg)' }}
              >
                {!assembled.includes('ram') && <span className="text-[10px] font-bold text-emerald-400 opacity-50 uppercase">RAM Slot</span>}
                {assembled.includes('ram') && <Memory className="w-8 h-8 text-emerald-500" />}
              </div>

              {/* GPU Slot (PCIe) */}
              <div 
                className={`absolute w-64 h-10 border-2 border-dashed border-amber-400/50 rounded flex items-center justify-center transition-colors ${assembled.includes('gpu') ? 'bg-amber-500/20 border-solid' : 'bg-amber-400/5'}`}
                style={{ left: 100, top: 250 }}
              >
                {!assembled.includes('gpu') && <span className="text-[10px] font-bold text-amber-400 opacity-50 uppercase">PCIe Slot (GPU)</span>}
                {assembled.includes('gpu') && <Box className="w-8 h-8 text-amber-500" />}
              </div>

              {/* SSD Slot */}
              <div 
                className={`absolute w-20 h-12 border-2 border-dashed border-rose-400/50 rounded flex items-center justify-center transition-colors ${assembled.includes('ssd') ? 'bg-rose-500/20 border-solid' : 'bg-rose-400/5'}`}
                style={{ left: 450, top: 300 }}
              >
                {!assembled.includes('ssd') && <span className="text-[10px] font-bold text-rose-400 opacity-50 uppercase">SATA</span>}
                {assembled.includes('ssd') && <HardDrive className="w-8 h-8 text-rose-500" />}
              </div>

              {/* PSU Area */}
              <div 
                className={`absolute w-32 h-32 border-2 border-dashed border-slate-400/50 rounded-xl flex items-center justify-center transition-colors ${assembled.includes('psu') ? 'bg-slate-700/20 border-solid' : 'bg-slate-400/5'}`}
                style={{ left: 50, top: 350 }}
              >
                {!assembled.includes('psu') && <span className="text-[10px] font-bold text-slate-400 opacity-50 uppercase">PSU Bay</span>}
                {assembled.includes('psu') && <Zap className="w-10 h-10 text-slate-700 dark:text-slate-300" />}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8 text-center"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Rakitan Selesai!</h3>
                  <p className="text-slate-300 max-w-xs mx-auto">
                    Komputer berhasil dirakit dan siap untuk digunakan belajar di Laboratorium Komputer Ceria.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Skor Akhir</p>
                      <p className="text-xl font-black text-amber-400 font-mono">{score + 20}</p>
                    </div>
                    <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Bintang XP</p>
                      <p className="text-xl font-black text-indigo-400 font-mono">+{Math.round((score + 20) / 5)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Main Lagi
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info & Inventory Area */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-600" />
              Langkah Berikutnya:
            </h3>

            {!isFinished && currentComponent ? (
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${currentComponent.color} text-white space-y-2 shadow-md`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {currentComponent.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-80">Pasang Komponen</p>
                      <h4 className="text-lg font-black">{currentComponent.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {currentComponent.description}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Instruksi:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "Gunakan mouse untuk menyeret komponen ke area bergaris putus-putus yang sesuai di papan motherboard."
                  </p>
                </div>

                <div className="flex justify-center py-4">
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, info) => {
                      // Note: In a real app, we'd need more complex coordinate calculation
                      // This is a simplified logic for demo
                      handleDrop(currentComponent.id, info.point.x, info.point.y);
                    }}
                    whileDrag={{ scale: 1.2, zIndex: 50 }}
                    whileHover={{ scale: 1.05 }}
                    className={`w-24 h-24 rounded-2xl ${currentComponent.color} text-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl shadow-indigo-500/20`}
                  >
                    {currentComponent.icon}
                  </motion.div>
                </div>
              </div>
            ) : isFinished ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">PC Siap Digunakan!</p>
                <p className="text-xs text-slate-500">Semua komponen terpasang dengan benar.</p>
              </div>
            ) : null}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Tips Belajar</p>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed mt-1">
                Selalu gunakan pelindung statis saat memegang komponen hardware asli agar tidak merusak sirkuit elektronik yang sensitif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
