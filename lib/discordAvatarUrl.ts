const discordAvatarUrl = (userId: string, avatar: string) => {
  const fileType = avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${fileType}`
}

export default discordAvatarUrl
