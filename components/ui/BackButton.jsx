'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ 
  fallbackRoute = '/dashboard/admin', 
  label = 'Back',
  className = '' 
}) {
  const router = useRouter();

  const handleBack = () => {
    // If there's no history, standard router.back() might do nothing 
    // or return to an unwanted external blank page. 
    // This simple approach uses router.back(), but you could conditionally check `window.history.length`
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6 pb-2 border-none bg-transparent cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
