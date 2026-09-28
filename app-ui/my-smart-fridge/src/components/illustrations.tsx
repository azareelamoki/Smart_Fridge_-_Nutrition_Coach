import type { SVGProps } from 'react'

type ArtProps = SVGProps<SVGSVGElement>

/* ---------- Pictogrammes des cartes « suggestions du jour » ---------- */

export const BowlArt = (p: ArtProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
    <path d="M24 10c-2 2.5 2 4.5 0 7M31 8c-2 2.5 2 4.5 0 7M38 10c-2 2.5 2 4.5 0 7" stroke="#e8751a" strokeWidth="2.6" />
    <path d="m40 30 12-12" stroke="#2ea85c" strokeWidth="3.2" />
    <path d="M8 30h48c0 11-9.5 18-24 18S8 41 8 30Z" stroke="#1a1a1a" strokeWidth="3" />
    <path d="M22 54h20" stroke="#1a1a1a" strokeWidth="3" />
  </svg>
)

export const ChefHatArt = (p: ArtProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
    <path
      d="M18 36c-6 0-10-4-10-9.5S12.5 17 18 17.5C19.5 11 25 7 32 7s12.5 4 14 10.5c5.5-.5 10 3.5 10 9S52 36 46 36v18H18V36Z"
      stroke="#1a1a1a"
      strokeWidth="3"
    />
    <path d="M18 46h28" stroke="#1a1a1a" strokeWidth="3" />
    <path d="M26 36v6M32 34v8M38 36v6" stroke="#e8751a" strokeWidth="3" />
  </svg>
)

export const CutleryArt = (p: ArtProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
    <path d="M17 11c-6 6-6 14 0 16s12-6 6-14c-2-2-4-3-6-2Z" stroke="#1a1a1a" strokeWidth="3" />
    <path d="m24 26 26 26" stroke="#e8751a" strokeWidth="5" />
    <path d="M44 8v10a6 6 0 0 1-6 6M50 8v10a6 6 0 0 1-6 6M47 8v12" stroke="#1a1a1a" strokeWidth="3" />
    <path d="m40 24-26 28" stroke="#2ea85c" strokeWidth="5" />
  </svg>
)

/* ---------- Illustrations du bandeau latéral ---------- */

export const FridgeArt = (p: ArtProps) => (
  <svg viewBox="0 0 140 140" aria-hidden {...p}>
    <rect x="18" y="8" width="84" height="124" rx="8" fill="#c9ced3" stroke="#3d4349" strokeWidth="3" />
    <rect x="24" y="14" width="36" height="112" rx="4" fill="#9aa1a8" stroke="#3d4349" strokeWidth="2" />
    <rect x="30" y="30" width="14" height="18" rx="2" fill="#5b6268" />
    <rect x="62" y="14" width="34" height="112" rx="3" fill="#f6f7f8" stroke="#3d4349" strokeWidth="2" />
    <path d="M62 44h34M62 72h34M62 100h34" stroke="#3d4349" strokeWidth="2" />
    <circle cx="70" cy="37" r="5" fill="#e53935" />
    <circle cx="80" cy="38" r="4" fill="#7cb342" />
    <rect x="86" y="26" width="6" height="16" rx="2" fill="#fbc02d" />
    <rect x="67" y="56" width="10" height="14" rx="2" fill="#fff" stroke="#90a4ae" strokeWidth="1.5" />
    <path d="M80 70c0-6 8-6 8 0" fill="#ff8a65" />
    <circle cx="72" cy="94" r="5" fill="#43a047" />
    <circle cx="84" cy="95" r="4" fill="#ef6c00" />
    <rect x="68" y="108" width="22" height="12" rx="3" fill="#b0bec5" />
    <path d="M96 14c14 4 22 10 26 14v88c-4 4-12 8-26 10V14Z" fill="#e3e7ea" stroke="#3d4349" strokeWidth="2.5" />
    <path d="M100 40h18M100 70h18M100 100h18" stroke="#3d4349" strokeWidth="2" />
    <rect x="103" y="28" width="5" height="11" rx="1.5" fill="#e53935" />
    <rect x="110" y="30" width="5" height="9" rx="1.5" fill="#fff" stroke="#90a4ae" />
    <rect x="104" y="86" width="10" height="13" rx="2" fill="#fdd835" />
    <path d="M18 88h84" stroke="#3d4349" strokeWidth="2.5" />
    <rect x="28" y="96" width="4" height="22" rx="2" fill="#3d4349" />
  </svg>
)

export const GroceryBagArt = (p: ArtProps) => (
  <svg viewBox="0 0 140 140" aria-hidden {...p}>
    <path d="M44 22c-8-10-4-18 2-16 2 6 0 10-2 16Z" fill="#43a047" />
    <path d="M34 26c-10-6-10-14-4-15 4 5 4 9 4 15Z" fill="#66bb6a" />
    <path d="M40 30 26 60l10 2 12-30Z" fill="#fb8c00" />
    <rect x="62" y="14" width="18" height="40" rx="5" fill="#e3f2fd" stroke="#1e88e5" strokeWidth="3" />
    <rect x="65" y="6" width="12" height="9" rx="2" fill="#1e88e5" />
    <circle cx="96" cy="34" r="16" fill="#ef5350" />
    <circle cx="96" cy="34" r="6" fill="#f8bbd0" />
    <path d="m108 44 12 12" stroke="#f5f5f5" strokeWidth="6" strokeLinecap="round" />
    <circle cx="52" cy="46" r="10" fill="#e53935" />
    <path d="M18 50h104l-8 82H26L18 50Z" fill="#f2c79a" stroke="#6d4c41" strokeWidth="3" strokeLinejoin="round" />
    <path d="M18 50h104" stroke="#6d4c41" strokeWidth="3" />
    <path d="M50 70v-4a20 20 0 0 1 40 0v4" fill="none" stroke="#6d4c41" strokeWidth="4" strokeLinecap="round" />
    <path d="M52 96c6 8 30 8 36 0" fill="none" stroke="#6d4c41" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

export const HistoryArt = (p: ArtProps) => (
  <svg viewBox="0 0 140 140" aria-hidden {...p}>
    <rect x="26" y="18" width="80" height="108" rx="8" fill="#fff8ee" stroke="#6d4c41" strokeWidth="3" />
    <rect x="48" y="10" width="36" height="16" rx="5" fill="#f2c79a" stroke="#6d4c41" strokeWidth="3" />
    <path d="M42 50h30M42 68h44M42 86h36M42 104h24" stroke="#bcaaa4" strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="98" r="26" fill="#fff" stroke="#2e7d32" strokeWidth="4" />
    <path d="M100 84v15l10 6" stroke="#2e7d32" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M70 34c-4 6 4 8 0 14" stroke="#e8751a" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
)
