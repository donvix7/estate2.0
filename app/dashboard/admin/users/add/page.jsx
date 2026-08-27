'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  User, 
  Briefcase, 
  Shield, 
  Users, 
  Save, 
  ChevronLeft,
  Building2,
  Info
} from 'lucide-react';
import { handleCreateUser, handleResidentRequest } from '@/lib/action';
import { getCurrentSession, getEstateData } from '@/lib/service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';



export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estateId, setEstateId] = useState("unknown")
  const [formData, setFormData] = useState({
   
    phone: '',
    estateID: '', // Defaulting to a placeholder as per example
    status: 'active',
    type: 'residents'
  });

  const handleInputChange = (e) => {
    const {  value } = e.target;
    setFormData(prev => ({ ...prev,phone: value }));
  };

   useEffect(() => {
    const fetchEstateId = async () => {
      const estate = await getEstateData();
      const estateId = estate?._id;
        setEstateId(estateId);
    };

    fetchEstateId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Exact payload structure as requested
    const payload = {
      phone: formData.phone,
      estateID: estateId,
    };

    
    setIsSubmitting(true);
    try {
      if (formData.type === 'residents') {
        const result = await handleResidentRequest(payload, formData.type);
        if (result.success) {
          toast.success('Profile created successfully');
          router.push('/dashboard/admin/users');
        }
      }
      if (formData.type === 'worker'|| formData.type === 'admin') {
        const result = await handleCreateUser(payload,formData.type);
        if (result.success) {
          toast.success('Profile created successfully');
          router.push('/dashboard/admin/users');
        }
      }
    } catch (error) {
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Create New Identity" 
        description="Register a new resident, staff, or security profile in the estate directory."
        icon={User}
        iconColor="blue"
      >
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={ChevronLeft} onClick={() => router.back()}>
            Discard
          </Button>
          <Button
            size="md"
            icon={Save}
            onClick={handleSubmit}
            disabled={!formData.phone || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Save Profile'}
          </Button>
        </div>
      </PageHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Section */}
            <Card>
              <CardHeader>
                <CardTitle icon={User} title="Personal Information" />
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Estate ID</label>
                    <input
                      type="text"
                      name="estateID"
                      value={estateId}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Classification Specific Section */}
            <Card>
              <CardHeader>
                <CardTitle icon={Briefcase} title={`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Details`} />
                <span className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest px-2 py-0.5 bg-[#1a1d23] rounded shrink-0">Required</span>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {formData.type === 'staff' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Designated Role</label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="e.g. Supervisor"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Assigned Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="Internal Operations"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === 'security' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Security Badge ID</label>
                        <input
                          type="text"
                          name="badgeNumber"
                          value={formData.badgeNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium"
                          placeholder="SEC-0012"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest ml-0.5">Assigned Shift</label>
                        <select
                          name="shift"
                          value={formData.shift}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-medium appearance-none"
                        >
                          <option value="">Select Shift</option>
                          <option value="Morning">Morning Phase</option>
                          <option value="Evening">Evening Phase</option>
                          <option value="Night">Night Phase</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Identity Settings Card */}
            <Card>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest">Classification</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['residents', 'staffs', 'securitys'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                          formData.type === type 
                            ? 'border-[#1241a1] bg-[#1a1d23]/50 bg-[#1241a1] text-[#1241a1]' 
                            : 'text-[#8a8f98] hover:bg-[#1a1d23]'
                        }`}
                      >
                        {type === 'residents' && <Building2 size={16} />}
                        {type === 'staffs' && <Users size={16} />}
                        {type === 'securitys' && <Shield size={16} />}
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-[#8a8f98] uppercase tracking-widest">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 focus:border-[#1241a1] outline-none transition-all font-bold appearance-none"
                  >
                    <option value="active">Active System Profile</option>
                    <option value="pending">Awaiting Verification</option>
                    <option value="inactive">Disabled / Inactive</option>
                  </select>
                </div>
              </CardBody>
            </Card>

            {/* Info Box */}
            <div className="bg-[#1a1d23]/50 bg-[#1241a1] rounded-xl border border-[#2a2d33] border-[#2a2d33] p-4 flex gap-3">
              <Info size={16} className="text-[#1241a1] mt-0.5 shrink-0" />
              <p className="text-[11px] font-semibold text-[#1241a1]/80 text-[#1241a1]/80 leading-relaxed">
                Profile creation initializes a system-wide identity. Residents gain access to service portals, while staff/security gain operational controls.
              </p>
            </div>
          </div>
        </form>
    </div>
  );
}
