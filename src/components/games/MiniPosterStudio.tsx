import React, { useState, useRef } from 'react';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Sparkles,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  Check,
  Star,
  Award,
  Layers,
  Smile,
  Shield,
  Monitor,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createGalleryWork, updateUser, getGamificationConfig } from '../../services/storageService';

interface PosterElement {
  id: string;
  type: 'text' | 'sticker' | 'shape';
  content: string; // text or emoji / icon name
  x: number; // percentage
  y: number; // percentage
  fontSize?: number;
  color?: string;
  bgColor?: string;
  isBold?: boolean;
}

const TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Poster Keselamatan Siber',
    bg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    elements: [
      { id: '1', type: 'text', content: 'JAGA RAHASIA PASSWORDMU!', x: 50, y: 25, fontSize: 22, color: '#facc15', isBold: true },
      { id: '2', type: 'sticker', content: '🛡️', x: 50, y: 50, fontSize: 48 },
      { id: '3', type: 'text', content: 'Jangan pernah membagikan kata sandi ke siapa pun.', x: 50, y: 75, fontSize: 13, color: '#e0e7ff', isBold: false },
    ],
  },
  {
    id: 'tpl-2',
    name: 'Juara Mengetik 10 Jari',
    bg: 'linear-gradient(135deg, #064e3b, #047857)',
    elements: [
      { id: '1', type: 'text', content: 'MASTER KEYBOARD 10 JARI', x: 50, y: 25, fontSize: 20, color: '#6ee7b7', isBold: true },
      { id: '2', type: 'sticker', content: '⌨️', x: 50, y: 48, fontSize: 48 },
      { id: '3', type: 'text', content: 'Cepat, Tepat, dan Akurat!', x: 50, y: 75, fontSize: 14, color: '#ffffff', isBold: true },
    ],
  },
  {
    id: 'tpl-3',
    name: 'Hemat Listrik Lab Komputer',
    bg: 'linear-gradient(135deg, #78350f, #b45309)',
    elements: [
      { id: '1', type: 'text', content: 'MATIKAN KOMPUTER SETELAH SELESAI', x: 50, y: 25, fontSize: 18, color: '#fef08a', isBold: true },
      { id: '2', type: 'sticker', content: '💡', x: 50, y: 50, fontSize: 48 },
      { id: '3', type: 'text', content: 'Shutdown PC & Rapikan Meja Kursi Lab', x: 50, y: 75, fontSize: 12, color: '#ffffff', isBold: false },
    ],
  },
];

const STICKERS = ['💻', '🤖', '🚀', '⭐', '🏆', '🛡️', '⚡', '⌨️', '🖱️', '🎨', '🔥', '🎉'];

export const MiniPosterStudio: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [canvasBg, setCanvasBg] = useState('linear-gradient(135deg, #1e1b4b, #312e81)');
  const [elements, setElements] = useState<PosterElement[]>(TEMPLATES[0].elements as PosterElement[]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [posterTitle, setPosterTitle] = useState('Poster Desain Komputer Ceria');
  const [isPublishing, setIsPublishing] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const addTextElement = () => {
    if (!textInput.trim()) return;
    const newEl: PosterElement = {
      id: `txt-${Date.now()}`,
      type: 'text',
      content: textInput.trim(),
      x: 50,
      y: 50,
      fontSize: fontSize,
      color: textColor,
      isBold: isBold,
    };
    setElements((prev) => [...prev, newEl]);
    setTextInput('');
    setSelectedElementId(newEl.id);
  };

  const addSticker = (emoji: string) => {
    const newEl: PosterElement = {
      id: `stk-${Date.now()}`,
      type: 'sticker',
      content: emoji,
      x: 50,
      y: 50,
      fontSize: 42,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setCanvasBg(tpl.bg);
    setElements(tpl.elements as PosterElement[]);
    setPosterTitle(tpl.name);
    setSelectedElementId(null);
  };

  const renderSvgPoster = (): string => {
    const elSvg = elements
      .map((el) => {
        if (el.type === 'text') {
          return `<text x="${el.x}%" y="${el.y}%" font-family="sans-serif" font-size="${el.fontSize || 16}px" font-weight="${
            el.isBold ? 'bold' : 'normal'
          }" fill="${el.color || '#ffffff'}" text-anchor="middle" dominant-baseline="middle">${el.content}</text>`;
        }
        return `<text x="${el.x}%" y="${el.y}%" font-size="${el.fontSize || 36}px" text-anchor="middle" dominant-baseline="middle">${el.content}</text>`;
      })
      .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs><rect width="600" height="600" fill="url(#grad)" rx="24"/>${elSvg}<text x="50%" y="94%" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Ekstrakurikuler Komputer Ceria · Portofolio Kreatif</text></svg>`;
  };

  const handlePublishToGallery = () => {
    if (!currentUser) {
      showError('Silakan login terlebih dahulu untuk mempublikasikan poster ke galeri siswa.');
      return;
    }

    setIsPublishing(true);
    const svgData = `data:image/svg+xml;utf8,${encodeURIComponent(renderSvgPoster())}`;

    createGalleryWork({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatarUrl,
      studentGrade: currentUser.grade,
      studentSchool: currentUser.school,
      title: posterTitle.trim() || 'Poster Kreatif Siswa',
      category: 'Desain Grafis Mini Canva',
      type: 'paint',
      imageUrl: svgData,
      previewText: `Poster grafis "${posterTitle}" didesain dengan elemen dan stiker digital.`,
    });

    const earned = 40;
    const ratio = getGamificationConfig().pointsToStarRatio || 10;
    const updatedTotal = (currentUser.totalPoints || 0) + earned;
    updateUser(currentUser.id, {
      totalPoints: updatedTotal,
      totalStars: Math.floor(updatedTotal / ratio),
    });
    refreshUser();

    setIsPublishing(false);
    showSuccess(`🎉 Poster "${posterTitle}" berhasil dipublikasikan ke Galeri Siswa! (+40 Poin)`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Studio Desain Poster Cilik</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Mini Canva
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Buat poster sekolah, kartu ucapan, dan kampanye digital dengan mudah!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePublishToGallery}
            disabled={isPublishing}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Terbitkan ke Galeri Siswa</span>
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Poster Canvas Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={posterTitle}
              onChange={(e) => setPosterTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 outline-none focus:border-purple-500 w-full max-w-xs"
              placeholder="Judul poster..."
            />
            <span className="text-[11px] text-slate-400">Klik elemen untuk mengedit</span>
          </div>

          {/* Square Canvas */}
          <div
            ref={canvasRef}
            className="w-full aspect-square rounded-3xl shadow-2xl border-4 border-slate-800 relative overflow-hidden select-none"
            style={{ background: canvasBg }}
          >
            {elements.map((el) => {
              const isSelected = selectedElementId === el.id;
              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl cursor-move transition-all flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-amber-400 bg-white/10 backdrop-blur-xs' : 'hover:bg-white/5'
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    color: el.color || '#ffffff',
                    fontSize: `${el.fontSize || 16}px`,
                    fontWeight: el.isBold ? 'bold' : 'normal',
                  }}
                >
                  <span>{el.content}</span>
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeElement(el.id);
                      }}
                      className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-md cursor-pointer hover:bg-rose-600"
                      title="Hapus elemen"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}

            {/* Subtle Brand Watermark */}
            <div className="absolute bottom-3 inset-x-0 text-center text-[10px] text-white/40 pointer-events-none font-mono">
              Ekstrakurikuler Komputer Ceria
            </div>
          </div>

          {/* Template Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">Pilih Template Siap Pakai:</span>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-purple-500 text-left text-xs font-bold transition-all cursor-pointer truncate"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Toolbox Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Add Text Tool */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-purple-400" />
              Tambah Tulisan Teks
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTextElement()}
                placeholder="Ketik teks poster..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                onClick={addTextElement}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                Tambah
              </button>
            </div>

            {/* Text Styling Controls */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Ukuran Font</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                >
                  <option value={12}>Kecil (12px)</option>
                  <option value={16}>Normal (16px)</option>
                  <option value={22}>Besar (22px)</option>
                  <option value={32}>Judul (32px)</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Warna</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 bg-transparent rounded cursor-pointer"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`w-full py-1.5 rounded-lg border font-black text-xs transition-colors cursor-pointer ${
                    isBold ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  B Tebal
                </button>
              </div>
            </div>
          </div>

          {/* Add Sticker Tool */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-400" />
              Pilih Stiker & Ikon Edukasi
            </span>
            <div className="grid grid-cols-6 gap-2 text-center">
              {STICKERS.map((stk, idx) => (
                <button
                  key={idx}
                  onClick={() => addSticker(stk)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:scale-110 transition-transform text-2xl cursor-pointer"
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color Palettes */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Warna Latar Belakang (Background)
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Cyber Indigo', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)' },
                { name: 'Emerald Forest', bg: 'linear-gradient(135deg, #064e3b, #047857)' },
                { name: 'Amber Sunset', bg: 'linear-gradient(135deg, #78350f, #b45309)' },
                { name: 'Neon Rose', bg: 'linear-gradient(135deg, #831843, #be185d)' },
              ].map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setCanvasBg(c.bg)}
                  className="h-10 rounded-xl border border-white/20 shadow-md cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: c.bg }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
