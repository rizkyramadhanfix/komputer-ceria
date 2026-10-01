import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  School,
  Shield,
  ShieldAlert,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Captcha } from '../common/Captcha';
import { getPembinaUsers, getRegisteredSchools } from '../../services/storageService';

// ==========================================
// 1. DEDICATED PEMBINA LOGIN MODAL
// ==========================================
export interface PembinaLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToStudent?: () => void;
  onSwitchToSuperadmin?: () => void;
}

export const PembinaLoginModal: React.FC<PembinaLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToStudent,
  onSwitchToSuperadmin,
}) => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const registeredPembinas = useMemo(() => {
    return isOpen ? getPembinaUsers() : [];
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setIsCaptchaValid(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCaptchaValid) {
      setErrorMsg('Harap selesaikan verifikasi Captcha dengan benar.');
      return;
    }

    const res = await login(username, password, 'pembina');
    if (!res.success) {
      setErrorMsg(res.message || 'Login Pembina gagal. Periksa kembali username dan password.');
      showError(res.message || 'Login Pembina gagal.');
      return;
    }

    const activeUser = localStorage.getItem('ekskul_active_user');
    if (activeUser) {
      const parsed = JSON.parse(activeUser);
      showSuccess(
        `Selamat datang ${parsed.name}! Berhasil masuk sebagai Pembina Sekolah (${parsed.assignedSchool || parsed.school || ''}).`,
        'Login Pembina Berhasil'
      );
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-purple-100 dark:border-purple-900/40 bg-purple-50/80 dark:bg-purple-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">
                Portal Pembina Sekolah Binaan
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Login Pembina Sekolah
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-xs text-purple-950 dark:text-purple-200 space-y-1">
            <p className="font-semibold">🏫 Masuk Akses Pembina Sekolah Binaan</p>
            <p className="text-[11px] opacity-80">
              Kelola data siswa, nilai kuis, tugas mengetik, dan cetak sertifikat untuk sekolah binaan Anda.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username Pembina Sekolah
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username akun pembina Anda"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi / Password Pembina
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi pembina"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Captcha onValidate={setIsCaptchaValid} idPrefix="pembina-login-captcha" />
            </div>

            <button
              type="submit"
              disabled={!isCaptchaValid}
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              Masuk Sebagai Pembina Sekolah
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-center text-xs text-slate-500">
            {onSwitchToStudent && (
              <p>
                Bukan Pembina Sekolah?{' '}
                <button
                  type="button"
                  onClick={onSwitchToStudent}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Login sebagai Siswa
                </button>
              </p>
            )}
            {onSwitchToSuperadmin && (
              <p>
                Atau login sebagai{' '}
                <button
                  type="button"
                  onClick={onSwitchToSuperadmin}
                  className="font-bold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
                >
                  Super Administrator Pusat
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DEDICATED SUPERADMIN LOGIN MODAL
// ==========================================
export interface SuperadminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToStudent?: () => void;
  onSwitchToPembina?: () => void;
}

export const SuperadminLoginModal: React.FC<SuperadminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToStudent,
  onSwitchToPembina,
}) => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [username, setUsername] = useState('Administrator');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername('Administrator');
      setPassword('');
      setShowPassword(false);
      setIsCaptchaValid(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCaptchaValid) {
      setErrorMsg('Harap selesaikan verifikasi Captcha dengan benar.');
      return;
    }

    const res = await login(username, password, 'superadmin');
    if (!res.success) {
      setErrorMsg(res.message || 'Login Superadmin gagal. Periksa username dan password.');
      showError(res.message || 'Login Superadmin gagal.');
      return;
    }

    showSuccess('Berhasil masuk sebagai Super Administrator Pusat.', 'Login Superadmin Berhasil');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/80 dark:bg-indigo-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                Pengelola Website
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Login Super Admin
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200">
            <p className="font-semibold">👑 Akses Pengelola Website</p>
            <p className="text-[11px] opacity-80 mt-0.5">
              Login khusus super admin untuk mengatur website, menambah modul materi, bank kuis, soal mengetik, dan konfigurasi tampilan.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username Superadmin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: Administrator"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi / Password Superadmin
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi admin"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Captcha onValidate={setIsCaptchaValid} idPrefix="superadmin-login-captcha" />
            </div>

            <button
              type="submit"
              disabled={!isCaptchaValid}
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Masuk Sebagai Superadmin
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-center text-xs text-slate-500">
            {onSwitchToStudent && (
              <p>
                Siswa yang ingin belajar?{' '}
                <button
                  type="button"
                  onClick={onSwitchToStudent}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Mulai Belajar Sekarang (Gratis) 🚀
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. COMBINED STAFF MODAL FOR BACKWARD COMPATIBILITY
// ==========================================
export interface AdminLoginModalProps {
  isOpen: boolean;
  initialTab?: 'superadmin' | 'pembina';
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToStudent?: () => void;
  onSwitchToPembina?: () => void;
  onSwitchToSuperadmin?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = (props) => {
  if (props.initialTab === 'pembina') {
    return (
      <PembinaLoginModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSuccess={props.onSuccess}
        onSwitchToStudent={props.onSwitchToStudent}
        onSwitchToSuperadmin={props.onSwitchToSuperadmin}
      />
    );
  }
  return (
    <SuperadminLoginModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
      onSwitchToStudent={props.onSwitchToStudent}
      onSwitchToPembina={props.onSwitchToPembina}
    />
  );
};

// ==========================================
// 4. DEDICATED STUDENT AUTH MODAL (LOGIN & REGISTER)
// ==========================================
export interface StudentAuthModalProps {
  isOpen: boolean;
  initialMode?: 'student-login' | 'student-register';
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToAdmin?: () => void;
  onSwitchToPembina?: () => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  initialMode = 'student-login',
  onClose,
  onSuccess,
  onSwitchToAdmin,
  onSwitchToPembina,
}) => {
  const [subMode, setSubMode] = useState<'login' | 'register'>('login');
  const { login, registerStudent } = useAuth();
  const { showSuccess, showError } = useToast();

  // Student Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student Register state
  const [regName, setRegName] = useState('');
  const [regNisn, setRegNisn] = useState('');
  const [regGrade, setRegGrade] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Captcha & feedback
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Get registered schools from Pembina management
  const [schoolsList, setSchoolsList] = useState<string[]>(() => getRegisteredSchools());

  useEffect(() => {
    const updateSchools = () => {
      const updated = getRegisteredSchools();
      setSchoolsList(updated);
    };
    updateSchools();
    window.addEventListener('ekskul_data_updated', updateSchools);
    return () => window.removeEventListener('ekskul_data_updated', updateSchools);
  }, [isOpen]);

  // Sync initial mode
  useEffect(() => {
    if (isOpen) {
      setSubMode(initialMode === 'student-register' ? 'register' : 'login');
      setErrorMsg('');
      setSuccessMsg('');
      setIsCaptchaValid(false);
      setSchoolsList(getRegisteredSchools());
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCaptchaValid) {
      setErrorMsg('Harap selesaikan verifikasi Captcha dengan benar.');
      return;
    }

    const res = await login(identifier, password, 'student');
    if (!res.success) {
      setErrorMsg(res.message || 'Login siswa gagal. Periksa kembali NISN dan password Anda.');
      showError(res.message || 'Login siswa gagal.');
      return;
    }

    showSuccess('Selamat datang kembali di platform pembelajaran!', 'Login Siswa Berhasil');
    onSuccess();
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetSchool = regSchool === 'LAINNYA' ? customSchool.trim() : regSchool.trim();

    if (!regName.trim() || !regNisn.trim() || !regGrade.trim() || !targetSchool) {
      setErrorMsg('Semua kolom pendaftaran termasuk asal sekolah wajib diisi.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (regPassword.length < 5) {
      setErrorMsg('Kata sandi minimal 5 karakter.');
      return;
    }

    if (!isCaptchaValid) {
      setErrorMsg('Harap selesaikan verifikasi Captcha dengan benar.');
      return;
    }

    const res = registerStudent({
      name: regName.trim(),
      nisn: regNisn.trim(),
      grade: regGrade.trim(),
      school: targetSchool,
      password: regPassword,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Pendaftaran siswa gagal.');
      showError(res.message || 'Pendaftaran siswa gagal.');
      return;
    }

    showSuccess(`Selamat datang ${regName}! Akun siswa Anda berhasil dibuat dan aktif.`, 'Pendaftaran Berhasil');
    setSuccessMsg('Pendaftaran berhasil! Akun langsung tersinkronisasi ke sistem.');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                Portal Siswa
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {subMode === 'login' ? 'Login Siswa Pembelajar' : 'Pendaftaran Akun Siswa'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-mode Switcher Tabs */}
        <div className="p-2 bg-slate-100 dark:bg-slate-950 flex gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSubMode('login');
              setErrorMsg('');
              setIsCaptchaValid(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subMode === 'login'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Masuk / Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubMode('register');
              setErrorMsg('');
              setIsCaptchaValid(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subMode === 'register'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>2. Buat Akun Baru</span>
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              ✅ {successMsg}
            </div>
          )}

          {/* MODE: LOGIN SISWA */}
          {subMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NISN atau Nama Siswa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh NISN: 0081234567 atau Nama Lengkap"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div className="pt-1">
                <Captcha onValidate={setIsCaptchaValid} idPrefix="std-login-standalone" />
              </div>

              <button
                type="submit"
                disabled={!isCaptchaValid}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Masuk ke Kelas Komputer
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubMode('register');
                    setErrorMsg('');
                    setIsCaptchaValid(false);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Belum punya akun? Buat Akun Siswa Baru di sini
                </button>
              </div>
            </form>
          )}

          {/* MODE: REGISTER SISWA BARU */}
          {subMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="text-left mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  Registrasi Anggota Baru
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Daftar Akun Siswa Baru
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data otomatis tersinkronisasi dan tampil di panel guru pembina sekolah Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Aisyah Putri"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NISN (Nomor Induk)
                  </label>
                  <input
                    type="text"
                    required
                    value={regNisn}
                    onChange={(e) => setRegNisn(e.target.value)}
                    placeholder="Contoh: 0098765432"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    placeholder="Contoh: Kelas 5A"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              {/* ASAL SEKOLAH SELECTION DROPDOWN */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Asal Sekolah (Sekolah Binaan Terdaftar)
                </label>
                {schoolsList.length > 0 ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10 pointer-events-none" />
                      <select
                        required
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium cursor-pointer"
                      >
                        <option value="">-- Pilih Sekolah Binaan Terdaftar ({schoolsList.length} Sekolah) --</option>
                        {schoolsList.map((sch) => (
                          <option key={sch} value={sch}>
                            🏫 {sch}
                          </option>
                        ))}
                        <option value="LAINNYA">➕ Sekolah Lainnya (Ketik Manual)...</option>
                      </select>
                    </div>

                    {regSchool === 'LAINNYA' && (
                      <div className="relative animate-in fade-in">
                        <input
                          type="text"
                          required
                          value={customSchool}
                          onChange={(e) => setCustomSchool(e.target.value)}
                          placeholder="Ketik nama lengkap sekolah Anda..."
                          className="w-full px-3 py-2 text-sm rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Ketik nama lengkap sekolah Anda..."
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                      />
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                      ℹ️ Belum ada sekolah binaan yang terdaftar di sistem. Anda dapat mengetik nama sekolah langsung di atas.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 5 karakter"
                      className="w-full px-3 pr-8 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Konfirmasi
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full px-3 pr-8 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div className="pt-1">
                <Captcha onValidate={setIsCaptchaValid} idPrefix="std-reg-standalone" />
              </div>

              <button
                type="submit"
                disabled={!isCaptchaValid}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Daftar & Aktifkan Akun Siswa
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSubMode('login');
                    setErrorMsg('');
                    setIsCaptchaValid(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Sudah punya akun? <strong>Kembali ke Login Siswa</strong>
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            {onSwitchToPembina && (
              <button
                type="button"
                onClick={onSwitchToPembina}
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                🏫 Login Pembina Sekolah
              </button>
            )}
            {onSwitchToAdmin && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                👑 Login Superadmin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
