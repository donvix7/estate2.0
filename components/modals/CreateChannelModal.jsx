import React, { useState } from 'react';
import { Hash, Lock, Users } from 'lucide-react';

const CreateChannelModal = ({ isOpen, onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800  dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-400 dark:border-gray-400">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Create a Channel
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Channels are where your team communicates. They're best when organized around a topic — #events, for example.
          </p>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Name</label>
            <div className="relative">
               <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
               <input
                 type="text"
                 value={channelName}
                 onChange={(e) => setChannelName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                 className="w-full p-3 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
                 placeholder="e.g. plan-budget"
               />
            </div>
            {channelName && (
               <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">Available</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-transparent dark:bg-gray-800/50"
              placeholder="What's this channel about?"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                      {isPrivate ? <Lock className="w-4 h-4 text-amber-500" /> : <Users className="w-4 h-4 text-blue-500" />}
                      Make private
                   </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {isPrivate ? 'Only specified members can view and join' : 'Anyone in your workspace can view and join'}
                   </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
             </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
           <button
             onClick={onClose}
             className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
           >
             Cancel
           </button>
           <button
             disabled={!channelName}
             onClick={() => {
                alert(`Mock: Created #${channelName}`);
                onClose();
             }}
             className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             Create Channel
           </button>
        </div>
        
      </div>
    </div>
  );
};

export default CreateChannelModal;
