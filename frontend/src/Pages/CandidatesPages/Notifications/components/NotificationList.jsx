'use client';

import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, onNotificationClick, onMarkAsRead }) => {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          data={notification}
          onClick={onNotificationClick}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;