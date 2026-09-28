export interface Ingredient {
  /** Nom affiché (en français si connu). */
  label: string
  /** Nom envoyé à TheMealDB (en anglais). */
  query: string
}

export interface ShoppingItem {
  id: string
  label: string
  done: boolean
}
