import type { MealTotals } from './Meal'

export type Gender = 'Homme' | 'Femme'
export type ActivityLevel = 'sedentaire' | 'leger' | 'modere' | 'actif'
export type Goal = 'Perte' | 'Maintien' | 'Prise'

/** Profil attendu par le backend (schéma `User` de FastAPI). */
export interface UserProfile {
  weight_kg: number
  height_cm: number
  age: number
  gender: Gender
  activity_level: ActivityLevel
  goal: Goal
}

export interface MacroTargets {
  calories: number
  protein_g: number
  fat_g: number
  carbs_g: number
}

export interface MealPlanResponse {
  bmr: number
  tdee: number
  daily_targets: MacroTargets
  meals_per_day: number
  per_meal_targets: MacroTargets
}

/** Réponse de `/meals/match_by_ingred` : plats classés du plus au moins adapté. */
export interface MealMatchResponse extends MealPlanResponse {
  matched_meals: MealTotals[]
}

export interface NutritionStatus {
  bmr: number
  tdee: number
  targets: MacroTargets
  consumed: MacroTargets
  remaining: MacroTargets
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Session {
  token: string
  username: string
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentaire: 'Sédentaire',
  leger: 'Légèrement actif',
  modere: 'Modérément actif',
  actif: 'Très actif',
}

export const GOAL_LABELS: Record<Goal, string> = {
  Perte: 'Perdre du poids',
  Maintien: 'Maintenir mon poids',
  Prise: 'Prendre de la masse',
}
