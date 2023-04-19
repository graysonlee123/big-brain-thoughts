import { ReactNode } from 'react'
import { Masonry } from '@mui/lab'

type ConvoGroupMasonryProps = {
  children: NonNullable<ReactNode>
}

const ConvoGroupMasonry = ({ children }: ConvoGroupMasonryProps) => {
  return (
    <Masonry
      columns={{ sm: 1, md: 2, lg: 3 }}
      spacing={2}
      defaultColumns={3}
      defaultSpacing={2}
      sx={{ m: 0 }}
    >
      {children}
    </Masonry>
  )
}

export default ConvoGroupMasonry
