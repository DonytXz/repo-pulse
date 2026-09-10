import { useState, useEffect } from 'react'
import { getCurrentRateLimit, subscribeRateLimit } from '../api/client'
import type { RateLimitStatus } from '../api/types'

export function useRateLimit(): RateLimitStatus {
  const [status, setStatus] = useState<RateLimitStatus>(getCurrentRateLimit)

  useEffect(() => {
    return subscribeRateLimit((newStatus) => {
      setStatus(newStatus)
    })
  }, [])

  return status
}
