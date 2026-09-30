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
} from 'lucide-react';
import { getActiveUser, awardStudentPoints } from '../../services/storageService';

interface Scenario {
  id: string;
  title: string;
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
    title: 'Kantin Kejujuran: Menghitung Total Belanja',
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
    explanation: 'Hebat sekali! Rumus =SUM(C2:C5) otomatis menjumlahkan seluruh angka dari baris 2 sampai 5 menjadi Rp 119.000.',
    chartLabels: ['Roti', 'Susu', 'Biskuit', 'Air'],
    chartValuesKey: ['C2', 'C3', 'C4', 'C5'],
  },
  {
    id: 'scen-2',
    title: 'Analisis Nilai Komputer: Menghitung Rata-rata',
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
];

export const SpreadsheetAdventure: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const activeScen = SCENARIOS[scenarioIdx];
  const [gridData, setGridData] = useState<Record<string, string>>({ ...activeScen.defaultData });
  const [selectedCell, setSelectedCell] = useState<string>(activeScen.targetCell);
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

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

        if (!completedScenarios.includes(activeScen.id)) {
          const newCompleted = [...completedScenarios, activeScen.id];
          setCompletedScenarios(newCompleted);
          setTotalPoints((prev) => prev + 100);

          const student = getActiveUser();
          if (student && student.role === 'student') {
            awardStudentPoints(student.id, 100);
          }
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
    if (scenarioIdx < SCENARIOS.length - 1) {
      const nextIdx = scenarioIdx + 1;
      setScenarioIdx(nextIdx);
      setGridData({ ...SCENARIOS[nextIdx].defaultData });
      setSelectedCell(SCENARIOS[nextIdx].targetCell);
      setFormulaInput('');
      setFeedback(null);
      setShowChart(false);
    }
  };

  const handleReset = () => {
    setGridData({ ...activeScen.defaultData });
    setSelectedCell(activeScen.targetCell);
    setFormulaInput('');
    setFeedback(null);
    setShowChart(false);
  };

  const columns = ['A', 'B', 'C'];
  const rows = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Top Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3" />
              Petualangan Spreadsheet Cilik
            </span>
            <span className="text-xs text-slate-500">Misi #{scenarioIdx + 1}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {activeScen.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeScen.story}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Bintang Didapat</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              +{totalPoints} Poin
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Reset Spreadsheet"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Mission Banner */}
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-700 dark:text-emerald-300">Tugas Siswa: </strong>
          <span>{activeScen.task}</span>
        </div>
      </div>

      {/* Formula Bar (like Microsoft Excel) */}
      <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[50px] text-center">
          {selectedCell || 'A1'}
        </div>
        <span className="text-xs font-bold text-slate-400 select-none font-mono">fx</span>
        <form onSubmit={handleFormulaSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => setFormulaInput(e.target.value)}
            placeholder="Ketik rumus di sini, misal: =SUM(C2:C5)"
            className="flex-1 px-3 py-1 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-all cursor-pointer"
          >
            Terapkan
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
                    {scenarioIdx < SCENARIOS.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Misi Selanjutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
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
    </div>
  );
};
