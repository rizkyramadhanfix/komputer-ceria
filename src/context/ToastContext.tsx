import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Star, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'star';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  starsCount?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number, starsCount?: number) => void;
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  showWarning: (message: string, title?: string, duration?: number) => void;
  showStarReward: (starsCount: number, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 3500, starsCount?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, type, title, message, starsCount };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message: string, title: string = 'Berhasil', duration?: number) => {
      showToast(message, 'success', title, duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, title: string = 'Terjadi Kesalahan', duration?: number) => {
      showToast(message, 'error', title, duration || 4500);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Informasi', duration?: number) => {
      showToast(message, 'info', title, duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Peringatan', duration?: number) => {
      showToast(message, 'warning', title, duration);
    },
    [showToast]
  );

  const showStarReward = useCallback(
    (starsCount: number, message: string, title: string = 'Selamat! Bintang Baru Diraih!', duration: number = 5000) => {
      showToast(message, 'star', title, duration, starsCount);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showStarReward,
        removeToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <aside aria-label="Notifikasi" className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
              border: 'border-emerald-200 dark:border-emerald-800/80',
              bg: 'bg-white/95 dark:bg-slate-900/95',
              titleColor: 'text-emerald-950 dark:text-emerald-300',
              accent: 'bg-emerald-500',
            },
            error: {
              icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
              border: 'border-rose-200 dark:border-rose-800/80',
              bg: 'bg-white/95 dark:bg-slate-900/95',
              titleColor: 'text-rose-950 dark:text-rose-300',
              accent: 'bg-rose-500',
            },
            warning: {
              icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
              border: 'border-amber-200 dark:border-amber-800/80',
              bg: 'bg-white/95 dark:bg-slate-900/95',
              titleColor: 'text-amber-950 dark:text-amber-300',
              accent: 'bg-amber-500',
            },
            info: {
              icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
              border: 'border-indigo-200 dark:border-indigo-800/80',
              bg: 'bg-white/95 dark:bg-slate-900/95',
              titleColor: 'text-indigo-950 dark:text-indigo-300',
              accent: 'bg-indigo-500',
            },
            star: {
              icon: (
                <div className="relative shrink-0 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-400 animate-bounce" />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              ),
              border: 'border-amber-400 dark:border-amber-600/90 ring-2 ring-amber-400/20 shadow-amber-500/10',
              bg: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900',
              titleColor: 'text-amber-950 dark:text-amber-200 font-extrabold flex items-center gap-1.5',
              accent: 'bg-amber-500',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-3.5 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-3 duration-200 flex items-start gap-3`}
            >
              {/* Left Accent Bar */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${config.accent}`} />

              <div className="pt-0.5">{config.icon}</div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1">
                  {toast.title && (
                    <h4 className={`text-xs font-bold leading-tight ${config.titleColor}`}>
                      {toast.title}
                    </h4>
                  )}
                  {toast.starsCount !== undefined && toast.starsCount > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs font-mono shrink-0 animate-pulse">
                      +{toast.starsCount} ★
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug mt-0.5 break-words">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors shrink-0"
                aria-label="Tutup Notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
