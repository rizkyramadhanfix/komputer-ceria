import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Laptop,
  Globe,
  Wifi,
  ExternalLink,
  Download,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '../../context/ToastContext';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Retrieve current active origin URL
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://komputer-ceria.web.app';

  // Generate QR Code locally with high contrast and zero network dependency
  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(currentUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#1e1b4b', // Deep Indigo
        light: '#ffffff', // Crisp White
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setCopied(true);
          showSuccess('Tautan website berhasil disalin!', 'Tersalin');
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          showSuccess('Tautan: ' + currentUrl, 'Salin Manual');
        });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Komputer Ceria - Ekstrakurikuler Komputer Sekolah',
          text: 'Ayo belajar komputer, latihan mengetik MS Word, dan mainkan game edukasi seru di Komputer Ceria!',
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'QR-Code-Komputer-Ceria.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showSuccess('Gambar QR Code berhasil diunduh!', 'Unduh');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Hubungkan Perangkat
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 uppercase tracking-tight">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan QR atau bagikan link ke HP / Laptop lain
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* QR Code Container - High Contrast, completely unobstructed */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-indigo-100 dark:border-indigo-900">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Akses Perangkat"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg block"
                />
              ) : (
                <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center text-xs text-slate-400">
                  Membuat QR Code...
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Arahkan Kamera HP / Tablet ke QR Code
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                Kamera akan membaca link secara otomatis untuk membuka aplikasi seketika.
              </p>
            </div>

            {/* Download & Native Share Buttons */}
            <div className="flex items-center gap-2 pt-1 w-full justify-center">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>Unduh Gambar QR</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Bagikan ke WA</span>
              </button>
            </div>
          </div>

          {/* Copy Direct Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Tautan Langsung Website:
              </span>
              <span className="text-[10px] text-slate-400">Salin & buka di browser</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 text-xs font-mono px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl select-all focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Sync status info box */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs space-y-1 text-emerald-900 dark:text-emerald-300">
            <div className="font-bold flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sinkronisasi Otomatis Cloud Firestore</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800/90 dark:text-emerald-400">
              Siswa cukup login dengan NISN / nama yang sama di HP maupun laptop lab. Poin, bintang, dan nilai kuis otomatis saling terhubung.
            </p>
          </div>
        </div>

        {/* Modal Footer (Fixed at bottom) */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => window.open(currentUrl, '_blank')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Tab Baru</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
