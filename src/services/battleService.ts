import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { GameBattle, User } from '../types';

export const createBattleChallenge = async (
  challenger: User,
  opponent: User,
  gameType: 'quiz_duel' | 'typing_race'
): Promise<string> => {
  const battleData: Omit<GameBattle, 'id' | 'createdAt' | 'updatedAt'> = {
    gameType,
    status: 'pending',
    challengerId: challenger.id,
    challengerName: challenger.name,
    challengerAvatar: challenger.avatarUrl,
    opponentId: opponent.id,
    opponentName: opponent.name,
    opponentAvatar: opponent.avatarUrl,
    currentRound: 0,
    challengerScore: 0,
    opponentScore: 0,
  };

  const docRef = await addDoc(collection(db, 'gameBattles'), {
    ...battleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const acceptChallenge = async (battleId: string) => {
  const battleRef = doc(db, 'gameBattles', battleId);
  await updateDoc(battleRef, {
    status: 'active',
    updatedAt: serverTimestamp(),
  });
};

export const cancelChallenge = async (battleId: string) => {
  const battleRef = doc(db, 'gameBattles', battleId);
  await updateDoc(battleRef, {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
};

export const updateBattleState = async (battleId: string, updates: Partial<GameBattle>) => {
  const battleRef = doc(db, 'gameBattles', battleId);
  await updateDoc(battleRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToBattles = (
  userId: string,
  onUpdate: (battles: GameBattle[]) => void
) => {
  const q = query(
    collection(db, 'gameBattles'),
    where('opponentId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  return onSnapshot(q, (snapshot) => {
    const battles: GameBattle[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      battles.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as GameBattle);
    });
    onUpdate(battles);
  });
};

export const subscribeToActiveBattle = (
  battleId: string,
  onUpdate: (battle: GameBattle | null) => void
) => {
  const battleRef = doc(db, 'gameBattles', battleId);
  return onSnapshot(battleRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      onUpdate({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as GameBattle);
    } else {
      onUpdate(null);
    }
  });
};
