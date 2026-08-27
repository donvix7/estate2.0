'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Clock, CheckCircle2, Circle, Tag, User } from 'lucide-react'
import Pagination from '@/components/pagination'

// Status badge component
const StatusBadge = ({ status }) => {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-green-400">
        <CheckCircle2 className="size-3 mr-1.5" />
        Resolved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400">
      <Circle className="size-2 mr-1.5 fill-amber-400" />
      Active
    </span>
  );
};

export default function LostAndFoundList({ 
  items, 
  totalItems, 
  totalPages, 
  currentPage, 
  setCurrentPage,
  onSelectItem,
  imageErrors,
  onImageError,
  activeTab,
  activeFilter,
  search 
}) {
  return (
    <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Tag className="size-5 text-[#1241a1]" />
            Items
          </h2>
          <p className="text-xs text-[#8a8f98] font-medium">{totalItems} total items</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">
            {activeTab === 'all' ? 'All' : activeTab === 'active' ? 'Active' : 'Resolved'}
            {activeFilter !== 'All Items' && ` • ${activeFilter}`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
        {items.map((item) => {
          const Icon = item.iconComponent || Tag
          const isResolved = item.status === 'resolved'
          
          return (
            <div
              key={item._id || item.id}
              onClick={() => onSelectItem(item)}
              className={`group bg-[#2a2d33] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                isResolved 
                  ? 'border-[#2a2d33] opacity-75 hover:opacity-100' 
                  : 'border-[#3a3d43] hover:border-[#1241a1]'
              } hover:shadow-lg hover:shadow-[#1241a1]/5`}
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#1a1d23] overflow-hidden">
                {item.image && !imageErrors[item._id || item.id] ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => onImageError(item._id || item.id)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1d23]">
                    <Icon className="size-12 text-[#8a8f98] opacity-30" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={item.status} />
                </div>
                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a1d23]/90 text-white border border-[#2a2d33]">
                    {item.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-3 space-y-2">
                <h3 className="font-bold text-sm text-white group-hover:text-[#1241a1] transition-colors truncate">
                  {item.name}
                </h3>
                
                <p className="text-xs text-[#8a8f98] line-clamp-2 min-h-[32px]">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-[#8a8f98]">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {item.location || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {item.reportedBy && (
                  <div className="flex items-center gap-1.5 pt-1 border-t border-[#2a2d33]">
                    <User className="size-3 text-[#8a8f98]" />
                    <span className="text-[10px] text-[#8a8f98]">
                      Reported by {item.reportedBy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="px-4 py-3 bg-[#2a2d33]/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2a2d33]">
          <p className="text-sm text-[#8a8f98]">
            Showing <span className="font-bold text-white">{items.length}</span> of <span className="font-bold text-white">{totalItems}</span> items
          </p>
          <Pagination 
            page={currentPage}
            totalPages={totalPages}
            handlePageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}