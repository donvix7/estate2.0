"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'

import {
  getAnnouncements,
  getVisitors,
  getResidentData,
  getServiceRequests,
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
  Megaphone,
  CreditCard,
  Shield,
  Receipt,
  Map,
  User,
  MoreHorizontal,
  ChevronRight,
  Droplets,
  Waves,
  Building2
} from 'lucide-react';
import AnnouncementItem from '@/components/AnnouncementItems';
import ActionCard from '@/components/ActionCard';
import BillItem from '@/components/BillItems';
import ServiceIconLink from '@/components/ServiceIconLink';
import ServiceRow from '@/components/ServiceRow';

export default function ResidentDashboard() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [outstandingServices, setOutstandingServices] = useState([])

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
      icon: CreditCard,
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
 
  const residentsServiceItems = [
    {
      href:"/dashboard/resident/announcements" ,
      icon: Megaphone ,
      label:"Announce" 
    },
    {
      href:"/dashboard/resident/activity",
      icon: Shield ,
      label:"Logs" 
    },
    {
      href:"/dashboard/resident/finance",
      icon: Receipt ,
      label:"Invoices" 
    },
    {
      href:"/dashboard/resident/map",
      icon: Map,
      label:"Map" 
    },
    {
      href:"/dashboard/resident/maintenance",
      icon: Wrench,
      label:"Services" 
    },
    {
      href:"/dashboard/resident/lost_and_found",
      icon: Search,
      label:"Lost & Found"
    },
    {
      href:"/dashboard/resident/emergency",
      icon: AlertTriangle,
      label:"SOS",
      urgent: true
    },
    {
      href:"/dashboard/resident/profile",
      icon: User,
      label:"Profile"
    }
  ] 
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementsData, visitorsData, residentDataResponse, serviceRequestsData] = await Promise.all([
          getAnnouncements(),
          getVisitors(),
          getResidentData(),
          getServiceRequests()
        ]);
        
        // Map string icons to Lucide components
        const iconMap = { Cloud, Droplets, Wrench, Megaphone, Shield, Receipt, Map, Search, AlertTriangle, User };
        const mappedServices = (serviceRequestsData || []).map(s => ({
          ...s,
          icon: iconMap[s.icon] || Wrench
        }));

        setAnnouncements(announcementsData.docs || []);
        setVisitors(visitorsData || []);
        setResidentData(residentDataResponse);
        setOutstandingServices(mappedServices);
        setError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [])

  const handleRefresh = () => {
    setError(null);
    setIsLoading(true);
    router.refresh();
    // After router.refresh(), we still want to trigger our client-side loadData
    setTimeout(() => {
      window.location.reload(); // More reliable for a "Try Again" feel in this context
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#111621] flex flex-col items-center justify-center">
        <div className="size-16 border-4 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <div className="size-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="size-10 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unexpected Error</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
            {error}
          </p>
          <button 
            onClick={handleRefresh}
            className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1241a1]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Try Again
          </button>
        </div>
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
              <QrCode className="size-6" />
              <span className="font-bold text-lg">Generate Visitor Code</span>
            </div>
            <ChevronRight className="size-5" />
          </button>
        </Link>
      </section>

      {/* Status Overview (Mobile-inspired) */}
      <section className="lg:hidden">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Status Overview</h3>
        <div className="grid gap-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex gap-3 items-start">
            <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Security Alert</p>
              <p className="text-amber-800 dark:text-amber-300 text-xs text-left">Scheduled maintenance on perimeter sensors today at 2:00 PM.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
              <CreditCard className="size-5 text-[#1241a1]" />
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">
          {/* Billing Summary */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Billing Summary</h3>
                <MoreHorizontal className="size-5 text-slate-400 cursor-pointer" />
              </div>
              <div className="mb-6 text-left">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Outstanding</p>
                <h2 className="text-3xl font-black mt-1 text-[#1241a1]">${outstandingServices.length * 225}.00</h2>
              </div>
              <div className="space-y-4 text-left">
                {outstandingServices.map((service) => (
                  <BillItem 
                    key={service.id} 
                    icon={service.icon} 
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
          <div className="lg:col-span-1.5 flex flex-col gap-4">
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
                      icon={ann.icon === 'pool' ? Waves : Megaphone} 
                      title={ann.title} 
                      desc={ann.content} 
                      time={ann.timestamp || 'Just now'} 
                      urgent={ann.urgent}
                    />
                  ))
                ) : (
                  <>
                    <AnnouncementItem 
                      icon={Waves} 
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
                  {['Request ID', 'Category', 'Description', 'Status'].map((header) => (
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





