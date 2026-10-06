import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  RotateCcw,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints, recordGameScore } from '../../services/storageService';
import { soundEffects } from '../../utils/soundEffects';

type PetMood = 'happy' | 'hungry' | 'sleepy' | 'dirty' | 'playful';

interface CodeCommand {
  id: string;
  type: 'FEED' | 'CLEAN' | 'PLAY' | 'SLEEP' | 'REPEAT_2X' | 'IF_HUNGRY';
  label: string;
  icon: string;
  color: string;
}

const AVAILABLE_BLOCKS: CodeCommand[] = [
  { id: 'b-feed', type: 'FEED', label: 'Beri Makan Baterai (Feed)', icon: '⚡', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { id: 'b-clean', type: 'CLEAN', label: 'Bersihkan Debu Chip (Clean)', icon: '🧹', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { id: 'b-play', type: 'PLAY', label: 'Ajak Bermain Koding (Play)', icon: '🎮', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
  { id: 'b-sleep', type: 'SLEEP', label: 'Mode Hemat Daya (Sleep)', icon: '🌙', color: 'bg-purple-500 hover:bg-purple-600 text-white' },
  { id: 'b-rep', type: 'REPEAT_2X', label: 'Ulangi 2x (Loop)', icon: '🔄', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { id: 'b-if', type: 'IF_HUNGRY', label: 'Jika Baterai < 50% (If Condition)', icon: '❓', color: 'bg-rose-500 hover:bg-rose-600 text-white' },
];

export const CodeAPetGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [petName, setPetName] = useState('Robo-Cat');
  const [level, setLevel] = useState(1);
  const [battery, setBattery] = useState(40);
  const [cleanliness, setCleanliness] = useState(50);
  const [happiness, setHappiness] = useState(60);
  const [exp, setExp] = useState(0);
  const [petSprite, setPetSprite] = useState('🐱🤖');
  const [currentThought, setCurrentThought] = useState('Bip bop! Baterai saya tinggal sedikit...');
  const [scriptQueue, setScriptQueue] = useState<CodeCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => soundEffects.isEnabled());

  // Pet evolutionary stages
  useEffect(() => {
    if (level === 1) setPetSprite('🐱🤖');
    else if (level === 2) setPetSprite('🦊⚡');
    else if (level === 3) setPetSprite('🐲🚀');
  }, [level]);

  const addBlockToQueue = (block: CodeCommand) => {
    if (isRunning) return;
    if (scriptQueue.length >= 8) {
      return;
    }
    soundEffects.playKeypress();
    setScriptQueue((prev) => [...prev, block]);
  };

  const removeBlock = (index: number) => {
    if (isRunning) return;
    soundEffects.playKeypress();
    setScriptQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    if (isRunning) return;
    setScriptQueue([]);
  };

  // Run the programmed visual algorithm
  const runAlgorithm = async () => {
    if (scriptQueue.length === 0 || isRunning) return;
    setIsRunning(true);
    setCurrentThought('🤖 Menjalankan baris algoritma instruksi...');

    let curBat = battery;
    let curClean = cleanliness;
    let curHap = happiness;
    let gainedExp = 0;

    for (let i = 0; i < scriptQueue.length; i++) {
      const block = scriptQueue[i];
      soundEffects.playKeypress();

      if (block.type === 'FEED') {
        curBat = Math.min(100, curBat + 25);
        curHap = Math.min(100, curHap + 5);
        gainedExp += 10;
        setCurrentThought('Nyam nyam! Energi terisi +25% ⚡');
      } else if (block.type === 'CLEAN') {
        curClean = Math.min(100, curClean + 30);
        gainedExp += 10;
        setCurrentThought('Wussh! Sirkuit kembali bersih berkilau ✨');
      } else if (block.type === 'PLAY') {
        curHap = Math.min(100, curHap + 25);
        curBat = Math.max(5, curBat - 10);
        gainedExp += 15;
        setCurrentThought('Yay! Menyenangkan sekali bermain algoritma! 🎮');
      } else if (block.type === 'SLEEP') {
        curBat = Math.min(100, curBat + 35);
        curHap = Math.min(100, curHap + 10);
        gainedExp += 10;
        setCurrentThought('Zzz... Mengistirahatkan memori RAM 🌙');
      } else if (block.type === 'REPEAT_2X') {
        // Boost previous action
        curBat = Math.min(100, curBat + 15);
        curHap = Math.min(100, curHap + 15);
        gainedExp += 15;
        setCurrentThought('Perulangan Loop sukses melipatgandakan efek! 🔄');
      } else if (block.type === 'IF_HUNGRY') {
        if (curBat < 60) {
          curBat = Math.min(100, curBat + 40);
          gainedExp += 20;
          setCurrentThought('Kondisi benar! Baterai rendah, darurat isi daya otomatis! 💡');
        } else {
          setCurrentThought('Kondisi salah (baterai masih cukup), lanjut ke baris berikutnya!');
        }
      }

      setBattery(curBat);
      setCleanliness(curClean);
      setHappiness(curHap);
      // Short delay between steps
      await new Promise((r) => setTimeout(r, 650));
    }

    // Evaluate success
    setIsRunning(false);
    const newExp = exp + gainedExp;
    setExp(newExp);

    if (curBat >= 80 && curClean >= 70 && curHap >= 70) {
      soundEffects.playQuizCorrect();
      setTotalPoints((prev) => prev + 40);
      setCurrentThought('🎉 Bip bop! Kondisi robot sangat prima! Algoritma kamu hebat!');

      if (newExp >= 80 && level < 3) {
        setLevel((prev) => prev + 1);
        soundEffects.playSuccessFanfare();
        showStarReward(3, `Selamat! ${petName} berevolusi ke Level ${level + 1}!`);
      }
    } else {
      soundEffects.playKeypress();
      setCurrentThought('Instruksi selesai dijalankan. Coba tambahkan perintah agar semua indikator hijau!');
    }

    if (currentUser) {
      awardStudentPoints(currentUser.id, 20, { actionCategory: 'game' });
      recordGameScore('Code-A-Pet Robot', currentUser.id, totalPoints + 20, 20);
      refreshUser();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner animate-bounce">
            {petSprite}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded text-pink-200">
                Logika Koding Visual & Robotik
              </span>
              <span className="text-xs text-white/90">Evolusi Level {level} / 3</span>
            </div>
            <h2 className="text-2xl font-black">Code-A-Pet / Robot Cilik 🐾</h2>
            <p className="text-xs text-purple-100 mt-0.5">
              Program robot peliharaan digitalmu menggunakan blok logika urutan (Sequence), perulangan (Loop), dan syarat (If-Else)!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = soundEffects.toggle();
              setSoundEnabled(next);
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl text-center border border-white/20">
            <span className="text-[10px] text-pink-200 block uppercase font-bold">Total EXP</span>
            <span className="text-lg font-black font-mono text-white">{exp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Pet Stage View */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-xs space-y-5">
          <div className="relative py-6 bg-gradient-to-b from-indigo-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:to-pink-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-7xl mb-2 drop-shadow-md select-none transform transition-transform hover:scale-110 cursor-pointer">
              {petSprite}
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              {petName}
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Lvl {level}
              </span>
            </h3>

            {/* Bubble dialog */}
            <div className="mt-3 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 shadow-sm max-w-[240px]">
              {currentThought}
            </div>
          </div>

          {/* Status Bars */}
          <div className="space-y-3 text-xs text-left">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  ⚡ Daya Baterai
                </span>
                <span className="font-mono font-bold">{battery}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${battery}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  🧹 Kebersihan Chip
                </span>
                <span className="font-mono font-bold">{cleanliness}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${cleanliness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  💖 Kebahagiaan
                </span>
                <span className="font-mono font-bold">{happiness}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${happiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Coding Workspace */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              Papan Kode Blok Visual
            </h3>
            <p className="text-xs text-slate-500">
              Klik blok perintah di bawah untuk menambahkannya ke urutan algoritma robot, lalu klik <strong>Jalankan Program (Run)</strong>.
            </p>
          </div>

          {/* Available Blocks Palette */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Palet Blok Perintah:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_BLOCKS.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => addBlockToQueue(block)}
                  disabled={isRunning || scriptQueue.length >= 8}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${block.color}`}
                >
                  <span className="text-base">{block.icon}</span>
                  <span className="truncate text-left leading-tight">{block.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Script Execution Queue */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Urutan Program ({scriptQueue.length} / 8 blok):
              </span>
              {scriptQueue.length > 0 && (
                <button
                  type="button"
                  onClick={clearQueue}
                  disabled={isRunning}
                  className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold cursor-pointer"
                >
                  Hapus Semua
                </button>
              )}
            </div>

            {scriptQueue.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                Belum ada blok instruksi. Klik blok perintah di atas untuk menyusun program!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {scriptQueue.map((cmd, idx) => (
                  <div
                    key={`${cmd.id}-${idx}`}
                    onClick={() => removeBlock(idx)}
                    title="Klik untuk menghapus blok ini"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer hover:opacity-80 transition-all ${cmd.color}`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{cmd.icon}</span>
                    <span className="text-[11px]">{cmd.label.split('(')[0]}</span>
                    <span className="text-[10px] opacity-75">✕</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={runAlgorithm}
            disabled={scriptQueue.length === 0 || isRunning}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Robot Sedang Menjalankan Kode...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Jalankan Program Algoritma (Run Code)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
