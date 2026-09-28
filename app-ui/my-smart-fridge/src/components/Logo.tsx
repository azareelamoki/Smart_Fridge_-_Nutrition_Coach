import { FridgeLogoIcon } from './icons'

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const styles = {
    sm: 'gap-2 px-3 py-1.5 text-base [&_svg]:size-5',
    md: 'gap-2.5 px-4 py-2 text-xl [&_svg]:size-6',
    lg: 'gap-3 px-4 py-2.5 text-3xl [&_svg]:size-8',
  }[size]

  return (
    <span
      className={`inline-flex items-center rounded-full bg-mint font-display font-bold tracking-tight text-ink-950 ${styles} ${className}`}
    >
      <FridgeLogoIcon className="text-leaf-500" />
      Smart Fridge
    </span>
  )
}
