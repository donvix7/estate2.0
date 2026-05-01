'use client';
import { 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Home, 
  Briefcase, 
  Calendar, 
  Hash, 
  Clock, 
  User, 
  MapPin, 
  Stethoscope, 
  MoreHorizontal,
  X,
  Check
} from 'lucide-react';
import React, { useState } from 'react';

export default function ProfileDetails({
  selectedProfile,
  isEditing,
  setIsEditing,
  formData,
  handleInputChange,
  handleUpdateProfile,
  handleDeleteProfile,
  setShowAddModal,
  getStatusColor,
  getProfileTypeLabel,
  formatDate
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2">
      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
        <Icon className="w-4 h-4" />
      </div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</h4>
    </div>
  );

  const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => (
    <div className={`p-4 bg-white dark:bg-gray-800/40 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{label}</p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedProfile ? (
        <div className="space-y-6 sticky top-24">
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Banner Area */}
            <div className="h-24 bg-linear-to-r from-blue-600 to-indigo-700 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-2xl">
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-4xl shadow-inner">
                    {selectedProfile.profileImage || '👤'}
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2.5 rounded-xl flex gap-2 backdrop-blur-md transition-all duration-200 ${
                    isEditing 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isEditing ? 'Cancel Editing' : 'Edit Profile'}
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2.5 bg-white/10 flex gap-2 backdrop-blur-md text-white rounded-xl hover:bg-red-500 transition-all duration-200"
                  title="Delete User"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Profile Intro Info */}
            <div className="pt-16 px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedProfile.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(selectedProfile.status)}`}>
                      {selectedProfile.status}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest">
                      {getProfileTypeLabel(selectedProfile.type)}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global ID</p>
                  <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{selectedProfile.id}</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-8 pb-8">
              {isEditing ? (
                // --- Premium Edit Form ---
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-3xl space-y-8">
                    {/* Section: Personal Information */}
                    <div className="space-y-6">
                      <SectionHeader icon={User} title="Personal Information" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Full Legal Name</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                              placeholder="Enter full name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                              placeholder="example@domain.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Primary Phone</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Account Visibility</label>
                          <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md appearance-none relative"
                            >
                              <option value="active">Active System Profile</option>
                              <option value="inactive">Suspended / Inactive</option>
                              <option value="pending">Awaiting Verification</option>
                            </select>
                            <MoreHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Specialized Details */}
                    <div className="space-y-6">
                      <SectionHeader 
                        icon={selectedProfile.type === 'resident' ? Home : ShieldCheck} 
                        title={selectedProfile.type === 'resident' ? 'Residential Perspective' : 'Operational Perspective'} 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedProfile.type === 'resident' ? (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Assigned Unit</label>
                              <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                  type="text"
                                  name="unitNumber"
                                  value={formData.unitNumber || formData.unit}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                                  placeholder="e.g. Block C, Unit 402"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Occupation</label>
                              <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                  type="text"
                                  name="occupation"
                                  value={formData.occupation}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                                  placeholder="Current Profession"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Emergency Contact Information</label>
                              <div className="relative group">
                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                  type="text"
                                  name="emergencyContact"
                                  value={formData.emergencyContact}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                                  placeholder="Name, Relationship & Phone"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                                {selectedProfile.type === 'staff' ? 'Designated Role' : 'Security Badge ID'}
                              </label>
                              <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                  type="text"
                                  name={selectedProfile.type === 'staff' ? 'role' : 'badgeNumber'}
                                  value={selectedProfile.type === 'staff' ? formData.role : formData.badgeNumber}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                                {selectedProfile.type === 'staff' ? 'Department' : 'Current Shift'}
                              </label>
                              <div className="relative group">
                                {selectedProfile.type === 'staff' ? (
                                  <>
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                      type="text"
                                      name="department"
                                      value={formData.department}
                                      onChange={handleInputChange}
                                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                                    <select
                                      name="shift"
                                      value={formData.shift}
                                      onChange={handleInputChange}
                                      className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm focus:shadow-md appearance-none relative"
                                    >
                                      <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                                      <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                                      <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
                                    </select>
                                    <MoreHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-3xl hover:bg-slate-200 dark:hover:bg-slate-700 font-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Discard Changes
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-2 px-8 py-5 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 font-black shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                      <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Finalize & Commit Updates
                    </button>
                  </div>
                </div>
              ) : (
                // --- View Details ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500 delay-200">
                  {/* Left Column: Contact & Base Info */}
                  <div className="space-y-6">
                    <SectionHeader icon={User} title="Contact Information" />
                    <div className="grid grid-cols-1 gap-4">
                      <DetailItem icon={Mail} label="Primary Email" value={selectedProfile.email} fullWidth />
                      <DetailItem icon={Phone} label="Mobile Number" value={selectedProfile.phone} />
                      <DetailItem icon={MapPin} label="Office/Location" value={selectedProfile.type === 'resident' ? selectedProfile.unitNumber : 'Internal Facility'} />
                    </div>
                  </div>

                  {/* Right Column: Role Specific Details */}
                  <div className="space-y-6">
                     <SectionHeader icon={ShieldCheck} title={selectedProfile.type === 'resident' ? 'Residential Status' : 'Employment Details'} />
                     <div className="grid grid-cols-1 gap-4">
                        {selectedProfile.type === 'resident' ? (
                          <>
                            <DetailItem icon={Briefcase} label="Professional Status" value={selectedProfile.occupation} />
                            <DetailItem icon={Calendar} label="Resident Since" value={formatDate(selectedProfile.residentSince || selectedProfile.joinDate)} />
                            <DetailItem icon={Stethoscope} label="Emergency Contact" value={selectedProfile.emergencyContact} fullWidth />
                          </>
                        ) : (
                          <>
                            <DetailItem icon={Briefcase} label={selectedProfile.type === 'staff' ? 'Staff Role' : 'Badge ID'} value={selectedProfile.type === 'staff' ? selectedProfile.role : selectedProfile.badgeNumber} />
                            <DetailItem icon={Clock} label={selectedProfile.type === 'staff' ? 'Department' : 'Work Shift'} value={selectedProfile.type === 'staff' ? selectedProfile.department : selectedProfile.shift} />
                            <DetailItem icon={Hash} label={selectedProfile.type === 'staff' ? 'Pay Scale' : 'Security Clearance'} value={selectedProfile.salary || selectedProfile.experience || 'Lvl 1'} fullWidth />
                          </>
                        )}
                     </div>
                  </div>

                  {/* Bottom Stats / Footer Area */}
                  <div className="md:col-span-2 pt-6">
                    <div className="p-4 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60 dark:text-blue-400/60">Privilege Level</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{selectedProfile.type} Management Access Enabled</p>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-12 text-center sticky top-24 animate-pulse">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <User className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Unselected Perspective</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8 font-medium">Select a profile from the directory to initialize administrative management controls.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            Create New Identity
          </button>
        </div>
      )}

      {/* Modernized Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 mx-auto shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">Purge Identity</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">Are you certain you wish to permanently remove <span className="text-slate-900 dark:text-white font-bold">{selectedProfile?.name}</span>? This action is irreversible.</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteProfile();
                }}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 font-black shadow-lg shadow-rose-500/30 transition-all"
              >
                Confirm Deletion
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-all"
              >
                Keep Identity
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
