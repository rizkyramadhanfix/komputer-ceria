import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Keyboard,
  Lock,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { User } from '../../types';
import { getStudentUnlockedAchievements } from '../../services/storageService';

interface AchievementsWidgetProps {
  student: User;
}

export const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ student }) => {
  const achievements = getStudentUnlockedAchievements(student);
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Keyboard':
        return <Keyboard className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4" />
              Lencana & Medali Prestasi
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">
              {unlockedCount} dari {totalCount} Lencana Terbuka ({percent}%)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Pencapaian Khusus Siswa
          </h2>
          <p className="text-xs text-slate-500">
            Kumpulkan seluruh medali penghargaan dari ketuntasan materi, kecepatan mengetik, kuis, dan game!
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full sm:w-48 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span>Koleksi Lencana</span>
            <span className="text-indigo-600 dark:text-indigo-400">{percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {achievements.map(({ achievement: ach, isUnlocked, progressText }) => (
          <div
            key={ach.id}
            className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              isUnlocked
                ? 'bg-gradient-to-br from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-xs'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75'
            }`}
          >
            <div>
              {/* Badge Icon & Status */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Terbuka
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Terkunci
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {ach.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {ach.description}
              </p>
            </div>

            {/* Bottom Progress Text & Reward */}
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span
                className={`font-semibold ${
                  isUnlocked
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {progressText}
              </span>

              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                +{ach.rewardPoints} Pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
