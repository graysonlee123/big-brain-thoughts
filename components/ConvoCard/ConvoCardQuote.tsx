import { Box, Stack, Typography } from '@mui/material'
import UserLink from '@components/UserLink'
import LinkedAvatar from '@components/LinkedAvatar'

type ConvoCardQuoteProps = {
  quote: ApiConvo['quotes'][number]
}

const ConvoCardQuote = ({ quote }: ConvoCardQuoteProps) => {
  return (
    <Stack direction="row" gap={2} alignItems="start" key={`${quote.content}`}>
      <Box>
        <LinkedAvatar
          href={`/user/${quote.speakerId}`}
          img={quote.speakerData.avatar}
          alt={quote.speakerData.username}
          discriminator={quote.speakerData.username}
        />
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
