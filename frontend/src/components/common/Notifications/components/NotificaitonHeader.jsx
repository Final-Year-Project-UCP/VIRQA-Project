import { CheckCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationHeader = ({ unreadCount, onMarkAllAsRead }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 w-full border-b border-gray-100 pb-6">
      {/* Title and subtitle */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-0.5">
            You have <span className="text-blue-600 font-bold">{unreadCount}</span> unread messages
          </p>
        </div>
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMarkAllAsRead}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <CheckCircle size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          Mark all as read
        </motion.button>
      )}
    </div>
  );
};

export default NotificationHeader;
