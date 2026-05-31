import React, { useState } from 'react';
import {
    Calendar, Clock, Users, ArrowLeft, Mail,
    CheckCircle2, XCircle, Edit, Trash2,
    Plus, Send, ExternalLink, Loader2,
    Layers, Target, Gauge, BookOpen, Hash, ListChecks, Sparkles,
    Eye, Layout, BarChart, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../config/api.js';
import axios from 'axios';
import ExecutiveAssessmentReport from './ExecutiveAssessmentReport';
import { getErrorMessage } from '../../utils/errorParser';

const DIFFICULTY_BADGE = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
};

const EXPERIENCE_BADGE = {
    Fresh: 'bg-purple-100 text-purple-700',
    Junior: 'bg-blue-100 text-blue-700',
    Mid: 'bg-orange-100 text-orange-700',
    Senior: 'bg-gray-100 text-gray-700',
};

const STATUS_BADGE = {
    Scheduled: 'bg-blue-100 text-blue-700 ring-blue-200',
    InProgress: 'bg-orange-100 text-orange-700 ring-orange-200',
    Completed: 'bg-green-100 text-green-700 ring-green-200',
};

const InterviewDetailsView = ({ session, onBack, onEdit }) => {
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [viewingReport, setViewingReport] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    const queryClient = useQueryClient();

    // ── Add Candidate Mutation ──
    const addCandidateMutation = useMutation({
        mutationFn: async ({ email, name }) => {
            const res = await api.post(`/employee/interview/${session._id}/candidate`, { email, name });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Candidate added and invite sent!');
            setNewEmail('');
            setNewName('');
            queryClient.invalidateQueries(['interview', session._id]);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to add candidate');
        }
    });

    // ── Delete Mutation ──
    const deleteMutation = useMutation({
        mutationFn: async () => { await api.delete(`/employee/interview/${session._id}`); },
        onSuccess: () => {
            toast.success('Interview session deleted');
            queryClient.invalidateQueries(['myInterviews']);
            onBack();
        },
        onError: (err) => { toast.error(getErrorMessage(err, 'Failed to delete session')); }
    });

    // ── Toggle Result Visibility Mutation ──
    const toggleResultMutation = useMutation({
        mutationFn: async (show) => {
            const res = await api.patch(`/employee/interview/${session._id}`, { showResultToCandidate: show });
            return res.data;
        },
        onSuccess: (_, show) => {
            toast.success(show ? 'Results are now visible to candidates.' : 'Results are now hidden from candidates.');
            queryClient.invalidateQueries(['myInterviews']);
            queryClient.invalidateQueries(['interview', session._id]);
        },
        onError: (err) => { toast.error(getErrorMessage(err, 'Failed to update visibility.')); }
    });

    // ── Extend Interview Time Mutation ──
    const extendTimeMutation = useMutation({
        mutationFn: async (newExpiry) => {
            const res = await api.patch(`/employee/interview/${session._id}`, { expiresAt: newExpiry });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Interview deadline extended successfully.');
            queryClient.invalidateQueries(['myInterviews']);
            queryClient.invalidateQueries(['interview', session._id]);
        },
        onError: (err) => { toast.error(getErrorMessage(err, 'Failed to extend deadline.')); }
    });

    const handleExtendTime = () => {
        const hrs = parseInt(window.prompt('Extend deadline by how many hours? (e.g. 24)', '24'), 10);
        if (!hrs || isNaN(hrs) || hrs <= 0) return;
        const base = session.expiresAt ? new Date(session.expiresAt) : new Date();
        const newExpiry = new Date(base.getTime() + hrs * 60 * 60 * 1000).toISOString();
        extendTimeMutation.mutate(newExpiry);
    };

    // ── Extend Interview Duration Mutation ──
    const extendDurationMutation = useMutation({
        mutationFn: async (newDuration) => {
            const res = await api.patch(`/employee/interview/${session._id}`, { duration: newDuration });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(`Interview duration extended to ${data?.data?.duration || 'new'} minutes successfully.`);
            queryClient.invalidateQueries(['myInterviews']);
            queryClient.invalidateQueries(['interview', session._id]);
        },
        onError: (err) => { toast.error(getErrorMessage(err, 'Failed to extend duration.')); }
    });

    const handleExtendDuration = (minutes) => {
        const currentDuration = parseInt(session.duration) || 60;
        const newDuration = currentDuration + minutes;
        extendDurationMutation.mutate(newDuration);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newEmail.trim()) return;
        addCandidateMutation.mutate({ email: newEmail.trim().toLowerCase(), name: newName.trim() });
    };

    const fetchCandidateReport = async (candidateId) => {
        try {
            setLoadingReport(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/v1/employee/interview/${session._id}/candidate/${candidateId}/result`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setReportData(response.data.data);
                setViewingReport(true);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            toast.error(error.response?.data?.message || "Failed to load evaluation report");
        } finally {
            setLoadingReport(false);
        }
    };

    if (viewingReport && reportData) {
        return (
            <ExecutiveAssessmentReport
                data={reportData}
                onBack={() => setViewingReport(false)}
                isEmployer={true}
            />
        );
    }

    const selectedQuestions = session.selectedQuestions || [];
    const skills = session.skills || [];
    const hasStructuredConfig = !!session.domain;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-7xl mx-auto"
        >
            {/* Header Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-gray-500 border border-transparent hover:border-gray-200"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${EXPERIENCE_BADGE[session.experienceLevel] || 'bg-gray-100 text-gray-700'}`}>
                                {session.experienceLevel} Level
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${DIFFICULTY_BADGE[session.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                                {session.difficulty} Difficulty
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ring-1 ${STATUS_BADGE[session.status] || 'bg-gray-100 text-gray-600 ring-gray-200'}`}>
                                {session.status}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                            {session.domain || session.jobTitle || 'Interview Session'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(session)}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-gray-50 bg-white shadow-sm"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => { if (window.confirm('Delete this session?')) deleteMutation.mutate(); }}
                        disabled={deleteMutation.isPending}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-50 bg-white shadow-sm"
                    >
                        {deleteMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details & Questions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Tiles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Date', value: new Date(session.scheduledDate).toLocaleDateString(), icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Time', value: session.startTime, icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                            { label: 'Duration', value: `${session.duration || 60}m`, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { label: 'Expires', value: session.expiresAt ? new Date(session.expiresAt).toLocaleDateString() : 'N/A', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
                            { label: 'Visibility', value: session.showResultToCandidate ? 'Visible' : 'Hidden', icon: Eye, color: 'text-red-500', bg: 'bg-red-50' },
                            { label: 'Batch Size', value: session.candidates?.length || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { label: 'Questions', value: selectedQuestions.length, icon: ListChecks, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-sm font-black text-gray-800">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Question Blueprint */}
                    {selectedQuestions.length > 0 && (
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Layout size={120} className="text-blue-900" />
                            </div>
                            <h2 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
                                <Sparkles className="text-indigo-500 w-5 h-5" />
                                Assessment Blueprint
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {selectedQuestions.map((q, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group/item">
                                        <span className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-600 transition-colors">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed">{q.questionText || q}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Legacy Description */}
                    {!hasStructuredConfig && session.jobDescription && (
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-black text-gray-800 mb-4">Job Description</h2>
                            <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                {session.jobDescription}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Attendance & Management */}
                <div className="space-y-6">
                    {/* Add Candidate Form */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" /> Add Candidate
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                            />
                            <input
                                type="email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                placeholder="Email Address *"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={addCandidateMutation.isPending}
                                className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {addCandidateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                                Invite Candidate
                            </button>
                        </form>
                    </div>

                    {/* Session Controls */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-5">
                        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-indigo-500" /> Session Controls
                        </h2>
                        {/* Result Visibility Toggle */}
                        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Show Results to Candidates</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {session.showResultToCandidate ? 'Candidates can view score & report' : 'Results are currently hidden'}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleResultMutation.mutate(!session.showResultToCandidate)}
                                disabled={toggleResultMutation.isPending}
                                title={session.showResultToCandidate ? 'Click to hide results' : 'Click to show results'}
                                className={`relative inline-flex w-12 h-6 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${session.showResultToCandidate ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${session.showResultToCandidate ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        {/* Extend Deadline */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-1">Interview Deadline</p>
                            <p className="text-xs text-gray-400 mb-3">{session.expiresAt ? new Date(session.expiresAt).toLocaleString() : 'No expiry set'}</p>
                            <button
                                onClick={handleExtendTime}
                                disabled={extendTimeMutation.isPending}
                                className="w-full py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {extendTimeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock size={14} />}
                                Extend Deadline
                            </button>
                        </div>
                        {/* Extend Duration */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-1">Interview Duration</p>
                            <p className="text-xs text-gray-400 mb-3">Current: <span className="font-bold text-gray-700">{session.duration || 60} minutes</span></p>
                            <div className="flex gap-2">
                                {[15, 20, 30].map((mins) => (
                                    <button
                                        key={mins}
                                        onClick={() => handleExtendDuration(mins)}
                                        disabled={extendDurationMutation.isPending}
                                        className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-slate-700 text-xs font-black rounded-xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                                    >
                                        +{mins}m
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Candidate Roster */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest">Candidate Roster</h2>
                        </div>
                        <div className="divide-y divide-gray-50 overflow-y-auto max-h-[500px]">
                            {session.candidates?.length === 0 ? (
                                <div className="py-20 text-center text-gray-300">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-xs font-black uppercase tracking-widest">No candidates yet</p>
                                </div>
                            ) : (
                                session.candidates?.map((candidate, idx) => (
                                    <div key={idx} className="p-6 hover:bg-gray-50/80 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-gray-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                                {(candidate.name || candidate.email).charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-gray-900 truncate">{candidate.name || 'Anonymous User'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 truncate uppercase mt-0.5">{candidate.email}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${candidate.status === 'Completed'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-gray-50 text-gray-400 border-gray-100'
                                                        }`}>
                                                        {candidate.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {candidate.status === 'Completed' && (
                                                <button
                                                    onClick={() => fetchCandidateReport(candidate.candidateId?._id || candidate.candidateId)}
                                                    disabled={loadingReport}
                                                    className="p-3 bg-white hover:bg-blue-600 hover:text-white text-blue-600 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95 disabled:opacity-50"
                                                    title="View Evaluation"
                                                >
                                                    {loadingReport ? <Loader2 size={16} className="animate-spin" /> : <Eye size={18} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InterviewDetailsView;
