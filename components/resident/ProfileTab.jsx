import React from 'react'
import { User, CheckCircle } from 'lucide-react'

export default function ProfileTab({ 
  residentData, 
  isEditing, 
  handleEditProfile, 
  handleCancelEdit, 
  saveStatus, 
  handleSaveProfile, 
  editForm, 
  handleInputChange, 
  getUnitNumber 
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] overflow-hidden">
         <div className="px-8 py-8 flex flex-col md:flex-row items-center gap-6">
             <div className="w-20 h-20 bg-slate-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                 <User className="w-10 h-10" />
             </div>
             <div className="text-center md:text-left flex-1">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">{residentData?.name}</h2>
                 <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                     <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                     Active Resident
                 </p>
             </div>
              {!isEditing ? (
                 <button
                   onClick={handleEditProfile}
                   className="px-4 py-2 bg-slate-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                 >
                   Edit Profile
                 </button>
               ) : (
                 <div className="flex gap-2">
                     <button
                         onClick={handleCancelEdit}
                         className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                     >
                         Cancel
                     </button>
                      <button
                         onClick={handleSaveProfile}
                         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                     >
                         {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                     </button>
                 </div>
               )}
         </div>

          <div className="p-8">
              {saveStatus === 'success' && (
                 <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Profile updated successfully.
                 </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    {isEditing ? (
                       <input 
                          name="email" 
                          value={editForm.email || ''} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                       />
                    ) : (
                       <div className="text-gray-900 dark:text-gray-200 font-medium px-1">{residentData?.email}</div>
                    )}
                 </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    {isEditing ? (
                       <input 
                          name="phone" 
                          value={editForm.phone || ''} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                       />
                    ) : (
                       <div className="text-gray-900 dark:text-gray-200 font-medium px-1">{residentData?.phone}</div>
                    )}
                 </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Building / Unit</label>
                    <div className="text-gray-900 dark:text-gray-200 font-medium px-1">{getUnitNumber()} &bull; {residentData?.building || 'Tower A'}</div>
                 </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Number</label>
                    {isEditing ? (
                       <input 
                          name="vehicleNumber" 
                          value={editForm.vehicleNumber || ''} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                       />
                    ) : (
                       <div className="text-gray-900 dark:text-gray-200 font-medium px-1">{residentData?.vehicleNumber || 'N/A'}</div>
                    )}
                 </div>
              </div>
         </div>
      </div>
    </div>
  )
}
