import React from 'react';

/**
 * Professional temporary school logo emblem for Maharshi Dayanand Saraswati Public School
 */
export default function LogoPlaceholder({ className = "w-12 h-12" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Maharshi Dayanand Saraswati Public School Logo"
    >
      <circle cx="60" cy="60" r="56" fill="#0f2942" stroke="#d99b26" strokeWidth="4" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#d99b26" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Sun rays of wisdom */}
      <path d="M60 22 L60 28" stroke="#d99b26" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 28 L74 33" stroke="#d99b26" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 28 L46 33" stroke="#d99b26" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 44 L80 46" stroke="#d99b26" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 44 L40 46" stroke="#d99b26" strokeWidth="2.5" strokeLinecap="round" />

      {/* Flame / Jyoti of Vedic Knowledge */}
      <path
        d="M60 30 C55 38 52 44 55 52 C57 56 60 58 60 58 C60 58 63 56 65 52 C68 44 65 38 60 30 Z"
        fill="#f59e0b"
      />
      <path
        d="M60 37 C58 42 56 46 58 50 C59 52 60 53 60 53 C60 53 61 52 62 50 C64 46 62 42 60 37 Z"
        fill="#fef08a"
      />

      {/* Open Book of Saraswati */}
      <path
        d="M60 66 C53 62 42 62 34 65 L34 82 C42 79 53 79 60 83 C67 79 78 79 86 82 L86 65 C78 62 67 62 60 66 Z"
        fill="#ffffff"
        stroke="#d99b26"
        strokeWidth="2"
      />
      <line x1="60" y1="66" x2="60" y2="83" stroke="#0f2942" strokeWidth="2" />
      <path d="M40 70 C46 68 52 68 56 70" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 74 C46 72 52 72 56 74" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M64 70 C68 68 74 68 80 70" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M64 74 C68 72 74 72 80 74" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />

      {/* Decorative Ribbon banner with MDSPS */}
      <path
        d="M26 94 Q60 102 94 94 L90 87 Q60 94 30 87 Z"
        fill="#6b1110"
        stroke="#d99b26"
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="93"
        fill="#ffffff"
        fontSize="7.5"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="1.5"
      >
        MDSPS
      </text>
    </svg>
  );
}
