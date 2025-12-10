import { Video, CheckCircle, AlertCircle, Clock, Circle } from 'lucide-react';

const NotificationItem = ({ data }) => {
  // Map notification type to icon and colors
  const typeMap = {
    interview: { Icon: Video, bg: 'bg-blue-100', text: 'text-blue-600' },
    results: { Icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' },
    system: { Icon: AlertCircle, bg: 'bg-orange-100', text: 'text-orange-600' },
    reminders: { Icon: Clock, bg: 'bg-purple-100', text: 'text-purple-600' }
  };

  const { Icon, bg, text } = typeMap[data.type] || {
    Icon: AlertCircle,
    bg: 'bg-gray-100',
    text: 'text-gray-600'
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-xl transition-all duration-200
        ${data.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}
        hover:bg-blue-200 cursor-pointer`} // blue hover for all cards
    >
      {/* Icon */}
      <div className={`p-3 rounded-lg shrink-0 ${bg} ${text}`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title + New badge */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{data.title}</h3>
            {!data.read && (
              <div className="flex items-center gap-1">
                <Circle size={8} className={`fill-current ${text}`} />
                <span className={`text-xs font-medium ${text}`}>New</span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {data.timestamp}
          </span>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {data.message}
        </p>

        {/* Type badge */}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
