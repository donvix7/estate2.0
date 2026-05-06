'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  User,
  Building,
  Shield,
  Bell,
  Save,
  Mail,
  Smartphone,
  Key,
  Camera,
  Check,
  ChevronRight,
  LogOut,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getEstateData, getResidentData, getAdminData } from '@/lib/service'
import { PageHeader } from '@/components/ui/PageHeader'
import { Settings as SettingsIcon } from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'estate', label: 'Estate', icon: Building, adminOnly: true },
  { id: 'notifications', label: 'Notifications', icon: Bell }
]

export default function Settings({ role = 'resident' }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState(null)
  const [estateData, setEstateData] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    twoFactor: true,
    emailSummary: true,
    smsAlerts: true,
    estateDescription: '',
    timezone: 'WAT (UTC+1)'
  })

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [user, estate] = await Promise.all([
        role === 'admin' ? getAdminData() : getResidentData(),
        getEstateData()
      ])

      setUserData(user)
      setEstateData(estate)

      // Initialize form data
      setFormData(prev => ({
        ...prev,
        fullName: user?.fullName || user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        estateDescription: estate?.description || '',
      }))
    } catch (error) {
      console.error('Error loading settings data:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }, [role])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call to save settings
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading your preferences...</p>
      </div>
    )
  }

  const filteredTabs = TABS.filter(tab => !tab.adminOnly || role === 'admin')

  return (
    <div className="animate-fade-in max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <PageHeader 
        title="Settings" 
        description="Manage your account settings and set your preferred environment."
        icon={SettingsIcon}
        iconColor="blue"
      >
         <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1241a1] text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-semibold transition-all border-none"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all border-none ${
                  isActive
                    ? 'bg-[#1241a1] text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                {tab.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            )
          })}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
          <div className="bg-slate-100 dark:bg-slate-800/30 text-card-foreground rounded-md overflow-hidden transition-all">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="animate-slide-up">
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
                  
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-md bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden transition-colors">
                        {userData?.profileImage ? (
                          <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-slate-400" />
                        )}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-[#1241a1] text-white rounded-md transition-transform border-none">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Full Name</label>
                        <input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none border-none"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Email Address</label>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none border-none"
                          placeholder="name@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Phone Number</label>
                        <div className="relative">
                           <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                           <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none border-none"
                            placeholder="+234 ..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Role</label>
                        <div className="px-4 py-2.5 rounded-md bg-slate-200 dark:bg-slate-800 text-muted-foreground text-sm capitalize flex items-center gap-2">
                          <Shield className="w-4 h-4" /> {role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 bg-slate-100 dark:bg-slate-800/50">
                   <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-md">
                      <AlertCircle className="w-5 h-5 text-[#1241a1] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Public Profile</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Some of this information may be visible to other estate members and staff.
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Tab: Security */}
            {activeTab === 'security' && (
              <div className="p-6 md:p-8 space-y-8 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account password and authentication.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-md bg-white dark:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#1241a1]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="twoFactor"
                        checked={formData.twoFactor}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1241a1]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-md bg-white dark:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Account Password</p>
                        <p className="text-xs text-slate-500 font-medium">Last changed 3 months ago.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors border-none">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                   <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-danger" /> Danger Zone
                   </h4>
                   <button className="flex items-center gap-2 px-4 py-2.5 text-danger bg-danger/5 hover:bg-danger/10 rounded-md text-sm font-semibold transition-all">
                      <LogOut className="w-4 h-4" /> Deactivate Account
                   </button>
                </div>
              </div>
            )}

            {/* Tab: Estate */}
            {activeTab === 'estate' && role === 'admin' && (
              <div className="p-6 md:p-8 space-y-8 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Estate Preferences</h3>
                  <p className="text-sm text-muted-foreground">Configure global settings for {estateData?.name}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Estate ID</label>
                      <div className="px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 text-muted-foreground text-sm font-mono flex items-center justify-between">
                        {estateData?._id}
                        <button className="text-primary hover:underline text-xs" onClick={() => {
                          navigator.clipboard.writeText(estateData?._id)
                          toast.info("Copied to clipboard")
                        }}>Copy</button>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Registration Date</label>
                      <div className="px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 text-muted-foreground text-sm">
                        {estateData?.createdAt ? new Date(estateData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold ml-1">Estate Name</label>
                      <input
                        disabled
                        value={estateData?.name || ''}
                        className="w-full px-4 py-2.5 rounded-md bg-slate-200/50 dark:bg-slate-900/50 text-muted-foreground cursor-not-allowed border-none outline-none"
                      />
                      <p className="text-[10px] text-muted-foreground ml-1">Estate names can only be changed by super-admins.</p>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold ml-1">Description</label>
                      <textarea
                        name="estateDescription"
                        rows={3}
                        value={formData.estateDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none outline-none border-none"
                        placeholder="Briefly describe the estate..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Timezone</label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none border-none"
                      >
                        <option>WAT (UTC+1)</option>
                        <option>GMT (UTC+0)</option>
                        <option>EST (UTC-5)</option>
                      </select>
                   </div>
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === 'notifications' && (
              <div className="p-6 md:p-8 space-y-8 animate-slide-up">
                 <div>
                  <h3 className="text-lg font-semibold mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Control how and when you receive updates.</p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Daily Summary Emails</p>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            Receive a consolidated report of all activities and alerts in your inbox every morning.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="emailSummary"
                          checked={formData.emailSummary}
                          onChange={handleInputChange}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>

                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5 text-danger" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Security Alerts</p>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            Immediate notifications for login attempts from new devices or security breaches.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">Always On</span>
                      </div>
                   </div>

                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">SMS Notifications</p>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            Receive important estate updates and emergency alerts via text message.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="smsAlerts"
                          checked={formData.smsAlerts}
                          onChange={handleInputChange}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="p-6 md:p-8 bg-slate-100 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={loadData}
                className="px-4 py-2 text-sm font-semibold hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors border-none"
              >
                Reset Changes
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-[#1241a1] text-white hover:brightness-110 disabled:opacity-50 rounded-md font-semibold text-sm transition-all flex items-center gap-2 border-none"
              >
                {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                Save Preferences
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
