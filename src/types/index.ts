export type UserRole = 'superadmin' | 'admin' | 'pembina' | 'student';

export type BadgeTier = 'Novice' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface User {
  id: string;
  role: UserRole;
  username: string; // "Administrator", "pembina_serikat", or NISN
  password: string;
  name: string;
  nisn?: string;
  grade?: string; // e.g. "Kelas 7A"
  school?: string; // e.g. "SDN Sukadamai 2" or "SD Serikat"
  assignedSchool?: string; // For pembina: e.g. "SD Serikat" or "SDN Sukadamai 2 Bogor"
  assignedGrade?: string; // Optional for pembina: e.g. "Semua Kelas"
  pembinaPhone?: string; // Optional phone number
  avatarUrl?: string; // custom avatar or chosen avatar
  totalPoints: number;
  totalStars: number;
  completedLessons: string[]; // lesson ids
  unlockedShopItemIds?: string[];
  equippedFrame?: string; // e.g. 'gold' | 'neon' | 'cyber' | 'fire'
  equippedTitle?: string; // e.g. 'Kapten Komputer' | 'Master Keyboard' | 'Polisi Siber Cilik'
  equippedBadge?: string; // e.g. 'Word Master' | 'Pelindung Siber'
  equippedAvatar?: string; // custom unlocked avatar
  schoolFaction?: 'processor' | 'graphics' | 'memory'; // Team Battle: Tim Prosesor, Tim Grafis, Tim Memori
  currentSessionId?: string; // Single active session enforcement
  lastActiveAt?: string; // Last heartbeat / activity time
  createdAt: string;
  lastLoginAt?: string;
  loginCount?: number;
}

export interface LoginLog {
  id: string;
  userId: string;
  name: string;
  nisn?: string;
  role: UserRole;
  grade?: string;
  school?: string;
  timestamp: string;
  device?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'frame' | 'title' | 'avatar' | 'badge';
  costStars: number;
  description: string;
  icon: string;
  previewClass?: string;
  titleBadge?: string;
}

export interface BadgeConfig {
  tier: BadgeTier;
  label: string;
  minPoints: number;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export interface GamificationConfig {
  pointsPerLesson: number;
  pointsPerQuizQuestion: number;
  pointsPerTyping: number;
  pointsToStarRatio: number; // e.g. 10 pts = 1 star
  badges: BadgeConfig[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Informasi' | 'Penting' | 'Jadwal' | 'Lomba' | 'Pengumuman';
  content: string;
  date: string;
  isPinned?: boolean;
  authorName?: string;
}

export interface ContactInfoConfig {
  schoolName: string;
  descriptionText: string;
  phonePrimary: string;
  phoneSecondary?: string;
  email: string;
  address: string;
  operationalHours: string;
  socialIg?: string;
  socialYt?: string;
  mapEmbedUrl?: string;
}

export interface DashboardConfig {
  schoolName: string;
  siteTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  runningAnnouncement: string;
  heroBannerUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  points: number;
  readingTimeMinutes: number;
  summary: string;
  content: string; // rich formatting or markdown text
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  imageUrl?: string; // optional image for question
  options: string[]; // 4 options
  optionImages?: (string | null | undefined)[]; // optional images for options A, B, C, D
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation: string;
  weight: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  timeLimitMinutes: number;
  allocatedPoints: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentGrade?: string;
  studentSchool?: string;
  quizId: string;
  quizTitle: string;
  score: number; // 0 - 100%
  correctCount: number;
  totalQuestions: number;
  pointsEarned: number;
  submittedAt: string;
  pembinaFeedback?: string;
  pembinaFeedbackAt?: string;
}

export interface TypingPractice {
  id: string;
  title: string;
  category: string;
  instructions: string;
  targetDocument: string; // HTML sample with formatting, table, etc.
  targetPlainText: string;
  allocatedPoints: number;
  minAccuracy: number; // percentage, e.g. 75
  difficulty: 'Mudah' | 'Sedang' | 'Mahir';
  targetWpm: number;
  createdAt: string;
  tournamentId?: string; // If this belongs to a tournament
}

export interface TypingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentGrade?: string;
  studentSchool?: string;
  practiceId: string;
  practiceTitle: string;
  accuracy: number;
  wpm: number;
  pointsEarned: number;
  submittedAt: string;
  userContent: string;
  pembinaFeedback?: string;
  pembinaFeedbackAt?: string;
}

export interface TypingTournament {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  practiceId: string; // The specific practice for the tournament
  isActive: boolean;
  maxParticipants?: number;
  prizes?: string[];
  winners?: {
    studentId: string;
    studentName: string;
    wpm: number;
    accuracy: number;
    rank: number;
  }[];
}

export interface VisitorStats {
  todayCount: number;
  totalCount: number;
  lastDate: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  title: string;
  category: 'quiz' | 'typing' | 'lesson' | 'game' | 'general';
  description: string;
  iconName: string;
  badgeColor: string;
  requiredCondition: string;
  rewardPoints: number;
}

export interface StudentGalleryWork {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentGrade?: string;
  studentSchool?: string;
  title: string;
  category: string;
  type: 'paint' | 'word';
  imageUrl?: string;
  contentHtml?: string;
  previewText: string;
  starLikes: number;
  likedByStudentIds: string[];
  createdAt: string;
}

export interface StudentGradeSummary {
  studentId: string;
  name: string;
  nisn: string;
  grade: string;
  school: string;
  completedLessonsCount: number;
  quizzesTakenCount: number;
  avgQuizScore: number;
  typingPracticesCount: number;
  avgTypingAccuracy: number;
  avgTypingWpm: number;
  totalPoints: number;
  totalStars: number;
  badgeTier: BadgeTier;
}

export interface CertificateConfig {
  headerTitle: string; // e.g. "KOMPUTER CERIA"
  subHeaderTitle: string; // e.g. "SDN SUKADAMAI 2 BOGOR"
  certificateTitle: string; // e.g. "SERTIFIKAT PENGHARGAAN"
  locationAndDate: string; // e.g. "Kota Bogor" or custom date string

  // Signatory 1 (e.g. Pembina / Instruktur)
  signer1Label: string; // e.g. "Mengetahui,"
  signer1Title: string; // e.g. "Pembina Ekstrakurikuler Komputer"
  signer1Name: string; // e.g. "Rzk Digital Studio"
  signer1Nip?: string; // e.g. "NIP. 19900101 202201 1 001" or empty
  signer1SignatureUrl?: string; // Base64 image or image URL for TTD / Stempel

  // Signatory 2 (e.g. Kepala Sekolah / Penanggung Jawab)
  signer2Label: string; // e.g. "Mengetahui,"
  signer2Title: string; // e.g. "Kepala Sekolah / Penanggung Jawab"
  signer2Name: string; // e.g. "SDN Sukadamai 2 Bogor"
  signer2Nip?: string; // e.g. "NIP. 19850312 201001 1 005" or empty
  signer2SignatureUrl?: string; // Base64 image or image URL for TTD / Stempel

  // Barcode / Verification Seal
  sealTitle?: string; // e.g. "RESMI · TERVERIFIKASI"
  sealImageUrl?: string; // Base64 image or image URL for Barcode / QR Code / Seal
}

export interface GameFeatureControl {
  id: string;
  name: string;
  category: 'game' | 'utility' | 'simulator';
  isEnabled: boolean;
  pointsMultiplier: number;
  basePoints?: number;
  customSetting?: string;
}

export interface GamesConfig {
  features: GameFeatureControl[];
}

export interface GameBattle {
  id: string;
  gameType: 'quiz_duel' | 'typing_race';
  status: 'pending' | 'active' | 'finished' | 'cancelled';
  challengerId: string;
  challengerName: string;
  challengerAvatar?: string;
  opponentId: string;
  opponentName: string;
  opponentAvatar?: string;
  winnerId?: string;
  currentRound: number;
  challengerScore: number;
  opponentScore: number;
  challengerSelection?: number; // for quiz
  opponentSelection?: number; // for quiz
  challengerProgress?: number; // for typing
  opponentProgress?: number; // for typing
  questionIndices?: number[]; // shared quiz questions
  typingText?: string; // shared typing race text
  createdAt: string;
  updatedAt: string;
}

export interface SchoolRewardItem {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  stock: number;
  icon: string;
  badgeLabel?: string;
  isActive: boolean;
}

export interface RewardRedemption {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade?: string;
  rewardId: string;
  rewardName: string;
  pointCost: number;
  redeemCode: string;
  redeemedAt: string;
  status: 'pending' | 'completed' | 'cancelled';
  completedAt?: string;
}

export interface TypingLeagueText {
  id: string;
  title: string;
  category: string;
  durationSeconds: number; // Duration in seconds (e.g. 60, 90, 120)
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  content: string; // The passage/sentences to type
  author?: string;
  school?: string; // Optional: specific to a school or all
  createdAt: string;
  updatedAt?: string;
}

export interface TypingLeagueScore {
  id: string;
  textId: string;
  textTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentSchool?: string;
  studentGrade?: string;
  equippedFrame?: string;
  equippedTitle?: string;
  equippedBadge?: string;
  wpm: number;
  accuracy: number; // percentage e.g. 98.5
  rawKpm: number; // keystrokes / minute
  errorsCount: number;
  timeSpentSeconds: number;
  score: number; // Total points score
  starsEarned: number;
  submittedAt: string;
}

