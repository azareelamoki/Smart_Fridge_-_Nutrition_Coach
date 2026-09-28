import type { MealDbMeal } from '../types/Meal'
import { api } from './api'

const cache = new Map<string, Promise<MealDbMeal | null>>()

/** Détail TheMealDB d'un plat (photo, recette…), mis en cache par nom. */
export function getMealDetails(name: string): Promise<MealDbMeal | null> {
  let pending = cache.get(name)
  if (!pending) {
    pending = api
      .searchMeal(name)
      .then(({ meals }) => meals?.find((m) => m.strMeal === name) ?? meals?.[0] ?? null)
      .catch(() => {
        cache.delete(name)
        return null
      })
    cache.set(name, pending)
  }
  return pending
}

export function mealIngredients(meal: MealDbMeal): { name: string; measure: string }[] {
  const items: { name: string; measure: string }[] = []
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] ?? '').trim()
    if (name) items.push({ name, measure: (meal[`strMeasure${i}`] ?? '').trim() })
  }
  return items
}
