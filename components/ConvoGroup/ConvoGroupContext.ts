import { createContext, useContext } from 'react'

type ConvoGroupContextValue = { year: number; convos: ApiConvo[] } | null
export const ConvoGroupContext = createContext<ConvoGroupContextValue>(null)

const useConvoGroupContext = () => {
  const context = useContext(ConvoGroupContext)

  if (!context) {
    throw new Error('ConvoGroup* components must be used inside the ConvoGroup component.')
  }

  return context
}

export default useConvoGroupContext
