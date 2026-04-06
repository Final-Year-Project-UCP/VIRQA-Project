import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from "../../../config/api.js";
import BarChart from "../../../components/charts/BarChart";
import { Search, Users, UserPlus, Briefcase, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    // Fetch dynamic dashboard stats from the backend
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: async () => {
            const res = await api.get('admin/dashboard-stats');
            return res.data.data;
        }
    });

    const stats = {
        totalEmployees: dashboardData?.totalEmployees || 0,
        totalCandidates: dashboardData?.totalCandidates || 0,
        totalInterviews: dashboardData?.totalInterviews || 0
    };

    const candidates = dashboardData?.candidates || [];
    const chartData = dashboardData?.chartData;

    const filtered = candidates.filter(candidate => {
        const matchesSearch = 
            candidate.name.toLowerCase().includes(search.toLowerCase()) ||
            candidate.role.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || candidate.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-semibold animate-pulse tracking-wide uppercase text-xs">Synchronizing Core Metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Sync Connection Failed</h2>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">The analytics engine encountered a communication error with the central server.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        Try Reconnecting
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8">

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time oversight of recruitment operations and performance.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    LIVE DATABASE CONNECTED
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Total Staff', val: stats.totalEmployees, icon: Users, color: 'blue' },
                    { label: 'Total Candidates', val: stats.totalCandidates, icon: FileText, color: 'purple' },
                    { label: 'Global Interviews', val: stats.totalInterviews, icon: Briefcase, color: 'emerald' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-110 transition-transform`}></div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter">{item.val.toLocaleString()}</h3>
                        </div>
                        <div className={`p-4 bg-${item.color}-50 text-${item.color}-600 rounded-2xl relative z-10 border border-${item.color}-100 shadow-sm`}>
                            <item.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                             Direct Administration
                        </h2>
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate('/admin/manage-employee')}
                                className="w-full flex items-center gap-4 p-4 text-left rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all group hover:border-blue-200 hover:shadow-sm"
                            >
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors border border-blue-100">
                                    <UserPlus className="text-blue-700" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Provision Staff</div>
                                    <div className="text-xs text-slate-500 font-medium tracking-tight">Onboard new organizational users</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => navigate('/admin/manage-employee')}
                                className="w-full flex items-center gap-4 p-4 text-left rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all group hover:border-indigo-200 hover:shadow-sm"
                            >
                                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors border border-indigo-100">
                                    <Users className="text-indigo-700" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Master Employee Registry</div>
                                    <div className="text-xs text-slate-500 font-medium tracking-tight">Audit and management permissions</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-xs font-bold text-slate-600">All Modules Operational</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                             Global Interview Performance
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Trend Dataset: Last 7 Sessions</span>
                    </div>
                    <div className="h-64 w-full px-2">
                        {chartData ? (
                            <BarChart data={chartData} />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Insufficient performance metrics yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Candidates Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden shadow-indigo-100/20">
                <div className="p-6 lg:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">System Registry</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-platform interview oversight</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Audit by name or role..."
                                className="pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-72 bg-white transition-all shadow-sm shadow-slate-100/50 hover:border-indigo-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[140px] shadow-sm shadow-slate-100/50 transition-all hover:border-indigo-300 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Completed">Success Only</option>
                            <option value="In Progress">Active Sessions</option>
                            <option value="Pending">Awaiting Start</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Invited Candidate</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Role</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Score</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-indigo-50/20 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{candidate.name}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-slate-500">
                                        {candidate.role}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getStatusColor(candidate.status)} shadow-sm`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={`text-sm font-black tabular-nums transition-colors ${candidate.score === null ? 'text-slate-200' :
                                                candidate.score >= 85 ? 'text-emerald-600' :
                                                    candidate.score >= 70 ? 'text-amber-600' : 'text-rose-600'
                                            }`}>
                                            {candidate.score ? `${candidate.score}%` : '--'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-slate-400 italic">
                                        {candidate.date}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-200">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-4">
                                <Search size={40} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm">No synchronized records found for this entry</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Enterprise Oversight Module v2.0 • Real-time Distributed Analytics
            </div>
        </div>
    );
};

export default AdminDashboard;
