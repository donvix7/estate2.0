'use client'

import React, { useEffect, useState } from 'react'
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
  Glasses,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import ItemDetailModal from '@/components/modals/ItemDetailModal'
import { getLostAndFound } from '@/lib/service'

const CATEGORIES = ['All Items', 'Pet', 'Electronics', 'Keys', 'Documents', 'Clothing', 'Accessories']

const ICON_MAP = { Dog, Smartphone, Key, Wallet, BookOpen, Shirt, Footprints, Glasses }


const CATEGORY_COLORS = {
  Pet: 'text-amber-500',
  Electronics: 'text-sky-500',
  Keys: 'text-yellow-500',
  Documents: 'text-emerald-500',
  Clothing: 'text-violet-500',
  Accessories: 'text-rose-500',
}

const ITEM_BG = {
  Pet: 'from-amber-500/20 to-amber-100/10',
  Electronics: 'from-sky-500/20 to-sky-100/10',
  Keys: 'from-yellow-500/20 to-yellow-100/10',
  Documents: 'from-emerald-500/20 to-emerald-100/10',
  Clothing: 'from-violet-500/20 to-violet-100/10',
  Accessories: 'from-rose-500/20 to-rose-100/10',
}


export default function LostAndFoundPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All Items')
  const [activeTab, setActiveTab] = useState('all') // all | active | resolved
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [imageErrors, setImageErrors] = useState({})
  
  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const data = await getLostAndFound({
          page: currentPage,
          type: activeTab,
          category: activeFilter,
          search: search
        })
        
        // Map string icons to components
        const docs = Array.isArray(data.docs) ? data.docs : (Array.isArray(data) ? data : []);
        const mappedData = docs.map(item => {
          let imageUrl = item.image;
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            const baseUrl = process.env.NEXT_PUBLIC_DB_URL || 'http://localhost:5000';
            imageUrl = `${baseUrl}${imageUrl}`;
          }

          return {
            ...item,
            image: imageUrl,
            iconComponent: ICON_MAP[item.icon] || Tag
          };
        })
        setItems(mappedData)
        setTotalPages(data.totalPages || 1)
        setTotalItems(data.totalDocs || mappedData.length)
        setCurrentPage(data.page || 1)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [activeFilter, activeTab, search, currentPage])

  // Support Deep Linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const itemId = params.get('item')
    if (itemId) {
      const item = items.find(i => (i._id || i.id)?.toString() === itemId)
      if (item) setSelectedItem(item)
    }
  }, [items])

  // Reset page when filters change
  useEffect(() => {
  }, [])

  // The items are already filtered by the server
  const displayItems = items;

  
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... Header & Filters unchanged ... */}
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

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
            <SearchX size={32} />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-300">No items found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.filter(item => {
              const matchesTab = activeTab === 'all' || (activeTab === 'active' && item.status !== 'resolved') || (activeTab === 'resolved' && item.status === 'resolved')
              const matchesCategory = activeFilter === 'All Items' || item.category === activeFilter
              const name = (item.name || item.itemName || '').toString()
              const location = (item.location || '').toString()
              const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                                    location.toLowerCase().includes(search.toLowerCase())
              return matchesTab && matchesCategory && matchesSearch
            }).map((item, index) => (
              <div
                key={item._id || item.id || index}
                className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800" onClick={() => setSelectedItem(item)}>
                  {item.image && !imageErrors[item._id || item.id] ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onError={() => handleImageError(item._id || item.id)}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-linear-to-br ${ITEM_BG[item.category] || 'from-slate-500/20 to-slate-100/10'} ${item.image && !imageErrors[item._id || item.id] ? 'hidden' : 'flex'} items-center justify-center cursor-pointer`}>
                    <item.iconComponent className={`size-12 opacity-40 ${CATEGORY_COLORS[item.category] || 'text-slate-500'}`} />
                  </div>
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-110
                    ${(item.status || item.type) === 'lost' ? 'bg-rose-500/90 shadow-rose-500/20' : 
                      (item.status || item.type) === 'resolved' ? 'bg-blue-500/90 shadow-blue-500/20' : 
                      'bg-emerald-500/90 shadow-emerald-500/20'}`}>
                    {(item.status || item.type) === 'lost' ? <AlertCircle size={12} strokeWidth={3} /> : 
                     (item.status || item.type) === 'resolved' ? <CheckCircle2 size={12} strokeWidth={3} /> : 
                     <Search size={12} strokeWidth={3} />}
                    {item.status || item.type}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <item.iconComponent size={16} className={`${CATEGORY_COLORS[item.category] || 'text-[#1241a1]'}`} />
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-12">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{items.length}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span> items
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`size-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${p === currentPage ? 'bg-[#1241a1] text-white shadow-xl shadow-[#1241a1]/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
