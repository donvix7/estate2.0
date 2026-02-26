'use client'

import Footer from '@/components/Footer'
import Navigation from '@/components/navigation'
import { Activity, AlertTriangle, Bell, Cctv, Clock, Database, FileLock, Fingerprint, Globe, Key, Lock, Server, Shield, ShieldCheck, Users, Video, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SecurityPage() {
  const router = useRouter()

  const securityLayers = [
    {
      level: 1,
      title: "Perimeter Defense",
      description: "Multi-layered external protection system",
      icon: <Globe className="w-5 h-5" />,
      features: [
        "Smart perimeter fencing with motion detection",
        "Automated gate control with license plate recognition",
        "Thermal imaging cameras for low-light conditions",
        "Ground-based seismic sensors for intrusion detection",
        "Weather-resistant outdoor surveillance up to IP68 rating"
      ],
      response: "Immediate alert to security personnel with exact location mapping"
    },
    {
      level: 2,
      title: "Access Control",
      description: "Multi-factor authentication and authorization systems",
      icon: <Key className="w-5 h-5" />,
      features: [
        "Biometric fingerprint and facial recognition",
        "RFID/NFC card and mobile app authentication",
        "PIN-based secondary verification",
        "Time-based access restrictions",
        "Visitor management with temporary credentials"
      ],
      response: "Real-time authorization logging and suspicious pattern detection"
    },
    {
      level: 3,
      title: "Surveillance Network",
      description: "Intelligent video and sensor monitoring system",
      icon: <Video className="w-5 h-5" />,
      features: [
        "4K Ultra HD cameras with 360° panoramic views",
        "AI-powered object recognition (human, vehicle, package)",
        "Behavioral analysis for suspicious activity detection",
        "Automatic number plate recognition (ANPR)",
        "Low-bandwidth streaming with edge computing"
      ],
      response: "Automated threat classification and priority alerting"
    },
    {
      level: 4,
      title: "Data Security",
      description: "End-to-end encryption and secure storage",
      icon: <Shield className="w-5 h-5" />,
      features: [
        "AES-256 encryption for all video feeds",
        "Blockchain-based audit trail for access logs",
        "Secure cloud storage with geographic redundancy",
        "Real-time data integrity verification",
        "GDPR-compliant data retention policies"
      ],
      response: "Instant encryption breach detection and data isolation"
    }
  ]

  const securityFeatures = [
    {
      category: "AI Surveillance",
      items: [
        {
          icon: <Cctv className="w-6 h-6" />,
          title: "Intelligent Video Analytics",
          description: "Real-time object detection, facial recognition, and behavioral analysis",
          specifications: [
            "Processing speed: <100ms per frame",
            "Accuracy: 99.7% in optimal conditions",
            "Simultaneous tracking: Up to 50 objects",
            "Low-light capability: 0.001 lux minimum"
          ]
        },
        {
          icon: <Activity className="w-6 h-6" />,
          title: "Predictive Threat Analysis",
          description: "Machine learning algorithms that identify potential security breaches before they occur",
          specifications: [
            "Historical data analysis: 2+ years of patterns",
            "Prediction accuracy: 94%",
            "Learning models: Updated hourly",
            "Integration: Works with existing camera systems"
          ]
        }
      ]
    },
    {
      category: "Access Management",
      items: [
        {
          icon: <Fingerprint className="w-6 h-6" />,
          title: "Multi-Factor Biometric System",
          description: "Combination of fingerprint, facial, and iris recognition for maximum security",
          specifications: [
            "False acceptance rate: <0.001%",
            "Verification time: <0.5 seconds",
            "Capacity: 10,000+ unique profiles",
            "Integration: Works with all major access control systems"
          ]
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Advanced Visitor Management",
          description: "Complete lifecycle management for guests, contractors, and temporary staff",
          specifications: [
            "Automated background checks",
            "Temporary access credential generation",
            "Escort requirement enforcement",
            "Visit duration monitoring"
          ]
        }
      ]
    },
    {
      category: "Monitoring & Response",
      items: [
        {
          icon: <Bell className="w-6 h-6" />,
          title: "24/7 Security Operations Center",
          description: "Professional monitoring with immediate response capabilities",
          specifications: [
            "Response time: <30 seconds for critical alerts",
            "Staff: Certified security professionals",
            "Coverage: Global monitoring network",
            "Communication: Encrypted channels only"
          ]
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Real-Time Incident Management",
          description: "Coordinated response system with automated workflow",
          specifications: [
            "Alert classification: 5 severity levels",
            "Response protocols: 50+ predefined scenarios",
            "Documentation: Automated incident reporting",
            "Compliance: Meets ISO 27001 requirements"
          ]
        }
      ]
    },
    {
      category: "Data Protection",
      items: [
        {
          icon: <Lock className="w-6 h-6" />,
          title: "Military-Grade Encryption",
          description: "End-to-end encryption for all data transmission and storage",
          specifications: [
            "Encryption standard: AES-256 & RSA-4096",
            "Key management: Hardware Security Modules",
            "Data in transit: TLS 1.3+",
            "Compliance: FIPS 140-2 Level 3"
          ]
        },
        {
          icon: <Server className="w-6 h-6" />,
          title: "Secure Infrastructure",
          description: "Geo-redundant data centers with multiple security layers",
          specifications: [
            "Uptime SLA: 99.99%",
            "Data redundancy: 3+ geographic locations",
            "Physical security: Biometric access, 24/7 guards",
            "Backup: Real-time synchronization"
          ]
        }
      ]
    }
  ]

  const complianceStandards = [
    {
      name: "ISO 27001:2022",
      description: "Information Security Management System",
      coverage: "Full compliance with all 93 controls",
      certification: "Annually audited by accredited bodies",
      icon: <FileLock className="w-5 h-5" />
    },
    {
      name: "SOC 2 Type II",
      description: "Service Organization Control",
      coverage: "Security, availability, processing integrity",
      certification: "Quarterly assessments, annual report",
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation",
      coverage: "EU data protection and privacy",
      certification: "Data Protection Officer appointed",
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: "HIPAA",
      description: "Health Insurance Portability Act",
      coverage: "Protected health information",
      certification: "Business Associate Agreement ready",
      icon: <Database className="w-5 h-5" />
    },
    {
      name: "PCI DSS 4.0",
      description: "Payment Card Industry Data Security",
      coverage: "Credit card data protection",
      certification: "Level 1 Service Provider",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ]

  const securityMetrics = [
    { name: "Mean Time to Detect", value: "1.2 minutes", target: "≤ 2 minutes", status: "exceeded" },
    { name: "Mean Time to Respond", value: "3.8 minutes", target: "≤ 5 minutes", status: "exceeded" },
    { name: "False Positive Rate", value: "0.18%", target: "≤ 0.5%", status: "exceeded" },
    { name: "System Uptime", value: "99.992%", target: "99.99%", status: "exceeded" },
    { name: "Encryption Coverage", value: "100%", target: "100%", status: "met" },
    { name: "Audit Trail Accuracy", value: "100%", target: "100%", status: "met" }
  ]

  const implementationPhases = [
    {
      phase: "Assessment",
      duration: "1-2 weeks",
      activities: [
        "Current security infrastructure analysis",
        "Risk assessment and threat modeling",
        "Compliance requirements gathering",
        "Stakeholder interviews and workshops"
      ]
    },
    {
      phase: "Design",
      duration: "2-3 weeks",
      activities: [
        "Architecture planning and system design",
        "Integration strategy with existing systems",
        "Custom security protocol development",
        "Implementation roadmap creation"
      ]
    },
    {
      phase: "Deployment",
      duration: "4-6 weeks",
      activities: [
        "Hardware installation and configuration",
        "Software deployment and integration",
        "Network security implementation",
        "Data migration and system testing"
      ]
    },
    {
      phase: "Training",
      duration: "1-2 weeks",
      activities: [
        "Administrator training and certification",
        "End-user security awareness programs",
        "Emergency response procedure training",
        "Ongoing support and maintenance planning"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white ">
        <Navigation/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-red-200 text-red-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Enterprise Security Solutions
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Comprehensive Security Infrastructure
            <span className="block text-red-600 mt-2">For Modern Communities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            End-to-end security platform integrating cutting-edge surveillance, access control, and monitoring technologies with military-grade encryption and AI-powered threat detection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/demo')}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all text-sm"
            >
              Schedule Security Assessment
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-sm shadow-lg flex items-center justify-center gap-2"
            >
              Request Technical Specifications
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Architecture Overview */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className=" border-gray-300 bg-white p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Multi-Layered Security Architecture</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Our defense-in-depth approach ensures comprehensive protection through multiple, redundant security layers.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityLayers.map((layer) => (
                <div key={layer.level} className=" border-gray-200 p-6 hover:border-red-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center text-lg font-bold">
                      {layer.level}
                    </div>
                    <div className="w-8 h-8 bg-red-100 text-red-600 flex items-center justify-center">
                      {layer.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{layer.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{layer.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {layer.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-red-500 mt-1.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Response Protocol:</h4>
                    <p className="text-xs text-gray-600">{layer.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Features Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Advanced Security Capabilities</h2>
            <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Comprehensive suite of security technologies designed for maximum protection and operational efficiency.
            </p>
            
            {securityFeatures.map((category, catIdx) => (
              <div key={catIdx} className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 pb-2 border-b border-gray-300">
                  {category.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className=" border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Technical Specifications:</h5>
                        <ul className="space-y-2">
                          {item.specifications.map((spec, specIdx) => (
                            <li key={specIdx} className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 mt-1" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className=" border-gray-300 bg-white p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Compliance & Certifications</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Our security platform meets and exceeds global compliance standards, ensuring your organization remains protected and compliant.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {complianceStandards.map((standard, idx) => (
                <div key={idx} className=" border-gray-200 p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                    {standard.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{standard.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{standard.description}</p>
                  <div className="text-xs">
                    <div className="text-gray-700 mb-1"><strong>Coverage:</strong> {standard.coverage}</div>
                    <div className="text-gray-700"><strong>Certification:</strong> {standard.certification}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className=" border-t border-gray-300 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Performance Metrics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityMetrics.map((metric, idx) => (
                  <div key={idx} className=" border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                      <span className={`text-xs px-2 py-1 ${
                        metric.status === 'exceeded' ? 'bg-green-100 text-green-800' :
                        metric.status === 'met' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {metric.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-600">Target: {metric.target}</div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 h-2">
                        <div 
                          className={`h-2 ${
                            metric.status === 'exceeded' ? 'bg-green-500' :
                            metric.status === 'met' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: metric.status === 'exceeded' ? '110%' : '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Process */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Implementation Process</h2>
          <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Structured deployment methodology ensuring seamless integration with existing infrastructure.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationPhases.map((phase, idx) => (
              <div key={idx} className=" border-gray-300 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center text-lg font-bold">
                    {idx + 1}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1">
                    {phase.duration}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{phase.phase}</h3>
                
                <div className="space-y-3">
                  {phase.activities.map((activity, actIdx) => (
                    <div key={actIdx} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 mt-1.5" />
                      <span className="text-sm text-gray-600">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto">
          <div className=" border-red-300 bg-linear-to-r from-red-600 to-orange-600 p-12">
            <div className="max-w-3xl mx-auto text-center">
              <AlertTriangle className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security Assessment</h2>
              <p className="text-gray-100 mb-8 text-lg">
                Schedule a comprehensive security audit with our certified experts. Receive a detailed risk assessment, compliance review, and customized security roadmap.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">Free Security Audit</div>
                  <div className="text-gray-200 text-sm">Comprehensive infrastructure review</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">Custom Implementation Plan</div>
                  <div className="text-gray-200 text-sm">Tailored deployment strategy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 border-white/20">
                  <div className="text-white font-semibold mb-1">Compliance Consultation</div>
                  <div className="text-gray-200 text-sm">Regulatory requirement analysis</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/demo')}
                  className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all"
                >
                  Request Security Audit
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="px-8 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-all"
                >
                  Speak with Security Expert
                </button>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="text-gray-200 text-sm">
                  <span className="font-semibold">24/7 Emergency Support:</span> +1-800-SECURE-99 • 
                  <span className="ml-4 font-semibold">Average Response Time:</span> 2.3 minutes
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