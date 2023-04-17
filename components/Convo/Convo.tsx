import { Box, IconButton, Link, Paper, Stack, Typography } from '@mui/material'
import { displayDate } from '@lib/dateHelpers'
import UserLink from '@components/UserLink'
import UserAvatar from '@components/UserAvatar'
import CopyButton from '@components/CopyButton'

interface ConvoProps {
  convo: Conversation
}

export function Convo({ convo }: ConvoProps) {
  return (
    <Box>
      <Paper sx={{ p: 4, '&:hover .copy-link': { visibility: 'visible' } }}>
        <Stack direction="column" gap={3}>
          {convo.quotes.map((quote, index) => (
            <Stack direction="row" gap={2} alignItems="start" key={`${quote.content}-${index}`}>
              <Box>
                <IconButton href={`/user/${quote.speakerId}`}>
                  <UserAvatar user={quote.speakerData} />
                </IconButton>
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
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Typography variant="caption">
              Submitted by{' '}
              <UserLink userId={convo.submitterId}>{convo.submitterData.username}</UserLink> &bull;{' '}
              {displayDate(convo.timestamp)}
            </Typography>
            <Typography className="copy-link" variant="caption" sx={{ visibility: 'hidden' }}>
              <CopyButton data={`${process.env.NEXT_PUBLIC_API_URL}/convos/${convo._id}`}>
                Copy Link
              </CopyButton>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
