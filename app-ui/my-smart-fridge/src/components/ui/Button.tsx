import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-400 text-ink-950 hover:bg-brand-500 focus-visible:outline-brand-300',
  secondary:
    'bg-ink-800 text-white border border-ink-600 hover:bg-ink-700 hover:border-leaf-600 focus-visible:outline-leaf-400',
  success: 'bg-leaf-500 text-ink-950 hover:bg-leaf-400 focus-visible:outline-leaf-300',
  ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-white/40',
  danger: 'bg-transparent text-red-300 border border-red-400/40 hover:bg-red-500/10 focus-visible:outline-red-300',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  className = '',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  )
}
