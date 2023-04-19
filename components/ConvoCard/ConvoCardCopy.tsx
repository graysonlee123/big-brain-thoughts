import { Typography } from '@mui/material'
import CopyButton from '@components/CopyButton'
import useConvoCardContext from './ConvoCardContext'

const ConvoCardCopy = () => {
  const { convo } = useConvoCardContext()

  return (
    <Typography className="copy-link" variant="caption" sx={{ visibility: 'hidden' }}>
      <CopyButton data={`${process.env.NEXT_PUBLIC_API_URL}/convos/${convo._id}`}>
        Copy Link
      </CopyButton>
    </Typography>
  )
}

export default ConvoCardCopy
