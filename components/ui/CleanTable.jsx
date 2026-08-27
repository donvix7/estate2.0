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
      <div className={`p-8 text-center text-white0 italic ${className}`}>
        {emptyState || 'No data available'}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#1a1d23]/50 bg-[#0B0C11] border-none">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3.5 font-bold text-[#8a8f98] text-[11px] uppercase tracking-wider whitespace-nowrap border-none">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {data.map((item, index) => (
            <tr 
              key={index} 
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`hover:bg-[#1a1d23]/40 hover:bg-[#151622] transition-colors border-none group ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}
