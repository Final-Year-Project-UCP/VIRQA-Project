'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Menu, Clock, User, LogOut, ChevronDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../config/api';
import NotificationDropdown from './NotificationDropDown';

const TopNavbar = ({ onMenuToggle, sidebarOpen, isMobile }) => {
  const { data: profileResponse } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile')
  });

  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const profileData = profileResponse?.data?.data;
  const firstName = profileData?.fullName?.split(' ')[0] || 'User';
  const initials = profileData?.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/user/logout'),
    onSuccess: () => {
      localStorage.removeItem('userRole');
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      localStorage.removeItem('userRole');
      queryClient.clear();
      navigate('/login');
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [resultStats, setResultStats] = useState({ visible: 0, total: 0 });
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Clear on route change
  useEffect(() => {
    setSearchQuery('');
    setHasSearched(false);
    setResultStats({ visible: 0, total: 0 });
    setIsSearchExpanded(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when expanded on mobile
  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // PROFESSIONAL SEARCH + SMART HIGHLIGHTING (No hiding, just highlight)
  useEffect(() => {
    const query = searchQuery.trim();
    const items = document.querySelectorAll('.page-search-item');
    const total = items.length;

    if (!query) {
      items.forEach(el => {
        el.classList.remove('search-no-match');
        if (el.dataset.originalText) {
          el.innerHTML = el.dataset.originalText;
        }
      });
      setResultStats({ visible: total, total });
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    let matchCount = 0;
    const lowerQuery = query.toLowerCase();

    // Escape regex special chars
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedQuery = escapeRegex(query);

    // Regex for case-insensitive matching
    const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');

    items.forEach(el => {
      const originalText = el.dataset.originalText || el.textContent.trim();
      if (!el.dataset.originalText) el.dataset.originalText = originalText;

      const lowerText = originalText.toLowerCase();

      if (lowerText.includes(lowerQuery)) {
        // Match found - highlight and remove dimming
        el.classList.remove('search-no-match');
        matchCount++;

        // Highlight all matches
        const highlighted = originalText.replace(searchRegex, '<mark class="search-highlight">$1</mark>');
        el.innerHTML = highlighted;
      } else {
        // No match - dim the element but keep it visible
        el.classList.add('search-no-match');
        if (el.dataset.originalText) {
          el.innerHTML = el.dataset.originalText;
        }
      }
    });

    setResultStats({ visible: matchCount, total });
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
      <style>{`
        .search-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
          color: #92400e !important;
          padding: 0.15rem 0.4rem !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          box-shadow: 0 0 0 2px rgba(253, 230, 138, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .search-highlight:hover {
          transform: scale(1.05);
          box-shadow: 0 0 0 3px rgba(253, 230, 138, 0.5), 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .page-search-item.search-no-match {
          opacity: 0.35 !important;
          filter: grayscale(0.5);
          transition: opacity 0.3s ease, filter 0.3s ease;
        }
        
        .page-search-item {
          transition: opacity 0.3s ease, filter 0.3s ease;
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
                        <span>●</span> No matches found
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <span>✓</span> {resultStats.visible} {resultStats.visible === 1 ? 'match' : 'matches'} found
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
                {/* Animated Clock - Desktop Only */}
                {!isMobile && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="relative">
                      <Clock
                        size={18}
                        className="text-blue-600 group-hover:rotate-12 transition-transform duration-300"
                      />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 tabular-nums tracking-tight">
                        {currentTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {currentTime.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <NotificationDropdown />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-800">{profileData?.fullName || 'User'}</span>
                      <span className="text-xs text-gray-500">{profileData?.role?.charAt(0).toUpperCase() + profileData?.role?.slice(1) || 'Candidate'}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{profileData?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500">{profileData?.email || ''}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('/api/v1/candidates/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors group"
                      >
                        <User size={16} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          logoutMutation.mutate();
                          setProfileDropdownOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors group disabled:opacity-60"
                      >
                        <LogOut size={16} className="text-gray-500 group-hover:text-red-600 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                          {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                        </span>
                      </button>
                    </div>
                  )}
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
    '/api/v1/candidates': 'Dashboard',
    '/api/v1/candidates/profile': 'My Profile',
    '/api/v1/candidates/join': 'Join Interview',
    '/api/v1/candidates/results': 'Results',
    '/api/v1/candidates/notifications': 'Notifications',
    '/api/v1/candidates/interview-history': 'Interview History',
    '/api/v1/candidates/passwordreset': 'Password Reset',
    '/api/v1/candidates/contactus': 'Contact Us',
    '/api/v1/candidates/feedback': 'Feedback',
    '/api/v1/candidates/comingsoon/transcription': 'Transcription',
    '/api/v1/candidates/comingsoon/coverage': 'Topic Coverage',
    '/api/v1/candidates/comingsoon/files': 'Files',
    '/api/v1/candidates/comingsoon/security': 'Security',
  };
  return titles[path] || 'Dashboard';
};

export default TopNavbar;