'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, ArrowLeft, Home, Users, CheckCircle2, Phone, Mail, 
  UserCog, Wrench, MoreHorizontal, Eye, Bell, Search, Calendar, 
  Download, BellRing as NotificationImportant, Car as CarRepair, Info, ArrowRight as ArrowForward,
  Construction, CreditCard as Payments, Badge, Shield, MapPin as PersonPinCircle, AlertTriangle as Warning
} from 'lucide-react';
import { api } from '@/services/api';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { BackButton } from '@/components/ui/BackButton';

export default function BuildingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [building, setBuilding] = useState(null);
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadAllData(id);
    }
  }, [id]);

  const loadAllData = async (buildingId) => {
    setIsLoading(true);
    setError(null);
    try {
      const [blockData, residentsData, alertsData, staffData, visitorsData] = await Promise.all([
        api.getBuildingById(buildingId),
        api.getResidentsByBuildingId(buildingId),
        api.getAlerts(),
        api.getStaffMembers(),
        api.getVisitors()
      ]);
      
      setBuilding(blockData);
      setResidents(residentsData);
      setActiveAlerts(alertsData || []);
      setStaffCount(staffData?.length || 42); // Placeholder if empty
      setVisitorCount(visitorsData?.length || 156); // Placeholder if empty
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Could not locate estate data. It may have been removed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <DataStateLayout 
        isLoading={isLoading} 
        error={error} 
        hasData={!!building}
        onRetry={() => loadAllData(id)}
      >
        {building && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BackButton fallbackRoute="/dashboard/admin/estates" label="Estates" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{building.name} Overview</h2>
                <p className="text-slate-500">Monitoring status for {building.name} • Ref: {building.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  <Calendar className="w-4 h-4" />
                  Oct 24 - Oct 31, 2023
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                icon={<Home className="w-6 h-6" />} 
                label="Total Residents" 
                value={residents.length} 
                trend="+2.5%" 
                color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              />
              <MetricCard 
                icon={<Warning className="w-6 h-6" />} 
                label="Active Alerts" 
                value={activeAlerts.length || 3} 
                trend="-10%" 
                color="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
              />
              <MetricCard 
                icon={<Shield className="w-6 h-6" />} 
                label="Staff On-duty" 
                value={staffCount} 
                trend="Static" 
                color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
              />
              <MetricCard 
                icon={<PersonPinCircle className="w-6 h-6" />} 
                label="Visitor Count" 
                value={visitorCount} 
                trend="+12%" 
                color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Estate Health Index</h3>
                  <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-500">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 flex flex-col justify-end">
                  <div className="relative h-48 w-full group">
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <path className="fill-primary/10" d="M0,120 C50,110 100,50 150,70 C200,90 250,20 300,40 C350,60 400,10 500,30 L500,150 L0,150 Z"></path>
                      <path className="stroke-primary" d="M0,120 C50,110 100,50 150,70 C200,90 250,20 300,40 C350,60 400,10 500,30" fill="none" strokeWidth="3"></path>
                    </svg>
                  </div>
                  <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
                    <span>WEEK 1</span>
                    <span>WEEK 2</span>
                    <span>WEEK 3</span>
                    <span>WEEK 4</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Security Incidents (Weekly)</h3>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <span className="size-2 rounded-full bg-primary"></span> Serious
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <span className="size-2 rounded-full bg-slate-300"></span> Minor
                    </span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 px-2">
                  {[0.25, 0.66, 0.5, 0.83, 0.33, 0.66, 0.25].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group overflow-hidden" style={{ height: `${h * 100}%` }}>
                      <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-lg" style={{ height: `${h * 80}%` }}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
              </div>
            </div>

            {/* Alert Feed & Visitors */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Security Feed */}
              <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <h3 className="font-bold text-lg">Active Security Alerts</h3>
                  <button className="text-sm font-semibold text-primary hover:underline" onClick={() => router.push('/dashboard/admin/emergencies')}>View All</button>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  <AlertItem 
                    icon={<Bell className="w-5 h-5" />} 
                    title="Unauthorized Perimeter Access" 
                    time="2 mins ago" 
                    desc="Zone 4 (North Gate) thermal sensor triggered. Security unit dispatched."
                    color="text-red-600 bg-red-100 dark:bg-red-900/30"
                    actions
                  />
                  <AlertItem 
                    icon={<CarRepair className="w-5 h-5" />} 
                    title="Parking Violation" 
                    time="1 hour ago" 
                    desc="Silver Sedan (ABC-1234) parked in Fire Lane at Block C entrance."
                    color="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                  />
                  <AlertItem 
                    icon={<Info className="w-5 h-5" />} 
                    title="System Maintenance" 
                    time="3 hours ago" 
                    desc="Scheduled firmware update for elevator access controls at Block A completed."
                    color="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                  />
                </div>
              </div>

              {/* Visitor Stats */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6">Recent Residents</h3>
                <div className="space-y-6">
                  {residents.slice(0, 4).map((res, idx) => (
                    <div key={res.id || idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{res.name}</p>
                          <p className="text-xs text-slate-500">Unit {res.unit} - {res.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${res.status === 'verified' ? 'text-green-500 bg-green-500/10' : 'text-slate-400 bg-slate-400/10'}`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  View All Residents
                  <ArrowForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard 
                icon={<Badge className="w-8 h-8" />} 
                title="Staff Management" 
                desc="Assign shifts, track performance and manage payroll."
                color="bg-primary"
                link="#"
              />
              <QuickActionCard 
                icon={<Construction className="w-8 h-8" />} 
                title="Maintenance" 
                desc="Track service requests and schedule repairs."
                color="bg-emerald-600"
                link="#"
              />
              <QuickActionCard 
                icon={<Payments className="w-8 h-8" />} 
                title="Billing & Fees" 
                desc="Manage estate levies and resident utility bills."
                color="bg-indigo-600"
                link="#"
              />
            </div>
          </div>
        )}
      </DataStateLayout>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className={`size-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'text-green-500 bg-green-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function AlertItem({ icon, title, time, desc, color, actions }) {
  return (
    <div className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <div className={`size-10 rounded-full flex flex-shrink-0 items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold">{title}</h4>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <p className="text-sm text-slate-500">{desc}</p>
        {actions && (
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Acknowledge</button>
            <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">View Live Feed</button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, desc, color, link }) {
  return (
    <div className={`${color} p-6 rounded-2xl text-white relative overflow-hidden group shadow-lg`}>
      <div className="relative z-10">
        <div className="mb-4">{icon}</div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-white/80 text-sm mb-4">{desc}</p>
        <a className="inline-flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors" href={link}>
          Manage
          <ArrowForward className="w-4 h-4" />
        </a>
      </div>
      {/* Background Icon Watermark */}
      <div className="absolute -right-4 -bottom-4 text-white/10 opacity-20 scale-[5.0] group-hover:scale-[5.5] transition-transform duration-500">
        {icon}
      </div>
    </div>
  );
}