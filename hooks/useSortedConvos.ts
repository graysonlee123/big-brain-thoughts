import { useMemo } from 'react'

/**
 * Organizes an array of conversations into a map with its keys as years.
 * @param convos The array of conversations.
 * @returns A map, with each key representing a year.
 */
export default function useSortedConvos(convos: ApiConvo[]) {
  const sortedConvos = useMemo(() => {
    return convos.reduce((map, item) => {
      const year = new Date(item.timestamp).getFullYear()

      if (!map.has(year)) {
        map.set(year, [])
      }

      map.get(year)!.push(item)

      return map
    }, new Map<number, ApiConvo[]>())
  }, [convos])

  return sortedConvos
}
