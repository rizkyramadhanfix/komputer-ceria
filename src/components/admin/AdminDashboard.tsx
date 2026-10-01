import React, { useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Check,
  Edit2,
  Eye,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Key,
  Keyboard,
  LayoutDashboard,
  Megaphone,
  Minus,
  Palette,
  PhoneCall,
  Pin,
  Plus,
  Printer,
  FileSpreadsheet,
  Save,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  Trophy,
  Upload,
  Users,
  X,
  Gamepad2,
  Flame,
  Sparkles,
  MessageSquare,
  Gift,
  ShoppingBag,
  UserCheck,
  School,
  KeyRound,
  UserPlus,
  Edit,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  createLesson,
  createQuiz,
  createTypingPractice,
  createUser,
  deleteLesson,
  deleteQuiz,
  deleteTypingPractice,
  deleteUser,
  getBadgeForPoints,
  getCertificateConfig,
  getCertificateConfigForSchool,
  saveCertificateConfigForSchool,
  getSchoolCertificateConfigs,
  getPembinaUsers,
  getRegisteredSchools,
  createPembinaUser,
  updatePembinaUser,
  deletePembinaUser,
  getDashboardConfig,
  getGalleryWorks,
  getGamificationConfig,
  getGameScores,
  getLessons,
  getQuizSubmissions,
  getQuizzes,
  getTypingPractices,
  getTypingSubmissions,
  getUsers,
  saveCertificateConfig,
  saveDashboardConfig,
  saveGamificationConfig,
  updateLesson,
  updateQuiz,
  updateTypingPractice,
  updateUser,
  getGamesConfig,
  saveGamesConfig,
  getSchoolRewards,
  saveSchoolRewards,
  deleteSchoolReward,
  getShopItems,
  saveShopItems,
  getRewardRedemptions,
  updateRedemptionStatus,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getContactInfo,
  saveContactInfo,
  updateSubmissionFeedback,
  getTypingLeagueTexts,
  saveTypingLeagueText,
  deleteTypingLeagueText,
  getTypingLeagueScores,
} from '../../services/storageService';
import {
  AnnouncementItem,
  CertificateConfig,
  ContactInfoConfig,
  DashboardConfig,
  GamificationConfig,
  Lesson,
  Quiz,
  QuizQuestion,
  TypingPractice,
  User,
  SchoolRewardItem,
  ShopItem,
  RewardRedemption,
  TypingSubmission,
  QuizSubmission,
  TypingLeagueText,
} from '../../types';
import { Avatar } from '../common/Avatar';
import { BadgePill } from '../common/BadgePill';
import { BulkAddStudentsModal } from './BulkAddStudentsModal';
import { CertificateModal } from '../certificate/CertificateModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { GradeRecapModal } from './GradeRecapModal';
import { LeaderboardWidget } from '../common/LeaderboardWidget';
import { PrintStudentCardsModal } from './PrintStudentCardsModal';
import { PrintCertificatesModal } from './PrintCertificatesModal';
import { StudentGallery } from '../gallery/StudentGallery';
import { useToast } from '../../context/ToastContext';
import { compressImageFile } from '../../utils/imageCompressor';
import { ForumDiskusi } from '../forum/ForumDiskusi';
import { StudentLoginActivityTab } from './StudentLoginActivityTab';
import { AdminTypingLeagueLeaderboard } from './AdminTypingLeagueLeaderboard';
import { CloudSyncStatusButton } from '../common/CloudSyncStatusButton';

interface AdminDashboardProps {
  initialTab?:
    | 'students'
    | 'lessons'
    | 'quizzes'
    | 'typing'
    | 'typing-league'
    | 'gamification'
    | 'submissions'
    | 'dashboard'
    | 'certificate'
    | 'gallery'
    | 'games'
    | 'forum'
    | 'login-activity'
    | 'announcements';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'students',
}) => {
  const { currentUser, isSuperAdmin, isPembina, assignedSchool, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState<
    | 'students'
    | 'lessons'
    | 'quizzes'
    | 'typing'
    | 'typing-league'
    | 'gamification'
    | 'submissions'
    | 'dashboard'
    | 'certificate'
    | 'gallery'
    | 'games'
    | 'forum'
    | 'login-activity'
    | 'announcements'
  >(initialTab === 'typing-league' ? 'typing' : initialTab);

  // Sync activeTab when initialTab changes from parent
  React.useEffect(() => {
    if (initialTab === 'typing-league') {
      setActiveTab('typing');
      setTypingSubTab('leaderboard');
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Popup confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Hapus',
    onConfirm: () => {},
  });

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Hapus'
  ) => {
    setConfirmModalConfig({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  // Data lists
  const [students, setStudents] = useState<User[]>(() =>
    getUsers().filter((u) => u.role === 'student')
  );
  const [lessons, setLessons] = useState<Lesson[]>(() => getLessons());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getQuizzes());
  const [typingPractices, setTypingPractices] = useState<TypingPractice[]>(() =>
    getTypingPractices()
  );
  const [gamificationConfig, setGamificationConfig] = useState<GamificationConfig>(
    () => getGamificationConfig()
  );
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() =>
    getDashboardConfig()
  );
  const [selectedCertSchool, setSelectedCertSchool] = useState<string>(() => assignedSchool || (getRegisteredSchools()[0] || ''));
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig>(() =>
    getCertificateConfigForSchool(assignedSchool || (getRegisteredSchools()[0] || ''))
  );
  const [pembinaList, setPembinaList] = useState<User[]>(() => getPembinaUsers());
  const [showPembinaModal, setShowPembinaModal] = useState(false);
  const [editingPembina, setEditingPembina] = useState<User | null>(null);
  const [pembinaForm, setPembinaForm] = useState({
    name: '',
    username: '',
    password: '',
    assignedSchool: '',
    pembinaPhone: '',
  });
  const [pembinaSearch, setPembinaSearch] = useState('');

  const [typingSubmissions, setTypingSubmissions] = useState(() =>
    getTypingSubmissions()
  );
  const [quizSubmissions, setQuizSubmissions] = useState(() =>
    getQuizSubmissions()
  );
  const [gameScores, setGameScores] = useState<any[]>(() =>
    getGameScores()
  );

  const [notification, setNotification] = useState<string | null>(null);
  const showToast = (msg: string) => {
    showSuccess(msg);
  };

  const reloadAll = () => {
    setStudents(getUsers().filter((u) => u.role === 'student'));
    setPembinaList(getPembinaUsers());
    setLessons(getLessons());
    setQuizzes(getQuizzes());
    setTypingPractices(getTypingPractices());
    setGamificationConfig(getGamificationConfig());
    setDashboardConfig(getDashboardConfig());
    setCertificateConfig(getCertificateConfigForSchool(selectedCertSchool));
    setTypingSubmissions(getTypingSubmissions());
    setQuizSubmissions(getQuizSubmissions());
    setGameScores(getGameScores());
    setGamesConfigState(getGamesConfig());
    setAnnouncementsList(getAnnouncements());
    setContactForm(getContactInfo());
    setLeagueTexts(getTypingLeagueTexts());
    refreshUser();
  };

  React.useEffect(() => {
    const handleDataUpdated = () => {
      reloadAll();
    };
    window.addEventListener('ekskul_data_updated', handleDataUpdated);
    return () => window.removeEventListener('ekskul_data_updated', handleDataUpdated);
  }, []);

  const registeredSchools = React.useMemo(() => {
    return getRegisteredSchools();
  }, [students, pembinaList]);

  // --- Student Management States ---
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('ALL');
  const [studentSchoolFilter, setStudentSchoolFilter] = useState('ALL');
  const [gameSearch, setGameSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('ALL');
  const [gamesSubTab, setGamesSubTab] = useState<'monitor' | 'settings' | 'rewards' | 'shop-settings'>('monitor');
  const [gamesConfig, setGamesConfigState] = useState(() => getGamesConfig());
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => getShopItems());
  const [selectedStudentTableIds, setSelectedStudentTableIds] = useState<string[]>([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showPrintCardsModal, setShowPrintCardsModal] = useState(false);
  const [showPrintCertificatesModal, setShowPrintCertificatesModal] = useState(false);
  const [showGradeRecapModal, setShowGradeRecapModal] = useState(false);
  const [certificateStudent, setCertificateStudent] = useState<User | null>(null);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    nisn: '',
    grade: '',
    school: '',
    password: '',
    totalPoints: 0,
  });

  const [passwordModalStudent, setPasswordModalStudent] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // --- Pembina Edit Profile States ---
  const [showEditPembinaProfileModal, setShowEditPembinaProfileModal] = useState(false);
  const [pembinaProfileName, setPembinaProfileName] = useState('');
  const [pembinaProfileUsername, setPembinaProfileUsername] = useState('');
  const [pembinaProfilePassword, setPembinaProfilePassword] = useState('');
  const [pembinaProfilePhone, setPembinaProfilePhone] = useState('');
  const [pembinaProfileAvatar, setPembinaProfileAvatar] = useState('');

  React.useEffect(() => {
    if (currentUser && showEditPembinaProfileModal) {
      setPembinaProfileName(currentUser.name || '');
      setPembinaProfileUsername(currentUser.username || '');
      setPembinaProfilePassword(currentUser.password || '');
      setPembinaProfilePhone(currentUser.pembinaPhone || '');
      setPembinaProfileAvatar(currentUser.avatarUrl || '');
    }
  }, [showEditPembinaProfileModal, currentUser]);

  const handleSavePembinaProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pembinaProfileName.trim() || !pembinaProfileUsername.trim() || !pembinaProfilePassword.trim()) {
      showError('Nama, Username, dan Password wajib diisi!');
      return;
    }

    if (!currentUser) return;

    updateUser(currentUser.id, {
      name: pembinaProfileName.trim(),
      username: pembinaProfileUsername.trim(),
      password: pembinaProfilePassword.trim(),
      pembinaPhone: pembinaProfilePhone.trim(),
      avatarUrl: pembinaProfileAvatar.trim() || undefined,
    });

    refreshUser();
    showSuccess('Perubahan profil Anda berhasil disimpan dan langsung terintegrasi ke pusat!');
    setShowEditPembinaProfileModal(false);
    reloadAll();
  };

  // --- Lesson Management States ---
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    category: 'Hardware',
    points: 50,
    readingTimeMinutes: 5,
    summary: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    tags: '',
  });

  // --- Quiz Management States ---
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState<{
    title: string;
    category: string;
    description: string;
    allocatedPoints: number;
    questions: QuizQuestion[];
  }>({
    title: '',
    category: 'Hardware',
    description: '',
    allocatedPoints: 100,
    questions: [
      {
        id: 'q-new-1',
        questionText: '',
        imageUrl: '',
        options: ['', '', '', ''],
        optionImages: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        weight: 20,
      },
    ],
  });

  // --- Typing Practice Management States ---
  const [showTypingModal, setShowTypingModal] = useState(false);
  const [editingTyping, setEditingTyping] = useState<TypingPractice | null>(null);
  const [typingForm, setTypingForm] = useState({
    title: '',
    category: 'Format Word',
    instructions: '',
    targetDocument: '',
    targetPlainText: '',
    allocatedPoints: 80,
    minAccuracy: 75,
    difficulty: 'Mudah' as 'Mudah' | 'Sedang' | 'Mahir',
    targetWpm: 25,
  });


  // --- School Rewards & Redemptions States ---
  const [schoolRewards, setSchoolRewards] = useState<SchoolRewardItem[]>(() => getSchoolRewards());
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>(() => getRewardRedemptions());
  const [showSchoolRewardModal, setShowSchoolRewardModal] = useState(false);
  const [editingSchoolReward, setEditingSchoolReward] = useState<SchoolRewardItem | null>(null);
  const [schoolRewardForm, setSchoolRewardForm] = useState({
    name: '',
    description: '',
    pointCost: 100,
    stock: 10,
    icon: '🎁',
  });

  const handleOpenAddSchoolReward = () => {
    setEditingSchoolReward(null);
    setSchoolRewardForm({
      name: '',
      description: '',
      pointCost: 100,
      stock: 10,
      icon: '🎁',
    });
    setShowSchoolRewardModal(true);
  };

  const handleOpenEditSchoolReward = (rew: SchoolRewardItem) => {
    setEditingSchoolReward(rew);
    setSchoolRewardForm({
      name: rew.name,
      description: rew.description,
      pointCost: rew.pointCost,
      stock: rew.stock,
      icon: rew.icon || '🎁',
    });
    setShowSchoolRewardModal(true);
  };

  const handleSaveSchoolRewardItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolRewardForm.name.trim()) {
      showError('Nama hadiah tidak boleh kosong.');
      return;
    }

    let updated = [...schoolRewards];
    if (editingSchoolReward) {
      updated = updated.map((r) =>
        r.id === editingSchoolReward.id
          ? {
              ...r,
              name: schoolRewardForm.name,
              description: schoolRewardForm.description,
              pointCost: Number(schoolRewardForm.pointCost),
              stock: Number(schoolRewardForm.stock),
              icon: schoolRewardForm.icon,
            }
          : r
      );
      showSuccess('Hadiah sekolah berhasil diperbarui!');
    } else {
      const newItem: SchoolRewardItem = {
        id: `rew-${Date.now()}`,
        name: schoolRewardForm.name,
        description: schoolRewardForm.description,
        pointCost: Number(schoolRewardForm.pointCost),
        stock: Number(schoolRewardForm.stock),
        icon: schoolRewardForm.icon,
        isActive: true,
      };
      updated.push(newItem);
      showSuccess('Hadiah sekolah baru berhasil ditambahkan!');
    }

    setSchoolRewards(updated);
    saveSchoolRewards(updated);
    setShowSchoolRewardModal(false);
  };

  const handleDeleteSchoolRewardItem = (id: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Hapus Hadiah Sekolah',
      message: 'Apakah Anda yakin ingin menghapus hadiah ini dari katalog penukaran?',
      confirmText: 'Hapus',
      onConfirm: () => {
        deleteSchoolReward(id);
        const updated = getSchoolRewards();
        setSchoolRewards(updated);
        showSuccess('Hadiah berhasil dihapus dari katalog dan server.');
      },
    });
  };

  // --- Announcements & Contact Info States ---
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(() => getAnnouncements());
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Informasi' as 'Informasi' | 'Penting' | 'Jadwal' | 'Lomba' | 'Pengumuman',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
  });
  const [contactForm, setContactForm] = useState<ContactInfoConfig>(() => getContactInfo());

  // --- Liga Mengetik States ---
  const [typingSubTab, setTypingSubTab] = useState<'practice' | 'league' | 'leaderboard'>('practice');
  const [leagueTexts, setLeagueTexts] = useState<TypingLeagueText[]>(() => getTypingLeagueTexts());
  const [showLeagueTextModal, setShowLeagueTextModal] = useState(false);
  const [editingLeagueText, setEditingLeagueText] = useState<TypingLeagueText | null>(null);
  const [leagueTextForm, setLeagueTextForm] = useState({
    title: '',
    category: 'Dasar',
    difficulty: 'Mudah' as 'Mudah' | 'Sedang' | 'Sulit',
    durationSeconds: 60,
    content: '',
    author: '',
  });

  const handleOpenAddLeagueText = () => {
    setEditingLeagueText(null);
    setLeagueTextForm({
      title: '',
      category: 'Dasar',
      difficulty: 'Mudah',
      durationSeconds: 60,
      content: '',
      author: currentUser?.name || 'Pembina Komputer',
    });
    setShowLeagueTextModal(true);
  };

  const handleOpenEditLeagueText = (t: TypingLeagueText) => {
    setEditingLeagueText(t);
    setLeagueTextForm({
      title: t.title,
      category: t.category,
      difficulty: t.difficulty,
      durationSeconds: t.durationSeconds,
      content: t.content,
      author: t.author || '',
    });
    setShowLeagueTextModal(true);
  };

  const handleSaveLeagueText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueTextForm.title.trim() || !leagueTextForm.content.trim()) {
      showError('Judul dan isi naskah wajib diisi.');
      return;
    }

    saveTypingLeagueText({
      id: editingLeagueText?.id,
      title: leagueTextForm.title.trim(),
      category: leagueTextForm.category.trim() || 'Dasar',
      difficulty: leagueTextForm.difficulty,
      durationSeconds: Number(leagueTextForm.durationSeconds) || 60,
      content: leagueTextForm.content.trim(),
      author: leagueTextForm.author.trim() || currentUser?.name || 'Pembina',
    });

    showSuccess(editingLeagueText ? 'Naskah liga berhasil diperbarui!' : 'Naskah liga baru berhasil ditambahkan!');
    setShowLeagueTextModal(false);
    reloadAll();
  };

  const handleDeleteLeagueText = (t: TypingLeagueText) => {
    requestConfirm(
      'Hapus Naskah Liga',
      `Apakah Anda yakin ingin menghapus naskah "${t.title}"?`,
      () => {
        deleteTypingLeagueText(t.id);
        showSuccess('Naskah liga berhasil dihapus.');
        reloadAll();
      }
    );
  };

  // --- Feedback States ---
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'quiz' | 'typing'>('typing');
  const [targetSubmission, setTargetSubmission] = useState<TypingSubmission | QuizSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleOpenFeedback = (type: 'quiz' | 'typing', sub: TypingSubmission | QuizSubmission) => {
    setFeedbackType(type);
    setTargetSubmission(sub);
    setFeedbackText(sub.pembinaFeedback || '');
    setShowFeedbackModal(true);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSubmission) return;
    updateSubmissionFeedback(feedbackType, targetSubmission.id, feedbackText.trim());
    showSuccess('Catatan umpan balik (feedback) guru berhasil disimpan!');
    setShowFeedbackModal(false);
    reloadAll();
  };

  const handleOpenAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: '',
      category: 'Informasi',
      content: '',
      date: new Date().toISOString().split('T')[0],
      isPinned: false,
    });
    setShowAnnouncementModal(true);
  };

  const handleOpenEditAnnouncement = (item: AnnouncementItem) => {
    setEditingAnnouncement(item);
    setAnnouncementForm({
      title: item.title,
      category: item.category,
      content: item.content,
      date: item.date,
      isPinned: !!item.isPinned,
    });
    setShowAnnouncementModal(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      showError('Judul dan isi pengumuman wajib diisi.');
      return;
    }

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, {
        title: announcementForm.title.trim(),
        category: announcementForm.category,
        content: announcementForm.content.trim(),
        date: announcementForm.date,
        isPinned: announcementForm.isPinned,
      });
      showSuccess('Pemberitahuan berhasil diperbarui!');
    } else {
      createAnnouncement({
        title: announcementForm.title.trim(),
        category: announcementForm.category,
        content: announcementForm.content.trim(),
        date: announcementForm.date,
        isPinned: announcementForm.isPinned,
        authorName: currentUser?.name || 'Super Administrator',
      });
      showSuccess('Pemberitahuan baru berhasil diterbitkan!');
    }

    setShowAnnouncementModal(false);
    reloadAll();
  };

  const handleDeleteAnnouncement = (item: AnnouncementItem) => {
    requestConfirm(
      'Hapus Pemberitahuan',
      `Apakah Anda yakin ingin menghapus pemberitahuan "${item.title}"?`,
      () => {
        deleteAnnouncement(item.id);
        showSuccess('Pemberitahuan berhasil dihapus.');
        reloadAll();
      }
    );
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveContactInfo(contactForm);
    showSuccess('Informasi Kontak publik berhasil disimpan!');
    reloadAll();
  };


  const handleCompleteRedemption = (redId: string) => {
    updateRedemptionStatus(redId, 'completed');
    setRedemptions(getRewardRedemptions());
    showSuccess('Status penukaran voucher hadiah berhasil diselesaikan!');
  };

  const lessonFileRef = useRef<HTMLInputElement | null>(null);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const sig1FileRef = useRef<HTMLInputElement | null>(null);
  const sig2FileRef = useRef<HTMLInputElement | null>(null);
  const sealFileRef = useRef<HTMLInputElement | null>(null);

  const handleLessonFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 600, quality: 0.75 });
      setLessonForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      showError('Gagal mengompresi gambar pelajaran.');
    }
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 1200, maxHeight: 800, quality: 0.75 });
      setDashboardConfig((prev) => ({ ...prev, heroBannerUrl: dataUrl }));
    } catch (err) {
      showError('Gagal mengompresi gambar banner.');
    }
  };

  const handleSig1Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 400, maxHeight: 300, quality: 0.7 });
      setCertificateConfig((prev) => ({ ...prev, signer1SignatureUrl: dataUrl }));
    } catch (err) {
      showError('Gagal mengompresi tanda tangan.');
    }
  };

  const handleSig2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 400, maxHeight: 300, quality: 0.7 });
      setCertificateConfig((prev) => ({ ...prev, signer2SignatureUrl: dataUrl }));
    } catch (err) {
      showError('Gagal mengompresi tanda tangan.');
    }
  };

  const handleSealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 300, maxHeight: 300, quality: 0.7 });
      setCertificateConfig((prev) => ({ ...prev, sealImageUrl: dataUrl }));
    } catch (err) {
      showError('Gagal mengompresi gambar stempel.');
    }
  };

  const handleQuestionImgUpload = async (qIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 600, maxHeight: 400, quality: 0.75 });
      const updated = [...quizForm.questions];
      updated[qIdx] = { ...updated[qIdx], imageUrl: dataUrl };
      setQuizForm({ ...quizForm, questions: updated });
    } catch (err) {
      showError('Gagal mengompresi gambar pertanyaan.');
    }
  };

  const handleOptionImgUpload = async (qIdx: number, optIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 300, maxHeight: 200, quality: 0.75 });
      const updated = [...quizForm.questions];
      const optImgs = [...(updated[qIdx].optionImages || ['', '', '', ''])];
      optImgs[optIdx] = dataUrl;
      updated[qIdx] = { ...updated[qIdx], optionImages: optImgs };
      setQuizForm({ ...quizForm, questions: updated });
    } catch (err) {
      showError('Gagal mengompresi gambar pilihan.');
    }
  };

  // ================= STUDENT HANDLERS =================
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      name: '',
      nisn: '',
      grade: 'Kelas 4A',
      school: assignedSchool || (registeredSchools[0] || ''),
      password: 'siswa' + Math.floor(100 + Math.random() * 900),
      totalPoints: 0,
    });
    setShowStudentModal(true);
  };

  const handleOpenEditStudent = (s: User) => {
    setEditingStudent(s);
    setStudentForm({
      name: s.name,
      nisn: s.nisn || s.username,
      grade: s.grade || '',
      school: s.school || '',
      password: s.password,
      totalPoints: s.totalPoints,
    });
    setShowStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.nisn) {
      alert('Nama dan NISN wajib diisi.');
      return;
    }

    const finalSchool = isPembina && assignedSchool ? assignedSchool : (studentForm.school || (registeredSchools[0] || ''));

    if (editingStudent) {
      updateUser(editingStudent.id, {
        name: studentForm.name,
        nisn: studentForm.nisn,
        username: studentForm.nisn,
        grade: studentForm.grade,
        school: finalSchool,
        password: studentForm.password,
        totalPoints: Number(studentForm.totalPoints),
        totalStars: Math.floor(
          Number(studentForm.totalPoints) / (gamificationConfig.pointsToStarRatio || 10)
        ),
      });
      showToast('Data siswa berhasil diperbarui!');
    } else {
      createUser({
        role: 'student',
        username: studentForm.nisn,
        password: studentForm.password || 'siswa123',
        name: studentForm.name,
        nisn: studentForm.nisn,
        grade: studentForm.grade,
        school: finalSchool,
      });
      showToast('Akun siswa baru berhasil dibuat dan otomatis tersinkron!');
    }

    setShowStudentModal(false);
    reloadAll();
  };

  const handleDeleteStudent = (s: User) => {
    requestConfirm(
      'Hapus Akun Siswa',
      `Apakah Anda yakin ingin menghapus akun siswa "${s.name}" (${s.nisn || s.username})? Seluruh data profil dan nilai yang tersimpan akan dihapus secara permanen.`,
      () => {
        deleteUser(s.id);
        showSuccess(`Akun siswa ${s.name} berhasil dihapus.`);
        reloadAll();
      }
    );
  };

  const handleResetPassword = () => {
    if (!passwordModalStudent || !newPasswordValue.trim()) return;
    updateUser(passwordModalStudent.id, { password: newPasswordValue.trim() });
    showToast(`Password untuk ${passwordModalStudent.name} berhasil diubah.`);
    setPasswordModalStudent(null);
    setNewPasswordValue('');
    reloadAll();
  };

  // ================= LESSON HANDLERS =================
  const handleOpenAddLesson = () => {
    setEditingLesson(null);
    setLessonForm({
      title: '',
      category: 'Hardware',
      points: gamificationConfig.pointsPerLesson || 50,
      readingTimeMinutes: 5,
      summary: '',
      content: '',
      imageUrl: '/src/assets/images/mat_hardware_computer_1790579639168.jpg',
      videoUrl: '',
      tags: 'Dasar, Komputer',
    });
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (l: Lesson) => {
    setEditingLesson(l);
    setLessonForm({
      title: l.title,
      category: l.category,
      points: l.points,
      readingTimeMinutes: l.readingTimeMinutes,
      summary: l.summary,
      content: l.content,
      imageUrl: l.imageUrl || '',
      videoUrl: l.videoUrl || '',
      tags: l.tags.join(', '),
    });
    setShowLessonModal(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = lessonForm.tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingLesson) {
      updateLesson(editingLesson.id, {
        title: lessonForm.title,
        category: lessonForm.category,
        points: Number(lessonForm.points),
        readingTimeMinutes: Number(lessonForm.readingTimeMinutes),
        summary: lessonForm.summary,
        content: lessonForm.content,
        imageUrl: lessonForm.imageUrl,
        videoUrl: lessonForm.videoUrl,
        tags: tagArray,
      });
      showToast('Materi berhasil diperbarui.');
    } else {
      createLesson({
        title: lessonForm.title,
        category: lessonForm.category,
        points: Number(lessonForm.points),
        readingTimeMinutes: Number(lessonForm.readingTimeMinutes),
        summary: lessonForm.summary,
        content: lessonForm.content,
        imageUrl: lessonForm.imageUrl,
        videoUrl: lessonForm.videoUrl,
        tags: tagArray,
      });
      showToast('Materi baru berhasil ditambahkan.');
    }

    setShowLessonModal(false);
    reloadAll();
  };

  const handleDeleteLesson = (l: Lesson) => {
    requestConfirm(
      'Hapus Materi Pembelajaran',
      `Apakah Anda yakin ingin menghapus materi "${l.title}"? Siswa tidak akan dapat mengakses modul ini lagi.`,
      () => {
        deleteLesson(l.id);
        showSuccess(`Materi "${l.title}" berhasil dihapus.`);
        reloadAll();
      }
    );
  };

  // ================= QUIZ HANDLERS =================
  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: '',
      category: 'Hardware',
      description: '',
      allocatedPoints: 100,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          questionText: 'Contoh pertanyaan kuis...',
          options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
          correctAnswerIndex: 0,
          explanation: 'Penjelasan jawaban benar...',
          weight: 20,
        },
      ],
    });
    setShowQuizModal(true);
  };

  const handleOpenEditQuiz = (q: Quiz) => {
    setEditingQuiz(q);
    setQuizForm({
      title: q.title,
      category: q.category,
      description: q.description,
      allocatedPoints: q.allocatedPoints,
      questions: JSON.parse(JSON.stringify(q.questions)),
    });
    setShowQuizModal(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, {
        title: quizForm.title,
        category: quizForm.category,
        description: quizForm.description,
        allocatedPoints: Number(quizForm.allocatedPoints),
        questions: quizForm.questions,
      });
      showToast('Kuis berhasil diperbarui.');
    } else {
      createQuiz({
        title: quizForm.title,
        category: quizForm.category,
        description: quizForm.description,
        timeLimitMinutes: 10,
        allocatedPoints: Number(quizForm.allocatedPoints),
        questions: quizForm.questions,
      });
      showToast('Kuis baru berhasil dibuat.');
    }
    setShowQuizModal(false);
    reloadAll();
  };

  const handleDeleteQuiz = (q: Quiz) => {
    requestConfirm(
      'Hapus Paket Kuis',
      `Apakah Anda yakin ingin menghapus paket kuis "${q.title}"?`,
      () => {
        deleteQuiz(q.id);
        showSuccess(`Paket kuis "${q.title}" berhasil dihapus.`);
        reloadAll();
      }
    );
  };

  // ================= TYPING PRACTICE HANDLERS =================
  const handleOpenAddTyping = () => {
    setEditingTyping(null);
    setTypingForm({
      title: '',
      category: 'Format Word',
      instructions: '',
      targetDocument: '<p>Tulis paragraf dokumen dan tabel di sini...</p>',
      targetPlainText: '',
      allocatedPoints: gamificationConfig.pointsPerTyping || 80,
      minAccuracy: 75,
      difficulty: 'Mudah',
      targetWpm: 25,
    });
    setShowTypingModal(true);
  };

  const handleOpenEditTyping = (t: TypingPractice) => {
    setEditingTyping(t);
    setTypingForm({
      title: t.title,
      category: t.category,
      instructions: t.instructions,
      targetDocument: t.targetDocument,
      targetPlainText: t.targetPlainText,
      allocatedPoints: t.allocatedPoints,
      minAccuracy: t.minAccuracy,
      difficulty: t.difficulty,
      targetWpm: t.targetWpm,
    });
    setShowTypingModal(true);
  };

  const handleSaveTyping = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTyping) {
      updateTypingPractice(editingTyping.id, {
        ...typingForm,
        allocatedPoints: Number(typingForm.allocatedPoints),
        minAccuracy: Number(typingForm.minAccuracy),
        targetWpm: Number(typingForm.targetWpm),
      });
      showToast('Latihan mengetik berhasil diperbarui.');
    } else {
      createTypingPractice({
        ...typingForm,
        allocatedPoints: Number(typingForm.allocatedPoints),
        minAccuracy: Number(typingForm.minAccuracy),
        targetWpm: Number(typingForm.targetWpm),
      });
      showToast('Tugas mengetik baru berhasil ditambahkan.');
    }
    setShowTypingModal(false);
    reloadAll();
  };

  const handleDeleteTyping = (t: TypingPractice) => {
    requestConfirm(
      'Hapus Latihan Mengetik',
      `Apakah Anda yakin ingin menghapus latihan mengetik "${t.title}"?`,
      () => {
        deleteTypingPractice(t.id);
        showSuccess(`Tugas latihan mengetik "${t.title}" berhasil dihapus.`);
        reloadAll();
      }
    );
  };

  // ================= GAMIFICATION CONFIG HANDLERS =================
  const handleSaveGamification = (e: React.FormEvent) => {
    e.preventDefault();
    saveGamificationConfig(gamificationConfig);
    showToast('Konfigurasi poin gamifikasi berhasil disimpan!');
    reloadAll();
  };

  const handleSaveGamesConfig = () => {
    saveGamesConfig(gamesConfig);
    showToast('Konfigurasi fitur dan game siswa berhasil disimpan!');
    reloadAll();
  };

  // Filter students based on search, school, and grade (scoped for Pembina if active)
  const scopedStudents = isPembina && assignedSchool
    ? students.filter(
        (s) => (s.school || '').toLowerCase().trim() === assignedSchool.toLowerCase().trim()
      )
    : students;

  const adminAvailableGrades = Array.from(
    new Set(scopedStudents.map((s) => s.grade?.trim()).filter(Boolean))
  ).sort() as string[];

  const adminAvailableSchools = Array.from(
    new Set(scopedStudents.map((s) => s.school?.trim()).filter(Boolean))
  ).sort() as string[];

  const filteredStudents = scopedStudents.filter((s) => {
    const matchSearch =
      studentSearch === '' ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.nisn && s.nisn.includes(studentSearch)) ||
      (s.school && s.school.toLowerCase().includes(studentSearch.toLowerCase()));

    const matchGrade =
      studentGradeFilter === 'ALL' || (s.grade && s.grade.trim() === studentGradeFilter);

    const matchSchool =
      studentSchoolFilter === 'ALL' || (s.school && s.school.trim() === studentSchoolFilter);

    return matchSearch && matchGrade && matchSchool;
  });

  const isAllFilteredStudentsSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentTableIds.includes(s.id));

  const handleToggleSelectAllFilteredStudents = () => {
    if (isAllFilteredStudentsSelected) {
      const filteredIds = new Set(filteredStudents.map((s) => s.id));
      setSelectedStudentTableIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([
        ...selectedStudentTableIds,
        ...filteredStudents.map((s) => s.id),
      ]);
      setSelectedStudentTableIds(Array.from(newIds));
    }
  };

  const handleToggleStudentTableSelect = (id: string) => {
    setSelectedStudentTableIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isPembina ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {isPembina ? 'Pembina Sekolah Panel' : 'Super Administrator Panel'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              {isPembina ? `Sekolah Binaan: ${assignedSchool || 'Sekolah'}` : 'Sistem Pembelajaran Ekstrakurikuler Komputer'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isPembina ? `Dashboard Kontrol Pembina - ${assignedSchool || 'Sekolah Binaan'}` : 'Dashboard Kontrol & Manajemen Guru Pusat'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPembina
              ? `Memantau ${scopedStudents.length} siswa binaan, mengelola data akun, kuis, latihan mengetik Word, dan cetak sertifikat.`
              : 'Kelola data akun siswa seluruh sekolah, materi ajar, bank kuis, tugas mengetik, dan akun pembina.'}
          </p>
        </div>
      </div>

      {/* Main Admin Dashboard Layout - SIDEBAR REMOVED */}
      <div className="w-full space-y-6">
        {/* Top Teacher Profile Header (Replaces Sidebar) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                {currentUser?.avatarUrl ? (
                  <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="lg" className="shadow-md rounded-2xl" />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold shadow-lg shrink-0 ${
                    isPembina
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-500/20'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-600 shadow-indigo-500/20'
                  }`}>
                    {isPembina ? <School className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isPembina
                      ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                      : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {isPembina ? 'Pembina Sekolah' : 'Superadmin Pusat'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {isPembina ? 'Akun Pembina Terverifikasi' : 'Sistem Manajemen Utama'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
                    {currentUser?.name || (isPembina ? 'Guru Pembina Komputer' : 'Super Administrator')}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowEditPembinaProfileModal(true)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-pointer transition-all"
                    title="Edit Profil Akun Guru Pembina"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <School className="w-4 h-4 text-purple-500" />
                  <span>{assignedSchool || currentUser?.school || dashboardConfig.schoolName || 'Sekolah Binaan'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-none">
                      {isPembina ? 'Siswa Binaan' : 'Total Siswa'}
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">
                      {scopedStudents.length}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-none">Modul Materi</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">
                      {lessons.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login-activity')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
                    activeTab === 'login-activity'
                      ? 'text-white bg-indigo-600 shadow-indigo-500/20'
                      : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">Keaktifan Akun Siswa</span>
                  <span className="sm:hidden">Keaktifan</span>
                </button>

                <button
                  onClick={() => setShowGradeRecapModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline">Rekap Nilai Siswa</span>
                  <span className="sm:hidden">Rekap</span>
                </button>

                <CloudSyncStatusButton />
              </div>
            </div>
          </div>
        </div>

        <main className="w-full space-y-6">

      {/* ================= TAB: MANAJEMEN PEMBERITAHUAN & KONTAK (SUPERADMIN ONLY) ================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {!isSuperAdmin ? (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">Akses Dibatasi</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Menu Pengaturan Pemberitahuan dan Kontak Publik hanya dapat diakses dan diubah oleh Super Administrator Pusat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: MANAJEMEN PEMBERITAHUAN (ANNUNCIATION CRUD) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      Kontrol Informasi Publik
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-amber-500" />
                      Daftar Pemberitahuan Resmi ({announcementsList.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddAnnouncement}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Pengumuman</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {announcementsList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Belum ada pemberitahuan. Klik "+ Buat Pengumuman" di atas.
                    </div>
                  ) : (
                    announcementsList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all space-y-2 ${
                          item.isPinned
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80'
                            : 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.isPinned && (
                              <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
                                <Pin className="w-3 h-3 fill-current" /> Pin Top
                              </span>
                            )}
                            <span className="text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {item.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAnnouncement(item)}
                              className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded cursor-pointer"
                              title="Edit Pengumuman"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(item)}
                              className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded cursor-pointer"
                              title="Hapus Pengumuman"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                          {item.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: MANAJEMEN INFORMASI KONTAK (KALIMAT & DETAIL) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    Pengaturan Kontak Publik
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-indigo-500" />
                    Edit Informasi Kontak & Sambutan
                  </h3>
                </div>

                <form onSubmit={handleSaveContactInfo} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Nama Sekolah / Pusat Ekstrakurikuler:
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.schoolName}
                      onChange={(e) => setContactForm({ ...contactForm, schoolName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center justify-between">
                      <span>Kolom Kalimat Deskripsi / Kata Sambutan Kontak:</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Tampil saat Kontak dibuka</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.descriptionText}
                      onChange={(e) => setContactForm({ ...contactForm, descriptionText: e.target.value })}
                      placeholder="Tuliskan kalimat atau pesan sambutan layanan kontak publik..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        No. Telepon Utama:
                      </label>
                      <input
                        type="text"
                        value={contactForm.phonePrimary}
                        onChange={(e) => setContactForm({ ...contactForm, phonePrimary: e.target.value })}
                        placeholder="0812-3456-7890"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        No. WhatsApp Chat:
                      </label>
                      <input
                        type="text"
                        value={contactForm.phoneSecondary || ''}
                        onChange={(e) => setContactForm({ ...contactForm, phoneSecondary: e.target.value })}
                        placeholder="0857-1122-3344"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Email Resmi:
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="ekskul.komputer@sekolah.sch.id"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Alamat Sekretariat & Lab:
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      placeholder="Alamat lengkap..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Jam Operasional Layanan:
                    </label>
                    <input
                      type="text"
                      value={contactForm.operationalHours}
                      onChange={(e) => setContactForm({ ...contactForm, operationalHours: e.target.value })}
                      placeholder="Senin - Sabtu: 08.00 - 16.00 WIB"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Instagram Username:
                      </label>
                      <input
                        type="text"
                        value={contactForm.socialIg || ''}
                        onChange={(e) => setContactForm({ ...contactForm, socialIg: e.target.value })}
                        placeholder="@komputerceria_official"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Channel YouTube:
                      </label>
                      <input
                        type="text"
                        value={contactForm.socialYt || ''}
                        onChange={(e) => setContactForm({ ...contactForm, socialYt: e.target.value })}
                        placeholder="Komputer Ceria Channel"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Kontak</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}



      {/* ================= TAB 1: MANAJEMEN SISWA (CRUD COMPLETE) ================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari nama, NISN, atau sekolah..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Filter Asal Sekolah */}
              <select
                value={studentSchoolFilter}
                onChange={(e) => setStudentSchoolFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="ALL">Semua Sekolah</option>
                {adminAvailableSchools.map((s) => (
                  <option key={s} value={s}>
                    {s} ({students.filter((st) => st.school === s).length})
                  </option>
                ))}
              </select>

              {/* Filter Grade */}
              <select
                value={studentGradeFilter}
                onChange={(e) => setStudentGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {adminAvailableGrades.map((g) => (
                  <option key={g} value={g}>
                    {g} ({students.filter((s) => s.grade === g).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Check Login Activity Button */}
              <button
                type="button"
                onClick={() => setActiveTab('login-activity')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Cek Keaktifan Login Siswa</span>
              </button>

              {/* Grade Recap & Export CSV Button */}
              <button
                type="button"
                onClick={() => setShowGradeRecapModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Rekap Nilai & Ekspor Excel</span>
              </button>

              {/* Print Bulk Certificates Button */}
              <button
                type="button"
                onClick={() => setShowPrintCertificatesModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Cetak Banyak Sertifikat</span>
              </button>

              {/* Print Student Cards Button */}
              <button
                type="button"
                onClick={() => setShowPrintCardsModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-indigo-500" />
                <span>Cetak Kartu Akun</span>
              </button>

              {/* Bulk Add Students Button */}
              <button
                type="button"
                onClick={() => setShowBulkAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Tambah Banyak Siswa</span>
              </button>

              {/* Add Single Student Manual */}
              <button
                type="button"
                onClick={handleOpenAddStudent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa Manual</span>
              </button>
            </div>
          </div>

          {/* Batch Selection Action Banner */}
          {selectedStudentTableIds.length > 0 && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {selectedStudentTableIds.length}
                </div>
                <span className="font-bold text-indigo-900 dark:text-indigo-200">
                  {selectedStudentTableIds.length} siswa dipilih untuk cetak masal
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPrintCardsModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu Akun ({selectedStudentTableIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintCertificatesModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Cetak Sertifikat ({selectedStudentTableIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudentTableIds([])}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
                >
                  Batal Pilih
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllFilteredStudentsSelected}
                        onChange={handleToggleSelectAllFilteredStudents}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                        title="Pilih / Batalkan Semua Siswa Tersaring"
                      />
                    </th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">NISN / Akun</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Asal Sekolah</th>
                    <th className="py-3 px-4">Total Poin & Bintang</th>
                    <th className="py-3 px-4">Tingkat Badge</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.map((s) => {
                    const { currentBadge } = getBadgeForPoints(
                      s.totalPoints,
                      gamificationConfig
                    );

                    const isSelected = selectedStudentTableIds.includes(s.id);

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleStudentTableSelect(s.id)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={s.avatarUrl} name={s.name} size="sm" />
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {s.nisn || s.username}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {s.grade || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {s.school || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-amber-500 tabular-nums">
                            {s.totalStars} ★
                          </span>{' '}
                          <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                            ({s.totalPoints} pts)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <BadgePill tier={currentBadge.tier} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Cetak Sertifikat Siswa */}
                          <button
                            onClick={() => setCertificateStudent(s)}
                            title="Cetak Sertifikat Prestasi Siswa"
                            className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset / View Password */}
                          <button
                            onClick={() => {
                              setPasswordModalStudent(s);
                              setNewPasswordValue(s.password);
                            }}
                            title="Reset atau Ubah Password"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit data */}
                          <button
                            onClick={() => handleOpenEditStudent(s)}
                            title="Edit Data Siswa"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteStudent(s)}
                            title="Hapus Akun Siswa"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada siswa yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAJEMEN MATERI ================= */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Materi teks, dokumen, gambar, atau video pembelajaran komputer dengan nilai alokasi poin yang bisa disesuaikan.
            </p>
            <button
              onClick={handleOpenAddLesson}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {lesson.imageUrl && (
                  <div className="aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {lesson.category}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{lesson.points} Poin
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {lesson.summary}
                  </p>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditLesson(lesson)}
                    className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Edit Materi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson)}
                    className="p-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
                    title="Hapus Materi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: MANAJEMEN KUIS ================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Kuis evaluasi pilihan ganda lengkap dengan bobot alokasi poin, kunci jawaban, dan pembahasan.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kuis Baru</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {quiz.category}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{quiz.allocatedPoints} Poin Maks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {quiz.description}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Total {quiz.questions.length} butir pertanyaan pilihan ganda
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditQuiz(quiz)}
                    className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Edit Kuis"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz)}
                    className="p-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
                    title="Hapus Kuis"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: MANAJEMEN LATIHAN MENGETIK & LIGA MENGETIK ================= */}
      {activeTab === 'typing' && (
        <div className="space-y-6">
          {/* Sub Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setTypingSubTab('practice')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                typingSubTab === 'practice'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tugas Mengetik Word ({typingPractices.length})</span>
            </button>
            <button
              onClick={() => setTypingSubTab('league')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                typingSubTab === 'league'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Naskah Liga Mengetik ({leagueTexts.length})</span>
            </button>
            <button
              onClick={() => setTypingSubTab('leaderboard')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                typingSubTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-900" />
              <span>🏆 Leaderboard Liga Mengetik</span>
            </button>
          </div>

          {/* Sub Tab 1: Word Practice Exercises */}
          {typingSubTab === 'practice' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Dokumen acuan naskah dan tabel yang harus diketik ulang oleh siswa pada Microsoft Word Editor.
                </p>
                <button
                  onClick={handleOpenAddTyping}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tugas Mengetik Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {typingPractices.map((practice) => (
                  <div
                    key={practice.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {practice.category} · {practice.difficulty}
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          +{practice.allocatedPoints} Poin Maks
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {practice.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {practice.instructions}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Target WPM: {practice.targetWpm} · Minimal Akurasi: {practice.minAccuracy}%
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditTyping(practice)}
                        className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                        title="Edit Tugas Mengetik"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTyping(practice)}
                        className="p-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded cursor-pointer"
                        title="Hapus Tugas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab 2: Liga Mengetik Challenge Texts */}
          {typingSubTab === 'league' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Naskah & Tantangan Resmi Liga Mengetik 10 Jari</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola naskah teks kalimat yang akan dipilih dan diketik cepat oleh siswa saat bertanding di arena Liga Mengetik.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddLeagueText}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Naskah Liga Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {leagueTexts.map((textItem) => {
                  const scores = getTypingLeagueScores().filter((s) => s.textId === textItem.id);
                  const topScore = scores.sort((a, b) => b.score - a.score)[0];

                  return (
                    <div
                      key={textItem.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {textItem.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                textItem.difficulty === 'Mudah'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : textItem.difficulty === 'Sedang'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {textItem.difficulty}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              ⏱️ {textItem.durationSeconds}s
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {textItem.title}
                        </h4>

                        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono italic line-clamp-3">
                          "{textItem.content}"
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                          <span>Panjang: <strong className="text-slate-700 dark:text-slate-300">{textItem.content.length} Karakter</strong></span>
                          <span>Total Peserta: <strong className="text-slate-700 dark:text-slate-300">{scores.length} Submisi</strong></span>
                        </div>

                        {topScore && (
                          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px]">
                            <span className="text-amber-900 dark:text-amber-300 font-bold">
                              👑 Rekor: {topScore.studentName}
                            </span>
                            <span className="font-mono font-bold text-amber-800 dark:text-amber-400">
                              {topScore.wpm} WPM · {topScore.score} pt
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditLeagueText(textItem)}
                          className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded cursor-pointer"
                          title="Edit Naskah Liga"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLeagueText(textItem)}
                          className="p-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded cursor-pointer"
                          title="Hapus Naskah Liga"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {leagueTexts.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl space-y-2">
                    <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-slate-500 font-bold">Belum ada naskah liga mengetik.</p>
                    <p className="text-xs text-slate-400">Klik tombol di kanan atas untuk membuat naskah pertama!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub Tab 3: Liga Mengetik Leaderboard & Live Monitoring */}
          {typingSubTab === 'leaderboard' && (
            <AdminTypingLeagueLeaderboard
              onRefresh={reloadAll}
              onRequestConfirm={requestConfirm}
            />
          )}
        </div>
      )}

      {/* ================= TAB 5: KONFIGURASI GAMIFIKASI ================= */}
      {activeTab === 'gamification' && (
        <form onSubmit={handleSaveGamification} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Pengaturan Besaran Poin & Konversi Bintang
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin bebas menentukan besaran poin yang diperoleh siswa dari setiap aktivitas belajar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Poin Membaca Materi
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={gamificationConfig.pointsPerLesson}
                  onChange={(e) =>
                    setGamificationConfig({
                      ...gamificationConfig,
                      pointsPerLesson: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400">Poin per materi selesai</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Poin Soal Kuis (per Butir Benar)
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={gamificationConfig.pointsPerQuizQuestion}
                  onChange={(e) =>
                    setGamificationConfig({
                      ...gamificationConfig,
                      pointsPerQuizQuestion: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400">Poin per jawaban benar</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Poin Latihan Mengetik Word
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={gamificationConfig.pointsPerTyping}
                  onChange={(e) =>
                    setGamificationConfig({
                      ...gamificationConfig,
                      pointsPerTyping: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400">Poin maksimal per dokumen</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Rasio Bintang (Poin per 1 Bintang)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={gamificationConfig.pointsToStarRatio}
                  onChange={(e) =>
                    setGamificationConfig({
                      ...gamificationConfig,
                      pointsToStarRatio: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400">Contoh: 10 poin = 1 Bintang</span>
              </div>
            </div>

            {/* Badges Overview & Threshold Editing */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ambang Batas Poin Minimum Badge Siswa:
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sesuaikan batas minimal poin agar pencapaian badge lebih menantang dan tidak terlalu rendah.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                {gamificationConfig.badges.map((b, bIdx) => (
                  <div
                    key={b.tier}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2.5 shadow-xs"
                  >
                    <BadgePill tier={b.tier} size="sm" />
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Min Poin Badge:</label>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        value={b.minPoints}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const newBadges = [...gamificationConfig.badges];
                          newBadges[bIdx] = { ...newBadges[bIdx], minPoints: val };
                          setGamificationConfig({ ...gamificationConfig, badges: newBadges });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Konfigurasi Gamifikasi</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB: EDIT DASHBOARD UTAMA & PENGUMUMAN ================= */}
      {activeTab === 'dashboard' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveDashboardConfig(dashboardConfig);
            showToast('Pengaturan tampilan dashboard utama dan pengumuman berhasil disimpan!');
            reloadAll();
          }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                <span>Pengaturan Tampilan Dashboard Utama & Pengumuman Running Text</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sesuaikan teks identitas, headline beranda utama, pengumuman teks berjalan (running text) di header, dan foto banner.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2">
                <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Teks Pengumuman Berjalan (Running Text Header)</span>
                </label>
                <textarea
                  rows={2}
                  value={dashboardConfig.runningAnnouncement || ''}
                  onChange={(e) =>
                    setDashboardConfig({ ...dashboardConfig, runningAnnouncement: e.target.value })
                  }
                  placeholder="Ketik teks pengumuman penting yang akan berjalan di bagian paling atas header..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Teks ini otomatis tampil sebagai pengumuman bergerak di baris paling atas header seluruh halaman website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Ekstrakurikuler / Sekolah
                  </label>
                  <input
                    type="text"
                    required
                    value={dashboardConfig.schoolName}
                    onChange={(e) =>
                      setDashboardConfig({ ...dashboardConfig, schoolName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Website (Site Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={dashboardConfig.siteTitle}
                    onChange={(e) =>
                      setDashboardConfig({ ...dashboardConfig, siteTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Headline Utama Beranda (Hero Title)
                </label>
                <input
                  type="text"
                  required
                  value={dashboardConfig.heroHeadline}
                  onChange={(e) =>
                    setDashboardConfig({ ...dashboardConfig, heroHeadline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-Headline / Penjelasan Singkat Beranda
                </label>
                <textarea
                  rows={3}
                  value={dashboardConfig.heroSubheadline}
                  onChange={(e) =>
                    setDashboardConfig({ ...dashboardConfig, heroSubheadline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Banner Image */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Gambar / Foto Banner Utama (Hero Banner)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    value={dashboardConfig.heroBannerUrl || ''}
                    onChange={(e) =>
                      setDashboardConfig({ ...dashboardConfig, heroBannerUrl: e.target.value })
                    }
                    placeholder="URL gambar banner (https://...) atau unggah dari komputer"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <input
                    type="file"
                    ref={bannerFileRef}
                    onChange={handleBannerFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileRef.current?.click()}
                    className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Unggah Banner</span>
                  </button>
                </div>

                {dashboardConfig.heroBannerUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-md">
                    <img
                      src={dashboardConfig.heroBannerUrl}
                      alt="Pratinjau Banner Hero"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Dashboard</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB: PENGATURAN SERTIFIKAT & TTD/STEMPEL ================= */}
      {activeTab === 'certificate' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveCertificateConfigForSchool(selectedCertSchool, certificateConfig);
            showToast(`Pengaturan sertifikat untuk ${selectedCertSchool} berhasil disimpan!`);
            reloadAll();
          }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Pengaturan Cetak Sertifikat & TTD/Barcode ({selectedCertSchool})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Setiap sekolah memiliki kop surat, tanda tangan kepala sekolah/pembina, dan nomor registrasi mandiri agar tidak bentrok.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const sampleStudent = students.find(s => s.school === selectedCertSchool) || students[0] || {
                    id: 'sample-1',
                    name: 'Ahmad Rizky Pratama',
                    nisn: '0081234567',
                    grade: 'Kelas 5A',
                    school: selectedCertSchool,
                    totalPoints: 650,
                    totalStars: 65,
                    completedLessons: [],
                    role: 'student',
                    username: '0081234567',
                    password: '',
                    createdAt: new Date().toISOString(),
                  };
                  setCertificateStudent(sampleStudent as User);
                }}
                className="px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Pratinjau Sertifikat ({selectedCertSchool})</span>
              </button>
            </div>

            {/* School Selector Bar */}
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Sekolah yang Sedang Dikonfigurasi:
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isPembina ? 'Anda mengelola format sertifikat untuk sekolah binaan Anda.' : 'Pilih sekolah untuk mengatur kop dan tanda tangannya masing-masing.'}
                  </p>
                </div>
              </div>

              {isSuperAdmin ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCertSchool}
                    onChange={(e) => {
                      const newSchool = e.target.value;
                      setSelectedCertSchool(newSchool);
                      setCertificateConfig(getCertificateConfigForSchool(newSchool));
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer shadow-xs"
                  >
                    {Array.from(
                      new Set([
                        ...pembinaList.map((p) => p.assignedSchool?.trim()).filter(Boolean),
                        ...adminAvailableSchools,
                      ])
                    ).sort().map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                  🏫 {selectedCertSchool}
                </span>
              )}
            </div>

            {/* Section 1: Header & Judul Sertifikat */}
            <div className="space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>1. Identitas Header & Judul Sertifikat</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Header Atas (Baris 1):
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateConfig.headerTitle}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, headerTitle: e.target.value })
                    }
                    placeholder="Contoh: KOMPUTER CERIA"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Header Atas Sub-Judul / Instansi (Baris 2):
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateConfig.subHeaderTitle}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, subHeaderTitle: e.target.value })
                    }
                    placeholder="Contoh: SDN SUKADAMAI 2 BOGOR"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Utama Sertifikat:
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateConfig.certificateTitle}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, certificateTitle: e.target.value })
                    }
                    placeholder="Contoh: SERTIFIKAT PENGHARGAAN"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-serif uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tempat & Tanggal Penerbitan:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.locationAndDate}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, locationAndDate: e.target.value })
                    }
                    placeholder="Contoh: Kota Bogor (Tanggal otomatis tanggal hari ini jika kosong)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Penandatangan 1 */}
            <div className="space-y-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>2. Penandatangan Kiri (Mengetahui 1 - Pembina / Instruktur)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Label Atas:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer1Label}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer1Label: e.target.value })
                    }
                    placeholder="Mengetahui,"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jabatan:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer1Title}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer1Title: e.target.value })
                    }
                    placeholder="Pembina Ekstrakurikuler Komputer"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Terang:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer1Name}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer1Name: e.target.value })
                    }
                    placeholder="Nama Pembina / Studio"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NUPTK (Opsional):
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer1Nip || ''}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer1Nip: e.target.value })
                    }
                    placeholder="NIP. 1990..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* TTD 1 Image Upload */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Gambar Tanda Tangan / Stempel Penandatangan 1 (TTD Elektronik):
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    value={certificateConfig.signer1SignatureUrl || ''}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer1SignatureUrl: e.target.value })
                    }
                    placeholder="URL gambar TTD (https://...) atau unggah dari perangkat..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="file"
                    ref={sig1FileRef}
                    onChange={handleSig1Upload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => sig1FileRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Unggah Gambar TTD 1</span>
                  </button>
                  {certificateConfig.signer1SignatureUrl && (
                    <button
                      type="button"
                      onClick={() => setCertificateConfig({ ...certificateConfig, signer1SignatureUrl: '' })}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {certificateConfig.signer1SignatureUrl && (
                  <div className="mt-2 rounded-lg p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 inline-block">
                    <img
                      src={certificateConfig.signer1SignatureUrl}
                      alt="Pratinjau TTD 1"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Penandatangan 2 */}
            <div className="space-y-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>3. Penandatangan Kanan (Mengetahui 2 - Kepala Sekolah / Penanggung Jawab)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Label Atas:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer2Label}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer2Label: e.target.value })
                    }
                    placeholder="Mengetahui,"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jabatan:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer2Title}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer2Title: e.target.value })
                    }
                    placeholder="Kepala Sekolah / Penanggung Jawab"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Terang:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer2Name}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer2Name: e.target.value })
                    }
                    placeholder="Nama Kepala Sekolah"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NUPTK (Opsional):
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.signer2Nip || ''}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer2Nip: e.target.value })
                    }
                    placeholder="NIP. 1985..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* TTD 2 Image Upload */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Gambar Tanda Tangan / Stempel Penandatangan 2 (Kepala Sekolah):
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    value={certificateConfig.signer2SignatureUrl || ''}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, signer2SignatureUrl: e.target.value })
                    }
                    placeholder="URL gambar TTD (https://...) atau unggah dari perangkat..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="file"
                    ref={sig2FileRef}
                    onChange={handleSig2Upload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => sig2FileRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Unggah Gambar TTD 2</span>
                  </button>
                  {certificateConfig.signer2SignatureUrl && (
                    <button
                      type="button"
                      onClick={() => setCertificateConfig({ ...certificateConfig, signer2SignatureUrl: '' })}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {certificateConfig.signer2SignatureUrl && (
                  <div className="mt-2 rounded-lg p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 inline-block">
                    <img
                      src={certificateConfig.signer2SignatureUrl}
                      alt="Pratinjau TTD 2"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Stempel Resmi & Barcode Verifikasi */}
            <div className="space-y-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>4. Barcode / QR Code / Stempel Gambar Verifikasi Resmi</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Label Keterangan Cap Resmi:
                  </label>
                  <input
                    type="text"
                    value={certificateConfig.sealTitle || ''}
                    onChange={(e) =>
                      setCertificateConfig({ ...certificateConfig, sealTitle: e.target.value })
                    }
                    placeholder="Contoh: RESMI · TERVERIFIKASI"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Upload Gambar Barcode / QR Code / Cap Stempel:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={certificateConfig.sealImageUrl || ''}
                      onChange={(e) =>
                        setCertificateConfig({ ...certificateConfig, sealImageUrl: e.target.value })
                      }
                      placeholder="URL gambar atau unggah file..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <input
                      type="file"
                      ref={sealFileRef}
                      onChange={handleSealUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => sealFileRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Unggah Stempel/QR</span>
                    </button>
                    {certificateConfig.sealImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCertificateConfig({ ...certificateConfig, sealImageUrl: '' })}
                        className="px-2 py-1.5 text-xs text-rose-500 hover:underline shrink-0 cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {certificateConfig.sealImageUrl && (
                    <div className="mt-2 rounded-lg p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 inline-block">
                      <img
                        src={certificateConfig.sealImageUrl}
                        alt="Pratinjau Stempel/Barcode"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Sertifikat</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 6: LEADERBOARD & SUBMISSIONS MONITOR ================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Peringkat Global Seluruh Siswa Komputer
            </h2>
            <p className="text-xs text-slate-500">
              Pantau peringkat seluruh siswa secara real-time berdasarkan akumulasi poin dan bintang.
            </p>
          </div>

          <LeaderboardWidget showAll={true} />

          {/* Submissions Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Typing Submissions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  Riwayat Latihan Mengetik Siswa
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {typingSubmissions.length} Submisi
                </span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {typingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{sub.studentName}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                        +{sub.pointsEarned} pt
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{sub.practiceTitle}</span>
                      <div className="flex items-center gap-2">
                        <span>Akurasi {sub.accuracy}% · {sub.wpm} WPM</span>
                        <button
                          onClick={() => handleOpenFeedback('typing', sub)}
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${sub.pembinaFeedback ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                          title={sub.pembinaFeedback ? 'Lihat/Edit Feedback Guru' : 'Beri Feedback Guru'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {typingSubmissions.length === 0 && (
                  <p className="text-slate-400 text-center py-4">
                    Belum ada hasil latihan mengetik yang dikirim siswa.
                  </p>
                )}
              </div>
            </div>

            {/* Quiz Submissions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Riwayat Pengerjaan Kuis Siswa
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {quizSubmissions.length} Submisi
                </span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {quizSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{sub.studentName}</span>
                      <span className="text-amber-500 font-mono">
                        +{sub.pointsEarned} pt
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{sub.quizTitle}</span>
                      <div className="flex items-center gap-2">
                        <span>Skor: {sub.score}% ({sub.correctCount}/{sub.totalQuestions} Benar)</span>
                        <button
                          onClick={() => handleOpenFeedback('quiz', sub)}
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${sub.pembinaFeedback ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                          title={sub.pembinaFeedback ? 'Lihat/Edit Feedback Guru' : 'Beri Feedback Guru'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {quizSubmissions.length === 0 && (
                  <p className="text-slate-400 text-center py-4">
                    Belum ada riwayat kuis siswa yang tercatat.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: DAFTAR AKUN YANG LOGIN & KEAKTIFAN SISWA ================= */}
      {activeTab === 'login-activity' && (
        <StudentLoginActivityTab
          onOpenResetPassword={(s) => {
            setPasswordModalStudent(s);
            setNewPasswordValue(s.password);
          }}
          onOpenEditStudent={handleOpenEditStudent}
        />
      )}

      {/* ================= TAB 8: GALERI KARYA SISWA (MODERASI & HAPUS OLEH ADMIN) ================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <StudentGallery isAdminView={true} />
        </div>
      )}

      {/* ================= TAB: MODERASI FORUM DISKUSI ================= */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          <ForumDiskusi />
        </div>
      )}

      {/* ================= TAB 9: MONITOR & GAME SISWA (MONITORING & SETTING) ================= */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          {/* Dashboard Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sesi Bermain</span>
              <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{gameScores.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Game Manajemen Berkas</span>
              <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {gameScores.filter(g => g.gameName === 'Manajemen Berkas').length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Simulator Jaringan</span>
              <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {gameScores.filter(g => g.gameName === 'Simulasi Jaringan').length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Typing RPG Quest</span>
              <span className="text-2xl font-mono font-bold text-rose-600 dark:text-rose-400">
                {gameScores.filter(g => g.gameName === 'Petualangan Mengetik RPG').length}
              </span>
            </div>
          </div>

          {/* Sub Tab Selector */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto">
            <button
              onClick={() => setGamesSubTab('monitor')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                gamesSubTab === 'monitor'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📊 Live Monitoring & Skor Siswa
            </button>
            <button
              onClick={() => setGamesSubTab('settings')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                gamesSubTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              ⚙️ Pengaturan Fitur & Game Siswa
            </button>
            <button
              onClick={() => setGamesSubTab('rewards')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                gamesSubTab === 'rewards'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Klaim Hadiah & Voucher Siswa</span>
              {redemptions.filter((r) => r.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full">
                  {redemptions.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setGamesSubTab('shop-settings')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                gamesSubTab === 'shop-settings'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>🛒 Pengaturan Harga Toko & Avatar</span>
            </button>
          </div>

          {gamesSubTab === 'monitor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Live Score Board */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Log Skor & Hasil Bermain Siswa</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Pantau perolehan poin dan skor pengerjaan seluruh simulasi game siswa secara langsung (real-time).
                      </p>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    <select
                      value={gameFilter}
                      onChange={(e) => setGameFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="ALL">Semua Game</option>
                      <option value="Manajemen Berkas">Manajemen Berkas & Folder</option>
                      <option value="Simulasi Jaringan">Simulator Jaringan Komputer</option>
                      <option value="Petualangan Mengetik RPG">Typing RPG Quest</option>
                      <option value="Game Kata Jatuh">Game Kata Jatuh</option>
                    </select>
                  </div>
                </div>

                {/* Table Score list */}
                <div className="overflow-x-auto min-h-64">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-950">
                        <th className="py-2.5 px-3">Siswa</th>
                        <th className="py-2.5 px-3">Nama Game</th>
                        <th className="py-2.5 px-3 text-center">Skor</th>
                        <th className="py-2.5 px-3 text-center">Bonus Poin</th>
                        <th className="py-2.5 px-3 text-right">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameScores
                        .filter((score) => {
                          const student = students.find((s) => s.id === score.studentId);
                          const matchName = student ? student.name.toLowerCase().includes(gameSearch.toLowerCase()) : false;
                          const matchGame = gameFilter === 'ALL' || score.gameName === gameFilter;
                          return (gameSearch === '' || matchName) && matchGame;
                        })
                        .map((score) => {
                          const student = students.find((s) => s.id === score.studentId);
                          return (
                            <tr 
                              key={score.id}
                              className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
                            >
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                                {student?.name || 'Siswa Ekskul'}
                                <span className="block text-[9px] font-normal text-slate-400">
                                  {student?.grade || 'Siswa'} · {student?.school || 'Sekolah Terdaftar'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                                <span className="font-semibold block">{score.gameName}</span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {score.score}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                +{score.pointsEarned} pt
                              </td>
                              <td className="py-2.5 px-3 text-right text-[10px] text-slate-400">
                                {new Date(score.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          );
                        })}

                      {gameScores.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                            Belum ada data pengerjaan simulasi game dari siswa.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Attendance Streaks list */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Log Kehadiran & Streak Siswa</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Lihat rekap aktivitas keaktifan absensi harian dan pengerjaan misi harian siswa ekskul.
                  </p>

                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {students.map((student) => {
                      const streak = parseInt(localStorage.getItem(`streak_${student.id}`) || '1', 10);
                      const claimedToday = localStorage.getItem(`claimed_today_${student.id}`);
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isActiveToday = claimedToday === todayStr;

                      return (
                        <div 
                          key={student.id}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                              {student.name}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              {student.grade || 'Kelas 7A'} · {student.totalStars} ★ Bintang
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                              <Flame className="w-3.5 h-3.5 fill-orange-500/10" />
                              <span className="font-mono">{streak}d</span>
                            </div>

                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isActiveToday
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {isActiveToday ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {students.length === 0 && (
                      <p className="text-slate-400 text-center py-4 text-[11px]">
                        Belum ada siswa terdaftar.
                      </p>
                    )}
                  </div>
                </div>

                {/* Informative Tips Footer */}
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-[10px] text-slate-500 leading-normal flex gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Seluruh simulasi di atas melatih motorik halus, logika koding, dan keamanan digital siswa secara seimbang.</span>
                </div>
              </div>
            </div>
          )}

          {gamesSubTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-pink-500" />
                      <span>Konfigurasi Status Aktif & Aturan Game Siswa</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Aktifkan atau nonaktifkan game/fitur tertentu, atur kelipatan bonus poin, dan sesuaikan tingkat kesulitan pengerjaan game siswa.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveGamesConfig}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-500/20"
                  >
                    Simpan Pengaturan Game
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gamesConfig.features.map((feature, idx) => {
                    return (
                      <div
                        key={feature.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                          feature.isEnabled
                            ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                            : 'bg-rose-50/20 dark:bg-rose-950/5 border-rose-200/50 dark:border-rose-900/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                feature.category === 'game'
                                  ? 'bg-pink-100 dark:bg-pink-950 text-pink-700'
                                  : feature.category === 'simulator'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700'
                                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                              }`}>
                                {feature.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {feature.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {feature.id === 'pc-doctor' && 'Klinik diagnosa kerusakan hardware dan troubleshooting komputer.'}
                              {feature.id === 'pixel-art' && 'Studio kreasi seni piksel 8-bit dan konsep warna RGB.'}
                              {feature.id === 'spreadsheet-adventure' && 'Petualangan simulasi rumus Excel dan grafik visual.'}
                              {feature.id === 'reward-shop' && 'Pusat penukaran poin bintang dengan hadiah nyata di sekolah.'}
                              {feature.id === 'tech-glossary' && 'Ensiklopedia dan audio pelafalan A-Z istilah teknologi.'}
                              {feature.id === 'file-explorer' && 'Siswa merapikan file acak ke dalam folder yang benar.'}
                              {feature.id === 'network-builder' && 'Menghubungkan komputer, router, dan printer bersama.'}
                              {feature.id === 'typing-hero' && 'Bertarung melawan monster siber dengan mengetik naskah secara cepat.'}
                              {feature.id === 'games' && 'Game klasik menangkap kata jatuh untuk melatih reflek keyboard.'}
                              {feature.id === 'pc-builder' && 'Simulasi belajar merakit komputer desktop secara edukatif.'}
                              {feature.id === 'coding-lab' && 'Lab bermain menyusun logika maze pemrograman sederhana.'}
                              {feature.id === 'cyber-safety' && 'Modul kuis interaktif mengenai etika dan keamanan internet.'}
                              {feature.id === 'shortcuts' && 'Belajar dan uji pintasan kombinasi keyboard yang berguna.'}
                              {feature.id === 'daily-quests' && 'Tugas misi harian dan streak check-in kehadiran siswa.'}
                            </p>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={feature.isEnabled}
                              onChange={(e) => {
                                const newFeatures = [...gamesConfig.features];
                                newFeatures[idx] = { ...feature, isEnabled: e.target.checked };
                                setGamesConfigState({ features: newFeatures });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-1.5 text-[10px] font-bold text-slate-500">
                              {feature.isEnabled ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </label>
                        </div>

                        {feature.isEnabled && (
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Hadiah Poin (XP):</label>
                              <input
                                type="number"
                                min={0}
                                step={10}
                                placeholder="Poin bawaan"
                                value={feature.basePoints || ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                                  const newFeatures = [...gamesConfig.features];
                                  newFeatures[idx] = { ...feature, basePoints: val };
                                  setGamesConfigState({ features: newFeatures });
                                }}
                                className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Multiplier Poin:</label>
                              <select
                                value={feature.pointsMultiplier}
                                onChange={(e) => {
                                  const newFeatures = [...gamesConfig.features];
                                  newFeatures[idx] = { ...feature, pointsMultiplier: Number(e.target.value) };
                                  setGamesConfigState({ features: newFeatures });
                                }}
                                className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                              >
                                <option value="1">1.0x Poin Standar</option>
                                <option value="1.5">1.5x Poin Bonus</option>
                                <option value="2">2.0x Poin Ganda</option>
                                <option value="3">3.0x Poin Triple</option>
                              </select>
                            </div>

                            {feature.customSetting !== undefined && (
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">
                                  {feature.id === 'file-explorer' && 'Batas Waktu Bermain:'}
                                  {feature.id === 'network-builder' && 'Tingkat Kesulitan:'}
                                  {feature.id === 'typing-hero' && 'Darah (HP) Monster Boss:'}
                                  {feature.id === 'games' && 'Kecepatan Kata Jatuh:'}
                                </label>

                                {feature.id === 'file-explorer' && (
                                  <select
                                    value={feature.customSetting}
                                    onChange={(e) => {
                                      const newFeatures = [...gamesConfig.features];
                                      newFeatures[idx] = { ...feature, customSetting: e.target.value };
                                      setGamesConfigState({ features: newFeatures });
                                    }}
                                    className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                                  >
                                    <option value="45">45 Detik (Cepat)</option>
                                    <option value="60">60 Detik (Normal)</option>
                                    <option value="90">90 Detik (Santai)</option>
                                  </select>
                                )}

                                {feature.id === 'network-builder' && (
                                  <select
                                    value={feature.customSetting}
                                    onChange={(e) => {
                                      const newFeatures = [...gamesConfig.features];
                                      newFeatures[idx] = { ...feature, customSetting: e.target.value };
                                      setGamesConfigState({ features: newFeatures });
                                    }}
                                    className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                                  >
                                    <option value="easy">Mudah (3 Alat)</option>
                                    <option value="normal">Normal (5 Alat)</option>
                                    <option value="hard">Sulit (7 Alat)</option>
                                  </select>
                                )}

                                {feature.id === 'typing-hero' && (
                                  <select
                                    value={feature.customSetting}
                                    onChange={(e) => {
                                      const newFeatures = [...gamesConfig.features];
                                      newFeatures[idx] = { ...feature, customSetting: e.target.value };
                                      setGamesConfigState({ features: newFeatures });
                                    }}
                                    className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                                  >
                                    <option value="50">50 HP (Siswa Pemula)</option>
                                    <option value="100">100 HP (Normal)</option>
                                    <option value="150">150 HP (Siswa Mahir)</option>
                                    <option value="200">200 HP (Dewa Mengetik)</option>
                                  </select>
                                )}

                                {feature.id === 'games' && (
                                  <select
                                    value={feature.customSetting}
                                    onChange={(e) => {
                                      const newFeatures = [...gamesConfig.features];
                                      newFeatures[idx] = { ...feature, customSetting: e.target.value };
                                      setGamesConfigState({ features: newFeatures });
                                    }}
                                    className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                                  >
                                    <option value="0.7">0.7x Lambat (Siswa Baru)</option>
                                    <option value="1.0">1.0x Normal</option>
                                    <option value="1.5">1.5x Cepat</option>
                                    <option value="2.0">2.0x Kilat (Ahli)</option>
                                  </select>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {gamesSubTab === 'rewards' && (
            <div className="space-y-6">
              {/* Rewards Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Total Penukaran Hadiah
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                    {redemptions.length} Klaim
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block tracking-wider">
                    Menunggu Verifikasi Guru
                  </span>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                    {redemptions.filter((r) => r.status === 'pending').length} Voucher
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block tracking-wider">
                    Hadiah Selesai Diberikan
                  </span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                    {redemptions.filter((r) => r.status === 'completed').length} Selesai
                  </p>
                </div>
              </div>

              {/* Redemptions Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span>Daftar Voucher Penukaran Hadiah Siswa</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Siswa yang menukarkan poin bintang akan menunjukkan kode voucher mereka saat mengambil hadiah fisik di lab.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold bg-slate-50/60 dark:bg-slate-950">
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">Hadiah Yang Ditukar</th>
                        <th className="py-2.5 px-3 text-center">Kode Voucher</th>
                        <th className="py-2.5 px-3 text-center">Poin Terpotong</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Aksi Guru</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redemptions.map((red) => (
                        <tr
                          key={red.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
                        >
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            {red.studentName}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {red.studentGrade || 'Siswa Ekskul'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                            {red.rewardName}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {red.redeemCode}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-amber-500">
                            ★ {red.pointCost} Poin
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                red.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {red.status === 'completed' ? 'Selesai Diberikan' : 'Menunggu Klaim'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {red.status === 'pending' ? (
                              <button
                                onClick={() => handleCompleteRedemption(red.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Tandai Sudah Diberikan</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Selesai
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {redemptions.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Belum ada riwayat penukaran hadiah dari siswa.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reward Items Catalog Management */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Katalog Hadiah Fisik Sekolah yang Tersedia
                    </h4>
                    <p className="text-xs text-slate-500">
                      Kelola stok dan biaya poin bintang untuk setiap hadiah yang bisa ditukar siswa.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddSchoolReward}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Hadiah Baru</span>
                    </button>
                    <button
                      onClick={() => {
                        saveSchoolRewards(schoolRewards);
                        showSuccess('Data katalog hadiah sekolah berhasil disimpan!');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schoolRewards.map((rew, idx) => (
                    <div
                      key={rew.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {rew.name}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                            {rew.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                          <input
                            type="checkbox"
                            checked={rew.isActive}
                            onChange={(e) => {
                              const updated = [...schoolRewards];
                              updated[idx].isActive = e.target.checked;
                              setSchoolRewards(updated);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">
                            Harga Poin Bintang:
                          </label>
                          <input
                            type="number"
                            value={rew.pointCost}
                            onChange={(e) => {
                              const updated = [...schoolRewards];
                              updated[idx].pointCost = Number(e.target.value);
                              setSchoolRewards(updated);
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">
                            Sisa Stok Fisik:
                          </label>
                          <input
                            type="number"
                            value={rew.stock}
                            onChange={(e) => {
                              const updated = [...schoolRewards];
                              updated[idx].stock = Number(e.target.value);
                              setSchoolRewards(updated);
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditSchoolReward(rew)}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSchoolRewardItem(rew.id)}
                            className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {gamesSubTab === 'shop-settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>Pengaturan Harga Toko Hadiah Avatar & Aksesoris (Star Shop)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Atur harga Bintang (⭐) untuk setiap item avatar, bingkai foto profil, dan gelar kehormatan siswa.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      saveShopItems(shopItems);
                      showSuccess('Harga item toko avatar & aksesoris berhasil disimpan!');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Harga Toko Avatar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shopItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h5>
                          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">
                          Harga Bintang (⭐):
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.costStars}
                          onChange={(e) => {
                            const updated = [...shopItems];
                            updated[idx].costStars = Number(e.target.value);
                            setShopItems(updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        </main>
      </div>

      {/* ================= MODAL: TAMBAH / EDIT SISWA ================= */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Akun Siswa Baru'}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nama Lengkap Siswa:
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Nama Siswa"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  NISN (Nomor Induk Siswa Nasional):
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.nisn}
                  onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                  placeholder="Contoh: 0087654321"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Kelas:
                  </label>
                  <input
                    type="text"
                    value={studentForm.grade}
                    onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                    placeholder="Contoh: Kelas 7A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Asal Sekolah:
                  </label>
                  {isPembina && assignedSchool ? (
                    <div className="w-full px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <School className="w-4 h-4 text-purple-600" />
                        {assignedSchool}
                      </span>
                      <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded text-purple-800 dark:text-purple-200">
                        Sekolah Binaan
                      </span>
                    </div>
                  ) : (
                    <select
                      required
                      value={studentForm.school}
                      onChange={(e) => setStudentForm({ ...studentForm, school: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium cursor-pointer"
                    >
                      <option value="">-- Pilih Asal Sekolah --</option>
                      {registeredSchools.map((sch) => (
                        <option key={sch} value={sch}>
                          🏫 {sch}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Kata Sandi / Password:
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="Password akun siswa"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {editingStudent && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Penyesuaian Total Poin:
                  </label>
                  <input
                    type="number"
                    value={studentForm.totalPoints}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, totalPoints: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Buat Akun Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD SISWA ================= */}
      {passwordModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-500" />
                Reset Password Siswa
              </h3>
              <button
                onClick={() => setPasswordModalStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Atur kata sandi baru untuk <strong>{passwordModalStudent.name}</strong> (NISN: {passwordModalStudent.nisn})
              </p>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Kata Sandi Baru:
                </label>
                <input
                  type="text"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="Ketik password baru"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalStudent(null)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg"
                >
                  Simpan Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH / EDIT MATERI ================= */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingLesson ? 'Edit Materi Pembelajaran' : 'Input Materi Pembelajaran Baru'}
              </h3>
              <button
                onClick={() => setShowLessonModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Judul Materi Pembelajaran:
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Contoh: Pengenalan Komponen CPU & Perangkat Keras"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Kategori:
                  </label>
                  <select
                    value={lessonForm.category}
                    onChange={(e) => setLessonForm({ ...lessonForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Microsoft Word">Microsoft Word</option>
                    <option value="Mengetik">Mengetik</option>
                    <option value="Internet & Etika">Internet & Etika</option>
                    <option value="Algoritma">Algoritma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Alokasi Poin Siswa:
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={300}
                    value={lessonForm.points}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, points: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Estimasi Waktu Baca (Menit):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={lessonForm.readingTimeMinutes}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, readingTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Ringkasan Singkat:
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.summary}
                  onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                  placeholder="Ringkasan poin utama materi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Gambar / Ilustrasi Materi */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Gambar / Ilustrasi Materi:</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <input
                    type="text"
                    value={lessonForm.imageUrl || ''}
                    onChange={(e) => setLessonForm({ ...lessonForm, imageUrl: e.target.value })}
                    placeholder="URL gambar (https://...) atau unggah dari perangkat"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="file"
                    ref={lessonFileRef}
                    onChange={handleLessonFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => lessonFileRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Unggah Gambar</span>
                  </button>
                  {lessonForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, imageUrl: '' })}
                      className="px-2 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {lessonForm.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs">
                    <img
                      src={lessonForm.imageUrl}
                      alt="Pratinjau Gambar Materi"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Konten Naskah Materi Lengkap:
                </label>
                <textarea
                  rows={8}
                  required
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder="Tulis naskah materi pembelajaran di sini..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH / EDIT KUIS ================= */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingQuiz ? 'Edit Paket Kuis PG' : 'Buat Paket Kuis Baru'}
              </h3>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Judul Kuis:
                </label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="Contoh: Kuis Evaluasi Microsoft Word & Format Dokumen"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Kategori:
                  </label>
                  <select
                    value={quizForm.category}
                    onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Microsoft Word">Microsoft Word</option>
                    <option value="Internet & Keamanan">Internet & Keamanan</option>
                    <option value="Umum Komputer">Umum Komputer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Alokasi Poin Maksimal:
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={quizForm.allocatedPoints}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, allocatedPoints: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Deskripsi Kuis:
                </label>
                <input
                  type="text"
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Deskripsi singkat target kompetensi kuis..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                    Daftar Soal Pilihan Ganda ({quizForm.questions.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizForm({
                        ...quizForm,
                        questions: [
                          ...quizForm.questions,
                          {
                            id: `q-${Date.now()}-${quizForm.questions.length + 1}`,
                            questionText: '',
                            options: ['', '', '', ''],
                            correctAnswerIndex: 0,
                            explanation: '',
                            weight: 20,
                          },
                        ],
                      });
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                  >
                    + Tambah Soal
                  </button>
                </div>

                {quizForm.questions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Soal #{qIdx + 1}
                      </span>
                      {quizForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = quizForm.questions.filter((_, i) => i !== qIdx);
                            setQuizForm({ ...quizForm, questions: filtered });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs"
                        >
                          Hapus Soal Ini
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...quizForm.questions];
                          updated[qIdx].questionText = e.target.value;
                          setQuizForm({ ...quizForm, questions: updated });
                        }}
                        placeholder="Pertanyaan soal..."
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Gambar Soal (Opsional) */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-indigo-500" />
                          <span>Gambar Soal (Opsional):</span>
                        </span>
                        {q.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...quizForm.questions];
                              updated[qIdx].imageUrl = '';
                              setQuizForm({ ...quizForm, questions: updated });
                            }}
                            className="text-rose-500 hover:underline text-[10px]"
                          >
                            Hapus Gambar
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={q.imageUrl || ''}
                          onChange={(e) => {
                            const updated = [...quizForm.questions];
                            updated[qIdx].imageUrl = e.target.value;
                            setQuizForm({ ...quizForm, questions: updated });
                          }}
                          placeholder="URL gambar soal atau unggah file..."
                          className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <label className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 shrink-0">
                          <Upload className="w-3 h-3 text-indigo-500" />
                          <span>Unggah</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleQuestionImgUpload(qIdx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {q.imageUrl && (
                        <div className="mt-1.5 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 max-h-36 max-w-xs flex justify-center bg-slate-100 dark:bg-slate-800 p-1">
                          <img src={q.imageUrl} alt="Pratinjau Gambar Soal" className="max-h-32 object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Pilihan Jawaban & Gambar Pilihan (A, B, C, D):
                      </span>
                      {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                        <div key={optIdx} className="space-y-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctAnswerIndex === optIdx}
                              onChange={() => {
                                const updated = [...quizForm.questions];
                                updated[qIdx].correctAnswerIndex = optIdx;
                                setQuizForm({ ...quizForm, questions: updated });
                              }}
                              title={`Jadikan ${letter} sebagai kunci jawaban`}
                            />
                            <span className="w-5 font-bold text-slate-600 dark:text-slate-400">
                              {letter}:
                            </span>
                            <input
                              type="text"
                              required
                              value={q.options[optIdx] || ''}
                              onChange={(e) => {
                                const updated = [...quizForm.questions];
                                updated[qIdx].options[optIdx] = e.target.value;
                                setQuizForm({ ...quizForm, questions: updated });
                              }}
                              placeholder={`Teks pilihan ${letter}`}
                              className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                            <label
                              className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 shrink-0"
                              title={`Unggah gambar untuk pilihan ${letter}`}
                            >
                              <ImageIcon className="w-3 h-3 text-indigo-500" />
                              <span>Foto {letter}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleOptionImgUpload(qIdx, optIdx, e)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Image preview for option if exists */}
                          {q.optionImages?.[optIdx] && (
                            <div className="flex items-center gap-2 pl-7 pt-1">
                              <img
                                src={q.optionImages[optIdx]!}
                                alt={`Gambar Pilihan ${letter}`}
                                className="w-14 h-14 object-cover rounded border border-slate-200 dark:border-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...quizForm.questions];
                                  const optImgs = [...(updated[qIdx].optionImages || ['', '', '', ''])];
                                  optImgs[optIdx] = '';
                                  updated[qIdx].optionImages = optImgs;
                                  setQuizForm({ ...quizForm, questions: updated });
                                }}
                                className="text-[11px] text-rose-500 hover:underline"
                              >
                                Hapus Foto Pilihan {letter}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => {
                          const updated = [...quizForm.questions];
                          updated[qIdx].explanation = e.target.value;
                          setQuizForm({ ...quizForm, questions: updated });
                        }}
                        placeholder="Penjelasan pembahasan jawaban benar..."
                        className="w-full px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg"
                >
                  Simpan Paket Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ================= MODAL: TAMBAH / EDIT LATIHAN MENGETIK ================= */}
      {showTypingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingTyping ? 'Edit Tugas Mengetik Word' : 'Tambah Tugas Mengetik Dokumen Baru'}
              </h3>
              <button
                onClick={() => setShowTypingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTyping} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Judul Dokumen:
                </label>
                <input
                  type="text"
                  required
                  value={typingForm.title}
                  onChange={(e) => setTypingForm({ ...typingForm, title: e.target.value })}
                  placeholder="Contoh: Surat Undangan Rapat Osis & Tabel Jadwal"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Tingkat Kesulitan:
                  </label>
                  <select
                    value={typingForm.difficulty}
                    onChange={(e) =>
                      setTypingForm({
                        ...typingForm,
                        difficulty: e.target.value as 'Mudah' | 'Sedang' | 'Mahir',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Mahir">Mahir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Target WPM:
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={typingForm.targetWpm}
                    onChange={(e) =>
                      setTypingForm({ ...typingForm, targetWpm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Alokasi Poin Maks:
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={typingForm.allocatedPoints}
                    onChange={(e) =>
                      setTypingForm({ ...typingForm, allocatedPoints: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Instruksi Siswa:
                </label>
                <textarea
                  rows={2}
                  value={typingForm.instructions}
                  onChange={(e) =>
                    setTypingForm({ ...typingForm, instructions: e.target.value })
                  }
                  placeholder="Ketik instruksi pemformatan teks atau tabel..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Penjelasan & Template Cepat Acuan */}
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                    <strong>Apa itu Dokumen Acuan Visual?</strong>
                    <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                      Naskah atau format dokumen (judul, teks tebal, tabel, warna) yang ditampilkan di bagian atas layar siswa sebagai contoh yang harus diketik ulang oleh siswa di lembar kerja Word.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    Template Cepat:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTypingForm((prev) => ({
                        ...prev,
                        title: 'Paragraf Cerita & Format Bold',
                        instructions: 'Ketik ulang cerita di bawah dengan format judul tebal dan paragraf rapi.',
                        targetDocument: '<h3 style="font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">Manfaat Belajar Komputer Sejak Dini</h3><p>Di era digital modern, keterampilan komputer sangat penting bagi setiap siswa. Komputer membantu kita mencari informasi edukatif, membuat tugas sekolah, serta melatih logika berpikir kreatif.</p><p>Dengan menguasai teknik mengetik sepuluh jari, kita dapat menyelesaikan dokumen dengan jauh lebih cepat dan akurat.</p>',
                        targetPlainText: 'Manfaat Belajar Komputer Sejak Dini\nDi era digital modern, keterampilan komputer sangat penting bagi setiap siswa. Komputer membantu kita mencari informasi edukatif, membuat tugas sekolah, serta melatih logika berpikir kreatif.\nDengan menguasai teknik mengetik sepuluh jari, kita dapat menyelesaikan dokumen dengan jauh lebih cepat dan akurat.',
                      }));
                    }}
                    className="px-2 py-1 text-[10px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded hover:bg-indigo-100 transition-colors"
                  >
                    📝 Template Paragraf
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTypingForm((prev) => ({
                        ...prev,
                        title: 'Tabel Jadwal Piket & Ekstrakurikuler',
                        instructions: 'Buat tabel 3 kolom dan ketikkan jadwal kegiatan ekstrakurikuler berikut.',
                        targetDocument: '<h4 style="font-weight: bold; margin-bottom: 6px;">Jadwal Ekstrakurikuler Sekolah</h4><table border="1" style="width: 100%; border-collapse: collapse; text-align: left;"><thead style="background-color: #f1f5f9;"><tr><th style="padding: 6px; border: 1px solid #cbd5e1;">Hari</th><th style="padding: 6px; border: 1px solid #cbd5e1;">Nama Kegiatan</th><th style="padding: 6px; border: 1px solid #cbd5e1;">Waktu</th></tr></thead><tbody><tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Senin</td><td style="padding: 6px; border: 1px solid #cbd5e1;">Komputer Ceria</td><td style="padding: 6px; border: 1px solid #cbd5e1;">14:00 - 15:30</td></tr><tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Rabu</td><td style="padding: 6px; border: 1px solid #cbd5e1;">Robotik & Sains</td><td style="padding: 6px; border: 1px solid #cbd5e1;">14:00 - 15:30</td></tr><tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Jumat</td><td style="padding: 6px; border: 1px solid #cbd5e1;">Pramuka Siaga</td><td style="padding: 6px; border: 1px solid #cbd5e1;">13:30 - 15:00</td></tr></tbody></table>',
                        targetPlainText: 'Jadwal Ekstrakurikuler Sekolah\nHari | Nama Kegiatan | Waktu\nSenin | Komputer Ceria | 14:00 - 15:30\nRabu | Robotik & Sains | 14:00 - 15:30\nJumat | Pramuka Siaga | 13:30 - 15:00',
                      }));
                    }}
                    className="px-2 py-1 text-[10px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded hover:bg-indigo-100 transition-colors"
                  >
                    📊 Template Tabel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTypingForm((prev) => ({
                        ...prev,
                        title: 'Surat Resmi Undangan Sekolah',
                        instructions: 'Ketik surat resmi dengan format kop surat dan tanda tangan.',
                        targetDocument: '<div style="text-align: center; border-bottom: 2px solid #334155; padding-bottom: 6px; margin-bottom: 8px;"><h4 style="margin: 0; font-weight: bold;">SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR</h4><p style="margin: 0; font-size: 11px;">Jl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000</p></div><p><strong>Nomor:</strong> 045/SDN2/IX/2026<br><strong>Hal:</strong> Undangan Pertemuan Ekstrakurikuler Komputer</p><p>Kepada Yth. Bapak/Ibu Orang Tua Siswa,<br>Dengan hormat, sehubungan dengan dimulainya program pelatihan komputer ceria, kami mengundang Bapak/Ibu hadir pada hari Sabtu di Lab Komputer.</p><p style="text-align: right; margin-top: 15px;">Hormat kami,<br><strong>Kepala Sekolah</strong></p>',
                        targetPlainText: 'SEKOLAH DASAR NEGERI SUKADAMAI 2 BOGOR\nJl. Kebon Pedes No. 22, Kota Bogor · Telp: (0251) 8321000\nNomor: 045/SDN2/IX/2026\nHal: Undangan Pertemuan Ekstrakurikuler Komputer\nKepada Yth. Bapak/Ibu Orang Tua Siswa,\nDengan hormat, sehubungan dengan dimulainya program pelatihan komputer ceria, kami mengundang Bapak/Ibu hadir pada hari Sabtu di Lab Komputer.\nHormat kami,\nKepala Sekolah',
                      }));
                    }}
                    className="px-2 py-1 text-[10px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded hover:bg-indigo-100 transition-colors"
                  >
                    📑 Template Surat Resmi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Dokumen Acuan Visual (HTML / Rich Format):
                </label>
                <textarea
                  rows={5}
                  required
                  value={typingForm.targetDocument}
                  onChange={(e) =>
                    setTypingForm({ ...typingForm, targetDocument: e.target.value })
                  }
                  placeholder="Format dokumen acuan yang dilihat siswa (bisa format HTML atau teks biasa)..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Teks Polos Acuan (Untuk Perhitungan Akurasi Huruf & Kata):
                </label>
                <textarea
                  rows={4}
                  required
                  value={typingForm.targetPlainText}
                  onChange={(e) =>
                    setTypingForm({ ...typingForm, targetPlainText: e.target.value })
                  }
                  placeholder="Ketik teks polos tanpa tag HTML untuk komparasi kecocokan akurasi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTypingModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg cursor-pointer"
                >
                  Simpan Latihan Mengetik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Akun Pembina */}
      {showPembinaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {editingPembina ? 'Edit Akun Pembina Sekolah' : 'Tambah Akun Pembina Sekolah Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPembinaModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pembinaForm.name.trim() || !pembinaForm.username.trim() || !pembinaForm.assignedSchool.trim()) {
                  showError('Nama, username, dan sekolah binaan wajib diisi!');
                  return;
                }

                if (editingPembina) {
                  updatePembinaUser(editingPembina.id, {
                    name: pembinaForm.name,
                    username: pembinaForm.username,
                    password: pembinaForm.password,
                    assignedSchool: pembinaForm.assignedSchool,
                    pembinaPhone: pembinaForm.pembinaPhone,
                  });
                  showSuccess(`Data pembina ${pembinaForm.name} berhasil diperbarui.`);
                } else {
                  createPembinaUser({
                    name: pembinaForm.name,
                    username: pembinaForm.username,
                    password: pembinaForm.password || 'Pembina@123',
                    assignedSchool: pembinaForm.assignedSchool,
                    pembinaPhone: pembinaForm.pembinaPhone,
                  });
                  showSuccess(`Akun pembina ${pembinaForm.name} untuk sekolah "${pembinaForm.assignedSchool}" berhasil dibuat.`);
                }

                setShowPembinaModal(false);
                reloadAll();
              }}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nama Lengkap Pembina / Guru:
                </label>
                <input
                  type="text"
                  required
                  value={pembinaForm.name}
                  onChange={(e) => setPembinaForm({ ...pembinaForm, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Username Login Pembina:
                  </label>
                  <input
                    type="text"
                    required
                    value={pembinaForm.username}
                    onChange={(e) => setPembinaForm({ ...pembinaForm, username: e.target.value })}
                    placeholder="Contoh: pembina_komputer"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Password Akun Pembina:
                  </label>
                  <input
                    type="text"
                    required
                    value={pembinaForm.password}
                    onChange={(e) => setPembinaForm({ ...pembinaForm, password: e.target.value })}
                    placeholder="Default: Pembina@123"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Sekolah Binaan (Koordinator Binaan):
                </label>
                <input
                  type="text"
                  required
                  value={pembinaForm.assignedSchool}
                  onChange={(e) => setPembinaForm({ ...pembinaForm, assignedSchool: e.target.value })}
                  placeholder="Contoh: SD Bintang Kejora"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Siswa yang didaftarkan ke sekolah ini otomatis muncul di akun Pembina ini.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  No. WhatsApp / Kontak Telepon (Opsional):
                </label>
                <input
                  type="text"
                  value={pembinaForm.pembinaPhone}
                  onChange={(e) => setPembinaForm({ ...pembinaForm, pembinaPhone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPembinaModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 font-bold rounded-xl shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  {editingPembina ? 'Simpan Perubahan' : 'Buat Akun Pembina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Students Modal */}
      <BulkAddStudentsModal
        isOpen={showBulkAddModal}
        onClose={() => setShowBulkAddModal(false)}
        onSuccess={reloadAll}
      />

      {/* Print Student Cards Modal */}
      <PrintStudentCardsModal
        isOpen={showPrintCardsModal}
        students={students}
        initialSelectedIds={selectedStudentTableIds.length > 0 ? selectedStudentTableIds : undefined}
        onClose={() => setShowPrintCardsModal(false)}
      />

      {/* Print Bulk Certificates Modal */}
      <PrintCertificatesModal
        isOpen={showPrintCertificatesModal}
        students={students}
        initialSelectedIds={selectedStudentTableIds.length > 0 ? selectedStudentTableIds : undefined}
        onClose={() => setShowPrintCertificatesModal(false)}
      />

      {/* Grade Recap & Export Excel / CSV Modal */}
      <GradeRecapModal
        isOpen={showGradeRecapModal}
        onClose={() => setShowGradeRecapModal(false)}
      />

      {/* Student Official Certificate Modal */}
      {certificateStudent && (
        <CertificateModal
          isOpen={!!certificateStudent}
          student={certificateStudent}
          onClose={() => setCertificateStudent(null)}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && targetSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  Beri Umpan Balik Guru
                </h3>
                <p className="text-[10px] text-slate-500">Siswa: {targetSubmission.studentName}</p>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFeedback} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tugas / Kuis</p>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {'practiceTitle' in targetSubmission ? targetSubmission.practiceTitle : targetSubmission.quizTitle}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Catatan Koreksi / Apresiasi:
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Contoh: Ketikan sudah sangat rapi, tapi perhatikan spasi ya! Bagus sekali!"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Simpan Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Popup Modal for Deletions */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText || 'Hapus'}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Edit Pembina / Admin Profile Modal */}
      {showEditPembinaProfileModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Ubah Data Profil Akun Anda
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditPembinaProfileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePembinaProfile} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Avatar Selection Grid */}
              <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Pilih Foto Profil / Avatar Pembina:
                </label>
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <Avatar src={pembinaProfileAvatar} name={pembinaProfileName} size="lg" className="border-2 border-indigo-500 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
                      'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow',
                      'https://api.dicebear.com/7.x/bottts/svg?seed=Byte',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
                      'https://api.dicebear.com/7.x/thumbs/svg?seed=Spark',
                      'https://api.dicebear.com/7.x/thumbs/svg?seed=Pixel',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Bear',
                      'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane',
                    ].map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setPembinaProfileAvatar(av)}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                          pembinaProfileAvatar === av ? 'border-indigo-600 scale-105' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    Atau tempel Link URL Foto kustom Anda:
                  </label>
                  <input
                    type="url"
                    value={pembinaProfileAvatar}
                    onChange={(e) => setPembinaProfileAvatar(e.target.value)}
                    placeholder="Contoh: https://link-foto-anda.com/foto.jpg"
                    className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nama Lengkap Pembina / Guru:
                </label>
                <input
                  type="text"
                  required
                  value={pembinaProfileName}
                  onChange={(e) => setPembinaProfileName(e.target.value)}
                  placeholder="Ketik Nama Lengkap"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Username Login Anda:
                  </label>
                  <input
                    type="text"
                    required
                    value={pembinaProfileUsername}
                    onChange={(e) => setPembinaProfileUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Kata Sandi / Password Baru:
                  </label>
                  <input
                    type="text"
                    required
                    value={pembinaProfilePassword}
                    onChange={(e) => setPembinaProfilePassword(e.target.value)}
                    placeholder="Kata Sandi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nomor Telepon / WhatsApp Pembina (Opsional):
                </label>
                <input
                  type="text"
                  value={pembinaProfilePhone}
                  onChange={(e) => setPembinaProfilePhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditPembinaProfileModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg cursor-pointer shadow-md"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* School Reward Item Modal */}
      {showSchoolRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  {editingSchoolReward ? 'Ubah Hadiah Sekolah' : 'Tambah Hadiah Sekolah Baru'}
                </h3>
              </div>
              <button onClick={() => setShowSchoolRewardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSchoolRewardItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Hadiah Fisik:
                </label>
                <input
                  type="text"
                  required
                  value={schoolRewardForm.name}
                  onChange={(e) => setSchoolRewardForm({ ...schoolRewardForm, name: e.target.value })}
                  placeholder="Contoh: Tumbler Eksklusif Komputer Ceria"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Hadiah:
                </label>
                <textarea
                  rows={3}
                  value={schoolRewardForm.description}
                  onChange={(e) => setSchoolRewardForm({ ...schoolRewardForm, description: e.target.value })}
                  placeholder="Deskripsi hadiah dan ketentuan pengambilan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Harga Poin (Bintang):
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={schoolRewardForm.pointCost}
                    onChange={(e) => setSchoolRewardForm({ ...schoolRewardForm, pointCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stok Fisik:
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={schoolRewardForm.stock}
                    onChange={(e) => setSchoolRewardForm({ ...schoolRewardForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Icon Emoji:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={schoolRewardForm.icon}
                  onChange={(e) => setSchoolRewardForm({ ...schoolRewardForm, icon: e.target.value })}
                  placeholder="🎁"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSchoolRewardModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Hadiah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* League Text Modal */}
      {showLeagueTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {editingLeagueText ? 'Ubah Naskah Liga Mengetik' : 'Tambah Naskah Liga Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowLeagueTextModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeagueText} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Naskah Tantangan:
                </label>
                <input
                  type="text"
                  required
                  value={leagueTextForm.title}
                  onChange={(e) => setLeagueTextForm({ ...leagueTextForm, title: e.target.value })}
                  placeholder="Contoh: Petualangan Mengetik 10 Jari"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={leagueTextForm.category}
                    onChange={(e) => setLeagueTextForm({ ...leagueTextForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Dasar">Dasar</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Inspiratif">Inspiratif</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Kesulitan:
                  </label>
                  <select
                    value={leagueTextForm.difficulty}
                    onChange={(e) =>
                      setLeagueTextForm({
                        ...leagueTextForm,
                        difficulty: e.target.value as 'Mudah' | 'Sedang' | 'Sulit',
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (detik):
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    required
                    value={leagueTextForm.durationSeconds}
                    onChange={(e) =>
                      setLeagueTextForm({ ...leagueTextForm, durationSeconds: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Kalimat Naskah yang Harus Diketik:
                </label>
                <textarea
                  rows={5}
                  required
                  value={leagueTextForm.content}
                  onChange={(e) => setLeagueTextForm({ ...leagueTextForm, content: e.target.value })}
                  placeholder="Tuliskan teks kalimat paragraf yang harus diketik oleh siswa saat bertanding..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Jumlah karakter: {leagueTextForm.content.length} karakter · {leagueTextForm.content.trim().split(/\s+/).filter(Boolean).length} kata
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Penulis / Sumber Naskah:
                </label>
                <input
                  type="text"
                  value={leagueTextForm.author}
                  onChange={(e) => setLeagueTextForm({ ...leagueTextForm, author: e.target.value })}
                  placeholder="Contoh: Tim Pembina Komputer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLeagueTextModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Naskah Liga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
