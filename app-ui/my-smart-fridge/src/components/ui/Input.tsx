import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: string | null
  /** Élément affiché à droite du champ (icône ou bouton). */
  trailing?: ReactNode
  /** `auth` : grand champ de la page de connexion ; `compact` : champs du formulaire programme. */
  tone?: 'auth' | 'compact'
}

export function Input({ label, hint, error, trailing, tone = 'auth', className = '', id, ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const field =
    tone === 'auth'
      ? 'h-12 rounded-xl bg-ink-800 border-ink-600 px-4 text-base'
      : 'h-10 rounded-lg bg-transparent border-white/25 px-3 text-sm'

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className={
            tone === 'auth'
              ? 'mb-2 block text-sm font-semibold text-white'
              : 'mb-2 block font-head text-xs font-extrabold uppercase tracking-wide text-white'
          }
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={`w-full border text-white placeholder:text-white/40 transition-colors outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/25 ${field} ${trailing ? 'pr-11' : ''} ${error ? 'border-red-400/70' : ''}`}
          {...rest}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60">{trailing}</div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-white/50">{hint}</p>
      )}
    </div>
  )
}
