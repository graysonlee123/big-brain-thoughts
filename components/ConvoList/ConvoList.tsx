import Convo from '@components/Convo'
import { Box, Typography } from '@mui/material'
import useFetch from 'hooks/useFetch'
import useSortedConvos from 'hooks/useSortedConvos'
import { Fragment } from 'react'

interface ConvoListProps {
  convos: ExpandedConversation[]
}

export default function ConvoList({ convos }: ConvoListProps) {
  const sortedConvos = useSortedConvos(convos)

  return (
    <Box>
      {Array.from(sortedConvos).map(([year, convos]) => (
        <Fragment key={year}>
          <Typography>{year}</Typography>
          <ul>
            {convos.map((convo) => (
              <li key={convo._id.toString()}>
                <Convo convo={convo} />
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </Box>
  )
}
