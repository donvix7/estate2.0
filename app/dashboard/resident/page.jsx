"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

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
  ArrowRight,
  Droplets,
  Waves,
  Activity,
  CheckCircle2,
  Clock
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
      title: "Visitor Pass",
      desc: "Instant guest access code",
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
      desc: "View bills & pay dues",
      icon: CreditCard,
      href: "/dashboard/resident/finance"
    },
    {
      id: "lost-found",
      title: "Lost & Found",
      desc: "Report or locate items",
      icon: Search,
      href: "/dashboard/resident/lost_and_found"
    },
    {
      id: "emergency-contacts",
      title: "SOS Contacts",
      desc: "Manage emergency numbers",
      icon: AlertTriangle,
      href: "/dashboard/resident/emergency"
    },
    {
      id: "estate-services",
      title: "Estate Services",
      desc: "Hire verified experts",
      icon: Briefcase,
      href: "/dashboard/resident/workers"
    }
  ]

  const residentsServiceItems = [
    {
      href: "/dashboard/resident/announcements",
      icon: Megaphone,
      label: "Announce"
    },
    {
      href: "/dashboard/resident/activity",
      icon: Shield,
      label: "Logs"
    },
    {
      href: "/dashboard/resident/finance",
      icon: Receipt,
      label: "Invoices"
    },
    {
      href: "/dashboard/resident/map",
      icon: Map,
      label: "Map"
    },
    {
      href: "/dashboard/resident/maintenance",
      icon: Wrench,
      label: "Services"
    },
    {
      href: "/dashboard/resident/lost_and_found",
      icon: Search,
      label: "Lost & Found"
    },
    {
      href: "/dashboard/resident/emergency",
      icon: AlertTriangle,
      label: "SOS",
      urgent: true
    },
    {
      href: "/dashboard/resident/profile",
      icon: User,
      label: "Profile"
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
          getServiceRequests(),
        ]);

        const iconMap = { Cloud, Droplets, Wrench, Megaphone, Shield, Receipt, Map, Search, AlertTriangle, User };
        const mappedServices = (serviceRequestsData || []).map(s => ({
          ...s,
          icon: iconMap[s.icon] || Wrench
        }));

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#1a1d23] w-full max-w-2xl rounded-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 border border-[#2a2d33] border-[#2a2d33]">
          <div className="size-20 bg-red-500/10 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="size-10 text-red-600 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white text-white mb-2">Unexpected Error</h3>
          <p className="text-[#8a8f98] text-[#8a8f98] text-sm mb-8 leading-relaxed">
            {error}
          </p>
          <Button variant="primary" size="lg" onClick={handleRefresh} className="w-full rounded-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalOutstanding = outstandingServices.length * 225;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-7xl mx-auto pb-24 lg:pb-8">
      {/* Top Header Bar */}
      <PageHeader
        title={`Welcome, ${residentData?.firstName?.split(' ')[0] || 'Resident'}!`}
        description="Resident Control Center & Real-time Estate Overview"
        icon={User}
        iconColor="blue"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Resident Portal Live
        </span>
      </PageHeader>

      {/* Quick Summary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="p-4 md:p-5 bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#1a1d23]/10 text-white text-white border-none">
              <Wrench className="size-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#8a8f98] bg-[#2a2d33]/10 px-2.5 py-0.5 rounded-full border-none">Active</span>
          </div>
          <p className="text-[#8a8f98] text-[#8a8f98] text-[10px] font-bold uppercase tracking-wider mt-3">Maintenance Requests</p>
          <p className="text-2xl font-extrabold text-white text-white mt-0.5">{outstandingServices.length}</p>
        </div>

        <div className="p-4 md:p-5 bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 text-amber-400 border-none">
              <CreditCard className="size-5" />
            </div>
            <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border-none">Pending</span>
          </div>
          <p className="text-[#8a8f98] text-[#8a8f98] text-[10px] font-bold uppercase tracking-wider mt-3">Outstanding Dues</p>
          <p className="text-2xl font-extrabold text-white text-white mt-0.5">${totalOutstanding}.00</p>
        </div>

        <div className="p-4 md:p-5 bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none">
              <QrCode className="size-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border-none">Today</span>
          </div>
          <p className="text-[#8a8f98] text-[#8a8f98] text-[10px] font-bold uppercase tracking-wider mt-3">Recent Visitors</p>
          <p className="text-2xl font-extrabold text-white text-white mt-0.5">{visitors.length}</p>
        </div>

        <div className="p-4 md:p-5 bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 text-purple-400 border-none">
              <Megaphone className="size-5" />
            </div>
            <span className="text-[11px] font-semibold text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded-full border-none">Updates</span>
          </div>
          <p className="text-[#8a8f98] text-[#8a8f98] text-[10px] font-bold uppercase tracking-wider mt-3">Announcements</p>
          <p className="text-2xl font-extrabold text-white text-white mt-0.5">{announcements.length}</p>
        </div>
      </div>

      {/* Main 3-Column Dashboard Reference Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 cols): Control Panel & Quick Actions Widget */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={Activity} title="Control Panel" subtitle="Quick Resident Actions" live={true} />
            </CardHeader>
            <CardBody padded={true} className="space-y-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-center gap-3 p-3.5 bg-[#1a1d23]/80 bg-[#2a2d33]/30 "
                  >
                    <div className="p-2.5 rounded-lg bg-[#1a1d23] text-white group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white text-white truncate">{action.title}</p>
                      <p className="text-xs text-[#8a8f98] text-[#8a8f98] truncate">{action.desc}</p>
                    </div>
                    <ArrowRight className="size-4 text-[#8a8f98] group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                );
              })}
            </CardBody>
          </Card>

          {/* Resident Quick Links Pill Grid */}
          <Card>
            <CardHeader>
              <CardTitle title="Estate Services" subtitle="Quick Shortcuts" />
            </CardHeader>
            <CardBody padded={true}>
              <div className="grid grid-cols-4 gap-2">
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
            </CardBody>
          </Card>
        </div>

        {/* Center & Right Columns (8 cols): Active Table & Billing / Announcements */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Maintenance & Service Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle icon={Wrench} title="Active Service Requests" subtitle={`${outstandingServices.length} requests in progress`} live={true} />
              <Link href="/dashboard/resident/maintenance/new">
                <Button variant="primary" size="sm" className="rounded-full">
                  + New Request
                </Button>
              </Link>
            </CardHeader>
            <CardBody padded={false}>
              {outstandingServices.length === 0 ? (
                <EmptyState
                  icon={Wrench}
                  title="No active requests"
                  description="You have no ongoing service requests at the moment."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#1a1d23]/50 bg-[#0B0C11] border-none">
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Request ID</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Category</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Description</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0">
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
              )}
            </CardBody>
          </Card>

          {/* Billing & Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Billing Card */}
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle icon={CreditCard} title="Billing Summary" subtitle="Current Account Balance" />
                  <MoreHorizontal className="size-4 text-[#8a8f98] cursor-pointer" />
                </CardHeader>
                <CardBody padded={true}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8f98] text-[#8a8f98]">Total Outstanding</p>
                  <h2 className="text-3xl font-extrabold text-white text-white mt-1 mb-4">
                    ${totalOutstanding}.00
                  </h2>
                  <div className="space-y-2.5">
                    {outstandingServices.slice(0, 3).map((service) => (
                      <BillItem
                        key={service.id}
                        icon={service.icon}
                        label={service.category}
                        amount="$225.00"
                      />
                    ))}
                    {!outstandingServices.length && (
                      <p className="text-xs text-[#8a8f98] text-[#8a8f98] py-3 text-center">No outstanding bills on account.</p>
                    )}
                  </div>
                </CardBody>
              </div>
              <div className="p-5 pt-0">
                <Link href="/dashboard/resident/finance" className="block">
                  <Button variant="amber" size="lg" className="w-full rounded-full font-bold">
                    Pay Now
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Announcements Card */}
            <Card>
              <CardHeader>
                <CardTitle icon={Megaphone} title="Announcements" subtitle="Estate Updates" />
                <Link href="/dashboard/resident/announcements" className="text-xs font-semibold text-[#1241a1] text-blue-400 hover:underline">
                  View All
                </Link>
              </CardHeader>
              <CardBody padded={true}>
                {announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map((ann, idx) => (
                      <AnnouncementItem
                        key={ann.id || idx}
                        icon={ann.icon === 'pool' ? Waves : Megaphone}
                        title={ann.title}
                        desc={ann.content}
                        time={ann.timestamp || 'Just now'}
                        urgent={ann.urgent}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Megaphone}
                    title="No announcements"
                    description="You have no announcements at the moment."
                  />
                )}
              </CardBody>
            </Card>

          </div>

        </div>

      </div>
    </div>
  )
}


