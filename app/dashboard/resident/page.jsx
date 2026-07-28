"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'

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
  Building2,
  ArrowBigRight,
  ArrowRight
} from 'lucide-react';
import AnnouncementItem from '@/components/AnnouncementItems';
import ActionCard from '@/components/ActionCard';
import BillItem from '@/components/BillItems';
import ServiceIconLink from '@/components/ServiceIconLink';
import ServiceRow from '@/components/ServiceRow';
import { getCurrentUser } from '@/lib/action';

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

  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementsData, visitorsData, residentDataResponse, serviceRequestsData, userData ] = await Promise.all([
          getAnnouncements(),
          getVisitors(),
          getResidentData(),
          getServiceRequests(),
          getCurrentUser()
        ]);
        
        // Map string icons to Lucide components
        const iconMap = { Cloud, Droplets, Wrench, Megaphone, Shield, Receipt, Map, Search, AlertTriangle, User };
        const mappedServices = (serviceRequestsData || []).map(s => ({
          ...s,
          icon: iconMap[s.icon] || Wrench
        }));

        setUser(userData)

        setAnnouncements(announcementsData || []);
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
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (isLoading) {
    return <LoadingState message="Loading Resident Portal..." />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-md p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <div className="size-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="size-10 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Unexpected Error</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
            {error}
          </p>
          <button 
            onClick={handleRefresh}
            className="w-full bg-slate-700 hover:bg-slate-700 text-white font-semibold py-4 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-24 lg:pb-0">
      
      {/* Header Greeting */}
      <PageHeader 
        title={`Hello, ${user?.username?.split(' ')[0] || 'Unknown'}!`}
        description="Welcome back to your resident dashboard."
        icon={User}
        iconColor="blue"
      />

      {/* Quick Actions - Consistent on all screens */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-base font-semibold">Quick Actions</h3>
          <Link href="#" className="text-amber-600 dark:text-amber-500 text-xs md:text-sm font-semibold hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="size-3 md:size-4" />
          </Link>
        </div>
        
        {/* Quick Action Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {actions.slice(0, 4).map((action) => (
            <ActionCard
              key={action.href}
              title={action.title}
              desc={action.desc}
              icon={action.icon}
              href={action.href}
              compact={true}
            />
          ))}
        </div>
      </section>

      {/* Two Column Layout - Consistent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Billing Summary */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-semibold">Billing Summary</h3>
            <Link href="/dashboard/resident/finance" className="text-amber-600 dark:text-amber-500 text-xs font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              View All
            </Link>
          </div>
          <div className="bg-slate-100 dark:bg-[#818b94]/10 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">Total Outstanding</p>
              <MoreHorizontal className="size-4 md:size-5 text-slate-400 cursor-pointer" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black/70 dark:text-white mb-6">
              ${outstandingServices.length * 225}.00
            </h2>
            <div className="space-y-3">
              {outstandingServices.slice(0, 3).map((service) => (
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
              <button className="w-full mt-5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white py-2.5 md:py-3 rounded-lg font-semibold text-sm transition-all active:scale-[0.98]">
                Pay Now
              </button>
            </Link>
          </div>
        </section>

        {/* Recent Announcements */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-semibold">Recent Announcements</h3>
            <Link href="/dashboard/resident/announcements" className="text-amber-600 dark:text-amber-500 text-xs font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              View All
            </Link>
          </div>
          <div className="bg-slate-100 dark:bg-[#818b94]/10 rounded-xl p-5 md:p-6 flex-1">
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
                  <div className="rounded-xl p-8 text-center flex flex-col items-center gap-2">
                    <Megaphone className="size-10 text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium text-slate-600 dark:text-slate-300">No announcements</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">You have no announcements at the moment.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Resident Services - Consistent Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-base font-semibold">Resident Services</h3>
          <Link href="#" className="text-amber-600 dark:text-amber-500 text-xs font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            More
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
          {residentsServiceItems.map((item) => (
            <ServiceIconLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              urgent={item.urgent}
            />
          ))}
        </div>
      </section>

      {/* Active Service Requests - Consistent */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-base font-semibold">Active Service Requests</h3>
          <Link href="/dashboard/resident/maintenance" className="text-amber-600 dark:text-amber-500 text-xs font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            View All
          </Link>
        </div>
        
        {/* Responsive Table/Card Grid */}
        {outstandingServices.length === 0 ? (
          <div className="bg-slate-100 dark:bg-[#818b94]/10 rounded-xl p-8 text-center flex flex-col items-center gap-2">
            <Wrench className="size-10 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No active requests</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">You have no ongoing service requests at the moment.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-100 dark:bg-[#818b94]/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-200/50 dark:bg-slate-700/50">
                    <tr>
                      {['Request ID', 'Category', 'Description', 'Status'].map((header) => (
                        <th key={header} className="px-4 md:px-6 py-3 font-semibold text-xs md:text-sm">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
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
            <div className="md:hidden grid gap-3">
              {outstandingServices.map((request) => (
                <ServiceCard
                  key={request.id}
                  {...request}
                />
              ))}
            </div>
          </>
        )}
      </section>

    
    </div>
  )
}