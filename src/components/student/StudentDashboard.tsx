import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
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
  Play,
  Save,
  Trash2,
  Volume2,
  VolumeX,
  Pizza,
  Search,
  QrCode,
} from 'lucide-react';
import { ExcelPizzaTycoon } from '../games/ExcelPizzaTycoon';
import { CodeAPetGame } from '../games/CodeAPetGame';
import { DetectiveHoaxGame } from '../games/DetectiveHoaxGame';
import { soundEffects } from '../../utils/soundEffects';
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
  getStudentDrafts,
  deleteTypingDraft,
} from '../../services/storageService';
import { Lesson, Quiz, QuizQuestion, TypingPractice, TypingSubmission, TypingDraft } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
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
import { ShareAppModal } from '../common/ShareAppModal';
import { StudentNavSubBar } from './StudentNavSubBar';

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
    | 'mini-poster'
    | 'pizza-tycoon'
    | 'code-a-pet'
    | 'detective-hoax';
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
    | 'pizza-tycoon'
    | 'code-a-pet'
    | 'detective-hoax'
  >(initialTab);
  const [gamesConfig, setGamesConfig] = useState(() => getGamesConfig());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [overviewGameCategory, setOverviewGameCategory] = useState<'all' | 'coding' | 'hardware' | 'security' | 'creative'>('all');

  const getActivityTitle = (tab: string): string => {
    switch (tab) {
      case 'overview': return 'Ringkasan Beranda';
      case 'lessons': return 'Modul Materi Belajar';
      case 'quizzes': return 'Kuis Mandiri Pemahaman';
      case 'typing': return 'Mengetik Naskah MS Word';
      case 'typing-league': return 'Liga Mengetik 10 Jari Cepat';
      case 'typing-hero': return 'Typing Hero RPG';
      case 'rhythm-typing': return 'Rhythm Typing Beats';
      case 'coding-lab': return 'Lab Koding Blockly (15 Level)';
      case 'robot-maze': return 'Robot Maze Runner (14 Level)';
      case 'grid-robot': return 'Grid Robot Navigator (16 Level)';
      case 'code-a-pet': return 'Code-A-Pet Robot (8 Evolusi)';
      case 'binary-code': return 'Detektif Kode Biner (8 Level)';
      case 'pc-builder': return 'Rakit PC Simulator';
      case 'pc-doctor': return 'Dokter PC (Troubleshooting)';
      case 'port-master': return 'Master Colokan & Port';
      case 'lan-crimping': return 'Simulator Crimping Kabel LAN';
      case 'network-builder': return 'Rakit Jaringan Network';
      case 'storage-master': return 'Master Media Penyimpanan';
      case 'cyber-shield': return 'Cyber Shield Firewall';
      case 'detective-hoax': return 'Detektif Hoax & Fakta';
      case 'anti-phishing': return 'Detektif Anti-Phishing';
      case 'cyber-safety': return 'Edukasi Keamanan Siber';
      case 'pizza-tycoon': return 'Excel Pizza Tycoon';
      case 'spreadsheet': return 'Petualangan Excel Cilik';
      case 'pixel-art': return 'Studio Pixel Art 8-Bit';
      case 'mini-poster': return 'Mini Poster Designer';
      case 'file-explorer': return 'Misi File Explorer';
      case 'games': return 'Kata Jatuh (Falling Words)';
      case 'gallery': return 'Galeri Karya Siswa';
      case 'leaderboard': return 'Papan Peringkat Prestasi';
      case 'reward-shop': return 'Toko Hadiah Sekolah';
      case 'star-shop': return 'Toko Avatar & Bingkai';
      case 'forum': return 'Forum Diskusi Siswa';
      case 'tech-glossary': return 'Kamus A-Z Teknologi';
      case 'shortcuts': return 'Koleksi Shortcut Keyboard';
      default: return 'Aktivitas Belajar';
    }
  };



  // Typing Drafts state
  const [studentDrafts, setStudentDrafts] = useState<Record<string, TypingDraft>>(() =>
    currentUser ? getStudentDrafts(currentUser.id) : {}
  );
  const [draftToDelete, setDraftToDelete] = useState<{ practiceId: string; practiceTitle: string } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleResetDashboard = () => {
      setActiveTab('overview');
    };
    window.addEventListener('ekskul_reset_student_dashboard', handleResetDashboard);
    return () => window.removeEventListener('ekskul_reset_student_dashboard', handleResetDashboard);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setStudentDrafts(getStudentDrafts(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    const handleDataUpdated = () => {
      setGamesConfig(getGamesConfig());
      if (currentUser) {
        setStudentDrafts(getStudentDrafts(currentUser.id));
      }
    };
    window.addEventListener('ekskul_data_updated', handleDataUpdated);
    return () => window.removeEventListener('ekskul_data_updated', handleDataUpdated);
  }, [currentUser]);
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
  const [quizSoundEnabled, setQuizSoundEnabled] = useState(() => soundEffects.isEnabled());
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
    if (quizFinished || !activeQuiz) return;
    
    // Play cheerful chime if correct, or soft oops tone if incorrect
    const currentQ = activeQuiz.questions[questionIdx];
    if (currentQ) {
      if (optionIdx === currentQ.correctAnswerIndex) {
        soundEffects.playQuizCorrect();
      } else {
        soundEffects.playQuizIncorrect();
      }
    }

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

    // Play triumphant fanfare for completing quiz
    soundEffects.playSuccessFanfare();

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

    if (activeTyping && currentUser) {
      deleteTypingDraft(activeTyping.id, currentUser.id);
      setStudentDrafts(getStudentDrafts(currentUser.id));
    }

    setTypingSuccess({
      accuracy: sanitizedAccuracy,
      wpm: sanitizedWpm,
      pointsEarned: safePointsEarned,
    });
  };

  // Confirm and delete typing draft
  const handleConfirmDeleteDraft = () => {
    if (!draftToDelete || !currentUser) return;
    deleteTypingDraft(draftToDelete.practiceId, currentUser.id);
    setStudentDrafts(getStudentDrafts(currentUser.id));
    const title = draftToDelete.practiceTitle;
    setDraftToDelete(null);
    showInfo(`Draf untuk "${title}" telah dihapus.`, 'Draf Dihapus');
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

        {/* Student Visual Navigation Hub & Sub-Bar */}
        <StudentNavSubBar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab as any)}
          onOpenNavigator={() => setShowNavigatorModal(true)}
          student={currentUser}
        />

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



              {/* Special Banners: Liga Mengetik & Galeri Karya */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Banner 1: Liga Mengetik */}
                <div 
                  onClick={() => setActiveTab('typing-league')}
                  className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                      <Trophy className="w-7 h-7 text-amber-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white text-orange-600 px-2 py-0.5 rounded-full shadow-xs">
                          KOMPETISI RESMI
                        </span>
                        <span className="text-xs font-bold text-amber-100">Live WPM & Leaderboard</span>
                      </div>
                      <h3 className="text-base font-black mt-0.5">Liga Mengetik Cepat 10 Jari 🏆</h3>
                      <p className="text-[11px] text-orange-50 line-clamp-1">
                        Pilih naskah dari Guru Pembina, ketik 10 jari, dan raih posisi puncak!
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('typing-league');
                    }}
                    className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-bold text-xs shadow-md shrink-0 transition-colors cursor-pointer"
                  >
                    Mulai →
                  </button>
                </div>

                {/* Banner 2: Galeri Karya & Pixel Art */}
                <div 
                  onClick={() => setActiveTab('gallery')}
                  className="p-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                      <Palette className="w-7 h-7 text-pink-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white text-pink-600 px-2 py-0.5 rounded-full shadow-xs">
                          KARYA SISWA
                        </span>
                        <span className="text-xs font-bold text-pink-100">Studio Seni Digital</span>
                      </div>
                      <h3 className="text-base font-black mt-0.5">Galeri Karya Siswa & Pixel Art 🎨</h3>
                      <p className="text-[11px] text-pink-50 line-clamp-1">
                        Pamerkan lukisan digital dan buat karakter unik di Studio Pixel Art 8-bit!
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('gallery');
                    }}
                    className="px-4 py-2 bg-white text-pink-600 hover:bg-pink-50 rounded-xl font-bold text-xs shadow-md shrink-0 transition-colors cursor-pointer"
                  >
                    Buka →
                  </button>
                </div>
              </div>

              {/* 4 Pilar Utama Pembelajaran Ceria */}
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>4 Menu Belajar Utama</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pilar 1: Materi */}
                  <div
                    onClick={() => setActiveTab('lessons')}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Teori Dasar</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Modul Materi Belajar</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">Pelajari komputer dan klaim poin bintang materi secara mandiri.</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Modul</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pilar 2: Kuis */}
                  <div
                    onClick={() => setActiveTab('quizzes')}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Uji Pemahaman</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Kuis Mandiri Interaktif</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">Kuis bersuara dengan perlindungan anti-curang berhadiah bintang.</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Mulai Kuis</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pilar 3: Mengetik */}
                  <div
                    onClick={() => setActiveTab('typing')}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-500 shadow-xs hover:shadow-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Keyboard className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">10 Jari Word</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Latihan Mengetik Naskah</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">Latihan jari telunjuk hingga kelingking dengan naskah Word rapi.</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Latihan Ketik</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pilar 4: 20 Game Edukasi */}
                  <div
                    onClick={() => {
                      const el = document.getElementById('arena-game-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-5 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200 dark:border-purple-800 rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 shadow-xs hover:shadow-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">20 Game Siap Main</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Arena Game & Koding</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">Blockly, Robot Maze, Rakit PC, Dokter PC, Pizza Tycoon, dll.</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Jelajah Game</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Arena 20 Game Edukasi dengan Filter Kategori */}
              <div id="arena-game-section" className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-indigo-500" />
                      <span>Arena 20 Game Edukasi Komputer & Koding</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pilih kategori untuk memainkan simulator favoritmu dan kumpulkan poin prestasi!
                    </p>
                  </div>


                </div>

                {/* Filter Kategori Game */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: 'all', label: '🌟 Semua Game (20)' },
                    { id: 'coding', label: '🧩 Koding & Algoritma (5)' },
                    { id: 'hardware', label: '🖥️ Hardware & Lab PC (6)' },
                    { id: 'security', label: '🛡️ Keamanan Siber (4)' },
                    { id: 'creative', label: '🎨 Kreatif & Simulasi (5)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setOverviewGameCategory(cat.id as any)}
                      className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                        overviewGameCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Grid 20 Game Kartu Interaktif */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {[
                    // Koding & Algoritma
                    { id: 'coding-lab', name: 'Lab Koding Blockly', icon: '🧩', badge: '15 LEVEL', category: 'coding', desc: 'Susun balok logika algoritma untuk memandu karakter ke target.' },
                    { id: 'robot-maze', name: 'Robot Maze Runner', icon: '🤖', badge: '14 LEVEL', category: 'coding', desc: 'Koding arah belok dan perulangan robot menembus labirin rintangan.' },
                    { id: 'grid-robot', name: 'Grid Robot Rover', icon: '🌐', badge: '16 LEVEL', category: 'coding', desc: 'Pemrograman rover koordinat X/Y mengumpulkan baterai energi.' },
                    { id: 'code-a-pet', name: 'Code-A-Pet Robot', icon: '🐾', badge: '8 EVOLUSI', category: 'coding', desc: 'Rawat dan kembangkan robot peliharaan dengan perintah koding.' },
                    { id: 'binary-code', name: 'Detektif Kode Biner', icon: '0️⃣1️⃣', badge: '8 LEVEL', category: 'coding', desc: 'Pecahkan misteri teks rahasia dari susunan angka 0 dan 1 biner.' },

                    // Hardware & Lab PC
                    { id: 'pc-builder', name: 'Rakit PC Simulator', icon: '🖥️', badge: 'FAVORIT', category: 'hardware', desc: 'Pasang CPU, RAM, GPU, motherboard & power supply ke casing PC.' },
                    { id: 'pc-doctor', name: 'Dokter PC Troubleshooting', icon: '🩺', badge: 'KLINIK', category: 'hardware', desc: 'Diagnosa bluescreen, kabel lepas, dan obati kerusakan hardware PC.' },
                    { id: 'port-master', name: 'Master Colokan & Port', icon: '🔌', badge: 'SOKET', category: 'hardware', desc: 'Kenali USB-C, HDMI, DisplayPort, VGA & audio jack secara tepat.' },
                    { id: 'lan-crimping', name: 'Crimping Kabel LAN RJ45', icon: '🌐', badge: 'T568B', category: 'hardware', desc: 'Urutkan 8 warna kabel UTP sesuai standar resmi T568B lalu crimp.' },
                    { id: 'network-builder', name: 'Rakit Jaringan Network', icon: '📡', badge: 'WIFI LAB', category: 'hardware', desc: 'Hubungkan router, switch, access point, dan PC dalam satu subnet.' },
                    { id: 'storage-master', name: 'Master Storage Data', icon: '💾', badge: 'GB / TB', category: 'hardware', desc: 'Pelajari hierarki ukuran Byte, KB, MB, GB, hingga Terabyte.' },

                    // Keamanan Siber
                    { id: 'cyber-shield', name: 'Cyber Shield Firewall', icon: '🛡️', badge: 'AKSI', category: 'security', desc: 'Tembak dan blokir virus malware sebelum merusak sistem keamanan.' },
                    { id: 'detective-hoax', name: 'Detektif Hoax & Fakta', icon: '🕵️‍♂️', badge: 'BERITA', category: 'security', desc: 'Analisis berita viral untuk membedakan fakta akurat vs hoax palsu.' },
                    { id: 'anti-phishing', name: 'Detektif Anti-Phishing', icon: '🚨', badge: 'WASPADA', category: 'security', desc: 'Kenali ciri-ciri email penipuan dan tautan web jebakan palsu.' },
                    { id: 'cyber-safety', name: 'Edukasi Etika Siber', icon: '🔒', badge: 'AMAN', category: 'security', desc: 'Panduan menjaga privasi password dan berkomentar santun di internet.' },

                    // Kreatif & Simulasi
                    { id: 'pizza-tycoon', name: 'Excel Pizza Tycoon', icon: '🍕', badge: 'SERU', category: 'creative', desc: 'Kelola kasir kedai pizza lezat menggunakan rumus perhitungan Excel.' },
                    { id: 'spreadsheet', name: 'Petualangan Excel Cilik', icon: '📊', badge: 'TABEL', category: 'creative', desc: 'Eksplorasi rumus SUM, AVERAGE, dan formatting tabel data.' },
                    { id: 'mini-poster', name: 'Mini Poster Designer', icon: '🖼️', badge: 'DESAIN', category: 'creative', desc: 'Rancang poster digital bertema edukasi komputer dengan stiker keren.' },
                    { id: 'file-explorer', name: 'Misi File Explorer', icon: '📁', badge: 'FOLDER', category: 'creative', desc: 'Atur folder, pindahkan berkas dokumen, dan jaga kerapian disk.' },
                    { id: 'games', name: 'Kata Jatuh (Falling Words)', icon: '🔤', badge: 'ARKADE', category: 'creative', desc: 'Ketik kata-kata yang berjatuhan secepat mungkin sebelum menyentuh tanah.' },
                  ]
                    .filter((g) => overviewGameCategory === 'all' || g.category === overviewGameCategory)
                    .map((game) => (
                      <div
                        key={game.id}
                        onClick={() => setActiveTab(game.id as any)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between">
                            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                              {game.icon}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-300 transition-colors">
                              {game.badge}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {game.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {game.desc}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Mainkan Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Leaderboard & Komunitas Siswa */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Mini Leaderboard (2 Cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Top 5 Siswa Terhebat</span>
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('leaderboard')} 
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Lihat Semua Peringkat →
                    </button>
                  </div>
                  <div className="p-3">
                    <LeaderboardWidget limit={5} />
                  </div>
                </div>

                {/* Akses Cepat Hadiah & Forum */}
                <div className="space-y-3">
                  <div 
                    onClick={() => setActiveTab('reward-shop')}
                    className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-sm cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-emerald-100" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black">Toko Hadiah Sekolah</h4>
                        <p className="text-[10px] text-emerald-100 mt-0.5">Tukar bintang dengan hadiah fisik!</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div 
                    onClick={() => setActiveTab('star-shop')}
                    className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-sm cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-200" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black">Toko Avatar & Kostum</h4>
                        <p className="text-[10px] text-purple-100 mt-0.5">Beli bingkai bercahaya & gelar profil!</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div 
                    onClick={() => setActiveTab('forum')}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs cursor-pointer hover:border-indigo-400 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">Forum Diskusi Siswa</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tanya jawab koding & tips belajar</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = soundEffects.toggle();
                      setQuizSoundEnabled(next);
                    }}
                    className={`p-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                      quizSoundEnabled
                        ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                    }`}
                    title={quizSoundEnabled ? 'Suara Kuis Aktif (Klik untuk Matikan)' : 'Suara Kuis Mati (Klik untuk Nyalakan)'}
                  >
                    {quizSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline text-[11px] font-semibold">{quizSoundEnabled ? 'Suara: ON' : 'Suara: OFF'}</span>
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Keluar Kuis
                  </button>
                </div>
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

              {/* FITUR SIMPAN TUGAS MENGETIK: DAFTAR DRAF SEDANG BERJALAN */}
              {Object.keys(studentDrafts).length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 space-y-3 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Save className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Tugas Mengetik Sedang Berjalan (Draf Tersimpan)</span>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full">
                            {Object.keys(studentDrafts).length} Belum Selesai
                          </span>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Tugas Anda tersimpan aman di cloud. Klik "Lanjutkan" untuk meneruskan naskah tanpa mengulang dari awal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Object.values(studentDrafts).map((draft) => {
                      const matchedPractice = typingPractices.find((p) => p.id === draft.practiceId);
                      if (!matchedPractice) return null;

                      return (
                        <div
                          key={draft.id}
                          className="p-3.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-xl shadow-xs flex items-center justify-between gap-3 hover:border-amber-300 transition-all"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                              {matchedPractice.category} · {matchedPractice.difficulty}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {matchedPractice.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              <span>{draft.wordCount} kata</span>
                              <span>·</span>
                              <span>Akurasi {draft.accuracy}%</span>
                              <span>·</span>
                              <span>{new Date(draft.lastSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setDraftToDelete({ practiceId: matchedPractice.id, practiceTitle: matchedPractice.title })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Draf"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartTyping(matchedPractice)}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Lanjutkan</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {typingPractices.map((practice) => {
                  const draft = studentDrafts[practice.id];

                  return (
                    <div
                      key={practice.id}
                      className={`p-6 bg-white dark:bg-slate-900 border rounded-xl shadow-xs space-y-4 transition-all flex flex-col justify-between ${
                        draft
                          ? 'border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {practice.category}
                            </span>
                            {practice.relatedQuizId && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                                <HelpCircle className="w-3 h-3 text-purple-500" />
                                Ada Kuis Terkait
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {draft && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Save className="w-3 h-3" />
                                Ada Draf ({draft.wordCount} kata)
                              </span>
                            )}
                            <span>Tingkat: {practice.difficulty}</span>
                          </div>
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
                        {draft ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDraftToDelete({ practiceId: practice.id, practiceTitle: practice.title })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Hapus draf dan ketik dari awal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartTyping(practice)}
                              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Lanjutkan Mengetik</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartTyping(practice)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Mulai Latihan Mengetik
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveTyping(null);
                    if (currentUser) {
                      setStudentDrafts(getStudentDrafts(currentUser.id));
                    }
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
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

                  {/* RELATED QUIZ OPTION CARD */}
                  {(() => {
                    const matchedQuiz = activeTyping?.relatedQuizId
                      ? quizzes.find((q) => q.id === activeTyping.relatedQuizId)
                      : quizzes.find((q) => q.category === activeTyping?.category);

                    if (!matchedQuiz) return null;

                    return (
                      <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/80 rounded-xl space-y-2 text-left animate-in fade-in">
                        <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                            <span>Lanjut Kerjakan Kuis Terkait Naskah Ini?</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                            +{matchedQuiz.allocatedPoints || 100} Poin
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <strong>{matchedQuiz.title}</strong>: Uji seberapa baik kamu memahami materi dari naskah yang baru saja kamu ketik!
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const qToStart = matchedQuiz;
                            setActiveTyping(null);
                            setTypingSuccess(null);
                            setActiveTab('quizzes');
                            handleStartQuiz(qToStart);
                          }}
                          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                        >
                          <span>🎯 Mulai Kuis Terkait Naskah Ini (+100 Poin)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => {
                      setActiveTyping(null);
                      setTypingSuccess(null);
                      if (currentUser) {
                        setStudentDrafts(getStudentDrafts(currentUser.id));
                      }
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Kembali ke Daftar Latihan Mengetik
                  </button>
                </div>
              ) : (
                <WordEditor
                  practice={activeTyping}
                  allocatedPoints={activeTyping.allocatedPoints || 80}
                  onSubmit={handleTypingSubmit}
                  onBack={() => {
                    setActiveTyping(null);
                    if (currentUser) {
                      setStudentDrafts(getStudentDrafts(currentUser.id));
                    }
                  }}
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

      {/* TAB: EXCEL PIZZA TYCOON */}
      {activeTab === 'pizza-tycoon' && <ExcelPizzaTycoon />}

      {/* TAB: CODE-A-PET ROBOT */}
      {activeTab === 'code-a-pet' && <CodeAPetGame />}

      {/* TAB: DETEKTIF HOAX */}
      {activeTab === 'detective-hoax' && <DetectiveHoaxGame />}

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
          {(() => {
            const currentSchoolClean = currentUser.school?.toLowerCase().trim() || '';
            const allStudents = getUsers().filter((u) => u.role === 'student');
            const filteredBySchool = currentSchoolClean
              ? allStudents.filter((u) => !u.school || u.school.toLowerCase().trim() === currentSchoolClean)
              : allStudents;

            const processorMembers = filteredBySchool.filter((u) => u.schoolFaction === 'processor');
            const graphicsMembers = filteredBySchool.filter((u) => u.schoolFaction === 'graphics');
            const memoryMembers = filteredBySchool.filter((u) => u.schoolFaction === 'memory');

            const processorPts = processorMembers.reduce((acc, u) => acc + (u.totalPoints || 0), 0);
            const graphicsPts = graphicsMembers.reduce((acc, u) => acc + (u.totalPoints || 0), 0);
            const memoryPts = memoryMembers.reduce((acc, u) => acc + (u.totalPoints || 0), 0);

            return (
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
                      <span className="text-[11px] text-slate-400">{processorMembers.length} Anggota</span>
                      <span className="text-base font-black font-mono text-cyan-300">
                        {processorPts} pt
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
                      <span className="text-[11px] text-slate-400">{graphicsMembers.length} Anggota</span>
                      <span className="text-base font-black font-mono text-pink-300">
                        {graphicsPts} pt
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
                      <span className="text-[11px] text-slate-400">{memoryMembers.length} Anggota</span>
                      <span className="text-base font-black font-mono text-emerald-300">
                        {memoryPts} pt
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

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

      {/* Confirmation Modal for Deleting Draft */}
      <ConfirmModal
        isOpen={Boolean(draftToDelete)}
        title="Hapus Draf Tugas Mengetik"
        message={`Apakah Anda yakin ingin menghapus draf naskah tersimpan untuk "${draftToDelete?.practiceTitle}"? Perubahan yang belum dikirim akan hilang dan Anda dapat mulai mengetik dari lembar baru.`}
        confirmText="Ya, Hapus Draf"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmDeleteDraft}
        onClose={() => setDraftToDelete(null)}
      />
      {/* Share & Connect Multi-Device Modal */}
      <ShareAppModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};
