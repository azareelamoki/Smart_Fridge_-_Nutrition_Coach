import { useCallback, useState } from 'react'
import { readJson, writeJson } from '../utils/storage'

type Updater<T> = T | ((previous: T) => T)

/**
 * État React synchronisé avec localStorage. La clé peut changer (changement
 * d'utilisateur) : la valeur est alors relue depuis le stockage.
 * `fallback` doit être une référence stable.
 */
export function usePersistentState<T>(key: string | null, fallback: T) {
  const [state, setState] = useState(() => ({
    key,
    value: key ? readJson(key, fallback) : fallback,
  }))

  let value = state.value
  if (state.key !== key) {
    value = key ? readJson(key, fallback) : fallback
    setState({ key, value })
  }

  const update = useCallback(
    (updater: Updater<T>) => {
      setState((previous) => {
        const base =
          previous.key === key ? previous.value : key ? readJson(key, fallback) : fallback
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(base) : updater
        if (key) writeJson(key, next)
        return { key, value: next }
      })
    },
    [key, fallback],
  )

  return [value, update] as const
}
