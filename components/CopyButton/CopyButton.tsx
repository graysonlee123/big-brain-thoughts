import { ReactNode } from 'react'
import { Link } from '@mui/material'
import useCopyToClipboard from '@hooks/useCopyToClipboard'

interface CopyButtonProps {
  data: string
  children: ReactNode
}

const CopyButton = ({ data, children }: CopyButtonProps) => {
  const { status, copyToClipboard } = useCopyToClipboard(data)

  return (
    <Link component="button" onClick={() => copyToClipboard()}>
      {status === 'copied' ? 'Copied!' : status === 'error' ? 'Error copying' : children}
    </Link>
  )
}

export default CopyButton
