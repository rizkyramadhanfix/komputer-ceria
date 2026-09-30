import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton: React.FC<{ className?: string; variant?: 'default' | 'hero' | string }> = ({
  className = '',
  variant = 'default',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction if browser doesn't support direct prompt
      alert('Untuk memasang aplikasi ini di layar utama:\n- Di Chrome: Klik menu titik tiga (⋮) > Pasang/Install aplikasi.\n- Di iPhone/Safari: Klik tombol Share (Bagikan) > Tambahkan ke Layar Utama.');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error during PWA install prompt:', err);
    }
  };

  if (isInstalled) {
    if (variant === 'hero') {
      return (
        <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-xs ${className}`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Aplikasi Terpasang</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        Terpasang di Perangkat
      </span>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={handleInstallClick}
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${className}`}
        title="Pasang aplikasi Komputer Ceria ke layar utama komputer atau smartphone Anda"
      >
        <Download className="w-4 h-4 text-amber-300" />
        <span>Install Aplikasi (PWA)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-500/20 dark:hover:bg-indigo-600 dark:text-indigo-300 dark:hover:text-white transition-all duration-200 border border-indigo-200 dark:border-indigo-800/60 shadow-xs cursor-pointer ${className}`}
      title="Pasang aplikasi Komputer Ceria ke layar utama komputer atau smartphone Anda"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install Aplikasi (PWA)</span>
    </button>
  );
};
