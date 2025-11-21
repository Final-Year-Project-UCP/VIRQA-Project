'use client';

import React from 'react';
import { Calendar, Clock, User, Video } from 'lucide-react';

export const UpcomingInterview = () => {
  const interviews = [
    {
      id: 1,
      role: 'Senior Product Designer',
      time: 'Today, 4:00 PM EST',
      interviewer: 'Jane Smith',
      type: 'video'
    },
    {
      id: 2,
      role: 'UX Designer',
      time: 'Tomorrow, 2:30 PM EST',
      interviewer: 'John Davis',
      type: 'in-person'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-blue-600" />
        <h2 className="text-base md:text-lg font-semibold text-gray-900">
          Upcoming Interviews
        </h2>
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="p-4 border border-gray-100 rounded-lg hover:shadow-sm hover:border-blue-300 transition-all"
          >
            {/* Role & Time */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                {interview.role}
              </h3>

              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                <Clock size={12} />
                {interview.time}
              </span>
            </div>

            {/* Interviewer + Join button */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <User size={14} />
                With {interview.interviewer}
              </div>

              <button className="flex items-center gap-1 bg-green-600 text-white text-xs md:text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition">
                <Video size={14} />
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingInterview;
