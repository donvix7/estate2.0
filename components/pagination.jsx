import React from 'react';

const Pagination = ({ page, totalPages, handlePageChange }) => {
  // Ensure we have numbers and reasonable defaults
  const currentPage = Number(page) || 1;
  const total = Number(totalPages) || 1;

  if (total < 1) return null;

  return (
    <div className="flex justify-center items-center mt-10 gap-4 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-none ${
          currentPage <= 1 
          ? 'bg-[#1a1d23]/40 bg-[#1a1d23]/20 text-[#8a8f98] cursor-not-allowed' 
          : 'bg-[#1a1d23]/40 bg-[#12131C] text-white text-white hover:bg-[#1a1d23]/70 hover:bg-[#1A1B28] shadow-sm active:scale-95'
        }`}
      >
        <span>&larr;</span> Previous
      </button>
      
      <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#1a1d23]/90 bg-[#0B0C11] rounded-full border-none shadow-inner">
        <span className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider">Page</span>
        <div className="flex items-center justify-center size-6 bg-[#1a1d23] text-white rounded-full text-xs font-bold shadow-sm">
          {currentPage}
        </div>
        <span className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider">of</span>
        <span className="text-xs font-bold text-white text-white">{total}</span>
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= total}
        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-none ${
          currentPage >= total 
          ? 'bg-[#1a1d23]/40 bg-[#1a1d23]/20 text-[#8a8f98] cursor-not-allowed' 
          : 'bg-[#1a1d23]/40 bg-[#12131C] text-white text-white hover:bg-[#1a1d23]/70 hover:bg-[#1A1B28] shadow-sm active:scale-95'
        }`}
      >
        Next <span>&rarr;</span>
      </button>
    </div>

  );
};

export default Pagination;