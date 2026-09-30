import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
  idPrefix?: string;
}

export const Captcha: React.FC<CaptchaProps> = ({ onValidate, idPrefix = 'cap' }) => {
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate 5-character alphanumeric string without ambiguous characters
  const generateRandomCode = (): string => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(
        Math.random() * 150
      )}, ${Math.floor(Math.random() * 200)}, 0.4)`;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(100, 116, 139, 0.3)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw characters with subtle rotation & font variations
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';

    const charSpacing = canvas.width / (code.length + 1);
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = (i + 0.6) * charSpacing;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.35;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      // Alternating deep slate and indigo colors for high contrast
      ctx.fillStyle = i % 2 === 0 ? '#1e293b' : '#312e81';
      ctx.fillText(char, -8, 0);
      ctx.restore();
    }
  };

  const regenerate = () => {
    const code = generateRandomCode();
    setCaptchaCode(code);
    setUserInput('');
    setHasInteracted(false);
    onValidate(false);
    setTimeout(() => drawCaptcha(code), 20);
  };

  useEffect(() => {
    regenerate();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    setHasInteracted(true);
    const valid = val.trim() === captchaCode;
    onValidate(valid);
  };

  const isValid = userInput.trim() === captchaCode;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`${idPrefix}-input`}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          Verifikasi Keamanan Captcha
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">Karakter acak</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xs bg-slate-100 dark:bg-slate-800 shrink-0">
          <canvas
            ref={canvasRef}
            width={130}
            height={42}
            className="block select-none"
            aria-label="Gambar Captcha Keamanan"
          />
        </div>

        <button
          type="button"
          onClick={regenerate}
          title="Muat Ulang Captcha"
          aria-label="Muat Ulang Captcha"
          className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="flex-1">
          <input
            id={`${idPrefix}-input`}
            type="text"
            maxLength={5}
            value={userInput}
            onChange={handleChange}
            placeholder="Ketik 5 kode di atas"
            autoComplete="off"
            spellCheck="false"
            className={`w-full px-3 py-2 text-sm font-mono tracking-widest uppercase rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              hasInteracted
                ? isValid
                  ? 'border-emerald-500 focus:ring-emerald-400/30'
                  : 'border-rose-400 focus:ring-rose-400/30'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500/30 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {hasInteracted && !isValid && (
        <p className="text-xs text-rose-500 dark:text-rose-400">
          Kode captcha belum cocok, perhatikan huruf besar dan angka.
        </p>
      )}
      {isValid && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span>✓</span> Captcha terverifikasi dengan benar
        </p>
      )}
    </div>
  );
};
