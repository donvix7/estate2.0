'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Building,
  Info
} from 'lucide-react'
import { getResidentRequestById } from '@/lib/service'
import { handleResidentRequestDecision } from '@/lib/action'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function RequestDetailsPage({ params }) {
  const unwrappedParams = use(params)
  const id = unwrappedParams.id
  
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getResidentRequestById(id)
        // Adjust based on typical API structure { success: true, data: { ... } }
        setRequest(data.data || data)
      } catch (error) {
        console.error('Error fetching request:', error)
        toast.error('Failed to load request details')
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequest()
  }, [id])

  const handleAcknowledge = async () => {
    setIsProcessing(true)
    try {
      const result = await handleResidentRequestDecision(id, 'recieved')
      if (result.success) {
        toast.success('Request acknowledged successfully')
        setRequest(prev => ({ ...prev, status: 'recieved' }))
      } else {
        toast.error(result.message || 'Failed to update request')
      }
    } catch (error) {
      toast.error('An error occurred during processing')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) return <LoadingState message="Retrieving request profile..." />
  
  if (!request || !request._id) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-500 animate-in fade-in duration-500">
      <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ShieldAlert size={32} className="opacity-20" />
      </div>
      <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Onboarding Request Not Found</p>
      <Link href="/dashboard/admin/users/requests" className="mt-6 text-xs font-bold text-[#1241a1] hover:underline underline-offset-4">
        Return to Directory
      </Link>
    </div>
  )

  const isAcknowledged = request.status?.toLowerCase() === 'recieved'

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Navigation & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/users/requests"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-[#1241a1]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
          <Link href="/dashboard/admin/users/requests" className="hover:text-[#1241a1] transition-colors">Directory</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">Request</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1241a1] font-mono tracking-tighter">#{request._id}</span>
        </div>
      </div>

      <PageHeader 
        title="Applicant Insight" 
        description={`Detailed view of the resident onboarding submission for ${request.name}.`}
        icon={User}
      >
        <div className="flex gap-3">
          <button
            onClick={handleAcknowledge}
            disabled={isProcessing || isAcknowledged}
            className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-blue-900/10 ${
              isAcknowledged
              ? 'bg-emerald-50 text-emerald-600 border-none cursor-default'
              : 'bg-[#1241a1] text-white hover:brightness-110 active:scale-95 disabled:opacity-50'
            }`}
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : isAcknowledged ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            {isAcknowledged ? 'Acknowledged' : 'Acknowledge Submission'}
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Submission Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-100 dark:bg-slate-800/30 rounded-3xl p-8 lg:p-12 space-y-12 shadow-sm border-none relative overflow-hidden">
            
            {/* Header / Identity */}
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="size-28 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-inner border-none shrink-0">
                <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <User size={32} className="text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{request.name}</h2>
                  <div className={`size-2 rounded-full animate-pulse ${request.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-white dark:bg-slate-900 shadow-sm text-[#1241a1] text-[10px] font-bold uppercase rounded-lg tracking-widest">
                    Resident Applicant
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase bg-slate-200/50 dark:bg-slate-700/50 px-2 py-1 rounded-md tracking-tighter">
                    <Hash size={10} /> {request._id}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   Electronic Mail
                </label>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-inner border-none">
                  {request.email || 'N/A'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   Contact Number
                </label>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-inner border-none">
                  {request.phone || 'N/A'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   Assigned Estate ID
                </label>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-inner border-none">
                  {request.estateID || 'N/A'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   Submission Timeline
                </label>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-inner border-none">
                  <Calendar size={16} className="text-slate-400" />
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action / Context Sidebar */}
        <div className="space-y-8">
          
          <div className="bg-[#1241a1]/5 dark:bg-blue-900/10 rounded-3xl p-8 space-y-8 border-none shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                  <Shield size={20} className="text-[#1241a1]" />
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Workflow Status</h4>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stage</p>
                <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold capitalize ${
                  request.status === 'pending' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <div className={`size-2.5 rounded-full ${request.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {request.status}
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Applicant is currently in the onboarding queue. Acknowledging this submission notifies the resident to proceed with their account setup and community profile.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/30 rounded-3xl p-8 flex gap-5 border-none shadow-sm items-start">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl text-[#1241a1] shadow-sm shrink-0">
              <Info size={24} />
            </div>
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none">Administrative Intelligence</h5>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Verification of ID and Phone is recommended before acknowledgement. Ensure the Resident Name matches the community lease records.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}