'use client'

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Shield, ShieldAlert, CheckCircle, Clock, MoreVertical } from 'lucide-react';

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSecurityLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch security logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const headers = ['Name','Purpose of Visit', 'Recipient',  'Time of Entry', 'Exit Time','Date', ''];

  const renderRow = (item, index) => {
    const timeString = item.timestamp || item.time || item.entryTime;
    const dateObj = timeString ? new Date(timeString) : null;
    
    const formattedDate = dateObj ? dateObj.toLocaleDateString([], {
      month: 'short', day: 'numeric', year: 'numeric'
    }) : 'N/A';
    
    const timeOfEntry = dateObj ? dateObj.toLocaleTimeString([], {
      hour: '2-digit', minute:'2-digit'
    }) : 'N/A';

    const exitTime = item.exitTime ? new Date(item.exitTime).toLocaleTimeString([], {
      hour: '2-digit', minute:'2-digit'
    }) : '-';
    
    const purpose = item.purpose || item.action || 'Visit';
    const recipient = item.recipient || item.resident || 'N/A';
    const name = item.visitorName || item.name || 'Unknown Visitor';
    
    return (
      <React.Fragment key={item.id || index}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {name}
            </span>
            {item.visitorCode && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Code: {item.visitorCode}
              </span>
            )}
            {item.message && (
              <span className="text-xs text-red-500 mt-0.5">{item.message}</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900 dark:text-white">
            {purpose}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {recipient}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 w-fit px-2 py-1 rounded bg-gray-50 dark:bg-gray-800">
            <Clock className="w-3.5 h-3.5" />
            {timeOfEntry}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {exitTime === '-' ? '-' : (
            <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 w-fit px-2 py-1 rounded bg-gray-50 dark:bg-gray-800">
              <Clock className="w-3.5 h-3.5" />
              {exitTime}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical className="w-5 h-5" />
          </button>
        </td>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm  overflow-hidden">
     
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                  No security logs or incidents recorded recently.
                </td>
              </tr>
            ) : (
              logs.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  {renderRow(item, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
