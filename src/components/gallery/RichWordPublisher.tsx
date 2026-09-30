import React, { useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  FileText,
  Highlighter,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Palette,
  RotateCcw,
  Send,
  Sparkles,
  Strikethrough,
  Table as TableIcon,
  Underline,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createGalleryWork } from '../../services/storageService';
import { compressImageFile } from '../../utils/imageCompressor';

interface RichWordPublisherProps {
  onPublished?: () => void;
  onCancel?: () => void;
}

export const RichWordPublisher: React.FC<RichWordPublisherProps> = ({
  onPublished,
  onCancel,
}) => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Naskah Word');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('14px');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontFamily(font);
    executeCommand('fontName', font);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size;
      try {
        range.surroundContents(span);
      } catch {
        executeCommand('fontSize', '3');
      }
    }
  };

  // Upload & Insert Image into Document
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Format berkas harus berupa gambar (JPG, PNG, GIF, WebP).');
      return;
    }

    try {
      const base64 = await compressImageFile(file, {
        maxWidth: 700,
        maxHeight: 700,
        quality: 0.82,
      });

      if (base64) {
        // Insert image at cursor or append
        const imgHtml = `<div style="text-align: center; margin: 12px 0;"><img src="${base64}" alt="Gambar Siswa" style="max-width: 80%; max-height: 280px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;" /><p style="font-size: 10px; color: #64748b; margin-top: 4px;">Foto sisipan karya</p></div>`;
        document.execCommand('insertHTML', false, imgHtml);
        showSuccess('Gambar berhasil disisipkan ke lembar naskah!');
      }
    } catch {
      showError('Gagal memproses file gambar.');
    } finally {
      e.target.value = '';
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: left; margin: 12px 0; border: 1px solid #cbd5e1;">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1;">No</th>
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1;">Aktivitas Komputer</th>
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">1</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Mengetik 10 Jari</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Melatih kecepatan & akurasi</td>
          </tr>
          <tr>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">2</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Materi Hardware</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Mengenal CPU & Monitor</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHtml);
  };

  const handleApplyTemplate = (type: 'puisi' | 'biodata' | 'laporan') => {
    if (!editorRef.current) return;

    if (type === 'puisi') {
      setTitle('Puisi Indah: Teknologi Masa Depan');
      setCategory('Puisi & Sastra');
      editorRef.current.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #faf5ff; border: 2px dashed #9333ea; border-radius: 12px;">
          <h2 style="color: #6b21a8; font-weight: bold; margin-bottom: 4px;">TEKNOLOGI MASA DEPAN</h2>
          <p style="font-style: italic; color: #6b7280; font-size: 11px;">Karya Siswa Ekstrakurikuler Komputer Ceria</p>
          <br/>
          <p style="font-size: 13px; line-height: 1.8;">
            Layar bercahaya membuka wawasan luas,<br/>
            Dunia digital terbentang tanpa batas.<br/>
            Dengan ilmu dan akhlak mulia,<br/>
            Kita ciptakan karya untuk Indonesia.
          </p>
          <br/>
          <p style="font-size: 13px; line-height: 1.8;">
            Keyboard dan mouse menjadi kuas pena,<br/>
            Mengukir prestasi penuh pesona.<br/>
            Belajar komputer dengan gembira,<br/>
            Menuju cita-cita yang mulia!
          </p>
        </div>
      `;
    } else if (type === 'biodata') {
      setTitle('Biodata Lengkap Siswa Komputer Ceria');
      setCategory('Dokumen Kreatif');
      editorRef.current.innerHTML = `
        <div style="padding: 20px; border: 2px solid #2563eb; border-radius: 12px; background: #eff6ff;">
          <h3 style="text-align: center; color: #1e40af; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            BIODATA RESMI SISWA EKSTRAKURIKULER
          </h3>
          <br/>
          <table style="width: 100%; border: none;">
            <tr><td style="width: 35%; padding: 4px 0; font-weight: bold;">Nama Lengkap</td><td>: ${currentUser?.name || 'Siswa Komputer'}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">NISN</td><td>: ${currentUser?.nisn || currentUser?.username || '-'}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Kelas</td><td>: ${currentUser?.grade || 'Kelas 4A'}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Asal Sekolah</td><td>: ${currentUser?.school || 'Sekolah Terdaftar'}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Cita - Cita</td><td>: Ahli Komputer & Kreator Game Edukatif</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Motto Belajar</td><td>: Pantang Menyerah, Ketik dengan Ceria!</td></tr>
          </table>
        </div>
      `;
    } else {
      setTitle('Laporan Kegiatan Belajar Komputer');
      setCategory('Laporan Cerita');
      editorRef.current.innerHTML = `
        <div style="padding: 10px;">
          <h3 style="font-weight: bold; color: #0f172a;">Laporan Pengalaman Belajar di Komputer Ceria</h3>
          <p style="font-size: 11px; color: #64748b;">Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
          <hr style="margin: 10px 0; border: 1px solid #e2e8f0;" />
          <p style="line-height: 1.6;">
            Hari ini saya mengikuti kegiatan ekstrakurikuler komputer di laboratorium sekolah. Kami belajar mengenal fungsi perangkat keras seperti CPU, Monitor, dan Keyboard. Selain itu, kami juga berlatih mengetik cepat sepuluh jari dengan aplikasi Word.
          </p>
          <br/>
          <h4 style="font-weight: bold; color: #334155;">Tabel Hasil Pembelajaran:</h4>
          <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <tr style="background: #f8fafc;"><th style="padding: 6px;">Materi</th><th style="padding: 6px;">Status</th><th style="padding: 6px;">Bintang Diperoleh</th></tr>
            <tr><td style="padding: 6px;">Materi Hardware</td><td style="padding: 6px;">Selesai</td><td style="padding: 6px;">5 ★</td></tr>
            <tr><td style="padding: 6px;">Kuis Pilihan Ganda</td><td style="padding: 6px;">Skor 100%</td><td style="padding: 6px;">10 ★</td></tr>
            <tr><td style="padding: 6px;">Latihan Mengetik Word</td><td style="padding: 6px;">Akurasi 98%</td><td style="padding: 6px;">8 ★</td></tr>
          </table>
        </div>
      `;
    }
  };

  const handlePublish = () => {
    if (!currentUser) {
      showError('Silakan login terlebih dahulu untuk mempublikasikan karya.');
      return;
    }

    if (!title.trim()) {
      showError('Harap berikan judul naskah dokumen Anda.');
      return;
    }

    const htmlContent = editorRef.current?.innerHTML || '';
    const textContent = editorRef.current?.innerText || '';

    if (!textContent.trim() && !htmlContent.includes('<img')) {
      showError('Isi naskah dokumen tidak boleh kosong.');
      return;
    }

    createGalleryWork({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatarUrl,
      studentGrade: currentUser.grade || 'Siswa',
      studentSchool: currentUser.school || 'Sekolah Terdaftar',
      title: title.trim(),
      category: category,
      type: 'word',
      contentHtml: htmlContent,
      previewText: textContent.slice(0, 140).trim() || title.trim(),
    });

    showSuccess('Naskah Word Anda berhasil dipublikasikan ke Galeri Siswa!', 'Galeri Word');
    if (onPublished) onPublished();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl space-y-4">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 via-sky-50/80 to-blue-50/80 dark:from-slate-950 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Aplikasi Pengetikan Dokumen (Microsoft Word Simulator)
            </h3>
            <p className="text-[11px] text-slate-500">
              Format naskah dengan font, tebal/miring, warna teks, sisipkan tabel dan upload foto/gambar!
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
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publikasikan Naskah</span>
          </button>
        </div>
      </div>

      {/* Meta Input Bar */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Judul Naskah Dokumen:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Puisi Sahabat Komputer atau Biodata Siswa"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Kategori Dokumen:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Naskah Word">Naskah Word</option>
            <option value="Puisi & Sastra">Puisi & Sastra</option>
            <option value="Dokumen Kreatif">Dokumen Kreatif</option>
            <option value="Tabel & Jadwal">Tabel & Jadwal</option>
            <option value="Laporan Cerita">Laporan Cerita</option>
          </select>
        </div>
      </div>

      {/* Template Quick Selection */}
      <div className="mx-4 p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">
          Template Naskah:
        </span>
        <button
          type="button"
          onClick={() => handleApplyTemplate('puisi')}
          className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100"
        >
          📜 Template Puisi
        </button>
        <button
          type="button"
          onClick={() => handleApplyTemplate('biodata')}
          className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100"
        >
          👤 Template Biodata
        </button>
        <button
          type="button"
          onClick={() => handleApplyTemplate('laporan')}
          className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100"
        >
          📑 Template Laporan
        </button>
      </div>

      {/* Word Ribbon Toolbar */}
      <div className="mx-4 p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={handleFontChange}
          className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
        </select>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={handleSizeChange}
          className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
        >
          <option value="12px">12 pt</option>
          <option value="14px">14 pt</option>
          <option value="16px">16 pt</option>
          <option value="18px">18 pt</option>
          <option value="22px">22 pt</option>
          <option value="28px">28 pt</option>
        </select>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Formattings */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          title="Tebal (Bold)"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          title="Miring (Italic)"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          title="Garis Bawah (Underline)"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          title="Coret Teks (Strikethrough)"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Text Color Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              executeCommand('foreColor', e.target.value);
            }}
            title="Warna Huruf (Text Color)"
            className="w-4 h-4 rounded cursor-pointer p-0 bg-transparent border-0"
          />
        </div>

        {/* Highlight Color Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
          <Highlighter className="w-3.5 h-3.5 text-amber-500" />
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => {
              setHighlightColor(e.target.value);
              executeCommand('hiliteColor', e.target.value);
            }}
            title="Warna Stabilo / Highlight"
            className="w-4 h-4 rounded cursor-pointer p-0 bg-transparent border-0"
          />
        </div>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          title="Rata Kiri"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          title="Rata Tengah"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          title="Rata Kanan"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyFull')}
          title="Rata Kiri-Kanan (Justify)"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet Points"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbering List"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Insert Table Button */}
        <button
          type="button"
          onClick={insertTable}
          className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-semibold text-[11px] flex items-center gap-1 hover:bg-slate-50"
        >
          <TableIcon className="w-3 h-3 text-indigo-500" />
          <span>+ Tabel</span>
        </button>

        {/* Upload & Insert Image Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-100"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Upload Gambar</span>
        </button>
      </div>

      {/* A4 Paper Document Canvas */}
      <div className="p-4 sm:p-6 bg-slate-200/60 dark:bg-slate-950 flex justify-center overflow-x-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          style={{ fontFamily, fontSize }}
          className="word-paper-content w-full max-w-[760px] min-h-[460px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 sm:p-12 rounded-sm shadow-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          dangerouslySetInnerHTML={{
            __html:
              '<p>Ketik naskah cerita, puisi, atau biodata Anda di sini. Anda juga dapat menyisipkan tabel dan mengupload gambar!</p>',
          }}
        />
      </div>
    </div>
  );
};
