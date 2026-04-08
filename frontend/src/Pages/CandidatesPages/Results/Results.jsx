'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api.js';
import { generateVirginReportPDF, generateVirginTranscriptPDF } from '../../../utils/pdfGenerator.js';
import ExecutiveAssessmentReport from '../../../components/interview/ExecutiveAssessmentReport';
import {
  BarChart2,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  ChevronRight,
  Search,
  Filter,
  ArrowLeft,
  FileText
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Results = () => {
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Fetch dynamic real results from backend
  const { data: resultsResponse, isLoading } = useQuery({
    queryKey: ['candidateResults'],
    queryFn: async () => {
      const res = await api.get('candidate/my-results');
      return res.data.data;
    }
  });

  // Calculate totals and format properly
  const interviewHistory = (resultsResponse || []).map(interview => {
    let rawScore = 0;
    if (interview.scores && interview.scores.length > 0) {
      const sum = interview.scores.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      rawScore = Math.round(sum / interview.scores.length);
    }

    return {
      id: interview._id,
      title: interview.interviewSessionId?.jobTitle || interview.role,
      date: new Date(interview.createdAt).toLocaleDateString(),
      time: new Date(interview.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'Completed',
      score: rawScore,
      status: interview.status,
      company: interview.interviewSessionId?.createdBy?.organization || 'System',
      interviewer: 'AI Coach',
      rawScores: interview.scores, // For detail view breakdown
      rawAnswers: interview.answers // For PDF Transcript mapping
    };
  });

  // --- Sub-Components for Detail View ---

  const DetailView = ({ interview, onBack }) => {
    return (
      <ExecutiveAssessmentReport 
        data={resultsResponse.find(r => r._id === interview.id)} 
        onBack={onBack} 
      />
    );
  };


  // --- Main List View ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 lg:p-6 pb-12">

      {/* Shared Header (Visible on List View, Hidden/Changed on Detail View handled nicely via transitions) */}
      {!selectedInterview && (
        <div className="bg-white max-w-8xl mx-auto border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <BarChart2 size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">Performance History</h1>
                <p className="text-xs text-slate-500 mt-0.5">Track your interview progress</p>
              </div>
            </div>

            {/* Search / Filter Placeholder */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedInterview ? (
            /* LIST VIEW */
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 gap-4 sm:gap-6"
            >
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                interviewHistory.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${interview.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          interview.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {interview.score}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{interview.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {interview.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {interview.duration}</span>
                            <span className="flex items-center gap-1">with {interview.interviewer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wide">
                          {interview.status}
                        </span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Empty State Helper (Hidden if list populated) */}
              {!isLoading && interviewHistory.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500">No interviews recorded yet.</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* DETAIL VIEW */
            <DetailView
              key="detail"
              interview={selectedInterview}
              onBack={() => setSelectedInterview(null)}
            />
          )}
        </AnimatePresence>
      </main>

    </div>
  );
};

export default Results;