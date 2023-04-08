import { useMemo } from 'react'

export default function useSortedConvos(quotes: ExpandedConversation[]) {
  const sorted = useMemo(() => {
    return quotes.reduce<{ [key: number]: ExpandedConversation[] }>((obj, item) => {
      const year = new Date(item.date_time).getFullYear()

      if (undefined === obj[year]) {
        obj[year] = []
      }

      obj[year].push(item)

      return obj
    }, {})
  }, [quotes])

  return sorted
}
