import React, { useState, useEffect } from 'react';
import {
  Bot,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Repeat,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Trash2,
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT_3_FORWARD';

interface LevelConfig {
  id: number;
  title: string;
  gridSize: number; // e.g. 5x5
  start: [number, number];
  startDir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
  target: [number, number];
  obstacles: Array<[number, number]>;
  chips: Array<[number, number]>;
  maxCommands: number;
  hint: string;
}

const MAZE_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: Langkah Pertama Robot',
    gridSize: 5,
    start: [0, 0],
    startDir: 'RIGHT',
    target: [0, 4],
    obstacles: [],
    chips: [[0, 2]],
    maxCommands: 6,
    hint: 'Gunakan perintah Maju untuk memandu robot mengambil chip dan mencapai Server Finis!',
  },
  {
    id: 2,
    title: 'Level 2: Belok Menghindari Rintangan Firewall',
    gridSize: 5,
    start: [0, 0],
    startDir: 'RIGHT',
    target: [4, 4],
    obstacles: [[0, 3], [1, 3], [2, 3], [3, 1]],
    chips: [[0, 2], [3, 4]],
    maxCommands: 10,
    hint: 'Belok Kanan atau Kiri untuk mengitari rintangan merah.',
  },
  {
    id: 3,
    title: 'Level 3: Labirin Server Kompleks',
    gridSize: 6,
    start: [0, 0],
    startDir: 'DOWN',
    target: [5, 5],
    obstacles: [[1, 1], [1, 2], [1, 3], [3, 2], [3, 3], [3, 4], [4, 1]],
    chips: [[2, 0], [2, 4], [5, 2]],
    maxCommands: 14,
    hint: 'Gunakan kombinasi Maju dan Belok terstruktur untuk navigasi labirin.',
  },
  {
    id: 4,
    title: 'Level 4: Master Algoritma & Perulangan Loop',
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
  const { showSuccess, showError, showInfo } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [robotDir, setRobotDir] = useState<'UP' | 'RIGHT' | 'DOWN' | 'LEFT'>('RIGHT');
  const [collectedChips, setCollectedChips] = useState<Array<[number, number]>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCommandIdx, setActiveCommandIdx] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [failReason, setFailReason] = useState<string>('');

  const currentLevel = MAZE_LEVELS[currentLevelIdx];

  const resetLevel = () => {
    setRobotPos(currentLevel.start);
    setRobotDir(currentLevel.startDir);
    setCollectedChips([]);
    setIsRunning(false);
    setActiveCommandIdx(null);
    setGameResult('idle');
    setFailReason('');
  };

  useEffect(() => {
    resetLevel();
    setCommands([]);
  }, [currentLevelIdx]);

  const addCommand = (cmd: CommandType) => {
    if (commands.length >= currentLevel.maxCommands || isRunning) return;
    setCommands((prev) => [...prev, cmd]);
  };

  const removeCommand = (idx: number) => {
    if (isRunning) return;
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearCommands = () => {
    if (isRunning) return;
    setCommands([]);
  };

  const runCode = async () => {
    if (commands.length === 0 || isRunning) return;
    setIsRunning(true);
    resetLevel();

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
      await new Promise((r) => setTimeout(r, 450));

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
          setCollectedChips(chips);
        }
      }
    }

    setIsRunning(false);
    setActiveCommandIdx(null);

    // Final evaluation
    const isAtTarget = curPos[0] === currentLevel.target[0] && curPos[1] === currentLevel.target[1];
    if (isAtTarget) {
      setGameResult('success');
      const earned = 30 + collectedChips.length * 10;
      if (currentUser) {
        const ratio = getGamificationConfig().pointsToStarRatio || 10;
        const updatedTotal = (currentUser.totalPoints || 0) + earned;
        updateUser(currentUser.id, {
          totalPoints: updatedTotal,
          totalStars: Math.floor(updatedTotal / ratio),
        });
        refreshUser();
      }
      showSuccess(`Level Selesai! Algoritma Anda sukses memandu robot ke tujuan (+${earned} Poin).`);
    } else {
      setFailReason('Robot belum mencapai Server Target. Sesuaikan rangkaian kode algoritma Anda.');
      setGameResult('failed');
    }
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
                Logika Robot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rancang instruksi sekuensial dan algoritma untuk memandu robot melintasi server.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {MAZE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentLevelIdx === idx
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Lvl {lvl.id}
            </button>
          ))}
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
                const isChipCollected = collectedChips.some(([cr, cc]) => cr === r && cc === c);
                const isRobotHere = robotPos[0] === r && robotPos[1] === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-xl border flex items-center justify-center relative transition-all duration-300 ${
                      isObstacle
                        ? 'bg-rose-950/80 border-rose-800 text-rose-400 shadow-inner'
                        : isTarget
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900/90 border-slate-800/80 text-slate-600'
                    }`}
                  >
                    {/* Obstacle Icon */}
                    {isObstacle && <span className="text-xl">🔥</span>}

                    {/* Target Server Icon */}
                    {isTarget && !isRobotHere && (
                      <div className="flex flex-col items-center animate-pulse">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        <span className="text-[8px] font-black text-indigo-300 mt-0.5">EXIT</span>
                      </div>
                    )}

                    {/* Chip Collectible */}
                    {isChip && !isChipCollected && !isRobotHere && (
                      <div className="text-lg animate-bounce">💎</div>
                    )}

                    {/* Robot Position */}
                    {isRobotHere && (
                      <div
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform transition-transform duration-300"
                        style={{
                          transform: `rotate(${
                            robotDir === 'UP' ? 0 : robotDir === 'RIGHT' ? 90 : robotDir === 'DOWN' ? 180 : 270
                          }deg)`,
                        }}
                      >
                        <Bot className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{currentLevel.hint}</span>
          </div>
        </div>

        {/* Right: Command Block Programming Deck (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Blok Algoritma Robot ({commands.length}/{currentLevel.maxCommands})
              </span>
              <button
                disabled={isRunning || commands.length === 0}
                onClick={clearCommands}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3 h-3" />
                Reset Blok
              </button>
            </div>

            {/* Instruction Sequence List */}
            <div className="min-h-36 p-2 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-wrap gap-1.5 content-start max-h-48 overflow-y-auto">
              {commands.map((cmd, idx) => (
                <div
                  key={idx}
                  onClick={() => removeCommand(idx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer select-none transition-all ${
                    activeCommandIdx === idx
                      ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-400/30'
                      : cmd === 'FORWARD'
                      ? 'bg-emerald-600 text-white'
                      : cmd === 'TURN_LEFT'
                      ? 'bg-sky-600 text-white'
                      : cmd === 'TURN_RIGHT'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                  title="Klik untuk hapus blok"
                >
                  <span className="text-[9px] opacity-70 font-mono">#{idx + 1}</span>
                  <span>
                    {cmd === 'FORWARD'
                      ? 'Maju 1'
                      : cmd === 'TURN_LEFT'
                      ? 'Belok Kiri'
                      : cmd === 'TURN_RIGHT'
                      ? 'Belok Kanan'
                      : 'Loop Maju 3x'}
                  </span>
                </div>
              ))}

              {commands.length === 0 && (
                <div className="w-full py-8 text-center text-xs text-slate-500">
                  Pilih blok instruksi di bawah untuk menyusun urutan jalan robot.
                </div>
              )}
            </div>

            {/* Command Palette Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pilihan Perintah:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('FORWARD')}
                  className="py-2 px-3 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Maju (Forward)</span>
                </button>

                <button
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('TURN_LEFT')}
                  className="py-2 px-3 rounded-xl bg-sky-950/70 border border-sky-700/80 text-sky-300 font-bold text-xs hover:bg-sky-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Belok Kiri</span>
                </button>

                <button
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  onClick={() => addCommand('TURN_RIGHT')}
                  className="py-2 px-3 rounded-xl bg-indigo-950/70 border border-indigo-700/80 text-indigo-300 font-bold text-xs hover:bg-indigo-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Belok Kanan</span>
                </button>

                <button
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
          {gameResult === 'success' && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-black text-emerald-300">Level Berhasil Diselesaikan!</h4>
              <p className="text-xs text-slate-300">Robot sukses menavigasi rute dengan algoritma tepat.</p>
              {currentLevelIdx < MAZE_LEVELS.length - 1 ? (
                <button
                  onClick={() => setCurrentLevelIdx((i) => i + 1)}
                  className="py-2 px-4 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-400 transition-colors"
                >
                  Lanjut ke Level Berikutnya →
                </button>
              ) : (
                <span className="text-xs text-amber-300 font-bold block">🎉 Selamat! Anda menuntaskan seluruh tantangan Algoritma!</span>
              )}
            </div>
          )}

          {gameResult === 'failed' && (
            <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
              <AlertCircle className="w-7 h-7 text-rose-400 mx-auto" />
              <h4 className="text-sm font-black text-rose-300">Algoritma Kurang Tepat</h4>
              <p className="text-xs text-slate-300">{failReason}</p>
              <button
                onClick={resetLevel}
                className="py-1.5 px-3 bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 hover:bg-slate-700 cursor-pointer"
              >
                Coba Ulang Rute
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
