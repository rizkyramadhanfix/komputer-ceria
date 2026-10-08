import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Crown,
  Medal,
  Award,
  ChevronRight,
  Filter,
  Search,
  Keyboard,
  Flame,
  ArrowLeft,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getTypingLeagueTexts,
  getTypingLeagueScores,
  saveTypingLeagueScore,
  getTypingLeagueLeaderboard,
  recordGameScore,
} from '../../services/storageService';
import { TypingLeagueText, TypingLeagueScore } from '../../types';
import { Avatar } from '../common/Avatar';

interface TypingLeagueGameProps {
  onBackToMenu?: () => void;
}

export const TypingLeagueGame: React.FC<TypingLeagueGameProps> = ({ onBackToMenu }) => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo, showWarning, showStarReward } = useToast();

  // Navigation views: 'select-text' | 'racing' | 'game-over' | 'leaderboard'
  const [view, setView] = useState<'select-text' | 'racing' | 'game-over' | 'leaderboard'>('select-text');

  // Text Selection State
  const [texts, setTexts] = useState<TypingLeagueText[]>(() => getTypingLeagueTexts());
  const [selectedText, setSelectedText] = useState<TypingLeagueText | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Game State
  const [typedInput, setTypedInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTime, setTotalTime] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(true);

  // Anti-Cheat / Anti Copy-Paste State
  const [cheatWarning, setCheatWarning] = useState<string | null>(null);
  const [isInputShaking, setIsInputShaking] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAntiCheatWarning = (msg: string) => {
    setCheatWarning(msg);
    setIsInputShaking(true);
    showWarning(msg, 'Anti Copy-Paste Liga');

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setCheatWarning(null);
      setIsInputShaking(false);
    }, 3500);
  };

  // Result State
  const [finalScore, setFinalScore] = useState<TypingLeagueScore | null>(null);

  // Leaderboard Filter State
  const [leaderboardTextFilter, setLeaderboardTextFilter] = useState<string>('ALL');
  const [leaderboardSchoolFilter, setLeaderboardSchoolFilter] = useState<string>('ALL');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  // Reload texts on listener update
  useEffect(() => {
    const handleDataUpdated = () => {
      const updated = getTypingLeagueTexts();
      setTexts(updated);

      // Reset filter/selection if deleted
      if (selectedText && !updated.some((t) => t.id === selectedText.id)) {
        setSelectedText(null);
      }
      if (leaderboardTextFilter !== 'ALL' && !updated.some((t) => t.id === leaderboardTextFilter)) {
        setLeaderboardTextFilter('ALL');
      }
    };
    window.addEventListener('ekskul_data_updated', handleDataUpdated);
    return () => window.removeEventListener('ekskul_data_updated', handleDataUpdated);
  }, [selectedText, leaderboardTextFilter]);

  // Filtered Texts
  const filteredTexts = useMemo(() => {
    return texts.filter((t) => {
      const matchDiff = difficultyFilter === 'ALL' || t.difficulty === difficultyFilter;
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiff && matchSearch;
    });
  }, [texts, difficultyFilter, searchQuery]);

  // Start selected text countdown
  const handleSelectTextToPlay = (text: TypingLeagueText) => {
    setSelectedText(text);
    setTotalTime(text.durationSeconds || 60);
    setTimeLeft(text.durationSeconds || 60);
    setTypedInput('');
    setCombo(0);
    setMaxCombo(0);
    setErrorsCount(0);
    setFinalScore(null);
    setIsStarted(false);
    setStartTime(null);
    setView('racing');
    setCountdown(3);
  };

  // Countdown timer before race
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsStarted(true);
      setStartTime(Date.now());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [countdown]);

  // Game timer countdown
  useEffect(() => {
    if (!isStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  useEffect(() => {
    if (isStarted && timeLeft === 0) {
      finishGame();
    }
  }, [isStarted, timeLeft]);

  // Calculate live stats
  const liveStats = useMemo(() => {
    if (!selectedText || !startTime) {
      return { wpm: 0, accuracy: 100, progress: 0, elapsedSecs: 0 };
    }

    const elapsedMs = Date.now() - startTime;
    const elapsedSecs = Math.max(1, Math.round(elapsedMs / 1000));
    const minutes = Math.max(0.02, elapsedSecs / 60);

    // Calculate correct chars
    let correctCount = 0;
    const targetContent = selectedText.content;
    const inputLen = typedInput.length;

    for (let i = 0; i < inputLen; i++) {
      if (typedInput[i] === targetContent[i]) {
        correctCount++;
      }
    }

    const words = correctCount / 5; // Standard 5 chars = 1 word
    const wpm = Math.max(0, Math.round(words / minutes));
    const accuracy = inputLen > 0 ? Math.round((correctCount / inputLen) * 100) : 100;
    const progress = Math.min(100, Math.round((inputLen / targetContent.length) * 100));

    return { wpm, accuracy, progress, elapsedSecs, correctCount };
  }, [selectedText, typedInput, startTime]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted || !selectedText) return;
    const val = e.target.value;
    const targetContent = selectedText.content;
    const prevLen = typedInput.length;
    const addedChars = val.length - prevLen;

    // ANTI-CHEAT: Reject any multi-character paste or automated batch insertion
    if (addedChars > 1) {
      triggerAntiCheatWarning(
        'Terdeteksi penempelan (paste) teks! Di Liga Mengetik, Anda harus mengetik manual satu per satu huruf dengan keyboard ⌨️'
      );
      if (inputRef.current) {
        inputRef.current.value = typedInput;
      }
      return;
    }

    // Do not allow typing beyond target length
    if (val.length > targetContent.length) return;

    // Check last typed character for streak/combo
    if (val.length > prevLen) {
      const lastChar = val[val.length - 1];
      const expectedChar = targetContent[val.length - 1];
      if (lastChar === expectedChar) {
        setCombo((c) => {
          const next = c + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
      } else {
        setCombo(0);
        setErrorsCount((err) => err + 1);
      }
    }

    setTypedInput(val);

    // Auto finish if completed entire text perfectly
    if (val.length === targetContent.length) {
      finishGame(val);
    }
  };

  // Finish Game
  const finishGame = (overrideInput?: string) => {
    if (!selectedText || !currentUser) return;
    setIsStarted(false);

    const inputToUse = overrideInput !== undefined ? overrideInput : typedInput;
    const targetContent = selectedText.content;
    const elapsedSecs = totalTime - Math.max(0, timeLeft);
    const durationMinutes = Math.max(0.1, elapsedSecs / 60);

    let correctCount = 0;
    for (let i = 0; i < inputToUse.length; i++) {
      if (inputToUse[i] === targetContent[i]) {
        correctCount++;
      }
    }

    const words = correctCount / 5;
    const wpm = Math.max(0, Math.round(words / durationMinutes));
    const accuracy = inputToUse.length > 0 ? Math.round((correctCount / inputToUse.length) * 100) : 100;
    const rawKpm = Math.round((inputToUse.length / durationMinutes));

    // Calculate score: (WPM * 10) * (Accuracy / 100) + Combo bonus
    const accuracyMultiplier = accuracy / 100;
    const comboBonus = Math.min(100, Math.round(maxCombo * 1.5));
    const completionBonus = inputToUse.length === targetContent.length ? 50 : 0;
    const calculatedScore = Math.max(
      10,
      Math.round(wpm * 10 * accuracyMultiplier + comboBonus + completionBonus)
    );

    const starsEarned = Math.max(1, Math.min(10, Math.floor(calculatedScore / 50)));

    const scoreRecord = saveTypingLeagueScore({
      textId: selectedText.id,
      textTitle: selectedText.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatarUrl,
      studentSchool: currentUser.school,
      studentGrade: currentUser.grade,
      equippedFrame: currentUser.equippedFrame,
      equippedTitle: currentUser.equippedTitle,
      equippedBadge: currentUser.equippedBadge,
      wpm,
      accuracy,
      rawKpm,
      errorsCount,
      timeSpentSeconds: elapsedSecs,
      score: calculatedScore,
      starsEarned,
    });

    // Record to general game scores
    recordGameScore('Liga Mengetik Cepat 10 Jari', currentUser.id, calculatedScore);
    refreshUser();

    setFinalScore(scoreRecord);
    setView('game-over');

    if (wpm >= 40 && accuracy >= 95) {
      showStarReward(starsEarned, `Luar biasa! Kecepatan ${wpm} WPM dengan akurasi ${accuracy}% di Liga Mengetik!`, 'Bintang Liga Emas');
    } else {
      showSuccess(`Selesai! Skor Liga: ${calculatedScore} poin (${wpm} WPM, Akurasi ${accuracy}%).`);
    }
  };

  // Leaderboard data
  const leaderboardData = useMemo(() => {
    return getTypingLeagueLeaderboard(leaderboardTextFilter, leaderboardSchoolFilter);
  }, [leaderboardTextFilter, leaderboardSchoolFilter, view]);

  // Render Character Highlighting in Text Arena
  const renderTextDisplay = () => {
    if (!selectedText) return null;
    const targetContent = selectedText.content;
    const inputLen = typedInput.length;

    return (
      <div
        ref={textContainerRef}
        onCopy={(e) => {
          e.preventDefault();
          triggerAntiCheatWarning('Teks naskah Liga Mengetik dilindungi dan tidak dapat disalin (Copy)!');
        }}
        onCut={(e) => {
          e.preventDefault();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          triggerAntiCheatWarning('Klik kanan pada teks naskah dinonaktifkan.');
        }}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        className="text-base sm:text-xl font-mono leading-relaxed p-6 bg-slate-900 text-slate-400 rounded-2xl border-2 border-slate-800 shadow-inner select-none max-h-64 overflow-y-auto custom-scrollbar"
      >
        {targetContent.split('').map((char, idx) => {
          let charClass = 'text-slate-500';
          if (idx < inputLen) {
            if (typedInput[idx] === char) {
              charClass = 'text-emerald-400 font-bold bg-emerald-950/40 rounded-xs';
            } else {
              charClass = 'text-white bg-rose-600 font-bold px-0.5 rounded-xs animate-pulse';
            }
          } else if (idx === inputLen) {
            charClass = 'text-white bg-indigo-600 underline font-bold animate-pulse px-0.5 rounded-xs shadow-[0_0_10px_rgba(99,102,241,0.8)]';
          }
          return (
            <span key={idx} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 rounded-3xl border border-indigo-700/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                Official Arena
              </span>
              <span className="text-xs text-indigo-300">·</span>
              <span className="text-xs font-semibold text-indigo-200">Mengetik Cepat 10 Jari</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              Liga Mengetik Cepat Komputer
            </h1>
            <p className="text-xs text-slate-300">
              Pilih naskah tantangan resmi, salin kalimat dengan akurat & cepat, lalu raih puncak Leaderboard sekolah!
            </p>
          </div>
        </div>

        {/* Action / View Switcher */}
        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            onClick={() => setView('select-text')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'select-text' || view === 'racing' || view === 'game-over'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Keyboard className="w-4 h-4 text-indigo-600" />
            <span>Pilih Naskah</span>
          </button>
          <button
            onClick={() => setView('leaderboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Papan Peringkat</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: SELECT TEXT ================= */}
      {view === 'select-text' && (
        <div className="space-y-6">
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['ALL', 'Mudah', 'Sedang', 'Sulit'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {diff === 'ALL' ? 'Semua Tingkat' : diff}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau isi naskah..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Texts Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTexts.map((textItem) => {
              const wordCount = textItem.content.trim().split(/\s+/).length;
              const scoresForThis = getTypingLeagueScores().filter((s) => s.textId === textItem.id);
              const topScore = scoresForThis.sort((a, b) => b.score - a.score)[0];

              return (
                <div
                  key={textItem.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {textItem.category || 'Materi'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            textItem.difficulty === 'Mudah'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : textItem.difficulty === 'Sedang'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {textItem.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {textItem.durationSeconds}s
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {textItem.title}
                      </h3>
                      <p
                        onCopy={(e) => {
                          e.preventDefault();
                          triggerAntiCheatWarning('Naskah Liga Mengetik dilindungi dan tidak dapat disalin (Copy)!');
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 italic select-none"
                      >
                        "{textItem.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <span>Panjang: <strong className="text-slate-700 dark:text-slate-300">{textItem.content.length} karakter</strong></span>
                      <span>·</span>
                      <span>Kata: <strong className="text-slate-700 dark:text-slate-300">{wordCount} kata</strong></span>
                    </div>

                    {/* Top Record Indicator */}
                    {topScore ? (
                      <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500" />
                          <span className="text-[11px] text-amber-900 dark:text-amber-300 font-bold truncate max-w-[140px]">
                            {topScore.studentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400">
                          <span>{topScore.wpm} WPM</span>
                          <span>·</span>
                          <span>{topScore.score} pt</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                        Belum ada yang mencetak rekor di naskah ini. Jadilah yang pertama!
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSelectTextToPlay(textItem)}
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer group-hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Mulai Bertanding ⚡</span>
                    </button>
                    <button
                      onClick={() => {
                        setLeaderboardTextFilter(textItem.id);
                        setView('leaderboard');
                      }}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 rounded-xl transition-colors cursor-pointer"
                      title="Lihat Papan Peringkat Naskah Ini"
                    >
                      <Trophy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTexts.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl space-y-3">
                <Keyboard className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-bold">Naskah tidak ditemukan.</p>
                <p className="text-xs text-slate-400">Coba ubah filter atau kata kunci pencarian naskah.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: RACING ARENA ================= */}
      {view === 'racing' && selectedText && (
        <div className="space-y-6">
          {/* Arena Top Bar */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('select-text')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Kembali ke Pilihan Naskah"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-indigo-600 dark:text-indigo-400">
                  Naskah: {selectedText.category} · {selectedText.difficulty}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedText.title}
                </h2>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              {/* Anti Copy-Paste Indicator */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl font-mono text-xs font-bold shadow-2xs"
                title="Sistem Proteksi: Fitur Anti Copy-Paste Aktif untuk menjaga kejujuran dan sportivitas perlombaan."
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Anti-Paste Aktif</span>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl font-mono text-xs font-bold">
                <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>{timeLeft}s</span>
              </div>

              {/* Live WPM */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl font-mono text-xs font-bold">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span>{liveStats.wpm} WPM</span>
              </div>

              {/* Live Accuracy */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{liveStats.accuracy}%</span>
              </div>

              {/* Combo Streak */}
              {combo > 5 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-mono text-xs font-black animate-bounce shadow-md">
                  <Flame className="w-4 h-4 fill-slate-950" />
                  <span>{combo} COMBO!</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full transition-all duration-150 rounded-full"
              style={{ width: `${liveStats.progress}%` }}
            />
          </div>

          {/* Countdown Overlay or Active Arena */}
          {countdown !== null ? (
            <div className="p-16 bg-slate-900 text-white rounded-3xl border-2 border-indigo-500/40 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Bersiap Mengetik 10 Jari!
              </span>
              <div className="text-6xl sm:text-8xl font-black font-mono text-amber-400 animate-ping duration-700">
                {countdown === 0 ? 'MULAI!' : countdown}
              </div>
              <p className="text-xs text-slate-400">
                Letakkan jari telunjuk kiri di tombol <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-white border border-slate-700">F</kbd> dan jari telunjuk kanan di tombol <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-white border border-slate-700">J</kbd>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Text Area */}
              {renderTextDisplay()}

              {/* Anti-Cheat Alert Banner */}
              {cheatWarning && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-bounce" />
                  <span className="flex-1">{cheatWarning}</span>
                  <button
                    type="button"
                    onClick={() => setCheatWarning(null)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-extrabold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Protected Typing Input Focus */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={handleInputChange}
                  onPaste={(e) => {
                    e.preventDefault();
                    triggerAntiCheatWarning('Fitur Paste dinonaktifkan! Ketik manual tombol per tombol dengan jemari Anda ⌨️');
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                    triggerAntiCheatWarning('Teks di kolom ketik tidak dapat disalin (Copy).');
                  }}
                  onCut={(e) => {
                    e.preventDefault();
                    triggerAntiCheatWarning('Teks di kolom ketik tidak dapat dipotong (Cut).');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    triggerAntiCheatWarning('Dilarang menarik/menjatuhkan teks ke dalam kotak ketik!');
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    triggerAntiCheatWarning('Menu klik kanan dinonaktifkan untuk mencegah penempelan (paste) teks.');
                  }}
                  onKeyDown={(e) => {
                    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
                    if (isCtrlOrMeta && (e.key === 'v' || e.key === 'V')) {
                      e.preventDefault();
                      triggerAntiCheatWarning('Kombinasi tombol Paste (Ctrl+V / Cmd+V) dinonaktifkan di Liga Mengetik!');
                      return;
                    }
                    if (isCtrlOrMeta && (e.key === 'c' || e.key === 'C')) {
                      e.preventDefault();
                      triggerAntiCheatWarning('Kombinasi tombol Copy dinonaktifkan di Liga Mengetik!');
                      return;
                    }
                    if (isCtrlOrMeta && (e.key === 'x' || e.key === 'X')) {
                      e.preventDefault();
                      triggerAntiCheatWarning('Kombinasi tombol Cut dinonaktifkan di Liga Mengetik!');
                      return;
                    }
                    if (e.shiftKey && e.key === 'Insert') {
                      e.preventDefault();
                      triggerAntiCheatWarning('Shortcut Paste (Shift+Insert) dinonaktifkan!');
                      return;
                    }
                    if (isCtrlOrMeta && e.key === 'Insert') {
                      e.preventDefault();
                      triggerAntiCheatWarning('Shortcut Copy dinonaktifkan!');
                      return;
                    }
                  }}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="Ketik kalimat di atas di sini secepat dan seakurat mungkin (Paste dinonaktifkan)..."
                  className={`w-full p-4 pr-28 text-sm sm:text-base font-mono bg-white dark:bg-slate-900 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 shadow-lg outline-none transition-all ${
                    isInputShaking
                      ? 'border-2 border-rose-500 ring-4 ring-rose-500/30'
                      : 'border-2 border-indigo-500/70 focus:border-indigo-600 ring-4 ring-indigo-500/10'
                  }`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>No Paste</span>
                </div>
              </div>

              {/* 10-Finger Hand Placement Tips Guide */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  <span>
                    Panduan: Jari Kiri (<strong className="text-slate-700 dark:text-slate-300">A-S-D-F</strong>) · Jari Kanan (<strong className="text-slate-700 dark:text-slate-300">J-K-L-;</strong>) · Jempol (<strong className="text-slate-700 dark:text-slate-300">Spasi</strong>)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => finishGame()}
                  className="text-rose-500 hover:text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Selesaikan Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 3: GAME OVER / SCORECARD ================= */}
      {view === 'game-over' && finalScore && selectedText && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              Hasil Liga Mengetik Cepat
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {finalScore.wpm >= 50
                ? '⚡ Master Ketik Kilat Super!'
                : finalScore.wpm >= 30
                ? '🌟 Jemari Hebat & Lincah!'
                : '👍 Kerja Bagus, Terus Berlatih!'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Naskah: <strong>{selectedText.title}</strong>
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Kecepatan</span>
              <span className="text-2xl font-black font-mono text-indigo-950 dark:text-indigo-200">
                {finalScore.wpm}
              </span>
              <span className="text-[10px] text-slate-400 block">WPM</span>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Akurasi</span>
              <span className="text-2xl font-black font-mono text-emerald-950 dark:text-emerald-200">
                {finalScore.accuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block">{finalScore.errorsCount} salah</span>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/60">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">Skor Liga</span>
              <span className="text-2xl font-black font-mono text-amber-950 dark:text-amber-200">
                {finalScore.score}
              </span>
              <span className="text-[10px] text-slate-400 block">Poin Prestasi</span>
            </div>

            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/60">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase block">Bintang</span>
              <span className="text-2xl font-black font-mono text-purple-950 dark:text-purple-200">
                +{finalScore.starsEarned} ★
              </span>
              <span className="text-[10px] text-slate-400 block">Bintang Emas</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleSelectTextToPlay(selectedText)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Lagi Naskah Ini</span>
            </button>
            <button
              onClick={() => setView('select-text')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>Pilih Naskah Lain</span>
            </button>
            <button
              onClick={() => {
                setLeaderboardTextFilter(selectedText.id);
                setView('leaderboard');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Lihat Leaderboard Liga</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: LEADERBOARD ================= */}
      {view === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Papan Peringkat Liga Mengetik 🏆
                </h3>
                <p className="text-xs text-slate-500">
                  Peringkat skor tercepat dan terakurat dari siswa di seluruh sekolah.
                </p>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={leaderboardTextFilter}
                onChange={(e) => setLeaderboardTextFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="ALL">Semua Naskah Lomba</option>
                {texts.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.difficulty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">Rank</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Naskah Tantangan</th>
                  <th className="py-3 px-4">Sekolah & Kelas</th>
                  <th className="py-3 px-4 text-center">WPM</th>
                  <th className="py-3 px-4 text-center">Akurasi</th>
                  <th className="py-3 px-4 text-right">Skor Liga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaderboardData.map((item, idx) => {
                  const rank = idx + 1;
                  const isCurrent = currentUser?.id === item.studentId;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-bold">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                            🥇
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-sm">
                            🥈
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs shadow-sm">
                            🥉
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">#{rank}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={item.studentAvatar}
                            name={item.studentName}
                            size="xs"
                            frame={item.equippedFrame}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-900 dark:text-white font-bold">
                                {item.studentName}
                              </span>
                              {item.equippedTitle && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                  {item.equippedTitle}
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded font-normal">
                                  Anda
                                </span>
                              )}
                            </div>
                            {item.equippedBadge && (
                              <span className="text-[9px] text-slate-400">
                                🎖️ {item.equippedBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {item.textTitle}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {item.studentSchool || 'Sekolah'} · {item.studentGrade || '-'}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.wpm} WPM
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.accuracy}%
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                        {item.score} pt
                      </td>
                    </tr>
                  );
                })}

                {leaderboardData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Belum ada catatan skor di naskah ini. Ayo jadi yang pertama bermain!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
