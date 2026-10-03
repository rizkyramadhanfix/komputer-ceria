import React, { useState, useEffect } from 'react';
import {
  Bot,
  Play,
  RotateCcw,
  Trophy,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Repeat,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGamificationConfig, updateUser } from '../../services/storageService';

type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT_3_FORWARD';

interface MazeLevel {
  id: number;
  title: string;
  gridSize: number;
  start: [number, number];
  startDir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
  target: [number, number];
  obstacles: Array<[number, number]>;
  chips: Array<[number, number]>;
  maxCommands: number;
  hint: string;
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    title: 'Tingkat 1: Navigasi Dasar Server',
    gridSize: 5,
    start: [4, 0],
    startDir: 'UP',
    target: [0, 4],
    obstacles: [[2, 1], [2, 2], [2, 3], [3, 3]],
    chips: [[1, 0], [0, 2]],
    maxCommands: 10,
    hint: 'Maju lurus ke atas, ambil chip memori, lalu belok kanan menuju Server Target.',
  },
  {
    id: 2,
    title: 'Tingkat 2: Labirin Firewall Berliku',
    gridSize: 6,
    start: [5, 5],
    startDir: 'LEFT',
    target: [0, 0],
    obstacles: [[1, 1], [1, 2], [1, 3], [1, 4], [3, 1], [3, 2], [3, 3], [3, 4], [4, 1], [4, 4]],
    chips: [[5, 2], [2, 4], [0, 3]],
    maxCommands: 14,
    hint: 'Gunakan belokan berbentuk huruf S (zig-zag) untuk melewati dinding firewall.',
  },
  {
    id: 3,
    title: 'Tingkat 3: Ruang Mainframe Kompleks & Perulangan',
    gridSize: 6,
    start: [0, 0],
    startDir: 'RIGHT',
    target: [5, 0],
    obstacles: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
    chips: [[0, 5], [2, 5], [2, 0], [4, 0], [4, 5]],
    maxCommands: 16,
    hint: 'Manfaatkan perintah Loop (Maju 3x) untuk menghemat slot instruksi!',
  },
];

export const RobotMazeGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [robotDir, setRobotDir] = useState<'UP' | 'RIGHT' | 'DOWN' | 'LEFT'>('RIGHT');
  const [collectedChips, setCollectedChips] = useState<Array<[number, number]>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCommandIdx, setActiveCommandIdx] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [failReason, setFailReason] = useState<string>('');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const currentLevel = MAZE_LEVELS[currentLevelIdx];

  const resetLevel = () => {
    setRobotPos(currentLevel.start);
    setRobotDir(currentLevel.startDir);
    setCollectedChips([]);
    setIsRunning(false);
    setActiveCommandIdx(null);
    setGameResult('idle');
    setFailReason('');
    setShowLevelVictory(false);
  };

  useEffect(() => {
    resetLevel();
    setCommands([]);
  }, [currentLevelIdx]);

  const addCommand = (cmd: CommandType) => {
    if (commands.length >= currentLevel.maxCommands || isRunning || showLevelVictory) return;
    setCommands((prev) => [...prev, cmd]);
  };

  const removeCommand = (idx: number) => {
    if (isRunning || showLevelVictory) return;
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearCommands = () => {
    if (isRunning || showLevelVictory) return;
    setCommands([]);
  };

  const runCode = async () => {
    if (commands.length === 0 || isRunning || showLevelVictory) return;
    setIsRunning(true);
    setGameResult('idle');
    setRobotPos(currentLevel.start);
    setRobotDir(currentLevel.startDir);
    setCollectedChips([]);

    let curPos = [...currentLevel.start] as [number, number];
    let curDir = currentLevel.startDir;
    let chips: Array<[number, number]> = [];

    const dirs: Record<'UP' | 'RIGHT' | 'DOWN' | 'LEFT', [number, number]> = {
      UP: [-1, 0],
      RIGHT: [0, 1],
      DOWN: [1, 0],
      LEFT: [0, -1],
    };

    const turnClockwise = (d: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' => {
      const map: Record<string, 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'> = { UP: 'RIGHT', RIGHT: 'DOWN', DOWN: 'LEFT', LEFT: 'UP' };
      return map[d];
    };

    const turnCounterClockwise = (d: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' => {
      const map: Record<string, 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'> = { UP: 'LEFT', LEFT: 'DOWN', DOWN: 'RIGHT', RIGHT: 'UP' };
      return map[d];
    };

    // Flatten repeat commands if any
    const expandedCommands: { cmd: CommandType; sourceIdx: number }[] = [];
    commands.forEach((c, idx) => {
      if (c === 'REPEAT_3_FORWARD') {
        expandedCommands.push({ cmd: 'FORWARD', sourceIdx: idx });
        expandedCommands.push({ cmd: 'FORWARD', sourceIdx: idx });
        expandedCommands.push({ cmd: 'FORWARD', sourceIdx: idx });
      } else {
        expandedCommands.push({ cmd: c, sourceIdx: idx });
      }
    });

    for (let step = 0; step < expandedCommands.length; step++) {
      const { cmd, sourceIdx } = expandedCommands[step];
      setActiveCommandIdx(sourceIdx);
      await new Promise((r) => setTimeout(r, 400));

      if (cmd === 'TURN_LEFT') {
        curDir = turnCounterClockwise(curDir);
        setRobotDir(curDir);
      } else if (cmd === 'TURN_RIGHT') {
        curDir = turnClockwise(curDir);
        setRobotDir(curDir);
      } else if (cmd === 'FORWARD') {
        const delta = dirs[curDir];
        const nextR = curPos[0] + delta[0];
        const nextC = curPos[1] + delta[1];

        // Bounds Check
        if (nextR < 0 || nextR >= currentLevel.gridSize || nextC < 0 || nextC >= currentLevel.gridSize) {
          setFailReason('Robot menabrak dinding batas server!');
          setGameResult('failed');
          setIsRunning(false);
          setActiveCommandIdx(null);
          return;
        }

        // Obstacle Check
        const isHitObstacle = currentLevel.obstacles.some(([or, oc]) => or === nextR && oc === nextC);
        if (isHitObstacle) {
          setFailReason('Robot menabrak blok rintangan firewall!');
          setGameResult('failed');
          setIsRunning(false);
          setActiveCommandIdx(null);
          return;
        }

        curPos = [nextR, nextC];
        setRobotPos(curPos);

        // Chip check
        const chipHit = currentLevel.chips.find(([cr, cc]) => cr === nextR && cc === nextC);
        if (chipHit && !chips.some(([cr, cc]) => cr === chipHit[0] && cc === chipHit[1])) {
          chips = [...chips, chipHit];
          setCollectedChips([...chips]);
        }
      }
    }

    setIsRunning(false);
    setActiveCommandIdx(null);

    // Final evaluation
    const isAtTarget = curPos[0] === currentLevel.target[0] && curPos[1] === currentLevel.target[1];
    if (isAtTarget) {
      setGameResult('success');
      const earned = 40 + chips.length * 10;
      if (!completedLevels.includes(currentLevel.id)) {
        setCompletedLevels((prev) => [...prev, currentLevel.id]);
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
            `Level ${currentLevel.id} Selesai! Algoritma robot berhasil mencapai Mainframe (+${earned} Poin)!`,
            'Bintang Algoritma Runner!'
          );
        }
      }
      setTimeout(() => setShowLevelVictory(true), 400);
    } else {
      setFailReason('Robot belum mencapai Server Target. Sesuaikan rangkaian kode algoritma Anda.');
      setGameResult('failed');
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < MAZE_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      setShowGrandVictory(true);
    }
  };

  const handleSelectLevel = (idx: number) => {
    setCurrentLevelIdx(idx);
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const handleRestartFromBeginning = () => {
    setCurrentLevelIdx(0);
    setCompletedLevels([]);
    setShowGrandVictory(false);
    resetLevel();
    setCommands([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Algoritma Maze Runner</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Level {currentLevel.id} dari {MAZE_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rancang instruksi sekuensial dan algoritma untuk memandu robot melintasi server.
            </p>
          </div>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {MAZE_LEVELS.map((lvl, idx) => {
            const isDone = completedLevels.includes(lvl.id);
            const isCurrent = currentLevelIdx === idx;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(idx)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30'
                    : isDone
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                <span>Lvl {lvl.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid & Command Deck Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Maze Playfield (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-200">{currentLevel.title}</span>
            <span>Chip Terkumpul: <strong className="text-amber-400">{collectedChips.length}/{currentLevel.chips.length}</strong></span>
          </div>

          <div
            className="p-3 bg-slate-950 border-2 border-emerald-500/30 rounded-2xl shadow-inner grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: currentLevel.gridSize }).map((_, r) =>
              Array.from({ length: currentLevel.gridSize }).map((_, c) => {
                const isStart = currentLevel.start[0] === r && currentLevel.start[1] === c;
                const isTarget = currentLevel.target[0] === r && currentLevel.target[1] === c;
                const isObstacle = currentLevel.obstacles.some(([or, oc]) => or === r && oc === c);
                const isChip = currentLevel.chips.some(([cr, cc]) => cr === r && cc === c);
                const hasChipCollected = collectedChips.some(([cr, cc]) => cr === r && cc === c);
                const isRobotHere = robotPos[0] === r && robotPos[1] === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-xl flex items-center justify-center relative transition-all duration-300 border text-base ${
                      isObstacle
                        ? 'bg-rose-950/80 border-rose-800 text-rose-400 shadow-inner'
                        : isTarget
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-md animate-pulse'
                        : isStart
                        ? 'bg-sky-950/40 border-sky-800 text-sky-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isObstacle && <span className="text-xs font-black">🧱</span>}
                    {isTarget && !isRobotHere && <span className="text-sm font-black">🏁</span>}
                    {isChip && !hasChipCollected && !isRobotHere && (
                      <span className="text-sm animate-bounce" title="Chip Memori">+💾</span>
                    )}

                    {isRobotHere && (
                      <div
                        className="text-2xl transition-transform duration-300 z-10 filter drop-shadow-md"
                        style={{
                          transform:
                            robotDir === 'UP'
                              ? 'rotate(0deg)'
                              : robotDir === 'RIGHT'
                              ? 'rotate(90deg)'
                              : robotDir === 'DOWN'
                              ? 'rotate(180deg)'
                              : 'rotate(270deg)',
                        }}
                      >
                        🤖
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Petunjuk Logika: </strong>
              <span>{currentLevel.hint}</span>
            </div>
          </div>
        </div>

        {/* Right: Command Code Deck (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="font-bold text-slate-300">Program Algoritma</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">
                  {commands.length}/{currentLevel.maxCommands}
                </span>
                <button
                  onClick={clearCommands}
                  disabled={isRunning || commands.length === 0}
                  className="text-slate-400 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                  title="Hapus Semua"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sequence Slot Display */}
            <div className="min-h-[140px] max-h-[180px] overflow-y-auto space-y-1.5 p-1">
              {commands.map((cmd, idx) => (
                <div
                  key={idx}
                  onClick={() => removeCommand(idx)}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeCommandIdx === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-md scale-102 ring-2 ring-emerald-300'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-rose-500'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 mr-2">#{idx + 1}</span>
                  <span className="flex-1">
                    {cmd === 'FORWARD'
                      ? 'Maju 1 Langkah'
                      : cmd === 'TURN_LEFT'
                      ? 'Belok Kiri 90°'
                      : cmd === 'TURN_RIGHT'
                      ? 'Belok Kanan 90°'
                      : 'Loop Maju 3x'}
                  </span>
                  <span className="text-slate-500 text-[10px] hover:text-rose-400">✕</span>
                </div>
              ))}

              {commands.length === 0 && (
                <div className="w-full py-8 text-center text-xs text-slate-500">
                  Pilih blok instruksi di bawah untuk menyusun urutan jalan robot.
                </div>
              )}
            </div>

            {/* Command Palette Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pilihan Perintah:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('FORWARD')}
                  className="py-2 px-3 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Maju 1x</span>
                </button>

                <button
                  type="button"
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('TURN_LEFT')}
                  className="py-2 px-3 rounded-xl bg-sky-950/70 border border-sky-700/80 text-sky-300 font-bold text-xs hover:bg-sky-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Belok Kiri</span>
                </button>

                <button
                  type="button"
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('TURN_RIGHT')}
                  className="py-2 px-3 rounded-xl bg-indigo-950/70 border border-indigo-700/80 text-indigo-300 font-bold text-xs hover:bg-indigo-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Belok Kanan</span>
                </button>

                <button
                  type="button"
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('REPEAT_3_FORWARD')}
                  className="py-2 px-3 rounded-xl bg-purple-950/70 border border-purple-700/80 text-purple-300 font-bold text-xs hover:bg-purple-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Loop Maju 3x</span>
                </button>
              </div>
            </div>

            {/* Run Code Execution Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isRunning || commands.length === 0}
                onClick={runCode}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-95'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Robot Sedang Berjalan...' : 'Jalankan Kode Algoritma'}</span>
              </button>
            </div>
          </div>

          {/* Outcome Status Banner */}
          {gameResult === 'failed' && (
            <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
              <AlertCircle className="w-7 h-7 text-rose-400 mx-auto" />
              <h4 className="text-sm font-black text-rose-300">Algoritma Kurang Tepat</h4>
              <p className="text-xs text-slate-300">{failReason}</p>
              <button
                type="button"
                onClick={resetLevel}
                className="py-1.5 px-3 bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 hover:bg-slate-700 cursor-pointer"
              >
                Coba Ulang Rute
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Level Victory Modal */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Mainframe Server Tercapai!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Algoritma kodingmu sukses memandu robot mengumpulkan chip dan mencapai portal target!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Chip Diambil</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {collectedChips.length}/{currentLevel.chips.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonus Poin</span>
                <span className="text-xl font-black font-mono text-amber-500">
                  +{40 + collectedChips.length * 10} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={resetLevel}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < MAZE_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Master Maze!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Gelar Computational Thinking
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Master Algoritma Maze Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menaklukkan semua rintangan firewall, pengumpulan chip memori, dan loop perulangan robot!
              </p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
