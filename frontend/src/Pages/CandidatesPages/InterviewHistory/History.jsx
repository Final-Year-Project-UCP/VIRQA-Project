'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../../config/api.js';
import { generateVirginReportPDF, generateVirginTranscriptPDF } from '../../../utils/pdfGenerator.js';
import ExecutiveAssessmentReport from '../../../components/interview/ExecutiveAssessmentReport.jsx';

const InterviewHistory = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const ITEMS_PER_PAGE = 6;

  // 1. Fetch Overall Interview Sessions (Scheduled/Pending)
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: async () => {
      const res = await api.get('candidate/my-interviews');
      return res.data.data;
    }
  });

  // 2. Fetch Detailed AI Results (Completed)
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['my-results'],
    queryFn: async () => {
      const res = await api.get('candidate/my-results');
      return res.data.data;
    }
  });

  // 3. Merge & Map Data to Unified UI Format
  const mergedInterviews = useMemo(() => {
    if (!sessions) return [];

    return sessions.map(session => {
      // Find matching result if it's completed
      const result = results?.find(r => r.interviewSessionId?._id === session._id);

      const status = result ? 'Completed' : (new Date(session.scheduledDate) < new Date() ? 'Missed' : 'Scheduled');

      // AI Score logic
      let displayScore = 'Pending';
      if (result) {
        if (session.showResultToCandidate === false) {
          displayScore = 'Hidden';
        } else {
          const avg = (result.scores?.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) || 0) / (result.scores?.length || 1);
          displayScore = `${Math.round(avg)}%`;
        }
      }

      return {
        id: session._id,
        aiId: result?._id, // needed for deep view
        title: session.jobTitle || 'Technical Resource',
        date: new Date(session.scheduledDate).toLocaleDateString(),
        time: session.startTime,
        interviewer: session.createdBy?.organization || 'AI Specialist',
        status,
        score: displayScore,
        topics: session.description?.split(',').map(s => s.trim()).filter(Boolean) || ['Technical', 'Culture'],
        feedback: session.showResultToCandidate === false 
            ? 'Result will be announced soon by the employer.'
            : (result ? result.scores?.[0]?.feedback : 'No feedback generated yet.'),
        rawResult: session.showResultToCandidate === false ? null : result // hide full data
      };
    });
  }, [sessions, results]);

  const filteredData = useMemo(() => {
    let data = mergedInterviews;

    if (filterStatus !== 'All') {
      data = data.filter(i => i.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.interviewer.toLowerCase().includes(q)
      );
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [search, filterStatus, mergedInterviews]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const downloadReport = (interview) => {
    if (!interview.rawResult) return;

    // Prepare metrics data for the PDF generator
    const raw = interview.rawResult;
    const metricsData = [
      { name: 'Semantic Accuracy', score: Math.round((raw.scores?.reduce((acc, curr) => acc + (curr.semanticScore || 0), 0) || 0) / (raw.scores?.length || 1)) },
      { name: 'Technical Score', score: Math.round((raw.scores?.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0) || 0) / (raw.scores?.length || 1)) },
      { name: 'Fluency', score: parseInt(interview.score) || 0 },
      { name: 'Completeness', score: Math.max(0, (parseInt(interview.score) || 0) - 5) },
      { name: 'Confidence', score: Math.max(0, (parseInt(interview.score) || 0) - 3) },
      { name: 'Topic Coverage', score: parseInt(interview.score) || 0 }
    ];

    const pdfData = {
      title: interview.title,
      date: interview.date,
      score: parseInt(interview.score) || 0,
      rawScores: raw.scores
    };

    generateVirginReportPDF(pdfData, metricsData);
  };

  if (sessionsLoading || resultsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Assessment History...</p>
      </div>
    );
  }

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
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search role, interviewer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
          </div>

          {/* Responsive Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
            {paginatedData.length > 0 ? (
              paginatedData.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group"
                >
                  {/* Status Bar */}
                  <div className={`h-1.5 ${interview.status === 'Completed' ? 'bg-green-500' : interview.status === 'Scheduled' ? 'bg-amber-500' : 'bg-red-500'}`} />

                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {interview.title}
                      </h3>
                      {interview.status === 'Scheduled' && (
                        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-gray-900">{interview.date}</span> • {interview.time}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mb-3">
                      with <span className="font-medium text-slate-800">{interview.interviewer}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {interview.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-[10px] uppercase font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-5 mt-auto border-t border-slate-50 pt-4">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-full tracking-wider ${interview.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        interview.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {interview.status === 'Scheduled' ? 'Upcoming' : interview.status}
                      </span>
                      <span className={`text-lg sm:text-xl font-black ${interview.status === 'Completed' ? 'text-blue-600' : 'text-slate-300'}`}>
                        {interview.score}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedInterview(interview)}
                        className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs sm:text-sm font-black uppercase tracking-tighter transition"
                      >
                        <Eye size={16} /> Details
                      </button>
                      <button
                        onClick={() => downloadReport(interview)}
                        disabled={!interview.rawResult}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-tighter transition ${interview.rawResult
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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

      {/* Deep Dive Modal / Sub-view */}
      <AnimatePresence>
        {selectedInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedInterview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedInterview(null)}
                className="absolute top-6 right-6 p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
              >
                <ChevronRight className="rotate-90 text-slate-400" />
              </button>

              {selectedInterview.rawResult ? (
                /* REUSE the premium assessment component */
                <ExecutiveAssessmentReport
                  data={selectedInterview.rawResult}
                  onBack={() => setSelectedInterview(null)}
                />
              ) : (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
                    <Clock size={40} className="animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">{selectedInterview.title}</h2>
                  <p className="text-slate-500 font-bold mb-8 italic">"{selectedInterview.feedback}"</p>

                  <div className="grid md:grid-cols-2 gap-6 w-full max-w-md">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled Date</p>
                      <p className="font-bold text-slate-900">{selectedInterview.date}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting Time</p>
                      <p className="font-bold text-slate-900">{selectedInterview.time}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedInterview(null)}
                    className="mt-12 px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs border-b-4 border-slate-700 active:border-b-0"
                  >
                    Close Details
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InterviewHistory;