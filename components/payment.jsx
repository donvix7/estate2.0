"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import { Lock, FileText, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    amount: z.coerce.number().min(100, "Amount must be at least ₦100").max(1000000, "Max ₦1,000,000"),
    description: z.string().min(1, "Description is required"),
    accountNumber: z.string().min(10, "Account number must be 10 digits").max(10, "Account number must be 10 digits"),
});

const PAYMENT_TABS = [
    { id: 'card', label: 'Card', icon: 'credit_card' },
    { id: 'bank', label: 'Bank', icon: 'account_balance' },
    { id: 'digital', label: 'Digital', icon: 'contactless' },
];

export default function PaystackPayment() {
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('card');
    const [saveCard, setSaveCard] = useState(false);
    const scriptLoadedRef = useRef(false);

    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", amount: 100, description: "", accountNumber: "" },
    });

    const { register, watch, handleSubmit, formState: { errors } } = formMethods;

    useEffect(() => { setIsMounted(true); }, []);

    const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const email = watch("email");
    const amount = watch("amount") || 0;
    const name = watch("name");
    const description = watch("description");
    const accountNumber = watch("accountNumber");

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="size-5 border-2 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading payment portal...</p>
                </div>
            </div>
        );
    }

    const isConfigValid = !!PUBLIC_KEY;

    const initializePayment = () => {
        if (!isConfigValid) { toast.error("Payment system configuration error"); return; }
        if (!email || !amount || amount < 100) { toast.error("Please fill in all required fields"); return; }
        setIsLoading(true);

        const loadAndInitializePaystack = () => {
            const handler = window.PaystackPop.setup({
                key: PUBLIC_KEY, email, amount: Math.round(amount * 100),
                ref: `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                metadata: { name, custom_fields: [{ display_name: "Account Number", variable_name: "account_number", value: accountNumber || "" }, { display_name: "Description", variable_name: "description", value: description || "" }] },
                currency: "NGN",
                callback: (response) => { setIsLoading(false); toast.success(`Payment successful! Ref: ${response.reference}`); formMethods.reset(); setShowPreview(false); },
                onClose: () => { setIsLoading(false); toast.warn("Transaction cancelled by user"); },
            });
            handler.openIframe();
        };

        if (window.PaystackPop) {
            loadAndInitializePaystack();
        } else {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = () => { scriptLoadedRef.current = true; loadAndInitializePaystack(); };
            script.onerror = () => { setIsLoading(false); toast.error('Failed to load payment system'); };
            document.head.appendChild(script);
        }
    };

    const handleProceed = () => setShowPreview(true);

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

            {/* ── Payment Method Tabs ── */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {PAYMENT_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            activeTab === tab.id
                                ? 'border-[#1241a1] bg-[#1241a1]/5 text-[#1241a1]'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500'
                        }`}
                    >
                        <span className="material-symbols-outlined">{tab.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-tight">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Card Form (active tab) ── */}
            {activeTab === 'digital' && (
                <form onSubmit={handleSubmit(handleProceed)} className="space-y-4">
                    {!isConfigValid && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-red-700 dark:text-red-300 text-sm font-medium">Payment system is currently unavailable. Contact support.</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm" {...register("email")} />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail</span>
                        </div>
                        {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Amount (₦)</label>
                            <input type="number" placeholder="0.00" min="100" max="1000000" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm font-semibold" {...register("amount")} />
                            {errors.amount && <p className="text-red-500 text-xs font-medium">{errors.amount.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                Password
                                <span className="material-symbols-outlined text-xs text-slate-400" title="Used to verify your identity">help</span>
                            </label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm" {...register("password")} />
                            {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                        <input type="text" placeholder="10-digit building account number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm" {...register("accountNumber")} />
                        {errors.accountNumber && <p className="text-red-500 text-xs font-medium">{errors.accountNumber.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description / Reason</label>
                        <input type="text" placeholder="e.g. Service Charge for October" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition-all text-sm" {...register("description")} />
                        {errors.description && <p className="text-red-500 text-xs font-medium">{errors.description.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 py-2">
                        <input id="save-card" type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="size-4 rounded border-slate-300 dark:border-slate-600 text-[#1241a1] focus:ring-[#1241a1] bg-transparent" />
                        <label htmlFor="save-card" className="text-sm text-slate-600 dark:text-slate-400 select-none">Save details for future payments</label>
                    </div>

                    <button
                        type="submit"
                        disabled={!isConfigValid}
                        className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1241a1]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Proceed to Review — ₦{Number(amount || 0).toLocaleString()}
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">lock</span>
                    </button>
                </form>
            )}

            {/* ── Bank Tab Placeholder ── */}
            {activeTab === 'bank' && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-slate-400">account_balance</span>
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Bank Transfer</p>
                    <p className="text-sm text-slate-400 max-w-xs">Direct bank payments are coming soon. Use the Card option to pay now.</p>
                </div>
            )}

            {/* ── Digital Wallet Placeholder ── */}
            {activeTab === 'card' && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-slate-400">contactless</span>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs">Apple Pay, Google Pay, and USSD options are coming soon.</p>
                </div>
            )}

            {/* ── Accepted Providers ── */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
                <div className="flex gap-3 opacity-60">
                    {['VISA', 'MASTERCARD', 'VERVE', 'PAYSTACK'].map(brand => (
                        <div key={brand} className="h-6 px-2 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                            <span className="text-[8px] font-black">{brand}</span>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest leading-loose">
                    Payments processed securely by Paystack. By confirming, you agree to our terms of service.
                </p>
            </div>

            {/* ── Preview Modal ── */}
            {showPreview && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#1241a1]" />
                                Transaction Preview
                            </h3>
                            <button onClick={() => setShowPreview(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            {[
                                { label: 'Recipient', value: 'Estate Management' },
                                { label: 'Payer', value: name || <span className="text-slate-400 italic text-sm">Not specified</span> },
                                { label: 'Description', value: description || <span className="text-slate-400 italic text-sm">Not specified</span> },
                                { label: 'Account No.', value: <span className="font-mono text-sm">{accountNumber || '----------'}</span> },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between py-1.5">
                                    <span className="text-slate-500 text-sm">{item.label}</span>
                                    <span className="font-semibold text-sm text-right max-w-[60%] truncate">{item.value}</span>
                                </div>
                            ))}
                            <div className="bg-[#1241a1]/5 dark:bg-[#1241a1]/10 rounded-xl p-5 mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">Total Amount</span>
                                    <span className="text-slate-400 text-xs font-bold uppercase">NGN</span>
                                </div>
                                <p className="text-3xl font-black text-[#1241a1] text-right">
                                    ₦{Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0 space-y-3">
                            {isConfigValid ? (
                                <button
                                    onClick={initializePayment}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <><span className="animate-spin size-5 border-2 border-white/30 border-t-white rounded-full"></span>Processing...</>
                                    ) : (
                                        <><Lock className="w-5 h-5" />Confirm &amp; Pay ₦{Number(amount).toLocaleString()}</>
                                    )}
                                </button>
                            ) : (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-red-700 dark:text-red-300 text-sm font-medium">Payment gateway is not configured.</p>
                                </div>
                            )}
                            <button onClick={() => setShowPreview(false)} disabled={isLoading} className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all text-sm border border-slate-200 dark:border-slate-700">
                                Cancel &amp; Edit Details
                            </button>
                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                Secured by Paystack
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}