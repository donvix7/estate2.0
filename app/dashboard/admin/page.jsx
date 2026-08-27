'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home,
  Wrench,
  Receipt,
  ShieldAlert,
  Construction,
  Megaphone,
  Map,
  Calendar,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  Tag,
  UserCheck,
  Activity,
  ArrowRight,
  Shield,
  Sliders,
  Sparkles
} from 'lucide-react'
import {
  getAnnouncements,
  getPendingInvites,
  getStaffMembers,
  getAllProfiles,
  getAllServiceRequests,
  getInvoices,
  getAdminSecurityLogs,
  getLostAndFound,
  getAdminData,
  getEstateData,
  getVisitors,
  getAllGates
} from '@/lib/service'
import MetricCard from '@/components/MetricCard'
import VisitorItem from '@/components/VisitorItem'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
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
  const [searchTerm, setSearchTerm] = useState('')

  // UI State
  const [isLoading, setIsLoading] = useState(true)

  const quickLinks = [
    {
      icon: UserCheck,
      title: "Staff Hub",
      desc: "Assign shifts, track performance & payroll.",
      href: "/dashboard/admin/service_workers",
      bgColor: "bg-[#1241a1]",
      tone: 'blue'
    },
    {
      icon: Construction,
      title: "Maintenance",
      desc: "Track work orders & contractor tasks.",
      href: "/dashboard/admin/service-request",
      bgColor: "bg-amber-500",
      tone: 'amber'
    },
    {
      icon: Receipt,
      title: "Finance",
      desc: "Manage invoices, payments, & budgets.",
      href: "/dashboard/admin/finance",
      bgColor: "bg-rose-500",
      tone: 'rose'
    }
  ]

  const [residents, setResidents] = useState([])
  const [workers, setWorkers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [lostAndFound, setLostAndFound] = useState([])
  const [estate, setEstate] = useState([])
  const [serviceRequests, setServiceRequests] = useState([])
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
      icon: <Home className="size-5" />,
      label: "Total Residents",
      value: residents.length,
      trend: "Registered",
      trendColor: "text-emerald-500",
      tone: "blue"
    },
    {
      icon: <Wrench className="size-5" />,
      label: "Service Requests",
      value: serviceRequests.filter(l => l.status?.toLowerCase() === 'pending').length,
      trend: "Pending",
      trendColor: "text-amber-500",
      tone: "amber"
    },
    {
      icon: <Receipt className="size-5" />,
      label: "Unpaid Invoices",
      value: invoices.length,
      trend: "Action Needed",
      trendColor: "text-rose-500",
      tone: "rose"
    },
    {
      icon: <ShieldAlert className="size-5" />,
      label: "Security Incidents",
      value: securityLogs.length,
      trend: securityLogs.filter(l => l.severity === 'High').length > 0 ? "High Priority" : "Monitored",
      trendColor: securityLogs.filter(l => l.severity === 'High').length > 0 ? "text-rose-500" : "text-emerald-500",
      tone: "indigo"
    },
    {
      icon: <Tag className="size-5" />,
      label: "Lost & Found",
      value: lostAndFound.filter(item => !item.resolved).length,
      trend: "Unresolved",
      trendColor: "text-amber-500",
      tone: "emerald"
    }
  ]

  const filteredSecurityLogs = securityLogs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (log.type || '').toLowerCase().includes(term) || (log.location || '').toLowerCase().includes(term);
  });

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-12">
      {/* Executive Header Bar */}
      <PageHeader
        title="Estate Control Center"
        description={`Real-time monitoring & command center for ${userData?.estateID || estate?.name || 'Estate'}`}
        icon={Home}
        iconColor="blue"
      >
        <Button variant="secondary" size="md" icon={Calendar} className="rounded-full">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Overview
        </Button>
        <Button variant="indigo" size="md" icon={Download} className="rounded-full">
          Export Report
        </Button>
      </PageHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-5">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            trendColor={metric.trendColor}
            tone={metric.tone}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-[#1a1d23]/40 bg-[#1a1d23]/30 backdrop-blur-md p-3 rounded-2xl border-none shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search residents, security logs, work orders, or invoices..."
          className="w-full"
          color={'indigo'}
        />
      </div>

      {/* Main 3-Column Reference Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Hub Links */}
          <Card>
            <CardHeader>
              <CardTitle icon={Activity} title="Hub Control" subtitle="Administrative Modules" live={true} />
            </CardHeader>
            <CardBody padded={true} className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className="group block">
                  <div className="p-3.5 bg-[#1a1d23]/80 bg-[#0d0f13] hover:bg-[#1a1d23]/60 hover:bg-[#2a2d33]/30 rounded-xl border-none transition-all flex items-center gap-3 shadow-inner">
                    <div className={`size-10 rounded-lg ${link.bgColor} text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                      <link.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{link.title}</h4>
                      <p className="text-xs text-[#8a8f98] truncate">{link.desc}</p>
                    </div>
                    <ArrowRight className="size-4 text-[#8a8f98] group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </Link>
              ))}
            </CardBody>
          </Card>

          {/* Quick System Stats */}
          <Card>
            <CardHeader>
              <CardTitle icon={Shield} title="Estate Status" subtitle="System Metrics" />
            </CardHeader>
            <CardBody padded={true} className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#1a1d23]/80 bg-[#0d0f13] rounded-xl border-none shadow-inner">
                <span className="text-xs font-semibold text-[#8a8f98]">Active Staff</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1241a1]/10 text-[#1241a1] text-[#1241a1] border-none">{staffMembers.length} Active</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#1a1d23]/80 bg-[#0d0f13] rounded-xl border-none shadow-inner">
                <span className="text-xs font-semibold text-[#8a8f98]">Pending Invites</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-amber-400 border-none">{pendingInvites.length} Pending</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#1a1d23]/80 bg-[#0d0f13] rounded-xl border-none shadow-inner">
                <span className="text-xs font-semibold text-[#8a8f98]">Total Visitors Today</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none">{visitors.length} Logged</span>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Center & Right Column (8 cols): Main Incident Feed Table & Access Stream */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Security Incidents Data Grid */}
          <Card>
            <CardHeader>
              <CardTitle
                icon={ShieldAlert}
                title="Recent Security Incidents & Logs"
                subtitle={`${filteredSecurityLogs.length} unverified incidents requiring review`}
                live={true}
              />
              <Link href="/dashboard/admin/security">
                <Button variant="secondary" size="sm" className="rounded-full border-none">
                  See All Logs
                </Button>
              </Link>
            </CardHeader>
            <CardBody padded={false}>
              {filteredSecurityLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#1a1d23]/50 bg-[#0d0f13] border-none">
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Incident Type</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Location</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Date & Time</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0">
                      {filteredSecurityLogs.slice(0, 5).map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-[#1a1d23]/40 hover:bg-[#2a2d33] transition-colors border-none">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                                log.typeId === 'lost_found'
                                  ? 'bg-emerald-500/10 text-emerald-600 text-emerald-400'
                                  : log.severity === 'High'
                                    ? 'bg-rose-500/10 text-rose-600 text-rose-400'
                                    : 'bg-amber-500/10 text-amber-600 text-amber-400'
                              }`}>
                                {log.severity === 'High' ? <AlertTriangle className="size-4" /> : <ShieldAlert className="size-4" />}
                              </div>
                              <span className="font-bold text-white text-xs md:text-sm">{log.type}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#8a8f98] font-medium">
                            {log.location || 'Gate 1'}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#8a8f98]">
                            {new Date(log.createdAt || Date.now()).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <StatusBadge
                              status={log.status === 'Completed' || log.status === 'Resolved' ? 'Resolved' : log.status || 'Pending'}
                              tone={log.status === 'Completed' || log.status === 'Resolved' ? 'green' : 'amber'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={ShieldAlert}
                  title="No Recent Logs"
                  description="All systems are currently reported as secure."
                />
              )}
            </CardBody>
          </Card>

          {/* Access Stream Card */}
          <Card>
            <CardHeader>
              <CardTitle
                icon={Tag}
                title="Live Visitor Access Log"
                subtitle={`${visitors.length} visitors logged in current session`}
              />
            </CardHeader>
            <CardBody padded={true}>
              {visitors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visitors.slice(0, 6).map((visitor, index) => (
                    <VisitorItem
                      key={index}
                      name={visitor.name || visitor.visitor}
                      role={visitor.type || 'Visitor'}
                      status={visitor.status || 'Verified'}
                      img={visitor.img || visitor.image}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Map}
                  title="No recent visitors"
                  description="Visitors will appear here as they access the estate."
                />
              )}
            </CardBody>
          </Card>

        </div>

      </div>

      <footer className="mt-6 py-6 text-center border-t border-[#2a2d33]/40 border-[#2a2d33]">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8a8f98]">
          © 2024 Estate Admin Portal • System Health: <span className="text-emerald-500 font-semibold">Optimal ● Live</span>
        </p>
      </footer>

    </div>
  )
}

