import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileDown,
  HelpCircle,
  X,
  Share2,
} from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  state: AppState;
  onImportState: (newState: AppState) => void;
  onResetState: () => void;
  lastSavedTime: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onImportState,
  onResetState,
  lastSavedTime,
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const cleanDate = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `Naskah_Laporan_${state.config.kota}_${cleanDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.config && parsed.notulensi) {
          onImportState(parsed);
          alert('Data laporan dan presensi berhasil dimuat!');
        } else {
          alert('Format berkas JSON tidak sesuai struktur aplikasi.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportWord = () => {
    // Generate Microsoft Word compatible HTML document
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${state.config.judulRapat}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #000; }
          h1, h2, h3, h4 { margin: 0; padding: 0; }
          .kop-table { width: 100%; border-bottom: 3px double #000; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #000; padding: 6px 8px; font-size: 10pt; }
          th { background-color: #f2f2f2; text-align: left; }
          .no-border td { border: none; padding: 3px 5px; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px;">
          <h3 style="font-size: 12pt; text-transform: uppercase;">${state.config.instansiAtasan}</h3>
          <h1 style="font-size: 16pt; text-transform: uppercase; color: #1e3a8a;">${state.config.unitKerja}</h1>
          <p style="font-size: 9pt; margin: 4px 0;">${state.config.alamat}</p>
          <p style="font-size: 8.5pt; margin: 0;">${state.config.kontak} | ${state.config.website}</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 13pt; text-transform: uppercase; text-decoration: underline;">LAPORAN PELAKSANAAN & NOTULENSI RAPAT</h2>
          <p style="font-size: 10pt; margin: 4px 0;">Nomor: ${state.config.noSurat}</p>
        </div>

        <table class="no-border" style="width: 100%; margin-bottom: 15px;">
          <tr><td style="width: 20%; font-weight: bold;">Agenda Rapat</td><td style="width: 2%;">:</td><td>${state.config.judulRapat}</td></tr>
          <tr><td style="font-weight: bold;">Hari / Tanggal</td><td>:</td><td>${state.config.hariTanggal}</td></tr>
          <tr><td style="font-weight: bold;">Waktu</td><td>:</td><td>${state.config.waktu}</td></tr>
          <tr><td style="font-weight: bold;">Tempat</td><td>:</td><td>${state.config.tempat}</td></tr>
          <tr><td style="font-weight: bold;">Kehadiran</td><td>:</td><td>${state.attendees.length} Orang Terdaftar</td></tr>
        </table>

        <h4 style="border-bottom: 1px solid #1e3a8a; color: #1e3a8a; text-transform: uppercase; margin-top: 15px;">I. Pendahuluan & Latar Belakang</h4>
        <p style="text-align: justify; text-indent: 30px;">${state.config.pendahuluan}</p>

        <h4 style="border-bottom: 1px solid #1e3a8a; color: #1e3a8a; text-transform: uppercase; margin-top: 15px;">II. Notulensi Jalannya Rapat</h4>
        <ol>
          ${state.notulensi.map((n) => `<li><strong>${n.pembicara} (${n.topik}):</strong> ${n.poin}</li>`).join('')}
        </ol>

        <h4 style="border-bottom: 1px solid #1e3a8a; color: #1e3a8a; text-transform: uppercase; margin-top: 15px;">III. Kesimpulan Utama</h4>
        <ul>
          ${state.kesimpulan.map((k) => `<li><strong>${k.kategori || 'Kesimpulan'}:</strong> ${k.text}</li>`).join('')}
        </ul>

        <h4 style="border-bottom: 1px solid #1e3a8a; color: #1e3a8a; text-transform: uppercase; margin-top: 25px;">IV. Matriks Rencana Tindak Lanjut</h4>
        <table>
          <tr>
            <th style="width: 5%; text-align: center;">No</th>
            <th>Uraian Tugas / Rencana Kerja</th>
            <th style="width: 25%;">Penanggung Jawab (PIC)</th>
            <th style="width: 15%; text-align: center;">Batas Waktu</th>
            <th style="width: 12%; text-align: center;">Status</th>
          </tr>
          ${state.actionPlan
            .map(
              (a, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td>${a.task}</td>
              <td>${a.pic}</td>
              <td style="text-align: center;">${a.deadline}</td>
              <td style="text-align: center;">${a.status}</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 10px; margin: 15px 0;">
          <h4 style="margin: 0 0 5px 0; color: #78350f; font-size: 10pt; text-transform: uppercase;">
            ${state.config.judulKetentuanTindakLanjut || 'Ketentuan Pelaporan & Monitoring Tindak Lanjut:'}
          </h4>
          <ol style="margin: 0; padding-left: 20px; font-size: 9.5pt; color: #451a03;">
            ${(
              state.config.ketentuanTindakLanjut || [
                'Setiap PIC wajib mengunggah bukti dukung (evidence) pelaksanaan tugas pada dashboard sistem evaluasi.',
                'Monitoring progres dilakukan secara berkala tiap hari Jumat pada akhir pekan berjalan.',
                'Kendala teknis atau pergeseran target harus dilaporkan segera kepada pimpinan rapat untuk alternatif penyesuaian.',
              ]
            )
              .map((rule) => `<li>${rule}</li>`)
              .join('')}
          </ol>
        </div>

        <br><br>
        <table class="no-border" style="width: 100%; text-align: center;">
          <tr>
            <td style="width: 50%;">
              <p>Notulis Rapat,</p>
              <br><br><br>
              <p><strong><u>${state.config.namaNotulis}</u></strong></p>
              <p style="font-size: 9pt;">${state.config.nipNotulis}</p>
            </td>
            <td style="width: 50%;">
              <p>${state.config.kota}, ${state.config.tanggalCetak || state.config.hariTanggal}</p>
              <p>Pimpinan Rapat,</p>
              <br><br><br>
              <p><strong><u>${state.config.namaPimpinan}</u></strong></p>
              <p style="font-size: 9pt;">${state.config.nipPimpinan}</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Rapat_${state.config.kota}_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5 shadow-md">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base leading-tight text-white">
                  Sistem Laporan Resmi & Presensi Digital
                </h1>
                <span className="text-[10px] font-semibold bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700">
                  WYSIWYG Pro A4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tata Naskah Dinas, Notulensi Rapat & Absensi TTD Digital Siap Cetak
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-save status */}
            <span
              className="text-xs text-slate-400 flex items-center gap-1 mr-1 hidden sm:flex"
              title={lastSavedTime ? `Terakhir tersimpan: ${lastSavedTime.toLocaleTimeString()}` : ''}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tersimpan</span>
            </span>

            {/* Print Help Tip */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1"
              title="Panduan Cetak PDF"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Panduan Cetak</span>
            </button>

            {/* Export Word */}
            <button
              type="button"
              onClick={handleExportWord}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1"
              title="Unduh sebagai dokumen Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Word (.doc)</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1"
              title="Simpan file cadangan .json"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor JSON</span>
            </button>

            {/* Import JSON */}
            <label
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="Muat file cadangan .json"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Impor</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            {/* Reset */}
            <button
              type="button"
              onClick={onResetState}
              className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium rounded-lg border border-rose-800/70 transition flex items-center gap-1"
              title="Reset seluruh data ke setelan bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Cetak PDF button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 ml-1"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm">Tips Mencetak PDF Standar A4</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                Agar hasil cetak dokumen dan tanda tangan presensi pas 100% pada kertas A4 tanpa terpotong, perhatikan setelan dialog cetak browser Anda:
              </p>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-1.5 text-blue-950">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>1. Tujuan (Destination):</span>
                  <span className="font-normal">Simpan sebagai PDF (Save as PDF)</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>2. Ukuran Kertas (Paper Size):</span>
                  <span className="font-normal">A4</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>3. Margin:</span>
                  <span className="font-normal">None (Nihil) atau Default</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>4. Opsi (Options):</span>
                  <span className="font-normal text-rose-700 font-bold">Centang "Background graphics"</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Centang "Grafik latar belakang" wajib diaktifkan agar warna kop surat dan bayangan tanda tangan digital tercetak sempurna.
              </p>
            </div>

            <div className="text-right pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
