'use client';

import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';

const EmptyNotification = ({ onRefresh }) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bell size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No notifications right now
      </h3>
      
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        You're all caught up! We'll notify you when there's something new.
      </p>

      <button
        onClick={onRefresh}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mx-auto"
      >
        <RefreshCw size={18} />
        Refresh
      </button>
    </div>
  );
};

export default EmptyNotification;