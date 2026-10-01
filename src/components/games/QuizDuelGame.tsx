import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Play, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Users, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  Hourglass,
  HelpCircle,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { recordGameScore, isStudentOnline } from '../../services/storageService';
import { createBattleChallenge, subscribeToActiveBattle, updateBattleState, cancelChallenge } from '../../services/battleService';
import { GameBattle, User } from '../../types';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

const COMPUTER_DUEL_QUESTIONS: Question[] = [
  {
    q: 'Manakah di bawah ini yang merupakan otak atau pusat pemroses data pada komputer?',
    options: ['Monitor', 'Keyboard', 'Processor (CPU)', 'Printer'],
    correct: 2
  },
  {
    q: 'Pintasan tombol keyboard (Shortcut) manakah yang digunakan untuk MENYALIN (Copy) teks?',
    options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + S'],
    correct: 0
  },
  {
    q: 'Perangkat keras mana yang berfungsi untuk menyimpan file dokumen secara permanen?',
    options: ['RAM', 'Harddisk / SSD', 'Power Supply', 'Prosesor'],
    correct: 1
  },
  {
    q: 'Apakah fungsi utama dari perangkat keras bernama Mouse?',
    options: ['Menampilkan gambar', 'Mencetak laporan', 'Menggerakkan kursor', 'Mengeluarkan suara'],
    correct: 2
  },
  {
    q: 'Apakah yang dimaksud dengan software (Perangkat Lunak)?',
    options: ['Bagian fisik komputer', 'Aplikasi/Program komputer', 'Kabel listrik', 'Meja komputer'],
    correct: 1
  },
  {
    q: 'Apa kepanjangan dari RAM dalam sistem komputer?',
    options: ['Random Access Memory', 'Read Active Mainframe', 'Real Air Monitor', 'Rapid Auto Machine'],
    correct: 0
  },
  {
    q: 'Manakah dari berikut ini yang merupakan sistem operasi (OS)?',
    options: ['Google Chrome', 'Microsoft Windows', 'Adobe Photoshop', 'Microsoft Word'],
    correct: 1
  },
  {
    q: 'Bagian komputer mana yang berfungsi untuk menampilkan hasil pengolahan data secara visual?',
    options: ['Speaker', 'Printer', 'Monitor', 'Scanner'],
    correct: 2
  },
  {
    q: 'Manakah yang termasuk perangkat input (masukan)?',
    options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
    correct: 2
  },
  {
    q: 'Simbol "Wi-Fi" pada komputer biasanya digunakan untuk koneksi...',
    options: ['Listrik', 'Internet Nirkabel', 'Suara', 'Pencetakan'],
    correct: 1
  },
  {
    q: 'Tombol "Esc" pada keyboard biasanya digunakan untuk...',
    options: ['Menyimpan data', 'Membatalkan perintah/Keluar', 'Menghapus teks', 'Mencetak'],
    correct: 1
  },
  {
    q: 'Perangkat mana yang digunakan untuk memindai dokumen fisik menjadi gambar digital?',
    options: ['Printer', 'Monitor', 'Scanner', 'Plotter'],
    correct: 2
  },
  {
    q: 'Google Drive dan Dropbox adalah contoh dari layanan...',
    options: ['Penyimpanan Awan (Cloud Storage)', 'Sistem Operasi', 'Perangkat Keras', 'Anti-virus'],
    correct: 0
  },
  {
    q: 'Pintasan Ctrl + Z biasanya digunakan untuk fungsi...',
    options: ['Menyimpan (Save)', 'Membatalkan (Undo)', 'Mencetak (Print)', 'Menutup (Close)'],
    correct: 1
  },
  {
    q: 'Satuan kecepatan prosesor biasanya dinyatakan dalam...',
    options: ['Hertz (GHz/MHz)', 'Byte (GB/MB)', 'Pixel', 'Watt'],
    correct: 0
  }
];

interface QuizDuelGameProps {
  battleId?: string | null;
  onCloseBattle?: () => void;
}

export const QuizDuelGame: React.FC<QuizDuelGameProps> = ({ 
  battleId = null,
  onCloseBattle
}) => {
  const { currentUser, users, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo, showStarReward } = useToast();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'roundover' | 'completed' | 'waiting_opponent'>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const [playerSelected, setPlayerSelected] = useState<number | null>(null);
  const [opponentSelected, setOpponentSelected] = useState<number | null>(null);
  const [botDelayActive, setBotDelayActive] = useState(false);
  const [roundTimer, setRoundTimer] = useState(15);

  const [activeBattle, setActiveBattle] = useState<GameBattle | null>(null);
  const [localBattleId, setLocalBattleId] = useState<string | null>(null);
  const effectiveBattleId = battleId || localBattleId;
  const [isMultiplayer, setIsMultiplayer] = useState(!!effectiveBattleId);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengingUser, setChallengingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  const activeQuestion = sessionQuestions[currentRound] || COMPUTER_DUEL_QUESTIONS[0];

  // Initialize questions once per session
  useEffect(() => {
    const shuffled = [...COMPUTER_DUEL_QUESTIONS].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 5));
  }, []);

  // Round timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (roundTimer <= 0) {
      handleRoundEnd();
      return;
    }

    const timer = setTimeout(() => {
      setRoundTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roundTimer, gameState]);

  // Bot thinking effect - ONLY if NOT multiplayer
  useEffect(() => {
    if (isMultiplayer || gameState !== 'playing' || botDelayActive || opponentSelected !== null) return;

    setBotDelayActive(true);
    // Bot thinks for 2 to 6 seconds
    const thinkTime = 2000 + Math.random() * 4000;
    const timer = setTimeout(() => {
      // Bot has 75% accuracy
      const isCorrect = Math.random() < 0.75;
      if (isCorrect) {
        setOpponentSelected(activeQuestion.correct);
      } else {
        // choose random wrong
        const wrongs = [0, 1, 2, 3].filter((i) => i !== activeQuestion.correct);
        setOpponentSelected(wrongs[Math.floor(Math.random() * wrongs.length)]);
      }
    }, thinkTime);

    return () => clearTimeout(timer);
  }, [currentRound, gameState, isMultiplayer, botDelayActive, opponentSelected, activeQuestion.correct]);

  // End round automatically when both selected
  useEffect(() => {
    if (gameState === 'playing' && playerSelected !== null && opponentSelected !== null) {
      handleRoundEnd();
    }
  }, [playerSelected, opponentSelected, gameState]);

  // Battle subscription
  useEffect(() => {
    if (!effectiveBattleId || !currentUser) return;

    const unsubscribe = subscribeToActiveBattle(effectiveBattleId, (battle) => {
      if (!battle) return;
      setActiveBattle(battle);
      setIsMultiplayer(true);

      // Sync question indices across both players
      if (battle.questionIndices && battle.questionIndices.length > 0) {
        setSessionQuestions(
          battle.questionIndices.map(
            (idx) => COMPUTER_DUEL_QUESTIONS[idx % COMPUTER_DUEL_QUESTIONS.length]
          )
        );
      }
      
      const isChallenger = battle.challengerId === currentUser.id;
      
      // Update local state and detect round advancement across both players
      if (battle.currentRound !== currentRound && battle.status === 'active') {
        setCurrentRound(battle.currentRound);
        setRoundTimer(15);
        setGameState('playing');
        setPlayerSelected(isChallenger ? (battle.challengerSelection ?? null) : (battle.opponentSelection ?? null));
        setOpponentSelected(isChallenger ? (battle.opponentSelection ?? null) : (battle.challengerSelection ?? null));
      } else {
        setOpponentSelected(isChallenger ? (battle.opponentSelection ?? null) : (battle.challengerSelection ?? null));
        setPlayerSelected(isChallenger ? (battle.challengerSelection ?? null) : (battle.opponentSelection ?? null));
      }

      setPlayerScore(isChallenger ? battle.challengerScore : battle.opponentScore);
      setOpponentScore(isChallenger ? battle.opponentScore : battle.challengerScore);

      if (battle.status === 'active' && (gameState === 'intro' || gameState === 'waiting_opponent')) {
        setGameState('playing');
        setRoundTimer(15);
        showSuccess(
          `Duel dimulai! Lawanmu adalah ${isChallenger ? battle.opponentName : battle.challengerName}! 🔥`,
          'Duel Dimulai'
        );
      }

      if (battle.status === 'cancelled') {
        showInfo('Tantangan duel dibatalkan atau ditolak.', 'Duel Selesai');
        setGameState('intro');
        setIsMultiplayer(false);
        setLocalBattleId(null);
        onCloseBattle?.();
      }

      if (battle.status === 'finished' && gameState !== 'completed') {
        setGameState('completed');
      }
    });

    return () => unsubscribe();
  }, [effectiveBattleId, currentUser, gameState]);

  const handleChallenge = async (student: User) => {
    if (!currentUser) return;
    try {
      const newBattleId = await createBattleChallenge(currentUser, student, 'quiz_duel');
      setLocalBattleId(newBattleId);
      setChallengingUser(student);
      setIsMultiplayer(true);
      setGameState('waiting_opponent');
      setShowChallengeModal(false);
      showInfo(`Tantangan dikirim ke ${student.name}. Menunggu teman menerima...`, 'Duel Dikirim');
    } catch (err) {
      showError('Gagal mengirim tantangan.');
    }
  };

  const handleStartDuel = () => {
    if (isMultiplayer && activeBattle) {
      // In multiplayer, just wait for active status
      setGameState('playing');
      return;
    }
    setCurrentRound(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerSelected(null);
    setOpponentSelected(null);
    setBotDelayActive(false);
    setRoundTimer(15);
    setGameState('playing');
  };

  const handlePlayerSelect = async (idx: number) => {
    if (playerSelected !== null || gameState !== 'playing') return;
    setPlayerSelected(idx);

    if (isMultiplayer && effectiveBattleId && currentUser) {
      const isChallenger = activeBattle?.challengerId === currentUser.id;
      const currentScore = isChallenger ? (activeBattle?.challengerScore || 0) : (activeBattle?.opponentScore || 0);
      
      const updates: any = isChallenger ? { challengerSelection: idx } : { opponentSelection: idx };
      
      // Calculate speed-based points immediately
      const earned = activeQuestion.correct === idx ? (100 + roundTimer * 10) : 0;
      if (isChallenger) {
        updates.challengerScore = currentScore + earned;
      } else {
        updates.opponentScore = currentScore + earned;
      }

      await updateBattleState(effectiveBattleId, updates);
    }
  };

  const handleRoundEnd = () => {
    setGameState('roundover');

    if (!isMultiplayer) {
      // Calculate solo score
      if (playerSelected === activeQuestion.correct) {
        const points = 100 + roundTimer * 10;
        setPlayerScore((prev) => prev + points);
      }
      if (opponentSelected === activeQuestion.correct) {
        setOpponentScore((prev) => prev + 120); 
      }
    }
  };

  const handleNextRound = async () => {
    setPlayerSelected(null);
    setOpponentSelected(null);
    setBotDelayActive(false);
    setRoundTimer(15);

    if (currentRound + 1 < sessionQuestions.length) {
      const nextRound = currentRound + 1;
      if (isMultiplayer && effectiveBattleId) {
        await updateBattleState(effectiveBattleId, {
          currentRound: nextRound,
          challengerSelection: null as any,
          opponentSelection: null as any,
        });
      }
      setCurrentRound(nextRound);
      setGameState('playing');
    } else {
      if (isMultiplayer && effectiveBattleId) {
        await updateBattleState(effectiveBattleId, { status: 'finished' });
      }
      handleGameCompleted();
    }
  };

  const handleGameCompleted = () => {
    setGameState('completed');

    if (currentUser) {
      const isWinner = playerScore > opponentScore;
      const rewardPoints = isWinner ? 85 : 45;
      recordGameScore('Kuis Duel Cerdas', currentUser.id, playerScore, rewardPoints);
      refreshUser();

      if (isWinner) {
        showStarReward(
          8,
          `Kemenangan Duel! Kamu mengalahkan ${isMultiplayer ? activeBattle?.challengerId === currentUser.id ? activeBattle?.opponentName : activeBattle?.challengerName : 'Bot Pintar'} dengan skor ${playerScore} vs ${opponentScore} dan mendapat +85 Poin (+8 ★ Bintang)!`,
          'Juara Duel Cerdas Cermat'
        );
      } else {
        showSuccess(`Duel selesai! Skor kamu: ${playerScore}, Skor Lawan: ${opponentScore}. Kerja bagus!`);
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Kuis Duel Cerdas Cermat Komputer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji pemahaman hardware dan software kamu dengan berduel melawan Bot Pintar Komputer!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300">
              Ronde {currentRound + 1} / 5
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300">
              Waktu: <span className="font-mono text-sm">{roundTimer}s</span>
            </span>
          </div>
        )}
      </div>

      {gameState === 'intro' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center animate-bounce">
            <Users className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Pilih Mode Duel Pintar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji pengetahuan komputermu secara cepat! Kamu bisa bertanding melawan Bot atau menantang teman satu sekolahmu secara real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartDuel}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              <span>Lawan Bot Pintar (Solo)</span>
            </button>
            <button
              onClick={() => setShowChallengeModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Tantang Teman (Duel)</span>
            </button>
          </div>
        </div>
      ) : gameState === 'waiting_opponent' ? (
        <div className="py-16 flex flex-col items-center text-center space-y-6">
          <div className="relative">
             <Avatar src={challengingUser?.avatarUrl} name={challengingUser?.name || ''} size="xl" />
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                <Hourglass className="w-4 h-4 text-amber-500 animate-spin" />
             </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Menunggu {challengingUser?.name}...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Tantangan duel sudah dikirim ke temanmu. Duel akan otomatis dimulai setelah ia menerima tantanganmu.
            </p>
          </div>
          <button
            onClick={() => {
              if (effectiveBattleId) cancelChallenge(effectiveBattleId);
              setGameState('intro');
              setIsMultiplayer(false);
              setLocalBattleId(null);
              onCloseBattle?.();
            }}
            className="text-xs font-bold text-slate-500 hover:text-rose-500 hover:underline cursor-pointer"
          >
            Batalkan Tantangan
          </button>
        </div>
      ) : gameState === 'completed' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center animate-pulse">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {playerScore > opponentScore ? '🏆 Hore! Kamu Menang Duel!' : (playerScore < opponentScore ? '🤝 Duel Selesai! Lawan Lebih Unggul!' : '⚖️ Duel Berakhir Seri!')}
            </h4>
            <div className="flex justify-center items-center gap-6 bg-slate-100 dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Kamu</span>
                <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{playerScore}</span>
              </div>
              <div className="text-sm font-black text-slate-300">vs</div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isMultiplayer ? 'Skor Lawan' : 'Skor Bot'}</span>
                <span className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">{opponentScore}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartDuel}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tanding Lagi</span>
            </button>
            {isMultiplayer && (
              <button
                onClick={() => {
                  if (onCloseBattle) onCloseBattle();
                  setGameState('intro');
                  setIsMultiplayer(false);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Kembali ke Menu
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Duel Status Board */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player Side */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-2xl">👦</div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pemain</span>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{currentUser?.name || 'Siswa'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Skor</span>
                <span className="text-sm font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{playerScore}</span>
              </div>
            </div>

            {/* Opponent Side */}
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-indigo-950/20 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isMultiplayer ? (
                   <Avatar src={activeBattle?.challengerId === currentUser?.id ? activeBattle?.opponentAvatar : activeBattle?.challengerAvatar} name="Opponent" size="sm" />
                ) : (
                  <div className="text-2xl">🤖</div>
                )}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Lawan</span>
                  <span className="text-xs font-bold text-purple-900 dark:text-indigo-300">
                    {isMultiplayer 
                      ? (activeBattle?.challengerId === currentUser?.id ? activeBattle?.opponentName : activeBattle?.challengerName)
                      : 'Bot Pintar'
                    }
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Skor</span>
                <span className="text-sm font-mono font-extrabold text-purple-600 dark:text-indigo-400">{opponentScore}</span>
              </div>
            </div>
          </div>

          {/* Current Question */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4">
            <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider block">
              Pertanyaan Ronde {currentRound + 1}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white max-w-xl mx-auto leading-relaxed">
              {activeQuestion.q}
            </h4>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeQuestion.options.map((opt, idx) => {
              const isSelectedByPlayer = playerSelected === idx;
              const isSelectedByOpponent = opponentSelected === idx;
              const isCorrectAnswer = activeQuestion.correct === idx;
              const showResult = gameState === 'roundover';

              let btnStyle = 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80';

              if (showResult) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelectedByPlayer) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                }
              } else if (isSelectedByPlayer) {
                btnStyle = 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handlePlayerSelect(idx)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border text-left text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {/* Indicator icons for selections */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isSelectedByPlayer && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        Kamu
                      </span>
                    )}
                    {isSelectedByOpponent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        {isMultiplayer ? 'Lawan' : 'Bot'}
                      </span>
                    )}
                    {showResult && isCorrectAnswer && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    {showResult && isSelectedByPlayer && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Round Over Actions / Waiting State */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Hourglass className="w-4 h-4 text-slate-400 shrink-0" />
              {playerSelected === null ? (
                <span>Menunggu jawaban Anda...</span>
              ) : (isMultiplayer && opponentSelected === null) ? (
                <span>Menunggu jawaban lawan...</span>
              ) : (!isMultiplayer && opponentSelected === null) ? (
                <span>Bot sedang berpikir...</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ronde selesai! Lihat siapa yang menjawab benar di atas!</span>
              )}
            </div>

            {gameState === 'roundover' && (
              <button
                type="button"
                onClick={handleNextRound}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs cursor-pointer"
              >
                <span>{currentRound + 1 === sessionQuestions.length ? 'Lihat Hasil Akhir' : 'Ronde Berikutnya'}</span>
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
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">Tantang Duel Teman</h3>
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
                       className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    />
                 </div>
              </div>
              
              <div className="p-4 overflow-y-auto custom-scrollbar space-y-3">
                 <p className="text-[11px] text-slate-500 mb-2">Pilih siswa yang sedang <strong>Online / Login</strong> untuk diajak berduel real-time:</p>
                 
                 {users.filter(u => 
                    u.role === 'student' && 
                    u.id !== currentUser?.id && 
                    isStudentOnline(u) &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                 ).length === 0 ? (
                    <div className="py-8 px-4 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                       <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto text-lg font-bold">
                          🟢
                       </div>
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {searchQuery ? 'Tidak ada siswa online yang cocok dengan pencarian.' : 'Belum ada siswa lain yang sedang online / login saat ini.'}
                       </p>
                       <p className="text-[11px] text-slate-500">
                          Kamu tetap bisa berduel melawan <strong>Bot Pintar Komputer</strong> secara langsung!
                       </p>
                    </div>
                 ) : (
                    users.filter(u => 
                       u.role === 'student' && 
                       u.id !== currentUser?.id && 
                       isStudentOnline(u) &&
                       u.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(student => (
                       <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                             <div className="relative">
                               <Avatar src={student.avatarUrl} name={student.name} size="sm" />
                               <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" title="Siswa Online" />
                             </div>
                             <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</p>
                                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full">● Online</span>
                                </div>
                                <p className="text-[10px] text-slate-500">{student.school || 'Sekolah'} · {student.grade || 'Kelas'}</p>
                             </div>
                          </div>
                          <button
                            onClick={() => handleChallenge(student)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
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
