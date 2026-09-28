import { useState } from 'react'
import { Bullet, EmptyState } from '../components/Feedback'
import { PhotoMealCard } from '../components/MealCard'
import { MealDetailsModal } from '../components/MealDetailsModal'
import { useUserData } from '../hooks/useAuth'
import type { MealTotals, SavedMeal } from '../types/Meal'
import { capitalize, fmt } from '../utils/format'
import { sumMeals } from '../utils/macros'
import { todayKey } from '../utils/storage'

function groupByDay(meals: SavedMeal[]) {
  const groups = new Map<string, SavedMeal[]>()
  for (const meal of meals) {
    const day = todayKey(new Date(meal.eatenAt ?? meal.addedAt))
    groups.set(day, [...(groups.get(day) ?? []), meal])
  }
  return [...groups.entries()]
}

function dayLabel(day: string) {
  if (day === todayKey()) return "Aujourd'hui"
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (day === todayKey(yesterday)) return 'Hier'
  return capitalize(new Date(`${day}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))
}

export default function History() {
  const { history, clearHistory, stored } = useUserData()
  const [openMeal, setOpenMeal] = useState<MealTotals | null>(null)
  const target = stored?.plan?.daily_targets.calories

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-head text-3xl leading-[1.12] font-bold uppercase sm:text-[2.2rem]">Historique des plats</h1>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => window.confirm("Effacer tout l'historique ?") && clearHistory()}
            className="mt-2 cursor-pointer text-sm text-white/55 hover:text-red-300"
          >
            Effacer l'historique
          </button>
        )}
      </div>
      <ul className="mt-4 text-lg text-white/85">
        <Bullet>Retrouvez les plats que vous avez mangés, jour par jour</Bullet>
      </ul>

      <div className="mt-8 space-y-10">
        {history.length === 0 ? (
          <EmptyState title="Aucun plat pour l'instant">
            Dans « Mes plats », marquez un plat comme mangé pour qu'il apparaisse ici.
          </EmptyState>
        ) : (
          groupByDay(history).map(([day, meals]) => {
            const total = sumMeals(meals).calories
            return (
              <section key={day}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
                  <h2 className="font-serif text-xl font-bold">{dayLabel(day)}</h2>
                  <p className="text-sm text-white/60">
                    <span className="font-bold text-white">{fmt(total)} kcal</span>
                    {target ? ` / ${fmt(target)} kcal` : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {meals.map((meal) => (
                    <PhotoMealCard key={meal.id} meal={meal} onOpen={() => setOpenMeal(meal)} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>

      <MealDetailsModal meal={openMeal} onClose={() => setOpenMeal(null)} />
    </>
  )
}
