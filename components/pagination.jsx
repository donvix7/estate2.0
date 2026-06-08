import React from 'react';

const Pagination = ({ page, totalPages, handlePageChange }) => {
  // Ensure we have numbers and reasonable defaults
  const currentPage = Number(page) || 1;
  const total = Number(totalPages) || 1;

  if (total < 1) return null;

  return (
    <div className="flex justify-center items-center mt-10 gap-6 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
          currentPage <= 1 
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600' 
          : 'bg-white dark:bg-slate-900 text-[#1241a1] hover:bg-[#1241a1] hover:text-white shadow-sm border-none active:scale-95'
        }`}
      >
        <span>&larr;</span> Previous
      </button>
      
      <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl  shadow-inner">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page</span>
        <div className="flex items-center justify-center size-8 bg-white dark:bg-[#1241a1] text-[#1241a1] dark:text-white rounded-lg text-sm font-black shadow-sm">
          {currentPage}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of</span>
        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{total}</span>
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= total}
        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
          currentPage >= total 
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600' 
          : 'bg-white dark:bg-slate-900 text-[#1241a1] hover:bg-[#1241a1] hover:text-white shadow-sm border-none active:scale-95'
        }`}
      >
        Next <span>&rarr;</span>
      </button>
    </div>
  );
};

export default Pagination;