import { useState, useEffect } from 'react'

const LINE_NUMBERS_KEY = 'whitt-file-preview-line-numbers'

export function useLineNumbers() {
  const [showLineNumbers, setShowLineNumbers] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(LINE_NUMBERS_KEY)
    if (saved !== null) {
      setShowLineNumbers(JSON.parse(saved))
    }
  }, [])

  const toggleLineNumbers = () => {
    const newValue = !showLineNumbers
    setShowLineNumbers(newValue)
    localStorage.setItem(LINE_NUMBERS_KEY, JSON.stringify(newValue))
  }

  return {
    showLineNumbers,
    toggleLineNumbers,
  }
}