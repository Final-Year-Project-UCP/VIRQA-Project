import NotificationItem from './NotificationItem';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationList = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.05 }
            }}
            exit={{ opacity: 0, x: -20 }}
          >
            <NotificationItem
              data={notification}
              onMarkAsRead={onMarkAsRead}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-dashed animate-spin-slow" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
          <p className="text-gray-500 mt-1">We'll notify you when something arrives.</p>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationList;