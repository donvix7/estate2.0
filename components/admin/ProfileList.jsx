'use client'

import React, { useState, useEffect } from 'react';
import { Search, User, MoreHorizontal, Eye, Edit, Trash2, Users, Home, Wrench, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CleanTable } from '@/components/ui/CleanTable';
import { AlertModal } from '@/components/ui/AlertModal';
import { getAllProfiles } from '@/lib/service';
import { deleteProfile } from '@/lib/action';
import { toast } from 'react-toastify';
import MetricCard from '@/components/MetricCard';
import Link from 'next/link';



export default function ProfileList() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActionProfile, setSelectedActionProfile] = useState(null);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });
  const [profileToDelete, setProfileToDelete] = useState(null);

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProfiles();
        setProfiles(data.docs);
        setFilteredProfiles(data.docs);
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };


    loadProfiles();

  }, []);

  useEffect(() => {

    let filtered = profiles;
    
    if (searchTerm) {

      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.phone.toLowerCase().includes(term) ||
        (profile.unitNumber && profile.unitNumber.toLowerCase().includes(term)) ||
        (profile.role && profile.role.toLowerCase().includes(term))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(profile => profile.status === statusFilter);
    }
    
    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, statusFilter]);

  const handleProfileSelect = (profile) => {
    router.push(`/dashboard/admin/users/${profile.id}`);
  };

  const confirmDelete = async () => {
    if (profileToDelete) {
      try {
        await deleteProfile(profileToDelete.id);
        setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
        toast.success(`Profile for ${profileToDelete.name} deleted successfully`);
      } catch (error) {
        console.error('Error deleting profile:', error);
        toast.error('Failed to delete profile. Please try again.');
      } finally {
        setProfileToDelete(null);
      }
    }
  };

  const handleAction = (e, action, profile) => {
    e.stopPropagation();
    setSelectedActionProfile(null);
    if (action === 'view') {
      router.push(`/dashboard/admin/users/${profile.id}`);
    } else if (action === 'edit') {
      router.push(`/dashboard/admin/users/${profile.id}?edit=true`);
    } else if (action === 'delete') {
      setProfileToDelete(profile);
    }
  };

  const handleOptionsClick = (e, profile) => {
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 192; // Approximate width of w-48
    const dropdownHeight = 136; // Approximate height of the menu
    
    // Check if dropdown would go off right side of screen
    let left = rect.left;
    if (rect.left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 16;
    }
    
    // Check if dropdown would go off bottom of screen
    let top = rect.bottom + 8;
    if (rect.bottom + dropdownHeight > window.innerHeight) {
      // Pop upwards instead of downwards
      top = rect.top - dropdownHeight - 8;
    }
    
    setActionMenuPos({ top, left });
    
    setSelectedActionProfile(profile);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the option button or the modal itself
      if (!e.target.closest('.options-dropdown-container') && !e.target.closest('.options-modal-container')) {
        setSelectedActionProfile(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getProfileTypeLabel = (type) => {
    switch(type) {
      case 'resident': return 'Resident';
      case 'staff': return 'Staff';
      case 'security': return 'Security';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/80 rounded-xl shadow-sm p-8 flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1241a1]"></div>
      </div>
    );
  }
  const menuOptions = [
    { label: 'View Details', action: 'view', icon: <Eye /> },
    { label: 'Edit Profile', action: 'edit', icon: <Edit /> },
    { label: 'Delete User', action: 'delete', icon: <Trash2 /> },
  ];

  return (
    <div className="flex flex-col gap-8 -m-4 lg:-m-8 animate-in fade-in duration-700 p-6 lg:p-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Users className="size-5" />} 
          label="Total Users" 
          value={profiles.length} 
          trend="Live" 
          trendColor="text-blue-500" 
          bgColor="bg-blue-100 dark:bg-blue-900/30" 
          iconColor="text-blue-600" 
        />
        <MetricCard 
          icon={<Home className="size-5" />} 
          label="Residents" 
          value={profiles.filter(p => p.type === 'resident').length} 
          trend="+2.5%" 
          trendColor="text-green-500" 
          bgColor="bg-emerald-100 dark:bg-emerald-900/30" 
          iconColor="text-emerald-600" 
        />
        <MetricCard 
          icon={<Wrench className="size-5" />} 
          label="Staff" 
          value={profiles.filter(p => p.type === 'staff').length} 
          trend="Stable" 
          trendColor="text-slate-400" 
          bgColor="bg-amber-100 dark:bg-amber-900/30" 
          iconColor="text-amber-500" 
        />
        <MetricCard 
          icon={<ShieldCheck className="size-5" />} 
          label="Security" 
          value={profiles.filter(p => p.type === 'security').length} 
          trend="Active" 
          trendColor="text-blue-500" 
          bgColor="bg-indigo-100 dark:bg-indigo-900/30" 
          iconColor="text-indigo-600" 
        />
      </div>

      <div className="bg-white/90 dark:bg-slate-900/80 rounded-xl shadow-sm p-6">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative rounded-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-slate-50 dark:bg-slate-800/50"
            />
            <span className="absolute left-3 top-3 text-gray-400"><Search className="w-5 h-5" /></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-slate-50 dark:bg-slate-800/50"
          >
            {['all', 'active', 'inactive', 'pending'].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>
                    
      {/* Profiles Data Presentation */}
      <div className="w-full">
        {/* Mobile View (Cards) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredProfiles.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No people found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {searchTerm ? 'Try a different search term' : 'Add new people to get started'}
              </p>
            </div>
          ) : (
            filteredProfiles.map((profile, index) => (
              <div 
                key={profile.id || profile._id || index}
                onClick={() => handleProfileSelect(profile)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-50 dark:border-slate-800/50 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                        {profile.profileImage || <User className="w-6 h-6 text-slate-400" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-lg">
                          {profile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                          ID: {profile.id || profile._id || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="relative options-dropdown-container">
                        <button 
                          onClick={(e) => handleOptionsClick(e, profile)}
                          className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Contact</p>
                      <p className="text-xs text-slate-900 dark:text-slate-200 font-bold truncate">{profile.phone || 'No Phone'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Type</p>
                      <p className="text-xs text-slate-900 dark:text-slate-200 font-bold">{getProfileTypeLabel(profile.type)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Role / Designation</p>
                      <p className="text-xs font-bold text-[#1241a1] dark:text-blue-400">
                        {profile.role || profile.occupation || profile.unit || 'No Detail Provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto max-h-[500px] overflow-y-auto">
          <CleanTable
            headers={['Profile', 'ID', 'Contact',  '']}
            data={filteredProfiles}
            onRowClick={handleProfileSelect}
            emptyState={
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No people found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  {searchTerm ? 'Try a different search term' : 'Add new people to get started'}
                </p>
              </div>
            }
            renderRow={(profile) => (
              <>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-lg shadow-inner">
                      {profile.profileImage || <User className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {profile.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {profile.role || profile.occupation || 'No Role'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className=" font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                    {profile.id || profile._id || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-900 dark:text-white font-medium">{profile.email}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{profile.phone}</span>
                  </div>
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link 
                    href={`/dashboard/admin/users/${profile.id || profile._id}`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 text-[#1241a1] hover:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <Eye size={14} />
                    View 
                  </Link>
                </td>
              </>
            )}
          />
        </div>
      </div>

      {/* Options Actions Modal */}
      {selectedActionProfile && (
        <div 
          className="fixed inset-0 z-50 options-modal-container"
          onClick={() => setSelectedActionProfile(null)}
        >
          <div 
            className="absolute px-4  bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-64  overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-2"
            style={{ 
              top: `${actionMenuPos.top}px`, 
              left: `${actionMenuPos.left}px`,
              transform: 'translateY(4px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuOptions.map((option) => (
              <button 
                key={option.action}
                onClick={(e) => handleAction(e, option.action, selectedActionProfile)}
                className="w-full mt-2 text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </button>
            ))} 
          </div>
        </div>
      )}

      <AlertModal
        isOpen={!!profileToDelete}
        onClose={() => setProfileToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to permanentely delete the profile for ${profileToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        type="error"
        showCancel={true}
      />
      </div>
    </div>
  );
}
