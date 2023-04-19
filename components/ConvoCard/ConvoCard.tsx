import { ReactNode } from 'react'
import { Paper } from '@mui/material'
import { ConvoCardContext } from './ConvoCardContext'
import ConvoCardDetails from './ConvoCardDetails'
import ConvoCardQuotes from './ConvoCardQuotes'

interface ConvoCardProps {
  convo: ApiConvo
  quotes?: ReactNode
  details?: ReactNode
}

const ConvoCard = ({ convo, quotes, details }: ConvoCardProps) => {
  return (
    <ConvoCardContext.Provider value={{ convo }}>
      <Paper sx={{ p: 4, '&:hover .copy-link': { visibility: 'visible' } }}>
        {quotes}
        {details}
      </Paper>
    </ConvoCardContext.Provider>
  )
}

ConvoCard.Quotes = ConvoCardQuotes
ConvoCard.Details = ConvoCardDetails

export default ConvoCard
