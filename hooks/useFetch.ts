import { useEffect, useState } from 'react'

function useFetch<T>(url: URL | RequestInfo, options?: RequestInit) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let abortController: AbortController

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setData(null)

        abortController = new AbortController()

        const res = await fetch(url, { ...options, signal: abortController.signal })

        if (!res.ok) {
          throw new Error('There was an error with that request.')
        }

        const json = await res.json()

        setData(json)
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error(e)
          setError(e)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [url, options])

  return { data, loading, error }
}

export default useFetch
