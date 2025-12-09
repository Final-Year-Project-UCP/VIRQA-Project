'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationHeader from './components/NotificaitonHeader.jsx';   
import NotificationFilters from './components/NotificationFilter.jsx';
import NotificationList from './components/NotificationList.jsx';
import NotificationPagination from './components/NotificationPagination.jsx';
import EmptyNotification from './components/EmptyNotification.jsx';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Your interview for Senior Frontend Developer has been scheduled for tomorrow at 3:00 PM EST.',
        timestamp: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        type: 'results',
        title: 'Results Available',
        message: 'Your interview results are now available for review.',
        timestamp: '1 day ago',
        read: true,
      },
      {
        id: 3,
        type: 'system',
        title: 'Profile Incomplete',
        message: 'Complete your profile to increase your interview chances by 40%.',
        timestamp: '2 days ago',
        read: false,
      },
      {
        id: 4,
        type: 'reminders',
        title: 'Upcoming Interview',
        message: 'Reminder: You have an interview scheduled in 24 hours.',
        timestamp: '3 days ago',
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Filter notifications
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(notif => notif.type === activeFilter));
    }
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleNotificationClick = (notification) => {
    // Navigation is now handled in NotificationItem component
    console.log('Notification clicked:', notification);
  };

  const handleLoadMore = () => {
    // Simulate loading more notifications
    setHasMore(false);
  };

  const handleRefresh = () => {
    // Refresh notifications
    console.log('Refreshing notifications...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <NotificationHeader 
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        <NotificationFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {filteredNotifications.length > 0 ? (
          <>
            <NotificationList 
              notifications={filteredNotifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
            
            <NotificationPagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredNotifications.length / 10)}
              onPageChange={setCurrentPage}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </>
        ) : (
          <EmptyNotification onRefresh={handleRefresh} />
        )}
      </div>
    </div>
  );
};

export default Notifications;