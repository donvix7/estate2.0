"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardFooter, CardHeader, Input, Button } from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import { CreditCard, Lock, User, FileText, Banknote, Mail, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    amount: z.coerce.number().min(100, "Amount must be at least ₦100").max(1000000, "Amount must be at most ₦1,000,000"),
    description: z.string().min(1, "Description must be at least 1 character long"),
    accountNumber: z.string().min(10, "Account number must be at least 10 digits").max(10, "Account number must be 10 digits"),
});

export default function PaystackPayment() {
    // ========== ALL HOOKS AT THE TOP (UNCONDITIONAL) ==========
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const scriptLoadedRef = useRef(false);
    
    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            amount: 100,
            description: "",
            accountNumber: "",
        },
    });

    const { register, watch, handleSubmit, formState: { errors } } = formMethods;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            // Cleanup if needed
        };
    }, []);

    // ========== ALL OTHER LOGIC AFTER HOOKS ==========
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const email = watch("email");
    const amount = watch("amount") || 0;
    const name = watch("name");
    const description = watch("description");
    const accountNumber = watch("accountNumber");

    // Show loading state during SSR hydration
    if (!isMounted) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8">
                <div className="flex justify-center items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading payment portal...</p>
                </div>
            </div>
        );
    }

    // Check for PUBLIC_KEY - but DO NOT return early with hooks
    const isConfigValid = !!PUBLIC_KEY;

    const initializePayment = () => {
        if (!isConfigValid) {
            toast.error("Payment system configuration error");
            return;
        }

        if (!email || !amount || amount < 100) {
            toast.error("Please fill in all required fields with valid values");
            return;
        }

        setIsLoading(true);
        
        const loadAndInitializePaystack = () => {
            const handler = window.PaystackPop.setup({
                key: PUBLIC_KEY,
                email: email,
                amount: Math.round(amount * 100), // Convert to kobo
                ref: `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                metadata: {
                    name: name,
                    custom_fields: [
                        {
                            display_name: "Account Number",
                            variable_name: "account_number",
                            value: accountNumber || "",
                        },
                        {
                            display_name: "Description",
                            variable_name: "description",
                            value: description || "",
                        },
                    ],
                },
                currency: "NGN",
                callback: (response) => {
                    setIsLoading(false);
                    toast.success(`Payment successful! Reference: ${response.reference}`);
                    console.log("Payment successful:", response);
                    // Reset form after successful payment
                    formMethods.reset();
                },
                onClose: () => {
                    setIsLoading(false);
                    toast.warn("Transaction cancelled by user");
                },
            });
            
            handler.openIframe();
        };

        if (window.PaystackPop) {
            loadAndInitializePaystack();
        } else {
            // Load Paystack script dynamically
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            
            script.onload = () => {
                scriptLoadedRef.current = true;
                loadAndInitializePaystack();
            };
            
            script.onerror = () => {
                setIsLoading(false);
                scriptLoadedRef.current = false;
                toast.error('Failed to load payment system');
            };
            
            document.head.appendChild(script);
        }
    };

    const handleProceed = (data) => {
        // Validation happens via react-hook-form before this is called
        setShowPreview(true);
    };

    const confirmPayment = () => {
        initializePayment();
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            
            <div className="max-w-2xl mx-auto">
                
                {/* Main Form */}
                <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] p-6 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                            <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-heading">Make a Payment</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Fill payment details</p>
                        </div>
                    </div>
                </div>

                {!isConfigValid && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                            <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                        </div>
                        <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                            Payment system is currently unavailable. Please check the system configuration or contact support.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(handleProceed)} className="space-y-6">
                    <div className="grid grid-cols-1  gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="E.g., John Doe"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="E.g., john@example.com"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter secure password"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-gray-400" />
                                Amount (₦)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    min="100"
                                    max="1000000"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm font-semibold"
                                    {...register("amount")}
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                    ₦
                                </div>
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.amount.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="E.g., Service Charge for August"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            Account Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter 10-digit building account number"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all shadow-sm"
                            {...register("accountNumber")}
                        />
                        {errors.accountNumber && (
                            <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.accountNumber.message}</p>
                        )}
                    </div>
                </form>
                
                {/* Submit Area */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                     {isConfigValid ? (
                        email && amount >= 100 ? (
                            <button
                                onClick={handleSubmit(handleProceed)}
                                className="w-full md:w-auto md:ml-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.99] group"
                            >
                                Proceed to Review
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="w-full p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-center justify-center md:items-start md:justify-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                                <p className="text-amber-700 dark:text-amber-400/80 text-sm font-medium text-center md:text-left">
                                    Fill required fields to proceed
                                </p>
                            </div>
                        )
                    ) : null}
                </div>
            </div>

            {/* Modal: Transaction Preview */}
            {showPreview && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
                    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200 mt-10 md:mt-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 relative z-10 bg-gray-50/80 dark:bg-gray-900/80">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                Transaction Preview
                            </h3>
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>

                        {/* Body */}
                        <div className="p-6 space-y-2 relative z-10 max-h-[50vh] overflow-y-auto">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Recipient</span>
                                <span className="text-gray-900 dark:text-white font-semibold">Estate 2.0 Management</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Payer Name</span>
                                <span className="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[150px] text-right">
                                    {name || <span className="text-gray-300 dark:text-gray-600 italic">Not specified</span>}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Description</span>
                                <span className="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[150px] text-right">
                                    {description || <span className="text-gray-300 dark:text-gray-600 italic">Not specified</span>}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Account No.</span>
                                <span className="text-gray-900 dark:text-white text-sm font-mono bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded">
                                    {accountNumber || <span className="text-gray-300 dark:text-gray-600 italic">----------</span>}
                                </span>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">Total Amount</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">NGN</span>
                                </div>
                                <div className="flex justify-end items-end gap-1">
                                    <span className="text-3xl font-black text-blue-600 dark:text-blue-500">
                                        ₦{Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Actions */}
                        <div className="p-6 pt-4 bg-gray-50/80 dark:bg-gray-900/80 flex flex-col items-center">
                            {isConfigValid ? (
                                <div className="w-full space-y-3">
                                    <button
                                        onClick={confirmPayment}
                                        disabled={isLoading}
                                        className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.99] group mt-1"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/40 border-t-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                Confirm & Pay ₦{Number(amount).toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        disabled={isLoading}
                                        className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all text-sm shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.99]"
                                    >
                                        Cancel & Edit Details
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full space-y-3">
                                    <div className="w-full p-4 mt-1 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                                        <div className="mt-0.5 w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-red-600 dark:text-red-400 text-sm font-bold">!</span>
                                        </div>
                                        <div>
                                            <p className="text-red-800 dark:text-red-300 font-bold text-sm">Offline</p>
                                            <p className="text-red-700 dark:text-red-400/80 text-xs mt-1 font-medium leading-relaxed">
                                                Payment gateway is not currently configured.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all text-sm shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.99]"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col items-center w-full">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium justify-center uppercase tracking-wider mb-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    Secured by Paystack
                                </div>
                                <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 font-medium flex justify-center flex-wrap items-center gap-1.5">
                                    By confirming, you agree to our Terms of Service
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}