'use client'

import React from 'react'
import AdminSecurityLogs from '@/components/admin/AdminSecurityLogs'
import { PageHeader } from '@/components/ui/PageHeader'
import { BellRing, Download, ShieldAlert } from 'lucide-react'

const SecurityPage = () => {
  return (
    <div className="animate-fade-in mt-6 p-6 sm:p-10">
      <PageHeader 
        title="Security Logs" 
        description="Real-time monitoring of all perimeter and entry activities."
        icon={ShieldAlert}
      >
        <div className="flex gap-3">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('export-logs'))}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-none"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-security-entry'))}
            className="flex items-center gap-2 bg-[#1241a1] text-white px-4 py-2 rounded-md font-semibold text-sm hover:brightness-110 transition-colors border-none"
          >
            <BellRing className="size-4" />
            Manual Entry
          </button>
        </div>
      </PageHeader>

      <div className="space-y-6">
        <AdminSecurityLogs />
      </div>
    </div>
  )
}

export default SecurityPage