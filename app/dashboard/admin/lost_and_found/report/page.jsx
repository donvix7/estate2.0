'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Camera, 
  Send, 
  PackageSearch 
} from 'lucide-react'
import { toast } from 'react-toastify'
import { submitLostAndFound } from '@/lib/action'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

const CATEGORIES = ['Electronics', 'Clothing', 'Personal Accessories', 'Keys / Wallets', 'Pets', 'Others']

export default function ReportItemPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [reportType, setReportType] = useState('lost')
  const [privacy, setPrivacy] = useState(true)
  const [urgent, setUrgent] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 600 // Reduced from 800
          const MAX_HEIGHT = 600 // Reduced from 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          // Quality 0.4 to stay under 100kb with Base64 overhead
          resolve(canvas.toDataURL('image/jpeg', 0.4))
        }
      }
    })
  }

  const [form, setForm] = useState({
    name: '',
    category: 'Electronics',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    image: '',
  })

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFiles = async (files) => {
    const selectedFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    const urls = selectedFiles.slice(0, 5).map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls].slice(0, 5))

    if (selectedFiles[0]) {
      try {
        const compressed = await compressImage(selectedFiles[0])
        setForm(prev => ({ ...prev, image: compressed }))
      } catch (err) {
        console.error('Compression error:', err)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const reportData = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      status: reportType, // 'lost' or 'found'
      icon: form.category === 'Pets' ? 'Dog' : 
            form.category === 'Electronics' ? 'Smartphone' : 
            form.category === 'Keys / Wallets' ? 'Key' : 
            form.category === 'Clothing' ? 'Shirt' : 
            form.category === 'Accessories' ? 'Glasses' : 'Tag',
      timestamp: new Date().toISOString()
    }

    try {
      await submitLostAndFound(reportData)
      toast.success('Report submitted successfully!')
      router.push('/dashboard/resident/lost_and_found')
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <PageHeader
        title="Report New Item"
        description="Provide as much detail as possible to help the community identify the item."
        icon={PackageSearch}
        iconColor="blue"
      >
        <Button variant="ghost" size="md" href="/dashboard/resident/lost_and_found" icon={ArrowLeft}>
          Back to Lost & Found
        </Button>
      </PageHeader>

      {/* ── Form Grid ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT: Form Fields */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* Lost / Found toggle */}
          <div className="p-1.5 bg-[#1a1d23] rounded-xl flex w-full sm:w-64">
            {['lost', 'found'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-bold transition-all capitalize ${
                  reportType === type
                    ? 'bg-[#1a1d23]bg-[#1241a1] text-[#1241a1] text-white shadow-sm'
                    : 'text-[#8a8f98] hover:text-white'
                }`}
              >
                {type === 'lost' ? 'Lost Item' : 'Found Item'}
              </button>
            ))}
          </div>

          {/* Main Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Item Name */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-white text-[#8a8f98]">Item Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Silver Bracelet, Black Wallet"
                required
                className="w-full bg-[#0d0f13] rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-[#8a8f98] text-sm text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white text-[#8a8f98]">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#0d0f13] rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all appearance-none cursor-pointer text-sm text-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white text-[#8a8f98]">Date Observed</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-[#0d0f13] rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all text-sm text-white"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-white text-[#8a8f98]">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98]" size={18} />
                <input
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Where was it seen?"
                  className="w-full bg-[#0d0f13] rounded-xl p-4 pl-12 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-[#8a8f98] text-sm text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-white text-[#8a8f98]">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Include distinctive features, brand, color, or specific contents..."
                className="w-full bg-[#0d0f13] rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all resize-none placeholder:text-[#8a8f98] text-sm text-white"
              />
            </div>

          </div>
        </div>

        {/* RIGHT: Upload & Submit */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="sticky top-8 flex flex-col gap-6">

            {/* Photo Upload */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`bg-[#0d0f13]/40 rounded-xl p-8 flex flex-col items-center justify-center min-h-[260px] text-center cursor-pointer transition-all group ${
                dragging
                  ? 'bg-[#1241a1]/5'
                  : 'hover:bg-[#1241a1]/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 w-full mb-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="size-20 bg-[#1241a1]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="text-[#1241a1]" size={40} />
                </div>
              )}

              <h4 className="text-lg font-bold mb-1 text-white">Upload Photos</h4>
              <p className="text-[#8a8f98] text-sm max-w-[240px] leading-relaxed">
                {previews.length > 0 ? 'Click to add more images' : 'Drag and drop images here, or click to browse files.'}
              </p>
              <div className="mt-5 flex gap-2">
                {['JPG', 'PNG', 'MAX 5MB'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#1a1d23] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#8a8f98]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-[#0d0f13] p-6 rounded-xl space-y-5 shadow-sm">
              {/* Privacy toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Privacy Protection</p>
                  <p className="text-xs text-[#8a8f98]">Hide my contact details initially</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacy(p => !p)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${privacy ? 'bg-[#1241a1]' : 'bg-[#1a1d23]'}`}
                >
                  <div className={`size-4 bg-[#1a1d23] rounded-full shadow transition-transform duration-200 ${privacy ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="h-px bg-[#1a1d23]" />

              {/* Urgent toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Urgent Report</p>
                  <p className="text-xs text-[#8a8f98]">Boost visibility for the next 24h</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUrgent(u => !u)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${urgent ? 'bg-[#1241a1]' : 'bg-[#1a1d23]'}`}
                >
                  <div className={`size-4 bg-[#1a1d23] rounded-full shadow transition-transform duration-200 ${urgent ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-5 text-lg shadow-lg shadow-[#1241a1]/20"
              disabled={submitting || !form.name}
            >
              {submitting ? (
                <>
                  <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={24} />
                  Submit Report
                </>
              )}
            </Button>

            <p className="text-center text-xs text-[#8a8f98] px-4 leading-relaxed">
              By submitting, you agree to our Terms of Service and community guidelines regarding reported items.
            </p>
          </div>
        </div>

      </form>
    </div>
  )
}
