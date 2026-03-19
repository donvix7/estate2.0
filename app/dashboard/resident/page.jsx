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
      icon: "ac_unit",
      desc: "Living room HVAC making resonance noise",
      status: "Active",
      statusColor: "bg-blue-500",
      iconColor: "text-blue-500"
    },
    {
      id: "#SR-9388",
      category: "Plumbing",
      icon: "plumbing",
      desc: "Kitchen mixer needs seal replacement",
      status: "Scheduled",
      statusColor: "bg-slate-400",
      iconColor: "text-slate-400"
    }
  ]

  const actions = [
    {
      id: "visitor-code",
      title: "Visitor Code",
      desc: "Temporary access for guests",
      icon: "qr_code_2",
      href: "/dashboard/resident/visitors"
    },
    {
      id: "new-request",
      title: "New Request",
      desc: "Report maintenance issue",
      icon: "add_task",
      href: "/dashboard/resident/maintenance/new"
    },
    {
      id: "bills-payments",
      title: "Bills & Payments",
      desc: "View bills and pay dues",
      icon: "payments",
      href: "/dashboard/resident/finance"
    },
    {
      id: "lost-found",
      title: "Lost & Found",
      desc: "Report or find lost items",
      icon: "search",
      href: "/dashboard/resident/lost_and_found"
    },
    {
      id: "emergency-contacts",
      title: "Emergency Contacts",
      desc: "Manage emergency contacts",
      icon: "emergency",
      href: "/dashboard/resident/emergency"
    },
    {
      id: "estate-services",
      title: "Estate Services",
      desc: "Browse & book professionals",
      icon: "business_center",
      href: "/dashboard/resident/workers"
    }
  ]
 
  const residentsServiceItems = [
    {
      href:"/dashboard/resident/announcements" ,
      icon:"campaign" ,
      label:"Announce" 
    },
    {
      href:"/dashboard/resident/activity",
      icon:"shield" ,
      label:"Logs" 
    },
    {
      href:"/dashboard/resident/finance",
      icon:"receipt_long" ,
      label:"Invoices" 
    },
    {
      href:"/dashboard/resident/map",
      icon:"map",
      label:"Map" 
    },
    {
      href:"/dashboard/resident/maintenance",
      icon:"handyman",
      label:"Services" 
    },
    {
      href:"/dashboard/resident/lost_and_found",
      icon:"search_check",
      label:"Lost & Found"
    },
    {
      href:"/dashboard/resident/emergency",
      icon:"emergency",
      label:"SOS",
      urgent: true
    },
    {
      href:"/dashboard/resident/profile",
      icon:"account_circle",
      label:"Profile"
    }

  ]
  const mobileOverviewItems = [
    {
      
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
    <div className="flex flex-col gap-10 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto w-full pb-24 lg:pb-0">
      
      {/* Mobile Header Greeting */}
      <section className="lg:hidden pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hello, {residentData?.name?.split(' ')[0] || 'Sarah'}!</h2>
          <p className="text-slate-500 dark:text-slate-400">Welcome back to your resident dashboard.</p>
        </div>
      </section>

      {/* Visitor Code Button (Mobile Only) */}
      <section className="lg:hidden">
        <Link href="/dashboard/resident/visitors">
          <button className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-xl py-4 px-6 flex items-center justify-between shadow-lg shadow-[#1241a1]/20 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
              <span className="font-bold text-lg">Generate Visitor Code</span>
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </Link>
      </section>

      {/* Status Overview (Mobile-inspired) */}
      <section className="lg:hidden">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Status Overview</h3>
        <div className="grid gap-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Security Alert</p>
              <p className="text-amber-800 dark:text-amber-300 text-xs text-left">Scheduled maintenance on perimeter sensors today at 2:00 PM.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-[#1241a1]">payments</span>
              <div className="text-left">
                <p className="font-bold text-sm">Service Charge Due</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Due in 3 days • $120.00</p>
              </div>
            </div>
            <Link href="/dashboard/resident/finance">
              <button className="text-[#1241a1] font-bold text-sm px-4 py-1.5 rounded-lg bg-[#1241a1]/10 hover:bg-[#1241a1]/20 transition-colors">Pay</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resident Services Grid (Mobile Only) */}
      <section className="lg:hidden">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-1">Resident Services</h3>
        <div className="grid grid-cols-4 gap-y-6">
          {
            residentsServiceItems.map((item) => (
              <ServiceIconLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                urgent={item.urgent}
              />
            ))
          }          
        </div>
      </section>

      {/* Quick Map (Mobile Only) */}
      <section className="lg:hidden">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Quick Map</h3>
        <div className="w-full h-40 rounded-xl overflow-hidden relative">
          <img className="w-full h-full object-cover" alt="Estate Map Preview" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBphQarF0qA8nu5MYG1955V6OP0uaO2HSU6m59wuK3VSlPNGpg0OHXggsVUR28HGFECPPXS5UVgYJvgKiEzd0R-Wzh3xBkdIZ3E_TLzPkVs0cWNlNvpj1jKZ7NR3OrqVr3PvtyvcJQIOvYMwzlBqHyFotliCm3qQtjG5bxfaeBCpVqN4FGKbVELeV4OSQcdNQbIiYREZlpxSenxUQ_lK2gkzMKfZTAn0jj4tAPcE3-iq3ttlRUa1zWF5x03YArh8YuSxvK_BOPzqxw" />
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold">{residentData?.estateName || 'Green Valley Estates'}</p>
          </div>
        </div>
      </section>

      {/* Original Desktop/Tablet Sections */}
      <section className="hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          <Link href="#" className="text-[#1241a1] text-sm font-semibold hover:underline">View all actions</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <ActionCard
              key={action.href}
              title={action.title}
              desc={action.desc}
              icon={action.icon}
              href={action.href}
            />
          ))}          
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
          {/* Billing Summary */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Billing Summary</h3>
                <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
              </div>
              <div className="mb-6 text-left">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Outstanding</p>
                <h2 className="text-3xl font-black mt-1 text-[#1241a1]">${outstandingServices.length * 225}.00</h2>
              </div>
              <div className="space-y-4 text-left">
                {outstandingServices.map((service) => (
                  <BillItem 
                    key={service.id} 
                    icon={service.category === 'Climate' ? 'ac_unit' : 'plumbing'} 
                    label={service.category} 
                    amount="$225.00" 
                  />
                ))}
                {!outstandingServices.length && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No outstanding bills.</p>
                )}
              </div>
              <Link href="/dashboard/resident/finance">
                <button className="w-full mt-6 bg-[#1241a1] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#1241a1]/20 hover:bg-[#1241a1]/90 transition-all active:scale-[0.98]">
                  Pay Now
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Recent Announcements</h3>
                <Link href="/dashboard/resident/announcements" className="text-xs font-semibold text-[#1241a1] px-3 py-1 rounded-full bg-[#1241a1]/10 hover:bg-[#1241a1]/20 transition-colors">
                  View All
                </Link>
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
                      urgent={ann.urgent}
                    />
                  ))
                ) : (
                  <>
                    <AnnouncementItem 
                      icon="pool" 
                      title="Pool Maintenance Schedule" 
                      desc="The main swimming pool will be closed for quarterly deep cleaning and filtration maintenance starting next Monday, July 15th..." 
                      time="2 hours ago" 
                      urgent
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Progress (Desktop/Mobile) */}
      <section className="lg:mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Active Service Requests</h3>
          <Link href="/dashboard/resident/maintenance" className="text-[#1241a1] text-xs font-bold lg:hidden">View All</Link>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-transparent">
                <tr>
                  {['Request ID', 'Category', 'Description', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="px-6 py-4 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {outstandingServices.map((request) => (
                  <ServiceRow 
                    key={request.id}
                    id={request.id}
                    category={request.category}
                    icon={request.icon}
                    iconColor={request.iconColor}
                    desc={request.desc}
                    status={request.status}
                    statusColor={request.statusColor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card List */}
        <div className="lg:hidden grid gap-4">
          {outstandingServices.map((request) => (
            <ServiceCard 
              key={request.id}
              {...request}
            />
          ))}
        </div>
      </section>

      <footer className="mt-auto px-8 py-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 EstatePro Management Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  )
}

function ServiceIconLink({ href, icon, label, urgent = false }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${urgent ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-active:bg-[#1241a1]/10 group-active:text-[#1241a1]'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className={`text-[11px] font-medium text-center ${urgent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </Link>
  );
}

function ActionCard({ icon, title, desc, href = '#' }) {
  return (
    <Link href={href} className="group p-5 bg-white dark:bg-slate-900 rounded-xl hover:border-[#1241a1] transition-all cursor-pointer text-left">
      <div className="bg-[#1241a1]/10 text-[#1241a1] p-3 rounded-lg w-fit mb-4 group-hover:bg-[#1241a1] group-hover:text-white transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h4 className="font-bold mb-1 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </Link>
  )
}


function BillItem({ icon, label, amount }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-[#1241a1]/20 text-[#1241a1]">
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold">{amount}</span>
    </div>
  )
}

function AnnouncementItem({ icon, title, desc, time, urgent = false }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer text-left">
      <div className="shrink-0 size-12 bg-[#1241a1]/10 rounded-xl flex items-center justify-center text-[#1241a1]">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm">{title}</h4>
          {urgent && <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full font-bold">URGENT</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{desc}</p>
        <p className="text-[10px] text-slate-400 mt-1">{time} • Building Management</p>
      </div>
    </div>
  )
}

function ServiceRow({ id, category, icon, iconColor, desc, status, statusColor }) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{id}</td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2 font-medium">
          <span className={`material-symbols-outlined text-sm ${iconColor}`}>{icon}</span>
          {category}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium max-w-xs truncate" title={desc}>{desc}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-500'}`}>
          <span className={`size-1.5 rounded-full ${statusColor} ${status === 'In Progress' ? 'animate-pulse' : ''}`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[#1241a1] font-semibold hover:underline">Track</button>
      </td>
    </tr>
  )
}

function ServiceCard({ id, category, icon, iconColor, desc, status, statusColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${iconColor}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{id}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{category}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${status === 'Active' || status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
          <span className={`size-1 rounded-full ${statusColor} ${status === 'Active' || status === 'In Progress' ? 'animate-pulse' : ''}`}></span>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{desc}</p>
      <div className="pt-2 flex justify-end">
        <button className="text-[#1241a1] text-xs font-bold flex items-center gap-1">
          Track Status
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  )
}