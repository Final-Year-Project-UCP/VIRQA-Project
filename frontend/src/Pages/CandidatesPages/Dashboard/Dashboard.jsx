'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../../config/api';
import ProfileCompletionCard from './components/ProfileCompeltion';
import UpcomingInterview from './components/UpcomingInterview';
import QuickLinks from './components/QuickLinks';
import InterviewHistory from './components/InterviewHistory';
import ProfileCompletionModal from '../../../components/common/Modals/ProfileCompletionModal';
import { calculateProfileCompletion } from '../../../utils/profileCompletion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
};

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/user/profile')
    });

    const profileData = profileResponse?.data?.data;
    const { isComplete: isProfileComplete } = calculateProfileCompletion(profileData);

    useEffect(() => {
        if (!isLoading && profileData) {
            if (!isProfileComplete) {
                const sessionshown = sessionStorage.getItem('profileModalShown');
                if (!sessionshown) {
                    setShowModal(true);
                    sessionStorage.setItem('profileModalShown', 'true');
                }
            }
        }
    }, [profileData, isLoading, isProfileComplete]);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            <ProfileCompletionModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                data={profileData} 
            />

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Welcome back, <span className="text-blue-600">{profileData?.fullName?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Here's your real-time interview performance overview.</p>
                </div>
            </div>

            {/* Profile Completion Card - Only show if incomplete */}
            {!isProfileComplete && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <ProfileCompletionCard data={profileData} isLoading={isLoading} />
                </div>
            )}

            {/* Main Content Grid */}
            <div className={`grid grid-cols-1 ${isProfileComplete ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 md:gap-8`}>
                {/* Upcoming Interviews */}
                <div className={`${isProfileComplete ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                    <UpcomingInterview />
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-1">
                    <QuickLinks />
                </div>
            </div>

            {/* Interview History */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <InterviewHistory />
            </div>
        </motion.div>
    );
};

export default Dashboard;