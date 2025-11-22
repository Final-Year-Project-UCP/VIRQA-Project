'use client';

import React from 'react';

const BioSection = ({ profile, isEditing, tempProfile, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
      {isEditing ? (
        <textarea
          value={tempProfile.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          rows="4"
          className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Tell us about yourself..."
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
      )}
    </div>
  );
};

export default BioSection;