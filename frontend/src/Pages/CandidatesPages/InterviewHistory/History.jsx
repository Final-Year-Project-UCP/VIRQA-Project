'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const dummyInterviews = [
  { id: 1, title: 'Frontend Developer', date: '2025-12-01', time: '10:00 AM', interviewer: 'John Doe', status: 'Completed', score: '85%', topics: ['React', 'JavaScript', 'CSS'], feedback: 'Strong understanding of React hooks.', reportUrl: '/report1.pdf' },
  { id: 2, title: 'Backend Developer', date: '2025-11-25', time: '2:00 PM', interviewer: 'Jane Smith', status: 'Missed', score: 'N/A', topics: ['Node.js', 'Express', 'MongoDB'], feedback: 'Candidate did not attend.', reportUrl: '/report2.pdf' },
  { id: 3, title: 'Fullstack Developer', date: '2025-12-15', time: '11:00 AM', interviewer: 'Alice Johnson', status: 'Scheduled', score: 'Pending', topics: ['React', 'Node.js', 'PostgreSQL'], feedback: 'Interview scheduled.', reportUrl: null },
  { id: 4, title: 'UI/UX Designer', date: '2025-12-08', time: '3:30 PM', interviewer: 'Mike Chen', status: 'Completed', score: '92%', topics: ['Figma', 'Prototyping'], feedback: 'Excellent portfolio.', reportUrl: '/report4.pdf' },
  { id: 5, title: 'DevOps Engineer', date: '2025-12-10', time: '9:00 AM', interviewer: 'Sarah Lee', status: 'Scheduled', score: 'Pending', topics: ['AWS', 'Docker', 'CI/CD'], feedback: 'Upcoming interview.', reportUrl: null },
  { id: 6, title: 'Data Scientist', date: '2025-11-30', time: '4:00 PM', interviewer: 'David Kim', status: 'Completed', score: '78%', topics: ['Python', 'ML', 'SQL'], feedback: 'Good knowledge.', reportUrl: '/report6.pdf' },
  { id: 7, title: 'Mobile Developer', date: '2025-12-20', time: '1:00 PM', interviewer: 'Emma Wilson', status: 'Scheduled', score: 'Pending', topics: ['React Native', 'Firebase'], feedback: 'Upcoming interview.', reportUrl: null },
];

const InterviewHistory = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const ITEMS_PER_PAGE = 6;

  const filteredData = useMemo(() => {
    let data = dummyInterviews;

    if (filterStatus !== 'All') {
      data = data.filter(i => i.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.interviewer.toLowerCase().includes(q) ||
        i.topics.some(t => t.toLowerCase().includes(q))
      );
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [search, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const downloadReport = (url, title) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}-Report.pdf`;
    a.click();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-8xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Interview History
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Your past & upcoming interviews</p>
          </div>

          {/* Search + Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search role, interviewer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
          </div>

          {/* Responsive Cards Grid */}
          {/* Replace the entire grid section with this updated version */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
            {paginatedData.length > 0 ? (
              paginatedData.map((interview) => (
                // ← Your existing card code (unchanged) →
                <div
                  key={interview.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  {/* Status Bar */}
                  <div className={`h-1.5 ${interview.status === 'Completed' ? 'bg-green-500' : interview.status === 'Scheduled' ? 'bg-amber-500' : 'bg-red-500'}`} />

                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Title + Clock Icon */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg leading-tight">
                        {interview.title}
                      </h3>
                      {interview.status === 'Scheduled' && (
                        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{interview.date}</span> • {interview.time}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mb-3">
                      with <span className="font-medium text-gray-700">{interview.interviewer}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {interview.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {topic}
                        </span>
                      ))}
                      {interview.topics.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">+{interview.topics.length - 3}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-5 mt-auto">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${interview.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        interview.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {interview.status === 'Scheduled' ? 'Pending' : interview.status}
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-gray-800">
                        {interview.score}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedInterview(interview)}
                        className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium transition"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        onClick={() => downloadReport(interview.reportUrl, interview.title)}
                        disabled={!interview.reportUrl}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${interview.reportUrl
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <Download size={16} /> Report
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Beautiful "No Results" Message */
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-6" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                  No interviews found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md">
                  {search || filterStatus !== 'All'
                    ? 'Try adjusting your search or filter to see more results.'
                    : 'You have no interviews yet. They will appear here once scheduled or completed.'}
                </p>
                {(search || filterStatus !== 'All') && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setFilterStatus('All');
                      setCurrentPage(1);
                    }}
                    className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-sm sm:text-base"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white shadow disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition ${currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white shadow disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInterview(null)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{selectedInterview.title}</h2>
            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <p><strong>Date:</strong> {selectedInterview.date} at {selectedInterview.time}</p>
              <p><strong>Interviewer:</strong> {selectedInterview.interviewer}</p>
              <p><strong>Status:</strong> <span className={selectedInterview.status === 'Scheduled' ? 'text-amber-600' : selectedInterview.status === 'Completed' ? 'text-green-600' : 'text-red-600'}>
                {selectedInterview.status === 'Scheduled' ? 'Pending' : selectedInterview.status}
              </span></p>
              <p><strong>Score:</strong> {selectedInterview.score}</p>
              <p><strong>Topics:</strong> {selectedInterview.topics.join(', ')}</p>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-1">Feedback</p>
              <p className="text-gray-600 text-sm sm:text-base">{selectedInterview.feedback}</p>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewHistory;