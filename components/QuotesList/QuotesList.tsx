import useFetch from 'hooks/useFetch'

export default function QuotesList() {
  const { data: conversations, loading, error } = useFetch<Conversation[] | null>('/api/quotes')

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error...</p>

  return (
    <div>
      Quotes:
      <ul>
        {(conversations?.data ?? []).map((conversation) => (
          <li key={conversation._id.toString()}>
            {conversation.quotes.map(({ content, speaker }, index) => (
              <p key={index}>
                <>
                  &quot;{content}&quot; — {speaker}
                </>
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
