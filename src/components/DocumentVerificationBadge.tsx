import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerificationBadgeProps {
  noSurat: string;
  pimpinan: string;
  kota: string;
  tanggal: string;
  compact?: boolean;
}

export const DocumentVerificationBadge: React.FC<VerificationBadgeProps> = ({
  noSurat,
  pimpinan,
  kota,
  tanggal,
  compact = false,
}) => {
  // Generate deterministic QR-like SVG pattern based on document content
  return (
    <div className={`flex items-center gap-2 border border-slate-300 rounded p-1.5 bg-slate-50/80 ${compact ? 'text-[7.5pt]' : 'text-[8pt]'} font-sans`}>
      <div className="flex-shrink-0 bg-white p-1 border border-slate-200 rounded">
        {/* Crisp vector QR code mockup */}
        <svg width="40" height="40" viewBox="0 0 33 33" fill="none">
          {/* Corner 1 */}
          <rect x="1" y="1" width="7" height="7" stroke="#0f172a" strokeWidth="2" fill="none" />
          <rect x="3" y="3" width="3" height="3" fill="#0f172a" />
          {/* Corner 2 */}
          <rect x="25" y="1" width="7" height="7" stroke="#0f172a" strokeWidth="2" fill="none" />
          <rect x="27" y="3" width="3" height="3" fill="#0f172a" />
          {/* Corner 3 */}
          <rect x="1" y="25" width="7" height="7" stroke="#0f172a" strokeWidth="2" fill="none" />
          <rect x="3" y="27" width="3" height="3" fill="#0f172a" />
          {/* Alignment & Data Pattern */}
          <rect x="11" y="3" width="2" height="2" fill="#0f172a" />
          <rect x="15" y="1" width="2" height="2" fill="#0f172a" />
          <rect x="19" y="3" width="2" height="2" fill="#0f172a" />
          <rect x="11" y="7" width="4" height="2" fill="#0f172a" />
          <rect x="17" y="7" width="2" height="2" fill="#0f172a" />
          <rect x="21" y="7" width="2" height="2" fill="#0f172a" />
          {/* Middle Pattern */}
          <rect x="3" y="11" width="2" height="2" fill="#0f172a" />
          <rect x="7" y="11" width="2" height="2" fill="#0f172a" />
          <rect x="13" y="11" width="7" height="7" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="15" y="13" width="3" height="3" fill="#0f172a" />
          <rect x="23" y="11" width="2" height="4" fill="#0f172a" />
          <rect x="27" y="13" width="4" height="2" fill="#0f172a" />
          {/* Bottom Pattern */}
          <rect x="11" y="23" width="2" height="2" fill="#0f172a" />
          <rect x="15" y="21" width="4" height="2" fill="#0f172a" />
          <rect x="21" y="23" width="2" height="4" fill="#0f172a" />
          <rect x="11" y="27" width="4" height="2" fill="#0f172a" />
          <rect x="17" y="27" width="6" height="2" fill="#0f172a" />
          <rect x="25" y="27" width="2" height="4" fill="#0f172a" />
          <rect x="29" y="25" width="2" height="2" fill="#0f172a" />
        </svg>
      </div>

      <div className="leading-tight text-slate-700">
        <div className="flex items-center gap-1 font-bold text-blue-900">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Verifikasi TNDE & Presensi Digital</span>
        </div>
        <p className="m-0 text-[7pt] text-slate-500 font-mono">No: {noSurat}</p>
        <p className="m-0 text-[7pt] text-slate-600">Disahkan: {pimpinan} ({kota}, {tanggal})</p>
      </div>
    </div>
  );
};
