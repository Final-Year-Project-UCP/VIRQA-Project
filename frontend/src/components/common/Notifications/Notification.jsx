import { useNotifications } from '../../../hooks/useNotificationHook';
import NotificationHeader from './components/NotificaitonHeader';
import NotificationList from './components/NotificationList';

let SharedNotifications = () => {
  const { data, fetchNextPage, hasNextPage, markAsRead, markAllAsRead } = useNotifications();

  const notifications = data?.pages.flatMap(p => p.data) || [];
  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <div className="max-w-8xl mx-auto p-4 lg:p-8">
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-sm p-6 sm:p-8 border border-white/20">
        <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={markAllAsRead} />
        <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={fetchNextPage}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              Load Previous Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedNotifications;
