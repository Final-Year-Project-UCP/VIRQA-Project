'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationDetails from './NotificationDetails.jsx';

const NotificationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Demo Mock Data (Replace with API later)
  const DEMO_NOTIFICATIONS = [
    {
      id: "1",
      type: "interview",
      title: "Your interview starts soon",
      message: "Your scheduled interview starts in 30 minutes.",
      details: "Please make sure your microphone and camera are working.",
      timestamp: "2 hours ago",
      read: true
    },
    {
      id: "2",
      type: "results",
      title: "Your results are ready",
      message: "Your interview results have been evaluated.",
      details: "Click below to view performance, strengths, and insights.",
      timestamp: "1 hour ago",
      read: false
    },
    {
      id: "3",
      type: "system",
      title: "System Maintenance",
      message: "Our system will be offline tonight from 1 AM to 3 AM.",
      details: "We apologize for the inconvenience.",
      timestamp: "3 hours ago",
      read: false
    }
  ];

  // ❗ You can replace this later with a real API call:
  // fetch(`/api/v1/candidates/notifications/${id}`)
  const fetchNotification = async () => {
    try {
      setLoading(true);

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const found = DEMO_NOTIFICATIONS.find(n => n.id === id);

      if (!found) {
        setError("Notification not found.");
      } else {
        setNotification(found);
      }

    } catch (err) {
      setError("Failed to load notification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const handleClose = () => {
    navigate(-1); // go back to notifications list
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading notification...
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error || "Notification not found"}
      </div>
    );
  }

  return (
    <NotificationDetails
      notification={notification}
      onClose={handleClose}
      onNavigate={handleNavigate}
    />
  );
};

export default NotificationDetailsPage;
