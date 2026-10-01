import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  CloudCheck,
  RefreshCw,
  Zap,
  Server,
  Wifi,
  WifiOff,
  CheckCircle2,
  Database,
  Smartphone,
  Laptop,
  Radio,
  ChevronDown,
} from 'lucide-react';
import {
  subscribeCloudSync,
  getCloudSyncState,
  pullFullSyncFromServer,
  CloudSyncState,
} from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface CloudSyncStatusButtonProps {
  className?: string;
  showDetailsDropdown?: boolean;
}

export const CloudSyncStatusButton: React.FC<CloudSyncStatusButtonProps> = ({
  className = '',
  showDetailsDropdown = true,
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [syncState, setSyncState] = useState<CloudSyncState>(() => getCloudSyncState());
  const [isOpen, setIsOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('Baru saja');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to live cloud sync state
  useEffect(() => {
    const unsubscribe = subscribeCloudSync((newState) => {
      setSyncState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Update relative time display every 5 seconds
  useEffect(() => {
    const updateRelativeTime = () => {
      if (!syncState.lastSyncTime) {
        setTimeAgo('Menunggu...');
        return;
      }
      const now = Date.now();
      const diffSec = Math.floor((now - new Date(syncState.lastSyncTime).getTime()) / 1000);

      if (diffSec < 5) setTimeAgo('Baru saja');
      else if (diffSec < 60) setTimeAgo(`${diffSec}s lalu`);
      else {
        const diffMin = Math.floor(diffSec / 60);
        setTimeAgo(`${diffMin}m lalu`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 3000);
    return () => clearInterval(interval);
  }, [syncState.lastSyncTime]);

  // Click outside listener for flyout
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerSync = async () => {
    if (isManualSyncing) return;
    setIsManualSyncing(true);
    try {
      const res = await pullFullSyncFromServer();
      if (res.success) {
        showSuccess(res.message || 'Data cloud berhasil ditarik & disinkronkan!', 'Cloud Sync Akurat');
      } else {
        showInfo(res.message || 'Menggunakan database lokal.');
      }
    } catch (err) {
      showError('Gagal menarik data dari server cloud.');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const isSyncing = syncState.status === 'syncing' || isManualSyncing;
  const isOnline = syncState.isOnline && syncState.status !== 'offline';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Modern Badge Button */}
      <button
        type="button"
        onClick={() => {
          if (showDetailsDropdown) {
            setIsOpen(!isOpen);
          } else {
            handleTriggerSync();
          }
        }}
        title="Status Sinkronisasi Cloud Real-Time (Klik untuk detail / tarik data)"
        aria-label="Cloud Sync Status"
        className={`group inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border ${
          isSyncing
            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
            : isOnline
            ? 'bg-emerald-50/80 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
        }`}
      >
        {/* Pulsing Dot Status */}
        <div className="relative flex items-center justify-center">
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" />
          ) : isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>

        {/* Text Details */}
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="hidden md:inline font-bold">
            {isSyncing ? 'Menyinkronkan...' : isOnline ? 'Cloud Sync' : 'Offline'}
          </span>
          <span className="text-[10px] font-mono opacity-75 hidden lg:inline">
            ({timeAgo})
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 transition-transform text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Flyout Panel / Details Dropdown */}
      {isOpen && showDetailsDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-left">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Jalur Data Cloud Server
                </h4>
                <p className="text-[10px] text-slate-500">Tersinkronisasi Real-Time</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Online Live</span>
            </span>
          </div>

          {/* Traffic & Status Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Jalur Hosting:</span>
              <p className="font-bold text-slate-900 dark:text-white text-[11px] truncate flex items-center gap-1">
                <Server className="w-3 h-3 text-indigo-500" />
                <span>Vercel Serverless</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Latensi Jaringan:</span>
              <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-current" />
                <span>~{syncState.latencyMs || 15} ms</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Pembaruan Terakhir:</span>
              <p className="font-bold text-slate-900 dark:text-white text-[11px]">
                {syncState.lastSyncTime
                  ? new Date(syncState.lastSyncTime).toLocaleTimeString('id-ID')
                  : 'Baru saja'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Auto-Sync Loop:</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                Tiap 2.5 Detik
              </p>
            </div>
          </div>

          {/* Multi-Device Connection Callout */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-100">
              <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Multi-Perangkat Terhubung</span>
              <Smartphone className="w-3 h-3 text-indigo-500" />
            </div>
            <p className="opacity-80 leading-relaxed text-[10px]">
              Data nilai siswa, poin & bintang, naskah kuis, dan rekor liga mengetik otomatis terkirim dan tersinkronisasi antar komputer lab, laptop, maupun smartphone secara real-time.
            </p>
          </div>

          {/* Primary Action: Tarik Data Cloud */}
          <button
            type="button"
            disabled={isManualSyncing}
            onClick={() => {
              handleTriggerSync();
              setIsOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
            <span>Tarik & Segarkan Data Cloud Sekarang ⚡</span>
          </button>
        </div>
      )}
    </div>
  );
};
