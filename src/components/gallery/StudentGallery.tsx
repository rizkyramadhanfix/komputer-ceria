import React, { useEffect, useState } from 'react';
import {
  Award,
  Eye,
  FileText,
  Filter,
  Heart,
  Image as ImageIcon,
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
import { PaintCanvas } from './PaintCanvas';
import { RichWordPublisher } from './RichWordPublisher';

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
  const [creationMode, setCreationMode] = useState<'none' | 'paint' | 'word'>('none');
  const [activeViewingWork, setActiveViewingWork] = useState<StudentGalleryWork | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'paint' | 'word'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const reloadWorks = () => {
    setWorks(getGalleryWorks());
  };

  useEffect(() => {
    reloadWorks();
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

  const handleDelete = (workId: string, workTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus karya "${workTitle}" dari galeri siswa?`)) {
      const isDeleted = deleteGalleryWork(workId);
      if (isDeleted) {
        showSuccess(`Karya "${workTitle}" berhasil dihapus dari galeri.`);
      } else {
        showSuccess('Karya berhasil dihapus.');
      }
      setWorks((prev) => prev.filter((w) => w.id !== workId));
      if (activeViewingWork?.id === workId) {
        setActiveViewingWork(null);
      }
    }
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
      {/* Creation Mode View (Paint Canvas or Word Publisher) */}
      {creationMode === 'paint' && (
        <PaintCanvas
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
                  <Sparkles className="w-4 h-4" />
                  Pameran Karya Digital Siswa
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500">
                  {works.length} Karya Siswa dari Berbagai Sekolah
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Galeri Lukisan Paint & Dokumen Word Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Lihat hasil karya menggambar Paint dan pengetikan naskah Microsoft Word berisikan foto/tabel kreatif dari teman-temanmu!
              </p>
            </div>

            {/* Creation Mode Action Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCreationMode('paint')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>+ Gambar di Paint</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode('word')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
                const canDelete = isAdmin || isAdminView;

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
                      {work.type === 'paint' && work.imageUrl ? (
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
                          work.type === 'paint'
                            ? 'bg-pink-500 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {work.type === 'paint' ? (
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
                      {/* Bintang Likes Button */}
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

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveViewingWork(work)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka</span>
                        </button>

                        {/* Admin-Only Delete Button */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(work.id, work.title);
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                            title="Hapus Karya Siswa (Admin)"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeViewingWork.studentAvatar}
                  name={activeViewingWork.studentName}
                  size="md"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeViewingWork.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Karya oleh <strong>{activeViewingWork.studentName}</strong> ({activeViewingWork.studentGrade}) · {activeViewingWork.studentSchool}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(isAdmin || isAdminView) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(activeViewingWork.id, activeViewingWork.title)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg flex items-center gap-1 text-xs font-semibold"
                    title="Hapus Karya Siswa (Admin)"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Hapus Karya</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveViewingWork(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex justify-center">
              {activeViewingWork.type === 'paint' && activeViewingWork.imageUrl ? (
                <div className="max-w-full text-center space-y-2">
                  <img
                    src={activeViewingWork.imageUrl}
                    alt={activeViewingWork.title}
                    className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              ) : (
                <div className="w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-10 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: activeViewingWork.contentHtml || activeViewingWork.previewText,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Kategori: <strong>{activeViewingWork.category}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeViewingWork.id)}
                  className={`px-4 py-1.5 font-semibold rounded-lg border flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                    currentUser
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                  title={!currentUser ? 'Klik untuk masuk dan memberi bintang' : 'Beri Bintang'}
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>
                    {currentUser
                      ? `Beri Bintang (${activeViewingWork.starLikes})`
                      : `${activeViewingWork.starLikes} Bintang (Login untuk memberi bintang)`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewingWork(null)}
                  className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
