import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Crown,
  Medal,
  Sparkles,
  Star,
  Trophy,
  Search,
  RefreshCw,
  Zap,
  Keyboard,
  CheckCircle2,
  School,
  Filter,
  Flame,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getBadgeForPoints,
  isStudentOnline,
  getTypingLeagueScores,
  getQuizSubmissions,
  pullFullSyncFromServer,
  getUsers,
  getDeletedUserIds,
} from '../../services/storageService';
import { User } from '../../types';
import { Avatar } from './Avatar';
import { BadgePill } from './BadgePill';
import { StudentProfileModal } from './StudentProfileModal';

interface LeaderboardWidgetProps {
  limit?: number;
  showAll?: boolean;
}

type LeaderboardCategory = 'points' | 'typing' | 'quizzes';

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  limit = 10,
  showAll = false,
}) => {
  const { users: contextUsers, currentUser, refreshUser } = useAuth();
  const [dataVersion, setDataVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<LeaderboardCategory>('points');
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live real-time data update listener
  useEffect(() => {
    const handleUpdate = () => {
      setDataVersion((v) => v + 1);
    };
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, []);

  // Fetch latest users state
  const effectiveUsers = useMemo(() => {
    return getUsers();
  }, [contextUsers, dataVersion]);

  // Handle manual live refresh
  const handleSyncRefresh = async () => {
    setIsRefreshing(true);
    try {
      await pullFullSyncFromServer();
      refreshUser();
      setDataVersion((v) => v + 1);
    } catch (err) {
      console.warn('Sync error:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Extract available distinct schools and grades for filter dropdowns
  const { availableSchools, availableGrades } = useMemo(() => {
    const schools = new Set<string>();
    const grades = new Set<string>();
    effectiveUsers.forEach((u) => {
      if (u.role === 'student') {
        if (u.school && u.school.trim()) schools.add(u.school.trim());
        if (u.grade && u.grade.trim()) grades.add(u.grade.trim());
      }
    });
    return {
      availableSchools: Array.from(schools).sort(),
      availableGrades: Array.from(grades).sort(),
    };
  }, [effectiveUsers]);

  // Clean student deduplication: strictly by ID, valid NISN, or unique username
  // NEVER by display name so students with similar names never overlap!
  const { processedStudents, idToCanonicalIdMap } = useMemo(() => {
    const studentMap = new Map<string, User>();
    const idToPrimaryMap = new Map<string, string>();
    const nisnToPrimaryMap = new Map<string, string>();
    const usernameToPrimaryMap = new Map<string, string>();
    const deletedIds = getDeletedUserIds();

    const normalizeStr = (str?: string) =>
      (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    for (const u of effectiveUsers) {
      if (u.role !== 'student' || !u.id || deletedIds.has(u.id)) continue;

      const normUsername = normalizeStr(u.username);
      const cleanNisn = u.nisn ? u.nisn.trim() : '';

      const safePoints = typeof u.totalPoints === 'number' && !isNaN(u.totalPoints) ? Math.max(0, u.totalPoints) : 0;
      const safeStars = typeof u.totalStars === 'number' && !isNaN(u.totalStars) ? Math.max(0, u.totalStars) : Math.floor(safePoints / 10);

      const cleanObj: User = {
        ...u,
        name: u.name ? u.name.trim() : 'Siswa',
        totalPoints: safePoints,
        totalStars: safeStars,
      };

      // Match canonical key strictly by user ID, valid NISN (>=4 chars), or unique username
      let canonicalKey: string | undefined = idToPrimaryMap.get(cleanObj.id);
      if (!canonicalKey && cleanNisn && cleanNisn.length >= 4) {
        canonicalKey = nisnToPrimaryMap.get(cleanNisn);
      }
      if (!canonicalKey && normUsername) {
        canonicalKey = usernameToPrimaryMap.get(normUsername);
      }

      if (canonicalKey && studentMap.has(canonicalKey)) {
        // Merge with existing record, keeping the highest scores and richest profile
        const existing = studentMap.get(canonicalKey)!;
        const higherPoints = Math.max(existing.totalPoints || 0, cleanObj.totalPoints || 0);
        const higherStars = Math.max(existing.totalStars || 0, cleanObj.totalStars || 0, Math.floor(higherPoints / 10));
        const mergedLessons = Array.from(new Set([...(existing.completedLessons || []), ...(cleanObj.completedLessons || [])]));
        
        const merged: User = {
          ...existing,
          ...cleanObj,
          id: existing.id, // Keep stable primary id
          name: cleanObj.name.length >= existing.name.length ? cleanObj.name : existing.name,
          school: cleanObj.school || existing.school,
          grade: cleanObj.grade || existing.grade,
          totalPoints: higherPoints,
          totalStars: higherStars,
          completedLessons: mergedLessons,
          avatarUrl: cleanObj.avatarUrl || existing.avatarUrl,
          equippedBadge: cleanObj.equippedBadge || existing.equippedBadge,
          equippedFrame: cleanObj.equippedFrame || existing.equippedFrame,
          equippedTitle: cleanObj.equippedTitle || existing.equippedTitle,
        };
        studentMap.set(canonicalKey, merged);
        idToPrimaryMap.set(cleanObj.id, existing.id);
      } else {
        const primaryKey = cleanObj.id;
        studentMap.set(primaryKey, cleanObj);
        idToPrimaryMap.set(cleanObj.id, primaryKey);
        if (cleanNisn && cleanNisn.length >= 4) nisnToPrimaryMap.set(cleanNisn, primaryKey);
        if (normUsername) usernameToPrimaryMap.set(normUsername, primaryKey);
      }
    }

    return {
      processedStudents: Array.from(studentMap.values()),
      idToCanonicalIdMap: idToPrimaryMap,
    };
  }, [effectiveUsers, dataVersion]);

  // Load sub-metrics for Typing and Quizzes categories with alias resolution
  const typingBestMap = useMemo(() => {
    const scores = getTypingLeagueScores();
    const map = new Map<string, { maxWpm: number; maxScore: number; accuracy: number }>();
    for (const s of scores) {
      if (!s.studentId) continue;
      const canonicalId = idToCanonicalIdMap.get(s.studentId) || s.studentId;
      const existing = map.get(canonicalId);
      if (!existing || s.wpm > existing.maxWpm || (s.wpm === existing.maxWpm && s.score > existing.maxScore)) {
        map.set(canonicalId, { maxWpm: s.wpm, maxScore: s.score, accuracy: s.accuracy });
      }
    }
    return map;
  }, [idToCanonicalIdMap, dataVersion]);

  const quizCompletedMap = useMemo(() => {
    const submissions = getQuizSubmissions();
    const map = new Map<string, { count: number; perfectCount: number }>();
    for (const sub of submissions) {
      if (!sub.studentId) continue;
      const canonicalId = idToCanonicalIdMap.get(sub.studentId) || sub.studentId;
      const existing = map.get(canonicalId) || { count: 0, perfectCount: 0 };
      map.set(canonicalId, {
        count: existing.count + 1,
        perfectCount: sub.score >= 100 ? existing.perfectCount + 1 : existing.perfectCount,
      });
    }
    return map;
  }, [idToCanonicalIdMap, dataVersion]);

  // Filter and sort students list
  const filteredAndSortedStudents = useMemo(() => {
    let list = [...processedStudents];

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.username && s.username.toLowerCase().includes(q)) ||
          (s.school && s.school.toLowerCase().includes(q)) ||
          (s.grade && s.grade.toLowerCase().includes(q))
      );
    }

    // Apply School Filter
    if (selectedSchool !== 'ALL') {
      list = list.filter((s) => s.school && s.school.trim() === selectedSchool);
    }

    // Apply Grade Filter
    if (selectedGrade !== 'ALL') {
      list = list.filter((s) => s.grade && s.grade.trim() === selectedGrade);
    }

    // Sort according to active category
    if (category === 'typing') {
      list.sort((a, b) => {
        const aTyping = typingBestMap.get(a.id)?.maxWpm || 0;
        const bTyping = typingBestMap.get(b.id)?.maxWpm || 0;
        if (bTyping !== aTyping) return bTyping - aTyping;
        return (b.totalPoints || 0) - (a.totalPoints || 0);
      });
    } else if (category === 'quizzes') {
      list.sort((a, b) => {
        const aQuiz = quizCompletedMap.get(a.id)?.count || 0;
        const bQuiz = quizCompletedMap.get(b.id)?.count || 0;
        if (bQuiz !== aQuiz) return bQuiz - aQuiz;
        return (b.totalPoints || 0) - (a.totalPoints || 0);
      });
    } else {
      // Default: totalPoints and totalStars
      list.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [processedStudents, searchQuery, selectedSchool, selectedGrade, category, typingBestMap, quizCompletedMap]);

  const displayList = showAll ? filteredAndSortedStudents : filteredAndSortedStudents.slice(0, limit);
  const topThree = displayList.slice(0, 3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-xs shadow-md shadow-amber-500/20 ring-2 ring-amber-300">
          <Crown className="w-4 h-4 fill-amber-950" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs shadow-sm ring-1 ring-slate-300 dark:ring-slate-600">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-black text-xs shadow-sm ring-1 ring-amber-600/40">
          3
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
        #{rank}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm w-full space-y-0">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {showAll ? 'Klasemen & Papan Skor Prestasi Siswa' : 'Top Peringkat Prestasi Siswa'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringkat terverifikasi otomatis dari seluruh aktivitas pembelajaran & tantangan komputer.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
            title="Segarkan data terbaru dari server cloud"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Category Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setCategory('points')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              category === 'points'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Poin & Bintang</span>
          </button>

          <button
            onClick={() => setCategory('typing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              category === 'typing'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-blue-500" />
            <span>Liga Mengetik</span>
          </button>

          <button
            onClick={() => setCategory('quizzes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              category === 'quizzes'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Kuis & Materi</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      {showAll && (
        <div className="px-4 sm:px-5 py-3 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau username siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* School Filter Dropdown */}
            {availableSchools.length > 0 && (
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">🏫 Semua Sekolah ({availableSchools.length})</option>
                {availableSchools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            )}

            {/* Grade Filter Dropdown */}
            {availableGrades.length > 0 && (
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">🎓 Semua Kelas</option>
                {availableGrades.map((gr) => (
                  <option key={gr} value={gr}>
                    {gr}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Ditemukan:</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              {filteredAndSortedStudents.length} Siswa
            </span>
          </div>
        </div>
      )}

      {/* Top 3 Podium Highlights for showAll or limit >= 5 */}
      {displayList.length >= 3 && (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-indigo-50/40 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-900 dark:to-transparent border-b border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {/* Rank 2 (Silver) */}
            <div
              onClick={() => setSelectedStudent(topThree[1])}
              className={`order-2 sm:order-1 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative hover:scale-[1.02] shadow-xs ${
                currentUser?.id === topThree[1].id
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 ring-2 ring-indigo-400/30'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white font-black text-xs flex items-center justify-center shadow-md">
                2
              </div>
              <div className="mt-1 relative">
                <Avatar src={topThree[1].avatarUrl} name={topThree[1].name} size="md" frame={topThree[1].equippedFrame} />
                {isStudentOnline(topThree[1]) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 truncate max-w-full">
                {topThree[1].name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate max-w-full">
                {topThree[1].school || 'SD/SMP'} {topThree[1].grade ? `· ${topThree[1].grade}` : ''}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {category === 'typing' ? (
                  <span>{typingBestMap.get(topThree[1].id)?.maxWpm || 0} WPM</span>
                ) : category === 'quizzes' ? (
                  <span>{quizCompletedMap.get(topThree[1].id)?.count || 0} Kuis Selesai</span>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{topThree[1].totalPoints} XP</span>
                  </>
                )}
              </div>
            </div>

            {/* Rank 1 (Gold Champion) */}
            <div
              onClick={() => setSelectedStudent(topThree[0])}
              className={`order-1 sm:order-2 p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative hover:scale-[1.03] shadow-md ${
                currentUser?.id === topThree[0].id
                  ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-400 ring-4 ring-amber-400/30'
                  : 'bg-gradient-to-b from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-800 border-amber-300 dark:border-amber-700'
              }`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-[11px] flex items-center gap-1 shadow-lg ring-2 ring-amber-200">
                <Crown className="w-3.5 h-3.5 fill-amber-950" />
                <span>JUARA #1</span>
              </div>
              <div className="mt-2 relative">
                <Avatar src={topThree[0].avatarUrl} name={topThree[0].name} size="lg" frame={topThree[0].equippedFrame} />
                {isStudentOnline(topThree[0]) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                )}
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2 truncate max-w-full">
                {topThree[0].name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate max-w-full">
                {topThree[0].school || 'SD/SMP'} {topThree[0].grade ? `· ${topThree[0].grade}` : ''}
              </p>
              <div className="mt-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200 font-mono">
                {category === 'typing' ? (
                  <span>🚀 {typingBestMap.get(topThree[0].id)?.maxWpm || 0} WPM</span>
                ) : category === 'quizzes' ? (
                  <span>🎯 {quizCompletedMap.get(topThree[0].id)?.count || 0} Kuis Selesai</span>
                ) : (
                  <>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{topThree[0].totalPoints} XP · {topThree[0].totalStars} ⭐</span>
                  </>
                )}
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div
              onClick={() => setSelectedStudent(topThree[2])}
              className={`order-3 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative hover:scale-[1.02] shadow-xs ${
                currentUser?.id === topThree[2].id
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 ring-2 ring-indigo-400/30'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-800 text-amber-100 font-black text-xs flex items-center justify-center shadow-md">
                3
              </div>
              <div className="mt-1 relative">
                <Avatar src={topThree[2].avatarUrl} name={topThree[2].name} size="md" frame={topThree[2].equippedFrame} />
                {isStudentOnline(topThree[2]) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 truncate max-w-full">
                {topThree[2].name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate max-w-full">
                {topThree[2].school || 'SD/SMP'} {topThree[2].grade ? `· ${topThree[2].grade}` : ''}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-400 font-mono">
                {category === 'typing' ? (
                  <span>{typingBestMap.get(topThree[2].id)?.maxWpm || 0} WPM</span>
                ) : category === 'quizzes' ? (
                  <span>{quizCompletedMap.get(topThree[2].id)?.count || 0} Kuis Selesai</span>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{topThree[2].totalPoints} XP</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs table-auto">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-3.5 w-12 text-center">Rank</th>
              <th className="py-3 px-3.5">Profil Siswa</th>
              <th className="py-3 px-3.5 hidden sm:table-cell">Sekolah & Kelas</th>
              {category === 'typing' && (
                <th className="py-3 px-3.5 text-center">Kecepatan WPM</th>
              )}
              {category === 'quizzes' && (
                <th className="py-3 px-3.5 text-center">Kuis Selesai</th>
              )}
              <th className="py-3 px-3.5 text-right">Skor Total & Peringkat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayList.map((student, idx) => {
              const rank = idx + 1;
              const isCurrent = currentUser?.id === student.id;
              const { currentBadge } = getBadgeForPoints(student.totalPoints);
              const typingStat = typingBestMap.get(student.id);
              const quizStat = quizCompletedMap.get(student.id);

              return (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/50 font-semibold'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-3 px-3.5 text-center align-middle">{getRankBadge(rank)}</td>
                  <td className="py-3 px-3.5 align-middle">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar src={student.avatarUrl} name={student.name} size="sm" frame={student.equippedFrame} />
                        {isStudentOnline(student) && (
                          <span
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                            title="Siswa Sedang Online"
                          />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-900 dark:text-white font-bold truncate text-xs">
                            {student.name}
                          </span>
                          {isStudentOnline(student) && (
                            <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1 py-0.2 rounded-full">
                              ● Online
                            </span>
                          )}
                          {student.equippedTitle && (
                            <span className="text-[8px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.2 rounded">
                              {student.equippedTitle}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[8px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded">
                              Akun Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          @{student.username || student.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 hidden sm:table-cell text-slate-600 dark:text-slate-300 align-middle">
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {student.school || 'Sekolah Terdaftar'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {student.grade ? `Kelas ${student.grade}` : 'Umum'}
                    </div>
                  </td>

                  {category === 'typing' && (
                    <td className="py-3 px-3.5 text-center align-middle">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-black font-mono text-xs">
                        <Keyboard className="w-3 h-3" />
                        {typingStat?.maxWpm || 0} WPM
                      </span>
                    </td>
                  )}

                  {category === 'quizzes' && (
                    <td className="py-3 px-3.5 text-center align-middle">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        {quizStat?.count || 0} Modul
                      </span>
                    </td>
                  )}

                  <td className="py-3 px-3.5 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-black font-mono text-xs tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {student.totalStars} ⭐
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] tabular-nums font-bold">
                          {student.totalPoints} XP
                        </span>
                      </div>
                      <BadgePill tier={currentBadge.tier} size="sm" />
                    </div>
                  </td>
                </tr>
              );
            })}

            {displayList.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tidak ada data siswa ditemukan
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Coba ubah filter sekolah, kata kunci pencarian, atau klik tombol segarkan sinkronisasi.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          isCurrent={currentUser?.id === selectedStudent.id}
        />
      )}
    </div>
  );
};
