'use client';

import React, { useState } from 'react';
import { User, CheckCircle, XCircle, Edit3, ChevronDown } from 'lucide-react';

const ProfileCompletionCard = ({ data, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-2 bg-gray-100 rounded w-full"></div>
    </div>
  );

  const steps = [
    { id: 1, label: 'Basic Info', completed: !!data?.fullName && !!data?.email },
    { id: 2, label: 'Profile Photo', completed: !!data?.profilePhoto },
    { id: 3, label: 'Professional Bio', completed: !!data?.professionalBio },
    { id: 4, label: 'Experience Level', completed: !!data?.level },
    { id: 5, label: 'Technical Skills', completed: data?.skills?.length > 0 },
    { id: 6, label: 'Contact Number', completed: !!data?.phoneNumber },
  ];

  const completed = steps.filter(s => s.completed).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <User size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900">
              Profile Completion
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              {progress === 100 ? "Great job! Your profile is complete." : "Improve your chances by completing your profile"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronDown
            size={18}
            className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs md:text-sm font-medium text-gray-700">
            {progress}% Completed
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
          />
        </div>
      </div>

      {/* Expandable Steps */}
      {isExpanded && (
        <div className="mt-4 space-y-2">
          {steps.map(step => (
            <div
              key={step.id}
              className="flex items-center justify-between bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <Circle size={16} className="text-gray-300" />
                )}

                <span className={`text-xs md:text-sm font-medium ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>

              {!step.completed && (
                <a href="/api/v1/candidates/profile" className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                  <Edit3 size={14} className="text-white" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Button only shows if not 100% */}
      {progress < 100 && (
        <div className="mt-4">
          <a href="/api/v1/candidates/profile">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-2.5 rounded-lg text-sm md:text-sm font-medium transition active:scale-[0.98]">
              Complete Profile
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionCard;