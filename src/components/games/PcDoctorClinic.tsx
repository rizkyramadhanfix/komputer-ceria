import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trophy,
  Activity,
  Cpu,
  Tv,
  Fan,
  ShieldAlert,
  ArrowRight,
  Stethoscope,
  Volume2,
} from 'lucide-react';
import { getActiveUser, awardStudentPoints } from '../../services/storageService';

interface PatientCase {
  id: string;
  patientName: string;
  pcType: string;
  symptom: string;
  clue: string;
  soundDescription: string;
  requiredTool: string;
  fixActionName: string;
  explanation: string;
  points: number;
}

const CASES: PatientCase[] = [
  {
    id: 'case-1',
    patientName: 'PC Lab 03 (Milik Ibu Guru)',
    pcType: 'Desktop Tower Core i3',
    symptom: 'Layar monitor hitam pekat bertuliskan "NO SIGNAL", padahal lampu power CPU menyala hijau.',
    clue: 'Periksa bagian belakang komputer tempat kabel dari monitor terhubung ke CPU.',
    soundDescription: '🔊 Kipas berputar pelan normal, tidak ada suara beep.',
    requiredTool: 'kabel',
    fixActionName: 'Tancapkan Ulang Kabel HDMI & Kencangkan Baut Port',
    explanation: 'Hebat! Kabel HDMI sebelumnya longgar karena tersenggol saat meja dibersihkan. Setelah ditancapkan rapat, layar monitor kembali menyala tajam!',
    points: 80,
  },
  {
    id: 'case-2',
    patientName: 'PC Siswa 07 (Ruang Multimedia)',
    pcType: 'Komputer Rakitan Belajar',
    symptom: 'Saat tombol power ditekan, layar tidak tampil dan terdengar bunyi BEEP panjang berulang-ulang!',
    clue: 'Bunyi beep berulang biasanya menandakan masalah pada memori sementara (RAM) yang berdebu atau kendor.',
    soundDescription: '🔊 BEEP... BEEP... BEEP... (Bunyi peringatan BIOS)',
    requiredTool: 'penghapus',
    fixActionName: 'Lepas RAM, Bersihkan Pin Emas dengan Penghapus Karet, Pasang Kembali Hingga Berbunyi KLIK',
    explanation: 'Diagnosis sempurna! Kuningan (pin emas) modul RAM teroksidasi debu. Menggosok pin emas dengan penghapus karet membersihkan kotoran dan membuat memori terbaca normal!',
    points: 100,
  },
  {
    id: 'case-3',
    patientName: 'PC Lab 12 (Komputer Perpustakaan)',
    pcType: 'All-In-One Office PC',
    symptom: 'Komputer menyala selama 5 menit, tiba-tiba langsung mati mendadak dan casing belakang terasa sangat panas!',
    clue: 'Komputer mati mendadak saat panas adalah mekanisme proteksi otomatis CPU agar tidak terbakar akibat overheat.',
    soundDescription: '🔊 Kipas CPU mendesing sangat kencang lalu senyap seketika.',
    requiredTool: 'thermal',
    fixActionName: 'Bersihkan Kipas Pendingin Debu & Oleskan Thermal Paste Baru pada Processor',
    explanation: 'Kerja bagus, Dokter! Kipas heatsink sebelumnya tersumbat gumpalan debu tebal dan thermal paste sudah kering. Suhu CPU kini dingin stabil di 38°C!',
    points: 100,
  },
  {
    id: 'case-4',
    patientName: 'Laptop Siswa Budi (Kelas 5A)',
    pcType: 'Laptop Slim Siswa',
    symptom: 'Banyak jendela pop-up iklan aneh bermunculan sendiri dan browser membuka website tidak dikenal.',
    clue: 'Ini adalah ciri komputer terjangkit Adware atau Malware akibat mengklik link sembarangan atau download file palsu.',
    soundDescription: '🔊 Suara ding beruntun dari notifikasi iklan palsu.',
    requiredTool: 'antivirus',
    fixActionName: 'Jalankan Pemindaian Antivirus & Hapus Ekstensi Browser Mencurigakan',
    explanation: 'Tepat sekali! Pemindaian mendalam berhasil mengarantina 4 file malware jahat. Laptop Budi kini bersih dan aman digunakan kembali.',
    points: 90,
  },
];

const TOOLS = [
  { id: 'obeng', name: 'Obeng Plus (+)', icon: Wrench, desc: 'Buka baut casing' },
  { id: 'penghapus', name: 'Penghapus Karet RAM', icon: Sparkles, desc: 'Pembersih pin emas memori' },
  { id: 'kabel', name: 'Kabel Tester & HDMI', icon: Tv, desc: 'Cek koneksi port & kabel' },
  { id: 'thermal', name: 'Suntikan Thermal Paste', icon: Fan, desc: 'Peredam panas processor' },
  { id: 'antivirus', name: 'Flashdisk Rescue Antivirus', icon: ShieldAlert, desc: 'Basmi malware & adware' },
];

export const PcDoctorClinic: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isExamining, setIsExamining] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeCase = CASES[currentIdx];
  const isFinished = completedCases.length === CASES.length;

  const handleApplyTool = () => {
    if (!selectedTool) return;
    setIsExamining(true);
    setFeedback(null);

    setTimeout(() => {
      setIsExamining(false);
      if (selectedTool === activeCase.requiredTool) {
        setFeedback({
          isSuccess: true,
          text: activeCase.explanation,
        });

        if (!completedCases.includes(activeCase.id)) {
          const newCompleted = [...completedCases, activeCase.id];
          setCompletedCases(newCompleted);
          setTotalEarned((prev) => prev + activeCase.points);

          const student = getActiveUser();
          if (student && student.role === 'student') {
            awardStudentPoints(student.id, activeCase.points);
          }

          if (newCompleted.length === CASES.length) {
            setShowCelebration(true);
          }
        }
      } else {
        setFeedback({
          isSuccess: false,
          text: 'Alat perbaikan kurang tepat untuk gejala ini! Perhatikan petunjuk dokter dan coba gunakan alat lain.',
        });
      }
    }, 800);
  };

  const handleNextCase = () => {
    setFeedback(null);
    setSelectedTool(null);
    if (currentIdx < CASES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedTool(null);
    setFeedback(null);
    setCompletedCases([]);
    setTotalEarned(0);
    setShowCelebration(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              Klinik Dokter Komputer
            </span>
            <span className="text-xs text-slate-500">
              Kasus {currentIdx + 1} dari {CASES.length}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Bengkel Reparasi & Troubleshooting PC Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnosa keluhan komputer pasien di lab, pilih peralatan teknisi yang sesuai, dan perbaiki kerusakannya untuk mengumpulkan bintang!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Bintang Terkumpul</span>
            <span className="text-base font-black text-amber-500 font-mono">+{totalEarned} Poin</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Mulai Ulang Klinik"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Navigator Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {CASES.map((c, idx) => {
          const isDone = completedCases.includes(c.id);
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={c.id}
              onClick={() => {
                setCurrentIdx(idx);
                setSelectedTool(null);
                setFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <span>#{idx + 1}</span>}
              <span>{c.patientName.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Clinic Exam Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Monitor & Symptom (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Activity className="w-4 h-4 animate-pulse" />
                DIAGNOSTIC OSCILLOSCOPE
              </span>
              <span className="text-slate-400">{activeCase.pcType}</span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black">
                  Keluhan Pasien:
                </span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {activeCase.symptom}
                </h3>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-amber-300/90 flex items-start gap-2">
                <Volume2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>{activeCase.soundDescription}</span>
              </div>

              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/40 text-xs text-blue-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <strong className="text-blue-300">Petunjuk Pembina: </strong>
                  <span>{activeCase.clue}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Status Pasien: {completedCases.includes(activeCase.id) ? '✅ SELESAI DIPERBAIKI' : '⚠️ MENUNGGU TINDAKAN'}</span>
              <span className="text-emerald-400 font-bold">+{activeCase.points} Poin</span>
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-300 ${
                feedback.isSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {feedback.isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold leading-relaxed">{feedback.text}</p>
                {feedback.isSuccess && currentIdx < CASES.length - 1 && (
                  <button
                    onClick={handleNextCase}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>Tangani Pasien Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Technician Tool Rack (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-500" />
              Rak Peralatan Teknisi Komputer
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pilih satu alat yang paling pas untuk memperbaiki kendala PC di atas:
            </p>

            <div className="space-y-2">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 shadow-sm ring-2 ring-rose-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-none">{tool.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">{tool.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleApplyTool}
              disabled={!selectedTool || isExamining}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isExamining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Teknisi Sedang Memperbaiki...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Gunakan Alat & Perbaiki PC</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Finished Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Gelar: Master Teknisi Komputer Ceria!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Luar biasa! Semua kasus kerusakan PC di lab komputer sekolah telah berhasil kamu perbaiki dengan tepat. Poin bintang telah ditambahkan ke akunmu!
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 font-mono font-bold text-amber-600 dark:text-amber-300 text-sm">
              Total Bonus: +{totalEarned} Poin
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Kembali ke Menu Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
