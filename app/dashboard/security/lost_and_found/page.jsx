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
import { PageHeader } from '@/components/ui/PageHeader'
import ItemDetailModal from '@/components/modals/ItemDetailModal'
import { getLostAndFound } from '@/lib/service'
import LostAndFoundList from '@/components/resident/LostAndFoundList'

const CATEGORIES = ['All Items', 'Pet', 'Electronics', 'Keys', 'Documents', 'Clothing', 'Accessories']

const ICON_MAP = { Dog, Smartphone, Key, Wallet, BookOpen, Shirt, Footprints, Glasses }




const ITEMS_PER_PAGE = 8

export default function LostAndFoundPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All Items')
  const [activeTab, setActiveTab] = useState('all') // all | active | resolved
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const data = await getLostAndFound()
        // Map string icons to components
        const mappedData = (data.docs || []).map(item => ({
          ...item,
          iconComponent: ICON_MAP[item.icon] || Tag
        }))
        setItems(mappedData)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [])

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
    setCurrentPage(1)
  }, [activeFilter, activeTab, search])

  const filtered = items.filter(item => {
    const matchesTab = activeTab === 'all' || (activeTab === 'active' && item.status !== 'resolved') || (activeTab === 'resolved' && item.status === 'resolved')
    const matchesCategory = activeFilter === 'All Items' || item.category === activeFilter
    const name = (item.name || item.itemName || '').toString()
    const location = (item.location || '').toString()
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                          location.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      {/* ... Header & Filters unchanged ... */}
      <PageHeader 
        title="Lost & Found Feed" 
        description="Browse reported items across the estate. Help reunite lost items with their owners."
        icon={Tag}
        iconColor="blue"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-md">
            {[{ id: 'all', label: 'All Reports' }, { id: 'active', label: 'Active' }, { id: 'resolved', label: 'Resolved' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1241a1]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/resident/lost_and_found/report"
            className="bg-[#1241a1] text-white px-5 py-2.5 rounded-md text-[13px] font-semibold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#1241a1]/20 whitespace-nowrap"
          >
            <PlusCircle size={16} />
            Report Item
          </Link>
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by item name, color, or location..."
            className="w-full bg-slate-100 dark:bg-slate-800/30 rounded-md py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#1241a1]/30 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={` px-4 py-2 rounded-md text-[11px] font-semibold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-[#1241a1]/10 text-[#1241a1]' : 'bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
            <SearchX size={32} />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-300">No items found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <LostAndFoundList 
          items={currentItems}
          totalItems={filtered.length}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSelectItem={setSelectedItem}
          imageErrors={{}}
          onImageError={() => {}}
          activeTab={activeTab}
          activeFilter={activeFilter}
          search={search}
          userRole="admin"
        />
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
