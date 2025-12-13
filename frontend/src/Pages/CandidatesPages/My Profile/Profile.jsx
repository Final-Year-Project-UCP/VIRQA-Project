'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BioSection from './components/BioSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillSection';

import ProfileCard from './components/ProfileCard';
import ProfileHeader from './components/ProfileHeader';
import DocumentsSection from './components/DocumentSection';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    experience: '',
    educations: [],
    documents: [],
    bio: '',
    skills: [],
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !tempProfile.skills.includes(skill)) {
      setTempProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setTempProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
      {/* Professional Header Banner */}
      <div className="h-48 lg:h-64 bg-gradient-to-r from-slate-500 to-white-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header (Actions & Stats) */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 mb-6">
            <ProfileHeader
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              profile={profile}
              tempProfile={tempProfile}
            />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Sidebar Column - Sticky on Desktop */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 h-fit">
            <motion.div variants={itemVariants}>
              <ProfileCard
                profile={profile}
                isEditing={isEditing}
                tempProfile={tempProfile}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <SkillsSection
                profile={profile}
                isEditing={isEditing}
                tempProfile={tempProfile}
                onSkillAdd={handleSkillAdd}
                onSkillRemove={handleSkillRemove}
              />
            </motion.div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div variants={itemVariants}>
              <BioSection
                profile={profile}
                isEditing={isEditing}
                tempProfile={tempProfile}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <EducationSection
                profile={profile}
                isEditing={isEditing}
                tempProfile={tempProfile}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <DocumentsSection
                isEditing={isEditing}
                tempProfile={tempProfile}
                profile={profile}
                onChange={handleChange}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyProfile;