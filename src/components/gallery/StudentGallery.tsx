import React, { useEffect, useState } from 'react';
import {
  Award,
  Eye,
  FileText,
  Filter,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Palette,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  deleteGalleryWork,
  getGalleryWorks,
  toggleLikeGalleryWork,
} from '../../services/storageService';
import { StudentGalleryWork } from '../../types';
import { Avatar } from '../common/Avatar';
import { ConfirmModal } from '../common/ConfirmModal';
import { PaintCanvas } from './PaintCanvas';
import { RichWordPublisher } from './RichWordPublisher';
import { PixelArtStudio } from '../games/PixelArtStudio';
import { GalleryCommentsSection } from './GalleryCommentsSection';

interface StudentGalleryProps {
  isAdminView?: boolean;
  onOpenAuthModal?: (mode?: 'student-login') => void;
}

export const StudentGallery: React.FC<StudentGalleryProps> = ({ 
  isAdminView = false,
  onOpenAuthModal,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [works, setWorks] = useState<StudentGalleryWork[]>([]);
  const [creationMode, setCreationMode] = useState<'none' | 'paint' | 'word' | 'pixel-art'>('none');
  const [activeViewingWork, setActiveViewingWork] = useState<StudentGalleryWork | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'paint' | 'word' | 'pixel-art'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    workId: string;
    workTitle: string;
  } | null>(null);

  const reloadWorks = () => {
    setWorks(getGalleryWorks());
  };

  useEffect(() => {
    reloadWorks();
    const handleUpdate = () => reloadWorks();
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, []);

  const handleToggleLike = (workId: string) => {
    if (!currentUser) {
      showError(
        'Pemberian bintang hanya untuk siswa yang sudah masuk. Silakan login terlebih dahulu untuk memberikan apresiasi.',
        'Perlu Login'
      );
      if (onOpenAuthModal) {
        onOpenAuthModal('student-login');
      }
      return;
    }
    toggleLikeGalleryWork(workId, currentUser.id);
    reloadWorks();
  };

  const handlePromptDelete = (workId: string, workTitle: string) => {
    setDeleteConfirm({
      isOpen: true,
      workId,
      workTitle: workTitle || 'Karya Siswa',
    });
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;
    const { workId, workTitle } = deleteConfirm;
    const isDeleted = deleteGalleryWork(workId);
    if (isDeleted) {
      showSuccess(`Karya "${workTitle}" berhasil dihapus dari galeri.`);
    } else {
      showSuccess('Karya berhasil dihapus.');
    }
    setWorks((prev) => prev.filter((w) => String(w.id) !== String(workId)));
    if (activeViewingWork?.id === workId) {
      setActiveViewingWork(null);
    }
    setDeleteConfirm(null);
  };

  const filteredWorks = works.filter((w) => {
    const matchType = filterType === 'ALL' || w.type === filterType;
    const matchSearch =
      searchQuery === '' ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.studentGrade && w.studentGrade.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.studentSchool && w.studentSchool.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchType && matchSearch;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Creation Mode View (Paint Canvas, Word Publisher, or Pixel Art Studio) */}
      {creationMode === 'paint' && (
        <PaintCanvas
          onPublished={() => {
            setCreationMode('none');
            reloadWorks();
          }}
          onCancel={() => setCreationMode('none')}
        />
      )}

      {creationMode === 'pixel-art' && (
        <PixelArtStudio
          onPublished={() => {
            setCreationMode('none');
            reloadWorks();
          }}
          onCancel={() => setCreationMode('none')}
        />
      )}

      {creationMode === 'word' && (
        <RichWordPublisher
          onPublished={() => {
            setCreationMode('none');
            reloadWorks();
          }}
          onCancel={() => setCreationMode('none')}
        />
      )}

      {creationMode === 'none' && (
        <>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Mading Kreatif Siswa
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500">
                  {works.length} Karya Siswa dari Berbagai Sekolah
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Galeri Karya Digital Siswa
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pameran karya kreatif siswa: Lukisan Paint, Seni Pixel Art 8-Bit, dan Naskah Microsoft Word berformat rapi!
              </p>
            </div>

            {/* Creation Mode Action Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCreationMode('paint')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>+ Gambar Paint</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode('pixel-art')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>+ Studio Pixel Art</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode('word')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>+ Buat Naskah Word</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-900/60">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Publik dapat melihat · Beri bintang khusus siswa login</span>
                </span>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('student-login')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Login Siswa
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa, kelas, judul karya..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
              >
                <option value="ALL">Semua Jenis Karya</option>
                <option value="paint">🎨 Lukisan Paint</option>
                <option value="pixel-art">👾 Studio Pixel Art</option>
                <option value="word">📝 Naskah Word</option>
              </select>
            </div>

            <span className="text-xs text-slate-500">
              Menampilkan <strong>{filteredWorks.length}</strong> karya
            </span>
          </div>

          {/* Works Grid */}
          {filteredWorks.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Belum ada karya siswa pada kategori ini
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tekan tombol "+ Gambar di Paint" atau "+ Buat Naskah Word" untuk mempublikasikan karyamu sekarang!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWorks.map((work) => {
                const isLiked = currentUser && work.likedByStudentIds.includes(currentUser.id);
                const isOwner = Boolean(
                  currentUser &&
                    (currentUser.id === work.studentId ||
                      currentUser.name === work.studentName ||
                      (currentUser.username && currentUser.username === work.studentName))
                );
                const canDelete = isAdmin || isAdminView || isOwner;

                return (
                  <div
                    key={work.id}
                    className="bg-white dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    {/* Visual Media Preview Container */}
                    <div
                      onClick={() => setActiveViewingWork(work)}
                      className="relative h-44 bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden flex items-center justify-center p-2"
                    >
                      {(work.type === 'paint' || work.type === 'pixel-art') && work.imageUrl ? (
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden text-[10px] leading-snug text-slate-700 dark:text-slate-300 select-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: work.contentHtml?.slice(0, 300) || work.previewText,
                            }}
                          />
                        </div>
                      )}

                      {/* Type Badge Tag */}
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${
                          work.type === 'pixel-art'
                            ? 'bg-purple-600 text-white'
                            : work.type === 'paint'
                            ? 'bg-pink-500 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {work.type === 'pixel-art' ? (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Pixel Art</span>
                          </>
                        ) : work.type === 'paint' ? (
                          <>
                            <Palette className="w-3 h-3" />
                            <span>Lukisan Paint</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span>Naskah Word</span>
                          </>
                        )}
                      </span>

                      {/* Category Pill */}
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                        {work.category}
                      </span>
                    </div>

                    {/* Card Content & Student Identity */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3
                          onClick={() => setActiveViewingWork(work)}
                          className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                        >
                          {work.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {work.previewText}
                        </p>
                      </div>

                      {/* Student Identity: Avatar, Name, Grade, School */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
                        <Avatar
                          src={work.studentAvatar}
                          name={work.studentName}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {work.studentName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {work.studentGrade || 'Siswa'} · {work.studentSchool || 'Sekolah Terdaftar'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      {/* Bintang Likes Button & Komentar Counter */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(work.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            isLiked
                              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border border-amber-300'
                              : 'text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-500' : ''}`} />
                          <span>{work.starLikes} Bintang</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveViewingWork(work)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                          title="Lihat apresiasi & masukan"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{work.commentsCount || 0} Masukan</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveViewingWork(work)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka</span>
                        </button>

                        {/* Delete Button for Admin & Owner */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromptDelete(work.id, work.title);
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                            title="Hapus Karya Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal: View Full Work (Paint Image or Word HTML) */}
      {activeViewingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={activeViewingWork.studentAvatar}
                  name={activeViewingWork.studentName}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                      {activeViewingWork.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeViewingWork.type === 'paint' 
                        ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' 
                        : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {activeViewingWork.type === 'paint' ? '🎨 Lukisan Paint' : '📄 Naskah Microsoft Word'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Oleh <strong className="text-slate-700 dark:text-slate-200">{activeViewingWork.studentName}</strong> {activeViewingWork.studentGrade ? `(${activeViewingWork.studentGrade})` : ''} · {activeViewingWork.studentSchool || 'Sekolah Binaan'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(isAdmin || isAdminView || (currentUser && (currentUser.id === activeViewingWork.studentId || currentUser.name === activeViewingWork.studentName))) && (
                  <button
                    type="button"
                    onClick={() => handlePromptDelete(activeViewingWork.id, activeViewingWork.title)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                    title="Hapus Karya Siswa"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveViewingWork(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area & Comments Column */}
            <div className="overflow-y-auto flex-1 flex flex-col bg-slate-100 dark:bg-slate-950/60 divide-y divide-slate-200 dark:divide-slate-800">
              {/* Artwork View Body */}
              <div className="p-4 sm:p-8 flex justify-center">
                {(activeViewingWork.type === 'paint' || activeViewingWork.type === 'pixel-art') && activeViewingWork.imageUrl ? (
                  <div className="max-w-full text-center space-y-3 flex flex-col items-center">
                    <div className="p-2 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-800 inline-block max-w-full">
                      <img
                        src={activeViewingWork.imageUrl}
                        alt={activeViewingWork.title}
                        className="max-w-full max-h-[65vh] object-contain rounded-xl bg-white"
                      />
                    </div>
                    {activeViewingWork.previewText && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic max-w-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        "{activeViewingWork.previewText}"
                      </p>
                    )}
                  </div>
                ) : (
                  /* Authentic Word / Paper Document Sheet Viewer */
                  <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-12 font-sans space-y-6">
                    {/* Paper Header Ribbon */}
                    <div className="border-b-2 border-indigo-500/80 pb-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono font-bold tracking-wider text-indigo-700 uppercase">
                          DOKUMEN PRAKTIKUM KOMPUTER
                        </span>
                        <span>
                          {new Date(activeViewingWork.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {activeViewingWork.title}
                      </h1>
                      <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                        <span>Penulis: <strong>{activeViewingWork.studentName}</strong></span>
                        <span>·</span>
                        <span>{activeViewingWork.studentSchool}</span>
                        <span>·</span>
                        <span>{activeViewingWork.studentGrade}</span>
                      </div>
                    </div>

                    {/* Formatted Body Content */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
                      {activeViewingWork.contentHtml ? (
                        <div
                          className="prose prose-indigo max-w-none text-slate-800 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:border [&_table]:border-slate-300 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2.5 [&_th]:bg-indigo-50 [&_th]:text-indigo-950 [&_th]:font-bold [&_th]:text-left [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_p]:my-2.5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                          dangerouslySetInnerHTML={{
                            __html: activeViewingWork.contentHtml,
                          }}
                        />
                      ) : (
                        <div className="whitespace-pre-line leading-relaxed text-slate-800">
                          {activeViewingWork.previewText}
                        </div>
                      )}
                    </div>

                    {/* Document Footer Signature Seal */}
                    <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xs">
                          KC
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">Ekstrakurikuler Komputer Ceria</p>
                          <p className="text-[10px] text-slate-400">Pusat Kreativitas & Portofolio Siswa</p>
                        </div>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Karya Terverifikasi
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dedicated Comments Column (Kolom Komentar, Apresiasi & Masukan) */}
              <GalleryCommentsSection
                workId={activeViewingWork.id}
                workTitle={activeViewingWork.title}
                workAuthorId={activeViewingWork.studentId}
                workAuthorName={activeViewingWork.studentName}
                onOpenAuthModal={onOpenAuthModal}
                onCommentsCountChange={(newCount) => {
                  setWorks((prev) =>
                    prev.map((w) =>
                      w.id === activeViewingWork.id ? { ...w, commentsCount: newCount } : w
                    )
                  );
                }}
              />
            </div>

            {/* Footer Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 gap-3">
              <span className="text-xs text-slate-500 truncate">
                Kategori: <strong className="text-slate-700 dark:text-slate-300">{activeViewingWork.category}</strong>
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeViewingWork.id)}
                  className={`px-4 py-2 font-bold rounded-xl border flex items-center gap-1.5 cursor-pointer text-xs transition-all ${
                    currentUser
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-100 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                  title={!currentUser ? 'Klik untuk masuk dan memberi bintang' : 'Beri Bintang'}
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>
                    {currentUser
                      ? `Beri Bintang (${activeViewingWork.starLikes})`
                      : `${activeViewingWork.starLikes} Bintang`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewingWork(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Work */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirm?.isOpen)}
        title="Hapus Karya Galeri Siswa"
        message={`Apakah Anda yakin ingin menghapus karya "${deleteConfirm?.workTitle || ''}" secara permanen dari galeri siswa?`}
        confirmText="Ya, Hapus Karya"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleExecuteDelete}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
};
