"use client";

import { useBrowseState } from "@/hooks/use-browse-state";

export function Pagination({ 
  currentPage, 
  totalPages 
}: { 
  currentPage: number, 
  totalPages: number 
}) {
  const { setParams } = useBrowseState();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="join w-full justify-center mt-8">
      <button 
        className="join-item btn"
        disabled={currentPage === 1}
        onClick={() => setParams({ page: currentPage - 1 })}
      >
        «
      </button>
      
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <button key={`ellipsis-${index}`} className="join-item btn btn-disabled">
              ...
            </button>
          );
        }
        
        return (
          <button 
            key={page}
            className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
            onClick={() => setParams({ page: page as number })}
          >
            {page}
          </button>
        );
      })}
      
      <button 
        className="join-item btn"
        disabled={currentPage === totalPages}
        onClick={() => setParams({ page: currentPage + 1 })}
      >
        »
      </button>
    </div>
  );
}
