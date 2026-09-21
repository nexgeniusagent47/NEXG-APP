import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Single-color authentic luxury Globe / Multilingual icon
 */
export const GlobeLanguageIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

/**
 * Single-color authentic English / Global Crest emblem
 */
export const EnglishIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Clean, authentic single-color royal compass & 'EN' monogram emblem */}
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 4.5l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5-3.5-2.5h4.5z"
      fill="currentColor"
      opacity="0.25"
    />
    {/* EN Letterform geometry */}
    <text
      x="12"
      y="15"
      textAnchor="middle"
      fontSize="8.5"
      fontWeight="900"
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="0.5"
      fill="currentColor"
    >
      EN
    </text>
  </svg>
);

/**
 * Single-color authentic Chinese Calligraphy Seal '中' / '文' Emblem
 */
export const ChineseIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Traditional oriental rounded square seal border */}
    <rect
      x="2.5"
      y="2.5"
      width="19"
      height="19"
      rx="4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeDasharray="2 1"
      opacity="0.4"
    />
    {/* Authentic Chinese Character '中' geometry */}
    <path
      d="M6.5 8.5h11v7h-11z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 4.5v15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Single-color authentic East African / Kiswahili Acacia & Kilimanjaro Emblem
 */
export const SwahiliIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Circle badge */}
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Kilimanjaro mountain silhouette background */}
    <path
      d="M5 16.5l4-5.5 3 2.5 4.5-6 4.5 9H5z"
      fill="currentColor"
      opacity="0.25"
    />
    {/* East African Umbrella Acacia Tree Silhouette in single color */}
    <path
      d="M12 18v-5.5m0 0c-1-1-2.5-1.5-4-1.2 0-.8.8-1.8 2.2-1.8 1 0 1.8.5 1.8.5s.8-.5 1.8-.5c1.4 0 2.2 1 2.2 1.8-1.5-.3-3 .2-4 1.2z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
    />
    {/* African sun disk */}
    <circle cx="7" cy="7.5" r="1.8" fill="currentColor" />
    {/* Base savannah grass line */}
    <path d="M4 18h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * Single-color authentic Arabic Calligraphy 'ض' & 'ع' (Lughat ad-Dad) Crescent Emblem
 */
export const ArabicIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Circle frame */}
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Authentic Arabic Calligraphy character 'ع' / 'ض' geometry */}
    <path
      d="M14.2 8.2c-.6-.8-1.6-1.2-2.7-1.2-2.1 0-3.5 1.6-3.5 3.7 0 1.8 1.1 3.2 2.8 3.5-1.2 1.3-1.8 2.8-1.8 4.3 0 1.2.4 2 1.2 2 1.5 0 3.8-2.8 4.8-6.5h1.5c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-1.2c.1-.4.2-.8.2-1.2 0-1.5-.5-2.6-1.3-3.2zm-2.5 4.8c-1.3 0-2.2-.9-2.2-2.3 0-1.3.9-2.3 2.2-2.3 1.1 0 1.9.7 2.1 1.8-.7 1.4-1.4 2.8-2.1 2.8z"
      fill="currentColor"
    />
    {/* Diacritic dot / Nuqta */}
    <circle cx="15.5" cy="6.2" r="1" fill="currentColor" />
  </svg>
);
