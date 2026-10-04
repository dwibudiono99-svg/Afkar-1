import React from 'react';
import { ZoomIn, ZoomOut, Eye, Edit3, QrCode } from 'lucide-react';

interface PreviewControlsProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  viewMode: 'all' | 'laporan' | 'action_plan' | 'presensi';
  onViewModeChange: (newMode: 'all' | 'laporan' | 'action_plan' | 'presensi') => void;
  showQrCode: boolean;
  onToggleQrCode: () => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  zoom,
  onZoomChange,
  viewMode,
  onViewModeChange,
  showQrCode,
  onToggleQrCode,
}) => {
  return (
    <div className="no-print sticky top-3 z-30 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl flex items-center justify-between gap-4 mb-6 border border-slate-700/80 text-xs max-w-4xl mx-auto w-full">
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
          onClick={() => onZoomChange(90)}
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

      {/* QR Code toggle & WYSIWYG note */}
      <div className="flex items-center gap-3">
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

        <span className="text-slate-400 text-[11px] hidden xl:flex items-center gap-1">
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Klik teks di kertas untuk edit langsung</span>
        </span>
      </div>
    </div>
  );
};
