import React, { useEffect, useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  Flame,
  HelpCircle,
  Keyboard,
  LogIn,
  Megaphone,
  PhoneCall,
  School,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
  QrCode,
  Smartphone,
  Laptop,
  Globe,
  Copy,
  Check,
  Wifi,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getDashboardConfig, getLessons, getQuizzes, getTypingPractices, trackVisitor, getUsers, getAnnouncements, getContactInfo } from '../../services/storageService';
import { VisitorStats } from '../../types';
import { Avatar } from '../common/Avatar';
import { LeaderboardWidget } from '../common/LeaderboardWidget';

interface LandingPageProps {
  onOpenAuth: (mode: 'admin' | 'superadmin' | 'pembina' | 'student-login' | 'student-register') => void;
  onNavigate: (view: string) => void;
  onOpenAnnouncementModal?: () => void;
  onOpenContactModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onNavigate,
  onOpenAnnouncementModal,
  onOpenContactModal,
}) => {
  const { currentUser, isStudent, isAdmin, isPembina, isSuperAdmin, assignedSchool } = useAuth();
  const dashboardConfig = getDashboardConfig();

  const pembinaMonitoredCount = useMemo(() => {
    if (!currentUser || currentUser.role !== 'pembina') return 0;
    const targetSchool = (assignedSchool || currentUser.school || '').toLowerCase().trim();
    if (!targetSchool) return 0;
    return getUsers().filter(
      (u) => u.role === 'student' && (u.school || '').toLowerCase().trim() === targetSchool
    ).length;
  }, [currentUser, assignedSchool]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    todayCount: 1,
    totalCount: 1,
    lastDate: new Date().toISOString().split('T')[0],
  });
  const { showSuccess, showError } = useToast();
  const [copied, setCopied] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLiveUrl(window.location.origin);
    }
  }, []);

  const handleCopyLink = () => {
    const url = liveUrl || 'https://ais-pre-56wtolkkvjr66jc3jpdb4m-719827907114.asia-east1.run.app';
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showSuccess('Tautan website berhasil disalin! Bagikan ke siswa atau buka di HP.', 'Link Disalin');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showError('Gagal menyalin link.');
    }
  };

  useEffect(() => {
    const stats = trackVisitor();
    setVisitorStats(stats);
  }, []);

  const lessonsCount = getLessons().length;
  const quizzesCount = getQuizzes().length;
  const typingCount = getTypingPractices().length;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>{dashboardConfig.schoolName}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                {dashboardConfig.heroHeadline}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {dashboardConfig.heroSubheadline}
              </p>

              {/* Action Buttons & Profile Card */}
              <div className="pt-2">
                {currentUser ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Halo, {currentUser.name}!
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            isSuperAdmin
                              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                              : isPembina
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                              : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {isSuperAdmin
                              ? 'Superadmin'
                              : isPembina
                              ? 'Pembina Sekolah'
                              : currentUser.grade || 'Siswa'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {isSuperAdmin
                            ? 'Super Administrator Pusat Ekstrakurikuler Komputer'
                            : isPembina
                            ? `Pembina Sekolah · Memantau ${pembinaMonitoredCount} Siswa Binaan (${assignedSchool || currentUser.school || 'Sekolah Binaan'})`
                            : `${currentUser.school || 'SMP/SD'} · ${currentUser.totalStars} ★ Bintang (${currentUser.totalPoints} Poin)`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
                      className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
                        isPembina
                          ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                      }`}
                    >
                      <span>
                        Buka {isSuperAdmin ? 'Panel Superadmin' : isPembina ? 'Panel Pembina Sekolah' : 'Dashboard Belajar Saya'}
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => onOpenAuth('student-login')}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>🎓 Login Siswa</span>
                    </button>
                    <button
                      onClick={() => onOpenAuth('pembina')}
                      className="px-4 py-2.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <School className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>🏫 Login Pembina</span>
                    </button>
                    <button
                      onClick={() => onOpenAuth('superadmin')}
                      className="px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span>👑 Login Superadmin</span>
                    </button>
                    <button
                      onClick={() => onOpenAuth('student-register')}
                      className="px-3 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                      Daftar Akun Siswa Baru
                    </button>
                  </div>
                )}
              </div>

              {/* Stat Indicators */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {lessonsCount} Modul
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Materi Interaktif
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {quizzesCount} Paket
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Kuis Pilihan Ganda
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {typingCount} Latihan
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Word Rich Editor
                  </div>
                </div>
              </div>

              {/* Public Quick Action Bar: Pemberitahuan & Kontak */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('public-announcements')}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/80 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    <Megaphone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                      Informasi Publik
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      📢 Lihat Pemberitahuan Resmi
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('public-contact')}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800/80 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                      Bantuan & Tanya Jawab
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      📞 Hubungi Kontak Layanan
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset + Visitor Widget */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                <img
                  src={dashboardConfig.heroBannerUrl || '/src/assets/images/hero_computer_club_1790579622878.jpg'}
                  alt="Laboratorium Pembelajaran Ekstrakurikuler Komputer"
                  className="w-full h-auto aspect-16/9 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                      Laboratorium Komputer
                    </span>
                    <p className="text-sm font-bold">
                      Praktikum Interaktif & Pengetikan 10 Jari
                    </p>
                  </div>
                </div>
              </div>

              {/* REQUIRED WIDGET PENGUNJUNG: Statistik Jumlah Pengunjung Hari Ini */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      Jumlah Pengunjung Hari Ini
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                        {visitorStats.todayCount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        orang berkunjung
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right border-l border-slate-100 dark:border-slate-800 pl-4">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Total Kunjungan
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {visitorStats.totalCount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Device Public Access & Mobile Scanner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
          {/* Ambient tech glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Akses Online & Terbuka untuk Publik</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Bisa Diakses di Berbagai Device: Laptop, Komputer Lab, Tablet & HP Berbeda!
              </h2>

              <p className="text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
                Sistem pembelajaran Komputer Ceria telah terhubung ke <strong>Google Cloud Firestore Online</strong>. Guru dan siswa dapat membuka website secara bersamaan dari berbagai laptop, PC sekolah, maupun handphone di rumah tanpa kehilangan progres belajar.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Akses dari HP (Android & iOS)</h4>
                    <p className="text-[11px] text-indigo-200 mt-0.5 leading-snug">
                      Tampilan responsif, ringan, dan mudah dibuka langsung dari browser HP.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Laptop className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Multi-Laptop & Komputer Lab</h4>
                    <p className="text-[11px] text-indigo-200 mt-0.5 leading-snug">
                      Login di laptop mana pun dengan NISN/username, data otomatis tersinkron real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Link Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link Website</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: QR Code Card */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-end justify-center">
              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-white/40 max-w-xs text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Scan QR Code dari HP</span>
                </div>

                <div className="flex justify-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
                      liveUrl || 'https://ais-pre-56wtolkkvjr66jc3jpdb4m-719827907114.asia-east1.run.app'
                    )}`}
                    alt="QR Code Akses Komputer Ceria"
                    className="w-40 h-40 object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>

                <p className="text-[11px] text-slate-600 leading-tight">
                  Arahkan kamera HP ke gambar di atas untuk membuka website seketika di ponsel siswa atau guru!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Feature Highlights & REQUIRED WIDGET LEADERBOARD (TOP 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Learning Features Showcase */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Fitur Pembelajaran Terpadu
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Kuasai Kompetensi Komputer Masa Depan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Setiap materi dan latihan disusun secara terstruktur dengan sistem penghargaan bintang instan.
              </p>
            </div>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Modul Materi Komprehensif
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Mengenal anatomi CPU, RAM, motherboard, sistem operasi, jaringan internet sehat, dan keselamatan kerja di depan komputer.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Latihan Mengetik & Word Editor Lengkap
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Simulator Microsoft Word interaktif dengan toolbar lengkap: Bold, Italic, Underline, Alignment (Rata Kiri, Tengah, Justify), Font family, dan fitur Sisipkan Tabel.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Kuis Pilihan Ganda & Tingkatan Badge
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Evaluasi pemahaman secara mandiri. Raih badge dari Novice, Bronze, Silver, Gold, hingga Diamond Champion untuk membanggakan sekolahmu!
                  </p>
                </div>
              </div>
            </div>
          </div>

            {/* Right Column: REQUIRED WIDGET LEADERBOARD (TOP 10) */}
            <div className="lg:col-span-6 space-y-4">
              <LeaderboardWidget limit={10} />

              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Ingin namamu ada di daftar Top 10 Bintang?</span>
                <button
                  onClick={() => onOpenAuth(currentUser ? 'student-login' : 'student-register')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {currentUser ? 'Buka Dashboard' : 'Daftar Sekarang →'}
                </button>
              </div>
            </div>
          </div>
      </section>

    </div>
  );
};
