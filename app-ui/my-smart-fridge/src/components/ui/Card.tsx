import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `paper` : carte claire à bord orange (maquettes) ; `panel` : panneau sombre. */
  tone?: 'paper' | 'panel'
}

export function Card({ tone = 'paper', className = '', ...rest }: CardProps) {
  const style =
    tone === 'paper'
      ? 'bg-paper text-ink-950 border-2 border-brand-500 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.55)]'
      : 'bg-ink-850 text-white border border-white/10'
  return <div className={`rounded-2xl ${style} ${className}`} {...rest} />
}
