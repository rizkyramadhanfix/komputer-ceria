import React, { useState, useEffect } from 'react';
import {
  Cable,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recordGameScore } from '../../services/storageService';

interface PortItem {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  category: 'Video' | 'Data / Universal' | 'Jaringan' | 'Audio';
  icon: string;
  color: string;
  pins: string;
  usage: string;
  hints: string[];
}

const PORTS: PortItem[] = [
  {
    id: 'usb-a',
    name: 'USB Type-A',
    shortLabel: 'USB-A',
    description: 'Port USB klasik berbentuk persegi panjang datar dengan bilah plastik di dalamnya.',
    category: 'Data / Universal',
    icon: '🔌',
    color: 'from-blue-600 to-indigo-600',
    pins: '4 Pin (USB 2.0) / 9 Pin (USB 3.0 Biru)',
    usage: 'Keyboard, Mouse, Flashdisk, Printer, Dongle Wireless.',
    hints: ['Bentuknya persegi panjang', 'Paling sering dipakai untuk mouse & keyboard', 'Hanya bisa dicolok satu arah'],
  },
  {
    id: 'usb-c',
    name: 'USB Type-C',
    shortLabel: 'USB-C',
    description: 'Konektor modern berbentuk oval lonjong kecil yang bisa dicolok bolak-balik tanpa terbalik.',
    category: 'Data / Universal',
    icon: '⚡',
    color: 'from-purple-600 to-pink-600',
    pins: '24 Pin simetris kecepatan tinggi',
    usage: 'Charger Laptop, Smartphone Android, SSD Eksternal, Monitor modern.',
    hints: ['Bentuknya oval lonjong simetris', 'Bisa dicolok bolak-balik', 'Digunakan di HP Android dan laptop masa kini'],
  },
  {
    id: 'hdmi',
    name: 'HDMI (High-Definition Multimedia)',
    shortLabel: 'HDMI',
    description: 'Kabel transmisi digital audio dan video berkualitas tinggi dalam satu kabel.',
    category: 'Video',
    icon: '📺',
    color: 'from-amber-600 to-red-600',
    pins: '19 Pin dengan dua sudut bawah miring',
    usage: 'Menghubungkan PC/Laptop ke Monitor LED, TV Digital, atau Proyektor.',
    hints: ['Membawa gambar sekaligus suara digital', 'Bentuknya trapesium dengan dua sudut miring', 'Standar utama layar monitor saat ini'],
  },
  {
    id: 'vga',
    name: 'VGA (Video Graphics Array)',
    shortLabel: 'VGA',
    description: 'Port video analog legendaris berwarna biru dengan 15 lubang jarum dan 2 baut pengunci.',
    category: 'Video',
    icon: '🖥️',
    color: 'from-sky-500 to-blue-700',
    pins: '15 Lubang Pin (3 baris x 5 pin)',
    usage: 'Monitor tabung/LCD lama, Proyektor sekolah klasik.',
    hints: ['Khas dengan warna soket BIRU', 'Memiliki 15 lubang pin kecil', 'Hanya mengirim sinyal video (tanpa audio)'],
  },
  {
    id: 'rj45',
    name: 'LAN / Ethernet (RJ-45)',
    shortLabel: 'RJ-45 LAN',
    description: 'Port jaringan kabel internet berkecepatan tinggi dengan klip pengait plastik berbunyi klik.',
    category: 'Jaringan',
    icon: '🌐',
    color: 'from-emerald-600 to-teal-700',
    pins: '8 Pin tembaga berjejer',
    usage: 'Menghubungkan komputer ke Router Wi-Fi / Switch lab internet sekolah.',
    hints: ['Ada klip pengait plastik', 'Dipakai di lab komputer untuk kabel internet', 'Bentuknya mirip colokan telepon tapi lebih lebar'],
  },
  {
    id: 'audio-jack',
    name: 'Audio Jack 3.5mm',
    shortLabel: 'Audio 3.5mm',
    description: 'Port lubang silinder bulat kecil (biasanya berwarna hijau untuk output suara).',
    category: 'Audio',
    icon: '🎧',
    color: 'from-lime-600 to-green-700',
    pins: 'Konektor stereo TRS / TRRS bulat',
    usage: 'Headphone, Headset dengan mic, Speaker aktif eksternal.',
    hints: ['Bentuknya lubang bulat kecil', 'Khas warna hijau pada PC desktop', 'Untuk mendengarkan suara headphone'],
  },
  {
    id: 'displayport',
    name: 'DisplayPort (DP)',
    shortLabel: 'DisplayPort',
    description: 'Konektor video digital performa tinggi dengan SATU sudut miring dan tombol pelepas kait.',
    category: 'Video',
    icon: '🎮',
    color: 'from-indigo-600 to-violet-800',
    pins: '20 Pin dengan 1 sisi siku dan 1 sisi miring',
    usage: 'Monitor gaming refresh rate tinggi (144Hz+), kartu grafis PC desktop.',
    hints: ['Mirip HDMI tapi HANYA SATU sudut yang miring', 'Biasanya punya tombol pengunci kecil', 'Favorit para gamer & pro editor'],
  },
];

interface QuestionChallenge {
  cablePrompt: string;
  cableDevice: string;
  cableScenario: string;
  correctPortId: string;
  visualCableTip: string;
}

const CHALLENGES: QuestionChallenge[] = [
  {
    cablePrompt: 'Kabel Flashdisk USB Berisi File Tugas Word',
    cableDevice: 'Flashdisk Sandisk 32GB',
    cableScenario: 'Budi ingin mengcopy materi tugas dari flashdisk ke komputer lab sekolah.',
    correctPortId: 'usb-a',
    visualCableTip: 'Kepala pipih logam persegi panjang dengan bilah plastik biru/hitam.',
  },
  {
    cablePrompt: 'Kabel Monitor Digital Definisi Tinggi (Audio + Video)',
    cableDevice: 'Monitor LED Samsung Full HD',
    cableScenario: 'Bu Guru ingin menyambungkan laptop ke proyektor HDMI di ruang kelas agar suara video terdengar jelas.',
    correctPortId: 'hdmi',
    visualCableTip: 'Konektor trapesium pipih dengan 2 sudut bawah menyudut miring.',
  },
  {
    cablePrompt: 'Kabel Jaringan Internet UTP / LAN',
    cableDevice: 'Kabel Internet Kuning dari Router Sekolah',
    cableScenario: 'Komputer nomor 5 tidak bisa Wi-Fi, jadi pembina menyuruh memasang kabel internet langsung ke soket belakang PC.',
    correctPortId: 'rj45',
    visualCableTip: 'Ujung transparan berkepala kotak plastik dengan klip pengait fleksibel.',
  },
  {
    cablePrompt: 'Kabel Monitor Analog Klasik Warna Biru',
    cableDevice: 'Proyektor Ruang Guru Model Lama',
    cableScenario: 'Sekolah menggunakan proyektor lama yang memiliki kabel kepala biru dengan baut pemutar di kanan-kirinya.',
    correctPortId: 'vga',
    visualCableTip: 'Konektor plastik biru tebal dengan 15 jarum pin emas.',
  },
  {
    cablePrompt: 'Kabel Headphone / Earphone Musik',
    cableDevice: 'Headset Gaming Murid',
    cableScenario: 'Siswa ingin mendengarkan audio latihan listening bahasa inggris tanpa mengganggu teman sebelahnya.',
    correctPortId: 'audio-jack',
    visualCableTip: 'Batang logam silinder bundar kecil dengan gelang isolator hitam.',
  },
  {
    cablePrompt: 'Kabel Charger & Data HP Android Modern Bolak-Balik',
    cableDevice: 'Smartphone Android Type-C',
    cableScenario: 'Siswa ingin menghubungkan HP modern ke laptop untuk memindahkan foto tugas dokumentasi tanpa takut kabel terbalik.',
    correctPortId: 'usb-c',
    visualCableTip: 'Kepala konektor oval lonjong simetris yang sangat ramping.',
  },
  {
    cablePrompt: 'Kabel Monitor Gaming Refresh Rate 165Hz',
    cableDevice: 'Monitor Gaming Esports di Lab Multimedia',
    cableScenario: 'Siswa jurusan multimedia menghubungkan monitor gaming beresolusi tinggi yang membutuhkan port dengan satu sudut miring dan tombol kait pelepas.',
    correctPortId: 'displayport',
    visualCableTip: 'Konektor persegi panjang dengan satu sudut miring menyerong dan tombol pengunci.',
  },
  {
    cablePrompt: 'Kabel Mouse Kabel Sekolah',
    cableDevice: 'Mouse USB Optik',
    cableScenario: 'Kursor mouse tidak bergerak karena kabel mouse tercabut dari belakang casing PC.',
    correctPortId: 'usb-a',
    visualCableTip: 'Colokan kotak standar universal tipe A.',
  },
];

export const PortMasterGame: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [inspectionModalPort, setInspectionModalPort] = useState<PortItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentChallenge = CHALLENGES[currentIdx % CHALLENGES.length];

  const handleSelectPort = (portId: string) => {
    if (selectedPortId !== null || isGameOver) return;

    setSelectedPortId(portId);
    const isCorrect = portId === currentChallenge.correctPortId;
    const correctPort = PORTS.find((p) => p.id === currentChallenge.correctPortId);

    if (isCorrect) {
      const addedScore = 15 + streak * 5;
      setScore((prev) => prev + addedScore);
      setStreak((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `Tepat Sekali! Colokan berhasil terpasang sempurna ke port ${correctPort?.name}! (+${addedScore} Poin)`,
      });
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Kurang Pas! Kabel ini seharusnya dipasang ke port ${correctPort?.name} (${correctPort?.shortLabel}).`,
      });
    }
  };

  const handleNextChallenge = () => {
    if (currentIdx + 1 >= CHALLENGES.length) {
      setIsGameOver(true);
      if (currentUser?.id) {
        recordGameScore('Master Colokan & Port Komputer', currentUser.id, score + (feedback?.isCorrect ? 15 : 0));
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedPortId(null);
      setFeedback(null);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setSelectedPortId(null);
    setFeedback(null);
    setIsGameOver(false);
    setShowHint(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Cable className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Master Colokan & Port Komputer</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                Hardware Lab
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Cocokkan kabel perangkat ke port yang tepat pada casing komputer sebelum salah colok!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">Skor Kamu</span>
            <span className="text-lg font-black font-mono text-amber-300">{score} Poin</span>
          </div>
          {streak > 1 && (
            <div className="bg-amber-500/20 px-3 py-2 rounded-xl border border-amber-400/40 text-center animate-bounce">
              <span className="text-[10px] text-amber-200 block font-bold">Streak 🔥</span>
              <span className="text-sm font-black text-amber-300">{streak}x</span>
            </div>
          )}
        </div>
      </div>

      {isGameOver ? (
        /* Game Over Victory Summary */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-linear-to-tr from-amber-400 to-amber-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Luar Biasa, Teknisi Cilik!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Kamu berhasil menyelesaikan seluruh tantangan pemasangan colokan komputer dengan total skor{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-base">{score} Poin</span>!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tantangan</span>
              <p className="text-base font-black text-slate-800 dark:text-slate-100">{CHALLENGES.length}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Akurasi</span>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {Math.round((score / (CHALLENGES.length * 20)) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gelar Lab</span>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">Master Colokan</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bonus Poin</span>
              <p className="text-base font-black text-amber-500 font-mono">+{score}</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Ulang</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Cable Card to Plug */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Kabel #{currentIdx + 1} dari {CHALLENGES.length}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Tutup Petunjuk' : 'Butuh Petunjuk?'}</span>
                </button>
              </div>

              {/* Cable Icon & Prompt */}
              <div className="mt-4 p-5 bg-linear-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
                    🔌
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Perangkat Yang Mau Dicolok:
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      {currentChallenge.cablePrompt}
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 leading-relaxed">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Kasus Praktik:</span>
                  "{currentChallenge.cableScenario}"
                </div>

                <div className="flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                  <Cable className="w-3.5 h-3.5 shrink-0" />
                  <span>Ciri Fisik Ujung Kabel: {currentChallenge.visualCableTip}</span>
                </div>
              </div>

              {showHint && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-800 dark:text-amber-200 animate-in fade-in">
                  💡 <strong>Bocoran Cepat:</strong>{' '}
                  {PORTS.find((p) => p.id === currentChallenge.correctPortId)?.hints[0]}
                </div>
              )}
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-xl border text-xs font-semibold space-y-3 animate-in fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-snug">{feedback.text}</p>
                </div>

                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <span>Lanjut ke Kabel Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Computer Backplate / Sockets Panel */}
          <div className="lg:col-span-7 bg-slate-900 border-4 border-slate-700 rounded-2xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/80 text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                  Panel Belakang CPU (I/O Shield)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Klik soket port yang cocok!</span>
            </div>

            {/* Ports Grid on Backplate */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PORTS.map((port) => {
                const isSelected = selectedPortId === port.id;
                const isCorrect = selectedPortId !== null && port.id === currentChallenge.correctPortId;
                const isWrongSelection = selectedPortId === port.id && !isCorrect;

                let stateClasses =
                  'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-200 hover:border-indigo-400';
                if (selectedPortId !== null) {
                  if (isCorrect) {
                    stateClasses =
                      'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400';
                  } else if (isWrongSelection) {
                    stateClasses =
                      'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
                  } else {
                    stateClasses = 'opacity-40 border-slate-800 bg-slate-900';
                  }
                }

                return (
                  <button
                    key={port.id}
                    type="button"
                    disabled={selectedPortId !== null}
                    onClick={() => handleSelectPort(port.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between text-left group cursor-pointer relative overflow-hidden ${stateClasses}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl filter drop-shadow-sm">{port.icon}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectionModalPort(port);
                        }}
                        title="Info Detail Port"
                        className="text-slate-400 hover:text-white p-1 rounded-md"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block text-indigo-400">
                        {port.category}
                      </span>
                      <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                        {port.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {port.usage}
                      </p>
                    </div>

                    {/* Interactive Socket Indicator */}
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>Soket: {port.shortLabel}</span>
                      <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-amber-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 italic">
                Tips: Tekan ikon ℹ️ pada setiap port untuk melihat jumlah pin dan cara pasang yang benar.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Port Detail Inspection */}
      {inspectionModalPort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{inspectionModalPort.icon}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {inspectionModalPort.name}
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Kategori: {inspectionModalPort.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectionModalPort(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Deskripsi & Bentuk Fisik:</span>
                <p className="mt-0.5 leading-relaxed">{inspectionModalPort.description}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-500 text-[10px] uppercase block">Konfigurasi Pin / Konektor:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{inspectionModalPort.pins}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] uppercase block">Contoh Penggunaan:</span>
                  <span>{inspectionModalPort.usage}</span>
                </div>
              </div>

              <div>
                <span className="font-bold block text-slate-900 dark:text-white mb-1">Ciri Khas & Tips Mengingat:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                  {inspectionModalPort.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectionModalPort(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Tutup Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
