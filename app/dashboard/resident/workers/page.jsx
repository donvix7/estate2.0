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
  Plus, 
  CheckCircle2, 
  Star, 
  Clock, 
  UserSearch, 
  X,
  MoreHorizontal,
  MapPin,
  Award,
  Users,
  TrendingUp,
  Circle,
  Search
} from 'lucide-react';
import { getWorkers, getResidentData } from '@/lib/service';
import { bookService } from '@/lib/action';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';

const CATEGORIES = [
  { id: 'all',         label: 'All Services',  icon: Briefcase },
  { id: 'plumbing',   label: 'Plumbing',       icon: Wrench },
  { id: 'electrical', label: 'Electrical',     icon: Bolt },
  { id: 'carpentry',  label: 'Carpentry',      icon: Hammer },
  { id: 'cleaning',   label: 'Cleaning',       icon: Sparkles },
  { id: 'gardening',  label: 'Gardening',      icon: Flower2 },
]

// Trading-style stat card component
const StatCard = ({ label, value, icon, change }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-[#1a1d23]/40 bg-[#12131C] backdrop-blur-md rounded-2xl border-none p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#8a8f98] text-[#8a8f98] uppercase tracking-wider">{label}</span>
        <span className="text-[#8a8f98]">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-extrabold text-white text-white">{value}</span>
        {change !== undefined && change !== null && (
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-[#8a8f98]'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
};

// Category filter button component
const CategoryButton = ({ category, active, onClick }) => {
  const Icon = category.icon
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-none ${
        active
          ? 'bg-[#1a1d23] text-white shadow-sm'
          : 'bg-[#1a1d23]/90 bg-[#0B0C11] text-[#8a8f98]  hover:bg-[#1a1d23] hover:bg-[#151622]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {category.label}
    </button>
  )
}

// Filter button component
const FilterButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border-none ${
      active
        ? 'bg-[#1a1d23] text-white shadow-sm'
        : 'bg-[#1a1d23]/90 bg-[#0B0C11] text-[#8a8f98]  hover:bg-[#1a1d23] hover:bg-[#151622]'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
)


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
  const [showBook, setShowBook] = useState(null)
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
      statusColor: 'bg-[#2a2d33]',
      iconColor: showBook.category === 'plumbing' ? 'text-[#1241a1]' : 'text-[#8a8f98]',
      workerId: showBook.id || showBook._id,
      workerName: showBook.name,
      residentId: residentData?.id || residentData?._id || 'RES-005',
      estateID: showBook.estateID || 'EST-001'
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

  // Stats
  const totalWorkers = workers.length
  const verifiedCount = workers.filter(w => w.verified).length
  const avgRating = workers.length > 0 
    ? (workers.reduce((sum, w) => sum + (w.rating || 0), 0) / workers.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-[#0d0f13] p-6 animate-in fade-in duration-700 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Estate Services Directory</h1>
          <p className="text-[#8a8f98] text-sm font-medium">Browse verified professionals for all your estate maintenance needs.</p>
        </div>
        <button className="bg-[#1241a1] hover:bg-[#1a51b1] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-none">
          <Plus className="size-4" />
          Post a Job
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          label="Total Professionals" 
          value={totalWorkers} 
          icon={<Users className="size-4" />}
          change={12.5}
        />
        <StatCard 
          label="Verified" 
          value={verifiedCount} 
          icon={<CheckCircle2 className="size-4" />}
          change={8.3}
        />
        <StatCard 
          label="Avg Rating" 
          value={avgRating} 
          icon={<Star className="size-4" />}
          change={4.8}
        />
        <StatCard 
          label="Categories" 
          value={CATEGORIES.length - 1} 
          icon={<Briefcase className="size-4" />}
          change={0}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <CategoryButton
            key={cat.id}
            category={cat}
            active={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill, or keyword..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#2a2d33] border border-[#3a3d43] text-white text-sm focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all placeholder:text-[#8a8f98]/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'verifiedOnly', icon: CheckCircle2, label: 'Verified' },
            { key: 'topRated', icon: Star, label: 'Top Rated' },
            { key: 'availableToday', icon: Clock, label: 'Available' },
          ].map(f => (
            <FilterButton
              key={f.key}
              active={filters[f.key]}
              onClick={() => toggleFilter(f.key)}
              icon={f.icon}
              label={f.label}
            />
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#8a8f98]">
        Showing <span className="font-bold text-white">{filtered.length}</span> professionals
        {activeCategory !== 'all' && <> in <span className="font-bold text-[#1241a1]">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>}
      </p>

      {/* Worker Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 bg-[#2a2d33] rounded-full flex items-center justify-center">
              <UserSearch className="size-8 text-[#8a8f98]" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">No professionals found</p>
              <p className="text-sm text-[#8a8f98]">Try adjusting your search or filters.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((worker, index) => (
            <div
              key={worker.id || worker._id || `worker-${index}`}
              className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden transition-all duration-300 group hover:border-[#1241a1] hover:shadow-lg hover:shadow-[#1241a1]/5 flex flex-col"
            >
              {/* Photo */}
              <Link 
                href={`/dashboard/resident/workers/${worker.id || worker._id}`}
                className="relative h-48 bg-[#2a2d33] cursor-pointer block overflow-hidden"
              >
                {worker.image ? (
                  <Image
                    src={worker.image}
                    alt={worker.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center ${worker.color || 'bg-[#1241a1]'}`}>
                    <span className="text-4xl font-bold text-white/80">
                      {worker.initials || worker.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'W'}
                    </span>
                  </div>
                )}
                
                {/* Verified badge */}
                {worker.verified && (
                  <div className="absolute top-3 right-3 bg-[#1a1d23]/90 backdrop-blur border border-[#2a2d33] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-[#1241a1]" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Verified</span>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-bold text-base text-white">{worker.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs text-[#8a8f98]">{worker.title}</p>
                    <span className="size-1 bg-[#2a2d33] rounded-full"></span>
                    <p className="text-xs font-bold text-[#1241a1]">{worker.jobs || 0} Jobs</p>
                    <span className="size-1 bg-[#2a2d33] rounded-full"></span>
                    <p className="text-xs font-bold text-green-400">{worker.rate || '₦0/hr'}</p>
                  </div>
                  {worker.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{worker.rating}</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills?.slice(0, 3).map((skill, sIdx) => (
                    <span key={`${worker.id || worker._id}-${skill}-${sIdx}`} className="px-2 py-0.5 bg-[#2a2d33] text-[#8a8f98] rounded text-[10px] font-medium uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                  {worker.skills?.length > 3 && (
                    <span className="px-2 py-0.5 bg-[#2a2d33] text-[#8a8f98] rounded text-[10px] font-medium">
                      +{worker.skills.length - 3}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowBook(worker)}
                  className="w-full bg-[#1241a1] hover:bg-[#1a51b1] text-white font-bold py-2.5 rounded-lg transition-all text-[11px] uppercase tracking-wider border-none"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {filtered.length > 0 && (
        <div className="flex justify-center pt-4">
          <button className="px-8 py-3 bg-[#1a1d23] hover:bg-[#2a2d33] text-white rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all border border-[#2a2d33]">
            Load More Professionals
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleBookSubmit} className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1241a1]">Service Request</h3>
              <button type="button" onClick={() => setShowBook(null)} className="p-1.5 hover:bg-[#2a2d33] rounded-lg transition-colors border-none bg-transparent">
                <X className="w-5 h-5 text-[#8a8f98]" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#2a2d33] rounded-xl">
                <div className={`size-12 rounded-xl flex items-center justify-center text-white font-bold ${showBook.color || 'bg-[#1241a1]'}`}>
                  {showBook.initials || showBook.name?.charAt(0) || 'W'}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8f98]">Provider</p>
                  <p className="text-sm font-bold text-white">{showBook.name}</p>
                  <p className="text-xs text-[#8a8f98]">{showBook.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8a8f98]">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  value={bookingForm.date}
                  onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-[#2a2d33] border border-[#3a3d43] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8a8f98]">Service Description</label>
                <textarea 
                  placeholder="Tell us what you need..." 
                  rows={3} 
                  required
                  value={bookingForm.description}
                  onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-[#2a2d33] border border-[#3a3d43] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-white resize-none placeholder:text-[#8a8f98]/50" 
                />
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-4">
              <button type="button" onClick={() => setShowBook(null)} className="flex-1 py-3 bg-[#2a2d33] hover:bg-[#3a3d43] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all border-none">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#1241a1] hover:bg-[#1a51b1] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 border-none"
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