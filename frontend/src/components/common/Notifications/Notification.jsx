import { useNotifications } from '../../../hooks/useNotificationHook';
import NotificationHeader from './components/NotificaitonHeader';
import NotificationList from './components/NotificationList';

let SharedNotifications = () => {
  const { data, fetchNextPage, hasNextPage, markAsRead, markAllAsRead } = useNotifications();

  const notifications = data?.pages.flatMap(p => p.data) || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6">
      <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={markAllAsRead} />
      <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchNextPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SharedNotifications;
