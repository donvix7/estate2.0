'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { 
  Briefcase, 
  Award, 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  Clock,
  ShieldCheck,
  Zap,
  Phone,
  MessageSquare,
  Calendar,
  X,
  Star,
  CheckCircle2,
  ChevronLeft,
  User
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { getWorkerById, getResidentData } from '@/lib/service'
import { bookService } from '@/lib/action'
import { toast } from 'react-toastify'


export default function WorkerProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [showBook, setShowBook] = useState(false)
  const [worker, setWorker] = useState(null)
  const [residentData, setResidentData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      const [workerData, resData] = await Promise.all([
        getWorkerById(id),
        getResidentData()
      ])
      setWorker(workerData)
      setResidentData(resData)
      setLoading(false)
    }
    loadData()
  }, [id])

  const [bookingForm, setBookingForm] = useState({
    date: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const requestData = {
      id: `#SR-${Math.floor(1000 + Math.random() * 9000)}`,
      category: worker.category || 'General',
      icon: worker.category === 'plumbing' ? 'Droplets' : 
            worker.category === 'electrical' ? 'Bolt' : 
            worker.category === 'carpentry' ? 'Hammer' : 
            worker.category === 'cleaning' ? 'Sparkles' : 'Briefcase',
      desc: bookingForm.description,
      date: bookingForm.date,
      status: 'Scheduled',
      statusColor: 'bg-slate-400',
      iconColor: worker.category === 'plumbing' ? 'text-blue-500' : 'text-slate-500',
      workerId: id,
      workerName: worker.name,
      residentId: residentData?.id || residentData?._id || 'RES-005',
      estateID: worker.estateID || 'EST-001'
    }

    try {
      await bookService(requestData)
      toast.success(`Booking request sent to ${worker.name}!`)
      setShowBook(false)
      setBookingForm({ date: '', description: '' })
    } catch (error) {
      toast.error('Failed to send booking request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1241a1]"></div>
    </div>
  )

  if (!worker) return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <p className="font-bold">Worker not found</p>
      <button onClick={() => router.back()} className="text-[#1241a1] font-bold">Go Back</button>
    </div>
  )

  const bio = worker.bio || 'Comprehensive property maintenance expert dedicated to providing high-quality service to estate residents.'
  const qualifications = worker.qualifications || ['Estate Safety Certified']
  const socials = worker.socials || { linkedin: '#' }
  const successRate = worker.successRate || '95%'
  const reviews = worker.reviews || 0

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <PageHeader 
        title="Worker Profile" 
        description="View professional details, ratings, and book services directly from the estate directory."
        icon={Briefcase}
        iconColor="blue"
      />

      {/* ── Profile Header Card ── */}
      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8 md:p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1241a1]/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            {worker.image ? (
              <div 
                className="h-32 w-32 rounded-md bg-cover bg-center ring-4 ring-white dark:ring-slate-800" 
                style={{ backgroundImage: `url(${worker.image})` }}
              ></div>
            ) : (
              <div className={`h-32 w-32 rounded-md flex items-center justify-center ${worker.color || 'bg-[#1241a1]'}`}>
                <span className="text-4xl font-black text-white/80">
                   {worker.initials || worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
            )}
            {worker.available && (
              <div className="absolute bottom-[-5px] right-[-5px] size-5 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full shadow-lg" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h2 className="text-3xl font-semibold dark:text-white tracking-tight">
                {worker.name}
              </h2>
              {worker.verified ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1241a1]/10 text-[#1241a1] rounded-md text-[10px] font-bold uppercase tracking-widest w-fit mx-auto md:mx-0">
                  <CheckCircle2 className="size-3.5" />
                  Verified Professional
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-md text-[10px] font-bold uppercase tracking-widest w-fit mx-auto md:mx-0">
                  <ShieldCheck className="size-3.5" />
                  Not Verified
                </div>
              )}
            </div>
            
            <p className="text-[#1241a1] font-semibold text-lg mb-4">{worker.title}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <div className="flex items-center gap-1.5 bg-amber-400/10 px-3 py-1 rounded-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{worker.rating}</span>
                <span className="text-xs text-amber-600/60 dark:text-amber-400/50 font-semibold ml-1">({reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <ShieldCheck className="size-4" />
                {worker.verified ? 'Identity Verified' : 'Awaiting Verification'}
              </div>
            </div>
            
         
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => setShowBook(true)}
                className="px-8 py-2.5 bg-[#1241a1] text-white text-[13px] font-semibold uppercase tracking-widest rounded-md hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#1241a1]/20"
              >
                Book Service
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 text-[13px] font-semibold uppercase tracking-widest rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                <MessageSquare className="size-4" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Profile Card ── */}
        <div className="lg:col-span-1 space-y-8">
          {/* Service Statistics */}
          <section className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-[#1241a1]">
                <Zap className="size-5" />
              </div>
              Performance
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Standard Rate', value: worker.rate || '₦0/hr' },
                { label: 'Jobs Completed', value: `${worker.jobs || 0} Successful Jobs`, color: 'text-[#1241a1]' },
                { label: 'Success Rate', value: successRate, color: 'text-emerald-500' },
                { label: 'Experience', value: '12+ Years' }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-1.5 ${idx !== 3 ? 'border-b border-white dark:border-slate-800/50 pb-5' : ''}`}>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color || 'text-slate-900 dark:text-slate-200'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-[#1241a1]">
                <Globe className="size-5" />
              </div>
              Social Media
            </h3>
            <div className="space-y-4">
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group cursor-pointer border-b border-white dark:border-slate-800/50 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white group-hover:text-[#1241a1] transition-colors">LinkedIn</span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Professional Profile</span>
                  </div>
                  <Linkedin className="size-4 text-slate-400 group-hover:text-[#1241a1] transition-colors" />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group cursor-pointer border-b border-white dark:border-slate-800/50 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white group-hover:text-[#1241a1] transition-colors">Instagram</span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Project Showcase</span>
                  </div>
                  <Instagram className="size-4 text-slate-400 group-hover:text-[#1241a1] transition-colors" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white group-hover:text-[#1241a1] transition-colors">Twitter</span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Quick Updates</span>
                  </div>
                  <Twitter className="size-4 text-slate-400 group-hover:text-[#1241a1] transition-colors" />
                </a>
              )}
            </div>
          </section>
        </div>

        {/* ── Right Column: Details ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Professional */}
          <section className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
              <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-[#1241a1]">
                <Briefcase className="size-5" />
              </div>
              About Professional
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
              {bio}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-md">
                <div className="size-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="text-sm font-semibold dark:text-white">{worker.experience || "Not Available"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-md">
                <div className="size-10 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Verification</p>
                  {worker.verified ? (
                      <p className="text-sm font-semibold dark:text-white">ID & Skill Verified</p>
                    ) : (
                      <p className="text-sm font-semibold text-rose-600">Not Verified</p>
                    )
                  }
                </div>
              </div>
            </div>
          </section>

          {/* Professional Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Qualifications */}
            <section className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
                <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-[#1241a1]">
                  <Award className="size-5" />
                </div>
                Qualifications
              </h3>
              <div className="space-y-4">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{q}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="bg-slate-100 dark:bg-slate-800/30 rounded-md p-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1241a1] mb-8 flex items-center gap-3">
                <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-[#1241a1]">
                  <Zap className="size-5" />
                </div>
                Skills & Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-[#1241a1] dark:text-slate-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

      </div>

      {/* ── Booking Modal (Simplified) ── */}
      {showBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleBookSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1241a1]">Service Request</h3>
              <button type="button" onClick={() => setShowBook(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div className={`size-12 rounded-xl flex items-center justify-center text-white font-black ${worker.color || 'bg-[#1241a1]'}`}>
                   {worker.initials || 'W'}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provider</p>
                  <p className="text-sm font-black dark:text-white">{worker.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  value={bookingForm.date}
                  onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Service Description</label>
                <textarea 
                  placeholder="Tell us what you need..." 
                  rows={3} 
                  required
                  value={bookingForm.description}
                  onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white resize-none" 
                />
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
               <button type="button" onClick={() => setShowBook(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all">Cancel</button>
               <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#1241a1] text-white font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all shadow-xl shadow-[#1241a1]/20 disabled:opacity-50"
               >
                 {isSubmitting ? 'Sending...' : 'Confirm'}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
