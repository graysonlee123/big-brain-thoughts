import Convo from '@components/Convo'
import { Box, Typography } from '@mui/material'
import useFetch from 'hooks/useFetch'
import useSortedConvos from 'hooks/useSortedConvos'
import { Fragment } from 'react'

export default function ConvoList() {
  const { res, loading, error } = useFetch<ExpandedConversation[]>('/api/quotes')

  const sortedConvos = useSortedConvos(res?.data ?? [])

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error...</p>

  console.log({ sortedConvos })

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
