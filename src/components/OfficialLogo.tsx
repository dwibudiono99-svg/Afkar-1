import React from 'react';

interface OfficialLogoProps {
  type: 'government' | 'corporate' | 'education' | 'community' | 'custom';
  customUrl?: string;
  color?: string;
  size?: number;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  type,
  customUrl,
  color = '#1e3a8a',
  size = 72,
}) => {
  if (type === 'custom' && customUrl) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={customUrl}
          alt="Logo Instansi"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // Vector logos
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {type === 'government' && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Official Emblem: Hexagonal Shield with Star & Laurel wreath */}
          <polygon
            points="50,4 96,24 96,76 50,96 4,76 4,24"
            stroke={color}
            strokeWidth="5"
            fill="none"
          />
          <polygon
            points="50,12 88,29 88,71 50,88 12,71 12,29"
            fill={color}
            fillOpacity="0.12"
            stroke={color}
            strokeWidth="1.5"
          />
          {/* Inner circle */}
          <circle cx="50" cy="50" r="26" stroke={color} strokeWidth="3" fill="#ffffff" />
          <circle cx="50" cy="50" r="22" fill={color} fillOpacity="0.2" />
          {/* Star in Center */}
          <polygon
            points="50,34 54,44 65,45 57,53 60,64 50,58 40,64 43,53 35,45 46,44"
            fill={color}
          />
          {/* Bottom Ribbon */}
          <path
            d="M30 78 Q50 84 70 78 L68 83 Q50 89 32 83 Z"
            fill={color}
          />
        </svg>
      )}

      {type === 'corporate' && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Modern Corporate Hexagon / Cube */}
          <rect x="8" y="8" width="84" height="84" rx="18" stroke={color} strokeWidth="5" fill="#f8fafc" />
          <path
            d="M50 20 L78 36 V68 L50 84 L22 68 V36 Z"
            stroke={color}
            strokeWidth="4"
            fill={color}
            fillOpacity="0.1"
          />
          <path d="M50 20 V84" stroke={color} strokeWidth="3" />
          <path d="M22 36 L50 52 L78 36" stroke={color} strokeWidth="3" />
          <circle cx="50" cy="52" r="7" fill={color} />
        </svg>
      )}

      {type === 'education' && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Academic University Seal */}
          <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="4" fill="#ffffff" />
          <circle cx="50" cy="50" r="39" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
          {/* Open Book */}
          <path
            d="M30 48 Q40 44 50 48 Q60 44 70 48 V66 Q60 62 50 66 Q40 62 30 66 Z"
            fill={color}
            fillOpacity="0.25"
            stroke={color}
            strokeWidth="3"
          />
          {/* Torch of Knowledge */}
          <path d="M50 26 L50 48" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path
            d="M46 25 Q50 16 54 25 Q56 22 50 14 Q44 22 46 25 Z"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {type === 'community' && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Community / People Together Circle */}
          <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="4.5" fill="#f8fafc" />
          {/* 3 figures joined together */}
          <circle cx="50" cy="35" r="9" fill={color} />
          <path d="M36 58 C36 49 64 49 64 58 V64 H36 Z" fill={color} fillOpacity="0.8" />
          <circle cx="28" cy="42" r="7" fill={color} fillOpacity="0.7" />
          <path d="M18 64 C18 57 38 57 38 64 V68 H18 Z" fill={color} fillOpacity="0.5" />
          <circle cx="72" cy="42" r="7" fill={color} fillOpacity="0.7" />
          <path d="M62 64 C62 57 82 57 82 64 V68 H62 Z" fill={color} fillOpacity="0.5" />
        </svg>
      )}
    </div>
  );
};
