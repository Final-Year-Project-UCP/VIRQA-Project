'use client';

import React from 'react';
import ProfileCompletionCard from './components/ProfileCompeltion';
import UpcomingInterview from './components/UpcomingInterview';
import QuickLinks from './components/QuickLinks';
import InterviewHistory from './components/InterviewHistory';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 page-item-search">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Here's your interview preparation overview</p>
        </div>

        {/* Profile Completion Card - Full Width */}
        <div className="mb-8">
          <ProfileCompletionCard />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Upcoming Interviews */}
          <div className="lg:col-span-2">
            <UpcomingInterview />
          </div>

          {/* Right Column - Quick Links */}
          <div className="lg:col-span-1">
            <QuickLinks />
          </div>
        </div>

        {/* Interview History - Full Width */}
        <InterviewHistory />
      </div>
    </div>
  );
};

export default Dashboard;