'use client'

import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function ResumeForm({ data, setData }) {
  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: false,
    education: false,
    skills: false
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updatePersonal = (field, value) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }))
  }

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }]
    }))
  }

  const updateExperience = (id, field, value) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }

  const removeExperience = (id) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), school: '', degree: '', duration: '', description: '' }]
    }))
  }

  const updateEducation = (id, field, value) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }))
  }

  const removeEducation = (id) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const updateSkills = (value) => {
    setData(prev => ({
      ...prev,
      skills: value.split(',').map(s => s.trim()).filter(s => s !== '')
    }))
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <section className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        <button 
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        >
          <span className="font-black text-lg">Personal Details</span>
          {openSections.personal ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        {openSections.personal && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <input 
                type="text" 
                value={data.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Title</label>
              <input 
                type="text" 
                value={data.personal.jobTitle}
                onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <input 
                type="email" 
                value={data.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
              <input 
                type="text" 
                value={data.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                placeholder="+234 123 456 7890"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Professional Summary</label>
              <textarea 
                value={data.personal.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all resize-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        <button 
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        >
          <span className="font-black text-lg">Work Experience</span>
          {openSections.experience ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        {openSections.experience && (
          <div className="p-5 space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative p-4 border border-slate-100 dark:border-slate-700 rounded-xl space-y-4 bg-white dark:bg-slate-800">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Google"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Role</label>
                    <input 
                      type="text" 
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      placeholder="Senior Developer"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                    <textarea 
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your achievements..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addExperience}
              className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 font-bold hover:border-[#1241a1] hover:text-[#1241a1] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="size-4" />
              Add Experience
            </button>
          </div>
        )}
      </section>

      {/* Add more sections like Education, Skills similarly */}
      {/* Education */}
      <section className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        <button 
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        >
          <span className="font-black text-lg">Education</span>
          {openSections.education ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        {openSections.education && (
          <div className="p-5 space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative p-4 border border-slate-100 dark:border-slate-700 rounded-xl space-y-4 bg-white dark:bg-slate-800">
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">School / University</label>
                    <input 
                      type="text" 
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="University of Lagos"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Degree</label>
                    <input 
                      type="text" 
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="B.Sc Computer Science"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addEducation}
              className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 font-bold hover:border-[#1241a1] hover:text-[#1241a1] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="size-4" />
              Add Education
            </button>
          </div>
        )}
      </section>

      {/* Skills */}
      <section className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        <button 
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        >
          <span className="font-black text-lg">Skills</span>
          {openSections.skills ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        {openSections.skills && (
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Skills (Comma separated)</label>
              <textarea 
                value={data.skills.join(', ')}
                onChange={(e) => updateSkills(e.target.value)}
                placeholder="React, Next.js, Tailwind CSS, Node.js..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 focus:border-[#1241a1] transition-all resize-none font-medium"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-[#1241a1]/10 text-[#1241a1] text-xs font-bold rounded-lg uppercase tracking-wider">
                   {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-800 text-sm font-medium">
        <p>Tip: Focus on relevant skills for the job you want!</p>
      </div>
    </div>
  )
}
