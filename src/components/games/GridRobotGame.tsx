import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  RotateCw,
  Repeat,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recordGameScore } from '../../services/storageService';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'JUMP' | 'LOOP_2X';

interface LevelConfig {
  id: number;
  title: string;
  gridSize: number; // e.g. 5 for 5x5
  startPos: [number, number]; // [row, col]
  startDir: Direction;
  targetPos: [number, number];
  stars: [number, number][];
  walls: [number, number][]; // impassable
  puddles: [number, number][]; // requires jump
  optimalSteps: number;
  hint: string;
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: Garis Lurus Pertama',
    gridSize: 5,
    startPos: [4, 2],
    startDir: 'UP',
    targetPos: [1, 2],
    stars: [[3, 2], [2, 2]],
    walls: [],
    puddles: [],
    optimalSteps: 3,
    hint: 'Gunakan perintah "Maju (1 Petak)" sebanyak 3 kali untuk mencapai portal bintang!',
  },
  {
    id: 2,
    title: 'Level 2: Belokan Koridor',
    gridSize: 5,
    startPos: [4, 0],
    startDir: 'UP',
    targetPos: [1, 4],
    stars: [[2, 0], [1, 2]],
    walls: [[2, 1], [3, 1]],
    puddles: [],
    optimalSteps: 7,
    hint: 'Maju lurus, lalu gunakan "Belok Kanan" untuk menuju koridor kanan!',
  },
  {
    id: 3,
    title: 'Level 3: Lompat Rintangan Genangan',
    gridSize: 5,
    startPos: [4, 2],
    startDir: 'UP',
    targetPos: [0, 2],
    stars: [[3, 2]],
    walls: [],
    puddles: [[2, 2]], // Must jump over puddle at [2, 2]
    optimalSteps: 4,
    hint: 'Ada genangan air di depan! Gunakan "Lompat Rintangan" untuk melompati petak basah 2 langkah ke depan.',
  },
  {
    id: 4,
    title: 'Level 4: Tembok Firewall Sekolah',
    gridSize: 5,
    startPos: [4, 1],
    startDir: 'RIGHT',
    targetPos: [0, 3],
    stars: [[4, 3], [2, 3]],
    walls: [[3, 2], [3, 3], [1, 3]],
    puddles: [],
    optimalSteps: 8,
    hint: 'Hindari tembok merah firewall! Cari jalan memutar yang aman.',
  },
  {
    id: 5,
    title: 'Level 5: Master Algoritma Robot',
    gridSize: 6,
    startPos: [5, 0],
    startDir: 'UP',
    targetPos: [0, 5],
    stars: [[3, 0], [3, 3], [1, 5]],
    walls: [[4, 2], [3, 2], [2, 2], [2, 4]],
    puddles: [[1, 3]],
    optimalSteps: 11,
    hint: 'Kombinasikan Maju, Belokan, dan Lompat untuk mengumpulkan seluruh bintang baterai!',
  },
];

export const GridRobotGame: React.FC = () => {
  const { currentUser } = useAuth();
  const [levelIdx, setLevelIdx] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([4, 2]);
  const [robotDir, setRobotDir] = useState<Direction>('UP');
  const [collectedStars, setCollectedStars] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCommandIdx, setActiveCommandIdx] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'CRASH'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showLevelSuccessModal, setShowLevelSuccessModal] = useState(false);
  const [showAllCompletedModal, setShowAllCompletedModal] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const currentLevel = LEVELS[levelIdx % LEVELS.length];

  // Initialize level
  useEffect(() => {
    resetLevel();
  }, [levelIdx]);

  const resetLevel = () => {
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setCollectedStars([]);
    setCommands([]);
    setIsRunning(false);
    setActiveCommandIdx(null);
    setGameStatus('IDLE');
    setStatusMessage('');
    setShowHint(false);
  };

  const handleAddCommand = (cmd: CommandType) => {
    if (isRunning || gameStatus === 'SUCCESS') return;
    if (commands.length >= 18) return;
    setCommands((prev) => [...prev, cmd]);
  };

  const handleRemoveCommand = (idx: number) => {
    if (isRunning) return;
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearCommands = () => {
    if (isRunning) return;
    setCommands([]);
  };

  // Helper direction turners
  const turnLeft = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'LEFT';
      case 'LEFT': return 'DOWN';
      case 'DOWN': return 'RIGHT';
      case 'RIGHT': return 'UP';
    }
  };

  const turnRight = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'RIGHT';
      case 'RIGHT': return 'DOWN';
      case 'DOWN': return 'LEFT';
      case 'LEFT': return 'UP';
    }
  };

  const getForwardDelta = (dir: Direction): [number, number] => {
    switch (dir) {
      case 'UP': return [-1, 0];
      case 'RIGHT': return [0, 1];
      case 'DOWN': return [1, 0];
      case 'LEFT': return [0, -1];
    }
  };

  // Run the algorithm step by step
  const handleRunProgram = async () => {
    if (isRunning || commands.length === 0) return;

    setIsRunning(true);
    setGameStatus('RUNNING');
    setStatusMessage('Robot sedang mengeksekusi instruksi koding...');

    // Expand commands for LOOP_2X if needed
    const executionList: CommandType[] = [];
    for (const cmd of commands) {
      if (cmd === 'LOOP_2X') {
        // Repeat previous command or forward
        const prev = executionList[executionList.length - 1] || 'FORWARD';
        executionList.push(prev);
      } else {
        executionList.push(cmd);
      }
    }

    let currentPos: [number, number] = [...currentLevel.startPos];
    let currentDir: Direction = currentLevel.startDir;
    let localStars: [number, number][] = [];

    // Reset visual state before run
    setRobotPos(currentPos);
    setRobotDir(currentDir);
    setCollectedStars([]);

    for (let i = 0; i < executionList.length; i++) {
      setActiveCommandIdx(i);
      const cmd = executionList[i];

      // Delay for step animation
      await new Promise((r) => setTimeout(r, 450));

      if (cmd === 'TURN_LEFT') {
        currentDir = turnLeft(currentDir);
        setRobotDir(currentDir);
      } else if (cmd === 'TURN_RIGHT') {
        currentDir = turnRight(currentDir);
        setRobotDir(currentDir);
      } else if (cmd === 'FORWARD' || cmd === 'JUMP') {
        const stepCount = cmd === 'JUMP' ? 2 : 1;
        const [dr, dc] = getForwardDelta(currentDir);
        const nextRow = currentPos[0] + dr * stepCount;
        const nextCol = currentPos[1] + dc * stepCount;

        // Check boundary
        if (
          nextRow < 0 ||
          nextRow >= currentLevel.gridSize ||
          nextCol < 0 ||
          nextCol >= currentLevel.gridSize
        ) {
          setGameStatus('CRASH');
          setStatusMessage('Oops! Robot keluar jalur grid arena!');
          setIsRunning(false);
          setActiveCommandIdx(null);
          return;
        }

        // Check walls
        const hitWall = currentLevel.walls.some(([r, c]) => r === nextRow && c === nextCol);
        if (hitWall) {
          setGameStatus('CRASH');
          setStatusMessage('Brak! Robot menabrak tembok firewall!');
          setIsRunning(false);
          setActiveCommandIdx(null);
          return;
        }

        // Check puddle if not jumping
        if (cmd === 'FORWARD') {
          const hitPuddle = currentLevel.puddles.some(([r, c]) => r === nextRow && c === nextCol);
          if (hitPuddle) {
            setGameStatus('CRASH');
            setStatusMessage('Robot mogok terkena genangan air! Gunakan perintah "Lompat" untuk melewatinya.');
            setIsRunning(false);
            setActiveCommandIdx(null);
            return;
          }
        }

        currentPos = [nextRow, nextCol];
        setRobotPos(currentPos);

        // Check star collection
        const foundStar = currentLevel.stars.find(([r, c]) => r === nextRow && c === nextCol);
        if (foundStar && !localStars.some(([r, c]) => r === nextRow && c === nextCol)) {
          localStars = [...localStars, foundStar];
          setCollectedStars(localStars);
        }
      }
    }

    setActiveCommandIdx(null);
    setIsRunning(false);

    // Check goal condition
    if (
      currentPos[0] === currentLevel.targetPos[0] &&
      currentPos[1] === currentLevel.targetPos[1]
    ) {
      setGameStatus('SUCCESS');
      const bonusStars = localStars.length * 10;
      const earned = 30 + bonusStars;
      setScore((prev) => prev + earned);
      setStatusMessage(`Misi Berhasil! Robot tiba di portal telepor! (+${earned} Poin)`);
      if (!completedLevels.includes(currentLevel.id)) {
        setCompletedLevels((prev) => [...prev, currentLevel.id]);
      }
      setTimeout(() => setShowLevelSuccessModal(true), 600);
    } else {
      setGameStatus('CRASH');
      setStatusMessage('Robot berhenti, tetapi belum mencapai portal bintang tujuan. Coba perbaiki urutan blokmu!');
    }
  };

  const handleNextLevel = () => {
    setShowLevelSuccessModal(false);
    if (levelIdx + 1 >= LEVELS.length) {
      if (currentUser?.id) {
        recordGameScore('Grid Robot Navigator', currentUser.id, score + 40, 50);
      }
      setShowAllCompletedModal(true);
    } else {
      setLevelIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-linear-to-r from-cyan-700 via-blue-700 to-indigo-800 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Grid Robot Navigator</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400 text-cyan-950 uppercase tracking-wider">
                Logika Koding Blok
              </span>
            </div>
            <p className="text-xs text-cyan-100 mt-0.5">
              Susun barisan kartu perintah algoritma untuk memandu robot sampai ke portal tujuan!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-cyan-200 block uppercase font-bold tracking-wider">Skor Koding</span>
            <span className="text-lg font-black font-mono text-amber-300">{score} Poin</span>
          </div>
          <div className="bg-cyan-500/20 px-3 py-2 rounded-xl border border-cyan-400/40 text-center">
            <span className="text-[10px] text-cyan-200 block font-bold">Level</span>
            <span className="text-sm font-black text-white">{levelIdx + 1}/{LEVELS.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Grid Arena */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                {currentLevel.title}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Bintang Terkumpul: {collectedStars.length} / {currentLevel.stars.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Tutup Petunjuk' : 'Petunjuk Jalur'}</span>
            </button>
          </div>

          {showHint && (
            <div className="w-full p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200">
              💡 <strong>Tips Pembina:</strong> {currentLevel.hint}
            </div>
          )}

          {/* Grid Board */}
          <div
            className="grid gap-1.5 p-3 bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-xl"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: currentLevel.gridSize }).map((_, r) =>
              Array.from({ length: currentLevel.gridSize }).map((_, c) => {
                const isRobot = robotPos[0] === r && robotPos[1] === c;
                const isTarget = currentLevel.targetPos[0] === r && currentLevel.targetPos[1] === c;
                const isWall = currentLevel.walls.some(([wr, wc]) => wr === r && wc === c);
                const isPuddle = currentLevel.puddles.some(([pr, pc]) => pr === r && pc === c);
                const hasStar =
                  currentLevel.stars.some(([sr, sc]) => sr === r && sc === c) &&
                  !collectedStars.some(([sr, sc]) => sr === r && sc === c);

                let cellBg = 'bg-slate-900 border-slate-800';
                if (isWall) cellBg = 'bg-rose-950/80 border-rose-800/80';
                if (isPuddle) cellBg = 'bg-sky-950/80 border-sky-800/80';
                if (isTarget) cellBg = 'bg-indigo-950/80 border-indigo-700';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center relative transition-all duration-300 ${cellBg}`}
                  >
                    {isWall && <span className="text-xl select-none">🧱</span>}
                    {isPuddle && <span className="text-xl select-none">💧</span>}
                    {hasStar && <span className="text-xl select-none animate-pulse">⭐</span>}
                    {isTarget && !isRobot && (
                      <span className="text-2xl select-none animate-bounce">🌀</span>
                    )}

                    {isRobot && (
                      <div
                        className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/50 transition-transform duration-300"
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
                        <Bot className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in ${
                gameStatus === 'SUCCESS'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : gameStatus === 'CRASH'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  : 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {gameStatus === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {gameStatus === 'CRASH' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{statusMessage}</span>
              </div>

              {gameStatus === 'SUCCESS' && (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Level Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Command Block Palette & Execution Sequence */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Pilih Kartu Perintah (Klik untuk Tambah):
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAddCommand('FORWARD')}
                disabled={isRunning}
                className="p-2.5 rounded-xl border border-cyan-300 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200 font-bold text-xs flex items-center gap-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 cursor-pointer"
              >
                <ArrowUp className="w-4 h-4 text-cyan-600" />
                <span>Maju (1 Petak)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddCommand('TURN_LEFT')}
                disabled={isRunning}
                className="p-2.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-bold text-xs flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Belok Kiri ↺</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddCommand('TURN_RIGHT')}
                disabled={isRunning}
                className="p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 font-bold text-xs flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-indigo-600" />
                <span>Belok Kanan ↻</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddCommand('JUMP')}
                disabled={isRunning}
                className="p-2.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Lompat (2 Petak)</span>
              </button>
            </div>
          </div>

          {/* Command Stack Queue */}
          <div className="space-y-2 flex-1 min-h-[160px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Urutan Algoritma ({commands.length} Blok)
              </span>
              <button
                type="button"
                onClick={handleClearCommands}
                disabled={isRunning || commands.length === 0}
                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3 h-3" />
                <span>Kosongkan</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {commands.length === 0 ? (
                <div className="w-full text-center py-6 text-xs text-slate-400 italic">
                  Belum ada kartu perintah. Klik tombol perintah di atas untuk menyusun koding robot!
                </div>
              ) : (
                commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeCommandIdx === idx
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105 shadow-md'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>
                      {cmd === 'FORWARD' && 'Maju'}
                      {cmd === 'TURN_LEFT' && 'Kiri ↺'}
                      {cmd === 'TURN_RIGHT' && 'Kanan ↻'}
                      {cmd === 'JUMP' && 'Lompat 🚀'}
                    </span>
                    {!isRunning && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCommand(idx)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Run Program Button */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleRunProgram}
                disabled={isRunning || commands.length === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Robot Bergerak...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Jalankan Program Robot 🚀</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetLevel}
                disabled={isRunning}
                className="px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer"
                title="Atur Ulang Robot"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Level Selesai */}
      {showLevelSuccessModal && !showAllCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-cyan-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Navigasi Robot Berhasil!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Robot sukses melompati rintangan dan tiba di portal tujuan sesuai susunan instruksimu!
              </p>
            </div>

            {/* Stars & Points Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bintang Diambil</span>
                <span className="text-lg font-black text-amber-500 font-mono mt-1 block">
                  ⭐ {collectedStars.length}/{currentLevel.stars.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Poin</span>
                <span className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">
                  {score} pt
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
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{levelIdx < LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Tamat!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tamat Semua Level */}
      {showAllCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-cyan-500 via-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                Gelar Master Navigator Robot
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Semua 5 Level Selesai!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Luar biasa! Kamu telah menuntaskan seluruh tantangan algoritma, perulangan, dan lompat rintangan Grid Robot!
              </p>
            </div>

            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/50 rounded-2xl border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200 space-y-1">
              <span className="font-extrabold block">Skor Akhir: {score} Poin (+50 Bonus Poin)</span>
              <p className="text-[11px] opacity-80">Terus asah logika berpikir komputasimu!</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAllCompletedModal(false);
                setLevelIdx(0);
                resetLevel();
              }}
              className="w-full py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
