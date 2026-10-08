import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Flame,
  Gamepad2,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints, recordGameScore } from '../../services/storageService';

const COMPUTER_WORDS = [
  'mouse', 'keyboard', 'monitor', 'cpu', 'printer', 'scanner', 'folder', 'windows', 'internet', 'browser',
  'hardware', 'software', 'aplikasi', 'bintang', 'koding', 'flashdisk', 'laptop', 'speaker', 'webcam', 'program',
  'file', 'tabel', 'dokumen', 'paragraf', 'simpan', 'salin', 'tempel', 'layar', 'tombol', 'data',
  'algoritma', 'variabel', 'database', 'network', 'firewall', 'encryption', 'processor', 'motherboard', 'graphics', 'cloud',
  'server', 'client', 'protocol', 'bandwidth', 'resolution', 'binary', 'bitrate', 'compiler', 'debugger', 'interface',
  'joystick', 'mainboard', 'modem', 'phishing', 'quadcore', 'router', 'soundcard', 'terabyte', 'ultrabook', 'virtual',
  'wireless', 'zipdrive', 'backdoor', 'caching', 'defragment', 'ethernet', 'gigahertz', 'hyperlink', 'installer', 'kernel'
];

interface FallingWord {
  id: number;
  text: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 0% to 100%
  speed: number;
  color: string;
}

const COLORS = [
  'text-indigo-600 dark:text-indigo-400 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/80',
  'text-emerald-600 dark:text-emerald-400 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
  'text-amber-600 dark:text-amber-400 border-amber-400 bg-amber-50 dark:bg-amber-950/80',
  'text-sky-600 dark:text-sky-400 border-sky-400 bg-sky-50 dark:bg-sky-950/80',
  'text-purple-600 dark:text-purple-400 border-purple-400 bg-purple-50 dark:bg-purple-950/80',
];

export const FallingWordsGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const nextWordId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when playing
  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
  }, [gameState]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Spawn words interval
    const spawnInterval = setInterval(() => {
      setWords((prev) => {
        if (prev.length >= 5) return prev; // max concurrent words
        const randomText = COMPUTER_WORDS[Math.floor(Math.random() * COMPUTER_WORDS.length)];
        const randomX = Math.floor(Math.random() * 75) + 8; // 8% to 83%
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const baseSpeed = 0.4 + level * 0.12;

        const newWord: FallingWord = {
          id: nextWordId.current++,
          text: randomText,
          x: randomX,
          y: 0,
          speed: baseSpeed,
          color: randomColor,
        };

        return [...prev, newWord];
      });
    }, Math.max(1200, 2400 - level * 200));

    // Fall animation interval
    const fallInterval = setInterval(() => {
      setWords((prev) => {
        const nextWords: FallingWord[] = [];
        let lostLife = false;

        prev.forEach((word) => {
          const nextY = word.y + word.speed;
          if (nextY >= 92) {
            // Word hit bottom
            lostLife = true;
          } else {
            nextWords.push({ ...word, y: nextY });
          }
        });

        if (lostLife) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              handleGameOver();
            }
            return Math.max(0, nextL);
          });
          setStreak(0);
        }

        return nextWords;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [gameState, level]);

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setLevel(1);
    setWords([]);
    setInputValue('');
  };

  const handleGameOver = () => {
    setGameState('gameover');

    // If current student, award points and record score
    if (currentUser) {
      recordGameScore(currentUser.id, score);
      const earnedPoints = Math.round(score / 5);
      if (earnedPoints > 0) {
        const starsEarned = Math.max(1, Math.floor(earnedPoints / 10));
        awardStudentPoints(currentUser.id, earnedPoints);
        refreshUser();
        showStarReward(
          starsEarned,
          `Game selesai! Skor Anda: ${score}. Anda meraih +${earnedPoints} Poin (+${starsEarned} Bintang)!`,
          'Bintang Game Kata Jatuh!'
        );
      }
    }
  };

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent pasting multi-character string
    if (e.target.value.length - inputValue.length > 1) {
      if (inputRef.current) inputRef.current.value = inputValue;
      return;
    }

    const val = e.target.value.toLowerCase().trim();
    setInputValue(e.target.value);

    // Check if any word matches
    const matchedIndex = words.findIndex((w) => w.text.toLowerCase() === val);
    if (matchedIndex !== -1) {
      // Correct word typed!
      const matched = words[matchedIndex];
      setWords((prev) => prev.filter((w) => w.id !== matched.id));
      setInputValue('');

      const pointsForWord = 10 + streak * 2;
      setScore((s) => {
        const newScore = s + pointsForWord;
        // Level up every 60 points
        const newLevel = Math.floor(newScore / 60) + 1;
        if (newLevel !== level) {
          setLevel(newLevel);
        }
        return newScore;
      });

      setStreak((st) => {
        const nextSt = st + 1;
        if (nextSt > maxStreak) setMaxStreak(nextSt);
        return nextSt;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Gamepad2 className="w-4 h-4" />
              Game Edukasi Mengetik Cepat
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">Level {level}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Ketik Cepat Ceria (Falling Words)
          </h2>
          <p className="text-xs text-slate-500">
            Ketik kata-kata komputer yang berjatuhan sebelum menyentuh batas bawah untuk meraih skor tertinggi!
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={soundEnabled ? 'Efek Suara Aktif' : 'Efek Suara Mati'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Stats Badges */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {score} Pts
              </span>
            </div>

            <div className="px-3 py-1 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Arena Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 overflow-hidden shadow-inner flex flex-col justify-between p-3">
        {/* Combo Streak Indicator */}
        {streak > 1 && (
          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-lg animate-bounce flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Combo {streak}x!</span>
          </div>
        )}

        {/* Falling Words */}
        {gameState === 'playing' && (
          <div className="relative w-full h-full">
            {words.map((w) => (
              <div
                key={w.id}
                className={`absolute px-2.5 py-1 rounded-lg border text-xs font-bold shadow-md transition-all ${w.color}`}
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {w.text}
              </div>
            ))}
          </div>
        )}

        {/* Danger Bottom Boundary Line */}
        <div className="w-full border-b-2 border-dashed border-rose-500/60 text-center">
          <span className="text-[9px] uppercase font-bold text-rose-400/80 tracking-widest">
            Batas Bawah
          </span>
        </div>

        {/* Idle Start Screen Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Ketik Cepat Ceria</h3>
              <p className="text-xs text-slate-300 max-w-sm mt-1">
                Latih kelincahan jari mengetik kata-kata istilah komputer. Raih combo beruntun untuk melipatgandakan poin bintangmu!
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Bermain</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xl">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Permainan Selesai!</h3>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-xs text-slate-300">
                  Skor Akhir: <strong className="text-amber-400 font-mono text-base">{score}</strong> Poin
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300">
                  Max Combo: <strong className="text-indigo-400">{maxStreak}x</strong>
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-2">
                +{Math.round(score / 5)} Poin Bintang ditambahkan ke profil Anda!
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Bar & Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            disabled={gameState !== 'playing'}
            value={inputValue}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && ['v', 'V'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder={
              gameState === 'playing'
                ? 'Ketik kata yang jatuh di sini lalu tekan Spasi/cocokkan...'
                : 'Tekan Mulai Bermain di atas untuk memulai...'
            }
            className="w-full px-4 py-3 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
          />
        </div>

        {gameState === 'playing' ? (
          <button
            onClick={() => setGameState('gameover')}
            className="px-4 py-3 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-100 transition-colors"
          >
            Akhiri
          </button>
        ) : (
          <button
            onClick={handleStartGame}
            className="px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai</span>
          </button>
        )}
      </div>
    </div>
  );
};
