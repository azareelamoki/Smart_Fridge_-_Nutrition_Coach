import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps): IconProps => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
})

export const FridgeLogoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M3.5 9.5h17M8 6.5v0" />
  </svg>
)

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOffIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.7 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.2 3.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20" />
  </svg>
)

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MinusCircleIcon = (p: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...p })}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7.5 12h9" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...p })}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 14a8 8 0 0 1-6.2-2.9C6.9 15.2 9.3 14.5 12 14.5s5.1.7 6.2 2.6A8 8 0 0 1 12 20Z" />
  </svg>
)

export const WeightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 8h11l2 12h-15l2-12Z" />
    <path d="M9.5 8a2.5 2.5 0 1 1 5 0" />
  </svg>
)

export const AgeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fill="currentColor" stroke="none" fontWeight="700">
      34
    </text>
  </svg>
)

export const HeightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="7" height="18" rx="1.5" />
    <path d="M4 7h3M4 11h4M4 15h3M17 4v16M14.5 6.5 17 4l2.5 2.5M14.5 17.5 17 20l2.5-2.5" />
  </svg>
)

export const FlameIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-2.5 3.5-2.5 5.5C10.5 8 9.5 7 9 5.5 6.5 8 5 10.8 5 14a7 7 0 0 0 7 7Z" />
  </svg>
)

export const DrumstickIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15.4 15.6a6 6 0 1 0-7-7c-.6 2.6-.1 4.8 1.6 6.4 1.6 1.6 3.8 2.2 5.4.6Z" />
    <path d="m11.5 14.5-5.8 5.8M5 17.5a1.5 1.5 0 1 0-1.3 2.6M6.5 19a1.5 1.5 0 1 1-2.6 1.3" />
  </svg>
)

export const WheatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 22V8M12 8c-2-1-3-3-3-5 2 0 3 2 3 5Zm0 0c2-1 3-3 3-5-2 0-3 2-3 5ZM12 14c-2.5 0-4.5-1.5-5-4 2.5 0 4.5 1.5 5 4Zm0 0c2.5 0 4.5-1.5 5-4-2.5 0-4.5 1.5-5 4ZM12 19c-2.5 0-4.5-1.5-5-4 2.5 0 4.5 1.5 5 4Zm0 0c2.5 0 4.5-1.5 5-4-2.5 0-4.5 1.5-5 4Z" />
  </svg>
)

export const DropIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
)

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const RefreshIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
  </svg>
)

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const CartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </svg>
)
