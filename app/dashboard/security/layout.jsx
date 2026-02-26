'use client'

import React from 'react'
import NavBar from '@/components/user/NavBar'
import SideBar from '@/components/user/SideBar'
import MobileNavBar from '@/components/user/MobileNavBar'

export default function SecurityLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 flex flex-col">
      {/* Top Navigation */}
      <NavBar role="security" />
      {/* Mobile Navigation */}
      <MobileNavBar role="security" />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <SideBar role="security" />
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
