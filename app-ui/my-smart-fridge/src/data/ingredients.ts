import type { Ingredient } from '../types/Ingredient'
import { capitalize } from '../utils/format'

/** Correspondance français → nom d'ingrédient TheMealDB (anglais). */
const FR_TO_EN: Record<string, string> = {
  tomate: 'tomatoes',
  tomates: 'tomatoes',
  poulet: 'chicken',
  'blanc de poulet': 'chicken breast',
  oignon: 'onion',
  oignons: 'onion',
  fromage: 'cheese',
  pates: 'pasta',
  oeuf: 'eggs',
  oeufs: 'eggs',
  basilic: 'basil',
  boeuf: 'beef',
  'boeuf hache': 'minced beef',
  porc: 'pork',
  agneau: 'lamb',
  saumon: 'salmon',
  thon: 'tuna',
  crevettes: 'prawns',
  riz: 'rice',
  'pomme de terre': 'potatoes',
  'pommes de terre': 'potatoes',
  ail: 'garlic',
  carotte: 'carrots',
  carottes: 'carrots',
  champignon: 'mushrooms',
  champignons: 'mushrooms',
  lait: 'milk',
  beurre: 'butter',
  creme: 'double cream',
  'creme fraiche': 'creme fraiche',
  citron: 'lemon',
  epinards: 'spinach',
  courgette: 'courgettes',
  courgettes: 'courgettes',
  aubergine: 'aubergine',
  poivron: 'red pepper',
  avocat: 'avocado',
  lardons: 'bacon',
  jambon: 'ham',
  farine: 'flour',
  sucre: 'sugar',
  'haricots rouges': 'kidney beans',
  lentilles: 'lentils',
  'petits pois': 'peas',
  'pois chiches': 'chickpeas',
  gingembre: 'ginger',
  coriandre: 'coriander',
  persil: 'parsley',
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')

export function toIngredient(text: string): Ingredient {
  const key = normalize(text)
  return { label: capitalize(text.trim()), query: FR_TO_EN[key] ?? key }
}

export const DEFAULT_FRIDGE: Ingredient[] = [
  'Tomates',
  'Poulet',
  'Oignons',
  'Fromage',
  'Pâtes',
  'Oeufs',
  'Basilic',
].map(toIngredient)

/** Ingrédients servant de base aux suggestions du jour. */
export const DAILY_INGREDIENTS: Ingredient[] = [
  'Poulet',
  'Saumon',
  'Boeuf',
  'Riz',
  'Agneau',
  'Porc',
  'Ail',
  'Champignons',
].map(toIngredient)
