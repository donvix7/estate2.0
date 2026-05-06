'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Home, 
  Wrench, 
  Receipt, 
  ShieldAlert, 
  UserCheck, 
  Construction, 
  Megaphone, 
  UserPlus, 
  Map, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle2,
  Tag
} from 'lucide-react'
import { 
  getUserData, 
  getAnnouncements, 
  getSecurityLogs, 
  getPendingInvites, 
  getStaffMembers, 
  getResidents,
  getWorkers,
  getInvoices,
  getAdminSecurityLogs,
  getLostAndFound,
  getAdminData,
  getEstateData,
  getAllProfiles,
  getAllServiceRequests,
  getVisitors
} from '@/lib/service'
import ActionCard from '@/components/ActionCard'
import VisitorItem from '@/components/VisitorItem'
import MetricCard from '@/components/MetricCard'
import { useRouter } from 'next/navigation'
import { LoadingState } from '@/components/ui/LoadingState'

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
 
  const quickLinks = [
    {
          icon: UserCheck , 
          title:"Staff Hub" , 
          desc:"Assign shifts, track performance & payroll." , 
          href:"/dashboard/admin/service_workers" , 
          bgColor:"bg-[#1241a1]" 
    },
    {
          icon: Construction , 
          title:"Maintenance" , 
          desc:"Track work orders and contractor performance." , 
          href:"/dashboard/admin/service-request" , 
          bgColor:"bg-amber-500" 
    },
    {
          icon: Receipt , 
          title:"Finance" , 
          desc:"Manage invoices, payments, and budgets." , 
          href:"/dashboard/admin/finance" , 
          bgColor:"bg-rose-500" 
    }
  ]
  const mobileQuickLinks = [
    {
          icon: <Megaphone className="size-6" />,
          title: 'Broadcast',
          desc: 'Send announcements to all residents',
          href: '/dashboard/admin/broadcast',
          bgColor: 'bg-[#1241a1]'
    },
    {
          icon: <UserPlus className="size-6" />,
          title: 'Residents',
          desc: 'Manage resident information',
          href: '/dashboard/admin/residents',
          bgColor: 'bg-[#1241a1]'
    },
    {
          icon: <Map className="size-6" />,
          title: 'Estate Map',
          desc: 'View estate map',
          href: '/dashboard/admin/estate-map',
          bgColor: 'bg-[#1241a1]'
    }
  ]
       // const[announcements,setAnnouncements] = useState([])
        //const[securityLogs,setSecurityLogs] = useState([])
        //const[pendingInvites,setPendingInvites] = useState([])
        //const[staffMembers,setStaffMembers] = useState([])

        const [residents,setResidents] = useState([])
        const [workers,setWorkers] = useState([])
        const [invoices,setInvoices] = useState([])
        const [lostAndFound, setLostAndFound] = useState([])
        const [estate,setEstate] = useState([])
        const [serviceRequests,setServiceRequests] = useState([])
        const [visitors, setVisitors] = useState([])

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          user, 
          anns, 
          invites, 
          staff,
          res,
          requests,
          inv,
          adminLogs,
          lfData,
          estateData,
          visitorData
        ] = await Promise.all([
          getAdminData(),
          getAnnouncements(),
          getPendingInvites(),
          getStaffMembers(),
          getAllProfiles(),
          getAllServiceRequests(),
          getInvoices(),
          getAdminSecurityLogs(),
          getLostAndFound(),
          getEstateData(),
          getVisitors()
        ]);

        setUserData(user);
        setAnnouncements(anns || []);
        setPendingInvites(invites || []);
        setStaffMembers(staff?.docs || staff || []);
        setWorkers(staff?.docs || staff || []);
        setResidents(res?.docs || res || []);
        setServiceRequests(requests?.docs || requests || []);
        setInvoices((inv?.docs || []).filter(invoice => invoice.status?.toLowerCase() === "unpaid"));
        setSecurityLogs((adminLogs?.docs || []).filter(log => log.status === "unverified"));
        setEstate(estateData);

        setLostAndFound(lfData?.docs || lfData || []);

        setVisitors(visitorData?.docs || visitorData || []);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading Admin Intel..." />;
  }
   const metrics = [
    {
          icon: <Home className="size-5" /> ,
          label:"Total Residents" ,
          value:residents.length ,
          trend:"+2.5%" ,
          trendColor:"text-green-500" ,
          bgColor:"bg-blue-100 dark:bg-blue-900/30" ,
          iconColor:"text-blue-600" ,
    },
    {
          icon: <Wrench className="size-5" /> ,
          label:"Service Requests" ,
          value:serviceRequests.filter(l => l.status?.toLowerCase() === 'pending').length,
          trend:"New" ,
          trendColor:"text-amber-500" ,
          bgColor:"bg-amber-100 dark:bg-amber-900/30" ,
          iconColor:"text-amber-500" ,
    },
    {
          icon: <Receipt className="size-5" /> ,
          label:"Pending Invoices" ,
          value:invoices.length ,
          trend:"-5%" ,
          trendColor:"text-rose-500" ,
          bgColor:"bg-rose-100 dark:bg-rose-900/30" ,
          iconColor:"text-rose-500" 
    },
    {
          icon: <ShieldAlert className="size-5" /> ,
          label:"Security Alert" ,
          value: securityLogs.length,
          trend: securityLogs.filter(l => l.severity === 'High').length > 0 ? "High Alert" : "Low",
          trendColor: securityLogs.filter(l => l.severity === 'High').length > 0 ? "text-rose-500" : "text-emerald-500",
          bgColor:"bg-blue-100 dark:bg-blue-900/30" ,
          iconColor:"text-blue-500" 
    },
    {
      icon: <Tag className="size-5" />,
      label: "Lost & Found",
      value: lostAndFound.filter(item => !item.resolved).length,
      trend: lostAndFound.filter(item => !item.resolved).length > 0 ? "Review Required" : "All Clear",
      trendColor: lostAndFound.filter(item => !item.resolved).length > 0 ? "text-amber-500" : "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600"
    }
  ]

  return (
    <div className="flex flex-col gap-5 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">Estate Overview</h1>
          <p className="text-slate-500 font-medium text-sm lg:text-base">Monitoring status for {userData?.estateID || estate?.name}</p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Next Week
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1241a1] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-all">
            <Download className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden">
        <label className="relative flex flex-col w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="size-5 text-slate-400 group-focus-within:text-[#1241a1] transition-colors" />
          </div>
          <input 
            className="form-input block w-full rounded-md border-none bg-slate-100 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#1241a1]/20 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm outline-none" 
            placeholder="Search residents, logs, or invoices..." 
            type="text"
          />
        </label>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
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
        <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
            {mobileQuickLinks.map((link, index) => (
          <Link href={link.href} key={index} className="flex flex-col items-center gap-2 group ">
            <div className={`size-14 rounded-full ${link.bgColor} hover:bg-slate-100 hover:text-[#1241a1] dark:hover:bg-slate-800 flex items-center justify-center text-white group-active:scale-95 transition-all`}>
              {link.icon}
            </div>
            <span className="text-[10px] font-semibold uppercase text-center text-slate-600 dark:text-slate-400">{link.title}</span>
          </Link>
        ))}
        </div>
      </section>

     

      {/* Feed Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Security Alerts */}
        <div className="xl:col-span-2 bg-slate-100 dark:bg-slate-800/30 rounded-md overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Recent Security Logs</h3>
            <Link href="/dashboard/admin/security">
              <button className="text-sm font-semibold text-[#1241a1]">See all</button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 p-4">
            {securityLogs.length > 0 ? (
              <div className="space-y-3">
                {securityLogs.slice(0, 5).map((log, idx) => (
                  <div key={log.id || idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-md transition-all">
                    <div className={`size-10 rounded-lg flex items-center justify-center ${
                      log.typeId === 'lost_found' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      log.severity === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 
                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {log.typeId === 'lost_found' ? (
                        log.icon === 'CheckCircle2' ? <CheckCircle2 className="size-5" /> : <Tag className="size-5" />
                      ) : (
                        log.severity === 'High' ? <AlertTriangle className="size-5" /> : <ShieldAlert className="size-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{log.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{log.location} • {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${log.status === 'Completed' || log.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {log.verifiedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800/20 rounded-md">
                <ShieldAlert className="size-12 text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-slate-900 dark:text-white text-base font-semibold">No Recent Logs</h3>
                <p className="text-xs text-slate-500">All systems are currently reported as secure.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Visitors / Estate Map Preview */}
        <div className="space-y-6">
         

          <div className="hidden lg:block bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
            <h3 className="font-semibold text-lg uppercase tracking-tight text-slate-900 dark:text-white mb-8">Access Logs</h3>
            <div className="space-y-6">
              {visitors.length > 0 ? (
                visitors.slice(0, 5).map((visitor, index) => (
                  <VisitorItem key={index} name={visitor.name || visitor.visitor} role={visitor.type || 'Visitor'} status={visitor.status || 'Verified'} img={visitor.img || visitor.image} />
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-sm">No recent visitors</div>
              )}
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">© 2024 EstateAdmin Portal • Service Status: <span className="text-emerald-500 font-semibold uppercase">Optimal</span></p>
      </footer>
    </div>
  )
}



