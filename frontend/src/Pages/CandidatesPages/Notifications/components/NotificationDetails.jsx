'use client';

import React from 'react';
import { X, Video, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

const NotificationDetails = ({ notification, onClose, onNavigate }) => {

  // ✅ FIRST: Prevent reading notification.type before notification exists
  if (!notification) {
    return (
      <div className="text-center p-6">Loading...</div>
    );
  }

  const getNotificationIcon = (type) => {
    const icons = {
      interview: Video,
      results: CheckCircle,
      system: AlertCircle,
      reminders: Clock
    };

    const iconColors = {
      interview: 'text-blue-600 bg-blue-100',
      results: 'text-green-600 bg-green-100',
      system: 'text-orange-600 bg-orange-100',
      reminders: 'text-purple-600 bg-purple-100'
    };

    return {
      Icon: icons[type] || AlertCircle,
      color: iconColors[type] || 'text-gray-600 bg-gray-100'
    };
  };

  // ✅ NOW safe to use notification.type
  const { Icon, color } = getNotificationIcon(notification.type);

  const handleAction = () => {
    const routes = {
      interview: '/join-interview',
      results: '/results',
      system: '/dashboard',
      reminders: '/dashboard'
    };
    onNavigate(routes[notification.type] || '/dashboard');
  };

  const getActionText = (type) => {
    const actions = {
      interview: 'Join Interview Now',
      results: 'View Detailed Results',
      system: 'Go to Dashboard',
      reminders: 'View Schedule'
    };
    return actions[type] || 'View Details';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Notification Details</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {notification.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {notification.details && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
              <p className="text-sm text-gray-600">{notification.details}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <span>Received {notification.timestamp}</span>
            <span className="capitalize">{notification.type}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleAction}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {getActionText(notification.type)}
            <ExternalLink size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationDetails;
