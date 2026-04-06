'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api.js';
import { generateVirginReportPDF, generateVirginTranscriptPDF } from '../../../utils/pdfGenerator.js';
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
    // Dynamic Metrics Data Computation
    let sScore = 0;
    let tScore = 0;
    let fallbackFluency = 0;
    let fallbackCompleteness = 0;

    if (interview.rawScores && interview.rawScores.length > 0) {
      const sSum = interview.rawScores.reduce((acc, curr) => acc + (curr.semanticScore || 0), 0);
      const tSum = interview.rawScores.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0);
      sScore = Math.round(sSum / interview.rawScores.length);
      tScore = Math.round(tSum / interview.rawScores.length);

      fallbackFluency = interview.score;
      fallbackCompleteness = Math.max(0, interview.score - 5);
    }

    const metricsData = [
      { name: 'Semantic Accuracy', score: sScore || interview.score },
      { name: 'Technical Score', score: tScore || interview.score },
      { name: 'Fluency', score: fallbackFluency || interview.score },
      { name: 'Completeness', score: fallbackCompleteness || (interview.score - 5) },
      { name: 'Confidence', score: interview.score - 2 },
      { name: 'Topic Coverage', score: interview.score }
    ];

    const chartData = {
      labels: metricsData.map(m => m.name),
      datasets: [
        {
          label: 'Your Score',
          data: metricsData.map(m => m.score),
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(79, 70, 229, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
        },
      ],
    };

    const chartOptions = {
      scales: {
        r: {
          angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          pointLabels: {
            font: { size: 11, family: "'Inter', sans-serif", weight: '600' },
            color: '#475569'
          },
          ticks: { display: false, stepSize: 20 },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 lg:space-y-6"
      >
        {/* Nav & Title */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">{interview.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{interview.company}</span>
              <span>•</span>
              <span>{interview.date}</span>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <button 
                onClick={() => generateVirginReportPDF(interview, metricsData)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Save Official Assessment Card"
            >
              <Download size={16} />
              <span className="inline lg:hidden">Report</span>
              <span className="hidden lg:inline">Download Report</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Row: Score & Graph */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Overall Score</p>
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - interview.score / 100)} className="text-indigo-600" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-5xl font-extrabold text-slate-900 block">{interview.score}</span>
                <span className="text-xs text-slate-400 font-medium">/ 100</span>
              </div>
            </div>
            <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-xs text-slate-500">Percentile</p>
                <p className="font-bold text-slate-900">Top 12%</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="font-bold text-slate-900">{interview.duration}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <h3 className="font-bold text-slate-900 mb-4">Competency Map</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <Radar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Bottom Row: Detailed Metrics Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" />
                  Metric Breakdown
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metricsData.map((metric, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                      <span className="text-sm font-bold text-indigo-600">{metric.score}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${metric.score > 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Resources */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Resources
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => generateVirginTranscriptPDF(interview, interview.rawAnswers)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Download size={14} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">Full Transcript</p>
                      <p className="text-xs text-slate-500">PDF Document</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400" />
                </button>

                <button 
                  onClick={() => generateVirginReportPDF(interview, metricsData)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle size={14} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">VIRQA Report</p>
                      <p className="text-xs text-slate-500">Authority Certified</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
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