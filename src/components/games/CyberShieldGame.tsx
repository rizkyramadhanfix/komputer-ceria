import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Zap,
  Flame,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  Play,
  Heart,
  Crosshair,
  CheckCircle2,
  Bug,
  Lock,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser, getGamificationConfig } from '../../services/storageService';

interface MalwareItem {
  id: number;
  name: string;
  type: 'trojan' | 'worm' | 'ransomware' | 'adware' | 'spyware';
  icon: string;
  color: string;
  x: number; // percentage 5 - 85
  y: number; // percentage 0 - 90
  speed: number;
  hp: number;
  maxHp: number;
  points: number;
  fact: string;
}

const MALWARE_TYPES: Array<Omit<MalwareItem, 'id' | 'x' | 'y'>> = [
  {
    name: 'Trojan.exe',
    type: 'trojan',
    icon: '🐴',
    color: 'from-red-500 to-rose-700',
    speed: 0.35,
    hp: 2,
    maxHp: 2,
    points: 25,
    fact: 'Trojan menyamar sebagai program berguna untuk mencuri data di latar belakang.',
  },
  {
    name: 'NetWorm.vbs',
    type: 'worm',
    icon: '🐛',
    color: 'from-amber-500 to-orange-600',
    speed: 0.45,
    hp: 1,
    maxHp: 1,
    points: 15,
    fact: 'Worm dapat menggandakan diri dan menyebar sendiri melalui jaringan internet.',
  },
  {
    name: 'RansomLocker.crypt',
    type: 'ransomware',
    icon: '🔒',
    color: 'from-purple-600 to-indigo-900',
    speed: 0.25,
    hp: 3,
    maxHp: 3,
    points: 40,
    fact: 'Ransomware mengunci file korban dan meminta tebusan untuk membuka kuncinya.',
  },
  {
    name: 'PopAdware.dll',
    type: 'adware',
    icon: '📢',
    color: 'from-yellow-500 to-amber-600',
    speed: 0.5,
    hp: 1,
    maxHp: 1,
    points: 10,
    fact: 'Adware memunculkan iklan pop-up mengganggu secara terus menerus.',
  },
  {
    name: 'KeySpyware.bin',
    type: 'spyware',
    icon: '👁️',
    color: 'from-emerald-500 to-teal-700',
    speed: 0.3,
    hp: 2,
    maxHp: 2,
    points: 30,
    fact: 'Spyware diam-diam merekam ketikan password dan aktivitas browsing pengguna.',
  },
];

export const CyberShieldGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [systemHealth, setSystemHealth] = useState(100);
  const [firewallEnergy, setFirewallEnergy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [malwareList, setMalwareList] = useState<MalwareItem[]>([]);
  const [activeFact, setActiveFact] = useState<string>('Tembak virus sebelum menyentuh Core Sistem Operasi!');
  const [defeatedCount, setDefeatedCount] = useState(0);
  const [laserPosition, setLaserPosition] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextIdRef = useRef(1);

  const playBeep = (type: 'laser' | 'hit' | 'damage' | 'victory') => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'damage') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {
      // ignore audio errors
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setSystemHealth(100);
    setFirewallEnergy(100);
    setCombo(0);
    setMaxCombo(0);
    setDefeatedCount(0);
    setMalwareList([]);
    setActiveFact('Firewall Aktif! Klik atau tembak virus yang mendekati server!');
    nextIdRef.current = 1;
  };

  // Spawn Malware
  useEffect(() => {
    if (gameState !== 'playing') {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      return;
    }

    const spawnInterval = Math.max(900, 2200 - level * 250);
    spawnTimerRef.current = setInterval(() => {
      const template = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      const newMalware: MalwareItem = {
        id: nextIdRef.current++,
        ...template,
        x: Math.floor(Math.random() * 75) + 10,
        y: 0,
        hp: template.hp,
        speed: template.speed + (level - 1) * 0.08,
      };

      setMalwareList((prev) => [...prev, newMalware]);
    }, spawnInterval);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState, level]);

  // Main Game Loop (Movement & Health Check)
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setMalwareList((prevList) => {
        let healthDeduction = 0;
        const remaining: MalwareItem[] = [];

        for (const m of prevList) {
          const newY = m.y + m.speed * delta * 28;
          if (newY >= 82) {
            // Malware breached system core!
            healthDeduction += 15;
            playBeep('damage');
          } else {
            remaining.push({ ...m, y: newY });
          }
        }

        if (healthDeduction > 0) {
          setSystemHealth((h) => {
            const nextHealth = Math.max(0, h - healthDeduction);
            if (nextHealth <= 0) {
              setGameState('gameover');
            }
            return nextHealth;
          });
          setCombo(0);
        }

        return remaining;
      });

      // Energy recharge
      setFirewallEnergy((e) => Math.min(100, e + delta * 8));

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  // Shoot / Click Malware
  const handleShootMalware = (id: number, x: number) => {
    if (gameState !== 'playing') return;

    setLaserPosition(x);
    setTimeout(() => setLaserPosition(null), 120);
    playBeep('laser');

    setMalwareList((prevList) => {
      return prevList
        .map((m) => {
          if (m.id === id) {
            const nextHp = m.hp - 1;
            if (nextHp <= 0) {
              playBeep('hit');
              const addedScore = m.points * (1 + Math.floor(combo / 3));
              setScore((s) => s + addedScore);
              setCombo((c) => {
                const nc = c + 1;
                setMaxCombo((mc) => Math.max(mc, nc));
                return nc;
              });
              setDefeatedCount((cnt) => {
                const nextCnt = cnt + 1;
                if (nextCnt % 7 === 0) {
                  setLevel((lvl) => {
                    const nextLvl = lvl + 1;
                    showInfo(`⚡ Firewall Naik ke Level ${nextLvl}! Kecepatan meningkat.`);
                    if (nextLvl >= 5) {
                      handleVictory();
                    }
                    return nextLvl;
                  });
                }
                return nextCnt;
              });
              setActiveFact(m.fact);
              return null;
            }
            return { ...m, hp: nextHp };
          }
          return m;
        })
        .filter(Boolean) as MalwareItem[];
    });
  };

  // Special EMP Blast
  const triggerEmpBlast = () => {
    if (firewallEnergy < 80 || gameState !== 'playing') return;
    setFirewallEnergy((e) => e - 80);
    playBeep('hit');

    setMalwareList((prev) => {
      const count = prev.length;
      setScore((s) => s + count * 20);
      setDefeatedCount((c) => c + count);
      return [];
    });
    showSuccess('💥 EMP Anti-Malware Blast membersihkan seluruh ancaman di layar!');
  };

  const handleVictory = () => {
    setGameState('victory');
    playBeep('victory');
    if (currentUser) {
      const earnedPoints = Math.min(80, Math.floor(score / 8) + 30);
      const ratio = getGamificationConfig().pointsToStarRatio || 10;
      const updatedTotal = (currentUser.totalPoints || 0) + earnedPoints;
      updateUser(currentUser.id, {
        totalPoints: updatedTotal,
        totalStars: Math.floor(updatedTotal / ratio),
      });
      refreshUser();
      showSuccess(`Selamat! Anda menyelamatkan OS dan mendapatkan +${earnedPoints} Poin!`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 text-white max-w-4xl mx-auto overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Cyber Shield Defender</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Firewall Game
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pertahankan Inti Sistem Operasi dari serangan Malware, Ransomware, dan Trojan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Screen */}
      {gameState === 'intro' && (
        <div className="py-12 px-6 text-center space-y-6 max-w-xl mx-auto bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 animate-pulse">
            <Bug className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black">Lawan Infeksi Malware Komputer!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Virus dan malware jahat sedang mencoba menembus pertahanan sistem operasi. Klik / tap virus yang berjatuhan untuk menembakkan laser enkripsi sebelum mencapai Core Sistem!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left text-[11px]">
            {MALWARE_TYPES.map((m) => (
              <div key={m.type} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="text-lg">{m.icon}</span>
                <div>
                  <div className="font-bold text-slate-200">{m.name}</div>
                  <div className="text-[10px] text-cyan-400">+{m.points} Pts (HP {m.hp})</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Pertahankan Sistem</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-3">
          {/* Status HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kesehatan Core OS</span>
              <div className="flex items-center gap-2 mt-1">
                <Heart className={`w-4 h-4 ${systemHealth > 40 ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`} />
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${systemHealth > 50 ? 'bg-emerald-500' : systemHealth > 25 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${systemHealth}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold">{systemHealth}%</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Energi EMP Blast</span>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${firewallEnergy}%` }} />
                </div>
                <span className="text-xs font-mono font-bold">{Math.floor(firewallEnergy)}%</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Skor & Level</span>
                <span className="text-sm font-black font-mono text-cyan-300">{score} Pts · Lvl {level}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800">
                Combo x{combo}
              </span>
            </div>

            <div className="flex items-center">
              <button
                disabled={firewallEnergy < 80}
                onClick={triggerEmpBlast}
                className={`w-full h-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  firewallEnergy >= 80
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:scale-102 text-white shadow-lg shadow-amber-500/20 animate-pulse'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>EMP Blast (80%)</span>
              </button>
            </div>
          </div>

          {/* Virtual Firewall Playfield */}
          <div className="relative h-80 sm:h-96 bg-slate-950 border-2 border-cyan-500/30 rounded-2xl overflow-hidden shadow-inner select-none cursor-crosshair">
            {/* Grid Lines */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Laser Line Effect */}
            {laserPosition !== null && (
              <div
                className="absolute top-0 bottom-12 w-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-ping"
                style={{ left: `${laserPosition}%` }}
              />
            )}

            {/* Falling Malware Items */}
            {malwareList.map((m) => (
              <button
                key={m.id}
                onClick={() => handleShootMalware(m.id, m.x)}
                className={`absolute -translate-x-1/2 p-2 rounded-2xl bg-gradient-to-br ${m.color} shadow-lg border border-white/20 active:scale-90 transition-transform cursor-pointer flex flex-col items-center group`}
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{m.icon}</span>
                <span className="text-[9px] font-black text-white px-1.5 py-0.2 rounded bg-black/40 mt-1 whitespace-nowrap">
                  {m.name} {m.hp > 1 && `(${m.hp} HP)`}
                </span>
              </button>
            ))}

            {/* Core OS Base Bar */}
            <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-slate-900 to-slate-950 border-t-2 border-cyan-500/50 flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                    Core Server & Sistem Operasi
                  </span>
                  <span className="text-[11px] text-slate-400 block -mt-0.5">
                    Jangan biarkan virus menyentuh batas bawah ini!
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Firewall Protected</span>
              </div>
            </div>
          </div>

          {/* Educational Security Tip Footer */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] leading-snug">
              <strong>Info Keamanan Siber:</strong> {activeFact}
            </span>
          </div>
        </div>
      )}

      {/* Game Over / Victory Modal */}
      {(gameState === 'gameover' || gameState === 'victory') && (
        <div className="py-10 px-6 text-center space-y-5 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-lg mx-auto">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl ${
              gameState === 'victory'
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-rose-500 text-white shadow-rose-500/30'
            }`}
          >
            {gameState === 'victory' ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black">
              {gameState === 'victory' ? '🏆 Sistem Berhasil Diselamatkan!' : '⚠️ Core Sistem Operasi Terinfeksi!'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'victory'
                ? 'Luar biasa! Anda memusnahkan seluruh malware dan menjaga integritas server.'
                : 'Malware berhasil menembus pertahanan firewall. Coba lagi dan gunakan EMP Blast secara bijak!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Skor</span>
              <span className="text-base font-black font-mono text-cyan-300">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Virus Dimusnahkan</span>
              <span className="text-base font-black font-mono text-emerald-300">{defeatedCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Max Combo</span>
              <span className="text-base font-black font-mono text-amber-300">x{maxCombo}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mainkan Pertahanan Lagi</span>
          </button>
        </div>
      )}
    </div>
  );
};
