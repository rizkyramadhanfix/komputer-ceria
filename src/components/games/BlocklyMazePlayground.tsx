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
    instructions: 'Kombinasikan "Maju", "Belok", dan "Ulangi 3x" untuk melewati labirin zig-zag ini.',
    maxBlocks: 15,
  },
  {
    id: 6,
    title: 'Level 6: Pola Tangga Berulang (Staircase Loop)',
    gridSize: { rows: 6, cols: 6 },
    start: { r: 5, c: 0, dir: 'UP' },
    goal: { r: 1, c: 5 },
    stars: [{ r: 4, c: 0 }, { r: 3, c: 2 }, { r: 2, c: 4 }],
    walls: [{ r: 4, c: 1 }, { r: 5, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 4 }],
    instructions: 'Navigasikan robot melewati rute tangga zig-zag. Rencanakan belokan dan langkah dengan efisien!',
    maxBlocks: 14,
  },
  {
    id: 7,
    title: 'Level 7: Pulau Kristal & Koridor Ganda',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 6, c: 1, dir: 'UP' },
    goal: { r: 0, c: 5 },
    stars: [{ r: 5, c: 1 }, { r: 3, c: 1 }, { r: 3, c: 5 }, { r: 1, c: 5 }],
    walls: [
      { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 },
      { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
      { r: 3, c: 0 }, { r: 3, c: 6 }
    ],
    instructions: 'Gunakan blok perulangan dan belokan untuk melewati jembatan tengah dan mengumpulkan kristal energi!',
    maxBlocks: 16,
  },
  {
    id: 8,
    title: 'Level 8: Putaran Balik Labirin (U-Turn Maneuver)',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 6, c: 0, dir: 'UP' },
    goal: { r: 6, c: 6 },
    stars: [{ r: 1, c: 0 }, { r: 0, c: 3 }, { r: 1, c: 6 }],
    walls: [
      { r: 5, c: 2 }, { r: 4, c: 2 }, { r: 3, c: 2 }, { r: 2, c: 2 },
      { r: 5, c: 4 }, { r: 4, c: 4 }, { r: 3, c: 4 }, { r: 2, c: 4 },
      { r: 6, c: 3 }
    ],
    instructions: 'Robot harus memutar balik di ujung atas labirin berbentuk huruf U untuk mencapai portal di seberang.',
    maxBlocks: 18,
  },
  {
    id: 9,
    title: 'Level 9: Benteng Gerbang Ganda Cyber',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 6, c: 3, dir: 'UP' },
    goal: { r: 0, c: 3 },
    stars: [{ r: 4, c: 1 }, { r: 2, c: 1 }, { r: 2, c: 5 }, { r: 4, c: 5 }],
    walls: [
      { r: 5, c: 3 }, { r: 3, c: 3 }, { r: 1, c: 3 },
      { r: 3, c: 2 }, { r: 3, c: 4 }
    ],
    instructions: 'Jalan lurus terhalang benteng! Buat algoritma memutar ke koridor sayap kiri atau kanan untuk meraih bintang.',
    maxBlocks: 18,
  },
  {
    id: 10,
    title: 'Level 10: Tantangan Grandmaster Labirin Koding',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 0, dir: 'UP' },
    goal: { r: 0, c: 7 },
    stars: [{ r: 5, c: 0 }, { r: 5, c: 3 }, { r: 2, c: 3 }, { r: 2, c: 7 }, { r: 0, c: 4 }],
    walls: [
      { r: 6, c: 1 }, { r: 4, c: 1 }, { r: 3, c: 1 },
      { r: 6, c: 5 }, { r: 4, c: 5 }, { r: 3, c: 5 },
      { r: 1, c: 2 }, { r: 1, c: 4 }, { r: 1, c: 6 },
      { r: 7, c: 3 }, { r: 4, c: 3 }
    ],
    instructions: 'Tantangan puncak! Rancang algoritma master dengan kombinasi loop dan belokan akurat untuk menuntaskan seluruh labirin!',
    maxBlocks: 20,
  },
  {
    id: 11,
    title: 'Level 11: Gerbang Berantai & Koridor Labirin',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 1, dir: 'UP' },
    goal: { r: 0, c: 6 },
    stars: [{ r: 5, c: 1 }, { r: 5, c: 4 }, { r: 3, c: 4 }, { r: 3, c: 6 }, { r: 1, c: 6 }],
    walls: [
      { r: 6, c: 2 }, { r: 5, c: 2 }, { r: 4, c: 2 },
      { r: 4, c: 5 }, { r: 3, c: 5 }, { r: 2, c: 5 },
      { r: 2, c: 3 }, { r: 1, c: 3 }, { r: 0, c: 3 }
    ],
    instructions: 'Navigasikan robot melewati gerbang berantai dengan mengombinasikan blok loop dan belokan presisi!',
    maxBlocks: 22,
  },
  {
    id: 12,
    title: 'Level 12: Manuver Segitiga & Kepulauan Berlian',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 7, dir: 'LEFT' },
    goal: { r: 0, c: 0 },
    stars: [{ r: 7, c: 4 }, { r: 4, c: 4 }, { r: 4, c: 1 }, { r: 1, c: 1 }],
    walls: [
      { r: 6, c: 6 }, { r: 6, c: 5 }, { r: 5, c: 3 }, { r: 5, c: 2 },
      { r: 3, c: 5 }, { r: 3, c: 4 }, { r: 2, c: 2 }, { r: 2, c: 1 },
      { r: 7, c: 1 }, { r: 0, c: 6 }
    ],
    instructions: 'Hindari rintangan berliku berbentuk kepulauan berlian! Gunakan algoritma efisien menuju portal pojok atas.',
    maxBlocks: 22,
  },
  {
    id: 13,
    title: 'Level 13: Labirin Spiral Ganda (Double Helix)',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 0, dir: 'UP' },
    goal: { r: 4, c: 3 },
    stars: [{ r: 1, c: 0 }, { r: 0, c: 6 }, { r: 6, c: 7 }, { r: 2, c: 2 }],
    walls: [
      { r: 6, c: 1 }, { r: 5, c: 1 }, { r: 4, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 },
      { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 },
      { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 },
      { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 },
      { r: 3, c: 3 }
    ],
    instructions: 'Lintasi spiral konsentris menuju pusat inti CPU! Jangan sampai salah sudut belokan di koridor sempit.',
    maxBlocks: 24,
  },
  {
    id: 14,
    title: 'Level 14: Lintasan Matriks Super Quantum',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 3, dir: 'UP' },
    goal: { r: 0, c: 4 },
    stars: [{ r: 6, c: 1 }, { r: 4, c: 1 }, { r: 4, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 2 }],
    walls: [
      { r: 6, c: 2 }, { r: 6, c: 4 }, { r: 5, c: 3 },
      { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
      { r: 1, c: 1 }, { r: 1, c: 3 }, { r: 1, c: 5 }, { r: 0, c: 2 }
    ],
    instructions: 'Rancang algoritma bercabang melintasi gerbang logika quantum dan raih semua bintang energi!',
    maxBlocks: 24,
  },
  {
    id: 15,
    title: 'Level 15: Puncak Algoritma Infinity Cyber',
    gridSize: { rows: 8, cols: 8 },
    start: { r: 7, c: 0, dir: 'UP' },
    goal: { r: 0, c: 7 },
    stars: [{ r: 4, c: 0 }, { r: 4, c: 3 }, { r: 7, c: 5 }, { r: 2, c: 5 }, { r: 0, c: 2 }, { r: 0, c: 5 }],
    walls: [
      { r: 6, c: 1 }, { r: 5, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 },
      { r: 5, c: 4 }, { r: 4, c: 4 }, { r: 3, c: 4 },
      { r: 6, c: 6 }, { r: 5, c: 6 }, { r: 3, c: 6 }, { r: 1, c: 6 },
      { r: 1, c: 3 }, { r: 0, c: 3 }
    ],
    instructions: 'Tantangan Mahkota Algoritma! Susun blok kode terbaik untuk menyelesaikan labirin terumit dengan bintang maksimal!',
    maxBlocks: 26,
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
  const [showFinalVictory, setShowFinalVictory] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Reset to level initial state
  const resetLevel = (lvl = currentLevel) => {
    setRobotPos(lvl.start);
    setCollectedStars([]);
    setIsRunning(false);
    setActiveStepIdx(null);
    setIsWon(false);
  };

  const handleNextLevel = () => {
    setIsWon(false);
    if (currentLevelIdx < LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      setCodeSequence([]);
      resetLevel(LEVELS[nextIdx]);
    } else {
      setShowFinalVictory(true);
    }
  };

  const handleRestartFromBeginning = () => {
    setShowFinalVictory(false);
    setIsWon(false);
    setCurrentLevelIdx(0);
    setCodeSequence([]);
    setCompletedLevels([]);
    resetLevel(LEVELS[0]);
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

                const cellSizeClass = currentLevel.gridSize.cols >= 7
                  ? 'w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 text-xs'
                  : 'w-11 h-11 sm:w-14 sm:h-14 text-sm';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`${cellSizeClass} rounded-xl flex items-center justify-center relative transition-all border ${
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
                        <Flag className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400 mx-auto fill-emerald-400" />
                        <span className="text-[7px] sm:text-[8px] font-mono text-emerald-300 font-bold block">
                          GOAL
                        </span>
                      </div>
                    )}

                    {/* Star Pickup */}
                    {hasStar && !isRobot && (
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 animate-pulse" />
                    )}

                    {/* Wall Barrier */}
                    {isWall && (
                      <span className="text-xs font-bold text-slate-500">🧱</span>
                    )}

                    {/* Robot Avatar */}
                    {isRobot && (
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 z-10 transition-transform duration-300 ${
                          robotPos.dir === 'UP'
                            ? 'rotate-0'
                            : robotPos.dir === 'RIGHT'
                            ? 'rotate-90'
                            : robotPos.dir === 'DOWN'
                            ? 'rotate-180'
                            : '-rotate-90'
                        }`}
                      >
                        <Bot className="w-4 h-4 sm:w-6 sm:h-6" />
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

      {/* Modal Level Selesai & Lanjut Level */}
      {isWon && !showFinalVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-amber-400 via-amber-500 to-yellow-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Luar Biasa, Robot Tiba di Portal!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Algoritma koding yang kamu rancang sukses memandu robot melintasi rintangan labirin!
              </p>
            </div>

            {/* Stars & Points Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bintang Dikumpulkan</span>
                <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                  {Array.from({ length: Math.max(1, collectedStars.length) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-500" />
                  ))}
                  {Array.from({ length: Math.max(0, currentLevel.stars.length - collectedStars.length) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Poin Diraih</span>
                <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  +{50 + collectedStars.length * 10} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => resetLevel()}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi Level
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Tamat!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tamat Semua Level */}
      {showFinalVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Gelar Kehormatan Komputer Ceria
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Master Koding Labirin Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menuntaskan seluruh {LEVELS.length} level tantangan algoritma, perulangan (loop), dan logika robot sekuensial!
              </p>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <span className="font-extrabold block">Poin Bintang & Lencana Algoritma Telah Diberikan</span>
              <p className="text-[11px] opacity-80">Terus kembangkan kemampuan berpikir komputasionalmu!</p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
