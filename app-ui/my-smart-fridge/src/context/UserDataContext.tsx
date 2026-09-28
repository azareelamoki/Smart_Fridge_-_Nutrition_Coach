import { useCallback, useMemo, type ReactNode } from 'react'
import { DEFAULT_FRIDGE } from '../data/ingredients'
import { useAuth } from '../hooks/useAuth'
import { usePersistentState } from '../hooks/usePersistentState'
import type { Ingredient, ShoppingItem } from '../types/Ingredient'
import type { MealTotals, SavedMeal } from '../types/Meal'
import { uid } from '../utils/storage'
import { UserDataContext, type StoredProfile, type UserDataContextValue } from './contexts'

const NO_MEALS: SavedMeal[] = []
const NO_SHOPPING: ShoppingItem[] = []

/** Données propres à chaque utilisateur, conservées dans le navigateur. */
export function UserDataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const scope = session ? `sf.u.${session.username}` : null
  const key = (name: string) => (scope ? `${scope}.${name}` : null)

  const [stored, setStored] = usePersistentState<StoredProfile | null>(key('profile'), null)
  const [fridge, setFridge] = usePersistentState<Ingredient[]>(key('fridge'), DEFAULT_FRIDGE)
  const [menu, setMenu] = usePersistentState<SavedMeal[]>(key('menu'), NO_MEALS)
  const [history, setHistory] = usePersistentState<SavedMeal[]>(key('history'), NO_MEALS)
  const [shopping, setShopping] = usePersistentState<ShoppingItem[]>(key('shopping'), NO_SHOPPING)

  const addToFridge = useCallback(
    (item: Ingredient) =>
      setFridge((list) =>
        list.some((i) => i.label.toLowerCase() === item.label.toLowerCase()) ? list : [...list, item],
      ),
    [setFridge],
  )

  const addToMenu = useCallback(
    (meal: MealTotals, thumb?: string | null) =>
      setMenu((list) =>
        list.some((m) => m.meal_name === meal.meal_name)
          ? list
          : [...list, { ...meal, id: uid(), thumb, addedAt: new Date().toISOString() }],
      ),
    [setMenu],
  )

  const markEaten = useCallback(
    (id: string) => {
      const meal = menu.find((m) => m.id === id)
      if (!meal) return
      setMenu((list) => list.filter((m) => m.id !== id))
      setHistory((list) => [{ ...meal, eatenAt: new Date().toISOString() }, ...list])
    },
    [menu, setMenu, setHistory],
  )

  const addToShopping = useCallback(
    (labels: string[]) =>
      setShopping((list) => {
        const known = new Set(list.map((i) => i.label.toLowerCase()))
        const fresh: ShoppingItem[] = []
        for (const raw of labels) {
          const label = raw.trim()
          if (!label || known.has(label.toLowerCase())) continue
          known.add(label.toLowerCase())
          fresh.push({ id: uid(), label, done: false })
        }
        return [...list, ...fresh]
      }),
    [setShopping],
  )

  const value = useMemo<UserDataContextValue>(
    () => ({
      stored,
      saveProfile: setStored,
      fridge,
      addToFridge,
      removeFromFridge: (label) => setFridge((list) => list.filter((i) => i.label !== label)),
      menu,
      addToMenu,
      removeFromMenu: (id) => setMenu((list) => list.filter((m) => m.id !== id)),
      isInMenu: (name) => menu.some((m) => m.meal_name === name),
      markEaten,
      history,
      clearHistory: () => setHistory([]),
      shopping,
      addToShopping,
      toggleShopping: (id) =>
        setShopping((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i))),
      removeShopping: (id) => setShopping((list) => list.filter((i) => i.id !== id)),
      clearShoppingDone: () => setShopping((list) => list.filter((i) => !i.done)),
    }),
    [
      stored, setStored, fridge, setFridge, addToFridge, menu, setMenu, addToMenu, markEaten,
      history, setHistory, shopping, setShopping, addToShopping,
    ],
  )

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}
