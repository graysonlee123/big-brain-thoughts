import UserLink from '@components/UserLink'
import { displayDate } from '@lib/dateHelpers'
import { Box, Paper, Stack, Typography } from '@mui/material'

interface ConvoProps {
  convo: ExpandedConversation
}

export function Convo({ convo }: ConvoProps) {
  return (
    <Box>
      <Paper sx={{ p: 4 }}>
        <Stack direction="column" gap={2}>
          {convo.quotes.map((quote) => (
            <Box key={quote.content}>
              <Typography variant="h4">&quot;{quote.content}&quot;</Typography>
              <Typography>
                — <UserLink user={quote.speaker_data} />
              </Typography>
            </Box>
          ))}
        </Stack>
        <Typography variant="caption">
          Submitted by <UserLink user={convo.submitter_data} /> on {displayDate(convo.date_time)}
        </Typography>
      </Paper>
    </Box>
  )
}
