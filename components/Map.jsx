'use client'

import React, { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { 
  Plus, 
  Search, 
  Minus, 
  MapPin, 
  Clock, 
  Info, 
  X, 
  Home, 
  Waves, 
  Trees, 
  ShieldCheck,
  Target
} from 'lucide-react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const MAP_CATEGORIES = ['All', 'Residential', 'Amenities', 'Security', 'Parking']

// Lekki Phase 1 coordinates
const LEKKI_CENTER = { lat: 6.4474, lng: 3.4795 }

const LOCATIONS = [
  { id: 'block-a', name: 'Block A', category: 'Residential', position: { lat: 6.4480, lng: 3.4750 }, type: 'building' },
  { id: 'block-b', name: 'Block B', category: 'Residential', position: { lat: 6.4490, lng: 3.4760 }, type: 'building', active: true },
  { id: 'block-c', name: 'Block C', category: 'Residential', position: { lat: 6.4470, lng: 3.4740 }, type: 'building' },
  { id: 'block-d', name: 'Block D', category: 'Residential', position: { lat: 6.4460, lng: 3.4755 }, type: 'building' },
  { id: 'block-e', name: 'Block E', category: 'Residential', position: { lat: 6.4450, lng: 3.4770 }, type: 'building' },
  { id: 'block-f', name: 'Block F', category: 'Residential', position: { lat: 6.4440, lng: 3.4785 }, type: 'building' },
  { id: 'clubhouse', name: 'Grand Clubhouse', category: 'Amenities', position: { lat: 6.4500, lng: 3.4800 }, type: 'amenity', icon: Home, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', status: 'Active', crowd: 'Low (12%)', hours: '6:00 AM - 10:00 PM', desc: 'The hub of community activity, featuring lounge areas, meeting rooms, and high-speed Wi-Fi.', sector: 'Sector 2' },
  { id: 'pool', name: 'Infinity Pool', category: 'Amenities', position: { lat: 6.4495, lng: 3.4810 }, type: 'amenity', icon: Waves, image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400&auto=format&fit=crop', status: 'Closed', crowd: 'None', hours: '8:00 AM - 8:00 PM', desc: 'Olympic-sized infinity pool with temperature control and poolside refreshments.', sector: 'Amenity Zone' },
  { id: 'park', name: 'Central Park', category: 'Amenities', position: { lat: 6.4465, lng: 3.4820 }, type: 'amenity', icon: Trees, image: 'https://images.unsplash.com/photo-1585822719534-9098370fe41c?q=80&w=400&auto=format&fit=crop', status: 'Active', crowd: 'Moderate (45%)', hours: 'Open 24/7', desc: 'Lush green space for relaxation, morning jogs, and community picnics.', sector: 'Sector 3' },
  { id: 'main-gate', name: 'Main Gate', category: 'Security', position: { lat: 6.4475, lng: 3.4850 }, type: 'gate', icon: ShieldCheck, status: 'Active', crowd: 'High', hours: 'Open 24/7', desc: 'Primary security checkpoint for all residents and visitors.', sector: 'Entry Point' },
]

const containerStyle = {
  width: '100%',
  height: '100%'
}

const darkMapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#064e3b" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#10b981" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#334155" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#334155" }] }
]

export default function MapComponent({ role = 'resident' }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  const [map, setMap] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredLocation, setHoveredLocation] = useState(null)

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const filteredLocations = LOCATIONS.filter(loc => {
    const matchesCategory = activeCategory === 'All' || loc.category === activeCategory
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLocationClick = (loc) => {
    if (loc.type === 'building') {
      setSelectedLocation({
        ...loc,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
        status: 'Secure',
        crowd: 'N/A',
        hours: 'N/A',
        desc: `${loc.name} contains 24 luxury units across 4 floors. Fully integrated smart security systems.`,
        sector: 'Residential Zone'
      })
    } else {
      setSelectedLocation(loc)
    }
    
    if (map) {
      map.panTo(loc.position)
      map.setZoom(17)
    }
  }

  const zoomIn = () => map?.setZoom((map.getZoom() || 15) + 1)
  const zoomOut = () => map?.setZoom((map.getZoom() || 15) - 1)
  const reCenter = () => {
    map?.panTo(LEKKI_CENTER)
    map?.setZoom(15)
  }

  const title = role === 'admin' ? "Admin Estate Intel" : "Resident Navigation"
  const searchPlaceholder = role === 'admin' ? "Search estate locations..." : "Search our estate..."

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 sm:rounded-3xl overflow-hidden shadow-2xl">
      
      {/* ── Top Header ── */}
      <header className="h-20 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <div className="relative w-48 sm:w-96 group hidden xs:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-[#1241a1]/10 outline-none transition-all border-none dark:text-white"
          />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── Main Map Canvas ── */}
        <main className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-hidden group/map min-h-[500px] h-[calc(100vh-140px)] lg:h-auto">
          
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={LEKKI_CENTER}
              zoom={15}
              onLoad={map => setMap(map)}
              onUnmount={onUnmount}
              options={{
                styles: darkMapStyles,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
              }}
            >
              {filteredLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc.position}
                  onClick={() => handleLocationClick(loc)}
                  onMouseOver={() => setHoveredLocation(loc)}
                  onMouseOut={() => setHoveredLocation(null)}
                  icon={
                    loc.id === selectedLocation?.id
                      ? {
                          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                          fillColor: '#1241a1',
                          fillOpacity: 1,
                          strokeColor: '#fff',
                          strokeWeight: 2,
                          scale: 2,
                          anchor: new google.maps.Point(12, 22)
                        }
                      : {
                          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                          fillColor: loc.type === 'building' ? '#475569' : loc.type === 'amenity' ? '#10b981' : '#f97316',
                          fillOpacity: 0.8,
                          strokeColor: '#fff',
                          strokeWeight: 1,
                          scale: 1.5,
                          anchor: new google.maps.Point(12, 22)
                        }
                  }
                />
              ))}

              {hoveredLocation && (
                <InfoWindow
                  position={hoveredLocation.position}
                  onCloseClick={() => setHoveredLocation(null)}
                >
                  <div className="p-1 px-2">
                    <p className="text-[10px] font-black uppercase text-slate-900">{hoveredLocation.name}</p>
                    <p className="text-[8px] text-slate-500">{hoveredLocation.category}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950">
              <div className="size-16 border-4 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Live Maps...</p>
            </div>
          )}

          {/* Category Filters Overlay */}
          <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl z-10 max-w-[90vw] overflow-x-auto no-scrollbar">
            {MAP_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Zoom Controls Overlay */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex flex-col gap-2 z-10">
            <button 
              onClick={zoomIn}
              className="size-10 sm:size-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#1241a1] transition-all shadow-xl active:scale-95"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={zoomOut}
              className="size-10 sm:size-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#1241a1] transition-all shadow-xl active:scale-95"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={reCenter}
              className="size-10 sm:size-12 mt-2 sm:mt-4 bg-[#1241a1] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#1241a1]/30 active:scale-95 transition-all"
            >
              <Target size={20} />
            </button>
          </div>
        </main>

        {/* ── Detail Sidebar ── */}
        <aside 
          className={`fixed lg:relative inset-y-0 right-0 z-100 bg-white dark:bg-slate-900 flex flex-col transition-all duration-500 ease-in-out shadow-[-20px_0_50px_rgba(0,0,0,0.1)] lg:shadow-none ${
            selectedLocation ? 'w-full sm:w-[400px] translate-x-0' : 'w-0 translate-x-full overflow-hidden'
          }`}
        >
          {selectedLocation && (
            <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 h-full overflow-y-auto min-w-full sm:min-w-[400px]">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Location Intel</h3>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src={selectedLocation.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop'} 
                  alt={selectedLocation.name} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-[#1241a1]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {selectedLocation.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {selectedLocation.sector || 'Sector 1'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedLocation.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {selectedLocation.desc}
                </p>
              </div>

              {/* Status Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-widest">Operational Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full animate-pulse ${selectedLocation.status === 'Active' || selectedLocation.status === 'Secure' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className={`text-sm font-bold ${selectedLocation.status === 'Active' || selectedLocation.status === 'Secure' ? 'text-emerald-500' : 'text-red-500'}`}>{selectedLocation.status}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-widest">Activity Metric</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedLocation.crowd}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl group transition-colors hover:bg-[#1241a1]/5">
                  <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#1241a1] shadow-sm group-hover:scale-110 transition-transform">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operating Window</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedLocation.hours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl group transition-colors hover:bg-[#1241a1]/5">
                  <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#1241a1] shadow-sm group-hover:scale-110 transition-transform">
                    <Info size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Protocol</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Resident ID Verification Required</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="mt-4 w-full py-4 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-black rounded-2xl transition-all shadow-2xl shadow-[#1241a1]/20 active:scale-[0.98] uppercase tracking-widest text-xs">
                {role === 'admin' 
                  ? (selectedLocation.type === 'amenity' ? 'Initiate Fast Booking' : 'Analyze Block Security')
                  : (selectedLocation.type === 'amenity' ? 'Confirm Arrival' : 'View Maintenance History')
                }
              </button>
            </div>
          )}
        </aside>
      </div>

    </div>
  )
}