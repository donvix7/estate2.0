'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { 
  Info, 
  Calendar, 
  Upload, 
  Plus, 
  X, 
  Image as ImageIcon, 
  ShieldCheck, 
  ArrowRight,
  Wrench
} from 'lucide-react';
import { submitMaintenanceRequest } from '@/lib/action';
import { getResidentData } from '@/lib/service';
import { useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';

const CATEGORIES = [
  'Select category',
  'Plumbing',
  'Electrical',
  'HVAC / Air Conditioning',
  'Appliance Repair',
  'Structural / Wall',
  'Landscaping',
  'General Maintenance',
]

const TIME_WINDOWS = [
  'Morning (8:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 8:00 PM)',
]

const URGENCY = [
  { id: 'low',    label: 'Low',    active: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'medium', label: 'Medium', active: 'bg-amber-500/10 text-amber-500' },
  { id: 'high',   label: 'High',   active: 'bg-red-500/10 text-red-500' },
]

export default function NewMaintenanceRequestPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    category: '',
    urgency: 'medium',
    description: '',
    date: '',
    timeWindow: TIME_WINDOWS[0],
  })
  const [previews, setPreviews] = useState([])
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [residentData, setResidentData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const data = await getResidentData();
      if (data) setResidentData(data);
    };
    loadData();
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFiles = (files) => {
    const urls = Array.from(files)
      .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .slice(0, 3)
      .map(f => ({ url: URL.createObjectURL(f), name: f.name }))
    setPreviews(prev => [...prev, ...urls].slice(0, 3))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removePreview = (i) => setPreviews(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!form.category || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    
    // Map form to requested schema
    const payload = {
      title: form.category,
      type: "maintenance",
      category: form.category,
      icon: `${form.category.toLowerCase().split(' ')[0]}_icon`,
      status: "Pending",
      priority: form.urgency.charAt(0).toUpperCase() + form.urgency.slice(1),
      desc: form.description,
      residentId: residentData?._id || residentData?.id || "RES-123",
      serviceWorkerId: "",
      timeline: [
        { label: 'Reported', time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), done: true },
        { label: 'Preferred Window', time: form.timeWindow, done: false },
        { label: 'Pending', time: 'Awaiting assignment', done: false, current: true }
      ],
      estateID: residentData?.estateID || "EST-001"
    }

    try {
      const res = await submitMaintenanceRequest(payload)
      if (res && (res.id || res.success)) {
        toast.success('Maintenance request submitted successfully')
        router.push('/dashboard/resident/maintenance')
      } else {
        toast.error('Failed to submit maintenance request')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred during submission')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-700">

      {/* ── Header ── */}
      <PageHeader
        title="New Maintenance Request"
        description="Submit a new service ticket for property repairs. We typically respond within 24 hours."
        icon={Wrench}
        iconColor="blue"
      />

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── LEFT: Request Details ── */}
        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle icon={Info} title="Request Details" />
            </CardHeader>
            <CardBody className="space-y-5">

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white ">Issue Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#1a1d23] rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none appearance-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c === 'Select category' ? '' : c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white ">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, urgency: u.id }))}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      form.urgency === u.id
                        ? u.active
                        : 'bg-[#1a1d23] text-[#8a8f98] text-[#8a8f98]'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white ">Detailed Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the issue in detail, including when it started and any troubleshooting steps taken..."
                className="w-full bg-[#1a1d23] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none resize-none placeholder:text-[#8a8f98] placeholder:text-[#8a8f98]"
              />
            </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle icon={Calendar} title="Preferred Service Time" />
            </CardHeader>
            <CardBody className="space-y-5">

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white ">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-[#1a1d23] rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white ">Time Window</label>
              <select
                name="timeWindow"
                value={form.timeWindow}
                onChange={handleChange}
                className="w-full bg-[#1a1d23] rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none appearance-none cursor-pointer"
              >
                {TIME_WINDOWS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            </CardBody>
          </Card>
        </div>

        {/* ── RIGHT: Photos & Submit ── */}
        <div className="space-y-6 flex flex-col">

          <Card className="flex-1">
            <CardHeader>
              <CardTitle icon={Upload} title="Photos & Videos" />
            </CardHeader>
            <CardBody>
            <p className="text-xs text-[#8a8f98] text-[#8a8f98] mb-5">
              Visual documentation helps our team prepare the right tools.
            </p>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex flex-col items-center justify-center rounded-xl p-8 text-center cursor-pointer group transition-all ${
                dragging
                  ? 'bg-[#1241a1]/5'
                  : 'bg-[#1a1d23] bg-[#1a1d23]/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <div className="size-16 rounded-full bg-[#1241a1]/10 flex items-center justify-center text-[#1241a1] mb-4 group-hover:scale-110 transition-transform">
                <Plus className="size-10" />
              </div>
              <p className="text-sm font-bold">Drag and drop files here</p>
              <p className="text-xs text-[#8a8f98] text-[#8a8f98] mt-1">or click to browse from your device</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['JPG', 'PNG', 'MP4', 'HEIC'].map(t => (
                  <span key={t} className="px-2 py-1 bg-[#1a1d23] rounded text-[10px] font-bold text-[#8a8f98] ">{t}</span>
                ))}
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {previews.map((p, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover opacity-80" />
                    <button
                      type="button"
                      onClick={() => removePreview(i)}
                      className="absolute top-1.5 right-1.5 size-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - previews.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-xl flex items-center justify-center  text-white">
                    <ImageIcon className="size-6" />
                  </div>
                ))}
              </div>
            )}

            {previews.length === 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="aspect-square rounded-xl flex items-center justify-center  text-white">
                    <ImageIcon className="size-6" />
                  </div>
                ))}
              </div>
            )}
            </CardBody>
          </Card>

          <div className="bg-[#1241a1]/5 bg-[#1241a1]/10 p-5 rounded-2xl">
            <h4 className="text-sm font-bold flex items-center gap-2 text-[#1241a1] mb-2">
              <ShieldCheck className="size-4" />
              Service Guarantee
            </h4>
            <p className="text-xs text-[#8a8f98]  leading-relaxed">
              Our licensed professionals follow strict safety protocols. By submitting this request, you authorize
              our staff to enter the premises during the selected time window.
            </p>
          </div>
        </div>

      </form>

      {/* ── Footer Actions ── */}
      <div className="mt-10 flex items-center justify-end gap-4 pt-8">
        <button
          type="button"
          onClick={() => router.push('/dashboard/resident/maintenance')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#8a8f98] text-[#8a8f98] hover:bg-[#1a1d23]  transition-colors"
        >
          Cancel &amp; Save Draft
        </button>
        <button
          type="submit"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-[#1241a1] hover:bg-[#1241a1]/90 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-[#1241a1]/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <span>Create Maintenance Ticket</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
