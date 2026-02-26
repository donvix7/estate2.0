"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert } from 'lucide-react';
import { CleanTable } from '@/components/ui/CleanTable';
import { getSecurityLogs } from '@/lib/service';

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const data = await getSecurityLogs();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error('Failed to load security logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLogs();
  }, []);

  useEffect(() => {
    let result = logs;

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.event.toLowerCase().includes(lowercasedSearch) ||
        log.location.toLowerCase().includes(lowercasedSearch) ||
        log.id.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (severityFilter !== 'All') {
      result = result.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(result);
  }, [searchTerm, severityFilter, logs]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200 dark:bg-transparent dark:text-red-400 dark:border-red-400/30';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-transparent dark:text-orange-400 dark:border-orange-400/30';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-transparent dark:text-amber-400 dark:border-amber-400/30';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-transparent dark:text-blue-400 dark:border-blue-400/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-transparent dark:text-gray-400 dark:border-gray-400/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading tracking-tight">Security Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">Review historical security events and incident reports.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs by ID, event or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:border-blue-500 dark:text-white transition-colors"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none focus:ring-2 focus:border-blue-500 dark:text-white transition-colors"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Info">Info</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredLogs.length > 0 ? (
          <CleanTable>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Time & Date</th>
                <th>Event / Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Action By</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-gray-500 dark:text-gray-400">{log.id}</td>
                  <td>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{log.date}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{log.time}</div>
                  </td>
                  <td>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{log.event}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{log.location}</div>
                  </td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${getSeverityStyles(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {log.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </CleanTable>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldAlert className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No logs found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              We couldn't find any security logs matching your current filters. Try changing your search terms or severity filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
