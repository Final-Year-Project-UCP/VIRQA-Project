'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NotificationPagination = ({ currentPage, totalPages, onPageChange, hasMore, onLoadMore }) => {
  if (totalPages <= 1 && !hasMore) return null;

  // Load More Button (for infinite scroll style)
  if (hasMore) {
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={onLoadMore}
          className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Load More Notifications
        </button>
      </div>
    );
  }

  // Numbered Pagination
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : typeof page === 'number'
              ? 'border border-gray-300 hover:border-gray-400 text-gray-700'
              : 'text-gray-500 cursor-default'
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default NotificationPagination;