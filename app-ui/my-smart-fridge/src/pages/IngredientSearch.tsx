import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bullet, EmptyState, ErrorBanner } from '../components/Feedback'
import { IngredientItem } from '../components/IngredientItem'
import { MealCardSkeleton, PhotoMealCard } from '../components/MealCard'
import { MealDetailsModal } from '../components/MealDetailsModal'
import { toIngredient } from '../data/ingredients'
import { useUserData } from '../hooks/useAuth'
import { api } from '../services/api'
import type { Ingredient } from '../types/Ingredient'
import type { MealTotals } from '../types/Meal'
import type { MealMatchResponse } from '../types/User'
import { fmt } from '../utils/format'
import { MACRO_ROWS } from '../utils/macros'

interface SearchResult {
  ingredient: Ingredient
  response: MealMatchResponse
}

const rankLabel = (index: number) => (index === 0 ? 'Meilleur choix' : `N°${index + 1}`)

export default function IngredientSearch() {
  const { fridge, addToFridge, removeFromFridge, stored } = useUserData()
  const [text, setText] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openMeal, setOpenMeal] = useState<MealTotals | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const selectedItem = fridge.find((i) => i.label === selected) ?? null
  const available = fridge.filter((i) => i.label !== selectedItem?.label)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const label = text.trim()
    if (!label) return
    const item = toIngredient(label)
    const existing = fridge.find((i) => i.label.toLowerCase() === item.label.toLowerCase())
    if (!existing) addToFridge(item)
    setSelected(existing?.label ?? item.label)
    setText('')
  }

  async function handleSearch() {
    if (!selectedItem || !stored) return
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)
    try {
      const response = await api.matchByIngredient(
        selectedItem.query,
        stored.profile,
        stored.mealsPerDay,
        controller.signal,
      )
      if (controller.signal.aborted) return
      setResult({ ingredient: selectedItem, response })
    } catch (err) {
      if (controller.signal.aborted) return
      setError(err instanceof Error ? err.message : 'La recherche a échoué.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  const meals = result?.response.matched_meals ?? []
  const target = result?.response.per_meal_targets

  return (
    <>
      <h1 className="font-head text-3xl leading-[1.12] font-bold uppercase sm:text-[2.2rem]">
        Recherche d'un plat en fonction d'un ingrédient
      </h1>
      <ul className="mt-4 text-lg text-white/85">
        <Bullet>Choisissez un ingrédient : nous trouvons les plats les plus adaptés à vos objectifs</Bullet>
      </ul>

      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleAdd} className="mt-7">
          <label htmlFor="ingredient-input" className="sr-only">
            Choisir un ingrédient
          </label>
          <input
            id="ingredient-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez un ingrédient (p. ex., tomates, poulet, etc.)"
            className="h-13 w-full rounded-xl border border-brand-500 bg-transparent px-4 text-[0.95rem] text-white shadow-[0_0_0_1px_rgba(232,117,26,0.15)] outline-none placeholder:text-white/75 focus:ring-2 focus:ring-brand-400/40"
          />
          <p className="mt-1.5 pl-1 text-xs text-white/40">
            Appuyez sur Entrée pour le sélectionner · un seul ingrédient à la fois
          </p>
        </form>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:gap-10">
          <section aria-labelledby="not-selected" className="flex flex-col items-center">
            <h2 id="not-selected" className="mb-3 font-head text-sm font-bold tracking-wide text-white/85 uppercase sm:text-base">
              Ing not selected
            </h2>
            <div className="flex w-full flex-col items-center gap-2.5">
              {available.map((i) => (
                <IngredientItem
                  key={i.label}
                  label={i.label}
                  onClick={() => setSelected(i.label)}
                  onDelete={() => removeFromFridge(i.label)}
                />
              ))}
              {available.length === 0 && <p className="text-sm text-white/40">Votre frigo est vide.</p>}
            </div>
          </section>

          <section aria-labelledby="selected" className="flex flex-col items-center">
            <h2 id="selected" className="mb-3 font-head text-sm font-bold tracking-wide text-leaf-400 uppercase sm:text-base">
              Ing selected
            </h2>
            <div className="flex w-full flex-col items-center gap-2.5">
              {selectedItem ? (
                <>
                  <IngredientItem label={selectedItem.label} selected onClick={() => setSelected(null)} />
                  <p className="text-center text-xs text-white/40">Choisir un autre ingrédient le remplace.</p>
                </>
              ) : (
                <p className="text-center text-sm text-white/40">Cliquez sur + pour choisir un ingrédient.</p>
              )}
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!selectedItem || loading}
          className="mt-9 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 font-head text-base font-bold tracking-wide text-ink-950 uppercase shadow-[0_4px_0_rgba(0,0,0,0.25)] transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          Rechercher mon mets
        </button>
      </div>

      <section className="mt-8" aria-live="polite">
        {error && <ErrorBanner message={error} onRetry={handleSearch} />}
        {loading ? (
          <>
            <p className="mb-4 text-sm text-white/55" role="status">
              Analyse de tous les plats contenant « {selectedItem?.label} »… cela peut prendre un moment.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: stored?.mealsPerDay ?? 3 }, (_, i) => (
                <MealCardSkeleton key={i} photo />
              ))}
            </div>
          </>
        ) : (
          result &&
          (meals.length === 0 ? (
            <EmptyState title="Aucun plat trouvé">
              Aucun plat avec « {result.ingredient.label} ». Essayez un ingrédient de base (poulet, riz, saumon…).
            </EmptyState>
          ) : (
            <>
              {target && (
                <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/10 bg-ink-850 px-5 py-4 text-sm">
                  <p className="font-head text-xs font-extrabold tracking-wide uppercase">
                    Votre objectif par repas
                    <span className="ml-1 font-sans font-normal normal-case tracking-normal text-white/50">
                      ({result.response.meals_per_day} repas / jour)
                    </span>
                  </p>
                  {MACRO_ROWS.map(({ key, label, unit }) => (
                    <p key={key} className="text-white/60">
                      {label} <span className="font-bold text-white">{fmt(target[key])} {unit}</span>
                    </p>
                  ))}
                </div>
              )}
              <p className="mb-4 text-sm text-white/55">
                Les plats avec « {result.ingredient.label} » les plus proches de votre objectif, du plus au moins adapté :
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {meals.map((meal, index) => (
                  <PhotoMealCard
                    key={meal.meal_name}
                    meal={meal}
                    onOpen={() => setOpenMeal(meal)}
                    badge={rankLabel(index)}
                  />
                ))}
              </div>
            </>
          ))
        )}
      </section>

      <MealDetailsModal meal={openMeal} onClose={() => setOpenMeal(null)} />
    </>
  )
}
