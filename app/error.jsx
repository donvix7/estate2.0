'use client'

import { useEffect } from 'react'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return <ErrorFallback error={error} reset={reset} />
}
