import React, { useState, useRef, useEffect } from 'react';
import {
  Paintbrush,
  Eraser,
  PaintBucket,
  Pipette,
  Trash2,
  Download,
  Share2,
  Sparkles,
  Grid,
  Check,
  Undo2,
} from 'lucide-react';
import { getActiveUser, awardStudentPoints, saveGalleryWork } from '../../services/storageService';

const PALETTES = [
  {
    name: 'Retro 8-Bit',
    colors: ['#000000', '#ffffff', '#7c3f58', '#eb6b6f', '#f9a875', '#fff6d3', '#2c1e74', '#63c74d', '#3e8948', '#265c42', '#193c3e', '#124e89', '#0099db', '#2ce8f5', '#ff0044', '#ffd700'],
  },
  {
    name: 'GameBoy Klasik',
    colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#000000', '#ffffff'],
  },
  {
    name: 'Cyberpunk Neon',
    colors: ['#0d0221', '#0f084b', '#26408b', '#a6cfd5', '#c2e7d9', '#ff007f', '#00f0ff', '#ffe600', '#39ff14'],
  },
];

const TEMPLATES: Record<string, { size: number; grid: string[] }> = {
  heart: {
    size: 16,
    grid: [
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ff0044','#ff0044','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ],
  },
};

interface PixelArtStudioProps {
  onPublished?: () => void;
  onCancel?: () => void;
}

export const PixelArtStudio: React.FC<PixelArtStudioProps> = ({
  onPublished,
  onCancel,
}) => {
  const [gridSize, setGridSize] = useState<16 | 24>(16);
  const [pixels, setPixels] = useState<string[]>(() =>
    Array(16 * 16).fill('#ffffff')
  );
  const [history, setHistory] = useState<string[][]>([]);
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser' | 'bucket' | 'picker'>('pencil');
  const [showGridLines, setShowGridLines] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize pixels when grid size changes
  const handleSizeChange = (newSize: 16 | 24) => {
    setGridSize(newSize);
    setPixels(Array(newSize * newSize).fill('#ffffff'));
    setHistory([]);
  };

  const saveHistory = () => {
    setHistory((prev) => [...prev.slice(-15), [...pixels]]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setPixels(prev);
    setHistory((h) => h.slice(0, -1));
  };

  // Flood fill algorithm
  const floodFill = (targetIdx: number, fillColor: string) => {
    const targetColor = pixels[targetIdx];
    if (targetColor === fillColor) return;

    const newPixels = [...pixels];
    const queue = [targetIdx];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const idx = queue.pop()!;
      if (visited.has(idx)) continue;
      visited.add(idx);

      if (newPixels[idx] === targetColor) {
        newPixels[idx] = fillColor;

        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;

        if (row > 0) queue.push(idx - gridSize);
        if (row < gridSize - 1) queue.push(idx + gridSize);
        if (col > 0) queue.push(idx - 1);
        if (col < gridSize - 1) queue.push(idx + 1);
      }
    }
    saveHistory();
    setPixels(newPixels);
  };

  const handlePixelAction = (idx: number) => {
    if (activeTool === 'picker') {
      setCurrentColor(pixels[idx]);
      setActiveTool('pencil');
      return;
    }

    if (activeTool === 'bucket') {
      floodFill(idx, currentColor);
      return;
    }

    const colorToApply = activeTool === 'eraser' ? '#ffffff' : currentColor;
    if (pixels[idx] === colorToApply) return;

    saveHistory();
    const newPixels = [...pixels];
    newPixels[idx] = colorToApply;
    setPixels(newPixels);
  };

  const handlePointerDown = (idx: number) => {
    setIsDrawing(true);
    handlePixelAction(idx);
  };

  const handlePointerEnter = (idx: number) => {
    if (isDrawing && (activeTool === 'pencil' || activeTool === 'eraser')) {
      const colorToApply = activeTool === 'eraser' ? '#ffffff' : currentColor;
      if (pixels[idx] !== colorToApply) {
        const newPixels = [...pixels];
        newPixels[idx] = colorToApply;
        setPixels(newPixels);
      }
    }
  };

  const handleClear = () => {
    if (confirm('Kosongkan kanvas pixel art?')) {
      saveHistory();
      setPixels(Array(gridSize * gridSize).fill('#ffffff'));
    }
  };

  const applyTemplate = (key: string) => {
    const t = TEMPLATES[key];
    if (t) {
      saveHistory();
      setGridSize(t.size as 16 | 24);
      setPixels([...t.grid]);
    }
  };

  // Export to PNG Image
  const generatePngDataUrl = (): string => {
    const canvas = document.createElement('canvas');
    const scale = 20; // 16 * 20 = 320px
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < pixels.length; i++) {
      const x = (i % gridSize) * scale;
      const y = Math.floor(i / gridSize) * scale;
      ctx.fillStyle = pixels[i];
      ctx.fillRect(x, y, scale, scale);
    }

    return canvas.toDataURL('image/png');
  };

  const handleDownload = () => {
    const url = generatePngDataUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-art-sdnsukadamai2-${Date.now()}.png`;
    a.click();
  };

  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const handleShareToGallery = () => {
    const user = getActiveUser();
    if (!user) return;

    // 1. Anti-Cheat: Validate that the artwork is not empty/blank
    const coloredPixels = pixels.filter((color) => color !== '#ffffff').length;
    if (coloredPixels < 3) {
      setShareNotice('Gambarlah beberapa piksel warna terlebih dahulu sebelum membagikan ke galeri!');
      setTimeout(() => setShareNotice(null), 3000);
      return;
    }

    // 2. Anti-Cheat: Daily artwork reward limit check (max 2 rewarded shares per day)
    const todayStr = new Date().toISOString().split('T')[0];
    const shareKey = `gallery_share_count_${user.id}_${todayStr}`;
    const currentSharesToday = parseInt(localStorage.getItem(shareKey) || '0', 10);

    const dataUrl = generatePngDataUrl();
    saveGalleryWork({
      studentId: user.id,
      studentName: user.name,
      studentGrade: user.grade,
      studentSchool: user.school,
      title: `Pixel Art Kreasi ${user.name}`,
      category: 'Pixel Art 8-Bit',
      type: 'pixel-art',
      imageUrl: dataUrl,
      previewText: `Karya seni 8-bit dibuat di Pixel Art Studio Komputer Ceria (${gridSize}x${gridSize}).`,
    });

    if (currentSharesToday < 2) {
      localStorage.setItem(shareKey, String(currentSharesToday + 1));
      awardStudentPoints(user.id, 50, { actionCategory: 'gallery_publish' });
      setShareNotice('✨ Karya berhasil dipublikasikan ke Galeri Siswa (+50 Poin Bintang)!');
    } else {
      setShareNotice('✨ Karya berhasil dipublikasikan ke Galeri Siswa! (Batas reward harian 2/2 tercapai)');
    }

    setShareSuccess(true);
    if (onPublished) {
      setTimeout(() => {
        onPublished();
      }, 1500);
    }
    setTimeout(() => {
      setShareSuccess(false);
      setShareNotice(null);
    }, 4500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Share Notification Banner */}
      {shareNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{shareNotice}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Studio Desain Grafis & Galeri
            </span>
            <span className="text-xs text-slate-500">Resolusi Retro {gridSize}x{gridSize}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Pixel Art Studio 8-Bit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pelajari konsep titik piksel, palet warna RGB, dan buat ikon retro komputer atau karakter game favoritmu!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              ← Kembali ke Galeri
            </button>
          )}
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download gambar PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan PNG</span>
          </button>
          <button
            onClick={handleShareToGallery}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke Galeri (+50 Poin)</span>
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Karya pixel art Anda berhasil dipamerkan di Mading Galeri Sekolah dan +50 poin telah diklaim!</span>
        </div>
      )}

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Toolbar & Palettes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Tools Selector */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Peralatan Gambar
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTool('pencil')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTool === 'pencil'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title="Pensil Piksel"
              >
                <Paintbrush className="w-4 h-4" />
                <span className="text-[9px] font-bold">Pensil</span>
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title="Penghapus"
              >
                <Eraser className="w-4 h-4" />
                <span className="text-[9px] font-bold">Hapus</span>
              </button>

              <button
                onClick={() => setActiveTool('bucket')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTool === 'bucket'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title="Ember Cat (Fill)"
              >
                <PaintBucket className="w-4 h-4" />
                <span className="text-[9px] font-bold">Ember</span>
              </button>

              <button
                onClick={() => setActiveTool('picker')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTool === 'picker'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title="Pipet Warna (Eyedropper)"
              >
                <Pipette className="w-4 h-4" />
                <span className="text-[9px] font-bold">Pipet</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                onClick={() => setShowGridLines(!showGridLines)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 cursor-pointer ${
                  showGridLines
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 text-indigo-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-400'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Garis</span>
              </button>
              <button
                onClick={handleClear}
                className="py-1.5 px-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-lg text-xs font-bold cursor-pointer"
                title="Hapus Semua"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Pilihan Warna
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Aktif:</span>
                <div
                  className="w-5 h-5 rounded-md border border-slate-300 shadow-xs"
                  style={{ backgroundColor: currentColor }}
                />
              </div>
            </div>

            {PALETTES.map((pal) => (
              <div key={pal.name} className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">{pal.name}</span>
                <div className="flex flex-wrap gap-1.5">
                  {pal.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrentColor(c);
                        if (activeTool === 'eraser') setActiveTool('pencil');
                      }}
                      className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                        currentColor === c ? 'scale-115 ring-2 ring-indigo-500 ring-offset-1 border-white' : 'border-slate-300 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Warna Kustom:</span>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>

          {/* Quick Inspirations & Grid Size */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Ukuran Kanvas:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSizeChange(16)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    gridSize === 16 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border text-slate-600'
                  }`}
                >
                  16x16
                </button>
                <button
                  onClick={() => handleSizeChange(24)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    gridSize === 24 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border text-slate-600'
                  }`}
                >
                  24x24
                </button>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Template Contoh:</span>
              <button
                onClick={() => applyTemplate('heart')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                ❤️ Pola Hati Pixel 8-Bit
              </button>
            </div>
          </div>
        </div>

        {/* Right Canvas Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[460px]">
          <div
            className="grid shadow-2xl rounded-sm overflow-hidden select-none bg-white touch-none"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: gridSize === 16 ? '340px' : '400px',
              height: gridSize === 16 ? '340px' : '400px',
            }}
            onPointerUp={() => setIsDrawing(false)}
            onPointerLeave={() => setIsDrawing(false)}
          >
            {pixels.map((color, idx) => (
              <div
                key={idx}
                onPointerDown={() => handlePointerDown(idx)}
                onPointerEnter={() => handlePointerEnter(idx)}
                className={`transition-colors cursor-crosshair ${
                  showGridLines ? 'border-[0.5px] border-slate-200/80 dark:border-slate-800/40' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            💡 <strong>Tips:</strong> Klik atau geser mouse untuk menggambar. Setiap kotak mewakili 1 piksel layar komputer!
          </p>
        </div>
      </div>
    </div>
  );
};
