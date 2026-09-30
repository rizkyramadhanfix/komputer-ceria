import { CertificateConfig, GamificationConfig, User } from '../types';
import { getBadgeForPoints, getCertificateConfigForSchool } from '../services/storageService';

// Chunk array helper
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Generates isolated HTML string for 12 Student Cards per A4 Portrait sheet (6cm x 9cm landscape)
 */
export function generateStudentCardsHtml(students: User[]): string {
  const studentPages = chunkArray(students, 12);

  const pagesHtml = studentPages
    .map((pageStudents, pageIdx) => {
      const cardsHtml = pageStudents
        .map((s) => {
          const avatarContent = s.avatarUrl
            ? `<img src="${s.avatarUrl}" alt="${s.name}" class="w-full h-full object-cover rounded-lg" />`
            : `<div class="w-full h-full rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">${(
                s.name || 'S'
              )
                .charAt(0)
                .toUpperCase()}</div>`;

          return `
            <div class="student-card-item">
              <!-- Card Header -->
              <div class="card-header-row flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <div class="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">
                    KC
                  </div>
                  <div class="leading-none">
                    <h4 class="text-[8px] font-black uppercase tracking-wider text-indigo-900 leading-none m-0">
                      KOMPUTER CERIA
                    </h4>
                    <p class="text-[5.5px] text-slate-500 font-bold leading-none m-0 mt-0.5">
                      KARTU AKUN SISWA
                    </p>
                  </div>
                </div>

                <span class="text-[7px] font-mono px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-150 shrink-0 leading-none">
                  ${s.grade || 'Siswa'}
                </span>
              </div>

              <!-- Card Body -->
              <div class="card-body-row flex items-center gap-2">
                <div class="shrink-0 flex flex-col items-center justify-center">
                  <div class="w-9 h-9 rounded-md border border-indigo-500/30 overflow-hidden bg-slate-50 flex items-center justify-center p-0.5">
                    ${avatarContent}
                  </div>
                  <span class="text-[5.5px] font-bold text-slate-400 mt-0.5 uppercase leading-none">
                    Foto
                  </span>
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-center text-left">
                  <div class="mb-0.5 leading-none">
                    <span class="text-[5.5px] text-slate-400 block font-semibold leading-none">
                      Nama Siswa:
                    </span>
                    <p class="text-[9px] font-extrabold text-slate-900 truncate leading-none mt-0.5">
                      ${s.name}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-1 text-[7.5px] leading-none mb-0.5">
                    <div>
                      <span class="text-[5.5px] text-slate-400 block font-semibold leading-none">
                        NISN / Akun:
                      </span>
                      <span class="font-mono font-black text-slate-800 leading-none block mt-0.5">
                        ${s.nisn || s.username}
                      </span>
                    </div>
                    <div>
                      <span class="text-[5.5px] text-slate-400 block font-semibold leading-none">
                        Kelas:
                      </span>
                      <span class="font-bold text-slate-800 leading-none block mt-0.5">
                        ${s.grade || '-'}
                      </span>
                    </div>
                  </div>

                  <div class="leading-none">
                    <span class="text-[5.5px] text-slate-400 block font-semibold leading-none">
                      Asal Sekolah:
                    </span>
                    <p class="text-[7.5px] text-slate-700 truncate font-bold leading-none mt-0.5">
                      ${s.school || 'Sekolah Terdaftar'}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Card Bottom Password -->
              <div class="card-footer-row flex items-center justify-between bg-indigo-50/70 border-t border-dashed border-indigo-200">
                <div class="flex items-center gap-1 text-[6.5px] font-bold text-slate-600 leading-none">
                  <span>🔑 Password:</span>
                </div>
                <span class="font-mono font-black text-[9px] text-indigo-900 bg-white px-1.5 py-0.2 rounded border border-indigo-250 tracking-wide leading-none">
                  ${s.password || 'Siswa@123'}
                </span>
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="a4-page-sheet border border-slate-200 shadow-md rounded-xl p-4 bg-white mb-6">
          <div class="print:hidden flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs font-bold text-indigo-700">
            <span>📄 Lembar Kertas A4 #${pageIdx + 1} dari ${studentPages.length} (Tampilan Cetak Lanskap 6cm x 9cm - 12 Kartu)</span>
            <span class="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">${pageStudents.length} / 12 Kartu</span>
          </div>
          <div class="cards-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 5mm;
        background-color: #f8fafc;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .a4-page-sheet {
        width: 200mm;
        height: 287mm;
        margin: 0 auto 5mm auto;
        padding: 2.5mm 3mm;
        box-sizing: border-box;
        page-break-after: always;
        break-after: page;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #ffffff;
      }
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(2, 90mm);
        grid-template-rows: repeat(6, 43mm);
        gap: 2mm 8mm;
        justify-content: center;
        align-content: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .student-card-item {
        width: 90mm;
        height: 43mm;
        box-sizing: border-box;
        page-break-inside: avoid;
        break-inside: avoid;
        border: 2pt solid #4f46e5;
        border-radius: 6pt;
        padding: 1.5mm 2.5mm;
        background: #ffffff;
        color: #0f172a;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }
      .card-header-row {
        height: 7mm;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 1mm;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .card-body-row {
        height: 25mm;
        margin-bottom: 1mm;
        display: flex;
        align-items: center;
        gap: 2mm;
      }
      .card-footer-row {
        height: 7mm;
        margin: 0 -3mm -1.5mm -3mm;
        padding: 0 3mm;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      @media print {
        body {
          padding: 0 !important;
          background-color: #ffffff !important;
        }
        .a4-page-sheet {
          margin: 0 auto !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          height: 297mm !important;
          page-break-after: always !important;
          break-after: page !important;
        }
      }
    </style>
    <div class="print-cards-container max-w-[210mm] mx-auto">
      ${pagesHtml}
    </div>
  `;
}

/**
 * Generates isolated HTML string for Certificates on A4 Landscape
 */
export function generateCertificatesHtml(
  students: User[],
  certConfig: CertificateConfig,
  gamification: GamificationConfig
): string {
  const rawIssueDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const locationDateString = certConfig.locationAndDate
    ? certConfig.locationAndDate.includes(',')
      ? certConfig.locationAndDate
      : `${certConfig.locationAndDate}, ${rawIssueDate}`
    : rawIssueDate;

  const certificatesHtml = students
    .map((student, idx) => {
      const activeCertConfig = student.school ? getCertificateConfigForSchool(student.school) : certConfig;
      const { currentBadge } = getBadgeForPoints(student.totalPoints, gamification);
      const certNumber = `KC/CERT/${new Date().getFullYear()}/${(student.nisn || student.id)
        .slice(-6)
        .toUpperCase()}`;

      const sig1Img = activeCertConfig.signer1SignatureUrl
        ? `<img src="${activeCertConfig.signer1SignatureUrl}" alt="Tanda Tangan 1" class="max-h-12 max-w-[120px] object-contain mx-auto" />`
        : `<span class="font-serif italic font-bold text-indigo-900 text-sm opacity-80">${activeCertConfig.signer1Name || 'Rzk Digital Studio'}</span>`;

      const sig2Img = activeCertConfig.signer2SignatureUrl
        ? `<img src="${activeCertConfig.signer2SignatureUrl}" alt="Tanda Tangan 2" class="max-h-12 max-w-[120px] object-contain mx-auto" />`
        : `<span class="font-serif italic font-bold text-indigo-900 text-sm opacity-80">${activeCertConfig.signer2Name || student.school || 'Kepala Sekolah'}</span>`;

      const sealImg = activeCertConfig.sealImageUrl
        ? `<img src="${activeCertConfig.sealImageUrl}" alt="Stempel Resmi" class="w-14 h-14 object-contain rounded-md border border-amber-300 p-0.5 bg-white mx-auto" />`
        : `<div class="w-14 h-14 rounded-full border-4 border-double border-amber-500 bg-amber-100 text-amber-800 flex flex-col items-center justify-center mx-auto"><span class="text-[16px]">🛡️</span><span class="text-[6px] font-black uppercase">${activeCertConfig.sealTitle || 'RESMI'}</span></div>`;

      return `
        <div class="certificate-page-item relative overflow-hidden bg-white text-slate-900 rounded-2xl shadow-xl border-8 border-double border-amber-600 p-5 flex flex-col justify-between max-w-[272mm] h-[182mm] mx-auto mb-6 print:mb-0 print:border-8 print:shadow-none box-border">
          <!-- Header -->
          <div class="text-center space-y-1 relative z-10 pt-1">
            <div class="flex items-center justify-center gap-2 text-indigo-800 font-bold uppercase tracking-widest text-xs">
              ✨ <span>${activeCertConfig.headerTitle || 'KOMPUTER CERIA'} · ${activeCertConfig.subHeaderTitle || student.school?.toUpperCase() || 'SEKOLAH BINAAN'}</span> ✨
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight font-serif uppercase py-0.5">
              ${activeCertConfig.certificateTitle || 'SERTIFIKAT PENGHARGAAN'}
            </h1>
            <p class="text-xs text-slate-600 font-medium italic">
              Nomor Registrasi: <span class="font-mono font-bold text-slate-800">${certNumber}</span>
            </p>
            <div class="w-28 h-1 bg-amber-500 mx-auto rounded-full mt-1"></div>
          </div>

          <!-- Body -->
          <div class="text-center my-2 space-y-2 relative z-10">
            <p class="text-xs text-slate-600 font-medium">
              Sertifikat ini secara resmi diberikan dan dianugerahkan kepada:
            </p>
            <div class="py-1 border-b-2 border-dashed border-slate-300 max-w-md mx-auto">
              <h2 class="text-2xl font-extrabold text-indigo-950 tracking-wide font-serif">
                ${student.name}
              </h2>
            </div>
            <p class="text-xs text-slate-700 font-medium">
              NISN: <span class="font-mono font-bold">${student.nisn || student.username}</span> · Kelas: <span class="font-semibold">${student.grade || '-'}</span> · Sekolah: <span class="font-semibold">${student.school || certConfig.subHeaderTitle || 'Sekolah Binaan'}</span>
            </p>
            <div class="max-w-xl mx-auto bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <p class="text-xs text-slate-800 leading-relaxed font-medium">
                Atas prestasi dan dedikasi luar biasa dalam menuntaskan materi pembelajaran, kuis interaktif, serta latihan mengetik Microsoft Word hingga berhasil meraih predikat:
              </p>
              <div class="flex items-center justify-center gap-2 mt-1.5">
                <span class="px-3 py-0.5 bg-amber-500 text-white font-extrabold text-xs rounded-full uppercase">
                  ★ ${currentBadge.label} ★
                </span>
                <span class="font-mono font-bold text-xs text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                  ${student.totalStars} Bintang Emas (${student.totalPoints} Poin)
                </span>
              </div>
            </div>
          </div>

          <!-- Footer Signatures -->
          <div class="grid grid-cols-3 items-end pt-2 border-t border-slate-200 relative z-10 text-center text-xs text-slate-700 mt-1 shrink-0">
            <div class="flex flex-col items-center justify-end">
              <p class="font-semibold text-xs">${certConfig.signer1Label || 'Mengetahui,'}</p>
              <p class="text-[10px] text-slate-500 leading-tight">${certConfig.signer1Title || 'Pembina Ekstrakurikuler Komputer'}</p>
              <div class="h-12 w-full flex items-center justify-center my-0.5">
                ${sig1Img}
              </div>
              <div class="w-28 border-b border-slate-400 mx-auto"></div>
              <p class="font-bold text-xs mt-0.5 text-slate-900">${certConfig.signer1Name || 'Rzk Digital Studio'}</p>
              ${certConfig.signer1Nip ? `<p class="text-[9px] font-mono text-slate-500">${certConfig.signer1Nip}</p>` : ''}
            </div>

            <div class="flex flex-col items-center justify-center">
              ${sealImg}
              <span class="text-[7px] font-bold uppercase tracking-tighter text-amber-800 mt-0.5">
                ${certConfig.sealTitle || 'RESMI · TERVERIFIKASI'}
              </span>
            </div>

            <div class="flex flex-col items-center justify-end">
              <p class="font-semibold text-xs">${locationDateString}</p>
              <p class="text-[10px] text-slate-500 leading-tight">${certConfig.signer2Title || 'Kepala Sekolah / Penanggung Jawab'}</p>
              <div class="h-12 w-full flex items-center justify-center my-0.5">
                ${sig2Img}
              </div>
              <div class="w-28 border-b border-slate-400 mx-auto"></div>
              <p class="font-bold text-xs mt-0.5 text-slate-900">${certConfig.signer2Name || student.school || 'Kepala Sekolah'}</p>
              ${certConfig.signer2Nip ? `<p class="text-[9px] font-mono text-slate-500">${certConfig.signer2Nip}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <style>
      @page {
        size: A4 landscape;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 4mm;
        background-color: #f8fafc;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .certificate-page-item {
        width: 272mm;
        height: 182mm;
        margin: 0 auto 4mm auto;
        padding: 6mm 10mm;
        box-sizing: border-box;
        page-break-after: always;
        break-after: page;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #ffffff;
      }
      @media print {
        body {
          padding: 0 !important;
          background-color: #ffffff !important;
        }
        .certificate-page-item {
          margin: 0 auto !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          width: 297mm !important;
          height: 210mm !important;
          padding: 10mm 15mm !important;
        }
      }
    </style>
    <div class="print-certificates-container max-w-[297mm] mx-auto">
      ${certificatesHtml}
    </div>
  `;
}
