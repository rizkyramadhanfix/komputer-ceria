import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Trophy,
  BookOpen,
  Keyboard,
  X,
  ChevronLeft,
  ChevronRight,
  School,
  Tag,
} from 'lucide-react';

interface AgendaItem {
  id: string;
  title: string;
  category: 'Praktikum' | 'Ujian Kuis' | 'Lomba Mengetik' | 'Pembagian Sertifikat';
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  schoolTarget: string;
  description: string;
}

const DEFAULT_AGENDAS: AgendaItem[] = [
  {
    id: 'ag-1',
    title: 'Praktikum Pengenalan Hardware & Anatomi Komputer',
    category: 'Praktikum',
    date: '2026-10-05',
    time: '08:00 - 10:00 WIB',
    location: 'Laboratorium Komputer Utama',
    schoolTarget: 'Semua Sekolah Binaan',
    description: 'Bongkar pasang simulator casing PC, pengenalan RAM, Motherboard, dan kabel power supply.',
  },
  {
    id: 'ag-2',
    title: 'Babak Penyisihan Liga Mengetik 10 Jari Cepat',
    category: 'Lomba Mengetik',
    date: '2026-10-12',
    time: '13:00 - 15:00 WIB',
    location: 'Online Platform Komputer Ceria',
    schoolTarget: 'Seluruh Siswa Terdaftar',
    description: 'Tantangan naskah liga mengetik 10 jari serentak untuk menentukan posisi Top 10 Bintang.',
  },
  {
    id: 'ag-3',
    title: 'Kuis Evaluasi Bulanan & Pemformatan Dokumen Word',
    category: 'Ujian Kuis',
    date: '2026-10-20',
    time: '09:00 - 11:30 WIB',
    location: 'Lab Komputer Sekolah',
    schoolTarget: 'Kelas 4, 5, dan 6',
    description: 'Penilaian praktikum pembuatan tabel dan format paragraf Microsoft Word berstandar rapi.',
  },
  {
    id: 'ag-4',
    title: 'Wisuda Portofolio & Penyerahan Sertifikat Berbingkai',
    category: 'Pembagian Sertifikat',
    date: '2026-10-28',
    time: '10:00 - 12:00 WIB',
    location: 'Aula Pusat Ekstrakurikuler',
    schoolTarget: 'Siswa Tingkat Silver & Gold',
    description: 'Penganugerahan sertifikat cetak fisik resmi ber-barcode dan pembagian voucher hadiah sekolah.',
  },
];

interface ActivityCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityCalendarModal: React.FC<ActivityCalendarModalProps> = ({ isOpen, onClose }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = DEFAULT_AGENDAS.filter(
    (a) => filterCategory === 'ALL' || a.category === filterCategory
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Lomba Mengetik':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'Ujian Kuis':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'Pembagian Sertifikat':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      default:
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Kalender Agenda Praktikum & Kegiatan Ekskul
              </h3>
              <p className="text-xs text-slate-500">
                Jadwal praktikum laboratorium, ujian kuis berkala, dan kompetisi mengetik.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold text-[11px] mr-1">Kategori:</span>
          {['ALL', 'Praktikum', 'Lomba Mengetik', 'Ujian Kuis', 'Pembagian Sertifikat'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Agenda' : cat}
            </button>
          ))}
        </div>

        {/* Agenda Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filtered.map((ag) => (
            <div
              key={ag.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border self-start ${getCategoryColor(ag.category)}`}>
                  {ag.category}
                </span>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                    {new Date(ag.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {ag.time}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {ag.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {ag.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {ag.location}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <School className="w-3.5 h-3.5" />
                  {ag.schoolTarget}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada jadwal agenda pada kategori ini.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-slate-800"
          >
            Tutup Kalender
          </button>
        </div>
      </div>
    </div>
  );
};
