'use client'

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
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
 UserRound,
 ChevronDown,
 ChevronUp,
 Eye,
 X,
 MessageSquare,
 CalendarDays,
 Clock as ClockIcon,
 UserCog,
 UserX,
 Info,
 Check,
 Building,
 TrendingUp,
 TrendingDown,
 Circle,
 MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
 getPassHistory as apiGetPassHistory, 
 getEntryExitLogs as apiGetEntryExitLogs, 
 getBlacklist as apiGetBlacklist, 
 getGuestCodes,
 getGuestCodesById
} from '@/lib/service';
import { 
 savePassToHistory as apiSavePassToHistory, 
 logEntryExit as apiLogEntryExit, 
 addToBlacklist as apiAddToBlacklist, 
 removeFromBlacklist as apiRemoveFromBlacklist, 
 generateGuestCode,
 deactivateGuestCode,
 preApproveVisitor
} from '@/lib/action';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { AlertModal } from '@/components/ui/AlertModal';

const TABS = [
 { id: 'schedule', label: 'Schedule', icon: <QrCode className="size-4" /> },
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

// Helper component for preview rows
const PreviewRow = ({ label, value }) => (
 <div className="flex items-center justify-between gap-4 text-sm">
 <span className="text-[#8a8f98] font-medium shrink-0">{label}</span>
 <span className="font-semibold text-white text-white text-right truncate max-w-[180px]">
 {value}
 </span>
 </div>
);

// Helper component for detail rows in modal
const DetailRow = ({ label, value, icon, valueClassName = '' }) => (
 <div className="flex items-center gap-3 text-sm">
 <span className="text-[#8a8f98]">{icon}</span>
 <span className="text-[#8a8f98] font-medium min-w-[120px]">{label}</span>
 <span className={`font-semibold text-white text-white ml-auto ${valueClassName}`}>
 {value}
 </span>
 </div>
);

// Trading-style stat card component
const StatCard = ({ label, value, change, icon, color = 'blue' }) => {
 const isPositive = change && change > 0;
 const isNegative = change && change < 0;
 
 return (
 <div className="bg-[#1a1d23]/40 bg-[#12131C] backdrop-blur-md rounded-2xl border-none p-5 shadow-sm">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-bold text-[#8a8f98] text-[#8a8f98] uppercase tracking-wider">{label}</span>
 <span className="text-[#8a8f98]">{icon}</span>
 </div>
 <div className="flex items-end gap-2">
 <span className="text-2xl font-extrabold text-white text-white">{value}</span>
 {change !== undefined && (
 <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-[#8a8f98]'}`}>
 {isPositive ? '+' : ''}{change}%
 </span>
 )}
 </div>
 </div>
 );
};

// Trading-style table component
const TradingTable = ({ headers, data, onRowClick, renderRow, renderStatus }) => {
 return (
 <div className="w-full">
 {/* Table Header */}
 <div className="grid grid-cols-7 gap-2 px-5 py-3 bg-[#1a1d23]/50 bg-[#0B0C11] rounded-t-xl border-none">
 {headers.map((header, idx) => (
 <div key={idx} className={`text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider ${header.align || 'text-left'}`}>
 {header.label}
 </div>
 ))}
 </div>
 
 {/* Table Body */}
 <div className="divide-y-0">
 {data.map((item, idx) => (
 <div 
 key={idx} 
 className={`grid grid-cols-7 gap-2 px-5 py-3 hover:bg-[#1a1d23]/40 hover:bg-[#151622] transition-colors cursor-pointer border-none ${renderRow ? renderRow(item) : ''}`}
 onClick={() => onRowClick && onRowClick(item)}
 >

 {headers.map((header, hIdx) => (
 <div key={hIdx} className={`text-sm ${header.align || 'text-left'} flex items-center`}>
 {renderStatus && header.key === 'status' ? (
 renderStatus(item)
 ) : (
 <span className="text-white font-medium">
 {item[header.key] || '—'}
 </span>
 )}
 </div>
 ))}
 </div>
 ))}
 </div>
 </div>
 );
};

export default function VisitorPassGenerator() {
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
 
 // Sorting states
 const [historySort, setHistorySort] = useState({ key: 'createdAt', direction: 'desc' });
 const [logsSort, setLogsSort] = useState({ key: 'timestamp', direction: 'desc' });

 // Modal States
 const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
 const [promptConfig, setPromptConfig] = useState({ isOpen: false, title: '', message: '', placeholder: '', onConfirm: () => {} });
 
 // Pass Details Modal States
 const [viewPassData, setViewPassData] = useState(null);
 const [showPassDetails, setShowPassDetails] = useState(false);
 const [viewQRCodeData, setViewQRCodeData] = useState('');

 // Generate QR code whenever generatedPass changes
 useEffect(() => {
 if (generatedPass) {
 generateQRCode(generatedPass);
 }
 }, [generatedPass]);

 const generateQRCode = async (passData) => {
 try {
 const qrData = JSON.stringify({
 passCode: passData.code,
 pin: passData.pin,
 guestName: passData.guestName,
 guestPhone: passData.guestPhone,
 inviteDate: passData.inviteDate,
 inviteTimeFrom: passData.inviteTimeFrom,
 inviteTimeTo: passData.inviteTimeTo,
 type: passData.type
 });

 const qrImage = await QRCode.toDataURL(qrData, {
 width: 300,
 margin: 2,
 color: {
 dark: '#1241a1',
 light: '#ffffff'
 }
 });
 
 setQrCodeData(qrImage);
 } catch (error) {
 console.error('Error generating QR code:', error);
 toast.error('Failed to generate QR code');
 }
 };

 // Generate QR for history passes
 const generateHistoryQR = async (passData) => {
 try {
 const qrData = JSON.stringify({
 passCode: passData.code,
 pin: passData.pin,
 guestName: passData.guestName,
 guestPhone: passData.guestPhone,
 inviteDate: passData.inviteDate,
 inviteTimeFrom: passData.inviteTimeFrom,
 inviteTimeTo: passData.inviteTimeTo,
 type: passData.type
 });

 const qrImage = await QRCode.toDataURL(qrData, {
 width: 300,
 margin: 2,
 color: {
 dark: '#1241a1',
 light: '#ffffff'
 }
 });
 
 return qrImage;
 } catch (error) {
 console.error('Error generating QR code:', error);
 return null;
 }
 };

 useEffect(() => {
 const loadData = async () => {
 setIsLoading(true);
 try {
 const [history, blacklist, logs] = await Promise.all([
 getGuestCodes(),
 apiGetBlacklist(),
 getGuestCodes()
 ]);
 console.log(history)

 setPassHistory(history.data || []);
 setBlacklistedVisitors(Array.isArray(blacklist) ? blacklist : []);
 setEntryExitLogs(logs.data || []);
 } catch {
 setBlacklistedVisitors([]);
 } finally {
 setIsLoading(false);
 }
 };

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

 const loadPassDetails = async (id) => {
 const res = await getGuestCodesById(id);
 console.log(res)
 }
 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 setFormData(prev => ({ 
 ...prev, 
 [name]: type === 'checkbox' ? checked : value 
 }));
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
 try {
 const payload = buildPayload(formData);
 const res = await generateGuestCode(payload);
 console.log(res)
 
 if (!res.data) {
 toast.error("Something went wrong");
 return;
 }
 
 const passData = res.data;
 setGeneratedPass(passData);

 setAlertConfig({
 isOpen: true,
 title: 'Pass Generated!',
 message: `Visitor pass for ${formData.guestName} is ready.`,
 type: 'success'
 });
 } catch (error) {
 console.error('Generation error:', error);
 toast.error('Failed to generate pass. Please try again.');
 } finally { 
 setIsGenerating(false); 
 }
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
 const message = `Visitor Pass for ${generatedPass.guestName}:\nPass Code: ${generatedPass.code}\nPIN: ${generatedPass.pin}\nValid until: ${new Date(generatedPass.inviteDate + 'T' + generatedPass.inviteTimeTo).toLocaleString()}`;
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

 // Format date helper for modal
 const formatDate = (dateString) => {
 if (!dateString) return '—';
 const date = new Date(dateString);
 return date.toLocaleDateString('en-US', { 
 weekday: 'short', 
 year: 'numeric', 
 month: 'short', 
 day: 'numeric' 
 });
 };

 const formatTimeString = (dateString) => {
 if (!dateString) return '—';
 const date = new Date(dateString);
 return date.toLocaleTimeString('en-US', { 
 hour: '2-digit', 
 minute: '2-digit' 
 });
 };

 const formatDateTime = (dateString) => {
 if (!dateString) return '—';
 const date = new Date(dateString);
 return date.toLocaleString('en-US', { 
 weekday: 'short',
 year: 'numeric', 
 month: 'short', 
 day: 'numeric',
 hour: '2-digit', 
 minute: '2-digit'
 });
 };

 // View pass details from history
 const viewPassDetails = async (pass) => {
 const qrImage = await generateHistoryQR(pass);
 setViewQRCodeData(qrImage);
 setViewPassData(pass);
 setShowPassDetails(true);
 };

 // Deactivate a pass
 const deactivatePass = async (pass) => {
 try {
 const res = await deactivateGuestCode(pass.id);
 console.log(res);
 
 toast.success(`Pass for ${pass.guestName} deactivated`);
 setPassHistory(prev => prev.map(p => p.id === pass.id ? { ...p, isActive: false } : p));
 setShowPassDetails(false);
 } catch (error) {
 toast.error('Failed to deactivate pass');
 }
 };
 const preApprovePass = async (pass) => {
 try {
 const res = await preApproveVisitor(pass.id);
 console.log(res);
 toast.success(`Pass for ${pass.guestName} pre approved`);
 setPassHistory(prev => prev.map(p => p.id === pass.id ? { ...p, isPreApprovedForCheckout: true } : p));
 setShowPassDetails(false);
 } catch (error) {
 toast.error('Failed to pre-approve pass');
 }
 };

 // Sorting functions
 const sortHistory = (key) => {
 const direction = historySort.key === key && historySort.direction === 'asc' ? 'desc' : 'asc';
 setHistorySort({ key, direction });
 };

 const sortLogs = (key) => {
 const direction = logsSort.key === key && logsSort.direction === 'asc' ? 'desc' : 'asc';
 setLogsSort({ key, direction });
 };

 const getSortedHistory = () => {
 return [...passHistory].sort((a, b) => {
 let aVal = a[historySort.key];
 let bVal = b[historySort.key];
 
 if (historySort.key === 'createdAt' || historySort.key === 'inviteDate') {
 aVal = new Date(aVal).getTime();
 bVal = new Date(bVal).getTime();
 }
 
 if (historySort.key === 'totalAdults' || historySort.key === 'totalChildren' || historySort.key === 'totalInfants') {
 aVal = parseInt(aVal) || 0;
 bVal = parseInt(bVal) || 0;
 }
 
 if (typeof aVal === 'string' && typeof bVal === 'string') {
 return historySort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
 }
 
 return historySort.direction === 'asc' ? (aVal - bVal) : (bVal - aVal);
 });
 };

 const getSortedLogs = () => {
 return [...entryExitLogs].sort((a, b) => {
 let aVal = a[logsSort.key];
 let bVal = b[logsSort.key];
 
 if (logsSort.key === 'timestamp') {
 aVal = new Date(aVal).getTime();
 bVal = new Date(bVal).getTime();
 }
 
 if (typeof aVal === 'string' && typeof bVal === 'string') {
 return logsSort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
 }
 
 return logsSort.direction === 'asc' ? (aVal - bVal) : (bVal - aVal);
 });
 };

 const renderSortIcon = (key, currentSort) => {
 if (currentSort.key !== key) return null;
 return currentSort.direction === 'asc' ? 
 <ChevronUp className="size-3 inline ml-1" /> : 
 <ChevronDown className="size-3 inline ml-1" />;
 };

 // Render Prompt Modal (inline)
 const renderPromptModal = () => {
 if (!promptConfig.isOpen) return null;
 
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
 <div 
 className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="p-8">
 <div className="flex flex-col items-center text-center mb-6">
 <div className="w-14 h-14 rounded-full bg-[#1241a1]/10 flex items-center justify-center mb-4">
 <ShieldCheck className="w-6 h-6 text-[#1241a1]" />
 </div>
 <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
 {promptConfig.title}
 </h3>
 <p className="text-sm text-[#8a8f98] leading-relaxed max-w-[280px]">
 {promptConfig.message}
 </p>
 </div>

 <form onSubmit={(e) => {
 e.preventDefault();
 const input = e.target.querySelector('input');
 if (input && input.value.trim()) {
 promptConfig.onConfirm(input.value);
 setPromptConfig({ ...promptConfig, isOpen: false });
 }
 }} className="space-y-6">
 <div>
 <input
 autoFocus
 type="text"
 placeholder={promptConfig.placeholder}
 className="w-full px-5 py-4 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-sm text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all"
 />
 </div>

 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setPromptConfig({ ...promptConfig, isOpen: false })}
 className="flex-1 py-3.5 rounded-xl text-sm font-bold text-[#8a8f98] hover:bg-[#2a2d33] transition-all active:scale-95"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-[#1241a1] hover:bg-[#1a51b1] shadow-lg shadow-[#1241a1]/20 transition-all active:scale-95"
 >
 {promptConfig.confirmText || 'Submit'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
 };

 // Render Pass Details Modal (inline)
 const renderPassDetailsModal = () => {
 if (!showPassDetails || !viewPassData) return null;

 const pass = viewPassData;
 const isActive = pass.isActive && !pass.isUsed;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
 <div 
 className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="sticky top-0 z-10 p-6 border-b border-[#2a2d33] bg-[#1a1d23] rounded-t-xl">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
 <QrCode className="w-5 h-5 text-emerald-500" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-white">Pass Details</h3>
 <p className="text-xs text-[#8a8f98] font-medium">Complete visitor pass information</p>
 </div>
 </div>
 <button
 onClick={() => {
 setShowPassDetails(false);
 setViewPassData(null);
 setViewQRCodeData('');
 }}
 className="p-2 hover:bg-[#2a2d33] rounded-full transition-colors"
 >
 <X className="w-5 h-5 text-[#8a8f98]" />
 </button>
 </div>
 </div>

 <div className="p-6 space-y-6">
 {/* Status Badge */}
 <div className="flex items-center gap-3 p-4 bg-[#2a2d33] rounded-xl">
 <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : pass.isUsed ? 'bg-[#8a8f98]' : 'bg-amber-500'}`} />
 <span className="font-semibold text-sm text-white">
 Status: {isActive ? 'Active' : pass.isUsed ? 'Used' : 'Expired'}
 </span>
 {isActive && (
 <span className="ml-auto text-[10px] px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-bold uppercase tracking-wider">
 Valid
 </span>
 )}
 {pass.isDetained && (
 <span className="ml-auto text-[10px] px-3 py-1 bg-red-500/20 text-red-400 rounded-full font-bold uppercase tracking-wider">
 Detained
 </span>
 )}
 </div>

 {/* Main Content Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Left: QR Code */}
 <div className="flex flex-col items-center justify-center p-6 bg-[#2a2d33] rounded-xl">
 <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider mb-3">QR Code</p>
 <div className="p-4 bg-[#1a1d23] rounded-xl shadow-sm">
 {viewQRCodeData ? (
 <Image 
 width={250} 
 height={250} 
 src={viewQRCodeData} 
 alt="QR Code" 
 className="rounded-lg"
 priority
 />
 ) : (
 <div className="w-[250px] h-[250px] bg-[#2a2d33] animate-pulse rounded-lg flex items-center justify-center">
 <QrCode className="size-16 text-[#8a8f98]" />
 </div>
 )}
 </div>
 <p className="text-[#8a8f98] text-xs font-semibold uppercase tracking-widest mt-4">Numerical Access Key</p>
 <h3 className="text-3xl font-semibold text-[#1241a1] tracking-tighter">{pass.pin || 'N/A'}</h3>
 
 {/* Pass Code */}
 <div className="mt-3 text-center">
 <p className="text-[#8a8f98] text-xs font-semibold uppercase tracking-widest">Pass Code</p>
 <p className="text-lg font-mono font-bold text-white">{pass.code}</p>
 </div>
 </div>

 {/* Right: Details */}
 <div className="space-y-4">
 {/* Visitor Information */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3 flex items-center gap-2">
 <User className="w-3 h-3" />
 Visitor Information
 </h4>
 <div className="space-y-2.5">
 <DetailRow label="Guest Name" value={pass.guestName} icon={<User className="w-3 h-3" />} />
 <DetailRow label="Phone" value={pass.guestPhone} icon={<Phone className="w-3 h-3" />} />
 <DetailRow label="Pass Type" value={pass.type} icon={<Key className="w-3 h-3" />} />
 <DetailRow label="Event Name" value={pass.eventName || '—'} icon={<CalendarDays className="w-3 h-3" />} />
 </div>
 </div>

 {/* Visit Details */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3 flex items-center gap-2">
 <Calendar className="w-3 h-3" />
 Visit Details
 </h4>
 <div className="space-y-2.5">
 <DetailRow label="Date" value={formatDate(pass.inviteDate)} icon={<Calendar className="w-3 h-3" />} />
 <DetailRow label="From" value={formatTimeString(pass.inviteTimeFrom)} icon={<ClockIcon className="w-3 h-3" />} />
 <DetailRow label="To" value={formatTimeString(pass.inviteTimeTo)} icon={<ClockIcon className="w-3 h-3" />} />
 <DetailRow label="Transport" value={pass.modeOfTransport} icon={<Car className="w-3 h-3" />} />
 <DetailRow 
 label="Guests" 
 value={`${pass.totalAdults || 0}A, ${pass.totalChildren || 0}C, ${pass.totalInfants || 0}I`} 
 icon={<Users className="w-3 h-3" />} 
 />
 </div>
 </div>

 {/* Security & Status */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3 flex items-center gap-2">
 <ShieldCheck className="w-3 h-3" />
 Security & Status
 </h4>
 <div className="space-y-2.5">
 <DetailRow 
 label="ID Check" 
 value={pass.checkGuestId ? ' Required' : ' Not Required'} 
 icon={<ShieldCheck className="w-3 h-3" />}
 valueClassName={pass.checkGuestId ? 'text-green-400' : 'text-[#8a8f98]'}
 />
 <DetailRow 
 label="Search Guest" 
 value={pass.searchGuest ? 'Enabled' : 'Disabled'} 
 icon={<Search className="w-3 h-3" />}
 valueClassName={pass.searchGuest ? 'text-green-400' : 'text-[#8a8f98]'}
 />
 <DetailRow 
 label="Pre-approved" 
 value={pass.isPreApprovedForCheckout ? ' Yes' : ' No'} 
 icon={<UserCheck className="w-3 h-3" />}
 valueClassName={pass.isPreApprovedForCheckout ? 'text-green-400' : 'text-[#8a8f98]'}
 />
 <DetailRow 
 label="Detained" 
 value={pass.isDetained ? ' Yes' : ' No'} 
 icon={<UserX className="w-3 h-3" />}
 valueClassName={pass.isDetained ? 'text-red-400' : 'text-green-400'}
 />
 </div>
 </div>

 {/* Usage & Timestamps */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3 flex items-center gap-2">
 <Clock className="w-3 h-3" />
 Usage & Timestamps
 </h4>
 <div className="space-y-2.5">
 <DetailRow label="Usage Count" value={pass.usageCount || 0} icon={<Info className="w-3 h-3" />} />
 <DetailRow label="Usage Limit" value={pass.usageLimit || 'Unlimited'} icon={<Info className="w-3 h-3" />} />
 <DetailRow label="Created" value={formatDateTime(pass.createdAt)} icon={<ClockIcon className="w-3 h-3" />} />
 <DetailRow label="Updated" value={formatDateTime(pass.updatedAt)} icon={<ClockIcon className="w-3 h-3" />} />
 {pass.usedAt && (
 <DetailRow label="Used At" value={formatDateTime(pass.usedAt)} icon={<Check className="w-3 h-3" />} />
 )}
 {pass.checkedInBy && (
 <DetailRow label="Checked In By" value={pass.checkedInBy} icon={<UserCog className="w-3 h-3" />} />
 )}
 {pass.checkedOutBy && (
 <DetailRow label="Checked Out By" value={pass.checkedOutBy} icon={<UserCog className="w-3 h-3" />} />
 )}
 {pass.checkedOutAt && (
 <DetailRow label="Checked Out At" value={formatDateTime(pass.checkedOutAt)} icon={<ClockIcon className="w-3 h-3" />} />
 )}
 </div>
 </div>

 {/* Actions */}
 <div className="space-y-3 pt-4 border-t border-[#2a2d33]">
 <button
 onClick={() => {
 const message = `Visitor Pass for ${pass.guestName}:\nPass Code: ${pass.code}\nPIN: ${pass.pin}\nValid until: ${formatDateTime(pass.inviteTimeTo)}`;
 if (navigator.share) { 
 navigator.share({ title: 'Visitor Pass', text: message }); 
 } else { 
 navigator.clipboard.writeText(message); 
 toast.success('Pass details copied to clipboard!'); 
 }
 }}
 className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all border-none"
 >
 <Share2 className="size-5" />
 Share via WhatsApp
 </button>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => window.print()}
 className="flex items-center justify-center gap-2 bg-[#2a2d33] hover:bg-[#3a3d43] text-white font-semibold py-3 rounded-xl transition-all text-sm border border-[#3a3d43]"
 >
 <Printer className="size-4" />
 Print Pass
 </button>
 <button
 onClick={() => {
 if (viewQRCodeData) {
 const link = document.createElement('a');
 link.download = `visitor-pass-${pass.code}.png`;
 link.href = viewQRCodeData;
 link.click();
 }
 }}
 className="flex items-center justify-center gap-2 bg-[#2a2d33] hover:bg-[#3a3d43] text-white font-semibold py-3 rounded-xl transition-all text-sm border border-[#3a3d43]"
 >
 <Download className="size-4" />
 Download QR
 </button>
 </div>
 {isActive && (
 <button
 onClick={() => deactivatePass(pass)}
 className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-semibold text-sm transition-all border-none"
 >
 <Ban className="size-4" />
 Deactivate Pass
 </button>
 )}
 {isActive && (
 <button
 onClick={() => preApprovePass(pass)}
 className="w-full flex items-center justify-center gap-2 py-3 bg-[#1241a1]/10 text-blue-400 hover:bg-[#1241a1]/20 rounded-xl font-semibold text-sm transition-all border-none"
 >
 <User className="size-4" />
 Pre Approve Pass
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
 };

 if (isLoading) {
 return (
 <LoadingState message="Loading Visitors Portal..." />
 
 );
 }

 return (
 <div className="min-h-screen bg-[#0d0f13] animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
 <PageHeader 
 title="Visitor Access" 
 description="Generate access codes and manage your guest list."
 icon={QrCode}
 iconColor="blue"
 >
 <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
 </PageHeader>

 {/* Quick Stats - Trading Style */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
 <StatCard 
 label="Total Passes" 
 value={passHistory.length} 
 icon={<QrCode className="size-4" />}
 />
 <StatCard 
 label="Active Now" 
 value={passHistory.filter(item => item.isActive && !item.isUsed).length}
 icon={<UserCheck className="size-4" />}
 change={12.5}
 />
 <StatCard 
 label="Used" 
 value={passHistory.filter(item => item.isUsed).length}
 icon={<Clock className="size-4" />}
 change={-3.2}
 />
 <StatCard 
 label="Blacklisted" 
 value={blacklistedVisitors.length}
 icon={<Ban className="size-4" />}
 change={0}
 />
 </div>

 {/* Tab Navigation - Trading Style */}
 <div className="flex gap-1 mb-6 bg-[#1a1d23] p-1 rounded-md w-full overflow-x-auto border border-[#2a2d33]">
 {TABS.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap border-none ${
 activeTab === tab.id 
 ? 'bg-[#1241a1] text-white' 
 : 'text-[#8a8f98] hover:text-white hover:bg-[#2a2d33]'
 }`}
 >
 {tab.icon}
 {tab.label}
 </button>
 ))}
 </div>

 {/* Schedule Tab */}
 {activeTab === 'schedule' && (
 <div className="space-y-6">
 {generatedPass ? (
 <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-8">
 {/* Hero */}
 <div className="size-20 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mb-5">
 <CheckIcon className="size-10 stroke-3" />
 </div>
 <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">Visitor Access Code Generated</h2>
 <p className="text-[#8a8f98] text-center mb-8 text-sm font-medium">The access code is now active and ready for use. Please share it with your visitor for seamless entry.</p>

 {/* Pass Card */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full max-w-4xl bg-[#2a2d33] rounded-xl overflow-hidden border border-[#3a3d43]">
 {/* Left: QR + Numeric Code */}
 <div className="flex flex-col items-center justify-center p-8 bg-[#1a1d23]">
 <div className="p-5 bg-[#2a2d33] rounded-xl mb-6 relative">
 {qrCodeData ? (
 <Image 
 width={300} 
 height={300} 
 src={qrCodeData} 
 alt="QR Code" 
 className="rounded-xl"
 priority
 />
 ) : (
 <div className="w-[300px] h-[300px] bg-[#2a2d33] animate-pulse rounded-xl flex items-center justify-center">
 <QrCode className="size-16 text-[#8a8f98]" />
 </div>
 )}
 {timeLeft && (
 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
 Expires: {formatTime(timeLeft)}
 </div>
 )}
 </div>
 <p className="text-[#8a8f98] text-xs font-semibold uppercase tracking-widest mb-1">Numerical Access Key</p>
 <h3 className="text-4xl sm:text-5xl font-semibold text-[#1241a1] tracking-tighter">{generatedPass.pin || 'N/A'}</h3>
 </div>

 {/* Right: Details + Actions */}
 <div className="flex flex-col justify-between p-8 bg-[#1a1d23]">
 <div>
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-5">Visitor Summary</h4>
 <div className="space-y-3">
 {[
 { label: 'Guest Name', value: generatedPass.guestName },
 { label: 'Phone', value: generatedPass.guestPhone },
 { label: 'Pass Code', value: <span className="font-mono font-semibold text-[#1241a1]">{generatedPass.code}</span> },
 { label: 'Type', value: <span className="px-2 py-0.5 bg-[#1241a1]/20 text-[#1241a1] text-xs font-semibold rounded uppercase">{generatedPass.type}</span> },
 { label: 'Date', value: generatedPass.inviteDate ? new Date(generatedPass.inviteDate).toLocaleDateString() : '—' },
 { label: 'Time', value: `${generatedPass.inviteTimeFrom} - ${generatedPass.inviteTimeTo}` },
 { label: 'Transport', value: generatedPass.modeOfTransport },
 { label: 'Guests', value: `${generatedPass.totalAdults} Adults, ${generatedPass.totalChildren} Children, ${generatedPass.totalInfants} Infants` },
 { label: 'ID Check', value: generatedPass.checkGuestId ? '✅ Required' : '❌ Not Required' },
 ].map(item => (
 <div key={item.label} className="flex items-center justify-between gap-4 border-b border-[#2a2d33] pb-2 last:border-0">
 <span className="text-[#8a8f98] text-sm font-medium shrink-0">{item.label}</span>
 <span className="font-semibold text-sm text-white text-right">{item.value}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="mt-8 space-y-3">
 <button
 onClick={sharePass}
 className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:brightness-110 text-white font-semibold py-3.5 rounded-xl transition-all border-none"
 >
 <Share2 className="size-5" />
 Share via WhatsApp
 </button>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => window.print()}
 className="flex items-center justify-center gap-2 bg-[#2a2d33] hover:bg-[#3a3d43] text-white font-semibold py-3 rounded-xl transition-all text-sm border border-[#3a3d43]"
 >
 <Printer className="size-4" />
 Print Pass
 </button>
 <button
 onClick={() => {
 if (qrCodeData) {
 const link = document.createElement('a');
 link.download = `visitor-pass-${generatedPass.code}.png`;
 link.href = qrCodeData;
 link.click();
 }
 }}
 className="flex items-center justify-center gap-2 bg-[#2a2d33] hover:bg-[#3a3d43] text-white font-semibold py-3 rounded-xl transition-all text-sm border border-[#3a3d43]"
 >
 <Download className="size-4" />
 Download QR
 </button>
 </div>
 <div className="grid grid-cols-2 gap-3 pt-1">
 <button onClick={verifyEntry} disabled={generatedPass.securityVerified} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all border-none ${generatedPass.securityVerified ? 'bg-green-500/10 text-green-400 cursor-default' : 'bg-[#2a2d33] hover:bg-[#3a3d43] text-white'}`}>
 <ShieldCheck className="w-4 h-4" />
 {generatedPass.securityVerified ? 'Verified' : 'Verify'}
 </button>
 <button onClick={markExit} className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-semibold text-sm transition-all border-none">
 <LogOut className="size-4" />
 Mark Exit
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="mt-8">
 <button
 onClick={() => setGeneratedPass(null)}
 className="flex items-center gap-2 text-[#1241a1] font-semibold hover:text-[#1a51b1] border-none"
 >
 <ArrowLeft className="size-5" />
 Schedule Another Visitor
 </button>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
 {/* Form */}
 <div className="lg:col-span-3 bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
 <div className="p-6 border-b border-[#2a2d33]">
 <h3 className="text-xl font-bold text-white">Schedule New Visitor</h3>
 <p className="text-[#8a8f98] text-sm mt-1 font-medium">Complete the details below to authorize entry and generate a secure digital pass.</p>
 </div>
 <div className="p-6 space-y-7">
 {/* Guest Info */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 text-[#1241a1]">
 <User className="size-5" />
 <h4 className="font-bold uppercase tracking-wider text-xs text-white">Guest Information</h4>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Guest Name *</label>
 <input name="guestName" value={formData.guestName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm placeholder:text-[#8a8f98]/50" placeholder="e.g. John Doe" />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Phone Number *</label>
 <input name="guestPhone" type="tel" value={formData.guestPhone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm placeholder:text-[#8a8f98]/50" placeholder="+2348012345678" />
 </div>
 <div className="sm:col-span-2 space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Purpose of Visit</label>
 <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm appearance-none">
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
 <div className="flex items-center gap-2 text-[#1241a1]">
 <Calendar className="size-5" />
 <h4 className="font-bold uppercase tracking-wider text-xs text-white">Visit Details</h4>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Date *</label>
 <input type="date" name="inviteDate" value={formData.inviteDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">From *</label>
 <input type="time" name="inviteTimeFrom" value={formData.inviteTimeFrom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">To *</label>
 <input type="time" name="inviteTimeTo" value={formData.inviteTimeTo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 </div>
 </div>

 {/* Guest Count */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 text-[#1241a1]">
 <Users className="size-5" />
 <h4 className="font-bold uppercase tracking-wider text-xs text-white">Guest Count</h4>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Adults</label>
 <input type="number" name="totalAdults" value={formData.totalAdults} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Children</label>
 <input type="number" name="totalChildren" value={formData.totalChildren} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Infants</label>
 <input type="number" name="totalInfants" value={formData.totalInfants} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none text-sm" />
 </div>
 </div>
 </div>

 {/* Transport & Options */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 text-[#1241a1]">
 <Car className="size-5" />
 <h4 className="font-bold uppercase tracking-wider text-xs text-white">Transport & Options</h4>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-[#8a8f98]">Mode of Transport</label>
 <select name="modeOfTransport" value={formData.modeOfTransport} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all text-sm appearance-none">
 {TRANSPORT_MODES.map(mode => (
 <option key={mode.value} value={mode.value}>{mode.label}</option>
 ))}
 </select>
 </div>
 <div className="space-y-1.5 flex flex-col justify-end">
 <div className="flex items-center gap-6">
 <label className="flex items-center gap-2 text-sm font-medium text-[#8a8f98]">
 <input type="checkbox" name="searchGuest" checked={formData.searchGuest} onChange={handleChange} className="w-4 h-4 rounded border-[#3a3d43] bg-[#2a2d33] text-[#1241a1] focus:ring-[#1241a1] focus:ring-offset-0" />
 Search Guest
 </label>
 <label className="flex items-center gap-2 text-sm font-medium text-[#8a8f98]">
 <input type="checkbox" name="checkGuestId" checked={formData.checkGuestId} onChange={handleChange} className="w-4 h-4 rounded border-[#3a3d43] bg-[#2a2d33] text-[#1241a1] focus:ring-[#1241a1] focus:ring-offset-0" />
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
 className="w-full py-4 bg-[#1241a1] hover:bg-[#1a51b1] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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
 <p className="text-xs text-[#8a8f98] text-center">By generating a code, you take responsibility for your guest&apos;s conduct within the premises.</p>
 </div>
 </div>
 </div>

 {/* Preview Sidebar - Trading Style */}
 <div className="lg:col-span-2">
 <div className="h-full bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden flex flex-col">
 {/* Header */}
 <div className="p-4 border-b border-[#2a2d33]">
 <div className="flex items-center gap-2">
 <QrCode className="size-5 text-[#1241a1]" />
 <h3 className="font-bold text-sm text-white">Pass Preview</h3>
 <span className="ml-auto text-[10px] text-[#8a8f98] font-medium uppercase tracking-wider">Live Preview</span>
 </div>
 </div>

 {/* Content - Scrollable */}
 <div className="flex-1 overflow-y-auto p-6">
 {!formData.guestName && !formData.guestPhone ? (
 <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] gap-4">
 <div className="size-20 bg-[#2a2d33] rounded-full flex items-center justify-center">
 <QrCode className="size-10 text-[#1241a1]/50" />
 </div>
 <div>
 <h4 className="font-bold text-white">No Pass Generated</h4>
 <p className="text-sm text-[#8a8f98] max-w-[220px] font-medium mt-1">
 Fill out the form to generate a secure QR code and Entry PIN for your visitor.
 </p>
 </div>
 </div>
 ) : (
 <div className="space-y-5">
 {/* Visitor Summary Card */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3">
 Visitor Summary
 </h4>
 <div className="space-y-2.5">
 <PreviewRow label="Guest Name" value={formData.guestName || '—'} />
 <PreviewRow label="Phone" value={formData.guestPhone || '—'} />
 <PreviewRow label="Purpose" value={formData.purpose || '—'} />
 <PreviewRow label="Pass Type" value={formData.type || '—'} />
 </div>
 </div>

 {/* Visit Details Card */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3">
 Visit Details
 </h4>
 <div className="space-y-2.5">
 <PreviewRow 
 label="Date" 
 value={formData.inviteDate ? new Date(formData.inviteDate).toLocaleDateString('en-US', { 
 weekday: 'short', 
 year: 'numeric', 
 month: 'short', 
 day: 'numeric' 
 }) : '—'} 
 />
 <PreviewRow 
 label="Time" 
 value={`${formData.inviteTimeFrom || '—'} - ${formData.inviteTimeTo || '—'}`} 
 />
 <PreviewRow 
 label="Guests" 
 value={`${formData.totalAdults} Adult${formData.totalAdults !== 1 ? 's' : ''}, ${formData.totalChildren} Child${formData.totalChildren !== 1 ? 'ren' : ''}, ${formData.totalInfants} Infant${formData.totalInfants !== 1 ? 's' : ''}`} 
 />
 <PreviewRow label="Transport" value={formData.modeOfTransport} />
 </div>
 </div>

 {/* Options Card */}
 <div className="bg-[#2a2d33] rounded-xl p-4">
 <h4 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3">
 Security Options
 </h4>
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="text-[#8a8f98]">Search Guest</span>
 <span className={`font-semibold ${formData.searchGuest ? 'text-green-400' : 'text-[#8a8f98]'}`}>
 {formData.searchGuest ? '✅ Enabled' : '❌ Disabled'}
 </span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="text-[#8a8f98]">ID Check</span>
 <span className={`font-semibold ${formData.checkGuestId ? 'text-green-400' : 'text-[#8a8f98]'}`}>
 {formData.checkGuestId ? '✅ Required' : '❌ Not Required'}
 </span>
 </div>
 </div>
 </div>

 {/* QR Preview */}
 {formData.guestName && formData.guestPhone && (
 <div className="bg-[#2a2d33] rounded-xl p-4 flex items-center justify-between">
 <div>
 <p className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">QR Code</p>
 <p className="text-sm text-white mt-1">Ready to generate</p>
 </div>
 <div className="size-14 bg-[#1241a1]/10 rounded-xl flex items-center justify-center border-2 border-dashed border-[#1241a1]/30">
 <QrCode className="size-7 text-[#1241a1]" />
 </div>
 </div>
 )}

 {/* Payload Preview */}
 <details className="group">
 <summary className="flex items-center gap-2 text-xs font-semibold text-[#8a8f98] hover:text-white cursor-pointer transition-colors">
 <span className="uppercase tracking-wider">Payload Preview</span>
 <span className="text-[#8a8f98] group-open:rotate-180 transition-transform">▼</span>
 </summary>
 <div className="mt-3">
 <pre className="text-[10px] bg-[#2a2d33] p-3 rounded-xl overflow-x-auto max-h-[150px] overflow-y-auto text-[#8a8f98]">
 {JSON.stringify(buildPayload(formData), null, 2)}
 </pre>
 </div>
 </details>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* History Tab - Trading Style Table */}
 {activeTab === 'history' && (
 <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
 <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
 <div>
 <h3 className="font-bold text-lg text-white">Pass History</h3>
 <p className="text-xs text-[#8a8f98] font-medium">{passHistory.length} total passes</p>
 </div>
 <div className="flex items-center gap-2">
 <button className="p-2 hover:bg-[#2a2d33] rounded-lg transition-colors">
 <MoreHorizontal className="size-4 text-[#8a8f98]" />
 </button>
 </div>
 </div>
 {passHistory.length === 0 ? (
 <div className="p-12 text-center text-[#8a8f98]">
 <History className="size-10 mb-3 mx-auto opacity-50" />
 <p className="font-medium">No pass history yet</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-[#2a2d33]">
 <tr>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('guestName')}>
 Guest {renderSortIcon('guestName', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('code')}>
 Pass Code {renderSortIcon('code', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('type')}>
 Type {renderSortIcon('type', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('inviteDate')}>
 Date {renderSortIcon('inviteDate', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('modeOfTransport')}>
 Transport {renderSortIcon('modeOfTransport', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortHistory('totalAdults')}>
 Guests {renderSortIcon('totalAdults', historySort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider">Status</th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#2a2d33]">
 {getSortedHistory().map((pass, i) => (
 <tr key={pass.id || i} className="hover:bg-[#2a2d33]/50 transition-colors cursor-pointer" onClick={() => { viewPassDetails(pass); loadPassDetails(pass.id); }}>
 <td className="px-4 py-3 font-medium text-white">{pass.guestName}</td>
 <td className="px-4 py-3 font-mono text-xs text-[#1241a1]">{pass.code}</td>
 <td className="px-4 py-3">
 <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#1241a1]/20 text-[#1241a1] uppercase">
 {pass.type}
 </span>
 </td>
 <td className="px-4 py-3 text-xs text-white">{pass.inviteDate ? new Date(pass.inviteDate).toLocaleDateString() : '—'}</td>
 <td className="px-4 py-3 text-xs text-white capitalize">{pass.modeOfTransport}</td>
 <td className="px-4 py-3 text-xs text-white">
 {pass.totalAdults}A {pass.totalChildren > 0 ? `, ${pass.totalChildren}C` : ''} {pass.totalInfants > 0 ? `, ${pass.totalInfants}I` : ''}
 </td>
 <td className="px-4 py-3">
 <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest ${
 pass.isActive && !pass.isUsed ? 'bg-green-500/20 text-green-400' :
 pass.isUsed ? 'bg-[#8a8f98]/20 text-[#8a8f98]' :
 'bg-amber-500/20 text-amber-400'
 }`}>
 {pass.isActive && !pass.isUsed ? 'Active' : pass.isUsed ? 'Used' : 'Expired'}
 </span>
 </td>
 <td className="px-4 py-3">
 <button className="p-1.5 hover:bg-[#2a2d33] rounded-lg transition-colors border-none bg-transparent">
 <Eye className="w-4 h-4 text-[#8a8f98] hover:text-white" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 )}

 {/* Logs Tab - Trading Style Table */}
 {activeTab === 'logs' && (
 <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
 <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
 <div>
 <h3 className="font-bold text-lg text-white">Activity Logs</h3>
 <p className="text-xs text-[#8a8f98] font-medium">{entryExitLogs.length} total entries</p>
 </div>
 </div>
 {entryExitLogs.length === 0 ? (
 <div className="p-12 text-center text-[#8a8f98]">
 <Activity className="size-10 mb-3 mx-auto opacity-50" />
 <p className="font-medium">No activity logged yet</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-[#2a2d33]">
 <tr>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortLogs('visitor')}>
 Visitor {renderSortIcon('visitor', logsSort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortLogs('type')}>
 Type {renderSortIcon('type', logsSort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortLogs('passCode')}>
 Pass Code {renderSortIcon('passCode', logsSort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => sortLogs('timestamp')}>
 Timestamp {renderSortIcon('timestamp', logsSort)}
 </th>
 <th className="px-4 py-3 text-left font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider">Verified By</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#2a2d33]">
 {getSortedLogs().map((log, i) => (
 <tr key={log.id || i} className="hover:bg-[#2a2d33]/50 transition-colors">
 <td className="px-4 py-3 font-medium text-white">{log.visitor}</td>
 <td className="px-4 py-3">
 <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
 log.type === 'entry' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
 }`}>
 {log.type}
 </span>
 </td>
 <td className="px-4 py-3 font-mono text-xs text-[#1241a1]">{log.passCode}</td>
 <td className="px-4 py-3 text-xs text-white">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
 <td className="px-4 py-3 text-xs text-white">{log.verifiedBy || 'Security'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 )}

 {/* Blacklist Tab - Trading Style */}
 {activeTab === 'blacklist' && (
 <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
 <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
 <h3 className="font-bold text-lg text-white flex items-center gap-2">
 <Ban className="size-5 text-[#8a8f98]" />
 Blacklisted Visitors
 </h3>
 <button onClick={addToBlacklist} className="flex items-center gap-2 px-4 py-2 bg-[#1241a1] hover:bg-[#1a51b1] text-white rounded-xl text-sm font-bold transition-colors border-none">
 <Plus className="w-4 h-4" />
 Add Entry
 </button>
 </div>
 {blacklistedVisitors.length === 0 ? (
 <div className="p-12 text-center text-[#8a8f98]">
 <ShieldCheck className="size-10 mb-3 mx-auto opacity-50" />
 <p className="font-medium">No blacklisted visitors</p>
 </div>
 ) : (
 <div className="divide-y divide-[#2a2d33]">
 {blacklistedVisitors.map((v, i) => (
 <div key={i} className="p-4 flex items-center justify-between hover:bg-[#2a2d33]/50 transition-colors">
 <div className="flex items-center gap-3">
 <div className="size-9 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm">
 {v.name?.charAt(0) || 'B'}
 </div>
 <div>
 <p className="font-semibold text-sm text-white">{v.name}</p>
 <p className="text-xs text-[#8a8f98]">{v.reason}</p>
 </div>
 </div>
 <button onClick={() => removeFromBlacklist(i)} className="text-xs text-[#8a8f98] hover:text-red-400 font-bold transition-colors border-none bg-transparent">
 Remove
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 <footer className="mt-12 py-6 text-center">
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8a8f98]">© 2024 EMSS Visitor Management</p>
 </footer>

 {/* Modals */}
 <AlertModal 
 isOpen={alertConfig.isOpen} 
 onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
 title={alertConfig.title}
 message={alertConfig.message}
 type={alertConfig.type}
 />
 
 {renderPromptModal()}
 {renderPassDetailsModal()}
 </div>
 );
}