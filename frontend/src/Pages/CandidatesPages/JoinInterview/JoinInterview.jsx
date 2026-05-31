'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Lobby from './components/Lobby';
import ActiveSession from './components/ActiveSession';
import ScheduledInterviews from './components/ScheduledInterviews';
import InterviewFeedbackModal from './components/InterviewFeedbackModal';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../../config/api.js';

const LiveInterviewPage = () => {
  const navigate = useNavigate();
  const [interviewStatus, setInterviewStatus] = useState('scheduled'); // 'scheduled' | 'lobby' | 'active' | 'ended'
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // ── Fetch Candidate Interviews ──
  const { data: interviews, isLoading, error } = useQuery({
    queryKey: ['candidateInterviews'],
    queryFn: async () => {
      const res = await api.get('candidate/my-interviews');
      return res.data?.data || [];
    }
  });

  const handleSelectInterview = (interview) => {
    setSelectedInterview(interview);
    setInterviewStatus('lobby');
  };

  const handleJoinInterview = () => {
    // Automatically enter full screen for the interview session
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.warn(`Full-screen request failed: ${err.message}`);
      });
    }
    setInterviewStatus('active');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Syncing upcoming interviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-slate-500 mb-6 font-medium">Failed to load your scheduled interviews. Please check your connection and try again.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (interviewStatus) {
      case 'scheduled':
        return (
          <ScheduledInterviews
            interviews={interviews}
            onJoin={handleSelectInterview}
          />
        );

      case 'lobby':
        return (
          <Lobby
            session={selectedInterview}
            onJoin={handleJoinInterview}
            onBack={() => setInterviewStatus('scheduled')}
          />
        );

      case 'active':
        return (
          <ActiveSession
            session={selectedInterview}
            onLeave={() => {
              // Exit full screen if active
              if (document.fullscreenElement) {
                document.exitFullscreen().catch((err) => console.error(err));
              }
              setInterviewStatus('ended');
              setShowFeedbackModal(true);
            }}
          />
        );

      case 'ended':
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg z-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Interview Completed</h1>
              <p className="text-gray-600 font-medium mb-8">
                Thank you for your time. Your response has been recorded.
              </p>
              <button
                onClick={() => navigate('/api/v1/candidates/results')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                View Results
              </button>
            </div>
            
            <AnimatePresence>
              {showFeedbackModal && (
                <InterviewFeedbackModal 
                  session={selectedInterview} 
                  onClose={() => setShowFeedbackModal(false)}
                  onSubmitSuccess={() => {
                      // Optional: handle something after success. 
                      // Modal auto-closes and animates out.
                  }}
                />
              )}
            </AnimatePresence>
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
        className="w-full min-h-screen"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveInterviewPage;