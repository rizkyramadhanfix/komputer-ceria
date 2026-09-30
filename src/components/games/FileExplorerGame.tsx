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
  HelpCircle
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

export const FileExplorerGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load a new random file
  const loadNextFile = () => {
    const randomIndex = Math.floor(Math.random() * FILE_POOL.length);
    setCurrentFile(FILE_POOL[randomIndex]);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(45);
    setIsGameOver(false);
    setIsPlaying(true);
    setFeedback(null);
    loadNextFile();
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, isGameOver]);

  const handleClassify = (folderCategory: 'document' | 'image' | 'media' | 'system') => {
    if (!currentFile) return;

    const isCorrect = currentFile.category === folderCategory;

    if (isCorrect) {
      const newCombo = combo + 1;
      const pointsEarned = 10 + Math.min(newCombo, 5) * 2;
      setScore((prev) => prev + pointsEarned);
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
    }, 1200);

    loadNextFile();
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);

    if (currentUser) {
      const rewardPoints = Math.round(score / 4);
      if (rewardPoints > 0) {
        const starsEarned = Math.max(1, Math.floor(rewardPoints / 10));
        recordGameScore('Manajemen Berkas', currentUser.id, score, rewardPoints);
        refreshUser();
        showStarReward(
          starsEarned,
          `Selamat! Kamu mengurutkan file dengan skor ${score} dan mendapat +${rewardPoints} Poin (+${starsEarned} ★ Bintang)!`,
          'Manajemen Berkas Cerdas'
        );
      } else {
        showSuccess(`Permainan selesai! Skor kamu: ${score}.`);
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Simulasi Manajemen Berkas & Folder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klasifikasikan file ke dalam folder Dokumen, Gambar, Audio/Video, atau Program sebelum waktu habis!
            </p>
          </div>
        </div>

        {/* Status widgets */}
        {isPlaying && (
          <div className="flex items-center gap-4 text-xs font-bold shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300">
              Skor: <span className="font-mono text-sm">{score}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300">
              Combo: <span className="font-mono text-sm">x{combo}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300">
              Sisa Waktu: <span className="font-mono text-sm">{timeLeft}s</span>
            </div>
          </div>
        )}
      </div>

      {!isPlaying && !isGameOver ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-bounce">
            <FolderOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Siap Menjadi Ahli Kerapian Komputer?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Setiap file memiliki jenis dan folder wadahnya masing-masing. Tekan Mulai untuk menyortir file secepat mungkin dan raih bintang emas terbanyak!
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Bermain</span>
          </button>
        </div>
      ) : isGameOver ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center animate-pulse">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Waktu Habis! Urut Berkas Selesai!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Skor Merapikan Berkas: <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{score}</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Bagus sekali! Kemampuan pengenalan berkas ini akan sangat berguna ketika kamu mengelola file asli di sistem operasi Windows asli.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* File Card display Area */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              File yang Berjalan:
            </div>
            
            {currentFile && (
              <div className="flex flex-col items-center text-center space-y-3 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-2xl w-full">
                {currentFile.category === 'document' && <FileText className="w-12 h-12 text-blue-500" />}
                {currentFile.category === 'image' && <ImageIcon className="w-12 h-12 text-emerald-500" />}
                {currentFile.category === 'media' && <Video className="w-12 h-12 text-rose-500" />}
                {currentFile.category === 'system' && <Cpu className="w-12 h-12 text-purple-500" />}
                
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200 break-all leading-tight">
                    {currentFile.name}
                  </div>
                  <div className="inline-block text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    {currentFile.extension}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Helper Tips */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Pilih folder tujuan di samping kanan!</span>
            </div>
          </div>

          {/* Folder grid select Area */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            {feedback && (
              <div className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold leading-relaxed transition-all ${
                feedback.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
              }`}>
                {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Folder 1: Documents */}
              <button
                onClick={() => handleClassify('document')}
                className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-left cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Folder className="w-6 h-6 fill-blue-500/10" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-blue-900 dark:text-blue-300">
                    Folder DOKUMEN
                  </h4>
                  <p className="text-[10px] text-blue-500/80 mt-0.5">
                    Berkas naskah, laporan & lembar kerja (.docx, .xlsx, .pptx, .pdf, .txt)
                  </p>
                </div>
              </button>

              {/* Folder 2: Images */}
              <button
                onClick={() => handleClassify('image')}
                className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Folder className="w-6 h-6 fill-emerald-500/10" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                    Folder GAMBAR
                  </h4>
                  <p className="text-[10px] text-emerald-500/80 mt-0.5">
                    Berkas foto, kartun, lukisan, poster & avatar (.jpg, .png, .gif, .webp)
                  </p>
                </div>
              </button>

              {/* Folder 3: Media */}
              <button
                onClick={() => handleClassify('media')}
                className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Folder className="w-6 h-6 fill-rose-500/10" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-rose-900 dark:text-rose-300">
                    Folder AUDIO & VIDEO
                  </h4>
                  <p className="text-[10px] text-rose-500/80 mt-0.5">
                    Berkas rekaman suara, musik lagu, dan rekaman kelas (.mp3, .mp4, .wav, .mkv)
                  </p>
                </div>
              </button>

              {/* Folder 4: System / Program */}
              <button
                onClick={() => handleClassify('system')}
                className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-left cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Folder className="w-6 h-6 fill-purple-500/10" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-300">
                    Folder PROGRAM & SISTEM
                  </h4>
                  <p className="text-[10px] text-purple-500/80 mt-0.5">
                    Berkas aplikasi, arsip zip, game instalan, atau kode (.exe, .zip, .html, .css)
                  </p>
                </div>
              </button>
            </div>

            <div className="text-slate-400 text-[10px] flex items-center gap-1 border-t border-slate-100 dark:border-slate-900 pt-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Menyelesaikan penyortiran dengan akurasi dan combo tanpa salah akan melipatgandakan skor dan bonus bintang!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
