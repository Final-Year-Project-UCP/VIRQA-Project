'use client';

import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Camera, Briefcase } from 'lucide-react';

const ProfileCard = ({ profile, isEditing, tempProfile, onChange }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading image:', file);
      // Handle image upload logic here
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center mb-6 lg:mb-8">
        <div className="relative group">
          {/* Profile Image Container */}
          <div className="w-24 h-24 lg:w-36 lg:h-36 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-xl lg:text-3xl font-bold shadow-lg">
            {getInitials(profile.name)}
          </div>
          
          {/* Camera Upload Button */}
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                className="absolute -bottom-1 -right-1 lg:bottom-2 lg:right-2 p-2 lg:p-3 bg-white border border-gray-300 rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Camera size={14} className="lg:size-[18px] text-gray-700" />
              </button>
            </>
          )}
        </div>
        
        {/* Name and Job Title */}
        <div className="text-center mt-4 lg:mt-6 space-y-1 lg:space-y-2 w-full">
          {isEditing ? (
            <div className="space-y-2 lg:space-y-3">
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="text-lg lg:text-2xl font-bold text-gray-900 text-center border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1 bg-transparent w-full placeholder:text-gray-400"
                placeholder="Your Name"
              />
              <div className="flex items-center justify-center gap-1 lg:gap-2 text-gray-500">
                <Briefcase size={14} className="lg:size-4" />
                <input
                  type="text"
                  value={tempProfile.jobTitle}
                  onChange={(e) => onChange('jobTitle', e.target.value)}
                  className="text-sm lg:text-lg text-center border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1 bg-transparent w-full placeholder:text-gray-400"
                  placeholder="Job Title"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1 lg:space-y-2">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight wrap-break-word">
                {profile.name || 'Your Name'}
              </h2>
              <div className="flex items-center justify-center gap-1 lg:gap-2 text-gray-600">
                <Briefcase size={14} className="lg:size-4" />
                <p className="text-sm lg:text-lg font-medium wrap-break-word">
                  {profile.jobTitle || 'Job Title'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 lg:space-y-4">
        <h3 className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 lg:mb-4 border-b border-gray-100 pb-2">
          Contact Information
        </h3>
        
        {/* Email */}
        <div className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors shrink-0">
            <Mail size={14} className="lg:size-[18px] text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <span className="text-gray-900 font-medium text-sm lg:text-base truncate block">
              {profile.email || 'email@example.com'}
            </span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors shrink-0">
            <Phone size={14} className="lg:size-[18px] text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Phone</p>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none py-0.5 lg:py-1 text-gray-900 font-medium text-sm lg:text-base placeholder:text-gray-400"
                placeholder="+1 (555) 123-4567"
              />
            ) : (
              <span className="text-gray-900 font-medium text-sm lg:text-base">
                {profile.phone || '+1 (555) 123-4567'}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="p-1.5 lg:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors shrink-0">
            <MapPin size={14} className="lg:size-[18px] text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Location</p>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.location}
                onChange={(e) => onChange('location', e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none py-0.5 lg:py-1 text-gray-900 font-medium text-sm lg:text-base placeholder:text-gray-400"
                placeholder="City, Country"
              />
            ) : (
              <span className="text-gray-900 font-medium text-sm lg:text-base">
                {profile.location || 'City, Country'}
              </span>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="p-1.5 lg:p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors shrink-0">
            <Calendar size={14} className="lg:size-[18px] text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Experience</p>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.experience}
                onChange={(e) => onChange('experience', e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none py-0.5 lg:py-1 text-gray-900 font-medium text-sm lg:text-base placeholder:text-gray-400"
                placeholder="5 years"
              />
            ) : (
              <span className="text-gray-900 font-medium text-sm lg:text-base">
                {profile.experience ? `${profile.experience} experience` : 'Experience'}
              </span>
            )}
          </div>
        </div>

        {/* Availability Status */}
        <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg lg:rounded-xl border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">Available for interviews</p>
              <p className="text-xs text-gray-600 mt-0.5">Active now</p>
            </div>
            <div className="flex items-center gap-1 lg:gap-2 shrink-0">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;