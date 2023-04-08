import { useMemo } from 'react'

export default function useSortedConvos(quotes: ExpandedConversation[]) {
  const sorted = useMemo(() => {
    return quotes.reduce((map, item) => {
      const year = new Date(item.date_time).getFullYear()

      if (!map.has(year)) {
        map.set(year, [])
      }

      map.get(year)!.push(item)

      return map
    }, new Map<number, ExpandedConversation[]>())
  }, [quotes])

  return sorted
}
