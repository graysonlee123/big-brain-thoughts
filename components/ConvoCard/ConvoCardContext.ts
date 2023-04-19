import { createContext, useContext } from 'react'

type ConvoCardContextValue = { convo: ApiConvo } | null
export const ConvoCardContext = createContext<ConvoCardContextValue>(null)

function useConvoCardContext() {
  const context = useContext(ConvoCardContext)

  if (!context) {
    throw new Error('ConvoCard* components must be used inside the ConvoCard component.')
  }

  return context
}

export default useConvoCardContext
