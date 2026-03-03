import React from 'react'
import { TechCard } from '@/components/ui/TechCard'
import { CleanTable } from '@/components/ui/CleanTable'
import { VisitorPassGenerator } from '@/components/visitor-pass-generator'

export default function VisitorsTab({ visitors = [] }) {
  return (
    <div className="space-y-6 md:space-y-8 mx-auto">
      {/* Top Section: Generate Pass */}
      <div className="w-full">
        <TechCard className="">
           <div className="mb-6">
             <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white font-heading">Create New Pass</h3>
             <p className="text-sm text-gray-500 mt-1">Generate a one-time access code for your visitor.</p>
           </div>
           <VisitorPassGenerator />
        </TechCard>
      </div>
      
        
      
    </div>
  )
}
