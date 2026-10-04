import React from 'react';
import { ZoomIn, ZoomOut, Eye, Edit3, QrCode, Sparkles, Printer, FileDown } from 'lucide-react';

interface PreviewControlsProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  viewMode: 'all' | 'laporan' | 'action_plan' | 'presensi';
  onViewModeChange: (newMode: 'all' | 'laporan' | 'action_plan' | 'presensi') => void;
  showQrCode: boolean;
  onToggleQrCode: () => void;
  onApplyPreset?: (presetKey: string) => void;
  activeUnitKerja?: string;
  onOpenPrintModal?: () => void;
  onDownloadWord?: () => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  zoom,
  onZoomChange,
  viewMode,
  onViewModeChange,
  showQrCode,
  onToggleQrCode,
  onApplyPreset,
  activeUnitKerja = '',
  onOpenPrintModal,
  onDownloadWord,
}) => {
  const isPemerintahan = activeUnitKerja.toLowerCase().includes('dinas');
  const isKorporat = activeUnitKerja.toLowerCase().includes('divisi') || activeUnitKerja.toLowerCase().includes('persero');
  const isAkademik = activeUnitKerja.toLowerCase().includes('universitas') || activeUnitKerja.toLowerCase().includes('fakultas');
  const isKomunitas = activeUnitKerja.toLowerCase().includes('forum') || activeUnitKerja.toLowerCase().includes('kreatif');
  const isRtRw = activeUnitKerja.toLowerCase().includes('rukun tetangga') || activeUnitKerja.toLowerCase().includes('rt 04');

  return (
    <div className="no-print sticky top-2 z-30 flex flex-col items-center gap-2 mb-4 w-full max-w-5xl mx-auto">
      {/* Baris 1: Template Cepat (1-Klik langsung mengubah seluruh surat) */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full shadow-lg border border-slate-700/90 text-xs flex items-center justify-center gap-1.5 flex-wrap w-full md:w-auto">
        <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5" /> Template:
        </span>
        <button
          type="button"
          onClick={() => onApplyPreset && onApplyPreset('pemerintahan')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
            isPemerintahan
              ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Terapkan format naskah dinas pemerintah"
        >
          <span>🏛️ Dinas Pemda</span>
          {isPemerintahan && <span className="text-[9px]">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset && onApplyPreset('korporat')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
            isKorporat
              ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Terapkan format risalah rapat korporat/BUMN"
        >
          <span>🏢 Korporat / BUMN</span>
          {isKorporat && <span className="text-[9px]">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset && onApplyPreset('akademik')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
            isAkademik
              ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Terapkan format notulen senat universitas"
        >
          <span>🎓 Universitas</span>
          {isAkademik && <span className="text-[9px]">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset && onApplyPreset('komunitas')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
            isKomunitas
              ? 'bg-orange-600 text-white font-bold ring-2 ring-orange-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Terapkan format berita acara komunitas"
        >
          <span>🤝 Komunitas</span>
          {isKomunitas && <span className="text-[9px]">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset && onApplyPreset('rtrw')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
            isRtRw
              ? 'bg-emerald-700 text-white font-bold ring-2 ring-emerald-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Terapkan format musyawarah warga RT / RW"
        >
          <span>🏡 Rapat RT / RW</span>
          {isRtRw && <span className="text-[9px]">✓</span>}
        </button>
      </div>

      {/* Baris 2: Zoom, Mode Tampilan, dan Segel */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-slate-700/80 text-xs w-full max-w-4xl">
        {/* Zoom Control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="50"
            max="140"
            step="5"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-20 md:w-28 accent-blue-500 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(140, zoom + 10))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 font-mono text-[11px] text-slate-300 text-right">{zoom}%</span>
          <button
            type="button"
            onClick={() => onZoomChange(88)}
            className="text-[10px] px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
          >
            Reset
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          <span className="font-medium text-slate-300 hidden sm:inline">Halaman:</span>
          <select
            value={viewMode}
            onChange={(e) => onViewModeChange(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 outline-none text-xs"
          >
            <option value="all">Semua Halaman (1, 2 & 3)</option>
            <option value="laporan">Hal 1: Laporan & Notulensi</option>
            <option value="action_plan">Hal 2: Matriks Action Plan</option>
            <option value="presensi">Hal 3: Lampiran Presensi TTD</option>
          </select>
        </div>

        <div className="h-4 w-px bg-slate-700 hidden md:block"></div>

        {/* QR Code toggle, Word & Print buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleQrCode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] transition ${
              showQrCode
                ? 'bg-blue-900/60 border-blue-600 text-blue-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Tampilkan / Sembunyikan QR Code Verifikasi"
          >
            <QrCode className="w-3 h-3" />
            <span className="hidden lg:inline">Segel QR</span>
          </button>

          {onDownloadWord && (
            <button
              type="button"
              onClick={onDownloadWord}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-blue-300 hover:text-white transition cursor-pointer"
              title="Unduh versi Word (.doc)"
            >
              <FileDown className="w-3 h-3" />
              <span className="hidden sm:inline">Word</span>
            </button>
          )}

          {onOpenPrintModal && (
            <button
              type="button"
              onClick={onOpenPrintModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition cursor-pointer shadow-xs"
              title="Buka Menu Cetak & Unduh Resmi"
            >
              <Printer className="w-3 h-3" />
              <span>Cetak / PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

