import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Curriculum question library as reliable fallback when Gemini API quota is exhausted
function generateFallbackQuiz(topic: string, difficulty: string, count: number, category: string) {
  const bank = [
    {
      q: 'Perangkat keras komputer yang berfungsi sebagai otak utama untuk memproses semua instruksi dan data adalah...',
      options: ['CPU (Processor)', 'Monitor', 'Keyboard', 'Speaker'],
      ans: 0,
      exp: 'CPU (Central Processing Unit) adalah otak pemroses utama pada seluruh sistem komputer.',
      cat: 'Perangkat Keras',
    },
    {
      q: 'Kombinasi tombol keyboard (shortcut) yang digunakan untuk menyimpan dokumen di Microsoft Word adalah...',
      options: ['Ctrl + C', 'Ctrl + S', 'Ctrl + V', 'Ctrl + P'],
      ans: 1,
      exp: 'Ctrl + S (Save) digunakan untuk menyimpan file dokumen yang sedang dikerjakan agar tidak hilang.',
      cat: 'Aplikasi Kantor',
    },
    {
      q: 'Memori komputer yang bersifat sementara dan akan hilang datanya saat komputer dimatikan adalah...',
      options: ['Harddisk', 'Flashdisk', 'RAM (Random Access Memory)', 'CD-ROM'],
      ans: 2,
      exp: 'RAM adalah memori sementara (volatile) yang bekerja saat program sedang dibuka.',
      cat: 'Perangkat Keras',
    },
    {
      q: 'Sikap yang bijak saat menerima pesan dari nomor asing yang menyatakan kita memenangkan hadiah smartphone adalah...',
      options: ['Langsung mengklik link yang dikirim', 'Mengirimkan password akun kita', 'Mengabaikan dan melaporkan pesan mencurigakan ke guru/orang tua', 'Membagikan pesan ke semua grup WhatsApp'],
      ans: 2,
      exp: 'Jangan pernah mengklik link mencurigakan atau membagikan data pribadi karena itu adalah modus penipuan phishing.',
      cat: 'Internet & Etika',
    },
    {
      q: 'Perangkat yang digunakan untuk menghubungkan komputer di lab sekolah ke jaringan internet nirkabel (tanpa kabel) adalah...',
      options: ['Wi-Fi Router', 'Printer', 'Scanner', 'Kabel Daya'],
      ans: 0,
      exp: 'Router Wi-Fi memancarkan gelombang sinyal nirkabel sehingga laptop dan komputer dapat mengakses internet bersama.',
      cat: 'Jaringan Komputer',
    },
    {
      q: 'Pada Microsoft Word, ikon berbentuk huruf B tebal (Bold) berfungsi untuk...',
      options: ['Membuat teks miring', 'Menebalkan teks yang dipilih', 'Memberi garis bawah pada teks', 'Menghapus teks'],
      ans: 1,
      exp: 'Format Bold (Ctrl + B) digunakan untuk memberi ketebalan pada judul atau kata penting agar lebih menonjol.',
      cat: 'Aplikasi Kantor',
    },
    {
      q: 'Urutan langkah-langkah logis dan sistematis yang disusun untuk menyelesaikan suatu masalah pada komputer disebut...',
      options: ['Algoritma', 'Hardware', 'Piksel', 'Resolusi'],
      ans: 0,
      exp: 'Algoritma adalah dasar pemrograman logika yang memandu komputer menyelesaikan instruksi langkah demi langkah.',
      cat: 'Dasar Komputer',
    },
    {
      q: 'Ekstensi file standar untuk dokumen teks yang dibuat menggunakan Microsoft Word modern adalah...',
      options: ['.mp3', '.docx', '.jpg', '.xlsx'],
      ans: 1,
      exp: '.docx adalah format file dokumen standar Microsoft Word.',
      cat: 'Aplikasi Kantor',
    },
    {
      q: 'Perangkat output yang berfungsi menampilkan hasil kerja dan tampilan grafis komputer ke mata pengguna adalah...',
      options: ['Mouse', 'Layar Monitor', 'Microphone', 'Keyboard'],
      ans: 1,
      exp: 'Monitor adalah perangkat keluaran (output) utama yang menampilkan visual gambar dan antarmuka komputer.',
      cat: 'Perangkat Keras',
    },
    {
      q: 'Tempat sampah digital pada sistem operasi Windows yang menampung file-file yang baru saja dihapus adalah...',
      options: ['Recycle Bin', 'Control Panel', 'Task Manager', 'File Explorer'],
      ans: 0,
      exp: 'Recycle Bin menyimpan file yang dihapus sementara sehingga masih bisa dipulihkan (Restore) jika tidak sengaja terhapus.',
      cat: 'Dasar Komputer',
    },
  ];

  // Shuffle and pick requested count
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, bank.length));

  return {
    title: `Kuis Komputer: ${topic || 'Pengenalan Teknologi Informasi'}`,
    category: category || 'Dasar Komputer',
    description: `Uji pemahaman materi seputar ${topic || 'komputer dan teknologi'} dengan tingkat kesulitan ${difficulty}. Kuis ini dirancang untuk melatih ketangkasan siswa!`,
    difficulty: difficulty || 'Pemula',
    allocatedPoints: selected.length * 20,
    questions: selected.map((item, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      questionText: item.q,
      options: item.options,
      correctAnswerIndex: item.ans,
      explanation: item.exp,
    })),
  };
}

// API Route: AI Generate Quiz for Admin
app.post('/api/generate-quiz', async (req, res) => {
  const { topic, difficulty = 'Pemula', questionCount = 5, category = 'Dasar Komputer' } = req.body;

  // If no Gemini API key configured, use curriculum fallback directly
  if (!process.env.GEMINI_API_KEY) {
    const fallback = generateFallbackQuiz(topic, difficulty, Number(questionCount), category);
    return res.json({ success: true, data: fallback, source: 'curriculum-bank' });
  }

  const prompt = `Anda adalah guru ahli ekstrakurikuler komputer untuk sekolah dasar dan menengah (SD/SMP).
Buatkan ${questionCount} butir soal kuis pilihan ganda (4 pilihan jawaban: A, B, C, D) yang edukatif, ramah anak, dan seru tentang topik: "${topic || 'Pengenalan Komputer & Teknologi'}".
Tingkat kesulitan: "${difficulty}".
Kategori: "${category}".

PANDUAN PEMBUATAN:
1. Soal harus relevan dengan materi komputer sekolah (perangkat keras, Windows, Microsoft Word, internet sehat, komponen PC, logika koding).
2. Pilihan jawaban (options) harus terdiri dari tepat 4 opsi berupa array string.
3. correctAnswerIndex adalah indeks jawaban yang benar (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D).
4. Sediakan penjelasan (explanation) singkat yang mendidik dan memuji pemahaman siswa.

Kembalikan HANYA format JSON valid tanpa tanda kutip markdown, tanpa backtick, dan tanpa teks pengantar:
{
  "title": "Judul Kuis Komputer Ceria",
  "category": "${category}",
  "description": "Deskripsi singkat kuis yang memotivasi siswa untuk belajar",
  "difficulty": "${difficulty}",
  "allocatedPoints": ${Number(questionCount) * 20},
  "questions": [
    {
      "id": "q1",
      "questionText": "Teks pertanyaan...",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswerIndex": 0,
      "explanation": "Penjelasan mengapa jawaban ini benar..."
    }
  ]
}`;

  // Try available models in order of efficiency: gemini-3.1-flash-lite -> gemini-flash-latest
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
  const ai = new GoogleGenAI();

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        data = JSON.parse(cleaned);
      }

      if (data && data.questions && Array.isArray(data.questions)) {
        return res.json({ success: true, data, source: modelName });
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} returned error (e.g. quota limit):`, err.message);
      // Continue to next model or fallback
    }
  }

  // Graceful fallback to curriculum bank if all AI models are rate limited or unavailable
  console.log('Activating curriculum fallback quiz generator...');
  const fallbackData = generateFallbackQuiz(topic, difficulty, Number(questionCount), category);
  return res.json({
    success: true,
    data: fallbackData,
    source: 'curriculum-fallback',
    notice: 'Soal dibuat menggunakan Bank Kurikulum Komputer Ceria (Gemini API sedang dalam batas kuota harian).',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}

startServer();
