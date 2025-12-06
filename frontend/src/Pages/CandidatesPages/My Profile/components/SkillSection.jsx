'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

const SkillsSection = ({ profile, isEditing, tempProfile, onSkillAdd, onSkillRemove }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onSkillAdd(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {(isEditing ? tempProfile.skills : profile.skills).map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => onSkillRemove(skill)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none text-sm"
          />
          <button
            onClick={handleAddSkill}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;