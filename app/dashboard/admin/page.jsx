'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Users,
  Bell,
  Shield,
  FileText,
  Settings,
  ShieldAlert,
  MessageSquare,
  UserCheck,
  Calendar,
  Smartphone,
  Activity,
  BarChart3,
  Clock,
  Briefcase,
  Sun,
  Moon,
  Mail
} from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import { api } from '@/services/api' // Unified API Service
// Dynamically import the QR scanner
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scanner...</p>
        </div>
      </div>
    )
  }
)

export default function AdminDashboard() {
  const router = useRouter()
  
  // Theme state
  const [theme, setTheme] = useState('light')
  
  // State from API
  const [userData, setUserData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [securityLogs, setSecurityLogs] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [estates, setEstates] = useState([])
  
  // UI State
  const [isLoading, setIsLoading] = useState(true)

  // Theme effect
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    
    // Apply theme to body
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          user, 
          anns, 
          logs, 
          invites, 
          staff,
          estatesList
        ] = await Promise.all([
          api.getUserData(),
          api.getAnnouncements(),
          api.getSecurityLogs(),
          api.getPendingInvites(),
          api.getStaffMembers(),
          api.getEstates()
        ]);

        setUserData(user);
        setAnnouncements(anns);
        setSecurityLogs(logs);
        setPendingInvites(invites);
        setStaffMembers(staff);
        setEstates(estatesList);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
           <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto"></div>
           <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn mt-6 p-10">
      {/* OVERVIEW TAB */}
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Residents" 
                  value="1,245" 
                  icon={Users} 
                  color="blue" 
                  subtext="+12 this week"
                />
                <StatsCard 
                  title="Active Security" 
                  value={staffMembers.filter(s => s.department === 'Security' || s.role.includes('Security')).length || 5} 
                  icon={ShieldAlert} 
                  color="red" 
                  subtext="on duty now"
                />
                <StatsCard 
                  title="Pending Invites" 
                  value={pendingInvites.length} 
                  icon={Mail} 
                  color="yellow" 
                  subtext="awaiting acceptance"
                />
                 <StatsCard 
                  title="Maintenance Requests" 
                  value="8" 
                  icon={Settings} 
                  color="gray" 
                  subtext="3 high priority"
                />
              </div>

               {/* Recent Activity */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Recent Security Logs
                   </h3>
                   <div className="space-y-4">
                     {securityLogs.slice(0, 5).map(log => (
                       <div key={log.id} className=" border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                         <div className="flex justify-between items-start">
                           <p className="text-gray-700 dark:text-gray-300 font-medium">{log.action}</p>
                           <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                             {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                         </div>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                           {log.visitorName || log.visitorCode} - {log.location || 'Main Gate'}
                         </p>
                       </div>
                     ))}
                     {securityLogs.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic">No recent logs.</p>}
                   </div>
                 </div>

                 <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Recent Announcements
                   </h3>
                   <div className="space-y-4">
                      {announcements.slice(0, 4).map(ann => (
                        <div key={ann.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-gray-200 dark:border-gray-600">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{ann.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(ann.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                   </div>
                 </div>
               </div>
            </div>
        </div>
  )
}