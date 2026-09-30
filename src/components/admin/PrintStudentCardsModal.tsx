import React, { useMemo, useState } from 'react';
import {
  CheckSquare,
  KeyRound,
  Printer,
  School,
  Search,
  Square,
  User,
  X,
} from 'lucide-react';
import { User as UserType } from '../../types';
import { Avatar } from '../common/Avatar';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { generateStudentCardsHtml } from '../../utils/printTemplates';

interface PrintStudentCardsModalProps {
  isOpen: boolean;
  students: UserType[];
  onClose: () => void;
  initialSelectedIds?: string[];
}

export const PrintStudentCardsModal: React.FC<PrintStudentCardsModalProps> = ({
  isOpen,
  students,
  onClose,
  initialSelectedIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Extract unique grades & schools
  const availableGrades = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.grade && s.grade.trim()) set.add(s.grade.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  const availableSchools = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.school && s.school.trim()) set.add(s.school.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter students based on search criteria
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.nisn && s.nisn.includes(searchQuery)) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade =
        selectedGrade === 'ALL' || (s.grade && s.grade.trim() === selectedGrade);

      const matchSchool =
        selectedSchool === 'ALL' || (s.school && s.school.trim() === selectedSchool);

      return matchSearch && matchGrade && matchSchool;
    });
  }, [students, searchQuery, selectedGrade, selectedSchool]);

  // Auto select students initially when modal opens or filter changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialSelectedIds && initialSelectedIds.length > 0) {
        setSelectedStudentIds(initialSelectedIds);
      } else {
        setSelectedStudentIds(filteredStudents.map((s) => s.id));
      }
    }
  }, [isOpen, initialSelectedIds, searchQuery, selectedGrade, selectedSchool, students]);

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredStudents.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedStudentIds, ...filteredStudents.map((s) => s.id)]);
      setSelectedStudentIds(Array.from(newIds));
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const studentsToPrint = useMemo(() => {
    return students.filter((s) => selectedStudentIds.includes(s.id));
  }, [students, selectedStudentIds]);

  // Chunk students into groups of 12 (12 cards per A4 page)
  const studentPages = useMemo(() => {
    const pages: UserType[][] = [];
    for (let i = 0; i < studentsToPrint.length; i += 12) {
      pages.push(studentsToPrint.slice(i, i + 12));
    }
    return pages;
  }, [studentsToPrint]);

  // Generate isolated HTML for Iframe PrintPreviewModal
  const printContentHtml = useMemo(() => {
    return generateStudentCardsHtml(studentsToPrint);
  }, [studentsToPrint]);

  const handleTriggerPrint = () => {
    setShowPreviewModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 to-sky-50/70 dark:from-indigo-950/50 dark:to-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Cetak Kartu Akun Siswa</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    Format A4 (12 Kartu / Lembar)
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter berdasarkan Nama, Kelas, NISN, atau Sekolah untuk mencetak kartu akun di kertas A4 (2 kolom x 6 baris)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Controls Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Search filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Cari Nama / NISN:
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama atau NISN..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filter by Kelas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Filter Kelas:
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
                  {availableGrades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade} ({students.filter((s) => s.grade === grade).length} Siswa)
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Sekolah */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Filter Asal Sekolah:
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">Semua Sekolah</option>
                  {availableSchools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Action: Select All / Count */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAllSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Batalkan Pilihan Semua</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Pilih Semua Siswa ({filteredStudents.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Menampilkan <strong>{filteredStudents.length}</strong> siswa tersaring
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                <strong>{studentsToPrint.length}</strong> kartu dipilih ({studentPages.length} lembar A4)
              </span>
            </div>
          </div>

          {/* Cards Preview Grid Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/80">
            {studentsToPrint.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <User className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Tidak ada kartu siswa yang dipilih
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Silakan ubah filter atau centang siswa yang ingin Anda cetak kartu akunnya.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {studentPages.map((pageStudents, pageIdx) => (
                  <div
                    key={`page-${pageIdx}`}
                    className="bg-white text-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-5"
                  >
                    {/* On-screen A4 Page Header Indicator */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
                      <span className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400">
                        <School className="w-4 h-4" />
                        Lembar Kertas A4 #{pageIdx + 1} dari {studentPages.length}
                      </span>
                      <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-bold px-2.5 py-0.5 rounded-full">
                        {pageStudents.length} / 12 Kartu Siswa
                      </span>
                    </div>

                    {/* 2 Columns x 6 Rows Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pageStudents.map((student) => (
                        <div
                          key={student.id}
                          className="relative bg-white text-slate-900 rounded-xl border-2 border-indigo-600 shadow-xs p-3.5 flex flex-col justify-between overflow-hidden aspect-[90/43] w-full box-border"
                        >
                          {/* Header Bar */}
                          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
                                KC
                              </div>
                              <div>
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-900 leading-none">
                                  KOMPUTER CERIA
                                </h4>
                                <p className="text-[9px] text-slate-500 font-semibold leading-none mt-0.5">
                                  KARTU AKUN SISWA
                                </p>
                              </div>
                            </div>

                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shrink-0">
                              {student.grade || 'Siswa'}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div className="flex items-center gap-3 py-1.5 my-auto">
                            <div className="shrink-0 flex flex-col items-center">
                              <div className="w-13 h-13 rounded-lg border-2 border-indigo-500/40 p-0.5 overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs">
                                <Avatar
                                  src={student.avatarUrl}
                                  name={student.name}
                                  size="md"
                                />
                              </div>
                              <span className="text-[7.5px] font-semibold text-slate-400 mt-1 uppercase">
                                Foto Siswa
                              </span>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1 text-left">
                              <div>
                                <span className="text-[8.5px] text-slate-400 block font-medium leading-tight">
                                  Nama Siswa:
                                </span>
                                <p className="text-xs font-extrabold text-slate-900 truncate leading-tight">
                                  {student.name}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                                <div>
                                  <span className="text-[7.5px] text-slate-400 block font-medium leading-none">
                                    NISN / Akun:
                                  </span>
                                  <span className="font-mono font-bold text-slate-800">
                                    {student.nisn || student.username}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[7.5px] text-slate-400 block font-medium leading-none">
                                    Kelas:
                                  </span>
                                  <span className="font-semibold text-slate-800">
                                    {student.grade || '-'}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <span className="text-[7.5px] text-slate-400 block font-medium leading-none">
                                  Asal Sekolah:
                                </span>
                                <p className="text-[9.5px] text-slate-700 truncate font-medium">
                                  {student.school || 'Sekolah Terdaftar'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card Password */}
                          <div className="mt-1 pt-1.5 border-t border-dashed border-indigo-200 flex items-center justify-between bg-indigo-50/80 -mx-3.5 -mb-3.5 px-3 py-1.5">
                            <div className="flex items-center gap-1 text-[9px] text-slate-600">
                              <KeyRound className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span className="font-medium">Password Akun:</span>
                            </div>
                            <span className="font-mono font-black text-xs text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200 tracking-wider">
                              {student.password || 'Siswa@123'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleStudent(student.id)}
                            className="absolute top-2 right-2 text-indigo-600 hover:text-rose-600 text-[9.5px] font-semibold bg-white/95 px-1.5 py-0.5 rounded border border-indigo-200 shadow-xs cursor-pointer"
                          >
                            Batal Pilih
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              <span>
                Format kartu didesain <strong>Ukuran Kertas A4 (12 Kartu per Lembar - 6cm x 9cm)</strong> lengkap dengan Foto Profil, NISN, Kelas, Sekolah, dan Sandi Akun.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={studentsToPrint.length === 0}
                onClick={handleTriggerPrint}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau & Cetak {studentsToPrint.length} Kartu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Isolated Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showPreviewModal}
        title="Pratinjau Cetak Kartu Akun Siswa"
        subtitle={`Format A4 Portrait · Total ${studentsToPrint.length} Kartu (${studentPages.length} Lembar A4)`}
        paperOrientation="portrait"
        pageSize="A4"
        itemCount={studentsToPrint.length}
        contentHtml={printContentHtml}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
};
