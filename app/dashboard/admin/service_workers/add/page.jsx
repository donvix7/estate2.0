'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  Save, 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Zap, 
  Wallet, 
  Star, 
  Info, 
  Camera,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { handleCreateWorker } from '@/lib/action';
import { getEstateData } from '@/lib/service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';

export default function AddServiceWorkerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estateId, setEstateId] = useState("unknown");
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: 'Electrical',
    phone: '',
    email: '',
    rate: '',
    skills: '',
    verified: false,
    rating: 0,
    jobs: "0",
    status: 'active'
  });

  useEffect(() => {
    const fetchEstateId = async () => {
      const estate = await getEstateData();
      if (estate?._id) setEstateId(estate._id);
    };
    fetchEstateId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await handleCreateWorker({ ...formData, estateID: estateId });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('Worker profile created successfully');
      router.push('/dashboard/admin/service_workers');
    } catch (error) {
      toast.error(error.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Register New Personnel" 
        description="Create a profile for a new service professional in the estate workforce."
        icon={Briefcase}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Onboarding...' : 'Finalize Profile'}
          </Button>
        </div>
      </PageHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Identity Details */}
            <Card>
              <CardHeader>
                <CardTitle icon={User} title="Personal Identity" />
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. James Taylor"
                    className="w-full px-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="worker@estate.com"
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Direct Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+234 000 000 0000"
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Professional Classification */}
            <Card>
              <CardHeader>
                <CardTitle icon={Zap} title="Professional Metrics" />
              </CardHeader>
              <CardBody className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Professional Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Lead Electrician"
                      className="w-full px-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Department / Category</label>
                    <div className="relative">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={16} />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                      >
                        <option value="Electrical">Electrical Services</option>
                        <option value="Plumbing">Plumbing & HVAC</option>
                        <option value="Carpentry">Carpentry & Fit-outs</option>
                        <option value="Cleaning">Sanitation & Cleaning</option>
                        <option value="Security">Estate Security</option>
                        <option value="Gardening">Landscaping & Gardening</option>
                        <option value="Other">General Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Hourly Rate (₦/hr)</label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={16} />
                      <input
                        type="text"
                        name="rate"
                        value={formData.rate}
                        onChange={handleInputChange}
                        required
                        placeholder="25,000"
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest ml-1">Expertise Tags (Comma Sep)</label>
                    <div className="relative">
                      <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={16} />
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="Washing Machines, AC Repairs..."
                        className="w-full pl-12 pr-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Verification Status */}
            <Card>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest">System Verification</label>
                  <div 
                     onClick={() => setFormData(prev => ({ ...prev, verified: !prev.verified }))}
                     className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                       formData.verified 
                         ? 'bg-emerald-50/50 text-emerald-700' 
                         : 'bg-[#1a1d23] text-[#8a8f98]'
                     }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className={formData.verified ? 'text-emerald-500' : 'text-[#8a8f98]'} />
                      <span className="text-xs font-black uppercase tracking-wider">Identity Verified</span>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.verified ? 'bg-emerald-500 border-emerald-500' : 'border-[#2a2d33]'
                    }`}>
                      {formData.verified && <div className="size-2 bg-[#1a1d23] rounded-full" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8a8f98] uppercase tracking-widest">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl border-none bg-[#1a1d23] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all font-black text-xs appearance-none cursor-pointer"
                  >
                    <option value="active">Active Workforce</option>
                    <option value="inactive">On Leave / Inactive</option>
                  </select>
                </div>
              </CardBody>
            </Card>

            {/* Profile Asset */}
            <Card>
              <CardBody>
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="size-36 bg-[#1a1d23] rounded-3xl flex items-center justify-center text-[#8a8f98] relative group cursor-pointer overflow-hidden border-2 border-dashed border-[#2a2d33] hover:border-[#1241a1] transition-all">
                    <Camera size={32} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-[#1241a1]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      Upload Media
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-white tracking-widest uppercase">Worker Avatar</h4>
                    <p className="text-[10px] text-[#8a8f98] font-bold leading-tight">Displayed in directory and client booking panels.</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Compliance Info */}
            <div className="bg-[#1a1d23]/50 bg-[#1241a1] rounded-2xl p-5 flex gap-4">
              <Info size={18} className="text-[#1241a1] mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-[#1241a1]/80 text-[#1241a1]/80 leading-relaxed">
                By registering this personnel, you authorize their access to estate maintenance logs and resident contact details for active service assignments.
              </p>
            </div>
          </div>
        </form>
    </div>
  );
}
