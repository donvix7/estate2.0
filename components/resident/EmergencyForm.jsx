'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Stethoscope, 
  ShieldAlert, 
  Flame, 
  TriangleAlert, 
  Camera, 
  MapPin, 
  Send, 
  X, 
  Search, 
  Phone, 
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { api } from '@/services/api'

// Convert the URL slug back to a readable title
const formatCaseTitle = (slug) => {
  if (!slug) return 'Emergency'
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

  const [contacts, setContacts] = useState([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const data = await api.getEmergencyContacts()
      setContacts(data)
    } catch (err) {
      console.error('Failed to load contacts', err)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  // Map case type back to icons & colors for the header
  const getHeaderStyle = () => {
    switch (caseType) {
      case 'medical-emergency': 
        return { icon: Stethoscope, bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-500', theme: 'red' }
      case 'security-alert': 
        return { icon: ShieldAlert, bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-500', theme: 'blue' }
      case 'fire': 
        return { icon: Flame, bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-500', theme: 'orange' }
      default: 
        return { icon: TriangleAlert, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', theme: 'gray' }
    }
  }

  const header = getHeaderStyle()
  const Icon = header.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API dispatch
      await api.saveEmergencyAlert({
        type: title,
        description: formData.description,
        unit: formData.location || 'Unknown Location',
        residentName: 'Current User', // In real app, get from auth
      })
      router.push('/dashboard/resident/emergency')
    } catch (error) {
      console.error('Failed to dispatch emergency:', error)
      alert('Failed to send emergency request. Please try again or call emergency contacts directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type?.toLowerCase() === caseType?.split('-')[0].toLowerCase()
  ).sort((a, b) => {
      const caseMainType = caseType?.split('-')[0].toLowerCase()
      if (a.type?.toLowerCase() === caseMainType) return -1
      if (b.type?.toLowerCase() === caseMainType) return 1
      return 0
  })

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between bg-white dark:bg-gray-900 relative z-20">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${header.bg} ${header.text}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report {title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Alerting estate security & rescue teams</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors absolute top-6 right-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
            
            {/* Form Section */}
            <form id="emergency-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Location Field */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)]">
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                        Exact Location
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            placeholder="E.g., Sector 4, outside Building B"
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    </div>
                </div>

                {/* Description Field */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)]">
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                        Situation Brief
                    </label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Provide helpful context for the responders..."
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none font-medium"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                {/* Media (UI Only) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)]">
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                        Attach Evidence (Optional)
                    </label>
                    <button 
                        type="button"
                        className="w-full py-6 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border-none group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                            <Camera className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                        </div>
                        <span className="text-sm font-bold">Upload Photo / Video</span>
                    </button>
                </div>
            </form>

            {/* Emergency Contacts Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Direct Dispatch Contacts</h3>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search emergency services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] font-medium"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                </div>

                {isLoadingContacts ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(contact => {
                                const caseMainType = caseType?.split('-')[0].toLowerCase()
                                const isRecommended = contact.type?.toLowerCase() === caseMainType;
                                return (
                                <div key={contact.id} className={`flex flex-col p-4 rounded-xl border-none ${isRecommended ? 'bg-red-50/50 dark:bg-red-500/10' : 'bg-white dark:bg-gray-800 shadow-[0_4px_30px_rgb(0,0,0,0.03)]'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {contact.name}
                                                {isRecommended && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{contact.role}</div>
                                        </div>
                                    </div>
                                    <a 
                                        href={`tel:${contact.phone}`}
                                        className={`w-full py-2.5 rounded-lg border-none text-sm font-bold flex items-center justify-center gap-2 transition-colors ${isRecommended ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
                                    >
                                        <Phone className="w-4 h-4" />
                                        {contact.phone}
                                    </a>
                                </div>
                            )})
                        ) : (
                            <div className="col-span-2 text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                               <p className="text-sm text-gray-500">No matching contacts available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-white dark:bg-gray-900 flex justify-between items-center border-none relative z-20">
          <button 
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            form="emergency-form"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-500/20 active:scale-95"
          >
            {isSubmitting ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <Send className="w-5 h-5" />
                    Dispatch Help
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
