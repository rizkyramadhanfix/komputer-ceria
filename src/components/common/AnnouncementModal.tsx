import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Calendar,
  Filter,
  Megaphone,
  Pin,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import { getAnnouncements } from '../../services/storageService';
import { AnnouncementItem } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  isPage = false,
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [searchTerm, setSearchCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen || isPage) {
      const data = getAnnouncements();
      setAnnouncements(data);
    }
  }, [isOpen, isPage]);

  // Listen for realtime storage updates
  useEffect(() => {
    const handleUpdate = () => {
      if (isOpen || isPage) {
        setAnnouncements(getAnnouncements());
      }
    };
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, [isOpen, isPage]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [announcements, searchTerm, selectedCategory]);

  if (isPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Full Page Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded">
                Halaman Publik
              </span>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Pemberitahuan & Pengumuman Resmi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengumuman terbaru seputar jadwal kegiatan ekstrakurikuler, kuis, dan prestasi siswa.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 font-sans"
          >
            <span>← Kembali ke Beranda</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchCategory(e.target.value)}
                placeholder="Cari kata kunci pengumuman..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['ALL', 'Penting', 'Informasi', 'Jadwal', 'Lomba'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Belum ada pemberitahuan yang diterbitkan.
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all ${
                  item.isPinned
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded shadow-xs">
                        <Pin className="w-3 h-3 fill-current" />
                        Penting / Pinned
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.category === 'Penting'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : item.category === 'Lomba'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : item.category === 'Jadwal'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 shrink-0">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-3">
                  {item.title}
                </h4>

                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {item.content}
                </div>

                {item.authorName && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Diterbitkan oleh: <strong>{item.authorName}</strong>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Platform Komputer Ceria
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Megaphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                Pusat Informasi
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Pemberitahuan & Pengumuman Resmi
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchCategory(e.target.value)}
                placeholder="Cari kata kunci pengumuman..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['ALL', 'Penting', 'Informasi', 'Jadwal', 'Lomba'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements List Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredAnnouncements.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Belum ada pemberitahuan yang sesuai dengan pencarian.
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isPinned
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs">
                        <Pin className="w-3 h-3 fill-current" />
                        Penting / Ditatap
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.category === 'Penting'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : item.category === 'Lomba'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : item.category === 'Jadwal'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                  {item.title}
                </h4>

                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  {item.content}
                </div>

                {item.authorName && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Diterbitkan oleh: <strong>{item.authorName}</strong>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Pemberitahuan Resmi
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Pemberitahuan
          </button>
        </div>
      </div>
    </div>
  );
};
