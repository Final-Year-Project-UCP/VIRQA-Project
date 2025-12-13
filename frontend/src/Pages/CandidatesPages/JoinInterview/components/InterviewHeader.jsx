'use client';

import React from 'react';
import { Clock, Building, User, Video } from 'lucide-react';

const InterviewHeader = ({ role, company, interviewer, currentTime, totalTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / (totalTime * 60)) * 100;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-left justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{role}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building size={16} />
                <span>{company}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>Interviewer: {interviewer}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Video size={20} className="text-green-600 animate-pulse" />
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <span className="font-mono font-semibold">
                  {formatTime(currentTime)} / {totalTime}:00
                </span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;