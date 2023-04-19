import NextLink from 'next/link'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import UserAvatar from '@components/UserAvatar'
import UserLink from '@components/UserLink'

type ConvoCardQuoteProps = {
  quote: ApiConvo['quotes'][number]
}

const ConvoCardQuote = ({ quote }: ConvoCardQuoteProps) => {
  return (
    <Stack direction="row" gap={2} alignItems="start" key={`${quote.content}`}>
      <Box>
        <IconButton href={`/user/${quote.speakerId}`} LinkComponent={NextLink}>
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
  )
}

export default ConvoCardQuote
