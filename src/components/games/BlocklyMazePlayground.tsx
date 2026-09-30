import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Flag,
  Play,
  Repeat,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Undo2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints } from '../../services/storageService';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type BlockAction = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT_3X';

interface LevelConfig {
  id: number;
  title: string;
  gridSize: { rows: number; cols: number };
  start: { r: number; c: number; dir: Direction };
  goal: { r: number; c: number };
  stars: { r: number; c: number }[];
  walls: { r: number; c: number }[];
  instructions: string;
  maxBlocks: number;
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: Langkah Pertama Robot Ceria',
    gridSize: { rows: 5, cols: 5 },
    start: { r: 4, c: 1, dir: 'UP' },
    goal: { r: 1, c: 1 },
    stars: [{ r: 3, c: 1 }, { r: 2, c: 1 }],
    walls: [],
    instructions: 'Susun blok "Maju 1 Langkah" untuk memandu Robot mengambil bintang dan mencapai bendera finish!',
    maxBlocks: 5,
  },
  {
    id: 2,
    title: 'Level 2: Belokan Sudut 90 Derajat',
    gridSize: { rows: 5, cols: 5 },
    start: { r: 3, c: 0, dir: 'RIGHT' },
    goal: { r: 1, c: 3 },
    stars: [{ r: 3, c: 2 }, { r: 1, c: 2 }],
    walls: [{ r: 3, c: 3 }, { r: 2, c: 1 }],
    instructions: 'Gunakan blok "Maju" dan "Belok Kiri / Kanan" untuk menghindari dinding batu dan menuju portal!',
    maxBlocks: 8,
  },
  {
    id: 3,
    title: 'Level 3: Labirin Berliku & Bintang Emas',
    gridSize: { rows: 5, cols: 5 },
    start: { r: 4, c: 0, dir: 'UP' },
    goal: { r: 0, c: 4 },
    stars: [{ r: 2, c: 0 }, { r: 2, c: 2 }, { r: 0, c: 2 }],
    walls: [{ r: 3, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 3 }, { r: 3, c: 3 }],
    instructions: 'Rencanakan algoritma berliku melintasi koridor labirin untuk mengoleksi seluruh bintang.',
    maxBlocks: 12,
  },
  {
    id: 4,
    title: 'Level 4: Perulangan Loop 3x',
    gridSize: { rows: 6, cols: 6 },
    start: { r: 5, c: 1, dir: 'UP' },
    goal: { r: 1, c: 4 },
    stars: [{ r: 4, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }],
    walls: [{ r: 4, c: 2 }, { r: 3, c: 2 }, { r: 2, c: 2 }],
    instructions: 'Manfaatkan blok "Ulangi 3x Maju" agar kodemu lebih efisien dan hemat blok algoritma!',
    maxBlocks: 8,
  },
  {
    id: 5,
    title: 'Level 5: Master Algoritma Labirin',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 6, c: 0, dir: 'UP' },
    goal: { r: 0, c: 6 },
    stars: [{ r: 4, c: 0 }, { r: 4, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 4 }, { r: 0, c: 4 }],
    walls: [
      { r: 5, c: 1 }, { r: 3, c: 1 }, { r: 1, c: 1 },
      { r: 5, c: 3 }, { r: 3, c: 3 }, { r: 1, c: 3 },
      { r: 5, c: 5 }, { r: 3, c: 5 }, { r: 1, c: 5 }
    ],
    instructions: 'Level paling sulit! Kombinasikan "Maju", "Belok", dan "Ulangi 3x" untuk melewati labirin zig-zag ini.',
    maxBlocks: 15,
  },
];

export const BlocklyMazePlayground: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  const [codeSequence, setCodeSequence] = useState<BlockAction[]>([]);
  const [robotPos, setRobotPos] = useState(currentLevel.start);
  const [collectedStars, setCollectedStars] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  // Reset to level initial state
  const resetLevel = (lvl = currentLevel) => {
    setRobotPos(lvl.start);
    setCollectedStars([]);
    setIsRunning(false);
    setActiveStepIdx(null);
    setIsWon(false);
  };

  useEffect(() => {
    resetLevel(LEVELS[currentLevelIdx]);
    setCodeSequence([]);
  }, [currentLevelIdx]);

  const handleAddBlock = (action: BlockAction) => {
    if (codeSequence.length >= currentLevel.maxBlocks) {
      showError(`Maksimal ${currentLevel.maxBlocks} blok perintah untuk level ini!`);
      return;
    }
    setCodeSequence((prev) => [...prev, action]);
  };

  const handleRemoveBlock = (idx: number) => {
    setCodeSequence((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearBlocks = () => {
    setCodeSequence([]);
    resetLevel();
  };

  // Run the sequence of commands
  const handleRunCode = async () => {
    if (codeSequence.length === 0) {
      showError('Tambahkan minimal 1 blok perintah untuk menjalankan robot!');
      return;
    }

    resetLevel();
    setIsRunning(true);

    // Expand commands (e.g. repeat 3x expands to 3 FORWARDs)
    const expandedActions: { action: BlockAction; originalIdx: number }[] = [];
    codeSequence.forEach((action, idx) => {
      if (action === 'REPEAT_3X') {
        expandedActions.push({ action: 'FORWARD', originalIdx: idx });
        expandedActions.push({ action: 'FORWARD', originalIdx: idx });
        expandedActions.push({ action: 'FORWARD', originalIdx: idx });
      } else {
        expandedActions.push({ action, originalIdx: idx });
      }
    });

    let current = { ...currentLevel.start };
    const starsCollectedIdx: number[] = [];

    for (let step = 0; step < expandedActions.length; step++) {
      const item = expandedActions[step];
      setActiveStepIdx(item.originalIdx);

      // Delay for visual animation
      await new Promise((resolve) => setTimeout(resolve, 550));

      if (item.action === 'TURN_LEFT') {
        const dirMap: Record<Direction, Direction> = {
          UP: 'LEFT',
          LEFT: 'DOWN',
          DOWN: 'RIGHT',
          RIGHT: 'UP',
        };
        current.dir = dirMap[current.dir];
      } else if (item.action === 'TURN_RIGHT') {
        const dirMap: Record<Direction, Direction> = {
          UP: 'RIGHT',
          RIGHT: 'DOWN',
          DOWN: 'LEFT',
          LEFT: 'UP',
        };
        current.dir = dirMap[current.dir];
      } else if (item.action === 'FORWARD') {
        let nr = current.r;
        let nc = current.c;
        if (current.dir === 'UP') nr -= 1;
        if (current.dir === 'DOWN') nr += 1;
        if (current.dir === 'LEFT') nc -= 1;
        if (current.dir === 'RIGHT') nc += 1;

        // Check boundaries
        if (
          nr < 0 ||
          nr >= currentLevel.gridSize.rows ||
          nc < 0 ||
          nc >= currentLevel.gridSize.cols
        ) {
          showError('Robot menabrak batas arena labirin!');
          setIsRunning(false);
          setActiveStepIdx(null);
          return;
        }

        // Check walls
        const hitWall = currentLevel.walls.some((w) => w.r === nr && w.c === nc);
        if (hitWall) {
          showError('Robot menabrak dinding batu! Atur ulang blok perintahmu.');
          setIsRunning(false);
          setActiveStepIdx(null);
          return;
        }

        current.r = nr;
        current.c = nc;
      }

      setRobotPos({ ...current });

      // Check star pickup
      currentLevel.stars.forEach((st, sIdx) => {
        if (st.r === current.r && st.c === current.c && !starsCollectedIdx.includes(sIdx)) {
          starsCollectedIdx.push(sIdx);
          setCollectedStars([...starsCollectedIdx]);
        }
      });
    }

    setActiveStepIdx(null);
    setIsRunning(false);

    // Check goal reach
    if (current.r === currentLevel.goal.r && current.c === currentLevel.goal.c) {
      setIsWon(true);
      const points = 50 + starsCollectedIdx.length * 10;
      const starsEarned = Math.max(1, Math.floor(points / 10));
      if (currentUser) {
        awardStudentPoints(currentUser.id, points);
        refreshUser();
      }
      showStarReward(
        starsEarned,
        `Hebat sekali! Level terselesaikan! Kamu mendapatkan +${points} Poin (+${starsEarned} Bintang)!`,
        'Bintang Coding Labirin!'
      );
    } else {
      showError('Robot belum mencapai portal bendera finish. Coba perbaiki susunan blokmu!');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Code2 className="w-4 h-4" />
              Taman Belajar Algoritma & Computational Thinking
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              Level {currentLevelIdx + 1} dari {LEVELS.length}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {currentLevel.title}
          </h2>
          <p className="text-xs text-slate-500">{currentLevel.instructions}</p>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentLevelIdx === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Lvl {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Maze Grid Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-5 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl space-y-4">
          <div
            className="grid gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 max-w-full"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: currentLevel.gridSize.rows }).map((_, r) =>
              Array.from({ length: currentLevel.gridSize.cols }).map((_, c) => {
                const isRobot = robotPos.r === r && robotPos.c === c;
                const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
                const isWall = currentLevel.walls.some((w) => w.r === r && w.c === c);
                const starIdx = currentLevel.stars.findIndex((s) => s.r === r && s.c === c);
                const hasStar = starIdx !== -1 && !collectedStars.includes(starIdx);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative transition-all border ${
                      isWall
                        ? 'bg-slate-800 border-slate-700 text-slate-500 shadow-inner'
                        : isGoal
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    {/* Goal Portal Flag */}
                    {isGoal && !isRobot && (
                      <div className="text-center animate-bounce">
                        <Flag className="w-6 h-6 text-emerald-400 mx-auto fill-emerald-400" />
                        <span className="text-[8px] font-mono text-emerald-300 font-bold block">
                          GOAL
                        </span>
                      </div>
                    )}

                    {/* Star Pickup */}
                    {hasStar && !isRobot && (
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                    )}

                    {/* Wall Barrier */}
                    {isWall && (
                      <span className="text-xs font-bold text-slate-500">🧱</span>
                    )}

                    {/* Robot Avatar */}
                    {isRobot && (
                      <div
                        className={`w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 z-10 transition-transform duration-300 ${
                          robotPos.dir === 'UP'
                            ? 'rotate-0'
                            : robotPos.dir === 'RIGHT'
                            ? 'rotate-90'
                            : robotPos.dir === 'DOWN'
                            ? 'rotate-180'
                            : '-rotate-90'
                        }`}
                      >
                        <Bot className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Maze Status Bar */}
          <div className="flex items-center justify-between w-full text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                Bintang Terkumpul: {collectedStars.length}/{currentLevel.stars.length}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span>Arah Robot:</span>
              <span className="font-bold text-indigo-400">{robotPos.dir}</span>
            </div>
          </div>
        </div>

        {/* Right: Block Code Toolbox & Workspace */}
        <div className="lg:col-span-6 space-y-4">
          {/* Action Blocks Toolbox */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Palet Blok Perintah (Klik untuk Menambahkan):
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isRunning}
                onClick={() => handleAddBlock('FORWARD')}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Maju 1 Langkah</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={() => handleAddBlock('TURN_LEFT')}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Belok Kiri 90°</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={() => handleAddBlock('TURN_RIGHT')}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Belok Kanan 90°</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={() => handleAddBlock('REPEAT_3X')}
                className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Repeat className="w-4 h-4" />
                <span>Ulangi Maju 3x</span>
              </button>
            </div>
          </div>

          {/* Active Workspace / Sequence List */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Susunan Blok Kode ({codeSequence.length}/{currentLevel.maxBlocks})
              </span>
              <button
                type="button"
                onClick={handleClearBlocks}
                className="text-[11px] text-rose-500 hover:underline"
              >
                Kosongkan Blok
              </button>
            </div>

            {codeSequence.length === 0 ? (
              <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                Klik tombol di atas untuk menyusun algoritma robot.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {codeSequence.map((act, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      activeStepIdx === idx
                        ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400 scale-102'
                        : act === 'FORWARD'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : act === 'REPEAT_3X'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/40 dark:bg-black/20 flex items-center justify-center font-mono text-[10px]">
                        {idx + 1}
                      </span>
                      <span>
                        {act === 'FORWARD'
                          ? 'Maju 1 Langkah'
                          : act === 'TURN_LEFT'
                          ? 'Belok Kiri 90°'
                          : act === 'TURN_RIGHT'
                          ? 'Belok Kanan 90°'
                          : 'Ulangi Maju 3x'}
                      </span>
                    </div>

                    {!isRunning && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(idx)}
                        className="text-rose-500 hover:text-rose-700 p-0.5"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Run Button */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                disabled={isRunning || codeSequence.length === 0}
                onClick={handleRunCode}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Robot Sedang Bergerak...' : 'Jalankan Kode Program'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetLevel()}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Reset Posisi Robot"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
