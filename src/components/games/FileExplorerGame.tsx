import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Cpu, 
  Play, 
  RotateCcw, 
  Award, 
  Sparkles, 
  FolderHeart, 
  FolderOpen,
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Trophy,
  ChevronRight,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore } from '../../services/storageService';

interface FileItem {
  name: string;
  category: 'document' | 'image' | 'media' | 'system';
  extension: string;
}

const FILE_POOL: FileItem[] = [
  { name: 'tugas_praktik_word', extension: '.docx', category: 'document' },
  { name: 'tabel_nilai_siswa', extension: '.xlsx', category: 'document' },
  { name: 'presentasi_sejarah_komputer', extension: '.pptx', category: 'document' },
  { name: 'panduan_ekskul', extension: '.pdf', category: 'document' },
  { name: 'catatan_penting', extension: '.txt', category: 'document' },
  { name: 'draft_surat_izin', extension: '.odt', category: 'document' },
  { name: 'manuskrip_buku_ict', extension: '.rtf', category: 'document' },
  
  { name: 'foto_guru_komputer', extension: '.jpg', category: 'image' },
  { name: 'logo_sdn_sukadamai', extension: '.png', category: 'image' },
  { name: 'kartun_pahlawan_siber', extension: '.gif', category: 'image' },
  { name: 'gambar_mouse_keren', extension: '.webp', category: 'image' },
  { name: 'desain_sertifikat', extension: '.png', category: 'image' },
  { name: 'icon_keranjang_belanja', extension: '.svg', category: 'image' },
  { name: 'foto_pemandangan_alam', extension: '.jpeg', category: 'image' },
  
  { name: 'lagu_indonesia_raya', extension: '.mp3', category: 'media' },
  { name: 'rekaman_belajar_mengetik', extension: '.wav', category: 'media' },
  { name: 'video_cara_rakit_pc', extension: '.mp4', category: 'media' },
  { name: 'film_dokumenter_internet', extension: '.mkv', category: 'media' },
  { name: 'musik_instrumen_santai', extension: '.mp3', category: 'media' },
  { name: 'podcast_teknologi_masa_depan', extension: '.ogg', category: 'media' },
  { name: 'video_pembelajaran_animasi', extension: '.avi', category: 'media' },
  
  { name: 'aplikasi_game_ular', extension: '.exe', category: 'system' },
  { name: 'arsip_tugas_selesai', extension: '.zip', category: 'system' },
  { name: 'halaman_web_portofolio', extension: '.html', category: 'system' },
  { name: 'gaya_desain_tombol', extension: '.css', category: 'system' },
  { name: 'penginstal_chrome', extension: '.exe', category: 'system' },
  { name: 'driver_printer_epson', extension: '.sys', category: 'system' },
  { name: 'konfigurasi_jaringan_lokal', extension: '.config', category: 'system' },
];

interface ExplorerLevel {
  id: number;
  title: string;
  shortLabel: string;
  targetCount: number;
  allowedCategories: ('document' | 'image' | 'media' | 'system')[];
  description: string;
  timeLimit: number;
}

const EXPLORER_LEVELS: ExplorerLevel[] = [
  {
    id: 1,
    title: 'Level 1: Pemula (Dokumen vs Gambar)',
    shortLabel: 'Tingkat 1: Dokumen & Foto',
    targetCount: 6,
    allowedCategories: ['document', 'image'],
    description: 'Pisahkan file naskah dokumen (.docx, .xlsx, .pdf) dari file gambar & foto (.jpg, .png, .gif).',
    timeLimit: 40,
  },
  {
    id: 2,
    title: 'Level 2: Menengah (Dokumen, Gambar, & Audio/Video)',
    shortLabel: 'Tingkat 2: Tiga Folder Media',
    targetCount: 8,
    allowedCategories: ['document', 'image', 'media'],
    description: 'Kelola berkas dokumen, gambar visual, serta rekaman lagu dan video (.mp3, .mp4, .wav).',
    timeLimit: 45,
  },
  {
    id: 3,
    title: 'Level 3: Mahir (Semua Folder Termasuk File Sistem & Aplikasi)',
    shortLabel: 'Tingkat 3: Master File Explorer',
    targetCount: 10,
    allowedCategories: ['document', 'image', 'media', 'system'],
    description: 'Tantangan lengkap! Kelola seluruh kategori berkas termasuk penginstal software, zip, dan file sistem.',
    timeLimit: 50,
  },
];

export const FileExplorerGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = EXPLORER_LEVELS[currentLevelIdx];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentLevel.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  // Filter file pool for current level
  const levelFilePool = FILE_POOL.filter((f) => currentLevel.allowedCategories.includes(f.category));

  // Load a new random file matching level pool
  const loadNextFile = () => {
    const randomIndex = Math.floor(Math.random() * levelFilePool.length);
    setCurrentFile(levelFilePool[randomIndex]);
  };

  const startGame = () => {
    setProcessedCount(0);
    setCorrectCount(0);
    setCombo(0);
    setTimeLeft(currentLevel.timeLimit);
    setIsGameOver(false);
    setShowLevelVictory(false);
    setIsPlaying(true);
    setFeedback(null);
    loadNextFile();
  };

  useEffect(() => {
    if (!isPlaying || isGameOver || showLevelVictory || showGrandVictory) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, isGameOver, showLevelVictory, showGrandVictory]);

  const handleClassify = (folderCategory: 'document' | 'image' | 'media' | 'system') => {
    if (!currentFile || !isPlaying) return;

    const isCorrect = currentFile.category === folderCategory;
    const nextProcessed = processedCount + 1;
    setProcessedCount(nextProcessed);

    if (isCorrect) {
      const newCombo = combo + 1;
      const pointsEarned = 10 + Math.min(newCombo, 5) * 2;
      setScore((prev) => prev + pointsEarned);
      setCorrectCount((c) => c + 1);
      setCombo(newCombo);
      setFeedback({ 
        type: 'success', 
        text: `Benar! ${currentFile.name}${currentFile.extension} dipindahkan ke folder yang tepat! (+${pointsEarned} Poin)` 
      });
    } else {
      setCombo(0);
      setFeedback({ 
        type: 'error', 
        text: `Salah! ${currentFile.name}${currentFile.extension} bukan bagian dari folder itu.` 
      });
    }

    setTimeout(() => {
      setFeedback(null);
    }, 900);

    // Check if target count reached
    if (nextProcessed >= currentLevel.targetCount) {
      finishLevel(isCorrect ? correctCount + 1 : correctCount);
    } else {
      loadNextFile();
    }
  };

  const finishLevel = (finalCorrectCount: number) => {
    setIsPlaying(false);
    setShowLevelVictory(true);

    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels((prev) => [...prev, currentLevel.id]);
      if (currentUser) {
        const rewardPoints = Math.round(score / 3) + 20;
        const starsEarned = Math.max(1, Math.floor(rewardPoints / 10));
        recordGameScore('Manajemen Berkas', currentUser.id, score, rewardPoints);
        refreshUser();
        showStarReward(
          starsEarned,
          `Level ${currentLevel.id} Selesai! Kamu menyortir ${finalCorrectCount}/${currentLevel.targetCount} file dengan benar (+${rewardPoints} Poin)!`,
          'Bintang Manajemen Berkas'
        );
      }
    }
  };

  const handleTimeOut = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    showError('Waktu habis! Coba lagi dan susun file lebih cepat.');
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    if (currentLevelIdx < EXPLORER_LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      setProcessedCount(0);
      setCorrectCount(0);
      setCombo(0);
      setTimeLeft(EXPLORER_LEVELS[nextIdx].timeLimit);
      setIsGameOver(false);
      setIsPlaying(true);
      setFeedback(null);
      const nextPool = FILE_POOL.filter((f) => EXPLORER_LEVELS[nextIdx].allowedCategories.includes(f.category));
      setCurrentFile(nextPool[Math.floor(Math.random() * nextPool.length)]);
    } else {
      setShowGrandVictory(true);
    }
  };

  const handleSelectLevelTab = (idx: number) => {
    setCurrentLevelIdx(idx);
    setIsPlaying(false);
    setIsGameOver(false);
    setShowLevelVictory(false);
    setProcessedCount(0);
    setCorrectCount(0);
    setCombo(0);
    setTimeLeft(EXPLORER_LEVELS[idx].timeLimit);
  };

  const handleRestartFromBeginning = () => {
    setShowGrandVictory(false);
    setShowLevelVictory(false);
    setCurrentLevelIdx(0);
    setScore(0);
    setCompletedLevels([]);
    setIsPlaying(false);
    setIsGameOver(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-6 max-w-4xl mx-auto">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Simulator Manajemen Berkas & Folder
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Level {currentLevel.id} dari {EXPLORER_LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLevel.title} — {currentLevel.description}
            </p>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {EXPLORER_LEVELS.map((lvl, idx) => {
            const isDone = completedLevels.includes(lvl.id);
            const isCurrent = idx === currentLevelIdx;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevelTab(idx)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/30'
                    : isDone
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                <span>Lvl {lvl.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!isPlaying && !isGameOver ? (
        /* Intro / Ready Screen */
        <div className="py-10 flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            <FolderHeart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {currentLevel.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tugasmu: Sortir <strong className="text-indigo-600 dark:text-indigo-400">{currentLevel.targetCount} file</strong> ke folder yang sesuai sebelum waktu {currentLevel.timeLimit} detik habis!
            </p>
          </div>
          <button
            onClick={startGame}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Sortir File Level {currentLevel.id}</span>
          </button>
        </div>
      ) : isGameOver ? (
        /* Game Over (Time Out) Screen */
        <div className="py-10 flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Waktu Habis!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kamu berhasil menyortir {correctCount} dari {currentLevel.targetCount} file sebelum waktu habis.
            </p>
          </div>
          <button
            onClick={startGame}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Ulang Level Ini</span>
          </button>
        </div>
      ) : (
        /* Active Game Arena */
        <div className="space-y-6">
          {/* Top Status Bar: Timer, Score, Progress */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sisa Waktu</span>
              <span className={`text-base font-black font-mono ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Progres File</span>
              <span className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
                {processedCount} / {currentLevel.targetCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor & Combo</span>
              <span className="text-base font-black font-mono text-amber-500">
                {score} {combo > 1 && `(🔥${combo}x)`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* File Card Inspector */}
            <div className="md:col-span-4 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              {currentFile && (
                <div className="space-y-3 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-md text-indigo-600 dark:text-indigo-400">
                    {currentFile.category === 'document' && <FileText className="w-8 h-8" />}
                    {currentFile.category === 'image' && <ImageIcon className="w-8 h-8" />}
                    {currentFile.category === 'media' && <Video className="w-8 h-8" />}
                    {currentFile.category === 'system' && <Cpu className="w-8 h-8" />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200 break-all leading-tight">
                      {currentFile.name}
                    </div>
                    <div className="inline-block text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {currentFile.extension}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Pilih folder tujuan di samping kanan!</span>
              </div>
            </div>

            {/* Folder Grid Select Area */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              {feedback && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold leading-relaxed transition-all ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Folder 1: Documents */}
                <button
                  onClick={() => handleClassify('document')}
                  className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-left cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-11 h-11 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Folder className="w-5 h-5 fill-blue-500/10" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-blue-900 dark:text-blue-300">
                      Folder DOKUMEN
                    </h4>
                    <p className="text-[10px] text-blue-500/80 mt-0.5">
                      .docx, .xlsx, .pptx, .pdf, .txt
                    </p>
                  </div>
                </button>

                {/* Folder 2: Images */}
                <button
                  onClick={() => handleClassify('image')}
                  className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Folder className="w-5 h-5 fill-emerald-500/10" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                      Folder GAMBAR
                    </h4>
                    <p className="text-[10px] text-emerald-500/80 mt-0.5">
                      .jpg, .png, .gif, .webp, .svg
                    </p>
                  </div>
                </button>

                {/* Folder 3: Media */}
                {currentLevel.allowedCategories.includes('media') && (
                  <button
                    onClick={() => handleClassify('media')}
                    className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer transition-all flex items-center gap-3.5 group"
                  >
                    <div className="w-11 h-11 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Folder className="w-5 h-5 fill-rose-500/10" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-900 dark:text-rose-300">
                        Folder AUDIO & VIDEO
                      </h4>
                      <p className="text-[10px] text-rose-500/80 mt-0.5">
                        .mp3, .mp4, .wav, .mkv, .avi
                      </p>
                    </div>
                  </button>
                )}

                {/* Folder 4: System / Program */}
                {currentLevel.allowedCategories.includes('system') && (
                  <button
                    onClick={() => handleClassify('system')}
                    className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-left cursor-pointer transition-all flex items-center gap-3.5 group"
                  >
                    <div className="w-11 h-11 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Folder className="w-5 h-5 fill-purple-500/10" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-300">
                        Folder PROGRAM & SISTEM
                      </h4>
                      <p className="text-[10px] text-purple-500/80 mt-0.5">
                        .exe, .zip, .html, .css, .sys
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Level Selesai & Lanjut Level */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevel.id} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Penyortiran File Selesai!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Kamu sukses mengelompokkan berkas ke folder yang tepat dengan cepat dan rapi!
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Benar</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {correctCount} / {currentLevel.targetCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Skor Level</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {score} pt
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < EXPLORER_LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Tamat!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory Semua Level */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-indigo-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Gelar Master Manajemen File
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Manajemen Berkas Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Selamat! Kamu telah menguasai seluruh ekstensi file komputer: dokumen, gambar, audio, video, hingga program sistem!
              </p>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <span className="font-extrabold block">Skor Total: {score} Poin (+Bintang Berkas)</span>
              <p className="text-[11px] opacity-80">Folder komputer lab sekolah kini selalu rapi dan terorganisir di tanganmu!</p>
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
    </div>
  );
};
