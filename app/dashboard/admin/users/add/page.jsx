'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Shield, 
  Clock, 
  Users, 
  Save, 
  X,
  ChevronLeft,
  Building2,
  Calendar,
  CreditCard,
  Info,
  Camera
} from 'lucide-react';

const mockAPI = {
  async addProfile(profile) {
    console.log('Adding profile:', profile);
    return { success: true };
  }
};

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    estateID: 'EST-001', // Defaulting to a placeholder as per example
    unit: '',
    role: '',
    department: '',
    occupation: '',
    emergencyContact: '',
    badgeNumber: '',
    shift: '',
    salary: '',
    status: 'active',
    type: 'resident'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Missing required identity credentials');
      return;
    }
    
    // Exact payload structure as requested
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      estateID: formData.estateID,
      unit: formData.unit
    };
    
    setIsSubmitting(true);
    try {
      const result = await mockAPI.addProfile(payload);
      if (result.success) {
        toast.success('Profile created successfully');
        router.push('/dashboard/admin/users');
      }
    } catch (error) {
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation / Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#1241a1] transition-colors mb-2"
            >
              <ChevronLeft size={16} />
              Back to Directory
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create New Identity
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name || isSubmitting}
              className="px-6 py-2.5 bg-[#1241a1] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSubmitting ? 'Processing...' : 'Save Profile'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-[#1241a1]" />
                  Personal Information
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Full Legal Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Jonathan Smith"
                      className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="jsmith@example.com"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Access Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Estate ID</label>
                      <input
                        type="text"
                        name="estateID"
                        value={formData.estateID}
                        onChange={handleInputChange}
                        placeholder="EST-001"
                        className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Specific Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-[#1241a1]" />
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Details
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Required</span>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {formData.type === 'resident' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Apartment Unit</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            placeholder="e.g. Block C, Unit 4"
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Primary Occupation</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            placeholder="Current Profession"
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Emergency Contact Line</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="tel"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            placeholder="Contact Name & Number"
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {formData.type === 'staff' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Designated Role</label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="e.g. Supervisor"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Assigned Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="Internal Operations"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === 'security' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Security Badge ID</label>
                        <input
                          type="text"
                          name="badgeNumber"
                          value={formData.badgeNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="SEC-0012"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">Assigned Shift</label>
                        <select
                          name="shift"
                          value={formData.shift}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium appearance-none"
                        >
                          <option value="">Select Shift</option>
                          <option value="Morning">Morning Phase</option>
                          <option value="Evening">Evening Phase</option>
                          <option value="Night">Night Phase</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Identity Settings Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Classification</label>
                <div className="grid grid-cols-1 gap-2">
                  {['resident', 'staff', 'security'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                        formData.type === type 
                          ? 'border-[#1241a1] bg-blue-50/50 dark:bg-blue-900/10 text-[#1241a1]' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'resident' && <Building2 size={16} />}
                      {type === 'staff' && <Users size={16} />}
                      {type === 'security' && <Shield size={16} />}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-bold appearance-none"
                >
                  <option value="active">Active System Profile</option>
                  <option value="pending">Awaiting Verification</option>
                  <option value="inactive">Disabled / Inactive</option>
                </select>
              </div>
            </div>

            {/* Profile Media Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-32 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 relative group cursor-pointer overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#1241a1] transition-colors">
                  <Camera size={32} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                    Upload Photo
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Profile Identity Photo</h4>
                  <p className="text-xs text-slate-400">Used for ID verification & security badges.</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/30 p-4 flex gap-3">
              <Info size={16} className="text-[#1241a1] mt-0.5 shrink-0" />
              <p className="text-[11px] font-semibold text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Profile creation initializes a system-wide identity. Residents gain access to service portals, while staff/security gain operational controls.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
