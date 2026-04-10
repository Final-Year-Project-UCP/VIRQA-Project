'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Edit3, Save, X } from 'lucide-react';
import { calculateProfileCompletion } from '../../../../utils/profileCompletion';

const ProfileHeader = ({ profile, tempProfile, isEditing, onEdit, onCancel, onSave }) => {
  const [completionData, setCompletionData] = useState({ progress: 0, steps: [] });
  const [showSuccess, setShowSuccess] = useState(false);

  // Determine which profile object to check
  const currentProfile = isEditing ? tempProfile : profile;

  useEffect(() => {
    if (!currentProfile) return;
    const data = calculateProfileCompletion(currentProfile);
    setCompletionData(data);
  }, [currentProfile]);

  const completion = completionData.progress;
  const incompleteItems = completionData.steps.filter(s => !s.completed).map(s => s.label);

  const handleSave = () => {
    onSave();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {showSuccess && (
        <div className="animate-slide-in p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Profile updated successfully!</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing && (
            <div className="mt-3 w-full max-w-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-medium">
                  {completion === 100 ? 'Profile Complete! 🎉' : 'Profile Completion'}
                </span>
                <span className="text-sm font-semibold text-gray-900">{completion}%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getColor(completion)}`}
                  style={{ width: `${completion}%` }}
                />
              </div>

              {completion < 100 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {incompleteItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit3 size={18} />
                {completion === 100 ? 'Update Profile' : 'Complete Profile'}
              </button>
              {completion < 100 && (
                <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                  <AlertCircle size={14} />
                  <span>{incompleteItems.length} items incomplete</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
