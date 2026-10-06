import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trophy,
  ArrowRight,
  Shield,
  Award,
  HelpCircle,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints, recordGameScore } from '../../services/storageService';
import { soundEffects } from '../../utils/soundEffects';

interface NewsCase {
  id: string;
  sourceType: 'WhatsApp Berantai' | 'Postingan Medsos' | 'Portal Berita Abal-abal' | 'Situs Resmi Sekolah / Kemdikbud';
  sourceName: string;
  headline: string;
  body: string;
  imageIcon: string;
  isHoax: boolean;
  clues: string[];
  explanation: string;
}

const NEWS_CASES: NewsCase[] = [
  {
    id: 'case-1',
    sourceType: 'WhatsApp Berantai',
    sourceName: 'Grup WA Warga Komplek',
    headline: 'SEBARKAN!! Menatap Layar HP Lebih dari 10 Menit Menyebabkan Otak Meleleh!',
    body: 'Pesan dari Prof. Dr. X: Radiasi sinyal 5G membuat gelombang otak mendidih seketika. Jangan tunggu terlambat, sebarkan ke 20 grup agar keluarga selamat!',
    imageIcon: '😱',
    isHoax: true,
    clues: [
      'Gaya bahasa heboh (bombastis) & huruf kapital berlebihan "SEBARKAN!!".',
      'Nama narasumber fiktif/tidak jelas ("Prof. Dr. X").',
      'Ada paksaan menyebarkan berantai ke 20 grup.',
    ],
    explanation:
      'Pasti HOAX! Menatap layar terlalu lama hanya membuat mata lelah (asthenopia), bukan melelehkan otak. Berita ilmiah yang benar tidak pernah memaksa disebarkan berantai.',
  },
  {
    id: 'case-2',
    sourceType: 'Situs Resmi Sekolah / Kemdikbud',
    sourceName: 'kemdikbud.go.id & Portal Sekolah',
    headline: 'Jadwal Libur Semester Ganjil & Awal Masuk Sekolah Tahun Ajaran 2026/2027',
    body: 'Kementerian Pendidikan dan Kebudayaan resmi merilis kalender pendidikan. Libur semester ganjil dimulai tanggal 22 Desember hingga 5 Januari.',
    imageIcon: '🏛️',
    isHoax: false,
    clues: [
      'Domain resmi pemerintah berakhiran .go.id.',
      'Bahasa baku, teratur, tanpa huruf kapital berlebihan.',
      'Memiliki nomor surat keputusan dinas resmi.',
    ],
    explanation:
      'FAKTA RESMI! Berasal dari situs resmi instansi pemerintah (.go.id) dan informasinya jelas serta objektif.',
  },
  {
    id: 'case-3',
    sourceType: 'Postingan Medsos',
    sourceName: 'Akun TikTok @bagi_bagi_laptop_gratis99',
    headline: 'Ketik "MAU" dan Kirim ke 10 Teman untuk Dapatkan Laptop Gaming ROG Gratis!',
    body: 'Dalam rangka ulang tahun pemilik toko, kami membagikan 500 unit laptop gratis! Cukup ketik "SAYA MAU" dan bayar ongkos kirim Rp 50.000 ke rekening pribadi.',
    imageIcon: '💻',
    isHoax: true,
    clues: [
      'Janji hadiah terlalu muluk (too good to be true).',
      'Meminta transfer ongkos kirim ke rekening pribadi perorangan.',
      'Akun tidak terverifikasi (centang biru) dan baru dibuat kemarin.',
    ],
    explanation:
      'HOAX & PENIPUAN! Modus klasik undian palsu yang meminta uang tebusan/ongkir sebelum kabur.',
  },
  {
    id: 'case-4',
    sourceType: 'Portal Berita Abal-abal',
    sourceName: 'www.berita-panas-viral-heboh.xyz',
    headline: 'Gawat! Minum Air Es Saat Menggunakan Komputer Bisa Bikin Lambung Membeku!',
    body: 'Menurut postingan anonim di internet, suhu dingin air es bercampur radiasi kipas prosesor komputer bisa membekukan makanan di perut seketika.',
    imageIcon: '🧊',
    isHoax: true,
    clues: [
      'Domain mencurigakan (.xyz, bukan .com atau .id resmi).',
      'Isi berita bertentangan dengan sains biologi (suhu tubuh manusia otomatis menghangatkan minuman).',
      'Banyak iklan pop-up berbahaya di situsnya.',
    ],
    explanation:
      'HOAX SAINS! Tubuh manusia memiliki sistem termoregulasi yang menyesuaikan suhu air minum dengan suhu tubuh secara alami.',
  },
  {
    id: 'case-5',
    sourceType: 'Situs Resmi Sekolah / Kemdikbud',
    sourceName: 'Badan Siber dan Sandi Negara (BSSN)',
    headline: 'Imbauan Keamanan: Gunakan Password Minimal 8 Karakter Kombinasi Huruf & Simbol',
    body: 'BSSN mengingatkan masyarakat untuk tidak menggunakan tanggal lahir atau kata sandi mudah ditebak seperti "123456" demi mencegah pembobolan akun.',
    imageIcon: '🛡️',
    isHoax: false,
    clues: [
      'Diterbitkan lembaga resmi penegak keamanan siber negara.',
      'Saran berbasis fakta ilmiah dan best-practice teknologi informasi.',
      'Tidak ada unsur meminta transfer uang atau menyebarkan pesan ancaman.',
    ],
    explanation:
      'FAKTA! Pedoman password kuat adalah standar keamanan siber internasional untuk melindungi akun digital.',
  },
];

export const DetectiveHoaxGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => soundEffects.isEnabled());

  const currentCase = NEWS_CASES[currentIdx];

  const handleChoose = (verdict: boolean) => {
    if (isChecked) return;
    setSelectedVerdict(verdict);
    setIsChecked(true);

    const isAnswerCorrect = verdict === currentCase.isHoax;
    if (isAnswerCorrect) {
      soundEffects.playQuizCorrect();
      setScore((prev) => prev + 40);
    } else {
      soundEffects.playQuizIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIdx < NEWS_CASES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedVerdict(null);
      setIsChecked(false);
    } else {
      setGameFinished(true);
      soundEffects.playSuccessFanfare();

      if (currentUser) {
        awardStudentPoints(currentUser.id, score, { actionCategory: 'game' });
        recordGameScore('Detektif Hoax & Fakta', currentUser.id, score, score);
        refreshUser();
        showStarReward(Math.max(1, Math.floor(score / 10)), `Hebat! Kamu meraih gelar Detektif Literasi Digital Bintang! (+${score} Poin)`);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedVerdict(null);
    setIsChecked(false);
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded text-blue-100">
                Literasi Digital Cerdas
              </span>
              <span className="text-xs text-white/90">Kasus #{currentIdx + 1} dari {NEWS_CASES.length}</span>
            </div>
            <h2 className="text-2xl font-black">Detektif Hoax & Fact Checker 🕵️‍♂️</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Analisis pesan viral, berita internet, dan broadcast WhatsApp. Putuskan: apakah ini Berita HOAX atau FAKTA?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = soundEffects.toggle();
              setSoundEnabled(next);
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl text-center border border-white/20">
            <span className="text-[10px] text-blue-200 block uppercase font-bold">Skor Detektif</span>
            <span className="text-lg font-black font-mono text-white">+{score} pt</span>
          </div>
        </div>
      </div>

      {!gameFinished ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Evidence Dossier Card */}
          <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  📁 Saluran: {currentCase.sourceType}
                </span>
                <span>•</span>
                <span>Sumber: {currentCase.sourceName}</span>
              </div>
              <span className="text-2xl">{currentCase.imageIcon}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                "{currentCase.headline}"
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {currentCase.body}
              </p>
            </div>
          </div>

          {/* Decision Buttons */}
          {!isChecked ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChoose(true)}
                className="py-4 px-6 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border-2 border-rose-300 dark:border-rose-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🚨</span>
                <span className="text-base font-black text-rose-600 dark:text-rose-400">
                  INI BERITA HOAX!
                </span>
                <span className="text-[11px] text-slate-500">Palsu, bohong, atau menyesatkan</span>
              </button>

              <button
                type="button"
                onClick={() => handleChoose(false)}
                className="py-4 px-6 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">✅</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  INI FAKTA RESMI!
                </span>
                <span className="text-[11px] text-slate-500">Benar, valid, dan dapat dipercaya</span>
              </button>
            </div>
          ) : (
            /* Results Dossier & Clues */
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                  selectedVerdict === currentCase.isHoax
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {selectedVerdict === currentCase.isHoax ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {selectedVerdict === currentCase.isHoax ? 'Analisis Tepat! Anda Benar!' : 'Kurang Tepat, Detektif!'}
                  </h4>
                  <p className="mt-1">{currentCase.explanation}</p>
                </div>
              </div>

              {/* Clues Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  🔍 Bukti & Ciri-ciri Investigasi:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  {currentCase.clues.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{currentIdx < NEWS_CASES.length - 1 ? 'Kasus Selanjutnya →' : 'Lihat Hasil Akhir Investigasi 🏆'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Summary Screen */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6 max-w-lg mx-auto shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🕵️‍♂️
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Investigasi Selesai!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kamu kini menjadi pengguna internet yang cerdas, kritis, dan tidak mudah tertipu berita palsu!
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Total Poin</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                +{score} pt
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Tingkat Ketajaman</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                ⭐ Master Verifikasi
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Kasus</span>
          </button>
        </div>
      )}
    </div>
  );
};
