'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Stethoscope, ShieldAlert, Flame, TriangleAlert, ArrowLeft, Camera, MapPin, Send } from 'lucide-react'

// Convert the URL slug back to a readable title
const formatCaseTitle = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function EmergencyForm({ caseType }) {
  const router = useRouter()
  const title = formatCaseTitle(caseType)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    description: '',
  })

  // Map case type back to icons & colors for the header
  const getHeaderStyle = () => {
    switch (caseType) {
      case 'medical-emergency': 
        return { icon: Stethoscope, bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-500', border: 'border-red-100 dark:border-red-900/30' }
      case 'security-alert': 
        return { icon: ShieldAlert, bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-500', border: 'border-blue-100 dark:border-blue-900/30' }
      case 'fire': 
        return { icon: Flame, bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-500', border: 'border-orange-100 dark:border-orange-900/30' }
      default: 
        return { icon: TriangleAlert, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' }
    }
  }

  const header = getHeaderStyle()
  const Icon = header.icon

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false)
      // For now, redirect back to emergency hub
      router.push('/dashboard/resident/emergency')
    }, 1500)
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
      {/* Back Navigation */}
      <Link 
        href="/dashboard/resident/emergency" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Emergencies
      </Link>

      <div className="bg-gray-800 dark:bg-gray-800 rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
        {/* Dynamic Header */}
        <div className={`p-6 sm:p-8 flex items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${header.bg}`}>
            <Icon className={`w-7 h-7 ${header.text}`} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-heading">Report {title}</h1>
            <p className="text-sm text-blue-700 dark:text-gray-400 mt-1 font-medium">Please provide accurate details to dispatch help immediately.</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Location Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Exact Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                placeholder="E.g., Sector 4, outside Building B"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Describe the situation
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide any helpful context for the responders..."
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Media Attachments (Optional UI) */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Attach Photo / Video (Optional)
            </label>
            <button 
              type="button"
              className="w-full py-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <Camera className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <span className="text-sm font-medium">Click to upload media</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-4 rounded-xl font-bold text-lg transition-all shadow-sm shadow-red-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Dispatch Emergency Request
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium">
              Misuse of the emergency system may result in penalties.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
