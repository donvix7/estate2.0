'use client'

import { ArrowRight, Play, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Gated Community Street",
    label: "Premium Living"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop",
    alt: "Concierge & Security",
    label: "Advanced Security"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1581578731117-e08f542e9466?q=80&w=2600&auto=format&fit=crop",
    alt: "Engineering & Maintenance",
    label: "Reliable Services"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2600&auto=format&fit=crop",
    alt: "Premium Fitness Center",
    label: "Lifestyle Amenities"
  }
]

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center">
      
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
                  <div
            key={currentImageIndex}
            
            
            
            
            className="absolute inset-0"
          >
            <img 
              src={CAROUSEL_IMAGES[currentImageIndex].url}
              alt={CAROUSEL_IMAGES[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
          </div>
                
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/30 lg:bg-linear-to-r lg:via-black/80" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,var(--tw-gradient-stops)] from-transparent to-black/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        
        <div className="max-w-4xl mx-auto lg:mx-0 text-center mt-20">
          
          {/* Elegant Badge */}
          <div
            
            
            
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border-white/20 bg-white/10 backdrop-blur-md"
          >
             <div className="flex gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
             </div>
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Rated #1 Estate Management App
            </span>
          </div>

          {/* Main Headline - Editorial Style */}
          <h1
            
            
            
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-6 leading-tight tracking-tight"
          >
            <span className='text-gray-100 font-serif'>Exclusive Living.</span> <br />
            <span className="italic text-gray-400 ">Smartly Managed.</span>
          </h1>

          <p
            
            
            
            className="text-lg md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            The comprehensive operating system designed for premium gated communities. 
            Security, payments, and lifestyle—seamlessly integrated.
          </p>

          <div
            
            
            
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="px-10 py-5 bg-white text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 min-w-[220px] shadow-xl">
              Start Free Trial
            </button>
            
            <button className="px-10 py-5 bg-transparent border-white/40 text-white text-lg font-medium rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300 min-w-[220px] backdrop-blur-sm flex items-center justify-center gap-3 group">
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              Try Demo
            </button>
          </div>

        </div>

        {/* Bottom Banner Info */}
        <div  className="absolute bottom-10 left-0 w-full px-4"
        >
            <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-8 gap-6">
                <div>
                   <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Trusted By</p>
                   <div className="flex gap-6 text-white/80 font-serif text-lg">
                      <span>Lekki Gardens</span>
                      <span>Amen Estate</span>
                      <span>VGC Exclusive</span>
                   </div>
                </div>
                
                <div className="flex gap-8 text-white/80 text-sm">
                   {/* Carousel Indicators/Progress */}
                   <div className="flex items-center gap-2 mb-2 md:mb-0">
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
            </div>
        </div>

      </div>
    </div>
  )
}

export default Hero