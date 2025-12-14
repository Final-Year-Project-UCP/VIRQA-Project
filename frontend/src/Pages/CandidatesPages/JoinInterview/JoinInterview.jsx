'use client';

import React, { useState } from 'react';
import Lobby from './components/Lobby';
import ActiveSession from './components/ActiveSession';
import ScheduledInterviews from './components/ScheduledInterviews';
import { AnimatePresence, motion } from 'framer-motion';

const LiveInterviewPage = () => {
  const [interviewStatus, setInterviewStatus] = useState('scheduled'); // 'scheduled' | 'lobby' | 'active' | 'ended'
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Mock User Data - In real app, fetch from context/auth
  const userData = {
    name: "Alex Morgan",
    role: "Senior Frontend Developer", // Default, will override with selected interview
    interviewer: "Sarah Johnson",
    company: "TechCorp Inc."
  };

  const handleSelectInterview = (interview) => {
    setSelectedInterview(interview);
    setInterviewStatus('lobby');
  };

  const handleJoinInterview = () => {
    setInterviewStatus('active');
  };

  const handleLeaveInterview = () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      setInterviewStatus('ended');
      // Navigate back or show summary
      // window.location.href = '/dashboard'; 
    }
  };

  const renderContent = () => {
    switch (interviewStatus) {
      case 'scheduled':
        return (
          <ScheduledInterviews
            onJoin={handleSelectInterview}
          />
        );

      case 'lobby':
        return (
          <Lobby
            role={selectedInterview?.role || userData.role}
            userName={userData.name}
            onJoin={handleJoinInterview}
            onBack={() => setInterviewStatus('scheduled')}
          />
        );

      case 'active':
        return (
          <ActiveSession
            role={selectedInterview?.role || userData.role}
            userName={userData.name}
            interviewerName={selectedInterview?.interviewer || userData.interviewer}
            onLeave={handleLeaveInterview}
          />
        );

      case 'ended':
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Ended</h1>
              <p className="text-gray-600 mb-8">Thank you for your time. You may now close this tab.</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={interviewStatus}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveInterviewPage;