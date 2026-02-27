'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, 
    MessageSquare, 
    Hash, 
    Users, 
    MoreVertical, 
    Paperclip, 
    Smile, 
    Send,
    Plus,
    Bell,
    ArrowLeft
} from 'lucide-react';
import CreateChannelModal from '@/components/modals/CreateChannelModal';

// Shared Mock Data for the Chat Component
const MOCK_CHANNELS = [
  { id: 1, name: 'general', type: 'channel', unread: 0 },
  { id: 2, name: 'security-alerts', type: 'channel', unread: 3 },
  { id: 3, name: 'staff-updates', type: 'channel', unread: 0 },
  { id: 4, name: 'maintenance', type: 'channel', unread: 1 },
];

const MOCK_DMS = [
  { id: 101, name: 'System Admin', type: 'dm', online: true, unread: 0 },
  { id: 102, name: 'Sarah Smith (Staff)', type: 'dm', online: true, unread: 2 },
  { id: 103, name: 'Mike Johnson (Sec)', type: 'dm', online: false, unread: 0 },
];

// Organize messages by channel/DM ID
const INITIAL_MESSAGES = {
  1: [
    { id: 1001, sender: 'System Admin', avatar: 'SA', text: 'Welcome to the general community chat portal!', timestamp: '09:00 AM', isMe: false },
    { id: 1002, sender: 'John Doe (A-101)', avatar: 'JD', text: 'Looks great! Is this live for all residents?', timestamp: '09:15 AM', isMe: false },
    { id: 1003, sender: 'System Admin', avatar: 'SA', text: 'Yes, we are rolling it out today.', timestamp: '09:16 AM', isMe: false },
  ],
  2: [
    { id: 2001, sender: 'Mike Johnson (Sec)', avatar: 'MJ', text: 'All units, please ensure perimeter doors are locked at 10 PM.', timestamp: '08:00 PM', isMe: false },
  ],
  3: [
    { id: 3001, sender: 'Sarah Smith (Staff)', avatar: 'SS', text: 'Maintenance schedule for next week is uploaded.', timestamp: '10:00 AM', isMe: false },
  ],
  4: [
    { id: 4001, sender: 'System Admin', avatar: 'SA', text: 'Elevator 2 in Block B is currently under maintenance.', timestamp: '11:00 AM', isMe: false },
  ],
  101: [
    { id: 5001, sender: 'System Admin', avatar: 'SA', text: 'Hello, how can I help you today?', timestamp: '09:00 AM', isMe: false },
  ],
  102: [
    { id: 6001, sender: 'Sarah Smith (Staff)', avatar: 'SS', text: 'Did you need assistance with the portal?', timestamp: '09:30 AM', isMe: false },
  ],
  103: [
    { id: 7001, sender: 'Mike Johnson (Sec)', avatar: 'MJ', text: 'Your guest pass has been approved.', timestamp: '02:00 PM', isMe: false },
  ],
};

export default function CommunityChat({ 
  currentUserRole = 'resident', 
  currentUserName = 'Resident User', 
  currentUserAvatar = 'RU' 
}) {
  const [activeChat, setActiveChat] = useState(MOCK_CHANNELS[0]);
  const [messageText, setMessageText] = useState('');
  
  // Mobile flow state: are we looking at the chat thread?
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // Messages are stored in a dictionary to prevent them from bleeding into other chats
  const [messagesDict, setMessagesDict] = useState(INITIAL_MESSAGES);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll whenever active chat changes or messages change
  useEffect(() => {
    scrollToBottom();
  }, [messagesDict, activeChat]);

  const activeMessages = messagesDict[activeChat.id] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUserName,
      avatar: currentUserAvatar,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true, // Mark it as sent by current user
    };

    setMessagesDict(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    setMessageText('');
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileChatOpen(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-gray-50 dark:bg-gray-900 animate-fadeIn overflow-hidden">
      {/* Sidebar - Channels & DMs */}
      <div className={`w-full lg:w-80 bg-white dark:bg-gray-800 flex-col h-full shrink-0 relative overflow-hidden ${isMobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center z-10 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Community Chat
          </h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Search */}
        <div className="p-4 shrink-0">
          <div className="relative  bg-gray-200 dark:bg-gray-800 rounded-lg text-center">
            <input 
              type="text" 
              placeholder="Search channels..." 
              className="w-full bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <Search className="w-5 h-5 font-bold text-gray-400 absolute right-3 top-0" />
          </div>
        </div>

        {/* Sidebar Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
          
          {/* Channels List */}
          <div>
            <div className="px-2 mb-2 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Channels</span>
            </div>
            <div className="space-y-1">
              {MOCK_CHANNELS.map((channel) => (
                <button
                  key={`channel-${channel.id}`}
                  onClick={() => selectChat(channel)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    activeChat.id === channel.id && activeChat.type === 'channel'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 font-semibold shadow-sm '
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm '
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                       activeChat.id === channel.id && activeChat.type === 'channel' 
                         ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                         : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                       <Hash className="w-4 h-4" />
                    </div>
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DMs List */}
          <div>
             <div className="px-2 mb-2 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Direct Messages</span>
            </div>
            <div className="space-y-1">
              {MOCK_DMS.map((dm) => (
                <button
                  key={`dm-${dm.id}`}
                  onClick={() => selectChat(dm)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    activeChat.id === dm.id && activeChat.type === 'dm'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold shadow-sm '
                      : 'text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm '
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                        {dm.name.charAt(0)}
                      </div>
                      <div className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${dm.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <span className="truncate">{dm.name}</span>
                  </div>
                   {dm.unread > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col h-full bg-slate-50 dark:bg-[#0B1120] min-w-0 ${!isMobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMobileChatOpen(false)}
                className="lg:hidden p-2 -ml-2 mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>

            {activeChat.type === 'channel' ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-inner">
                <Hash className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  {activeChat.name.charAt(0)}
                </div>
                 <div className={`absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${activeChat.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                {activeChat.type === 'channel' && <Hash className="w-4 h-4 text-gray-400" />}
                {activeChat.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                {activeChat.type === 'channel' ? (
                  <><Users className="w-3.5 h-3.5" /> 24 members • General Discussion</>
                ) : (
                  <>
                     <span className={`w-1.5 h-1.5 rounded-full ${activeChat.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                     {activeChat.online ? 'Active Now' : 'Offline'}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400">
             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hidden sm:block">
                <Search className="w-5 h-5" />
             </button>
             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
             </button>
             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          <div className="flex justify-center sticky top-2 z-0">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-sm px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700/50">
              Today, August 24th
            </span>
          </div>

          {activeMessages.length > 0 ? activeMessages.map((msg) => (
            <div key={`msg-${msg.id}`} className={`flex w-full group ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                 {!msg.isMe && (
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs font-bold shrink-0 mt-auto mb-1 mx-2 shadow-sm ">
                     {msg.avatar}
                   </div>
                 )}
                 
                 <div className={`flex flex-col ${msg.isMe ? 'items-end ml-2' : 'items-start mr-2'}`}>
                   <div className="flex items-baseline gap-2 mb-1 mx-1 px-1">
                     {!msg.isMe && <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{msg.sender}</span>}
                     <span className="text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp}</span>
                   </div>
                   
                   <div className={`px-4 py-2.5 shadow-sm text-[15px] leading-relaxed relative ${
                     msg.isMe 
                       ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                       : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 fade-in">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                 <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-1">It's quiet in here</h3>
              <p className="text-sm max-w-[200px]">Send a message to start the conversation.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="p-4 bg-white dark:bg-gray-900  shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-800 shadow-inner"
          >
            <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Message ${activeChat.type === 'channel' ? '#' : ''}${activeChat.name}...`}
              className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-[15px] text-gray-900 dark:text-white py-3 px-2 placeholder:text-gray-400 font-medium"
              rows="1"
            />
            <div className="flex items-center gap-1 shrink-0 pb-0.5 pr-0.5">
              <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors hidden sm:block">
                <Smile className="w-5 h-5" />
              </button>
              <button 
                type="submit" 
                disabled={!messageText.trim()}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl transition-colors ml-1 shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
          <div className="hidden lg:block text-[10px] font-medium text-gray-400 dark:text-gray-500 text-center mt-3">
             <span className="font-bold">Enter</span> to send, <span className="font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded ml-1">Shift + Enter</span> for new line.
          </div>
        </div>

      </div>

      <CreateChannelModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
