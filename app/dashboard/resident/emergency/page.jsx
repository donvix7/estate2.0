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

const PERSONAL_CONTACTS = [
  { name: 'Marcus Wright', relation: 'Brother', initials: 'MW', color: 'bg-blue-500' },
  { name: 'Sarah Jenkins', relation: 'Neighbor (Unit 42B)', initials: 'SJ', color: 'bg-emerald-500' },
  { name: 'David Chen', relation: 'Spouse', initials: 'DC', color: 'bg-violet-500' },
  { name: 'Elena Rossi', relation: 'Close Friend', initials: 'ER', color: 'bg-rose-500' },
]

export default function EmergencyPage() {
  const [showAddContact, setShowAddContact] = useState(false)

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111621]">

      {/* ── Header ── */}
      <header className="px-6 lg:px-10 py-10 bg-gradient-to-b from-[#1241a1]/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#1241a1] font-semibold">Emergency Contacts</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Emergency Contacts</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Immediate assistance for safety, medical, and maintenance needs. Quick access to professional services and your trusted personal circle.
          </p>
        </div>
      </header>

      <div className="px-6 lg:px-10 pb-16 max-w-6xl mx-auto space-y-14">

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
            {PERSONAL_CONTACTS.map((contact, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm border-2 border-white/20 ${contact.color}`}>
                  {contact.initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="text-sm font-bold truncate">{contact.name}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{contact.relation}</p>
                </div>
                <button className="p-2 text-[#1241a1] hover:bg-[#1241a1]/10 rounded-full transition-colors">
                  <span className="material-symbols-outlined">call</span>
                </button>
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
              },
              {
                icon: 'help_center',
                title: 'Resident Help Desk',
                desc: 'Support for portal access, digital keys, and general estate amenities information.',
                actions: [
                  { label: 'Knowledge Base', variant: 'secondary' },
                  { label: 'Live Chat', variant: 'primary' },
                ],
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
                      <button
                        key={action.label}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          action.variant === 'primary'
                            ? 'text-[#1241a1] hover:bg-[#1241a1]/10'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {action.label}
                      </button>
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
              <p className="text-red-200 text-sm">Immediately alert estate management and security team.</p>
            </div>
          </div>
          <button className="shrink-0 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow">
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
            <div className="p-6 space-y-4">
              {[
                { label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text' },
                { label: 'Phone Number', placeholder: '+234 800 000 0000', type: 'tel' },
                { label: 'Relationship', placeholder: 'e.g. Brother, Spouse, Friend', type: 'text' },
              ].map(field => (
                <div key={field.label} className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 py-3 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold text-sm rounded-xl transition-colors"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
