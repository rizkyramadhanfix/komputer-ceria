import React, { useState, useMemo, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Zap,
  Target,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Users,
  Clock,
  Sparkles,
  School,
  FileText,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  getTypingLeagueScores,
  getTypingLeagueTexts,
  getUsers,
  deleteTypingLeagueScore,
  deleteTypingLeagueScoresBatch,
} from '../../services/storageService';
import { TypingLeagueScore, TypingLeagueText } from '../../types';
import { Avatar } from '../common/Avatar';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';

interface AdminTypingLeagueLeaderboardProps {
  onRefresh?: () => void;
  onRequestConfirm?: (title: string, message: string, onConfirm: () => void, confirmText?: string) => void;
}

// Helper: Anti-Cheat & Suspicious Score Detection Logic
export function checkSuspiciousScore(item: TypingLeagueScore): {
  isSuspicious: boolean;
  tag: string;
  reason: string;
} {
  if (item.wpm >= 140) {
    return {
      isSuspicious: true,
      tag: 'Bot / Macro Ekstrem',
      reason: `WPM ekstrem (${item.wpm} WPM) di luar batas kecepatan fisik manusia/siswa.`,
    };
  }
  if (item.wpm >= 115) {
    return {
      isSuspicious: true,
      tag: 'WPM Tidak Wajar',
      reason: `Kecepatan ${item.wpm} WPM sangat tinggi dan tidak wajar untuk tingkat sekolah.`,
    };
  }
  if (item.wpm >= 90 && item.accuracy === 100 && (item.timeSpentSeconds || 60) < 15) {
    return {
      isSuspicious: true,
      tag: 'Waktu Kilat Abnormal',
      reason: 'Akurasi 100% dengan WPM tinggi diselesaikan dalam waktu kilat (<15 detik).',
    };
  }
  if (item.rawKpm && item.rawKpm > 720) {
    return {
      isSuspicious: true,
      tag: 'Ketukan Tuts Abnormal',
      reason: `Frekuensi ketukan tuts mencapai ${item.rawKpm} KPM (terindikasi script).`,
    };
  }
  return { isSuspicious: false, tag: '', reason: '' };
}

export const AdminTypingLeagueLeaderboard: React.FC<AdminTypingLeagueLeaderboardProps> = ({
  onRefresh,
  onRequestConfirm,
}) => {
  const { showSuccess, showWarning } = useToast();

  const [selectedTextFilter, setSelectedTextFilter] = useState<string>('ALL');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('ALL');
  const [cheatFilter, setCheatFilter] = useState<'all' | 'suspicious' | 'legit'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'best' | 'all'>('best');
  const [sortBy, setSortBy] = useState<'score' | 'wpm' | 'accuracy' | 'date'>('score');

  const [scores, setScores] = useState<TypingLeagueScore[]>(() => getTypingLeagueScores());
  const texts = useMemo(() => getTypingLeagueTexts(), []);
  const allUsers = useMemo(() => getUsers(), []);

  // Listen for real-time live data changes
  useEffect(() => {
    const handleUpdate = () => {
      setScores(getTypingLeagueScores());
    };
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, []);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<TypingLeagueScore | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState<boolean>(false);

  const handleReload = () => {
    const updated = getTypingLeagueScores();
    setScores(updated);
    if (onRefresh) onRefresh();
    showSuccess('Data leaderboard liga mengetik diperbarui!');
  };

  // List of suspicious scores
  const suspiciousScores = useMemo(() => {
    return scores.filter((s) => checkSuspiciousScore(s).isSuspicious);
  }, [scores]);

  // Available unique schools from scores and users
  const availableSchools = useMemo(() => {
    const schools = new Set<string>();
    scores.forEach((s) => {
      if (s.studentSchool) schools.add(s.studentSchool);
    });
    allUsers.forEach((u) => {
      if (u.school) schools.add(u.school);
    });
    return Array.from(schools).sort();
  }, [scores, allUsers]);

  // Filter and process leaderboard data
  const processedData = useMemo(() => {
    let list = scores;

    // Filter Cheat / Suspicious Status
    if (cheatFilter === 'suspicious') {
      list = list.filter((s) => checkSuspiciousScore(s).isSuspicious);
    } else if (cheatFilter === 'legit') {
      list = list.filter((s) => !checkSuspiciousScore(s).isSuspicious);
    }

    // Filter by text
    if (selectedTextFilter !== 'ALL') {
      list = list.filter((s) => s.textId === selectedTextFilter);
    }

    // Filter by school
    if (selectedSchoolFilter !== 'ALL') {
      list = list.filter(
        (s) => (s.studentSchool || '').toLowerCase() === selectedSchoolFilter.toLowerCase()
      );
    }

    // Filter by search query (name, username, text title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.textTitle.toLowerCase().includes(q) ||
          (s.studentSchool || '').toLowerCase().includes(q)
      );
    }

    // Best score per student vs all submissions
    if (viewMode === 'best') {
      const bestMap = new Map<string, TypingLeagueScore>();
      for (const s of list) {
        const studentKey = s.studentId
          ? `id_${s.studentId}`
          : `guest_${(s.studentName || '').toLowerCase().replace(/[^a-z0-9]/g, '')}_${(s.studentSchool || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        const existing = bestMap.get(studentKey);
        if (
          !existing ||
          s.score > existing.score ||
          (s.score === existing.score && s.wpm > existing.wpm)
        ) {
          bestMap.set(studentKey, s);
        }
      }
      list = Array.from(bestMap.values());
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score || b.wpm - a.wpm;
      if (sortBy === 'wpm') return b.wpm - a.wpm || b.accuracy - a.accuracy;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy || b.wpm - a.wpm;
      if (sortBy === 'date')
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      return 0;
    });
  }, [scores, cheatFilter, selectedTextFilter, selectedSchoolFilter, searchQuery, viewMode, sortBy]);

  // Execute deletion of single score
  const handleExecuteDeleteSingle = () => {
    if (!deleteTarget) return;
    deleteTypingLeagueScore(deleteTarget.id);
    showSuccess(`Skor milik "${deleteTarget.studentName}" (${deleteTarget.wpm} WPM) berhasil dihapus.`);
    setDeleteTarget(null);
    handleReload();
  };

  // Execute batch deletion of all suspicious scores
  const handleExecuteBatchDeleteCheats = () => {
    if (suspiciousScores.length === 0) return;
    const ids = suspiciousScores.map((s) => s.id);
    deleteTypingLeagueScoresBatch(ids);
    showSuccess(`Berhasil membersihkan ${ids.length} skor yang terindikasi curang dari leaderboard!`);
    setShowBatchDeleteModal(false);
    handleReload();
  };

  // Reset entire typing league scores (cleans up all old/stale scores)
  const handleResetAllScores = () => {
    if (scores.length === 0) {
      showSuccess('Leaderboard sudah bersih (tidak ada skor tersimpan).');
      return;
    }
    const doReset = () => {
      const ids = scores.map((s) => s.id);
      deleteTypingLeagueScoresBatch(ids);
      setScores([]);
      showSuccess('Semua riwayat skor lama berhasil dibersihkan dari leaderboard liga!');
      handleReload();
    };

    if (onRequestConfirm) {
      onRequestConfirm(
        'Bersihkan Seluruh Skor Leaderboard Liga',
        `Apakah Anda yakin ingin menghapus ${scores.length} seluruh data skor di Leaderboard Liga Mengetik? Tindakan ini akan mengosongkan papan skor dan menghapus semua data lama yang tumpang tindih.`,
        doReset,
        'Hapus Semua Skor'
      );
    } else {
      doReset();
    }
  };

  // Overall KPIs
  const stats = useMemo(() => {
    if (scores.length === 0) {
      return { topWpm: 0, topStudent: '-', avgWpm: 0, avgAcc: 0, totalSubmissions: 0 };
    }
    const legitOnly = scores.filter((s) => !checkSuspiciousScore(s).isSuspicious);
    const targetSet = legitOnly.length > 0 ? legitOnly : scores;

    const maxScoreItem = [...targetSet].sort((a, b) => b.wpm - a.wpm)[0];
    const totalWpm = targetSet.reduce((acc, s) => acc + s.wpm, 0);
    const totalAcc = targetSet.reduce((acc, s) => acc + s.accuracy, 0);

    return {
      topWpm: maxScoreItem?.wpm || 0,
      topStudent: maxScoreItem?.studentName || '-',
      topSchool: maxScoreItem?.studentSchool || '',
      avgWpm: Math.round(totalWpm / targetSet.length),
      avgAcc: Math.round(totalAcc / targetSet.length),
      totalSubmissions: scores.length,
    };
  }, [scores]);

  // Top 3 Podium (from legitimate scores)
  const legitLeaderboard = useMemo(() => {
    const bestMap = new Map<string, TypingLeagueScore>();
    for (const s of scores) {
      if (checkSuspiciousScore(s).isSuspicious) continue;
      const key = s.studentId
        ? `id_${s.studentId}`
        : `guest_${(s.studentName || '').toLowerCase().replace(/[^a-z0-9]/g, '')}_${(s.studentSchool || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const existing = bestMap.get(key);
      if (!existing || s.score > existing.score) {
        bestMap.set(key, s);
      }
    }
    return Array.from(bestMap.values()).sort((a, b) => b.score - a.score || b.wpm - a.wpm);
  }, [scores]);

  const top1 = legitLeaderboard[0];
  const top2 = legitLeaderboard[1];
  const top3 = legitLeaderboard[2];

  const getWpmColor = (wpm: number) => {
    if (wpm >= 50) return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
    if (wpm >= 35) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    if (wpm >= 20) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="space-y-6">
      {/* Header & Reload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              Pusat Monitoring Kompetisi
            </span>
            <span className="text-xs text-amber-100">· Real-Time Arena & Anti-Cheat System</span>
          </div>
          <h2 className="text-2xl font-black flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-200 animate-bounce" />
            <span>Leaderboard & Pengawasan Liga Mengetik 10 Jari</span>
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
            Pantau statistik kecepatan mengetik (WPM), tingkat akurasi siswa, serta lakukan moderasi/penghapusan pada skor yang terindikasi kecurangan atau bot.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReload}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Segarkan Data</span>
          </button>
          <button
            type="button"
            onClick={handleResetAllScores}
            className="px-4 py-2.5 rounded-2xl bg-rose-700/80 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-sm cursor-pointer border border-rose-400/40"
            title="Hapus semua riwayat skor lama dan mulai dari awal yang bersih"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Semua Skor</span>
          </button>
        </div>
      </div>

      {/* Anti-Cheat Alert Banner (if suspicious scores detected) */}
      {suspiciousScores.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border-2 border-rose-400 dark:border-rose-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Deteksi Anti-Cheat: Ditemukan {suspiciousScores.length} skor dengan indikasi tidak wajar / manipulasi!
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400">
                Skor WPM ekstrem atau waktu instan merusak keadilan kompetisi. Admin dapat menginspeksi dan menghapus skor curang.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCheatFilter('suspicious')}
              className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold text-xs border border-rose-300 hover:bg-rose-200 transition-all cursor-pointer"
            >
              Filter {suspiciousScores.length} Skor Curang
            </button>
            <button
              type="button"
              onClick={() => setShowBatchDeleteModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Semua ({suspiciousScores.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rekor WPM Wajar
            </span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.topWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold truncate">
            👑 {stats.topStudent}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rata-Rata Kecepatan
            </span>
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {stats.avgWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
          </p>
          <p className="text-[11px] text-slate-400">Peserta Wajar</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rata-Rata Akurasi
            </span>
            <Target className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats.avgAcc}%
          </p>
          <p className="text-[11px] text-slate-400">Ketepatan Huruf</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Submisi Balap
            </span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalSubmissions}
          </p>
          <p className="text-[11px] text-slate-400">
            {suspiciousScores.length > 0 ? (
              <span className="text-rose-500 font-bold">({suspiciousScores.length} Terindikasi Curang)</span>
            ) : (
              'Seluruh Submisi Bersih'
            )}
          </p>
        </div>
      </div>

      {/* Podium Cards for Top 3 Legitimate Champions */}
      {legitLeaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          {top2 ? (
            <div className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-5 shadow-md flex flex-col items-center text-center relative order-2 md:order-1 mt-0 md:mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-xs mb-2">
                #2
              </div>
              <Avatar src={top2.studentAvatar} name={top2.studentName} size="lg" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 truncate w-full">
                {top2.studentName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {top2.studentSchool || 'Sekolah'}
              </p>
              <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">{top2.wpm} WPM</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">{top2.accuracy}% Acc</span>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                ⭐ {top2.score} Poin Liga
              </span>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          {/* #1 Gold Champion */}
          {top1 && (
            <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-white dark:from-amber-950/80 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative order-1 md:order-2">
              <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>JUARA 1 LIGA</span>
              </div>
              <Avatar src={top1.studentAvatar} name={top1.studentName} size="xl" className="mt-1" />
              <h3 className="font-black text-slate-900 dark:text-white text-lg mt-2 truncate w-full">
                {top1.studentName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                🏫 {top1.studentSchool || 'Sekolah'}
              </p>
              <div className="mt-3 py-2 px-4 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center gap-3 text-sm font-mono font-black">
                <span className="text-amber-700 dark:text-amber-300">{top1.wpm} WPM</span>
                <span className="text-amber-400">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">{top1.accuracy}% Acc</span>
              </div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 mt-2">
                🏆 {top1.score} Poin Liga
              </span>
            </div>
          )}

          {/* #3 Bronze */}
          {top3 ? (
            <div className="bg-gradient-to-b from-orange-100 to-white dark:from-orange-950/50 dark:to-slate-900 border-2 border-orange-300 dark:border-orange-800/80 rounded-3xl p-5 shadow-md flex flex-col items-center text-center relative order-3 mt-0 md:mt-6">
              <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 flex items-center justify-center font-black text-xs mb-2">
                #3
              </div>
              <Avatar src={top3.studentAvatar} name={top3.studentName} size="lg" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 truncate w-full">
                {top3.studentName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {top3.studentSchool || 'Sekolah'}
              </p>
              <div className="mt-3 py-1.5 px-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-orange-600 dark:text-orange-400">{top3.wpm} WPM</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">{top3.accuracy}% Acc</span>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                ⭐ {top3.score} Poin Liga
              </span>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      )}

      {/* Interactive Controls & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Anti-Cheat & Moderation Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Filter Anti-Cheat:</span>
          </span>
          <button
            type="button"
            onClick={() => setCheatFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cheatFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua Submisi ({scores.length})
          </button>
          <button
            type="button"
            onClick={() => setCheatFilter('suspicious')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              cheatFilter === 'suspicious'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>⚠️ Terindikasi Curang ({suspiciousScores.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setCheatFilter('legit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              cheatFilter === 'legit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✅ Skor Wajar ({scores.length - suspiciousScores.length})</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, sekolah, atau judul naskah..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Filter Text */}
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedTextFilter}
                onChange={(e) => setSelectedTextFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                <option value="ALL">Semua Naskah ({texts.length})</option>
                {texts.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter School */}
            <div className="flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                <option value="ALL">Semua Sekolah</option>
                {availableSchools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                <option value="score">Urut: Skor Tertinggi</option>
                <option value="wpm">Urut: Kecepatan (WPM)</option>
                <option value="accuracy">Urut: Akurasi (%)</option>
                <option value="date">Urut: Submisi Terbaru</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('best')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'best'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Skor Terbaik
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Semua Riwayat
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 text-center w-12">Rank</th>
                <th className="p-3">Siswa Peserta</th>
                <th className="p-3">Asal Sekolah</th>
                <th className="p-3">Naskah Tantangan</th>
                <th className="p-3 text-center">Kecepatan</th>
                <th className="p-3 text-center">Akurasi</th>
                <th className="p-3 text-center">Status Moderasi</th>
                <th className="p-3 text-right">Skor Poin</th>
                <th className="p-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {processedData.map((item, idx) => {
                const rank = idx + 1;
                const suspicion = checkSuspiciousScore(item);

                return (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      suspicion.isSuspicious
                        ? 'bg-rose-50/60 dark:bg-rose-950/40 border-l-4 border-l-rose-500'
                        : rank === 1
                        ? 'bg-amber-50/40 dark:bg-amber-950/20'
                        : rank === 2
                        ? 'bg-slate-50/40 dark:bg-slate-800/20'
                        : rank === 3
                        ? 'bg-orange-50/40 dark:bg-orange-950/20'
                        : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="p-3 text-center align-middle">
                      {suspicion.isSuspicious ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-200 text-rose-900 font-black text-xs">
                          ⚠️
                        </span>
                      ) : rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-black text-xs shadow-xs">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-300 dark:bg-orange-800 text-slate-900 dark:text-white font-black text-xs shadow-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono font-bold">{rank}</span>
                      )}
                    </td>

                    {/* Student Name & Avatar */}
                    <td className="p-3 align-middle">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={item.studentAvatar} name={item.studentName} size="sm" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">
                            {item.studentName}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.submittedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* School */}
                    <td className="p-3 align-middle text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold">
                        <School className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{item.studentSchool || 'Sekolah Siswa'}</span>
                      </span>
                    </td>

                    {/* Text Title */}
                    <td className="p-3 align-middle">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.textTitle}
                      </span>
                    </td>

                    {/* WPM */}
                    <td className="p-3 text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${getWpmColor(
                          item.wpm
                        )}`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{item.wpm} WPM</span>
                      </span>
                    </td>

                    {/* Accuracy */}
                    <td className="p-3 text-center align-middle">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          item.accuracy >= 95
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.accuracy >= 85
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                    </td>

                    {/* Moderation / Anti-Cheat Status */}
                    <td className="p-3 text-center align-middle">
                      {suspicion.isSuspicious ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          title={suspicion.reason}
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-600 animate-pulse" />
                          <span>⚠️ {suspicion.tag}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Normal</span>
                        </span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="p-3 text-right align-middle">
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">
                        +{item.score} pt
                      </span>
                    </td>

                    {/* Delete Action Button */}
                    <td className="p-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                        title="Hapus skor ini (misal: terindikasi curang)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {processedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    <Trophy className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="font-bold">Tidak ada skor liga mengetik pada kategori filter ini.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Coba ganti filter naskah, sekolah, atau status anti-cheat untuk melihat data lainnya.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Single Score Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Skor Liga Mengetik"
        message={`Apakah Anda yakin ingin menghapus skor milik "${deleteTarget?.studentName}" dengan kecepatan ${deleteTarget?.wpm} WPM dan akurasi ${deleteTarget?.accuracy}% dari leaderboard? Skor akan dihapus dari sistem secara permanen.`}
        confirmText="Ya, Hapus Skor Ini"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleExecuteDeleteSingle}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Confirmation Modal for Batch Deleting All Suspicious Scores */}
      <ConfirmModal
        isOpen={showBatchDeleteModal}
        title="Bersihkan Semua Skor Curang"
        message={`Apakah Anda yakin ingin menghapus sekaligus ${suspiciousScores.length} skor yang terindikasi curang / tidak wajar dari leaderboard liga mengetik? Tindakan ini akan mengembalikan keadilan peringkat kompetisi bagi siswa lainnya.`}
        confirmText={`Hapus Semua (${suspiciousScores.length} Skor)`}
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleExecuteBatchDeleteCheats}
        onClose={() => setShowBatchDeleteModal(false)}
      />
    </div>
  );
};
