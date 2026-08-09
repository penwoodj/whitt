import { useState, useCallback, useRef, useEffect } from 'react'
import type { LoremConfig, LoremStreamState } from './graphSimTypes'
import { createStreamChunk, getDefaultConfig } from './graphSimTransforms'

export const useLoremStream = (config?: LoremConfig): LoremStreamState => {
  const mergedConfig = { ...getDefaultConfig(), ...config }
  const { source, charsPerTick, msPerTick } = mergedConfig

  const [txt, setTxt] = useState('')
  const [isStream, setIsStream] = useState(false)

  const offsetRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startStream = useCallback(() => {
    if (isStream) return

    setIsStream(true)
    offsetRef.current = 0
    setTxt('')

    intervalRef.current = setInterval(() => {
      const chunk = createStreamChunk(source, offsetRef.current, charsPerTick)

      if (chunk.length === 0) {
        setIsStream(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      setTxt((prev) => prev + chunk)
      offsetRef.current += charsPerTick
    }, msPerTick)
  }, [isStream, source, charsPerTick, msPerTick])

  const stopStream = useCallback(() => {
    setIsStream(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetStream = useCallback(() => {
    stopStream()
    offsetRef.current = 0
    setTxt('')
  }, [stopStream])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    txt,
    isStream,
    startStream,
    stopStream,
    resetStream,
  }
}
