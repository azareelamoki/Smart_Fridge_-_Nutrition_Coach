export const fmt = (value: number | null | undefined, digits = 0) =>
  value === null || value === undefined || Number.isNaN(value)
    ? '—'
    : value.toLocaleString('fr-FR', { maximumFractionDigits: digits })

export const kcal = (value: number | null | undefined) => `${fmt(value)} kcal`
export const grams = (value: number | null | undefined) => `${fmt(value)}g`

export const capitalize = (text: string) => (text ? text[0].toUpperCase() + text.slice(1) : text)

export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json) as { exp?: number }
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

export const percent = (value: number, target: number) =>
  target > 0 ? Math.round((value / target) * 100) : 0
