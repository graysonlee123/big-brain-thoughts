import { Avatar, Box, Link, Paper, Stack, Typography } from '@mui/material'
import UserLink from '@components/UserLink'
import { displayDate } from '@lib/dateHelpers'

interface ConvoProps {
  convo: Conversation
}

export function Convo({ convo }: ConvoProps) {
  return (
    <Box>
      <Paper sx={{ p: 4 }}>
        <Stack direction="column" gap={3}>
          {convo.quotes.map((quote) => (
            <Stack direction="row" gap={2} alignItems="start" key={quote.content}>
              <Box>
                <Avatar
                  src={quote.speakerData.image ?? 'https://cdn.discordapp.com/embed/avatars/1.png'}
                  alt={quote.speakerData.username}
                />
              </Box>
              <Box>
                <Typography variant="h5">&quot;{quote.content}&quot;</Typography>
                <Typography>
                  — <UserLink userId={quote.speakerId}>{quote.speakerData.username}</UserLink>
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ mt: 4 }}>
          <Typography variant="caption">
            Submitted by{' '}
            <UserLink userId={convo.submitterId}>{convo.submitterData.username}</UserLink> &bull;{' '}
            {displayDate(convo.timestamp)} <Link href={`/convos/${convo._id}`}>Open</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
