'use client'

import { useState, useEffect, useRef } from 'react'
import { Scan, X, AlertCircle, Loader2 } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

// Html5Qrcode.stop() throws SYNCHRONOUSLY when the scanner isn't running
// (not a Promise rejection), so it must be guarded with try/catch.
const safeStop = (scanner) => {
  if (!scanner) return
  try {
    const res = scanner.stop()
    if (res && typeof res.catch === 'function') res.catch(() => {})
  } catch (e) {
    // Scanner is not currently running or paused — nothing to stop
  }
}

export default function QRScanner({ onScan, onClose, title = 'Scan QR Code', description = 'Position QR code within the frame to scan...' }) {
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState('')
  const scannerRef = useRef(null)
  const regionIdRef = useRef(`qr-scan-region-${Math.random().toString(36).slice(2, 8)}`)
  const regionId = regionIdRef.current

  useEffect(() => {
    let active = true
    let instance = null

    const startScanner = async () => {
      try {
        safeStop(instance)
        instance = new Html5Qrcode(regionId)
        scannerRef.current = instance

        await instance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!active) return
            setScanning(false)
            safeStop(instance)
            onScan(decodedText)
          },
          () => {}
        )
      } catch (err) {
        if (active) {
          setError('Unable to access camera. Please ensure camera permissions are granted.')
          console.error('Camera error:', err)
        }
      }
    }

    if (scanning) startScanner()

    return () => {
      active = false
      safeStop(instance)
      if (scannerRef.current && scannerRef.current !== instance) {
        safeStop(scannerRef.current)
      }
    }
  }, [scanning, onScan])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#1a1d23] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2d33]">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2d33]">
          <div className="flex items-center gap-2 text-white">
            <Scan className="size-5 text-[#1241a1]" />
            <span className="font-semibold">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2a2d33]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div id={regionId} className="relative aspect-square w-full bg-black" />

        <div className="p-4 border-t border-[#2a2d33]">
          {error ? (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="size-4" />
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#8a8f98]">
              <Loader2 className="size-4 animate-spin" />
              <p className="text-sm">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}