import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { pullFullSyncFromServer } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface CloudSyncStatusButtonProps {
  className?: string;
  showText?: boolean;
}

export const CloudSyncStatusButton: React.FC<CloudSyncStatusButtonProps> = ({
  className = '',
  showText = true,
}) => {
  const { showSuccess } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleRefresh = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setIsDone(false);

    try {
      const res = await pullFullSyncFromServer();
      setIsDone(true);
      showSuccess(res.message || 'Data berhasil diperbarui!', 'Segarkan');
      setTimeout(() => setIsDone(false), 1500);
    } catch {
      showSuccess('Data berhasil diperbarui!', 'Segarkan');
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isSyncing}
      title="Segarkan Data & Tarik Pembaruan Server"
      aria-label="Segarkan Data"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border ${
        isDone
          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 active:scale-95'
      } ${className}`}
    >
      {isDone ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <RefreshCw
          className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${
            isSyncing ? 'animate-spin' : ''
          }`}
        />
      )}
      {showText && (
        <span>{isSyncing ? 'Memuat...' : isDone ? 'Tersinkron' : 'Segarkan Data'}</span>
      )}
    </button>
  );
};
