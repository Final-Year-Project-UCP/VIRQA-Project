'use client';

import React from 'react';
import { Video, AlertCircle, CheckCircle, Clock, List } from 'lucide-react';

const NotificationFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All', icon: List },
    { key: 'interview', label: 'Interview Alerts', icon: Video },
    { key: 'system', label: 'System Alerts', icon: AlertCircle },
    { key: 'results', label: 'Result Updates', icon: CheckCircle },
    { key: 'reminders', label: 'Reminders', icon: Clock }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.key;
        
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon size={16} />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationFilters;