import React, { useState } from 'react';
import {
  Globe,
  Github,
  CheckCircle2,
  ExternalLink,
  X,
  Code2,
  Terminal,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Initial Release Komputer Ceria"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/komputer-ceria.git
git push -u origin main`;

  const vercelJsonContent = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Panduan Deploy GitHub & Vercel
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Online 24/7
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Langkah-demi-langkah menghubungkan web ke internet terpusat secara gratis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
          {/* Intro Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
            <div className="flex items-center gap-2 font-black text-indigo-900 dark:text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Aplikasi Siap Online Multi-Perangkat</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Aplikasi ini sudah dikonfigurasi dengan sistem basis data server online terpusat. Dengan melakukan deploy ke <strong>Vercel</strong>, semua siswa dari berbagai perangkat (HP, Laptop, PC Lab Sekolah) dapat belajar dan terhubung dalam 1 database yang sama secara real-time.
            </p>
          </div>

          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              <Github className="w-4 h-4 text-indigo-600" />
              <span>Unggah Kode ke GitHub</span>
            </div>

            <div className="pl-8 space-y-3 text-xs">
              <p>
                1. Buka <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline inline-flex items-center gap-0.5">github.com <ExternalLink className="w-3 h-3" /></a> lalu buat repositori baru bernama <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 font-bold">komputer-ceria</code>.
              </p>
              <p>
                2. Unggah berkas proyek Anda. Jika menggunakan terminal, jalankan perintah berikut:
              </p>

              <div className="relative bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 group">
                <button
                  type="button"
                  onClick={() => copyToClipboard(gitCommands, 1)}
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
                <pre>{gitCommands}</pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Hubungkan ke Vercel</span>
            </div>

            <div className="pl-8 space-y-2 text-xs">
              <p>
                1. Masuk ke <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-3 h-3" /></a> menggunakan akun GitHub Anda.
              </p>
              <p>
                2. Klik <strong>Add New... $\rightarrow$ Project</strong>, lalu pilih repositori <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 font-bold">komputer-ceria</code>.
              </p>
              <p>
                3. Pastikan konfigurasi Build:
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                <div><span className="text-slate-400">Framework Preset:</span> <strong>Vite</strong></div>
                <div><span className="text-slate-400">Build Command:</span> <code className="font-mono text-indigo-600">npm run build</code></div>
                <div><span className="text-slate-400">Output Directory:</span> <code className="font-mono text-indigo-600">dist</code></div>
                <div><span className="text-slate-400">Install Command:</span> <code className="font-mono text-indigo-600">npm install</code></div>
              </div>

              <p>
                4. Klik tombol <strong>Deploy</strong>. Dalam 1-2 menit, aplikasi Anda sudah dapat diakses online di seluruh dunia!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Konfigurasi Vercel Rewrite (`vercel.json`)</span>
            </div>

            <div className="pl-8 space-y-2 text-xs">
              <p>
                Proyek ini sudah dilengkapi berkas <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 font-bold">vercel.json</code> untuk mencegah error 404 saat melakukan refresh halaman:
              </p>

              <div className="relative bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                <button
                  type="button"
                  onClick={() => copyToClipboard(vercelJsonContent, 2)}
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedIndex === 2 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
                <pre>{vercelJsonContent}</pre>
              </div>
            </div>
          </div>

          {/* Custom Domain Section */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold">
              <Globe className="w-4 h-4 text-amber-600" />
              <span>Domain Sekolah Kustom (Opsional)</span>
            </div>
            <p className="leading-relaxed">
              Jika sekolah Anda memiliki domain sendiri (contoh: <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">komputerceria.sch.id</code>), tambahkan domain tersebut di menu <strong>Settings $\rightarrow$ Domains</strong> di Dashboard Vercel, lalu arahkan DNS A Record ke IP <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">76.76.21.21</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Panduan juga tersedia dalam berkas <code className="font-mono font-bold text-slate-700 dark:text-slate-300">PANDUAN_DEPLOY_VERCEL.md</code>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
