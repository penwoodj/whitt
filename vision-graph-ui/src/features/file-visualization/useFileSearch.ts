import { useState } from 'react'

export function useFileSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [matches, setMatches] = useState<number[]>([])

  const search = (query: string, content: string) => {
    setSearchQuery(query)

    if (!query) {
      setMatches([])
      return
    }

    const regex = new RegExp(query, 'gi')
    const found: number[] = []
    let match: RegExpExecArray | null = null

    do {
      match = regex.exec(content)
      if (match) {
        found.push(match.index)
      }
    } while (match)

    setMatches(found)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setMatches([])
  }

  return {
    searchQuery,
    matches,
    search,
    clearSearch,
  }
}