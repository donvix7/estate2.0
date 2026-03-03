"use client"

import React from 'react'
import InvoiceList from '@/components/resident/InvoiceList'
import { Receipt } from 'lucide-react'

const page = () => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          My Invoices
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          View, download, and manage your billing history and service charges.
        </p>
      </div>
      
      <InvoiceList />
    </div>
  )
}

export default page
