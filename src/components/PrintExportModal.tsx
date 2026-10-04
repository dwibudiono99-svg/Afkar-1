import React, { useState } from 'react';
import {
  X,
  Printer,
  FileDown,
  CheckCircle2,
  FileText,
  ShieldCheck,
  QrCode,
  Layers,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Download,
} from 'lucide-react';
import { AppState } from '../types';
import { downloadWordDocument } from '../utils/exportWord';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  viewMode: 'all' | 'laporan' | 'action_plan' | 'presensi';
  onViewModeChange: (newMode: 'all' | 'laporan' | 'action_plan' | 'presensi') => void;
  onToggleQrCode: () => void;
  onUpdateConfig: (key: keyof AppState['config'], value: any) => void;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  state,
  viewMode,
  onViewModeChange,
  onToggleQrCode,
  onUpdateConfig,
}) => {
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string>('');
  const { config, actionPlan, attendees } = state;

  if (!isOpen) return null;

  const handleTriggerPrint = (selectedRange?: 'all' | 'laporan' | 'action_plan' | 'presensi') => {
    if (selectedRange && selectedRange !== viewMode) {
      onViewModeChange(selectedRange);
    }
    onClose();
    // Allow React state transition to complete before triggering system print dialog
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleDownloadWord = () => {
    try {
      downloadWordDocument(state);
      setDownloadSuccessToast('Dokumen Word (.doc) berhasil diunduh!');
      setTimeout(() => setDownloadSuccessToast(''), 4000);
    } catch (e) {
      console.error('Download word error:', e);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const cleanDate = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `Naskah_Laporan_${config.kota}_${cleanDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccessToast('Berkas JSON backup berhasil diunduh!');
    setTimeout(() => setDownloadSuccessToast(''), 4000);
  };

  const hadirCount = attendees.filter((a) => a.status === 'Hadir').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight flex items-center gap-2">
                Menu Cetak & Unduh Dokumen Resmi
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                  Standar A4 Baku
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Tata Naskah Dinas, Notulensi, Matriks Action Plan & Presensi TTD Digital
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {downloadSuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
          {/* Hero 2 Pilihan Utama Unduh Langsung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Opsi 1: Unduh Word (.doc) */}
            <div className="p-4 rounded-xl border-2 border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50/90 transition flex flex-col justify-between space-y-3 group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-blue-600 text-white rounded-lg shadow-xs">
                    <FileDown className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Format Edit (.doc)
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition">
                  Unduh Microsoft Word
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Berkas resmi 3 halaman lengkap dengan Kop Surat, Notulensi, Matriks Rencana Kerja, dan Lampiran Daftar Hadir Ber-TTD.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Versi Word Langsung</span>
              </button>
            </div>

            {/* Opsi 2: Cetak / Simpan PDF Langsung */}
            <div className="p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50/90 transition flex flex-col justify-between space-y-3 group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                    <Printer className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Format Baku (PDF)
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  Cetak / Simpan PDF
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Buka dialog cetak resmi A4 (210 x 297 mm) untuk disimpan sebagai berkas PDF tajam tanpa header browser atau dicetak fisik.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerPrint()}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF Sekarang</span>
              </button>
            </div>
          </div>

          {/* Pengaturan Jangkauan Halaman Cetak */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Pilih Halaman yang Ingin Dicetak / Disimpan:</span>
              </span>
              <span className="text-[11px] text-slate-500">Standar A4 Portrait</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition ${
                  viewMode === 'all'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="printPageRange"
                  checked={viewMode === 'all'}
                  onChange={() => onViewModeChange('all')}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-bold">Lengkap Semua Halaman (1, 2 & 3)</div>
                  <div className="text-[10px] text-slate-500">Laporan, Matriks Action Plan & Presensi TTD</div>
                </div>
              </label>

              <label
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition ${
                  viewMode === 'laporan'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="printPageRange"
                  checked={viewMode === 'laporan'}
                  onChange={() => onViewModeChange('laporan')}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-bold">Hanya Halaman 1</div>
                  <div className="text-[10px] text-slate-500">Kop Surat, Notulensi & Kesimpulan</div>
                </div>
              </label>

              <label
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition ${
                  viewMode === 'action_plan'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="printPageRange"
                  checked={viewMode === 'action_plan'}
                  onChange={() => onViewModeChange('action_plan')}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-bold">Hanya Halaman 2 (Lampiran I)</div>
                  <div className="text-[10px] text-slate-500">Matriks Rencana Tindak Lanjut & SOP</div>
                </div>
              </label>

              <label
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition ${
                  viewMode === 'presensi'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="printPageRange"
                  checked={viewMode === 'presensi'}
                  onChange={() => onViewModeChange('presensi')}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-bold">Hanya Halaman 3 (Lampiran II)</div>
                  <div className="text-[10px] text-slate-500">Daftar Hadir Peserta Ber-TTD Digital</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pengaturan Kepatuhan & Opsi Kearsipan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {/* Opsi Segel / QR Code */}
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-bold text-slate-800">Segel QR Verifikasi</div>
                  <div className="text-[10px] text-slate-500">Validasi keaslian naskah digital</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleQrCode}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  config.showQrCode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {config.showQrCode ? 'Aktif' : 'Mati'}
              </button>
            </div>

            {/* Pilihan Font Resmi */}
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-800">Gaya Tipografi</div>
                  <div className="text-[10px] text-slate-500">Serif (Resmi) / Sans (Modern)</div>
                </div>
              </div>
              <select
                value={config.fontFamily}
                onChange={(e) => onUpdateConfig('fontFamily', e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none"
              >
                <option value="serif">Serif (Times)</option>
                <option value="sans">Sans (Arial)</option>
              </select>
            </div>
          </div>

          {/* Status Kelengkapan Naskah */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-[11px] text-amber-900">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Verifikasi Standar Tata Naskah:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-medium">
              <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                <span className="block font-bold text-slate-800">{config.noSurat || '-'}</span>
                <span className="text-[10px] text-slate-500">Nomor Naskah</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                <span className="block font-bold text-slate-800">{actionPlan.length} Tugas</span>
                <span className="text-[10px] text-slate-500">Matriks Tindak Lanjut</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                <span className="block font-bold text-slate-800">{hadirCount} Hadir</span>
                <span className="text-[10px] text-slate-500">Presensi Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Panduan Cetak Browser */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Petunjuk Cetak PDF Tanpa Header/Footer Browser Liar:
            </span>
            <p className="leading-snug">
              Pada jendela print peramban, pilih <strong>Destination: Save as PDF</strong>, Ukuran Kertas <strong>A4</strong>, dan hilangkan centang opsi <em>Headers and footers</em> agar tanggal & alamat URL web tidak muncul di tepi kertas dokumen.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 underline"
            title="Simpan cadangan data mentah JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangan Data (JSON)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => handleTriggerPrint()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
