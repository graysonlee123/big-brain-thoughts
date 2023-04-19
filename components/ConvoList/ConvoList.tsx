import useSortedConvos from '@hooks/useSortedConvos'
import UserHeader from '@components/UserHeader'
import ConvoListEmpty from './ConvoListEmpty'
import { Stack } from '@mui/material'
import { ConvoGroupContext } from '../ConvoGroup/ConvoGroupContext'
import ConvoGroup from '../ConvoGroup'

interface ConvoListProps {
  convos: ApiConvo[]
  user?: ApiUser
}

export default function ConvoList({ convos, user }: ConvoListProps) {
  const sortedConvos = useSortedConvos(convos)
  const asArray = Array.from(sortedConvos)

  return (
    <>
      {user && <UserHeader user={user} />}
      {asArray.length === 0 ? (
        <ConvoListEmpty />
      ) : (
        <Stack gap={8}>
          {asArray.map(([year, convos]) => (
            <ConvoGroupContext.Provider value={{ year, convos }} key={year}>
              <ConvoGroup header={<ConvoGroup.Header />} />
            </ConvoGroupContext.Provider>
          ))}
        </Stack>
      )}
    </>
  )
}
