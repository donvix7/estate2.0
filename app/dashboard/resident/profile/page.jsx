"use client";

import React, { useState, useEffect } from 'react';
import { getResidentData } from '@/lib/service';
import { updateProfile } from '@/lib/action';
import { toast } from 'react-toastify';
import { 
  Camera, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  History, 
  UserPlus, 
  Droplets, 
  Wallet, 
  BellRing, 
  Download,
  ChevronRight,
  ShieldAlert,
  Users,
  HelpCircle,
  Plus,
  Eye,
  Building,
  Headset,
  Send,
  Loader2,
  X,
  User
} from 'lucide-react';

export default function ProfilePage() {
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getResidentData();
        setResidentData(data);
        setEditForm(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveStatus('');
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(residentData || {});
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
    try {
      setSaveStatus('saving');
      const result = await updateProfile({ id: residentData?.id || 1, ...editForm });
      
      if (result.success) {
        setResidentData(result.data);
        setIsEditing(false);
        setSaveStatus('success');
        toast.success('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus('');
        }, 3000);
      } else {
        setSaveStatus('error');
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
      toast.error('An error occurred while saving.');
    }
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
      <div className="bg-white dark:bg-slate-900/50 rounded-3xl border-none p-8 md:p-10 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1241a1]/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            {residentData?.picture ? (
              <div 
                className="h-32 w-32 rounded-3xl bg-cover bg-center ring-4 ring-[#1241a1]/10 shadow-xl" 
                style={{ backgroundImage: `url(${residentData.picture})` }}
              ></div>
            ) : (
              <div className="h-32 w-32 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-4 ring-[#1241a1]/10 shadow-xl">
                <User className="size-16 text-[#1241a1]/20" />
              </div>
            )}
            <button className="absolute bottom-[-10px] right-[-10px] p-2.5 bg-white dark:bg-slate-800 text-[#1241a1] rounded-2xl shadow-xl hover:scale-105 transition-transform border-4 border-slate-50 dark:border-background-dark">
              <Camera className="size-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black dark:text-white mb-2 tracking-tight">
              {residentData?.name || 'Alex Rivers'}
            </h2>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <Mail className="size-4" /> 
                {residentData?.email || 'alex.rivers@email.com'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <Phone className="size-4" /> 
                {residentData?.phone || '+1 (555) 012-3456'}
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {!isEditing ? (
                <button 
                  onClick={handleEditProfile}
                  className="px-6 py-2.5 bg-[#1241a1] text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95"
                >
                  Edit Details
                </button>
              ) : (
                <div className="flex gap-3">
                   <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-[#1241a1] text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                   <button 
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Sections */}
        <div className="lg:col-span-1 space-y-8">
          {/* Property Information */}
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl border-none p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                <Building2 className="size-5" />
              </div>
              Property Info
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Unit Number', value: residentData?.unitNumber || '1204 - Penthouse Level', name: 'unitNumber' },
                { label: 'Block', value: residentData?.building || 'Block A - North Wing', name: 'building' },
                { label: 'Residency Type', value: 'Owner-Occupied' },
                { label: 'Move-in Date', value: 'October 12, 2021' }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-1.5 ${idx !== 3 ? 'border-b border-slate-50 dark:border-slate-900/50 pb-5' : ''}`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  {isEditing && item.name ? (
                     <input 
                        name={item.name}
                        value={editForm[item.name] || ''}
                        onChange={handleInputChange}
                        className="bg-slate-50 dark:bg-slate-900/50 border-none rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-[#1241a1]/20 outline-none"
                     />
                  ) : (
                    <span className="text-sm font-black text-slate-900 dark:text-slate-200">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Security & Privacy Settings */}
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl border-none p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                <ShieldCheck className="size-5" />
              </div>
              Security & Privacy
            </h3>
            
            <div className="space-y-6">
              {[
                { title: 'Two-Factor Auth', desc: 'Enhanced account security', active: true },
                { title: 'Email Notifications', desc: 'Updates on requests', active: true },
                { title: 'Visitor Alerts', desc: 'Push notification for arrivals', active: false }
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
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl border-none p-8 shadow-sm h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                  <History className="size-5" />
                </div>
                Recent Activity
              </h3>
              <button className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1241a1] transition-colors">View All</button>
            </div>
            
            <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-100 before:via-slate-200 before:to-transparent dark:before:from-slate-800 dark:before:via-slate-800">
              {[
                { icon: UserPlus, title: 'Visitor Entry Registered', time: '2h ago', desc: 'Guest: John Smith (Delivery Service)', status: 'Approved', statusType: 'success' },
                { icon: Droplets, title: 'Maintenance Ticket Update', time: 'Yesterday, 14:30', desc: "Leaking tap request #MR-9021 status changed to 'In Progress'", comment: 'Technician scheduled for visit tomorrow at 10 AM', iconType: 'warning' },
                { icon: Wallet, title: 'Service Charge Paid', time: '3 days ago', desc: 'Payment of $450.00 confirmed for Oct 2023', action: 'Download Receipt' },
                { icon: BellRing, title: 'Estate Announcement', time: '1 week ago', desc: 'Annual fire safety drill scheduled for November 15th.' }
              ].map((activity, idx) => (
                <div key={idx} className="relative flex items-start gap-8 group">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-8 ring-white dark:ring-slate-900 shadow-lg z-10 transition-transform group-hover:scale-110 ${
                    activity.iconType === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#1241a1]/10 text-[#1241a1]'
                  }`}>
                    <activity.icon className="size-6" />
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black dark:text-white uppercase tracking-tight">{activity.title}</p>
                      <time className="text-[10px] font-bold text-slate-400 italic">{activity.time}</time>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{activity.desc}</p>
                    
                    {activity.status && (
                      <span className="mt-3 inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                        {activity.status}
                      </span>
                    )}
                    
                    {activity.comment && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-none">
                        <p className="text-xs italic text-slate-500 font-medium">"{activity.comment}"</p>
                      </div>
                    )}
                    
                    {activity.action && (
                      <button className="mt-4 text-[11px] font-black uppercase tracking-widest text-[#1241a1] flex items-center gap-2 hover:underline">
                        <Download className="size-3.5" /> 
                        {activity.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/*Emmergency contact*/}
            <div>
              

            </div>
          </section>
        </div>
      </div>
    </div>
  )
}