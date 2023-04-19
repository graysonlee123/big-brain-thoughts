import { Box, Typography } from '@mui/material'
import useConvoGroupContext from './ConvoGroupContext'

const ConvoGroupHeader = () => {
  const { year, convos } = useConvoGroupContext()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3">{year}</Typography>
      <Typography variant="subtitle2">{convos.length} quotes</Typography>
    </Box>
  )
}

export default ConvoGroupHeader
