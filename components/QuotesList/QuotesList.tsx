import useFetch from 'hooks/useFetch'

interface Quote {
  _id: string
  title: string
}

export default function QuotesList() {
  const { data, loading, error } = useFetch<Quote[] | null>('/api/quotes')

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error...</p>

  return (
    <div>
      Quotes:
      <ul>
        {(data?.data ?? []).map((quote) => (
          <li key={quote._id}>{quote.title}</li>
        ))}
      </ul>
    </div>
  )
}
