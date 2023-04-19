import { Stack } from '@mui/material'
import useConvoCardContext from './ConvoCardContext'
import ConvoCardQuote from './ConvoCardQuote'

const ConvoCardQuotes = () => {
  const { convo } = useConvoCardContext()

  return (
    <Stack direction="column" gap={3}>
      {convo.quotes.map((quote, index) => (
        <ConvoCardQuote key={quote.speakerId + '-' + index} quote={quote} />
      ))}
    </Stack>
  )
}

export default ConvoCardQuotes
