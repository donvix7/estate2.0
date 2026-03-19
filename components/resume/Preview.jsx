'use client'

import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export default function ResumePreview({ data, template }) {
  const { personal, experience, education, skills } = data

  const templates = {
    modern: (
      <div className="h-full bg-white p-8 font-sans flex flex-col">
        {/* Header */}
        <header className="border-b-4 border-[#1241a1] pb-6 mb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{personal.fullName || 'Your Name'}</h1>
          <p className="text-xl font-bold text-[#1241a1] mt-1">{personal.jobTitle || 'Your Profession'}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="size-3" />
                {personal.email}
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="size-3" />
                {personal.phone}
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3" />
                {personal.location}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          {/* Summary */}
          {personal.summary && (
            <section>
              <h2 className="text-xs font-black text-[#1241a1] uppercase tracking-[0.2em] mb-3">Professional Profile</h2>
              <p className="text-sm leading-relaxed text-slate-700">{personal.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-[#1241a1] uppercase tracking-[0.2em] mb-4">Work Experience</h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-black text-slate-900">{exp.company}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 mb-2 italic">{exp.role}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-[#1241a1] uppercase tracking-[0.2em] mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-black text-slate-900">{edu.school}</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-600 italic">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-[#1241a1] uppercase tracking-[0.2em] mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-[#1241a1] text-[10px] font-bold rounded uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {!personal.fullName && !personal.summary && experience.length === 0 && education.length === 0 && skills.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
               <div className="size-20 border-4 border-dashed border-slate-200 rounded-2xl" />
               <p className="font-bold text-sm">Start typing to see the magic happen!</p>
            </div>
          )}
        </div>
      </div>
    ),
    classic: (
        <div className="h-full bg-white p-12 font-serif">
            <div className="text-center border-b border-slate-900 pb-8 mb-8">
                <h1 className="text-3xl font-black">{personal.fullName || 'Your Name'}</h1>
                <div className="flex justify-center flex-wrap gap-4 mt-2 text-xs">
                    <span>{personal.email}</span>
                    <span>{personal.phone}</span>
                </div>
            </div>
            <div className="space-y-8">
                 {experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-widest">Experience</h2>
                        <div className="space-y-6">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{exp.company}</span>
                                        <span>{exp.duration}</span>
                                    </div>
                                    <p className="text-xs italic mb-2">{exp.role}</p>
                                    <p className="text-xs leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                 )}
                 {education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-widest">Education</h2>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id} className="text-xs">
                                    <p className="font-bold">{edu.school}</p>
                                    <p>{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                 )}
                 {skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-widest">Skills</h2>
                        <p className="text-xs leading-relaxed">{skills.join(' • ')}</p>
                    </section>
                 )}
            </div>
        </div>
    ),
    minimal: (
      <div className="h-full bg-white p-10 font-sans flex flex-col">
        <header className="mb-10">
          <h1 className="text-2xl font-light text-slate-900 tracking-tight">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm text-slate-400 mt-1">{personal.jobTitle || 'Your Profession'}</p>
          <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
             <span>{personal.email}</span>
             <span>{personal.phone}</span>
          </div>
        </header>

        <div className="flex-1 space-y-10">
          {experience.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Experience</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="grid grid-cols-4 gap-4">
                    <span className="text-[10px] text-slate-400 font-medium">{exp.duration}</span>
                    <div className="col-span-3">
                      <h3 className="text-sm font-bold text-slate-900">{exp.company}</h3>
                      <p className="text-xs text-slate-500 mb-2">{exp.role}</p>
                      <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Education</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="grid grid-cols-4 gap-4">
                    <span className="text-[10px] text-slate-400 font-medium">{edu.duration}</span>
                    <div className="col-span-3">
                      <h3 className="text-sm font-bold text-slate-900">{edu.school}</h3>
                      <p className="text-xs text-slate-500">{edu.degree}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {templates[template] || templates.modern}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
