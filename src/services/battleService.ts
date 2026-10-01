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

async function saveBattleToServer(battle: GameBattle): Promise<void> {
  try {
    await fetch('/api/db/gameBattles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(battle),
    });
  } catch (err) {
    console.warn('Failed to save battle to server:', err);
  }
}

async function fetchBattlesFromServer(): Promise<GameBattle[]> {
  try {
    const res = await fetch('/api/db/gameBattles');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    // Gracefully handle server offline
  }
  return [];
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

  // 1. Save to local storage
  const localBattles = getLocalBattles();
  localBattles.unshift(cleanBattleData);
  saveLocalBattles(localBattles.slice(0, 50));

  // 2. Sync to Server DB
  await saveBattleToServer(cleanBattleData);

  return battleId;
};

export const acceptChallenge = async (battleId: string) => {
  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  let updatedBattle: GameBattle | null = null;

  if (idx !== -1) {
    battles[idx].status = 'active';
    battles[idx].updatedAt = new Date().toISOString();
    saveLocalBattles(battles);
    updatedBattle = battles[idx];
  }

  // Get from server if not found locally, then update
  if (!updatedBattle) {
    const serverBattles = await fetchBattlesFromServer();
    const serverB = serverBattles.find((b) => b.id === battleId);
    if (serverB) {
      serverB.status = 'active';
      serverB.updatedAt = new Date().toISOString();
      updatedBattle = serverB;
    }
  }

  if (updatedBattle) {
    await saveBattleToServer(updatedBattle);
  }
};

export const cancelChallenge = async (battleId: string) => {
  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  let updatedBattle: GameBattle | null = null;

  if (idx !== -1) {
    battles[idx].status = 'cancelled';
    battles[idx].updatedAt = new Date().toISOString();
    saveLocalBattles(battles);
    updatedBattle = battles[idx];
  }

  if (!updatedBattle) {
    const serverBattles = await fetchBattlesFromServer();
    const serverB = serverBattles.find((b) => b.id === battleId);
    if (serverB) {
      serverB.status = 'cancelled';
      serverB.updatedAt = new Date().toISOString();
      updatedBattle = serverB;
    }
  }

  if (updatedBattle) {
    await saveBattleToServer(updatedBattle);
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

  const battles = getLocalBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  let updatedBattle: GameBattle | null = null;

  if (idx !== -1) {
    battles[idx] = { ...battles[idx], ...cleanUpdates, updatedAt: new Date().toISOString() };
    saveLocalBattles(battles);
    updatedBattle = battles[idx];
  }

  if (!updatedBattle) {
    const serverBattles = await fetchBattlesFromServer();
    const serverB = serverBattles.find((b) => b.id === battleId);
    if (serverB) {
      updatedBattle = { ...serverB, ...cleanUpdates, updatedAt: new Date().toISOString() };
    }
  }

  if (updatedBattle) {
    await saveBattleToServer(updatedBattle);
  }
};

export const subscribeToBattles = (
  userId: string,
  onUpdate: (battles: GameBattle[]) => void
) => {
  const triggerUpdate = (serverBattles: GameBattle[] = []) => {
    const local = getLocalBattles().filter((b) => b.opponentId === userId && b.status === 'pending');
    const combinedMap = new Map<string, GameBattle>();

    local.forEach((b) => combinedMap.set(b.id, b));
    serverBattles.forEach((b) => {
      if (b.opponentId === userId && b.status === 'pending') {
        combinedMap.set(b.id, b);
      }
    });

    const list = Array.from(combinedMap.values());
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

  // Set up polling interval to fetch battles from server every 1.5 seconds for instant duels!
  const pollInterval = setInterval(async () => {
    const serverBattles = await fetchBattlesFromServer();
    triggerUpdate(serverBattles);
  }, 1500);

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('ekskul_battle_updated', handleLocalUpdate);
    }
    clearInterval(pollInterval);
  };
};

export const subscribeToActiveBattle = (
  battleId: string,
  onUpdate: (battle: GameBattle | null) => void
) => {
  const triggerUpdate = (serverBattle: GameBattle | null = null) => {
    if (serverBattle) {
      onUpdate(serverBattle);
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

  // Poll server for live updates of active duel game states every 1.5 seconds!
  const pollInterval = setInterval(async () => {
    const serverBattles = await fetchBattlesFromServer();
    const activeB = serverBattles.find((b) => b.id === battleId);
    if (activeB) {
      triggerUpdate(activeB);
    }
  }, 1500);

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('ekskul_battle_updated', handleLocalUpdate);
    }
    clearInterval(pollInterval);
  };
};
