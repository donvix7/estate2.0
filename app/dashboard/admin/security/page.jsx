'use client'

import React from 'react'
import AdminSecurityLogs from '@/components/admin/AdminSecurityLogs'

const SecurityPage = () => {
  return (
    <div className="animate-fade-in mt-6 p-6 sm:p-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">
          Security Logs
        </h1>
       
      </div>

      <div className="space-y-6">
        <AdminSecurityLogs />
      </div>
    </div>
  )
}

export default SecurityPage