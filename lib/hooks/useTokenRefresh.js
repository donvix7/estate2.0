'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkTokenStatus, logout, refreshToken } from '@/lib/action'

/** Watch the access-token expiry and offer a refresh when it expires. */
export function useTokenRefresh({ intervalMs = 15 * 1000, enabled = true } = {}) {
  const timerRef = useRef(null)
  const inFlightRef = useRef(false)
  const autoAttemptedRef = useRef(false)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [hasRefreshToken, setHasRefreshToken] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const router = useRouter()

  const checkStatus = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    try {
      const status = await checkTokenStatus()
      setHasRefreshToken(status.hasRefreshToken)
      setNeedsRefresh(Boolean(status.isAuthenticated && status.isExpired))
      if (!status.isExpired) {
        autoAttemptedRef.current = false
        setRefreshError('')
      }
    } catch (error) {
      console.warn('[useTokenRefresh] Could not check token status:', error)
    } finally {
      inFlightRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return false
    inFlightRef.current = true
    setRefreshing(true)
    setRefreshError('')
    try {
      const result = await refreshToken()
      if (!result?.success) {
        setRefreshError(result?.message || 'Token refresh failed. Please sign in again.')
        setNeedsRefresh(true)
        return false
      }

      setHasRefreshToken(true)
      setNeedsRefresh(false)
      return true
    } catch (error) {
      setRefreshError(error.message || 'Token refresh failed. Please try again.')
      setNeedsRefresh(true)
      return false
    } finally {
      inFlightRef.current = false
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    void checkStatus()
    timerRef.current = setInterval(() => void checkStatus(), intervalMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, intervalMs, checkStatus])

  // Refresh silently once when the access token expires. Keep the prompt
  // available for manual retry if the refresh token is rejected or the network fails.
  useEffect(() => {
    if (!enabled || !needsRefresh || !hasRefreshToken || autoAttemptedRef.current) return
    autoAttemptedRef.current = true
    void refresh()
  }, [enabled, needsRefresh, hasRefreshToken, refresh])

  const signInAgain = useCallback(async () => {
    try {
      await logout()
    } finally {
      router.replace('/auth/login')
      router.refresh()
    }
  }, [router])

  const prompt = needsRefresh ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="alertdialog" aria-modal="true" aria-labelledby="session-refresh-title">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1d23] p-6 text-white shadow-2xl">
        <h2 id="session-refresh-title" className="text-xl font-bold">Your session has expired</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          {refreshError || 'Refresh your session to continue using the dashboard.'}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={signInAgain} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/5">Sign in again</button>
          {hasRefreshToken && (
            <button type="button" onClick={() => void refresh()} disabled={refreshing} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60">
              {refreshing ? 'Refreshing…' : 'Refresh session'}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null

  return { refresh, prompt }
}
