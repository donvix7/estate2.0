'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building, ChevronRight, Eye, Flame, Headset, HeartPulse, HelpCircle, Loader2, Phone, Plus, Send, ShieldAlert, User, UserPlus, Users, X } from 'lucide-react'
import { getResidentData, getUserById } from '@/lib/service'
import { updateEmergencyContacts, sendEmergencyAlert } from '@/lib/action'
import { toast } from 'react-toastify'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { BackButton } from '@/components/ui/BackButton'
import { useRouter } from 'next/navigation'

const ESTATE_SERVICES = [
  {
    id: 'security',
    name: 'Security & Patrol',
    description: 'On-site professional security team for immediate threats, suspicious activity, or unauthorized access.',
    icon: ShieldAlert,
    badge: 'Available 24/7',
    badgeClass: 'bg-red-600 text-white',
    phone: 'tel:+2348000000001',
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 'medical',
    name: 'Medical Response',
    description: 'Certified paramedic team located at the main gatehouse. Equipped for basic life support and rapid transport.',
    icon: HeartPulse,
    badge: 'Response < 5 Mins',
    badgeClass: 'bg-red-600 text-white',
    phone: 'tel:+2348000000002',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    id: 'fire',
    name: 'Fire & Maintenance',
    description: 'Urgent fire safety response and critical infrastructure repair — gas leaks, burst pipes, electrical hazards.',
    icon: Flame,
    badge: 'Critical Infrastructure',
    badgeClass: 'bg-[#1241a1] text-white',
    phone: 'tel:+2348000000003',
    color: 'text-[#1241a1] bg-blue-50',
  },
]



export default function EmergencyPage() {
  const [showAddContact, setShowAddContact] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  
  const [contacts, setContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })
  const [editContact, setEditContact] = useState({ name: '', phone: '', relation: '' })
  const [reportData, setReportData] = useState({ category: 'Security', subject: '', description: '' })
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)


  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getResidentData();
        if (data) {
          setResidentData(data);
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Securing your connection..." />
  }

//const INITIAL_PERSONAL_CONTACTS = []

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || (!residentData?.id && !residentData?._id)) return
    
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const initials = newContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const contact = {
      id: Date.now(),
      ...newContact,
      initials,
      color: randomColor,
      phone: `tel:${newContact.phone}`
    }

    try {
      const res = await updateEmergencyContacts(contact)
      if(res.success){
        toast.success(res.message)
        setContacts([...contacts, contact])
        setNewContact({ name: '', phone: '', relation: '' })
        setShowAddContact(false)
      }else{
        toast.error(res.message)
      }
    } catch (error) {
      console.error('Failed to add contact:', error)
      toast.error('Failed to add contact. Please try again.')
    }
  }

  const handleUpdateContact = async () => {
    if (!editContact.name || !editContact.phone || (!residentData?.id && !residentData?._id)) return

    const initials = editContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const phone = editContact.phone.startsWith('tel:') ? editContact.phone : `tel:${editContact.phone}`

    const updatedContact = { ...selectedContact, ...editContact, initials, phone }

    try {
      await updateEmergencyContacts(updatedContact)
      setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c))
      setIsEditing(false)
      setShowDetailModal(false)
      setSelectedContact(null)
    } catch (error) {
      console.error('Failed to update contact:', error)
    }
  }

  const deleteContact = async (id) => {
    if (!residentData?.id && !residentData?._id) return
    const updatedContacts = contacts.filter(c => c.id !== id)
    
    try {
      await updateEmergencyContacts(updatedContacts)
      setContacts(updatedContacts)
      setShowDetailModal(false)
      setSelectedContact(null)
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  const openContactDetails = (contact) => {
    setSelectedContact(contact)
    setEditContact({ 
      name: contact.name, 
      phone: (contact.phone || '').replace('tel:', ''), 
      relation: contact.relation 
    })
    setIsEditing(false)
    setShowDetailModal(true)
  }

  const handleReportSubmit = async () => {
    if (!reportData.description) return

    setIsSubmittingReport(true)
    try {
      const alert = {
        description: reportData.description,
        type: reportData.category,
        status: 'Pending',
        residentID: residentData?._id || residentData?.id,
        estateID: residentData?.estateID || 'EST-001'
      }
      
      const res = await sendEmergencyAlert(alert)

      if(res.ok){
         setIsSubmittingReport(false)
         setShowReportModal(false)
         setReportData({ category: 'Security', subject: '', description: '' })
         toast.success('Incident report submitted to Security Command.')
         router.refresh()
      }else{
         toast.error(res.message)
         setIsSubmittingReport(false)
      }
   } catch (error) {
      console.error('Failed to submit report:', error)
      setIsSubmittingReport(false)
      toast.error('Failed to send report. Please call security directly.')
    }
  }

  return (
    <div className="animate-in fade-in duration-700">
       <div className="flex items-center gap-2 text-[10px] uppercase font-semibold tracking-widest text-slate-400 mb-4">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <ChevronRight className="size-3" />
            <span className="text-[#1241a1]">Emergency Portal</span>
          </div>

      {/* ── Header ── */}
      <PageHeader 
        title="Emergency Support" 
        description="Immediate assistance for safety, medical, and maintenance needs. Quick access to professional services and your trusted personal circle."
        icon={ShieldAlert}
        iconColor="red"
      >
        <div 
          onClick={() => {
            setShowReportModal(true);
          }}
          className="shrink-0 relative group cursor-pointer z-50 pointer-events-auto"
        >
          <div className="relative bg-red-600 hover:brightness-110 text-white font-semibold text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-md transition-all active:scale-95 flex items-center gap-3 border-none">
            <div className="size-3 bg-white rounded-full animate-ping"></div>
            Panic SOS Report
          </div>
        </div>
      </PageHeader>

      <div className="pb-16 max-w-6xl space-y-14">

        {/* ── Estate Emergency Services ── */}
        <section>
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <ShieldAlert className="size-6 text-[#1241a1]" />
            Estate Emergency Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ESTATE_SERVICES.map(service => (
              <div
                key={service.id}
                className="bg-slate-100 dark:bg-slate-800/30 rounded-md overflow-hidden flex flex-col transition-all"
              >
                {/* Icon Container */}
                <div className={`h-48 relative group overflow-hidden flex items-center justify-center bg-white dark:bg-slate-900 ${service.color.split(' ')[0]}`}>
                  <service.icon className={`size-20 transition-transform duration-500 group-hover:scale-110 ${service.color.split(' ')[0]}`} />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className={`px-3 py-1 text-[10px] font-semibold uppercase rounded-full ${service.badgeClass}`}>
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-lg font-semibold mb-2">{service.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 font-medium">{service.description}</p>
                  <a
                    href={service.phone}
                    className="w-full bg-[#1241a1] hover:brightness-110 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Phone className="size-5" />
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Personal Emergency Contacts ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Users className="size-6 text-[#1241a1]" />
              Personal Emergency Contacts
            </h3>
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-2 text-sm font-semibold text-[#1241a1] hover:bg-[#1241a1]/10 px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="size-5" />
              Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map((contact, index) => (
              <div
                key={contact._id || contact.id || index}
                className="bg-slate-100 dark:bg-slate-800/30 p-4 rounded-md flex items-center gap-4 transition-all group relative overflow-hidden"
              >
                {/* Avatar / Picture */}
                <div className={`size-12 rounded-md flex items-center justify-center shrink-0 text-white font-semibold text-xs overflow-hidden ${contact.color || 'bg-[#1241a1]'}`}>
                  {contact.picture ? (
                    <div 
                      className="size-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${contact.picture})` }}
                    />
                  ) : (
                    contact.initials || <User className="size-6" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="text-xs font-semibold dark:text-white truncate uppercase tracking-tight">{contact.name}</h5>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest truncate">{contact.relation}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={contact.phone} className="p-2 text-[#1241a1] hover:bg-white/50 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <Phone className="size-5" />
                  </a>
                  <button 
                    onClick={() => openContactDetails(contact)}
                    className="p-2 text-slate-400 hover:text-[#1241a1] hover:bg-white/50 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Eye className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Estate Support ── */}
        <section>
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <HelpCircle className="size-6 text-[#1241a1]" />
            Estate Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Building,
                title: 'Management Office',
                desc: 'Contact for billing inquiries, lease renewals, or non-urgent administrative assistance.',
                actions: [
                  { label: 'Open Ticket', variant: 'secondary' },
                  { label: 'Call Office', variant: 'primary' },
                ],
                phone: 'tel:+2348000000008',
              },
              {
                icon: Headset,
                title: 'Resident Help Desk',
                desc: 'Support for portal access, digital keys, and general estate amenities information.',
                actions: [
                  { label: 'Knowledge Base', variant: 'secondary' },
                  { label: 'Live Chat', variant: 'primary' },
                ],
                phone: 'tel:+2348000000009',
              },
            ].map(card => (
              <div
                key={card.title}
                className="flex items-start gap-5 p-6 bg-slate-100 dark:bg-slate-800/30 rounded-md"
              >
                <div className="p-3 bg-white dark:bg-slate-900 rounded-md text-[#1241a1] shrink-0">
                  <card.icon className="size-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">{card.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">{card.desc}</p>
                  <div className="flex gap-3">
                    {card.actions.map(action => (
                      <a key={action.label} href={card.phone}>
                        <button
                          className={`px-5 py-2.5 rounded-md text-[11px] font-semibold uppercase tracking-widest transition-all active:scale-95 border-none ${
                            action.variant === 'primary'
                              ? 'text-white bg-[#1241a1] hover:brightness-110'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {action.label}
                        </button>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        
      </div>

      {/* ── Footer ── */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-slate-500">
          © 2024 Estate Management Portal. All emergency services are monitored for quality assurance.
        </p>
      </footer>

      {/* ── Add Contact Modal ── */}
      {showAddContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6">
              <h3 className="font-semibold text-lg">Add Emergency Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                <X className="size-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {[
                { label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text', key: 'name' },
                { label: 'Phone Number', placeholder: '+234 800 000 0000', type: 'tel', key: 'phone' },
                { label: 'Relationship', placeholder: 'e.g. Brother, Spouse, Friend', type: 'text', key: 'relation' },
              ].map(field => (
                <div key={field.label} className="space-y-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={newContact[field.key]}
                    onChange={(e) => setNewContact({ ...newContact, [field.key]: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-md px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-4">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 py-4 bg-[#1241a1] hover:brightness-110 text-white font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all active:scale-95 border-none"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact Details / Edit Modal ── */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#1241a1]">Contact Profile</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                <X className="size-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 text-center space-y-6">
              {!isEditing ? (
                <>
                  <div className={`mx-auto size-24 rounded-md flex items-center justify-center text-white font-semibold text-2xl ${selectedContact.color}`}>
                    {selectedContact.initials}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold dark:text-white uppercase tracking-tight">{selectedContact.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-1">{selectedContact.relation}</p>
                    <p className="text-sm font-semibold text-[#1241a1] mt-4 flex items-center justify-center gap-2">
                        <Phone className="size-4" />
                        {selectedContact.phone?.replace('tel:', '')}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-left space-y-4 pt-4">
                  {[
                    { label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text', key: 'name' },
                    { label: 'Phone Number', placeholder: '+234 800 000 0000', type: 'tel', key: 'phone' },
                    { label: 'Relationship', placeholder: 'e.g. Brother, Spouse, Friend', type: 'text', key: 'relation' },
                  ].map(field => (
                    <div key={field.label} className="space-y-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={editContact[field.key]}
                        onChange={(e) => setEditContact({ ...editContact, [field.key]: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-md px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 pt-0 space-y-3">
              {!isEditing ? (
                <>
                  <a href={selectedContact.phone} className="w-full">
                    <button className="w-full py-4 mb-4 bg-[#1241a1] hover:brightness-110 text-white font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-3 border-none">
                      <Phone className="size-5" />
                      Place Emergency Call
                    </button>
                  </a>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
                    >
                      Edit 
                    </button>
                    <button 
                      onClick={() => deleteContact(selectedContact.id)}
                      className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateContact}
                    className="flex-1 py-4 bg-[#1241a1] hover:brightness-110 text-white font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ── Report Incident Modal ── */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-10000 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-red-500/10 rounded-md flex items-center justify-center">
                  <ShieldAlert className="size-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-900 dark:text-white">File Incident Report</h3>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Direct link to Security Command</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReportModal(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                disabled={isSubmittingReport}
              >
                <X className="size-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none">Emergency Category</label>
                <select 
                  value={reportData.category}
                  onChange={(e) => setReportData({...reportData, category: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-md px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-red-500/20 outline-none transition-all dark:text-white appearance-none"
                >
                  <option>Security</option>
                  <option>Medical</option>
                  <option>Fire</option>
                  <option>Maintenance</option>
                  <option>Noise Complaint</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none">Detailed Description</label>
                <textarea
                  placeholder="Provide as much detail as possible..."
                  rows={4}
                  value={reportData.description}
                  onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-md px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-red-500/20 outline-none transition-all dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              <button
                onClick={() => setShowReportModal(false)}
                disabled={isSubmittingReport}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={isSubmittingReport || !reportData.description}
                className={`flex-1 py-4 bg-red-600 hover:brightness-110 text-white font-semibold text-[11px] uppercase tracking-widest rounded-md transition-all active:scale-95 flex items-center justify-center gap-2 border-none ${isSubmittingReport || !reportData.description ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmittingReport ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending Report...
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
