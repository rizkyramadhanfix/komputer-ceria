import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  AlertTriangle,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageSquare,
  Lock,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recordGameScore } from '../../services/storageService';

interface CaseItem {
  id: string;
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'Browser Alert';
  senderName: string;
  senderAddress: string;
  subjectOrTitle: string;
  messageBody: string;
  linkText?: string;
  realUrl?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  isPhishing: boolean;
  clues: string[];
  explanation: string;
}

const CASES: CaseItem[] = [
  {
    id: 'case-1',
    channel: 'Email',
    senderName: 'Google Classroom Support',
    senderAddress: 'admin@goog1e-classroom-verify.xyz',
    subjectOrTitle: 'PENTING: Akun Sekolah Anda Akan Dinonaktifkan dalam 15 Menit!',
    messageBody:
      'Halo Siswa, kami mendeteksi aktivitas mencurigakan. Klik tombol di bawah dan masukkan kata sandi Anda sekarang juga untuk mencegah akun dihapus selamanya!',
    linkText: 'Verifikasi Akun Sekarang',
    realUrl: 'http://goog1e-classroom-verify.xyz/login-steal-password.php',
    isPhishing: true,
    clues: [
      'Alamat email mencurigakan: "goog1e" menggunakan angka 1, bukan domain google.com.',
      'Taktik ancaman waktu mendesak (panik) "dalam 15 menit".',
      'Meminta memasukkan kata sandi (Google resmi tidak pernah meminta password lewat email).',
    ],
    explanation:
      'Ini adalah modus Phishing pencurian akun! Penipu sengaja menakut-nakuti korban agar panik dan terburu-buru memasukkan password.',
  },
  {
    id: 'case-2',
    channel: 'WhatsApp',
    senderName: 'Promo Game Gratis Ceria',
    senderAddress: '+62 899-9988-7711',
    subjectOrTitle: 'Klaim 10.000 Diamond Roblox & Free Fire Gratis!',
    messageBody:
      'Selamat! Nomor HP Anda terpilih sebagai pemenang give-away 10.000 diamond gratis. Segera login dengan akun game dan password kamu di link resmi kami untuk mengambil hadiah!',
    linkText: 'https://roblox-gratis-hadiah-2026.online',
    realUrl: 'https://roblox-gratis-hadiah-2026.online/login',
    isPhishing: true,
    clues: [
      'Tawaran yang terlalu muluk / gratis tanpa alasan jelas.',
      'Alamat website bukan roblox.com asli melainkan domain abal-abal ".online".',
      'Meminta login akun game dan password.',
    ],
    explanation:
      'Hati-hati! Tidak ada pembagian diamond resmi yang meminta password akun. Tautan ini dibuat hacker untuk mencuri akun game kamu.',
  },
  {
    id: 'case-3',
    channel: 'Email',
    senderName: 'Pembina Komputer Ceria',
    senderAddress: 'pembina@komputerceria.web.id',
    subjectOrTitle: 'Jadwal Pertemuan Latihan Lab Komputer Minggu Ini',
    messageBody:
      'Halo adik-adik ekstrakurikuler komputer, materi mengetik minggu ini sudah diunggah ke website. Silakan login ke dashboard seperti biasa. Jangan bagikan password Anda kepada siapa pun.',
    isPhishing: false,
    clues: [
      'Alamat email berasal dari domain resmi sekolah / komunitas.',
      'Tidak ada ancaman panik atau link mencurigakan.',
      'Mengingatkan untuk menjaga rahasia password (etika keamanan yang baik).',
    ],
    explanation:
      'Pesan ini AMAN dan Resmi. Pengumuman wajar dari guru pembina tanpa ada jebakan tautan atau permintaan informasi rahasia.',
  },
  {
    id: 'case-4',
    channel: 'Email',
    senderName: 'Tata Usaha Keuangan Sekolah',
    senderAddress: 'bendahara-sekolah99@gmail.com',
    subjectOrTitle: 'Surat Tagihan & Jadwal Ujian Tengah Semester',
    messageBody:
      'Terlampir surat tagihan dan jadwal ujian resmi. Silakan unduh dan klik buka file lampiran di bawah ini pada komputer Anda.',
    hasAttachment: true,
    attachmentName: 'Jadwal_Ujian_2026.pdf.exe',
    isPhishing: true,
    clues: [
      'Menggunakan akun Gmail gratisan, bukan email resmi domain sekolah.',
      'Ekstensi ganda berbahaya: ".pdf.exe". File .exe adalah program aplikasi yang bisa berisi virus/trojan, bukan dokumen PDF biasa!',
    ],
    explanation:
      'Bahaya! File lampiran berekstensi ganda ".pdf.exe" adalah trik penipu untuk menyembunyikan virus berbahaya agar menginfeksi komputer.',
  },
  {
    id: 'case-5',
    channel: 'Browser Alert',
    senderName: 'Peringatan Sistem Gadget',
    senderAddress: 'sistem-scan-virus-darurat.top',
    subjectOrTitle: '⚠️ PERINGATAN: Ponsel Anda Terinfeksi 37 Virus Berbahaya!',
    messageBody:
      'Baterai dan data pribadi Anda sedang rusak oleh virus Trojan! Segera pasang aplikasi pembersih darurat dalam 2 menit atau ponsel Anda akan terkunci total!',
    linkText: 'Pasang Pembersih Virus Sekarang',
    realUrl: 'http://sistem-scan-virus-darurat.top/malware-installer.apk',
    isPhishing: true,
    clues: [
      'Pop-up iklan palsu (scareware) yang tiba-tiba muncul saat browsing web.',
      'Website browser biasa tidak memiliki kemampuan memindai file internal HP/komputer.',
      'Memaksa memasang file instalasi berbahaya (.apk / .exe).',
    ],
    explanation:
      'Ini adalah Scareware (menakut-nakuti). Browser tidak bisa tahu apakah HP ada virus atau tidak. Jangan pernah klik atau download aplikasinya!',
  },
  {
    id: 'case-6',
    channel: 'SMS',
    senderName: 'Pemberitahuan Akun',
    senderAddress: '+62 812-3456-7890',
    subjectOrTitle: 'Kode Verifikasi OTP Rahasia',
    messageBody:
      'Kode OTP login Anda adalah 729104. JANGAN PERNAH MEMBERIKAN KODE INI KEPADA SIAPA PUN, termasuk pihak yang mengaku petugas layanan pelanggan.',
    isPhishing: false,
    clues: [
      'SMS standar pengiriman kode OTP yang kita minta sendiri.',
      'Terdapat peringatan tegas untuk TIDAK membagikan kode ke siapa pun.',
      'Tidak meminta kita mengklik link apa pun.',
    ],
    explanation:
      'Pesan OTP ini normal dan aman selama Anda sendiri yang baru saja meminta kode. Yang paling penting adalah TIDAK membagikan kodenya ke orang lain.',
  },
  {
    id: 'case-7',
    channel: 'WhatsApp',
    senderName: 'Akun Teman Sekelas (Rian)',
    senderAddress: '+62 878-1122-3344',
    subjectOrTitle: 'Bro tolongin dong darurat banget!',
    messageBody:
      'Bro, gue lagi di luar rumah kehabisan pulsa dan ATM gue keblokir. Tolong kirimin pulsa 50 ribu dulu ke nomor 0855xxxx, nanti sore gue ganti waktu di sekolah. Buruan ya bro penting!',
    isPhishing: true,
    clues: [
      'Gaya bahasa mendesak dan meminta transfer uang/pulsa secara tiba-tiba.',
      'Akun WhatsApp teman seringkali dibajak hacker lewat kode OTP atau link phishing.',
      'Harus dikonfirmasi ulang via telepon langsung atau bertemu tatap muka.',
    ],
    explanation:
      'Modus Social Engineering (pembajakan akun teman). Jika teman tiba-tiba meminjam uang/pulsa lewat chat, selalu telepon langsung untuk memastikan keasliannya.',
  },
];

export const AntiPhishingGame: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [inspectedSender, setInspectedSender] = useState(false);
  const [inspectedUrl, setInspectedUrl] = useState(false);
  const [userChoice, setUserChoice] = useState<'phishing' | 'safe' | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentCase = CASES[currentIdx % CASES.length];

  const handleDecision = (decision: 'phishing' | 'safe') => {
    if (userChoice !== null || isGameOver) return;
    setUserChoice(decision);

    const isCorrect = (decision === 'phishing' && currentCase.isPhishing) || (decision === 'safe' && !currentCase.isPhishing);

    if (isCorrect) {
      const bonusInspect = (inspectedSender ? 5 : 0) + (inspectedUrl ? 5 : 0);
      const earned = 20 + streak * 5 + bonusInspect;
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `Analisis Hebat! Keputusanmu 100% tepat! (+${earned} Poin)`,
      });
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: currentCase.isPhishing
          ? 'Waspada! Pesan ini sebenarnya adalah Phishing / Penipuan!'
          : 'Keliru! Pesan ini sebenarnya adalah pesan Asli & Aman.',
      });
    }
  };

  const handleNextCase = () => {
    if (currentIdx + 1 >= CASES.length) {
      setIsGameOver(true);
      if (currentUser?.id) {
        recordGameScore('Detektif Anti-Phishing Siber', currentUser.id, score);
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setUserChoice(null);
      setFeedback(null);
      setInspectedSender(false);
      setInspectedUrl(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setUserChoice(null);
    setFeedback(null);
    setIsGameOver(false);
    setInspectedSender(false);
    setInspectedUrl(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-linear-to-r from-rose-700 via-purple-700 to-indigo-800 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Detektif Anti-Phishing Siber</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-400 text-rose-950 uppercase tracking-wider">
                Keamanan Digital
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              Selidiki email, chat WhatsApp, dan link palsu sebelum terjebak penipuan siber!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-rose-200 block uppercase font-bold tracking-wider">Skor Detektif</span>
            <span className="text-lg font-black font-mono text-amber-300">{score} Poin</span>
          </div>
          {streak > 1 && (
            <div className="bg-rose-500/20 px-3 py-2 rounded-xl border border-rose-400/40 text-center animate-bounce">
              <span className="text-[10px] text-rose-200 block font-bold">Streak 🔥</span>
              <span className="text-sm font-black text-amber-300">{streak}x</span>
            </div>
          )}
        </div>
      </div>

      {isGameOver ? (
        /* Game Over Victory Screen */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-linear-to-tr from-rose-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-500/30">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Lulus Ujian Detektif Siber!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Kamu berhasil mengidentifikasi berbagai macam modus penipuan online dengan perolehan skor{' '}
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{score} Poin</span>!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kasus Diperiksa</span>
              <p className="text-base font-black text-slate-800 dark:text-slate-100">{CASES.length} Kasus</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Ketelitian</span>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">Tinggi</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gelar Keamanan</span>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">Polisi Siber Cilik</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hadiah Poin</span>
              <p className="text-base font-black text-amber-500 font-mono">+{score}</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Ulang Kasus</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Simulated Inbox Window */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                  Kotak Masuk: {currentCase.channel} · Kasus #{currentIdx + 1} dari {CASES.length}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Kanal: {currentCase.channel}
              </span>
            </div>

            {/* Message Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {currentCase.subjectOrTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Dari:</span>
                    <span>{currentCase.senderName}</span>
                    <button
                      type="button"
                      onClick={() => setInspectedSender(!inspectedSender)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <Search className="w-3 h-3" />
                      <span>{inspectedSender ? 'Sembunyikan Email Asli' : '🔍 Periksa Alamat Asli'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {inspectedSender && (
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between border border-slate-700 animate-in fade-in">
                  <div>
                    <span className="text-[10px] text-amber-400 block font-sans font-bold">ALAMAT ASLI PENGIRIM:</span>
                    <span className="text-emerald-300">{currentCase.senderAddress}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">+5 Poin Teliti</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="p-6 space-y-4 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              <p className="whitespace-pre-line text-sm">{currentCase.messageBody}</p>

              {/* Suspicious Link if present */}
              {currentCase.linkText && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 underline">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{currentCase.linkText}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectedUrl(!inspectedUrl)}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{inspectedUrl ? 'Tutup URL Asli' : '🔍 Sorot / Intip Link Asli'}</span>
                    </button>
                  </div>

                  {inspectedUrl && (
                    <div className="p-2.5 rounded-lg bg-slate-950 text-amber-300 font-mono text-[11px] border border-amber-500/40 animate-in fade-in">
                      <span className="text-[9px] text-slate-400 block font-sans">TUJUAN TAUTAN SEBENARNYA:</span>
                      <code className="break-all">{currentCase.realUrl}</code>
                    </div>
                  )}
                </div>
              )}

              {/* Suspicious Attachment if present */}
              {currentCase.hasAttachment && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    📎
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold block">
                      Lampiran File:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentCase.attachmentName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Action Bar */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block text-center">
                Apakah pesan ini adalah Penipuan (Phishing) atau Pesan Asli yang Aman?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  disabled={userChoice !== null}
                  onClick={() => handleDecision('phishing')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-md ${
                    userChoice === 'phishing'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>🛡️ INI PHISHING / PENIPUAN</span>
                </button>

                <button
                  type="button"
                  disabled={userChoice !== null}
                  onClick={() => handleDecision('safe')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-md ${
                    userChoice === 'safe'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>✅ AMAN & RESMI</span>
                </button>
              </div>

              {/* Feedback and Clues Revealed */}
              {feedback && (
                <div
                  className={`p-5 rounded-xl border text-xs space-y-3 animate-in fade-in ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>{feedback.text}</span>
                  </div>

                  <p className="leading-relaxed">{currentCase.explanation}</p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-[11px] block mb-1">Ciri-Ciri Kunci Penyelidikan:</span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] opacity-90">
                      {currentCase.clues.map((clue, idx) => (
                        <li key={idx}>{clue}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextCase}
                      className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:opacity-90"
                    >
                      <span>Lanjut ke Kasus Berikutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
