interface ProgressRingProps {
  /** Pourcentage (peut dépasser 100). */
  value: number
  size?: number
  stroke?: number
  className?: string
  label?: string
}

export function ProgressRing({ value, size = 44, stroke = 4, className = '', label }: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(value, 100))
  const over = value > 110

  return (
    <div className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={over ? 'var(--color-brand-400)' : 'var(--color-leaf-400)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-[0.65rem] font-bold" aria-label={label}>
        {Math.round(value)}%
      </span>
    </div>
  )
}
