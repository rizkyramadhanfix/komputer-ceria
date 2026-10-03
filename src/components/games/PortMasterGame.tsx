import React, { useState } from 'react';
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
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recordGameScore } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

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

interface PortLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  points: number;
  challenges: QuestionChallenge[];
}

const PORT_LEVELS: PortLevel[] = [
  {
    id: 1,
    title: 'Level 1: Periferal Dasar & Audio',
    subtitle: 'Colokan Mouse, Flashdisk, & Headphone',
    description: 'Kenali colokan esensial harian seperti USB standar dan Audio Jack.',
    points: 40,
    challenges: [
      {
        cablePrompt: 'Kabel Mouse Kabel Sekolah',
        cableDevice: 'Mouse USB Optik Lab Komputer',
        cableScenario: 'Kursor mouse tidak bergerak karena kabel mouse tercabut dari belakang casing PC.',
        correctPortId: 'usb-a',
        visualCableTip: 'Colokan kotak standar universal tipe A dengan bilah plastik.',
      },
      {
        cablePrompt: 'Kabel Flashdisk Berisi File Dokumen Word',
        cableDevice: 'Flashdisk USB 32GB',
        cableScenario: 'Siswa ingin mengcopy materi tugas naskah dari flashdisk ke komputer lab.',
        correctPortId: 'usb-a',
        visualCableTip: 'Kepala pipih logam persegi panjang dengan strip plastik biru/hitam.',
      },
      {
        cablePrompt: 'Kabel Headphone / Earphone Belajar',
        cableDevice: 'Headset Gaming & Musik Murid',
        cableScenario: 'Siswa ingin mendengarkan audio latihan listening bahasa inggris tanpa mengganggu teman sebelahnya.',
        correctPortId: 'audio-jack',
        visualCableTip: 'Batang logam silinder bundar kecil 3.5mm dengan gelang isolator hitam.',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Monitor & Tampilan Layar Video',
    subtitle: 'HDMI, VGA Biru, & DisplayPort',
    description: 'Pahami perbedaan kabel monitor digital vs analog dan konektor display modern.',
    points: 60,
    challenges: [
      {
        cablePrompt: 'Kabel Monitor Digital Definisi Tinggi (Audio + Video)',
        cableDevice: 'Monitor LED Full HD / Proyektor Kelas',
        cableScenario: 'Bu Guru ingin menyambungkan laptop ke proyektor HDMI di ruang kelas agar gambar jernih dan suara video terdengar jelas.',
        correctPortId: 'hdmi',
        visualCableTip: 'Konektor trapesium pipih dengan 2 sudut bawah menyudut miring simetris.',
      },
      {
        cablePrompt: 'Kabel Monitor Analog Klasik Warna Biru',
        cableDevice: 'Proyektor Ruang Guru Model Lama',
        cableScenario: 'Sekolah menggunakan proyektor lama yang memiliki kabel kepala biru dengan baut pemutar di kanan-kirinya.',
        correctPortId: 'vga',
        visualCableTip: 'Konektor plastik biru tebal dengan 15 jarum pin emas dan 2 baut putar.',
      },
      {
        cablePrompt: 'Kabel Monitor Gaming Refresh Rate 165Hz',
        cableDevice: 'Monitor Gaming Esports di Lab Multimedia',
        cableScenario: 'Siswa jurusan multimedia menghubungkan monitor gaming beresolusi tinggi yang membutuhkan port dengan satu sudut miring dan tombol kait pelepas.',
        correctPortId: 'displayport',
        visualCableTip: 'Konektor persegi panjang dengan SATU sudut miring menyerong dan tombol pengunci.',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Jaringan Internet & USB Modern',
    subtitle: 'Kabel LAN RJ-45 & USB-C Bolak-Balik',
    description: 'Tantangan port jaringan kabel lab dan teknologi konektor modern.',
    points: 80,
    challenges: [
      {
        cablePrompt: 'Kabel Jaringan Internet UTP / LAN',
        cableDevice: 'Kabel Internet Kuning dari Switch/Router Sekolah',
        cableScenario: 'Komputer nomor 5 tidak bisa Wi-Fi, jadi pembina menyuruh memasang kabel internet langsung ke soket belakang PC hingga berbunyi klik.',
        correctPortId: 'rj45',
        visualCableTip: 'Ujung transparan berkepala kotak plastik dengan klip pengait fleksibel.',
      },
      {
        cablePrompt: 'Kabel Charger & Data HP Android Modern Bolak-Balik',
        cableDevice: 'Smartphone Android Type-C & SSD Portabel',
        cableScenario: 'Siswa ingin menghubungkan HP modern ke laptop untuk memindahkan foto dokumentasi tanpa takut kabel terbalik.',
        correctPortId: 'usb-c',
        visualCableTip: 'Kepala konektor oval lonjong simetris yang sangat ramping dan bolak-balik.',
      },
      {
        cablePrompt: 'Kabel Keyboard Mekanikal USB',
        cableDevice: 'Keyboard Gaming RGB',
        cableScenario: 'Memasang papan ketik keyboard baru agar dapat digunakan untuk latihan mengetik cepat 10 jari.',
        correctPortId: 'usb-a',
        visualCableTip: 'Colokan universal USB standar persegi panjang.',
      },
    ],
  },
];

export const PortMasterGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = PORT_LEVELS[currentLevelIdx];

  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [inspectionModalPort, setInspectionModalPort] = useState<PortItem | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const currentChallenge = currentLevel.challenges[currentChallengeIdx];

  const handleSelectPort = (portId: string) => {
    if (selectedPortId !== null || showLevelVictory || showGrandVictory) return;

    setSelectedPortId(portId);
    const isCorrect = portId === currentChallenge.correctPortId;
    const correctPort = PORTS.find((p) => p.id === currentChallenge.correctPortId);

    if (isCorrect) {
      const addedScore = 20 + streak * 5;
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
    if (currentChallengeIdx + 1 >= currentLevel.challenges.length) {
      finishLevel();
    } else {
      setCurrentChallengeIdx((prev) => prev + 1);
      setSelectedPortId(null);
      setFeedback(null);
      setShowHint(false);
    }
  };

  const finishLevel = () => {
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      if (currentUser?.id) {
        const bonus = currentLevel.points;
        recordGameScore('Master Colokan & Port Komputer', currentUser.id, score + bonus, Math.round((score + bonus) / 5));
        refreshUser();
        showStarReward(
          Math.max(1, Math.floor(bonus / 10)),
          `${currentLevel.title} Selesai! Kamu sukses memasang seluruh port (+${bonus} Poin)!`,
          'Bintang Master Colokan!'
        );
      }
    }
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < PORT_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      resetLevelState();
    } else {
      setShowGrandVictory(true);
    }
  };

  const resetLevelState = () => {
    setCurrentChallengeIdx(0);
    setSelectedPortId(null);
    setFeedback(null);
    setShowHint(false);
    setShowLevelVictory(false);
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    setCurrentChallengeIdx(0);
    setSelectedPortId(null);
    setFeedback(null);
    setShowHint(false);
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const handleRestartFromBeginning = () => {
    setCurrentLevelIdx(0);
    setScore(0);
    setStreak(0);
    setCompletedLevels([]);
    resetLevelState();
    setShowGrandVictory(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Cable className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Master Colokan & Port Komputer</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                Level {currentLevel.id} dari {PORT_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              {currentLevel.title} — {currentLevel.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Level Pills */}
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-xs p-1 rounded-2xl border border-white/10">
            {PORT_LEVELS.map((lvl, idx) => {
              const isDone = completedLevels.includes(lvl.id);
              const isCurrent = currentLevelIdx === idx;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevelTab(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-amber-950 font-black shadow-md'
                      : isDone
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                  <span>Lvl {lvl.id}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">Skor</span>
            <span className="text-base font-black font-mono text-amber-300">{score} pt</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cable Card to Plug */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Tantangan #{currentChallengeIdx + 1} dari {currentLevel.challenges.length}
              </span>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Butuh Petunjuk?'}</span>
              </button>
            </div>

            {/* Cable Icon & Prompt */}
            <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
                  🔌
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Perangkat yang Dihubungkan:
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {currentChallenge.cableDevice}
                  </h3>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Kasus Nyata Lab Komputer:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{currentChallenge.cableScenario}"
                </p>
              </div>

              {showHint && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1 animate-in fade-in">
                  <span className="font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ciri Visual Fisik Kabel:
                  </span>
                  <p className="italic">{currentChallenge.visualCableTip}</p>
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Action Button */}
          <div>
            {feedback && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-semibold leading-relaxed">{feedback.text}</p>
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <span>{currentChallengeIdx + 1 < currentLevel.challenges.length ? 'Tantangan Berikutnya' : 'Selesaikan Level'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {!feedback && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  👉 Klik salah satu port soket di sebelah kanan yang tepat!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Computer Motherboard IO Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">
                Panel Belakang Komputer (IO Shield)
              </span>
              <h3 className="text-base font-black text-white">Pilih Port Colokan Tujuan:</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-xl">
              {PORTS.length} Jenis Port
            </span>
          </div>

          {/* Port Grid Rack */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PORTS.map((port) => {
              const isSelected = selectedPortId === port.id;
              const isCorrectTarget = port.id === currentChallenge.correctPortId;

              let cardStyle =
                'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200';

              if (selectedPortId !== null) {
                if (isSelected) {
                  cardStyle = isCorrectTarget
                    ? 'bg-emerald-950/80 border-emerald-400 ring-4 ring-emerald-500/20 text-emerald-100'
                    : 'bg-rose-950/80 border-rose-500 ring-4 ring-rose-500/20 text-rose-100';
                } else if (isCorrectTarget && !feedback?.isCorrect) {
                  cardStyle = 'bg-emerald-950/40 border-emerald-500/60 border-dashed text-emerald-200';
                }
              }

              return (
                <button
                  key={port.id}
                  type="button"
                  disabled={selectedPortId !== null}
                  onClick={() => handleSelectPort(port.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group relative cursor-pointer disabled:cursor-default ${cardStyle}`}
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
                      className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
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

                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Soket: {port.shortLabel}</span>
                    <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-amber-400" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center border-t border-slate-800">
            <span className="text-[11px] text-slate-400 italic">
              💡 Tips: Tekan tombol ℹ️ pada kartu untuk melihat jumlah pin dan panduan cara pasang.
            </span>
          </div>
        </div>
      </div>

      {/* Modal Level Selesai & Lanjut Level */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Luar Biasa, Teknisi Lab Cilik!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Kamu berhasil menghubungkan seluruh colokan kabel perangkat pada {currentLevel.subtitle} dengan tepat!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tantangan Pas</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {currentLevel.challenges.length}/{currentLevel.challenges.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonus Poin</span>
                <span className="text-xl font-black font-mono text-amber-500">
                  +{currentLevel.points} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={resetLevelState}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi Level
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < PORT_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Master Colokan!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Gelar Kehormatan Lab Komputer
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Master Colokan Komputer Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menguasai seluruh jenis colokan USB, Video HDMI/VGA/DisplayPort, Audio Jack, hingga LAN RJ-45!
              </p>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <span className="font-extrabold block">Total Skor Akhir: {score} Poin</span>
              <p className="text-[11px] opacity-80">Poin Bintang dan sertifikasi lab kamu telah diperbarui!</p>
            </div>

            <button
              type="button"
              onClick={handleRestartFromBeginning}
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}

      {/* Modal: Port Detail Inspection */}
      {inspectionModalPort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
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
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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
                type="button"
                onClick={() => setInspectionModalPort(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-colors"
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
