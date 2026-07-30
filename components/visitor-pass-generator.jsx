'use client'

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  Plus, 
  ExternalLink, 
  QrCode, 
  History, 
  Shield, 
  AlertCircle, 
  CheckCircle2 as CheckIcon, 
  UserPlus,
  UserCheck,
  Search,
  BellRing,
  Activity,
  Ban,
  Share2,
  Printer,
  Download,
  LogOut,
  ArrowLeft,
  Car,
  LogIn,
  Users,
  Baby,
  UserRound
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getPassHistory as apiGetPassHistory, 
  getEntryExitLogs as apiGetEntryExitLogs, 
  getBlacklist as apiGetBlacklist, 
  getGuestCodes
} from '@/lib/service';
import { 
  savePassToHistory as apiSavePassToHistory, 
  logEntryExit as apiLogEntryExit, 
  addToBlacklist as apiAddToBlacklist, 
  removeFromBlacklist as apiRemoveFromBlacklist, 
  generateGuestCode
} from '@/lib/action';
import { AlertModal } from './ui/AlertModal';
import { PromptModal } from './ui/PromptModal';

const TABS = [
  { id: 'schedule', label: 'Schedule Visitor', icon: <QrCode className="size-4" /> },
  { id: 'history', label: 'Pass History', icon: <History className="size-4" /> },
  { id: 'logs', label: 'Activity Logs', icon: <Activity className="size-4" /> },
  { id: 'blacklist', label: 'Blacklist', icon: <Ban className="size-4" /> },
];

const TRANSPORT_MODES = [
  { value: 'car', label: 'Car', icon: Car },
  { value: 'bike', label: 'Bike', icon: '🏍️' },
  { value: 'walk', label: 'Walking', icon: '🚶' },
  { value: 'public', label: 'Public Transport', icon: '🚌' },
  { value: 'taxi', label: 'Taxi', icon: '🚕' },
];

export function VisitorPassGenerator() {
  const [formData, setFormData] = useState({
    type: 'ONE_TIME',
    guestName: '',
    guestPhone: '',
    inviteDate: '',
    inviteTimeFrom: '14:00:00',
    inviteTimeTo: '18:00:00',
    modeOfTransport: 'car',
    totalAdults: 1,
    totalChildren: 0,
    totalInfants: 0,
    searchGuest: false,
    checkGuestId: true,
    // Additional fields for display
    purpose: 'Personal Guest',
    residentName: 'John Doe',
    unitNumber: 'A-101'
  });

  const [generatedPass, setGeneratedPass] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [passHistory, setPassHistory] = useState([]);
  const [blacklistedVisitors, setBlacklistedVisitors] = useState([]);
  const [entryExitLogs, setEntryExitLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Modal States
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [promptConfig, setPromptConfig] = useState({ isOpen: false, title: '', message: '', placeholder: '', onConfirm: () => {} });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [history, blacklist, logs] = await Promise.all([
          apiGetPassHistory(),
          apiGetBlacklist(),
          getGuestCodes()
        ]);
        console.log(logs)
        setPassHistory(history.docs);
        setBlacklistedVisitors(Array.isArray(blacklist) ? blacklist : []);
        setEntryExitLogs(logs);
      } catch {
        setBlacklistedVisitors([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Set default dates
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const fromTime = '14:00:00';
    const toTime = '18:00:00';
    
    setFormData(prev => ({
      ...prev,
      inviteDate: today,
      inviteTimeFrom: fromTime,
      inviteTimeTo: toTime
    }));

    loadData();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const generateQRCode = (passData) => {
    const qrData = JSON.stringify({
      passId: passData.id,
      visitor: passData.guestName,
      passCode: passData.passCode,
      generated: passData.timestamp
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const buildPayload = (formData) => {
    return {
      type: formData.type,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      inviteDate: formData.inviteDate,
      inviteTimeFrom: formData.inviteTimeFrom,
      inviteTimeTo: formData.inviteTimeTo,
      modeOfTransport: formData.modeOfTransport,
      totalAdults: parseInt(formData.totalAdults) || 1,
      totalChildren: parseInt(formData.totalChildren) || 0,
      totalInfants: parseInt(formData.totalInfants) || 0,
      searchGuest: formData.searchGuest,
      checkGuestId: formData.checkGuestId
    };
  };

  const generatePass = async () => {
    if (!formData.guestName || !formData.guestPhone) {
      toast.error('Please fill in guest name and phone number');
      return;
    }

    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const payload = buildPayload(formData);
        const res = await generateGuestCode(payload);
        console.log(res)
        if(!res.ok){
          toast.error("Something went wrong")
          return;
        }
        setGeneratedPass(res.data)

        setAlertConfig({
          isOpen: true,
          title: 'Pass Generated!',
          message: `Visitor pass for ${formData.guestName} is ready. PIN: ${pin}`,
          type: 'success'
        });
      } catch { 
        toast.error('Failed to generate pass. Please try again.'); 
      } finally { 
        setIsGenerating(false); 
      }
    }, 1500);
  };

  const handleVerifyPIN = (enteredPin) => {
    if (enteredPin === generatedPass.pin) {
      setGeneratedPass(prev => ({ ...prev, securityVerified: true, status: 'active' }));
      toast.success('Visitor verified and allowed entry!');
      const logEntry = {
        id: Date.now(),
        type: 'entry',
        visitor: generatedPass.guestName,
        passCode: generatedPass.passCode,
        timestamp: new Date().toISOString(),
        verifiedBy: 'Security'
      };
      apiLogEntryExit(logEntry).then(() => {
        setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)]);
      });
    } else { 
      toast.error('Invalid PIN. Access denied.'); 
    }
  };

  const verifyEntry = () => {
    if (!generatedPass) return;
    setPromptConfig({
      isOpen: true,
      title: 'Verify Visitor PIN',
      message: `Enter the 4-digit PIN for ${generatedPass.guestName}`,
      placeholder: 'Enter 4-digit PIN',
      confirmText: 'Verify Entry',
      onConfirm: handleVerifyPIN
    });
  };

  const handleBlacklistConfirm = (reason) => {
    const visitor = {
      name: formData.guestName,
      phone: formData.guestPhone,
      reason,
      added: new Date().toISOString()
    };
    apiAddToBlacklist(visitor).then(() => {
      setBlacklistedVisitors(prev => [...prev, visitor]);
      toast.success('Visitor added to blacklist');
    });
  };

  const addToBlacklist = () => {
    if (!formData.guestName) { 
      toast.error('Please enter guest name first'); 
      return; 
    }
    setPromptConfig({
      isOpen: true,
      title: 'Add to Blacklist',
      message: `Why are you blacklisting ${formData.guestName}?`,
      placeholder: 'Reason for blacklisting...',
      confirmText: 'Confirm Blacklist',
      onConfirm: handleBlacklistConfirm
    });
  };

  const markExit = async () => {
    if (!generatedPass) return;
    setGeneratedPass(prev => ({ ...prev, status: 'completed' }));
    const logExit = {
      id: Date.now(),
      type: 'exit',
      visitor: generatedPass.guestName,
      passCode: generatedPass.passCode,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Security'
    };
    await apiLogEntryExit(logExit);
    setEntryExitLogs(prev => [logExit, ...prev.slice(0, 9)]);
    if (timerRef.current) { clearInterval(timerRef.current); setTimeLeft(null); }
    toast.info(`Visitor ${generatedPass.guestName} has checked out.`);
  };

  const removeFromBlacklist = async (index) => {
    await apiRemoveFromBlacklist(index);
    setBlacklistedVisitors(prev => prev.filter((_, i) => i !== index));
  };

  const sharePass = () => {
    if (!generatedPass) return;
    const message = `Visitor Pass for ${generatedPass.guestName}:\nPass Code: ${generatedPass.passCode}\nPIN: ${generatedPass.pin}\nValid until: ${new Date(generatedPass.inviteDate + 'T' + generatedPass.inviteTimeTo).toLocaleString()}`;
    if (navigator.share) { 
      navigator.share({ title: 'Visitor Pass', text: message }); 
    } else { 
      navigator.clipboard.writeText(message); 
      toast.success('Pass details copied to clipboard!'); 
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const loadFromHistory = (pass) => {
    setFormData({
      type: pass.type || 'ONE_TIME',
      guestName: pass.guestName,
      guestPhone: pass.guestPhone,
      inviteDate: pass.inviteDate || '',
      inviteTimeFrom: pass.inviteTimeFrom || '14:00:00',
      inviteTimeTo: pass.inviteTimeTo || '18:00:00',
      modeOfTransport: pass.modeOfTransport || 'car',
      totalAdults: pass.totalAdults || 1,
      totalChildren: pass.totalChildren || 0,
      totalInfants: pass.totalInfants || 0,
      searchGuest: pass.searchGuest || false,
      checkGuestId: pass.checkGuestId !== undefined ? pass.checkGuestId : true,
      purpose: pass.purpose || 'Personal Guest',
      residentName: pass.residentName || 'John Doe',
      unitNumber: pass.unitNumber || 'A-101'
    });
    setActiveTab('schedule');
    toast.info(`Loaded ${pass.guestName}'s details`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Visitor Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Passes', value: passHistory.length, icon: <QrCode className="size-5" />, color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Active Now', value: passHistory.filter(p => p.status === 'active').length, icon: <UserCheck className="size-5" />, color: 'bg-green-500/10 text-green-600' },
          { label: 'Pending', value: passHistory.filter(p => p.status === 'pending').length, icon: <Clock className="size-5" />, color: 'bg-amber-500/10 text-amber-600' },
          { label: 'Blacklisted', value: blacklistedVisitors.length, icon: <Ban className="size-5" />, color: 'bg-red-500/10 text-red-600' },
        ].map(stat => (
         
            <div key={stat.label} className="group p-6 bg-[#818b94]/30 dark:bg-[#818b94]/40 rounded-md transition-all cursor-pointer text-left">
                <div className="bg-white dark:bg-slate-100 text-amber-500 p-3 dark:text-black font-bold rounded-md w-fit mb-4 group-hover:bg-amber-700 group-hover:text-white transition-all">
                  {stat.icon}  
                </div>
                <h4 className="font-semibold mb-1 text-sm text-slate-900 dark:text-white">{stat.label}</h4>
                <p className="text-2xl text-slate-500 dark:text-slate-200 font-medium leading-relaxed">{stat.value}</p>
              </div>
         
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-between items-center gap-1 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-md w-full overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap border-none ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-amber-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-8">
          {generatedPass ? (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 dark:bg-[#818b94]/10">
              {/* Hero */}
              <div className="size-20 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mb-5">
                <CheckIcon className="size-10 stroke-3" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">Visitor Access Code Generated</h2>
              <p className="text-slate-500 text-center mb-10 max-w-lg text-sm font-medium">The access code is now active and ready for use. Please share it with your visitor for seamless entry.</p>

              {/* Pass Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full max-w-4xl bg-slate-100 dark:bg-slate-800/50 rounded-md overflow-hidden">
                {/* Left: QR + Numeric Code */}
                <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-md mb-6 relative">
                    {qrCodeData && (
                      <Image width={192} height={192} src={qrCodeData} alt="QR Code" className="rounded-md" />
                    )}
                    {timeLeft && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                        Expires: {formatTime(timeLeft)}
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">Numerical Access Key</p>
                  <h3 className="text-4xl sm:text-5xl font-semibold text-[#1241a1] tracking-tighter">{generatedPass.pin}</h3>
                </div>

                {/* Right: Details + Actions */}
                <div className="flex flex-col justify-between p-8">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Visitor Summary</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Guest Name', value: generatedPass.guestName },
                        { label: 'Phone', value: generatedPass.guestPhone },
                        { label: 'Pass Code', value: <span className="font-mono font-semibold">{generatedPass.passCode}</span> },
                        { label: 'Type', value: <span className="px-2 py-0.5 bg-[#1241a1]/10 text-[#1241a1] text-xs font-semibold rounded uppercase">{generatedPass.type}</span> },
                        { label: 'Date', value: generatedPass.inviteDate ? new Date(generatedPass.inviteDate).toLocaleDateString() : '—' },
                        { label: 'Time', value: `${generatedPass.inviteTimeFrom} - ${generatedPass.inviteTimeTo}` },
                        { label: 'Transport', value: generatedPass.modeOfTransport },
                        { label: 'Guests', value: `${generatedPass.totalAdults} Adults, ${generatedPass.totalChildren} Children, ${generatedPass.totalInfants} Infants` },
                        { label: 'ID Check', value: generatedPass.checkGuestId ? '✅ Required' : '❌ Not Required' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between gap-4">
                          <span className="text-slate-500 text-sm font-medium shrink-0">{item.label}</span>
                          <span className="font-semibold text-sm text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={sharePass}
                      className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:brightness-110 text-white font-semibold py-3.5 rounded-md transition-all border-none"
                    >
                      <Share2 className="size-5" />
                      Share via WhatsApp
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-md transition-all text-sm border-none"
                      >
                        <Printer className="size-4" />
                        Print Pass
                      </button>
                      <button
                        onClick={() => {
                          const text = `VISITOR PASS\nName: ${generatedPass.guestName}\nCode: ${generatedPass.passCode}\nPIN: ${generatedPass.pin}\nValid: ${generatedPass.inviteDate} ${generatedPass.inviteTimeTo}`;
                          const el = document.createElement('a');
                          el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
                          el.download = `visitor-pass-${generatedPass.passCode}.txt`;
                          el.click();
                        }}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-md transition-all text-sm border-none"
                      >
                        <Download className="size-4" />
                        Download
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button onClick={verifyEntry} disabled={generatedPass.securityVerified} className={`flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm transition-all border-none ${generatedPass.securityVerified ? 'bg-green-500/10 text-green-700 dark:text-green-400 cursor-default' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                        <ShieldCheck className="w-4 h-4" />
                        {generatedPass.securityVerified ? 'Verified' : 'Verify'}
                      </button>
                      <button onClick={markExit} className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-md font-semibold text-sm transition-all border-none">
                        <LogOut className="size-4" />
                        Mark Exit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10">
                <button
                  onClick={() => setGeneratedPass(null)}
                  className="flex items-center gap-2 text-[#1241a1] font-semibold hover:underline border-none"
                >
                  <ArrowLeft className="size-5" />
                  Schedule Another Visitor
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Form */}
              <div className="lg:col-span-3 bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
                <div className="p-6 bg-white dark:bg-slate-900">
                  <h3 className="text-xl font-semibold">Schedule New Visitor</h3>
                  <p className="text-slate-500 text-sm mt-1 font-semibold">Complete the details below to authorize entry and generate a secure digital pass.</p>
                </div>
                <div className="p-6 space-y-7">
                  {/* Guest Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <User className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Guest Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Guest Name *</label>
                        <input name="guestName" value={formData.guestName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm" placeholder="e.g. John Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number *</label>
                        <input name="guestPhone" type="tel" value={formData.guestPhone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm" placeholder="+2348012345678" />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Purpose of Visit</label>
                        <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm appearance-none">
                          <option>Personal Guest</option>
                          <option>Delivery / Courier</option>
                          <option>Maintenance / Service</option>
                          <option>Professional Meeting</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visit Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Calendar className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Visit Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date *</label>
                        <input type="date" name="inviteDate" value={formData.inviteDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">From *</label>
                        <input type="time" name="inviteTimeFrom" value={formData.inviteTimeFrom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">To *</label>
                        <input type="time" name="inviteTimeTo" value={formData.inviteTimeTo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Users className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Guest Count</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Adults</label>
                        <input type="number" name="totalAdults" value={formData.totalAdults} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Children</label>
                        <input type="number" name="totalChildren" value={formData.totalChildren} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Infants</label>
                        <input type="number" name="totalInfants" value={formData.totalInfants} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Transport & Options */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Car className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Transport & Options</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mode of Transport</label>
                        <select name="modeOfTransport" value={formData.modeOfTransport} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm appearance-none">
                          {TRANSPORT_MODES.map(mode => (
                            <option key={mode.value} value={mode.value}>{mode.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <input type="checkbox" name="searchGuest" checked={formData.searchGuest} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#1241a1] focus:ring-[#1241a1] focus:ring-offset-0" />
                            Search Guest
                          </label>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <input type="checkbox" name="checkGuestId" checked={formData.checkGuestId} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#1241a1] focus:ring-[#1241a1] focus:ring-offset-0" />
                            Check ID
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex flex-col items-center gap-3">
                    <button
                      onClick={generatePass}
                      disabled={isGenerating || !formData.guestName || !formData.guestPhone}
                      className="w-full py-4 bg-amber-700 hover:bg-amber-700/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
                          Generating...
                        </span>
                      ) : (
                        <>
                          <QrCode className="size-5 group-hover:rotate-12 transition-transform" />
                          Generate Access Code
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 text-center">By generating a code, you take responsibility for your guest&apos;s conduct within the premises.</p>
                  </div>
                </div>
              </div>

              {/* Preview Sidebar */}
              <div className="lg:col-span-2 dark:bg-[#818b94]/10">
                <div className="h-80 lg:h-full min-h-[300px] bg-slate-100 dark:bg-slate-800/30 rounded-md flex flex-col items-center justify-center text-center p-8 gap-3">
                  <div className="size-16 bg-white dark:bg-slate-900 rounded-md flex items-center justify-center">
                    <QrCode className="size-8 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No Pass Generated</h3>
                    <p className="text-sm text-slate-400 max-w-[220px] font-medium">Fill out the form to generate a secure QR code and Entry PIN for your visitor.</p>
                  </div>
                  
                  {/* Payload Preview */}
                  <div className="mt-4 w-full ">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Payload Preview</p>
                    <pre className="text-[8px] bg-white/50 dark:bg-slate-900/50 p-3 rounded text-left overflow-x-auto">
                      {JSON.stringify(buildPayload(formData), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Pass History</h3>
            <span className="text-xs text-slate-500 font-medium">{passHistory.length} total passes</span>
          </div>
          {passHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <History className="size-10 mb-3 mx-auto opacity-50 text-amber-700" />
              <p className="font-semibold">No pass history yet</p>
            </div>
          ) : (
            <div className="grid gap-1 px-1 pb-1">
              {passHistory.map((pass, i) => (
                <div key={pass.id || i} className="group p-4 flex items-center justify-between bg-white dark:bg-slate-900 rounded-md hover:bg-[#1241a1] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-100 dark:bg-slate-800 text-[#1241a1] rounded-md flex items-center justify-center font-semibold text-sm flex-shrink-0 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {pass.guestName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-white transition-colors">{pass.guestName}</p>
                      <p className="text-xs text-slate-500 group-hover:text-white/60 transition-colors">{pass.purpose} • <span className="font-mono">{pass.passCode}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-widest ${
                      pass.status === 'active' ? 'bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white' :
                      pass.status === 'pending' ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white' :
                      'bg-slate-100 text-slate-600 group-hover:bg-slate-500 group-hover:text-white'
                    }`}>{pass.status}</span>
                    <button onClick={(e) => { e.stopPropagation(); loadFromHistory(pass); }} className="text-xs font-semibold text-[#1241a1] group-hover:text-white border-none bg-transparent hover:underline">
                      Re-use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6">
            <h3 className="font-bold text-lg">Activity Logs</h3>
          </div>
          {entryExitLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Activity className="size-10 mb-3 mx-auto opacity-50" />
              <p className="font-medium">No activity logged yet</p>
            </div>
          ) : (
            <div className="">
              {entryExitLogs.map((log, i) => (
                <div key={log.id || i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`size-9 rounded-full flex items-center justify-center flex-shrink-0 ${log.type === 'entry' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                    {log.type === 'entry' ? <LogIn className="size-4" /> : <LogOut className="size-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{log.visitor}</p>
                    <p className="text-xs text-slate-500">Code: <span className="font-mono">{log.passCode}</span> • {log.verifiedBy}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${log.type === 'entry' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{log.type}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blacklist Tab */}
      {activeTab === 'blacklist' && (
        <div className="bg-white dark:bg-[#818b94]/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white dark:text-amber-700 flex items-center gap-2">
              <Ban className="size-5" />
              Blacklisted Visitors
            </h3>
            <button onClick={addToBlacklist} className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-700 text-white dark:text-white rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-amber-700/40 transition-colors">
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
          {blacklistedVisitors.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShieldCheck className="size-10 mb-3 mx-auto opacity-50 text-amber-700" />
              <p className="font-medium">No blacklisted visitors</p>
            </div>
          ) : (
            <div className="">
              {blacklistedVisitors.map((v, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-9 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {v.name?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{v.name}</p>
                      <p className="text-xs text-slate-500">{v.reason}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromBlacklist(i)} className="text-xs text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="mt-12 py-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2024 EMSS Visitor Management</p>
      </footer>

      {/* Modals */}
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
      <PromptModal
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
        confirmText={promptConfig.confirmText}
        onConfirm={promptConfig.onConfirm}
      />
    </div>
  );
}