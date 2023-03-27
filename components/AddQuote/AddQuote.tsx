import { ChangeEvent, MouseEvent, useState } from 'react'

export default function AddQuote() {
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown | null>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuote(e.target.value)
  }

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    try {
      setLoading(true)
      setError(null)

      const payload = { title: quote }

      const res = await fetch('/api/quotes', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('There was an error posting that quote.')
      }

      const json = await res.json()
      console.log({ json })

      setQuote('')
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <hr />
      <input type="text" value={quote} onChange={handleChange} />
      <button onClick={handleSubmit} disabled={loading}>
        Add
      </button>
      {error ? <p>There was an error submitting that quote.</p> : null}
      <hr />
    </div>
  )
}
