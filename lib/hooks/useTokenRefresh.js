'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Proactively refreshes the auth token on a fixed interval.
 *
 * @param {Object}   opts
 * @param {number}   opts.intervalMs  - Refresh interval in ms (default 10 min)
 * @param {boolean}  opts.enabled     - Start/stop the timer (default true)
 */
export function useTokenRefresh({ intervalMs = 10 * 60 * 1000, enabled = true } = {}) {
  const router = useRouter()
  const timerRef = useRef(null)
  const mountedRef = useRef(false)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      const data = await res.json().catch(() => ({ success: false }))

      if (!res.ok || !data.success) {
        console.error('[useTokenRefresh] Refresh failed:', data.message || res.status)
        // Token is genuinely expired — force re-login
        if (res.status === 401) {
          router.push('/auth/login')
        }
        return false
      }

      console.log('[useTokenRefresh] Token refreshed.')
      return true
    } catch (err) {
      console.error('[useTokenRefresh] Network error:', err)
      return false
    }
  }, [router])

  useEffect(() => {
    if (!enabled) return

    // Refresh immediately on mount (skip the first one if not mounted yet to avoid double-fire in dev)
    if (!mountedRef.current) {
      mountedRef.current = true
      refresh()
    }

    // Set up recurring interval
    timerRef.current = setInterval(() => {
      refresh()
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, intervalMs, refresh])

  return { refresh }
}
