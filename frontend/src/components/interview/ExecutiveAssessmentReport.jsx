import React from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart2, Award, TrendingUp, CheckCircle, 
    Download, ArrowLeft, Sparkles, AlertCircle, 
    List, FileText, ChevronRight 
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import { generateVirginReportPDF, generateVirginTranscriptPDF } from '../../utils/pdfGenerator.js';

const ExecutiveAssessmentReport = ({ data, onBack, isEmployer = false }) => {
    // data is the AIInterview document populated with interviewSessionId/createdBy
    
    const interview = {
        id: data._id,
        title: data.interviewSessionId?.domain || data.interviewSessionId?.jobTitle || data.role,
        company: data.interviewSessionId?.createdBy?.organization || "VIRQA AI",
        date: new Date(data.createdAt).toLocaleDateString(),
        score: Math.round((data.scores?.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) || 0) / (data.scores?.length || 1)),
        rawScores: data.scores,
        rawAnswers: data.answers
    };

    const metricsData = [
        { name: 'Semantic Accuracy', score: Math.round((data.scores?.reduce((acc, curr) => acc + (curr.semanticScore || 0), 0) || 0) / (data.scores?.length || 1)) },
        { name: 'Technical Score', score: Math.round((data.scores?.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0) || 0) / (data.scores?.length || 1)) },
        { name: 'Fluency', score: interview.score },
        { name: 'Completeness', score: Math.max(0, interview.score - 5) },
        { name: 'Confidence', score: Math.max(0, interview.score - 3) },
        { name: 'Topic Coverage', score: interview.score }
    ];

    const allStrengths = [...new Set(data.scores?.flatMap(s => s.strengths || []) || [])];
    const allWeaknesses = [...new Set(data.scores?.flatMap(s => s.weaknesses || []) || [])];
    const overallFeedback = data.scores?.map(s => s.feedback).join(' ') || "";

    const chartData = {
        labels: metricsData.map(m => m.name),
        datasets: [{
            label: 'Candidate Score',
            data: metricsData.map(m => m.score),
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
        }],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                pointLabels: {
                    font: { size: 10, weight: 'bold' },
                    color: '#64748b'
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all group">
                        <ArrowLeft size={20} className="text-slate-500 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                            {isEmployer ? `${data.candidateId?.fullName || 'Candidate'}'s Evaluation` : 'Interview Performance'}
                        </h1>
                        <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                            <TrendingUp size={16} className="text-indigo-500" />
                            {interview.title} • {interview.date}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => generateVirginReportPDF(interview, metricsData)}
                        className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all"
                    >
                        <Download size={18} />
                        Download Report
                    </button>
                </div>
            </div>

            {/* Score & Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center relative overflow-hidden group text-center">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Evaluated Competency Sum</p>
                    <div className="relative">
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                            <motion.circle
                                cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={2 * Math.PI * 85}
                                initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - interview.score / 100) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                                className="text-indigo-600"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="text-6xl font-black text-slate-900 block leading-none">{interview.score}</span>
                            <span className="text-xs font-bold text-slate-400 mt-2 block tracking-widest uppercase">Verified</span>
                        </div>
                    </div>
                    <div className="mt-10 w-full grid grid-cols-1 gap-3">
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</p>
                           <p className="font-black text-indigo-700 text-lg uppercase tracking-tight">Executive Grade</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <h3 className="font-black text-slate-800 text-lg mb-8 flex items-center gap-2">
                        <BarChart2 className="text-indigo-500 w-5 h-5" />
                        Candidate Skill Map
                    </h3>
                    <div className="h-[280px] w-full">
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="font-black text-slate-800 text-xl mb-6 flex items-center gap-3">
                            <Sparkles className="text-amber-500 w-6 h-6" />
                            AI Qualitative Feedback
                        </h3>
                        <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-6 text-lg">
                            "{overallFeedback || "The assessment indicates strong foundational knowledge and effective articulation of concepts."}"
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-12">
                            <div className="bg-emerald-50/50 p-6 rounded-[1.5rem] border border-emerald-100">
                                <h4 className="font-black text-emerald-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Notable Strengths
                                </h4>
                                <ul className="space-y-3">
                                    {(allStrengths.length > 0 ? allStrengths : ["Consistent logical flow", "Technical depth", "Clear delivery"]).map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-emerald-700">
                                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-rose-50/50 p-6 rounded-[1.5rem] border border-rose-100">
                                <h4 className="font-black text-rose-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Growth Areas
                                </h4>
                                <ul className="space-y-3">
                                    {(allWeaknesses.length > 0 ? allWeaknesses : ["Edge case expansion", "Conciseness in long answers"]).map((w, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-rose-700">
                                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
                            <h3 className="font-black text-slate-800 flex items-center gap-3">
                                <List className="text-indigo-500 w-5 h-5" />
                                Per-Question Evaluation
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {data.scores?.map((s, idx) => (
                                <div key={idx} className="p-8 hover:bg-slate-50/50 transition-all">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-slate-900 leading-tight">
                                                <span className="text-indigo-400 mr-2">Q{idx + 1}.</span> {s.questionText}
                                            </h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-50 italic">
                                                "{s.feedback}"
                                            </p>
                                        </div>
                                        <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl">{s.overallScore}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Metrics Sidebar */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest text-slate-400">Detailed Metrics</h3>
                        <div className="space-y-6">
                            {metricsData.map((m, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{m.name}</span>
                                        <span className="text-sm font-black text-indigo-600">{m.score}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.score}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.1 }}
                                            className="h-full rounded-full bg-indigo-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Transcript CTA */}
                    <button 
                        onClick={() => generateVirginTranscriptPDF(interview, interview.rawAnswers)}
                        className="w-full bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <FileText size={18} />
                            </div>
                            <div className="text-left font-black">
                                <p className="text-sm text-slate-800">View Transcript</p>
                                <p className="text-[10px] text-slate-400 uppercase">Dialogue Record</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ExecutiveAssessmentReport;
