import React from 'react';

/**
 * Clean, minimalist table component.
 * @param {object} props
 * @param {string[]} props.headers - Array of header strings
 * @param {any[]} props.data - Array of data objects
 * @param {function} props.renderRow - Function to render a row (receives item, index)
 * @param {string} props.className - Extra classes
 * @param {React.ReactNode} props.emptyState - Content to show if data is empty
 * @param {function} [props.onRowClick] - Optional row click handler
 */
export function CleanTable({ headers, data, renderRow, className = '', emptyState, onRowClick }) {
  if (!data || data.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 italic ${className}`}>
        {emptyState || 'No data available'}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 font-heading whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {data.map((item, index) => (
            <tr 
              key={index} 
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
