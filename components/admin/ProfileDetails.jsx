import React from 'react';

export default function ProfileDetails({
  selectedProfile,
  isEditing,
  setIsEditing,
  formData,
  handleInputChange,
  handleUpdateProfile,
  handleDeleteProfile,
  setShowAddModal,
  getStatusColor,
  getProfileTypeLabel,
  formatDate
}) {
  return (
    <>
      {selectedProfile ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-24">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {selectedProfile.profileImage}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProfile.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedProfile.status)}`}>
                    {selectedProfile.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    {getProfileTypeLabel(selectedProfile.type)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">ID: {selectedProfile.id}</p>
              <p className="text-xs text-gray-400">Click to copy</p>
            </div>
          </div>

          {/* Edit Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Profile' : 'Profile Details'}
            </h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isEditing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form/Details */}
          <div className="space-y-4">
            {isEditing ? (
              // Edit Form
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  />
                </div>
                
                {selectedProfile.type === 'resident' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Unit Number</label>
                      <input
                        type="text"
                        name="unitNumber"
                        value={formData.unitNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                      />
                    </div>
                  </>
                )}
                
                {selectedProfile.type === 'staff' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                      />
                    </div>
                  </>
                )}
                
                {selectedProfile.type === 'security' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Badge Number</label>
                      <input
                        type="text"
                        name="badgeNumber"
                        value={formData.badgeNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Shift</label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50"
                      >
                        <option value="">Select Shift</option>
                        <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                        <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                        <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
                      </select>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              // View Details
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.phone}</p>
                  </div>
                  
                  {selectedProfile.type === 'resident' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Unit Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.unitNumber || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Occupation</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.occupation || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Resident Since</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedProfile.residentSince)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Emergency Contact</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.emergencyContact || 'N/A'}</p>
                      </div>
                    </>
                  )}
                  
                  {selectedProfile.type === 'staff' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.role}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.department}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedProfile.joinDate)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Salary</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.salary || 'N/A'}</p>
                      </div>
                    </>
                  )}
                  
                  {selectedProfile.type === 'security' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Badge Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.badgeNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Shift</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.shift}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedProfile.joinDate)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProfile.experience}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={handleDeleteProfile}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    Delete Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm  p-8 text-center sticky top-24">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Profile Selected</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Select a person from the list to view and manage their profile</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Add New Person
          </button>
        </div>
      )}
    </>
  );
}
