"use client"
import React, { useState, useEffect } from 'react'
import { Briefcase } from 'lucide-react'
import { api } from '@/services/api'


const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staff = await api.getStaffMembers()
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div>
        {/* STAFF TAB */}
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-gray-200 dark:border-gray-700">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Staff Directory</h2>
                 <button className="px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                   + Add Staff
                 </button>
               </div>
               
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {staffMembers.map(staff => (
                   <div key={staff.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                         <Briefcase className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900 dark:text-white">{staff.name}</h3>
                         <p className="text-sm text-gray-600 dark:text-gray-400">{staff.role}</p>
                       </div>
                     </div>
                     <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                       <div className="flex justify-between">
                         <span>Department:</span>
                         <span className="text-gray-900 dark:text-gray-300">{staff.department}</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Status:</span>
                         <span className={`px-2 py-0.5 rounded text-xs ${
                           staff.status === 'active' 
                             ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                             : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                         }`}>
                           {staff.status}
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
    </div>
  )
}

export default StaffPage