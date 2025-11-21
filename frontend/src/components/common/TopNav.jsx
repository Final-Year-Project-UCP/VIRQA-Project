'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropDown';

const TopNavbar = ({ onMenuToggle, sidebarOpen, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultStats, setResultStats] = useState({ visible: 0, total: 0 });
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();

  // Clear on route change
  useEffect(() => {
    setSearchQuery('');
    setHasSearched(false);
    setResultStats({ visible: 0, total: 0 });
    setIsSearchExpanded(false);
  }, [location.pathname]);

  // Focus input when expanded on mobile
  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // PROFESSIONAL SEARCH + SMART HIGHLIGHTING
  useEffect(() => {
    const query = searchQuery.trim();
    const items = document.querySelectorAll('.page-search-item');
    const total = items.length;

    if (!query) {
      items.forEach(el => {
        el.classList.remove('hidden');
        if (el.dataset.originalText) {
          el.innerHTML = el.dataset.originalText;
        }
      });
      setResultStats({ visible: total, total });
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    let visibleCount = 0;
    const lowerQuery = query.toLowerCase();

    // Escape regex special chars
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedQuery = escapeRegex(query);

    // Regex for partial match (anywhere)
    const partialRegex = new RegExp(`(${escapedQuery})`, 'gi');
    // Regex for full word match (with word boundaries)
    const fullWordRegex = new RegExp(`\\b(${escapedQuery})\\b`, 'gi');

    items.forEach(el => {
      const originalText = el.dataset.originalText || el.textContent.trim();
      if (!el.dataset.originalText) el.dataset.originalText = originalText;

      const lowerText = originalText.toLowerCase();

      if (lowerText.includes(lowerQuery)) {
        el.classList.remove('hidden');
        visibleCount++;

        // First: mark full word matches in RED
        let highlighted = originalText.replace(fullWordRegex, '<mark class="search-full-match">$1</mark>');
        // Then: mark remaining partial matches in YELLOW
        highlighted = highlighted.replace(partialRegex, '<mark class="search-partial-match">$1</mark>');
        // Clean up double-marked (in case of overlap)
        highlighted = highlighted.replace(/<mark class="search-partial-match">(<mark class="search-full-match">.*?<\/mark>)<\/mark>/g, '$1');

        el.innerHTML = highlighted;
      } else {
        el.classList.add('hidden');
      }
    });

    setResultStats({ visible: visibleCount, total });
  }, [searchQuery]);

  const showNoResults = hasSearched && searchQuery && resultStats.visible === 0;

  const handleSearchToggle = () => {
    if (isMobile) {
      setIsSearchExpanded(!isSearchExpanded);
      if (!isSearchExpanded && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 100);
      }
    }
  };

  const handleSearchClose = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    setHasSearched(false);
  };

  return (
    <>
      {/* Professional Highlight Styles */}
      <style jsx global>{`
        .search-full-match {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
          padding: 0.125rem 0.35rem !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          box-shadow: 0 0 0 2px rgba(254, 226, 226, 0.5);
        }
        .search-partial-match {
          background-color: #fffbeb !important;
          color: #92400e !important;
          padding: 0.1rem 0.25rem !important;
          border-radius: 4px !important;
          font-weight: 600 !important;
        }
        .page-search-item.hidden {
          display: none !important;
        }
      `}</style>

      <header className="w-full h-16 bg-white border-b border-gray-200 z-40 sticky top-0 left-0 shadow-sm">
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {(isMobile || !sidebarOpen) && !isSearchExpanded && (
              <button 
                onClick={onMenuToggle} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Page Title - Hidden when search expanded on mobile */}
            {(!isMobile || !isSearchExpanded) && (
              <h1 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {getPageTitle(location.pathname)}
              </h1>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* SEARCH - DESKTOP */}
            {!isMobile && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search this page..."
                  className="pl-10 pr-11 py-2.5 w-96 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium placeholder-gray-400"
                />

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    onClick={handleSearchClose}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}

                {/* Professional Results Feedback */}
                {hasSearched && (
                  <div className="absolute -bottom-8 left-0 text-xs font-medium flex items-center gap-2">
                    {showNoResults ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <span>●</span> No results found
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        {resultStats.visible === resultStats.total 
                          ? `All ${resultStats.total} items` 
                          : `${resultStats.visible} of ${resultStats.total} results`
                        }
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SEARCH - MOBILE */}
            {isMobile && (
              <div className="flex items-center gap-2">
                {/* Search Icon - Compact */}
                {!isSearchExpanded && (
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <Search size={18} />
                  </button>
                )}

                {/* Expanded Search Input */}
                {isSearchExpanded && (
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 text-gray-400" size={16} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-9 pr-8 py-2 w-40 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
                    />
                    <button
                      onClick={handleSearchClose}
                      className="absolute right-2 p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <X size={14} className="text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notification & Profile - Hidden when search expanded on mobile */}
            {(!isMobile || !isSearchExpanded) && (
              <>
                <NotificationDropdown />

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-800">Jane Doe</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-sm font-bold">
                    JD
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

const getPageTitle = (path) => {
  const titles = {
    '/api/v1/candidates/home': 'Dashboard',
    '/api/v1/candidates/profile': 'My Profile',
    '/api/v1/candidates/join': 'Join Interview',
    '/api/v1/candidates/results': 'Results',
    '/api/v1/candidates/notifications': 'Notifications',
    '/api/v1/candidates/transcription': 'Transcription',
    '/api/v1/candidates/topic-coverage': 'Topic Coverage',
    '/api/v1/candidates/scorecard': 'Scorecard',
    '/api/v1/candidates/interview-history': 'Interview History',
    '/api/v1/candidates/files': 'Files',
    '/api/v1/candidates/security': 'Security',
  };
  return titles[path] || 'Dashboard';
};

export default TopNavbar;