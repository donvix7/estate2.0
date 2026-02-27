"use client";

import React, { useState, useEffect } from 'react';
import ProfileTab from '@/components/resident/ProfileTab';
import { getResidentData, updateResidentProfile } from '@/lib/service';

const ProfilePage = () => {
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

  const getUnitNumber = () => {
    if (residentData) {
      return residentData.unitNumber;
    }
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.unitNumber || 'A-101';
      }
    }
    return 'A-101';
  }

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
      const result = await updateResidentProfile(residentData?.id || 1, editForm);
      
      if (result.success) {
        setResidentData(result.data);
        setIsEditing(false);
        setSaveStatus('success');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus('');
        }, 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
        <ProfileTab 
          residentData={residentData}
          isEditing={isEditing}
          handleEditProfile={handleEditProfile}
          handleCancelEdit={handleCancelEdit}
          saveStatus={saveStatus}
          handleSaveProfile={handleSaveProfile}
          editForm={editForm}
          handleInputChange={handleInputChange}
          getUnitNumber={getUnitNumber}
        />
    </div>
  )
}

export default ProfilePage;