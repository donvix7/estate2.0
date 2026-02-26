"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Users,
  CreditCard,
  Bell,
  User,
  Building
} from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import OverviewTab from '@/components/resident/OverviewTab'
import VisitorsTab from '@/components/resident/VisitorsTab'
import PaymentsTab from '@/components/resident/PaymentsTab'
import AnnouncementsTab from '@/components/resident/AnnouncementsTab'
import ProfileTab from '@/components/resident/ProfileTab'
import {
  getAnnouncements,
  getVisitors,
  getResidentData,
  markAnnouncementAsRead,
  markAllAnnouncementsAsRead,
  updateResidentProfile
} from '@/lib/service'

export default function ResidentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementsData, visitorsData, residentData] = await Promise.all([
          getAnnouncements(),
          getVisitors(),
          getResidentData()
        ]);
        
        setAnnouncements(announcementsData);
        setVisitors(visitorsData);
        setResidentData(residentData);
        setEditForm(residentData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data
        const resident = await getResidentData();
        setAnnouncements([]);
        setVisitors([]);
        setResidentData(resident);
        setEditForm(resident);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [])

  const getUserName = () => {
    if (residentData) {
      return residentData.name;
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || 'Resident';
      }
    }
    return 'Resident';
  }

  const getUnitNumber = () => {
    if (residentData) {
      return residentData.unitNumber;
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.unitNumber || 'A-101';
      }
    }
    return 'A-101';
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear session storage
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('sessionId');
      router.push('/login');
    }
  }

  const markAsRead = async (id) => {
    try {
      await markAnnouncementAsRead(id);
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: true } : ann
        )
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      // Still update local state for better UX
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: true } : ann
        )
      );
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllAnnouncementsAsRead();
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => ({ ...ann, read: true }))
      );
    } catch (error) {
      console.error('Error marking all announcements as read:', error);
      // Still update local state for better UX
      setAnnouncements(prev => 
        prev.map(ann => ({ ...ann, read: true }))
      );
    }
  }

  const getUnreadCount = () => {
    return announcements.filter(ann => !ann.read).length;
  }

  const getVisitorStatistics = () => {
    const activeVisitors = visitors.filter(v => v.status === 'Active').length;
    const pendingVisitors = visitors.filter(v => v.status === 'Pending').length;
    
    return {
      thisMonth: visitors.length,
      active: activeVisitors,
      pending: pendingVisitors
    };
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
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2  - blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading Resident Dashboard...</p>
        </div>
      </div>
    );
  }

  const visitorStats = getVisitorStatistics();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'visitors', label: 'Visitors', icon: <Users className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-5 h-5" />, badge: getUnreadCount() },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans dark:bg-gray-900">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading tracking-tight">Overview</h1>
          <p className="text-gray-500 text-lg mt-1">
             Welcome back, {getUserName()}. Here's what's happening in your estate.
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab 
            residentData={residentData}
            visitorStats={visitorStats}
            announcements={announcements}
            getUnreadCount={getUnreadCount}
            visitors={visitors}
            setActiveTab={setActiveTab}
          />
        )}

     
      </main>
    </div>
  )
}