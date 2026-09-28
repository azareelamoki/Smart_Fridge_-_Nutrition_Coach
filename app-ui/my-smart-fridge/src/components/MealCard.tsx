import type { ComponentType, SVGProps } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getMealDetails } from '../services/mealImages'
import type { MealTotals } from '../types/Meal'
import { grams, kcal } from '../utils/format'
import { DrumstickIcon, DropIcon, FlameIcon, WheatIcon } from './icons'
import { Card } from './ui/Card'

const MACROS = [
  { key: 'total_calories', label: 'Calories', Icon: FlameIcon, format: kcal },
  { key: 'total_protein', label: 'Protéines', Icon: DrumstickIcon, format: grams },
  { key: 'total_carbs', label: 'Glucides', Icon: WheatIcon, format: grams },
  { key: 'total_fat', label: 'Lipides', Icon: DropIcon, format: grams },
] as const

/* ---------- Carte « suggestion du jour » (maquette tableau de bord) ---------- */

interface SuggestionCardProps {
  meal: MealTotals
  Art: ComponentType<SVGProps<SVGSVGElement>>
  inMenu: boolean
  onAdd: () => void
  onOpen: () => void
}

export function SuggestionCard({ meal, Art, inMenu, onAdd, onOpen }: SuggestionCardProps) {
  return (
    <Card className="flex flex-col items-center px-4 pt-4 pb-3.5 text-center transition hover:-translate-y-0.5">
      <button
        type="button"
        onClick={onOpen}
        className="line-clamp-2 min-h-[2.6em] cursor-pointer font-head text-[0.95rem] leading-tight font-bold uppercase hover:text-brand-600"
      >
        {meal.meal_name}
      </button>

      <Art className="my-3 h-14 w-16" />

      <dl className="grid w-full grid-cols-2 gap-x-2 gap-y-2 text-[0.8rem] leading-tight">
        {MACROS.map(({ key, label, format }) => (
          <div key={key}>
            <dt className="text-ink-950/75">{label}</dt>
            <dd className="font-bold">{format(meal[key])}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={inMenu ? onOpen : onAdd}
        className={`mt-3.5 w-full cursor-pointer rounded-lg py-1.5 font-head text-[0.7rem] font-bold tracking-wide uppercase shadow-[0_2px_0_rgba(0,0,0,0.2)] transition ${
          inMenu ? 'bg-leaf-500 text-ink-950 hover:bg-leaf-400' : 'bg-brand-500 text-ink-950 hover:bg-brand-400'
        }`}
      >
        {inMenu ? 'Voir plus' : 'Ajouter au menu'}
      </button>
    </Card>
  )
}

/* ---------- Carte avec photo (maquette recherche par ingrédients) ---------- */

export function MealThumb({ name, thumb, className = '' }: { name: string; thumb?: string | null; className?: string }) {
  const { data } = useFetch(thumb ? null : `thumb:${name}`, () => getMealDetails(name))
  const src = thumb ?? data?.strMealThumb
  return src ? (
    <img src={src} alt="" loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`animate-pulse bg-ink-950/10 ${className}`} />
  )
}

export function PhotoMealCard({ meal, onOpen, badge }: { meal: MealTotals; onOpen: () => void; badge?: string }) {
  return (
    <Card className="group overflow-hidden p-2 transition hover:-translate-y-0.5">
      <button type="button" onClick={onOpen} className="block w-full cursor-pointer text-left">
        <div className="relative">
          <MealThumb name={meal.meal_name} className="aspect-[4/3] w-full rounded-xl transition group-hover:brightness-105" />
          {badge && (
            <span className="absolute top-2 left-2 rounded-full bg-leaf-500 px-2 py-0.5 text-[0.65rem] font-bold text-ink-950">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-2 truncate px-1 text-center text-[0.95rem] font-semibold">{meal.meal_name}</p>
        <dl className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1.5 px-1 pb-1 text-[0.68rem] leading-tight">
          {MACROS.map(({ key, label, Icon, format }) => (
            <div key={key} className="flex items-center gap-1.5">
              <Icon className="size-4 shrink-0 text-ink-950/70" strokeWidth={1.8} />
              <div>
                <dt className="text-ink-950/70">{label}</dt>
                <dd className="font-bold">{format(meal[key])}</dd>
              </div>
            </div>
          ))}
        </dl>
      </button>
    </Card>
  )
}

export function MealCardSkeleton({ photo = false }: { photo?: boolean }) {
  return (
    <Card className="animate-pulse p-3">
      <div className={photo ? 'aspect-[4/3] rounded-xl bg-ink-950/10' : 'mx-auto mt-1 h-8 w-3/4 rounded bg-ink-950/10'} />
      {!photo && <div className="mx-auto my-4 size-14 rounded-full bg-ink-950/10" />}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-7 rounded bg-ink-950/10" />
        ))}
      </div>
      <div className="mt-3 h-7 rounded-lg bg-ink-950/10" />
    </Card>
  )
}
