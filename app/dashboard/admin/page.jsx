'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { api } from '@/services/api'

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
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Estate Overview</h2>
          <p className="text-slate-500 font-medium">Monitoring status for {userData?.estateName || 'Green Valley Estates'}</p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon="home" 
          label="Total Residents" 
          value="1,240" 
          trend="+2.5%" 
          trendColor="text-green-500" 
          bgColor="bg-blue-100 dark:bg-blue-900/30" 
          iconColor="text-blue-600" 
        />
        <MetricCard 
          icon="warning" 
          label="Active Alerts" 
          value={securityLogs.length > 0 ? securityLogs.filter(l => l.urgent).length || 3 : 3}
          trend="-10%" 
          trendColor="text-orange-500" 
          bgColor="bg-orange-100 dark:bg-orange-900/30" 
          iconColor="text-orange-600" 
        />
        <MetricCard 
          icon="shield_person" 
          label="Staff On-duty" 
          value={staffMembers.length || 42}
          trend="Static" 
          trendColor="text-slate-500" 
          bgColor="bg-indigo-100 dark:bg-indigo-900/30" 
          iconColor="text-indigo-600" 
        />
        <MetricCard 
          icon="person_pin_circle" 
          label="Visitor Count" 
          value="156" 
          trend="+12%" 
          trendColor="text-green-500" 
          bgColor="bg-emerald-100 dark:bg-emerald-900/30" 
          iconColor="text-emerald-600" 
        />
       
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">Estate Health Index</h3>
            <select className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[#1241a1] focus:ring-0 cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex flex-col justify-end">
            <div className="relative h-48 w-full group">
              <svg className="w-full h-full" viewBox="0 0 500 150">
                <path className="fill-[#1241a1]/10" d="M0,120 C50,110 100,50 150,70 C200,90 250,20 300,40 C350,60 400,10 500,30 L500,150 L0,150 Z"></path>
                <path className="stroke-[#1241a1]" d="M0,120 C50,110 100,50 150,70 C200,90 250,20 300,40 C350,60 400,10 500,30" fill="none" strokeWidth="3"></path>
              </svg>
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">
              <span>WEEK 1</span>
              <span>WEEK 2</span>
              <span>WEEK 3</span>
              <span>WEEK 4</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">Security Incidents</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="size-2 rounded-full bg-[#1241a1]"></span> Serious
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="size-2 rounded-full bg-slate-300"></span> Minor
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[25, 60, 45, 85, 30, 55, 25].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full relative group">
                <div 
                  className="absolute inset-x-0 bottom-0 bg-[#1241a1] rounded-t-lg transition-all duration-500 group-hover:bg-blue-600" 
                  style={{ height: `${h}%` }}
                ></div>
                <div 
                  className="absolute inset-x-0 bottom-0 bg-slate-300/40 dark:bg-slate-500/20 rounded-t-lg transition-all duration-500" 
                  style={{ height: `${h + 15}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Security Alerts */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">Security Intelligence</h3>
            <Link href="/dashboard/admin/security">
              <button className="text-[10px] font-black uppercase tracking-widest text-[#1241a1] px-4 py-1.5 rounded-full bg-[#1241a1]/5 hover:bg-[#1241a1]/10 transition-colors">History</button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 p-6">
            {securityLogs.length > 0 ? (
              securityLogs.slice(0, 3).map((log, idx) => (
                <div key={log.id || idx} className="p-6 flex items-start gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                  <div className={`size-12 rounded-2xl flex flex-shrink-0 items-center justify-center transition-all duration-500 ${log.urgent ? 'bg-red-100 dark:bg-red-900/30 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-[#1241a1] group-hover:bg-[#1241a1] group-hover:text-white'}`}>
                    <span className="material-symbols-outlined">{log.urgent ? 'notification_important' : 'info'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-[#1241a1] transition-colors">{log.action || 'Security Event'}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{log.visitorName || log.visitorCode} - {log.location || 'Surveillance Zone 4'}</p>
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-1.5 bg-[#1241a1] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all">Acknowledge</button>
                      <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Live Feed</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-slate-400 font-medium italic text-sm">No active security alerts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8">
          <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white mb-8">Access Logs</h3>
          <div className="space-y-6">
            <VisitorItem 
              name="Sarah Jenkins" 
              role="Unit 402 - Friend" 
              status="In" 
              img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
            />
            <VisitorItem 
              name="Michael Chen" 
              role="Unit 115 - Contractor" 
              status="Out" 
              img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
            />
            <VisitorItem 
              name="David Wilson" 
              role="Unit 809 - Delivery" 
              status="In" 
              img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
            />
            <VisitorItem 
              name="John Doe" 
              role="Unit 301 - Guest" 
              status="In" 
              img="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
            />
          </div>
          <Link href="/dashboard/admin/security">
            <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
              View All History
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard 
          icon="badge" 
          title="Staff Hub" 
          desc="Assign shifts, track performance & payroll." 
          href="/dashboard/admin/service_workers" 
          bgColor="bg-[#1241a1]" 
        />
        <ActionCard 
          icon="construction" 
          title="Service Hub" 
          desc="Track requests and coordinate repairs." 
          href="/dashboard/admin/services" 
          bgColor="bg-emerald-600" 
        />
        <ActionCard 
          icon="payments" 
          title="Financials" 
          desc="Manage levies and resident utility billing." 
          href="/dashboard/admin/finance" 
          bgColor="bg-indigo-600" 
        />
      </div>

      <footer className="mt-8 py-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2024 EstateAdmin Portal • Service Status: <span className="text-emerald-500 font-bold uppercase">Optimal</span></p>
      </footer>
    </div>
  )
}

function MetricCard({ icon, label, value, trend, trendColor, bgColor, iconColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm flex flex-col gap-2 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className={`size-12 rounded-2xl ${bgColor} ${iconColor} flex items-center justify-center shadow-inner`}>
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${trendColor} bg-current/5 px-2.5 py-1 rounded-full`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function VisitorItem({ name, role, status, img }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">{name}</p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{role}</p>
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'In' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-400/10'} px-3 py-1 rounded-full`}>
        {status}
      </span>
    </div>
  )
}

function ActionCard({ icon, title, desc, href, bgColor }) {
  return (
    <Link href={href}>
      <div className={`${bgColor} p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl hover:-translate-y-2 transition-all duration-500`}>
        <div className="relative z-10">
          <span className="material-symbols-outlined text-4xl mb-6 block opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all">{icon}</span>
          <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{title}</h4>
          <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">{desc}</p>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
            Access Portal
            <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </span>
        </div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white/5 text-[10rem] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">{icon}</span>
      </div>
    </Link>
  )
}