import React from 'react';

interface OpenCompactLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function OpenCompactLogo({
  size = 'md',
  showSubtitle = true,
}: OpenCompactLogoProps) {
  const dimensions =
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const titleSize =
    size === 'lg'
      ? 'text-2xl tracking-[0.22em]'
      : size === 'sm'
      ? 'text-base tracking-[0.18em]'
      : 'text-xl tracking-[0.20em]';

  return (
    <div className="inline-flex items-center gap-3 select-none group">
      {/* Bespoke Feminine Rose-Gold & Porcelain Hinged Compact Mirror Emblem */}
      <div
        className={`relative ${dimensions} shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(184,93,111,0.22)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="roseGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D5C8" />
              <stop offset="40%" stopColor="#D6958E" />
              <stop offset="75%" stopColor="#B86B63" />
              <stop offset="100%" stopColor="#E6B9A6" />
            </linearGradient>
            <radialGradient id="porcelainShell" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFDFB" />
              <stop offset="65%" stopColor="#FBECEB" />
              <stop offset="100%" stopColor="#F2D7D5" />
            </radialGradient>
            <linearGradient id="mirrorGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F5E8E6" />
              <stop offset="100%" stopColor="#EAD2CE" />
            </linearGradient>
          </defs>

          {/* Outer Rose-Gold Guilloché Bezel */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="url(#porcelainShell)"
            stroke="url(#roseGoldRim)"
            strokeWidth="2.2"
          />

          {/* Delicate Pearl / Cannage Inner Ring */}
          <circle
            cx="32"
            cy="32"
            r="25.5"
            stroke="#D6958E"
            strokeWidth="0.8"
            strokeDasharray="2.5 2.5"
            opacity="0.7"
          />

          {/* Top Open Compact Mirror Lid */}
          <ellipse
            cx="32"
            cy="22"
            rx="14.5"
            ry="10"
            fill="url(#mirrorGlass)"
            stroke="url(#roseGoldRim)"
            strokeWidth="1.6"
          />

          {/* Mirror Specular Glint */}
          <path
            d="M24 19L29 15M27 23L35 16"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Rose-Gold Compact Clasp Hinge */}
          <rect
            x="23"
            y="31"
            width="18"
            height="2.8"
            rx="1.4"
            fill="url(#roseGoldRim)"
          />

          {/* Lower Pressed Blush & Eyeshadow Base */}
          <ellipse
            cx="32"
            cy="42"
            rx="16"
            ry="9"
            fill="#FFF9F7"
            stroke="url(#roseGoldRim)"
            strokeWidth="1.6"
          />

          {/* Feminine Pressed Pigment Trio (Peony Blush, Rose Quartz, Champagne Gold) */}
          <circle
            cx="24.5"
            cy="42"
            r="3.2"
            fill="#E3738B"
            stroke="url(#roseGoldRim)"
            strokeWidth="0.7"
          />
          <circle
            cx="32"
            cy="42"
            r="3.5"
            fill="#F4B2C1"
            stroke="url(#roseGoldRim)"
            strokeWidth="0.7"
          />
          <circle
            cx="39.5"
            cy="42"
            r="3.2"
            fill="#E5C08D"
            stroke="url(#roseGoldRim)"
            strokeWidth="0.7"
          />

          {/* Delicate 4-Point Star Sparkle */}
          <path
            d="M44 13L45 15.8L47.8 16.8L45 17.8L44 20.6L43 17.8L40.2 16.8L43 15.8L44 13Z"
            fill="#C97384"
          />
        </svg>
      </div>

      {/* Feminine Haute Couture Wordmark */}
      <div className="flex flex-col text-left">
        <span
          className={`font-semibold text-[#281E1C] leading-none ${titleSize}`}
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          OpenCompact
        </span>
        {showSubtitle && (
          <span className="text-[9px] tracking-[0.24em] uppercase text-[#9E6B74] font-medium mt-1">
            PARIS · NEW YORK · BEAUTY NOTEBOOK
          </span>
        )}
      </div>
    </div>
  );
}
