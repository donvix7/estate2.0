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
  Mail,
  Siren,
  Receipt,
  Map,
  Search,
  Wrench
} from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import { api } from '@/services/api' // Unified API Service
import { TechCard } from '@/components/ui/TechCard'
import Link from 'next/link'
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

  const stats = [
    {
      title: "Total Residents",
      value: 0,
      icon: Users,
      color: "blue",
      subtext: "+12 this week"
    },
    {
      title: "Emergencies",
      value: 0,
      icon: Siren,
      color: "red",
      subtext: "active alerts"
    },
    {
      title: "Pending Invites",
      value: pendingInvites.length,
      icon: Mail,
      color: "yellow",
      subtext: "awaiting acceptance"
    },
    {
      title: "Maintenance Requests",
      value: 0,
      icon: Settings,
      color: "gray",
      subtext: "3 high priority"
    }
  ]

  const quickActions = [
    {
      name: "Users",
      icon: Users,
      color: "green",
      href: '/dashboard/admin/users'
 
    },
    {
      name: "Announcements",
      icon: Bell,
      color: "blue",
      href: '/dashboard/admin/announcements'
    },
    {
      name: "Security Logs",
      icon: Shield,
      color: "red",
      href: '/dashboard/admin/security'
    },
    {
      name: "Pending Invites",
      icon: Mail,
      color: "yellow",
      href: '/dashboard/admin/invites'
    },
    {
      name: "View Estates",
      icon: Shield,
      color: "purple",
      href: '/dashboard/admin/estates'
    },
    {
      name: "Invoices",
      icon: Receipt,
      color: "green",
      href: '/dashboard/admin/finance'
    },
    {
      name: "Map",
      icon: Map,
      color: "green",
      href: '/dashboard/admin/map'
    },
    {
      name: "Lost and Found",
      icon: Search,
      color: "blue",
      href: '/dashboard/admin/lost_and_found'
    },
    {
      name: "Services",
      icon: Briefcase,
      color: "purple",
      href: '/dashboard/admin/services'
    },
    {
      name: "Emergencies",
      icon: Siren,
      color: "red",
      href: '/dashboard/admin/emergencies'
    },
    {
      name: "Service workers",
      icon: Wrench,
      color: "green",
      href: '/dashboard/admin/service_workers'
    }
  ]

  return (
    <div className="animate-fadeIn mt-6 p-10">
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Welcome back, {userData?.name}!</h3>
        <p className='text-gray-500 dark:text-gray-400'>Here&apos;s what&apos;s happening in your estate today.</p>
      </div>
      {/* OVERVIEW TAB */}
            <div className="space-y-4">
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Overview</h3>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {
                  stats.map((stat, index) => (
                    <StatsCard 
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      subtext={stat.subtext}
                    />
                  ))
                }
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Quick Actions</h3>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  {
                    quickActions.map((action, index) => (
                      <Link key={index} href={action.href} className="block group">
                        <StatsCard 
                          title={action.name}
                          icon={action.icon}
                          color={action.color}
                        />
                      </Link>
                    ))
                  }
                </div>
                  
                
              </div>

               {/* Recent Activity */}
              <div className='space-y-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Recent Activity</h3>
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

              <div className='space-y-4'>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Recent Announcements</h3>
                   <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Recent Announcements
                   </h3>
                   <div className="space-y-4">
                      {announcements.slice(0, 4).map(ann => (
                        <div key={ann.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-gray-200 dark:border-gray-600">
                          <h3 className="font-semibold text-gray-900 dark:text-white">You&apos;ve discovered a new dimension</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">We haven&apos;t built out this specific module yet, but the infrastructure is ready for it.</p>
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
        </div>
  )
}