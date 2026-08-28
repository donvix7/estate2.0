'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
 PlusCircle, 
 SearchX, 
 Tag as TagIcon,
 Dog,
 Smartphone,
 Key,
 Wallet,
 BookOpen,
 Shirt,
 Footprints,
 Glasses,
 MoreHorizontal,
 Search,
 Filter,
 Clock,
 CheckCircle2,
 Circle
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import ItemDetailModal from '@/components/modals/ItemDetailModal'
import { getLostAndFound } from '@/lib/service'
import LostAndFoundList from '@/components/resident/LostAndFoundList'

const CATEGORIES = ['All Items', 'Pet', 'Electronics', 'Keys', 'Documents', 'Clothing', 'Accessories']

const ICON_MAP = { Dog, Smartphone, Key, Wallet, BookOpen, Shirt, Footprints, Glasses, Tag: TagIcon }

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

// Status badge component
const StatusBadge = ({ status }) => {
 if (status === 'resolved') {
 return (
 <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-500">
 <CheckCircle2 className="size-3 mr-1.5" />
 Resolved
 </span>
 );
 }
 return (
 <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-500">
 <Circle className="size-2 mr-1.5 fill-amber-500 animate-pulse" />
 Active
 </span>
 );
};

// Category filter button component
const FilterButton = ({ label, active, onClick }) => (
 <button
 onClick={onClick}
 className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border-none ${
 active
 ? 'bg-[#1a1d23] text-white shadow-sm'
 : 'bg-[#1a1d23]/90 bg-[#0B0C11] text-[#8a8f98]  hover:bg-[#1a1d23] hover:bg-[#151622]'
 }`}
 >
 {label}
 </button>
)
;

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

 const displayItems = items;
 
 // Stats
 const activeCount = items.filter(item => item.status !== 'resolved').length;
 const resolvedCount = items.filter(item => item.status === 'resolved').length;
 const uniqueCategories = new Set(items.map(item => item.category)).size;

 return (
 <div className="min-h-screen bg-[#0d0f13] p-6 animate-in fade-in duration-700 space-y-6">
 
 {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div>
 <span className="text-2xl font-bold text-white">Lost & Found</span>
 <p className="text-[#8a8f98] text-sm font-medium">Browse reported items across the estate. Help reunite lost items with their owners.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl p-1 flex gap-1">
 {[
 { id: 'all', label: 'All' },
 { id: 'active', label: 'Active' },
 { id: 'resolved', label: 'Resolved' }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border-none ${
 activeTab === tab.id 
 ? 'bg-[#1241a1] text-white' 
 : 'text-[#8a8f98] hover:text-white hover:bg-[#2a2d33]'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 <Link
 href="/dashboard/resident/lost_and_found/report"
 className="bg-[#1241a1] hover:bg-[#1a51b1] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-none"
 >
 <PlusCircle size={16} />
 Report Item
 </Link>
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
 <StatCard 
 label="Total Items" 
 value={totalItems} 
 icon={<TagIcon className="size-4" />}
 change={8.3}
 />
 <StatCard 
 label="Active" 
 value={activeCount} 
 icon={<Clock className="size-4" />}
 change={-2.1}
 />
 <StatCard 
 label="Resolved" 
 value={resolvedCount} 
 icon={<CheckCircle2 className="size-4" />}
 change={15.7}
 />
 <StatCard 
 label="Categories" 
 value={uniqueCategories || '—'} 
 icon={<Filter className="size-4" />}
 change={0}
 />
 </div>

 {/* Filters */}
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1 max-w-xl">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by item name, color, or location..."
 className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a1d23] border border-[#2a2d33] text-white text-sm focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all placeholder:text-[#8a8f98]/50"
 />
 </div>
 <div className="flex flex-wrap gap-1.5 bg-[#1a1d23] rounded-xl p-1.5 border border-[#2a2d33]">
 {CATEGORIES.map(cat => (
 <FilterButton
 key={cat}
 label={cat}
 active={activeFilter === cat}
 onClick={() => setActiveFilter(cat)}
 />
 ))}
 </div>
 </div>

 {/* Results */}
 {isLoading ? (
 <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-12 text-center">
 <div className="flex flex-col items-center gap-3">
 <div className="size-8 border-2 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
 <p className="text-sm font-medium text-[#8a8f98]">Loading items...</p>
 </div>
 </div>
 ) : items.length === 0 ? (
 <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-16 text-center">
 <div className="flex flex-col items-center gap-4">
 <div className="size-16 bg-[#2a2d33] rounded-full flex items-center justify-center">
 <SearchX className="size-8 text-[#8a8f98]" />
 </div>
 <div>
 <p className="font-bold text-white text-lg">No items found</p>
 <p className="text-sm text-[#8a8f98]">Try adjusting your search or filters.</p>
 </div>
 </div>
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