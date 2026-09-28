import { useEffect, useRef } from 'react'
import { useUserData } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { getMealDetails, mealIngredients } from '../services/mealImages'
import type { MealTotals } from '../types/Meal'
import { grams, kcal } from '../utils/format'
import { ErrorBanner } from './Feedback'
import { CartIcon, CheckIcon, CloseIcon } from './icons'
import { Button } from './ui/Button'

interface MealDetailsModalProps {
  meal: MealTotals | null
  onClose: () => void
}

export function MealDetailsModal({ meal, onClose }: MealDetailsModalProps) {
  const { fridge, addToMenu, isInMenu, addToShopping, shopping } = useUserData()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { data, loading, error, reload } = useFetch(meal ? `details:${meal.meal_name}` : null, () =>
    getMealDetails(meal!.meal_name),
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (meal && !dialog.open) dialog.showModal()
    if (!meal && dialog.open) dialog.close()
  }, [meal])

  const ingredients = data ? mealIngredients(data) : []
  const fridgeNames = fridge.map((i) => i.query.toLowerCase())
  const inFridge = (name: string) => {
    const n = name.toLowerCase()
    return fridgeNames.some((f) => n.includes(f) || f.includes(n))
  }
  const onList = new Set(shopping.map((s) => s.label.toLowerCase()))
  const missing = ingredients.filter((i) => !inFridge(i.name) && !onList.has(i.name.toLowerCase()))
  const added = meal ? isInMenu(meal.meal_name) : false

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="m-auto max-h-[90vh] w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border-2 border-brand-500 bg-ink-850 p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {meal && (
        <div className="grid max-h-[90vh] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative bg-ink-950">
            {data?.strMealThumb ? (
              <img src={data.strMealThumb} alt="" className="h-56 w-full object-cover md:h-full" />
            ) : (
              <div className={`h-56 w-full md:h-full ${loading ? 'animate-pulse bg-white/5' : 'bg-brand-600/30'}`} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
              <div className="flex flex-wrap gap-2">
                {[data?.strCategory, data?.strArea].filter(Boolean).map((tag) => (
                  <span key={tag} className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-ink-950">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-leaf-400 uppercase">Fiche du plat</p>
                <h2 className="mt-1 font-head text-2xl leading-tight font-extrabold uppercase">{meal.meal_name}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-4 gap-2 text-center">
              {[
                ['Calories', kcal(meal.total_calories)],
                ['Protéines', grams(meal.total_protein)],
                ['Glucides', grams(meal.total_carbs)],
                ['Lipides', grams(meal.total_fat)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-paper px-2 py-2.5 text-ink-950">
                  <dt className="text-[0.7rem] text-ink-950/70">{label}</dt>
                  <dd className="text-sm font-bold">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant={added ? 'success' : 'primary'}
                onClick={() => addToMenu(meal, data?.strMealThumb)}
                disabled={added}
                className="disabled:opacity-100"
              >
                {added ? (
                  <>
                    <CheckIcon className="size-4" /> Dans mon menu
                  </>
                ) : (
                  'Ajouter au menu'
                )}
              </Button>
              {ingredients.length > 0 && (
                <Button
                  variant="secondary"
                  disabled={missing.length === 0}
                  onClick={() => addToShopping(missing.map((i) => i.name))}
                >
                  <CartIcon className="size-4" />
                  {missing.length === 0 ? 'Tout est prévu' : `Ajouter ${missing.length} ingrédient(s) aux courses`}
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-5">
                <ErrorBanner message={error} onRetry={reload} />
              </div>
            )}
            {!loading && !error && !data && (
              <p className="mt-5 text-sm text-white/60">La recette détaillée n'est pas disponible pour ce plat.</p>
            )}

            {ingredients.length > 0 && (
              <section className="mt-6">
                <h3 className="font-head text-sm font-extrabold tracking-wide uppercase">Ingrédients</h3>
                <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
                  {ingredients.map((i) => (
                    <li key={i.name} className="flex items-center gap-2">
                      <span
                        className={`size-2 shrink-0 rounded-full ${inFridge(i.name) ? 'bg-leaf-400' : 'bg-white/25'}`}
                        title={inFridge(i.name) ? 'Dans votre frigo' : undefined}
                      />
                      <span className="text-white/90">{i.name}</span>
                      {i.measure && <span className="truncate text-white/45">· {i.measure}</span>}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-white/45">
                  <span className="mr-1 inline-block size-2 rounded-full bg-leaf-400" /> déjà dans votre frigo
                </p>
              </section>
            )}

            {data?.strInstructions && (
              <section className="mt-6">
                <h3 className="font-head text-sm font-extrabold tracking-wide uppercase">Préparation</h3>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-white/75">{data.strInstructions}</p>
              </section>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
