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
  LogIn
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getPassHistory as apiGetPassHistory, 
  getEntryExitLogs as apiGetEntryExitLogs, 
  getBlacklist as apiGetBlacklist 
} from '@/lib/service';
import { 
  savePassToHistory as apiSavePassToHistory, 
  logEntryExit as apiLogEntryExit, 
  addToBlacklist as apiAddToBlacklist, 
  removeFromBlacklist as apiRemoveFromBlacklist 
} from '@/lib/action';
import { AlertModal } from './ui/AlertModal';
import { PromptModal } from './ui/PromptModal';


const TABS = [
  { id: 'schedule', label: 'Schedule Visitor', icon: <QrCode className="size-4" /> },
  { id: 'history', label: 'Pass History', icon: <History className="size-4" /> },
  { id: 'logs', label: 'Activity Logs', icon: <Activity className="size-4" /> },
  { id: 'blacklist', label: 'Blacklist', icon: <Ban className="size-4" /> },
];

export function VisitorPassGenerator() {
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    purpose: 'Personal Guest',
    vehicleMake: '',
    vehicleColor: '',
    vehicleNumber: '',
    expectedArrival: '',
    expectedDeparture: '',
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
          apiGetEntryExitLogs()
        ]);
        setPassHistory(history.docs);
        setBlacklistedVisitors(Array.isArray(blacklist) ? blacklist : []);
        setEntryExitLogs(logs);
      } catch {
        setBlacklistedVisitors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const now = new Date();
    const arrival = new Date(now.getTime() + 30 * 60000);
    const departure = new Date(arrival.getTime() + 2 * 3600000);
    setFormData(prev => ({
      ...prev,
      expectedArrival: arrival.toISOString().slice(0, 16),
      expectedDeparture: departure.toISOString().slice(0, 16)
    }));

    loadData();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQRCode = (passData) => {
    const qrData = JSON.stringify({
      passId: passData.id, visitor: passData.visitorName,
      passCode: passData.passCode, generated: passData.timestamp
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const generatePass = async () => {
    if (!formData.visitorName || !formData.phone) {
      toast.error('Please fill in visitor name and phone number');
      return;
    }
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const passCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const passData = { id: Date.now().toString(), ...formData, passCode, pin, timestamp: new Date().toISOString(), status: 'pending', securityVerified: false };
        setGeneratedPass(passData);
        setQrCodeData(generateQRCode(passData));
        await apiSavePassToHistory(passData);
        setPassHistory(prev => [passData, ...prev.slice(0, 9)]);
        const logEntry = { id: Date.now(), type: 'entry', visitor: passData.visitorName, passCode: passData.passCode, timestamp: new Date().toISOString(), verifiedBy: 'System' };
        await apiLogEntryExit(logEntry);
        setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)]);
        const expiryTime = new Date(formData.expectedDeparture).getTime() - Date.now();
        if (expiryTime > 0) {
          setTimeLeft(Math.floor(expiryTime / 1000));
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => { 
            if (prev <= 1) { 
              clearInterval(timerRef.current); 
              toast.warning(`Pass for ${formData.visitorName} has expired!`); 
              return null; 
            } 
            return prev - 1; 
          });
        }, 1000);
      }
      setAlertConfig({
        isOpen: true,
        title: 'Pass Generated!',
        message: `Visitor pass for ${formData.visitorName} is ready. PIN: ${pin}`,
        type: 'success'
      });
    } catch { 
      toast.error('Failed to generate pass. Please try again.'); 
    }
      finally { setIsGenerating(false); }
    }, 1500);
  };

  const handleVerifyPIN = (enteredPin) => {
    if (enteredPin === generatedPass.pin) {
      setGeneratedPass(prev => ({ ...prev, securityVerified: true, status: 'active' }));
      toast.success('Visitor verified and allowed entry!');
      const logEntry = { id: Date.now(), type: 'entry', visitor: generatedPass.visitorName, passCode: generatedPass.passCode, timestamp: new Date().toISOString(), verifiedBy: 'Security' };
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
      message: `Enter the 4-digit PIN for ${generatedPass.visitorName}`,
      placeholder: 'Enter 4-digit PIN',
      confirmText: 'Verify Entry',
      onConfirm: handleVerifyPIN
    });
  };

  const handleBlacklistConfirm = (reason) => {
    const visitor = { name: formData.visitorName, phone: formData.phone, reason, added: new Date().toISOString() };
    apiAddToBlacklist(visitor).then(() => {
      setBlacklistedVisitors(prev => [...prev, visitor]);
      toast.success('Visitor added to blacklist');
    });
  };

  const addToBlacklist = () => {
    if (!formData.visitorName) { 
      toast.error('Please enter visitor name first'); 
      return; 
    }
    setPromptConfig({
      isOpen: true,
      title: 'Add to Blacklist',
      message: `Why are you blacklisting ${formData.visitorName}?`,
      placeholder: 'Reason for blacklisting...',
      confirmText: 'Confirm Blacklist',
      onConfirm: handleBlacklistConfirm
    });
  };

  const markExit = async () => {
    if (!generatedPass) return;
    setGeneratedPass(prev => ({ ...prev, status: 'completed' }));
    const logExit = { id: Date.now(), type: 'exit', visitor: generatedPass.visitorName, passCode: generatedPass.passCode, timestamp: new Date().toISOString(), verifiedBy: 'Security' };
    await apiLogEntryExit(logExit);
    setEntryExitLogs(prev => [logExit, ...prev.slice(0, 9)]);
    if (timerRef.current) { clearInterval(timerRef.current); setTimeLeft(null); }
    toast.info(`Visitor ${generatedPass.visitorName} has checked out.`);
  };

  const removeFromBlacklist = async (index) => {
    await apiRemoveFromBlacklist(index);
    setBlacklistedVisitors(prev => prev.filter((_, i) => i !== index));
  };

  const sharePass = () => {
    if (!generatedPass) return;
    const message = `Visitor Pass for ${generatedPass.visitorName}:\nPass Code: ${generatedPass.passCode}\nPIN: ${generatedPass.pin}\nValid until: ${new Date(generatedPass.expectedDeparture).toLocaleString()}`;
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
    setFormData({ visitorName: pass.visitorName, phone: pass.phone, purpose: pass.purpose, vehicleMake: '', vehicleColor: '', vehicleNumber: pass.vehicleNumber || '', expectedArrival: pass.expectedArrival || '', expectedDeparture: pass.expectedDeparture || '', residentName: pass.residentName, unitNumber: pass.unitNumber });
    setActiveTab('schedule');
    toast.info(`Loaded ${pass.visitorName}'s details`);
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
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 bg-[#1241a1] rounded-md flex items-center justify-center text-white">
              <UserCheck className="size-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Visitor Management</h2>
          </div>
          <p className="text-slate-500 text-sm ml-12 font-medium">Authorize entry and generate secure digital passes</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Passes', value: passHistory.length, icon: <QrCode className="size-5" />, color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Active Now', value: passHistory.filter(p => p.status === 'active').length, icon: <UserCheck className="size-5" />, color: 'bg-green-500/10 text-green-600' },
          { label: 'Pending', value: passHistory.filter(p => p.status === 'pending').length, icon: <Clock className="size-5" />, color: 'bg-amber-500/10 text-amber-600' },
          { label: 'Blacklisted', value: blacklistedVisitors.length, icon: <Ban className="size-5" />, color: 'bg-red-500/10 text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-md flex items-center gap-4 transition-all">
            <div className={`size-10 rounded-md flex items-center justify-center flex-shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
            </div>
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
                ? 'bg-[#1241a1] text-white' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        { label: 'Visitor Name', value: generatedPass.visitorName },
                        { label: 'Pass Code', value: <span className="font-mono font-semibold">{generatedPass.passCode}</span> },
                        { label: 'Visitor Type', value: <span className="px-2 py-0.5 bg-[#1241a1]/10 text-[#1241a1] text-xs font-semibold rounded uppercase">{generatedPass.purpose}</span> },
                        { label: 'Valid Until', value: generatedPass.expectedDeparture ? new Date(generatedPass.expectedDeparture).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' },
                        { label: 'Destination', value: `${generatedPass.residentName} — Unit ${generatedPass.unitNumber}` },
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
                          const text = `VISITOR PASS\nName: ${generatedPass.visitorName}\nCode: ${generatedPass.passCode}\nPIN: ${generatedPass.pin}\nValid: ${generatedPass.expectedDeparture ? new Date(generatedPass.expectedDeparture).toLocaleString() : '—'}`;
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
              <div className="lg:col-span-3 bg-slate-100 dark:bg-slate-800/30 rounded-md overflow-hidden">
                <div className="p-6 bg-white dark:bg-slate-900">
                  <h3 className="text-xl font-semibold">Schedule New Visitor</h3>
                  <p className="text-slate-500 text-sm mt-1 font-semibold">Complete the details below to authorize entry and generate a secure digital pass.</p>
                </div>
                <div className="p-6 space-y-7">
                  {/* Visitor Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#1241a1]">
                      <User className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Visitor Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                        <input name="visitorName" value={formData.visitorName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm" placeholder="e.g. Michael Smith" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number *</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm" placeholder="+1 (555) 000-0000" />
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
                  
                  {/* Timing */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#1241a1]">
                      <Calendar className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Access Timing</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Entry</label>
                        <input type="datetime-local" name="expectedArrival" value={formData.expectedArrival} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Exit</label>
                        <input type="datetime-local" name="expectedDeparture" value={formData.expectedDeparture} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#1241a1]">
                      <Car className="size-5" />
                      <h4 className="font-semibold uppercase tracking-wider text-xs">Vehicle Details <span className="text-slate-400 font-normal normal-case">(Optional)</span></h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Make & Model</label>
                        <input name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" placeholder="e.g. Tesla Model 3" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Color</label>
                        <input name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" placeholder="e.g. Midnight Silver" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">License Plate</label>
                        <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" placeholder="ABC-1234" />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex flex-col items-center gap-3">
                    <button
                      onClick={generatePass}
                      disabled={isGenerating || !formData.visitorName || !formData.phone}
                      className="w-full py-4 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold rounded-xl shadow-lg shadow-[#1241a1]/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Empty placeholder */}
              <div className="lg:col-span-2">
                <div className="h-80 lg:h-full min-h-[300px] bg-slate-100 dark:bg-slate-800/30 rounded-md flex flex-col items-center justify-center text-center p-8 gap-3">
                  <div className="size-16 bg-white dark:bg-slate-900 rounded-md flex items-center justify-center">
                    <QrCode className="size-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No Pass Generated</h3>
                    <p className="text-sm text-slate-400 max-w-[220px] font-medium">Fill out the form to generate a secure QR code and Entry PIN for your visitor.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}



      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-slate-100 dark:bg-slate-800/30 rounded-md overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Pass History</h3>
            <span className="text-xs text-slate-500 font-medium">{passHistory.length} total passes</span>
          </div>
          {passHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <History className="size-10 mb-3 mx-auto opacity-50" />
              <p className="font-semibold">No pass history yet</p>
            </div>
          ) : (
            <div className="grid gap-1 px-1 pb-1">
              {passHistory.map((pass, i) => (
                <div key={pass.id || i} className="group p-4 flex items-center justify-between bg-white dark:bg-slate-900 rounded-md hover:bg-[#1241a1] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-100 dark:bg-slate-800 text-[#1241a1] rounded-md flex items-center justify-center font-semibold text-sm flex-shrink-0 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {pass.visitorName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-white transition-colors">{pass.visitorName}</p>
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <h3 className="font-bold text-lg text-red-600 dark:text-red-500 flex items-center gap-2">
              <Ban className="size-5" />
              Blacklisted Visitors
            </h3>
            <button onClick={addToBlacklist} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
          {blacklistedVisitors.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShieldCheck className="size-10 mb-3 mx-auto opacity-50" />
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
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2024 EstatePro Visitor Management</p>
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