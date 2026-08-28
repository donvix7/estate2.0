'use client'

import { useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

/**
 * Proactively refreshes the auth token on a fixed interval.
 * Failures are non-blocking — the session is never torn down by this hook.
 *
 * @param {Object}   opts
 * @param {number}   opts.intervalMs  - Refresh interval in ms (default 10 min)
 * @param {boolean}  opts.enabled     - Start/stop the timer (default true)
 */
export function useTokenRefresh({ intervalMs = 10 * 60 * 1000, enabled = true } = {}) {
  const timerRef = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      const data = await res.json().catch(() => ({ success: false }))

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Session refresh failed.')
        console.warn('[useTokenRefresh] Refresh failed (non-blocking):', data.message || res.status)
        return false
      }

      console.log('[useTokenRefresh] Token refreshed.')
      return true
    } catch (err) {
      toast.error('Network error while refreshing session.')
      console.warn('[useTokenRefresh] Network error (non-blocking):', err.message)
      return false
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Fire-and-forget refresh on mount — never blocks or redirects
    refresh()

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
