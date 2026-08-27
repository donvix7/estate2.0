"use client";

import React, { useState, useEffect } from 'react';
import { getResidentData } from '@/lib/service';
import { updateProfile } from '@/lib/action';
import { toast } from 'react-toastify';
import { 
  Camera, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Wallet, 
  BellRing, 
  ChevronRight,
  Users,
  Loader2,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  BadgeCheck,
  AlertCircle,
  Settings,
  Key,
  Home,
  Activity,
  CreditCard,
  Award
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getResidentData();
      console.log('Resident Data:', data)
      setResidentData(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      const result = await updateProfile({ id: residentData?.id, ...editForm });
      
      if (result.success) {
        setResidentData(result.data);
        setIsEditing(false);
        setSaveStatus('success');
        toast.success('Profile updated successfully!');
        
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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1241a1]"></div>
      </div>
    );
  }

  const user = residentData || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Page Header */}
      <PageHeader 
        title="Resident Profile" 
        description="Manage your personal information, contact details, and account security."
        icon={User}
        iconColor="blue"
      />

      {/* Profile Header Card */}
      <section className="bg-[#1a1d23] rounded-md p-8 md:p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1241a1]/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar */}
          <div className="relative">
            {user.displayImage ? (
              <div 
                className="h-32 w-32 rounded-md bg-cover bg-center" 
                style={{ backgroundImage: `url(${user.displayImage})` }}
              ></div>
            ) : (
              <div className="h-32 w-32 rounded-md bg-[#1a1d23] flex items-center justify-center border-2 border-[#1241a1]/10">
                <User className="size-16 text-[#1241a1]/30" />
              </div>
            )}
            <button className="absolute bottom-[-10px] right-[-10px] p-2.5 bg-[#1241a1] text-white rounded-md hover:scale-105 transition-transform">
              <Camera className="size-4" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                {`${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`}
              </h2>
              {user.isAccountVerified && (
                <BadgeCheck className="size-6 text-[#1241a1]" />
              )}
            </div>
            <p className="text-[#8a8f98] text-sm font-medium mb-1">
              @{user.username || 'N/A'}
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2">
              <p className="text-[#8a8f98] flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <Mail className="size-4" /> 
                {user.email || 'N/A'}
                {user.emailVerified ? (
                  <CheckCircle className="size-3 text-green-500" />
                ) : (
                  <AlertCircle className="size-3 text-amber-500" />
                )}
              </p>
              <p className="text-[#8a8f98] flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <Phone className="size-4" /> 
                {user.phone || 'N/A'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {!isEditing ? (
                <Button onClick={handleEditProfile}>
                  Edit Details
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </Button>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          )}
          <Button variant="ghost" onClick={() => toast.info('Password change flow coming soon')}>
            Change Password
          </Button>
        </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <User className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Personal Information</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Your basic profile details</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {[
                { label: 'First Name', value: user.firstName || 'N/A', name: 'firstName' },
                { label: 'Last Name', value: user.lastName || 'N/A', name: 'lastName' },
                { label: 'Username', value: user.username || 'N/A', name: 'username' },
                { label: 'Email', value: user.email || 'N/A', name: 'email' },
                { label: 'Phone', value: user.phone || 'N/A', name: 'phone' },
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-1.5 ${idx !== 4 ? 'border-b border-[#2a2d33] pb-4' : ''}`}>
                  <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest">{item.label}</span>
                  {isEditing && item.name ? (
                    <input 
                      name={item.name}
                      value={editForm[item.name] || ''}
                      onChange={handleInputChange}
                      className="bg-[#0d0f13] border border-[#2a2d33] rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white text-[#8a8f98]">{item.value}</span>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Location</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Your geographical details</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {[
                { label: 'Country', value: user.country || 'Not set', name: 'country' },
                { label: 'Region', value: user.region || 'Not set', name: 'region' },
                { label: 'City', value: user.city || 'Not set', name: 'city' },
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-1.5 ${idx !== 2 ? 'border-b border-[#2a2d33] pb-4' : ''}`}>
                  <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest">{item.label}</span>
                  {isEditing && item.name ? (
                    <input 
                      name={item.name}
                      value={editForm[item.name] || ''}
                      onChange={handleInputChange}
                      className="bg-[#0d0f13] border border-[#2a2d33] rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white text-[#8a8f98]">{item.value}</span>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Account Status Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Account Status</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Your account verification & balance</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex flex-col gap-1.5 border-b border-[#2a2d33] pb-4">
                <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest">Account Verified</span>
                <span className={`text-sm font-semibold ${user.isAccountVerified ? 'text-green-600' : 'text-amber-600'}`}>
                  {user.isAccountVerified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 border-b border-[#2a2d33] pb-4">
                <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest">Email Verified</span>
                <span className={`text-sm font-semibold ${user.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                  {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest">Wallet Balance</span>
                <span className="text-sm font-semibold text-white text-[#8a8f98]">
                  ${user.walletBalance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <Activity className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Your latest account activities</p>
                </div>
              </div>
              <button className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8f98] hover:text-[#1241a1] transition-colors">
                View All
              </button>
            </CardHeader>
            <CardBody className="space-y-6">
              {user.lastLoginAt && (
                <div className="relative flex items-start gap-6 group p-4 bg-[#0d0f13] rounded-md hover:shadow-sm transition-shadow">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1241a1]/10 text-[#1241a1] group-hover:bg-[#1241a1] group-hover:text-white transition-colors">
                    <Clock className="size-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-white">Last Login</p>
                      <time className="text-[10px] font-medium text-[#8a8f98]">{formatDateTime(user.lastLoginAt)}</time>
                    </div>
                    <p className="text-xs text-[#8a8f98] font-medium">
                      Last active: {formatDateTime(user.lastActiveAt)}
                    </p>
                  </div>
                </div>
              )}

              {user.createdAt && (
                <div className="relative flex items-start gap-6 group p-4 bg-[#0d0f13] rounded-md hover:shadow-sm transition-shadow">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1241a1]/10 text-[#1241a1] group-hover:bg-[#1241a1] group-hover:text-white transition-colors">
                    <Calendar className="size-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-white">Account Created</p>
                      <time className="text-[10px] font-medium text-[#8a8f98]">{formatDate(user.createdAt)}</time>
                    </div>
                    <p className="text-xs text-[#8a8f98] font-medium">
                      Member since {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <Settings className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Frequently used profile actions</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, label: 'Security Settings', desc: 'Update security preferences', color: 'blue' },
                  { icon: BellRing, label: 'Notifications', desc: 'Manage alert preferences', color: 'purple' },
                  { icon: Users, label: 'Family Members', desc: 'Add or remove family members', color: 'green' },
                  { icon: Key, label: 'Change Password', desc: 'Update your password', color: 'red' },
                  { icon: Home, label: 'Property Info', desc: 'View your property details', color: 'orange' },
                  { icon: CreditCard, label: 'Payments', desc: 'View payment history', color: 'emerald' },
                ].map((action, idx) => (
                  <button key={idx} className="flex items-center gap-4 p-4 bg-[#0d0f13] rounded-md hover:shadow-md transition-all group text-left border border-[#2a2d33]">
                    <div className={`p-2.5 rounded-md bg-${action.color}-500/10 text-${action.color}-500 group-hover:bg-[#1241a1] group-hover:text-white transition-colors`}>
                      <action.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{action.label}</p>
                      <p className="text-[10px] text-[#8a8f98] font-medium">{action.desc}</p>
                    </div>
                    <ChevronRight className="size-4 text-[#8a8f98] group-hover:text-[#1241a1] transition-colors" />
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#1241a1]/10 text-[#1241a1]">
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Account Stats</h3>
                  <p className="text-[10px] text-[#8a8f98] font-medium">Your account at a glance</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0d0f13] p-4 rounded-md text-center">
                  <p className="text-2xl font-bold text-[#1241a1]">1</p>
                  <p className="text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">Properties</p>
                </div>
                <div className="bg-[#0d0f13] p-4 rounded-md text-center">
                  <p className="text-2xl font-bold text-[#1241a1]">0</p>
                  <p className="text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">Visitors</p>
                </div>
                <div className="bg-[#0d0f13] p-4 rounded-md text-center">
                  <p className="text-2xl font-bold text-[#1241a1]">0</p>
                  <p className="text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">Requests</p>
                </div>
                <div className="bg-[#0d0f13] p-4 rounded-md text-center">
                  <p className="text-2xl font-bold text-[#1241a1]">${user.walletBalance?.toFixed(2) || '0.00'}</p>
                  <p className="text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">Balance</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}