import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Gamepad2, 
  Shield, 
  Heart, 
  Play, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Sword, 
  Activity, 
  AlertTriangle,
  Zap,
  ChevronRight,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore } from '../../services/storageService';

interface Enemy {
  id: number;
  name: string;
  stageTitle: string;
  maxHp: number;
  hp: number;
  sprite: string;
  rewardPoints: number;
  sentences: string[];
}

const ENEMY_POOL: Enemy[] = [
  {
    id: 1,
    name: 'Trojan Worm (Cacing Trojan)',
    stageTitle: 'Level 1: Hama Cacing Penyusup',
    maxHp: 100,
    hp: 100,
    sprite: '🐛',
    rewardPoints: 50,
    sentences: [
      'jangan klik link sembarangan di internet',
      'trojan menyusup sebagai aplikasi berguna',
      'selalu pasang anti virus di komputer anda'
    ]
  },
  {
    id: 2,
    name: 'Ransomware Virus (Penyandera Berkas)',
    stageTitle: 'Level 2: Virus Pengunci File',
    maxHp: 150,
    hp: 150,
    sprite: '👾',
    rewardPoints: 75,
    sentences: [
      'ransomware mengunci semua berkas penting kita',
      'lakukan backup berkas secara rutin ke flashdisk',
      'jangan pernah membayar uang tebusan ke siber kriminal'
    ]
  },
  {
    id: 3,
    name: 'Spam Bot Overlord (Raja Bot Iklan)',
    stageTitle: 'Level 3: Pasukan Bot Surel',
    maxHp: 200,
    hp: 200,
    sprite: '🤖',
    rewardPoints: 100,
    sentences: [
      'pesan spam memenuhi kotak masuk surel email kita',
      'gunakan kata sandi rumit gabungan huruf dan angka',
      'aktifkan otentikasi dua faktor di semua akun sosial media'
    ]
  },
  {
    id: 4,
    name: 'Phishing Shark (Hiu Pencuri Identitas)',
    stageTitle: 'Level 4: Penipu Identitas Digital',
    maxHp: 250,
    hp: 250,
    sprite: '🦈',
    rewardPoints: 125,
    sentences: [
      'waspadai situs web palsu yang meniru halaman login bank',
      'periksa alamat url dengan teliti sebelum memasukkan password',
      'instansi resmi tidak akan meminta kode rahasia lewat chat'
    ]
  },
  {
    id: 5,
    name: 'The Dark Web Kraken (Penguasa Kegelapan)',
    stageTitle: 'Level 5: Bos Terakhir Siber Lab',
    maxHp: 350,
    hp: 350,
    sprite: '🐙',
    rewardPoints: 200,
    sentences: [
      'menerapkan enkripsi end-to-end melindungi privasi percakapan digital kita',
      'firewall bertugas memfilter lalu lintas data yang masuk dan keluar jaringan',
      'kesadaran pengguna adalah benteng pertahanan terkuat dalam keamanan sistem komputer'
    ]
  }
];

export const TypingHeroGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showWarning, showStarReward } = useToast();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [currentEnemyIdx, setCurrentEnemyIdx] = useState(0);
  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [combo, setCombo] = useState(0);
  const [points, setPoints] = useState(0);
  const [bossAttackTimer, setBossAttackTimer] = useState(12);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showStageVictory, setShowStageVictory] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const enemy = ENEMY_POOL[currentEnemyIdx];
  const activeSentence = sentences[currentSentenceIdx] || '';

  useEffect(() => {
    if (gameState === 'playing') {
      setSentences(enemy.sentences);
      setEnemyHp(enemy.maxHp);
      setCurrentSentenceIdx(0);
      setInputValue('');
      setBossAttackTimer(Math.max(6, 12 - currentEnemyIdx * 1.5));
      setShowStageVictory(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [currentEnemyIdx, gameState]);

  // Boss attack clock tick
  useEffect(() => {
    if (gameState !== 'playing' || showStageVictory) return;

    if (bossAttackTimer <= 0) {
      // Boss hits hero!
      setHeroHp((prev) => {
        const next = prev - 25;
        if (next <= 0) {
          handleGameOver();
          return 0;
        }
        return next;
      });
      setCombo(0);
      showError(`Monster menyerangmu! (-25 HP)`);
      setBossAttackTimer(Math.max(6, 12 - currentEnemyIdx * 1.5));
      return;
    }

    const interval = setTimeout(() => {
      setBossAttackTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [bossAttackTimer, gameState, showStageVictory, currentEnemyIdx]);

  const handleStartGame = () => {
    setHeroHp(100);
    setCurrentEnemyIdx(0);
    setCombo(0);
    setPoints(0);
    setCompletedLevels([]);
    setShowStageVictory(false);
    setGameState('playing');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStageVictory) return;
    const val = e.target.value;

    // Block paste of multiple characters
    if (val.length - inputValue.length > 1) {
      showWarning('Paste dinonaktifkan! Ketik langsung untuk menyerang monster ⚔️', 'Anti Copy-Paste');
      if (inputRef.current) {
        inputRef.current.value = inputValue;
      }
      return;
    }

    setInputValue(val);

    // If matches perfectly, hit enemy!
    if (val.trim() === activeSentence.trim()) {
      const damage = 50;
      setEnemyHp((prev) => {
        const next = prev - damage;
        if (next <= 0) {
          handleEnemyDefeated();
          return 0;
        }
        return next;
      });

      setCombo((prev) => prev + 1);
      setPoints((prev) => prev + 100 + combo * 15);
      setInputValue('');

      // Advance sentence or reset
      if (currentSentenceIdx + 1 < sentences.length) {
        setCurrentSentenceIdx((prev) => prev + 1);
        setBossAttackTimer(Math.max(6, 12 - currentEnemyIdx * 1.5));
      } else {
        setCurrentSentenceIdx(0);
      }
    }
  };

  const handleEnemyDefeated = () => {
    setShowStageVictory(true);
    setHeroHp((prev) => Math.min(100, prev + 35)); // heal on victory
    
    if (!completedLevels.includes(enemy.id)) {
      setCompletedLevels((prev) => [...prev, enemy.id]);
      if (currentUser) {
        awardRewardPoints(enemy.rewardPoints);
      }
    }
  };

  const awardRewardPoints = (amount: number) => {
    if (!currentUser) return;
    recordGameScore('Petualangan Mengetik RPG', currentUser.id, points + amount, Math.round(amount / 5));
    refreshUser();
    showStarReward(
      Math.max(1, Math.floor(amount / 15)),
      `Hebat! ${enemy.name} berhasil dimusnahkan! Kamu meraih +${amount} Poin Bintang!`,
      'Bintang Kesatria Siber!'
    );
  };

  const handleNextStage = () => {
    setShowStageVictory(false);
    if (currentEnemyIdx + 1 < ENEMY_POOL.length) {
      setCurrentEnemyIdx((prev) => prev + 1);
    } else {
      handleGameVictory();
    }
  };

  const handleRestartCurrentStage = () => {
    setShowStageVictory(false);
    setEnemyHp(enemy.maxHp);
    setCurrentSentenceIdx(0);
    setInputValue('');
    setBossAttackTimer(Math.max(6, 12 - currentEnemyIdx * 1.5));
  };

  const handleSelectStage = (idx: number) => {
    setCurrentEnemyIdx(idx);
    setShowStageVictory(false);
    setEnemyHp(ENEMY_POOL[idx].maxHp);
    setCurrentSentenceIdx(0);
    setInputValue('');
    setBossAttackTimer(Math.max(6, 12 - idx * 1.5));
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const handleGameVictory = () => {
    setGameState('victory');
    if (currentUser) {
      const grandPoints = 100;
      recordGameScore('Petualangan Mengetik RPG', currentUser.id, points + grandPoints, 20);
      refreshUser();
      showStarReward(
        10,
        `Kemenangan Besar! Kamu membasmi semua malware siber dan mendapat +${grandPoints} Poin (+10 ★ Bintang)!`,
        'Penyelamat Siber Utama'
      );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Sword className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Petualangan Mengetik RPG (*Typing Hero*)
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Level {currentEnemyIdx + 1} dari {ENEMY_POOL.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ketik naskah penawar virus sebelum monster menyerang HP komputermu!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Stage Selector Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {ENEMY_POOL.map((en, idx) => {
                const isDone = completedLevels.includes(en.id);
                const isCurrent = idx === currentEnemyIdx;
                return (
                  <button
                    key={en.id}
                    type="button"
                    onClick={() => handleSelectStage(idx)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-rose-600 text-white shadow-sm'
                        : isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{en.sprite}</span>
                    <span className="hidden sm:inline">Lvl {en.id}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 font-bold text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                Skor: <span className="font-mono text-sm">{points}</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/80 border border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300">
                Combo: <span className="font-mono text-sm">x{combo}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {gameState === 'intro' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-rose-500/10">
            <Sword className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Jadilah Kesatria Penjaga Komputer!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lab komputer sekolah diserbu oleh 5 jenis malware berbahaya. Kalahkan mereka satu per satu dengan kecepatan dan ketepatan mengetik 10 jarimu!
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 font-black text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-lg shadow-rose-500/25 cursor-pointer transition-all hover:scale-105"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Pertempuran Level 1</span>
          </button>
        </div>
      ) : gameState === 'gameover' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Sistem Komputer Terinfeksi (HP Habis)!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Jangan menyerah! Latihan mengetik 10 jari secara konsisten akan meningkatkan kecepatan seranganmu.
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi dari Awal</span>
          </button>
        </div>
      ) : gameState === 'victory' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 text-white rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-amber-500/30">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              🎉 Sistem Bersih! Semua 5 Boss Malware Kalah!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Skor Pertempuran: <span className="font-black text-rose-600 dark:text-rose-400 text-lg">{points} Poin</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sangat membanggakan! Gelar Kesatria Keamanan Siber Tertinggi telah disematkan pada akunmu.
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mainkan Pertempuran Lagi</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Battle Arena visual map */}
          <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden h-72 border border-slate-800 shadow-xl">
            {/* Background scanline overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent pointer-events-none opacity-40 animate-pulse" />

            {/* Left side: Hero Status */}
            <div className="flex flex-col items-center md:items-start space-y-2 z-10">
              <div className="text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Pahlawan Komputer (Kamu)</span>
              </div>
              <div className="text-5xl">🛡️</div>
              
              {/* HP Bar */}
              <div className="w-48 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span>HP Kamu: {heroHp}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                  <div 
                    style={{ width: `${heroHp}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Middle: Battle Clash VS */}
            <div className="flex flex-col items-center justify-center space-y-2 z-10 my-4 md:my-0">
              <span className="text-2xl font-black font-mono text-red-500 uppercase tracking-widest animate-pulse">
                VS
              </span>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Waktu Serang: {bossAttackTimer}s</span>
              </div>
            </div>

            {/* Right side: Enemy Status */}
            <div className="flex flex-col items-center md:items-end space-y-2 z-10">
              <div className="text-xs font-bold text-rose-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>{enemy.name}</span>
              </div>
              <div className="text-5xl animate-bounce">{enemy.sprite}</div>

              {/* HP Bar */}
              <div className="w-48 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span>HP Monster: {enemyHp}/{enemy.maxHp}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                  <div 
                    style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
                    className="bg-rose-500 h-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Type Input Area below */}
          <div className="md:col-span-12 flex flex-col items-center space-y-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="text-center space-y-2 w-full">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest block">
                {enemy.stageTitle} — Ketik kalimat penawar siber:
              </span>
              <p
                onCopy={(e) => {
                  e.preventDefault();
                  showWarning('Teks kalimat dilindungi dan tidak dapat disalin!', 'Anti Copy-Paste');
                }}
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                className="text-base sm:text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 px-6 py-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 select-none leading-relaxed"
              >
                {activeSentence}
              </p>
            </div>

            <div className="w-full max-w-xl">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onPaste={(e) => {
                  e.preventDefault();
                  showWarning('Paste dinonaktifkan! Ketik langsung untuk menyerang monster ⚔️', 'Anti Copy-Paste');
                }}
                onCopy={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && ['v', 'V', 'c', 'C', 'x', 'X'].includes(e.key)) {
                    e.preventDefault();
                    showWarning('Shortcut Copy/Paste dinonaktifkan!', 'Anti Copy-Paste');
                  }
                }}
                placeholder="Ketik kalimat di atas secepat mungkin untuk tebasan pedang..."
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm text-center font-mono focus:border-rose-500 focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40 outline-hidden transition-all shadow-inner"
              />
            </div>

            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Gunakan tanda spasi dan huruf kecil sesuai kalimat panduan untuk melakukan tebasan pedang siber sempurna!</span>
            </div>
          </div>
        </div>
      )}

      {/* Stage Victory Modal & Lanjut Level */}
      {showStageVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-rose-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentEnemyIdx + 1} Berhasil Ditaklukkan!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                {enemy.name} Kalah!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Serangan pedang kodingmu berhasil membasmi virus ini dan memulihkan +35 HP sistem komputermu!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">HP Pulih</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  +35 HP ❤️
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonus Poin</span>
                <span className="text-xl font-black font-mono text-amber-500">
                  +{enemy.rewardPoints} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleRestartCurrentStage}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Lawan Ulang
              </button>
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentEnemyIdx < ENEMY_POOL.length - 1 ? 'Lanjut Hadapi Musuh Level Berikutnya' : 'Lihat Gelar Penyelamat Lab!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
