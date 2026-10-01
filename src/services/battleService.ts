import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { GameBattle, User } from '../types';

const BATTLES_STORAGE_KEY = 'ekskul_game_battles';

function getLocalBattles(): GameBattle[] {
  try {
    const raw = localStorage.getItem(BATTLES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBattles(battles: GameBattle[]): void {
  try {
    localStorage.setItem(BATTLES_STORAGE_KEY, JSON.stringify(battles));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ekskul_battle_updated'));
    }
  } catch (err) {
    console.warn('saveLocalBattles error:', err);
  }
}

export const createBattleChallenge = async (
  challenger: User,
  opponent: User,
  gameType: 'quiz_duel' | 'typing_race',
  customData?: { questionIndices?: number[]; typingText?: string }
): Promise<string> => {
  const defaultIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  const battleId = `battle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  // Clean data: Ensure NO undefined values are passed to Firestore!
  const cleanBattleData: GameBattle = {
    id: battleId,
    gameType,
    status: 'pending',
    challengerId: challenger.id || '',
    challengerName: challenger.name || 'Siswa',
    challengerAvatar: challenger.avatarUrl || '',
    opponentId: opponent.id || '',
    opponentName: opponent.name || 'Siswa',
    opponentAvatar: opponent.avatarUrl || '',
    currentRound: 0,
    challengerScore: 0,
    opponentScore: 0,
    questionIndices: customData?.questionIndices || defaultIndices,
    typingText: customData?.typingText || '',
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // 1. Always save to local storage first for instant reliability
  const localBattles = getLocalBattles();
  localBattles.unshift(cleanBattleData);
  saveLocalBattles(localBattles.slice(0, 50));

  // 2. Sync to Firestore in background
  try {
    await setDoc(doc(db, 'gameBattles', battleId), {
      ...cleanBattleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore setDoc battle fallback to local storage:', err);
  }

  return battleId;
};

export const acceptChallenge = async (battleId: string) => {
  // Update local
  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  if (idx !== -1) {
    battles[idx].status = 'active';
    battles[idx].updatedAt = new Date().toISOString();
    saveLocalBattles(battles);
  }

  // Update Firestore
  try {
    const battleRef = doc(db, 'gameBattles', battleId);
    await updateDoc(battleRef, {
      status: 'active',
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('acceptChallenge Firestore warning:', err);
  }
};

export const cancelChallenge = async (battleId: string) => {
  // Update local
  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  if (idx !== -1) {
    battles[idx].status = 'cancelled';
    battles[idx].updatedAt = new Date().toISOString();
    saveLocalBattles(battles);
  }

  // Update Firestore
  try {
    const battleRef = doc(db, 'gameBattles', battleId);
    await updateDoc(battleRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('cancelChallenge Firestore warning:', err);
  }
};

export const updateBattleState = async (battleId: string, updates: Partial<GameBattle>) => {
  // Clean undefined values
  const cleanUpdates: any = {};
  Object.keys(updates).forEach((key) => {
    const val = (updates as any)[key];
    if (val !== undefined) {
      cleanUpdates[key] = val;
    }
  });

  // Update local
  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  if (idx !== -1) {
    battles[idx] = { ...battles[idx], ...cleanUpdates, updatedAt: new Date().toISOString() };
    saveLocalBattles(battles);
  }

  // Update Firestore
  try {
    const battleRef = doc(db, 'gameBattles', battleId);
    await updateDoc(battleRef, {
      ...cleanUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('updateBattleState Firestore warning:', err);
  }
};

export const subscribeToBattles = (
  userId: string,
  onUpdate: (battles: GameBattle[]) => void
) => {
  const triggerUpdate = (firestoreBattles: GameBattle[] = []) => {
    const local = getLocalBattles().filter((b) => b.opponentId === userId && b.status === 'pending');
    const combinedMap = new Map<string, GameBattle>();

    local.forEach((b) => combinedMap.set(b.id, b));
    firestoreBattles.forEach((b) => combinedMap.set(b.id, b));

    const list = Array.from(combinedMap.values()).filter((b) => b.status === 'pending');
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list.slice(0, 5));
  };

  // Initial trigger
  triggerUpdate();

  // Local event listener
  const handleLocalUpdate = () => triggerUpdate();
  if (typeof window !== 'undefined') {
    window.addEventListener('ekskul_battle_updated', handleLocalUpdate);
  }

  // Firestore listener
  let unsubFirestore = () => {};
  try {
    const q = query(
      collection(db, 'gameBattles'),
      where('opponentId', '==', userId)
    );

    unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        const fsBattles: GameBattle[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === 'pending') {
            fsBattles.push({
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
            } as GameBattle);
          }
        });
        triggerUpdate(fsBattles);
      },
      (err) => {
        console.warn('subscribeToBattles Firestore warning:', err);
      }
    );
  } catch (e) {
    console.warn('subscribeToBattles Firestore query catch:', e);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('ekskul_battle_updated', handleLocalUpdate);
    }
    unsubFirestore();
  };
};

export const subscribeToActiveBattle = (
  battleId: string,
  onUpdate: (battle: GameBattle | null) => void
) => {
  const triggerUpdate = (fsBattle: GameBattle | null = null) => {
    if (fsBattle) {
      onUpdate(fsBattle);
      return;
    }
    const local = getLocalBattles().find((b) => b.id === battleId);
    if (local) {
      onUpdate(local);
    }
  };

  triggerUpdate();

  const handleLocalUpdate = () => triggerUpdate();
  if (typeof window !== 'undefined') {
    window.addEventListener('ekskul_battle_updated', handleLocalUpdate);
  }

  let unsubFirestore = () => {};
  try {
    const battleRef = doc(db, 'gameBattles', battleId);
    unsubFirestore = onSnapshot(
      battleRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const b: GameBattle = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
          } as GameBattle;
          triggerUpdate(b);
        }
      },
      (err) => {
        console.warn(`subscribeToActiveBattle(${battleId}) Firestore warning:`, err);
      }
    );
  } catch (e) {
    console.warn(`subscribeToActiveBattle(${battleId}) catch:`, e);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('ekskul_battle_updated', handleLocalUpdate);
    }
    unsubFirestore();
  };
};
