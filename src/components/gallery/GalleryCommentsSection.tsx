import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Star,
  Sparkles,
  Trash2,
  Smile,
  Heart,
  ThumbsUp,
  Lightbulb,
  Award,
  AlertCircle,
  CheckCircle2,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getGalleryComments,
  addGalleryComment,
  deleteGalleryComment,
} from '../../services/storageService';
import { GalleryComment } from '../../types';
import { Avatar } from '../common/Avatar';
import { ConfirmModal } from '../common/ConfirmModal';

interface GalleryCommentsSectionProps {
  workId: string;
  workTitle: string;
  workAuthorId: string;
  workAuthorName: string;
  onCommentsCountChange?: (count: number) => void;
  onOpenAuthModal?: (mode?: 'student-login') => void;
}

const QUICK_PRAISE_STICKERS = [
  { label: '🎨 Keren & Kreatif!', category: 'apresiasi' as const },
  { label: '⭐ Rapi Sekali!', category: 'apresiasi' as const },
  { label: '👏 Luar Biasa!', category: 'apresiasi' as const },
  { label: '💡 Ide Menarik!', category: 'masukan' as const },
  { label: '🚀 Terus Semangat!', category: 'apresiasi' as const },
  { label: '🌈 Warnanya Bagus!', category: 'apresiasi' as const },
];

export const GalleryCommentsSection: React.FC<GalleryCommentsSectionProps> = ({
  workId,
  workTitle,
  workAuthorId,
  workAuthorName,
  onCommentsCountChange,
  onOpenAuthModal,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'apresiasi' | 'masukan'>('apresiasi');
  const [selectedSticker, setSelectedSticker] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryComment | null>(null);

  const loadComments = () => {
    const list = getGalleryComments(workId);
    setComments(list);
    if (onCommentsCountChange) {
      onCommentsCountChange(list.length);
    }
  };

  useEffect(() => {
    loadComments();
    const handleUpdate = () => loadComments();
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, [workId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showError('Silakan login terlebih dahulu untuk memberikan komentar.', 'Perlu Login');
      if (onOpenAuthModal) onOpenAuthModal('student-login');
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed && !selectedSticker) {
      showError('Tuliskan kata-kata apresiasi atau pilih salah satu stiker pujian.', 'Komentar Kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullText = trimmed || selectedSticker;
      addGalleryComment(workId, {
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAvatar: currentUser.avatarUrl,
        studentGrade: currentUser.grade || 'Siswa',
        studentSchool: currentUser.school || 'Sekolah Terdaftar',
        comment: fullText,
        category: selectedCategory,
        stickerTag: selectedSticker || undefined,
      });

      setCommentText('');
      setSelectedSticker('');
      showSuccess('Apresiasi / masukan kamu berhasil dikirimkan!', 'Terkirim');
      loadComments();
    } catch (err) {
      console.error(err);
      showError('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteGalleryComment(deleteTarget.id, workId);
    showSuccess('Komentar berhasil dihapus.');
    setDeleteTarget(null);
    loadComments();
  };

  const canDeleteComment = (c: GalleryComment) => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    if (currentUser.id === c.studentId || currentUser.name === c.studentName) return true;
    if (currentUser.id === workAuthorId || currentUser.name === workAuthorName) return true;
    return false;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Kolom Apresiasi & Masukan Teman</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {comments.length}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Saling dukung, berikan apresiasi positif, dan bagikan masukan yang membangun untuk karya ini.
            </p>
          </div>
        </div>
      </div>

      {/* New Comment Form (or Login Prompt) */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
          {/* Quick Praise Sticker Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pilih Stiker Apresiasi Cepat (Opsional):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRAISE_STICKERS.map((sticker) => {
                const isSelected = selectedSticker === sticker.label;
                return (
                  <button
                    key={sticker.label}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSticker('');
                      } else {
                        setSelectedSticker(sticker.label);
                        setSelectedCategory(sticker.category);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {sticker.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Toggle: Apresiasi vs Saran */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Jenis Respon:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('apresiasi')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCategory === 'apresiasi'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                💚 Apresiasi / Pujian
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('masukan')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCategory === 'masukan'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                💡 Saran / Masukan
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Tulis ${
                selectedCategory === 'apresiasi' ? 'kata-kata pujian atau apresiasi' : 'saran dan masukan yang ramah'
              } untuk ${workAuthorName}...`}
              maxLength={400}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-400">
              Mengirim sebagai: <strong className="text-slate-700 dark:text-slate-300">{currentUser.name}</strong> ({currentUser.grade || 'Siswa'})
            </span>

            <button
              type="submit"
              disabled={isSubmitting || (!commentText.trim() && !selectedSticker)}
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Masukan</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Ingin memberikan apresiasi atau masukan kepada karya temanmu?
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Silakan login sebagai siswa terlebih dahulu untuk menulis komentar dan berikan semangat!
              </p>
            </div>
          </div>

          {onOpenAuthModal && (
            <button
              type="button"
              onClick={() => onOpenAuthModal('student-login')}
              className="px-3.5 py-1.5 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs text-center"
            >
              Login Siswa Sekarang
            </button>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="py-8 text-center bg-white dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1.5">
            <Smile className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Belum ada apresiasi atau masukan untuk karya ini.
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Jadilah teman pertama yang memberikan apresiasi hangat dan semangat belajar!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isDeletable = canDeleteComment(comment);
            const isFeedback = comment.category === 'masukan';

            return (
              <div
                key={comment.id}
                className="bg-white dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Author Info Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={comment.studentAvatar}
                      name={comment.studentName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {comment.studentName}
                        </span>
                        {/* Category Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFeedback
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          }`}
                        >
                          {isFeedback ? '💡 Masukan' : '💚 Apresiasi'}
                        </span>
                        {/* Sticker Tag if present */}
                        {comment.stickerTag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                            {comment.stickerTag}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {comment.studentGrade || 'Siswa'} · {comment.studentSchool || 'Sekolah Terdaftar'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isDeletable && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(comment)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-9">
                  {comment.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Deleting Comment */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Komentar / Apresiasi"
        message={`Apakah Anda yakin ingin menghapus komentar dari "${deleteTarget?.studentName}"?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
