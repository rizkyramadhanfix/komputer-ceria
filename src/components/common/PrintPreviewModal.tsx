import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Printer,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  paperOrientation?: 'portrait' | 'landscape';
  pageSize?: string;
  itemCount?: number;
  contentHtml: string;
  onClose: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  title,
  subtitle,
  paperOrientation = 'portrait',
  pageSize = 'A4',
  itemCount = 1,
  contentHtml,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Inject contentHtml into iframe
  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: ${pageSize} ${paperOrientation};
                margin: 0;
              }
              html, body {
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              * {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body>
            ${contentHtml}
          </body>
        </html>
      `);
      doc.close();
      setIsIframeLoaded(true);
    }
  }, [isOpen, contentHtml, paperOrientation, pageSize, title]);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } catch (err) {
        console.error('Iframe print error, falling back to window.print():', err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleOpenNewWindow = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: ${pageSize} ${paperOrientation};
                margin: 0;
              }
              body { margin: 0; padding: 0; background: #ffffff; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            </style>
          </head>
          <body>
            ${contentHtml}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col h-[90vh]">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                  {pageSize} {paperOrientation}
                </span>
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewWindow}
              className="p-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
              title="Buka dokumen di jendela baru untuk dicetak"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Jendela Baru</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Zoom Controls & Info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>
              Iframe Terisolasi: Layout & Warna Terjamin Presisi untuk Hasil Cetak
            </span>
          </div>

          {/* Zoom Level Bar */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Perkecil Ukuran Tampilan"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold w-12 text-center text-indigo-600 dark:text-indigo-400">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Perbesar Ukuran Tampilan"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1 border-l border-slate-200 dark:border-slate-800 pl-1.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Iframe Isolated View Body */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-4 sm:p-6 overflow-auto flex justify-center items-start">
          <div
            className="w-full transition-transform origin-top flex justify-center"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <iframe
              ref={iframeRef}
              title={title}
              className="w-full bg-white shadow-2xl rounded-xl border border-slate-300 dark:border-slate-800 transition-all"
              style={{
                height: '75vh',
                minHeight: '600px',
              }}
            />
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total item:{' '}
            <strong className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
              {itemCount} {itemCount === 1 ? 'Dokumen' : 'Halaman / Kartu'}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
