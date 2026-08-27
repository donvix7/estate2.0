"use client"
import React, { useState, useEffect } from 'react'
import { Briefcase, Users } from 'lucide-react'
import { getStaffMembers } from '@/lib/service'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'


const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staff = await getStaffMembers()
        setStaffMembers(staff)
      } catch (error) {
        console.error('Failed to load staff data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStaff()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d0f13] border-[#2a2d33]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
        {/* STAFF TAB */}
            <PageHeader
              title="Staff Directory"
              description="Manage estate staff profiles, departments, and access."
              icon={Users}
            >
              <Button variant="primary" size="md">
                + Add Staff
              </Button>
            </PageHeader>
               
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {staffMembers.map(staff => (
                   <Card key={staff.id} hoverable>
                     <CardBody>
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-[#1a1d23] rounded-full flex items-center justify-center">
                           <Briefcase className="w-6 h-6 text-[#8a8f98]" />
                         </div>
                         <div>
                           <h3 className="font-bold text-white">{staff.name}</h3>
                           <p className="text-sm text-[#8a8f98]">{staff.role}</p>
                         </div>
                       </div>
                       <div className="space-y-2 text-sm text-[#8a8f98]">
                         <div className="flex justify-between">
                           <span>Department:</span>
                           <span className="text-white text-[#8a8f98]">{staff.department}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Status:</span>
                           <StatusBadge status={staff.status} />
                         </div>
                       </div>
                     </CardBody>
                   </Card>
                 ))}
               </div>
    </div>
  )
}

export default StaffPage