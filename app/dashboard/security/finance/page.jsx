import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Landmark } from 'lucide-react'

export default function FinancePage() {
  return (
    <ComingSoon 
      title="Financial Dashboard" 
      description="We're currently building out the financial management tools. Here you will soon be able to track budgets, expenses, and revenue."
      icon={Landmark}
    />
  )
}
