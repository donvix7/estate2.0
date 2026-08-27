'use client';

import React, { useState, useEffect } from 'react';
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Tag, 
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
  Lock,
  Building2,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import MetricCard from '@/components/MetricCard';
import { getAllGates } from '@/lib/service';
import { createGate, updateGate, deleteGate } from '@/lib/action';

const GATE_TYPES = [
  { value: 'MAIN', label: 'Main Gate Entrance' },
  { value: 'RESIDENT', label: 'Resident Only Gate' },
  { value: 'PEDESTRIAN', label: 'Pedestrian Walkway Gate' },
  { value: 'SERVICE', label: 'Service & Cargo Gate' },
  { value: 'EXIT', label: 'Exit Only Gate' }
];

const GATE_STATUSES = [
  { value: 'ACTIVE', label: 'Active', tone: 'green' },
  { value: 'MAINTENANCE', label: 'Maintenance Mode', tone: 'amber' },
  { value: 'INACTIVE', label: 'Inactive', tone: 'red' }
];

export default function GatesManagementPage() {
  const [gates, setGates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [copiedId, setCopiedId] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGate, setEditingGate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deletingGate, setDeletingGate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'MAIN',
    location: '',
    status: 'ACTIVE',
    description: ''
  });

  // Fetch Gates
  const fetchGates = async () => {
    setIsLoading(true);
    try {
      const res = await getAllGates();
      const gateData = Array.isArray(res) 
        ? res 
        : (res?.data || res?.gates || res?.docs || []);
      setGates(gateData);
    } catch (error) {
      console.error('Error fetching gates:', error);
      toast.error('Failed to load gates information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingGate(null);
    setFormData({
      name: '',
      code: `GATE-${Math.floor(100 + Math.random() * 900)}`,
      type: 'MAIN',
      location: '',
      status: 'ACTIVE',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (gate) => {
    setEditingGate(gate);
    setFormData({
      name: gate.name || gate.gateName || '',
      code: gate.code || gate.gateId || '',
      type: gate.type || 'MAIN',
      location: gate.location || gate.address || '',
      status: gate.status || (gate.isActive ? 'ACTIVE' : 'INACTIVE'),
      description: gate.description || gate.notes || ''
    });
    setIsModalOpen(true);
  };

  // Handle Create / Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Gate name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingGate) {
        const gateId = editingGate.id || editingGate._id;
        const res = await updateGate(gateId, formData);
        
        if (res.success !== false) {
          toast.success(`Gate "${formData.name}" updated successfully!`);
          setGates(prev => prev.map(g => (g.id === gateId || g._id === gateId) ? { ...g, ...formData } : g));
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Failed to update gate');
        }
      } else {
        const payload = {
          name: formData.name,
        };
        const res = await createGate(payload);
        
        if (res.success !== false) {
          toast.success(`Gate "${formData.name}" created successfully!`);
          const newGate = res.data || res.gate || { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() };
          setGates(prev => [newGate, ...prev]);
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Failed to create gate');
        }
      }
    } catch (error) {
      console.error('Error submitting gate:', error);
      toast.error('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteGate = async () => {
    if (!deletingGate) return;
    const gateId = deletingGate.id || deletingGate._id;
    setIsDeleting(true);

    try {
      const res = await deleteGate(gateId);
      if (res.success !== false) {
        toast.success(`Gate "${deletingGate.name || deletingGate.gateName}" deleted`);
        setGates(prev => prev.filter(g => (g.id !== gateId && g._id !== gateId)));
        setDeletingGate(null);
      } else {
        toast.error(res.message || 'Failed to delete gate');
      }
    } catch (error) {
      console.error('Error deleting gate:', error);
      toast.error('Error removing gate');
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Gate Code
  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.info(`Copied gate code: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Gates
  const filteredGates = gates.filter(gate => {
    const gateName = (gate.name || gate.gateName || '').toLowerCase();
    const gateCode = (gate.code || gate.gateId || '').toLowerCase();
    const gateLoc = (gate.location || gate.address || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = gateName.includes(query) || gateCode.includes(query) || gateLoc.includes(query);
    const matchesStatus = statusFilter === 'ALL' || (gate.status || (gate.isActive ? 'ACTIVE' : 'INACTIVE')) === statusFilter;
    const matchesType = typeFilter === 'ALL' || (gate.type || 'MAIN') === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate Metrics
  const totalGatesCount = gates.length;
  const activeGatesCount = gates.filter(g => (g.status || (g.isActive ? 'ACTIVE' : 'INACTIVE')) === 'ACTIVE').length;
  const maintenanceGatesCount = gates.filter(g => g.status === 'MAINTENANCE').length;
  const inactiveGatesCount = gates.filter(g => (g.status || (g.isActive ? 'ACTIVE' : 'INACTIVE')) === 'INACTIVE').length;

  if (isLoading) {
    return <LoadingState message="Loading Gates Intel & Configuration..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <PageHeader 
        title="Gate Management" 
        description="Create, configure, and manage entry and exit gates across the estate."
        icon={DoorOpen}
        iconColor="indigo"
      >
        <Button
          variant="indigo"
          size="md"
          icon={Plus}
          onClick={handleOpenCreateModal}
        >
          Add New Gate
        </Button>
      </PageHeader>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <MetricCard icon={<DoorOpen className="size-5" />} label="Total Gates" value={totalGatesCount} tone="blue" />
        <MetricCard icon={<ShieldCheck className="size-5" />} label="Active Gates" value={activeGatesCount} tone="green" />
        <MetricCard icon={<AlertTriangle className="size-5" />} label="Maintenance" value={maintenanceGatesCount} tone="amber" />
        <MetricCard icon={<Lock className="size-5" />} label="Inactive" value={inactiveGatesCount} tone="red" />
      </div>

      {/* Controls Bar: Search, Filters & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by gate name, code, location..."
          className="w-full md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#818b94]/30 px-3 py-1.5 rounded-xl">
            <Filter className="size-3.5 text-[#8a8f98]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white text-[#8a8f98] outline-none border-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {GATE_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-[#818b94]/30 px-3 py-1.5 rounded-xl">
            <Tag className="size-3.5 text-[#8a8f98]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white text-[#8a8f98] outline-none border-none cursor-pointer"
            >
              <option value="ALL">All Gate Types</option>
              {GATE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchGates}
            title="Refresh Gates List"
            className="p-2 bg-[#818b94]/30 rounded-xl text-[#8a8f98] hover:bg-[#1a1d23] hover:bg-[#2a2d33] transition-all cursor-pointer border-none"
          >
            <RefreshCw className="size-4" />
          </button>

          {/* Grid / Table View Switcher */}
          <div className="flex items-center bg-[#818b94]/30 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all border-none cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-[#1241a1] text-white' 
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
                  ? 'bg-[#1241a1] text-white' 
                  : 'text-[#8a8f98] hover:text-[#8a8f98]'
              }`}
              title="Table View"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gates Display */}
      {filteredGates.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={DoorOpen}
              title="No Gates Found"
              description={
                searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                  ? 'No gates match your current filters. Try resetting search parameters.'
                  : 'No gate configurations exist yet. Click below to add the first estate gate.'
              }
            >
              <Button
                variant="indigo"
                icon={Plus}
                onClick={handleOpenCreateModal}
              >
                Create First Gate
              </Button>
            </EmptyState>
          </CardBody>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGates.map((gate) => {
            const gateId = gate.id || gate._id;
            const statusObj = GATE_STATUSES.find(s => s.value === (gate.status || (gate.isActive ? 'ACTIVE' : 'INACTIVE'))) || GATE_STATUSES[0];
            const typeLabel = GATE_TYPES.find(t => t.value === gate.type)?.label || gate.type || 'Gate Entrance';

            return (
              <div 
                key={gateId} 
                className="group bg-[#818b94]/10 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-[#0d0f13]/5 "
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-lg bg-[#1241a1]/10 flex items-center justify-center text-[#1241a1] group-hover:scale-105 transition-transform">
                    <DoorOpen className="size-6" />
                  </div>
                  <StatusBadge
                    status={statusObj.label}
                    tone={statusObj.tone}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-sm md:text-base text-white group-hover:text-[#1241a1] transition-colors">
                    {gate.name || gate.gateName || 'Unnamed Gate'}
                  </h4>
                  
                  <p className="text-xs text-[#8a8f98] font-medium">
                    {typeLabel}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#8a8f98]">
                    <MapPin className="size-3.5 text-[#1241a1]" />
                    <span>{gate.location || gate.address || 'Estate Perimeter'}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">Code:</span>
                    <span className="font-mono text-xs font-bold text-white text-[#8a8f98]">
                      {gate.code || gate.gateId || 'N/A'}
                    </span>
                    <button
                      onClick={() => copyCode(gate.code || gate.gateId, gateId)}
                      className="text-[#8a8f98] hover:text-[#1241a1] transition-colors border-none bg-transparent cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedId === gateId ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>

                  {gate.description && (
                    <p className="text-[11px] text-[#8a8f98] font-medium line-clamp-2 pt-1">
                      {gate.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(gate)}
                    className="p-2 text-[#8a8f98] hover:text-[#1241a1] hover:bg-[#1241a1]/10 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                    title="Edit Gate"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
               
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#1a1d23] text-[#8a8f98] text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Gate Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2d33]">
                  {filteredGates.map((gate) => {
                    const gateId = gate.id || gate._id;
                    const statusObj = GATE_STATUSES.find(s => s.value === (gate.status || (gate.isActive ? 'ACTIVE' : 'INACTIVE'))) || GATE_STATUSES[0];
                    const typeLabel = GATE_TYPES.find(t => t.value === gate.type)?.label || gate.type || 'Entrance';

                    return (
                      <tr key={gateId} className="hover:bg-[#1a1d23] hover:bg-[#2a2d33] transition-colors">
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                          <div className="p-2 bg-[#1241a1]/10 text-[#1241a1] rounded-xl">
                            <DoorOpen className="size-4" />
                          </div>
                          {gate.name || gate.gateName}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-[#8a8f98]">
                          {typeLabel}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-[#8a8f98]">
                          {gate.location || gate.address || 'Perimeter'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            status={statusObj.label}
                            tone={statusObj.tone}
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(gate)}
                              className="p-1.5 text-[#8a8f98] hover:text-[#1241a1] hover:bg-[#1241a1]/10 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                              title="Edit"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                           
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* CREATE / EDIT GATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0d0f13] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between bg-[#1a1d23]0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1241a1]/10 text-[#1241a1] rounded-2xl">
                  <DoorOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {editingGate ? 'Edit Gate Configuration' : 'Create New Gate'}
                  </h3>
                  <p className="text-xs text-[#8a8f98] font-medium">Set gate entry rules, location and status</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8a8f98] hover:text-[#8a8f98] rounded-full transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                  Gate Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Main North Entrance Gate"
                  required
                  className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                  Gate Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/20 font-medium"
                >
                  {GATE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                  Location / Address
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Main Road, Sector A"
                  className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/20 font-medium"
                >
                  {GATE_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white text-[#8a8f98] uppercase tracking-wider">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this gate..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1a1d23] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/20 font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
               
                 <Button
                    onClick={() => setDeletingGate(gate)}
                    variant="danger"
                    icon={Trash2}
                    title="Delete"
                  >
                    Delete Gate
                  </Button>

                <Button
                  variant="indigo"
                  icon={CheckCircle2}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingGate ? 'Update Gate' : 'Create Gate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0d0f13] rounded-2xl shadow-2xl w-full max-w-md p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-14 bg-rose-500/10 text-rose-600 rounded-2xl mx-auto flex items-center justify-center">
              <Trash2 className="size-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Delete Gate?</h3>
              <p className="text-xs text-[#8a8f98] mt-1 max-w-xs mx-auto">
                Are you sure you want to remove gate <span className="font-bold text-white">{deletingGate.name || deletingGate.gateName}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setDeletingGate(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteGate}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}