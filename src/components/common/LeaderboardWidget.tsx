import React, { useState } from 'react';
import { Award, Crown, Medal, Sparkles, Star, Trophy, Swords, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getBadgeForPoints } from '../../services/storageService';
import { createBattleChallenge } from '../../services/battleService';
import { User } from '../../types';
import { Avatar } from './Avatar';
import { BadgePill } from './BadgePill';
import { StudentProfileModal } from './StudentProfileModal';

interface LeaderboardWidgetProps {
  limit?: number;
  showAll?: boolean;
  showChallenge?: boolean;
  onChallengeInitiated?: (battleId: string, gameType: 'quiz_duel' | 'typing_race') => void;
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  limit = 10,
  showAll = false,
  showChallenge = false,
  onChallengeInitiated,
}) => {
  const { users, currentUser } = useAuth();
  const { showInfo, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const handleChallenge = async (student: User, gameType: 'quiz_duel' | 'typing_race' = 'quiz_duel') => {
    if (!currentUser) return;
    try {
      const newBattleId = await createBattleChallenge(currentUser, student, gameType);
      showInfo(`Tantangan duel ${gameType === 'typing_race' ? 'balap ketik' : 'kuis'} dikirim ke ${student.name}!`, 'Tantangan Dikirim');
      if (onChallengeInitiated) {
        onChallengeInitiated(newBattleId, gameType);
      }
    } catch (err) {
      console.error(err);
      showError('Gagal mengirim tantangan duel.');
    }
  };

  // Filter students only, sort descending by totalPoints, and apply search
  const students = users
    .filter((u) => u.role === 'student' && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const displayList = showAll ? students : students.slice(0, limit);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-bold text-xs shadow-xs">
          <Crown className="w-3.5 h-3.5 fill-current" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 font-bold text-xs shadow-xs">
          3
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
        #{rank}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs w-full">
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {showAll ? 'Peringkat Seluruh Siswa Komputer' : 'Leaderboard Top 10 Bintang Siswa'}
          </h3>
        </div>
        
        {showAll && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        )}

        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          {displayList.length} Siswa Teratas
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <table className="w-full text-left text-xs table-auto">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium text-[11px]">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">Rank</th>
              <th className="py-2.5 px-3">Siswa</th>
              {showAll && (
                <>
                  <th className="py-2.5 px-3 hidden md:table-cell">Kelas</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Sekolah</th>
                </>
              )}
              <th className="py-2.5 px-3 text-right">Poin & Bintang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayList.map((student, idx) => {
              const rank = idx + 1;
              const isCurrent = currentUser?.id === student.id;
              const { currentBadge } = getBadgeForPoints(student.totalPoints);

              return (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center align-middle">{getRankBadge(rank)}</td>
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <Avatar src={student.avatarUrl} name={student.name} size="xs" frame={student.equippedFrame} />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-900 dark:text-white font-semibold truncate text-xs">
                            {student.name}
                          </span>
                          {student.equippedTitle && (
                            <span className="text-[8px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.2 rounded">
                              {student.equippedTitle}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[8px] text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.2 rounded font-normal">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {student.school ? `${student.school}` : ''} {student.grade ? `· ${student.grade}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  {showAll && (
                    <>
                      <td className="py-2.5 px-3 hidden md:table-cell text-slate-600 dark:text-slate-300 align-middle">
                        {student.grade || '-'}
                      </td>
                      <td className="py-2.5 px-3 hidden md:table-cell text-slate-600 dark:text-slate-300 align-middle">
                        {student.school || '-'}
                      </td>
                    </>
                  )}
                  <td className="py-2.5 px-3 text-right align-middle">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold font-mono text-xs tabular-nums">
                          <Star className="w-3 h-3 fill-current" />
                          {student.totalStars}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] tabular-nums">
                          {student.totalPoints} pts
                        </span>
                      </div>
                      <BadgePill tier={currentBadge.tier} size="sm" />
                      {showChallenge && currentUser?.role === 'student' && !isCurrent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChallenge(student);
                          }}
                          className="ml-1 p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-xs border border-purple-100 dark:border-purple-800"
                          title={`Tantang ${student.name} Duel Kuis!`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {displayList.length === 0 && (
              <tr>
                <td colSpan={showAll ? 5 : 3} className="py-8 text-center text-slate-400 text-xs">
                  Belum ada data siswa terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onChallenge={showChallenge ? handleChallenge : undefined}
          isCurrent={currentUser?.id === selectedStudent.id}
        />
      )}
    </div>
  );
};

