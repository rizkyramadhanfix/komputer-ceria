import React, { useMemo, useState } from 'react';
import { Award, Printer, ShieldCheck, Sparkles, X } from 'lucide-react';
import { User } from '../../types';
import {
  getBadgeForPoints,
  getCertificateConfigForSchool,
  getGamificationConfig,
} from '../../services/storageService';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { generateCertificatesHtml } from '../../utils/printTemplates';

interface CertificateModalProps {
  isOpen: boolean;
  student: User;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const gamification = getGamificationConfig();
  const certConfig = getCertificateConfigForSchool(student.school);
  const { currentBadge } = getBadgeForPoints(student.totalPoints, gamification);

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

  const certificateNumber = `KC/CERT/${new Date().getFullYear()}/${(student.nisn || student.id)
    .slice(-6)
    .toUpperCase()}`;

  const printContentHtml = useMemo(() => {
    return generateCertificatesHtml([student], certConfig, gamification);
  }, [student, certConfig, gamification]);

  const handlePrint = () => {
    setShowPreviewModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Sertifikat Prestasi Pembelajaran
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold hidden sm:inline-block">
                Tingkat: {currentBadge.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Preview Box */}
          <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white text-slate-900 p-4 sm:p-6 rounded-xl border-8 border-double border-amber-600/70 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[1.414/1] min-h-[420px] max-h-[75vh]">
              {/* Watermark Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <Award className="w-96 h-96 text-indigo-900" />
              </div>

              {/* Corner Decorative Ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

              {/* Certificate Header */}
              <div className="text-center space-y-1.5 relative z-10">
                <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold uppercase tracking-widest text-xs">
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
                  Nomor Registrasi: <span className="font-mono font-bold text-slate-800">{certificateNumber}</span>
                </p>
                <div className="w-28 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 mx-auto rounded-full mt-1" />
              </div>

              {/* Certificate Body */}
              <div className="text-center my-4 space-y-3 relative z-10">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Sertifikat ini secara resmi diberikan dan dianugerahkan kepada:
                </p>

                <div className="py-2 border-b-2 border-dashed border-slate-300 max-w-md mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-wide font-serif">
                    {student.name}
                  </h2>
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  NISN: <span className="font-mono font-bold">{student.nisn || student.username}</span> · Kelas:{' '}
                  <span className="font-semibold">{student.grade || '-'}</span> · Sekolah:{' '}
                  <span className="font-semibold">{student.school || certConfig.subHeaderTitle || 'Sekolah Binaan'}</span>
                </p>

                <div className="max-w-xl mx-auto bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80">
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

              {/* Signatures & Seal */}
              <div className="grid grid-cols-3 items-end pt-3 border-t border-slate-200 relative z-10 text-center text-xs text-slate-700 mt-2 shrink-0">
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
          </div>

          {/* Bottom Action Footer */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sertifikat Resmi Siswa: <strong className="text-slate-900 dark:text-white font-semibold">{student.name}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau & Cetak</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Isolated Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showPreviewModal}
        title={`Pratinjau Sertifikat - ${student.name}`}
        subtitle={`Sertifikat Penghargaan Resmi · ${currentBadge.label}`}
        paperOrientation="landscape"
        pageSize="A4"
        itemCount={1}
        contentHtml={printContentHtml}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
};
