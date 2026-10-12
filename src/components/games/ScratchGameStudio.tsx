import React, { useState, useEffect, useRef } from 'react';
import {
  Flag,
  Square,
  RotateCcw,
  Play,
  Pause,
  ExternalLink,
  Code2,
  Gamepad2,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  Info,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore, getGamesConfig } from '../../services/storageService';

// Sound synthesis helper
class ScratchSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMeow() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Pitch inflection simulating "meow"
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.35);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playJump() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  playCoin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  playWin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.linearRampToValueAtTime(0.01, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch {}
  }
}

const soundEngine = new ScratchSoundEngine();

// Curated Scratch Games that work seamlessly in TurboWarp / Scratch Embed
interface CuratedScratchGame {
  id: string;
  projectId: string;
  title: string;
  creator: string;
  description: string;
  category: 'arcade' | 'adventure' | 'puzzle' | 'music';
  badge: string;
  instructions: string;
  thumbnailColor: string;
}

const CURATED_SCRATCH_GAMES: CuratedScratchGame[] = [
  {
    id: 'scratch-cat-dash',
    projectId: '10128407', // Iconic Scratch Cat Platformer
    title: 'Scratch Cat: Gem Runner',
    creator: 'Scratch Team / Community',
    description: 'Petualangan Kucing Oren Scratch melompati balok rintangan dan mengumpulkan kristal permata!',
    category: 'adventure',
    badge: 'KLASIK MIT',
    instructions: 'Gunakan [Panah Kiri/Kanan] untuk berlari dan [Panah Atas / Spasi] untuk melompat!',
    thumbnailColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 'scratch-pong',
    projectId: '10128431', // Retro Pong
    title: 'Scratch Retro Pong Arcade',
    creator: 'Scratch MIT Lab',
    description: 'Game pantulan bola klasik paddle dengan sensor gerakan koding variabel skor otomatis.',
    category: 'arcade',
    badge: 'REFLEKS',
    instructions: 'Gerakkan mouse atau keyboard panah untuk memantulkan bola sebelum jatuh ke lantai merah.',
    thumbnailColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'scratch-maze-quest',
    projectId: '10128418', // Maze Explorer
    title: 'Labirin Kucing & Tikus Keju',
    creator: 'Edukasi Scratch Komputer',
    description: 'Pandu karakter melalui labirin dinding tanpa menyentuh rintangan untuk mencapai keju lezat.',
    category: 'puzzle',
    badge: 'LOGIKA',
    instructions: 'Kendalikan dengan tombol [W, A, S, D] atau [Panah Arah]. Hindari menyentuh dinding hitam!',
    thumbnailColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'scratch-space-defender',
    projectId: '10128424', // Space Blaster
    title: 'Galaxy Scratch Defender',
    creator: 'Komunitas Koding Anak',
    description: 'Pesawat antariksa bertahan dari hujan asteroid dan alien luar angkasa dengan tembakan laser.',
    category: 'arcade',
    badge: 'AKSI 60FPS',
    instructions: 'Gunakan [Panah Kiri/Kanan] untuk bermanuver dan [Spasi] untuk menembakkan laser energi.',
    thumbnailColor: 'from-purple-500 to-pink-600',
  },
  {
    id: 'scratch-piano-synth',
    projectId: '10128410', // Music Piano
    title: 'Piano Nada & Suara Kucing Ceria',
    creator: 'Scratch Sound Lab',
    description: 'Belajar tangga nada musik dan ekstensi suara instrumen interaktif karya komunitas Scratch.',
    category: 'music',
    badge: 'KREATIF',
    instructions: 'Tekan tuts keyboard angka 1-8 atau klik tuts piano untuk memainkan not melodi harmoni.',
    thumbnailColor: 'from-rose-400 to-red-500',
  },
];

// Interactive In-App Scratch Cat Block-Puzzle Stage
interface BlockScriptItem {
  id: string;
  category: 'motion' | 'looks' | 'sound' | 'control' | 'variable';
  title: string;
  codeSnippet: string;
  param?: number | string;
}

export const ScratchGameStudio: React.FC = () => {
  const { currentUser, isStudent } = useAuth();
  const { showSuccess, showInfo, showStarReward } = useToast();

  // Mode Tab: 'interactive-studio' | 'scratch-player' | 'custom-loader'
  const [activeMode, setActiveMode] = useState<'interactive-studio' | 'scratch-player' | 'custom-loader'>('interactive-studio');

  // Player State
  const [selectedGame, setSelectedGame] = useState<CuratedScratchGame>(CURATED_SCRATCH_GAMES[0]);
  const [customProjectId, setCustomProjectId] = useState<string>('');
  const [activeEmbedId, setActiveEmbedId] = useState<string>(CURATED_SCRATCH_GAMES[0].projectId);
  const [activeEmbedTitle, setActiveEmbedTitle] = useState<string>(CURATED_SCRATCH_GAMES[0].title);
  const [playerEngine, setPlayerEngine] = useState<'turbowarp' | 'scratch'>('turbowarp');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Mini In-App Scratch Studio (Canvas Game & Block Assembly)
  const [catPos, setCatPos] = useState({ x: 60, y: 160 });
  const [catDirection, setCatDirection] = useState<'right' | 'left'>('right');
  const [catCostume, setCatCostume] = useState<1 | 2>(1);
  const [speechBubble, setSpeechBubble] = useState<string | null>('Halo! Aku Kucing Scratch 🐱 Klik Bendera Hijau!');
  const [coins, setCoins] = useState<{ id: number; x: number; y: number; collected: boolean }[]>([
    { id: 1, x: 180, y: 160, collected: false },
    { id: 2, x: 280, y: 110, collected: false },
    { id: 3, x: 380, y: 160, collected: false },
    { id: 4, x: 220, y: 70, collected: false },
    { id: 5, x: 340, y: 80, collected: false },
  ]);
  const [stageScore, setStageScore] = useState(0);
  const [isScriptRunning, setIsScriptRunning] = useState(false);
  const [collectedPointsAwarded, setCollectedPointsAwarded] = useState(false);

  // Scratch Script Workspace
  const [scriptBlocks, setScriptBlocks] = useState<BlockScriptItem[]>([
    { id: 'b-1', category: 'motion', title: 'Gerak 10 Langkah', codeSnippet: 'move(10)' },
    { id: 'b-2', category: 'looks', title: 'Katakan "Meow! 🐱"', codeSnippet: 'say("Meow! 🐱")' },
    { id: 'b-3', category: 'sound', title: 'Mainkan Suara Kucing', codeSnippet: 'playSound("meow")' },
    { id: 'b-4', category: 'motion', title: 'Lompat ke Atas (+50)', codeSnippet: 'jump(50)' },
    { id: 'b-5', category: 'variable', title: 'Tambah Skor +10', codeSnippet: 'changeScore(10)' },
  ]);

  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Available Block Palette for Mini Studio
  const PALETTE_BLOCKS: BlockScriptItem[] = [
    { id: 'pal-1', category: 'motion', title: 'Gerak Maju 20 Langkah', codeSnippet: 'move(20)' },
    { id: 'pal-2', category: 'motion', title: 'Lompat Tinggi (+70)', codeSnippet: 'jump(70)' },
    { id: 'pal-3', category: 'motion', title: 'Balik Arah (Kiri/Kanan)', codeSnippet: 'turn()' },
    { id: 'pal-4', category: 'looks', title: 'Katakan "Semangat Koding! 🚀"', codeSnippet: 'say("Semangat!")' },
    { id: 'pal-5', category: 'looks', title: 'Ganti Kostum 2', codeSnippet: 'nextCostume()' },
    { id: 'pal-6', category: 'sound', title: 'Mainkan Nada Meow 🎵', codeSnippet: 'playSound("meow")' },
    { id: 'pal-7', category: 'control', title: 'Tunggu 0.5 Detik', codeSnippet: 'wait(0.5)' },
    { id: 'pal-8', category: 'variable', title: 'Ambil Bintang & Skor +10', codeSnippet: 'collectCoin()' },
  ];

  // Sound Engine Mute toggle
  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    soundEngine.enabled = !nextState;
  };

  // Run the assembled Scratch Block Script on Stage
  const handleRunGreenFlag = async () => {
    setIsScriptRunning(true);
    soundEngine.playMeow();
    setSpeechBubble('🚩 Skrip Scratch Dijalankan!');

    // Reset coins if all were collected
    setCoins((prev) => prev.map((c) => ({ ...c, collected: false })));

    let currentX = 60;
    let currentY = 160;
    let curDir: 'right' | 'left' = 'right';
    let currentScore = stageScore;

    for (let i = 0; i < scriptBlocks.length; i++) {
      const block = scriptBlocks[i];
      await new Promise((r) => setTimeout(r, 600));

      if (block.codeSnippet.includes('move')) {
        const step = block.codeSnippet.includes('20') ? 45 : 30;
        currentX = curDir === 'right' ? Math.min(420, currentX + step) : Math.max(30, currentX - step);
        setCatPos({ x: currentX, y: currentY });
        setCatCostume((c) => (c === 1 ? 2 : 1));
        soundEngine.playJump();
      } else if (block.codeSnippet.includes('jump')) {
        currentY = 80;
        setCatPos({ x: currentX, y: currentY });
        soundEngine.playJump();
        setCatCostume(2);
        await new Promise((r) => setTimeout(r, 400));
        currentY = 160;
        setCatPos({ x: currentX, y: currentY });
        setCatCostume(1);
      } else if (block.codeSnippet.includes('turn')) {
        curDir = curDir === 'right' ? 'left' : 'right';
        setCatDirection(curDir);
      } else if (block.codeSnippet.includes('say')) {
        const text = block.codeSnippet.match(/"([^"]+)"/)?.[1] || 'Meow!';
        setSpeechBubble(text);
        soundEngine.playMeow();
      } else if (block.codeSnippet.includes('playSound')) {
        soundEngine.playMeow();
      } else if (block.codeSnippet.includes('changeScore') || block.codeSnippet.includes('collectCoin')) {
        currentScore += 10;
        setStageScore(currentScore);
        soundEngine.playCoin();
      }

      // Check coin collision
      setCoins((prev) =>
        prev.map((coin) => {
          if (!coin.collected && Math.hypot(coin.x - currentX, coin.y - currentY) < 50) {
            soundEngine.playCoin();
            currentScore += 10;
            setStageScore(currentScore);
            return { ...coin, collected: true };
          }
          return coin;
        })
      );
    }

    await new Promise((r) => setTimeout(r, 500));
    setIsScriptRunning(false);
    setSpeechBubble('Selesai! Hebat sekali! 🎉');
    soundEngine.playWin();

    // Award point to student
    if (currentUser && !collectedPointsAwarded) {
      setCollectedPointsAwarded(true);
      const points = 45;
      recordGameScore('Studio Game Scratch', currentUser.id, currentScore + 50, points);
      showStarReward(5, `Kamu menyelesaikan koding balok Scratch (+${points} Poin)!`, 'Koding Scratch Berhasil!');
    }
  };

  const handleStopRed = () => {
    setIsScriptRunning(false);
    setSpeechBubble('🔴 Program Dihentikan.');
    setCatPos({ x: 60, y: 160 });
    setCatCostume(1);
  };

  const handleResetStage = () => {
    setIsScriptRunning(false);
    setCatPos({ x: 60, y: 160 });
    setCatDirection('right');
    setCatCostume(1);
    setSpeechBubble('Kucing siap bergerak! Atur balok kodingmu!');
    setStageScore(0);
    setCoins((prev) => prev.map((c) => ({ ...c, collected: false })));
  };

  const handleAddBlock = (block: BlockScriptItem) => {
    const newBlock = { ...block, id: `block-${Date.now()}-${Math.random()}` };
    setScriptBlocks([...scriptBlocks, newBlock]);
    soundEngine.playJump();
  };

  const handleRemoveBlock = (id: string) => {
    setScriptBlocks(scriptBlocks.filter((b) => b.id !== id));
  };

  // Load Custom Project URL or ID
  const handleLoadCustomProject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let cleanId = customProjectId.trim();
    // Support full links like: https://scratch.mit.edu/projects/10128407/
    const match = cleanId.match(/projects\/(\d+)/);
    if (match) {
      cleanId = match[1];
    } else {
      // Strip any non-digits
      cleanId = cleanId.replace(/[^0-9]/g, '');
    }

    if (!cleanId) {
      showInfo('Masukkan ID Proyek Scratch berupa deretan angka atau tautan scratch.mit.edu/projects/{ID}');
      return;
    }

    setActiveEmbedId(cleanId);
    setActiveEmbedTitle(`Proyek Scratch #${cleanId}`);
    setActiveMode('scratch-player');
    showSuccess(`Memuat Proyek Scratch #${cleanId} di Player TurboWarp!`);
  };

  const handleSelectCuratedGame = (game: CuratedScratchGame) => {
    setSelectedGame(game);
    setActiveEmbedId(game.projectId);
    setActiveEmbedTitle(game.title);
    setActiveMode('scratch-player');
  };

  // Build the embed URL
  const getEmbedUrl = () => {
    if (playerEngine === 'turbowarp') {
      // TurboWarp is open source, 60 FPS, responsive, and works with no cookies
      return `https://turbowarp.org/${activeEmbedId}/embed?autoplay=true&fps=60`;
    }
    return `https://scratch.mit.edu/projects/${activeEmbedId}/embed`;
  };

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Color helper for Scratch Block Categories
  const getBlockStyle = (category: BlockScriptItem['category']) => {
    switch (category) {
      case 'motion':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600';
      case 'looks':
        return 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600';
      case 'sound':
        return 'bg-pink-500 hover:bg-pink-600 text-white border-pink-600';
      case 'control':
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'variable':
        return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600';
      default:
        return 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider">
              <span>🐱 LAB PEMROGRAMAN BLOK RESMI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Studio Game Scratch</span>
              <span className="text-3xl">🧩</span>
            </h1>
            <p className="text-sm sm:text-base text-amber-100 max-w-2xl font-medium leading-relaxed">
              Mainkan game-game seru karya anak bangsa dari MIT Scratch, susun balok logika visual Kucing Oren Scratch, atau masukkan link proyek Scratch karyamu sendiri!
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
              <Trophy className="w-4 h-4 text-amber-300" />
              <div className="text-left">
                <p className="text-[10px] text-white/80 font-bold uppercase">Reward Ekskul</p>
                <p className="text-xs font-black text-white">+50 Poin Bintang</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
              <Code2 className="w-4 h-4 text-emerald-300" />
              <div className="text-left">
                <p className="text-[10px] text-white/80 font-bold uppercase">TurboWarp Player</p>
                <p className="text-xs font-black text-white">60 FPS Ultra Lancar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Modes */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMode('interactive-studio')}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              activeMode === 'interactive-studio'
                ? 'bg-white text-orange-600 shadow-md scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mini Scratch Cat Studio (Balok Koding)</span>
          </button>

          <button
            onClick={() => setActiveMode('scratch-player')}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              activeMode === 'scratch-player'
                ? 'bg-white text-orange-600 shadow-md scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arena Game Scratch Populer (60 FPS)</span>
          </button>

          <button
            onClick={() => setActiveMode('custom-loader')}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              activeMode === 'custom-loader'
                ? 'bg-white text-orange-600 shadow-md scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buka Link / ID Proyek Scratch Sendiri</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MINI SCRATCH CAT STUDIO (BUILT-IN INTERACTIVE BLOCK CODING) */}
      {activeMode === 'interactive-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Top: Interactive Stage (Panggung Scratch) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Scratch Stage Top Bar (Green Flag & Red Stop) */}
              <div className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>🐱 Panggung (Stage) Scratch</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-extrabold text-slate-600 dark:text-slate-300">
                    480 × 360
                  </span>
                </div>

                {/* Control Flags */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunGreenFlag}
                    disabled={isScriptRunning}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs text-white shadow-sm transition-all cursor-pointer ${
                      isScriptRunning
                        ? 'bg-emerald-400 opacity-60 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
                    }`}
                    title="Jalankan Skrip Balok (Green Flag)"
                  >
                    <Flag className="w-3.5 h-3.5 fill-current" />
                    <span>Jalankan</span>
                  </button>

                  <button
                    onClick={handleStopRed}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all cursor-pointer active:scale-95"
                    title="Hentikan Skrip (Stop)"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Hentikan</span>
                  </button>

                  <button
                    onClick={handleResetStage}
                    className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
                    title="Reset Posisi Panggung"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={toggleSound}
                    className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
                    title={soundMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
                  >
                    {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                </div>
              </div>

              {/* Stage Canvas (Scratch Canvas Simulator) */}
              <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 overflow-hidden select-none border-b border-slate-200 dark:border-slate-800">
                {/* Decorative Clouds & Grid */}
                <div className="absolute top-4 left-8 text-3xl opacity-60">☁️</div>
                <div className="absolute top-10 right-16 text-2xl opacity-40">☁️</div>
                <div className="absolute top-6 left-1/2 text-xl opacity-30">⭐</div>

                {/* Score & Coordinates HUD */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black shadow-xs flex items-center gap-3">
                  <span className="text-amber-500 flex items-center gap-1">
                    <span>⭐ Skor:</span>
                    <span className="text-slate-900 dark:text-white font-mono">{stageScore}</span>
                  </span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    X: {catPos.x - 240} Y: {180 - catPos.y}
                  </span>
                </div>

                {/* Ground Grass Line */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-600 to-emerald-500 dark:from-emerald-900 dark:to-emerald-800 border-t-4 border-emerald-400/80 flex items-center justify-around">
                  <span className="text-xs text-emerald-100/50 font-bold">🌿 Panggung Scratch 3.0</span>
                  <span className="text-xs text-emerald-100/50 font-bold">🏁 Target Bintang</span>
                </div>

                {/* Coins / Target Stars */}
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    style={{ left: `${coin.x}px`, top: `${coin.y}px` }}
                    className={`absolute transition-all duration-300 ${
                      coin.collected
                        ? 'scale-0 opacity-0'
                        : 'scale-100 opacity-100 animate-bounce'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-sm shadow-md">
                      ⭐
                    </div>
                  </div>
                ))}

                {/* Speech Bubble of Cat */}
                {speechBubble && (
                  <div
                    style={{
                      left: `${Math.max(10, Math.min(340, catPos.x - 30))}px`,
                      top: `${Math.max(10, catPos.y - 55)}px`,
                    }}
                    className="absolute z-20 bg-white text-slate-900 px-3 py-1.5 rounded-2xl rounded-bl-none shadow-lg border border-slate-200 text-xs font-black animate-fade-in pointer-events-none"
                  >
                    <span>{speechBubble}</span>
                  </div>
                )}

                {/* Iconic Scratch Cat Sprite */}
                <div
                  style={{
                    left: `${catPos.x}px`,
                    top: `${catPos.y}px`,
                    transform: `translate(-50%, -50%) ${catDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                  }}
                  className="absolute z-10 transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    soundEngine.playMeow();
                    setSpeechBubble('Meow! Klik aku lagi! 🐱');
                  }}
                >
                  {/* Scratch Cat SVG Illustration */}
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 100 100"
                    className="drop-shadow-lg filter group-hover:scale-105 transition-transform"
                  >
                    {/* Tail */}
                    <path
                      d="M25,70 Q10,75 12,60 Q15,50 25,62"
                      fill="#FFAB19"
                      stroke="#CC7A00"
                      strokeWidth="2.5"
                    />
                    {/* Body */}
                    <ellipse cx="48" cy="65" rx="20" ry="16" fill="#FFAB19" stroke="#CC7A00" strokeWidth="2.5" />
                    {/* White Belly */}
                    <ellipse cx="48" cy="66" rx="13" ry="10" fill="#FFFFFF" />
                    {/* Left & Right Legs */}
                    <ellipse cx="36" cy="80" rx="7" ry="4" fill="#FFFFFF" stroke="#CC7A00" strokeWidth="1.5" />
                    <ellipse cx="60" cy="80" rx="7" ry="4" fill="#FFFFFF" stroke="#CC7A00" strokeWidth="1.5" />
                    {/* Cat Head */}
                    <circle cx="50" cy="40" r="24" fill="#FFAB19" stroke="#CC7A00" strokeWidth="2.5" />
                    {/* Ears */}
                    <polygon points="32,24 24,6 44,18" fill="#FFAB19" stroke="#CC7A00" strokeWidth="2" />
                    <polygon points="33,22 28,10 42,18" fill="#FF8C1A" />
                    <polygon points="68,24 76,6 56,18" fill="#FFAB19" stroke="#CC7A00" strokeWidth="2" />
                    <polygon points="67,22 72,10 58,18" fill="#FF8C1A" />
                    {/* White Muzzle */}
                    <ellipse cx="50" cy="46" rx="14" ry="10" fill="#FFFFFF" />
                    {/* Eyes */}
                    <ellipse cx="42" cy="36" rx="4" ry="5.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                    <circle cx="43" cy="36" r="2.5" fill="#000000" />
                    <ellipse cx="58" cy="36" rx="4" ry="5.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                    <circle cx="59" cy="36" r="2.5" fill="#000000" />
                    {/* Nose */}
                    <polygon points="50,44 47,41 53,41" fill="#4C1D95" />
                    {/* Mouth & Whiskers */}
                    <path d="M47,45 Q50,49 53,45" fill="none" stroke="#333333" strokeWidth="1.5" />
                    <line x1="28" y1="44" x2="16" y2="42" stroke="#333333" strokeWidth="1.5" />
                    <line x1="28" y1="47" x2="18" y2="49" stroke="#333333" strokeWidth="1.5" />
                    <line x1="72" y1="44" x2="84" y2="42" stroke="#333333" strokeWidth="1.5" />
                    <line x1="72" y1="47" x2="82" y2="49" stroke="#333333" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Stage Controls & Manual Movement */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-600 dark:text-slate-400">Kontrol Manual Sprite:</span>
                  <button
                    onClick={() => {
                      setCatPos((p) => ({ ...p, x: Math.max(30, p.x - 25) }));
                      setCatDirection('left');
                      soundEngine.playJump();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black hover:bg-slate-100"
                  >
                    ⬅ Kiri
                  </button>
                  <button
                    onClick={() => {
                      setCatPos((p) => ({ ...p, y: Math.max(40, p.y - 25) }));
                      soundEngine.playJump();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black hover:bg-slate-100"
                  >
                    ⬆ Atas
                  </button>
                  <button
                    onClick={() => {
                      setCatPos((p) => ({ ...p, y: Math.min(220, p.y + 25) }));
                      soundEngine.playJump();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black hover:bg-slate-100"
                  >
                    ⬇ Bawah
                  </button>
                  <button
                    onClick={() => {
                      setCatPos((p) => ({ ...p, x: Math.min(430, p.x + 25) }));
                      setCatDirection('right');
                      soundEngine.playJump();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black hover:bg-slate-100"
                  >
                    ➡ Kanan
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playMeow();
                    setSpeechBubble('Meow! Kucing Scratch senang diajak koding! 🐱✨');
                  }}
                  className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black hover:bg-orange-200 transition-colors"
                >
                  🔊 Bunyikan Meow!
                </button>
              </div>
            </div>

            {/* Educational Scratch Info Callout */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 p-4 rounded-2xl border border-blue-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tahukah Kamu? Mengapa Belajar Scratch Sangat Populer?</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Scratch diciptakan oleh **Lifelong Kindergarten Group di MIT Media Lab**. Scratch mengajarkan konsep pemrograman terstruktur (Sequence, Loop, Conditional IF-THEN, Variable, & Event) menggunakan balok grafis yang mudah dipahami tanpa takut error sintaks!
              </p>
            </div>
          </div>

          {/* Right: Scratch Block Script Workspace */}
          <div className="lg:col-span-5 space-y-4">
            {/* Script Workspace Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-orange-500" />
                    <span>Area Skrip Balok Koding Siswa</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Balok tersusun ({scriptBlocks.length}) yang akan dieksekusi saat bendera hijau diklik
                  </p>
                </div>

                <button
                  onClick={() => setScriptBlocks([])}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  title="Kosongkan Skrip"
                >
                  Hapus Semua
                </button>
              </div>

              {/* Event Hat Block (Ketika Bendera Hijau Diklik) */}
              <div className="bg-amber-400 text-slate-900 px-4 py-2.5 rounded-2xl rounded-tr-3xl shadow-sm border-2 border-amber-500 font-black text-xs flex items-center gap-2">
                <Flag className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>ketika 🚩 bendera hijau diklik</span>
              </div>

              {/* Active Script Blocks Stack */}
              <div className="space-y-2 min-h-48 max-h-72 overflow-y-auto pr-1">
                {scriptBlocks.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                    <p className="font-bold">Skrip masih kosong!</p>
                    <p className="text-[11px] mt-1">Pilih balok di bawah untuk menambahkannya ke susunan koding.</p>
                  </div>
                ) : (
                  scriptBlocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className={`px-3.5 py-2.5 rounded-xl border-l-4 font-black text-xs flex items-center justify-between shadow-xs transition-transform hover:scale-[1.01] ${getBlockStyle(
                        block.category
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-75">#{idx + 1}</span>
                        <span>{block.title}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveBlock(block.id)}
                        className="opacity-70 hover:opacity-100 p-1 hover:bg-black/20 rounded-md transition-opacity"
                        title="Hapus balok ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Block Palette (Koleksi Balok untuk Ditambahkan) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                  + Klik untuk Menambahkan Balok:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PALETTE_BLOCKS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddBlock(p)}
                      className={`text-left p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${getBlockStyle(
                        p.category
                      )}`}
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ARENA GAME SCRATCH POPULER (TURBOWARP & EMBED PLAYER) */}
      {activeMode === 'scratch-player' && (
        <div className="space-y-6">
          {/* Main Embedded Player Container */}
          <div
            ref={iframeContainerRef}
            className={`bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
            }`}
          >
            {/* Player Control Toolbar */}
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <span className="text-xl">🐱</span>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{activeEmbedTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold uppercase">
                      60 FPS
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    ID Proyek: <span className="font-mono text-amber-300">{activeEmbedId}</span> via Engine{' '}
                    <span className="uppercase font-bold">{playerEngine}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Engine Selector */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setPlayerEngine('turbowarp')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      playerEngine === 'turbowarp' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    TurboWarp (Cepat)
                  </button>
                  <button
                    onClick={() => setPlayerEngine('scratch')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      playerEngine === 'scratch' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Scratch MIT
                  </button>
                </div>

                <a
                  href={`https://scratch.mit.edu/projects/${activeEmbedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Buka Proyek Resmi di scratch.mit.edu"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Toggle Layar Penuh"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* TurboWarp / Scratch Embed iFrame */}
            <div className="relative w-full aspect-[4/3] max-h-[640px] bg-black flex items-center justify-center">
              <iframe
                src={getEmbedUrl()}
                allowTransparency
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                className="w-full h-full border-0"
                title={`Scratch Project ${activeEmbedId}`}
              />
            </div>

            {/* Game Instructions & Points Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Petunjuk:</strong> Klik layar game untuk mengaktifkan fokus kontrol keyboard & suara!
                </span>
              </div>

              {isStudent && (
                <button
                  onClick={() => {
                    if (currentUser) {
                      recordGameScore('Studio Game Scratch', currentUser.id, 100, 50);
                      showStarReward(5, 'Kamu berhasil bermain game Scratch MIT (+50 Poin)!', 'Skor Scratch Tersimpan!');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Klaim Bintang Ekskul</span>
                </button>
              )}
            </div>
          </div>

          {/* Curated Games Library Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-500" />
              <span>Pilihan Game Scratch Populer & Edukatif</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURATED_SCRATCH_GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleSelectCuratedGame(game)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    activeEmbedId === game.projectId
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.thumbnailColor} flex items-center justify-center text-white text-2xl shadow-sm group-hover:scale-105 transition-transform`}>
                        🐱
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {game.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {game.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-[10px] text-slate-400 uppercase">Kontrol:</p>
                      <p className="font-medium mt-0.5">{game.instructions}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{activeEmbedId === game.projectId ? 'Sedang Dimainkan' : 'Mainkan Game Ini'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: CUSTOM PROJECT LOADER */}
      {activeMode === 'custom-loader' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto text-3xl">
              🧩
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Buka Proyek Scratch Siswa / Guru
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Punya game atau animasi yang dibuat di Scratch MIT? Cukup salin tautan atau ID proyeknya untuk dimainkan langsung di aplikasi ini!
            </p>
          </div>

          <form onSubmit={handleLoadCustomProject} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                Tautan atau ID Proyek Scratch:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customProjectId}
                  onChange={(e) => setCustomProjectId(e.target.value)}
                  placeholder="Contoh: https://scratch.mit.edu/projects/10128407/ atau 10128407"
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Muat Game
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                💡 Tips: Proyek harus berstatus 'Shared' di situs scratch.mit.edu agar dapat diakses oleh player.
              </p>
            </div>
          </form>

          {/* Quick Examples to Try */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Contoh ID Proyek Populer untuk Dicoba:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: '10128407', title: 'Scratch Cat Gem Runner' },
                { id: '10128431', title: 'Retro Pong Arcade' },
                { id: '10128418', title: 'Cat & Mouse Maze Quest' },
                { id: '10128424', title: 'Space Defender' },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setCustomProjectId(ex.id);
                    setActiveEmbedId(ex.id);
                    setActiveEmbedTitle(ex.title);
                    setActiveMode('scratch-player');
                    showSuccess(`Memuat ${ex.title}!`);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200 dark:border-slate-700 text-left font-bold flex items-center justify-between transition-colors"
                >
                  <span className="text-slate-700 dark:text-slate-300">{ex.title}</span>
                  <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400">ID: {ex.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
