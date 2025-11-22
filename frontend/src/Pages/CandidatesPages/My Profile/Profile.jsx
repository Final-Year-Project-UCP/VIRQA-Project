'use client';

import React, { useState } from 'react';
import BioSection from './components/BioSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillSection';

import ProfileCard from './components/ProfileCard';
import ProfileHeader from './components/ProfileHeader';
import DocumentsSection from './components/DocumentSection';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
 // In your MyProfile.js, update the initial state:
const [profile, setProfile] = useState({
  name: '',
  email: '',
  phone: '',
  location: '',
  jobTitle: '',
  experience: '',
  educations: [],
  documents: [], // Add this line
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="w-full mx-auto">
        <ProfileHeader 
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          profile={profile}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard 
              profile={profile}
              isEditing={isEditing}
              tempProfile={tempProfile}
              onChange={handleChange}
            />
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <BioSection 
              profile={profile}
              isEditing={isEditing}
              tempProfile={tempProfile}
              onChange={handleChange}
            />

            <EducationSection 
              profile={profile}
              isEditing={isEditing}
              tempProfile={tempProfile}
              onChange={handleChange}
            />

            <SkillsSection 
              profile={profile}
              isEditing={isEditing}
              tempProfile={tempProfile}
              onSkillAdd={handleSkillAdd}
              onSkillRemove={handleSkillRemove}
            />

           <DocumentsSection 
  isEditing={isEditing} 
  tempProfile={tempProfile} 
  profile={profile} 
  onChange={handleChange} 
/>

          </div>
        </div>
      </div>
    </div>
  );
};


export default MyProfile;