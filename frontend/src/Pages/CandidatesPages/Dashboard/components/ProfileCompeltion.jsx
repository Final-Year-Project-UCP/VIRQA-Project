'use client';

import React, { useState } from 'react';
import { User, CheckCircle, XCircle, Edit3, ChevronDown } from 'lucide-react';

const ProfileCompletionCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dummy data (later replace with backend data)
  const steps = [
    { id: 1, label: 'Basic Info', completed: true },
    { id: 2, label: 'Profile Photo', completed: true },
    { id: 3, label: 'Summary', completed: true },
    { id: 4, label: 'Experience', completed: false },
    { id: 5, label: 'Education', completed: true },
    { id: 6, label: 'Skills', completed: false },
  ];

  const completed = steps.filter(s => s.completed).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 transition-all">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <User size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900 page-search-item">
              Profile Completion
            </h2>
            <p className="text-xs md:text-sm text-gray-500 page-search-item">
              Improve your chances by completing your profile
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronDown
            size={18}
            className={`text-gray-600 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
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

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expandable Steps */}
      {isExpanded && (
        <div className="mt-4 space-y-2 animate-in fade-in duration-200">
          {steps.map(step => (
            <div
              key={step.id}
              className="flex items-center justify-between bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-gray-400" />
                )}

                <span className="text-xs md:text-sm font-medium text-gray-800">
                  {step.label}
                </span>
              </div>

              {!step.completed && (
                <button className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg">
                  <Edit3 size={14} className="text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Button */}
      <div className="mt-4">
       <a href="/api/v1/candidates/profile"> 
 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-2.5 rounded-lg text-sm md:text-sm font-medium transition">
          Complete Profile
        </button>

       </a>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
