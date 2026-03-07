'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, ArrowLeft, Home, Users, CheckCircle2, Phone, Mail, UserCog, Wrench, MoreHorizontal, Eye } from 'lucide-react';
import { api } from '@/services/api';
import { CleanTable } from '@/components/ui/CleanTable';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { BackButton } from '@/components/ui/BackButton';

export default function BuildingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [building, setBuilding] = useState(null);
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (id) {
      loadBuildingData(id);
    }
  }, [id]);

  const loadBuildingData = async (buildingId) => {
    setIsLoading(true);
    setError(null);
    try {
      const [blockData, residentsData] = await Promise.all([
        api.getBuildingById(buildingId),
        api.getResidentsByBuildingId(buildingId)
      ]);
      setBuilding(blockData);
      setResidents(residentsData);
    } catch (err) {
      console.error('Failed to load building data:', err);
      setError('Could not locate building data. It may have been removed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Operational
          </span>
        );
      case 'fully occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            Fully Occupied
          </span>
        );
      case 'under maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Wrench className="w-3.5 h-3.5" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const residentHeaders = [
    'Resident Name',
    'Contact Info',
    'Unit',
    'Status',
    ''
  ];

  const renderResidentRow = (resident) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            {resident.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{resident.name}</div>
            <div className="text-xs text-gray-500 capitalize">{resident.role}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
             <Mail className="w-3.5 h-3.5" />
             {resident.email}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          <Home className="w-3.5 h-3.5 mr-1.5" />
          {resident.unit}
        </span>
      </td>
      <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border-none ${
            resident.status === 'verified' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {resident.status}
          </span>
      </td>
      <td className="px-6 py-4">
         <div className="relative" ref={openDropdownId === resident.id ? dropdownRef : null}>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-none"
              onClick={(e) => {
                 e.stopPropagation();
                 setOpenDropdownId(openDropdownId === resident.id ? null : resident.id);
              }}
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {openDropdownId === resident.id && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-none z-50 flex flex-col py-2 animate-fade-in">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); router.push(`/dashboard/admin/users/${resident.id}`); }} 
                   className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 w-full text-left font-medium text-sm transition-colors border-none"
                 >
                    <Eye className="w-4 h-4 text-gray-400" />
                    View Profile
                 </button>
                 <a 
                   href={`mailto:${resident.email}`}
                   onClick={(e) => e.stopPropagation()} 
                   className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 w-full text-left font-medium text-sm transition-colors border-none"
                 >
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Resident
                 </a>
              </div>
            )}
         </div>
      </td>
    </>
  );

  const renderMobileResident = (resident) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            {resident.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{resident.name}</div>
            <div className="text-xs text-gray-500 capitalize">{resident.role}</div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5 border-none">
         <Mail className="w-4 h-4 text-gray-400" />
         {resident.email}
      </div>
      <div className="flex justify-between items-center mt-2 pt-3 border-none">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-none">
          <Home className="w-3.5 h-3.5 mr-1.5" />
          {resident.unit}
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none ${
            resident.status === 'verified' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          }`}>
            {resident.status}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 border-none">
          <button 
             onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/admin/users/${resident.id}`); }}
             className="py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center justify-center gap-2 border-none"
          >
             <Eye className="w-4 h-4" /> View Profile
          </button>
          <a 
             href={`mailto:${resident.email}`}
             onClick={(e) => e.stopPropagation()}
             className="py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold flex items-center justify-center gap-2 border-none"
          >
             <Mail className="w-4 h-4" /> Email Resident
          </a>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in min-h-screen">
      <BackButton fallbackRoute="/dashboard/admin/estates" label="Back to Estates" />
      
      {/* Main Content Rendered within DataStateLayout */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={error} 
        hasData={!!building}
        onRetry={() => loadBuildingData(id)}
      >
        {building && (
          <div className="bg-transparent border-none">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                     <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                       <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{building.name}</h1>
                       {getStatusBadge(building.status)}
                     </div>
                     <p className="font-mono text-sm text-gray-500 bg-gray-100 dark:bg-gray-900/50 px-2 py-1 rounded-lg w-fit">
                        Ref: {building.id}
                     </p>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl w-full md:w-auto min-w-[250px]">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5"><UserCog className="w-4 h-4"/> Block Manager</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{building.manager}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {building.managerPhone}</span>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                       <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Infrastructure</h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white flex items-end gap-2">
                     {building.totalUnits} <span className="text-sm font-normal text-gray-500 mb-1">units available</span>
                  </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                       <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((building.occupiedUnits / building.totalUnits) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-end mb-2 text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Current Occupancy</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{building.occupiedUnits} / {building.totalUnits}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden mt-2">
                     <div 
                       className={`h-3 rounded-full ${((building.occupiedUnits / building.totalUnits) * 100) === 100 ? 'bg-blue-500' : ((building.occupiedUnits / building.totalUnits) * 100) > 50 ? 'bg-green-500' : 'bg-amber-500'}`} 
                       style={{ width: `${(building.occupiedUnits / building.totalUnits) * 100}%` }}
                     ></div>
                  </div>
              </div>
            </div>

            {/* Residents Table */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8 flex items-center gap-2">
               <Users className="w-5 h-5 text-indigo-500" />
               Current Residents
               <span className="text-sm font-normal bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full text-gray-600 dark:text-gray-300 ml-2">
                  {residents.length}
               </span>
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden">
              <CleanTable
                  headers={residentHeaders}
                  data={residents}
                  renderRow={renderResidentRow}
                  emptyState="No residents are currently assigned to this building."
                  renderMobileItem={renderMobileResident}
              />
            </div>
          </div>
        )}
      </DataStateLayout>
    </div>
  );
}