"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardFooter, CardHeader, Input, Button } from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import { CreditCard, Lock, User, FileText, Banknote, Mail } from 'lucide-react';

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
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                    <p className="ml-3 text-gray-300">Loading payment form...</p>
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

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
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
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
                <div className="flex items-center gap-4 mb-8 text-white">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Make a Payment</h3>
                        <p className="text-gray-400">Secure payment via Paystack</p>
                    </div>
                </div>

                {!isConfigValid && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-300 text-sm">
                            ⚠️ Payment system is not configured. Please check environment variables.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium flex items-center gap-2">
                                <Banknote className="w-4 h-4" />
                                Amount (₦)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    min="100"
                                    max="1000000"
                                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all pl-12"
                                    {...register("amount")}
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    ₦
                                </div>
                            </div>
                            {errors.amount && (
                                <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-300 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="Enter payment description"
                            className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-300 font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Account Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter 10-digit account number"
                            className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                            {...register("accountNumber")}
                        />
                        {errors.accountNumber && (
                            <p className="text-red-400 text-sm mt-1">{errors.accountNumber.message}</p>
                        )}
                    </div>

                    {isConfigValid ? (
                        email && amount >= 100 ? (
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Pay Now - ₦{amount.toLocaleString()}
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-4">
                                    You will be redirected to Paystack's secure payment page
                                </p>
                            </div>
                        ) : (
                            <div className="mt-8 p-4 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <span className="text-amber-400 text-sm">!</span>
                                    </div>
                                    <div>
                                        <p className="text-amber-300 font-medium">Complete all fields</p>
                                        <p className="text-amber-400 text-sm">
                                            Please enter a valid email and amount (minimum ₦100) to proceed with payment
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="mt-8 p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <span className="text-red-400 text-sm">!</span>
                                </div>
                                <div>
                                    <p className="text-red-300 font-medium">System Configuration Error</p>
                                    <p className="text-red-400 text-sm">
                                        Payment system is not configured. Please check environment variables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Paystack Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🇳🇬</span>
                            <span>NGN Only</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}