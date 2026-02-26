import React from 'react';
import { Hammer } from 'lucide-react';

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This page is currently under construction. Check back soon for updates!",
  icon: Icon = Hammer
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fadeIn">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <Icon className="w-12 h-12 text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
        {description}
      </p>
      
      <div className="mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/30 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          In Development
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
