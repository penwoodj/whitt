import { useState, useEffect, useCallback } from 'react'
import type { FakeAnalyserNode } from '../fake/FakeAnalyser'

const useVoiceLevel = (analyser: FakeAnalyserNode): number => {
  const [level, setLevel] = useState<number>(0)

  const updateLevel = useCallback(() => {
    setLevel(analyser.getLevel())
  }, [analyser])

  useEffect(() => {
    updateLevel()
    const interval = setInterval(updateLevel, 50)

    return () => {
      clearInterval(interval)
      setLevel(0)
    }
  }, [updateLevel])

  return level
}

export { useVoiceLevel }
