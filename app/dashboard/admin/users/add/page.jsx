'use client'

import React, { useEffect, useState } from 'react';
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
import { handleCreateUser, handleResidentRequest } from '@/lib/action';
import { getCurrentSession, getEstateData } from '@/lib/service';



export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estateId, setEstateId] = useState("unknown")
  const [formData, setFormData] = useState({
   
    phone: '',
    estateID: '', // Defaulting to a placeholder as per example
    status: 'active',
    type: 'residents'
  });

  const handleInputChange = (e) => {
    const {  value } = e.target;
    setFormData(prev => ({ ...prev,phone: value }));
  };

   useEffect(() => {
    const fetchEstateId = async () => {
      const estate = await getEstateData();
      const estateId = estate?._id;
        setEstateId(estateId);
    };

    fetchEstateId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Exact payload structure as requested
    const payload = {
      phone: formData.phone,
      estateID: estateId,
    };

    
    setIsSubmitting(true);
    try {
      if (formData.type === 'residents') {
        const result = await handleResidentRequest(payload, formData.type);
        if (result.success) {
          toast.success('Profile created successfully');
          router.push('/dashboard/admin/users');
        }
      }
      if (formData.type === 'worker'|| formData.type === 'admin') {
        const result = await handleCreateUser(payload,formData.type);
        if (result.success) {
          toast.success('Profile created successfully');
          router.push('/dashboard/admin/users');
        }
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
              disabled={!formData.phone || isSubmitting}
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
                        value={estateId}
                        disabled
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
                  {['residents', 'staffs', 'securitys'].map(type => (
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
                      {type === 'residents' && <Building2 size={16} />}
                      {type === 'staffs' && <Users size={16} />}
                      {type === 'securitys' && <Shield size={16} />}
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
