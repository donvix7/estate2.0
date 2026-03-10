'use client'

import { useState, useEffect } from 'react'
import { AlertModal } from './ui/AlertModal'
import { toast } from 'react-toastify'

export function PanicButton() {
  const [isPanicking, setIsPanicking] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  const handlePanic = () => {
    if (!isPanicking) {
      setIsPanicking(true)
      setShowPin(true)
    }
  }

  const handleCancel = () => {
    setIsPanicking(false)
    setShowPin(false)
    setCountdown(5)
    setPin('')
  }

  const handlePinSubmit = () => {
    if (pin === '0000') { // Default emergency PIN
      // Send panic alert
      setAlertConfig({
        isOpen: true,
        title: 'Emergency Alert Sent!',
        message: 'Panic alert has been successfully broadcasted. Security and Admin have been notified of your location.',
        type: 'success'
      })
      setIsPanicking(false)
      setShowPin(false)
      setPin('')
      // Here you would make API call
    } else {
      toast.error('Incorrect Emergency PIN')
    }
  }

  useEffect(() => {
    let timer
    if (isPanicking && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && isPanicking) {
      // Auto-trigger without PIN after countdown
      timer = setTimeout(() => {
        setAlertConfig({
          isOpen: true,
          title: 'Emergency Alert Sent!',
          message: 'Panic alert has been auto-triggered. Security and Admin have been notified.',
          type: 'success'
        })
        setIsPanicking(false)
        setShowPin(false)
        setCountdown(5)
      }, 0)
    }
    return () => clearTimeout(timer)
  }, [isPanicking, countdown])

  return (
    <div className="flex flex-col items-center">
      {showPin ? (
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl animate-in zoom-in-95 duration-300">
          <h3 className="text-red-700 dark:text-red-400 font-black mb-4 tracking-tight text-lg">Emergency Panic System</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Enter Panic PIN (or wait {countdown}s)</label>
            <input
              autoFocus
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none text-center text-2xl font-black tracking-[0.5em] text-red-600 focus:ring-2 focus:ring-red-500/20 outline-none transition-all shadow-sm"
              placeholder="••••"
              maxLength="4"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePinSubmit}
              className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-600/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Emergency
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handlePanic}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all ${
            isPanicking 
              ? 'bg-red-700 animate-pulse shadow-lg' 
              : 'bg-red-600 hover:bg-red-700 hover:scale-105'
          }`}
        >
          {isPanicking ? countdown : 'PANIC'}
        </button>
      )}
      <p className="mt-4 text-sm text-slate-500 text-center max-w-[200px] leading-relaxed">
        Press in case of emergency. Alerts security and admin immediately.
      </p>

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  )
}