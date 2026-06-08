'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'

const CAROUSEL_IMAGES = [
  { 
    url: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Community: Gated Community Street"
  },
  { 
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop",
    alt: "Security: Concierge & Security"
  },
  { 
    url: "https://images.unsplash.com/photo-1581578731117-e08f542e9466?q=80&w=2600&auto=format&fit=crop",
    alt: "Service: Engineering & Maintenance"
  },
  { 
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2600&auto=format&fit=crop",
    alt: "Amenities: Premium Fitness Center"
  }
]

export default function AuthCarousel({ children }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
      <div
        key={currentImageIndex}
        className="absolute inset-0 z-0 transition-opacity duration-1000"
      >
        <img 
            src={CAROUSEL_IMAGES[currentImageIndex].url}
            alt={CAROUSEL_IMAGES[currentImageIndex].alt}
            className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/90 z-10" />
    
      <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-sm border border-white/20 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">EstateSecure</span>
        </div>

        <div className="space-y-8">
          <div className="max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 shadow-2xl">
            {children}
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${
                  idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-white/40 font-medium">
          © {new Date().getFullYear()} EstateSecure Inc. All rights reserved.
        </div>
      </div>
    </div>
  )
}
