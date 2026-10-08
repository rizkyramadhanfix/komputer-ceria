import React, { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  Bold,
  Check,
  CheckCircle2,
  Clock,
  Columns,
  Eraser,
  FileText,
  HelpCircle,
  Highlighter,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  LogOut,
  Minus,
  Palette,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Underline,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { TypingPractice } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import { soundEffects } from '../../utils/soundEffects';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getTypingDraft, saveTypingDraft, deleteTypingDraft } from '../../services/storageService';
import { Volume2, VolumeX } from 'lucide-react';

interface WordEditorProps {
  practice: TypingPractice;
  onSubmit: (result: {
    content: string;
    accuracy: number;
    wpm: number;
    pointsEarned: number;
  }) => void;
  allocatedPoints: number;
  onBack?: () => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  practice,
  onSubmit,
  allocatedPoints,
  onBack,
}) => {
  const { currentUser } = useAuth();
  const { showSuccess, showWarning, showInfo } = useToast();

  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [activeRibbonTab, setActiveRibbonTab] = useState<'home' | 'insert' | 'view'>('home');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('14px');
  const [textColor, setTextColor] = useState('#0d0f1c');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [zoomScale, setZoomScale] = useState(100);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Draft management states
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false);

  // Live metrics
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [showReference, setShowReference] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyPasteWarning, setCopyPasteWarning] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => soundEffects.isEnabled());

  const triggerCopyPasteWarning = (action: 'copy' | 'paste' | 'cut') => {
    const text =
      action === 'paste'
        ? '⚠️ Fitur Paste / Tempel dinonaktifkan! Silakan ketik langsung naskah menggunakan keyboard untuk melatih kecepatan jari.'
        : '⚠️ Fitur Salin / Copy dinonaktifkan pada latihan mengetik!';
    setCopyPasteWarning(text);
    setTimeout(() => {
      setCopyPasteWarning(null);
    }, 4000);
  };

  // Sanitize reference HTML to remove duplicate page wrappers and CSS contamination
  const sanitizeReferenceHtml = (rawHtml?: string): string => {
    if (!rawHtml) return '<p class="text-slate-400 text-center py-10">Pilih tugas mengetik yang valid.</p>';

    let html = rawHtml;

    // Extract body content if wrapped in full HTML skeleton
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      html = bodyMatch[1];
    }

    // Strip style and script tags to avoid global CSS contamination
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    return html;
  };

  // Execute formatting command on contenteditable
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    setHasUnsavedChanges(true);
    if (editorRef.current) {
      editorRef.current.focus();
      updateMetrics();
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  const handleHighlightColorChange = (color: string) => {
    setHighlightColor(color);
    executeCommand('hiliteColor', color);
  };

  const insertHorizontalRule = () => {
    executeCommand('insertHorizontalRule');
  };

  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Berkas harus berupa gambar (PNG, JPG, WEBP, GIF).');
      return;
    }

    try {
      const compressedBase64 = await compressImageFile(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.82,
      });

      if (compressedBase64) {
        const imgHtml = `<div style="text-align: center; margin: 12px 0;"><img src="${compressedBase64}" alt="Sisipan Foto" style="max-width: 80%; max-height: 260px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;" /><p style="font-size: 10px; color: #64748b; margin-top: 4px;">Foto Sisipan Dokumen Word</p></div>`;
        document.execCommand('insertHTML', false, imgHtml);
      }
    } catch {
      alert('Gagal memproses gambar untuk disisipkan.');
    } finally {
      e.target.value = '';
    }
  };

  const generateWordPrintHtml = (): string => {
    const editorContent = editorRef.current ? editorRef.current.innerHTML : '';
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dokumen Word - ${practice.title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm;
    }
    body {
      font-family: Arial, 'Times New Roman', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #0f172a;
      background: #ffffff;
      padding: 0;
      margin: 0;
    }
    .header {
      border-b: 2px solid #2563eb;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      font-size: 18px;
      color: #1e3a8a;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header p {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .word-content {
      min-height: 800px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #64748b;
      padding: 8px 12px;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${practice.title}</h1>
      <p>Naskah Hasil Latihan Mengetik Microsoft Word · Komputer Ceria</p>
    </div>
    <div style="text-align: right; font-size: 11px; color: #475569;">
      <strong>Kecepatan:</strong> ${wpm} WPM | <strong>Akurasi:</strong> ${accuracy}%
    </div>
  </div>

  <div class="word-content">
    ${editorContent}
  </div>

  <div class="footer">
    <span>Dicetak dari Laboratorium Komputer Ceria</span>
    <span>Halaman 1 dari 1</span>
  </div>
</body>
</html>`;
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontFamily(font);
    executeCommand('fontName', font);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    // document.execCommand('fontSize') uses 1-7, but we can set style on selection or span
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

  const handleOpenTableModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
    setShowTableModal(true);
  };

  const insertTable = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    let tableHtml = '<table border="1" style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 2px solid #475569;"><thead><tr>';
    for (let c = 0; c < tableCols; c++) {
      tableHtml += `<th style="border: 1px solid #64748b; padding: 10px 14px; background-color: #f1f5f9; min-width: 60px; font-weight: bold; text-align: left;"><p>Kolom ${c + 1}</p></th>`;
    }
    tableHtml += '</tr></thead><tbody>';

    for (let r = 0; r < tableRows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td style="border: 1px solid #64748b; padding: 10px 14px; min-width: 60px; text-align: left; vertical-align: top;"><p><br></p></td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';

    let inserted = false;
    try {
      if (savedRangeRef.current) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRangeRef.current);
      }
      inserted = document.execCommand('insertHTML', false, tableHtml);
    } catch {
      inserted = false;
    }

    if (!inserted && editorRef.current) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = tableHtml;
      while (wrapper.firstChild) {
        editorRef.current.appendChild(wrapper.firstChild);
      }
    }

    setShowTableModal(false);
    updateMetrics();
  };

  const addTableRow = () => {
    if (!editorRef.current) return;
    const tables = editorRef.current.querySelectorAll('table');
    if (tables.length === 0) {
      alert('Belum ada tabel di lembar kerja. Klik "Sisipkan Tabel" terlebih dahulu.');
      return;
    }
    const lastTable = tables[tables.length - 1];
    const tbody = lastTable.querySelector('tbody') || lastTable;
    const colCount = lastTable.querySelectorAll('tr')[0]?.children.length || 3;
    const tr = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement('td');
      td.style.border = '1px solid #64748b';
      td.style.padding = '10px 14px';
      td.style.verticalAlign = 'top';
      td.innerHTML = '<p><br></p>';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    updateMetrics();
  };

  const addTableColumn = () => {
    if (!editorRef.current) return;
    const tables = editorRef.current.querySelectorAll('table');
    if (tables.length === 0) {
      alert('Belum ada tabel di lembar kerja. Klik "Sisipkan Tabel" terlebih dahulu.');
      return;
    }
    const lastTable = tables[tables.length - 1];
    const rows = lastTable.querySelectorAll('tr');
    rows.forEach((row, idx) => {
      if (idx === 0 && row.querySelector('th')) {
        const th = document.createElement('th');
        th.style.border = '1px solid #64748b';
        th.style.padding = '10px 14px';
        th.style.backgroundColor = '#f1f5f9';
        th.style.fontWeight = 'bold';
        th.innerHTML = `<p>Kolom ${row.children.length + 1}</p>`;
        row.appendChild(th);
      } else {
        const td = document.createElement('td');
        td.style.border = '1px solid #64748b';
        td.style.padding = '10px 14px';
        td.style.verticalAlign = 'top';
        td.innerHTML = '<p><br></p>';
        row.appendChild(td);
      }
    });
    updateMetrics();
  };

  const deleteTableRow = () => {
    if (!editorRef.current) return;
    const tables = editorRef.current.querySelectorAll('table');
    if (tables.length === 0) return;
    const lastTable = tables[tables.length - 1];
    const tbody = lastTable.querySelector('tbody') || lastTable;
    const rows = tbody.querySelectorAll('tr');
    if (rows.length > 1) {
      tbody.removeChild(rows[rows.length - 1]);
      updateMetrics();
    } else {
      if (confirm('Hapus seluruh tabel ini?')) {
        lastTable.parentElement?.removeChild(lastTable);
        updateMetrics();
      }
    }
  };

  const deleteTable = () => {
    if (!editorRef.current) return;
    const tables = editorRef.current.querySelectorAll('table');
    if (tables.length === 0) return;
    if (confirm('Apakah Anda yakin ingin menghapus tabel dari lembar kerja?')) {
      const lastTable = tables[tables.length - 1];
      lastTable.parentElement?.removeChild(lastTable);
      updateMetrics();
    }
  };

  // Keyboard navigation inside table & Block Copy-Paste to prevent cheating
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Save draft shortcut: Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSaveDraft(true);
      return;
    }

    // Strictly block Ctrl+C / Ctrl+V / Ctrl+X / Cmd+C / Cmd+V / Cmd+X
    if (
      (e.ctrlKey || e.metaKey) &&
      ['c', 'v', 'x', 'insert'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      triggerCopyPasteWarning(e.key.toLowerCase() === 'v' ? 'paste' : 'copy');
      return;
    }

    if (e.key === 'Tab') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const anchorNode = selection.anchorNode;
      const cell = anchorNode instanceof HTMLElement
        ? anchorNode.closest('td, th')
        : anchorNode?.parentElement?.closest('td, th');
      if (cell) {
        e.preventDefault();
        const table = cell.closest('table');
        if (!table) return;
        const allCells = Array.from(table.querySelectorAll('th, td'));
        const currentIndex = allCells.indexOf(cell as HTMLElement);

        if (!e.shiftKey) {
          if (currentIndex < allCells.length - 1) {
            const nextCell = allCells[currentIndex + 1] as HTMLElement;
            nextCell.focus();
            const range = document.createRange();
            range.selectNodeContents(nextCell);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            addTableRow();
            setTimeout(() => {
              const updatedCells = Array.from(table.querySelectorAll('th, td'));
              const newCell = updatedCells[allCells.length] as HTMLElement;
              if (newCell) {
                newCell.focus();
                const range = document.createRange();
                range.selectNodeContents(newCell);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }, 60);
          }
        } else {
          if (currentIndex > 0) {
            const prevCell = allCells[currentIndex - 1] as HTMLElement;
            prevCell.focus();
            const range = document.createRange();
            range.selectNodeContents(prevCell);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }
  };

  // Similarity & Accuracy calculation
  const calculateSimilarity = (typed: string, target: string): number => {
    const cleanTyped = typed.trim().replace(/\s+/g, ' ');
    const cleanTarget = target.trim().replace(/\s+/g, ' ');

    if (!cleanTyped) return 0;
    if (cleanTyped === cleanTarget) return 100;

    const targetWords = cleanTarget.split(' ');
    const typedWords = cleanTyped.split(' ');

    let matchCount = 0;
    for (let i = 0; i < Math.min(typedWords.length, targetWords.length); i++) {
      if (typedWords[i].toLowerCase() === targetWords[i].toLowerCase()) {
        matchCount++;
      }
    }

    const wordMatchRatio = matchCount / targetWords.length;
    // Character length ratio component
    const lenRatio = Math.min(1, cleanTyped.length / cleanTarget.length);
    const estimated = Math.min(100, Math.round((wordMatchRatio * 0.7 + lenRatio * 0.3) * 100));
    return estimated;
  };

  // Restore existing draft on mount if available
  useEffect(() => {
    if (!currentUser) return;
    const draft = getTypingDraft(practice.id, currentUser.id);
    if (draft && draft.contentHtml) {
      if (editorRef.current) {
        editorRef.current.innerHTML = draft.contentHtml;
        const text = editorRef.current.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
        setCharCount(text.length);
        const currentAcc = calculateSimilarity(text, practice.targetPlainText);
        setAccuracy(draft.accuracy || currentAcc);
        setWpm(draft.wpm || 0);
      }
      setLastSavedAt(draft.lastSavedAt);
      setIsDraftRestored(true);
      setHasUnsavedChanges(false);
    }
  }, [practice.id, currentUser]);

  const updateMetrics = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);

    if (!startTime && text.length > 2) {
      setStartTime(Date.now());
    }

    if (startTime) {
      const minutes = Math.max(0.1, (Date.now() - startTime) / 60000);
      const computedWpm = Math.round(words / minutes);
      setWpm(computedWpm);
    }

    const currentAcc = calculateSimilarity(text, practice.targetPlainText);
    setAccuracy(currentAcc);
    setHasUnsavedChanges(true);
  };

  // Save current typing draft to local & cloud storage
  const handleSaveDraft = (isManual = true) => {
    if (!currentUser) {
      if (isManual) showWarning('Silakan masuk terlebih dahulu untuk menyimpan tugas.', 'Belum Masuk');
      return;
    }
    if (!editorRef.current) return;

    const contentHtml = editorRef.current.innerHTML;
    const text = (editorRef.current.innerText || '').trim();

    if (text.length === 0 || text === 'Mulai mengetik di sini sesuai naskah acuan di atas...') {
      if (isManual) {
        showWarning('Lembar kerja belum diisi teks naskah untuk disimpan.', 'Lembar Kosong');
      }
      return;
    }

    setIsSavingDraft(true);
    const nowIso = new Date().toISOString();

    try {
      saveTypingDraft({
        practiceId: practice.id,
        practiceTitle: practice.title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        contentHtml,
        wpm: Math.max(wpm, 0),
        accuracy: Math.max(accuracy, 0),
        charCount,
        wordCount,
        lastSavedAt: nowIso,
      });

      setLastSavedAt(nowIso);
      setHasUnsavedChanges(false);

      if (isManual) {
        showSuccess('Tugas mengetik berhasil disimpan! Anda bisa melanjutkannya kapan saja.', 'Draf Tersimpan');
      }
    } catch (err) {
      console.error('Error saving typing draft:', err);
      if (isManual) {
        showWarning('Gagal menyimpan draf ke database.', 'Gagal Simpan');
      }
    } finally {
      setTimeout(() => setIsSavingDraft(false), 300);
    }
  };

  // Auto-save draft every 25 seconds if changes occurred
  useEffect(() => {
    if (!hasUnsavedChanges || !currentUser) return;

    const timer = setInterval(() => {
      if (hasUnsavedChanges && editorRef.current) {
        const text = (editorRef.current.innerText || '').trim();
        if (text.length > 5 && text !== 'Mulai mengetik di sini sesuai naskah acuan di atas...') {
          handleSaveDraft(false);
        }
      }
    }, 25000);

    return () => clearInterval(timer);
  }, [hasUnsavedChanges, currentUser, wpm, accuracy, charCount, wordCount]);

  // Handle Save and Exit to Dashboard
  const handleSaveAndExit = () => {
    if (editorRef.current) {
      const text = (editorRef.current.innerText || '').trim();
      if (text.length > 5 && text !== 'Mulai mengetik di sini sesuai naskah acuan di atas...') {
        handleSaveDraft(false);
        showSuccess('Tugas berhasil disimpan dengan aman sebelum keluar.', 'Tersimpan & Keluar');
      }
    }
    if (onBack) {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (!editorRef.current) return;
    setIsSubmitting(true);
    const content = editorRef.current.innerHTML;

    // Calculate final points based on accuracy and allocated points
    const finalAccuracy = Math.max(accuracy, 15);
    const calculatedPoints = Math.round((finalAccuracy / 100) * allocatedPoints);

    // Delete draft since the task is completed and submitted
    if (currentUser) {
      deleteTypingDraft(practice.id, currentUser.id);
    }

    setTimeout(() => {
      soundEffects.playSuccessFanfare();
      onSubmit({
        content,
        accuracy: finalAccuracy,
        wpm: Math.max(wpm, 18),
        pointsEarned: calculatedPoints,
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleReset = () => {
    if (confirm('Kosongkan lembar kerja untuk mengetik ulang dari awal? Draf tersimpan naskah ini akan dihapus.')) {
      if (editorRef.current) {
        editorRef.current.innerHTML = '<p><br></p>';
        updateMetrics();
        setStartTime(null);
        setWpm(0);
        setHasUnsavedChanges(false);
        setLastSavedAt(null);
        if (currentUser) {
          deleteTypingDraft(practice.id, currentUser.id);
        }
        showInfo('Lembar kerja telah dikosongkan dan draf dibatalkan.', 'Lembar Dikosongkan');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Restored Draft Banner Notification */}
      {isDraftRestored && !draftBannerDismissed && (
        <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-1.5">
                <span>Draf Tugas Tersimpan Berhasil Dimuat!</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Lanjutan Tugas
                </span>
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                Pekerjaan mengetik Anda dari sesi sebelumnya telah dipulihkan otomatis ({lastSavedAt ? new Date(lastSavedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'tersimpan'}). Anda dapat langsung melanjutkan mengetik.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDraftBannerDismissed(true)}
            className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
            aria-label="Tutup Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {practice.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Tingkat: {practice.difficulty} · Target WPM: {practice.targetWpm}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {practice.title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              {practice.instructions}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
              disabled={isSavingDraft || charCount < 3}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-xs ${
                isSavingDraft
                  ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200'
                  : hasUnsavedChanges
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                  : lastSavedAt
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
              title="Simpan sementara pekerjaan mengetik ke cloud agar bisa dilanjutkan nanti (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {isSavingDraft
                  ? 'Menyimpan...'
                  : hasUnsavedChanges
                  ? 'Simpan Draf *'
                  : lastSavedAt
                  ? '✓ Draf Tersimpan'
                  : 'Simpan Draf'}
              </span>
            </button>

            {/* Save and Exit */}
            {onBack && (
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Simpan tugas dan kembali ke pilihan naskah"
              >
                <LogOut className="w-3.5 h-3.5 rotate-180" />
                <span className="hidden sm:inline">Simpan & Keluar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const next = soundEffects.toggle();
                setSoundEnabled(next);
              }}
              className={`p-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                soundEnabled
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
              }`}
              title={soundEnabled ? 'Efek Suara Selesai/Fanfare Aktif (Klik untuk Matikan)' : 'Efek Suara Mati (Klik untuk Nyalakan)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-semibold">{soundEnabled ? 'Suara: ON' : 'Suara: OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReference(!showReference)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {showReference ? 'Sembunyikan Acuan' : 'Lihat Dokumen Acuan'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || charCount < 10}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Latihan & Klaim Poin</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500">Akurasi Kemiripan</span>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {accuracy}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500">Kecepatan (WPM)</span>
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {wpm} KPM
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500">Kata / Karakter</span>
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {wordCount} kata ({charCount} chr)
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500">Potensi Hadiah</span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{allocatedPoints} Poin
            </span>
          </div>

          {/* Cloud Auto-Save Status Bar */}
          {lastSavedAt && (
            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Terakhir disimpan: {new Date(lastSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {hasUnsavedChanges ? ' (Ada ketikan baru yang belum disimpan)' : ' (Aman di cloud)'}
              </span>
              <span className="text-[10px] text-slate-400">
                Tekan <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono text-[9px]">Ctrl+S</kbd> untuk simpan cepat
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Zone Work Area - Side-by-Side and Full Width */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        
        {/* SECTION 1: DOKUMEN ACUAN (REFERENCE) */}
        {showReference && (
          <section className="w-full lg:w-1/2 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
                    1
                  </div>
                  DOKUMEN ACUAN
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Contoh Naskah</span>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-2 sm:p-4 border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[85vh] custom-scrollbar shadow-inner">
              <div className="reference-paper mx-auto bg-white !max-w-none !shadow-xl !mb-0">
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeReferenceHtml(practice.targetDocument) }}
                  className="reference-content max-w-none select-none pointer-events-auto"
                  onCopy={(e) => {
                    e.preventDefault();
                    triggerCopyPasteWarning('copy');
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    triggerCopyPasteWarning('copy');
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: LEMBAR KERJA ANDA (EDITOR) */}
        <section className={`w-full ${showReference ? 'lg:w-1/2' : 'w-full'} animate-in fade-in slide-in-from-right-4 duration-700`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                  2
                </div>
                LEMBAR KERJA
              </h2>
            </div>
            <div className="flex items-center gap-3">
               <button
                 type="button"
                 onClick={handleReset}
                 className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 shadow-sm transition-all active:scale-95"
                 title="Kosongkan Lembar Kerja"
               >
                 <RotateCcw className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 border-2 border-blue-600/20 dark:border-blue-500/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Word Top Title Bar */}
            <div className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between text-[10px] font-bold select-none">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white text-blue-700 rounded font-black flex items-center justify-center text-[10px] shadow-sm">
                  W
                </div>
                <span className="tracking-wide uppercase">Microsoft Word</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveDraft(true)}
                  disabled={isSavingDraft || charCount < 3}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[9px] font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/10 text-white"
                  title="Simpan Draf Naskah (Ctrl+S)"
                >
                  <Save className="w-3 h-3" />
                  <span>SIMPAN DRAF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(true)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[9px] font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/10"
                >
                  <Printer className="w-3 h-3" />
                  <span>PRATINJAU CETAK</span>
                </button>
              </div>
            </div>

            {/* Word Ribbon Tab Bar */}
            <div className="bg-slate-200/90 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 px-3 pt-1 flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
              <button
                type="button"
                onClick={() => setActiveRibbonTab('home')}
                className={`px-3 py-1 rounded-t-md transition-colors ${
                  activeRibbonTab === 'home'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold border-t-2 border-blue-600'
                    : 'hover:bg-slate-300/60 dark:hover:bg-slate-800'
                }`}
              >
                Beranda
              </button>
              <button
                type="button"
                onClick={() => setActiveRibbonTab('insert')}
                className={`px-3 py-1 rounded-t-md transition-colors ${
                  activeRibbonTab === 'insert'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold border-t-2 border-blue-600'
                    : 'hover:bg-slate-300/60 dark:hover:bg-slate-800'
                }`}
              >
                Sisipkan
              </button>
              <button
                type="button"
                onClick={() => setActiveRibbonTab('view')}
                className={`px-3 py-1 rounded-t-md transition-colors ${
                  activeRibbonTab === 'view'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold border-t-2 border-blue-600'
                    : 'hover:bg-slate-300/60 dark:hover:bg-slate-800'
                }`}
              >
                Tampilan
              </button>
            </div>

            {/* Word Ribbon Action Deck */}
            <div className="bg-white dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700 p-2 flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-200 select-none">
              {/* TAB 1: BERANDA (HOME) */}
              {activeRibbonTab === 'home' && (
                <>
                  {/* Font Family selector */}
                  <select
                    value={fontFamily}
                    onChange={handleFontChange}
                    aria-label="Pilih Font Family"
                    className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none font-medium"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  </select>

                  {/* Font Size selector */}
                  <select
                    value={fontSize}
                    onChange={handleSizeChange}
                    aria-label="Pilih Ukuran Font"
                    className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none font-medium"
                  >
                    <option value="12px">12 pt</option>
                    <option value="14px">14 pt</option>
                    <option value="16px">16 pt</option>
                    <option value="18px">18 pt</option>
                    <option value="20px">20 pt</option>
                    <option value="24px">24 pt</option>
                  </select>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  {/* Text Formatting: Bold, Italic, Underline, Strikethrough */}
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    title="Tebal (Bold / Ctrl+B)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    title="Miring (Italic / Ctrl+I)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    title="Garis Bawah (Underline / Ctrl+U)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('strikeThrough')}
                    title="Coret Teks (Strikethrough)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  {/* Text Color & Highlight */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    <label className="flex items-center gap-1 cursor-pointer" title="Warna Teks">
                      <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer" title="Warna Stabilo Highlight">
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      <input
                        type="color"
                        value={highlightColor}
                        onChange={(e) => handleHighlightColorChange(e.target.value)}
                        className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </label>
                  </div>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  {/* Alignments */}
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyLeft')}
                    title="Rata Kiri (Align Left)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyCenter')}
                    title="Rata Tengah (Center)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyRight')}
                    title="Rata Kanan (Align Right)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyFull')}
                    title="Rata Kiri-Kanan (Justify)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  {/* Lists & Clear Format */}
                  <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    title="Daftar Simbol (Bullet points)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    title="Daftar Angka (Numbering)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('removeFormat')}
                    title="Bersihkan Format Teks (Clear Format)"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* TAB 2: SISIPKAN (INSERT) */}
              {activeRibbonTab === 'insert' && (
                <>
                  {/* Table Modal & Row/Col Helpers */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleOpenTableModal}
                      title="Sisipkan Tabel Baru"
                      className="px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Sisipkan Tabel</span>
                    </button>
                    <button
                      type="button"
                      onClick={addTableRow}
                      title="Tambah Baris Baru pada Tabel"
                      className="px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Baris</span>
                    </button>
                    <button
                      type="button"
                      onClick={addTableColumn}
                      title="Tambah Kolom Baru pada Tabel"
                      className="px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <Columns className="w-3 h-3" />
                      <span>Kolom</span>
                    </button>
                    <button
                      type="button"
                      onClick={deleteTableRow}
                      title="Hapus Baris Terakhir"
                      className="px-1.5 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-amber-600"
                    >
                      <Minus className="w-3 h-3" />
                      <span>Baris</span>
                    </button>
                  </div>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  {/* Insert Image Upload */}
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageInsert}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    title="Sisipkan Foto / Gambar ke Dokumen"
                    className="px-2.5 py-1 text-xs rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Sisipkan Foto Gambar</span>
                  </button>

                  <button
                    type="button"
                    onClick={insertHorizontalRule}
                    title="Sisipkan Garis Pembatas"
                    className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer font-medium"
                  >
                    Garis Pembatas
                  </button>
                </>
              )}

              {/* TAB 3: TAMPILAN (VIEW) */}
              {activeRibbonTab === 'view' && (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="text-slate-500">Skala Zoom Lembar Kerja:</span>
                    <button
                      type="button"
                      onClick={() => setZoomScale(Math.max(80, zoomScale - 10))}
                      className="p-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Perkecil Zoom"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs w-10 text-center font-bold">{zoomScale}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomScale(Math.min(140, zoomScale + 10))}
                      className="p-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Perbesar Zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => setShowPrintPreview(true)}
                    className="px-2.5 py-1 text-xs rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Mode Cetak A4</span>
                  </button>
                </>
              )}

              {/* Reset Document Button */}
              <button
                type="button"
                onClick={handleReset}
                title="Kosongkan Lembar Kerja"
                className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Anti-cheat Copy-Paste warning banner */}
            {copyPasteWarning && (
              <div className="bg-rose-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-in fade-in">
                <span>{copyPasteWarning}</span>
                <button
                  onClick={() => setCopyPasteWarning(null)}
                  className="text-white hover:text-rose-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Document Paper Container (A4 sheet appearance) */}
            <div className="p-4 sm:p-8 bg-slate-200/60 dark:bg-slate-950/80 flex justify-center min-h-[800px] overflow-y-auto max-h-[85vh] custom-scrollbar">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={updateMetrics}
                onKeyUp={updateMetrics}
                onKeyDown={handleKeyDown}
                onPaste={(e) => {
                  e.preventDefault();
                  triggerCopyPasteWarning('paste');
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  triggerCopyPasteWarning('copy');
                }}
                onCut={(e) => {
                  e.preventDefault();
                  triggerCopyPasteWarning('cut');
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  triggerCopyPasteWarning('paste');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  triggerCopyPasteWarning('paste');
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                spellCheck={false}
                style={{
                  fontFamily,
                  fontSize,
                  transform: `scale(${zoomScale / 100})`,
                  transformOrigin: 'top center',
                }}
                className="word-paper-content w-full bg-white text-slate-900 p-12 sm:p-16 rounded-sm shadow-2xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 select-text min-h-[1000px]"
                data-placeholder="Mulai mengetik di sini..."
                dangerouslySetInnerHTML={{
                  __html: '<p>Mulai mengetik di sini sesuai naskah acuan di atas...</p>',
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-indigo-500" />
                Sisipkan Tabel Dokumen
              </h3>
              <button
                onClick={() => setShowTableModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Jumlah Baris (Rows):
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Jumlah Kolom (Cols):
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-3.5 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sisipkan ke Lembar Kerja
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Print Preview Modal for Word Document */}
      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        title={`Dokumen Word - ${practice.title}`}
        subtitle={`Cetak naskah hasil latihan mengetik MS Word (${wordCount} kata)`}
        contentHtml={generateWordPrintHtml()}
        paperOrientation="portrait"
        itemCount={1}
      />
    </div>
  );
};
