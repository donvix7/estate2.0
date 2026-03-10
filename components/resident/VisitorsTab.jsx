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
          
           <VisitorPassGenerator />
        </TechCard>
      </div>
      
        
      
    </div>
  )
}
