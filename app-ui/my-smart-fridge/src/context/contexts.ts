import { createContext } from 'react'
import type { Ingredient, ShoppingItem } from '../types/Ingredient'
import type { MealTotals, SavedMeal } from '../types/Meal'
import type { MealPlanResponse, Session, UserProfile } from '../types/User'

export interface AuthContextValue {
  session: Session | null
  login: (username: string, password: string, remember: boolean) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export interface StoredProfile {
  profile: UserProfile
  mealsPerDay: number
  plan: MealPlanResponse | null
}

export interface UserDataContextValue {
  stored: StoredProfile | null
  saveProfile: (profile: StoredProfile) => void

  fridge: Ingredient[]
  addToFridge: (item: Ingredient) => void
  removeFromFridge: (label: string) => void

  menu: SavedMeal[]
  addToMenu: (meal: MealTotals, thumb?: string | null) => void
  removeFromMenu: (id: string) => void
  isInMenu: (mealName: string) => boolean
  markEaten: (id: string) => void

  history: SavedMeal[]
  clearHistory: () => void

  shopping: ShoppingItem[]
  addToShopping: (labels: string[]) => void
  toggleShopping: (id: string) => void
  removeShopping: (id: string) => void
  clearShoppingDone: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
export const UserDataContext = createContext<UserDataContextValue | null>(null)
