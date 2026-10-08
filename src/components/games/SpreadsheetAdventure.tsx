import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  PieChart,
  Trophy,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { getActiveUser, awardStudentPoints } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface Scenario {
  id: string;
  levelNum: number;
  title: string;
  shortLabel: string;
  story: string;
  task: string;
  defaultData: Record<string, string>;
  targetCell: string;
  expectedFormula: RegExp;
  expectedResult: number;
  explanation: string;
  chartLabels: string[];
  chartValuesKey: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'scen-1',
    levelNum: 1,
    title: 'Level 1: Kantin Kejujuran — Rumus =SUM (Penjumlahan)',
    shortLabel: 'Lvl 1: =SUM',
    story: 'Kantin sekolah baru saja membeli stok makanan ringan. Bantu Ibu Kantin menjumlahkan total harga belanjaan menggunakan rumus penjumlahan otomatis.',
    task: 'Ketik rumus =SUM(C2:C5) pada sel C6 untuk menghitung total belanjaan.',
    defaultData: {
      A1: 'Nama Barang', B1: 'Jumlah', C1: 'Total (Rp)',
      A2: 'Roti Cokelat', B2: '10', C2: '20000',
      A3: 'Susu Kotak', B3: '15', C3: '45000',
      A4: 'Biskuit Gandum', B4: '8', C4: '24000',
      A5: 'Air Mineral', B5: '20', C5: '30000',
      A6: 'TOTAL BELANJA', B6: '53', C6: '',
    },
    targetCell: 'C6',
    expectedFormula: /^=SUM\s*\(\s*C2\s*:\s*C5\s*\)$/i,
    expectedResult: 119000,
    explanation: 'Hebat sekali! Rumus =SUM(C2:C5) otomatis menjumlahkan seluruh angka dari baris C2 sampai C5 menjadi Rp 119.000.',
    chartLabels: ['Roti', 'Susu', 'Biskuit', 'Air'],
    chartValuesKey: ['C2', 'C3', 'C4', 'C5'],
  },
  {
    id: 'scen-2',
    levelNum: 2,
    title: 'Level 2: Analisis Nilai Kelas — Rumus =AVERAGE (Rata-rata)',
    shortLabel: 'Lvl 2: =AVERAGE',
    story: 'Pak Guru Pembina ingin mengetahui rata-rata nilai latihan mengetik 5 siswa di kelompok belajar Sukadamai 2.',
    task: 'Ketik rumus =AVERAGE(B2:B6) pada sel B7 untuk menghitung nilai rata-rata kelas.',
    defaultData: {
      A1: 'Nama Siswa', B1: 'Skor Mengetik', C1: 'Keterangan',
      A2: 'Arya', B2: '85', C2: 'Lulus',
      A3: 'Sisi', B3: '90', C3: 'Lulus',
      A4: 'Budi', B4: '75', C4: 'Lulus',
      A5: 'Citra', B5: '95', C5: 'Sempurna',
      A6: 'Doni', B6: '80', C6: 'Lulus',
      A7: 'RATA-RATA', B7: '', C7: 'Target 80',
    },
    targetCell: 'B7',
    expectedFormula: /^=AVERAGE\s*\(\s*B2\s*:\s*B6\s*\)$/i,
    expectedResult: 85,
    explanation: 'Luar biasa! Rumus =AVERAGE(B2:B6) menghitung nilai rata-rata otomatis menjadi 85 tanpa harus menghitung manual!',
    chartLabels: ['Arya', 'Sisi', 'Budi', 'Citra', 'Doni'],
    chartValuesKey: ['B2', 'B3', 'B4', 'B5', 'B6'],
  },
  {
    id: 'scen-3',
    levelNum: 3,
    title: 'Level 3: Juara Lomba Esports — Rumus =MAX (Nilai Tertinggi)',
    shortLabel: 'Lvl 3: =MAX',
    story: 'Dalam turnamen mengetik cepat antar-sekolah, panitia ingin mengetahui skor tertinggi yang diraih oleh peserta.',
    task: 'Ketik rumus =MAX(B2:B5) pada sel B6 untuk mencari skor tertinggi.',
    defaultData: {
      A1: 'Nama Peserta', B1: 'WPM Kecepatan', C1: 'Sekolah',
      A2: 'Rian Pratama', B2: '72', C2: 'SDN 01',
      A3: 'Fathir Ahmad', B3: '88', C3: 'SDN 03',
      A4: 'Nayla Zahra', B4: '64', C4: 'SDN 02',
      A5: 'Kenzo Alif', B5: '94', C5: 'SD Ceria',
      A6: 'SKOR TERTINGGI', B6: '', C6: 'Juara 1',
    },
    targetCell: 'B6',
    expectedFormula: /^=MAX\s*\(\s*B2\s*:\s*B5\s*\)$/i,
    expectedResult: 94,
    explanation: 'Tepat sekali! Rumus =MAX(B2:B5) otomatis memindai dan menemukan skor tertinggi yaitu 94 WPM!',
    chartLabels: ['Rian', 'Fathir', 'Nayla', 'Kenzo'],
    chartValuesKey: ['B2', 'B3', 'B4', 'B5'],
  },
  {
    id: 'scen-4',
    levelNum: 4,
    title: 'Level 4: Absensi Lab Komputer — Rumus =COUNT (Menghitung Data)',
    shortLabel: 'Lvl 4: =COUNT',
    story: 'Petugas lab komputer ingin menghitung berapa banyak komputer yang hadir dan aktif digunakan saat praktikum.',
    task: 'Ketik rumus =COUNT(B2:B6) pada sel B7 untuk menghitung jumlah unit komputer yang aktif.',
    defaultData: {
      A1: 'Nomor PC', B1: 'Durasi (Menit)', C1: 'Status',
      A2: 'PC-01', B2: '45', C2: 'Online',
      A3: 'PC-02', B3: '60', C3: 'Online',
      A4: 'PC-03', B4: '30', C4: 'Online',
      A5: 'PC-04', B5: '50', C5: 'Online',
      A6: 'PC-05', B6: '40', C6: 'Online',
      A7: 'TOTAL UNIT', B7: '', C7: 'Terpakai',
    },
    targetCell: 'B7',
    expectedFormula: /^=COUNT\s*\(\s*B2\s*:\s*B6\s*\)$/i,
    expectedResult: 5,
    explanation: 'Sempurna! Rumus =COUNT(B2:B6) menghitung ada 5 sel berisi angka durasi praktikum.',
    chartLabels: ['PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05'],
    chartValuesKey: ['B2', 'B3', 'B4', 'B5', 'B6'],
  },
  {
    id: 'scen-5',
    levelNum: 5,
    title: 'Level 5: Rekapitulasi Pembelian — Rumus =MIN (Harga Termurah)',
    shortLabel: 'Lvl 5: =MIN',
    story: 'Bantu bagian inventaris lab mencari harga peralatan komputer paling murah untuk penghematan anggaran.',
    task: 'Ketik rumus =MIN(B2:B5) pada sel B6 untuk mencari harga komponen paling hemat.',
    defaultData: {
      A1: 'Nama Aksesoris', B1: 'Harga Satuan (Rb)', C1: 'Kategori',
      A2: 'Mouse USB', B2: '35', C2: 'Hardware',
      A3: 'Mousepad Ceria', B3: '15', C3: 'Aksesoris',
      A4: 'Kabel LAN 2M', B4: '20', C4: 'Jaringan',
      A5: 'Keyboard USB', B5: '65', C5: 'Hardware',
      A6: 'HARGA TERMURAH', B6: '', C6: 'Hemat Budget',
    },
    targetCell: 'B6',
    expectedFormula: /^=MIN\s*\(\s*B2\s*:\s*B5\s*\)$/i,
    expectedResult: 15,
    explanation: 'Luar biasa! Rumus =MIN(B2:B5) otomatis menemukan nilai terendah yaitu 15 (Rp 15.000 untuk Mousepad).',
    chartLabels: ['Mouse', 'Mousepad', 'Kabel LAN', 'Keyboard'],
    chartValuesKey: ['B2', 'B3', 'B4', 'B5'],
  },
];

export const SpreadsheetAdventure: React.FC = () => {
  const { showSuccess, showStarReward } = useToast();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const activeScen = SCENARIOS[scenarioIdx];
  const [gridData, setGridData] = useState<Record<string, string>>({ ...activeScen.defaultData });
  const [selectedCell, setSelectedCell] = useState<string>(activeScen.targetCell);
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [showGrandVictory, setShowGrandVictory] = useState(false);

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setFormulaInput(gridData[cellId] || '');
  };

  const handleFormulaSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCell) return;

    const trimmed = formulaInput.trim();
    const updated = { ...gridData, [selectedCell]: trimmed };
    setGridData(updated);

    // Validate formula for target cell
    if (selectedCell === activeScen.targetCell) {
      if (activeScen.expectedFormula.test(trimmed)) {
        setFeedback({
          isSuccess: true,
          text: activeScen.explanation,
        });
        setShowLevelVictory(true);

        if (!completedScenarios.includes(activeScen.id)) {
          const newCompleted = [...completedScenarios, activeScen.id];
          setCompletedScenarios(newCompleted);
          setTotalPoints((prev) => prev + 50);

          const student = getActiveUser();
          if (student && student.role === 'student') {
            awardStudentPoints(student.id, 50);
          }
          showStarReward(5, `Rumus Excel ${activeScen.title} berhasil diterapkan (+50 Poin)!`, 'Bintang Rumus Excel!');
        }
      } else {
        setFeedback({
          isSuccess: false,
          text: `Rumus belum sesuai! Petunjuk: ${activeScen.task}`,
        });
      }
    }
  };

  const handleNext = () => {
    setShowLevelVictory(false);
    if (scenarioIdx < SCENARIOS.length - 1) {
      const nextIdx = scenarioIdx + 1;
      setScenarioIdx(nextIdx);
      setGridData({ ...SCENARIOS[nextIdx].defaultData });
      setSelectedCell(SCENARIOS[nextIdx].targetCell);
      setFormulaInput('');
      setFeedback(null);
      setShowChart(false);
    } else {
      setShowGrandVictory(true);
    }
  };

  const handleSelectScenario = (idx: number) => {
    setScenarioIdx(idx);
    setGridData({ ...SCENARIOS[idx].defaultData });
    setSelectedCell(SCENARIOS[idx].targetCell);
    setFormulaInput('');
    setFeedback(null);
    setShowChart(false);
    setShowLevelVictory(false);
  };

  const handleRestart = () => {
    setScenarioIdx(0);
    setGridData({ ...SCENARIOS[0].defaultData });
    setSelectedCell(SCENARIOS[0].targetCell);
    setFormulaInput('');
    setFeedback(null);
    setShowChart(false);
    setCompletedScenarios([]);
    setTotalPoints(0);
    setShowLevelVictory(false);
    setShowGrandVictory(false);
  };

  const columns = ['A', 'B', 'C'];
  const rows = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3" />
              Petualangan Rumus Spreadsheet
            </span>
            <span className="text-xs text-slate-500">
              Level {activeScen.levelNum} dari {SCENARIOS.length}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {activeScen.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeScen.story}
          </p>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SCENARIOS.map((scen, idx) => {
            const isDone = completedScenarios.includes(scen.id);
            const isCurrent = idx === scenarioIdx;
            return (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(idx)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-500/30'
                    : isDone
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                <span>{scen.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task instruction card */}
      <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Tugas Kamu:</strong> {activeScen.task}
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
          Target Sel: {activeScen.targetCell}
        </span>
      </div>

      {/* Formula Bar (Excel UI Style) */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-1 px-2 py-1 font-mono font-bold bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 min-w-14 text-center">
          {selectedCell}
        </div>
        <span className="font-serif italic font-bold text-slate-400 px-1">fx</span>
        <form onSubmit={handleFormulaSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => {
              if (e.target.value.length - formulaInput.length > 2) {
                return;
              }
              setFormulaInput(e.target.value);
            }}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && ['v', 'V'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="Ketik rumus manual, misal: =SUM(C2:C5) (No Paste)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Terapkan Rumus
          </button>
        </form>
      </div>

      {/* Spreadsheet Grid & Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Excel Grid (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto">
          <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
            <table className="w-full text-xs text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-b border-slate-300 dark:border-slate-700 font-bold select-none">
                  <th className="w-10 p-2 text-center border-r border-slate-300 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-800">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="p-2 text-center border-r border-slate-300 dark:border-slate-700 font-bold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="p-2 text-center font-bold text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 border-r border-slate-300 dark:border-slate-700 select-none">
                      {row}
                    </td>
                    {columns.map((col) => {
                      const cellId = `${col}${row}`;
                      const isSelected = selectedCell === cellId;
                      const isTarget = activeScen.targetCell === cellId;
                      const val = gridData[cellId] || '';

                      return (
                        <td
                          key={cellId}
                          onClick={() => handleCellClick(cellId)}
                          className={`p-2 border-r border-slate-200 dark:border-slate-800 font-mono transition-colors cursor-cell ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500 z-10 font-bold text-emerald-900 dark:text-emerald-200'
                              : isTarget
                              ? 'bg-amber-50/60 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          } ${row === 1 ? 'font-bold bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white' : ''}`}
                        >
                          {val || (isTarget ? <span className="text-amber-500 font-sans italic text-[11px] font-normal">Klik & isi rumus</span> : '')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Feedback & Interactive Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {feedback && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in ${
                feedback.isSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {feedback.isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold leading-relaxed">{feedback.text}</p>
                {feedback.isSuccess && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowChart(!showChart)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{showChart ? 'Tutup Grafik' : 'Buat Grafik Visual'}</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>{scenarioIdx < SCENARIOS.length - 1 ? 'Lanjut Level Berikutnya' : 'Lihat Gelar Tamat!'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Chart Generator */}
          {showChart && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Grafik Visual Data Otomatis
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                  Live Excel Chart
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="space-y-2 pt-2">
                {activeScen.chartLabels.map((lbl, idx) => {
                  const cellKey = activeScen.chartValuesKey[idx];
                  const rawVal = parseInt(gridData[cellKey] || '0') || 0;
                  const maxVal = Math.max(
                    ...activeScen.chartValuesKey.map((k) => parseInt(gridData[k] || '0') || 1)
                  );
                  const percentage = Math.round((rawVal / maxVal) * 100);

                  return (
                    <div key={lbl} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <span>{lbl}</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {rawVal.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-2">
                💡 Di Microsoft Excel, Anda cukup memilih kolom dan klik menu <em>Insert ➔ Chart</em> untuk membuat grafik instan seperti ini!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Level Selesai & Lanjut Level */}
      {showLevelVictory && !showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-emerald-400 via-teal-500 to-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {activeScen.levelNum} Selesai!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Rumus Berhasil Diterapkan!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Kamu sukses menguasai sintaks formula spreadsheet untuk {activeScen.shortLabel}!
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonus Hadiah</span>
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                +50 Poin Bintang
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLevelVictory(false)}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{scenarioIdx < SCENARIOS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Master Excel!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Grand Victory Semua Level */}
      {showGrandVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500/50 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-linear-to-tr from-emerald-500 via-teal-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Gelar Master Formula Spreadsheet
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                🏆 Petualangan Rumus Tamat!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Luar biasa! Kamu telah menuntaskan seluruh 5 formula fundamental Microsoft Excel / Spreadsheet: =SUM, =AVERAGE, =MAX, =MIN, dan =COUNT!
              </p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <span className="font-extrabold block">Poin Bintang & Lencana Analisis Data Telah Diberikan</span>
              <p className="text-[11px] opacity-80">Kemampuan olah datamu kini siap untuk tugas sekolah dan perkantoran!</p>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              Mainkan Lagi dari Level 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
