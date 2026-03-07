'use client'

import React, { useState, useEffect } from 'react';
import { Search, User, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CleanTable } from '@/components/ui/CleanTable';

const mockAPI = {
  async getAllProfiles() {
    // Return some simulated data with an artificial delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'RES001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 234 567 8900',
            type: 'resident',
            status: 'active',
            unitNumber: 'A-101',
            profileImage: <User/>,
            role: 'Resident'
          },
          {
            id: 'STF001',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1 234 567 8901',
            type: 'staff',
            status: 'active',
            role: 'Facility Manager',
            department: 'Management',
            profileImage: <User/>
          },
          {
            id: 'SEC001',
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            phone: '+1 234 567 8902',
            type: 'security',
            status: 'active',
            shift: 'Morning (6 AM - 2 PM)',
            badgeNumber: 'SEC-001',
            profileImage: <User/>
          }
        ]);
      }, 500);
    });
  }
};

export default function ProfileList() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActionProfile, setSelectedActionProfile] = useState(null);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const data = await mockAPI.getAllProfiles();
        setProfiles(data);
        setFilteredProfiles(data);
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

  const handleAction = (e, action, profile) => {
    e.stopPropagation();
    setSelectedActionProfile(null);
    if (action === 'view') {
      router.push(`/dashboard/admin/users/${profile.id}`);
    } else if (action === 'edit') {
      router.push(`/dashboard/admin/users/${profile.id}?edit=true`);
    } else if (action === 'delete') {
      // In a real app we would usually trigger a modal here
      // For now, prompt the user natively or alert them
      if (window.confirm(`Are you sure you want to delete ${profile.name}?`)) {
        setProfiles(prev => prev.filter(p => p.id !== profile.id));
      }
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const menuOptions = [
    { label: 'View Details', action: 'view', icon: <Eye /> },
    { label: 'Edit Profile', action: 'edit', icon: <Edit /> },
    { label: 'Delete User', action: 'delete', icon: <Trash2 /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative rounded-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="w-full p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
            />
            <span className="absolute left-3 top-3 text-gray-400"><Search className="w-5 h-5" /></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
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
                key={profile.id || index}
                onClick={() => handleProfileSelect(profile)}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center text-xl">
                        {profile.profileImage || '👤'}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {profile.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                          ID: {profile.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="relative options-dropdown-container">
                        <button 
                          onClick={(e) => handleOptionsClick(e, profile)}
                          className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                      <span className={`px-2 py-0.5 mt-1 rounded text-[10px] font-medium uppercase tracking-wider ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                      <p className="text-sm text-gray-900 dark:text-white truncate">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                      <p className="text-sm text-gray-900 dark:text-white">{getProfileTypeLabel(profile.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Details</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile.role || profile.occupation || profile.unitNumber || 'N/A'}
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
            headers={['Profile', 'Contact', 'Type', 'Status', 'Details', 'Actions']}
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
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                      {profile.profileImage || '👤'}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {profile.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                        ID: {profile.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-white">{profile.email}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    {getProfileTypeLabel(profile.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(profile.status)}`}>
                    {profile.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile.role || profile.occupation || profile.unitNumber || 'N/A'}
                     </span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left options-dropdown-container">
                    <button 
                      onClick={(e) => handleOptionsClick(e, profile)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
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
    </div>
  );
}
