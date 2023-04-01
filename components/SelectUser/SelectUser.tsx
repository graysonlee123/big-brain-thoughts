import { User } from 'next-auth'
import useFetch from 'hooks/useFetch'

export function SelectUser() {
  const { error, loading, res } = useFetch<User[]>('/api/users')

  if (loading) return <p>Loading users...</p>

  if (error) return <p>There was an error getting the users.</p>

  return (
    <div>
      <p>Select a User</p>
      <select>
        {res!.data.map((user, index) => (
          <option key={index}>{user.name}</option>
        ))}
      </select>
    </div>
  )
}
