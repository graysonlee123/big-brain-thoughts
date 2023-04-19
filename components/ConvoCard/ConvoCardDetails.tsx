import { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { displayDate } from '@lib/dateHelpers'
import useConvoCardContext from './ConvoCardContext'
import ConvoCardCopy from './ConvoCardCopy'
import UserLink from '@components/UserLink'

type ConvoCardDetailsProps = {
  action?: ReactNode
}

const ConvoCardDetails = ({ action }: ConvoCardDetailsProps) => {
  const { convo } = useConvoCardContext()

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Typography variant="caption">
          Submitted by{' '}
          <UserLink userId={convo.submitterId}>{convo.submitterData.username}</UserLink> &bull;{' '}
          {displayDate(convo.timestamp)}
        </Typography>
        {action}
      </Stack>
    </Box>
  )
}

ConvoCardDetails.Action = ConvoCardCopy

export default ConvoCardDetails
