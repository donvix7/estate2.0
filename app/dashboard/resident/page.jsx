"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  getAnnouncements,
  getVisitors,
  getResidentData,
} from '@/lib/service'

import { 
  Cloud, 
  Wrench, 
  QrCode, 
  PlusSquare, 
  Calendar, 
  Search, 
  AlertTriangle, 
  Briefcase, 
  Megaphone
} from 'lucide-react';

export default function ResidentDashboard() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const outstandingServices = [
    {
      id: "#SR-9421",
      category: "Climate",
      catIcon: Cloud,
      desc: "Living room HVAC making resonance noise",
      status: "Active",
      statusColor: "bg-blue-500"
    },
    {
      id: "#SR-9388",
      category: "Plumbing",
      catIcon: Wrench,
      desc: "Kitchen mixer needs seal replacement",
      status: "Scheduled",
      statusColor: "bg-slate-400"
    }
  ]

  const actions = [
    {
      id: "visitor-code",
      title: "Visitor Code",
      desc: "Temporary access for guests",
      icon: QrCode,
      href: "/dashboard/resident/visitors"
    },
    {
      id: "new-request",
      title: "New Request",
      desc: "Report maintenance issue",
      icon: PlusSquare,
      href: "/dashboard/resident/maintenance/new"
    },
    {
      id: "bills-payments",
      title: "Bills & Payments",
      desc: "View bills and pay dues",
      icon: Calendar,
      href: "/dashboard/resident/finance"
    },
    {
      id: "lost-found",
      title: "Lost & Found",
      desc: "Report or find lost items",
      icon: Search,
      href: "/dashboard/resident/lost_and_found"
    },
    {
      id: "emergency-contacts",
      title: "Emergency Contacts",
      desc: "Manage emergency contacts",
      icon: AlertTriangle,
      href: "/dashboard/resident/emergency"
    },
    {
      id: "estate-services",
      title: "Estate Services",
      desc: "Browse & book professionals",
      icon: Briefcase,
      href: "/dashboard/resident/workers"
    }
  ]
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementsData, visitorsData, residentDataResponse] = await Promise.all([
          getAnnouncements(),
          getVisitors(),
          getResidentData()
        ]);
        
        setAnnouncements(announcementsData || []);
        setVisitors(visitorsData || []);
        setResidentData(residentDataResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111621] flex flex-col items-center justify-center">
        <div className="size-16 border-4 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Portal...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto w-full">
      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Essential Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <ActionCard key={action.id} href={action.href} icon={action.icon} title={action.title} desc={action.desc} />
          ))}
        </div>

      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Billing Summary */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1241a1]/5 rounded-bl-full transition-all group-hover:bg-[#1241a1]/10"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Statement</h3>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">more_horiz</span>
            </div>
            <div className="mb-8">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Total Outstanding</p>
              <h2 className="text-4xl font-black mt-2 text-[#1241a1]">{outstandingServices.length}</h2>
            </div>
            <div className="space-y-4">{
              outstandingServices.map((service) => (
                <BillItem key={service.id} icon={service.catIcon} label={service.category} amount={service.amount} color={service.statusColor} />
              ))}
              
            </div>
          <Link href="/dashboard/resident/finance">
            <button className="w-full mt-8 bg-[#1241a1] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#1241a1]/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Clear Dues Now
            </button>
          </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1241a1] px-4 py-1.5 rounded-full bg-[#1241a1]/5">Live Updates</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">History</button>
            </div>
            <div className="flex flex-col gap-4">
              {announcements.length > 0 ? (
                announcements.slice(0, 3).map((ann, idx) => (
                  <AnnouncementItem 
                    key={ann.id || idx}
                    icon={ann.icon || 'campaign'} 
                    title={ann.title} 
                    desc={ann.content} 
                    time={ann.timestamp || 'Just now'} 
                    author={ann.author || 'Management'}
                    urgent={ann.urgent}
                  />
                ))
              ) : (
                <>
                  <AnnouncementItem 
                    icon="pool" 
                    title="Pool Maintenance Schedule" 
                    desc="The main swimming pool will be closed for quarterly deep cleaning and filtration maintenance..." 
                    time="2 hours ago" 
                    author="Facility Team"
                    urgent
                  />
                  <AnnouncementItem 
                    icon="celebration" 
                    title="Resident Social Evening" 
                    desc="Join us this Friday at the clubhouse for our monthly resident social. Food and cocktails will be provided..." 
                    time="Yesterday" 
                    author="Social Hub"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Progress */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Service Tickets</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-slate-400">Ticket ID</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-slate-400">Category</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-slate-400">Issue Description</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Current Status</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="">
                <ServiceRow id="#SR-9421" category="Climate" catIcon={Cloud} desc="Living room HVAC making resonance noise" status="Active" statusColor="bg-blue-500" />
                <ServiceRow id="#SR-9388" category="Plumbing" catIcon={Wrench} desc="Kitchen mixer needs seal replacement" status="Scheduled" statusColor="bg-slate-400" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2024 EstatePro Management Ecosystem</p>
      </footer>
    </div>
  )
}

function ActionCard({ icon: Icon, title, desc, href = '#' }) {
  const IconComponent = typeof Icon === 'string' ? Megaphone : (Icon || Megaphone);
  return (
    <Link href={href} className="group p-8 bg-white dark:bg-slate-900 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:shadow-[#1241a1]/10 flex flex-col items-center text-center">
      <div className="bg-[#1241a1]/5 text-[#1241a1] p-5 rounded-2xl mb-6 group-hover:bg-[#1241a1] group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
        <IconComponent className="w-8 h-8" />
      </div>
      <h4 className="font-black text-sm mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[150px] mx-auto">{desc}</p>
    </Link>
  )
}


function BillItem({ icon: Icon, label, amount, color }) {
  const IconComponent = typeof Icon === 'string' ? Megaphone : (Icon || Megaphone);
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 transition-all hover:translate-x-1">
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-3 rounded-xl bg-white dark:bg-slate-700 shadow-sm ${color}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold opacity-80 truncate">{label}</span>
      </div>
      <span className="text-sm font-black text-right ml-2">{amount}</span>
    </div>
  )
}

function AnnouncementItem({ icon, title, desc, time, author, urgent = false }) {
  const IconComponent = typeof icon === 'string' ? Megaphone : (icon || Megaphone);
  return (
    <div className="flex gap-6 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
      <div className="shrink-0 size-16 bg-[#1241a1]/5 rounded-2xl flex items-center justify-center text-[#1241a1] group-hover:bg-[#1241a1] group-hover:text-white transition-all duration-500 shadow-sm">
        <IconComponent className="w-7 h-7" />
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-sm tracking-tight group-hover:text-[#1241a1] transition-colors">{title}</h4>
          {urgent && <span className="text-[8px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full font-black uppercase tracking-widest">Urgent</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">{desc}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1241a1]">{author}</span>
          <span className="text-[10px] font-bold text-slate-400 italic">{time}</span>
        </div>
      </div>
    </div>
  )
}

function ServiceRow({ id, category, catIcon: Icon, desc, status, statusColor }) {
  const IconComponent = typeof Icon === 'string' ? Megaphone : (Icon || Megaphone);
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all group">
      <td className="px-8 py-6 font-bold text-slate-500">{id}</td>
      <td className="px-8 py-6">
        <span className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
          <IconComponent className="w-4 h-4 opacity-70" />
          {category}
        </span>
      </td>
      <td className="px-8 py-6 text-slate-500 dark:text-slate-400 font-medium max-w-xs truncate" title={desc}>{desc}</td>
      <td className="px-8 py-6 text-center">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
          <span className={`size-1.5 rounded-full ${statusColor} animate-pulse`}></span>
          {status}
        </span>
      </td>
      <td className="px-8 py-6 text-right">
        <button className="text-[10px] font-black uppercase tracking-widest text-[#1241a1] hover:underline hover:scale-105 transition-all">Timeline</button>
      </td>
    </tr>
  )
}