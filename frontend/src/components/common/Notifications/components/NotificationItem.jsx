'use client';

import React from 'react';
import { Video, CheckCircle, AlertCircle, Clock, Circle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ data, onMarkAsRead }) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    const icons = {
      interview: Video,
      results: CheckCircle,
      system: AlertCircle,
      reminders: Clock
    };
    const Icon = icons[type] || AlertCircle;
    
    const iconColors = {
      interview: 'text-blue-600 bg-blue-100',
      results: 'text-green-600 bg-green-100',
      system: 'text-orange-600 bg-orange-100',
      reminders: 'text-purple-600 bg-purple-100'
    };
    
    return { Icon, color: iconColors[type] || 'text-gray-600 bg-gray-100' };
  };

  const { Icon, color } = getNotificationIcon(data.type);

  const handleClick = () => {
    if (!data.read) {
      onMarkAsRead(data.id);
    }
    // Navigate to notification details page
navigate(`/api/v1/candidates/notifications/${data.id}`);

  };

  return (
    <div 
      className={`flex items-start gap-4 p-4 border rounded-xl transition-all duration-200 cursor-pointer group ${
        data.read 
          ? 'bg-white border-gray-200 hover:border-gray-300' 
          : 'bg-blue-50 border-blue-200 hover:border-blue-300'
      }`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className={`p-3 rounded-lg ${color} shrink-0`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{data.title}</h3>
            {!data.read && (
              <div className="flex items-center gap-1">
                <Circle size={8} className="text-blue-600 fill-blue-600" />
                <span className="text-xs font-medium text-blue-600">New</span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {data.timestamp}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {data.message}
        </p>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.read 
              ? 'bg-gray-100 text-gray-600' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          </span>
          
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;