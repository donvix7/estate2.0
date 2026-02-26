import React from 'react';
import { Search } from 'lucide-react';

export default function ProfileList({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredProfiles,
  selectedProfile,
  handleProfileSelect,
  getStatusColor,
  getProfileTypeLabel
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm  p-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative bg-gray-900 rounded-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
            />
            <span className="absolute right-3 top-3 text-gray-400"><Search /></span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'person' : 'people'} found
          </span>
        </div>
      </div>
                    
      {/* Profiles List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-gray-500 text-lg">No people found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'Add new people to get started'}
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all ${
                selectedProfile?.id === profile.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {profile.profileImage}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                        {getProfileTypeLabel(profile.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {profile.email} • {profile.phone}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile.role || profile.occupation || profile.unitNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {profile.id}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
