import { useCallback, useEffect, useRef, useState } from 'react'

interface FetchState<T> {
  key: string | null
  nonce: number
  data: T | null
  error: string | null
}

/**
 * Charge une ressource asynchrone identifiée par `key` ; `null` désactive la
 * requête. Les requêtes obsolètes sont annulées via AbortSignal.
 */
export function useFetch<T>(key: string | null, fetcher: (signal: AbortSignal) => Promise<T>) {
  const fetcherRef = useRef(fetcher)
  const [nonce, setNonce] = useState(0)
  const [state, setState] = useState<FetchState<T>>({
    key: null,
    nonce: -1,
    data: null,
    error: null,
  })

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (key === null) return
    const controller = new AbortController()
    fetcherRef
      .current(controller.signal)
      .then((data) => setState({ key, nonce, data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Une erreur est survenue.'
        setState({ key, nonce, data: null, error: message })
      })
    return () => controller.abort()
  }, [key, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  const settled = state.key === key && state.nonce === nonce

  return {
    data: settled ? state.data : null,
    error: settled ? state.error : null,
    loading: key !== null && !settled,
    reload,
  }
}
