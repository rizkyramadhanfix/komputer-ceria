import React, { useMemo, useState } from 'react';
import {
  Award,
  Check,
  CheckSquare,
  Eye,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Users,
  X,
} from 'lucide-react';
import { User as UserType } from '../../types';
import {
  getBadgeForPoints,
  getCertificateConfig,
  getGamificationConfig,
} from '../../services/storageService';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { generateCertificatesHtml } from '../../utils/printTemplates';

interface PrintCertificatesModalProps {
  isOpen: boolean;
  students: UserType[];
  onClose: () => void;
  initialSelectedIds?: string[];
}

export const PrintCertificatesModal: React.FC<PrintCertificatesModalProps> = ({
  isOpen,
  students,
  onClose,
  initialSelectedIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'select' | 'preview'>('preview');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const gamification = getGamificationConfig();
  const certConfig = getCertificateConfig();

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

  // Filter students based on criteria
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

  // Auto select all filtered students when modal opens or filter changes
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

  // Generate isolated HTML for Iframe PrintPreviewModal
  const printContentHtml = useMemo(() => {
    return generateCertificatesHtml(studentsToPrint, certConfig, gamification);
  }, [studentsToPrint, certConfig, gamification]);

  const handleTriggerPrint = () => {
    setShowPreviewModal(true);
  };

  if (!isOpen) return null;

  const rawIssueDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const locationDateString = certConfig.locationAndDate
    ? certConfig.locationAndDate.includes(',')
      ? certConfig.locationAndDate
      : `${certConfig.locationAndDate}, ${rawIssueDate}`
    : rawIssueDate;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-50/80 to-indigo-50/80 dark:from-amber-950/40 dark:to-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Cetak Masal Sertifikat Siswa</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {studentsToPrint.length} Sertifikat Terpilih
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter berdasarkan Asal Sekolah, Kelas, atau NISN untuk mencetak banyak sertifikat resmi sekaligus.
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

          {/* Filter Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Search */}
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
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filter Asal Sekolah */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Filter Asal Sekolah:
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                >
                  <option value="ALL">Semua Sekolah</option>
                  {availableSchools.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Kelas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Filter Kelas:
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                >
                  <option value="ALL">Semua Kelas</option>
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Select All */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="w-full py-1.5 px-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAllSelected ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Batal Pilih Semua</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-amber-500" />
                      <span>Pilih Semua Siswa ({filteredStudents.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tab View Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau Sertifikat ({studentsToPrint.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('select')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'select'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Daftar Ceklis Siswa</span>
                </button>
              </div>

              <span className="text-slate-500 font-medium">
                Siswa terpilih: <strong className="text-amber-600 dark:text-amber-400 font-mono">{studentsToPrint.length}</strong> / {filteredStudents.length}
              </span>
            </div>
          </div>

          {/* Modal Scroll Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/80">
            {studentsToPrint.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Tidak ada sertifikat siswa yang dipilih
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Silakan ubah filter atau centang siswa yang ingin Anda cetak sertifikatnya.
                </p>
              </div>
            ) : (
              <>
                {/* Checklist Mode */}
                {activeTab === 'select' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredStudents.map((s) => {
                      const isSelected = selectedStudentIds.includes(s.id);
                      const { currentBadge } = getBadgeForPoints(s.totalPoints, gamification);

                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleStudent(s.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-amber-500 text-white'
                                  : 'border border-slate-300 dark:border-slate-700 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {s.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 truncate">
                                NISN: {s.nisn || '-'} · Kelas: {s.grade || '-'}
                              </p>
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                                {s.school || 'Sekolah Terdaftar'} · ★ {currentBadge.label}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Certificate Preview Container */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    {studentsToPrint.map((student, idx) => {
                      const { currentBadge } = getBadgeForPoints(student.totalPoints, gamification);
                      const certNumber = `KC/CERT/${new Date().getFullYear()}/${(student.nisn || student.id)
                        .slice(-6)
                        .toUpperCase()}`;

                      return (
                        <div
                          key={student.id}
                          className="relative overflow-hidden bg-white text-slate-900 rounded-2xl shadow-xl border-8 border-double border-amber-600 p-6 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto min-h-[520px]"
                        >
                          {/* On-screen Indicator */}
                          <div className="absolute top-3 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            Sertifikat #{idx + 1}
                          </div>

                          {/* Watermark Logo Background */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                            <Award className="w-96 h-96 text-indigo-900" />
                          </div>

                          {/* Corner Decorative Ornaments */}
                          <div className="absolute top-2.5 left-2.5 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
                          <div className="absolute top-2.5 right-2.5 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
                          <div className="absolute bottom-2.5 left-2.5 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
                          <div className="absolute bottom-2.5 right-2.5 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

                          {/* Header Section */}
                          <div className="text-center space-y-1.5 relative z-10 pt-1">
                            <div className="flex items-center justify-center gap-2 text-indigo-800 font-bold uppercase tracking-widest text-xs">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>
                                {certConfig.headerTitle || 'KOMPUTER CERIA'} · {certConfig.subHeaderTitle || 'SDN SUKADAMAI 2 BOGOR'}
                              </span>
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif uppercase py-0.5">
                              {certConfig.certificateTitle || 'SERTIFIKAT PENGHARGAAN'}
                            </h1>
                            <p className="text-xs text-slate-600 font-medium italic">
                              Nomor Registrasi: <span className="font-mono font-bold text-slate-800">{certNumber}</span>
                            </p>
                            <div className="w-28 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 mx-auto rounded-full mt-1" />
                          </div>

                          {/* Main Body */}
                          <div className="text-center my-3 sm:my-5 space-y-3 relative z-10">
                            <p className="text-xs sm:text-sm text-slate-600 font-medium">
                              Sertifikat ini secara resmi diberikan dan dianugerahkan kepada:
                            </p>

                            <div className="py-2 border-b-2 border-dashed border-slate-300 max-w-md mx-auto">
                              <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-950 tracking-wide font-serif">
                                {student.name}
                              </h2>
                            </div>

                            <p className="text-xs text-slate-700 font-medium">
                              NISN: <span className="font-mono font-bold">{student.nisn || student.username}</span> · Kelas:{' '}
                              <span className="font-semibold">{student.grade || '-'}</span> · Sekolah:{' '}
                              <span className="font-semibold">{student.school || certConfig.subHeaderTitle || 'Sekolah Binaan'}</span>
                            </p>

                            <div className="max-w-xl mx-auto bg-amber-50/80 p-3 rounded-xl border border-amber-200/80">
                              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                Atas prestasi dan dedikasi luar biasa dalam menuntaskan materi pembelajaran, kuis interaktif, serta latihan mengetik Microsoft Word hingga berhasil meraih predikat:
                              </p>
                              <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="px-3.5 py-1 bg-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-xs uppercase tracking-wider">
                                  ★ {currentBadge.label} ★
                                </span>
                                <span className="font-mono font-bold text-xs text-amber-900 bg-white px-2 py-1 rounded-md border border-amber-300">
                                  {student.totalStars} Bintang Emas ({student.totalPoints} Poin)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer Signatures */}
                          <div className="grid grid-cols-3 items-end pt-3 border-t border-slate-200 relative z-10 text-center text-xs text-slate-700 mt-2 shrink-0">
                            {/* Signatory 1 */}
                            <div className="flex flex-col items-center justify-end">
                              <p className="font-semibold text-xs">{certConfig.signer1Label || 'Mengetahui,'}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">
                                {certConfig.signer1Title || 'Pembina Ekstrakurikuler Komputer'}
                              </p>
                              <div className="h-12 w-full flex items-center justify-center my-0.5">
                                {certConfig.signer1SignatureUrl ? (
                                  <img
                                    src={certConfig.signer1SignatureUrl}
                                    alt="Tanda Tangan 1"
                                    className="max-h-12 max-w-[120px] object-contain"
                                  />
                                ) : (
                                  <span className="font-serif italic font-bold text-indigo-900 text-sm opacity-80">
                                    {certConfig.signer1Name || 'Rzk Digital Studio'}
                                  </span>
                                )}
                              </div>
                              <div className="w-28 border-b border-slate-400 mx-auto" />
                              <p className="font-bold text-xs mt-0.5 text-slate-900">
                                {certConfig.signer1Name || 'Rzk Digital Studio'}
                              </p>
                              {certConfig.signer1Nip && (
                                <p className="text-[9px] font-mono text-slate-500">{certConfig.signer1Nip}</p>
                              )}
                            </div>

                            {/* Official Seal Badge */}
                            <div className="flex flex-col items-center justify-center">
                              {certConfig.sealImageUrl ? (
                                <div className="flex flex-col items-center justify-center">
                                  <img
                                    src={certConfig.sealImageUrl}
                                    alt="Stempel / Barcode Resmi"
                                    className="w-14 h-14 object-contain rounded-md border border-amber-300 p-0.5 bg-white shadow-xs"
                                  />
                                  <span className="text-[7px] font-bold uppercase tracking-tighter text-amber-800 mt-0.5">
                                    {certConfig.sealTitle || 'RESMI · TERVERIFIKASI'}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-full border-4 border-double border-amber-500 bg-amber-100/80 text-amber-800 flex flex-col items-center justify-center shadow-xs">
                                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                                  <span className="text-[6px] font-black uppercase tracking-tighter mt-0.5">
                                    {certConfig.sealTitle || 'RESMI · TERVERIFIKASI'}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Signatory 2 */}
                            <div className="flex flex-col items-center justify-end">
                              <p className="font-semibold text-xs">{locationDateString}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">
                                {certConfig.signer2Title || 'Kepala Sekolah / Penanggung Jawab'}
                              </p>
                              <div className="h-12 w-full flex items-center justify-center my-0.5">
                                {certConfig.signer2SignatureUrl ? (
                                  <img
                                    src={certConfig.signer2SignatureUrl}
                                    alt="Tanda Tangan 2"
                                    className="max-h-12 max-w-[120px] object-contain"
                                  />
                                ) : (
                                  <span className="font-serif italic font-bold text-indigo-900 text-sm opacity-80">
                                    {certConfig.signer2Name || student.school || 'Kepala Sekolah'}
                                  </span>
                                )}
                              </div>
                              <div className="w-28 border-b border-slate-400 mx-auto" />
                              <p className="font-bold text-xs mt-0.5 text-slate-900">
                                {certConfig.signer2Name || student.school || 'Kepala Sekolah'}
                              </p>
                              {certConfig.signer2Nip && (
                                <p className="text-[9px] font-mono text-slate-500">{certConfig.signer2Nip}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-500">
              Total sertifikat yang akan dicetak:{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                {studentsToPrint.length} Lembar A4 Landscape
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={studentsToPrint.length === 0}
                onClick={handleTriggerPrint}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau & Cetak {studentsToPrint.length} Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Isolated Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showPreviewModal}
        title="Pratinjau Cetak Masal Sertifikat"
        subtitle={`Format A4 Landscape · Total ${studentsToPrint.length} Sertifikat`}
        paperOrientation="landscape"
        pageSize="A4"
        itemCount={studentsToPrint.length}
        contentHtml={printContentHtml}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
};
