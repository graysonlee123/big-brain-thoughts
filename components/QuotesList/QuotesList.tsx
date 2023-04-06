import useFetch from 'hooks/useFetch'

export default function QuotesList() {
  const { res, loading, error } = useFetch<ExpandedConversation[]>('/api/quotes')

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error...</p>

  return (
    <div>
      Quotes:
      <ul>
        {res!.data.map((conversation) => (
          <li key={conversation._id.toString()}>
            {conversation.quotes.map(({ content, speaker_data }, index) => (
              <p key={index}>
                <>
                  &quot;{content}&quot; — {speaker_data.name}
                </>
              </p>
            ))}
            <cite>Submitted by {conversation.submitter_data.name}</cite>
          </li>
        ))}
      </ul>
    </div>
  )
}
