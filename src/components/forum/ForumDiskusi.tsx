import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  Trash2,
  EyeOff,
  Eye,
  Send,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Clock,
  User as UserIcon,
  ShieldAlert,
} from 'lucide-react';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';

interface ForumThread {
  id: string;
  title: string;
  category: 'materi' | 'tips_belajar' | 'umum';
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'admin';
  createdAt: any;
  likes: number;
  likedBy: string[];
  repliesCount: number;
  isModerated: boolean;
}

interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'admin';
  createdAt: any;
  isModerated: boolean;
}

export const ForumDiskusi: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);

  // Filtering & Search states
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'materi' | 'tips_belajar' | 'umum'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'materi' | 'tips_belajar' | 'umum'>('materi');
  const [newContent, setNewContent] = useState('');

  // Reply state
  const [replyContent, setReplyContent] = useState('');

  // Fetch threads function
  const fetchThreads = async () => {
    setLoadingThreads(true);
    try {
      const q = query(
        collection(db, 'forumThreads'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const loadedThreads: ForumThread[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedThreads.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
        } as ForumThread);
      });
      setThreads(loadedThreads);
    } catch (error: any) {
      console.error('Error fetching forum threads:', error);
      if (error.code === 'resource-exhausted') {
        showToast('Kuota harian database penuh. Mohon tunggu beberapa saat.', 'error');
      } else {
        showToast('Gagal memuat diskusi. Coba lagi.', 'error');
      }
    } finally {
      setLoadingThreads(false);
    }
  };

  // Fetch threads on mount
  useEffect(() => {
    fetchThreads();
  }, []);

  // Subscribe to replies of the active thread
  useEffect(() => {
    if (!activeThread) {
      setReplies([]);
      return;
    }

    const q = query(
      collection(db, 'forumThreads', activeThread.id, 'replies'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedReplies: ForumReply[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedReplies.push({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
          } as ForumReply);
        });
        setReplies(loadedReplies);
      },
      (error) => {
        console.error('Error fetching replies:', error);
      }
    );

    return () => unsubscribe();
  }, [activeThread]);

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Silakan masuk terlebih dahulu.', 'error');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Harap lengkapi semua bidang.', 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'forumThreads'), {
        title: newTitle.trim(),
        category: newCategory,
        content: newContent.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl || '',
        authorRole: currentUser.role,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        repliesCount: 0,
        isModerated: false,
      });

      showToast('Pertanyaan / diskusi berhasil diterbitkan!', 'success');
      setNewTitle('');
      setNewContent('');
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      showToast('Gagal memposting diskusi. Coba lagi.', 'error');
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activeThread) return;

    if (!replyContent.trim()) {
      showToast('Komentar tidak boleh kosong.', 'error');
      return;
    }

    try {
      const repliesColRef = collection(db, 'forumThreads', activeThread.id, 'replies');
      await addDoc(repliesColRef, {
        threadId: activeThread.id,
        content: replyContent.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl || '',
        authorRole: currentUser.role,
        createdAt: serverTimestamp(),
        isModerated: false,
      });

      // Update reply counter on thread
      const threadRef = doc(db, 'forumThreads', activeThread.id);
      await updateDoc(threadRef, {
        repliesCount: increment(1),
      });

      setReplyContent('');
      showToast('Komentar berhasil ditambahkan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membalas diskusi.', 'error');
    }
  };

  const handleLikeThread = async (thread: ForumThread) => {
    if (!currentUser) return;

    const threadRef = doc(db, 'forumThreads', thread.id);
    const hasLiked = thread.likedBy?.includes(currentUser.id);

    try {
      if (hasLiked) {
        await updateDoc(threadRef, {
          likedBy: arrayRemove(currentUser.id),
          likes: increment(-1),
        });
        // Sync active state locally if viewed
        if (activeThread?.id === thread.id) {
          setActiveThread((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev.likes - 1,
                  likedBy: prev.likedBy.filter((uid) => uid !== currentUser.id),
                }
              : null
          );
        }
      } else {
        await updateDoc(threadRef, {
          likedBy: arrayUnion(currentUser.id),
          likes: increment(1),
        });
        if (activeThread?.id === thread.id) {
          setActiveThread((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev.likes + 1,
                  likedBy: [...prev.likedBy, currentUser.id],
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Moderation Handlers
  const handleToggleModerateThread = async (thread: ForumThread) => {
    if (!isAdmin) return;
    const threadRef = doc(db, 'forumThreads', thread.id);
    const nextState = !thread.isModerated;

    try {
      await updateDoc(threadRef, { isModerated: nextState });
      if (activeThread?.id === thread.id) {
        setActiveThread((prev) => (prev ? { ...prev, isModerated: nextState } : null));
      }
      showToast(
        nextState
          ? 'Diskusi berhasil disembunyikan/dimoderasi.'
          : 'Diskusi dipulihkan kembali.',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Gagal melakukan moderasi.', 'error');
    }
  };

  const handleDeleteThread = async (thread: ForumThread) => {
    if (!isAdmin) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus diskusi ini secara permanen?')) return;

    try {
      await deleteDoc(doc(db, 'forumThreads', thread.id));
      if (activeThread?.id === thread.id) {
        setActiveThread(null);
      }
      showToast('Diskusi berhasil dihapus secara permanen.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus diskusi.', 'error');
    }
  };

  const handleToggleModerateReply = async (reply: ForumReply) => {
    if (!isAdmin || !activeThread) return;
    const replyRef = doc(db, 'forumThreads', activeThread.id, 'replies', reply.id);
    const nextState = !reply.isModerated;

    try {
      await updateDoc(replyRef, { isModerated: nextState });
      showToast(
        nextState ? 'Balasan berhasil dimoderasi.' : 'Balasan dipulihkan kembali.',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Gagal moderasi balasan.', 'error');
    }
  };

  const handleDeleteReply = async (reply: ForumReply) => {
    if (!isAdmin || !activeThread) return;
    if (!window.confirm('Hapus komentar ini secara permanen?')) return;

    try {
      await deleteDoc(doc(db, 'forumThreads', activeThread.id, 'replies', reply.id));

      // Decrease reply count on thread
      const threadRef = doc(db, 'forumThreads', activeThread.id);
      await updateDoc(threadRef, {
        repliesCount: increment(-1),
      });

      showToast('Komentar berhasil dihapus.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus komentar.', 'error');
    }
  };

  // Format date readable
  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryDetails = (cat: 'materi' | 'tips_belajar' | 'umum') => {
    switch (cat) {
      case 'materi':
        return {
          label: 'Materi Microsoft Word',
          icon: <BookOpen className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />,
          colorClass: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
        };
      case 'tips_belajar':
        return {
          label: 'Tips Belajar',
          icon: <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
          colorClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
        };
      case 'umum':
      default:
        return {
          label: 'Tanya Jawab Umum',
          icon: <MessageCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
          colorClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Forum Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
          <MessageSquare className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
            💬 Ruang Diskusi Siswa
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Forum Diskusi & Tanya Jawab
          </h1>
          <p className="text-emerald-50 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
            Tempat berkumpul, bertanya seputar Microsoft Word, berbagi tips belajar seru, dan menyelesaikan kendala bersama teman dan mentor komputer ceriamu!
          </p>
        </div>
      </div>

      {activeThread ? (
        /* ================= DETAIL THREAD VIEW ================= */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setActiveThread(null)}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Semua Diskusi
          </button>

          {/* Core Thread Post Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <Avatar src={activeThread.authorAvatar} name={activeThread.authorName} size="md" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {activeThread.authorName}
                    </span>
                    {activeThread.authorRole === 'admin' ? (
                      <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-rose-500 text-white uppercase">
                        👑 GURU / ADMIN
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 uppercase">
                        Siswa
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(activeThread.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Tag Category */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold ${getCategoryDetails(activeThread.category).colorClass}`}>
                  {getCategoryDetails(activeThread.category).icon}
                  <span>{getCategoryDetails(activeThread.category).label}</span>
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {activeThread.title}
              </h2>

              {activeThread.isModerated && !isAdmin ? (
                /* Warn user if content is hidden/moderated */
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p className="font-semibold">
                    Konten diskusi ini telah disembunyikan oleh Moderator karena melanggar ketentuan forum.
                  </p>
                </div>
              ) : (
                <div className={`text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-1.5 ${activeThread.isModerated ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl' : ''}`}>
                  {activeThread.isModerated && (
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>[DI-MODERASI: Hanya Admin yang dapat melihat konten asli di bawah ini]</span>
                    </div>
                  )}
                  {activeThread.content}
                </div>
              )}
            </div>

            {/* Likes count, active triggers & Admin controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLikeThread(activeThread)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentUser && activeThread.likedBy?.includes(currentUser.id)
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shadow-inner'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{activeThread.likes} Suka</span>
                </button>
                <div className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs px-3 py-1.5 rounded-xl font-bold">
                  💬 {activeThread.repliesCount} Komentar
                </div>
              </div>

              {/* Admin Panel */}
              {isAdmin && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleModerateThread(activeThread)}
                    className="p-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg flex items-center gap-1 cursor-pointer"
                    title={activeThread.isModerated ? 'Pulihkan Diskusi' : 'Sembunyikan/Moderasi Diskusi'}
                  >
                    {activeThread.isModerated ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pulihkan</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sembunyikan</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteThread(activeThread)}
                    className="p-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg flex items-center gap-1 cursor-pointer"
                    title="Hapus Permanen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments/Replies Area */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider pl-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Semua Komentar ({replies.length})</span>
            </h3>

            {/* List Replies */}
            <div className="space-y-3">
              {replies.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Belum ada komentar di forum ini. Jadilah yang pertama memberikan bantuan atau tips belajar!
                  </p>
                </div>
              ) : (
                replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5 transition-all ${
                      reply.authorRole === 'admin'
                        ? 'ring-2 ring-emerald-500/30 bg-gradient-to-r from-emerald-50/20 via-white to-white'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={reply.authorAvatar} name={reply.authorName} size="sm" />
                        <div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs font-black text-slate-950 dark:text-slate-100">
                              {reply.authorName}
                            </span>
                            {reply.authorRole === 'admin' ? (
                              <span className="text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase">
                                👑 GURU / ADMIN
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                                Siswa
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.2 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Reply Admin Control panel */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleModerateReply(reply)}
                            className="p-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer flex items-center gap-0.5"
                          >
                            {reply.isModerated ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{reply.isModerated ? 'Sembunyikan' : 'Moderasi'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReply(reply)}
                            className="p-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reply text body */}
                    {reply.isModerated && !isAdmin ? (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 rounded-xl text-[11px] text-red-600 dark:text-red-400 italic">
                        🚫 Komentar ini telah disembunyikan oleh Moderator.
                      </div>
                    ) : (
                      <div className={`text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-1 ${reply.isModerated ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-lg' : ''}`}>
                        {reply.isModerated && (
                          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1">
                            ⚠️ [KOMENTAR DI-MODERASI - Hanya Admin yang dapat melihat teks di bawah]
                          </div>
                        )}
                        {reply.content}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Reply Input Form */}
            <form
              onSubmit={handleAddReply}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-500" />
                <label className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Kirim Tanggapan / Balasan Anda
                </label>
              </div>

              <div className="flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Ketik komentar Anda secara santun, berikan tips belajar atau petunjuk yang berguna..."
                  rows={3}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Komentar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ================= LIST THREADS VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Navigation and Filter bar */}
          <div className="space-y-4 lg:col-span-1">
            {/* Create Button */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Topik Tanya Jawab</span>
            </button>

            {/* Categories sidebar navigation */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                Kategori Diskusi
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory('ALL');
                  fetchThreads();
                }}
                disabled={loadingThreads}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MessageSquare className={`w-4 h-4 ${loadingThreads ? 'animate-spin' : ''}`} />
                <span>{loadingThreads ? 'Memuat...' : `Semua Diskusi (${threads.length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('materi')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeCategory === 'materi'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Materi Word ({threads.filter((t) => t.category === 'materi').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('tips_belajar')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeCategory === 'tips_belajar'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Tips Belajar ({threads.filter((t) => t.category === 'tips_belajar').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('umum')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeCategory === 'umum'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Tanya Jawab Umum ({threads.filter((t) => t.category === 'umum').length})</span>
              </button>
            </div>
          </div>

          {/* Right threads search and list */}
          <div className="space-y-4 lg:col-span-3">
            {/* Search inputs */}
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan, materi, tips, atau topik diskusi..."
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-transparent border-0 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* List items */}
            <div className="space-y-3">
              {filteredThreads.length === 0 ? (
                <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                  <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto" />
                  <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    Tidak Ada Topik Diskusi Ditemukan
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Ubah kategori filter atau cari kata kunci lain untuk menemukan diskusi dari rekan belajar.
                  </p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Profile Info */}
                        <div className="flex items-center gap-2">
                          <Avatar src={thread.authorAvatar} name={thread.authorName} size="xs" />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black text-slate-800 dark:text-white">
                              {thread.authorName}
                            </span>
                            {thread.authorRole === 'admin' ? (
                              <span className="text-[8px] font-black tracking-wider px-1 py-0.2 rounded bg-rose-500 text-white uppercase">
                                GURU
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 uppercase">
                                Siswa
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(thread.createdAt)}
                        </span>
                      </div>

                      {/* Main Title & body preview */}
                      <div className="space-y-1 text-left">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight hover:text-indigo-600 truncate">
                          {thread.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {thread.isModerated && !isAdmin
                            ? '[Diskusi disembunyikan oleh moderator]'
                            : thread.content}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Status bars & tag */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[9px] ${getCategoryDetails(thread.category).colorClass}`}>
                          {getCategoryDetails(thread.category).icon}
                          <span>{getCategoryDetails(thread.category).label}</span>
                        </span>

                        {thread.isModerated && (
                          <span className="bg-amber-150 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono text-[9px] flex items-center gap-0.5">
                            🔒 DIMODERASI
                          </span>
                        )}
                      </div>

                      {/* Likes and replies status stats */}
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <ThumbsUp className="w-3 h-3 text-rose-500" />
                          <span>{thread.likes} Suka</span>
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <MessageSquare className="w-3 h-3 text-indigo-500" />
                          <span>{thread.repliesCount} Balasan</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW THREAD CREATION MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Buat Topik Diskusi Baru
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateThread} className="p-5 space-y-4">
              {/* Title field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                  Judul Pertanyaan / Tips:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Bagaimana cara mengatur nomor halaman di Word?"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                  Pilih Kategori:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="materi">📖 Materi Microsoft Word (Materi Belajar)</option>
                  <option value="tips_belajar">💡 Tips Belajar Seru (Berbagi Trik)</option>
                  <option value="umum">💬 Tanya Jawab Umum (Lain-lain)</option>
                </select>
              </div>

              {/* Content text field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                  Deskripsi Lengkap Pertanyaan / Pembahasan:
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Ketik rincian pertanyaan atau materi belajar yang ingin dibahas secara lengkap di sini agar mudah dijawab oleh mentor atau teman belajar..."
                  rows={5}
                  required
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Terbitkan Topik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
