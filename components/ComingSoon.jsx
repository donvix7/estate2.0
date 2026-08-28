import React from 'react';
import { Hammer } from 'lucide-react';

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This page is currently under construction. Check back soon for updates!",
  icon: Icon = Hammer
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
      <div className="w-24 h-24 bg-[#1a1d23] rounded-full flex items-center justify-center mb-6 shadow-sm ">
        <Icon className="w-12 h-12 text-blue-500" />
      </div>
      <span className="text-3xl font-bold text-white text-white mb-4">
        {title}
      </span>
      <p className="text-[#8a8f98] text-[#8a8f98]  mx-auto text-lg leading-relaxed">
        {description}
      </p>
      
      <div className="mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 bg-blue-900/20 text-blue-600 text-blue-400 rounded-full text-sm font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          In Development
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
