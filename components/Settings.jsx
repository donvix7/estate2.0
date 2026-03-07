'use client'

import React, { useState } from 'react'
import {
  User,
  Building,
  Shield,
  Bell,
  Save,
  Mail,
  Smartphone,
  Server,
  Key
} from 'lucide-react'

export default function Settings({ role = 'resident' }) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  // Determine role-specific text
  const getRoleTitle = () => {
    switch (role) {
      case 'admin': return 'Admin Settings'
      case 'staff': return 'Staff Settings'
      case 'security': return 'Security Settings'
      case 'resident':
      default: return 'User Settings'
    }
  }

  const getProfileTitle = () => {
    switch (role) {
      case 'admin': return 'Admin Profile'
      case 'staff': return 'Staff Profile'
      case 'security': return 'Security Profile'
      case 'resident':
      default: return 'User Profile'
    }
  }

  // Booleans for conditional rendering
  const showAssignedStation = ['admin', 'staff', 'security'].includes(role)
  const isEstatePreferencesReadOnly = role !== 'admin'
  const isEstatePreferencesHidden = role === 'resident'

  return (
    <div className="animate-fade-in p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize font-heading">{getRoleTitle()}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your profile, estate preferences, and security configurations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Profile & Security */}
        <div className="space-y-8">
          
          {/* 1. Profile Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3 ">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white font-heading">{getProfileTitle()}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={role === 'admin' ? "Admin User" : "John Doe"}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={role === 'admin' ? "admin@estate2.0.com" : "user@example.com"}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                />
              </div>
              {showAssignedStation && (
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Assigned Station</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm appearance-none font-medium">
                        <option>Main Office</option>
                        <option>North Gate</option>
                        <option>South Gate</option>
                    </select>
                 </div>
              )}
            </div>
          </section>

          {/* 2. Security Preferences */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-500" />
               </div>
              <h2 className="font-semibold text-gray-900 dark:text-white font-heading">Security</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Require an extra step to log in.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="pt-4 ">
                <button className="flex items-center justify-center w-full gap-2 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 font-bold transition-colors">
                  <Key className="w-4 h-4 text-gray-500" /> Change Password
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Estate & Notifications */}
        <div className="space-y-8">
          
          {/* 3. Estate Details */}
          {!isEstatePreferencesHidden && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Building className="w-4 h-4 text-purple-500" />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white font-heading">Estate Preferences</h2>
                </div>
                <div className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Estate Name</label>
                    <input 
                    type="text" 
                    defaultValue="Lekki Phase 1"
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all shadow-sm ${
                        isEstatePreferencesReadOnly 
                        ? "bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none" 
                        : "bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white"
                    }`}
                    readOnly={isEstatePreferencesReadOnly}
                    />
                    {isEstatePreferencesReadOnly && (
                        <p className="text-xs text-gray-500 mt-2 font-medium">Contact super-admin to change the registered estate name.</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select 
                        disabled={isEstatePreferencesReadOnly}
                        className={`w-full px-4 py-3 rounded-xl text-sm transition-all shadow-sm appearance-none font-medium ${
                            isEstatePreferencesReadOnly
                            ? "bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none"
                            : "bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white"
                        }`}
                    >
                        <option>NGN (₦)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select 
                        disabled={isEstatePreferencesReadOnly}
                        className={`w-full px-4 py-3 rounded-xl text-sm transition-all shadow-sm appearance-none font-medium ${
                            isEstatePreferencesReadOnly
                            ? "bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none"
                            : "bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white"
                        }`}
                    >
                        <option>WAT (UTC+1)</option>
                        <option>GMT (UTC+0)</option>
                    </select>
                    </div>
                </div>
                </div>
            </section>
          )}

          {/* 4. Notifications */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
             <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3 ">
               <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-orange-500" />
               </div>
              <h2 className="font-semibold text-gray-900 dark:text-white font-heading">Notification Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                     <div className="p-2rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900">
                         <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                     </div>
                     <p className="font-bold text-sm text-gray-900 dark:text-white">Daily Summary Emails</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900">
                         <Smartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                     </div>
                     <p className="font-bold text-sm text-gray-900 dark:text-white">SMS Security Alerts</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
