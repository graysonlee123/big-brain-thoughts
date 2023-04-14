import { useCallback, useState } from 'react'
import { getErrorMessage } from '@lib/errors'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const useFetchApiCallback = <T>(path: string, options?: RequestInit) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<APIResponse<T> | null>(null)

  const fetcher = useCallback(async () => {
    const url = `${apiUrl}${path}`

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, options)
      const json = (await response.json()) as APIResponse<T>

      if (!response.ok) throw new Error(json.msg ?? 'There was an error with that request.')

      setRes(json)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [path, options])

  return { error, loading, res, fetcher }
}

export default useFetchApiCallback
