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
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore } from '../../services/storageService';

interface Enemy {
  name: string;
  maxHp: number;
  hp: number;
  sprite: string;
  sentences: string[];
}

const ENEMY_POOL: Enemy[] = [
  {
    name: 'Trojan Worm (Cacing Trojan)',
    maxHp: 100,
    hp: 100,
    sprite: '🐛',
    sentences: [
      'jangan klik link sembarangan di internet',
      'trojan menyusup sebagai aplikasi berguna',
      'selalu pasang anti virus di komputer anda'
    ]
  },
  {
    name: 'Ransomware Virus (Penyandera Berkas)',
    maxHp: 150,
    hp: 150,
    sprite: '👾',
    sentences: [
      'ransomware mengunci semua berkas penting kita',
      'lakukan backup berkas secara rutin ke flashdisk',
      'jangan pernah membayar uang tebusan ke siber kriminal'
    ]
  },
  {
    name: 'Spam Bot Overlord (Raja Spam Iklan)',
    maxHp: 200,
    hp: 200,
    sprite: '🤖',
    sentences: [
      'pesan spam memenuhi kotak masuk surel email kita',
      'gunakan kata sandi rumit gabungan huruf dan angka',
      'aktifkan otentikasi dua faktor di semua akun sosial media'
    ]
  },
  {
    name: 'Phishing Shark (Hiu Pencuri Identitas)',
    maxHp: 250,
    hp: 250,
    sprite: '🦈',
    sentences: [
      'waspadai situs web palsu yang meniru halaman login bank',
      'periksa alamat URL dengan teliti sebelum memasukkan password',
      'instansi resmi tidak akan meminta kode rahasia lewat chat'
    ]
  },
  {
    name: 'The Dark Web Kraken (Legenda Kegelapan)',
    maxHp: 400,
    hp: 400,
    sprite: '🐙',
    sentences: [
      'menerapkan enkripsi end-to-end melindungi privasi percakapan digital kita',
      'firewall bertugas memfilter lalu lintas data yang masuk dan keluar jaringan',
      'kesadaran pengguna adalah benteng pertahanan terkuat dalam keamanan sistem komputer'
    ]
  }
];

export const TypingHeroGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [currentEnemyIdx, setCurrentEnemyIdx] = useState(0);
  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [combo, setCombo] = useState(0);
  const [points, setPoints] = useState(0);
  const [bossAttackTimer, setBossAttackTimer] = useState(10); // Seconds to type the sentence before boss hits

  const inputRef = useRef<HTMLInputElement | null>(null);

  const enemy = ENEMY_POOL[currentEnemyIdx];
  const activeSentence = sentences[currentSentenceIdx] || '';

  useEffect(() => {
    if (gameState === 'playing') {
      setSentences(enemy.sentences);
      setEnemyHp(enemy.maxHp);
      setCurrentSentenceIdx(0);
      setInputValue('');
      setBossAttackTimer(12 - currentEnemyIdx * 2); // gets faster
    }
  }, [currentEnemyIdx, gameState]);

  // Boss attack clock tick
  useEffect(() => {
    if (gameState !== 'playing') return;

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
      setBossAttackTimer(12 - currentEnemyIdx * 2); // reset timer
      return;
    }

    const interval = setTimeout(() => {
      setBossAttackTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [bossAttackTimer, gameState]);

  const handleStartGame = () => {
    setHeroHp(100);
    setCurrentEnemyIdx(0);
    setCombo(0);
    setPoints(0);
    setGameState('playing');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
      setPoints((prev) => prev + 100 + combo * 10);
      setInputValue('');

      // Advance sentence or reset
      if (currentSentenceIdx + 1 < sentences.length) {
        setCurrentSentenceIdx((prev) => prev + 1);
        setBossAttackTimer(12 - currentEnemyIdx * 2); // reset timer for next sentence
      } else {
        // Loop back or reset
        setCurrentSentenceIdx(0);
      }
    }
  };

  const handleEnemyDefeated = () => {
    showSuccess(`Luar biasa! Kamu berhasil membasmi ${enemy.name}!`);
    setHeroHp((prev) => Math.min(100, prev + 30)); // heal on victory
    
    if (currentEnemyIdx + 1 < ENEMY_POOL.length) {
      setCurrentEnemyIdx((prev) => prev + 1);
    } else {
      handleGameVictory();
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const handleGameVictory = () => {
    setGameState('victory');

    if (currentUser) {
      const rewardPoints = 90;
      recordGameScore('Petualangan Mengetik RPG', currentUser.id, points, rewardPoints);
      refreshUser();
      showStarReward(
        9,
        `Kemenangan Besar! Kamu membasmi semua malware komputer dan mendapat +90 Poin (+9 ★ Bintang)!`,
        'Penyelamat Siber Cilik'
      );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Petualangan Mengetik RPG (*Typing Hero*)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gunakan kecepatan mengetikmu untuk mengalahkan malware siber yang menyerang sistem lab sekolah!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 font-bold text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              Skor: <span className="font-mono text-sm">{points}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300">
              Combo: <span className="font-mono text-sm">x{combo}</span>
            </span>
          </div>
        )}
      </div>

      {gameState === 'intro' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center animate-bounce">
            <Sword className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Jadilah Kesatria Pelindung Komputer!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistem sekolah sedang diserang oleh virus berbahaya! Ketik seluruh naskah siber dengan cepat untuk melakukan tebasan pedang pelindung dan selamatkan sistem lab!
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Pertempuran</span>
          </button>
        </div>
      ) : gameState === 'gameover' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Sistem Komputer Rusak (HP Habis)!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Jangan menyerah! Latihan mengetik 10 jari secara konsisten akan meningkatkan kecepatan menangkismu.
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : gameState === 'victory' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center animate-bounce">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Sistem Bersih! Semua Malware Lenyap!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Skor Pertempuran: <span className="font-bold text-rose-600 dark:text-rose-400 text-lg">{points} Poin</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sangat mengesankan! Sekarang kamu dinobatkan sebagai Kesatria Keamanan Siber tingkat sekolah.
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Pertempuran Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Battle Arena visual map */}
          <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden h-64 border border-slate-800">
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
                  <span>HP: {heroHp}/100</span>
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
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-400 font-bold">
                Waktu Serang: {bossAttackTimer}s
              </div>
            </div>

            {/* Right side: Enemy Status */}
            <div className="flex flex-col items-center md:items-end space-y-2 z-10">
              <div className="text-xs font-bold text-red-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>{enemy.name}</span>
              </div>
              <div className="text-5xl animate-bounce">{enemy.sprite}</div>

              {/* HP Bar */}
              <div className="w-48 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span>HP: {enemyHp}/{enemy.maxHp}</span>
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
          <div className="md:col-span-12 flex flex-col items-center space-y-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="text-center space-y-1.5 w-full">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Ketik kalimat di bawah ini secara tepat dan cepat:
              </span>
              <p className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-6 py-3 rounded-xl border border-indigo-100 dark:border-indigo-900 select-none">
                {activeSentence}
              </p>
            </div>

            <div className="w-full max-w-lg">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Mulai ketik kalimat di atas untuk menyerang monster..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm text-center font-mono focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40 outline-hidden"
              />
            </div>

            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Gunakan tanda spasi dan huruf kecil sesuai kalimat panduan untuk melakukan tebasan pedang siber sempurna!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
