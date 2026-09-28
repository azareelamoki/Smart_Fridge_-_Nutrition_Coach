import type { MealDbResponse, MealTotals } from '../types/Meal'
import type {
  MacroTargets,
  MealMatchResponse,
  MealPlanResponse,
  NutritionStatus,
  TokenResponse,
  UserProfile,
} from '../types/User'

const BASE_URL = '/api'
const TOKEN_KEY = 'sf.token'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string | null, remember = true) {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
}

let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

function readDetail(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('detail' in body)) return null
  const { detail } = body as { detail: unknown }
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => (d && typeof d === 'object' && 'msg' in d ? String(d.msg) : '')).join(', ')
  }
  return null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getStoredToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Le backend est-il démarré ?')
  }

  const text = await response.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized?.()
    const fallback =
      response.status >= 500 ? 'Le serveur a rencontré une erreur.' : `Erreur ${response.status}`
    throw new ApiError(response.status, readDetail(body) ?? fallback)
  }
  return body as T
}

function postJson<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const api = {
  login(username: string, password: string) {
    return request<TokenResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
  },

  register(username: string, password: string) {
    return postJson<{ message: string; id: number | string; username: string }>('/auth/register', {
      username,
      password,
    })
  },

  mealPlan(user: UserProfile, mealsPerDay: number) {
    return postJson<MealPlanResponse>('/nutrition/repartition', { user, meals_per_day: mealsPerDay })
  },

  nutritionStatus(user: UserProfile, consumed: MacroTargets[]) {
    return postJson<NutritionStatus>('/nutrition/suivi', { user, consumed })
  },

  matchByIngredient(ingredient: string, user: UserProfile, mealsPerDay: number, signal?: AbortSignal) {
    return request<MealMatchResponse>('/meals/match_by_ingred', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredient, user, meals_per_day: mealsPerDay }),
      signal,
    })
  },

  mealsByIngredient(name: string, signal?: AbortSignal) {
    return request<MealTotals[]>(`/meals/search_by_ingred?name=${encodeURIComponent(name)}`, { signal })
  },

  searchMeal(name: string, signal?: AbortSignal) {
    return request<MealDbResponse>(`/meals/search?name=${encodeURIComponent(name)}`, { signal })
  },
}
