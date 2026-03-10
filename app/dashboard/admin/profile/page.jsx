"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // Set to false since we're using mock admin data for now
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

  // Mock Admin Data
  const mockAdmin = {
    id: 'ADM-9021',
    name: 'Officer John Doe',
    email: 'j.doe@estateflow.com',
    phone: '+1 (555) 098-7654',
    role: 'Senior System Administrator',
    department: 'Security & Operations',
    joiningDate: 'January 15, 2022',
    accessLevel: 'Level 4 (Full Access)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHYVlzHn-BdZ9ymJImLncgoWcrSTw44-gAGlp_LGdp0jTKj02OhZsyp4aUhTVCdsDLfWp5CDwBSH8bmCNKt-rd7sQuRwoe6DOZuzE69rdBZrajwTqYwyYxCFLlaBqSyumcNmaNa0X_Y2mfQ8ySBC186KSIMUbBd5K6ZvmBofPi30u3bw-TPHw-O4yA5I8YOyCmLVsJZvkeJfh5FzVfujJ9RqnU0A-gC44KnFgsqnMyl1MYX4QwxlH5vEY5D55o8nNimDrpHKejrwg'
  };

  useEffect(() => {
    setAdminData(mockAdmin);
    setEditForm(mockAdmin);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveStatus('');
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(adminData || {});
    setSaveStatus('');
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setAdminData(editForm);
      setIsEditing(false);
      setSaveStatus('success');
      toast.success('Admin profile updated successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1241a1]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border-none p-8 md:p-10 shadow-sm overflow-hidden relative group rounded-4xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1241a1]/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <div 
              className="h-32 w-32 rounded-3xl bg-cover bg-center ring-4 ring-[#1241a1]/10 shadow-xl" 
              style={{ backgroundImage: `url(${adminData?.avatar})` }}
            ></div>
            <button className="absolute bottom-[-10px] right-[-10px] p-2.5 bg-white dark:bg-slate-800 text-[#1241a1] rounded-2xl shadow-xl hover:scale-105 transition-transform border-4 border-slate-50 dark:border-background-dark">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black dark:text-white mb-2 tracking-tight">
              {adminData?.name}
            </h2>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">badge</span> 
                {adminData?.role}
              </p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-base">mail</span> 
                {adminData?.email}
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {!isEditing ? (
                <button 
                  onClick={handleEditProfile}
                  className="px-6 py-2.5 bg-[#1241a1] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                   <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-[#1241a1] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                   <button 
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Sections */}
        <div className="lg:col-span-1 space-y-8">
          {/* Admin Information */}
          <section className="bg-white dark:bg-slate-900 border-none p-8 shadow-sm rounded-4xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#1241a1]/10 material-symbols-outlined text-lg">admin_panel_settings</span>
              Admin Info
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Employee ID', value: adminData?.id, name: 'id' },
                { label: 'Department', value: adminData?.department, name: 'department' },
                { label: 'Access Level', value: adminData?.accessLevel, name: 'accessLevel' },
                { label: 'Joining Date', value: adminData?.joiningDate, name: 'joiningDate' }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-1.5 ${idx !== 3 ? 'border-b border-slate-50 dark:border-slate-800/50 pb-5' : ''}`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  {isEditing && item.name ? (
                     <input 
                        name={item.name}
                        value={editForm[item.name] || ''}
                        onChange={handleInputChange}
                        className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-slate-900 dark:text-white"
                     />
                  ) : (
                    <span className="text-sm font-black text-slate-900 dark:text-slate-200">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* System Settings */}
          <section className="bg-white dark:bg-slate-900 border-none p-8 shadow-sm rounded-4xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#1241a1]/10 material-symbols-outlined text-lg">settings_suggest</span>
              System Controls
            </h3>
            
            <div className="space-y-6">
              {[
                { title: 'System Notifications', desc: 'Critical alerts & emergency requests', active: true },
                { title: 'Activity Audit Log', desc: 'Auto-log all admin actions', active: true },
                { title: 'Maintenance Alerts', desc: 'New service worker requests', active: false }
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-slate-900 dark:text-white group-hover:text-[#1241a1] transition-colors">{setting.title}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{setting.desc}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${setting.active ? 'bg-[#1241a1]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`absolute top-1 h-3 w-3 bg-white rounded-full transition-all ${setting.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Activity Timeline */}
        <div className="lg:col-span-2">
          <section className="bg-white dark:bg-slate-900 border-none p-8 shadow-sm h-full rounded-4xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#1241a1]/10 material-symbols-outlined text-lg">history</span>
                Administrative Logs
              </h3>
              <button className="text-[11px] font-black uppercase tracking-widest text-[#1241a1] hover:underline">View Full Audit</button>
            </div>
            
            <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-100 before:via-slate-200 before:to-transparent dark:before:from-slate-800 dark:before:via-slate-800">
              {[
                { icon: 'verified_user', title: 'System Approval', time: '45m ago', desc: 'Approved visitor registration for Block A - House 42B', status: 'Completed', statusColor: 'emerald' },
                { icon: 'emergency', title: 'Emergency Coordination', time: '2h ago', desc: 'Coordinated response for Medical Alert #9012 at West Gate', iconType: 'emergency' },
                { icon: 'security_update_good', title: 'Security Protocol Update', time: '1 day ago', desc: 'Updated QR scanning protocols for Night Watch patrol' },
                { icon: 'group_add', title: 'New Staff Onboarding', time: '3 days ago', desc: 'Approved access for 2 new service worker profiles', status: 'Verified', statusColor: 'blue' }
              ].map((activity, idx) => (
                <div key={idx} className="relative flex items-start gap-8 group">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-8 ring-white dark:ring-slate-900 shadow-lg z-10 transition-transform group-hover:scale-110 ${
                    activity.iconType === 'emergency' ? 'bg-red-500/10 text-red-500' : 'bg-[#1241a1]/10 text-[#1241a1]'
                  }`}>
                    <span className="material-symbols-outlined">{activity.icon}</span>
                  </div>
                  
                  <div className="flex-1 pt-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black dark:text-white uppercase tracking-tight">{activity.title}</p>
                      <time className="text-[10px] font-bold text-slate-400 italic">{activity.time}</time>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{activity.desc}</p>
                    
                    {activity.status && (
                      <span className={`mt-3 inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        activity.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#1241a1]/10 text-[#1241a1]'
                      }`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}