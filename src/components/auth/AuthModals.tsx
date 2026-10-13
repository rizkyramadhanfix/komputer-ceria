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
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getPembinaUsers, getRegisteredSchools } from '../../services/storageService';

// ==========================================
// 1. PEMBINA LOGIN (REMOVED)
// ==========================================
export interface PembinaLoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}
export const PembinaLoginModal: React.FC<PembinaLoginModalProps> = () => null;

// ==========================================
// 2. DEDICATED ADMIN LOGIN MODAL
// ==========================================
export interface SuperadminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToStudent?: () => void;
}

export const SuperadminLoginModal: React.FC<SuperadminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToStudent,
}) => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await login(username, password, 'superadmin');
    if (!res.success) {
      setErrorMsg(res.message || 'Login Admin gagal. Periksa username dan password.');
      showError(res.message || 'Login Admin gagal.');
      return;
    }

    showSuccess('Berhasil masuk sebagai Administrator.', 'Login Admin Berhasil');
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
                Portal Admin
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Login Akun Admin
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
            <p className="font-semibold">👑 Akses Pengelola Website & Admin</p>
            <p className="text-[11px] opacity-80 mt-0.5">
              Silakan masukkan username dan kata sandi admin Anda untuk mengelola sistem.
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
                Username Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                  autoComplete="off"
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
                  placeholder="Masukkan kata sandi admin"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  autoComplete="off"
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

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              Masuk Sebagai Admin
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
// 3. COMBINED ADMIN MODAL FOR BACKWARD COMPATIBILITY
// ==========================================
export interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToStudent?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = (props) => {
  return (
    <SuperadminLoginModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
      onSwitchToStudent={props.onSwitchToStudent}
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
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  initialMode = 'student-login',
  onClose,
  onSuccess,
  onSwitchToAdmin,
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

  // Feedback
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
      setSchoolsList(getRegisteredSchools());
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-[0.99]"
              >
                Masuk ke Kelas Komputer
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubMode('register');
                    setErrorMsg('');
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

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.99]"
              >
                Daftar & Aktifkan Akun Siswa
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSubMode('login');
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Sudah punya akun? <strong>Kembali ke Login Siswa</strong>
                </button>
              </div>
            </form>
          )}

          {onSwitchToAdmin && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center text-xs text-slate-500">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                👑 Login Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
