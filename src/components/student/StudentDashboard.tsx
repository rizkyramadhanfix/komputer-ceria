import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Code2,
  Cpu,
  Edit2,
  ExternalLink,
  Flame,
  Gamepad2,
  HelpCircle,
  Keyboard,
  LayoutDashboard,
  Palette,
  Printer,
  RotateCcw,
  School,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  User,
  Zap,
  Lock,
  X,
  MessageSquare,
  Folder,
  Network,
  Sword,
  Swords,
  Image,
  Shield,
  Stethoscope,
  Paintbrush,
  FileSpreadsheet,
  Gift,
  BookA,
  Cable,
  Binary,
  ShieldAlert,
  Bot,
  Music,
  HardDrive,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  awardStudentPoints,
  getBadgeForPoints,
  getGamificationConfig,
  getLessons,
  getQuizzes,
  getTypingPractices,
  recordQuizSubmission,
  recordTypingSubmission,
  getGamesConfig,
  getStudentUnlockedAchievements,
  getTypingSubmissions,
  updateUser,
  getUsers,
} from '../../services/storageService';
import { Lesson, Quiz, QuizQuestion, TypingPractice, TypingSubmission } from '../../types';
import { AchievementsWidget } from '../achievements/AchievementsWidget';
import { Avatar } from '../common/Avatar';
import { BadgePill } from '../common/BadgePill';
import { CertificateModal } from '../certificate/CertificateModal';
import { FallingWordsGame } from '../games/FallingWordsGame';
import { LeaderboardWidget } from '../common/LeaderboardWidget';
import { ShortcutMaster } from '../games/ShortcutMaster';
import { StudentGallery } from '../gallery/StudentGallery';
import { HardwareAssemblyGame } from '../games/HardwareAssemblyGame';
import { BlocklyMazePlayground } from '../games/BlocklyMazePlayground';
import { CyberSafetyModule } from '../games/CyberSafetyModule';
import { StarRewardShop } from '../shop/StarRewardShop';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { generateStudentCardsHtml } from '../../utils/printTemplates';
import { EditProfileModal } from './EditProfileModal';
import { WordEditor } from './WordEditor';
import { FileExplorerGame } from '../games/FileExplorerGame';
import { NetworkBuilderGame } from '../games/NetworkBuilderGame';
import { TypingHeroGame } from '../games/TypingHeroGame';
import { DailyQuestsWidget } from './DailyQuestsWidget';
import { ForumDiskusi } from '../forum/ForumDiskusi';
import { PcDoctorClinic } from '../games/PcDoctorClinic';
import { PixelArtStudio } from '../games/PixelArtStudio';
import { SpreadsheetAdventure } from '../games/SpreadsheetAdventure';
import { SchoolRewardShop } from '../common/SchoolRewardShop';
import { TechGlossary } from '../common/TechGlossary';
import { PortMasterGame } from '../games/PortMasterGame';
import { BinaryCodeGame } from '../games/BinaryCodeGame';
import { AntiPhishingGame } from '../games/AntiPhishingGame';
import { GridRobotGame } from '../games/GridRobotGame';
import { TypingLeagueGame } from '../games/TypingLeagueGame';
import { CyberShieldGame } from '../games/CyberShieldGame';
import { RobotMazeGame } from '../games/RobotMazeGame';
import { LanCrimpingSimulator } from '../games/LanCrimpingSimulator';
import { RhythmTypingGame } from '../games/RhythmTypingGame';
import { StorageMasterGame } from '../games/StorageMasterGame';
import { MiniPosterStudio } from '../games/MiniPosterStudio';
import { ActivityCalendarModal } from '../common/ActivityCalendarModal';

interface StudentDashboardProps {
  initialTab?:
    | 'overview'
    | 'lessons'
    | 'quizzes'
    | 'typing'
    | 'games'
    | 'pc-builder'
    | 'coding-lab'
    | 'typing-league'
    | 'cyber-safety'
    | 'star-shop'
    | 'shortcuts'
    | 'achievements'
    | 'gallery'
    | 'leaderboard'
    | 'file-explorer'
    | 'network-builder'
    | 'typing-hero'
    | 'forum'
    | 'pc-doctor'
    | 'pixel-art'
    | 'spreadsheet'
    | 'reward-shop'
    | 'tech-glossary'
    | 'port-master'
    | 'binary-code'
    | 'anti-phishing'
    | 'grid-robot'
    | 'cyber-shield'
    | 'robot-maze'
    | 'lan-crimping'
    | 'rhythm-typing'
    | 'storage-master'
    | 'mini-poster';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  initialTab = 'overview',
}) => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showInfo, showStarReward } = useToast();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'lessons'
    | 'quizzes'
    | 'typing'
    | 'games'
    | 'pc-builder'
    | 'coding-lab'
    | 'typing-league'
    | 'cyber-safety'
    | 'star-shop'
    | 'shortcuts'
    | 'achievements'
    | 'gallery'
    | 'leaderboard'
    | 'file-explorer'
    | 'network-builder'
    | 'typing-hero'
    | 'forum'
    | 'pc-doctor'
    | 'pixel-art'
    | 'spreadsheet'
    | 'reward-shop'
    | 'tech-glossary'
    | 'port-master'
    | 'binary-code'
    | 'anti-phishing'
    | 'grid-robot'
    | 'cyber-shield'
    | 'robot-maze'
    | 'lan-crimping'
    | 'rhythm-typing'
    | 'storage-master'
    | 'mini-poster'
  >(initialTab);
  const [gamesConfig, setGamesConfig] = useState(() => getGamesConfig());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleDataUpdated = () => {
      setGamesConfig(getGamesConfig());
    };
    window.addEventListener('ekskul_data_updated', handleDataUpdated);
    return () => window.removeEventListener('ekskul_data_updated', handleDataUpdated);
  }, []);
  const [showStudentCardModal, setShowStudentCardModal] = useState(false);

  const lessons = getLessons();
  const quizzes = getQuizzes();
  const typingPractices = getTypingPractices();
  const config = getGamificationConfig();

  // Active Lesson Reader state
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [claimNotification, setClaimNotification] = useState<string | null>(null);

  // Active Quiz Runner state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctCount: number;
    pointsEarned: number;
  } | null>(null);

  const isFeatureEnabled = (id: string) => {
    const feat = gamesConfig.features.find((f) => f.id === id);
    return feat ? feat.isEnabled : true;
  };

  const renderLockedFeatureScreen = (featureName: string) => {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-500 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
          Modul Terkunci Sementara
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
          Guru Pembina sedang menonaktifkan fitur <strong className="text-indigo-600 dark:text-indigo-400">"{featureName}"</strong> untuk sementara waktu. Silakan tanyakan kepada pembina ekskul Anda untuk membukanya!
        </p>
        <button
          onClick={() => setActiveTab('overview')}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer mt-2"
        >
          Kembali ke Dashboard Utama
        </button>
      </div>
    );
  };

  const renderBadge = (id: string, normalBadge: React.ReactNode) => {
    if (!isFeatureEnabled(id)) {
      return (
        <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-bold flex items-center gap-0.5">
          <Lock className="w-2.5 h-2.5" />
          Kunci
        </span>
      );
    }
    return normalBadge;
  };

  // Active Typing Practice state
  const [activeTyping, setActiveTyping] = useState<TypingPractice | null>(null);
  const [typingSuccess, setTypingSuccess] = useState<{
    accuracy: number;
    wpm: number;
    pointsEarned: number;
  } | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Sesi Belajar Belum Masuk
        </h2>
        <p className="text-xs text-slate-500">
          Silakan masuk menggunakan NISN siswa untuk mengakses dashboard pembelajaran.
        </p>
      </div>
    );
  }

  const { currentBadge, nextBadge, progressPercent } = getBadgeForPoints(
    currentUser.totalPoints,
    config
  );

  const unlockedAchievements = React.useMemo(() => {
    return getStudentUnlockedAchievements(currentUser).filter((a) => a.isUnlocked);
  }, [currentUser]);

  // Handle Mark Lesson Complete
  const handleCompleteLesson = (lesson: Lesson) => {
    if (currentUser.completedLessons.includes(lesson.id)) {
      showInfo('Materi ini sudah pernah Anda selesaikan sebelumnya.', 'Informasi Materi');
      setClaimNotification('Materi ini sudah pernah Anda selesaikan sebelumnya.');
      setTimeout(() => setClaimNotification(null), 3000);
      return;
    }

    const points = lesson.points || config.pointsPerLesson || 50;
    const starsEarned = Math.max(1, Math.floor(points / (config.pointsToStarRatio || 10)));
    awardStudentPoints(currentUser.id, points, { completedLessonId: lesson.id });
    refreshUser();

    showStarReward(
      starsEarned,
      `Hebat! Anda menyelesaikan materi "${lesson.title}" dan meraih +${points} Poin (+${starsEarned} Bintang)!`,
      'Bintang Materi Diraih!'
    );
    setClaimNotification(`Selamat! Anda mendapatkan +${points} Poin dan +${starsEarned} Bintang baru!`);
    setTimeout(() => setClaimNotification(null), 3500);
  };

  // Start Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setQuizResult(null);
  };

  // Handle Answer Selection
  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (quizFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  // Finish Quiz with Anti-Cheat Protection
  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const totalQuestions = activeQuiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const rawPointsEarned = Math.round((score / 100) * (activeQuiz.allocatedPoints || 100));

    // Anti-Cheat: Check if this quiz was already submitted today with a high score
    const todayStr = new Date().toISOString().split('T')[0];
    const quizDailyKey = `quiz_claimed_${currentUser.id}_${activeQuiz.id}_${todayStr}`;
    const alreadyClaimedPoints = localStorage.getItem(quizDailyKey) === 'true';

    let pointsEarned = rawPointsEarned;
    if (alreadyClaimedPoints) {
      pointsEarned = 0; // Prevent farming the same quiz 50 times in a row
    } else if (pointsEarned > 0) {
      localStorage.setItem(quizDailyKey, 'true');
    }

    const starsEarned = Math.max(pointsEarned > 0 ? 1 : 0, Math.floor(pointsEarned / (config.pointsToStarRatio || 10)));

    // Record submission
    recordQuizSubmission({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentGrade: currentUser.grade,
      studentSchool: currentUser.school,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      score,
      correctCount,
      totalQuestions,
      pointsEarned,
    });

    if (pointsEarned > 0) {
      awardStudentPoints(currentUser.id, pointsEarned, { actionCategory: 'quiz_completion' });
      refreshUser();
      showStarReward(
        starsEarned,
        `Kuis "${activeQuiz.title}" selesai! Skor: ${score}% (${correctCount}/${totalQuestions} Benar). Kamu meraih +${pointsEarned} Poin (+${starsEarned} Bintang)!`,
        'Bintang Kuis Baru!'
      );
    } else {
      showInfo(
        `Kuis selesai dengan skor ${score}% (${correctCount}/${totalQuestions} Benar). Poin kuis ini sudah diklaim hari ini, hasil tetap dicatat ke database!`,
        'Latihan Selesai'
      );
    }

    setQuizResult({ score, correctCount, pointsEarned });
    setQuizFinished(true);
  };

  // Start Typing Practice
  const handleStartTyping = (practice: TypingPractice) => {
    setActiveTyping(practice);
    setTypingSuccess(null);
  };

  // Handle Typing Submission from WordEditor with Anti-Cheat
  const handleTypingSubmit = (result: {
    content: string;
    accuracy: number;
    wpm: number;
    pointsEarned: number;
  }) => {
    if (!activeTyping) return;

    // Anti-Cheat: Cap unrealistic bot WPM (max 130 WPM for elementary students)
    const sanitizedWpm = Math.min(Math.round(result.wpm), 130);
    const sanitizedAccuracy = Math.min(100, Math.max(0, Math.round(result.accuracy)));

    // Anti-Cheat: Check daily claim limit for this specific typing practice
    const todayStr = new Date().toISOString().split('T')[0];
    const typingDailyKey = `typing_claimed_${currentUser.id}_${activeTyping.id}_${todayStr}`;
    const alreadyClaimedToday = localStorage.getItem(typingDailyKey) === 'true';

    let safePointsEarned = result.pointsEarned;
    if (alreadyClaimedToday) {
      safePointsEarned = Math.min(safePointsEarned, 20); // Small bonus for re-practice
    } else if (safePointsEarned > 0) {
      localStorage.setItem(typingDailyKey, 'true');
    }

    recordTypingSubmission({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentGrade: currentUser.grade,
      studentSchool: currentUser.school,
      practiceId: activeTyping.id,
      practiceTitle: activeTyping.title,
      accuracy: sanitizedAccuracy,
      wpm: sanitizedWpm,
      pointsEarned: safePointsEarned,
      userContent: result.content,
    });

    if (safePointsEarned > 0) {
      const starsEarned = Math.max(1, Math.floor(safePointsEarned / (config.pointsToStarRatio || 10)));
      awardStudentPoints(currentUser.id, safePointsEarned, { actionCategory: 'typing_practice' });
      refreshUser();

      showStarReward(
        starsEarned,
        `Tugas latihan mengetik MS Word berhasil dikirim! Akurasi ${sanitizedAccuracy}%, Kecepatan ${sanitizedWpm} WPM (+${safePointsEarned} Poin / +${starsEarned} Bintang)!`,
        'Bintang Mengetik Diraih!'
      );
    }

    setTypingSuccess({
      accuracy: sanitizedAccuracy,
      wpm: sanitizedWpm,
      pointsEarned: safePointsEarned,
    });
  };

  return (
    <div className={`${activeTab === 'typing' && activeTyping ? 'max-w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-6`}>
      {/* Toast Claim Notification */}
      {claimNotification && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md text-xs font-semibold flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{claimNotification}</span>
          </div>
          <button
            onClick={() => setClaimNotification(null)}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Student Dashboard Layout - SIDEBAR REMOVED AS REQUESTED */}
      <div className="w-full space-y-6">
        {/* Top Profile Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`relative p-1 rounded-full transition-all shrink-0 ${
                  currentUser.equippedFrame === 'gold' || currentUser.equippedFrame === 'frame-gold'
                    ? 'ring-4 ring-amber-400 shadow-md shadow-amber-500/30'
                    : currentUser.equippedFrame === 'neon' || currentUser.equippedFrame === 'frame-neon'
                    ? 'ring-4 ring-cyan-400 shadow-md shadow-cyan-500/30 animate-pulse'
                    : currentUser.equippedFrame === 'fire' || currentUser.equippedFrame === 'frame-fire'
                    ? 'ring-4 ring-rose-500 shadow-md shadow-rose-500/30'
                    : currentUser.equippedFrame === 'cyber' || currentUser.equippedFrame === 'frame-cyber'
                    ? 'ring-4 ring-emerald-400 shadow-md shadow-emerald-500/30 animate-pulse'
                    : currentUser.equippedFrame === 'rainbow' || currentUser.equippedFrame === 'frame-rainbow'
                    ? 'ring-4 ring-purple-500 shadow-md bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
                    : ''
                }`}
              >
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="lg" frame={currentUser.equippedFrame} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    Siswa Aktif
                  </span>
                  {currentUser.equippedTitle && (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs">
                      {currentUser.equippedTitle}
                    </span>
                  )}
                  {currentUser.schoolFaction && (
                    <span className="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      {currentUser.schoolFaction === 'processor' && '⚡ Tim Prosesor'}
                      {currentUser.schoolFaction === 'graphics' && '🎨 Tim Grafis'}
                      {currentUser.schoolFaction === 'memory' && '🧠 Tim Memori'}
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-500">
                    ID: {currentUser.nisn || currentUser.username}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
                  Halo, {currentUser.name}! 👋
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentUser.grade || 'Kelas'} · {currentUser.school || 'Sekolah'}
                </p>

                {/* Earned Badges Row */}
                {unlockedAchievements.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {unlockedAchievements.map(({ achievement: ach }) => (
                      <span
                        key={ach.id}
                        title={`${ach.title}: ${ach.description}`}
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs cursor-help ${
                          ach.badgeColor === 'indigo'
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                            : ach.badgeColor === 'purple'
                            ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : ach.badgeColor === 'amber'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : ach.badgeColor === 'emerald'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : ach.badgeColor === 'rose'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : ach.badgeColor === 'blue'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : ach.badgeColor === 'yellow'
                            ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                            : ach.badgeColor === 'orange'
                            ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                        }`}
                      >
                        <span className="text-xs">
                          {ach.iconName === 'BookOpen' ? '📖' :
                           ach.iconName === 'Sparkles' ? '✨' :
                           ach.iconName === 'Star' ? '⭐' :
                           ach.iconName === 'Trophy' ? '🏆' :
                           ach.iconName === 'Award' ? '🎖️' :
                           ach.iconName === 'Keyboard' ? '⌨️' :
                           ach.iconName === 'Target' ? '🎯' :
                           ach.iconName === 'Zap' ? '⚡' : '🏅'}
                        </span>
                        <span>{ach.title}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-none">Bintang</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">{currentUser.totalStars}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-none">Poin XP</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">{currentUser.totalPoints}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                  title="Edit Profil"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowStudentCardModal(true)}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 cursor-pointer"
                  title="Cetak Kartu Akun"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="p-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                  title="Sertifikat"
                >
                  <Award className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="w-full space-y-6 min-w-0">
          {/* Faction Selection Banner if student hasn't joined yet */}
          {!currentUser.schoolFaction && (
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <h3 className="text-base font-black">Pilih Fraksi Tim Sekolahmu! ⚔️</h3>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Team Battle Sekolah</span>
              </div>
              <p className="text-xs text-blue-100">
                Pilih salah satu tim fraksi! Setiap poin yang kamu kumpulkan dari kuis, mengetik, dan game akan menyumbang skor untuk membawa fraksimu ke puncak klasemen sekolah!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    updateUser(currentUser.id, { schoolFaction: 'processor' });
                    showSuccess('Selamat bergabung dengan Tim Prosesor ⚡!');
                    refreshUser();
                  }}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[10px] uppercase font-bold text-cyan-300">Kecepatan & Logika</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-black text-white">Tim Prosesor</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">Fokus pada kecepatan kalkulasi dan logika koding!</p>
                  </div>
                  <span className="mt-3 inline-block px-3 py-1 bg-cyan-400 text-slate-950 font-black text-[10px] rounded-lg text-center">Pilih Tim Prosesor →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateUser(currentUser.id, { schoolFaction: 'graphics' });
                    showSuccess('Selamat bergabung dengan Tim Grafis 🎨!');
                    refreshUser();
                  }}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎨</span>
                    <span className="text-[10px] uppercase font-bold text-pink-300">Kreativitas & Seni</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-black text-white">Tim Grafis</h4>
                    <p className="text-[11px] text-purple-200 mt-0.5">Penuh warna, desain visual, dan kreasi pixel!</p>
                  </div>
                  <span className="mt-3 inline-block px-3 py-1 bg-pink-400 text-slate-950 font-black text-[10px] rounded-lg text-center">Pilih Tim Grafis →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateUser(currentUser.id, { schoolFaction: 'memory' });
                    showSuccess('Selamat bergabung dengan Tim Memori 🧠!');
                    refreshUser();
                  }}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🧠</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-300">Ketelitian & Ingatan</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-black text-white">Tim Memori</h4>
                    <p className="text-[11px] text-emerald-200 mt-0.5">Daya ingat tangguh, ketelitian, dan penyimpanan rapi!</p>
                  </div>
                  <span className="mt-3 inline-block px-3 py-1 bg-emerald-400 text-slate-950 font-black text-[10px] rounded-lg text-center">Pilih Tim Memori →</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Daily Quests and Attendance Streak */}
              {isFeatureEnabled('daily-quests') && <DailyQuestsWidget />}

              {/* Special Banner for Liga Mengetik 10 Jari */}
              <div 
                onClick={() => setActiveTab('typing-league')}
                className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                    <Trophy className="w-7 h-7 text-amber-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white text-orange-600 px-2 py-0.5 rounded-full shadow-xs">
                        FITUR BARU
                      </span>
                      <span className="text-xs font-bold text-amber-100">Arena Kompetisi Siswa</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black mt-0.5">Liga Mengetik Cepat 10 Jari 🏆</h3>
                    <p className="text-xs text-orange-50 line-clamp-1">
                      Pilih naskah dari Guru Pembina, ketik dengan panduan keyboard 10 jari, dan raih posisi puncak di Leaderboard Liga!
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('typing-league');
                  }}
                  className="px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-bold text-xs shadow-md shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Main Sekarang →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Action 1: Materi */}
                <div
                  onClick={() => setActiveTab('lessons')}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 dark:bg-sky-900/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Materi Belajar</h3>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">Pelajari modul komputer dan klaim poin bintang secara instan.</p>
                  </div>
                </div>

                {/* Quick Action 2: Kuis */}
                <div
                  onClick={() => setActiveTab('quizzes')}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-amber-600 shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Kuis Interaktif</h3>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">Uji kemampuanmu dan kumpulkan poin skor tertinggi.</p>
                  </div>
                </div>

                {/* Quick Action 3: Mengetik */}
                <div
                  onClick={() => setActiveTab('typing')}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                      <Keyboard className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Mengetik Word</h3>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">Latihan mengetik 10 jari dengan naskah acuan Microsoft Word.</p>
                  </div>
                </div>
              </div>

              {/* Mini Features List - Clean Grid for Games */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-indigo-500" />
                    Game & Simulasi Terpopuler
                  </h3>
                  <button onClick={() => setActiveTab('pc-doctor')} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest cursor-pointer">Lihat Semua Game →</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => setActiveTab('cyber-shield')}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-cyan-950/40 to-indigo-950/40 border-2 border-cyan-500/60 rounded-xl hover:scale-105 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute -top-1 -right-1 bg-cyan-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-xs uppercase">
                      BARU
                    </div>
                    <Shield className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-cyan-300 text-center">Cyber Shield</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('robot-maze')}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-emerald-950/40 to-teal-950/40 border-2 border-emerald-500/60 rounded-xl hover:scale-105 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-xs uppercase">
                      BARU
                    </div>
                    <Bot className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-emerald-300 text-center">Maze Robot</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('lan-crimping')}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-amber-950/40 to-orange-950/40 border-2 border-amber-500/60 rounded-xl hover:scale-105 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-xs uppercase">
                      BARU
                    </div>
                    <Network className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-amber-300 text-center">Krimping LAN</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rhythm-typing')}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-pink-950/40 to-purple-950/40 border-2 border-pink-500/60 rounded-xl hover:scale-105 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-xs uppercase">
                      BARU
                    </div>
                    <Music className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-pink-300 text-center">Rhythm Beats</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('storage-master')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <HardDrive className="w-6 h-6 text-sky-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Kapasitas Byte</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('mini-poster')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-purple-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Palette className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Desain Poster</span>
                  </button>
                  <button
                    onClick={() => setShowActivityCalendar(true)}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Calendar className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Agenda Ekskul</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('typing-league')}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-500/60 rounded-xl hover:scale-105 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-xs uppercase">
                      LIGA
                    </div>
                    <Trophy className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform animate-bounce" />
                    <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 text-center">Liga Mengetik</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pc-doctor')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-rose-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Stethoscope className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Dokter PC</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pixel-art')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Paintbrush className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Pixel Art</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('spreadsheet')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Excel Cilik</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reward-shop')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Gift className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Toko Hadiah</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('port-master')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Cable className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Master Colokan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('binary-code')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Binary className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Kode Biner</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('anti-phishing')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-rose-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Anti-Phishing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('grid-robot')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-cyan-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Bot className="w-6 h-6 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Grid Robot</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tech-glossary')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <BookA className="w-6 h-6 text-sky-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Kamus A-Z</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pc-builder')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-cyan-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Cpu className="w-6 h-6 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Rakit PC</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pc-doctor')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-rose-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Stethoscope className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Dokter PC</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('typing-hero')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Sword className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Typing RPG</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('spreadsheet')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Excel Cilik</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('coding-lab')}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition-all group shadow-xs cursor-pointer"
                  >
                    <Code2 className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">Lab Koding</span>
                  </button>
                </div>
              </div>

              {/* Leaderboard Small View */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Peringkat Siswa Bintang
                  </h3>
                  <button onClick={() => setActiveTab('leaderboard')} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest cursor-pointer">Lihat Semua →</button>
                </div>
                <div className="p-2">
                  <LeaderboardWidget limit={5} />
                </div>
              </div>
        </div>
      )}

      {/* TAB 2: MATERI BELAJAR */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Modul Materi Pembelajaran Komputer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pelajari materi berikut. Klik "Tandai Selesai" untuk mengklaim poin ke akun Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const isCompleted = currentUser.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col"
                >
                  {lesson.imageUrl && (
                    <div className="aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>Selesai</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {lesson.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.readingTimeMinutes} Menit
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {lesson.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {lesson.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        +{lesson.points || 50} Poin
                      </span>

                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Buka Materi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: LESSON READER */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {selectedLesson.category} · {selectedLesson.readingTimeMinutes} Menit Baca
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedLesson.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <VoiceNarratorButton
                  text={`${selectedLesson.title}. ${selectedLesson.summary}. ${selectedLesson.content}`}
                  size="sm"
                  label="Bacakan Materi"
                />
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {selectedLesson.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-64 border border-slate-200 dark:border-slate-800">
                  <img
                    src={selectedLesson.imageUrl}
                    alt={selectedLesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="whitespace-pre-line prose prose-sm dark:prose-invert max-w-none">
                {selectedLesson.content}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hadiah: +{selectedLesson.points || 50} Poin Bintang
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLesson(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCompleteLesson(selectedLesson);
                    setSelectedLesson(null);
                  }}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentUser.completedLessons.includes(selectedLesson.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {currentUser.completedLessons.includes(selectedLesson.id)
                      ? 'Sudah Diselesaikan'
                      : 'Tandai Selesai & Klaim Poin'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KUIS PEMBELAJARAN */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {!activeQuiz ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kuis Pilihan Ganda (PG) Komputer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Uji pemahaman materi Anda. Skor dan perolehan bintang langsung dihitung otomatis saat kuis diselesaikan!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {quiz.category}
                        </span>
                        <span>{quiz.questions.length} Butir Soal PG</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        Maksimal +{quiz.allocatedPoints || 100} Poin
                      </span>
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Mulai Kerjakan Kuis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ACTIVE QUIZ RUNNER INTERFACE */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {activeQuiz.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeQuiz.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Keluar Kuis
                </button>
              </div>

              {!quizFinished ? (
                <div className="space-y-6">
                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Soal {currentQuestionIdx + 1} dari {activeQuiz.questions.length}
                    </span>
                    <span className="font-mono">
                      Terjawab: {Object.keys(selectedAnswers).length} / {activeQuiz.questions.length}
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed flex-1">
                        {activeQuiz.questions[currentQuestionIdx].questionText}
                      </p>
                      <VoiceNarratorButton
                        text={`${activeQuiz.questions[currentQuestionIdx].questionText}. Pilihan: ${activeQuiz.questions[currentQuestionIdx].options.map((o, idx) => `Pilihan ${String.fromCharCode(65 + idx)}, ${o}`).join('. ')}`}
                        size="sm"
                        label="Bacakan Soal"
                      />
                    </div>

                    {/* Question Image (if attached) */}
                    {activeQuiz.questions[currentQuestionIdx].imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 max-h-64 flex justify-center p-2">
                        <img
                          src={activeQuiz.questions[currentQuestionIdx].imageUrl}
                          alt="Gambar Ilustrasi Soal"
                          className="max-h-60 w-auto object-contain rounded-lg"
                        />
                      </div>
                    )}

                    {/* Multiple Choice Options A, B, C, D */}
                    <div className="space-y-2.5">
                      {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                        const letters = ['A', 'B', 'C', 'D'];
                        const optImg = activeQuiz.questions[currentQuestionIdx].optionImages?.[optIdx];

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-medium'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {letters[optIdx]}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>

                            {/* Option image if present */}
                            {optImg && (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 p-1">
                                <img
                                  src={optImg}
                                  alt={`Gambar Pilihan ${letters[optIdx]}`}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Navigation Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                    >
                      ← Soal Sebelumnya
                    </button>

                    {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                      >
                        Soal Selanjutnya →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishQuiz}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                      >
                        Selesai & Kirim Jawaban
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* QUIZ RESULT REPORT */
                <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Kuis Berhasil Diselesaikan!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Hasil Anda telah tersimpan dan poin otomatis ditambahkan ke profil.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-xs text-slate-400 block">Nilai Skor</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {quizResult?.score}%
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Benar</span>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {quizResult?.correctCount} / {activeQuiz.questions.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Poin Didapat</span>
                      <span className="text-2xl font-extrabold text-amber-500 font-mono">
                        +{quizResult?.pointsEarned} pt
                      </span>
                    </div>
                  </div>

                  {/* Review Answers */}
                  <div className="text-left space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Pembahasan Kunci Jawaban:
                    </h4>
                    {activeQuiz.questions.map((q, idx) => {
                      const userAns = selectedAnswers[idx];
                      const isCorrect = userAns === q.correctAnswerIndex;
                      const letters = ['A', 'B', 'C', 'D'];

                      return (
                        <div
                          key={q.id}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {idx + 1}. {q.questionText}
                            </span>
                            <span
                              className={`shrink-0 font-bold px-2 py-0.5 rounded text-[10px] ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isCorrect ? 'Benar' : 'Salah'}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            Jawaban Anda: {userAns !== undefined ? `${letters[userAns]}. ${q.options[userAns]}` : 'Tidak dijawab'}
                          </div>
                          {!isCorrect && (
                            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Kunci Jawaban: {letters[q.correctAnswerIndex]}. {q.options[q.correctAnswerIndex]}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 italic">
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    Kembali ke Daftar Kuis
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LATIHAN MENGETIK DENGAN WORD EDITOR */}
      {activeTab === 'typing' && (
        <div className="space-y-6">
          {!activeTyping ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Latihan Mengetik & Editor Microsoft Word
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih tugas mengetik dokumen berikut. Anda akan mengetik ulang dokumen menggunakan Word Editor lengkap dengan format teks dan tabel.
                </p>
              </div>

              {/* FEATURE 5: RIWAYAT PENYERAHAN & FEEDBACK GURU */}
              {getTypingSubmissions().filter((s: TypingSubmission) => s.studentId === currentUser.id).length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    Riwayat Latihan & Catatan Koreksi Guru
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {getTypingSubmissions()
                      .filter((s: TypingSubmission) => s.studentId === currentUser.id)
                      .map((sub: TypingSubmission) => (
                        <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-2">
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-900 dark:text-white">{sub.practiceTitle}</span>
                            <span className="text-emerald-600 dark:text-emerald-400">+{sub.pointsEarned} pt</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Ketik: {sub.wpm} WPM · Akurasi {sub.accuracy}%</span>
                            <span>{new Date(sub.submittedAt).toLocaleDateString('id-ID')}</span>
                          </div>
                          {sub.pembinaFeedback && (
                            <div className="mt-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300">
                              <span className="font-bold block">💬 Catatan Koreksi Guru Pembina:</span>
                              <p className="mt-1 italic">"{sub.pembinaFeedback}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {typingPractices.map((practice) => (
                  <div
                    key={practice.id}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {practice.category}
                        </span>
                        <span>Tingkat: {practice.difficulty}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {practice.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {practice.instructions}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        Hingga +{practice.allocatedPoints || 80} Poin
                      </span>
                      <button
                        onClick={() => handleStartTyping(practice)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Mulai Latihan Mengetik
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTyping(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  ← Kembali ke Pilihan Tugas Mengetik
                </button>
              </div>

              {typingSuccess ? (
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-6 max-w-md mx-auto shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Latihan Berhasil Dikirim ke Guru!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Hasil latihan mengetik Anda telah dicatat dalam database admin dan poin otomatis diklaim.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Akurasi</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {typingSuccess.accuracy}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Kecepatan</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {typingSuccess.wpm} WPM
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Poin</span>
                      <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +{typingSuccess.pointsEarned} pt
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTyping(null);
                      setTypingSuccess(null);
                    }}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    Selesai & Pilih Latihan Lain
                  </button>
                </div>
              ) : (
                <WordEditor
                  practice={activeTyping}
                  allocatedPoints={activeTyping.allocatedPoints || 80}
                  onSubmit={handleTypingSubmit}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: KLINIK DOKTER PC */}
      {activeTab === 'pc-doctor' && (isFeatureEnabled('pc-doctor') ? <PcDoctorClinic /> : renderLockedFeatureScreen('Klinik Dokter PC'))}

      {/* TAB: STUDIO PIXEL ART 8-BIT */}
      {activeTab === 'pixel-art' && (isFeatureEnabled('pixel-art') ? <PixelArtStudio /> : renderLockedFeatureScreen('Studio Pixel Art 8-Bit'))}

      {/* TAB: PETUALANGAN SPREADSHEET CILIK */}
      {activeTab === 'spreadsheet' && (isFeatureEnabled('spreadsheet-adventure') ? <SpreadsheetAdventure /> : renderLockedFeatureScreen('Petualangan Excel Cilik'))}

      {/* TAB: TOKO HADIAH POIN SEKOLAH */}
      {activeTab === 'reward-shop' && (isFeatureEnabled('reward-shop') ? <SchoolRewardShop /> : renderLockedFeatureScreen('Toko Hadiah Poin Sekolah'))}

      {/* TAB: KAMUS & AUDIO A-Z TEKNOLOGI */}
      {activeTab === 'tech-glossary' && (isFeatureEnabled('tech-glossary') ? <TechGlossary /> : renderLockedFeatureScreen('Kamus & Audio A-Z Teknologi'))}

      {/* TAB: SIMULATOR RAKIT PC */}
      {activeTab === 'pc-builder' && (isFeatureEnabled('pc-builder') ? <HardwareAssemblyGame /> : renderLockedFeatureScreen('Simulator Merakit PC'))}

      {/* TAB: LAB CODING BLOK */}
      {activeTab === 'coding-lab' && (isFeatureEnabled('coding-lab') ? <BlocklyMazePlayground /> : renderLockedFeatureScreen('Lab Koding Blockly'))}

      {/* TAB: LIGA MENGETIK */}
      {activeTab === 'typing-league' && (isFeatureEnabled('typing-league') ? <TypingLeagueGame onBackToMenu={() => setActiveTab('overview')} /> : renderLockedFeatureScreen('Liga Mengetik'))}

      {/* TAB: CYBER SHIELD DEFENDER */}
      {activeTab === 'cyber-shield' && (isFeatureEnabled('cyber-shield') ? <CyberShieldGame /> : renderLockedFeatureScreen('Cyber Shield Defender'))}

      {/* TAB: ALGORITMA MAZE RUNNER */}
      {activeTab === 'robot-maze' && (isFeatureEnabled('robot-maze') ? <RobotMazeGame /> : renderLockedFeatureScreen('Algoritma Maze Runner'))}

      {/* TAB: SIMULATOR KRIMPING LAN */}
      {activeTab === 'lan-crimping' && (isFeatureEnabled('lan-crimping') ? <LanCrimpingSimulator /> : renderLockedFeatureScreen('Simulator Krimping LAN'))}

      {/* TAB: RHYTHM TYPING BEATS */}
      {activeTab === 'rhythm-typing' && (isFeatureEnabled('rhythm-typing') ? <RhythmTypingGame /> : renderLockedFeatureScreen('Rhythm Typing Beats'))}

      {/* TAB: STORAGE MASTER BYTE */}
      {activeTab === 'storage-master' && (isFeatureEnabled('storage-master') ? <StorageMasterGame /> : renderLockedFeatureScreen('Storage Master (Byte to Gigabyte)'))}

      {/* TAB: STUDIO MINI POSTER */}
      {activeTab === 'mini-poster' && (isFeatureEnabled('mini-poster') ? <MiniPosterStudio /> : renderLockedFeatureScreen('Studio Desain Poster Cilik'))}

      {/* TAB: MASTER COLOKAN & PORT */}
      {activeTab === 'port-master' && (isFeatureEnabled('port-master') ? <PortMasterGame /> : renderLockedFeatureScreen('Master Colokan & Port Komputer'))}

      {/* TAB: DETEKTIF KODE BINER */}
      {activeTab === 'binary-code' && (isFeatureEnabled('binary-code') ? <BinaryCodeGame /> : renderLockedFeatureScreen('Detektif Kode Biner (0 dan 1)'))}

      {/* TAB: DETEKTIF ANTI-PHISHING */}
      {activeTab === 'anti-phishing' && (isFeatureEnabled('anti-phishing') ? <AntiPhishingGame /> : renderLockedFeatureScreen('Detektif Anti-Phishing Siber'))}

      {/* TAB: GRID ROBOT NAVIGATOR */}
      {activeTab === 'grid-robot' && (isFeatureEnabled('grid-robot') ? <GridRobotGame /> : renderLockedFeatureScreen('Grid Robot Navigator (Logika Blok)'))}

      {/* TAB: INTERNET SEHAT & KEAMANAN SIBER */}
      {activeTab === 'cyber-safety' && (isFeatureEnabled('cyber-safety') ? <CyberSafetyModule /> : renderLockedFeatureScreen('Edukasi Keamanan Siber'))}

      {/* TAB: TOKO HADIAH BINTANG */}
      {activeTab === 'star-shop' && <StarRewardShop />}

      {/* TAB 5: GAME MENGETIK CEPAT CERIA */}
      {activeTab === 'games' && (isFeatureEnabled('games') ? <FallingWordsGame /> : renderLockedFeatureScreen('Game Kata Jatuh'))}

      {/* TAB 6: SHORTCUT MASTER SIMULATOR */}
      {activeTab === 'shortcuts' && (isFeatureEnabled('shortcuts') ? <ShortcutMaster /> : renderLockedFeatureScreen('Master Shortcut Keyboard'))}

      {/* TAB: FILE EXPLORER GAME */}
      {activeTab === 'file-explorer' && (isFeatureEnabled('file-explorer') ? <FileExplorerGame /> : renderLockedFeatureScreen('Manajemen Berkas & Folder'))}

      {/* TAB: NETWORK BUILDER GAME */}
      {activeTab === 'network-builder' && (isFeatureEnabled('network-builder') ? <NetworkBuilderGame /> : renderLockedFeatureScreen('Simulator Jaringan Komputer'))}

      {/* TAB: TYPING HERO GAME */}
      {activeTab === 'typing-hero' && (isFeatureEnabled('typing-hero') ? <TypingHeroGame /> : renderLockedFeatureScreen('Typing RPG Quest'))}

      {/* TAB 7: LENCANA PRESTASI & PENCAPAIAN */}
      {activeTab === 'achievements' && <AchievementsWidget student={currentUser} />}

      {/* TAB 8: GALERI KARYA DIGITAL SISWA */}
      {activeTab === 'gallery' && <StudentGallery />}

      {/* TAB: FORUM DISKUSI */}
      {activeTab === 'forum' && <ForumDiskusi />}

      {/* TAB 9: LEADERBOARD SISWA */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Papan Peringkat Prestasi Siswa & Klasemen Tim
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Peringkat global dihitung secara transparan berdasarkan akumulasi poin bintang dari membaca materi, kuis, latihan mengetik, dan mini game.
            </p>
          </div>

          {/* School Faction Team Battle Leaderboard */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-2xl p-5 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Klasemen Fraksi Tim Sekolah {currentUser.school ? `· ${currentUser.school}` : ''}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-indigo-300">Team Battle Aktif ⚔️</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Processor Team */}
              <div className={`p-4 rounded-xl border transition-all ${currentUser.schoolFaction === 'processor' ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/40' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚡</span>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase">Prosesor</span>
                </div>
                <h4 className="text-sm font-black text-white mt-1">Tim Prosesor</h4>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">{getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'processor' && (!currentUser.school || u.school === currentUser.school)).length} Anggota</span>
                  <span className="text-base font-black font-mono text-cyan-300">
                    {getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'processor' && (!currentUser.school || u.school === currentUser.school)).reduce((acc, u) => acc + (u.totalPoints || 0), 0)} pt
                  </span>
                </div>
              </div>

              {/* Graphics Team */}
              <div className={`p-4 rounded-xl border transition-all ${currentUser.schoolFaction === 'graphics' ? 'bg-pink-950/80 border-pink-400 ring-2 ring-pink-400/40' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎨</span>
                  <span className="text-[10px] font-mono font-bold text-pink-300 uppercase">Grafis</span>
                </div>
                <h4 className="text-sm font-black text-white mt-1">Tim Grafis</h4>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">{getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'graphics' && (!currentUser.school || u.school === currentUser.school)).length} Anggota</span>
                  <span className="text-base font-black font-mono text-pink-300">
                    {getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'graphics' && (!currentUser.school || u.school === currentUser.school)).reduce((acc, u) => acc + (u.totalPoints || 0), 0)} pt
                  </span>
                </div>
              </div>

              {/* Memory Team */}
              <div className={`p-4 rounded-xl border transition-all ${currentUser.schoolFaction === 'memory' ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🧠</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">Memori</span>
                </div>
                <h4 className="text-sm font-black text-white mt-1">Tim Memori</h4>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">{getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'memory' && (!currentUser.school || u.school === currentUser.school)).length} Anggota</span>
                  <span className="text-base font-black font-mono text-emerald-300">
                    {getUsers().filter(u => u.role === 'student' && u.schoolFaction === 'memory' && (!currentUser.school || u.school === currentUser.school)).reduce((acc, u) => acc + (u.totalPoints || 0), 0)} pt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <LeaderboardWidget showAll={true} />
        </div>
      )}
        </main>
      </div>

      {/* Edit Profile & Avatar Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={() => refreshUser()}
      />

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        student={currentUser}
        onClose={() => setShowCertificateModal(false)}
      />

      {/* Activity Calendar Modal */}
      <ActivityCalendarModal
        isOpen={showActivityCalendar}
        onClose={() => setShowActivityCalendar(false)}
      />

      {/* Student Account Card Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showStudentCardModal}
        onClose={() => setShowStudentCardModal(false)}
        title={`Kartu Akun Siswa - ${currentUser.name}`}
        subtitle={`Kartu identitas login resmi siswa ${currentUser.name} (${currentUser.nisn || currentUser.username})`}
        contentHtml={generateStudentCardsHtml([currentUser])}
        paperOrientation="portrait"
        itemCount={1}
      />
    </div>
  );
};
