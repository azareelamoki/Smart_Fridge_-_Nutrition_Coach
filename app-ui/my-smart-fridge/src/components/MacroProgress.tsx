import type { MacroTargets } from '../types/User'
import { fmt, percent } from '../utils/format'
import { MACRO_ROWS } from '../utils/macros'

interface MacroProgressProps {
  value: MacroTargets
  target: MacroTargets
  /** Valeur additionnelle affichée en pointillés (ex. plats prévus mais pas encore mangés). */
  planned?: MacroTargets
}

export function MacroProgress({ value, target, planned }: MacroProgressProps) {
  return (
    <div className="space-y-4">
      {MACRO_ROWS.map(({ key, label, unit }) => {
        const pct = percent(value[key], target[key])
        const plannedPct = planned ? percent(planned[key], target[key]) : 0
        const over = pct > 110
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-semibold">{label}</span>
              <span className="text-white/60">
                <span className={`font-bold ${over ? 'text-brand-300' : 'text-white'}`}>{fmt(value[key])}</span> /{' '}
                {fmt(target[key])} {unit}
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
              {plannedPct > 0 && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-leaf-400/30"
                  style={{ width: `${Math.min(100, pct + plannedPct)}%` }}
                />
              )}
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ${over ? 'bg-brand-400' : 'bg-leaf-400'}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
