'use client'

import Footer from '@/components/Footer'
import Navigation from '@/components/navigation'
import { Users, MessageSquare, Calendar, Share2, Award, TrendingUp, Heart, Globe, Bell, FileText, Home, MapPin, UsersRound, BarChart3, Settings, ThumbsUp, Clock, Megaphone, Vote, Shield, Lock, Download, Upload, Star, Trophy, Gavel, Wallet, Building2, Trees, Car, Wifi, Phone, Mail, Map } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CommunityPage() {
  const router = useRouter()

  const platformModules = [
    {
      category: "Communication",
      icon: <MessageSquare className="w-6 h-6" />,
      features: [
        {
          title: "Real-Time Community Forum",
          description: "Threaded discussions organized by topics, announcements, and neighborhood updates",
          capabilities: [
            "Topic-based channels (Security, Events, Maintenance)",
            "Direct messaging between residents",
            "Announcement broadcast to all members",
            "File sharing with preview support",
            "Message retention: 2 years minimum"
          ],
          stats: ["95% engagement rate", "Avg. response time: 15 minutes"]
        },
        {
          title: "Emergency Alert System",
          description: "Critical notification system for urgent community matters",
          capabilities: [
            "Multi-channel alerts (SMS, Email, App Push)",
            "Geofenced notifications",
            "Emergency response coordination",
            "Two-way communication with responders",
            "Alert acknowledgment tracking"
          ],
          stats: ["100% delivery guarantee", "Alert time: <30 seconds"]
        }
      ]
    },
    {
      category: "Event Management",
      icon: <Calendar className="w-6 h-6" />,
      features: [
        {
          title: "Community Calendar",
          description: "Centralized event scheduling and management system",
          capabilities: [
            "Recurring event scheduling",
            "RSVP system with capacity management",
            "Automated reminders (24h, 1h before)",
            "Event resource allocation",
            "Attendance tracking and reporting"
          ],
          stats: ["Average 12 events/month", "85% RSVP rate"]
        },
        {
          title: "Activity Coordination",
          description: "Tools for organizing community activities and volunteer work",
          capabilities: [
            "Volunteer sign-up sheets",
            "Resource sharing pool",
            "Skill matching algorithm",
            "Progress tracking",
            "Recognition and rewards"
          ],
          stats: ["45% volunteer participation", "2,000+ hours logged"]
        }
      ]
    },
    {
      category: "Resource Management",
      icon: <Share2 className="w-6 h-6" />,
      features: [
        {
          title: "Document Repository",
          description: "Secure storage and sharing of community documents",
          capabilities: [
            "Version control for documents",
            "Access permission management",
            "Electronic signatures",
            "Automated compliance tracking",
            "Searchable archive"
          ],
          stats: ["Unlimited storage", "256-bit encryption"]
        },
        {
          title: "Shared Asset Management",
          description: "Tracking and scheduling community-shared resources",
          capabilities: [
            "Clubhouse/amenity booking",
            "Equipment check-out system",
            "Maintenance scheduling",
            "Usage analytics",
            "Cost allocation"
          ],
          stats: ["95% utilization rate", "$50K+ annual savings"]
        }
      ]
    },
    {
      category: "Governance",
      icon: <Gavel className="w-6 h-6" />,
      features: [
        {
          title: "HOA Management Suite",
          description: "Complete tools for homeowners association administration",
          capabilities: [
            "Online voting and elections",
            "Meeting minutes management",
            "By-law digital repository",
            "Committee management",
            "Compliance tracking"
          ],
          stats: ["80% voter participation", "100% meeting compliance"]
        },
        {
          title: "Financial Transparency",
          description: "Budget tracking and financial reporting for communities",
          capabilities: [
            "Dues collection automation",
            "Expense tracking",
            "Budget vs. actual reporting",
            "Vendor payment processing",
            "Financial audit trail"
          ],
          stats: ["99.8% on-time payments", "Real-time financial reporting"]
        }
      ]
    }
  ]

  const communityStats = [
    { metric: "Active Communities", value: "3,200+", change: "+18% YoY", icon: <Building2 className="w-5 h-5" /> },
    { metric: "Monthly Active Users", value: "850K+", change: "+25% YoY", icon: <UsersRound className="w-5 h-5" /> },
    { metric: "Messages Exchanged", value: "45M+", change: "+40% YoY", icon: <MessageSquare className="w-5 h-5" /> },
    { metric: "Events Organized", value: "28K+", change: "+32% YoY", icon: <Calendar className="w-5 h-5" /> },
    { metric: "Documents Shared", value: "2.1M+", change: "+55% YoY", icon: <FileText className="w-5 h-5" /> },
    { metric: "User Satisfaction", value: "98.2%", change: "+1.2% YoY", icon: <Heart className="w-5 h-5" /> }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Manager, Oakridge Estates",
      text: "Since implementing EstateSecure's community platform, our resident engagement has increased by 320%. The integrated event system alone saved us 15 hours of administrative work per week.",
      avatar: "SJ",
      metrics: ["85% resident participation", "45% time savings", "100% digital adoption"],
      duration: "Using platform for 2 years"
    },
    {
      name: "Michael Chen",
      role: "HOA President, Maplewood Community",
      text: "The financial transparency features revolutionized our HOA operations. We reduced accounting costs by 40% while improving accuracy and resident trust. The voting system increased participation from 45% to 82%.",
      avatar: "MC",
      metrics: ["40% cost reduction", "82% voting rate", "Zero compliance issues"],
      duration: "Using platform for 18 months"
    },
    {
      name: "Elena Rodriguez",
      role: "Resident & Event Coordinator, Riverside Village",
      text: "As a busy parent, the platform made community involvement accessible. I organized our neighborhood block party with 95% participation using just the mobile app. The resource sharing pool saved us $5,000 in equipment rentals.",
      avatar: "ER",
      metrics: ["95% event participation", "$5,000 savings", "100+ volunteers"],
      duration: "Using platform for 1 year"
    }
  ]

  const integrationFeatures = [
    {
      title: "Smart Home Integration",
      icon: <Home className="w-5 h-5" />,
      description: "Connect with security systems, smart locks, and IoT devices",
      benefits: ["Unified access control", "Energy management", "Automated alerts"]
    },
    {
      title: "Emergency Services",
      icon: <Shield className="w-5 h-5" />,
      description: "Direct integration with police, fire, and medical services",
      benefits: ["One-click emergency calls", "Location sharing", "Medical information access"]
    },
    {
      title: "Local Business Directory",
      icon: <MapPin className="w-5 h-5" />,
      description: "Curated local services with community discounts",
      benefits: ["Preferred vendor rates", "Service reviews", "Booking integration"]
    },
    {
      title: "Mobile App Suite",
      icon: <Phone className="w-5 h-5" />,
      description: "Native iOS and Android applications with offline capabilities",
      benefits: ["Push notifications", "QR code access", "Offline event details"]
    }
  ]

  const pricingTiers = [
    {
      name: "Basic",
      price: "$199",
      period: "per month",
      description: "For small communities up to 50 homes",
      includes: [
        "Community forum and messaging",
        "Basic event calendar",
        "Document storage (10GB)",
        "Email support",
        "Mobile app access"
      ],
      limitations: [
        "Advanced analytics",
        "Custom branding",
        "API access",
        "Priority support"
      ]
    },
    {
      name: "Professional",
      price: "$499",
      period: "per month",
      description: "For medium communities up to 250 homes",
      includes: [
        "All Basic features",
        "Advanced event management",
        "HOA management tools",
        "Financial tracking",
        "Priority support",
        "Custom branding",
        "API access",
        "Analytics dashboard"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored solution",
      description: "For large communities and property managers",
      includes: [
        "All Professional features",
        "Unlimited homes",
        "White-label solution",
        "Dedicated account manager",
        "Custom development",
        "On-premise deployment",
        "24/7 phone support",
        "Training and certification"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white ">
        <Navigation/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-25 ">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-20 min-h-screen">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-green-200 text-green-700 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Community Engagement Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Neighborhood
            <span className="block text-green-600 mt-2">Into a Connected Community</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one platform that combines communication, event management, resource sharing, and governance tools to build stronger, more engaged neighborhoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/demo')}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all text-sm"
            >
              Schedule Platform Demo
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-sm shadow-lg flex items-center justify-center gap-2"
            >
              Start 30-Day Free Trial
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className=" border-gray-300 bg-white p-8 mb-12 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Community Platform</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Four integrated modules working together to streamline community management and enhance resident engagement.
            </p>
            
            {platformModules.map((module, idx) => (
              <div key={idx} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-300">
                  <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center">
                    {module.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{module.category}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {module.features.map((feature, fIdx) => (
                    <div key={fIdx} className=" border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Capabilities:</h5>
                        <ul className="space-y-1">
                          {feature.capabilities.map((capability, cIdx) => (
                            <li key={cIdx} className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 mt-1" />
                              <span>{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          {feature.stats.map((stat, sIdx) => (
                            <span key={sIdx} className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1">
                              {stat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Community Statistics */}
          <div className=" border-gray-300 bg-white p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Platform Impact & Growth</h2>
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Real results from communities using our platform to enhance engagement and streamline operations.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {communityStats.map((stat, idx) => (
                <div key={idx} className=" border-gray-200 p-4 text-center">
                  <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{stat.metric}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Community Success Stories</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Hear from communities that have transformed their neighborhood engagement using our platform.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className=" border-gray-300 bg-white p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-green-600 to-teal-600 text-white flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.duration}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    {testimonial.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500" />
                        <span className="text-xs font-medium text-gray-700">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex text-yellow-400 mt-4">
                  {"★".repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className=" border-gray-300 bg-linear-to-r from-green-50 to-teal-50 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Seamless Integrations</h2>
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Extend your community platform's capabilities with powerful integrations.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationFeatures.map((feature, idx) => (
                <div key={idx} className=" border-gray-300 bg-white p-6">
                  <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="text-xs text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 mt-1" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Choose the plan that fits your community's size and needs. All plans include our core platform features.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className={`  ${tier.popular ? ' border-green-500 shadow-lg' : ' border-gray-300'} bg-white p-8`}>
                {tier.popular && (
                  <div className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">{tier.price}</div>
                  <div className="text-gray-600">{tier.period}</div>
                </div>
                
                <button
                  onClick={() => router.push('/register')}
                  className={`w-full py-3 font-semibold mb-6 ${tier.popular ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </button>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Includes:</h4>
                  {tier.includes.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 text-green-600 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  
                  {tier.limitations && tier.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mt-4">Not included:</h4>
                      {tier.limitations.map((limit, lIdx) => (
                        <div key={lIdx} className="flex items-center gap-2 text-gray-400">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm">{limit}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto">
          <div className=" border-green-600 bg-linear-to-r from-green-600 to-teal-600 p-12">
            <div className="max-w-3xl mx-auto text-center">
              <Users className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Community?</h2>
              <p className="text-gray-100 mb-8 text-lg">
                Join 3,200+ communities already using our platform to enhance engagement, streamline operations, and build stronger neighborhoods.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">30-Day Free Trial</div>
                  <div className="text-gray-200 text-sm">Full platform access, no credit card</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">Onboarding Support</div>
                  <div className="text-gray-200 text-sm">Dedicated setup assistance</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">Training & Resources</div>
                  <div className="text-gray-200 text-sm">Comprehensive learning materials</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/demo')}
                  className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all"
                >
                  Schedule Live Demo
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-8 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="text-gray-200 text-sm">
                  <span className="font-semibold">24/7 Support:</span> support@estatesecure.com • 
                  <span className="ml-4 font-semibold">Average Setup Time:</span> 3 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}