import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Music,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

interface NoteItem {
  id: number;
  letter: string;
  lane: number; // 0, 1, 2, 3 (e.g. lanes corresponding to keys D, F, J, K or A-Z)
  y: number; // percentage 0 to 100
  speed: number;
  hit: boolean;
}

const LANES = [
  { lane: 0, key: 'D', label: 'D', color: 'from-pink-500 to-rose-600', border: 'border-pink-500' },
  { lane: 1, key: 'F', label: 'F', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500' },
  { lane: 2, key: 'J', label: 'J', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500' },
  { lane: 3, key: 'K', label: 'K', color: 'from-amber-500 to-yellow-600', border: 'border-amber-500' },
];

const SONG_TRACKS = [
  { id: 'track-1', title: 'Cyber Beat 8-Bit (Santai)', bpm: 90, duration: 35 },
  { id: 'track-2', title: 'Neon Highway 120 (Sedang)', bpm: 120, duration: 40 },
  { id: 'track-3', title: 'Gigahertz Turbo (Cepat)', bpm: 145, duration: 45 },
];

export const RhythmTypingGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [selectedTrack, setSelectedTrack] = useState(SONG_TRACKS[0]);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'ended'>('menu');
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [greatCount, setGreatCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastJudgement, setLastJudgement] = useState<{ text: string; color: string } | null>(null);
  const [activePressedLanes, setActivePressedLanes] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const notesRef = useRef<NoteItem[]>([]);
  notesRef.current = notes;

  const nextNoteId = useRef(1);
  const animFrameRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const playTone = (freq: number) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    setMaxCombo(0);
    setPerfectCount(0);
    setGreatCount(0);
    setMissCount(0);
    setNotes([]);
    setTimeLeft(selectedTrack.duration);
    setLastJudgement(null);
    nextNoteId.current = 1;
  };

  // Keyboard handler
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const laneIdx = LANES.findIndex((l) => l.key === key);
      if (laneIdx === -1) return;

      // Visual feedback
      setActivePressedLanes((prev) => (prev.includes(laneIdx) ? prev : [...prev, laneIdx]));

      // Tones for lanes: D=261.6, F=329.6, J=392.0, K=523.2
      const tones = [261.6, 329.6, 392.0, 523.2];
      playTone(tones[laneIdx]);

      // Check hit proximity to target line (y: 80% to 92%)
      const currentNotes = [...notesRef.current];
      const targetNote = currentNotes
        .filter((n) => n.lane === laneIdx && !n.hit)
        .sort((a, b) => Math.abs(a.y - 85) - Math.abs(b.y - 85))[0];

      if (targetNote && targetNote.y >= 70 && targetNote.y <= 95) {
        const diff = Math.abs(targetNote.y - 85);
        let pts = 0;
        if (diff <= 5) {
          // PERFECT
          pts = 100;
          setPerfectCount((p) => p + 1);
          setLastJudgement({ text: 'PERFECT! 🎯', color: 'text-amber-400' });
        } else {
          // GREAT
          pts = 60;
          setGreatCount((g) => g + 1);
          setLastJudgement({ text: 'GREAT! ✨', color: 'text-cyan-400' });
        }

        setScore((s) => s + pts * (1 + Math.floor(combo / 5)));
        setCombo((c) => {
          const nc = c + 1;
          setMaxCombo((mc) => Math.max(mc, nc));
          return nc;
        });

        // Mark note as hit
        setNotes((prev) => prev.filter((n) => n.id !== targetNote.id));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const laneIdx = LANES.findIndex((l) => l.key === key);
      if (laneIdx !== -1) {
        setActivePressedLanes((prev) => prev.filter((l) => l !== laneIdx));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, combo]);

  // Game timer & note spawning
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnDelay = Math.max(350, Math.floor(60000 / selectedTrack.bpm) / 1.5);
    spawnTimerRef.current = setInterval(() => {
      const randomLane = Math.floor(Math.random() * 4);
      const laneKey = LANES[randomLane].key;
      const newNote: NoteItem = {
        id: nextNoteId.current++,
        letter: laneKey,
        lane: randomLane,
        y: 0,
        speed: (selectedTrack.bpm / 100) * 1.8,
        hit: false,
      };
      setNotes((prev) => [...prev, newNote]);
    }, spawnDelay);

    const countdownTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      clearInterval(countdownTimer);
    };
  }, [gameState, selectedTrack]);

  // Frame update
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setNotes((prev) => {
        const remaining: NoteItem[] = [];
        let missDelta = 0;

        for (const n of prev) {
          const nextY = n.y + n.speed * delta * 45;
          if (nextY > 96 && !n.hit) {
            missDelta++;
          } else {
            remaining.push({ ...n, y: nextY });
          }
        }

        if (missDelta > 0) {
          setMissCount((m) => m + missDelta);
          setCombo(0);
          setLastJudgement({ text: 'MISS! ❌', color: 'text-rose-500' });
        }

        return remaining;
      });

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState]);

  const endGame = useCallback(() => {
    setGameState('ended');
    if (currentUser) {
      const currentFinalScore = scoreRef.current;
      const earned = Math.min(60, Math.floor(currentFinalScore / 50) + 20);
      const ratio = getGamificationConfig().pointsToStarRatio || 10;
      const updatedTotal = (currentUser.totalPoints || 0) + earned;
      updateUser(currentUser.id, {
        totalPoints: updatedTotal,
        totalStars: Math.floor(updatedTotal / ratio),
      });
      refreshUser();
      showSuccess(`Permainan Selesai! Anda mendapatkan +${earned} Poin prestasi!`);
    }
  }, [currentUser, refreshUser, showSuccess]);

  // Trigger endGame safely outside render when timeLeft reaches 0
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft, endGame]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Rhythm Typing Beats</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                Irama Keyboard
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tekan tombol <strong>D, F, J, K</strong> tepat saat not musik menyentuh garis target bawah!
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* TRACK SELECTION MENU */}
      {gameState === 'menu' && (
        <div className="py-8 px-6 text-center space-y-6 bg-slate-950/60 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <div className="space-y-1">
            <h3 className="text-base font-black">Pilih Lagu & Kecepatan Irama</h3>
            <p className="text-xs text-slate-400">Melatih refleks jari telunjuk dan tengah kedua tangan.</p>
          </div>

          <div className="space-y-2">
            {SONG_TRACKS.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTrack(t)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedTrack.id === t.id
                    ? 'bg-pink-950/60 border-pink-500 text-pink-200 shadow-md shadow-pink-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Activity className="w-4 h-4 text-pink-400" />
                  <div>
                    <div className="font-bold text-xs">{t.title}</div>
                    <div className="text-[10px] text-slate-400">{t.bpm} BPM · Durasi {t.duration}s</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/40">
                  {selectedTrack.id === t.id ? 'Dipilih' : 'Pilih'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-pink-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Mainkan Irama ({selectedTrack.title})</span>
          </button>
        </div>
      )}

      {/* GAMEPLAY SCREEN */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Top HUD */}
          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Skor</span>
              <span className="text-base font-black font-mono text-pink-400">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Combo</span>
              <span className="text-base font-black font-mono text-cyan-400">x{combo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Waktu</span>
              <span className="text-base font-black font-mono text-amber-400">{timeLeft}s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Akurasi</span>
              <span className="text-base font-black font-mono text-emerald-400">
                {perfectCount + greatCount + missCount === 0
                  ? '100%'
                  : `${Math.floor(((perfectCount + greatCount) / (perfectCount + greatCount + missCount)) * 100)}%`}
              </span>
            </div>
          </div>

          {/* 4-Lane Rhythm Matrix */}
          <div className="relative h-96 bg-slate-950 border-2 border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-4 divide-x divide-slate-800/80">
            {/* Judgement Popup in Center */}
            {lastJudgement && (
              <div className="absolute top-1/3 inset-x-0 text-center z-20 pointer-events-none animate-in zoom-in duration-150">
                <span className={`text-xl font-black ${lastJudgement.color} drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]`}>
                  {lastJudgement.text}
                </span>
              </div>
            )}

            {/* Target Hit Line at 85% Height */}
            <div className="absolute top-[85%] inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-cyan-400 to-amber-400 shadow-[0_0_15px_#ec4899] z-10" />

            {/* Falling Notes */}
            {notes.map((n) => {
              const laneInfo = LANES[n.lane];
              return (
                <div
                  key={n.id}
                  className={`absolute w-12 h-10 -translate-x-1/2 rounded-xl bg-gradient-to-b ${laneInfo.color} border border-white/40 shadow-lg flex items-center justify-center font-black text-sm text-white select-none pointer-events-none`}
                  style={{
                    left: `${(n.lane + 0.5) * 25}%`,
                    top: `${n.y}%`,
                  }}
                >
                  {n.letter}
                </div>
              );
            })}

            {/* 4 Bottom Key Buttons */}
            {LANES.map((l) => {
              const isPressed = activePressedLanes.includes(l.lane);
              return (
                <div key={l.lane} className="h-full flex flex-col justify-end p-2 relative">
                  <div
                    className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none ${
                      isPressed
                        ? `bg-gradient-to-t ${l.color} ${l.border} scale-95 shadow-[0_0_20px_#ec4899]`
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xl font-black">{l.label}</span>
                    <span className="text-[9px] uppercase opacity-70 font-mono">Tuts {l.key}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-400">
            Gunakan keyboard komputer (Tombol <strong>D, F, J, K</strong>) atau tap tombol di layar!
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {gameState === 'ended' && (
        <div className="py-8 px-6 text-center space-y-5 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-black">Lagu Selesai! Skor Irama Anda</h3>

          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Skor</span>
              <span className="font-black text-pink-400 text-base">{score}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Perfect</span>
              <span className="font-black text-amber-400 text-base">{perfectCount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Great</span>
              <span className="font-black text-cyan-400 text-base">{greatCount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Miss</span>
              <span className="font-black text-rose-400 text-base">{missCount}</span>
            </div>
          </div>

          <button
            onClick={() => setGameState('menu')}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            Pilih Lagu Lain / Main Lagi
          </button>
        </div>
      )}
    </div>
  );
};
