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
  SlidersHorizontal,
} from 'lucide-react';
import { AppState } from '../types';
import { downloadWordDocument } from '../utils/exportWord';

interface NavbarProps {
  state: AppState;
  onImportState: (newState: AppState) => void;
  onResetState: () => void;
  lastSavedTime: Date | null;
  onOpenPrintModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onImportState,
  onResetState,
  lastSavedTime,
  onOpenPrintModal,
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [importNotification, setImportNotification] = useState<string>('');

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
          setImportNotification('✓ Berkas data laporan berhasil dimuat!');
          setTimeout(() => setImportNotification(''), 3000);
        } else {
          setImportNotification('⚠️ Format berkas JSON tidak sesuai struktur aplikasi.');
          setTimeout(() => setImportNotification(''), 4000);
        }
      } catch (err) {
        setImportNotification('⚠️ Gagal membaca berkas JSON.');
        setTimeout(() => setImportNotification(''), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportWord = () => {
    downloadWordDocument(state);
  };

  const handlePrint = () => {
    if (onOpenPrintModal) {
      onOpenPrintModal();
    } else {
      window.print();
    }
  };

  return (
    <>
      <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-md">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base leading-tight text-white">
                  Sistem Laporan Resmi & Presensi Digital
                </h1>
                <span className="text-[10px] font-semibold bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700 hidden sm:inline">
                  Tata Naskah Baku A4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Notulensi Rapat, Matriks Tindak Lanjut & Absensi TTD Digital
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {/* Notification alert */}
            {importNotification && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-1 rounded-lg font-medium">
                {importNotification}
              </span>
            )}

            {/* Auto-save status */}
            <span
              className="text-xs text-slate-400 flex items-center gap-1 mr-1 hidden xl:flex"
              title={lastSavedTime ? `Terakhir tersimpan: ${lastSavedTime.toLocaleTimeString()}` : ''}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tersimpan</span>
            </span>

            {/* Print Help Tip */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="Panduan Cetak PDF"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Panduan</span>
            </button>

            {/* Direct Export Word */}
            <button
              type="button"
              onClick={handleExportWord}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:text-white"
              title="Unduh langsung dokumen Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-blue-200">Word (.doc)</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer hidden md:flex"
              title="Simpan file cadangan .json"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Backup JSON</span>
            </button>

            {/* Import JSON */}
            <label
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer hidden md:flex"
              title="Muat file cadangan .json"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Pulihkan</span>
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
              className="px-2 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium rounded-lg border border-rose-800/70 transition flex items-center gap-1 cursor-pointer"
              title="Reset seluruh data ke setelan bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>

            {/* Dedicated Menu Cetak & Unduh Resmi button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer ring-1 ring-blue-300/40"
              title="Buka Menu Cetak & Unduh Resmi (Pilihan Word & PDF)"
            >
              <Printer className="w-4 h-4" />
              <span>Menu Cetak & Unduh</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded font-normal hidden sm:inline">
                Word / PDF
              </span>
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
