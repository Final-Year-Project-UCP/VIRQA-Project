import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../config/api';
import { Trophy, Clock, User, Building, AlertCircle } from 'lucide-react';

const InterviewHistory = () => {
  const { data: resultsResponse, isLoading } = useQuery({
    queryKey: ['interviewResults'],
    queryFn: () => api.get('/candidate/my-results')
  });

  const historyData = resultsResponse?.data?.data || [];

  const getStatusInfo = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
    if (score >= 75) return { label: 'Good', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (score >= 50) return { label: 'Average', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Poor', color: 'bg-rose-100 text-rose-700 border-rose-200' };
  };

  const processedHistory = historyData.map(item => {
    let rawScore = 0;
    if (item.scores && item.scores.length > 0) {
      const sum = item.scores.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      rawScore = Math.round(sum / item.scores.length);
    }
    const status = getStatusInfo(rawScore);

    return {
      id: item._id,
      role: item.interviewSessionId?.jobTitle || item.role,
      institute: item.interviewSessionId?.createdBy?.organization || "Corporate Hiring",
      date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      interviewer: item.interviewSessionId?.createdBy?.fullName || "AI Specialist",
      status: status.label,
      statusColor: status.color,
      score: rawScore
    };
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Compiling Histories...</p>
      </div>
    );
  }

  if (processedHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Clock className="text-gray-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Interview History</h3>
        <p className="text-gray-500 mt-1 max-w-xs mx-auto text-sm font-medium">Your completed interview assessments will appear here once finalized.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 flex flex-col overflow-hidden">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy size={20} className="text-amber-500" />
        Performance History
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              {['Role', 'Company / Institute', 'Date', 'Interviewer', 'Performance'].map((header) => (
                <th
                  key={header}
                  className="text-left py-4 px-4 text-[10px] font-black text-gray-400 tracking-[0.1em]"
                >
                  {header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {processedHistory.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-slate-50/50 transition-all duration-200"
              >
                <td className="py-4 px-4">
                  <span className="font-bold text-gray-900 truncate block max-w-[200px]">{item.role}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {item.id.slice(-6)}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Building size={14} className="text-gray-300" />
                    {item.institute}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 font-medium">{item.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">
                      {item.interviewer.charAt(0)}
                    </div>
                    {item.interviewer}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                      text-xs font-bold border ${item.statusColor}
                    `}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                    {item.status} ({item.score}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {processedHistory.map((item) => (
          <div
            key={item.id}
            className="p-5 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-300 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900 leading-tight">{item.role}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.statusColor}`}>
                {item.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Institute</span>
                <span className="text-gray-900 font-medium">{item.institute}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Date</span>
                <span className="text-gray-900 font-medium">{item.date}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Interviewer</span>
                <span className="text-gray-900 font-medium">{item.interviewer}</span>
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Overall Score</span>
                <span className="font-black text-blue-600">{item.score}%</span>
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;

