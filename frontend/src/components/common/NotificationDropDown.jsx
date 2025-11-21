'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Interview Completed', message: 'Your interview for Senior React Developer has ended.', time: '2 min ago', unread: true, bgImage: '/images/interview-bg.jpg' },
    { id: 2, title: 'New Feedback Available', message: 'You have new feedback on your last interview.', time: '15 min ago', unread: true, bgImage: '/images/feedback-bg.jpg' },
    { id: 3, title: 'Scorecard Updated', message: 'Your scorecard is now ready to view.', time: '1 hour ago', unread: false, bgImage: '/images/scorecard-bg.jpg' },
    { id: 4, title: 'Reminder', message: 'You have an interview scheduled tomorrow at 3 PM.', time: '3 hours ago', unread: false, bgImage: '/images/reminder-bg.jpg' },
  ];

  const filteredNotifications = notifications.filter(n => filter === 'all' || (filter === 'unread' && n.unread));
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-gray-600 group-hover:text-gray-800 transition-colors" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-3 h-3 px-1 text-[8px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-1 w-60 sm:w-72 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-100 bg-gray-50/70">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <p className="text-[8px] sm:text-[10px] text-blue-600 mt-0.5">{unreadCount} unread</p>}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200/70 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1 px-2 py-1 border-b border-gray-100">
              <button
                className={clsx(
                  'flex-1 py-1 text-[8px] sm:text-[10px] rounded-md font-medium transition-colors',
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={clsx(
                  'flex-1 py-1 text-[8px] sm:text-[10px] rounded-md font-medium transition-colors',
                  filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-48 sm:max-h-60 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-3 text-center">
                  <Bell size={24} className="mx-auto mb-1 text-gray-300" />
                  <p className="text-gray-500 text-[8px] sm:text-[10px]">No notifications</p>
                </div>
              ) : (
                <ul>
                  {filteredNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={clsx(
                        'relative p-2 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0 rounded-md overflow-hidden',
                        notif.unread && 'bg-blue-50/50'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-sm opacity-20 rounded-md"
                        style={{ backgroundImage: `url(${notif.bgImage})` }}
                      ></div>

                      <div className="relative flex items-start gap-2">
                        {notif.unread && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 shrink-0"></div>}
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] sm:text-[10px] font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-[7px] sm:text-[9px] text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[6px] sm:text-[8px] text-gray-400 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-1 sm:p-2 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => {
                  navigate('/api/v1/candidates/notifications');
                  setIsOpen(false);
                }}
                className="w-full text-center text-[8px] sm:text-[10px] font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-100 py-1 rounded-md transition-all"
              >
                Show All Notifications →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
