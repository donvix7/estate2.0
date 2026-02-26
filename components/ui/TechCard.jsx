import React from 'react';

/**
 * Clean, modern card component for the dashboard.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {boolean} props.hoverEffect - Whether to show hover shadow
 * @param {boolean} props.noPadding - Remove default padding
 */
export function TechCard({ children, className = '', hoverEffect = true, noPadding = false }) {
  return (
    <div 
      className={`
        bg-white rounded-xl  shadow-sm 
        ${hoverEffect ? 'hover:shadow-md transition-shadow duration-200' : ''} 
        ${noPadding ? 'p-0 overflow-hidden' : 'p-6'}
        ${className}
        dark:bg-gray-800
      `}
    >
      {children}
    </div>
  );
}
