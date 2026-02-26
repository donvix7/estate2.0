'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardShell({ children, userType, userName, userEmail }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-800">
         <span className="text-white font-bold text-lg font-heading tracking-tight">Estate 2.0</span>
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="text-gray-400 hover:text-white"
         >
           <Menu className="w-6 h-6" />
         </button>
      </div>

      <DashboardSidebar 
        userType={userType} 
        userName={userName} 
        userEmail={userEmail} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
