'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, 
  PlusCircle, 
  Search, 
  SearchX, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  Tag,
  Dog,
  Smartphone,
  Key,
  Wallet,
  BookOpen,
  Shirt,
  Footprints,
  Glasses
} from 'lucide-react'
import ItemDetailModal from '@/components/modals/ItemDetailModal'

const CATEGORIES = ['All Items', 'Pets', 'Electronics', 'Keys', 'Documents', 'Clothing', 'Accessories']

const ITEMS = [
  { id: 1, name: 'Golden Retriever', category: 'Pets', icon: Dog, status: 'lost', location: 'Central Park East', date: 'Oct 24, 2024', image: '/lf_dog.png', description: 'Friendly Golden Retriever wearing a blue collar. Answers to "Max". Last seen near the children playground.' },
  { id: 2, name: 'iPhone 14 Pro - Black', category: 'Electronics', icon: Smartphone, status: 'found', location: 'Gym Locker Room', date: 'Oct 23, 2024', image: '/lf_phone.png', description: 'Found a black iPhone 14 Pro in the gym locker room. It has a cracked screen protector and a Clear MagSafe case.' },
  { id: 3, name: 'House Keys — 3 Keys', category: 'Keys', icon: Key, status: 'found', location: 'Visitor Parking Area', date: 'Oct 22, 2024', image: '/lf_keys.png', description: 'Set of 3 keys on a red keychain. Includes a car remote for a Toyota.' },
  { id: 4, name: 'Brown Leather Wallet', category: 'Accessories', icon: Wallet, status: 'lost', location: 'Clubhouse Café', date: 'Oct 21, 2024', image: null, description: 'Bifold brown leather wallet. Contains a driver license and some loyalty cards. No cash inside.' },
  { id: 5, name: 'Amazon Kindle Paperwhite', category: 'Electronics', icon: BookOpen, status: 'found', location: 'Poolside Lounge', date: 'Oct 20, 2024', image: null, description: 'Kindle Paperwhite found on a sun lounger. It has a fabric cover with a floral pattern.' },
  { id: 6, name: 'Blue North Face Jacket', category: 'Clothing', icon: Shirt, status: 'lost', location: 'Basketball Court', date: 'Oct 19, 2024', image: null, description: 'Dark blue North Face puffer jacket, size Large. Left on the benches near the basketball court.' },
  { id: 7, name: 'Nike Runners (Size 10)', category: 'Clothing', icon: Footprints, status: 'found', location: 'Tennis Court 2', date: 'Oct 18, 2024', image: null, description: 'Grey Nike running shoes, size 10. Found near the entrance of Tennis Court 2.' },
  { id: 8, name: 'Reading Glasses — RayBan', category: 'Accessories', icon: Glasses, status: 'lost', location: 'Main Lobby', date: 'Oct 17, 2024', image: null, description: 'RayBan reading glasses with a black frame. Lost somewhere between the main lobby and the elevator.' },
]

const CATEGORY_COLORS = {
  Pets: 'text-amber-500',
  Electronics: 'text-sky-500',
  Keys: 'text-yellow-500',
  Documents: 'text-emerald-500',
  Clothing: 'text-violet-500',
  Accessories: 'text-rose-500',
}

const ITEM_BG = {
  Pets: 'from-amber-500/20 to-amber-100/10',
  Electronics: 'from-sky-500/20 to-sky-100/10',
  Keys: 'from-yellow-500/20 to-yellow-100/10',
  Documents: 'from-emerald-500/20 to-emerald-100/10',
  Clothing: 'from-violet-500/20 to-violet-100/10',
  Accessories: 'from-rose-500/20 to-rose-100/10',
}

export default function LostAndFoundPage() {
  const [activeFilter, setActiveFilter] = useState('All Items')
  const [activeTab, setActiveTab] = useState('all') // all | active | resolved
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const filtered = ITEMS.filter(item => {
    const matchesTab = activeTab === 'all' || (activeTab === 'active' && item.status !== 'resolved') || (activeTab === 'resolved' && item.status === 'resolved')
    const matchesCategory = activeFilter === 'All Items' || item.category === activeFilter
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-[#1241a1] font-semibold">Lost & Found</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Lost & Found Feed</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Browse reported items across the estate. Help reunite lost items with their owners.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[{ id: 'all', label: 'All Reports' }, { id: 'active', label: 'Active' }, { id: 'resolved', label: 'Resolved' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1241a1]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/resident/lost_and_found/report"
            className="bg-[#1241a1] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1241a1]/90 transition-colors shadow-lg shadow-[#1241a1]/20"
          >
            <PlusCircle size={18} />
            Report Item
          </Link>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by item name, color, or location..."
            className="w-full bg-white dark:bg-slate-900 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#1241a1]/30 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeFilter === cat ? 'bg-[#1241a1]/10 text-[#1241a1]' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Item Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
            <SearchX size={32} />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-300">No items found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800" onClick={() => setSelectedItem(item)}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-linear-to-br ${ITEM_BG[item.category] || 'from-slate-500/20 to-slate-100/10'} flex items-center justify-center cursor-pointer`}>
                    <item.icon className={`size-12 opacity-40 ${CATEGORY_COLORS[item.category] || 'text-slate-500'}`} />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'lost' ? 'bg-red-500 text-white shadow-lg' : 'bg-emerald-500 text-white shadow-lg'}`}>
                  {item.status}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={16} className={`${CATEGORY_COLORS[item.category] || 'text-[#1241a1]'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.category}</span>
                </div>
                <h3 className="text-base font-bold leading-tight mb-4 text-slate-900 dark:text-white truncate">{item.name}</h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={14} />
                    <span className="text-xs">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs">{item.date}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(item)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1241a1] hover:text-white text-sm font-bold transition-all dark:text-slate-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-12">
        <p className="text-sm text-slate-500">Showing {filtered.length} of {ITEMS.length} items</p>
        <div className="flex items-center gap-2">
          <button className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3].map(p => (
            <button
              key={p}
              className={`size-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${p === 1 ? 'bg-[#1241a1] text-white shadow-xl shadow-[#1241a1]/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {p}
            </button>
          ))}
          <button className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Result Modal */}
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

    </div>
  )
}