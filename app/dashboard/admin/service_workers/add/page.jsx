'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Save } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default function AddServiceWorkerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Maintenance',
    phone: '',
    email: '',
    status: 'active',
    experience: '',
    salary: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Service worker added successfully!');
      router.push('/dashboard/admin/service_workers');
    }, 1000);
  };

  return (
    <div className="animate-fade-in p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <BackButton fallbackRoute="/dashboard/admin/service_workers" label="Back to Staff List" />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Service Worker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Register a new maintenance or service staff member.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50"
                placeholder="Enter worker name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Role / Designation *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50"
                placeholder="e.g., Senior Plumber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Gardening">Gardening</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50"
                placeholder="worker@example.com"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save className="w-5 h-5" />
                  Add Service Worker
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
