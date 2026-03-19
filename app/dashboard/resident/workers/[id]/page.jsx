'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Star, 
  CheckCircle2, 
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
  X
} from 'lucide-react'

// Extended worker data for profiles
const WORKER_DETAILS = {
  1: {
    name: 'John Miller',
    title: 'Master Plumber • 12 yrs exp.',
    bio: 'Dedicated professional with over a decade of experience in residential and commercial plumbing systems. Specialist in high-efficiency boiler installations and emergency pipe repairs.',
    rating: 4.9,
    reviews: 128,
    jobsDone: 154,
    successRate: '98%',
    available: true,
    skills: ['Emergency Repair', 'Pipe Fitting', 'Gas Safety', 'Drainage Specialists'],
    qualifications: [
      'Certified Master Plumber (CMP)',
      'OSHA Safety Certification',
      'Advanced Hydro-Jetting Specialist',
      'Solar Thermal Installation Diploma'
    ],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    image: '/sw_plumber1.png',
    initials: 'JM',
    color: 'bg-blue-600',
    rate: '₦25,000/hr'
  },
  2: {
    name: 'Sarah Chen',
    title: 'Leak Detection Specialist',
    bio: 'Sarah leverages advanced acoustic technology to find hidden leaks. She specializes in smart home water management and eco-friendly heating solutions.',
    rating: 4.8,
    reviews: 74,
    jobsDone: 89,
    successRate: '96%',
    available: true,
    skills: ['Smart Homes', 'Solar Heating', 'Acoustic Leak Detection', 'Water Audits'],
    qualifications: [
      'BSc Environmental Engineering',
      'Smart Home Systems Certified',
      'Advanced Thermal Imaging Specialist'
    ],
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    image: null,
    initials: 'SC',
    color: 'bg-sky-500',
    rate: '₦30,000/hr'
  },
  3: {
    name: 'Amara Nwosu',
    title: 'Commercial Electrician',
    bio: 'High-voltage expert specializing in commercial electrical infrastructure and solar power integration. Known for precision wiring and safety compliance.',
    rating: 5.0,
    reviews: 156,
    jobsDone: 212,
    successRate: '100%',
    available: true,
    skills: ['Solar Panels', 'Smart Wiring', 'Industrial Panels', 'Energy Audits'],
    qualifications: [
      'Certified Electrical Engineer',
      'Solar PV Installation Professional',
      'IEE Regulations Expert'
    ],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      facebook: 'https://facebook.com'
    },
    image: '/sw_electrician1.png',
    initials: 'AN',
    color: 'bg-amber-600',
    rate: '₦35,000/hr'
  }
}

// Fallback for demo workers not in the detail map
const getMockWorker = (id) => {
  return WORKER_DETAILS[id] || {
    name: 'Professional Worker',
    title: 'Estate Verified Specialist',
    bio: 'Comprehensive property maintenance expert dedicated to providing high-quality service to estate residents.',
    rating: 4.5,
    reviews: 42,
    jobsDone: 50,
    successRate: '95%',
    available: true,
    skills: ['General Repair', 'Maintenance'],
    qualifications: ['Estate Safety Certified'],
    socials: { linkedin: '#' },
    image: null,
    initials: 'PW',
    color: 'bg-slate-600',
    rate: '₦15,000/hr'
  }
}

export default function WorkerProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [showBook, setShowBook] = useState(false)
  
  const worker = getMockWorker(id)

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 animate-in fade-in duration-700">
      
      {/* ── Top Navigation ── */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="size-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-500 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-black dark:text-white">Worker Profile</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estate Directory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Profile Card ── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative size-32 rounded-4xl overflow-hidden mb-6 ring-4 ring-slate-50 dark:ring-slate-800">
              {worker.image ? (
                <Image src={worker.image} alt={worker.name} fill className="object-cover" />
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center text-4xl font-black text-white ${worker.color}`}>
                  {worker.initials}
                </div>
              )}
              {worker.available && (
                <div className="absolute bottom-2 right-2 size-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg" />
              )}
            </div>
            
            <h3 className="text-2xl font-black dark:text-white">{worker.name}</h3>
            <p className="text-sm font-bold text-[#1241a1] mt-1">{worker.title}</p>
            
            <div className="flex items-center gap-1.5 mt-4 bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black text-amber-700 dark:text-amber-400">{worker.rating}</span>
              <span className="text-xs text-amber-600/60 dark:text-amber-400/50 font-bold ml-1">({worker.reviews} reviews)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rate</p>
                <p className="text-sm font-black dark:text-white">{worker.rate}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success</p>
                <p className="text-sm font-black text-emerald-500">{worker.successRate}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowBook(true)}
              className="w-full bg-[#1241a1] hover:brightness-110 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-[#1241a1]/20 transition-all active:scale-95"
            >
              Book Service
            </button>
            <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white font-black py-4 rounded-2xl mt-3 transition-all flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Professional
            </button>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Connected Socials</h4>
            <div className="flex flex-col gap-4">
              {worker.socials.linkedin && (
                <a href={worker.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#1241a1] transition-colors">
                  <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  LinkedIn Profile
                </a>
              )}
              {worker.socials.instagram && (
                <a href={worker.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#1241a1] transition-colors">
                  <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  Instagram Showcase
                </a>
              )}
              {worker.socials.twitter && (
                <a href={worker.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#1241a1] transition-colors">
                  <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Twitter className="w-4 h-4" />
                  </div>
                  Twitter (X)
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Details ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm">
            <h4 className="text-lg font-black dark:text-white mb-4">About Professional</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {worker.bio}
            </p>
          </div>

          {/* Experience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                <p className="text-sm font-bold dark:text-white">12+ Years Professional Experience</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification</p>
                <p className="text-sm font-bold dark:text-white">Full Identity & Skill Verified</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-600" />
               </div>
               <h4 className="text-lg font-black dark:text-white">Professional Qualifications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worker.qualifications.map((q, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-[#1241a1]" />
                  <span className="text-sm font-bold dark:text-white">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Specialties */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-sky-600" />
               </div>
               <h4 className="text-lg font-black dark:text-white">Skills & Specialties</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-tight">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Booking Modal (Simplified) ── */}
      {showBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1241a1]">Service Request</h3>
              <button onClick={() => setShowBook(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div className={`size-12 rounded-xl flex items-center justify-center text-white font-black ${worker.color}`}>
                   {worker.initials}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provider</p>
                  <p className="text-sm font-black dark:text-white">{worker.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Preferred Date</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Service Description</label>
                <textarea placeholder="Tell us what you need..." rows={3} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none border-none dark:text-white resize-none" />
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
               <button onClick={() => setShowBook(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all">Cancel</button>
               <button onClick={() => setShowBook(false)} className="flex-1 py-4 bg-[#1241a1] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#1241a1]/20">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
