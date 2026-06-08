'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Briefcase, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Shield,
  User,
  ChevronRight,
  Plus,
  Trash2,
  Home,
  Car,
  Users,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Key,
  Wifi,
  Zap,
  Droplets,
  Trash,
  Dog,
  Mail,
  Clock,
  Smartphone,
  Camera,
  Ruler,
  Bed,
  Bath,
  ParkingCircle,
  Warehouse,
  Thermometer,
  Wind,
  Music,
  Dumbbell,
  Waves,
  Coffee,
  Trees,
  School,
  ShoppingBag,
  Bus,
  Ambulance,
  Flame,
  Snowflake
} from 'lucide-react'
import { updateProfile } from '@/lib/action'
import { getResidentData } from '@/lib/service'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function EstateOnboardingPage() {
  const [formData, setFormData] = useState({
    // Estate Basic Information
    estateName: '',
    estateType: 'residential',
    yearEstablished: '',
    totalArea: '',
    numberOfBuildings: 1,
    numberOfUnits: '',
    occupancyRate: '',
    
    // Location Details
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    landmark: '',
    coordinates: {
      latitude: '',
      longitude: ''
    },
    
    // Contact Information
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerAlternatePhone: '',
    emergencyContact: '',
    emergencyEmail: '',
    
    // Estate Features & Amenities
    amenities: {
      security: {
        has24HourSecurity: true,
        hasCCTV: true,
        hasAccessControl: true,
        hasSecurityLights: true,
        hasPerimeterFence: true,
        hasSecurityPatrol: true,
        securityCompany: '',
        securityGuardsCount: '',
        camerasCount: ''
      },
      recreation: {
        hasSwimmingPool: false,
        hasGym: false,
        hasTennisCourt: false,
        hasBasketballCourt: false,
        hasPlayground: false,
        hasClubhouse: false,
        hasEventCenter: false,
        hasMovieTheater: false,
        hasGameRoom: false,
        hasSpa: false,
        hasSauna: false
      },
      utilities: {
        has24HourElectricity: false,
        hasBackupGenerator: false,
        hasSolarPanels: false,
        hasBorehole: false,
        hasWaterTreatment: false,
        hasSewageSystem: false,
        hasWasteManagement: false,
        hasInternetCable: false,
        hasFiberOptic: false,
        hasGasPipeline: false
      },
      convenience: {
        hasSupermarket: false,
        hasPharmacy: false,
        hasLaundry: false,
        hasRestaurant: false,
        hasCafe: false,
        hasSalon: false,
        hasDaycare: false,
        hasSchool: false,
        hasMosque: false,
        hasChurch: false,
        hasMedicalClinic: false,
        hasBank: false
      },
      parking: {
        hasOpenParking: true,
        hasCoveredParking: false,
        hasBasementParking: false,
        hasVisitorParking: true,
        totalParkingSpots: '',
        electricChargingStations: false,
        chargingStationsCount: 0
      }
    },
    
    // Property Types Available
    propertyTypes: {
      studio: { available: false, count: 0, priceRange: { min: '', max: '' } },
      oneBedroom: { available: false, count: 0, priceRange: { min: '', max: '' } },
      twoBedroom: { available: false, count: 0, priceRange: { min: '', max: '' } },
      threeBedroom: { available: false, count: 0, priceRange: { min: '', max: '' } },
      fourBedroom: { available: false, count: 0, priceRange: { min: '', max: '' } },
      penthouse: { available: false, count: 0, priceRange: { min: '', max: '' } },
      duplex: { available: false, count: 0, priceRange: { min: '', max: '' } },
      commercial: { available: false, count: 0, priceRange: { min: '', max: '' } }
    },
    
    // Estate Rules & Policies
    rules: {
      petPolicy: 'allowed_with_restrictions',
      petRestrictions: '',
      quietHoursStart: '22:00',
      quietHoursEnd: '06:00',
      guestPolicy: 'allowed',
      guestHours: '',
      parkingRules: '',
      garbageCollectionDay: 'monday',
      garbageCollectionTime: '07:00',
      recyclingAvailable: false,
      movingHoursStart: '08:00',
      movingHoursEnd: '18:00',
      renovationPolicy: '',
      shortTermRentalAllowed: false,
      sublettingPolicy: ''
    },
    
    // Fee Structure
    fees: {
      serviceCharge: '',
      securityFee: '',
      wasteManagementFee: '',
      waterFee: '',
      electricityFee: '',
      internetFee: '',
      parkingFee: '',
      latePaymentPenalty: '',
      oneTimeRegistrationFee: ''
    },
    
    // Documents & Legal
    documents: {
      hasCAC: false,
      hasBuildingPlan: false,
      hasEnvironmentalImpact: false,
      hasFireSafety: false,
      hasInsurance: false,
      insuranceCompany: '',
      insurancePolicyNumber: ''
    },
    
    // Banking Information
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      bankCode: ''
    },
    
    // Onboarding Status
    termsAccepted: false,
    onboardingCompleted: false
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getResidentData()
        if (data) {
          setResidentData(data)
          // Pre-fill manager info if available
          setFormData(prev => ({
            ...prev,
            managerName: data.name || '',
            managerEmail: data.email || '',
            managerPhone: data.phone || ''
          }))
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNestedChange = (category, subcategory, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [field]: value
        }
      }
    }))
  }

  const handleAmenityToggle = (category, amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [category]: {
          ...prev.amenities[category],
          [amenity]: !prev.amenities[category][amenity]
        }
      }
    }))
  }

  const handlePropertyTypeChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: {
        ...prev.propertyTypes,
        [type]: {
          ...prev.propertyTypes[type],
          [field]: value
        }
      }
    }))
  }

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.estateName || !formData.address || !formData.city || !formData.state) {
        toast.error('Please fill in all required estate information')
        return false
      }
    }
    if (currentStep === 2) {
      if (!formData.managerName || !formData.managerEmail || !formData.managerPhone) {
        toast.error('Please provide manager contact information')
        return false
      }
    }
    if (currentStep === 6 && !formData.termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        id: residentData?._id || residentData?.id,
        onboardingCompleted: true,
        role: 'estate_manager',
        registrationDate: new Date().toISOString()
      }
     
      const result = await updateProfile(payload)
      
      if (result.success) {
        toast.success('Estate onboarding completed successfully!')
        router.push('/dashboard/estate-manager')
      } else {
        toast.error(result.message || 'Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-[#1241a1] animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading onboarding portal...</p>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Estate Info', icon: Building2 },
    { number: 2, title: 'Management', icon: User },
    { number: 3, title: 'Amenities', icon: Wifi },
    { number: 4, title: 'Properties', icon: Home },
    { number: 5, title: 'Rules & Fees', icon: FileText },
    { number: 6, title: 'Review', icon: CheckCircle2 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1241a1]/10 rounded-full mb-6">
            <Shield className="size-4 text-[#1241a1]" />
            <span className="text-xs font-bold text-[#1241a1] uppercase tracking-wider">Estate Manager Onboarding</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Register Your Estate
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Set up your residential community on our platform and start managing properties, residents, and amenities efficiently.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center relative">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all z-10 ${
                    currentStep >= step.number 
                      ? 'bg-[#1241a1] text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle2 className="size-6" /> : <step.icon className="size-6" />}
                </button>
                <span className={`text-xs font-bold mt-3 ${
                  currentStep >= step.number ? 'text-[#1241a1]' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-6 max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full" />
            <div className="absolute top-1/2 left-0 h-1 bg-[#1241a1] -translate-y-1/2 transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }} />
          </div>
        </div>

        {/* Form Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden">
          {/* Step 1: Estate Information */}
          {currentStep === 1 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Estate Basic Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Tell us about your residential community</p>
              </div>

              <div className="space-y-8">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Estate Name *
                    </label>
                    <input
                      type="text"
                      name="estateName"
                      value={formData.estateName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent"
                      placeholder="e.g., Victoria Garden Estate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Estate Type
                    </label>
                    <select
                      name="estateType"
                      value={formData.estateType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="residential">Residential Estate</option>
                      <option value="mixed">Mixed-Use Estate</option>
                      <option value="commercial">Commercial Estate</option>
                      <option value="gated">Gated Community</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Total Area (acres)
                    </label>
                    <input
                      type="text"
                      name="totalArea"
                      value={formData.totalArea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="e.g., 50 acres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Number of Buildings
                    </label>
                    <input
                      type="number"
                      name="numberOfBuildings"
                      value={formData.numberOfBuildings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      min="1"
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="size-5" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="No. 123, Estate Road"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="Near the main highway"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-[#1241a1] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Next: Management Info
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Management Contact */}
          {currentStep === 2 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Management Contact</h2>
                <p className="text-slate-600 dark:text-slate-400">Who will be the primary point of contact?</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Manager's Full Name *
                    </label>
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="managerEmail"
                      value={formData.managerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="manager@estate.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="managerPhone"
                      value={formData.managerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      name="managerAlternatePhone"
                      value={formData.managerAlternatePhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="+234 802 345 6789"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Emergency Contact</h4>
                      <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">This will be used for critical alerts</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          placeholder="Emergency Contact Name & Number"
                          className="px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800"
                        />
                        <input
                          type="email"
                          name="emergencyEmail"
                          value={formData.emergencyEmail}
                          onChange={handleInputChange}
                          placeholder="Emergency Email"
                          className="px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-[#1241a1] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Next: Amenities
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 3 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Estate Amenities</h2>
                <p className="text-slate-600 dark:text-slate-400">Select all amenities available in your estate</p>
              </div>

              <div className="space-y-8">
                {/* Security Amenities */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="size-5 text-green-600" />
                    Security Features
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.amenities.security).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleAmenityToggle('security', key)}
                              className="size-4 rounded"
                            />
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </label>
                        )
                      }
                      return null
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Security Company Name"
                      value={formData.amenities.security.securityCompany}
                      onChange={(e) => handleNestedChange('amenities', 'security', 'securityCompany', e.target.value)}
                      className="px-4 py-2 rounded-lg border"
                    />
                    <input
                      type="text"
                      placeholder="Number of Security Guards"
                      value={formData.amenities.security.securityGuardsCount}
                      onChange={(e) => handleNestedChange('amenities', 'security', 'securityGuardsCount', e.target.value)}
                      className="px-4 py-2 rounded-lg border"
                    />
                    <input
                      type="text"
                      placeholder="Number of CCTV Cameras"
                      value={formData.amenities.security.camerasCount}
                      onChange={(e) => handleNestedChange('amenities', 'security', 'camerasCount', e.target.value)}
                      className="px-4 py-2 rounded-lg border"
                    />
                  </div>
                </div>

                {/* Recreation Amenities */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Dumbbell className="size-5 text-purple-600" />
                    Recreation & Leisure
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.amenities.recreation).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleAmenityToggle('recreation', key)}
                          className="size-4 rounded"
                        />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Utilities */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="size-5 text-yellow-600" />
                    Utilities & Infrastructure
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.amenities.utilities).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleAmenityToggle('utilities', key)}
                          className="size-4 rounded"
                        />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Convenience Stores */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="size-5 text-blue-600" />
                    Convenience & Services
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.amenities.convenience).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleAmenityToggle('convenience', key)}
                          className="size-4 rounded"
                        />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Parking */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <ParkingCircle className="size-5 text-slate-600" />
                    Parking Facilities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.amenities.parking).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleAmenityToggle('parking', key)}
                              className="size-4 rounded"
                            />
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </label>
                        )
                      }
                      return null
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Total Parking Spots"
                      value={formData.amenities.parking.totalParkingSpots}
                      onChange={(e) => handleNestedChange('amenities', 'parking', 'totalParkingSpots', e.target.value)}
                      className="px-4 py-2 rounded-lg border"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.amenities.parking.electricChargingStations}
                        onChange={(e) => handleNestedChange('amenities', 'parking', 'electricChargingStations', e.target.checked)}
                        className="size-4 rounded"
                      />
                      <span className="text-sm">Has EV Charging Stations</span>
                      {formData.amenities.parking.electricChargingStations && (
                        <input
                          type="number"
                          placeholder="Number of stations"
                          value={formData.amenities.parking.chargingStationsCount}
                          onChange={(e) => handleNestedChange('amenities', 'parking', 'chargingStationsCount', parseInt(e.target.value))}
                          className="w-32 px-3 py-2 rounded-lg border"
                          min="0"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-[#1241a1] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Next: Property Types
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Property Types */}
          {currentStep === 4 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Property Types Available</h2>
                <p className="text-slate-600 dark:text-slate-400">Specify what types of properties are in your estate</p>
              </div>

              <div className="space-y-6">
                {Object.entries(formData.propertyTypes).map(([type, details]) => (
                  <div key={type} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                    <label className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={details.available}
                        onChange={(e) => handlePropertyTypeChange(type, 'available', e.target.checked)}
                        className="size-5 rounded"
                      />
                      <span className="text-lg font-semibold capitalize">
                        {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                    
                    {details.available && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                        <div>
                          <label className="block text-sm font-medium mb-1">Number of Units</label>
                          <input
                            type="number"
                            value={details.count}
                            onChange={(e) => handlePropertyTypeChange(type, 'count', parseInt(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Min Price (₦)</label>
                          <input
                            type="number"
                            value={details.priceRange.min}
                            onChange={(e) => handlePropertyTypeChange(type, 'priceRange', { ...details.priceRange, min: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border"
                            placeholder="e.g., 50000000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Max Price (₦)</label>
                          <input
                            type="number"
                            value={details.priceRange.max}
                            onChange={(e) => handlePropertyTypeChange(type, 'priceRange', { ...details.priceRange, max: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border"
                            placeholder="e.g., 150000000"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3 bg-[#1241a1] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Next: Rules & Fees
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Rules & Fees */}
          {currentStep === 5 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Estate Rules & Fee Structure</h2>
                <p className="text-slate-600 dark:text-slate-400">Set up community guidelines and service charges</p>
              </div>

              <div className="space-y-8">
                {/* Rules Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Community Rules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Pet Policy</label>
                      <select
                        value={formData.rules.petPolicy}
                        onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, petPolicy: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      >
                        <option value="allowed">Allowed</option>
                        <option value="allowed_with_restrictions">Allowed with restrictions</option>
                        <option value="not_allowed">Not allowed</option>
                      </select>
                      {formData.rules.petPolicy === 'allowed_with_restrictions' && (
                        <textarea
                          placeholder="Specify restrictions (e.g., size, breed, number of pets)"
                          value={formData.rules.petRestrictions}
                          onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, petRestrictions: e.target.value } }))}
                          className="w-full mt-2 px-4 py-2 rounded-lg border"
                          rows="2"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Quiet Hours</label>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={formData.rules.quietHoursStart}
                          onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, quietHoursStart: e.target.value } }))}
                          className="flex-1 px-4 py-2 rounded-lg border"
                        />
                        <span className="self-center">to</span>
                        <input
                          type="time"
                          value={formData.rules.quietHoursEnd}
                          onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, quietHoursEnd: e.target.value } }))}
                          className="flex-1 px-4 py-2 rounded-lg border"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Guest Policy</label>
                      <select
                        value={formData.rules.guestPolicy}
                        onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, guestPolicy: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      >
                        <option value="allowed">Allowed anytime</option>
                        <option value="restricted">Restricted hours</option>
                        <option value="registration_required">Registration required</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Garbage Collection</label>
                      <div className="flex gap-2">
                        <select
                          value={formData.rules.garbageCollectionDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, garbageCollectionDay: e.target.value } }))}
                          className="flex-1 px-4 py-2 rounded-lg border"
                        >
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                          <option value="sunday">Sunday</option>
                        </select>
                        <input
                          type="time"
                          value={formData.rules.garbageCollectionTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, rules: { ...prev.rules, garbageCollectionTime: e.target.value } }))}
                          className="flex-1 px-4 py-2 rounded-lg border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fees Section */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Service Charges & Fees (₦)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Monthly Service Charge</label>
                      <input
                        type="number"
                        value={formData.fees.serviceCharge}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, serviceCharge: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                        placeholder="e.g., 25000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Security Fee</label>
                      <input
                        type="number"
                        value={formData.fees.securityFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, securityFee: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Waste Management Fee</label>
                      <input
                        type="number"
                        value={formData.fees.wasteManagementFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, wasteManagementFee: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Water Fee</label>
                      <input
                        type="number"
                        value={formData.fees.waterFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, waterFee: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">One-time Registration Fee</label>
                      <input
                        type="number"
                        value={formData.fees.oneTimeRegistrationFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, oneTimeRegistrationFee: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Late Payment Penalty (%)</label>
                      <input
                        type="number"
                        value={formData.fees.latePaymentPenalty}
                        onChange={(e) => setFormData(prev => ({ ...prev, fees: { ...prev.fees, latePaymentPenalty: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                        placeholder="e.g., 5"
                      />
                    </div>
                  </div>
                </div>

                {/* Banking Details */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Account Name</label>
                      <input
                        type="text"
                        value={formData.bankDetails.accountName}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, accountName: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Account Number</label>
                      <input
                        type="text"
                        value={formData.bankDetails.accountNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, accountNumber: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankDetails.bankName}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, bankName: e.target.value } }))}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-8 py-3 bg-[#1241a1] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review & Submit</h2>
                <p className="text-slate-600 dark:text-slate-400">Verify all information before submitting</p>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                {/* Estate Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Building2 className="size-5" />
                    Estate Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><strong>Name:</strong> {formData.estateName || 'Not provided'}</p>
                    <p><strong>Type:</strong> {formData.estateType}</p>
                    <p><strong>Location:</strong> {formData.address}, {formData.city}</p>
                    <p><strong>Total Buildings:</strong> {formData.numberOfBuildings}</p>
                  </div>
                </div>

                {/* Amenities Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Wifi className="size-5" />
                    Key Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.amenities.recreation).map(([key, value]) => 
                      value && <span key={key} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    )}
                    {Object.entries(formData.amenities.utilities).map(([key, value]) => 
                      value && <span key={key} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Property Types Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Home className="size-5" />
                    Property Types
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(formData.propertyTypes).map(([type, details]) => 
                      details.available && (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{details.count} units</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Manager Contact */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <User className="size-5" />
                    Management Contact
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {formData.managerName}</p>
                    <p><strong>Email:</strong> {formData.managerEmail}</p>
                    <p><strong>Phone:</strong> {formData.managerPhone}</p>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="border-t pt-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1 size-4"
                    />
                    <span className="text-sm">
                      I confirm that all information provided is accurate and complete. I authorize the estate management platform to process this information and agree to comply with all platform terms of service.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.termsAccepted}
                  className="px-10 py-3 bg-[#1241a1] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}