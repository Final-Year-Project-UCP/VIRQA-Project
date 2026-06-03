import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from "../../../config/api.js";
import {
    Search,
    Download,
    Filter,
    ArrowUpDown,
    Loader2,
    FileText,
    History,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { generateVirginReportPDF, generateVirginTranscriptPDF } from '../../../utils/pdfGenerator.js';

const ViewInterview = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [activeMenu, setActiveMenu] = useState(null);

    // Fetch all global interviews for Admin
    const { data: interviews, isLoading, error } = useQuery({
        queryKey: ['adminAllInterviews'],
        queryFn: async () => {
            const res = await api.get('admin/interviews');
            return res.data.data;
        }
    });

    const filteredData = useMemo(() => {
        if (!interviews) return [];
        let data = [...interviews];

        // Search across Title, Candidate, and Creator
        if (search) {
            const lowSearch = search.toLowerCase();
            data = data.filter(item =>
                item.interview.toLowerCase().includes(lowSearch) ||
                item.name.toLowerCase().includes(lowSearch) ||
                item.createdBy.toLowerCase().includes(lowSearch)
            );
        }

        // Filter by Status
        if (statusFilter !== 'All') {
            data = data.filter(item => item.status === statusFilter);
        }

        // Sort
        if (sortConfig.key) {
            data.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'score') {
                    aValue = aValue || -1;
                    bValue = bValue || -1;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [interviews, search, statusFilter, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDownloadReport = (item) => {
        const interviewData = {
            id: item.id,
            title: item.interview,
            company: "VIRQA Certified Assessment",
            date: item.date,
            duration: "N/A",
            score: item.score
        };

        const metricsData = (item.scores || []).map(s => ({
            name: s.questionText && s.questionText.length > 30 ? s.questionText.substring(0, 30) + '...' : (s.questionText || ''),
            score: s.overallScore || 0
        }));

        generateVirginReportPDF(interviewData, metricsData);
    };

    const handleDownloadTranscript = (item) => {
        const interviewData = {
            title: item.interview,
            date: item.date || new Date().toLocaleDateString()
        };
        generateVirginTranscriptPDF(interviewData, item.answers || []);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'In Progress': return 'bg-sky-50 text-sky-700 border-sky-100';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Global Interview Registry...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8">
            {/* Header Area */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                            <History className="text-white" size={18} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interview Ledger</h1>
                    </div>
                    <p className="text-slate-500 font-medium max-w-xl">Audit, review, and export official recruitment records across the entire organization.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-4 py-2 text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Audited</div>
                        <div className="font-black text-slate-900">{interviews?.length || 0}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden shadow-indigo-100/10">
                {/* Advanced Search & Filtering */}
                <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50/40 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify by Role, Candidate, or Organizing Staff..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-slate-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer">
                            <Filter size={18} className="text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-xs font-black text-slate-700 uppercase tracking-widest outline-none cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Completed">Completed Only</option>
                                <option value="In Progress">Active Sessions</option>
                                <option value="Pending">Awaiting Start</option>
                            </select>
                        </div>

                        <button
                            onClick={() => handleSort('score')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all shadow-sm
                                ${sortConfig.key === 'score'
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <ArrowUpDown size={18} />
                            Sort Performance
                        </button>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment / Role</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participant</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Staff Organizer</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Evaluation</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Export Module</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.interview}</div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase mt-0.5 tracking-wider">Audit Ref: {item.id.substring(18)}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="text-sm font-black text-slate-600">{item.name}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase inline-block">
                                            {item.createdBy}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="text-xs font-bold text-slate-500">{item.date}</div>
                                        <div className="text-[10px] font-black text-slate-300 mt-1">{item.time}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 inline-flex text-[10px] font-black leading-5 uppercase tracking-widest rounded-xl border shadow-sm ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        {item.status === 'Completed' && item.score !== null ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${item.score >= 85 ? 'text-emerald-600 border-emerald-100 bg-emerald-50' :
                                                    item.score >= 70 ? 'text-amber-600 border-amber-100 bg-amber-50' : 'text-rose-600 border-rose-100 bg-rose-50'
                                                    }`}>
                                                    {item.score}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400">/ 100</div>
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-black text-slate-300 italic uppercase">Awaiting Data</div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm">
                                        {item.status === 'Completed' ? (
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                                    className="flex items-center justify-end gap-2 px-4 py-2.5 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-200"
                                                >
                                                    <Download size={14} />
                                                    Download
                                                    <ChevronDown size={14} />
                                                </button>

                                                {activeMenu === item.id && (
                                                    <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl bg-white border border-slate-100 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                                        <div className="p-2 space-y-1">
                                                            <button
                                                                onClick={() => { handleDownloadReport(item); setActiveMenu(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-left rounded-xl"
                                                            >
                                                                <FileText size={16} /> Evaluation Report
                                                            </button>
                                                            <button
                                                                onClick={() => { handleDownloadTranscript(item); setActiveMenu(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-left rounded-xl"
                                                            >
                                                                <ExternalLink size={16} /> Full Transcript
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 italic uppercase tracking-wider">Reports Disabled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Search size={32} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Matching Audits Found In Registry</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Authenticated Session: Administrator</div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ledger Module v4.1</div>
            </div>
        </div>
    );
};

export default ViewInterview;