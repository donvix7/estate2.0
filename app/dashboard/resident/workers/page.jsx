'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { 
  Briefcase, 
  Wrench, 
  Bolt, 
  Hammer, 
  Sparkles, 
  Flower2, 
  ChevronRight, 
  Plus, 
  Search, 
  CheckCircle2, 
  Star, 
  Clock, 
  UserSearch, 
  X 
} from 'lucide-react';
import { getWorkers, getResidentData } from '@/lib/service';
import { bookService } from '@/lib/action';
import { toast } from 'react-toastify';

const CATEGORIES = [
  { id: 'all',         label: 'All Services',  icon: Briefcase },
  { id: 'plumbing',   label: 'Plumbing',       icon: Wrench },
  { id: 'electrical', label: 'Electrical',     icon: Bolt },
  { id: 'carpentry',  label: 'Carpentry',      icon: Hammer },
  { id: 'cleaning',   label: 'Cleaning',       icon: Sparkles },
  { id: 'gardening',  label: 'Gardening',      icon: Flower2 },
]




const ACTIVE_FILTERS = {
  verifiedOnly: false,
  topRated: false,
  availableToday: false,
}

export default function WorkersDirectoryPage() {
  const [workers, setWorkers] = useState([])
  const [residentData, setResidentData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const [workersData, resData] = await Promise.all([
        getWorkers(),
        getResidentData()
      ])  
      setWorkers(workersData?.docs || [])
      setResidentData(resData)
    }
    loadData()
  }, [])

  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(ACTIVE_FILTERS)
  const [showBook, setShowBook] = useState(null) // selected worker object
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    description: ''
  })

  const toggleFilter = (key) => setFilters(f => ({ ...f, [key]: !f[key] }))

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    if (!showBook) return
    setIsSubmitting(true)

    const requestData = {
      category: showBook.category || 'General',
      icon: showBook.category === 'plumbing' ? 'Droplets' : 
            showBook.category === 'electrical' ? 'Bolt' : 
            showBook.category === 'carpentry' ? 'Hammer' : 
            showBook.category === 'cleaning' ? 'Sparkles' : 'Briefcase',
      desc: bookingForm.description,
      date: bookingForm.date,
      status: 'Scheduled',
      statusColor: 'bg-slate-400',
      iconColor: showBook.category === 'plumbing' ? 'text-blue-500' : 'text-slate-500',
      workerId: showBook.id,
      workerName: showBook.name,
      residentId: residentData?.id || 'RES-005'
    }

    try {
      await bookService(requestData)
      toast.success(`Booking request sent to ${showBook.name}!`)
      setShowBook(null)
      setBookingForm({ date: '', description: '' })
    } catch (error) {
      toast.error('Failed to send booking request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = workers.filter(w => {
    const matchesCat = activeCategory === 'all' || w.category === activeCategory
    const matchesSearch = (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (w.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (w.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesVerified = !filters.verifiedOnly || w.verified
    const matchesRating = !filters.topRated || w.rating >= 4.9
    return matchesCat && matchesSearch && matchesVerified && matchesRating
  })

  return (
    <div className="flex flex-col gap-0 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1241a1] font-semibold">Estate Services</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Estate Services Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Browse verified professionals for all your estate maintenance needs.
          </p>
        </div>
        <button className="bg-[#1241a1] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1241a1]/90 transition-colors shadow-lg shadow-[#1241a1]/20 self-start md:self-auto">
          <Plus className="w-5 h-5" />
          Post a Job
        </button>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, skill, or keyword..."
            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#1241a1]/30 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'verifiedOnly', icon: CheckCircle2, label: 'Verified Only' },
            { key: 'topRated', icon: Star, label: 'Top Rated' },
            { key: 'availableToday', icon: Clock, label: 'Available Today' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                filters[f.key]
                  ? 'bg-[#1241a1] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Showing <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> professionals
        {activeCategory !== 'all' && <> in <span className="font-bold text-[#1241a1]">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>}
      </p>

      {/* ── Worker Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
            <UserSearch className="w-8 h-8" />
          </div>
          <p className="font-bold">No professionals found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(worker => (
            <div
              key={worker.id}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Photo */}
              <Link 
                href={`/dashboard/resident/workers/${worker.id}`}
                className="relative h-48 bg-slate-100 dark:bg-slate-800 cursor-pointer block overflow-hidden"
              >
                {worker.image ? (
                  <Image
                    src={worker.image}
                    alt={worker.name}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center ${worker.color || 'bg-[#1241a1]'}`}>
                    <span className="text-4xl font-black text-white/80">
                      {worker.initials || worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
                {/* Verified badge */}
                {worker.verified && (
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-[#1241a1] uppercase tracking-wider z-10">
                    <CheckCircle2 className="w-3 h-3 fill-[#1241a1] text-white" />
                    Verified
                  </div>
                )}
             
              </Link>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-bold text-base leading-tight">{worker.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{worker.title}</p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase">
                      {skill}
                    </span>
                  ))}
                </div>


                <button
                  onClick={() => setShowBook(worker)}
                  className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-2.5 rounded-xl transition-colors text-sm active:scale-[0.98]"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Load More ── */}
      {filtered.length > 0 && (
        <div className="mt-12 flex justify-center pb-8">
          <button className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors">
            Load More Professionals
          </button>
        </div>
      )}

      {/* ── Booking Modal ── */}
      {showBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleBookSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1241a1]">Service Request</h3>
              <button type="button" onClick={() => setShowBook(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div className={`size-12 rounded-xl flex items-center justify-center text-white font-black ${showBook.color || 'bg-[#1241a1]'}`}>
                   {showBook.initials || 'W'}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provider</p>
                  <p className="text-sm font-black dark:text-white">{showBook.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  value={bookingForm.date}
                  onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Service Description</label>
                <textarea 
                  placeholder="Tell us what you need..." 
                  rows={3} 
                  required
                  value={bookingForm.description}
                  onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white resize-none" 
                />
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
               <button type="button" onClick={() => setShowBook(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all">Cancel</button>
               <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#1241a1] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#1241a1]/20 disabled:opacity-50"
               >
                 {isSubmitting ? 'Sending...' : 'Confirm'}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
