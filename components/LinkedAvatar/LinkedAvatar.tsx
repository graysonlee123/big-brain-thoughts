import { Avatar, IconButton } from '@mui/material'
import { useMemo } from 'react'

type LinkedAvatarProps = {
  href: string
  alt: string
  img?: string | null
  discriminator?: string
}

const LinkedAvatar = ({ href, img, alt, discriminator }: LinkedAvatarProps) => {
  const src = useMemo(() => {
    if (img) return img

    const modulo = (discriminator ?? alt).length % 5 || 5
    return `/images/avatars/placeholder-${modulo}.png`
  }, [img, discriminator, alt])

  return (
    <IconButton href={href}>
      <Avatar src={src} alt={alt} />
    </IconButton>
  )
}

export default LinkedAvatar
