'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProfileDetails from '@/components/admin/ProfileDetails'
import { BackButton } from '@/components/ui/BackButton';

// MOCK DATA FOR DEMO PURPOSES
export default function UserProfilePage() {    
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Form state for editing/adding
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

    useEffect(() => {
        // Fetch or simulate loading the profile by ID
        // Simulate an API call
        setTimeout(() => {
            // A mocked up profile to view the UI. Replace with an actual API call.
            const profile = {
                id: id || 'RES001',
                name: 'Profile ' + (id || ''),
                email: 'user@example.com',
                phone: '+1 234 567 8900',
                type: 'resident',
                status: 'active',
                unitNumber: 'A-101',
                occupation: 'Resident',
                residentSince: '2023-01-15T00:00:00.000Z',
                emergencyContact: '+1 987 654 3210',
                profileImage: '👤'
            };
            setSelectedProfile(profile);
            setFormData(profile);
            setIsLoading(false);
        }, 500);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = () => {
        setSelectedProfile(formData);
        setIsEditing(false);
        // Add toast or notification here
    };

    const handleDeleteProfile = () => {
        router.push('/dashboard/admin/users');
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
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <BackButton fallbackRoute="/dashboard/admin/users" label="Back to Directory" />

            <div className="flex items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Details</h1>
                </div>
            </div>

            <div className="lg:col-span-1">
                <ProfileDetails
                    selectedProfile={selectedProfile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleUpdateProfile={handleUpdateProfile}
                    handleDeleteProfile={handleDeleteProfile}
                    setShowAddModal={setShowAddModal}
                    getStatusColor={getStatusColor}
                    getProfileTypeLabel={getProfileTypeLabel}
                    formatDate={formatDate}
                />
            </div>
        </div>
    )
}