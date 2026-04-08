import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useNotifications } from '../../hooks/useNotificationHook';

// Accept icon styling options as props
const NotificationDropdown = ({
  iconColor = 'text-gray-600',
  iconHoverColor = 'text-gray-800',
  iconBg = 'bg-gray-100',
  iconBorder = 'border-none',
  iconSize = 18,
  viewAllPath = '/api/v1/candidates/notifications',
}) => {
  const { data, markAsRead } = useNotifications();
  const notifications = data?.pages.flatMap(p => p.data) || [];

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

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || (filter === 'unread' && !n.isRead)
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg hover:${iconBg} transition-all duration-200 group`}
        aria-label="Notifications"
      >
        <Bell
          size={iconSize}
          className={`${iconColor} group-hover:${iconHoverColor} transition-colors ${iconBorder}`}
          strokeWidth={2}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse">
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
            className="absolute right-0 mt-3 w-72 sm:w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <p className="text-[10px] font-medium text-blue-600 mt-0.5">{unreadCount} new alerts</p>}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 p-3 border-b border-gray-50">
              <button
                className={clsx(
                  'flex-1 py-1.5 text-[10px] rounded-lg font-semibold transition-all duration-200',
                  filter === 'all' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={clsx(
                  'flex-1 py-1.5 text-[10px] rounded-lg font-semibold transition-all duration-200',
                  filter === 'unread' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-xs font-medium">No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {filteredNotifications.map((notif) => (
                    <li
                      key={notif._id}
                      className={clsx(
                        'relative p-4 hover:bg-blue-50/50 transition-all cursor-pointer group',
                        !notif.isRead && 'bg-blue-50/20'
                      )}
                      onClick={() => handleNotificationClick(notif._id)}
                    >
                      <div className="relative flex items-start gap-3">
                        {!notif.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0 animate-pulse"></div>}
                        <div className="flex-1 min-w-0">
                          <p className={clsx(
                            "text-xs font-bold truncate",
                            notif.isRead ? "text-gray-700" : "text-gray-900"
                          )}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                          <p className="text-[9px] text-gray-400 mt-2 font-medium">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
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
                  navigate(viewAllPath);
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
