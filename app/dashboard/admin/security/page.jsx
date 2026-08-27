'use client'

import React from 'react'
import AdminSecurityLogs from '@/components/admin/AdminSecurityLogs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { BellRing, Download, ShieldAlert } from 'lucide-react'

const SecurityPage = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Security Logs" 
        description="Real-time monitoring of all perimeter and entry activities."
        icon={ShieldAlert}
      >
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            icon={Download}
            onClick={() => window.dispatchEvent(new CustomEvent('export-logs'))}
          >
            Export CSV
          </Button>
          <Button 
            icon={BellRing}
            onClick={() => window.dispatchEvent(new CustomEvent('open-security-entry'))}
          >
            Manual Entry
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6">
        <AdminSecurityLogs />
      </div>
    </div>
  )
}

export default SecurityPage