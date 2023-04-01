import { useEffect, useState } from 'react'

function useFetch<T>(url: URL | RequestInfo, options?: RequestInit) {
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [res, setRes] = useState<APIResponse<T> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        const json = await response.json()

        setRes(json)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { error, loading, res }
}

export default useFetch
