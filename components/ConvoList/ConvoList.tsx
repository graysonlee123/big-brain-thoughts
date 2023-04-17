import { Fragment } from 'react'
import { User } from 'next-auth'
import { Alert, AlertTitle, Box, Container, Stack, Typography } from '@mui/material'
import Masonry from '@mui/lab/Masonry'
import useSortedConvos from '@hooks/useSortedConvos'
import Convo from '@components/Convo'
import UserHeader from '@components/UserHeader'

interface ConvoListProps {
  convos: Conversation[]
  user?: User
}

export default function ConvoList({ convos, user }: ConvoListProps) {
  const sortedConvos = useSortedConvos(convos)
  const asArray = Array.from(sortedConvos)

  return (
    <>
      {user && <UserHeader user={user} />}
      {asArray.length === 0 ? (
        <Container maxWidth="sm">
          <Alert severity="info" variant="filled">
            <AlertTitle>Nothing found</AlertTitle>
            Sorry, no quotes were found.
          </Alert>
        </Container>
      ) : (
        <Stack gap={8}>
          {asArray.map(([year, convos]) => (
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
                      <Fragment key={convo._id}>
                        <Convo convo={convo} />
                      </Fragment>
                    ))}
                  </Masonry>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </>
  )
}
