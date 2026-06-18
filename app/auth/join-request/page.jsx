"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle,
  HelpCircle,
  Send,
  User,
  Mail,
  Phone,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getAllEstates, getResidentData } from '@/lib/service';
import { sendJoinRequest } from '@/lib/action';

const JoinRequestPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    estate: '',
  });
  const [estates, setEstates] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await getResidentData();
      if (data) setFormData(prev => ({ ...prev, ...data }));
      const estateList = await getAllEstates();
      if (estateList) setEstates(estateList);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.estate) {
      showNotification('Please select an estate before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendJoinRequest(formData.estate);
      if (res?.success) {
        showNotification(res.message || 'Join request submitted successfully.', 'success');
        setTimeout(() => router.push('/'), 2000);
      } else {
        showNotification(res?.message || 'Failed to submit join request.', 'warning');
      }
    } catch (error) {
      showNotification(error.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEstateName = estates.find(e => e.id === formData.estate)?.estateName || '';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/80 via-slate-900 to-slate-900" />

      {/* Main Card */}
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-white/95 min-h-[500px] dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">

        {/* Left Side: User Profile Info */}
        <div className="md:flex flex-1 flex-col justify-between p-10 bg-[#1241a1]/10">
          <div className="space-y-4">
            <div className="mt-4">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <User className="size-4 text-[#1241a1]" />
                  Your Details
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/40  dark:border-slate-700/50 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#1241a1]/20 flex items-center justify-center text-[#1241a1] shrink-0">
                  <User className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {formData.firstName || formData.lastName || formData.username
                      ? `${formData.firstName} ${formData.lastName || formData.username}`.trim()
                      : <span className="text-slate-400 italic">Loading...</span>}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/40  dark:border-slate-700/50 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#1241a1]/20 flex items-center justify-center text-[#1241a1] shrink-0">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {formData.email || <span className="text-slate-400 italic">Loading...</span>}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/40  dark:border-slate-700/50 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#1241a1]/20 flex items-center justify-center text-[#1241a1] shrink-0">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {formData.phone || <span className="text-slate-400 italic">Loading...</span>}
                  </p>
                </div>
              </div>

              {/* Selected estate preview */}
              {selectedEstateName && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20  dark:border-emerald-700/30 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Selected Estate</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{selectedEstateName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Main Form */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Home className="size-6 text-[#1241a1]" />
              Request to Join Estate
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Select an estate from the dropdown and submit your join request
            </p>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="size-5 shrink-0" />
              ) : (
                <HelpCircle className="size-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            {/* Estate List Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                <Building2 className="inline size-4 mr-1" />
                Available Estates
              </label>

              {/* Search field */}
              <div className="relative mb-2">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search estates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl py-2.5 pl-9 pr-4 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition shadow-sm text-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Estate list */}
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-0.5">
                {estates.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">Loading estates...</div>
                ) : (() => {
                  const filtered = estates.filter(e =>
                    e.estateName?.toLowerCase().includes(search.toLowerCase())
                  ).slice(0, 5);
                  return filtered.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No estates match your search.</div>
                  ) : filtered.map(estate => {
                    const isSelected = formData.estate === estate.id;
                    return (
                      <button
                        key={estate.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, estate: estate.id }))}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#1241a1]/10 border-[#1241a1]/40 ring-1 ring-[#1241a1]/30'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 hover:border-[#1241a1]/30 hover:bg-[#1241a1]/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#1241a1] text-white' : 'bg-[#1241a1]/10 text-[#1241a1]'
                        }`}>
                          <Building2 className="size-4" />
                        </div>
                        <span className={`text-sm font-medium flex-1 ${
                          isSelected ? 'text-[#1241a1]' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {estate.estateName}
                        </span>
                        {isSelected && (
                          <CheckCircle className="size-4 text-[#1241a1] shrink-0" />
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
              {estates.filter(e => e.estateName?.toLowerCase().includes(search.toLowerCase())).length > 5 && (
                <p className="text-xs text-slate-400 mt-1.5 ml-1">
                  Showing 5 of {estates.filter(e => e.estateName?.toLowerCase().includes(search.toLowerCase())).length} — refine your search to see more.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.estate}
              className="w-full sm:w-auto self-start bg-[#1241a1] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  Submit Request
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-auto pt-4 text-center border-t border-slate-200/60 dark:border-slate-700/40">
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                <HelpCircle className="inline size-3 mr-1" />
                Need help?{' '}
                <Link href="/auth/login" className="text-[#1241a1] font-medium hover:underline ml-1">
                  Return to login page
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestPage;