import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  FileSpreadsheet,
  HelpCircle,
  KeyRound,
  Plus,
  School,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { createUser, getRegisteredSchools, getUsers } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface BulkAddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedStudentItem {
  rawLine: string;
  name: string;
  nisn: string;
  grade: string;
  school: string;
  password: string;
  isValid: boolean;
  error?: string;
}

export const BulkAddStudentsModal: React.FC<BulkAddStudentsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showSuccess, showError, showWarning } = useToast();
  const { isPembina, assignedSchool } = useAuth();

  const [defaultPassword, setDefaultPassword] = useState('Siswa@123');
  const [defaultGrade, setDefaultGrade] = useState('Kelas 4A');
  const [defaultSchool, setDefaultSchool] = useState(() => assignedSchool || (getRegisteredSchools()[0] || ''));
  const [rawInput, setRawInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing users to check duplicate NISN
  const existingUsers = useMemo(() => getUsers(), [isOpen]);
  const existingNisns = useMemo(
    () => new Set(existingUsers.map((u) => (u.nisn || u.username).toLowerCase().trim())),
    [existingUsers]
  );

  // Parse lines in real-time
  const parsedItems = useMemo<ParsedStudentItem[]>(() => {
    if (!rawInput.trim()) return [];

    const lines = rawInput.split('\n');
    const result: ParsedStudentItem[] = [];
    const currentBatchNisns = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Support tab separation (from Excel/Sheets) or comma / semicolon separation
      let parts: string[] = [];
      if (trimmed.includes('\t')) {
        parts = trimmed.split('\t').map((p) => p.trim());
      } else if (trimmed.includes(';')) {
        parts = trimmed.split(';').map((p) => p.trim());
      } else {
        parts = trimmed.split(',').map((p) => p.trim());
      }

      // Format combinations:
      // 1 part: Name (invalid without NISN)
      // 2 parts: Name, NISN
      // 3 parts: Name, NISN, Grade
      // 4 parts: Name, NISN, Grade, School
      // 5 parts: Name, NISN, Grade, School, Password
      const name = parts[0] || '';
      const nisn = parts[1] || '';
      const grade = parts[2] || defaultGrade;
      const school = isPembina && assignedSchool ? assignedSchool : (parts[3] || defaultSchool);
      const password = parts[4] || defaultPassword;

      let isValid = true;
      let error = '';

      if (!name) {
        isValid = false;
        error = 'Nama siswa kosong';
      } else if (!nisn) {
        isValid = false;
        error = 'NISN siswa kosong';
      } else if (existingNisns.has(nisn.toLowerCase())) {
        isValid = false;
        error = `NISN ${nisn} sudah terdaftar di sistem`;
      } else if (currentBatchNisns.has(nisn.toLowerCase())) {
        isValid = false;
        error = `NISN ${nisn} duplikat dalam daftar input ini`;
      }

      if (nisn) {
        currentBatchNisns.add(nisn.toLowerCase());
      }

      result.push({
        rawLine: trimmed,
        name,
        nisn,
        grade,
        school,
        password,
        isValid,
        error,
      });
    });

    return result;
  }, [rawInput, defaultGrade, defaultSchool, defaultPassword, existingNisns]);

  const validCount = parsedItems.filter((i) => i.isValid).length;
  const invalidCount = parsedItems.filter((i) => !i.isValid).length;

  const handleApplyTemplate = (exampleType: 'sample' | 'excel') => {
    const activeSchool = defaultSchool || 'SD Binaan';
    if (exampleType === 'sample') {
      setRawInput(
        `Ahmad Fauzi, 0011223344, Kelas 4A, ${activeSchool}
Budi Santoso, 0022334455, Kelas 4A, ${activeSchool}
Citra Lestari, 0033445566, Kelas 4B, ${activeSchool}
Dimas Prayoga, 0044556677, Kelas 5A, ${activeSchool}
Eka Putri Rahayu, 0055667788, Kelas 5B, ${activeSchool}`
      );
    } else {
      setRawInput(
        `Fajar Pratama\t0066778899\tKelas 4A\t${activeSchool}
Gita Novitasari\t0077889900\tKelas 4B\t${activeSchool}
Hendra Saputra\t0088990011\tKelas 5A\t${activeSchool}`
      );
    }
  };

  const handleSaveBulk = () => {
    const validItems = parsedItems.filter((i) => i.isValid);

    if (validItems.length === 0) {
      showError('Tidak ada data siswa valid untuk disimpan. Periksa kembali format input.');
      return;
    }

    setIsSubmitting(true);

    try {
      let createdCount = 0;
      validItems.forEach((item) => {
        createUser({
          role: 'student',
          name: item.name,
          username: item.nisn,
          nisn: item.nisn,
          grade: item.grade,
          school: item.school,
          password: item.password || defaultPassword || 'Siswa@123',
        });
        createdCount++;
      });

      showSuccess(
        `Berhasil menambahkan ${createdCount} akun siswa baru sekaligus dengan password default "${defaultPassword}".`,
        'Tambah Banyak Siswa Berhasil'
      );
      setRawInput('');
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      showError('Terjadi kesalahan saat memproses penambahan akun siswa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Banyak Akun Siswa (Bulk Add)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Buat puluhan hingga ratusan akun siswa sekaligus dengan format teks atau copy-paste dari Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Default Values Setting Row */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                Pengaturan Nilai Default (Bawaan)
              </span>
              <span className="text-[11px] text-slate-500">
                Otomatis diterapkan jika baris siswa tidak mencantumkan data tersebut
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Password Akun:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultPassword}
                    onChange={(e) => setDefaultPassword(e.target.value)}
                    placeholder="Siswa@123"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                    Preset
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Preset default: <strong className="text-indigo-600 dark:text-indigo-400">Siswa@123</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Kelas:
                </label>
                <input
                  type="text"
                  value={defaultGrade}
                  onChange={(e) => setDefaultGrade(e.target.value)}
                  placeholder="Contoh: Kelas 4A"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Dapat disesuaikan per kelas</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Asal Sekolah:
                </label>
                {isPembina && assignedSchool ? (
                  <div className="w-full px-3 py-2 text-xs rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold flex items-center justify-between">
                    <span>{assignedSchool}</span>
                    <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-1.5 py-0.5 rounded text-purple-800 dark:text-purple-200">
                      Binaan
                    </span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={defaultSchool}
                    onChange={(e) => setDefaultSchool(e.target.value)}
                    placeholder="Contoh: SD Bintang Kejora"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
                <p className="text-[10px] text-slate-500 mt-1">
                  {isPembina ? 'Otomatis terkunci untuk sekolah binaan' : 'Nama sekolah asal'}
                </p>
              </div>
            </div>
          </div>

          {/* Input Textarea & Format Helpers */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Tempel (Paste) Baris Data Siswa:
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('sample')}
                  className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Isi Contoh Teks Koma
                </button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('excel')}
                  className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Isi Contoh Excel (Tab)
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={`Contoh baris data siswa (1 siswa per baris):
Nama Siswa, NISN
Nama Siswa, NISN, Kelas
Nama Siswa, NISN, Kelas, Asal Sekolah
Nama Siswa, NISN, Kelas, Asal Sekolah, Password Khusus

Atau langsung blok kolom di Microsoft Excel / Google Sheets lalu tekan Ctrl+V di sini!`}
              className="w-full px-3.5 py-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />

            <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Petunjuk Format:</strong> Pisahkan data dengan tanda koma (<code>,</code>), titik koma (<code>;</code>), atau <strong>Tab</strong> langsung dari tabel Excel. Jika kolom kelas atau sekolah tidak diisi, otomatis memakai nilai default di atas.
              </span>
            </div>
          </div>

          {/* Live Preview Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Pratinjau Hasil Parsing ({parsedItems.length} Siswa Terdeteksi)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    {validCount} Siap Dibuat
                  </span>
                  {invalidCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                      {invalidCount} Ada Masalah
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-[11px] text-left">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Nama Siswa</th>
                      <th className="py-2 px-3">NISN / Akun</th>
                      <th className="py-2 px-3">Kelas</th>
                      <th className="py-2 px-3">Sekolah</th>
                      <th className="py-2 px-3">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {parsedItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          item.isValid
                            ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            : 'bg-rose-50/50 dark:bg-rose-950/30'
                        }
                      >
                        <td className="py-2 px-3 whitespace-nowrap">
                          {item.isValid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Valid
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold"
                              title={item.error}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {item.error}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {item.nisn}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {item.grade}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
                          {item.school}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {item.password}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="text-xs text-slate-500">
            {validCount > 0 ? (
              <span>
                <strong>{validCount}</strong> akun siswa siap dibuat dengan password default: <code>{defaultPassword}</code>
              </span>
            ) : (
              <span>Masukkan minimal 1 data siswa valid</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={validCount === 0 || isSubmitting}
              onClick={handleSaveBulk}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Buat {validCount > 0 ? `${validCount} Akun` : 'Akun'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
