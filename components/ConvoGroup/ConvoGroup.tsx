import { ReactNode } from 'react'
import { Stack } from '@mui/material'
import ConvoGroupHeader from './ConvoGroupHeader'
import useConvoGroupContext from './ConvoGroupContext'
import ConvoGroupMasonry from './ConvoGroupMasonry'
import ConvoCard from '@components/ConvoCard'

type ConvoGroupProps = {
  header?: ReactNode
}

const ConvoGroup = ({ header }: ConvoGroupProps) => {
  const { convos } = useConvoGroupContext()

  return (
    <Stack gap={2}>
      {header}
      <ConvoGroupMasonry>
        {convos.map((convo) => (
          <ConvoCard
            convo={convo}
            quotes={<ConvoCard.Quotes />}
            details={<ConvoCard.Details action={<ConvoCard.Details.Action />} />}
            key={convo._id}
          />
        ))}
      </ConvoGroupMasonry>
    </Stack>
  )
}

ConvoGroup.Header = ConvoGroupHeader

export default ConvoGroup
