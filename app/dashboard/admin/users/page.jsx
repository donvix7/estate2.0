'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react';
import AddPersonModal from '@/components/modals/AddPersonModal';
import ProfileList from '@/components/admin/ProfileList';
import ProfileDetails from '@/components/admin/ProfileDetails';
// Mock data for demonstration
const MOCK_DATA = {
  residents: [
    /*{
      id: 'RES001',
      name: 'Amit Sharma',
      email: 'amit.sharma@example.com',
      phone: '+91 9876543210',
      unitNumber: 'A-101',
      residentSince: '2022-03-15',
      occupation: 'Software Engineer',
      emergencyContact: '+91 9876543211',
      status: 'active',
      type: 'resident',
      profileImage: '👨‍💼'
    },*/
  ],
  staff: [
   /* {
      id: 'STF001',
      name: 'Rajesh Kumar',
      email: 'rajesh.staff@estatesecure.com',
      phone: '+91 9876543220',
      role: 'Maintenance Supervisor',
      department: 'Maintenance',
      joinDate: '2021-05-15',
      salary: ' $35,000',
      status: 'active',
      type: 'staff',
      profileImage: '👨‍🔧'
    },*/
  ],
  security: [
    /*{
      id: 'SEC001',
      name: 'Arjun Mehta',
      email: 'arjun.security@estatesecure.com',
      phone: '+91 9876543230',
      role: 'Senior Security Officer',
      badgeNumber: 'SG-2024-001',
      shift: 'Morning (6 AM - 2 PM)',
      joinDate: '2023-01-15',
      experience: '2 years',
      status: 'active',
      type: 'security',
      profileImage: '👮'
    },*/
  ]
}

// Mock API functions
const mockAPI = {
  // Get all profiles
  async getAllProfiles() {
    try {
      const allProfiles = [
        ...MOCK_DATA.residents,
        ...MOCK_DATA.staff,
        ...MOCK_DATA.security
      ];
      return allProfiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },

  // Get profiles by type
  async getProfilesByType(type) {
    try {
      return MOCK_DATA[type] || [];
    } catch (error) {
      console.error('Error fetching profiles by type:', error);
      return [];
    }
  },

  // Update profile
  async updateProfile(profileId, updates) {
    console.log('Updating profile:', profileId, updates);
    // Find and update in all arrays
    Object.keys(MOCK_DATA).forEach(type => {
      const index = MOCK_DATA[type].findIndex(p => p.id === profileId);
      if (index !== -1) {
        MOCK_DATA[type][index] = { ...MOCK_DATA[type][index], ...updates };
      }
    });
    return { success: true };
  },

  // Delete profile
  async deleteProfile(profileId) {
    console.log('Deleting profile:', profileId);
    // Delete from all arrays
    Object.keys(MOCK_DATA).forEach(type => {
      MOCK_DATA[type] = MOCK_DATA[type].filter(p => p.id !== profileId);
    });
    return { success: true };
  },

  // Add new profile
  async addProfile(profile) {
    console.log('Adding new profile:', profile);
    const newProfile = {
      ...profile,
      id: `${profile.type.toUpperCase()}${Date.now().toString().slice(-3)}`
    };
    
    if (MOCK_DATA[profile.type]) {
      MOCK_DATA[profile.type].push(newProfile);
    }
    return { success: true, profile: newProfile };
  }
};

export default function AdminPeopleManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Filter profiles when search term or status changes
  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, statusFilter, activeTab]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeTab === 'all') {
        data = await mockAPI.getAllProfiles();
      } else {
        data = await mockAPI.getProfilesByType(activeTab);
      }
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = profiles;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.phone.toLowerCase().includes(term) ||
        (profile.unitNumber && profile.unitNumber.toLowerCase().includes(term)) ||
        (profile.role && profile.role.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(profile => profile.status === statusFilter);
    }
    
    setFilteredProfiles(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProfile(null);
    setIsEditing(false);
    loadProfiles();
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      role: profile.role || '',
      unitNumber: profile.unitNumber || '',
      department: profile.department || '',
      occupation: profile.occupation || '',
      emergencyContact: profile.emergencyContact || '',
      badgeNumber: profile.badgeNumber || '',
      shift: profile.shift || '',
      joinDate: profile.joinDate || '',
      experience: profile.experience || '',
      salary: profile.salary || '',
      status: profile.status || 'active',
      type: profile.type || 'resident'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!selectedProfile) return;
    
    try {
      await mockAPI.updateProfile(selectedProfile.id, formData);
      await loadProfiles();
      
      // Update selected profile in state
      const updatedProfile = { ...selectedProfile, ...formData };
      setSelectedProfile(updatedProfile);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProfile.name}'s profile? This action cannot be undone.`)) {
      try {
        await mockAPI.deleteProfile(selectedProfile.id);
        await loadProfiles();
        setSelectedProfile(null);
        alert('Profile deleted successfully!');
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Error deleting profile. Please try again.');
      }
    }
  };

  const handleAddProfile = async () => {
    try {
      const result = await mockAPI.addProfile(formData);
      if (result.success) {
        await loadProfiles();
        setShowAddModal(false);
        setFormData({
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
        alert('Profile added successfully!');
      }
    } catch (error) {
      console.error('Error adding profile:', error);
      alert('Error adding profile. Please try again.');
    }
  };

  const getProfileTypeLabel = (type) => {
    switch(type) {
      case 'resident': return 'Resident';
      case 'staff': return 'Staff';
      case 'security': return 'Security';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading People Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4  p-4 rounded-lg dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 dark:text-white">People Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage Residents, Staff & Security personnel for the estate.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Add New Person
        </button>
      </div>        
         

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - List & Filters */}
          <div className="lg:col-span-2">
            <ProfileList
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filteredProfiles={filteredProfiles}
              selectedProfile={selectedProfile}
              handleProfileSelect={handleProfileSelect}
              getStatusColor={getStatusColor}
              getProfileTypeLabel={getProfileTypeLabel}
            />
          </div>

          {/* Right Column - Profile Details */}
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
        <AddPersonModal 
          showAddModal={showAddModal} 
          setShowAddModal={setShowAddModal} 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleAddProfile={handleAddProfile} 
        />
      </div>  




  )
}