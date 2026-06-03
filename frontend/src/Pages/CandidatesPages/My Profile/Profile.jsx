'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../config/api.js';
import { getErrorMessage } from '../../../utils/errorParser.js';

import BioSection from './components/BioSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillSection';

import ProfileCard from './components/ProfileCard';
import ProfileHeader from './components/ProfileHeader';
import DocumentsSection from './components/DocumentSection';

const MyProfile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    jobTitle: '',
    experience: '',
    level: '',
    educations: [],
    documents: [],
    resumeUrl: '',
    resumeFile: null,
    professionalBio: '',
    skills: [],
    profilePhoto: '',
    profilePhotoFile: null,
    profilePhotoPreview: null,
  });

  const [tempProfile, setTempProfile] = useState(profile);

  // Fetch true profile data
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['candidateProfile'],
    queryFn: () => api.get('/user/profile'),
  });

  useEffect(() => {
    if (profileResponse?.data?.data) {
      const data = profileResponse.data.data;
      const formattedProfile = {
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        location: data.location || '',
        jobTitle: data.jobTitle || '',
        experience: data.experience?.toString() || '',
        level: data.level || '',
        educations: data.educations || [],
        resumeUrl: data.resumeUrl || '',
        documents: data.resumeUrl ? [{ id: 'resume', name: data.resumeName || 'Resume', url: data.resumeUrl, size: data.resumeSize || 'Cloudinary Hosted' }] : [],
        professionalBio: data.professionalBio || '',
        skills: data.skills || [],
        profilePhoto: data.profilePhoto || '',
        profilePhotoFile: null,
        profilePhotoPreview: null,
        resumeFile: null,
      };
      setProfile(formattedProfile);
      
      setTempProfile(prev => {
        // If editing, merge the latest uploaded resume/photo but preserve all other edited inputs
        if (isEditing) {
          return {
            ...prev,
            resumeUrl: formattedProfile.resumeUrl,
            documents: formattedProfile.documents,
            profilePhoto: formattedProfile.profilePhoto,
          };
        }
        return formattedProfile;
      });
    }
  }, [profileResponse, isEditing]);

  // Handle Updates
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const formData = new FormData();
      if (updatedData.fullName) formData.append('fullName', updatedData.fullName);
      if (updatedData.phoneNumber !== undefined) formData.append('phoneNumber', updatedData.phoneNumber);
      if (updatedData.professionalBio !== undefined) formData.append('professionalBio', updatedData.professionalBio);
      if (updatedData.location !== undefined) formData.append('location', updatedData.location);
      if (updatedData.jobTitle !== undefined) formData.append('jobTitle', updatedData.jobTitle);
      if (updatedData.experience !== undefined) formData.append('experience', updatedData.experience);
      if (updatedData.level !== undefined) formData.append('level', updatedData.level);
      
      formData.append('skills', JSON.stringify(updatedData.skills || []));
      formData.append('educations', JSON.stringify(updatedData.educations || []));

      // Send resume as a file if newly picked, otherwise keep the existing URL
      if (updatedData.resumeFile instanceof File) {
        formData.append('resume', updatedData.resumeFile);
      } else {
        // Preserve existing cloudinary URL (not a blob URL) or empty string (to clear)
        const existingUrl = updatedData.resumeUrl || '';
        if (!existingUrl.startsWith('blob:')) {
          formData.append('resumeUrl', existingUrl);
        }
      }

      if (updatedData.profilePhotoFile) {
        formData.append('profilePhoto', updatedData.profilePhotoFile);
      }

      return api.patch('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['candidateProfile']);
      queryClient.invalidateQueries(['profile']); // For TopNav
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile."));
    }
  });

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    updateProfileMutation.mutate(tempProfile);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="relative z-10">

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
    </motion.div>
  );
};

export default MyProfile;