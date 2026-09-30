import React, { useState } from 'react';
import {
  BookA,
  Search,
  Volume2,
  Tag,
  Sparkles,
  Info,
  Filter,
} from 'lucide-react';

interface GlossaryTerm {
  letter: string;
  term: string;
  pronunciation: string;
  category: 'Hardware' | 'Software' | 'Jaringan' | 'Keamanan Siber' | 'Dasar';
  definition: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    letter: 'A',
    term: 'Algoritma',
    pronunciation: 'Al-go-rit-ma',
    category: 'Dasar',
    definition: 'Urutan langkah-langkah logis dan teratur yang disusun untuk menyelesaikan suatu masalah atau perintah pada komputer.',
    example: 'Seperti resep membuat kue atau urutan memakai sepatu.',
  },
  {
    letter: 'B',
    term: 'Browser',
    pronunciation: 'Bra-w-zer',
    category: 'Software',
    definition: 'Perangkat lunak (aplikasi) yang digunakan untuk menjelajahi dan membuka halaman website di internet.',
    example: 'Google Chrome, Microsoft Edge, Mozilla Firefox.',
  },
  {
    letter: 'C',
    term: 'CPU (Processor)',
    pronunciation: 'See-Pee-You',
    category: 'Hardware',
    definition: 'Otak utama komputer yang bertugas memproses semua instruksi, menghitung angka, dan menjalankan aplikasi.',
    example: 'Intel Core i5, AMD Ryzen.',
  },
  {
    letter: 'D',
    term: 'Database',
    pronunciation: 'Dei-ta-beis',
    category: 'Software',
    definition: 'Kumpulan data dan informasi terstruktur yang disimpan secara elektronik di dalam sistem komputer agar mudah dicari.',
    example: 'Daftar nama seluruh siswa di sekolah.',
  },
  {
    letter: 'E',
    term: 'Enkripsi',
    pronunciation: 'En-krip-si',
    category: 'Keamanan Siber',
    definition: 'Proses mengacak data atau pesan menjadi kode rahasia sehingga hanya orang yang memiliki kunci yang bisa membacanya.',
    example: 'Pesan WhatsApp dienkripsi dari ujung ke ujung.',
  },
  {
    letter: 'F',
    term: 'Firewall',
    pronunciation: 'Fai-yer-wol',
    category: 'Keamanan Siber',
    definition: 'Dinding pertahanan keamanan jaringan yang memantau dan memblokir lalu lintas internet yang mencurigakan atau berbahaya.',
    example: 'Mencegah peretas (hacker) masuk ke komputer sekolah.',
  },
  {
    letter: 'G',
    term: 'GPU (Kartu Grafis)',
    pronunciation: 'Jee-Pee-You',
    category: 'Hardware',
    definition: 'Perangkat keras khusus yang mengolah dan menampilkan gambar, animasi 3D, serta video ke layar monitor.',
    example: 'NVIDIA GeForce, AMD Radeon.',
  },
  {
    letter: 'H',
    term: 'Harddisk / SSD',
    pronunciation: 'Hard-disk / Es-Es-Dee',
    category: 'Hardware',
    definition: 'Tempat penyimpanan permanen untuk menyimpan sistem operasi Windows, dokumen tugas, game, dan foto meskipun komputer dimatikan.',
    example: 'Kapasitas 512 Gigabyte atau 1 Terabyte.',
  },
  {
    letter: 'I',
    term: 'IP Address',
    pronunciation: 'Ai-Pee Ed-dres',
    category: 'Jaringan',
    definition: 'Alamat identitas numerik unik yang dimiliki setiap perangkat yang terhubung ke jaringan internet.',
    example: '192.168.1.1 (seperti nomor rumah digital komputer).',
  },
  {
    letter: 'J',
    term: 'Jaringan Komputer',
    pronunciation: 'Ja-ri-ngan Kom-pu-ter',
    category: 'Jaringan',
    definition: 'Kumpulan dua atau lebih komputer yang saling terhubung untuk berbagi data, printer, dan akses internet bersama.',
    example: 'Komputer di Lab Sekolah saling terhubung ke satu printer.',
  },
  {
    letter: 'K',
    term: 'Keyboard',
    pronunciation: 'Kee-bord',
    category: 'Hardware',
    definition: 'Papan ketik tombol input yang berisi huruf A-Z, angka, dan tombol fungsi khusus untuk memasukkan teks ke komputer.',
    example: 'Keyboard standar memiliki tata letak tombol QWERTY.',
  },
  {
    letter: 'L',
    term: 'LAN (Local Area Network)',
    pronunciation: 'Len',
    category: 'Jaringan',
    definition: 'Jaringan komputer lokal yang mencakup area geografis terbatas seperti ruangan lab, sekolah, atau rumah.',
    example: 'Kabel LAN warna biru yang menancap di belakang PC lab.',
  },
  {
    letter: 'M',
    term: 'Motherboard',
    pronunciation: 'Ma-dher-bord',
    category: 'Hardware',
    definition: 'Papan sirkuit utama tempat semua komponen penting seperti Processor, RAM, dan kartu grafis dipasang dan berkomunikasi.',
    example: 'Papan induk berbentuk persegi hijau/hitam di dalam CPU.',
  },
  {
    letter: 'N',
    term: 'Netiket (Etika Internet)',
    pronunciation: 'Ne-ti-ket',
    category: 'Keamanan Siber',
    definition: 'Sopan santun dan aturan tata krama saat berkomunikasi serta beraktivitas di dunia maya/internet.',
    example: 'Tidak menyebarkan hoaks dan tidak membully teman di kolom komentar.',
  },
  {
    letter: 'O',
    term: 'OS (Sistem Operasi)',
    pronunciation: 'O-Es (Operating System)',
    category: 'Software',
    definition: 'Perangkat lunak dasar yang mengelola seluruh perangkat keras dan aplikasi di komputer agar bisa digunakan manusia.',
    example: 'Microsoft Windows, Android, macOS, Linux.',
  },
  {
    letter: 'P',
    term: 'Phishing',
    pronunciation: 'Fi-shing',
    category: 'Keamanan Siber',
    definition: 'Upaya penipuan online dengan memancing korban menggunakan link atau pesan palsu untuk mencuri password atau data pribadi.',
    example: 'Pesan palsu bertuliskan "Kamu menang iPhone! Klik di sini".',
  },
  {
    letter: 'Q',
    term: 'QR Code',
    pronunciation: 'Kyu-Ar Kod',
    category: 'Dasar',
    definition: 'Kode batang matriks dua dimensi berbentuk kotak-kotak piksel yang dapat dipindai cepat menggunakan kamera untuk membuka link.',
    example: 'Scan QR Code di sertifikat penghargaan untuk mengecek keasliannya.',
  },
  {
    letter: 'R',
    term: 'RAM (Random Access Memory)',
    pronunciation: 'Rem',
    category: 'Hardware',
    definition: 'Memori penyimpanan sementara yang sangat cepat, digunakan saat aplikasi sedang aktif dibuka.',
    example: 'RAM 8 GB membuat komputer lancar saat multitasking membuka banyak tab.',
  },
  {
    letter: 'S',
    term: 'Shortcut',
    pronunciation: 'Short-kat',
    category: 'Software',
    definition: 'Kombinasi tombol keyboard untuk menjalankan suatu fungsi dengan cepat tanpa harus mencari menu lewat mouse.',
    example: 'Ctrl + C untuk menyalin, Ctrl + V untuk menempel.',
  },
  {
    letter: 'U',
    term: 'USB (Universal Serial Bus)',
    pronunciation: 'Yoo-Es-Bee',
    category: 'Hardware',
    definition: 'Standar colokan atau kabel untuk menghubungkan flashdisk, mouse, keyboard, dan printer ke komputer.',
    example: 'Flashdisk USB untuk membawa tugas sekolah.',
  },
  {
    letter: 'V',
    term: 'Virus Komputer',
    pronunciation: 'Vai-res Kom-pu-ter',
    category: 'Keamanan Siber',
    definition: 'Program jahat kecil yang dapat menggandakan diri, merusak file, atau membuat komputer menjadi sangat lambat.',
    example: 'Dapat dicegah dengan selalu menyalakan Antivirus.',
  },
  {
    letter: 'W',
    term: 'Wi-Fi',
    pronunciation: 'Wai-Fai',
    category: 'Jaringan',
    definition: 'Teknologi jaringan nirkabel (tanpa kabel) yang menggunakan gelombang radio untuk menghubungkan perangkat ke internet.',
    example: 'Koneksi Wi-Fi lab komputer sekolah.',
  },
];

export const TechGlossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  const categories = ['Semua', 'Hardware', 'Software', 'Jaringan', 'Keamanan Siber', 'Dasar'];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letter.toLowerCase() === searchQuery.toLowerCase();
    return matchCat && matchSearch;
  });

  const speakTerm = (term: GlossaryTerm) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${term.term}. Pelafalan: ${term.pronunciation}. Definisi: ${term.definition}`
      );
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setSpeakingTerm(term.term);
      utterance.onend = () => setSpeakingTerm(null);
      utterance.onerror = () => setSpeakingTerm(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center gap-1">
              <BookA className="w-3 h-3" />
              Ensiklopedia Digital
            </span>
            <span className="text-xs text-slate-500">{GLOSSARY_TERMS.length} Istilah Teknologi</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Kamus & Audio A-Z Teknologi Informasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pelajari arti istilah komputer modern lengkap dengan contoh nyata dan dengarkan audio pengucapannya!
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari istilah komputer (misal: RAM, CPU, Browser, Enkripsi)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((item) => {
          const isSpeaking = speakingTerm === item.term;
          return (
            <div
              key={item.term}
              className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between shadow-xs group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {item.letter}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {item.term}
                    </h3>
                  </div>
                  <button
                    onClick={() => speakTerm(item)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSpeaking
                        ? 'bg-sky-600 text-white border-sky-600 animate-pulse'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-sky-600'
                    }`}
                    title="Dengarkan Pelafalan Suara"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    /{item.pronunciation}/
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-3 text-[11px] text-slate-500 flex items-start gap-1.5">
                <strong className="text-slate-600 dark:text-slate-400 shrink-0">Contoh:</strong>
                <span className="text-slate-600 dark:text-slate-300">{item.example}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs">
          Tidak ada istilah yang cocok dengan pencarian "{searchQuery}".
        </div>
      )}
    </div>
  );
};
