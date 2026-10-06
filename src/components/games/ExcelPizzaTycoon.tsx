import React, { useState, useEffect } from 'react';
import {
  Pizza,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  Award,
  DollarSign,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { awardStudentPoints, recordGameScore } from '../../services/storageService';
import { soundEffects } from '../../utils/soundEffects';

interface OrderItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  pizzaName: string;
  qty: number;
  pricePerUnit: number;
  drinkName?: string;
  drinkQty?: number;
  drinkPrice?: number;
  discountPct?: number; // e.g. 10 for 10%
  tipAmount?: number;
  formulaHint: string;
  targetFormulaType: 'MULT' | 'SUM_MULT' | 'DISCOUNT' | 'AVERAGE';
}

const ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    customerName: 'Budi Santoso',
    customerAvatar: '👦',
    pizzaName: 'Meat Lovers Pizza',
    qty: 3,
    pricePerUnit: 35000,
    formulaHint: '=B2*C2 (Jumlah Pizza × Harga Satuan)',
    targetFormulaType: 'MULT',
  },
  {
    id: 'ord-2',
    customerName: 'Siti Rahma',
    customerAvatar: '👧',
    pizzaName: 'Cheese Supreme Pizza',
    qty: 2,
    pricePerUnit: 30000,
    drinkName: 'Es Teh Manis',
    drinkQty: 2,
    drinkPrice: 5000,
    formulaHint: '=(B2*C2)+(B3*C3) (Subtotal Pizza + Subtotal Minuman)',
    targetFormulaType: 'SUM_MULT',
  },
  {
    id: 'ord-3',
    customerName: 'Pak Guru Radit',
    customerAvatar: '👨‍🏫',
    pizzaName: 'Veggie Garden Pizza',
    qty: 4,
    pricePerUnit: 25000,
    discountPct: 10,
    formulaHint: '=(B2*C2)*0.9 atau =(B2*C2)-10000 (Diskon Pelajar 10%)',
    targetFormulaType: 'DISCOUNT',
  },
  {
    id: 'ord-4',
    customerName: 'Dokter Anita',
    customerAvatar: '👩‍⚕️',
    pizzaName: 'Mushroom Truffle Pizza',
    qty: 5,
    pricePerUnit: 40000,
    drinkName: 'Jus Jeruk Segar',
    drinkQty: 5,
    drinkPrice: 10000,
    discountPct: 15,
    formulaHint: '=(Subtotal)*0.85 (Diskon Akhir Pekan 15%)',
    targetFormulaType: 'DISCOUNT',
  },
  {
    id: 'ord-5',
    customerName: 'Komite Kelas 5A',
    customerAvatar: '🏆',
    pizzaName: 'Pesta Raksasa Pizza Jumbo',
    qty: 8,
    pricePerUnit: 50000,
    drinkName: 'Air Mineral Galon Kecil',
    drinkQty: 4,
    drinkPrice: 15000,
    discountPct: 20,
    tipAmount: 25000,
    formulaHint: '=(Total Diskon) + Tip Kasir',
    targetFormulaType: 'DISCOUNT',
  },
];

export const ExcelPizzaTycoon: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showStarReward } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userFormula, setUserFormula] = useState('=');
  const [computedResult, setComputedResult] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => soundEffects.isEnabled());

  const currentOrder = ORDERS[currentIdx];

  // Calculate actual total
  const calculateExpected = (order: OrderItem): number => {
    const pizzaSub = order.qty * order.pricePerUnit;
    const drinkSub = (order.drinkQty || 0) * (order.drinkPrice || 0);
    const subtotal = pizzaSub + drinkSub;
    let finalTot = subtotal;
    if (order.discountPct) {
      finalTot = subtotal * (1 - order.discountPct / 100);
    }
    if (order.tipAmount) {
      finalTot += order.tipAmount;
    }
    return Math.round(finalTot);
  };

  const handleEvaluate = () => {
    if (!userFormula.startsWith('=')) {
      setFeedbackMsg('⚠️ Rumus spreadsheet wajib diawali dengan tanda sama dengan (=)! Contoh: =B2*C2');
      soundEffects.playQuizIncorrect();
      return;
    }

    const expected = calculateExpected(currentOrder);
    let evaluatedVal: number | null = null;

    try {
      // Clean string expression
      // Substitute cells into values for realism
      let expr = userFormula.substring(1).trim().toUpperCase();
      
      // Replace table cell references
      // B2 is pizza qty, C2 is pizza price
      expr = expr.replace(/\bB2\b/g, String(currentOrder.qty));
      expr = expr.replace(/\bC2\b/g, String(currentOrder.pricePerUnit));
      
      if (currentOrder.drinkName) {
        expr = expr.replace(/\bB3\b/g, String(currentOrder.drinkQty || 0));
        expr = expr.replace(/\bC3\b/g, String(currentOrder.drinkPrice || 0));
      }

      // Handle basic Excel SUM syntax: SUM(x, y) or SUM(x+y)
      expr = expr.replace(/SUM\(([^)]+)\)/g, '($1)');

      // Safe arithmetic evaluator
      // Allow only numbers, operators, parentheses, and decimals
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        setFeedbackMsg('⚠️ Rumus mengandung karakter yang tidak dikenal. Gunakan angka, sel (B2, C2), dan operator (+, -, *, /).');
        soundEffects.playQuizIncorrect();
        return;
      }

      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${expr})`)();
      evaluatedVal = Math.round(Number(result));
    } catch {
      setFeedbackMsg('⚠️ Format rumus spreadsheet keliru! Periksa tanda kurung atau operator matematika Anda.');
      soundEffects.playQuizIncorrect();
      return;
    }

    setComputedResult(evaluatedVal);
    setIsAnswerChecked(true);

    if (evaluatedVal === expected) {
      setIsCorrect(true);
      setFeedbackMsg(`🎉 LUAR BIASA! Hasil kasir tepat Rp ${expected.toLocaleString('id-ID')}. Pesanan berhasil dibayar!`);
      soundEffects.playQuizCorrect();
      setTotalScore((prev) => prev + 50);
    } else {
      setIsCorrect(false);
      setFeedbackMsg(`❌ Nilai perhitungan belum tepat (Hasil Anda: Rp ${evaluatedVal.toLocaleString('id-ID')}, Target: Rp ${expected.toLocaleString('id-ID')}). Cek kembali pengalian atau diskonnya.`);
      soundEffects.playQuizIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIdx < ORDERS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setUserFormula('=');
      setComputedResult(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setFeedbackMsg('');
    } else {
      setGameFinished(true);
      soundEffects.playSuccessFanfare();

      if (currentUser) {
        const finalPts = totalScore + (isCorrect ? 50 : 0);
        awardStudentPoints(currentUser.id, finalPts, { actionCategory: 'game' });
        recordGameScore('Excel Pizza Tycoon', currentUser.id, finalPts, finalPts);
        refreshUser();
        showStarReward(Math.max(1, Math.floor(finalPts / 10)), `Hebat! Kamu berhasil mengelola kedai pizza dan meraih +${finalPts} Poin!`);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setUserFormula('=');
    setComputedResult(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setTotalScore(0);
    setGameFinished(false);
    setFeedbackMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner">
            🍕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded text-amber-100">
                Simulasi Kasir Spreadsheet
              </span>
              <span className="text-xs text-white/90">Pesanan #{currentIdx + 1} dari {ORDERS.length}</span>
            </div>
            <h2 className="text-2xl font-black">Excel Pizza Tycoon 🍕</h2>
            <p className="text-xs text-orange-100 mt-0.5">
              Bantu kasir restoran pizza menghitung total struk belanja pelanggan menggunakan rumus Excel!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = soundEffects.toggle();
              setSoundEnabled(next);
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl text-center border border-white/20">
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Skor Poin</span>
            <span className="text-lg font-black font-mono text-white">+{totalScore} pt</span>
          </div>
        </div>
      </div>

      {!gameFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Customer Order Ticket */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentOrder.customerAvatar}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentOrder.customerName}
                  </h3>
                  <span className="text-[11px] text-slate-400">Pelanggan Meja {currentIdx + 1}</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                Pesanan Masuk
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    🍕 {currentOrder.pizzaName}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currentOrder.qty} porsi
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Harga Satuan:</span>
                  <span className="font-mono">Rp {currentOrder.pricePerUnit.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {currentOrder.drinkName && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      🥤 {currentOrder.drinkName}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentOrder.drinkQty} gelas
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Harga Satuan:</span>
                    <span className="font-mono">Rp {(currentOrder.drinkPrice || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}

              {currentOrder.discountPct && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs">
                  <span>🏷️ Diskon Spesial:</span>
                  <span className="font-bold">{currentOrder.discountPct}% OFF</span>
                </div>
              )}

              {currentOrder.tipAmount && (
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex items-center justify-between text-indigo-800 dark:text-indigo-300 text-xs">
                  <span>💖 Tip Sukarela:</span>
                  <span className="font-bold font-mono">+Rp {currentOrder.tipAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Tips Rumus Excel:
              </span>
              <p className="italic">{currentOrder.formulaHint}</p>
            </div>
          </div>

          {/* Right: Interactive Spreadsheet Grid (2 Columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Lembar Kasir Excel (Sheet1.xlsx)
              </h3>
              <p className="text-xs text-slate-500">
                Perhatikan alamat sel baris & kolom di bawah. Masukkan rumus kalkulasi pada sel <strong>C4 / Total Tagihan</strong>.
              </p>
            </div>

            {/* Grid Simulator */}
            <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 font-mono">
                    <th className="p-2 border-r border-slate-300 dark:border-slate-700 text-center w-10 bg-slate-200 dark:bg-slate-900">#</th>
                    <th className="p-2 border-r border-slate-300 dark:border-slate-700 text-center font-bold">A (Menu)</th>
                    <th className="p-2 border-r border-slate-300 dark:border-slate-700 text-center font-bold">B (Qty)</th>
                    <th className="p-2 text-center font-bold">C (Harga Satuan)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {/* Row 1 Header text */}
                  <tr className="bg-slate-50 dark:bg-slate-950/40">
                    <td className="p-2 border-r border-slate-300 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">1</td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">Item Pesanan</td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">Jumlah</td>
                    <td className="p-2 font-bold text-slate-700 dark:text-slate-300">Harga (Rp)</td>
                  </tr>

                  {/* Row 2: Pizza */}
                  <tr>
                    <td className="p-2 border-r border-slate-300 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">2</td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-sans text-slate-900 dark:text-white font-medium">
                      🍕 {currentOrder.pizzaName}
                    </td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                      {currentOrder.qty}
                    </td>
                    <td className="p-2 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                      {currentOrder.pricePerUnit.toLocaleString('id-ID')}
                    </td>
                  </tr>

                  {/* Row 3: Drink (if any) */}
                  {currentOrder.drinkName ? (
                    <tr>
                      <td className="p-2 border-r border-slate-300 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">3</td>
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-sans text-slate-900 dark:text-white font-medium">
                        🥤 {currentOrder.drinkName}
                      </td>
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                        {currentOrder.drinkQty}
                      </td>
                      <td className="p-2 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                        {(currentOrder.drinkPrice || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="p-2 border-r border-slate-300 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">3</td>
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-slate-400 italic font-sans">(Tidak memesan minuman)</td>
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-400">-</td>
                      <td className="p-2 text-right text-slate-400">-</td>
                    </tr>
                  )}

                  {/* Row 4: Total calculation */}
                  <tr className="bg-amber-50/60 dark:bg-amber-950/20 font-bold">
                    <td className="p-2 border-r border-slate-300 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">4</td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-sans text-amber-900 dark:text-amber-300 font-bold">
                      TOTAL BAYAR
                    </td>
                    <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-400 font-normal">
                      [Rumus]
                    </td>
                    <td className="p-2 text-right text-amber-600 dark:text-amber-400 font-bold font-mono">
                      {computedResult !== null ? `Rp ${computedResult.toLocaleString('id-ID')}` : 'Belum dihitung'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Formula Input Bar */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Bilah Rumus Kasir (Formula Bar):</span>
                <span className="text-[11px] text-slate-400">Gunakan operator *, +, -, (), atau angka</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 border border-slate-200 dark:border-slate-700">
                  fx
                </div>
                <input
                  type="text"
                  value={userFormula}
                  onChange={(e) => {
                    setUserFormula(e.target.value);
                    soundEffects.playKeypress(e.target.value.slice(-1));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEvaluate();
                    }
                  }}
                  placeholder="Ketik rumus misal: =B2*C2"
                  className="flex-1 font-mono text-sm px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleEvaluate}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Hitung (Enter)
                </button>
              </div>

              {/* Quick shortcut helper buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="text-slate-400 text-[10px]">Sisipkan Cepat:</span>
                <button
                  type="button"
                  onClick={() => setUserFormula((prev) => `${prev}B2*C2`)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
                >
                  + B2*C2
                </button>
                {currentOrder.drinkName && (
                  <button
                    type="button"
                    onClick={() => setUserFormula((prev) => `${prev}+(B3*C3)`)}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
                  >
                    + (B3*C3)
                  </button>
                )}
                {currentOrder.discountPct && (
                  <button
                    type="button"
                    onClick={() => setUserFormula((prev) => `(${prev})*${(100 - (currentOrder.discountPct || 0)) / 100}`)}
                    className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 font-mono text-[10px]"
                  >
                    × Diskon {(100 - (currentOrder.discountPct || 0)) / 100}
                  </button>
                )}
                {currentOrder.tipAmount && (
                  <button
                    type="button"
                    onClick={() => setUserFormula((prev) => `${prev}+${currentOrder.tipAmount}`)}
                    className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 hover:bg-indigo-200 text-indigo-800 dark:text-indigo-300 font-mono text-[10px]"
                  >
                    + Tip {currentOrder.tipAmount}
                  </button>
                )}
              </div>
            </div>

            {/* Evaluation Result Feedback Box */}
            {feedbackMsg && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{feedbackMsg}</p>
                  {isCorrect && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>
                        {currentIdx < ORDERS.length - 1 ? 'Lanjut ke Pesanan Berikutnya →' : 'Selesai & Lihat Skor Akhir 🏆'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GAME OVER SUMMARY CARD */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6 max-w-lg mx-auto shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🍕
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Restoran Pizza Sukses Besar!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kamu berhasil menyelesaikan seluruh pesanan pelanggan dengan rumus spreadsheet yang akurat!
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Total Poin Diraih</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                +{totalScore} pt
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Status Kasir</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                ⭐ Kasir Bintang 5
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mainkan Lagi dari Awal</span>
          </button>
        </div>
      )}
    </div>
  );
};
