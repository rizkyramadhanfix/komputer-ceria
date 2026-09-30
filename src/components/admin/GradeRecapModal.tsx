import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Download,
  FileSpreadsheet,
  Filter,
  Keyboard,
  Printer,
  Search,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { exportGradesToCSV, getStudentGradeSummaries } from '../../services/storageService';
import { StudentGradeSummary } from '../../types';
import { useToast } from '../../context/ToastContext';

interface GradeRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeRecapModal: React.FC<GradeRecapModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const rawSummaries = useMemo(() => {
    return getStudentGradeSummaries('ALL');
  }, [isOpen]);

  const availableGrades = useMemo(() => {
    const all = getStudentGradeSummaries('ALL');
    const set = new Set(all.map((s) => s.grade).filter((g) => g && g !== '-'));
    return Array.from(set).sort();
  }, [isOpen]);

  const availableSchools = useMemo(() => {
    const all = getStudentGradeSummaries('ALL');
    const set = new Set(all.map((s) => s.school).filter((sch) => sch && sch.trim() && sch !== '-'));
    return Array.from(set).sort();
  }, [isOpen]);

  const filteredSummaries = useMemo(() => {
    return rawSummaries.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.school.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade =
        selectedGrade === 'ALL' || (s.grade && s.grade.trim() === selectedGrade);

      const matchSchool =
        selectedSchool === 'ALL' || (s.school && s.school.trim() === selectedSchool);

      return matchSearch && matchGrade && matchSchool;
    });
  }, [rawSummaries, searchQuery, selectedGrade, selectedSchool]);

  // Summary Metrics
  const avgQuizOverall = useMemo(() => {
    if (filteredSummaries.length === 0) return 0;
    const sum = filteredSummaries.reduce((acc, s) => acc + s.avgQuizScore, 0);
    return Math.round(sum / filteredSummaries.length);
  }, [filteredSummaries]);

  const avgWpmOverall = useMemo(() => {
    if (filteredSummaries.length === 0) return 0;
    const sum = filteredSummaries.reduce((acc, s) => acc + s.avgTypingWpm, 0);
    return Math.round(sum / filteredSummaries.length);
  }, [filteredSummaries]);

  const totalStarsOverall = useMemo(() => {
    return filteredSummaries.reduce((acc, s) => acc + s.totalStars, 0);
  }, [filteredSummaries]);

  const handleDownloadCSV = () => {
    const csvContent = exportGradesToCSV(filteredSummaries);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const gradeLabel = selectedGrade === 'ALL' ? 'Semua_Kelas' : selectedGrade.replace(/\s+/g, '_');
    const schoolLabel = selectedSchool === 'ALL' ? 'Semua_Sekolah' : selectedSchool.replace(/\s+/g, '_');
    link.setAttribute('download', `Rekap_Nilai_Komputer_Ceria_${schoolLabel}_${gradeLabel}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('File rekap nilai CSV/Excel berhasil diunduh!', 'Ekspor Berhasil');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Rekap Rapor Nilai & Ekspor Excel</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {filteredSummaries.length} Siswa
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rangkuman pencapaian materi, skor kuis, akurasi mengetik Word, dan akumulasi bintang seluruh siswa.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Statistics Row */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NISN, sekolah..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Asal Sekolah */}
            <div>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="ALL">Semua Sekolah</option>
                {availableSchools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Grade */}
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="ALL">Semua Kelas</option>
                {availableGrades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric 1 */}
            <div className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Rata-rata Kuis:</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {avgQuizOverall}%
              </span>
            </div>

            {/* Metric 2 */}
            <div className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Rata-rata WPM:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {avgWpmOverall} WPM
              </span>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {filteredSummaries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada data siswa yang cocok dengan filter.
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">NISN</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Asal Sekolah</th>
                    <th className="py-2.5 px-3">Materi Selesai</th>
                    <th className="py-2.5 px-3">Rata-rata Kuis</th>
                    <th className="py-2.5 px-3">Akurasi Ketik</th>
                    <th className="py-2.5 px-3">Kecepatan</th>
                    <th className="py-2.5 px-3">Total Bintang</th>
                    <th className="py-2.5 px-3">Tingkat Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredSummaries.map((s, idx) => (
                    <tr
                      key={s.studentId}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {s.nisn}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {s.grade}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {s.school || '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {s.completedLessonsCount} Modul
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {s.avgQuizScore}%
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">({s.quizzesTakenCount}x)</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {s.avgTypingAccuracy}%
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {s.avgTypingWpm} WPM
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-500">
                        {s.totalStars} ★ ({s.totalPoints} pts)
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {s.badgeTier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Total bintang terakumulasi:{' '}
            <strong className="text-amber-500 font-mono">{totalStarsOverall} ★</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Tutup
            </button>
            <button
              disabled={filteredSummaries.length === 0}
              onClick={handleDownloadCSV}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Excel / CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
