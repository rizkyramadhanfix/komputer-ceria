import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Code2, Heart, Keyboard, Shield } from 'lucide-react';
import { getGamificationConfig } from '../../services/storageService';
import { BadgeConfig } from '../../types';

export const Footer: React.FC = () => {
  const [badgeList, setBadgeList] = useState<BadgeConfig[]>(() => {
    const config = getGamificationConfig();
    return config?.badges || [];
  });

  useEffect(() => {
    const syncBadges = () => {
      const config = getGamificationConfig();
      if (config?.badges) {
        setBadgeList(config.badges);
      }
    };
    syncBadges();
    window.addEventListener('ekskul_data_updated', syncBadges);
    return () => window.removeEventListener('ekskul_data_updated', syncBadges);
  }, []);

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Komputer Ceria
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              Platform Pembelajaran Ekstrakurikuler Komputer Ceria Berbasis Gamifikasi. Dirancang untuk menumbuhkan minat belajar teknologi, kecepatan mengetik, dan literasi digital siswa sekolah.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Materi Interaktif
              </span>
              <span className="flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
                Word Rich Text Editor
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Bintang & Badge
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 block mb-3">
              Tingkatan Badge
            </span>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              {badgeList.map((badge, idx) => {
                const nextBadge = badgeList[idx + 1];
                const rangeText = nextBadge 
                  ? `${badge.minPoints} - ${nextBadge.minPoints - 1} Poin`
                  : `${badge.minPoints}+ Poin`;

                return (
                  <li key={badge.tier} className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {badge.label || badge.tier}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      ({rangeText})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 block mb-3">
              Informasi Sistem
            </span>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>Akses Online Multi-Device (HP, Tablet, Laptop)</li>
              <li>Database Cloud Firestore Real-time</li>
              <li>Tampilan Responsif (Android, iOS, PC)</li>
              <li>Microsoft Word Simulator 10 Jari</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Ekstrakurikuler Komputer. Hak cipta dilindungi undang-undang.
          </p>

          {/* REQUIRED EXACT FOOTER CREDIT: </> Rzk Digital Studio */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-900/60">
              {'</> Rzk Digital Studio'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
