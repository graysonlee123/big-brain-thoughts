import Convo from '@components/Convo'
import { Box, Grid, Stack, Typography } from '@mui/material'
import useFetch from 'hooks/useFetch'
import useSortedConvos from 'hooks/useSortedConvos'
import { Fragment } from 'react'
import Masonry from '@mui/lab/Masonry'

interface ConvoListProps {
  convos: ExpandedConversation[]
}

export default function ConvoList({ convos }: ConvoListProps) {
  const sortedConvos = useSortedConvos(convos)

  return (
    <Stack gap={8}>
      {Array.from(sortedConvos).map(([year, convos]) => (
        <Box key={year}>
          <Stack gap={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3">{year}</Typography>
              <Typography variant="subtitle2">{convos.length} quotes</Typography>
            </Box>
            <Box>
              <Masonry
                columns={{ sm: 1, md: 2, lg: 3 }}
                spacing={2}
                defaultColumns={3}
                defaultSpacing={2}
                sx={{ m: 0 }}
              >
                {convos.map((convo) => (
                  <Fragment key={convo._id.toString()}>
                    <Convo convo={convo} />
                  </Fragment>
                ))}
              </Masonry>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
