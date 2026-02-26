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


export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  return (
    <div className="animate-fadeIn p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your profile, estate preferences, and security configurations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 ">
        {/* Left Column: Profile & Security */}
        <div className="space-y-8">
          
          {/* 1. Profile Settings */}
          <section className="bg-white dark:bg-gray-800  rounded-xl overflow-hidden">
            <div className="px-6 py-4  bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Admin Profile</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Admin User"
                  className="w-full px-4 py-2 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@estate2.0.com"
                  className="w-full px-4 py-2 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Station</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                  <option>Main Office</option>
                  <option>North Gate</option>
                  <option>South Gate</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. Security Preferences */}
          <section className="bg-white dark:bg-gray-800  rounded-xl overflow-hidden">
            <div className="px-6 py-4  bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Require an extra step to log in.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="pt-4 ">
                <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  <Key className="w-4 h-4" /> Change Password
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Estate & Notifications */}
        <div className="space-y-8">
          
          {/* 3. Estate Details */}
          <section className="bg-white dark:bg-gray-800  rounded-xl overflow-hidden">
            <div className="px-6 py-4  bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Estate Preferences</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estate Name</label>
                <input 
                  type="text" 
                  defaultValue="Lekki Phase 1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed outline-none" 
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Contact super-admin to change the registered estate name.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none">
                    <option>NGN (₦)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none">
                    <option>WAT (UTC+1)</option>
                    <option>GMT (UTC+0)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Notifications */}
          <section className="bg-white dark:bg-gray-800  rounded-xl overflow-hidden">
             <div className="px-6 py-4  bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg ">
                 <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                 <div className="flex-1">
                   <p className="font-medium text-sm text-gray-900 dark:text-white">Daily Summary Emails</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg ">
                 <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                 <div className="flex-1">
                   <p className="font-medium text-sm text-gray-900 dark:text-white">SMS Security Alerts</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* 5. System Read-Only Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 justify-center pb-4">
             <Server className="w-4 h-4" />
             <span>Estate 2.0 Console v1.0.4 • Last cloud backup: 2 mins ago</span>
          </div>

        </div>
      </div>
    </div>
  )
}