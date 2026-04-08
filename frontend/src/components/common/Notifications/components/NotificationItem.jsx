import { Video, CheckCircle, AlertCircle, Clock, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationItem = ({ data, onMarkAsRead }) => {
  // Map notification type to icon and colors
  const typeMap = {
    interview: {
      Icon: Video,
      bg: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    results: {
      Icon: CheckCircle,
      bg: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    system: {
      Icon: AlertCircle,
      bg: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-600',
      lightBg: 'bg-orange-50',
      text: 'text-orange-600'
    },
    reminders: {
      Icon: Clock,
      bg: 'bg-violet-500',
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      text: 'text-violet-600'
    }
  };

  const { Icon, gradient, lightBg, text } = typeMap[data.type] || {
    Icon: AlertCircle,
    gradient: 'from-gray-500 to-gray-600',
    lightBg: 'bg-gray-50',
    text: 'text-gray-600'
  };

  const formattedDate = new Date(data.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={() => !data.isRead && onMarkAsRead(data._id)}
      className={`group relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 border
        ${data.isRead
          ? 'bg-white/80 border-transparent hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50'
          : 'bg-white border-blue-100 shadow-md shadow-blue-500/5'
        }
      `}
    >
      {/* Unread Indicator Glow */}
      {!data.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-2xl" />
      )}

      {/* Icon */}
      <div className={`relative shrink-0 p-2.5 sm:p-3 rounded-xl overflow-hidden ${lightBg}`}>
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-current ${text}`} />
        <Icon size={20} className={`${text} sm:w-[22px] sm:h-[22px]`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1.5 gap-1 sm:gap-4">
          <div className="flex items-start gap-2 pr-2">
            <h3 className={`font-semibold text-sm sm:text-base leading-snug ${data.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {data.title}
            </h3>
            {!data.isRead && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="shrink-0 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider mt-0.5"
              >
                New
              </motion.span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {formattedDate}
          </span>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${data.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
          {data.message}
        </p>

        {/* Action hint on hover */}
        {!data.isRead && (
          <div className="mt-3 hidden sm:flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            <span>Mark as read</span>
            <ArrowRight size={12} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;
