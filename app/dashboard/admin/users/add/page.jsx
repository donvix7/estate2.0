'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';

const mockAPI = {
  // Add new profile
  async addProfile(profile) {
    console.log('Adding new profile:', profile);
    const newProfile = {
      ...profile,
      id: `${profile.type.toUpperCase()}${Date.now().toString().slice(-3)}`
    };
    return { success: true, profile: newProfile };
  }
};

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for adding user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    unitNumber: '',
    department: '',
    occupation: '',
    emergencyContact: '',
    badgeNumber: '',
    shift: '',
    joinDate: '',
    experience: '',
    salary: '',
    status: 'active',
    type: 'resident'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsSubmitting(true);
    try {
      const result = await mockAPI.addProfile(formData);
      if (result.success) {
        alert('Person added successfully!');
        router.push('/dashboard/admin/users');
      }
    } catch (error) {
      console.error('Error adding profile:', error);
      alert('Error adding person. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <BackButton fallbackRoute="/dashboard/admin/users" label="Back to Directory" />

      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Person</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Create a new profile for a resident, staff member, or security personnel.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <form onSubmit={handleAddProfile} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Person Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50"
                >
                  <option value="resident">Resident</option>
                  <option value="staff">Staff</option>
                  <option value="security">Security</option>
                </select>
              </div>
              
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Resident Specific */}
          {formData.type === 'resident' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 border-b border-blue-100 dark:border-blue-900/30 pb-2">
                Resident Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Unit Number</label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                    placeholder="e.g. A-101"
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
                    placeholder="e.g. Engineer"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                    placeholder="Emergency phone"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Staff Specific */}
          {formData.type === 'staff' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 border-b border-orange-100 dark:border-orange-900/30 pb-2">
                Staff Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                    placeholder="e.g. Cleaner"
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
                    placeholder="e.g. Maintenance"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Salary</label>
                   <input
                     type="text"
                     name="salary"
                     value={formData.salary}
                     onChange={handleInputChange}
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                     placeholder="e.g. $50,000"
                   />
                </div>
              </div>
            </div>
          )}

          {/* Security Specific */}
          {formData.type === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 border-b border-green-100 dark:border-green-900/30 pb-2">
                Security Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Badge Number</label>
                  <input
                    type="text"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                    placeholder="e.g. SEC-001"
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

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Experience</label>
                   <input
                     type="text"
                     name="experience"
                     value={formData.experience}
                     onChange={handleInputChange}
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                     placeholder="e.g. 5 years"
                   />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Adding...' : 'Add Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
