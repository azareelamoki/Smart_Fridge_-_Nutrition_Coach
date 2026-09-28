import { useState } from 'react'
import { EmptyState, ErrorBanner } from '../components/Feedback'
import { ArrowRightIcon } from '../components/icons'
import { BowlArt, ChefHatArt, CutleryArt } from '../components/illustrations'
import { MealCardSkeleton, SuggestionCard } from '../components/MealCard'
import { MealDetailsModal } from '../components/MealDetailsModal'
import { DAILY_INGREDIENTS } from '../data/ingredients'
import { useAuth, useUserData } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { api } from '../services/api'
import type { MealTotals } from '../types/Meal'

const SUGGESTION_COUNT = 9
const SUGGESTION_ARTS = [BowlArt, ChefHatArt, CutleryArt]

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000)
}

export default function DailySuggestions() {
  const { session } = useAuth()
  const { stored, addToMenu, isInMenu } = useUserData()
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<MealTotals | null>(null)

  const ingredient = DAILY_INGREDIENTS[(dayOfYear() + offset) % DAILY_INGREDIENTS.length]
  const { data, loading, error, reload } = useFetch(`daily:${ingredient.query}`, (signal) =>
    api.mealsByIngredient(ingredient.query, signal),
  )
  const meals = (data ?? []).slice(0, SUGGESTION_COUNT)
  const perMealTarget = stored?.plan?.per_meal_targets.calories

  return (
    <>
      <h1 className="font-serif text-3xl leading-tight font-bold sm:text-[2.1rem]">
        Bonjour {session?.username} !
        <br />
        Voici vos suggestions du jour.
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/65">
        Inspirées par un ingrédient du jour :
        <span className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-ink-950">{ingredient.label}</span>
        {perMealTarget && (
          <span className="text-white/50">· objectif ≈ {Math.round(perMealTarget)} kcal par repas</span>
        )}
      </p>

      <div className="mt-7">
        {error ? (
          <ErrorBanner message={error} onRetry={reload} />
        ) : loading ? (
          <>
            <p className="mb-4 text-sm text-white/55" role="status">
              Calcul des valeurs nutritionnelles en cours… cela peut prendre quelques secondes.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <MealCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : meals.length === 0 ? (
          <EmptyState title="Aucune suggestion">
            Aucun plat trouvé avec « {ingredient.label} ». Lancez une nouvelle sélection.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {meals.map((meal, i) => (
              <SuggestionCard
                key={meal.meal_name}
                meal={meal}
                Art={SUGGESTION_ARTS[i % SUGGESTION_ARTS.length]}
                inMenu={isInMenu(meal.meal_name)}
                onAdd={() => addToMenu(meal)}
                onOpen={() => setSelected(meal)}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl leading-tight font-bold">
            Sélection aléatoire
            <br />
            de plats du jour
          </h2>
          <p className="mt-2 text-sm text-white/75">Affiché aléatoirement</p>
        </div>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          disabled={loading}
          className="group flex cursor-pointer items-center gap-2 text-white/90 transition hover:text-brand-300 disabled:cursor-wait disabled:opacity-50"
        >
          Nouvelle sélection
          <ArrowRightIcon className="size-5 transition group-hover:translate-x-1" />
        </button>
      </footer>

      <MealDetailsModal meal={selected} onClose={() => setSelected(null)} />
    </>
  )
}
