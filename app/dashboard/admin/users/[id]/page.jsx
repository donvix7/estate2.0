'use client'

import { BadgeCheck, Mail, ShieldCheck, Briefcase, Clock, User, Home, Phone } from 'lucide-react';
import { getUserById } from '@/lib/service';
import { editProfile, deleteProfile } from '@/lib/action';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {    
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Form state for editing/adding
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getUserById(id);
                if (data) {
                    setSelectedProfile(data);
                    setFormData(data);
                } else {
                    toast.error('Profile not found');
                    router.push('/dashboard/admin/users');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [id, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            const profileId = formData.id || formData._id;
            const payload = { ...formData, id: profileId };
            const result = await editProfile(payload);
            
            if (result.success) {
                setSelectedProfile(formData);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
            try {
                const profileId = selectedProfile.id || selectedProfile._id;
                const result = await deleteProfile(profileId);
                
                if (result.success) {
                    toast.success('Profile deleted successfully');
                    router.push('/dashboard/admin/users');
                } else {
                    toast.error(result.message || 'Failed to delete profile');
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
                toast.error('Failed to delete profile');
            }
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            case 'inactive': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getProfileTypeLabel = (type) => {
        switch(type) {
            case 'resident': return 'Resident';
            case 'staff': return 'Staff';
            case 'security': return 'Security';
            default: return type || 'Unknown';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1241a1]"></div>
            </div>
        );
    }

    if (!selectedProfile) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
            <div className="flex items-center justify-between">
                <BackButton fallbackRoute="/dashboard/admin/users" label="Back to Directory" />
                <div className="flex gap-3">
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-[#1241a1] text-white text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={handleUpdateProfile}
                                className="px-6 py-2 bg-[#1241a1] text-white text-[11px] font-semibold uppercase tracking-widest rounded-md hover:brightness-110 transition-all"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold uppercase tracking-widest rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={handleDeleteProfile}
                        className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-semibold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-slate-100 dark:bg-slate-800/30 p-8 md:p-10 overflow-hidden relative group rounded-md  ">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1241a1]/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
                <div className="relative flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                    <div className="relative">
                        <div 
                            className="h-32 w-32 rounded-full bg-cover bg-center ring-4 ring-[#1241a1]/10 flex items-center justify-center bg-white dark:bg-slate-800" 
                            style={selectedProfile.profileImage ? { backgroundImage: `url(${selectedProfile.profileImage})` } : {}}
                        >
                            {!selectedProfile.profileImage && <User className="size-12 text-slate-300" />}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                            <h2 className="text-3xl font-bold dark:text-white tracking-tight">
                                {selectedProfile.name}
                            </h2>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md font-semibold tracking-widest uppercase mb-1.5">
                                {selectedProfile.id || selectedProfile._id}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-semibold uppercase tracking-widest">
                                <BadgeCheck className="size-4" /> 
                                {selectedProfile.type || 'Resident'}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                                <Mail className="size-4" /> 
                                {selectedProfile.email}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                                <ShieldCheck className="size-4" /> 
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest ${getStatusColor(selectedProfile.status)}`}>
                                    {selectedProfile.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <section className="bg-slate-100 dark:bg-slate-800/30 p-8 rounded-md">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                                <User className="size-5" />
                            </div>
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Full Name', value: selectedProfile.name, name: 'name', icon: User },
                                { label: 'Email Address', value: selectedProfile.email, name: 'email', icon: Mail },
                                { label: 'Phone Number', value: selectedProfile.phone, name: 'phone', icon: Phone },
                                { label: 'Occupation', value: selectedProfile.occupation, name: 'occupation', icon: Briefcase }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <item.icon className="size-3" />
                                        {item.label}
                                    </span>
                                    {isEditing ? (
                                        <input 
                                            name={item.name}
                                            value={formData[item.name] || ''}
                                            onChange={handleInputChange}
                                            className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-slate-900 dark:text-white"
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{item.value || 'N/A'}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Additional Details based on Type */}
                    <section className="bg-slate-100 dark:bg-slate-800/30 p-8 rounded-md">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                                {selectedProfile.type === 'resident' ? <Home className="size-5" /> : <ShieldCheck className="size-5" />}
                            </div>
                            {selectedProfile.type === 'resident' ? 'Residential Details' : 'Operational Details'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {selectedProfile.type === 'resident' ? (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Assigned Unit</span>
                                        {isEditing ? (
                                            <input 
                                                name="unit"
                                                value={formData.unit || ''}
                                                onChange={handleInputChange}
                                                className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-slate-900 dark:text-white"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedProfile.unit || selectedProfile.unitNumber || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Emergency Contact</span>
                                        {isEditing ? (
                                            <input 
                                                name="emergencyContact"
                                                value={formData.emergencyContact || ''}
                                                onChange={handleInputChange}
                                                className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-slate-900 dark:text-white"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedProfile.emergencyContact || 'N/A'}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Department</span>
                                        {isEditing ? (
                                            <input 
                                                name="department"
                                                value={formData.department || ''}
                                                onChange={handleInputChange}
                                                className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-slate-900 dark:text-white"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedProfile.department || 'Operations'}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Access Level</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedProfile.accessLevel || 'Level 1'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                {/* Account Summary Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-slate-100 dark:bg-slate-800/30 p-8 rounded-md">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#1241a1]/10 text-[#1241a1]">
                                <Clock className="size-5" />
                            </div>
                            Account Metadata
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Date Created</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{formatDate(selectedProfile.createdAt || selectedProfile.joinDate)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Last Activity</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">Just now</span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-linear-to-br from-[#1241a1] to-blue-700 p-8 rounded-md text-white">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 opacity-60">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-semibold uppercase tracking-widest transition-all">Reset Password</button>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-semibold uppercase tracking-widest transition-all">Disable Account</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}