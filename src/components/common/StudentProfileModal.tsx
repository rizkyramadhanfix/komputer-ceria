import React from 'react';
import { X, Star, Zap, Trophy, Award, Shield, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { getBadgeForPoints, getStudentUnlockedAchievements } from '../../services/storageService';
import { Avatar } from './Avatar';
import { BadgePill } from './BadgePill';

interface StudentProfileModalProps {
  student: User | null;
  onClose: () => void;
  isCurrent?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  isCurrent,
}) => {
  if (!student) return null;

  const { currentBadge } = getBadgeForPoints(student.totalPoints);
  const unlockedAchievements = React.useMemo(() => {
    try {
      return getStudentUnlockedAchievements(student).filter((a) => a.isUnlocked);
    } catch {
      return [];
    }
  }, [student]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Close */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Profil Pencapaian Siswa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Center */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Avatar src={student.avatarUrl} name={student.name} size="xl" frame={student.equippedFrame} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {student.equippedTitle && (
                <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs">
                  {student.equippedTitle}
                </span>
              )}
              {student.equippedBadge && (
                <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded shadow-xs">
                  🎖️ {student.equippedBadge}
                </span>
              )}
              <BadgePill tier={currentBadge.tier} size="sm" />
            </div>

            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {student.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {student.grade || 'Kelas -'} · {student.school || 'Sekolah -'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Total Bintang</p>
                <p className="text-base font-black font-mono text-slate-900 dark:text-white">{student.totalStars}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">Poin XP</p>
                <p className="text-base font-black font-mono text-slate-900 dark:text-white">{student.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges & Achievements Showcase */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pameran Badge & Prestasi ({unlockedAchievements.length})</span>
          </h4>

          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {unlockedAchievements.map(({ achievement: ach }) => (
                <div
                  key={ach.id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center gap-2.5 shadow-2xs"
                >
                  <span className="text-base shrink-0">
                    {ach.iconName === 'BookOpen' ? '📖' :
                     ach.iconName === 'Sparkles' ? '✨' :
                     ach.iconName === 'Star' ? '⭐' :
                     ach.iconName === 'Trophy' ? '🏆' :
                     ach.iconName === 'Award' ? '🎖️' :
                     ach.iconName === 'Keyboard' ? '⌨️' :
                     ach.iconName === 'Target' ? '🎯' :
                     ach.iconName === 'Zap' ? '⚡' : '🏅'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4 italic">
              Belum ada badge prestasi yang terbuka.
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <span>Tutup Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
