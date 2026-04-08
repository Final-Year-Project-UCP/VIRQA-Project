'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api';
import ProfileCompletionCard from './components/ProfileCompeltion';
import UpcomingInterview from './components/UpcomingInterview';
import QuickLinks from './components/QuickLinks';
import InterviewHistory from './components/InterviewHistory';
import ProfileCompletionModal from '../../../components/common/Modals/ProfileCompletionModal';

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/user/profile')
    });

    const profileData = profileResponse?.data?.data;

    useEffect(() => {
        if (!isLoading && profileData) {
            // Logic to show modal if incomplete
            const isBioMissing = !profileData.professionalBio;
            const areSkillsMissing = !profileData.skills || profileData.skills.length === 0;
            const isPhoneMissing = !profileData.phoneNumber;

            if (isBioMissing || areSkillsMissing || isPhoneMissing) {
                // Check if we've already shown it this session
                const sessionshown = sessionStorage.getItem('profileModalShown');
                if (!sessionshown) {
                    setShowModal(true);
                    sessionStorage.setItem('profileModalShown', 'true');
                }
            }
        }
    }, [profileData, isLoading]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6 page-item-search">
            <ProfileCompletionModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                data={profileData} 
            />
            <div className="max-w-8xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {profileData?.fullName?.split(' ')[0] || 'User'}</h1>
                    <p className="text-gray-600 mt-2">Here's your interview preparation overview</p>
                </div>

                {/* Profile Completion Card - Full Width */}
                <div className="mb-8">
                    <ProfileCompletionCard data={profileData} isLoading={isLoading} />
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