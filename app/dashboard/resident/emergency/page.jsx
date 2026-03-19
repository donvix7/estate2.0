'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ESTATE_SERVICES = [
  {
    id: 'security',
    name: 'Security & Patrol',
    description: 'On-site professional security team for immediate threats, suspicious activity, or unauthorized access.',
    image: '/emergency_security.png',
    badge: 'Available 24/7',
    badgeClass: 'bg-red-600 text-white',
    phone: 'tel:+2348000000001',
  },
  {
    id: 'medical',
    name: 'Medical Response',
    description: 'Certified paramedic team located at the main gatehouse. Equipped for basic life support and rapid transport.',
    image: '/emergency_medical.png',
    badge: 'Response < 5 Mins',
    badgeClass: 'bg-red-600 text-white',
    phone: 'tel:+2348000000002',
  },
  {
    id: 'fire',
    name: 'Fire & Maintenance',
    description: 'Urgent fire safety response and critical infrastructure repair — gas leaks, burst pipes, electrical hazards.',
    image: '/emergency_fire.png',
    badge: 'Critical Infrastructure',
    badgeClass: 'bg-[#1241a1] text-white',
    phone: 'tel:+2348000000003',
  },
]

const INITIAL_PERSONAL_CONTACTS = [
  { 
    id: 1,
    name: 'Marcus Wright',
    relation: 'Brother',
    initials: 'MW',
    color: 'bg-blue-500',
    phone: 'tel:+2348000000004' 
  },
  { 
    id: 2,
    name: 'Sarah Jenkins',
    relation: 'Neighbor (Unit 42B)',
    initials: 'SJ',
    color: 'bg-emerald-500',
    phone: 'tel:+2348000000005' 
  },
  { 
    id: 3,
    name: 'David Chen',
    relation: 'Spouse',
    initials: 'DC',
    color: 'bg-violet-500',
    phone: 'tel:+2348000000006' 
  },
  { 
    id: 4,
    name: 'Elena Rossi',
    relation: 'Close Friend',
    initials: 'ER',
    color: 'bg-rose-500',
    phone: 'tel:+2348000000007' 
  },
]

export default function EmergencyPage() {
  const [showAddContact, setShowAddContact] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  
  const [contacts, setContacts] = useState(INITIAL_PERSONAL_CONTACTS)
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })
  const [editContact, setEditContact] = useState({ name: '', phone: '', relation: '' })
  const [reportData, setReportData] = useState({ category: 'Security', subject: '', description: '' })

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return
    
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

    setContacts([...contacts, contact])
    setNewContact({ name: '', phone: '', relation: '' })
    setShowAddContact(false)
  }

  const handleUpdateContact = () => {
    if (!editContact.name || !editContact.phone) return

    const initials = editContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const phone = editContact.phone.startsWith('tel:') ? editContact.phone : `tel:${editContact.phone}`

    setContacts(contacts.map(c => 
      c.id === selectedContact.id 
        ? { ...selectedContact, ...editContact, initials, phone } 
        : c
    ))
    
    setIsEditing(false)
    setShowDetailModal(false)
    setSelectedContact(null)
  }

  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id))
    setShowDetailModal(false)
    setSelectedContact(null)
  }

  const openContactDetails = (contact) => {
    setSelectedContact(contact)
    setEditContact({ 
      name: contact.name, 
      phone: contact.phone.replace('tel:', ''), 
      relation: contact.relation 
    })
    setIsEditing(false)
    setShowDetailModal(true)
  }

  const handleReportSubmit = () => {
    if (!reportData.subject || !reportData.description) {
      return
    }

    setIsSubmittingReport(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingReport(false)
      setShowReportModal(false)
      setReportData({ category: 'Security', subject: '', description: '' })
      // We assume toast is available via parent/layout or standard import if added
      // Since it's a client component page, we should ensure toast is imported
    }, 1500)
  }

  return (
    <div className="animate-in fade-in duration-700">

      {/* ── Header ── */}
      <header className="py-6 lg:py-10">
        <div className="max-w-6xl">
          <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-[#1241a1]">Emergency Portal</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Emergency Support</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-base font-bold max-w-2xl leading-relaxed">
            Immediate assistance for safety, medical, and maintenance needs. Quick access to professional services and your trusted personal circle.
          </p>
        </div>
      </header>

      <div className="pb-16 max-w-6xl space-y-14">

        {/* ── Estate Emergency Services ── */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1241a1]">security</span>
            Estate Emergency Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ESTATE_SERVICES.map(service => (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="h-48 relative group overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${service.badgeClass}`}>
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold mb-2">{service.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">{service.description}</p>
                  <a
                    href={service.phone}
                    className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
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
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1241a1]">groups</span>
              Personal Emergency Contacts
            </h3>
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-2 text-sm font-bold text-[#1241a1] hover:bg-[#1241a1]/10 px-4 py-2 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Avatar */}
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-xs border-2 border-white/20 shadow-lg ${contact.color}`}>
                  {contact.initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="text-xs font-black dark:text-white truncate uppercase tracking-tight">{contact.name}</h5>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{contact.relation}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={contact.phone} className="p-2 text-[#1241a1] hover:bg-[#1241a1]/10 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-xl">call</span>
                  </a>
                  <button 
                    onClick={() => openContactDetails(contact)}
                    className="p-2 text-slate-400 hover:text-[#1241a1] hover:bg-[#1241a1]/10 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add New placeholder */}
            <button
              onClick={() => setShowAddContact(true)}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl flex items-center gap-4 hover:bg-[#1241a1]/5 transition-all group"
            >
              <div className="size-12 rounded-full flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 group-hover:bg-[#1241a1]/10 transition-colors">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1241a1] transition-colors">person_add</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#1241a1] transition-colors">Add Contact</p>
            </button>
          </div>
        </section>

        {/* ── Estate Support ── */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1241a1]">support_agent</span>
            Estate Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: 'corporate_fare',
                title: 'Management Office',
                desc: 'Contact for billing inquiries, lease renewals, or non-urgent administrative assistance.',
                actions: [
                  { label: 'Open Ticket', variant: 'secondary' },
                  { label: 'Call Office', variant: 'primary' },
                ],
                phone: 'tel:+2348000000008',
              },
              {
                icon: 'help_center',
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
                className="flex items-start gap-5 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm"
              >
                <div className="p-3 bg-[#1241a1]/10 rounded-xl text-[#1241a1] shrink-0">
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">{card.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{card.desc}</p>
                  <div className="flex gap-3">
                    {card.actions.map(action => (
                      <a key={action.label} href={card.phone}>
                        <button
                          className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                            action.variant === 'primary'
                              ? 'text-white bg-[#1241a1] shadow-lg shadow-[#1241a1]/20 hover:brightness-110'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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

        {/* ── Report Incident Banner ── */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-red-600/20">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">emergency</span>
            </div>
            <div>
              <h4 className="text-white font-black text-lg">Report an Incident</h4>
              <p className="text-red-200 text-sm font-bold mt-0.5 leading-none">Immediately alert estate management and security team.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="shrink-0 bg-white text-red-600 font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-white/90 transition-all shadow-xl active:scale-95"
          >
            Report Now
          </button>
        </div>
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
              <h3 className="font-bold text-lg">Add Emergency Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {[
                { label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text', key: 'name' },
                { label: 'Phone Number', placeholder: '+234 800 000 0000', type: 'tel', key: 'phone' },
                { label: 'Relationship', placeholder: 'e.g. Brother, Spouse, Friend', type: 'text', key: 'relation' },
              ].map(field => (
                <div key={field.label} className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={newContact[field.key]}
                    onChange={(e) => setNewContact({ ...newContact, [field.key]: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#1241a1] outline-none transition-all dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-4">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 py-4 bg-[#1241a1] hover:brightness-110 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95"
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
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1241a1]">Contact Profile</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            <div className="p-8 text-center space-y-6">
              {!isEditing ? (
                <>
                  <div className={`mx-auto size-24 rounded-4xl flex items-center justify-center text-white font-black text-2xl border-4 border-white dark:border-slate-900 shadow-2xl ${selectedContact.color}`}>
                    {selectedContact.initials}
                  </div>
                  <div>
                    <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">{selectedContact.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{selectedContact.relation}</p>
                    <p className="text-sm font-bold text-[#1241a1] mt-4 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">call</span>
                        {selectedContact.phone.replace('tel:', '')}
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
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={editContact[field.key]}
                        onChange={(e) => setEditContact({ ...editContact, [field.key]: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#1241a1] outline-none transition-all dark:text-white"
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
                    <button className="w-full py-4 mb-4 bg-[#1241a1] hover:brightness-110 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#1241a1]/20 flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined text-lg">call</span>
                      Place Emergency Call
                    </button>
                  </a>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Edit 
                    </button>
                    <button 
                      onClick={() => deleteContact(selectedContact.id)}
                      className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateContact}
                    className="flex-1 py-4 bg-[#1241a1] hover:brightness-110 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">emergency_home</span>
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">File Incident Report</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Direct link to Security Command</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReportModal(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                disabled={isSubmittingReport}
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Emergency Category</label>
                <select 
                  value={reportData.category}
                  onChange={(e) => setReportData({...reportData, category: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white appearance-none"
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
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of the incident..."
                  value={reportData.subject}
                  onChange={(e) => setReportData({...reportData, subject: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Detailed Description</label>
                <textarea
                  placeholder="Provide as much detail as possible..."
                  rows={4}
                  value={reportData.description}
                  onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              <button
                onClick={() => setShowReportModal(false)}
                disabled={isSubmittingReport}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={isSubmittingReport || !reportData.subject || !reportData.description}
                className={`flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 flex items-center justify-center gap-2 ${isSubmittingReport || !reportData.subject || !reportData.description ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmittingReport ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Sending Report...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
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
