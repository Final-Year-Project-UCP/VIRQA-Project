import React from 'react';
import { Calendar, Clock, User, Video, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../config/api';

export const UpcomingInterview = () => {
  const { data: myInterviews, isLoading } = useQuery({
    queryKey: ['candidateInterviews'],
    queryFn: async () => {
      const res = await api.get('candidate/my-interviews');
      return res.data?.data || [];
    }
  });

  const upcomingInterviews = (myInterviews || [])
    .filter(i => i.status === 'Scheduled' && !i.candidates?.some(c => c.status === "Completed"))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Checking Schedule...</p>
      </div>
    );
  }

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
        {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview) => {
          const expiresAt = interview.expiresAt ? new Date(interview.expiresAt) : null;
          const isExpired = expiresAt && new Date() > expiresAt;

          return (
            <div
              key={interview._id}
              className={`p-4 border rounded-lg transition-all ${isExpired ? 'bg-gray-50 border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-sm hover:border-blue-300'}`}
            >
              {/* Role & Time */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {interview.jobTitle}
                </h3>

                <span className={`inline-flex items-center gap-1 text-xs md:text-sm px-2 py-1 rounded-full ${isExpired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                  {isExpired ? <AlertCircle size={12} /> : <Clock size={12} />}
                  {isExpired ? 'Over Deadline' : `${new Date(interview.scheduledDate).toLocaleDateString()} at ${interview.startTime}`}
                </span>
              </div>

              {/* Interviewer + Join button */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <User size={14} />
                  With {interview.createdBy?.fullName || 'AI Specialist'}
                </div>

                <a 
                  href={isExpired ? "#" : "/api/v1/candidates/join"}
                  onClick={(e) => isExpired && e.preventDefault()}
                  className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1.5 rounded-lg font-medium transition ${isExpired 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'}`}
                >
                  <Video size={14} />
                  {isExpired ? 'Deadline Over' : 'Join'}
                </a>
              </div>
            </div>
          );
        }) : (
          <div className="py-10 text-center text-gray-400 border border-dashed border-gray-100 rounded-lg">
            <p className="text-sm">No upcoming interviews scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingInterview;