import { useState } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '../components/Feedback'
import { CheckIcon, TrashIcon } from '../components/icons'
import { MacroProgress } from '../components/MacroProgress'
import { sumMeals } from '../utils/macros'
import { MealThumb } from '../components/MealCard'
import { MealDetailsModal } from '../components/MealDetailsModal'
import { Card } from '../components/ui/Card'
import { useUserData } from '../hooks/useAuth'
import type { MealTotals } from '../types/Meal'
import { grams, kcal } from '../utils/format'
import { todayKey } from '../utils/storage'

export default function MyMeals() {
  const { menu, history, stored, markEaten, removeFromMenu } = useUserData()
  const [openMeal, setOpenMeal] = useState<MealTotals | null>(null)

  const eatenToday = history.filter((m) => m.eatenAt && todayKey(new Date(m.eatenAt)) === todayKey())
  const targets = stored?.plan?.daily_targets

  return (
    <>
      <h1 className="font-serif text-3xl leading-tight font-bold sm:text-[2.1rem]">
        Mes plats
        <br />
        du jour.
      </h1>
      <p className="mt-3 text-sm text-white/65">
        Les plats ajoutés à votre menu. Marquez-les comme mangés pour suivre vos apports.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="space-y-4">
          {menu.length === 0 ? (
            <EmptyState
              title="Votre menu est vide"
              action={
                <Link
                  to="/decouvrir"
                  className="rounded-xl bg-brand-500 px-5 py-2.5 font-head text-sm font-bold text-ink-950 uppercase hover:bg-brand-400"
                >
                  Découvrir des plats
                </Link>
              }
            >
              Ajoutez des suggestions du jour ou cherchez un plat avec les ingrédients de votre frigo.
            </EmptyState>
          ) : (
            menu.map((meal) => (
              <Card key={meal.id} className="flex items-center gap-4 p-3 sm:gap-5">
                <button type="button" onClick={() => setOpenMeal(meal)} className="shrink-0 cursor-pointer">
                  <MealThumb name={meal.meal_name} thumb={meal.thumb} className="size-20 rounded-xl sm:size-24" />
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setOpenMeal(meal)}
                    className="block max-w-full cursor-pointer truncate text-left font-head text-base font-bold uppercase hover:text-brand-600"
                  >
                    {meal.meal_name}
                  </button>
                  <p className="mt-1 text-sm">
                    <span className="font-bold">{kcal(meal.total_calories)}</span>
                    <span className="text-ink-950/65">
                      {' '}
                      · P {grams(meal.total_protein)} · G {grams(meal.total_carbs)} · L {grams(meal.total_fat)}
                    </span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => markEaten(meal.id)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-leaf-500 px-3 py-1.5 font-head text-[0.7rem] font-bold text-ink-950 uppercase hover:bg-leaf-400"
                    >
                      <CheckIcon className="size-3.5" /> J'ai mangé ce plat
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromMenu(meal.id)}
                      aria-label={`Retirer ${meal.meal_name} du menu`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-950/60 hover:bg-ink-950/10 hover:text-red-600"
                    >
                      <TrashIcon className="size-3.5" /> Retirer
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-white/10 bg-ink-850 p-5 lg:sticky lg:top-6">
          <h2 className="font-head text-sm font-extrabold tracking-wide uppercase">Bilan de la journée</h2>
          <p className="mt-1 text-xs text-white/50">
            {eatenToday.length} plat{eatenToday.length > 1 ? 's' : ''} mangé{eatenToday.length > 1 ? 's' : ''} ·{' '}
            {menu.length} prévu{menu.length > 1 ? 's' : ''}
          </p>
          <div className="mt-5">
            {targets ? (
              <MacroProgress value={sumMeals(eatenToday)} planned={sumMeals(menu)} target={targets} />
            ) : (
              <p className="text-sm text-white/60">
                <Link to="/programme" className="text-brand-300 underline">
                  Configurez votre programme
                </Link>{' '}
                pour comparer à vos objectifs.
              </p>
            )}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/45">
            <span className="h-2 w-5 rounded-full bg-leaf-400" /> mangé
            <span className="ml-2 h-2 w-5 rounded-full bg-leaf-400/30" /> prévu
          </p>
        </aside>
      </div>

      <MealDetailsModal meal={openMeal} onClose={() => setOpenMeal(null)} />
    </>
  )
}
