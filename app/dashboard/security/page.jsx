"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, Users, AlertTriangle, Cctv, CheckCircle2 } from 'lucide-react';
import { TechCard } from '@/components/ui/TechCard';
import { CleanTable } from '@/components/ui/CleanTable';
import { getAlerts, getVisitors } from '@/lib/service';

export default function SecurityDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertsData, visitorsData] = await Promise.all([
          getAlerts(),
          getVisitors()
        ]);
        setAlerts(alertsData || []);
        
        // Let's filter for active/expected visitors for security overview
        const activeVisitors = (visitorsData || []).filter(v => ['Active', 'Pending', 'Expected'].includes(v.status));
        setVisitors(activeVisitors);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'Critical' || a.severity === 'High');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading tracking-tight">Security Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">Real-time monitoring and threat assessment.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TechCard className="border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Alerts</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{criticalAlerts.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-xs text-red-500 mt-4 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Requires immediate attention
          </p>
        </TechCard>

        <TechCard className="border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Security Personnel</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-blue-500 mt-4 font-medium">Currently on shift</p>
        </TechCard>

        <TechCard className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Visitors</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{visitors.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-amber-500 mt-4 font-medium">Inside premises</p>
        </TechCard>

        
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <TechCard className="flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Activity Feed</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-500' :
                        alert.severity === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title || 'Security Alert'}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.description || 'Details unavailable'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{alert.time || 'Just now'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <ShieldAlert className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No recent security alerts</p>
                <p className="text-sm text-gray-400 mt-1">The premises are secure.</p>
              </div>
            )}
          </div>
        </TechCard>

        {/* Expected/Active Visitors */}
        <TechCard className="flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Currently on Premises</h2>
          <div className="flex-1 overflow-y-auto">
            {visitors.length > 0 ? (
              <CleanTable>
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Destination</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{visitor.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{visitor.purpose || 'Visit'}</div>
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 text-sm">Unit {visitor.unitNumber || 'N/A'}</td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                          visitor.status === 'Active' 
                            ? 'text-amber-700 border-amber-200 bg-amber-50 dark:bg-transparent dark:text-amber-400 dark:border-amber-400/30' 
                            : 'text-blue-700 border-blue-200 bg-blue-50 dark:bg-transparent dark:text-blue-400 dark:border-blue-400/30'
                        }`}>
                          {visitor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CleanTable>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No active visitors</p>
                <p className="text-sm text-gray-400 mt-1">There are currently no recorded visitors inside.</p>
              </div>
            )}
          </div>
        </TechCard>
      </div>
    </div>
  );
}