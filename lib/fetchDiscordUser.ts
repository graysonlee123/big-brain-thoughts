import { DiscordProfile } from 'next-auth/providers/discord'

const fetchDiscordUser = async (access_token?: string) => {
  const base = 'https://discord.com/api/v10'
  const path = '/users/@me'
  const url = base + path
  const headers = { Authorization: `Bearer ${access_token}` }
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error('Error making the fetch requet to Discord API.')
  const json: DiscordProfile = await res.json()
  return json
}

export default fetchDiscordUser
