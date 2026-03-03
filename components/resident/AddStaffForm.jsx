'use client'

import React, { useState } from 'react'
import { User, Phone, Briefcase, CalendarClock, Camera, IdCard, CheckCircle2, FileText, HardHat } from 'lucide-react'

export default function AddStaffForm({ onCancel, onSuccess, type = 'staff' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const config = {
    staff: {
      title: "Register Domestic Staff",
      subtitle: "Add a new staff member to your household.",
      roles: ['Maid/Cleaner', 'Driver', 'Nanny', 'Cook', 'Security Guard', 'Personal Assistant', 'Other'],
      schedules: ['Full-time (Live-in)', 'Full-time (Live-out)', 'Part-time', 'Contract/Temporary'],
      icon: User,
      bgIconCls: "bg-blue-100 dark:bg-blue-500/20",
      iconCls: "text-blue-600 dark:text-blue-400",
      headerBg: "bg-blue-50/50 dark:bg-gray-900/50",
      roleLabel: "Staff Role",
      btnText: "Register Staff",
      photoLabel: "Staff Photo"
    },
    worker: {
      title: "Register External Worker",
      subtitle: "Register a contractor or artisan for temporary access.",
      roles: ['Plumber', 'Electrician', 'Painter', 'Carpenter', 'AC Technician', 'Builder/Mason', 'Delivery', 'Other'],
      schedules: ['One-time Visit', 'Weekly', 'Monthly', 'Continuous Project'],
      icon: HardHat,
      bgIconCls: "bg-orange-100 dark:bg-orange-500/20",
      iconCls: "text-orange-600 dark:text-orange-400",
      headerBg: "bg-orange-50/50 dark:bg-gray-900/50",
      roleLabel: "Worker Type / Trade",
      btnText: "Register Worker",
      photoLabel: "Worker Profile Photo"
    }
  }

  const currentConfig = config[type] || config.staff

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: currentConfig.roles[0],
    schedule: currentConfig.schedules[0],
    idType: 'National ID',
    idNumber: ''
  })

  const idTypes = ["National ID", "Driver's License", "Voter's Card", "International Passport"]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (onSuccess) onSuccess(formData)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
      {/* Header */}
      <div className={`p-6 sm:p-8 flex items-center justify-between ${currentConfig.headerBg} relative`}>
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${currentConfig.bgIconCls} flex items-center justify-center shrink-0`}>
            <currentConfig.icon className={`w-7 h-7 ${currentConfig.iconCls}`} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-heading">{currentConfig.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{currentConfig.subtitle}</p>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        
        {/* Section: Personal Info */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="E.g., Mary"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="E.g., Johnson"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="E.g., 08012345678"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Section: Employment Details */}
        <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-500" />
            Employment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {currentConfig.roleLabel}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm appearance-none font-medium"
              >
                {currentConfig.roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <CalendarClock className="w-4 h-4 text-gray-400" />
                Work Schedule
              </label>
              <select
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm appearance-none font-medium"
              >
                {currentConfig.schedules.map(schedule => (
                  <option key={schedule} value={schedule}>{schedule}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Identification */}
        <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <IdCard className="w-4 h-4 text-emerald-500" />
            Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                ID Type
              </label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm appearance-none font-medium"
              >
                {idTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <IdCard className="w-4 h-4 text-gray-400" />
                ID Number
              </label>
              <input
                type="text"
                name="idNumber"
                required
                placeholder="E.g., 12345678901"
                value={formData.idNumber}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <label className="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              {currentConfig.photoLabel} (Optional)
            </label>
            <button 
              type="button"
              className="w-full py-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <Camera className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <span className="text-sm font-medium">Click to upload photo</span>
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.99] text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white"></div>
                Registering...
              </>
            ) : (
              currentConfig.btnText
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
