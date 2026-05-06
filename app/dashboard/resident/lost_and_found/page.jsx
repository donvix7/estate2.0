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
  CheckCircle2,
  Tag as TagIcon,
  Dog,
  Smartphone,
  Key,
  Wallet,
  BookOpen,
  Shirt,
  Footprints,
  Glasses,
  AlertCircle
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import ItemDetailModal from '@/components/modals/ItemDetailModal'
import { getLostAndFound } from '@/lib/service'
import LostAndFoundList from '@/components/resident/LostAndFoundList'

const CATEGORIES = ['All Items', 'Pet', 'Electronics', 'Keys', 'Documents', 'Clothing', 'Accessories']

const ICON_MAP = { Dog, Smartphone, Key, Wallet, BookOpen, Shirt, Footprints, Glasses, Tag: TagIcon }





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
            image: imageUrl,
            iconComponent: ICON_MAP[item.icon] || TagIcon
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      {/* ... Header & Filters unchanged ... */}
      <PageHeader 
        title="Lost & Found Feed" 
        description="Browse reported items across the estate. Help reunite lost items with their owners."
        icon={TagIcon}
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
              className={`px-4 py-2 rounded-md text-[11px] font-semibold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-[#1241a1]/10 text-[#1241a1]' : 'bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
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
        <LostAndFoundList 
          items={items}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSelectItem={setSelectedItem}
          imageErrors={imageErrors}
          onImageError={handleImageError}
          activeTab={activeTab}
          activeFilter={activeFilter}
          search={search}
        />
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
