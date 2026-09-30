import React, { useState, useMemo } from 'react';
import {
  Activity,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Flame,
  Laptop,
  Monitor,
  RefreshCw,
  School,
  Search,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Tablet,
  UserCheck,
  Users,
} from 'lucide-react';
import { LoginLog, User } from '../../types';
import { getLoginLogs, getUsers } from '../../services/storageService';
import { Avatar } from '../common/Avatar';

interface StudentLoginActivityTabProps {
  onOpenResetPassword?: (student: User) => void;
  onOpenEditStudent?: (student: User) => void;
}

export const StudentLoginActivityTab: React.FC<StudentLoginActivityTabProps> = ({
  onOpenResetPassword,
  onOpenEditStudent,
}) => {
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => getLoginLogs());
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [activityStatusFilter, setActivityStatusFilter] = useState<'ALL' | 'today' | 'week' | 'never'>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'logins' | 'points' | 'name'>('recent');
  const [viewMode, setViewMode] = useState<'accounts' | 'logs'>('accounts');
  const [inspectStudentLogs, setInspectStudentLogs] = useState<User | null>(null);

  const refreshData = () => {
    setUsers(getUsers());
    setLoginLogs(getLoginLogs());
  };

  const students = useMemo(() => {
    return users.filter((u) => u.role === 'student');
  }, [users]);

  // Available unique schools with student count
  const schoolOptions = useMemo(() => {
    const map = new Map<string, { total: number; activeToday: number }>();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    students.forEach((s) => {
      const sch = s.school?.trim() || 'Sekolah Tidak Diketahui';
      const isToday = s.lastLoginAt ? now - new Date(s.lastLoginAt).getTime() < oneDay : false;
      const cur = map.get(sch) || { total: 0, activeToday: 0 };
      map.set(sch, {
        total: cur.total + 1,
        activeToday: cur.activeToday + (isToday ? 1 : 0),
      });
    });

    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [students]);

  // Available unique grades
  const gradeOptions = useMemo(() => {
    const grades = new Set<string>();
    students.forEach((s) => {
      if (s.grade?.trim()) grades.add(s.grade.trim());
    });
    return Array.from(grades).sort();
  }, [students]);

  // Helper to format activity status
  const getActivityStatus = (lastLoginAt?: string) => {
    if (!lastLoginAt) {
      return {
        label: 'Belum pernah login',
        sub: 'Akun belum aktif',
        category: 'never',
        badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700',
        dotClass: 'bg-slate-400',
      };
    }

    const diffMs = Date.now() - new Date(lastLoginAt).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const dateObj = new Date(lastLoginAt);
    const timeFormatted = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (diffMs < 15 * 60 * 1000) {
      return {
        label: 'Aktif Baru Saja',
        sub: `Pukul ${timeFormatted}`,
        category: 'today',
        badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 animate-pulse',
        dotClass: 'bg-emerald-500',
      };
    }

    if (diffHours < 24) {
      return {
        label: `Hari ini, ${timeFormatted}`,
        sub: `${Math.round(diffHours)} jam lalu`,
        category: 'today',
        badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dotClass: 'bg-emerald-500',
      };
    }

    if (diffHours < 48) {
      return {
        label: `Kemarin, ${timeFormatted}`,
        sub: '1 hari lalu',
        category: 'week',
        badgeClass: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        dotClass: 'bg-blue-500',
      };
    }

    if (diffHours < 24 * 7) {
      const days = Math.floor(diffHours / 24);
      return {
        label: `${days} hari lalu`,
        sub: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        category: 'week',
        badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dotClass: 'bg-amber-500',
      };
    }

    return {
      label: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      sub: '> 1 minggu lalu',
      category: 'inactive',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      dotClass: 'bg-slate-400',
    };
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. School filter
      if (selectedSchool !== 'ALL' && (s.school || '').trim() !== selectedSchool.trim()) {
        return false;
      }

      // 2. Grade filter
      if (gradeFilter !== 'ALL' && (s.grade || '').trim() !== gradeFilter.trim()) {
        return false;
      }

      // 3. Activity status filter
      if (activityStatusFilter !== 'ALL') {
        const status = getActivityStatus(s.lastLoginAt);
        if (activityStatusFilter === 'today' && status.category !== 'today') return false;
        if (activityStatusFilter === 'week' && status.category !== 'today' && status.category !== 'week') return false;
        if (activityStatusFilter === 'never' && s.lastLoginAt) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchNisn = (s.nisn || s.username || '').toLowerCase().includes(q);
        const matchSchool = (s.school || '').toLowerCase().includes(q);
        if (!matchName && !matchNisn && !matchSchool) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        const timeA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const timeB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'logins') {
        return (b.loginCount || 0) - (a.loginCount || 0);
      }
      if (sortBy === 'points') {
        return (b.totalPoints || 0) - (a.totalPoints || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [students, selectedSchool, gradeFilter, activityStatusFilter, searchQuery, sortBy]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return loginLogs.filter((log) => {
      if (selectedSchool !== 'ALL' && (log.school || '').trim() !== selectedSchool.trim()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = log.name.toLowerCase().includes(q);
        const matchNisn = (log.nisn || '').toLowerCase().includes(q);
        if (!matchName && !matchNisn) return false;
      }
      return true;
    });
  }, [loginLogs, selectedSchool, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    let activeToday = 0;
    let activeWeek = 0;
    let neverLoggedIn = 0;

    students.forEach((s) => {
      if (!s.lastLoginAt) {
        neverLoggedIn++;
      } else {
        const diff = now - new Date(s.lastLoginAt).getTime();
        if (diff < oneDay) activeToday++;
        if (diff < oneWeek) activeWeek++;
      }
    });

    return { total, activeToday, activeWeek, neverLoggedIn };
  }, [students]);

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = [
      'Nama Siswa',
      'NISN',
      'Asal Sekolah',
      'Kelas',
      'Terakhir Login',
      'Waktu Login Terakhir',
      'Total Sesi Login',
      'Poin Bintang',
      'Total Bintang',
    ];

    const rows = filteredStudents.map((s) => {
      const status = getActivityStatus(s.lastLoginAt);
      return [
        `"${s.name}"`,
        `"${s.nisn || s.username}"`,
        `"${s.school || '-'}"`,
        `"${s.grade || '-'}"`,
        `"${status.label}"`,
        `"${s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString('id-ID') : 'Belum Pernah'}"`,
        s.loginCount || 0,
        s.totalPoints || 0,
        s.totalStars || 0,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Keaktifan_Siswa_${selectedSchool.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (deviceStr?: string) => {
    if (!deviceStr) return <Monitor className="w-3.5 h-3.5" />;
    const low = deviceStr.toLowerCase();
    if (low.includes('phone') || low.includes('smartphone')) {
      return <Smartphone className="w-3.5 h-3.5 text-sky-500" />;
    }
    if (low.includes('tablet')) {
      return <Tablet className="w-3.5 h-3.5 text-purple-500" />;
    }
    return <Laptop className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Monitoring Keaktifan Siswa
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              {filteredStudents.length} Akun Siswa Ditampilkan
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Daftar Akun yang Login & Keaktifan Belajar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Periksa intensitas belajar, tanggal login terakhir, dan riwayat akses siswa berdasarkan asal sekolah masing-masing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={refreshData}
            title="Muat Ulang Data"
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap Keaktifan (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Activity Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Siswa Terdaftar
            </span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs text-slate-400">akun</span>
          </div>
        </div>

        {/* Active Today */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 shadow-xs bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Aktif Hari Ini
            </span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {stats.activeToday}
            </span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.activeToday / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Active This Week */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Aktif Minggu Ini
            </span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {stats.activeWeek}
            </span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.activeWeek / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Never Logged In */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Belum Pernah Login
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-600 dark:text-slate-300 font-mono tabular-nums">
              {stats.neverLoggedIn}
            </span>
            <span className="text-xs text-slate-400">siswa pasif</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-indigo-500"
            />
          </div>

          {/* FILTER BERDASARKAN SEKOLAH (CRUCIAL REQUIREMENT) */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 cursor-pointer focus:outline-indigo-500"
              >
                <option value="ALL">🏫 Semua Sekolah ({students.length} Siswa)</option>
                {schoolOptions.map(([schoolName, data]) => (
                  <option key={schoolName} value={schoolName}>
                    {schoolName} · {data.total} siswa ({data.activeToday} aktif hari ini)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Status Keaktifan */}
          <div className="lg:col-span-2">
            <select
              value={activityStatusFilter}
              onChange={(e) => setActivityStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="ALL">Semua Keaktifan</option>
              <option value="today">🟢 Aktif Hari Ini</option>
              <option value="week">🔵 Aktif Minggu Ini</option>
              <option value="never">⚪ Belum Pernah Login</option>
            </select>
          </div>

          {/* Filter Kelas */}
          <div className="lg:col-span-1">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="ALL">Kelas</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="recent">Sort: Login Terbaru</option>
              <option value="logins">Sort: Paling Sering Login</option>
              <option value="points">Sort: Poin Tertinggi</option>
              <option value="name">Sort: Nama A-Z</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('accounts')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'accounts'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Daftar Akun Siswa ({filteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('logs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'logs'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Linimasa Riwayat Sesi ({filteredLogs.length})
            </button>
          </div>

          {selectedSchool !== 'ALL' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Aktif:</span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {selectedSchool}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSchool('ALL')}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table: Accounts View */}
      {viewMode === 'accounts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Status & Login Terakhir</th>
                  <th className="py-3 px-4 text-center">Sesi Login</th>
                  <th className="py-3 px-4">Prestasi Belajar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredStudents.map((s) => {
                  const status = getActivityStatus(s.lastLoginAt);
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.avatarUrl} name={s.name} size="sm" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              NISN: {s.nisn || s.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* School */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                          <School className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{s.school || 'Sekolah Terdaftar'}</span>
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {s.grade || '-'}
                      </td>

                      {/* Last Login & Activity */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                            <span>{status.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 pl-1">{status.sub}</p>
                        </div>
                      </td>

                      {/* Login Count */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {s.loginCount || (s.lastLoginAt ? 1 : 0)}x
                        </span>
                      </td>

                      {/* Learning Progress */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-500">
                              {s.totalStars} ★
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({s.totalPoints} poin)
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {s.completedLessons?.length || 0} Materi Selesai
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectStudentLogs(s)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            Riwayat
                          </button>
                          {onOpenEditStudent && (
                            <button
                              type="button"
                              onClick={() => onOpenEditStudent(s)}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                          {onOpenResetPassword && (
                            <button
                              type="button"
                              onClick={() => onOpenResetPassword(s)}
                              className="px-2 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Reset Password Siswa"
                            >
                              Sandi
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-sm">Tidak ada siswa yang cocok dengan filter.</p>
                        <p className="text-xs text-slate-400">
                          Coba ganti filter sekolah atau kata kunci pencarian.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Table: Login Logs Timeline View */}
      {viewMode === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Catatan Sesi Login Real-Time
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Menampilkan {filteredLogs.length} sesi login terakhir
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Waktu Login</th>
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Perangkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredLogs.map((log) => {
                  const logDate = new Date(log.timestamp);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {logDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Pukul {logDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {log.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {log.nisn || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {log.school || 'Sekolah Terdaftar'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {log.grade || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {getDeviceIcon(log.device)}
                          <span>{log.device || 'PC Lab / Desktop'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Belum ada sesi login yang sesuai dengan filter sekolah ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Student Sesi Detail Modal */}
      {inspectStudentLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar
                  src={inspectStudentLogs.avatarUrl}
                  name={inspectStudentLogs.name}
                  size="md"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {inspectStudentLogs.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {inspectStudentLogs.school || 'Sekolah Terdaftar'} · {inspectStudentLogs.grade}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectStudentLogs(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Sesi Login</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {inspectStudentLogs.loginCount || 1} Kali
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Terakhir Login</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {inspectStudentLogs.lastLoginAt
                      ? new Date(inspectStudentLogs.lastLoginAt).toLocaleString('id-ID')
                      : 'Belum pernah'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs mb-2">
                  Riwayat Sesi Login Tercatat:
                </h4>
                <div className="space-y-2">
                  {loginLogs
                    .filter((l) => l.userId === inspectStudentLogs.id)
                    .slice(0, 15)
                    .map((l) => (
                      <div
                        key={l.id}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(l.device)}
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {new Date(l.timestamp).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Pukul {new Date(l.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {l.device || 'PC Lab'}
                        </span>
                      </div>
                    ))}

                  {loginLogs.filter((l) => l.userId === inspectStudentLogs.id).length === 0 && (
                    <p className="text-slate-400 text-center py-4">
                      Belum ada log detail login untuk siswa ini.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectStudentLogs(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
