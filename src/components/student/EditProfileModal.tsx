import React, { useRef, useState } from 'react';
import { Camera, Check, Eye, EyeOff, Lock, School, Upload, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser } from '../../services/storageService';
import { compressImageFile } from '../../utils/imageCompressor';
import { Avatar } from '../common/Avatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Byte',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Spark',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Pixel',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [grade, setGrade] = useState(currentUser?.grade || '');
  const [school, setSchool] = useState(currentUser?.school || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Berkas harus berupa gambar (PNG, JPG, WEBP).');
      return;
    }

    try {
      setErrorMsg('');
      const compressedBase64 = await compressImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
      });
      setAvatarUrl(compressedBase64);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Gagal memproses file foto gambar.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      showError('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (showPasswordSection && newPassword) {
      if (newPassword.length < 5) {
        setErrorMsg('Kata sandi baru minimal 5 karakter.');
        showError('Kata sandi baru minimal 5 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
        showError('Konfirmasi kata sandi baru tidak cocok.');
        return;
      }
    }

    const updates: Record<string, any> = {
      name: name.trim(),
      grade: grade.trim(),
      school: school.trim(),
      avatarUrl: avatarUrl || undefined,
    };

    if (showPasswordSection && newPassword) {
      updates.password = newPassword;
    }

    updateUser(currentUser.id, updates);
    refreshUser();

    showSuccess('Perubahan data profil dan foto avatar berhasil disimpan!', 'Profil Berhasil Disimpan');
    setSuccessMsg('Profil berhasil diperbarui!');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Edit Profil Akun Siswa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ganti foto profil avatar, nama, kelas, atau kata sandi Anda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300">
              {successMsg}
            </div>
          )}

          {/* Avatar Section */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Foto / Avatar Profil Siswa
            </label>

            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={name} size="xl" />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Unggah Foto dari Perangkat</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Format PNG, JPG, atau WEBP. Maks 2MB.
                </p>
              </div>
            </div>

            {/* Avatar Presets */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Atau pilih avatar karakter siap pakai:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                      avatarUrl === preset
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <img src={preset} alt={`Avatar Preset ${idx + 1}`} className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Siswa
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NISN (Tidak dapat diubah)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.nisn || currentUser.username}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Contoh: 7A, 8B"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asal Sekolah
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SMP Negeri 1 Bogor"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Password Section Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Ganti Kata Sandi / Password
              </span>
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {showPasswordSection ? 'Batalkan Ganti Sandi' : 'Ubah Sandi Baru'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="relative">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 5 karakter"
                    className="w-full pr-10 pl-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-7 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
