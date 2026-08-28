'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert,
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX, 
  UserPlus,
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  Check, 
  Grid, 
  List, 
  Filter, 
  RefreshCw,
  Badge,
  Phone,
  Mail,
  DoorOpen,
  Building2,
  AlertCircle,
  User,
  Key,
  Smartphone,
  Loader2,
  QrCode,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import MetricCard from '@/components/MetricCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { createGuard, updateGuard, deleteGuard, authorizeSecurityGuard, rejectSecurityLogin } from '@/lib/action';
import { getActiveSessions, getAllGates, getAllGuards, getAdminSecurityLogs } from '@/lib/service';

const GUARD_ROLES = [
  { value: 'SUPERVISOR', label: 'Supervisor', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  { value: 'TEAM_LEAD', label: 'Team Lead', color: 'bg-[#1241a1]/10 text-[#1241a1] text-[#1241a1] border-[#1241a1]/20' },
  { value: 'OFFICER', label: 'Security Officer', color: 'bg-emerald-500/10 text-emerald-600 text-emerald-400 border-emerald-500/20' },
  { value: 'TRAINEE', label: 'Trainee', color: 'bg-amber-500/10 text-amber-600 text-amber-400 border-amber-500/20' }
];

const GUARD_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-emerald-500/10 text-emerald-600 text-emerald-400 border-emerald-500/20' },
  { value: 'ON_BREAK', label: 'On Break', color: 'bg-amber-500/10 text-amber-600 text-amber-400 border-amber-500/20' },
  { value: 'OFF_DUTY', label: 'Off Duty', color: 'bg-[#1a1d23]/10 text-[#8a8f98] border-[#2a2d33]/20' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-red-500/10 text-red-600 text-red-400 border-red-500/20' }
];

const SHIFT_SCHEDULES = [
  { value: 'MORNING', label: 'Morning Shift (6AM - 2PM)' },
  { value: 'AFTERNOON', label: 'Afternoon Shift (2PM - 10PM)' },
  { value: 'NIGHT', label: 'Night Shift (10PM - 6AM)' },
  { value: 'ROTATING', label: 'Rotating Schedule' }
];

export default function GuardsManagementPage() {
  const [guards, setGuards] = useState([]);
  const [gates, setGates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [copiedId, setCopiedId] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuard, setEditingGuard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);

  // Delete Confirmation Modal State
  const [deletingGuard, setDeletingGuard] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pending Security Login Attempts
  const [pendingAttempts, setPendingAttempts] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  // Login QR Generation
  const [qrGuard, setQrGuard] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

  // Form State - Updated to match new payload
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    gateId: '',
    maxDevices: 1,
    // Additional display fields (not in payload but for UI)
    displayName: '',
    role: 'OFFICER',
    status: 'ACTIVE',
    shift: 'MORNING',
    phone: '',
    experience: '',
    notes: ''
  });
  const fetchSession = async (id) => {
    const sessions = await getActiveSessions(id)
    setActiveSessions(sessions.data.sessions)
    console.log("ACTIVE SESSIONS", sessions)
  }

  const fetchPendingAttempts = async () => {
    try {
      const response = await getAdminSecurityLogs()
      const attemptsData = Array.isArray(response) ? response : response?.data || []
      setPendingAttempts(attemptsData.filter(a => a.status === 'Pending Review' || a.status === 'pending'))
    } catch (error) {
      console.error('Error fetching pending attempts:', error)
    }
  }

  const handleApproveAttempt = async (attemptId) => {
    setApprovingId(attemptId)
    try {
      const res = await authorizeSecurityGuard(attemptId)
      if (res.success !== false) {
        toast.success('Security login authorized successfully')
        fetchPendingAttempts()
      } else {
        toast.error(res.message || 'Failed to authorize login')
      }
    } catch (error) {
      console.error('Error authorizing login:', error)
      toast.error('Failed to authorize login')
    } finally {
      setApprovingId(null)
    }
  }

  const handleRejectAttempt = async (attemptId) => {
    setApprovingId(attemptId)
    try {
      const res = await rejectSecurityLogin(attemptId)
      if (res.success !== false) {
        toast.success('Security login rejected')
        fetchPendingAttempts()
      } else {
        toast.error(res.message || 'Failed to reject login')
      }
    } catch (error) {
      console.error('Error rejecting login:', error)
      toast.error('Failed to reject login')
    } finally {
      setApprovingId(null)
    }
  }
  // Fetch Guards and Gates
  const fetchData = async () => {
    
    
    setIsLoading(true);
    try {
      // Fetch guards
      const guardsRes = await getAllGuards();
      console.log('Fetched guards:', guardsRes);
      const guardData = Array.isArray(guardsRes) 
        ? guardsRes 
        : (guardsRes?.data || guardsRes?.guards || guardsRes?.docs || []);
      setGuards(guardData);

      // Fetch gates for dropdown
      const gatesRes = await getAllGates();
      console.log('Fetched gates:', gatesRes);
      const gateData = Array.isArray(gatesRes) 
        ? gatesRes 
        : (gatesRes?.data || gatesRes?.gates || gatesRes?.docs || []);
      setGates(gateData);

      // Fetch pending login attempts
      await fetchPendingAttempts();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load security personnel information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate random PIN
  const generatePin = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({ ...prev, pin }));
    toast.info(`Generated PIN: ${pin}`);
  };

  // Generate username based on gate and role
  const generateUsername = () => {
    const gate = gates.find(g => g.id === formData.gateId || g._id === formData.gateId);
    const gateCode = gate?.code || gate?.gateId || 'GATE';
    const rolePrefix = formData.role === 'SUPERVISOR' ? 'sup' : 
                       formData.role === 'TEAM_LEAD' ? 'lead' : 
                       formData.role === 'OFFICER' ? 'off' : 'trn';
    const randomNum = Math.floor(100 + Math.random() * 900);
    const username = `${rolePrefix}_${gateCode.toLowerCase()}_${randomNum}`;
    setFormData(prev => ({ ...prev, username }));
    toast.info(`Generated username: ${username}`);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingGuard(null);
    setFormData({
      username: '',
      pin: '',
      gateId: '',
      maxDevices: 1,
      displayName: '',
      role: 'OFFICER',
      status: 'ACTIVE',
      shift: 'MORNING',
      phone: '',
      experience: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (guard) => {
    setEditingGuard(guard);
    setFormData({
      username: guard.username || '',
      pin: guard.pin || '',
      gateId: guard.gateId || guard.assignedGate || '',
      maxDevices: guard.maxDevices || 1,
      displayName: guard.displayName || guard.name || guard.fullName || '',
      role: guard.role || 'OFFICER',
      status: guard.status || 'ACTIVE',
      shift: guard.shift || 'MORNING',
      phone: guard.phone || '',
      experience: guard.experience || '',
      notes: guard.notes || ''
    });
    setIsModalOpen(true);
  };

  // Handle Create / Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!formData.pin || formData.pin.length < 6) {
      toast.error('PIN must be at least 6 digits');
      return;
    }
    if (!formData.gateId) {
      toast.error('Please select a gate assignment');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare payload - only send required fields
      const payload = {
        username: formData.username,
        pin: formData.pin,
        gateId: formData.gateId,
        maxDevices: formData.maxDevices || 1
      };

      if (editingGuard) {
        const guardId = editingGuard.id || editingGuard._id;
        const res = await updateGuard(guardId, payload);
        
        if (res.success !== false) {
          toast.success(`Guard "${formData.username}" updated successfully!`);
          // Update the guard in the list with new data
          const updatedGuard = { 
            ...editingGuard, 
            ...payload,
            displayName: formData.displayName,
            role: formData.role,
          };
          setGuards(prev => prev.map(g => (g.id === guardId || g._id === guardId) ? updatedGuard : g));
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Failed to update guard');
        }
      } else {
        const res = await createGuard(payload);
        
        if (res.success !== false) {
          toast.success(`Guard "${formData.username}" added successfully!`);
          const newGuard = res.data || res.guard || { 
            ...payload, 
            id: Date.now().toString(), 
            createdAt: new Date().toISOString(),
            displayName: formData.displayName,
            role: formData.role,
            status: formData.status,
            shift: formData.shift,
            phone: formData.phone,
            experience: formData.experience,
            notes: formData.notes
          };
          setGuards(prev => [newGuard, ...prev]);
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Failed to add guard');
        }
      }
    } catch (error) {
      console.error('Error submitting guard:', error);
      toast.error('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteGuard = async () => {
    if (!deletingGuard) return;
    const guardId = deletingGuard.id || deletingGuard._id;
    setIsDeleting(true);

    try {
      const res = await deleteGuard(guardId);
      if (res.success !== false) {
        toast.success(`Guard "${deletingGuard.username}" removed from system`);
        setGuards(prev => prev.filter(g => (g.id !== guardId && g._id !== guardId)));
        setDeletingGuard(null);
      } else {
        toast.error(res.message || 'Failed to delete guard');
      }
    } catch (error) {
      console.error('Error deleting guard:', error);
      toast.error('Error removing guard from system');
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Credentials
  const copyCredentials = (username, pin, id) => {
    const credentials = `Username: ${username}\nPIN: ${pin}`;
    navigator.clipboard.writeText(credentials);
    setCopiedId(id);
    toast.info('Credentials copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

// Build the login payload embedded in the QR code (PIN intentionally excluded — entered on the guard's device)
  const buildLoginPayload = (guard) => ({
    username: guard.username,
    gateId: guard.gateId || guard.assignedGate || ''
  });

  // Generate a login QR code for a guard
  const generateLoginQR = async (guard) => {
    const payload = buildLoginPayload(guard);
    if (!payload.username || !payload.gateId) {
      toast.error('Guard is missing username or gate assignment');
      return;
    }

    setQrLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 400,
        margin: 2,
        color: { dark: '#0d0f13', light: '#ffffff' }
      });
      setQrCodeDataUrl(dataUrl);
      setQrGuard({ ...guard, payload });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setQrLoading(false);
    }
  };

  // Download the QR as a PNG image
  const downloadQR = () => {
    if (!qrCodeDataUrl || !qrGuard) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${qrGuard.username || 'guard'}-login-qr.png`;
    link.click();
    toast.success('QR code downloaded');
  };

  // Copy the raw JSON payload
  const copyQrPayload = () => {
    if (!qrGuard?.payload) return;
    navigator.clipboard.writeText(JSON.stringify(qrGuard.payload));
    toast.info('Login payload copied to clipboard');
  };

  // Get gate name by ID
  const getGateName = (gateId) => {
    const gate = gates.find(g => g.id === gateId || g._id === gateId);
    return gate?.name || gate?.gateName || gate?.code || gateId || 'Unassigned';
  };

  // Filtered Guards
  const filteredGuards = guards.filter(guard => {
    const guardUsername = (guard.username || '').toLowerCase();
    const guardDisplayName = (guard.displayName || guard.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = guardUsername.includes(query) || guardDisplayName.includes(query);
    const matchesStatus = statusFilter === 'ALL' || (guard.status || 'ACTIVE') === statusFilter;
    const matchesRole = roleFilter === 'ALL' || (guard.role || 'OFFICER') === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate Metrics
  const totalGuardsCount = guards.length;
  const activeGuardsCount = guards.filter(g => g.status === 'ACTIVE').length;
  const onBreakCount = guards.filter(g => g.status === 'ON_BREAK').length;
  const offDutyCount = guards.filter(g => g.status === 'OFF_DUTY').length;
  const inactiveCount = guards.filter(g => g.status === 'INACTIVE').length;

  if (isLoading) {
    return <LoadingState message="Loading Security Personnel & Deployment Data..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <PageHeader 
        title="Guard Management" 
        description="Manage security personnel credentials, gate assignments, and deployment status."
        icon={Shield}
        iconColor="indigo"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="indigo"
            icon={Plus}
            onClick={handleOpenCreateModal}
          >
            Add New Guard
          </Button>
        </div>
      </PageHeader>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
        <MetricCard icon={<Shield className="size-5" />} label="Total Personnel" value={totalGuardsCount} tone="cyan" />
        <MetricCard icon={<UserCheck className="size-5" />} label="Active on Duty" value={activeGuardsCount} tone="emerald" />
        <MetricCard icon={<Clock className="size-5" />} label="On Break" value={onBreakCount} tone="amber" />
        <MetricCard icon={<UserX className="size-5" />} label="Off Duty" value={offDutyCount} tone="slate" />
        <MetricCard icon={<AlertTriangle className="size-5" />} label="Inactive" value={inactiveCount} tone="red" />
      </div>

      {/* Pending Security Login Approvals */}
      {pendingAttempts.length > 0 && (
        <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
          <div className="p-4 border-b border-[#2a2d33] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <ShieldAlert className="size-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Pending Security Logins</h3>
                <p className="text-[11px] text-[#8a8f98]">{pendingAttempts.length} guard{pendingAttempts.length !== 1 ? 's' : ''} awaiting approval</p>
              </div>
            </div>
            <button
              onClick={fetchPendingAttempts}
              className="p-2 text-[#8a8f98] hover:text-white hover:bg-[#2a2d33] rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>

          <div className="divide-y divide-[#2a2d33]">
            {pendingAttempts.map((attempt) => (
              <div key={attempt.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#2a2d33]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                    <Shield className="size-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{attempt.guard?.username || 'Unknown Guard'}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-[#8a8f98] font-medium flex items-center gap-1">
                        <MapPin className="size-3" />
                        {attempt.gate?.name || 'Unknown Gate'}
                      </span>
                      <span className="text-[10px] text-[#8a8f98] font-medium flex items-center gap-1">
                        <Clock className="size-3" />
                        {attempt.createdAt ? new Date(attempt.createdAt).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveAttempt(attempt.id)}
                    disabled={approvingId === attempt.id}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-500/20 disabled:opacity-50"
                  >
                    {approvingId === attempt.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    Authorize
                  </button>
                  <button
                    onClick={() => handleRejectAttempt(attempt.id)}
                    disabled={approvingId === attempt.id}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-500/20 disabled:opacity-50"
                  >
                    <X className="size-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Filters & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between  bg-[#818b94]/10 p-4 rounded-lg">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
          <input
            type="text"
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d0f13] rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#0d0f13] px-3 py-1.5 rounded-xl">
            <Filter className="size-3.5 text-[#8a8f98]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white text-[#8a8f98] outline-none border-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {GUARD_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-[#1241a1]  px-3 py-1.5 rounded-xl">
            <Badge className="size-3.5 text-[#8a8f98]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white text-[#8a8f98] outline-none border-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              {GUARD_ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            title="Refresh Guard List"
            className="p-2 bg-[#0d0f13] rounded-xl text-cyan-500 hover:bg-[#2a2d33] hover:bg-[#2a2d33] transition-all cursor-pointer"
          >
            <RefreshCw className="size-4" />
          </button>

          {/* Grid / Table View Switcher */}
          <div className="flex items-center bg-[#0d0f13] rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all border-none cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-[#8a8f98] hover:text-[#8a8f98]'
              }`}
              title="Grid View"
            >
              <Grid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all border-none cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-[#8a8f98] hover:text-[#8a8f98]'
              }`}
              title="Table View"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guards Display */}
      {filteredGuards.length === 0 ? (
        <div className="p-16 text-center bg-[#818b94]/10 rounded-lg">
          <Shield className="size-12 text-[#8a8f98] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white text-[#8a8f98]">No Guards Found</h3>
          <p className="text-[#8a8f98] text-xs font-medium mt-1 mx-auto">
            {searchQuery || statusFilter !== 'ALL' || roleFilter !== 'ALL'
              ? 'No guards match your current filters. Try resetting search parameters.'
              : 'No security personnel records exist yet. Click below to add the first guard.'}
          </p>
          <Button
            variant="indigo"
            icon={Plus}
            className="mt-6"
            onClick={handleOpenCreateModal}
          >
            Add First Guard
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuards.map((guard) => {
            const guardId = guard.id || guard._id;
            const statusObj = GUARD_STATUSES.find(s => s.value === (guard.status || 'ACTIVE')) || GUARD_STATUSES[0];
            const roleObj = GUARD_ROLES.find(r => r.value === (guard.role || 'OFFICER')) || GUARD_ROLES[0];
            const gateName = getGateName(guard.gateId);

            return (
              <div
                key={guardId}
                className="bg-[#0d0f13]  rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top Bar: Avatar, Name & Status */}
                  <div className="flex flex-col items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-emerald-600 transition-colors">
                           {guard.displayName || guard.name || guard.username}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#8a8f98] tracking-wider mt-0.5 flex items-center gap-1.5">
                          <span className="font-mono">@{guard.username}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusObj.color}`}>
                       {statusObj.label}
                    </span>
                  </div>

                  {/* Guard Details */}
                  <div className="space-y-2.5 py-3 border-y border-[#2a2d33] text-xs">
                    {/* Credentials */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Key className="size-3.5 text-[#8a8f98]" />
                        <span className="text-[#8a8f98] font-mono font-bold">
                          PIN: {guard.pin || '••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="size-3.5 text-[#8a8f98]" />
                        <span className="text-[#8a8f98] font-medium">
                          {guard.maxDevices || 1} device{guard.maxDevices !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Assignment & Gate */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <DoorOpen className="size-3.5 text-[#8a8f98]" />
                        <span className="text-[#8a8f98] font-medium">
                          {gateName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-[#8a8f98]" />
                        <span className="text-[#8a8f98] font-medium text-[10px]">
                          {SHIFT_SCHEDULES.find(s => s.value === guard.shift)?.label || guard.shift || 'Not Assigned'}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {guard.notes && (
                      <p className="text-[10px] text-[#8a8f98] font-medium line-clamp-2 pt-1 italic">
                        {guard.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="mt-5 pt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => generateLoginQR(guard)}
                    className="p-2 text-[#8a8f98] hover:text-cyan-500 hover:bg-cyan-500/10 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                    title="Generate Login QR Code"
                  >
                    <QrCode className="size-4" />
                  </button>

                  <button
                    onClick={() => copyCredentials(guard.username, guard.pin, guardId)}
                    className="flex-1 py-2 px-3 bg-transparent border border-cyan-500/20 hover:bg-cyan-500/10 text-cyan-500 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                  >
                    {copiedId === guardId ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(guard)}
                    className="p-2 text-[#8a8f98] hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                    title="Edit Guard"
                  >
                    <Edit3 className="size-4" />
                  </button>

                  <button
                    onClick={() => setDeletingGuard(guard)}
                    className="p-2 text-[#8a8f98] hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                    title="Remove Guard"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#818b94]/10 bg-[#0d0f13] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1a1d23] text-[#8a8f98] text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Guard</th>
                  <th className="px-6 py-4">Assigned Gate</th>
                  <th className="px-6 py-4">Devices</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2d33]">
                {filteredGuards.map((guard) => {
                  const guardId = guard.id || guard._id;
                  const statusObj = GUARD_STATUSES.find(s => s.value === (guard.status)) || GUARD_STATUSES[0];
                  const gateName = getGateName(guard.gateId);

                  return (
                    <tr key={guardId} className="hover:bg-[#1a1d23] hover:bg-[#2a2d33] transition-colors">
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                        {guard.displayName || guard.name || guard.username}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-600 text-emerald-400">
                        {gateName}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#8a8f98]">
                        {guard.maxDevices || 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => generateLoginQR(guard)}
                            className="p-1.5 text-cyan-500 hover:bg-[#1241a1]/10 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                            title="Generate Login QR Code"
                          >
                            <QrCode className="size-4" />
                          </button>

                          <button
                            onClick={() => {
                              handleOpenEditModal(guard)
                              fetchSession(guardId)
                            }}
                            className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-all border-none bg-transparent cursor-pointer text-xs font-bold"
                            title="View Guard Details"
                          >
                            View
                          </button>
                        
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT GUARD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0d0f13] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 flex items-center justify-between bg-[#1241a1] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1241a1] text-white rounded-2xl">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {editingGuard ? 'Edit Guard Credentials' : 'Add New Security Personnel'}
                  </h3>
                  <p className="text-xs text-[#8a8f98] font-medium">Set up login credentials and gate assignment</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8a8f98] hover:text-[#8a8f98] rounded-full transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Required Fields Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1241a1] uppercase tracking-wider flex items-center gap-2">
                  <Key className="size-3.5" />
                  Required Credentials
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                      Username *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="e.g. officer_gate01_123"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateUsername}
                      className="text-[10px] font-semibold text-[#1241a1] hover:text-[#1a51b1] mt-1 border-none bg-transparent cursor-pointer"
                    >
                     Generate Username
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                      PIN (6 digits) *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
                      <input
                        type="password"
                        name="pin"
                        value={formData.pin}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit PIN"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono tracking-widest"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generatePin}
                      className="text-[10px] font-semibold text-[#1241a1] hover:text-[#1a51b1] mt-1 border-none bg-transparent cursor-pointer"
                    >
                      Generate PIN
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                      Assign Gate *
                    </label>
                    <select
                      name="gateId"
                      value={formData.gateId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                      <option value="">Select a gate...</option>
                      {gates.map(gate => {
                        const gateId = gate.id || gate._id;
                        const gateName = gate.name || gate.gateName || gate.code || 'Unnamed Gate';
                        return (
                          <option key={gateId} value={gateId}>
                            {gateName} ({gate.code || gate.gateId || 'N/A'})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[10px] text-[#1241a1] mt-1">Select the gate this guard will be assigned to</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                      Max Devices
                    </label>
                    <select
                      name="maxDevices"
                      value={formData.maxDevices}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} device{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Optional Profile Information */}
              <div className="space-y-3 pt-3 bg-[#1241a1]/10 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-[#8a8f98] uppercase tracking-wider flex items-center gap-2">
                  <User className="size-3.5" />
                  Active sessions
                </h4>

                {
                  activeSessions.length > 0 ? (
                    <div className="space-y-1.5">
                     
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeSessions && activeSessions.map(session => (
                          <div key={session.id} className="flex flex-col gap-3 p-2 ">
                            <span className="text-sm font-semibold text-[#8a8f98]">Device: {session.deviceInfo}</span>
                            <span className="text-sm font-semibold text-[#8a8f98]">IP Address: {session.ipAddress}</span>
                            <span className="text-sm font-semibold text-[#8a8f98]">Created: {session.createdAt}</span>
                            <span className="text-sm font-semibold text-[#8a8f98]">Gate: {session.gate.name}</span>

                          </div>
                        ))}
                      </div>
                    </div>
                  ):(
                    <p className="text-sm text-[#8a8f98]">No active sessions</p>
                  )
                }

                
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 ">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="indigo"
                  icon={CheckCircle2}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingGuard ? 'Update Guard' : 'Add Guard'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0d0f13] rounded-3xl shadow-2xl w-full max-w-md p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-14 bg-red-500/10 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <UserX className="size-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Remove Guard?</h3>
              <p className="text-xs text-[#8a8f98] mt-1 max-w-xs mx-auto">
                Are you sure you want to remove <span className="font-bold text-white">{deletingGuard.username}</span> from the security team? This will revoke their access credentials.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setDeletingGuard(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteGuard}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN QR MODAL */}
      {qrGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-[#0d0f13] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between bg-[#1241a1] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 text-white bg-[#1241a1] rounded-xl">
                  <QrCode className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Login QR Code</h3>
                  <p className="text-[11px] text-[#8a8f98] font-medium">
                    Guard scans this to log in
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQrGuard(null)}
                className="p-2 text-white hover:text-white rounded-full transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {qrLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="size-8 text-[#1241a1] animate-spin" />
                  <p className="text-xs text-[#8a8f98] font-medium">Generating QR code...</p>
                </div>
              ) : (
                <>
                  {/* QR Code Image */}
                  <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCodeDataUrl}
                      alt={`Login QR for ${qrGuard.username}`}
                      className="w-56 h-56 object-contain"
                    />
                  </div>

                  {/* Credentials Summary */}
                  <div className="bg-[#1a1d23] rounded-xl p-4 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#8a8f98]">Username</span>
                      <span className="text-white font-bold">{qrGuard.payload.username}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#8a8f98]">Gate</span>
                      <span className="text-white font-bold">{getGateName(qrGuard.payload.gateId)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#8a8f98]">PIN</span>
                      <span className="text-amber-400 font-bold text-[10px]">Entered on device</span>
                    </div>
                  </div>

                  {/* Payload Preview */}
                  <div className="bg-[#0d0f13] border border-[#2a2d33] rounded-xl p-4">
                    <p className="text-[10px] text-[#8a8f98] font-bold uppercase tracking-wider mb-2">
                      Encoded Payload
                    </p>
                    <pre className="text-[11px] leading-relaxed text-[#1241a1] whitespace-pre-wrap break-all">
                      {JSON.stringify(qrGuard.payload, null, 2)}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={copyQrPayload}
                      className="flex-1 py-2.5 rounded-xl border border-[#2a2d33] text-[#8a8f98] hover:text-white hover:bg-[#2a2d33] transition-colors text-sm font-semibold flex items-center justify-center gap-2 border-none"
                    >
                      <Copy className="size-4" />
                      Copy JSON
                    </button>
                    <button
                      onClick={downloadQR}
                      className="flex-1 py-2.5 rounded-xl bg-[#1241a1] hover:bg-[#1a51b1] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" />
                      Download
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-amber-500/80 flex items-center justify-center gap-1">
                    <AlertTriangle className="size-3" />
                    Share securely — this QR grants guard login access.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}