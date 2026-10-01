import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Rocket,
  School,
  Sparkles,
  User as UserIcon,
  X,
  Shield,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { findMatchingStudent, getBadgeForPoints } from '../../services/storageService';
import { User } from '../../types';
import { Avatar } from '../common/Avatar';
import { BadgePill } from '../common/BadgePill';

export interface StartLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenSuperadmin?: () => void;
}

const DEFAULT_GRADES = [
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6',
  'Kelas 7',
  'Kelas 8',
  'Kelas 9',
];

export const StartLearningModal: React.FC<StartLearningModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenSuperadmin,
}) => {
  const { startLearningSession } = useAuth();
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Kelas 5');
  const [school, setSchool] = useState('SDN Sukadamai 2');
  const [customGrade, setCustomGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pop-up confirmation state for existing user
  const [foundExistingUser, setFoundExistingUser] = useState<User | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setGrade('Kelas 5');
      setSchool('SDN Sukadamai 2');
      setCustomGrade('');
      setFoundExistingUser(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) {
      showError('Silakan masukkan nama lengkap atau nama panggilan kamu.');
      return;
    }

    const finalGrade = grade === 'Lainnya' ? (customGrade.trim() || 'Siswa') : grade;
    const cleanSchool = school.trim() || 'SDN Sukadamai 2';

    setIsSubmitting(true);
    try {
      // Check if student with same name and school already exists
      const existing = await findMatchingStudent(cleanName, cleanSchool, finalGrade);
      if (existing) {
        // Pop-up confirmation: "Data sudah ada, apakah ini data anda?"
        setFoundExistingUser(existing);
        setIsSubmitting(false);
        return;
      }

      // No existing data -> create fresh learner session
      const res = startLearningSession({
        name: cleanName,
        grade: finalGrade,
        school: cleanSchool,
      });

      if (res.success) {
        showSuccess(
          `Selamat datang, ${res.user.name}! Selamat belajar dan raih bintang prestasimu! ⭐`,
          'Mulai Belajar'
        );
        onClose();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      showError('Gagal memulai sesi belajar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmExistingUser = () => {
    if (!foundExistingUser) return;

    const finalGrade = grade === 'Lainnya' ? (customGrade.trim() || foundExistingUser.grade || 'Siswa') : (grade || foundExistingUser.grade || 'Kelas 5');
    const cleanSchool = school.trim() || foundExistingUser.school || 'SDN Sukadamai 2';

    setIsSubmitting(true);
    try {
      const res = startLearningSession({
        name: foundExistingUser.name,
        grade: finalGrade,
        school: cleanSchool,
        existingUserId: foundExistingUser.id,
      });

      if (res.success) {
        showSuccess(
          `Selamat datang kembali, ${res.user.name}! Bintang (${res.user.totalStars} ★) & Poin (${res.user.totalPoints} pt) Anda berhasil dimuat kembali! ⭐`,
          'Profil Ditemukan'
        );
        onClose();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      showError('Gagal memuat profil. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewSeparateUser = () => {
    const cleanName = name.trim();
    const finalGrade = grade === 'Lainnya' ? (customGrade.trim() || 'Siswa') : grade;
    const cleanSchool = school.trim() || 'SDN Sukadamai 2';

    // Disambiguate by appending a random suffix if user explicitly wants a fresh new profile
    const uniqueName = `${cleanName} (${Math.floor(10 + Math.random() * 90)})`;

    setIsSubmitting(true);
    try {
      const res = startLearningSession({
        name: uniqueName,
        grade: finalGrade,
        school: cleanSchool,
      });

      if (res.success) {
        showSuccess(
          `Profil baru "${uniqueName}" berhasil dibuat! Selamat belajar! ⭐`,
          'Profil Baru'
        );
        onClose();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      showError('Gagal membuat profil baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Rocket className="w-7 h-7 text-amber-300 animate-bounce" />
          </div>

          <h2 className="text-xl font-black tracking-tight">Mulai Belajar Komputer Ceria 🚀</h2>
          <p className="text-xs text-indigo-100 mt-1 font-medium">
            Akses gratis untuk semua materi, kuis, latihan mengetik, dan game edukasi!
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {foundExistingUser ? (
            /* POP-UP PEMBERITAHUAN: DATA SUDAH ADA APAKAH INI DATA ANDA? */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 rounded-2xl text-left space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      Data Profil Siswa Ditemukan!
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      Data sudah ada, apakah ini data Anda?
                    </p>
                  </div>
                </div>

                {/* Profile Card Detail */}
                <div className="p-3.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={foundExistingUser.avatarUrl}
                      name={foundExistingUser.name}
                      size="md"
                      frame={foundExistingUser.equippedFrame}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {foundExistingUser.name}
                        </span>
                        {foundExistingUser.equippedTitle && (
                          <span className="text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.2 rounded">
                            {foundExistingUser.equippedTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        🏫 {foundExistingUser.school || 'Sekolah'} · 🎓 {foundExistingUser.grade || 'Kelas'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{foundExistingUser.totalStars || 0} ★ Bintang</span>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-mono">
                      {foundExistingUser.totalPoints || 0} Poin (XP)
                    </div>
                    <div>
                      <BadgePill
                        tier={getBadgeForPoints(foundExistingUser.totalPoints || 0).currentBadge.tier}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                  💡 Jika Anda memilih <b>Ya</b>, semua poin, bintang, materi yang selesai, dan item toko yang pernah Anda dapatkan akan tetap ada dan langsung dilanjutkan!
                </p>
              </div>

              {/* Action Buttons for Existing User */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmExistingUser}
                  className="w-full py-3 px-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ya, Ini Data Saya! Lanjutkan Belajar 🚀</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFoundExistingUser(null)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Bukan Saya, Ganti Nama
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewSeparateUser}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer"
                  >
                    Buat Profil Baru
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD ENTRY FORM (NAMA, KELAS, ASAL SEKOLAH) */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Nama Lengkap / Panggilan */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Nama Lengkap / Panggilan</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Pratama / Budi"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
              </div>

              {/* Tingkat / Kelas */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                  <span>Tingkat / Kelas</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  {DEFAULT_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya / Umum</option>
                </select>

                {grade === 'Lainnya' && (
                  <input
                    type="text"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    placeholder="Tuliskan kelas kamu..."
                    className="w-full mt-2 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                )}
              </div>

              {/* Asal Sekolah */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-amber-500" />
                  <span>Asal Sekolah</span>
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SDN Sukadamai 2"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Info Badge */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  Semua materi dan permainan bisa diakses bebas gratis. Nilai, poin bintang, dan toko reward akan tersimpan otomatis dan saling terhubung!
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Masuk ke Ruang Belajar 🚀</span>
              </button>

              {/* Superadmin Login Alternative Link */}
              {onOpenSuperadmin && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSuperadmin();
                    }}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Pengelola Web? <b>Login Super Admin</b></span>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
