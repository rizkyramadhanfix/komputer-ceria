import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Zap,
  Users,
  XCircle,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { awardStudentPoints } from '../../services/storageService';
import { createBattleChallenge, subscribeToActiveBattle, updateBattleState, cancelChallenge } from '../../services/battleService';
import { GameBattle, User } from '../../types';

const RACE_TEXTS = [
  'komputer adalah alat elektronik yang dapat mengolah data menjadi informasi bermanfaat untuk manusia',
  'keyboard dan mouse digunakan untuk memberikan perintah serta mengetik teks naskah dengan rapi',
  'layar monitor menampilkan gambar berwarna cerah dengan resolusi tinggi yang nyaman untuk belajar',
  'internet sehat membantu kita mencari ilmu pengetahuan dan belajar coding dengan gembira di sekolah',
  'algoritma adalah urutan langkah logis yang tersusun secara sistematis untuk menyelesaikan masalah',
  'perangkat keras komputer terdiri dari komponen fisik seperti prosesor memori dan kartu grafis yang canggih',
  'pemrograman adalah proses menulis instruksi untuk komputer agar dapat menjalankan tugas tertentu secara otomatis',
  'teknologi informasi berkembang sangat pesat sehingga kita harus terus belajar untuk mengikuti perkembangan zaman',
  'keamanan siber sangat penting untuk melindungi data pribadi kita dari akses orang yang tidak bertanggung jawab',
  'kecerdasan buatan atau artificial intelligence mulai banyak digunakan dalam berbagai aplikasi kehidupan sehari hari',
  'jaringan komputer memungkinkan kita untuk berkomunikasi dan berbagi sumber daya secara efisien di seluruh dunia',
  'sistem operasi mengelola sumber daya perangkat keras dan menyediakan layanan umum untuk program komputer lainnya',
  'basis data adalah kumpulan informasi yang terorganisir sehingga dapat dengan mudah diakses dan dikelola dengan cepat',
  'etika dalam menggunakan internet harus selalu dijaga agar tercipta lingkungan digital yang aman dan nyaman bagi semua',
  'berpikir komputasional adalah metode penyelesaian masalah dengan menerapkan teknik ilmu komputer seperti dekomposisi'
];

interface Racer {
  id: string;
  name: string;
  avatar: string;
  targetWpm: number;
  progress: number; // 0 - 100
  color: string;
  isPlayer: boolean;
}

interface TypingRaceGameProps {
  battleId?: string | null;
  onCloseBattle?: () => void;
}

export const TypingRaceGame: React.FC<TypingRaceGameProps> = ({
  battleId = null,
  onCloseBattle
}) => {
  const { currentUser, users, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo, showStarReward } = useToast();

  const [raceState, setRaceState] = useState<'idle' | 'countdown' | 'racing' | 'finished' | 'waiting_opponent'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [targetText, setTargetText] = useState(RACE_TEXTS[0]);
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playerWpm, setPlayerWpm] = useState(0);
  const [playerAccuracy, setPlayerAccuracy] = useState(100);
  const [finishRank, setFinishRank] = useState<number | null>(null);

  const [activeBattle, setActiveBattle] = useState<GameBattle | null>(null);
  const [localBattleId, setLocalBattleId] = useState<string | null>(null);
  const effectiveBattleId = battleId || localBattleId;
  const [isMultiplayer, setIsMultiplayer] = useState(!!effectiveBattleId);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengingUser, setChallengingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [racers, setRacers] = useState<Racer[]>([
    {
      id: 'player',
      name: currentUser?.name || 'Kamu (Siswa)',
      avatar: '🏎️',
      targetWpm: 0,
      progress: 0,
      color: 'bg-indigo-600',
      isPlayer: true,
    },
    {
      id: 'bot-1',
      name: 'Bot Kura-kura 🐢',
      avatar: '🐢',
      targetWpm: 18,
      progress: 0,
      color: 'bg-emerald-600',
      isPlayer: false,
    },
    {
      id: 'bot-2',
      name: 'Bot Kelinci 🐰',
      avatar: '🐰',
      targetWpm: 32,
      progress: 0,
      color: 'bg-amber-600',
      isPlayer: false,
    },
    {
      id: 'bot-3',
      name: 'Bot Cheetah 🐆',
      avatar: '🐆',
      targetWpm: 46,
      progress: 0,
      color: 'bg-rose-600',
      isPlayer: false,
    },
  ]);

  // Battle subscription
  useEffect(() => {
    if (!effectiveBattleId || !currentUser) return;

    const unsubscribe = subscribeToActiveBattle(effectiveBattleId, (battle) => {
      if (!battle) return;
      setActiveBattle(battle);
      setIsMultiplayer(true);

      // Sync typing text
      if (battle.typingText) {
        setTargetText(battle.typingText);
      }
      
      if (battle.status === 'active' && (raceState === 'idle' || raceState === 'waiting_opponent')) {
        setRaceState('countdown');
        setCountdown(3);
        setTypedInput('');
        setPlayerWpm(0);
        setPlayerAccuracy(100);
        setFinishRank(null);
        showSuccess('Tantangan diterima! Balapan dimulai dalam 3 detik! 🏁', 'Balapan Dimulai');
      }

      if (battle.status === 'cancelled') {
        showInfo('Tantangan balapan dibatalkan atau ditolak.', 'Balapan Selesai');
        setRaceState('idle');
        setIsMultiplayer(false);
        setLocalBattleId(null);
        onCloseBattle?.();
      }

      if (battle.status === 'finished' && raceState !== 'finished') {
        setRaceState('finished');
      }

      // Sync racers progress
      const isChallenger = battle.challengerId === currentUser.id;
      
      setRacers([
        {
          id: battle.challengerId,
          name: battle.challengerName + (isChallenger ? ' (Kamu)' : ''),
          avatar: '🏎️',
          targetWpm: 0,
          progress: battle.challengerProgress || 0,
          color: 'bg-indigo-600',
          isPlayer: isChallenger,
        },
        {
          id: battle.opponentId,
          name: battle.opponentName + (!isChallenger ? ' (Kamu)' : ''),
          avatar: '🏎️',
          targetWpm: 0,
          progress: battle.opponentProgress || 0,
          color: 'bg-rose-600',
          isPlayer: !isChallenger,
        }
      ]);
    });

    return () => unsubscribe();
  }, [effectiveBattleId, currentUser, raceState]);

  const handleChallenge = async (student: User) => {
    if (!currentUser) return;
    try {
      const randomText = RACE_TEXTS[Math.floor(Math.random() * RACE_TEXTS.length)];
      setTargetText(randomText);
      const newBattleId = await createBattleChallenge(currentUser, student, 'typing_race', { typingText: randomText });
      setLocalBattleId(newBattleId);
      setChallengingUser(student);
      setIsMultiplayer(true);
      setRaceState('waiting_opponent');
      setShowChallengeModal(false);
      showInfo(`Tantangan balap dikirim ke ${student.name}. Menunggu teman...`, 'Balap Dikirim');
    } catch (err) {
      showError('Gagal mengirim tantangan balap.');
    }
  };

  const startRace = () => {
    if (isMultiplayer && activeBattle) {
      // In multiplayer, challenger usually triggers start or both wait for active
      return;
    }
    const randomText = RACE_TEXTS[Math.floor(Math.random() * RACE_TEXTS.length)];
    setTargetText(randomText);
    setTypedInput('');
    setPlayerWpm(0);
    setPlayerAccuracy(100);
    setFinishRank(null);
    setRaceState('countdown');
    setCountdown(3);

    setRacers([
      {
        id: 'player',
        name: currentUser?.name || 'Kamu (Siswa)',
        avatar: '🏎️',
        targetWpm: 0,
        progress: 0,
        color: 'bg-indigo-600',
        isPlayer: true,
      },
      {
        id: 'bot-1',
        name: 'Bot Kura-kura 🐢',
        avatar: '🐢',
        targetWpm: 18,
        progress: 0,
        color: 'bg-emerald-600',
        isPlayer: false,
      },
      {
        id: 'bot-2',
        name: 'Bot Kelinci 🐰',
        avatar: '🐰',
        targetWpm: 32,
        progress: 0,
        color: 'bg-amber-600',
        isPlayer: false,
      },
      {
        id: 'bot-3',
        name: 'Bot Cheetah 🐆',
        avatar: '🐆',
        targetWpm: 46,
        progress: 0,
        color: 'bg-rose-600',
        isPlayer: false,
      },
    ]);
  };

  // Countdown timer effect
  useEffect(() => {
    if (raceState === 'countdown') {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setRaceState('racing');
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [raceState, countdown]);

  // Bot movement effect during race - ONLY if NOT multiplayer
  useEffect(() => {
    if (isMultiplayer || raceState !== 'racing' || !startTime) return;

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const totalWords = targetText.split(' ').length;

      setRacers((prev) =>
        prev.map((racer) => {
          if (racer.isPlayer) return racer;
          // Calculate bot progress based on target WPM
          const wordsPerSec = racer.targetWpm / 60;
          const wordsDone = wordsPerSec * elapsedSeconds;
          const progress = Math.min(100, Math.round((wordsDone / totalWords) * 100));
          return { ...racer, progress };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [raceState, startTime, targetText]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (raceState !== 'racing') return;

    const val = e.target.value;
    setTypedInput(val);

    // Calculate player progress
    let matchCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        matchCount++;
      }
    }

    const progress = Math.min(100, Math.round((val.length / targetText.length) * 100));

    if (isMultiplayer && effectiveBattleId && currentUser) {
      const isChallenger = activeBattle?.challengerId === currentUser.id;
      const updates: any = isChallenger ? { challengerProgress: progress } : { opponentProgress: progress };
      updateBattleState(effectiveBattleId, updates);
    }

    // Calculate live WPM
    if (startTime) {
      const minutes = Math.max(0.05, (Date.now() - startTime) / 60000);
      const words = val.trim().split(/\s+/).length;
      setPlayerWpm(Math.round(words / minutes));
    }

    const acc = val.length > 0 ? Math.round((matchCount / val.length) * 100) : 100;
    setPlayerAccuracy(acc);

    setRacers((prev) =>
      prev.map((r) => (r.isPlayer ? { ...r, progress } : r))
    );

    // Check finished
    if (val === targetText) {
      if (isMultiplayer && effectiveBattleId && currentUser) {
         const isChallenger = activeBattle?.challengerId === currentUser.id;
         const opponentProgress = isChallenger ? (activeBattle?.opponentProgress || 0) : (activeBattle?.challengerProgress || 0);
         const rank = opponentProgress >= 100 ? 2 : 1;
         setFinishRank(rank);
         
         // Update battle status if we are the winner or both finished
         if (rank === 1) {
            updateBattleState(effectiveBattleId, { winnerId: currentUser.id });
         }
         
         if (opponentProgress >= 100) {
            updateBattleState(effectiveBattleId, { status: 'finished' });
         }
         
         const rewardPoints = rank === 1 ? 75 : 40;
         const starsEarned = Math.max(1, Math.floor(rewardPoints / 10));
         awardStudentPoints(currentUser.id, rewardPoints);
         refreshUser();
         showStarReward(starsEarned, `Balapan Multiplayer Selesai! Kamu Juara #${rank}!`, 'Hasil Duel Balap');
      } else {
        setRaceState('finished');
        // Determine rank
        const botProgresses = racers.filter((r) => !r.isPlayer).map((r) => r.progress);
        const botsAhead = botProgresses.filter((p) => p >= 100).length;
        const rank = botsAhead + 1;
        setFinishRank(rank);

        const rewardPoints = rank === 1 ? 75 : rank === 2 ? 50 : 30;
        const starsEarned = Math.max(1, Math.floor(rewardPoints / 10));
        if (currentUser) {
          awardStudentPoints(currentUser.id, rewardPoints);
          refreshUser();
        }
        showStarReward(
          starsEarned,
          `Finis di Juara #${rank}! Kamu mendapatkan +${rewardPoints} Poin (+${starsEarned} Bintang)!`,
          'Bintang Balap Ketik!'
        );
      }
      
      setRaceState('finished');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1">
              <Flame className="w-4 h-4" />
              Arena Balap Mengetik Multi-Bot
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              Uji Kecepatan Jari & Raih Podium #1
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Balap Mengetik Cepat (Typing Grand Prix)
          </h2>
          <p className="text-xs text-slate-500">
            Ketik kalimat di bawah ini secepat mungkin untuk memajukan mobilmu dan mengalahkan bot lawan!
          </p>
        </div>

        <div>
          {raceState === 'idle' || raceState === 'finished' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowChallengeModal(true)}
                className="px-4 py-2.5 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Duel Teman</span>
              </button>
              <button
                type="button"
                onClick={startRace}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer animate-pulse"
              >
                <Play className="w-4 h-4" />
                <span>{raceState === 'finished' ? 'Balapan Lagi' : 'Mulai Balapan'}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRaceState('idle')}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hentikan
            </button>
          )}
        </div>
      </div>

      {/* Waiting Opponent Screen */}
      {raceState === 'waiting_opponent' && (
        <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 space-y-4">
          <div className="flex justify-center">
            <Avatar src={challengingUser?.avatarUrl || activeBattle?.opponentAvatar} name={challengingUser?.name || activeBattle?.opponentName || 'Lawan'} size="xl" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Menunggu {challengingUser?.name || activeBattle?.opponentName || 'Lawan'}...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Tantangan balapan sudah dikirim ke temanmu. Begitu ia menekan 'Terima & Duel', balapan akan otomatis dimulai!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (effectiveBattleId) cancelChallenge(effectiveBattleId);
              setRaceState('idle');
              setIsMultiplayer(false);
              setLocalBattleId(null);
              onCloseBattle?.();
            }}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
          >
            Batalkan Tantangan
          </button>
        </div>
      )}

      {/* Racetrack Visualizer */}
      <div className="p-4 sm:p-6 bg-slate-950 rounded-2xl border-2 border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-3">
          {racers.map((racer) => (
            <div key={racer.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">{racer.avatar}</span>
                  <span className={racer.isPlayer ? 'font-bold text-pink-400' : ''}>
                    {racer.name}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {racer.progress}% {racer.isPlayer && `(${playerWpm} WPM)`}
                </span>
              </div>

              {/* Track Lane */}
              <div className="relative h-9 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center px-2">
                {/* Finish Line Checkered Pattern */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-60" />

                {/* Racer Vehicle on Track */}
                <div
                  className="absolute transition-all duration-200 flex items-center gap-1"
                  style={{ left: `calc(${Math.min(92, racer.progress)}%)` }}
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${racer.color} text-white flex items-center justify-center text-sm shadow-md`}
                  >
                    {racer.avatar}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown Display Modal */}
      {raceState === 'countdown' && (
        <div className="py-8 text-center space-y-2 animate-in fade-in">
          <span className="text-5xl font-black text-pink-600 dark:text-pink-400 animate-bounce block">
            {countdown > 0 ? countdown : 'GASSS! 🏁'}
          </span>
          <p className="text-xs text-slate-500">Bersiaplah mengetik dengan 10 jari...</p>
        </div>
      )}

      {/* Active Race Typing Arena */}
      {(raceState === 'racing' || raceState === 'finished') && (
        <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          {/* Target Text with Highlighted Typed Chars */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm sm:text-base leading-relaxed font-mono select-none">
            {targetText.split('').map((char, idx) => {
              let colorClass = 'text-slate-400';
              if (idx < typedInput.length) {
                colorClass =
                  typedInput[idx] === char
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60'
                    : 'text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-950/60';
              } else if (idx === typedInput.length) {
                colorClass = 'text-slate-900 dark:text-white bg-pink-200 dark:bg-pink-900 underline';
              }
              return (
                <span key={idx} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Input */}
          <input
            ref={inputRef}
            type="text"
            disabled={raceState === 'finished'}
            value={typedInput}
            onChange={handleInputChange}
            placeholder={
              raceState === 'finished' ? 'Balapan selesai!' : 'Ketik kalimat di atas di sini...'
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          />

          {/* Live Race Metrics */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>
                Kecepatan:{' '}
                <strong className="text-slate-900 dark:text-white font-mono">
                  {playerWpm} WPM
                </strong>
              </span>
            </span>

            <span>
              Akurasi:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                {playerAccuracy}%
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Finished Podium Dialog */}
      {raceState === 'finished' && finishRank && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/40 rounded-2xl border border-amber-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {finishRank === 1
                  ? '🏆 JUARA #1 - PODIUM EMAS!'
                  : finishRank === 2
                  ? '🥈 JUARA #2 - PODIUM PERAK!'
                  : '🥉 JUARA #3 - PODIUM PERUNGGU!'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Kecepatan akhirmu: <strong>{playerWpm} WPM</strong> dengan akurasi{' '}
                <strong>{playerAccuracy}%</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={startRace}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Balapan Lagi 🏎️
            </button>
            {isMultiplayer && (
              <button
                onClick={() => {
                  if (onCloseBattle) onCloseBattle();
                  setRaceState('idle');
                  setIsMultiplayer(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Selesai
              </button>
            )}
          </div>
        </div>
      )}

      {/* Challenge Friend Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                 <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">Tantang Duel Balap</h3>
                 </div>
                 <button onClick={() => { setShowChallengeModal(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <XCircle className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                       type="text"
                       placeholder="Cari nama siswa..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                 </div>
              </div>
              
              <div className="p-4 overflow-y-auto custom-scrollbar space-y-3">
                 <p className="text-[11px] text-slate-500 mb-2">Pilih siswa yang ingin kamu tantang berduel balap ketik real-time:</p>
                 
                 {users.filter(u => 
                    u.role === 'student' && 
                    u.id !== currentUser?.id && 
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                 ).length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                       {searchQuery ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada siswa lain yang terdaftar.'}
                    </div>
                 ) : (
                    users.filter(u => 
                       u.role === 'student' && 
                       u.id !== currentUser?.id && 
                       u.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(student => (
                       <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                             <Avatar src={student.avatarUrl} name={student.name} size="sm" />
                             <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</p>
                                <p className="text-[10px] text-slate-500">{student.school || 'Sekolah'} · {student.grade || 'Kelas'}</p>
                             </div>
                          </div>
                          <button
                            onClick={() => handleChallenge(student)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
                          >
                             Tantang
                          </button>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
