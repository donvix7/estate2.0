'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode,
  Bell,
  CreditCard,
  BarChart3,
  MessageSquare,
  Smartphone,
  CheckCircle,
  Zap
} from 'lucide-react'

const SLIDING_FEATURES = [
  {
    id: 1,
    title: "Access Control",
    description: "Digital visitor passes & QR code entry",
    icon: <QrCode className="w-10 h-10" />,
    items: ["Visitor Passes", "QR Code Entry", "Entry Logs", "Real-time Approval"],
    stat: "95% Faster Entry",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  {
    id: 2,
    title: "Emergency Response",
    description: "One-tap panic button & instant alerts",
    icon: <Bell className="w-10 h-10" />,
    items: ["SOS Button", "GPS Location", "Multi-alert", "Live Tracking"],
    stat: "< 60s Response",
    color: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-400"
  },
  {
    id: 3,
    title: "Secure Payments",
    description: "Estate dues via Paystack",
    icon: <CreditCard className="w-10 h-10" />,
    items: ["Dues Collection", "Digital Receipts", "Auto Reminders", "History"],
    stat: "98% Collection",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400"
  },
  {
    id: 4,
    title: "Admin Dashboard",
    description: "Centralized management platform",
    icon: <BarChart3 className="w-10 h-10" />,
    items: ["Visitor Approval", "Alert Monitoring", "Analytics", "Reports"],
    stat: "85% Efficiency",
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400"
  },
  {
    id: 5,
    title: "Communication",
    description: "Announcements & emergency broadcasts",
    icon: <MessageSquare className="w-10 h-10" />,
    items: ["Broadcasts", "Group Messages", "Notifications", "Alerts"],
    stat: "92% Engagement",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  {
    id: 6,
    title: "Mobile App",
    description: "Everything on your smartphone",
    icon: <Smartphone className="w-10 h-10" />,
    items: ["iOS & Android", "Push Notifications", "QR Scanner", "Payments"],
    stat: "4.8/5 Rating",
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400"
  }
]

const HeroWithSlidingImages = () => {
  const scrollRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Create duplicate set for infinite scroll effect
  const duplicatedFeatures = [...SLIDING_FEATURES, ...SLIDING_FEATURES]

  // Handle infinite scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId
    let scrollSpeed = 1.2 // Faster speed for square layout
    let scrollPosition = 0

    const animate = () => {
      if (!isHovered) {
        scrollPosition += scrollSpeed
        
        // Calculate current index for dots
        const itemWidth = scrollContainer.scrollWidth / 12
        const calculatedIndex = Math.floor(scrollPosition / itemWidth) % 6
        setCurrentIndex(calculatedIndex)
        
        // Reset position when scrolled through one set
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0
        }
        
        scrollContainer.style.transform = `translateX(-${scrollPosition}px)`
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isHovered])

  // Manual navigation
  const goToSlide = (index) => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    
    const itemWidth = scrollContainer.scrollWidth / 12
    const newPosition = index * itemWidth
    scrollContainer.style.transform = `translateX(-${newPosition}px)`
    scrollContainer.style.transition = 'transform 0.5s ease-in-out'
    setCurrentIndex(index)
    
    // Remove transition after animation
    setTimeout(() => {
      if (scrollContainer) {
        scrollContainer.style.transition = 'none'
      }
    }, 500)
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200" />

      {/* Main Container */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-gray-900">
              
              Estate Secure Features
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-xl mx-auto"
          >
            Explore our comprehensive suite of modern community solutions
          </motion.p>
        </div>

        {/* Square Infinite Sliding Container */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Infinite Slider - Square Layout */}
          <div className="relative overflow-hidden py-8">
            <div 
              ref={scrollRef}
              className="flex gap-6 will-change-transform"
              style={{ width: '200%' }}
            >
              {duplicatedFeatures.map((feature, index) => (
                <motion.div 
                  key={`${feature.id}-${index}`}
                  className="w-1/6 flex-shrink-0" // 6 features = 1/6 width each
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Square Feature Container */}
                  <div className="aspect-square w-full">
                    <div 
                      className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                      style={{
                        backgroundImage: `url('/images/estate.jpeg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/85 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Content Container */}
                      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                        
                        {/* Top Section - Icon & Title */}
                        <div className="flex-1">
                          <motion.div
                            className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${feature.color} backdrop-blur-lg border border-white/20 w-fit mx-auto group-hover:scale-110 transition-transform`}
                            whileHover={{ rotate: 5 }}
                          >
                            <div className={feature.iconColor}>
                              {feature.icon}
                            </div>
                          </motion.div>

                          <motion.h3 
                            className="text-2xl font-bold text-white text-center mb-2"
                            animate={{
                              textShadow: [
                                '0 0 0px rgba(255,255,255,0)',
                                '0 0 10px currentColor',
                                '0 0 0px rgba(255,255,255,0)'
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {feature.title}
                          </motion.h3>

                          <motion.p 
                            className="text-sm text-gray-300 text-center mb-4"
                            animate={{
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {feature.description}
                          </motion.p>
                        </div>

                        {/* Middle Section - Features */}
                        <div className="mb-4">
                          <div className="grid grid-cols-2 gap-2">
                            {feature.items.map((item, itemIndex) => (
                              <motion.div
                                key={itemIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.1 }}
                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group/item hover:bg-white/10 transition-all"
                              >
                                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-white font-medium truncate">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Section - Stat */}
                        <motion.div
                          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-lg border border-white/10"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-bold text-white">{feature.stat}</span>
                        </motion.div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

          {/* Navigation Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {SLIDING_FEATURES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeroWithSlidingImages