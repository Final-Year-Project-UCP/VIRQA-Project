import { CheckCircle } from 'lucide-react';

const NotificationHeader = ({ unreadCount, onMarkAllAsRead }) => {
  return (
    <div className="flex items-center justify-between mb-8 gap-4 w-full">
      {/* Title and subtitle */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
          Notifications
        </h1>
        <p className="text-gray-600 text-sm sm:text-base truncate mt-1">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
            : 'All caught up!'}
        </p>
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap"
        >
          <CheckCircle size={16} />
          Mark All as Read
        </button>
      )}
    </div>
  );
};

export default NotificationHeader;
