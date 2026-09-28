import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from '../icons'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  options: { value: string; label: string }[]
}

export function Select({ label, options, className = '', id, ...rest }: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block font-head text-xs font-extrabold uppercase tracking-wide text-white"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-white/25 bg-transparent pr-9 pl-3 text-sm text-white/85 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-400/25"
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink-850 text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/70" />
      </div>
    </div>
  )
}
