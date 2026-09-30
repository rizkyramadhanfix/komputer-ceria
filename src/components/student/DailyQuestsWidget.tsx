import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  Gift, 
  Flame, 
  CheckCircle2, 
  Circle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints } from '../../services/storageService';

export const DailyQuestsWidget: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [streakCount, setStreakCount] = useState(1);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [quests, setQuests] = useState([
    { id: 'q1', text: 'Membaca Modul Materi Pembelajaran', points: 15, isDone: false, isClaimed: false },
    { id: 'q2', text: 'Selesaikan Kuis Pilihan Ganda Hari Ini', points: 20, isDone: false, isClaimed: false },
    { id: 'q3', text: 'Latihan Mengetik Kecepatan Word', points: 25, isDone: false, isClaimed: false }
  ]);

  useEffect(() => {
    if (!currentUser) return;

    // Load streak & daily login status from localStorage linked to studentId
    const streakKey = `streak_${currentUser.id}`;
    const lastLoginKey = `last_login_${currentUser.id}`;
    const claimKey = `claimed_today_${currentUser.id}`;
    const questKey = `quests_${currentUser.id}`;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastLogin = localStorage.getItem(lastLoginKey);
    const savedStreak = localStorage.getItem(streakKey);
    const claimedToday = localStorage.getItem(claimKey);

    // Calculate streak
    if (lastLogin) {
      if (lastLogin === todayStr) {
        // logged in today
        setStreakCount(savedStreak ? parseInt(savedStreak, 10) : 1);
        setHasClaimedToday(claimedToday === todayStr);
      } else {
        const lastDate = new Date(lastLogin);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // consecutive login!
          const newStreak = savedStreak ? parseInt(savedStreak, 10) + 1 : 2;
          const cappedStreak = newStreak > 7 ? 1 : newStreak; // cycle every 7 days
          setStreakCount(cappedStreak);
          localStorage.setItem(streakKey, cappedStreak.toString());
        } else {
          // streak broken
          setStreakCount(1);
          localStorage.setItem(streakKey, '1');
        }
        setHasClaimedToday(false);
        localStorage.setItem(claimKey, '');
      }
    } else {
      setStreakCount(1);
      localStorage.setItem(streakKey, '1');
    }

    localStorage.setItem(lastLoginKey, todayStr);

    // Initialize daily missions with random completed states for high playability
    const savedQuests = localStorage.getItem(questKey);
    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    } else {
      // Simulate that some are complete depending on user achievements
      const updated = [
        { id: 'q1', text: 'Membaca Modul Materi Pembelajaran', points: 15, isDone: currentUser.completedLessons.length > 0, isClaimed: false },
        { id: 'q2', text: 'Selesaikan Kuis Pilihan Ganda Hari Ini', points: 20, isDone: Math.random() < 0.5, isClaimed: false },
        { id: 'q3', text: 'Latihan Mengetik Kecepatan Word', points: 25, isDone: Math.random() < 0.4, isClaimed: false }
      ];
      setQuests(updated);
      localStorage.setItem(questKey, JSON.stringify(updated));
    }
  }, [currentUser]);

  const handleClaimDailyLogin = () => {
    if (!currentUser || hasClaimedToday) return;

    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`claimed_today_${currentUser.id}`, todayStr);
    setHasClaimedToday(true);

    const bonusPoints = 10 + (streakCount * 2);
    const starsEarned = Math.max(1, Math.floor(bonusPoints / 10));

    awardStudentPoints(currentUser.id, bonusPoints);
    refreshUser();

    showStarReward(
      starsEarned,
      `Hore! Absensi Harian berhasil diklaim. Kamu mendapatkan +${bonusPoints} Poin (+${starsEarned} ★ Bintang)!`,
      'Bonus Absensi Komputer Ceria'
    );
  };

  const handleClaimQuest = (questId: string, points: number) => {
    if (!currentUser) return;

    const updated = quests.map((q) => {
      if (q.id === questId) {
        return { ...q, isClaimed: true };
      }
      return q;
    });

    setQuests(updated);
    localStorage.setItem(`quests_${currentUser.id}`, JSON.stringify(updated));

    const starsEarned = Math.max(1, Math.floor(points / 10));
    awardStudentPoints(currentUser.id, points);
    refreshUser();

    showStarReward(
      starsEarned,
      `Misi harian selesai! Kamu mengklaim +${points} Poin (+${starsEarned} ★ Bintang)!`,
      'Misi Harian Selesai'
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* 7-Days Login Streak Card */}
      <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>Streak Absensi Harian</span>
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Hari ke-{streakCount} dari 7
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Masuk ke website setiap hari secara berturut-turut untuk meningkatkan bonus poin dan bintang kamu!
          </p>
        </div>

        {/* 7 days grid visual */}
        <div className="grid grid-cols-7 gap-1.5 my-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day < streakCount || (day === streakCount && hasClaimedToday);
            const isToday = day === streakCount && !hasClaimedToday;

            return (
              <div 
                key={day}
                className={`p-1.5 rounded-lg flex flex-col items-center justify-center border text-center transition-all ${
                  isCompleted 
                    ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 text-amber-600 dark:text-amber-400 font-bold' 
                    : isToday
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-300 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-200 animate-pulse'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[9px] block">H{day}</span>
                <div className="w-5 h-5 flex items-center justify-center mt-1">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-amber-500 stroke-[3]" />
                  ) : (
                    <Gift className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClaimDailyLogin}
          disabled={hasClaimedToday}
          className={`w-full py-2 text-center text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            hasClaimedToday
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
          }`}
        >
          {hasClaimedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span>Sudah Absen Hari Ini</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Klaim Absensi Harian (+{10 + streakCount * 2} Poin)</span>
            </>
          )}
        </button>
      </div>

      {/* Daily Quests Card */}
      <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Misi Harian Ekskul Komputer</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Selesaikan misi-misi berikut ini setiap harinya untuk meraup poin bintang ekstra!
          </p>
        </div>

        {/* Quest list */}
        <div className="space-y-3 my-4">
          {quests.map((q) => (
            <div 
              key={q.id}
              className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">
                  {q.isClaimed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  ) : q.isDone ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className={`text-[11px] block font-semibold truncate ${
                    q.isClaimed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {q.text}
                  </span>
                  <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-mono font-bold block mt-0.5">
                    Hadiah: +{q.points} Poin (+{Math.max(1, Math.floor(q.points / 10))} ★)
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                {q.isClaimed ? (
                  <span className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    Selesai
                  </span>
                ) : q.isDone ? (
                  <button
                    onClick={() => handleClaimQuest(q.id, q.points)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-sm cursor-pointer"
                  >
                    Klaim
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-1">
                    Belum
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Misi diperbarui secara acak setiap hari untuk memberikan tantangan menarik!</span>
        </div>
      </div>
    </div>
  );
};
