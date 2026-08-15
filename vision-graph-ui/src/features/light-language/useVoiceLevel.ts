import { useState, useEffect, useRef } from 'react'
import { getAnalyserLevel } from '../../shared/audio/analyser'
import { log } from '../../shared/logger'

const logger = log('useVoiceLevel')

const K = 0.08
const NOISE_GATE = 0.02
const ATTACK_MS = 60
const RELEASE_MS = 200

export function useVoiceLevel(analyser: AnalyserNode): number {
  const [level, setLevel] = useState(0)
  const smoothedLevelRef = useRef(0)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    let rafId: number
    lastTimeRef.current = performance.now()

    const tick = (now: number) => {
      const rawLevel = getAnalyserLevel(analyser)
      const deltaTime = now - lastTimeRef.current
      lastTimeRef.current = now

      if (rawLevel < NOISE_GATE) {
        smoothedLevelRef.current = 0
      } else {
        const targetLevel = rawLevel * K
        const rate = targetLevel > smoothedLevelRef.current ? ATTACK_MS : RELEASE_MS
        const alpha = deltaTime / rate
        smoothedLevelRef.current += (targetLevel - smoothedLevelRef.current) * Math.min(1, alpha)
      }

      setLevel(smoothedLevelRef.current)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [analyser])

  logger.debug('Voice level:', level)
  return level
}
