import React, { useState } from 'react';
import { Hash, Lock, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateChannelModal = ({ isOpen, onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0f13]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#1a1d23]  border-gray-700 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-400 border-gray-400">
          <h3 className="text-xl font-bold text-white text-white flex items-center gap-2">
            Create a Channel
          </h3>
          <button
            onClick={onClose}
            className="text-[#8a8f98] hover:text-white hover:text-white p-2 hover:bg-[#2a2d33] hover:bg-[#2a2d33] rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-[#8a8f98] text-[#8a8f98] mb-4">
            Channels are where your team communicates. they&apos;re best when organized around a topic — #events, for example.
          </p>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800 text-white">Name</label>
            <div className="relative">
               <Hash className="absolute left-3 top-3.5 w-4 h-4 text-[#8a8f98]" />
               <input
                 type="text"
                 value={channelName}
                 onChange={(e) => setChannelName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                 className="w-full p-3 pl-9 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
                 placeholder="e.g. plan-budget"
               />
            </div>
            {channelName && (
               <p className="text-xs text-green-600 text-green-400 mt-2 font-medium">Available</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 text-white">
              Description <span className="text-[#8a8f98] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 border-[#2a2d33] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-white bg-transparent bg-[#1a1d23]/50"
              placeholder="What&apos;s this channel about?"
            />
          </div>
          
          <div className="pt-4 border-t border-[#2a2d33] border-gray-700">
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-medium text-white text-white flex items-center gap-1.5">
                      {isPrivate ? <Lock className="w-4 h-4 text-amber-500" /> : <Users className="w-4 h-4 text-blue-500" />}
                      Make private
                   </p>
                   <p className="text-xs text-[#8a8f98] text-[#8a8f98] mt-1">
                      {isPrivate ? 'Only specified members can view and join' : 'Anyone in your workspace can view and join'}
                   </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                  <div className="w-11 h-6 bg-[#2a2d33] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#2a2d33] after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-[#2a2d33] peer-checked:bg-blue-600"></div>
                </label>
             </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#2a2d33] border-gray-700 flex justify-end gap-3 bg-[#1a1d23] rounded-b-xl">
           <button
             onClick={onClose}
             className="px-5 py-2.5 bg-[#1a1d23] hover:bg-[#2a2d33] hover:bg-[#2a2d33] text-[#8a8f98] text-white rounded-lg font-medium transition-colors"
           >
             Cancel
           </button>
           <button
             disabled={!channelName}
             onClick={() => {
                toast.success(`Channel #${channelName} created successfully!`);
                onClose();
             }}
             className="px-5 py-2.5 bg-[#1241a1] hover:brightness-110 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
           >
             Create Channel
           </button>
        </div>
        
      </div>
    </div>
  );
};

export default CreateChannelModal;
