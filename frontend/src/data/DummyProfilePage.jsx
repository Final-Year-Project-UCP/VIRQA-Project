'use client';

import React from 'react';
import ProfileReport from '../Pages/CandidatesPages/Results/components/ReportGenerate.jsx';

const DummyProfilePage = () => {
  // Dummy profile data
  const profile = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
    bio: 'Passionate software engineer with 5+ years of experience in web development and AI projects.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
    profileImage: '', // You can put an image URL here
  };

  // Dummy score data
  const score = {
    total: 85,
    percentile: 92,
    rank: 7,
    betterThan: 92,
  };

  const interviewName = 'Frontend Developer Interview';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProfileReport profile={profile} score={score} interviewName={interviewName} />
    </div>
  );
};

export default DummyProfilePage;
