import { Avatar, Box, Paper, Stack, Typography } from '@mui/material'
import UserLink from '@components/UserLink'
import { displayDate } from '@lib/dateHelpers'

interface ConvoProps {
  convo: ExpandedConversation
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
                  src={quote.speaker_data.image ?? 'https://cdn.discordapp.com/embed/avatars/1.png'}
                  alt={quote.speaker_data.name}
                />
              </Box>
              <Box>
                <Typography variant="h5">&quot;{quote.content}&quot;</Typography>
                <Typography>
                  — <UserLink user={quote.speaker_data} />
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ mt: 4 }}>
          <Typography variant="caption">
            Submitted by <UserLink user={convo.submitter_data} /> &bull;{' '}
            {displayDate(convo.date_time)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
