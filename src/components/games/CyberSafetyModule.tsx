import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  HelpCircle,
  Lock,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints } from '../../services/storageService';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

interface SafetyScenario {
  id: number;
  title: string;
  topic: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const SAFETY_SCENARIOS: SafetyScenario[] = [
  {
    id: 1,
    title: 'Skenario 1: Pesan Menang Hadiah Smartphone Misterius',
    topic: 'Waspada Phishing & Penipuan',
    question:
      'Kamu menerima pesan WhatsApp dari nomor tidak dikenal: "Selamat! Kamu menang iPhone 15 gratis, klik link ini dan masukkan password akun Google kamu!" Apa yang harus kamu lakukan?',
    options: [
      {
        text: 'Langsung mengklik link dan mengisi password karena ingin dapat hadiah.',
        isCorrect: false,
        explanation:
          'Salah! Ini adalah jebakan Phishing untuk mencuri password akun dan datamu.',
      },
      {
        text: 'Abaikan link, jangan klik, dan segera laporkan ke orang tua atau guru.',
        isCorrect: true,
        explanation:
          'Tepat sekali! Jangan pernah percaya pesan hadiah misterius dan jangan pernah membagikan password ke siapapun.',
      },
      {
        text: 'Membagikan pesan tersebut ke semua grup kelas.',
        isCorrect: false,
        explanation:
          'Salah! Menyebarkan link berbahaya dapat membahayakan akun teman-teman sekelasmu.',
      },
    ],
  },
  {
    id: 2,
    title: 'Skenario 2: Pembuatan Kata Sandi / Password yang Kuat',
    topic: 'Keamanan Akun',
    question:
      'Manakah di antara pilihan berikut yang merupakan contoh kata sandi (password) paling kuat dan aman untuk akun komputermu?',
    options: [
      {
        text: '123456 atau namaku123',
        isCorrect: false,
        explanation:
          'Password ini terlalu mudah ditebak dan rentan diretas dalam hitungan detik.',
      },
      {
        text: 'SiswaCeria#2026! (Kombinasi huruf besar, kecil, angka, dan simbol)',
        isCorrect: true,
        explanation:
          'Sangat kuat! Password yang baik terdiri dari minimal 8-12 karakter kombinasi huruf, angka, dan simbol khusus.',
      },
      {
        text: 'Tanggal lahir saya sendiri',
        isCorrect: false,
        explanation:
          'Tanggal lahir sangat mudah diketahui oleh orang lain dan tidak aman.',
      },
    ],
  },
  {
    id: 3,
    title: 'Skenario 3: Menjaga Privasi & Informasi Pribadi',
    topic: 'Privasi Digital',
    question:
      'Saat bermain game online atau media sosial, informasi manakah yang TIDAK BOLEH kamu bagikan ke publik?',
    options: [
      {
        text: 'Nama karakter favorit dalam kartun',
        isCorrect: false,
        explanation: 'Karakter favorit aman untuk dibagikan.',
      },
      {
        text: 'Alamat rumah lengkap, nomor telepon orang tua, dan foto kartu identitas',
        isCorrect: true,
        explanation:
          'Benar! Data pribadi seperti alamat rumah dan nomor HP harus dirahasiakan agar terhindar dari bahaya kejahatan siber.',
      },
      {
        text: 'Warna baju kesukaan',
        isCorrect: false,
        explanation: 'Warna kesukaan aman dan bukan data rahasia.',
      },
    ],
  },
  {
    id: 4,
    title: 'Skenario 4: Etika Berkomentar (Stop Cyberbullying)',
    topic: 'Etika Berselancar di Internet',
    question:
      'Jika kamu melihat teman di media sosial mengunggah karya gambar tetapi ada orang yang mengejeknya dengan kata-kata kasar di kolom komentar, apa sikap terbaikmu?',
    options: [
      {
        text: 'Ikut mengejek bersama orang tersebut agar terlihat keren.',
        isCorrect: false,
        explanation:
          'Sangat salah! Mengejek orang lain di internet termasuk tindakan perundungan siber (Cyberbullying).',
      },
      {
        text: 'Beri kata-kata penyemangat positif pada temanmu dan laporkan/blokir komentar kasar tersebut.',
        isCorrect: true,
        explanation:
          'Pilihan terpuji! Selalu sebarkan kebaikan dan dukung temanmu dengan bahasa yang santun.',
      },
      {
        text: 'Membalas dengan kata-kata kotor yang lebih parah.',
        isCorrect: false,
        explanation:
          'Membalas dengan amarah hanya akan memperburuk situasi. Lebih baik laporkan akun pelaku.',
      },
    ],
  },
];

export const CyberSafetyModule: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = SAFETY_SCENARIOS[activeScenarioIdx];
  const selectedOptIdx = selectedAnswers[activeScenarioIdx];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [activeScenarioIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [activeScenarioIdx]: true }));

    const isCorrect = scenario.options[optIdx].isCorrect;
    if (isCorrect) {
      showSuccess('Jawaban tepat! Literasi digitalmu sangat hebat!', 'Internet Sehat');
    } else {
      showError('Jawaban kurang tepat. Baca penjelasannya agar lebih waspada!', 'Edukasi Siber');
    }

    // Check if all answered correctly
    const allAnswered = Object.keys(selectedAnswers).length + 1 >= SAFETY_SCENARIOS.length;
    if (allAnswered && isCorrect && !isCompleted) {
      setIsCompleted(true);
      if (currentUser) {
        awardStudentPoints(currentUser.id, 80);
        refreshUser();
        showStarReward(
          8,
          `Selamat! Semua skenario Internet Sehat diselesaikan! Kamu mendapatkan +80 Poin (+8 Bintang)!`,
          'Bintang Duta Siber!'
        );
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setIsCompleted(false);
    setActiveScenarioIdx(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Edukasi Literasi & Keamanan Digital Anak
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              Skenario {activeScenarioIdx + 1} dari {SAFETY_SCENARIOS.length}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Modul Internet Sehat & Polisi Siber Cilik
          </h2>
          <p className="text-xs text-slate-500">
            Pelajari etika berselancar di internet, cara menghindari phishing, dan menjaga data pribadi sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Skenario</span>
          </button>
        </div>
      </div>

      {/* Scenario Progression Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SAFETY_SCENARIOS.map((sc, idx) => {
          const ans = selectedAnswers[idx];
          const isDone = ans !== undefined && sc.options[ans].isCorrect;

          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveScenarioIdx(idx)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeScenarioIdx === idx
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Kasus #{sc.id}
                </span>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-500 truncate">{sc.topic}</p>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              {scenario.topic}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {scenario.title}
            </h3>
          </div>

          <VoiceNarratorButton
            text={`${scenario.title}. ${scenario.question}`}
            size="sm"
            label="Bacakan Soal"
          />
        </div>

        {/* Question Text */}
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {scenario.question}
        </p>

        {/* Options List */}
        <div className="space-y-2.5">
          {scenario.options.map((opt, optIdx) => {
            const isSelected = selectedOptIdx === optIdx;
            const showOptStatus = isSelected;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left transition-all text-xs font-semibold flex items-start gap-3 cursor-pointer ${
                  showOptStatus
                    ? opt.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                    showOptStatus
                      ? opt.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="space-y-1 flex-1">
                  <span>{opt.text}</span>
                  {showOptStatus && (
                    <p
                      className={`text-[11px] font-normal pt-1 border-t ${
                        opt.isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {opt.explanation}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge Award Banner upon full completion */}
      {isCompleted && (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-emerald-950/40 rounded-2xl border-2 border-emerald-400 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Gelar Resmi Digital Terbuka
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                🛡️ Lencana "Polisi Siber Cilik" Berhasil Diraih!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Kamu telah menguasai dasar-dasar keselamatan siber dan perlindungan data pribadi.
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
            +80 Poin Bintang
          </span>
        </div>
      )}
    </div>
  );
};
