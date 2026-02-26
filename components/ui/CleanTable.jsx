import React from 'react';

/**
 * Clean, minimalist table component.
 * @param {object} props
 * @param {string[]} props.headers - Array of header strings
 * @param {any[]} props.data - Array of data objects
 * @param {function} props.renderRow - Function to render a row (receives item, index)
 * @param {string} props.className - Extra classes
 * @param {React.ReactNode} props.emptyState - Content to show if data is empty
 */
export function CleanTable({ headers, data, renderRow, className = '', emptyState }) {
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
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 font-semibold text-gray-900 font-heading whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
