'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { api } from '@/services/api'
import ActionCard from '@/components/ActionCard'
import VisitorItem from '@/components/VisitorItem'
import MetricCard from '@/components/MetricCard'

export default function AdminDashboard() {
  const router = useRouter()
  
  // State from API
  const [userData, setUserData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [securityLogs, setSecurityLogs] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  
  // UI State
  const [isLoading, setIsLoading] = useState(true)
  const metrics = [
    {

          icon:"home" ,
          label:"Total Residents" ,
          value:"1,240" ,
          trend:"+2.5%" ,
          trendColor:"text-green-500" ,
          bgColor:"bg-blue-100 dark:bg-blue-900/30" ,
          iconColor:"text-blue-600" ,
    },
    {
       
          icon:"engineering" ,
          label:"Workers" ,
          value:staffMembers.length || 42,
          trend:"Stable" ,
          trendColor:"text-slate-400" ,
          bgColor:"bg-amber-100 dark:bg-amber-900/30" ,
          iconColor:"text-amber-500" ,
    
    },
    {
       
          icon:"receipt_long" ,
          label:"Pending Invoices" ,
          value:pendingInvites.length || 15 ,
          trend:"-5%" ,
          trendColor:"text-rose-500" ,
          bgColor:"bg-rose-100 dark:bg-rose-900/30" ,
          iconColor:"text-rose-500" 
    
    },
    {
       
          icon:"gpp_maybe" ,
          label:"Security Alert" ,
          value:securityLogs.length > 0 ? securityLogs.filter(l => l.urgent).length || 2 : 2,
          trend:"Low" ,
          trendColor:"text-emerald-500" ,
          bgColor:"bg-blue-100 dark:bg-blue-900/30" ,
          iconColor:"text-blue-500" 
    
    }
  ]
  const quickLinks = [
    {
          icon:"badge" , 
          title:"Staff Hub" , 
          desc:"Assign shifts, track performance & payroll." , 
          href:"/dashboard/admin/service_workers" , 
          bgColor:"bg-[#1241a1]" 
    },
    {
          icon:"construction" , 
          title:"Maintenance" , 
          desc:"Track work orders and contractor performance." , 
          href:"/dashboard/admin/maintenance" , 
          bgColor:"bg-amber-500" 
    },
    {
          icon:"receipt_long" , 
          title:"Finance" , 
          desc:"Manage invoices, payments, and budgets." , 
          href:"/dashboard/admin/finance" , 
          bgColor:"bg-rose-500" 
    }
    
  ]
  const mobileQuickLinks = [{
          icon: 'campaign',
          title: 'Broadcast',
          desc: 'Send announcements to all residents',
          href: '/dashboard/admin/broadcast',
          bgColor: 'bg-[#1241a1]'
        },
        {
          icon: 'person_add',
          title: 'Residents',
          desc: 'Manage resident information',
          href: '/dashboard/admin/residents',
          bgColor: 'bg-[#1241a1]'
        },
        {
          icon: 'map',
          title: 'Estate Map',
          desc: 'View estate map',
          href: '/dashboard/admin/estate-map',
          bgColor: 'bg-[#1241a1]'
        }
        ]
        const recentVisitors = [
          {name:"Sarah Jenkins",role:"Unit 402 - Friend",status:"In",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop "},
          {name:"Michael Chen",role:"Unit 115 - Contractor",status:"Out",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop "},
          {name:"David Wilson",role:"Unit 809 - Delivery",status:"In",img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop "}
        ]
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
          staff
        ] = await Promise.all([
          api.getUserData(),
          api.getAnnouncements(),
          api.getSecurityLogs(),
          api.getPendingInvites(),
          api.getStaffMembers()
        ]);

        setUserData(user);
        setAnnouncements(anns || []);
        setSecurityLogs(logs || []);
        setPendingInvites(invites || []);
        setStaffMembers(staff || []);
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
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="space-y-4 text-center">
           <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-[#1241a1] rounded-full animate-spin mx-auto"></div>
           <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Admin Intel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold lg:font-black tracking-tight text-slate-900 dark:text-white leading-tight">Estate Overview</h1>
          <p className="text-slate-500 font-medium text-sm lg:text-base">Monitoring status for {userData?.estateName || 'Green Valley Estates'}</p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Next Week
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1241a1] text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-[#1241a1]/20">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden">
        <label className="relative flex flex-col w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#1241a1] transition-colors">search</span>
          </div>
          <input 
            className="form-input block w-full rounded-xl border-none bg-slate-200 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#1241a1] focus:bg-white dark:focus:bg-slate-900 transition-all text-sm" 
            placeholder="Search residents, logs, or invoices..." 
            type="text"
          />
        </label>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
       {metrics.map((metric, index) => (
         <MetricCard 
           key={index} 
           icon={metric.icon} 
           label={metric.label} 
           value={metric.value} 
           trend={metric.trend} 
           trendColor={metric.trendColor} 
           bgColor={metric.bgColor} 
           iconColor={metric.iconColor} 
         />
       ))}
      </div>

      {/* Quick Actions (Mobile Only as per template) */}
      <section className="lg:hidden">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
            {mobileQuickLinks.map((link, index) => (
          <Link href={link.href} key={index} className="flex flex-col items-center gap-2 group ">
            <div className={`size-14 rounded-full ${link.bgColor} hover:bg-slate-100 hover:text-[#1241a1] dark:hover:bg-slate-800 flex items-center justify-center text-white shadow-lg shadow-[#1241a1]/20 group-active:scale-95 transition-transform`}>
              <span className="material-symbols-outlined">{link.icon}</span>
            </div>
            <span className="text-[10px] font-semibold uppercase text-center text-slate-600 dark:text-slate-400">{link.title}</span>
          </Link>
        ))}
        </div>
      
        
        
      </section>

     

      {/* Feed Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Security Alerts */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Security Logs</h3>
            <Link href="/dashboard/admin/security">
              <button className="text-sm font-semibold text-[#1241a1]">See all</button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 p-4">
            {securityLogs.length > 0 ? (
              securityLogs.slice(0, 3).map((log, idx) => (
                <div key={log.id || idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-shadow">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${log.urgent ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                    <span className="material-symbols-outlined">{log.urgent ? 'warning' : 'check_circle'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{log.action || 'Patrol Completed: Zone A'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{log.visitorName || 'Officer Johnson'} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback template items if no logs
              <>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">No Security Logs</h3>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Visitors / Estate Map Preview */}
        <div className="space-y-6">
         

          <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8">
            <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white mb-8">Access Logs</h3>
            <div className="space-y-6">
              {recentVisitors.map((visitor, index) => (
                <VisitorItem key={index} name={visitor.name} role={visitor.role} status={visitor.status} img={visitor.img} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section (Desktop/Large Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:mt-8">
        {quickLinks.map((link, index) => (
          <ActionCard 
            key={index} 
            icon={link.icon} 
            title={link.title} 
            desc={link.desc} 
            href={link.href} 
            bgColor={link.bgColor} 
          />
        ))}
      </div>

      <footer className="mt-8 py-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2024 EstateAdmin Portal • Service Status: <span className="text-emerald-500 font-bold uppercase">Optimal</span></p>
      </footer>
    </div>
  )
}



