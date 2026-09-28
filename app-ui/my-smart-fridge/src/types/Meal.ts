/** Plat avec ses totaux nutritionnels, tel que renvoyé par `/meals/search_by_ingred`. */
export interface MealTotals {
  meal_name: string
  total_calories: number
  total_protein: number
  total_fat: number
  total_carbs: number
}

/** Plat brut de TheMealDB (sous-ensemble des champs utilisés). */
export interface MealDbMeal {
  idMeal: string
  strMeal: string
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
  strMealThumb: string | null
  strYoutube?: string | null
  [key: string]: string | null | undefined
}

export interface MealDbResponse {
  meals: MealDbMeal[] | null
}

/** Plat enregistré dans le menu du jour ou l'historique. */
export interface SavedMeal extends MealTotals {
  id: string
  thumb?: string | null
  addedAt: string
  eatenAt?: string
}
