import React from 'react';

const AddPersonModal = ({
  showAddModal,
  setShowAddModal,
  formData,
  handleInputChange,
  handleAddProfile
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0f13]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#1a1d23]  rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white text-white">
              Add New Person
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-[#8a8f98] hover:text-white hover:text-white p-2 hover:bg-[#2a2d33] hover:bg-[#2a2d33] rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Person Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-white bg-[#1a1d23]/50"
                >
                  <option value="resident">Resident</option>
                  <option value="staff">Staff</option>
                  <option value="security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                  placeholder="Enter full name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            {/* Resident Specific */}
            {formData.type === 'resident' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 rounded-lg">
                <div className="col-span-full mb-2">
                  <h4 className="text-sm font-semibold text-blue-800 text-blue-300">Resident Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Unit Number</label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="e.g. A-101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="e.g. Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="Emergency phone"
                  />
                </div>
              </div>
            )}

            {/* Staff Specific */}
            {formData.type === 'staff' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 bg-orange-900/20 p-4 rounded-lg">
                <div className="col-span-full mb-2">
                  <h4 className="text-sm font-semibold text-orange-800 text-orange-300">Staff Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="e.g. Cleaner"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="e.g. Maintenance"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Salary</label>
                   <input
                     type="text"
                     name="salary"
                     value={formData.salary}
                     onChange={handleInputChange}
                     className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                     placeholder="e.g. $50,000"
                   />
                </div>
              </div>
            )}

            {/* Security Specific */}
            {formData.type === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 bg-green-900/20 p-4 rounded-lg">
                <div className="col-span-full mb-2">
                  <h4 className="text-sm font-semibold text-green-800 text-green-300">Security Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Badge Number</label>
                  <input
                    type="text"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                    placeholder="e.g. SEC-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Shift</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-white bg-[#1a1d23]/50"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                    <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                    <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Experience</label>
                   <input
                     type="text"
                     name="experience"
                     value={formData.experience}
                     onChange={handleInputChange}
                     className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                     placeholder="e.g. 5 years"
                   />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-white bg-[#1a1d23]/50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                 <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4  mt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-[#1a1d23] text-[#8a8f98] text-white rounded-lg hover:bg-[#2a2d33] hover:bg-[#2a2d33] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                disabled={!formData.name}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Person
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;
