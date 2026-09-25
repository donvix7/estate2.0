'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Camera, Loader2, QrCode, RefreshCw, ScanLine, ShieldCheck, X } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

const stopScanner = (scanner) => {
  if (!scanner) return
  try {
    const result = scanner.stop()
    if (result && typeof result.catch === 'function') result.catch(() => {})
  } catch {
    // The scanner may not have started yet or may already be stopped.
  }
}

export default function QRScanner({ onScan, onClose, title = 'Scan gate QR code', description = 'Place the QR code inside the frame.' }) {
  const [status, setStatus] = useState('starting')
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const scannerRef = useRef(null)
  const onScanRef = useRef(onScan)
  const regionIdRef = useRef(`qr-scan-region-${Math.random().toString(36).slice(2, 8)}`)
  const regionId = regionIdRef.current

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  useEffect(() => {
    let active = true
    let handled = false
    let instance

    const startScanner = async () => {
      setError('')
      setStatus('starting')

      try {
        instance = new Html5Qrcode(regionId, { verbose: false })
        scannerRef.current = instance
        const boxSize = Math.max(180, Math.min(250, window.innerWidth - 104))

        await instance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: boxSize, height: boxSize }, aspectRatio: 1 },
          (decodedText) => {
            if (!active || handled) return
            handled = true
            setStatus('scanned')
            stopScanner(instance)
            onScanRef.current(decodedText)
          },
          () => {}
        )

        if (active) setStatus('scanning')
        else stopScanner(instance)
      } catch (cameraError) {
        if (!active) return
        console.error('Camera error:', cameraError)
        const errorName = cameraError?.name
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setError('Camera access is blocked. Allow camera access in your browser settings, then try again.')
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          setError('No camera was found on this device.')
        } else if (typeof window !== 'undefined' && !window.isSecureContext) {
          setError('Camera access requires a secure connection. Open this page over HTTPS.')
        } else {
          setError('Could not start the camera. Check browser permissions and try again.')
        }
        setStatus('error')
      }
    }

    startScanner()

    return () => {
      active = false
      stopScanner(instance)
      if (scannerRef.current === instance) scannerRef.current = null
    }
  }, [regionId, retryCount])

  const retry = () => {
    setRetryCount((count) => count + 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-scanner-title"
        aria-describedby="qr-scanner-description"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#30343d] bg-[#15171c] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[#292d35] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1241a1]/15 text-blue-300">
              <QrCode className="size-5" />
            </span>
            <div className="min-w-0">
              <p id="qr-scanner-title" className="truncate text-sm font-semibold text-white">{title}</p>
              <p className="mt-0.5 text-xs text-[#8a8f98]">Security sign in</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close QR scanner" className="rounded-lg p-2 text-[#8a8f98] transition hover:bg-[#242730] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <X className="size-4" />
          </button>
        </header>

        <div className="p-4 sm:p-5">
          <p id="qr-scanner-description" className="mb-4 text-sm text-[#b5b7be]">{description}</p>

          <div className="relative overflow-hidden rounded-xl border border-[#343944] bg-black">
            <div id={regionId} className="aspect-square w-full [&>video]:h-full! [&>video]:w-full! [&>video]:object-cover [&>canvas]:hidden" />
            {status !== 'error' && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div className="relative size-[min(72vw,250px)] max-h-[70%] max-w-[70%] rounded-2xl border-2 border-blue-400/90 shadow-[0_0_0_999px_rgba(0,0,0,0.28)]">
                  <span className="absolute -left-0.5 -top-0.5 size-7 rounded-tl-xl border-l-[3px] border-t-[3px] border-white" />
                  <span className="absolute -right-0.5 -top-0.5 size-7 rounded-tr-xl border-r-[3px] border-t-[3px] border-white" />
                  <span className="absolute -bottom-0.5 -left-0.5 size-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-7 rounded-br-xl border-b-[3px] border-r-[3px] border-white" />
                  {status === 'scanning' && <span className="absolute left-2 right-2 top-1/2 h-px animate-pulse bg-blue-300/90 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />}
                </div>
              </div>
            )}

            {status === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 text-center">
                <Loader2 className="size-7 animate-spin text-blue-300" />
                <p className="text-sm font-medium text-white">Starting camera…</p>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0f13] px-6 text-center">
                <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-300"><Camera className="size-5" /></span>
                <p className="text-sm font-medium text-white">Camera unavailable</p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-[#a4a7af]">{error}</p>
                <button type="button" onClick={retry} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#343944] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#242730]">
                  <RefreshCw className="size-3.5" /> Try again
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#292d35] bg-[#0d0f13] p-3.5">
            {status === 'error' ? <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-300" /> : status === 'scanning' ? <ScanLine className="mt-0.5 size-4 shrink-0 text-blue-300" /> : <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />}
            <div>
              <p className="text-xs font-medium text-[#e4e5e8]">{status === 'error' ? 'Check camera access' : status === 'scanning' ? 'Ready to scan' : 'Camera access stays on this device'}</p>
              <p className="mt-1 text-xs leading-5 text-[#8a8f98]">{status === 'error' ? 'You can also close this window and retry after enabling camera access.' : 'Hold your device steady. The code will be read automatically.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
