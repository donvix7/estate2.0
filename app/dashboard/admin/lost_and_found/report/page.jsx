'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Camera, 
  Send 
} from 'lucide-react'

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

  const [form, setForm] = useState({
    itemName: '',
    category: 'Electronics',
    date: '',
    location: '',
    description: '',
  })

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFiles = (files) => {
    const urls = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 5)
      .map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls].slice(0, 5))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200)) // simulate API
    setSubmitting(false)
    router.push('/dashboard/resident/lost_and_found')
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <header>
        <div className="flex items-center gap-2 text-[#1241a1] mb-3">
          <Link href="/dashboard/resident/lost_and_found" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity">
            <ArrowLeft size={14} />
            Back to Lost & Found
          </Link>
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Report New Item</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Provide as much detail as possible to help the community identify the item.
        </p>
      </header>

      {/* ── Form Grid ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT: Form Fields */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* Lost / Found toggle */}
          <div className="p-1.5 bg-slate-200 dark:bg-slate-800/50 rounded-xl flex w-full sm:w-64">
            {['lost', 'found'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-bold transition-all capitalize ${
                  reportType === type
                    ? 'bg-white dark:bg-[#1241a1] text-[#1241a1] dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Item Name</label>
              <input
                name="itemName"
                type="text"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. Silver Bracelet, Black Wallet"
                required
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm dark:text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all appearance-none cursor-pointer text-sm dark:text-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Date Observed</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all text-sm dark:text-white"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Where was it seen?"
                  className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm dark:text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Include distinctive features, brand, color, or specific contents..."
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 focus:ring-2 focus:ring-[#1241a1] outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm dark:text-white"
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
              className={`bg-slate-50 dark:bg-slate-900/40 rounded-xl p-8 flex flex-col items-center justify-center min-h-[260px] text-center cursor-pointer transition-all group ${
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

              <h4 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Upload Photos</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px] leading-relaxed">
                {previews.length > 0 ? 'Click to add more images' : 'Drag and drop images here, or click to browse files.'}
              </p>
              <div className="mt-5 flex gap-2">
                {['JPG', 'PNG', 'MAX 5MB'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl space-y-5 shadow-sm">
              {/* Privacy toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Privacy Protection</p>
                  <p className="text-xs text-slate-500">Hide my contact details initially</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacy(p => !p)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${privacy ? 'bg-[#1241a1]' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`size-4 bg-white rounded-full shadow transition-transform duration-200 ${privacy ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Urgent toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Urgent Report</p>
                  <p className="text-xs text-slate-500">Boost visibility for the next 24h</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUrgent(u => !u)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${urgent ? 'bg-[#1241a1]' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`size-4 bg-white rounded-full shadow transition-transform duration-200 ${urgent ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !form.itemName}
              className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-5 rounded-xl text-lg shadow-lg shadow-[#1241a1]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
            </button>

            <p className="text-center text-xs text-slate-400 px-4 leading-relaxed">
              By submitting, you agree to our Terms of Service and community guidelines regarding reported items.
            </p>
          </div>
        </div>

      </form>
    </div>
  )
}
