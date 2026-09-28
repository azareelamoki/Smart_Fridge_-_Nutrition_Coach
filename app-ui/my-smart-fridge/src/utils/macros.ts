import type { MealTotals } from '../types/Meal'
import type { MacroTargets } from '../types/User'

export const MACRO_ROWS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein_g', label: 'Protéines', unit: 'g' },
  { key: 'carbs_g', label: 'Glucides', unit: 'g' },
  { key: 'fat_g', label: 'Lipides', unit: 'g' },
] as const

export function sumMeals(meals: MealTotals[]): MacroTargets {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.total_calories,
      protein_g: acc.protein_g + m.total_protein,
      carbs_g: acc.carbs_g + m.total_carbs,
      fat_g: acc.fat_g + m.total_fat,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  )
}

export function toIntake(meal: MealTotals): MacroTargets {
  return sumMeals([meal])
}
