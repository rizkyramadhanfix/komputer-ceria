import React, { useEffect, useRef, useState } from 'react';
import {
  Circle,
  Download,
  Eraser,
  Image as ImageIcon,
  Minus,
  PaintBucket,
  Paintbrush,
  Palette,
  Pencil,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Square,
  Smile,
  Type,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createGalleryWork } from '../../services/storageService';

interface PaintCanvasProps {
  onPublished?: () => void;
  onCancel?: () => void;
}

type ToolType =
  | 'brush'
  | 'pencil'
  | 'eraser'
  | 'line'
  | 'rect'
  | 'circle'
  | 'bucket'
  | 'text'
  | 'stamp';

const PRESET_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber/Yellow
  '#10b981', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#78350f', // Brown
  '#64748b', // Slate
  '#84cc16', // Lime
];

const STAMPS = ['💻', '⭐', '🚀', '🐱', '🌸', '🌈', '🤖', '🎨', '✨', '🏆', '💡', '❤️'];

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ onPublished, onCancel }) => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<ToolType>('brush');
  const [color, setColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [fillShape, setFillShape] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lukisan Paint Ceria');
  const [selectedStamp, setSelectedStamp] = useState('💻');
  const [canvasText, setCanvasText] = useState('Komputer Ceria');

  // History for Undo / Redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Shape drawing start coordinates
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state
    const initialImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialImg]);
    setHistoryStep(0);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(currentImg);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const prevImg = history[historyStep - 1];
      ctx.putImageData(prevImg, 0, 0);
      setHistoryStep(historyStep - 1);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const nextImg = history[historyStep + 1];
      ctx.putImageData(nextImg, 0, 0);
      setHistoryStep(historyStep + 1);
    }
  };

  const handleClear = () => {
    if (confirm('Hapus seluruh gambar di kanvas?')) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  };

  // Upload image and paint onto canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Harap pilih berkas gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate aspect ratio fit within canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
        const nw = img.width * scale;
        const nh = img.height * scale;
        const nx = (canvas.width - nw) / 2;
        const ny = (canvas.height - nh) / 2;

        ctx.drawImage(img, nx, ny, nw, nh);
        saveToHistory();
        showSuccess('Gambar berhasil diupload ke kanvas Paint!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Preset quick coloring template
  const loadColoringTemplate = (type: 'computer' | 'house') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'computer') {
      setTitle('Mewarnai Komputer Impian');
      // Draw monitor
      ctx.strokeRect(220, 100, 320, 200);
      ctx.strokeRect(235, 115, 290, 170);
      // Stand
      ctx.beginPath();
      ctx.moveTo(350, 300);
      ctx.lineTo(350, 340);
      ctx.lineTo(410, 340);
      ctx.lineTo(410, 300);
      ctx.stroke();
      ctx.strokeRect(320, 340, 120, 15);
      // Keyboard
      ctx.strokeRect(200, 370, 360, 45);
      // Mouse
      ctx.beginPath();
      ctx.ellipse(590, 390, 20, 30, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      setTitle('Pemandangan & Rumah Asri');
      // House body
      ctx.strokeRect(260, 200, 240, 160);
      // Roof
      ctx.beginPath();
      ctx.moveTo(240, 200);
      ctx.lineTo(380, 100);
      ctx.lineTo(520, 200);
      ctx.closePath();
      ctx.stroke();
      // Door & Window
      ctx.strokeRect(350, 260, 60, 100);
      ctx.strokeRect(290, 230, 45, 45);
      ctx.strokeRect(425, 230, 45, 45);
      // Sun
      ctx.beginPath();
      ctx.arc(140, 110, 40, 0, 2 * Math.PI);
      ctx.stroke();
    }

    saveToHistory();
    showSuccess('Template gambar dimuat! Silakan warnai dengan kuas atau cat tumpah.');
  };

  // Get mouse or touch coordinates relative to canvas
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    startPos.current = { x, y };
    setIsDrawing(true);

    if (tool === 'bucket') {
      // Fill canvas background
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
      setIsDrawing(false);
      return;
    }

    if (tool === 'stamp') {
      // Stamp emoji on canvas
      ctx.font = `${Math.max(28, strokeWidth * 6)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      saveToHistory();
      setIsDrawing(false);
      return;
    }

    if (tool === 'text') {
      // Text on canvas
      ctx.font = `bold ${Math.max(16, strokeWidth * 4)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(canvasText || 'Teks Komputer', x, y);
      saveToHistory();
      setIsDrawing(false);
      return;
    }

    if (tool === 'brush' || tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'pencil' ? 2 : strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      // For shapes, save snapshot
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (tool === 'brush' || tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      // Restore before drawing shape preview
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'rect') {
        const width = x - startPos.current.x;
        const height = y - startPos.current.y;
        if (fillShape) {
          ctx.fillRect(startPos.current.x, startPos.current.y, width, height);
        } else {
          ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
        }
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
        if (fillShape) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveToHistory();
  };

  const handlePublish = () => {
    if (!currentUser) {
      showError('Silakan login terlebih dahulu untuk mempublikasikan karya.');
      return;
    }

    if (!title.trim()) {
      showError('Harap berikan judul untuk karya lukisan Anda.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    createGalleryWork({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatarUrl,
      studentGrade: currentUser.grade || 'Siswa',
      studentSchool: currentUser.school || 'Sekolah Terdaftar',
      title: title.trim(),
      category: category,
      type: 'paint',
      imageUrl: dataUrl,
      previewText: `Lukisan kreatif digital bertema ${category} oleh ${currentUser.name}.`,
    });

    showSuccess('Lukisan Anda berhasil dipublikasikan ke Galeri Siswa!', 'Galeri Paint');
    if (onPublished) onPublished();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl space-y-4">
      {/* Hidden file input for uploading images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Title & Category Bar */}
      <div className="p-4 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 dark:from-slate-950 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Aplikasi Menggambar Ceria (Paint Canvas)
            </h3>
            <p className="text-[11px] text-slate-500">
              Gunakan kuas, pensil, bentuk geometri, stempel stiker, warna-warni, serta upload gambar!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Batal
            </button>
          )}
          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publikasikan Lukisan</span>
          </button>
        </div>
      </div>

      {/* Meta Input Bar */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Judul Lukisan:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Rumah Impian dan Laboratorium Komputer"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Kategori Karya:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            <option value="Lukisan Paint Ceria">Lukisan Paint Ceria</option>
            <option value="Pemandangan & Alam">Pemandangan & Alam</option>
            <option value="Karakter & Kartun">Karakter & Kartun</option>
            <option value="Desain Komputer & Robot">Desain Komputer & Robot</option>
          </select>
        </div>
      </div>

      {/* Quick Templates & Upload Bar */}
      <div className="mx-4 p-2.5 bg-pink-50/60 dark:bg-pink-950/30 rounded-xl border border-pink-100 dark:border-pink-900/50 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 uppercase">
            Template & Gambar:
          </span>
          <button
            type="button"
            onClick={() => loadColoringTemplate('computer')}
            className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 rounded-lg hover:bg-pink-100"
          >
            💻 Template Komputer
          </button>
          <button
            type="button"
            onClick={() => loadColoringTemplate('house')}
            className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 rounded-lg hover:bg-pink-100"
          >
            🏡 Template Rumah
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 text-[11px] font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>+ Upload Gambar / Foto</span>
        </button>
      </div>

      {/* Paint Ribbon Toolbar */}
      <div className="mx-4 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Tools Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTool('brush')}
              title="Kuas Lukis (Brush)"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'brush'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('pencil')}
              title="Pensil Halus"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'pencil'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              title="Penghapus (Eraser)"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'eraser'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('line')}
              title="Garis Lurus"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'line'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('rect')}
              title="Kotak / Persegi"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'rect'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('circle')}
              title="Lingkaran / Oval"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'circle'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('bucket')}
              title="Cat Tumpah (Isi Warna Latar)"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'bucket'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PaintBucket className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('stamp')}
              title="Stempel Stiker Lucu"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'stamp'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool('text')}
              title="Tulis Teks"
              className={`p-1.5 rounded-md transition-colors ${
                tool === 'text'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-[11px] text-slate-500">Ukuran:</span>
            {[2, 4, 8, 14, 22].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setStrokeWidth(sz)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  strokeWidth === sz
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: `${Math.min(14, sz)}px`, height: `${Math.min(14, sz)}px` }}
                />
              </button>
            ))}
          </div>

          {/* Fill shape checkbox */}
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={fillShape}
              onChange={(e) => setFillShape(e.target.checked)}
              className="rounded text-pink-600 focus:ring-pink-500"
            />
            <span>Isi Warna Penuh</span>
          </label>

          {/* History Undo / Redo / Clear */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={historyStep <= 0}
              onClick={handleUndo}
              title="Undo / Urungkan"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={historyStep >= history.length - 1}
              onClick={handleRedo}
              title="Redo / Ulangi"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              title="Bersihkan Kanvas"
              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-600 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tool panels: Stamps or Text */}
        {tool === 'stamp' && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Pilih Stempel:</span>
            {STAMPS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStamp(st)}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition-all ${
                  selectedStamp === st
                    ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/60 scale-110'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
            <span className="text-[10px] text-slate-400 ml-2">Klik pada kanvas untuk menempelkan stempel!</span>
          </div>
        )}

        {tool === 'text' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">Teks Kanvas:</span>
            <input
              type="text"
              value={canvasText}
              onChange={(e) => setCanvasText(e.target.value)}
              placeholder="Ketik teks yang ingin ditempel..."
              className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 max-w-xs"
            />
            <span className="text-[10px] text-slate-400">Klik di mana saja pada kanvas untuk menaruh teks.</span>
          </div>
        )}

        {/* Color Palette Palette Bar */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Palet Warna:</span>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border transition-all shadow-xs ${
                color.toLowerCase() === c.toLowerCase()
                  ? 'scale-125 ring-2 ring-pink-500 ring-offset-1 border-white'
                  : 'border-slate-300 dark:border-slate-700 hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}

          {/* Custom Color Input */}
          <div className="relative ml-2 flex items-center gap-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-900"
            />
            <span className="text-[10px] font-mono text-slate-500 uppercase">{color}</span>
          </div>
        </div>
      </div>

      {/* Canvas Paper Area */}
      <div className="p-4 flex justify-center bg-slate-200/60 dark:bg-slate-950 overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={760}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white rounded-xl shadow-lg border-2 border-slate-300 dark:border-slate-700 cursor-crosshair touch-none max-w-full"
          style={{ width: '760px', height: '480px' }}
        />
      </div>
    </div>
  );
};
