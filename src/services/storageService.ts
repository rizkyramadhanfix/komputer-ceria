import {
  DEFAULT_CERTIFICATE_CONFIG,
  DEFAULT_DASHBOARD_CONFIG,
  DEFAULT_GAMIFICATION_CONFIG,
  INITIAL_ANNOUNCEMENTS,
  DEFAULT_CONTACT_INFO,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_TYPING_PRACTICES,
  INITIAL_USERS,
} from '../data/initialData';
import {
  Achievement,
  AnnouncementItem,
  BadgeConfig,
  CertificateConfig,
  ContactInfoConfig,
  DashboardConfig,
  GamificationConfig,
  Lesson,
  Quiz,
  QuizSubmission,
  StudentGalleryWork,
  StudentGradeSummary,
  ShopItem,
  TypingPractice,
  TypingSubmission,
  User,
  VisitorStats,
  GamesConfig,
  GameFeatureControl,
  LoginLog,
  SchoolRewardItem,
  RewardRedemption,
  TypingTournament,
  TypingLeagueText,
  TypingLeagueScore,
} from '../types';
// Firebase is completely disabled per user request -> 100% online Express Server-DB

const STORAGE_KEYS = {
  USERS: 'ekskul_users',
  LESSONS: 'ekskul_lessons',
  QUIZZES: 'ekskul_quizzes',
  TYPING_PRACTICES: 'ekskul_typing_practices',
  TYPING_SUBMISSIONS: 'ekskul_typing_submissions',
  QUIZ_SUBMISSIONS: 'ekskul_quiz_submissions',
  GAMIFICATION_CONFIG: 'ekskul_gamification_config',
  DASHBOARD_CONFIG: 'ekskul_dashboard_config',
  CERTIFICATE_CONFIG: 'ekskul_certificate_config',
  VISITOR_STATS: 'ekskul_visitor_stats',
  CURRENT_USER: 'ekskul_active_user',
  GALLERY_WORKS: 'ekskul_gallery_works',
  GAME_SCORES: 'ekskul_game_scores',
  GAMES_CONFIG: 'ekskul_games_config',
  LOGIN_LOGS: 'ekskul_login_logs',
  SCHOOL_REWARDS: 'ekskul_school_rewards',
  REWARD_REDEMPTIONS: 'ekskul_reward_redemptions',
  ANNOUNCEMENTS: 'ekskul_announcements',
  CONTACT_INFO: 'ekskul_contact_info',
  TYPING_TOURNAMENTS: 'ekskul_typing_tournaments',
  TYPING_LEAGUE_TEXTS: 'ekskul_typing_league_texts',
  TYPING_LEAGUE_SCORES: 'ekskul_typing_league_scores',
  DELETED_TYPING_LEAGUE_TEXTS: 'ekskul_deleted_typing_league_texts',
  CLEAN_FLAG: 'ekskul_clean_v4',
};

// Automatic one-time cleanup
(function purgeDummyDataOnce() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.CLEAN_FLAG) !== 'true') {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.LESSONS);
      localStorage.removeItem(STORAGE_KEYS.QUIZZES);
      localStorage.removeItem(STORAGE_KEYS.TYPING_PRACTICES);
      localStorage.removeItem(STORAGE_KEYS.TYPING_SUBMISSIONS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_SUBMISSIONS);
      localStorage.removeItem(STORAGE_KEYS.VISITOR_STATS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.setItem(STORAGE_KEYS.CLEAN_FLAG, 'true');
    }
  } catch (e) {
    console.error('Storage purge error:', e);
  }
})();

// --- Helper Functions for LocalStorage ---
function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// --- Server-DB Sync Helpers (Replacements for Firestore) ---
export async function fetchCollectionFromServer(collectionName: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/db/${collectionName}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    // Gracefully handle server offline / fallback to local storage
  }
  return [];
}

export async function syncCollectionFromServer(collectionName: string, storageKey: string) {
  const data = await fetchCollectionFromServer(collectionName);
  if (data && data.length > 0) {
    const existingRaw = localStorage.getItem(storageKey);
    const newRaw = JSON.stringify(data);
    if (existingRaw !== newRaw) {
      setStoredItem(storageKey, data);
      notifyDataUpdated();
    }
  }
}

async function syncDocToFirestore(collectionName: string, id: string, data: any): Promise<void> {
  try {
    await fetch(`/api/db/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id }),
    });
  } catch (err) {
    console.warn(`Server DB sync failed for ${collectionName}/${id}:`, err);
  }
}

async function removeDocFromFirestore(collectionName: string, id: string): Promise<void> {
  try {
    await fetch(`/api/db/${collectionName}/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn(`Server DB delete failed for ${collectionName}/${id}:`, err);
  }
}

let notifyTimer: any = null;
function notifyDataUpdated() {
  if (notifyTimer) return;
  notifyTimer = setTimeout(() => {
    notifyTimer = null;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ekskul_data_updated'));
    }
  }, 500);
}

// --- Real-time Server-DB Sync Loop ---
let listenersInitialized = false;
let serverSyncInterval: any = null;

function initFirestoreListeners() {
  if (listenersInitialized) return;
  listenersInitialized = true;

  const allSync = async () => {
    const collectionsToSync = [
      { col: 'users', key: STORAGE_KEYS.USERS },
      { col: 'lessons', key: STORAGE_KEYS.LESSONS },
      { col: 'quizzes', key: STORAGE_KEYS.QUIZZES },
      { col: 'typingPractices', key: STORAGE_KEYS.TYPING_PRACTICES },
      { col: 'typingSubmissions', key: STORAGE_KEYS.TYPING_SUBMISSIONS },
      { col: 'quizSubmissions', key: STORAGE_KEYS.QUIZ_SUBMISSIONS },
      { col: 'config', key: 'dashboard' }, // config handled below
      { col: 'galleryWorks', key: STORAGE_KEYS.GALLERY_WORKS },
      { col: 'gameScores', key: STORAGE_KEYS.GAME_SCORES },
      { col: 'loginLogs', key: STORAGE_KEYS.LOGIN_LOGS },
      { col: 'typingTournaments', key: STORAGE_KEYS.TYPING_TOURNAMENTS },
      { col: 'typingLeagueTexts', key: STORAGE_KEYS.TYPING_LEAGUE_TEXTS },
      { col: 'typingLeagueScores', key: STORAGE_KEYS.TYPING_LEAGUE_SCORES },
      { col: 'schoolRewards', key: STORAGE_KEYS.SCHOOL_REWARDS },
      { col: 'rewardRedemptions', key: STORAGE_KEYS.REWARD_REDEMPTIONS },
      { col: 'announcements', key: STORAGE_KEYS.ANNOUNCEMENTS },
      { col: 'forumThreads', key: 'ekskul_forum_threads' },
      { col: 'forumReplies', key: 'ekskul_forum_replies' },
    ];

    for (const item of collectionsToSync) {
      if (item.col === 'config') {
        const configs = await fetchCollectionFromServer('config');
        configs.forEach((cfg) => {
          if (cfg.id === 'dashboard') setStoredItem(STORAGE_KEYS.DASHBOARD_CONFIG, cfg);
          else if (cfg.id === 'certificate') setStoredItem(STORAGE_KEYS.CERTIFICATE_CONFIG, cfg);
          else if (cfg.id === 'gamification') setStoredItem(STORAGE_KEYS.GAMIFICATION_CONFIG, cfg);
          else if (cfg.id === 'games_config') setStoredItem(STORAGE_KEYS.GAMES_CONFIG, cfg);
        });
      } else {
        await syncCollectionFromServer(item.col, item.key);
      }
    }
  };

  allSync();

  // Polling highly dynamic interactive collections every 3 seconds to keep other computers in sync online!
  if (!serverSyncInterval) {
    serverSyncInterval = setInterval(async () => {
      await syncCollectionFromServer('users', STORAGE_KEYS.USERS);
      await syncCollectionFromServer('typingSubmissions', STORAGE_KEYS.TYPING_SUBMISSIONS);
      await syncCollectionFromServer('quizSubmissions', STORAGE_KEYS.QUIZ_SUBMISSIONS);
      await syncCollectionFromServer('forumThreads', 'ekskul_forum_threads');
      await syncCollectionFromServer('forumReplies', 'ekskul_forum_replies');
      await syncCollectionFromServer('gameScores', STORAGE_KEYS.GAME_SCORES);
      await syncCollectionFromServer('announcements', STORAGE_KEYS.ANNOUNCEMENTS);
      await syncCollectionFromServer('rewardRedemptions', STORAGE_KEYS.REWARD_REDEMPTIONS);
    }, 3000);
  }
}

// --- Seed Server DB if Empty ---
async function seedServerDbIfEmpty() {
  try {
    const serverUsers = await fetchCollectionFromServer('users');
    if (serverUsers.length === 0) {
      console.log('🌱 Seeding initial users to Server DB...');
      const initialUsers = getUsers();
      for (const u of initialUsers) {
        await syncDocToFirestore('users', u.id, u);
      }
    }

    const serverLessons = await fetchCollectionFromServer('lessons');
    if (serverLessons.length === 0) {
      console.log('🌱 Seeding initial lessons to Server DB...');
      const initialLessons = getLessons();
      for (const l of initialLessons) {
        await syncDocToFirestore('lessons', l.id, l);
      }
    }

    const serverQuizzes = await fetchCollectionFromServer('quizzes');
    if (serverQuizzes.length === 0) {
      console.log('🌱 Seeding initial quizzes to Server DB...');
      const initialQuizzes = getQuizzes();
      for (const q of initialQuizzes) {
        await syncDocToFirestore('quizzes', q.id, q);
      }
    }

    const serverTyping = await fetchCollectionFromServer('typingPractices');
    if (serverTyping.length === 0) {
      console.log('🌱 Seeding initial typing practices to Server DB...');
      const initialTyping = getTypingPractices();
      for (const tp of initialTyping) {
        await syncDocToFirestore('typingPractices', tp.id, tp);
      }
    }

    const configs = await fetchCollectionFromServer('config');
    if (configs.length === 0) {
      await syncDocToFirestore('config', 'dashboard', getDashboardConfig());
      await syncDocToFirestore('config', 'certificate', getCertificateConfig());
      await syncDocToFirestore('config', 'gamification', getGamificationConfig());
      await syncDocToFirestore('config', 'games_config', getGamesConfig());
    }
  } catch (err) {
    console.warn('Server DB seeding warning:', err);
  }
}

// Start listeners and seeding check
initFirestoreListeners();
seedServerDbIfEmpty();

// --- Users Management ---
export function getUsers(): User[] {
  const rawUsers = getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  console.log('DEBUG: getUsers rawUsers length:', rawUsers?.length);
  let hasModified = false;
  
  // Deduplicate users array by ID and username
  const users: User[] = [];
  const seenIds = new Set<string>();
  const seenUsernames = new Set<string>();

  for (const u of rawUsers) {
    const lowerUsername = u.username ? u.username.toLowerCase().trim() : '';
    if (!u.id || seenIds.has(u.id) || (lowerUsername && seenUsernames.has(lowerUsername))) {
      hasModified = true;
      continue;
    }
    // Filter out dummy pembina accounts
    if (
      u.id === 'usr-pembina-sukadamai' ||
      u.id === 'usr-pembina-serikat' ||
      lowerUsername === 'pembina_sukadamai' ||
      lowerUsername === 'pembina_serikat'
    ) {
      hasModified = true;
      continue;
    }
    seenIds.add(u.id);
    if (lowerUsername) seenUsernames.add(lowerUsername);
    users.push(u);
  }

  // Ensure default Administrator / Superadmin exists
  const hasSuperadmin = users.some(
    (u) =>
      (u.role === 'superadmin' || u.role === 'admin') &&
      (u.username === 'Administrator' || u.username.toLowerCase() === 'administrator')
  );
  if (!hasSuperadmin) {
    const defaultSuperadmin: User = {
      id: 'usr-superadmin-default',
      role: 'superadmin',
      username: 'Administrator',
      password: 'Admin@123',
      name: 'Super Administrator Pusat',
      totalPoints: 0,
      totalStars: 0,
      completedLessons: [],
      createdAt: new Date().toISOString(),
    };
    users.unshift(defaultSuperadmin);
    hasModified = true;
  }

  if (hasModified) {
    setStoredItem(STORAGE_KEYS.USERS, users);
  }

  return users;
}

// --- Pembina Management Helpers ---
export function getPembinaUsers(): User[] {
  return getUsers().filter((u) => u.role === 'pembina');
}

export function getRegisteredSchools(): string[] {
  const pembinas = getPembinaUsers();
  const schools: string[] = [];
  pembinas.forEach((p) => {
    const sch = (p.assignedSchool || p.school || '').trim();
    if (sch) schools.push(sch);
  });
  return Array.from(new Set(schools)).sort();
}

export function createPembinaUser(data: {
  name: string;
  username: string;
  password: string;
  assignedSchool: string;
  pembinaPhone?: string;
}): User {
  const users = getUsers();
  const newPembina: User = {
    id: `usr-pembina-${Date.now()}`,
    role: 'pembina',
    username: data.username.trim(),
    password: data.password.trim(),
    name: data.name.trim(),
    school: data.assignedSchool.trim(),
    assignedSchool: data.assignedSchool.trim(),
    pembinaPhone: data.pembinaPhone?.trim(),
    totalPoints: 0,
    totalStars: 0,
    completedLessons: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newPembina);
  saveUsers(users);
  syncDocToFirestore('users', newPembina.id, newPembina);
  notifyDataUpdated();
  return newPembina;
}

export function updatePembinaUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id && u.role === 'pembina');
  if (idx === -1) return null;

  users[idx] = {
    ...users[idx],
    ...updates,
    school: updates.assignedSchool || users[idx].school,
  };
  saveUsers(users);
  syncDocToFirestore('users', id, users[idx]);
  notifyDataUpdated();
  return users[idx];
}

export function deletePembinaUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  removeDocFromFirestore('users', id);
  notifyDataUpdated();
  return true;
}

export function saveUsers(users: User[]): void {
  setStoredItem(STORAGE_KEYS.USERS, users);
  notifyDataUpdated();
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByUsernameOrNisn(identifier: string): User | undefined {
  const clean = identifier.trim().toLowerCase();
  return getUsers().find(
    (u) =>
      u.username.toLowerCase() === clean ||
      (u.nisn && u.nisn.toLowerCase() === clean) ||
      u.name.toLowerCase() === clean
  );
}

export function createUser(
  userData: Omit<User, 'id' | 'createdAt' | 'totalPoints' | 'totalStars' | 'completedLessons'> & { id?: string }
): User {
  const users = getUsers();
  const newUser: User = {
    id: userData.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...userData,
    totalPoints: 0,
    totalStars: 0,
    completedLessons: [],
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setStoredItem(STORAGE_KEYS.USERS, users);
  syncDocToFirestore('users', newUser.id, newUser);
  notifyDataUpdated();
  return newUser;
}

export function isStudentOnline(user: User): boolean {
  if (!user || user.role !== 'student') return false;

  // Check lastActiveAt within last 15 minutes
  if (user.lastActiveAt) {
    const lastActiveTime = new Date(user.lastActiveAt).getTime();
    if (!isNaN(lastActiveTime) && Date.now() - lastActiveTime < 15 * 60 * 1000) {
      return true;
    }
  }

  // Check recent successful login log within last 15 minutes
  const loginLogs = getStoredItem<any[]>(STORAGE_KEYS.LOGIN_LOGS, []);
  const studentLogs = loginLogs.filter((l) => l.userId === user.id && l.status === 'success');
  if (studentLogs.length > 0) {
    const latestLog = studentLogs[0];
    const logTime = new Date(latestLog.loginTime).getTime();
    if (!isNaN(logTime) && Date.now() - logTime < 15 * 60 * 1000) {
      return true;
    }
  }

  return false;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  setStoredItem(STORAGE_KEYS.USERS, users);
  syncDocToFirestore('users', id, users[idx]);

  // If current logged-in user is updated, sync active user storage
  const activeUser = getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (activeUser && activeUser.id === id) {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, users[idx]);
  }

  notifyDataUpdated();
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  setStoredItem(STORAGE_KEYS.USERS, filtered);
  removeDocFromFirestore('users', id);
  notifyDataUpdated();
  return true;
}

// --- Dashboard Config Management ---
export function getDashboardConfig(): DashboardConfig {
  const config = getStoredItem<DashboardConfig>(STORAGE_KEYS.DASHBOARD_CONFIG, DEFAULT_DASHBOARD_CONFIG);
  if (config.siteTitle.startsWith('EkskulKomputer') || config.schoolName === 'Ekstrakurikuler Komputer') {
    config.siteTitle = DEFAULT_DASHBOARD_CONFIG.siteTitle;
    config.schoolName = DEFAULT_DASHBOARD_CONFIG.schoolName;
    config.heroHeadline = DEFAULT_DASHBOARD_CONFIG.heroHeadline;
    config.heroSubheadline = DEFAULT_DASHBOARD_CONFIG.heroSubheadline;
    config.runningAnnouncement = DEFAULT_DASHBOARD_CONFIG.runningAnnouncement;
    saveDashboardConfig(config);
  }
  return config;
}

export function saveDashboardConfig(config: DashboardConfig): void {
  setStoredItem(STORAGE_KEYS.DASHBOARD_CONFIG, config);
  syncDocToFirestore('config', 'dashboard', config);
  notifyDataUpdated();
}

// --- Announcement Management (Superadmin Controlled) ---
export function getAnnouncements(): AnnouncementItem[] {
  return getStoredItem<AnnouncementItem[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
}

export function saveAnnouncements(announcements: AnnouncementItem[]): void {
  setStoredItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  notifyDataUpdated();
}

export function createAnnouncement(data: Omit<AnnouncementItem, 'id'>): AnnouncementItem {
  const items = getAnnouncements();
  const newItem: AnnouncementItem = {
    id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...data,
  };
  items.unshift(newItem);
  saveAnnouncements(items);
  syncDocToFirestore('announcements', newItem.id, newItem);
  return newItem;
}

export function updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): AnnouncementItem | null {
  const items = getAnnouncements();
  const idx = items.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  saveAnnouncements(items);
  syncDocToFirestore('announcements', id, items[idx]);
  return items[idx];
}

export function deleteAnnouncement(id: string): boolean {
  const items = getAnnouncements();
  const filtered = items.filter((a) => a.id !== id);
  if (filtered.length === items.length) return false;
  saveAnnouncements(filtered);
  removeDocFromFirestore('announcements', id);
  return true;
}

// --- Contact Info Management (Superadmin Controlled) ---
export function getContactInfo(): ContactInfoConfig {
  return getStoredItem<ContactInfoConfig>(STORAGE_KEYS.CONTACT_INFO, DEFAULT_CONTACT_INFO);
}

export function saveContactInfo(config: ContactInfoConfig): void {
  setStoredItem(STORAGE_KEYS.CONTACT_INFO, config);
  syncDocToFirestore('settings', 'contact_info', config);
  notifyDataUpdated();
}

// --- Certificate Configuration (Multi-School & Master Default) ---
export function getCertificateConfig(): CertificateConfig {
  return getStoredItem<CertificateConfig>(
    STORAGE_KEYS.CERTIFICATE_CONFIG,
    DEFAULT_CERTIFICATE_CONFIG
  );
}

export function saveCertificateConfig(config: CertificateConfig): void {
  setStoredItem(STORAGE_KEYS.CERTIFICATE_CONFIG, config);
  syncDocToFirestore('config', 'certificate', config);
  notifyDataUpdated();
}

const DEFAULT_SCHOOL_CERT_CONFIGS: Record<string, CertificateConfig> = {};

export function getSchoolCertificateConfigs(): Record<string, CertificateConfig> {
  const configs = getStoredItem<Record<string, CertificateConfig>>(
    'ekskul_school_certificates',
    DEFAULT_SCHOOL_CERT_CONFIGS
  );
  return { ...DEFAULT_SCHOOL_CERT_CONFIGS, ...configs };
}

export function getCertificateConfigForSchool(schoolName?: string): CertificateConfig {
  const masterDefault = getCertificateConfig();
  if (!schoolName || schoolName === 'Semua Sekolah' || schoolName === 'Template Standar Global') {
    return masterDefault;
  }

  const allConfigs = getSchoolCertificateConfigs();
  const normalizedSchool = schoolName.trim().toLowerCase();
  const matchedKey = Object.keys(allConfigs).find(
    (k) => k.trim().toLowerCase() === normalizedSchool
  );

  if (matchedKey && allConfigs[matchedKey]) {
    return allConfigs[matchedKey];
  }

  // Fallback customized dynamically
  return {
    ...masterDefault,
    subHeaderTitle: schoolName.toUpperCase(),
    signer2Title: `Kepala ${schoolName}`,
    signer2Name: `Kepala Sekolah ${schoolName}`,
  };
}

export function saveCertificateConfigForSchool(schoolName: string, config: CertificateConfig): void {
  const allConfigs = getSchoolCertificateConfigs();
  allConfigs[schoolName] = config;
  setStoredItem('ekskul_school_certificates', allConfigs);
  syncDocToFirestore('config', `certificate_${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}`, config);
  notifyDataUpdated();
}

// --- Gamification Configuration ---
export function getGamificationConfig(): GamificationConfig {
  return getStoredItem<GamificationConfig>(
    STORAGE_KEYS.GAMIFICATION_CONFIG,
    DEFAULT_GAMIFICATION_CONFIG
  );
}

export function saveGamificationConfig(config: GamificationConfig): void {
  setStoredItem(STORAGE_KEYS.GAMIFICATION_CONFIG, config);
  syncDocToFirestore('config', 'gamification', config);
  notifyDataUpdated();
}

export const DEFAULT_SCHOOL_REWARDS: SchoolRewardItem[] = [
  {
    id: 'rew-1',
    name: 'Stiker Hologram Komputer Ceria',
    description: 'Stiker eksklusif tahan air berdesain maskot Komputer Ceria untuk ditempel di laptop, buku, atau tumbler.',
    pointCost: 100,
    stock: 50,
    icon: 'Sparkles',
    badgeLabel: 'Favorit',
    isActive: true,
  },
  {
    id: 'rew-2',
    name: 'Voucher Jajan Kantin Sekolah Rp 5.000',
    description: 'Kupon jajan gratis senilai Rp 5.000 yang berlaku di seluruh kantin resmi sekolah.',
    pointCost: 250,
    stock: 30,
    icon: 'Utensils',
    badgeLabel: 'Populer',
    isActive: true,
  },
  {
    id: 'rew-3',
    name: 'Sertifikat Fisik Berbingkai Eksklusif',
    description: 'Sertifikat penghargaan fisik resmi bertanda tangan Kepala Sekolah & Pembina berbingkai kayu emas.',
    pointCost: 500,
    stock: 15,
    icon: 'Award',
    badgeLabel: 'Prestasi',
    isActive: true,
  },
  {
    id: 'rew-4',
    name: 'Kupon Bebas Piket Lab Komputer (1x)',
    description: 'Tiket dispensasi bebas tugas piket merapikan lab komputer sebanyak 1 kali pertemuan.',
    pointCost: 200,
    stock: 20,
    icon: 'CheckCircle2',
    badgeLabel: 'Spesial',
    isActive: true,
  },
];

const DEFAULT_GAMES_CONFIG: GamesConfig = {
  features: [
    { id: 'pc-doctor', name: 'Klinik Dokter PC (Troubleshooting)', category: 'simulator', isEnabled: true, pointsMultiplier: 1 },
    { id: 'pixel-art', name: 'Studio Pixel Art 8-Bit', category: 'simulator', isEnabled: true, pointsMultiplier: 1 },
    { id: 'spreadsheet-adventure', name: 'Petualangan Excel Cilik', category: 'game', isEnabled: true, pointsMultiplier: 1 },
    { id: 'reward-shop', name: 'Toko Hadiah Poin Sekolah', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
    { id: 'tech-glossary', name: 'Kamus & Audio A-Z Teknologi', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
    { id: 'file-explorer', name: 'Manajemen Berkas & Folder', category: 'game', isEnabled: true, pointsMultiplier: 1, customSetting: '60' },
    { id: 'network-builder', name: 'Simulator Jaringan Komputer', category: 'simulator', isEnabled: true, pointsMultiplier: 1, customSetting: 'normal' },
    { id: 'typing-hero', name: 'Typing RPG Quest', category: 'game', isEnabled: true, pointsMultiplier: 1, customSetting: '100' },
    { id: 'quiz-duel', name: 'Cerdas Cermat Duel', category: 'game', isEnabled: true, pointsMultiplier: 1, customSetting: 'normal' },
    { id: 'games', name: 'Game Kata Jatuh', category: 'game', isEnabled: true, pointsMultiplier: 1, customSetting: '1.0' },
    { id: 'pc-builder', name: 'Simulator Merakit PC', category: 'simulator', isEnabled: true, pointsMultiplier: 1 },
    { id: 'coding-lab', name: 'Lab Koding Blockly', category: 'simulator', isEnabled: true, pointsMultiplier: 1 },
    { id: 'typing-race', name: 'Balapan Mengetik', category: 'game', isEnabled: true, pointsMultiplier: 1 },
    { id: 'cyber-safety', name: 'Edukasi Keamanan Siber', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
    { id: 'shortcuts', name: 'Master Shortcut Keyboard', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
    { id: 'daily-quests', name: 'Misi Harian & Streak Absen', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
    { id: 'port-master', name: 'Master Colokan & Port Komputer', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 40 },
    { id: 'binary-code', name: 'Detektif Kode Biner (0 dan 1)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 50 },
    { id: 'anti-phishing', name: 'Detektif Anti-Phishing Siber', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 45 },
    { id: 'grid-robot', name: 'Grid Robot Navigator (Logika Blok)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 50 },
    { id: 'typing-league', name: 'Liga Mengetik Cepat 10 Jari', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 60 },
    { id: 'cyber-shield', name: 'Cyber Shield Defender (Pertahanan Antivirus & Firewall)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 50 },
    { id: 'robot-maze', name: 'Algoritma Maze Runner (Logika Pemrograman Robot)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 55 },
    { id: 'lan-crimping', name: 'Simulator Krimping Kabel Jaringan LAN (UTP T568B)', category: 'simulator', isEnabled: true, pointsMultiplier: 1, basePoints: 45 },
    { id: 'rhythm-typing', name: 'Rhythm Typing Beats (Mengetik Irama Musik)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 60 },
    { id: 'storage-master', name: 'Storage Master (Byte to Gigabyte Challenge)', category: 'game', isEnabled: true, pointsMultiplier: 1, basePoints: 50 },
    { id: 'mini-poster', name: 'Studio Desain Poster Cilik (Mini Canva)', category: 'simulator', isEnabled: true, pointsMultiplier: 1, basePoints: 40 },
    { id: 'activity-calendar', name: 'Kalender Agenda Praktikum & Kegiatan Ekskul', category: 'utility', isEnabled: true, pointsMultiplier: 1 },
  ]
};

export function getGamesConfig(): GamesConfig {
  const stored = getStoredItem<GamesConfig>(STORAGE_KEYS.GAMES_CONFIG, DEFAULT_GAMES_CONFIG);
  if (!stored || !stored.features) return DEFAULT_GAMES_CONFIG;

  const existingIds = new Set(stored.features.map((f) => f.id));
  let changed = false;
  for (const defFeature of DEFAULT_GAMES_CONFIG.features) {
    if (!existingIds.has(defFeature.id)) {
      stored.features.push(defFeature);
      changed = true;
    }
  }
  if (changed) {
    setStoredItem(STORAGE_KEYS.GAMES_CONFIG, stored);
    syncDocToFirestore('config', 'games_config', stored);
  }
  return stored;
}

export function saveGamesConfig(config: GamesConfig): void {
  setStoredItem(STORAGE_KEYS.GAMES_CONFIG, config);
  syncDocToFirestore('config', 'games_config', config);
  notifyDataUpdated();
}

// --- School Rewards & Redemption Management ---
export function getSchoolRewards(): SchoolRewardItem[] {
  const stored = localStorage.getItem(STORAGE_KEYS.SCHOOL_REWARDS);
  if (stored !== null) {
    try {
      return JSON.parse(stored) as SchoolRewardItem[];
    } catch {
      return DEFAULT_SCHOOL_REWARDS;
    }
  }
  setStoredItem(STORAGE_KEYS.SCHOOL_REWARDS, DEFAULT_SCHOOL_REWARDS);
  return DEFAULT_SCHOOL_REWARDS;
}

export function saveSchoolRewards(rewards: SchoolRewardItem[]): void {
  const previous = getSchoolRewards();
  const currentIds = new Set(rewards.map((r) => r.id));
  for (const prev of previous) {
    if (!currentIds.has(prev.id)) {
      removeDocFromFirestore('schoolRewards', prev.id);
    }
  }
  setStoredItem(STORAGE_KEYS.SCHOOL_REWARDS, rewards);
  rewards.forEach((r) => syncDocToFirestore('schoolRewards', r.id, r));
  notifyDataUpdated();
}

export function deleteSchoolReward(id: string): void {
  const rewards = getSchoolRewards().filter((r) => r.id !== id);
  setStoredItem(STORAGE_KEYS.SCHOOL_REWARDS, rewards);
  removeDocFromFirestore('schoolRewards', id);
  notifyDataUpdated();
}

export function getRewardRedemptions(): RewardRedemption[] {
  return getStoredItem<RewardRedemption[]>(STORAGE_KEYS.REWARD_REDEMPTIONS, []);
}

export function saveRewardRedemptions(redemptions: RewardRedemption[]): void {
  setStoredItem(STORAGE_KEYS.REWARD_REDEMPTIONS, redemptions);
  notifyDataUpdated();
}

export function redeemReward(
  studentId: string,
  rewardId: string
): { success: boolean; message: string; redemption?: RewardRedemption } {
  const users = getUsers();
  const uIdx = users.findIndex((u) => u.id === studentId);
  if (uIdx === -1) {
    return { success: false, message: 'Data siswa tidak ditemukan.' };
  }
  const user = users[uIdx];

  const rewards = getSchoolRewards();
  const rIdx = rewards.findIndex((r) => r.id === rewardId);
  if (rIdx === -1) {
    return { success: false, message: 'Hadiah tidak ditemukan.' };
  }
  const reward = rewards[rIdx];

  if (!reward.isActive) {
    return { success: false, message: 'Hadiah ini sedang tidak aktif.' };
  }
  if (reward.stock <= 0) {
    return { success: false, message: 'Stok hadiah ini sudah habis.' };
  }
  if ((user.totalPoints || 0) < reward.pointCost) {
    return {
      success: false,
      message: `Poin tidak mencukupi. Anda butuh ${reward.pointCost} poin, saat ini Anda memiliki ${user.totalPoints || 0} poin.`,
    };
  }

  // Deduct points
  const pointsToStarRatio = getGamificationConfig().pointsToStarRatio || 10;
  user.totalPoints = (user.totalPoints || 0) - reward.pointCost;
  user.totalStars = Math.floor(user.totalPoints / pointsToStarRatio);
  users[uIdx] = user;
  saveUsers(users);

  // Deduct stock
  reward.stock -= 1;
  rewards[rIdx] = reward;
  saveSchoolRewards(rewards);

  // Create redemption record
  const code = `KPN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const newRedemption: RewardRedemption = {
    id: `red-${Date.now()}`,
    studentId: user.id,
    studentName: user.name,
    studentGrade: user.grade,
    rewardId: reward.id,
    rewardName: reward.name,
    pointCost: reward.pointCost,
    redeemCode: code,
    redeemedAt: new Date().toISOString(),
    status: 'pending',
  };

  const redemptions = getRewardRedemptions();
  redemptions.unshift(newRedemption);
  setStoredItem(STORAGE_KEYS.REWARD_REDEMPTIONS, redemptions);
  syncDocToFirestore('rewardRedemptions', newRedemption.id, newRedemption);
  notifyDataUpdated();

  return {
    success: true,
    message: `Selamat! Anda berhasil menukarkan ${reward.pointCost} poin untuk ${reward.name}. Tunjukkan kode voucher Anda kepada Guru Pembina!`,
    redemption: newRedemption,
  };
}

export function updateRedemptionStatus(
  id: string,
  status: 'completed' | 'cancelled'
): boolean {
  const redemptions = getRewardRedemptions();
  const idx = redemptions.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  redemptions[idx].status = status;
  if (status === 'completed') {
    redemptions[idx].completedAt = new Date().toISOString();
  }
  setStoredItem(STORAGE_KEYS.REWARD_REDEMPTIONS, redemptions);
  syncDocToFirestore('rewardRedemptions', id, redemptions[idx]);
  notifyDataUpdated();
  return true;
}

export function getBadgeForPoints(
  points: number,
  config?: GamificationConfig
): {
  currentBadge: BadgeConfig;
  nextBadge: BadgeConfig | null;
  progressPercent: number;
} {
  const activeConfig = config || getGamificationConfig();
  const sortedBadges = [...activeConfig.badges].sort((a, b) => a.minPoints - b.minPoints);

  let currentBadge = sortedBadges[0];
  let nextBadge: BadgeConfig | null = null;

  for (let i = 0; i < sortedBadges.length; i++) {
    if (points >= sortedBadges[i].minPoints) {
      currentBadge = sortedBadges[i];
      nextBadge = sortedBadges[i + 1] || null;
    }
  }

  let progressPercent = 100;
  if (nextBadge) {
    const range = nextBadge.minPoints - currentBadge.minPoints;
    const gained = points - currentBadge.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
  }

  return { currentBadge, nextBadge, progressPercent };
}

// --- Anti-Cheat & Fair Play Protection Engine ---
interface AntiCheatLog {
  lastTransactionTime: number;
  dailyPointsEarned: number;
  dateKey: string; // YYYY-MM-DD
  recentActions: { action: string; timestamp: number }[];
}

export function validateAndSanitizePoints(
  studentId: string,
  rawPoints: number,
  actionCategory: string = 'general',
  bypassSecurity: boolean = false
): { allowedPoints: number; reason?: string; isCapped: boolean } {
  if (bypassSecurity) {
    return { allowedPoints: Math.max(0, Math.round(rawPoints)), isCapped: false };
  }

  // 1. Sanitize raw input against invalid numbers / NaN / Infinity
  if (typeof rawPoints !== 'number' || isNaN(rawPoints) || !isFinite(rawPoints) || rawPoints <= 0) {
    return { allowedPoints: 0, reason: 'Poin tidak valid', isCapped: true };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = `ekskul_anticheat_${studentId}`;
  let log: AntiCheatLog = getStoredItem<AntiCheatLog>(storageKey, {
    lastTransactionTime: 0,
    dailyPointsEarned: 0,
    dateKey: todayStr,
    recentActions: [],
  });

  // Reset daily accumulator if calendar date changed
  if (log.dateKey !== todayStr) {
    log.dateKey = todayStr;
    log.dailyPointsEarned = 0;
    log.recentActions = [];
  }

  const now = Date.now();

  // 2. Anti-spam throttle (minimum 1.2s cooldown between point-granting actions)
  if (now - log.lastTransactionTime < 1200) {
    console.warn(`[AntiCheat Guard] Transaksi poin terlalu cepat untuk siswa ${studentId}. Diabaikan.`);
    return { allowedPoints: 0, reason: 'Terlalu cepat! Mohon selesaikan aktivitas secara wajar.', isCapped: true };
  }

  // 3. Single transaction maximum cap (no single mini-action can give > 250 points)
  let safePoints = Math.min(rawPoints, 250);

  // 4. Daily maximum cap (max 1,500 points per day per student)
  const MAX_DAILY_POINTS = 1500;
  const remainingDailyBudget = Math.max(0, MAX_DAILY_POINTS - log.dailyPointsEarned);

  if (remainingDailyBudget <= 0) {
    console.warn(`[AntiCheat Guard] Batas harian 1500 poin tercapai untuk siswa ${studentId}.`);
    return {
      allowedPoints: 0,
      reason: 'Batas maksimum poin harian (1.500 pt) telah tercapai untuk menjaga kejujuran belajar.',
      isCapped: true,
    };
  }

  safePoints = Math.min(safePoints, remainingDailyBudget);

  // Update security log
  log.lastTransactionTime = now;
  log.dailyPointsEarned += safePoints;
  log.recentActions.push({ action: actionCategory, timestamp: now });
  if (log.recentActions.length > 25) log.recentActions.shift();

  setStoredItem(storageKey, log);

  return {
    allowedPoints: Math.round(safePoints),
    reason: safePoints < rawPoints ? 'Poin disesuaikan dengan batas keamanan anti-cheat' : undefined,
    isCapped: safePoints < rawPoints,
  };
}

// --- Award Points to Student with Anti-Cheat Protection ---
export function awardStudentPoints(
  studentId: string,
  pointsToAdd: number,
  options?: {
    completedLessonId?: string;
    actionCategory?: string;
    bypassAntiCheat?: boolean;
  }
): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === studentId);
  if (idx === -1) return null;

  // Run anti-cheat verification
  const check = validateAndSanitizePoints(
    studentId,
    pointsToAdd,
    options?.actionCategory || 'general',
    options?.bypassAntiCheat || false
  );

  const effectivePointsToAdd = check.allowedPoints;
  if (effectivePointsToAdd <= 0 && pointsToAdd > 0) {
    // Still record completedLessonId if applicable
    if (options?.completedLessonId) {
      const u = users[idx];
      if (!u.completedLessons.includes(options.completedLessonId)) {
        u.completedLessons.push(options.completedLessonId);
        users[idx] = u;
        setStoredItem(STORAGE_KEYS.USERS, users);
        syncDocToFirestore('users', studentId, u);
      }
    }
    return users[idx];
  }

  const config = getGamificationConfig();
  const user = users[idx];
  const newPoints = user.totalPoints + effectivePointsToAdd;
  const newStars = Math.floor(newPoints / (config.pointsToStarRatio || 10));

  const updatedCompletedLessons = [...user.completedLessons];
  if (options?.completedLessonId && !updatedCompletedLessons.includes(options.completedLessonId)) {
    updatedCompletedLessons.push(options.completedLessonId);
  }

  const updatedUser: User = {
    ...user,
    totalPoints: newPoints,
    totalStars: newStars,
    completedLessons: updatedCompletedLessons,
  };

  users[idx] = updatedUser;
  setStoredItem(STORAGE_KEYS.USERS, users);
  syncDocToFirestore('users', studentId, updatedUser);

  // If current logged-in user is updated, update active user storage
  const activeUser = getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (activeUser && activeUser.id === studentId) {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
  }

  notifyDataUpdated();
  return updatedUser;
}

// --- Lessons Management ---
export function getLessons(): Lesson[] {
  return getStoredItem<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
}

export function saveLessons(lessons: Lesson[]): void {
  setStoredItem(STORAGE_KEYS.LESSONS, lessons);
  notifyDataUpdated();
}

export function createLesson(data: Omit<Lesson, 'id' | 'createdAt'>): Lesson {
  const lessons = getLessons();
  const newLesson: Lesson = {
    ...data,
    id: `les-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  lessons.unshift(newLesson);
  setStoredItem(STORAGE_KEYS.LESSONS, lessons);
  syncDocToFirestore('lessons', newLesson.id, newLesson);
  notifyDataUpdated();
  return newLesson;
}

export function updateLesson(id: string, updates: Partial<Lesson>): Lesson | null {
  const lessons = getLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  lessons[idx] = { ...lessons[idx], ...updates };
  setStoredItem(STORAGE_KEYS.LESSONS, lessons);
  syncDocToFirestore('lessons', id, lessons[idx]);
  notifyDataUpdated();
  return lessons[idx];
}

export function deleteLesson(id: string): boolean {
  const lessons = getLessons();
  const filtered = lessons.filter((l) => l.id !== id);
  if (filtered.length === lessons.length) return false;
  setStoredItem(STORAGE_KEYS.LESSONS, filtered);
  removeDocFromFirestore('lessons', id);
  notifyDataUpdated();
  return true;
}

// --- Quizzes Management ---
export function getQuizzes(): Quiz[] {
  return getStoredItem<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
}

export function saveQuizzes(quizzes: Quiz[]): void {
  setStoredItem(STORAGE_KEYS.QUIZZES, quizzes);
  notifyDataUpdated();
}

export function createQuiz(data: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
  const quizzes = getQuizzes();
  const newQuiz: Quiz = {
    ...data,
    id: `quiz-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  quizzes.unshift(newQuiz);
  setStoredItem(STORAGE_KEYS.QUIZZES, quizzes);
  syncDocToFirestore('quizzes', newQuiz.id, newQuiz);
  notifyDataUpdated();
  return newQuiz;
}

export function updateQuiz(id: string, updates: Partial<Quiz>): Quiz | null {
  const quizzes = getQuizzes();
  const idx = quizzes.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  quizzes[idx] = { ...quizzes[idx], ...updates };
  setStoredItem(STORAGE_KEYS.QUIZZES, quizzes);
  syncDocToFirestore('quizzes', id, quizzes[idx]);
  notifyDataUpdated();
  return quizzes[idx];
}

export function deleteQuiz(id: string): boolean {
  const quizzes = getQuizzes();
  const filtered = quizzes.filter((q) => q.id !== id);
  if (filtered.length === quizzes.length) return false;
  setStoredItem(STORAGE_KEYS.QUIZZES, filtered);
  removeDocFromFirestore('quizzes', id);
  notifyDataUpdated();
  return true;
}

// --- Typing Practices Management ---
export function getTypingPractices(): TypingPractice[] {
  return getStoredItem<TypingPractice[]>(STORAGE_KEYS.TYPING_PRACTICES, INITIAL_TYPING_PRACTICES);
}

export function saveTypingPractices(practices: TypingPractice[]): void {
  setStoredItem(STORAGE_KEYS.TYPING_PRACTICES, practices);
  notifyDataUpdated();
}

export function createTypingPractice(data: Omit<TypingPractice, 'id' | 'createdAt'>): TypingPractice {
  const practices = getTypingPractices();
  const newPractice: TypingPractice = {
    ...data,
    id: `type-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  practices.unshift(newPractice);
  setStoredItem(STORAGE_KEYS.TYPING_PRACTICES, practices);
  syncDocToFirestore('typingPractices', newPractice.id, newPractice);
  notifyDataUpdated();
  return newPractice;
}

export function updateTypingPractice(
  id: string,
  updates: Partial<TypingPractice>
): TypingPractice | null {
  const practices = getTypingPractices();
  const idx = practices.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  practices[idx] = { ...practices[idx], ...updates };
  setStoredItem(STORAGE_KEYS.TYPING_PRACTICES, practices);
  syncDocToFirestore('typingPractices', id, practices[idx]);
  notifyDataUpdated();
  return practices[idx];
}

export function deleteTypingPractice(id: string): boolean {
  const practices = getTypingPractices();
  const filtered = practices.filter((p) => p.id !== id);
  if (filtered.length === practices.length) return false;
  setStoredItem(STORAGE_KEYS.TYPING_PRACTICES, filtered);
  removeDocFromFirestore('typingPractices', id);
  notifyDataUpdated();
  return true;
}

// --- Submissions Log ---
export function getTypingSubmissions(): TypingSubmission[] {
  return getStoredItem<TypingSubmission[]>(STORAGE_KEYS.TYPING_SUBMISSIONS, []);
}

export function recordTypingSubmission(
  submission: Omit<TypingSubmission, 'id' | 'submittedAt'>
): TypingSubmission {
  const submissions = getTypingSubmissions();
  const newSubmission: TypingSubmission = {
    ...submission,
    id: `sub-type-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  submissions.unshift(newSubmission);
  setStoredItem(STORAGE_KEYS.TYPING_SUBMISSIONS, submissions);
  syncDocToFirestore('typingSubmissions', newSubmission.id, newSubmission);
  notifyDataUpdated();
  return newSubmission;
}

export function getQuizSubmissions(): QuizSubmission[] {
  return getStoredItem<QuizSubmission[]>(STORAGE_KEYS.QUIZ_SUBMISSIONS, []);
}

export function recordQuizSubmission(
  submission: Omit<QuizSubmission, 'id' | 'submittedAt'>
): QuizSubmission {
  const submissions = getQuizSubmissions();
  const newSubmission: QuizSubmission = {
    ...submission,
    id: `sub-quiz-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  submissions.unshift(newSubmission);
  setStoredItem(STORAGE_KEYS.QUIZ_SUBMISSIONS, submissions);
  syncDocToFirestore('quizSubmissions', newSubmission.id, newSubmission);
  notifyDataUpdated();
  return newSubmission;
}

// --- Visitor Counter Widget Helper ---
export function trackVisitor(): VisitorStats {
  const todayStr = new Date().toISOString().split('T')[0];
  const stored = getStoredItem<VisitorStats>(STORAGE_KEYS.VISITOR_STATS, {
    todayCount: 1,
    totalCount: 1,
    lastDate: todayStr,
  });

  const sessionKey = `ekskul_visited_${todayStr}`;
  const alreadyVisitedThisSession = sessionStorage.getItem(sessionKey);

  if (!alreadyVisitedThisSession) {
    sessionStorage.setItem(sessionKey, 'true');
    if (stored.lastDate !== todayStr) {
      stored.todayCount = 1;
      stored.lastDate = todayStr;
    } else {
      stored.todayCount += 1;
    }
    stored.totalCount += 1;
    setStoredItem(STORAGE_KEYS.VISITOR_STATS, stored);
    syncDocToFirestore('config', 'visitorStats', stored);
  }

  return stored;
}

// --- Active User Auth Helper ---
export function getActiveUser(): User | null {
  return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setActiveUser(user: User | null): void {
  setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function logoutActiveUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// --- Login Activity Tracking & Logs ---
export function detectDeviceType(): string {
  if (typeof navigator === 'undefined') return 'PC Lab / Desktop';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Smartphone';
  }
  return 'PC Lab / Desktop';
}

export function recordLoginLog(user: User): LoginLog {
  const logs = getStoredItem<LoginLog[]>(STORAGE_KEYS.LOGIN_LOGS, []);
  const now = new Date().toISOString();
  const newLog: LoginLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    name: user.name,
    nisn: user.nisn || user.username,
    role: user.role,
    grade: user.grade,
    school: user.school,
    timestamp: now,
    device: detectDeviceType(),
  };

  const updatedLogs = [newLog, ...logs].slice(0, 300);
  setStoredItem(STORAGE_KEYS.LOGIN_LOGS, updatedLogs);
  syncDocToFirestore('loginLogs', newLog.id, newLog);

  // Update user in users list
  const users = getUsers();
  const uIdx = users.findIndex((u) => u.id === user.id);
  if (uIdx !== -1) {
    users[uIdx].lastLoginAt = now;
    users[uIdx].loginCount = (users[uIdx].loginCount || 0) + 1;
    saveUsers(users);
  }

  notifyDataUpdated();
  return newLog;
}

export function getLoginLogs(): LoginLog[] {
  const logs = getStoredItem<LoginLog[]>(STORAGE_KEYS.LOGIN_LOGS, []);
  if (logs.length === 0) {
    const students = getUsers().filter((u) => u.role === 'student');
    if (students.length > 0) {
      const seedLogs: LoginLog[] = [];
      students.forEach((s, idx) => {
        const hoursAgo = [1, 3, 7, 24, 48, 72, 120][idx % 7];
        const logTime = new Date(Date.now() - hoursAgo * 3600000).toISOString();
        seedLogs.push({
          id: `log-seed-${idx}`,
          userId: s.id,
          name: s.name,
          nisn: s.nisn || s.username,
          role: s.role,
          grade: s.grade,
          school: s.school,
          timestamp: logTime,
          device: idx % 3 === 0 ? 'Smartphone' : 'PC Lab / Desktop',
        });
      });
      seedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setStoredItem(STORAGE_KEYS.LOGIN_LOGS, seedLogs);
      return seedLogs;
    }
  }
  return logs;
}

// --- Student Grade Recap Generator ---
export function getStudentGradeSummaries(schoolFilter: string = 'ALL'): StudentGradeSummary[] {
  const users = getUsers().filter((u) => u.role === 'student');
  const quizSubmissions = getQuizSubmissions();
  const typingSubmissions = getTypingSubmissions();

  const filteredUsers =
    schoolFilter === 'ALL'
      ? users
      : users.filter((u) => u.school && u.school.trim() === schoolFilter.trim());

  return filteredUsers.map((student) => {
    const studentQuizSubs = quizSubmissions.filter((qs) => qs.studentId === student.id);
    const avgQuizScore =
      studentQuizSubs.length > 0
        ? Math.round(
            studentQuizSubs.reduce((acc, curr) => acc + curr.score, 0) / studentQuizSubs.length
          )
        : 0;

    const studentTypingSubs = typingSubmissions.filter((ts) => ts.studentId === student.id);
    const avgTypingAccuracy =
      studentTypingSubs.length > 0
        ? Math.round(
            studentTypingSubs.reduce((acc, curr) => acc + curr.accuracy, 0) /
              studentTypingSubs.length
          )
        : 0;

    const avgTypingWpm =
      studentTypingSubs.length > 0
        ? Math.round(
            studentTypingSubs.reduce((acc, curr) => acc + curr.wpm, 0) /
              studentTypingSubs.length
          )
        : 0;

    const { currentBadge } = getBadgeForPoints(student.totalPoints);

    return {
      studentId: student.id,
      name: student.name,
      nisn: student.nisn || student.username,
      grade: student.grade || '-',
      school: student.school || 'Sekolah Terdaftar',
      completedLessonsCount: student.completedLessons ? student.completedLessons.length : 0,
      quizzesTakenCount: studentQuizSubs.length,
      avgQuizScore,
      typingPracticesCount: studentTypingSubs.length,
      avgTypingAccuracy,
      avgTypingWpm,
      totalPoints: student.totalPoints,
      totalStars: student.totalStars,
      badgeTier: currentBadge.tier,
    };
  });
}

export function exportGradesToCSV(summaries: StudentGradeSummary[]): string {
  const headers = [
    'No',
    'Nama Siswa',
    'NISN / Username',
    'Kelas',
    'Asal Sekolah',
    'Materi Selesai',
    'Kuis Diikuti',
    'Rata-Rata Kuis',
    'Latihan Mengetik',
    'Rata-Rata Akurasi Mengetik (%)',
    'Rata-Rata Kecepatan (WPM)',
    'Total Poin',
    'Total Bintang',
    'Predikat / Badge',
  ];

  const rows = summaries.map((s, idx) => [
    idx + 1,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.nisn}"`,
    `"${s.grade}"`,
    `"${s.school}"`,
    s.completedLessonsCount,
    s.quizzesTakenCount,
    s.avgQuizScore,
    s.typingPracticesCount,
    `${s.avgTypingAccuracy}%`,
    `${s.avgTypingWpm}`,
    s.totalPoints,
    s.totalStars,
    `"${s.badgeTier}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// --- Student Gallery Works Seed & Management ---
export const INITIAL_GALLERY_WORKS: StudentGalleryWork[] = [
  {
    id: 'gal-seed-1',
    studentId: 'std-seed-1',
    studentName: 'Aisyah Putri',
    studentGrade: 'Kelas 5A',
    studentSchool: 'SDN Ceria 01',
    title: 'Pemandangan Gunung & Sawah Alam Indonesia',
    category: 'Menggambar Bebas',
    type: 'paint',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%"><rect width="600" height="400" fill="%2387ceeb"/><circle cx="300" cy="120" r="45" fill="%23f59e0b"/><polygon points="0,260 160,110 320,260" fill="%2322c55e"/><polygon points="200,260 380,90 560,260" fill="%2316a34a"/><rect y="240" width="600" height="160" fill="%2384cc16"/><polygon points="260,240 340,240 400,400 200,400" fill="%23eab308"/><circle cx="80" cy="80" r="25" fill="%23ffffff" opacity="0.8"/><circle cx="110" cy="80" r="30" fill="%23ffffff" opacity="0.8"/><circle cx="480" cy="70" r="25" fill="%23ffffff" opacity="0.8"/><circle cx="510" cy="70" r="30" fill="%23ffffff" opacity="0.8"/><text x="20" y="380" font-family="sans-serif" font-size="14" fill="%2314532d" font-weight="bold">Karya Paint: Alam Indonesia - Aisyah Putri</text></svg>',
    previewText: 'Karya lukisan pemandangan alam pegunungan dibuat dengan tool kuas, garis kurva, dan ember cat MS Paint.',
    starLikes: 18,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'gal-seed-2',
    studentId: 'std-seed-2',
    studentName: 'Nabila Syahrani',
    studentGrade: 'Kelas 5B',
    studentSchool: 'SDN Nusantara',
    title: 'Laporan Praktikum: Mengenal Komponen Komputer & Fungsinya',
    category: 'Naskah & Tabel Word',
    type: 'word',
    previewText: 'Artikel ringkas pengenalan CPU, RAM, Harddisk, dan Monitor lengkap dengan tabel fungsi dan spesifikasi dasar.',
    contentHtml: `<div class="space-y-4 font-sans text-slate-800 dark:text-slate-200">
      <h2 style="font-size: 1.25rem; font-weight: bold; color: #4338ca; border-bottom: 2px solid #6366f1; padding-bottom: 4px; margin-bottom: 12px;">LAPORAN PRAKTIKUM: MENGENAL PERANGKAT KERAS KOMPUTER</h2>
      <p style="font-size: 0.85rem; line-height: 1.6;">Disusun oleh: <strong>Nabila Syahrani</strong> | Kelas: <strong>5B</strong></p>
      <p style="font-size: 0.85rem; line-height: 1.6;">Komputer terdiri dari perangkat keras (hardware) yang saling bekerja sama untuk mengolah data menjadi informasi yang bermanfaat bagi kita.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.8rem; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #e0e7ff; color: #1e1b4b; text-align: left;">
            <th style="border: 1px solid #cbd5e1; padding: 8px;">No</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Nama Perangkat</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Kategori</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Fungsi Utama</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Processor (CPU)</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Pemrosesan</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Otak utama komputer yang memproses semua instruksi dan logika.</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">RAM Memory</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Penyimpanan Sementara</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Menyimpan data aplikasi yang sedang berjalan agar cepat diakses.</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">3</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Solid State Drive (SSD)</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Penyimpanan Tetap</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Menyimpan sistem operasi Windows dan berkas siswa secara permanen.</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">4</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Monitor & Keyboard</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Input / Output</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Memasukkan naskah teks dan menampilkan tampilan grafis kepada pengguna.</td>
          </tr>
        </tbody>
      </table>
      <h3 style="font-size: 1rem; font-weight: bold; color: #1e293b; margin-top: 14px;">Kesimpulan Belajar:</h3>
      <p style="font-size: 0.85rem; line-height: 1.6;">Dengan memahami fungsi masing-masing komponen, kita dapat merawat komputer lab sekolah dengan bijak dan menggunakan teknologi secara maksimal untuk belajar.</p>
    </div>`,
    starLikes: 29,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'gal-seed-3',
    studentId: 'std-seed-3',
    studentName: 'Bima Pratama',
    studentGrade: 'Kelas 6B',
    studentSchool: 'SD Bintang Pelajar',
    title: 'Robot Pintar Sahabat Komputer Sekolah',
    category: 'Kreativitas Robotik',
    type: 'paint',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%"><rect width="600" height="400" fill="%23e0e7ff"/><rect x="230" y="60" width="140" height="100" rx="20" fill="%233b82f6"/><circle cx="270" cy="100" r="14" fill="%23facc15"/><circle cx="330" cy="100" r="14" fill="%23facc15"/><rect x="270" y="130" width="60" height="10" rx="5" fill="%23ffffff"/><line x1="300" y1="60" x2="300" y2="25" stroke="%233b82f6" stroke-width="8"/><circle cx="300" cy="20" r="12" fill="%23ef4444"/><rect x="210" y="180" width="180" height="150" rx="25" fill="%234f46e5"/><rect x="240" y="210" width="120" height="80" rx="10" fill="%2310b981"/><text x="260" y="255" font-family="monospace" font-size="18" fill="%23ffffff" font-weight="bold">AI-BOT</text><rect x="150" y="195" width="40" height="110" rx="15" fill="%233b82f6"/><rect x="410" y="195" width="40" height="110" rx="15" fill="%233b82f6"/><rect x="240" y="340" width="40" height="45" rx="8" fill="%231e293b"/><rect x="320" y="340" width="40" height="45" rx="8" fill="%231e293b"/><text x="20" y="380" font-family="sans-serif" font-size="14" fill="%23312e81" font-weight="bold">Karya Paint: Robot Sahabat Pintar - Bima Pratama</text></svg>',
    previewText: 'Desain karakter robot komputer sahabat anak-anak yang dibuat dengan lingkaran, persegi, dan tool kuas warna di Paint.',
    starLikes: 25,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'gal-seed-4',
    studentId: 'std-seed-4',
    studentName: 'Dimas Aditya',
    studentGrade: 'Kelas 6A',
    studentSchool: 'SMP Terpadu',
    title: 'Panduan Etika & Tips Mengetik 10 Jari Cepat di MS Word',
    category: 'Tips & Format Word',
    type: 'word',
    previewText: 'Naskah panduan posisi jari tangan pada tuts ASDF dan JKL; untuk mengetik cepat tanpa melihat keyboard.',
    contentHtml: `<div class="space-y-4 font-sans text-slate-800 dark:text-slate-200">
      <h2 style="font-size: 1.25rem; font-weight: bold; color: #0284c7; border-bottom: 2px solid #38bdf8; padding-bottom: 4px; margin-bottom: 12px;">PANDUAN MENGETIK 10 JARI RAPI & CEPAT DI MS WORD</h2>
      <p style="font-size: 0.85rem; line-height: 1.6;">Oleh: <strong>Dimas Aditya</strong> | Kelas: <strong>6A</strong></p>
      <p style="font-size: 0.85rem; line-height: 1.6;">Mengetik dengan sepuluh jari dapat menghemat waktu tugas sekolah dan melatih koordinasi motorik mata dan tangan.</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px 14px; margin: 10px 0; font-size: 0.85rem;">
        <strong>Posisi Rumah Jari (Home Row):</strong><br/>
        • Tangan Kiri: Jari Kelingking (A), Jari Manis (S), Jari Tengah (D), Jari Telunjuk (F)<br/>
        • Tangan Kanan: Jari Telunjuk (J), Jari Tengah (K), Jari Manis (L), Jari Kelingking (;)<br/>
        • Ibu Jari: Bertugas menekan tombol Spasi (Spacebar)
      </div>
      <p style="font-size: 0.85rem; line-height: 1.6;">Kombinasi tombol shortcut yang sering digunakan saat menulis naskah tugas:</p>
      <ul style="font-size: 0.85rem; line-height: 1.6; list-style-type: disc; padding-left: 20px;">
        <li><strong>Ctrl + B:</strong> Membuat tulisan tebal (Bold)</li>
        <li><strong>Ctrl + I:</strong> Membuat tulisan miring (Italic)</li>
        <li><strong>Ctrl + U:</strong> Menggarisbawahi tulisan (Underline)</li>
        <li><strong>Ctrl + S:</strong> Menyimpan dokumen secara berkala</li>
      </ul>
    </div>`,
    starLikes: 21,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'gal-seed-5',
    studentId: 'std-seed-5',
    studentName: 'Rizky Ramadhan',
    studentGrade: 'Kelas 4C',
    studentSchool: 'SD Harapan Bangsa',
    title: 'Poster Eksplorasi Luar Angkasa & Roket Antariksa',
    category: 'Sains & Seni',
    type: 'paint',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%"><rect width="600" height="400" fill="%230f172a"/><circle cx="100" cy="90" r="35" fill="%23e2e8f0"/><circle cx="85" cy="80" r="6" fill="%2394a3b8"/><circle cx="115" cy="95" r="9" fill="%2394a3b8"/><circle cx="500" cy="180" r="50" fill="%23ea580c"/><circle cx="500" cy="180" r="70" stroke="%23f97316" stroke-width="5" fill="none" opacity="0.6"/><polygon points="260,180 340,180 300,90" fill="%23ef4444"/><rect x="270" y="180" width="60" height="110" fill="%23ffffff"/><circle cx="300" cy="225" r="16" fill="%2338bdf8"/><polygon points="270,250 230,290 270,290" fill="%23dc2626"/><polygon points="330,250 370,290 330,290" fill="%23dc2626"/><polygon points="280,290 320,290 300,340" fill="%23f59e0b"/><polygon points="288,290 312,290 300,325" fill="%23ef4444"/><circle cx="200" cy="70" r="3" fill="%23ffffff"/><circle cx="420" cy="50" r="2" fill="%23ffffff"/><circle cx="150" cy="260" r="3" fill="%23ffffff"/><circle cx="480" cy="320" r="2.5" fill="%23ffffff"/><text x="20" y="380" font-family="sans-serif" font-size="14" fill="%2394a3b8" font-weight="bold">Karya Paint: Roket Angkasa - Rizky Ramadhan</text></svg>',
    previewText: 'Petualangan roket menuju antariksa berhias bintang dan planet warna-warni menggunakan tool spray MS Paint.',
    starLikes: 14,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: 'gal-seed-6',
    studentId: 'std-seed-6',
    studentName: 'Siti Rahma',
    studentGrade: 'Kelas 5A',
    studentSchool: 'SD Unggulan Cendekia',
    title: 'Tata Tertib & Panduan Penggunaan Laboratorium Komputer',
    category: 'Format Dokumen & Tata Tertib',
    type: 'word',
    previewText: 'Dokumen format tata tertib penggunaan komputer sekolah yang bersih, teratur, dan aman bagi seluruh siswa.',
    contentHtml: `<div class="space-y-4 font-sans text-slate-800 dark:text-slate-200">
      <h2 style="font-size: 1.25rem; font-weight: bold; color: #e11d48; border-bottom: 2px solid #fb7185; padding-bottom: 4px; margin-bottom: 12px;">TATA TERTIB LABORATORIUM KOMPUTER SEKOLAH</h2>
      <p style="font-size: 0.85rem; line-height: 1.6;">Disusun oleh Perwakilan Siswa: <strong>Siti Rahma</strong> (Kelas 5A)</p>
      <p style="font-size: 0.85rem; line-height: 1.6;">Demi kelancaran dan kenyamanan bersama saat belajar komputer, seluruh siswa wajib mematuhi aturan berikut:</p>
      <ol style="font-size: 0.85rem; line-height: 1.7; padding-left: 20px; list-style-type: decimal;">
        <li>Membuka sepatu sebelum masuk dan menyusunnya dengan rapi di rak.</li>
        <li>Dilarang membawa makanan dan minuman ke dekat meja komputer atau keyboard.</li>
        <li>Menyalakan dan mematikan (Shutdown) komputer sesuai prosedur yang diajarkan guru.</li>
        <li>Merapikan kembali kursi dan mousepad setelah sesi praktikum selesai.</li>
      </ol>
      <p style="font-size: 0.85rem; font-style: italic; color: #64748b; margin-top: 10px;">"Jagalah perangkat komputer sekolah seperti barang milik sendiri agar selalu awet dan siap pakai."</p>
    </div>`,
    starLikes: 33,
    likedByStudentIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
];

export function getGalleryWorks(): StudentGalleryWork[] {
  const raw = localStorage.getItem(STORAGE_KEYS.GALLERY_WORKS);
  if (raw === null) {
    setStoredItem(STORAGE_KEYS.GALLERY_WORKS, INITIAL_GALLERY_WORKS);
    return INITIAL_GALLERY_WORKS;
  }
  try {
    return JSON.parse(raw) as StudentGalleryWork[];
  } catch (e) {
    return [];
  }
}

export function saveGalleryWork(
  work: Omit<StudentGalleryWork, 'id' | 'createdAt' | 'starLikes' | 'likedByStudentIds'> & {
    starLikes?: number;
    likedByStudentIds?: string[];
  }
): StudentGalleryWork {
  const works = getGalleryWorks();
  const newWork: StudentGalleryWork = {
    ...work,
    id: `gal-${Date.now()}`,
    createdAt: new Date().toISOString(),
    starLikes: work.starLikes || 0,
    likedByStudentIds: work.likedByStudentIds || [],
  };
  works.unshift(newWork);
  setStoredItem(STORAGE_KEYS.GALLERY_WORKS, works);
  syncDocToFirestore('galleryWorks', newWork.id, newWork);
  notifyDataUpdated();
  return newWork;
}

export const createGalleryWork = saveGalleryWork;

export function deleteGalleryWork(id: string): boolean {
  const works = getGalleryWorks();
  const filtered = works.filter((w) => String(w.id) !== String(id));
  setStoredItem(STORAGE_KEYS.GALLERY_WORKS, filtered);
  removeDocFromFirestore('galleryWorks', id);
  notifyDataUpdated();
  return true;
}

export function toggleLikeGalleryWork(id: string, studentId: string): StudentGalleryWork | null {
  const works = getGalleryWorks();
  const idx = works.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  const work = works[idx];
  const likedBy = work.likedByStudentIds || [];
  const alreadyLiked = likedBy.includes(studentId);
  const newLikedBy = alreadyLiked
    ? likedBy.filter((i) => i !== studentId)
    : [...likedBy, studentId];
  const updatedWork: StudentGalleryWork = {
    ...work,
    starLikes: newLikedBy.length,
    likedByStudentIds: newLikedBy,
  };
  works[idx] = updatedWork;
  setStoredItem(STORAGE_KEYS.GALLERY_WORKS, works);
  syncDocToFirestore('galleryWorks', id, updatedWork);
  notifyDataUpdated();
  return updatedWork;
}

// --- Shop Items Helpers ---
const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'item-avatar-robot',
    name: 'Avatar Robot Komputer',
    description: 'Buka avatar khusus Robot Komputer Ceria',
    costStars: 5,
    category: 'avatar',
    icon: '🤖',
  },
  {
    id: 'item-badge-pro',
    name: 'Lencana Word Master',
    description: 'Tampilkan lencana eksklusif Word Master di profil',
    costStars: 10,
    category: 'badge',
    icon: '🎖️',
  },
  {
    id: 'frame-gold',
    name: 'Bingkai Emas Royal',
    description: 'Tampilkan bingkai lingkaran emas berkilau di sekeliling foto profilmu!',
    costStars: 15,
    category: 'frame',
    icon: '👑',
  },
  {
    id: 'frame-neon',
    name: 'Bingkai Neon Siber',
    description: 'Bingkai siber futuristik dengan efek pendaran neon biru cyan!',
    costStars: 20,
    category: 'frame',
    icon: '💡',
  },
  {
    id: 'frame-fire',
    name: 'Bingkai Api Membara',
    description: 'Bingkai animasi energi api merah membara yang sangat keren!',
    costStars: 30,
    category: 'frame',
    icon: '🔥',
  },
  {
    id: 'frame-cyber',
    name: 'Bingkai Matrix Hijau',
    description: 'Bingkai bergaya hacker digital dengan warna hijau Matrix!',
    costStars: 25,
    category: 'frame',
    icon: '👾',
  },
  {
    id: 'frame-rainbow',
    name: 'Bingkai Pelangi Chroma',
    description: 'Bingkai RGB berputar pelangi super langka untuk siswa paling top!',
    costStars: 40,
    category: 'frame',
    icon: '🌈',
  },
  {
    id: 'frame-diamond',
    name: 'Bingkai Berlian Es Abadi',
    description: 'Bingkai mewah berkilau warna biru es permata untuk siswa berprestasi tinggi!',
    costStars: 30,
    category: 'frame',
    icon: '💎',
  },
  {
    id: 'frame-galaxy',
    name: 'Bingkai Galaksi Bintang',
    description: 'Pendaran ungu kosmik luar angkasa yang memukau di foto profilmu!',
    costStars: 35,
    category: 'frame',
    icon: '🌌',
  },
  {
    id: 'item-avatar-astronaut',
    name: 'Avatar Astronot Digital',
    description: 'Buka avatar khusus penjelajah antariksa komputer ceria',
    costStars: 10,
    category: 'avatar',
    icon: '🚀',
  },
  {
    id: 'item-avatar-cat',
    name: 'Avatar Kucing Hacker',
    description: 'Buka avatar kucing hacker bertudung yang lucu dan cerdas',
    costStars: 12,
    category: 'avatar',
    icon: '🐱',
  },
  {
    id: 'item-avatar-ninja',
    name: 'Avatar Ninja Keyboard',
    description: 'Buka avatar ninja ketik secepat kilat',
    costStars: 15,
    category: 'avatar',
    icon: '🥷',
  },
  {
    id: 'item-badge-shield',
    name: 'Lencana Pelindung Siber',
    description: 'Lencana khusus tanda tameng anti-phishing dan keamanan internet',
    costStars: 12,
    category: 'badge',
    icon: '🛡️',
  },
  {
    id: 'item-badge-binary',
    name: 'Lencana Ahli Biner 0-1',
    description: 'Lencana pemecah kode rahasia bahasa mesin komputer',
    costStars: 14,
    category: 'badge',
    icon: '💡',
  },
  {
    id: 'item-badge-diamond',
    name: 'Lencana Bintang Kehormatan',
    description: 'Lencana kehormatan tertinggi atas loyalitas dan ketekunan belajar',
    costStars: 25,
    category: 'badge',
    icon: '💎',
  },
  {
    id: 'title-captain',
    name: 'Kapten Komputer',
    description: 'Beli gelar khusus "Kapten Komputer" untuk profilmu!',
    costStars: 8,
    category: 'title',
    icon: '🎖️',
    titleBadge: 'Kapten Komputer',
  },
  {
    id: 'title-master',
    name: 'Master Keyboard',
    description: 'Tunjukkan keahlian mengetik kilat dengan gelar "Master Keyboard"!',
    costStars: 12,
    category: 'title',
    icon: '⌨️',
    titleBadge: 'Master Keyboard',
  },
  {
    id: 'title-police',
    name: 'Polisi Siber Cilik',
    description: 'Gelar pahlawan bagi pelindung keamanan digital di lab komputer!',
    costStars: 15,
    category: 'title',
    icon: '👮',
    titleBadge: 'Polisi Siber Cilik',
  },
  {
    id: 'title-pro',
    name: 'Pro Coder',
    description: 'Gelar prestisius untuk siswa yang berhasil menaklukkan petualangan koding!',
    costStars: 20,
    category: 'title',
    icon: '💻',
    titleBadge: 'Pro Coder',
  },
  {
    id: 'title-genius',
    name: 'Digital Genius',
    description: 'Gelar super cerdas untuk penemu dan pemecah masalah digital!',
    costStars: 25,
    category: 'title',
    icon: '🧠',
    titleBadge: 'Digital Genius',
  },
  {
    id: 'title-god',
    name: 'Dewa Ketik',
    description: 'Gelar tertinggi tiada tanding untuk kecepatan mengetik tak terbatas!',
    costStars: 35,
    category: 'title',
    icon: '⚡',
    titleBadge: 'Dewa Ketik',
  },
];

export function getShopItems(): ShopItem[] {
  const items = getStoredItem<ShopItem[]>('ekskul_shop_items', DEFAULT_SHOP_ITEMS);
  if (items.length < DEFAULT_SHOP_ITEMS.length) {
    setStoredItem('ekskul_shop_items', DEFAULT_SHOP_ITEMS);
    return DEFAULT_SHOP_ITEMS;
  }
  return items;
}

export function saveShopItems(items: ShopItem[]): void {
  setStoredItem('ekskul_shop_items', items);
  items.forEach((item) => syncDocToFirestore('shopItems', item.id, item));
  notifyDataUpdated();
}

export function buyShopItem(studentId: string, item: ShopItem) {
  const user = getUserById(studentId);
  if (!user || user.totalStars < item.costStars) {
    return { success: false, message: 'Bintang tidak mencukupi untuk membeli item ini.' };
  }

  const updatedStars = user.totalStars - item.costStars;
  const unlocked = user.unlockedShopItemIds || [];
  if (!unlocked.includes(item.id)) {
    unlocked.push(item.id);
  }

  updateUser(studentId, { totalStars: updatedStars, unlockedShopItemIds: unlocked });
  return { success: true, message: `Berhasil membeli "${item.name}"!` };
}

export function equipShopItem(studentId: string, item: ShopItem) {
  const user = getUserById(studentId);
  if (!user) return false;
  if (item.category === 'frame') {
    updateUser(studentId, { equippedFrame: item.id.replace('frame-', '') });
  } else if (item.category === 'title') {
    updateUser(studentId, { equippedTitle: item.titleBadge || item.name });
  } else if (item.category === 'badge') {
    updateUser(studentId, { equippedBadge: item.name });
  } else if (item.category === 'avatar') {
    updateUser(studentId, { equippedAvatar: item.icon });
  }
  return true;
}

export function unequipShopItem(studentId: string, target: 'frame' | 'title' | 'badge' | 'avatar' | ShopItem) {
  const user = getUserById(studentId);
  if (!user) return false;
  const category = typeof target === 'string' ? target : target.category;
  if (category === 'frame') {
    updateUser(studentId, { equippedFrame: undefined });
  } else if (category === 'title') {
    updateUser(studentId, { equippedTitle: undefined });
  } else if (category === 'badge') {
    updateUser(studentId, { equippedBadge: undefined });
  } else if (category === 'avatar') {
    updateUser(studentId, { equippedAvatar: undefined });
  }
  return true;
}

// --- Master Achievements List ---
export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'Langkah Pertama',
    category: 'lesson',
    description: 'Selesaikan 1 materi pembelajaran komputer',
    iconName: 'BookOpen',
    badgeColor: 'indigo',
    requiredCondition: '1 Materi Pembelajaran',
    rewardPoints: 20,
  },
  {
    id: 'five_lessons',
    title: 'Siswa Rajin',
    category: 'lesson',
    description: 'Selesaikan 5 materi pembelajaran komputer',
    iconName: 'Sparkles',
    badgeColor: 'purple',
    requiredCondition: '5 Materi Pembelajaran',
    rewardPoints: 50,
  },
  {
    id: 'century_points',
    title: 'Kolektor Bintang',
    category: 'general',
    description: 'Raih akumulasi 100 poin bintang',
    iconName: 'Star',
    badgeColor: 'amber',
    requiredCondition: '100 Poin',
    rewardPoints: 30,
  },
  {
    id: 'master_points',
    title: 'Master Komputer',
    category: 'general',
    description: 'Raih akumulasi 500 poin bintang',
    iconName: 'Trophy',
    badgeColor: 'emerald',
    requiredCondition: '500 Poin',
    rewardPoints: 100,
  },
  {
    id: 'ten_stars',
    title: 'Bintang Utama',
    category: 'general',
    description: 'Raih 10 bintang emas',
    iconName: 'Award',
    badgeColor: 'rose',
    requiredCondition: '10 Bintang',
    rewardPoints: 50,
  },
  {
    id: 'typing_master',
    title: 'Typing Master',
    category: 'typing',
    description: 'Kecepatan mengetik ≥ 30 WPM dengan akurasi ≥ 95%',
    iconName: 'Keyboard',
    badgeColor: 'blue',
    requiredCondition: '30 WPM & 95% Akurasi',
    rewardPoints: 80,
  },
  {
    id: 'quiz_champion',
    title: 'Quiz Champion',
    category: 'quiz',
    description: 'Selesaikan kuis dengan nilai sempurna (100%)',
    iconName: 'Trophy',
    badgeColor: 'yellow',
    requiredCondition: 'Nilai Kuis 100%',
    rewardPoints: 80,
  },
  {
    id: 'perfect_accuracy',
    title: 'Akurasi Kilat',
    category: 'typing',
    description: 'Latihan mengetik selesai dengan akurasi sempurna 100%',
    iconName: 'Target',
    badgeColor: 'emerald',
    requiredCondition: '100% Akurasi',
    rewardPoints: 100,
  },
  {
    id: 'game_conqueror',
    title: 'Penakluk Game',
    category: 'game',
    description: 'Dapatkan skor ≥ 100 dalam game edukasi mana pun',
    iconName: 'Zap',
    badgeColor: 'orange',
    requiredCondition: 'Skor Game ≥ 100',
    rewardPoints: 60,
  },
];

export function getStudentUnlockedAchievements(
  studentOrId: string | User
): { achievement: Achievement; isUnlocked: boolean; progressText: string }[] {
  const studentId = typeof studentOrId === 'string' ? studentOrId : studentOrId.id;
  const user = getUserById(studentId);
  if (!user) return ALL_ACHIEVEMENTS.map((a) => ({ achievement: a, isUnlocked: false, progressText: '0 / 1' }));

  return ALL_ACHIEVEMENTS.map((ach) => {
    let isUnlocked = false;
    let progressText = '0 / 1';

    if (ach.id === 'first_lesson') {
      const count = user.completedLessons ? user.completedLessons.length : 0;
      isUnlocked = count >= 1;
      progressText = `${Math.min(1, count)} / 1 Materi`;
    } else if (ach.id === 'five_lessons') {
      const count = user.completedLessons ? user.completedLessons.length : 0;
      isUnlocked = count >= 5;
      progressText = `${Math.min(5, count)} / 5 Materi`;
    } else if (ach.id === 'century_points') {
      isUnlocked = user.totalPoints >= 100;
      progressText = `${Math.min(100, user.totalPoints)} / 100 Poin`;
    } else if (ach.id === 'master_points') {
      isUnlocked = user.totalPoints >= 500;
      progressText = `${Math.min(500, user.totalPoints)} / 500 Poin`;
    } else if (ach.id === 'ten_stars') {
      isUnlocked = user.totalStars >= 10;
      progressText = `${Math.min(10, user.totalStars)} / 10 Bintang`;
    } else if (ach.id === 'typing_master') {
      const subs = getTypingSubmissions().filter((s) => s.studentId === studentId);
      const bestType = subs.find((s) => s.wpm >= 30 && s.accuracy >= 95);
      isUnlocked = !!bestType;
      progressText = isUnlocked ? 'Terbuka' : 'Belum mencapai 30 WPM & 95% akurasi';
    } else if (ach.id === 'quiz_champion') {
      const qSubs = getQuizSubmissions().filter((s) => s.studentId === studentId);
      const perfectQuiz = qSubs.find((s) => s.score === 100);
      isUnlocked = !!perfectQuiz;
      progressText = isUnlocked ? 'Terbuka' : 'Belum ada nilai kuis 100%';
    } else if (ach.id === 'perfect_accuracy') {
      const subs2 = getTypingSubmissions().filter((s) => s.studentId === studentId);
      const perfectType = subs2.find((s) => s.accuracy === 100);
      isUnlocked = !!perfectType;
      progressText = isUnlocked ? 'Terbuka' : 'Akurasi terbaik: ' + (subs2.length > 0 ? Math.max(...subs2.map(s => s.accuracy)) + '%' : '0%');
    } else if (ach.id === 'game_conqueror') {
      const scores = getGameScores().filter((s) => s.studentId === studentId);
      const topScore = scores.find((s) => s.score >= 100);
      isUnlocked = !!topScore;
      progressText = isUnlocked ? 'Terbuka' : 'Skor game terbaik: ' + (scores.length > 0 ? Math.max(...scores.map(s => s.score)) : '0');
    }

    return { achievement: ach, isUnlocked, progressText };
  });
}

// --- Games & Shortcuts Helper ---
export function recordGameScore(
  gameNameOrStudentId: string,
  studentIdOrScore: any,
  scoreArg?: number,
  pointsEarnedArg?: number
) {
  let gameName = 'Game Komputer';
  let studentId = '';
  let score = 0;
  let pointsEarned = 0;

  if (typeof studentIdOrScore === 'number') {
    studentId = gameNameOrStudentId;
    score = studentIdOrScore;
    pointsEarned = scoreArg || Math.round(score / 5);
  } else {
    gameName = gameNameOrStudentId;
    studentId = studentIdOrScore;
    score = scoreArg || 0;
    pointsEarned = pointsEarnedArg || Math.round(score / 5);
  }

  // Apply pointsMultiplier from GamesConfig if exists
  const featureMap: Record<string, string> = {
    'Manajemen Berkas': 'file-explorer',
    'Simulasi Jaringan': 'network-builder',
    'Petualangan Mengetik RPG': 'typing-hero',
    'Kuis Duel Cerdas': 'quiz-duel',
    'Game Kata Jatuh': 'games',
    'Master Colokan & Port Komputer': 'port-master',
    'Detektif Kode Biner (0 dan 1)': 'binary-code',
    'Detektif Anti-Phishing Siber': 'anti-phishing',
    'Grid Robot Navigator': 'grid-robot',
    'port-master': 'port-master',
    'binary-code': 'binary-code',
    'anti-phishing': 'anti-phishing',
    'grid-robot': 'grid-robot',
  };
  const featureId = featureMap[gameName];
  if (featureId) {
    try {
      const gConfig = getGamesConfig();
      const feat = gConfig.features.find((f) => f.id === featureId);
      if (feat) {
        if (typeof feat.basePoints === 'number' && feat.basePoints > 0) {
          pointsEarned = feat.basePoints;
        }
        if (feat.pointsMultiplier && feat.pointsMultiplier > 1) {
          pointsEarned = Math.round(pointsEarned * feat.pointsMultiplier);
        }
      }
    } catch (e) {
      console.warn('Failed to apply game config reward:', e);
    }
  }

  if (pointsEarned > 0 && studentId) {
    awardStudentPoints(studentId, pointsEarned);
  }

  const scores = getStoredItem<any[]>(STORAGE_KEYS.GAME_SCORES, []);
  const newScore = {
    id: `game-${Date.now()}`,
    gameName,
    studentId,
    score,
    pointsEarned,
    createdAt: new Date().toISOString(),
  };
  scores.unshift(newScore);
  setStoredItem(STORAGE_KEYS.GAME_SCORES, scores);
  syncDocToFirestore('gameScores', newScore.id, newScore);
  notifyDataUpdated();
  return newScore;
}

export function recordShortcutCompleted(
  studentId: string,
  shortcutIdOrPoints?: any,
  pointsEarnedArg?: number
) {
  const points = typeof shortcutIdOrPoints === 'number' ? shortcutIdOrPoints : (pointsEarnedArg || 50);
  if (points > 0 && studentId) {
    awardStudentPoints(studentId, points);
  }
}

export function getGameScores(): any[] {
  const scores = getStoredItem<any[]>(STORAGE_KEYS.GAME_SCORES, []);
  return Array.isArray(scores) ? scores : [];
}

// --- Submission Feedback ---
export function updateSubmissionFeedback(
  type: 'quiz' | 'typing',
  submissionId: string,
  feedback: string
): boolean {
  const key = type === 'quiz' ? STORAGE_KEYS.QUIZ_SUBMISSIONS : STORAGE_KEYS.TYPING_SUBMISSIONS;
  const submissions = getStoredItem<any[]>(key, []);
  const idx = submissions.findIndex((s) => s.id === submissionId);
  
  if (idx === -1) return false;
  
  submissions[idx] = {
    ...submissions[idx],
    pembinaFeedback: feedback,
    pembinaFeedbackAt: new Date().toISOString(),
  };
  
  setStoredItem(key, submissions);
  syncDocToFirestore(type === 'quiz' ? 'quizSubmissions' : 'typingSubmissions', submissionId, submissions[idx]);
  notifyDataUpdated();
  return true;
}

// --- Typing Tournaments ---
export function getTypingTournaments(): TypingTournament[] {
  return getStoredItem<TypingTournament[]>(STORAGE_KEYS.TYPING_TOURNAMENTS, []);
}

export function saveTypingTournament(tournament: Omit<TypingTournament, 'id'> & { id?: string }): TypingTournament {
  const tournaments = getTypingTournaments();
  const id = tournament.id || `trn-${Date.now()}`;
  const newTournament: TypingTournament = {
    ...tournament,
    id,
  };
  
  const existingIdx = tournaments.findIndex((t) => t.id === id);
  if (existingIdx !== -1) {
    tournaments[existingIdx] = newTournament;
  } else {
    tournaments.unshift(newTournament);
  }
  
  setStoredItem(STORAGE_KEYS.TYPING_TOURNAMENTS, tournaments);
  syncDocToFirestore('typingTournaments', id, newTournament);
  notifyDataUpdated();
  return newTournament;
}

export function deleteTypingTournament(id: string): void {
  const tournaments = getTypingTournaments();
  const filtered = tournaments.filter((t) => t.id !== id);
  setStoredItem(STORAGE_KEYS.TYPING_TOURNAMENTS, filtered);
  removeDocFromFirestore('typingTournaments', id);
  notifyDataUpdated();
}

// --- Liga Mengetik (Texts & Leaderboard) ---
const DEFAULT_TYPING_LEAGUE_TEXTS: TypingLeagueText[] = [
  {
    id: 'league-text-1',
    title: 'Sejarah & Manfaat Komputer Ceria',
    category: 'Sejarah',
    difficulty: 'Mudah',
    durationSeconds: 60,
    content: 'Komputer pertama kali diciptakan untuk membantu manusia menghitung dengan cepat dan tepat. Kini komputer telah berkembang menjadi perangkat pintar yang mempermudah kita belajar, menggambar, dan berkomunikasi dengan sahabat di seluruh dunia.',
    author: 'Pembina Komputer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'league-text-2',
    title: 'Keahlian Mengetik Cepat 10 Jari',
    category: 'Dasar',
    difficulty: 'Sedang',
    durationSeconds: 90,
    content: 'Mengetik sepuluh jari adalah keterampilan yang sangat hebat. Jari telunjuk bertugas menekan tombol F dan J yang memiliki tanda timbul khusus. Dengan berlatih setiap hari, tangan kita dapat menari lincah di atas keyboard tanpa perlu melihat tombol lagi.',
    author: 'Instruktur Rzk',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'league-text-3',
    title: 'Inovasi Digital & Masa Depan Cemerlang',
    category: 'Teknologi',
    difficulty: 'Sulit',
    durationSeconds: 120,
    content: 'Dunia digital masa depan dipenuhi dengan inovasi kecerdasan buatan dan jaringan internet super cepat. Siswa hebat selalu menggunakan teknologi untuk menciptakan karya bermanfaat, menjaga keamanan data pribadi, dan menyebarkan kebaikan bagi sesama.',
    author: 'Superadmin Ceria',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'league-text-4',
    title: 'Semangat Pantang Menyerah Menuju Bintang',
    category: 'Inspiratif',
    difficulty: 'Sedang',
    durationSeconds: 60,
    content: 'Setiap kesalahan dalam mengetik adalah langkah untuk menjadi lebih teliti dan terampil. Jangan takut membuat kekeliruan, teruslah berusaha dengan gigih karena keberhasilan milik mereka yang tidak pernah berhenti belajar.',
    author: 'Guru Pembina',
    createdAt: new Date().toISOString(),
  }
];

function getDeletedTypingLeagueTextIds(): string[] {
  return getStoredItem<string[]>(STORAGE_KEYS.DELETED_TYPING_LEAGUE_TEXTS, []);
}

export function getTypingLeagueTexts(): TypingLeagueText[] {
  const deletedIds = new Set(getDeletedTypingLeagueTextIds());
  const stored = getStoredItem<TypingLeagueText[]>(STORAGE_KEYS.TYPING_LEAGUE_TEXTS, DEFAULT_TYPING_LEAGUE_TEXTS);
  const activeTexts = (stored || DEFAULT_TYPING_LEAGUE_TEXTS).filter((t) => !deletedIds.has(t.id));
  return activeTexts;
}

export function saveTypingLeagueText(text: Omit<TypingLeagueText, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): TypingLeagueText {
  const texts = getTypingLeagueTexts();
  const id = text.id || `league-text-${Date.now()}`;
  const newText: TypingLeagueText = {
    ...text,
    id,
    createdAt: text.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIdx = texts.findIndex((t) => t.id === id);
  if (existingIdx !== -1) {
    texts[existingIdx] = newText;
  } else {
    texts.unshift(newText);
  }

  setStoredItem(STORAGE_KEYS.TYPING_LEAGUE_TEXTS, texts);
  syncDocToFirestore('typingLeagueTexts', id, newText);
  notifyDataUpdated();
  return newText;
}

export function deleteTypingLeagueText(id: string): void {
  // Store ID in deleted IDs array so it never reappears from Firestore snapshot or initialData
  const deletedIds = getDeletedTypingLeagueTextIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    setStoredItem(STORAGE_KEYS.DELETED_TYPING_LEAGUE_TEXTS, deletedIds);
    syncDocToFirestore('deletedTypingLeagueTexts', id, { id, deletedAt: new Date().toISOString() });
  }

  const texts = getStoredItem<TypingLeagueText[]>(STORAGE_KEYS.TYPING_LEAGUE_TEXTS, DEFAULT_TYPING_LEAGUE_TEXTS);
  const filtered = texts.filter((t) => t.id !== id);
  setStoredItem(STORAGE_KEYS.TYPING_LEAGUE_TEXTS, filtered);
  removeDocFromFirestore('typingLeagueTexts', id);

  // Purge all scores belonging to this deleted naskah
  const rawScores = getStoredItem<TypingLeagueScore[]>(STORAGE_KEYS.TYPING_LEAGUE_SCORES, []);
  const remainingScores = rawScores.filter((s) => s.textId !== id);
  const deletedScores = rawScores.filter((s) => s.textId === id);
  setStoredItem(STORAGE_KEYS.TYPING_LEAGUE_SCORES, remainingScores);
  deletedScores.forEach((s) => {
    removeDocFromFirestore('typingLeagueScores', s.id);
  });

  notifyDataUpdated();
}

export function getTypingLeagueScores(): TypingLeagueScore[] {
  const scores = getStoredItem<TypingLeagueScore[]>(STORAGE_KEYS.TYPING_LEAGUE_SCORES, []);
  const validTexts = getTypingLeagueTexts();
  const validTextIds = new Set(validTexts.map((t) => t.id));
  const deletedIds = new Set(getDeletedTypingLeagueTextIds());
  return scores.filter((s) => validTextIds.has(s.textId) && !deletedIds.has(s.textId));
}

export function saveTypingLeagueScore(
  scoreData: Omit<TypingLeagueScore, 'id' | 'submittedAt'> & { id?: string; submittedAt?: string }
): TypingLeagueScore {
  const scores = getTypingLeagueScores();
  const id = scoreData.id || `lscore-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newScore: TypingLeagueScore = {
    ...scoreData,
    id,
    submittedAt: scoreData.submittedAt || new Date().toISOString(),
  };

  scores.unshift(newScore);
  // Keep latest 500 scores locally
  const trimmed = scores.slice(0, 500);
  setStoredItem(STORAGE_KEYS.TYPING_LEAGUE_SCORES, trimmed);
  syncDocToFirestore('typingLeagueScores', id, newScore);

  // Also award student points & stars
  if (newScore.studentId) {
    if (newScore.score > 0) {
      awardStudentPoints(newScore.studentId, newScore.score);
    }
  }

  notifyDataUpdated();
  return newScore;
}

export function getTypingLeagueLeaderboard(textId?: string, school?: string): TypingLeagueScore[] {
  const scores = getTypingLeagueScores();
  let filtered = scores;

  if (textId && textId !== 'ALL') {
    filtered = filtered.filter((s) => s.textId === textId);
  }

  if (school && school !== 'ALL') {
    filtered = filtered.filter((s) => !s.studentSchool || s.studentSchool === school);
  }

  // Group by studentId to keep only their best score for the given filter
  const bestMap = new Map<string, TypingLeagueScore>();
  for (const s of filtered) {
    const existing = bestMap.get(s.studentId);
    if (!existing || s.score > existing.score || (s.score === existing.score && s.wpm > existing.wpm)) {
      bestMap.set(s.studentId, s);
    }
  }

  const bestList = Array.from(bestMap.values());
  bestList.sort((a, b) => b.score - a.score || b.wpm - a.wpm || b.accuracy - a.accuracy);
  return bestList;
}

// --- Forum Threads & Replies Management ---
export interface ForumThreadItem {
  id: string;
  title: string;
  category: 'materi' | 'tips_belajar' | 'umum';
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'admin';
  createdAt: string;
  likes: number;
  likedBy: string[];
  repliesCount: number;
  isModerated: boolean;
}

export interface ForumReplyItem {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'admin';
  createdAt: string;
  isModerated: boolean;
}

const DEFAULT_FORUM_THREADS: ForumThreadItem[] = [
  {
    id: 'th-1',
    title: '💬 Tips Cepat Mengetik 10 Jari Tanpa Melihat Keyboard',
    category: 'tips_belajar',
    content: 'Halo teman-teman! Agar kecepatan mengetik bisa tembus 50+ WPM, kuncinya adalah menempatkan jari telunjuk kiri di tombol F dan telunjuk kanan di tombol J (posisi Home Row). Ada yang punya tips latihan harian lainnya?',
    authorId: 'admin-1',
    authorName: 'Pembina Komputer Ceria',
    authorAvatar: '',
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 8,
    likedBy: [],
    repliesCount: 2,
    isModerated: false,
  },
  {
    id: 'th-2',
    title: '💻 Tanya Jawab: Komponen CPU dan Fungsi RAM Komputer',
    category: 'materi',
    content: 'Teman-teman, jika memori RAM di laptop kita penuh, apakah komputer akan menjadi lambat? Bagaimana cara mengecek penggunaan RAM di Windows Task Manager?',
    authorId: 'std-seed-1',
    authorName: 'Aisyah Putri',
    authorAvatar: '',
    authorRole: 'student',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    likes: 5,
    likedBy: [],
    repliesCount: 1,
    isModerated: false,
  },
];

const DEFAULT_FORUM_REPLIES: Record<string, ForumReplyItem[]> = {
  'th-1': [
    {
      id: 'rep-1',
      threadId: 'th-1',
      content: 'Iya betul pak! Saya setiap hari rutin latihan 10 menit di menu Latihan Word, jari manis dan kelingking sekarang jadi lebih lentur!',
      authorId: 'std-seed-2',
      authorName: 'Nabila Syahrani',
      authorAvatar: '',
      authorRole: 'student',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      isModerated: false,
    },
    {
      id: 'rep-2',
      threadId: 'th-1',
      content: 'Mantap Nabila! Pertahankan ritme latihan agar raih badge Diamond Champion!',
      authorId: 'admin-1',
      authorName: 'Pembina Komputer Ceria',
      authorAvatar: '',
      authorRole: 'admin',
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      isModerated: false,
    },
  ],
  'th-2': [
    {
      id: 'rep-3',
      threadId: 'th-2',
      content: 'Iya Aisyah, kalau RAM penuh aplikasi akan menjadi lag. Kita bisa menekan Ctrl + Shift + Esc untuk membuka Task Manager dan melihat penggunaan memori RAM.',
      authorId: 'admin-1',
      authorName: 'Pembina Komputer Ceria',
      authorAvatar: '',
      authorRole: 'admin',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      isModerated: false,
    },
  ],
};

export function getForumThreads(): ForumThreadItem[] {
  return getStoredItem<ForumThreadItem[]>('ekskul_forum_threads', DEFAULT_FORUM_THREADS);
}

export function saveForumThread(
  threadData: Omit<ForumThreadItem, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'repliesCount' | 'isModerated'> & {
    id?: string;
    createdAt?: string;
    likes?: number;
    likedBy?: string[];
    repliesCount?: number;
    isModerated?: boolean;
  }
): ForumThreadItem {
  const threads = getForumThreads();
  const id = threadData.id || `th-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newThread: ForumThreadItem = {
    ...threadData,
    id,
    createdAt: threadData.createdAt || new Date().toISOString(),
    likes: threadData.likes || 0,
    likedBy: threadData.likedBy || [],
    repliesCount: threadData.repliesCount || 0,
    isModerated: threadData.isModerated || false,
  };

  const existingIdx = threads.findIndex((t) => t.id === id);
  if (existingIdx !== -1) {
    threads[existingIdx] = newThread;
  } else {
    threads.unshift(newThread);
  }

  setStoredItem('ekskul_forum_threads', threads);
  syncDocToFirestore('forumThreads', id, newThread);
  notifyDataUpdated();
  return newThread;
}

export function deleteForumThread(id: string): void {
  const threads = getForumThreads();
  const filtered = threads.filter((t) => t.id !== id);
  setStoredItem('ekskul_forum_threads', filtered);
  removeDocFromFirestore('forumThreads', id);
  notifyDataUpdated();
}

export function toggleLikeForumThread(threadId: string, userId: string): ForumThreadItem | null {
  const threads = getForumThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx === -1) return null;

  const t = threads[idx];
  const hasLiked = t.likedBy.includes(userId);
  const nextLikedBy = hasLiked ? t.likedBy.filter((uid) => uid !== userId) : [...t.likedBy, userId];
  const nextLikes = Math.max(0, hasLiked ? t.likes - 1 : t.likes + 1);

  const updated: ForumThreadItem = {
    ...t,
    likes: nextLikes,
    likedBy: nextLikedBy,
  };

  threads[idx] = updated;
  setStoredItem('ekskul_forum_threads', threads);
  syncDocToFirestore('forumThreads', threadId, updated);
  notifyDataUpdated();
  return updated;
}

export function getForumReplies(threadId: string): ForumReplyItem[] {
  const allRepliesMap = getStoredItem<Record<string, ForumReplyItem[]>>('ekskul_forum_replies', DEFAULT_FORUM_REPLIES);
  return allRepliesMap[threadId] || [];
}

export function addForumReply(
  threadId: string,
  replyData: Omit<ForumReplyItem, 'id' | 'threadId' | 'createdAt' | 'isModerated'> & {
    id?: string;
    createdAt?: string;
  }
): ForumReplyItem {
  const allRepliesMap = getStoredItem<Record<string, ForumReplyItem[]>>('ekskul_forum_replies', DEFAULT_FORUM_REPLIES);
  const threadReplies = allRepliesMap[threadId] || [];
  const id = replyData.id || `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newReply: ForumReplyItem = {
    ...replyData,
    id,
    threadId,
    createdAt: replyData.createdAt || new Date().toISOString(),
    isModerated: false,
  };

  threadReplies.push(newReply);
  allRepliesMap[threadId] = threadReplies;
  setStoredItem('ekskul_forum_replies', allRepliesMap);

  // Update thread repliesCount
  const threads = getForumThreads();
  const tIdx = threads.findIndex((t) => t.id === threadId);
  if (tIdx !== -1) {
    threads[tIdx].repliesCount = threadReplies.length;
    setStoredItem('ekskul_forum_threads', threads);
    syncDocToFirestore('forumThreads', threadId, threads[tIdx]);
  }

  notifyDataUpdated();
  return newReply;
}

export function deleteForumReply(threadId: string, replyId: string): void {
  const allRepliesMap = getStoredItem<Record<string, ForumReplyItem[]>>('ekskul_forum_replies', DEFAULT_FORUM_REPLIES);
  const threadReplies = allRepliesMap[threadId] || [];
  const filtered = threadReplies.filter((r) => r.id !== replyId);
  allRepliesMap[threadId] = filtered;
  setStoredItem('ekskul_forum_replies', allRepliesMap);

  // Update thread repliesCount
  const threads = getForumThreads();
  const tIdx = threads.findIndex((t) => t.id === threadId);
  if (tIdx !== -1) {
    threads[tIdx].repliesCount = filtered.length;
    setStoredItem('ekskul_forum_threads', threads);
    syncDocToFirestore('forumThreads', threadId, threads[tIdx]);
  }

  notifyDataUpdated();
}
export async function pullLatestDataFromCloud(): Promise<boolean> {
  try {
    const collectionsToSync = [
      { name: 'users', key: STORAGE_KEYS.USERS },
      { name: 'lessons', key: STORAGE_KEYS.LESSONS },
      { name: 'quizzes', key: STORAGE_KEYS.QUIZZES },
      { name: 'typingPractices', key: STORAGE_KEYS.TYPING_PRACTICES },
      { name: 'typingLeagueTexts', key: STORAGE_KEYS.TYPING_LEAGUE_TEXTS },
      { name: 'announcements', key: STORAGE_KEYS.ANNOUNCEMENTS },
      { name: 'galleryWorks', key: STORAGE_KEYS.GALLERY_WORKS },
      { name: 'schoolRewards', key: STORAGE_KEYS.SCHOOL_REWARDS },
    ];
    for (const c of collectionsToSync) {
      const data = await fetchCollectionFromServer(c.name);
      if (data && data.length > 0) {
        setStoredItem(c.key, data);
      }
    }

    const configs = await fetchCollectionFromServer('config');
    configs.forEach((cfg) => {
      if (cfg.id === 'dashboard') setStoredItem(STORAGE_KEYS.DASHBOARD_CONFIG, cfg);
      else if (cfg.id === 'certificate') setStoredItem(STORAGE_KEYS.CERTIFICATE_CONFIG, cfg);
      else if (cfg.id === 'gamification') setStoredItem(STORAGE_KEYS.GAMIFICATION_CONFIG, cfg);
      else if (cfg.id === 'games_config') setStoredItem(STORAGE_KEYS.GAMES_CONFIG, cfg);
    });

    notifyDataUpdated();
    return true;
  } catch (err) {
    console.warn('Manual cloud data pull warning:', err);
    notifyDataUpdated();
    return false;
  }
}

export function toggleModerateForumThread(id: string, isModerated: boolean): ForumThreadItem | null {
  const threads = getForumThreads();
  const idx = threads.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  threads[idx].isModerated = isModerated;
  setStoredItem('ekskul_forum_threads', threads);
  syncDocToFirestore('forumThreads', id, threads[idx]);
  notifyDataUpdated();
  return threads[idx];
}

export function toggleModerateForumReply(threadId: string, replyId: string, isModerated: boolean): void {
  const allRepliesMap = getStoredItem<Record<string, ForumReplyItem[]>>('ekskul_forum_replies', DEFAULT_FORUM_REPLIES);
  const threadReplies = allRepliesMap[threadId] || [];
  const idx = threadReplies.findIndex((r) => r.id === replyId);
  if (idx !== -1) {
    threadReplies[idx].isModerated = isModerated;
    allRepliesMap[threadId] = threadReplies;
    setStoredItem('ekskul_forum_replies', allRepliesMap);
    notifyDataUpdated();
  }
}

