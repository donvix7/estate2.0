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
import AdminNav from '@/components/AdminNav'
import StatsCard from '@/components/StatsCard'
import DashboardTabs from '@/components/DashboardTabs'
import { api } from '@/services/api' // Unified API Service

// Dynamically import the QR scanner
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg">
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
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [visitorCode, setVisitorCode] = useState('')

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

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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

  const handleVerifyVisitor = async (code, pin) => {
     try {
       const result = await api.verifyVisitorPass(code, pin || '0000');
       if (result.success) {
         alert(`Verified: ${result.visitor.name} (${result.visitor.resident})`);
         const logs = await api.getSecurityLogs();
         setSecurityLogs(logs);
       } else {
         alert(`Verification Failed: ${result.message}`);
       }
     } catch (e) {
       alert('Error verifying visitor');
     }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'users', label: 'Residents', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
  ];

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <AdminNav theme={theme} onThemeToggle={toggleTheme} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Theme toggle in header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>

        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          theme={theme}
        />

        <div className="animate-fadeIn mt-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Residents" 
                  value="1,245" 
                  icon={Users} 
                  color="blue" 
                  subtext="+12 this week"
                  theme={theme}
                />
                <StatsCard 
                  title="Active Security" 
                  value={staffMembers.filter(s => s.department === 'Security' || s.role.includes('Security')).length || 5} 
                  icon={ShieldAlert} 
                  color="red" 
                  subtext="on duty now"
                  theme={theme}
                />
                <StatsCard 
                  title="Pending Invites" 
                  value={pendingInvites.length} 
                  icon={Mail} 
                  color="yellow" 
                  subtext="awaiting acceptance"
                  theme={theme}
                />
                 <StatsCard 
                  title="Maintenance Requests" 
                  value="8" 
                  icon={Settings} 
                  color="gray" 
                  subtext="3 high priority"
                  theme={theme}
                />
              </div>

               {/* Recent Activity */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Recent Security Logs
                   </h3>
                   <div className="space-y-4">
                     {securityLogs.slice(0, 5).map(log => (
                       <div key={log.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
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

                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Recent Announcements
                   </h3>
                   <div className="space-y-4">
                      {announcements.slice(0, 4).map(ann => (
                        <div key={ann.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
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
          )}

          {/* STAFF TAB */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Staff Directory</h2>
                 <button className="px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                   + Add Staff
                 </button>
               </div>
               
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {staffMembers.map(staff => (
                   <div key={staff.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all">
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
          )}
          
          {/* PLACEHOLDERS FOR OTHER TABS */}
          {(activeTab === 'security' || activeTab === 'users' || activeTab === 'announcements') && (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg border-dashed">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">Under Maintenance</h3>
              <p className="text-gray-500 dark:text-gray-500 mt-2">This module is currently being optimized.</p>
            </div>
          )}
        </div>
      </main>

      {/* Global styles for theme transitions */}
      <style jsx global>{`
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}