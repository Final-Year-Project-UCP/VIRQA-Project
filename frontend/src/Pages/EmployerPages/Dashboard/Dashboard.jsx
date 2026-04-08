import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from "../../../config/api.js";
import BarChart from "../../../components/charts/BarChart";
import { Search, Eye, Mail, Loader2 } from 'lucide-react';

const EmployeeDashboard = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Fetch dynamic dashboard stats from the backend
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['employeeDashboardStats'],
    queryFn: async () => {
      const res = await api.get('employee/dashboard-stats');
      return res.data.data;
    }
  });

  const stats = dashboardData?.stats || { total: 0, completed: 0, inProgress: 0, pending: 0 };
  const candidates = dashboardData?.candidates || [];
  const chartData = dashboardData?.chartData;

  const filtered = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.role.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'All' || candidate.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Syncing real-time workspace data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sync Error</h2>
          <p className="text-gray-500 mb-6">Failed to connect to the recruitment engine. Please verify your connection.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-8xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Recruitment Dashboard</h1>
            <p className="text-gray-600">Real-time candidate pipeline and performance analytics</p>
          </div>
          <div className="hidden md:block text-right">
             <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">Live Workspace</span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Performance Trends</h2>
            <span className="text-xs text-gray-400 font-medium">Avg Score (Last 7 Sessions)</span>
          </div>

          <div className="lg:h-72 md:h-88 h-64 w-full">
            {chartData ? (
              <BarChart data={chartData} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">Insufficient completion data for trend analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter by name, role, or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'All', count: stats.total },
              { id: 'Completed', count: stats.completed },
              { id: 'In Progress', count: stats.inProgress },
              { id: 'Pending', count: stats.pending }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {item.id} ({item.count})
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Invites', val: stats.total, color: 'text-gray-900' },
            { label: 'Completed', val: stats.completed, color: 'text-green-600' },
            { label: 'In Progress', val: stats.inProgress, color: 'text-blue-600' },
            { label: 'Awaiting Start', val: stats.pending, color: 'text-yellow-600' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-semibold text-gray-800">Pipeline Pipeline ({filtered.length})</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">No results match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(candidate => (
                <div key={candidate.id} className="p-5 hover:bg-blue-50/30 transition-colors">
                  {/* Mobile View */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.role}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(candidate.status)} border`}>
                        {candidate.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Metric</div>
                        <div className={`font-bold ${candidate.score === null ? 'text-gray-300' :
                          candidate.score >= 80 ? 'text-green-600' :
                            candidate.score >= 60 ? 'text-blue-600' : 'text-red-500'
                          }`}>
                          {candidate.score ? `${candidate.score}/100` : '--'}
                        </div>
                      </div>
                      <div className="text-[10px] font-medium text-gray-400">
                        {candidate.date}
                      </div>
                    </div>

                    <button className="w-full py-2.5 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                       {candidate.status === 'Completed' ? <Eye size={16}/> : <Mail size={16}/>}
                       {candidate.status === 'Completed' ? 'View Results' : 'Send Reminder'}
                    </button>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="font-bold text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.role}</div>
                    </div>

                    <div className="col-span-2">
                      <div className={`font-black tracking-tight ${candidate.score === null ? 'text-gray-200' :
                        candidate.score >= 80 ? 'text-emerald-600' :
                          candidate.score >= 60 ? 'text-blue-600' : 'text-red-500'
                        }`}>
                        {candidate.score ? `${candidate.score}/100` : '--'}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(candidate.status)} border border-current opacity-90`}>
                        {candidate.status}
                      </span>
                    </div>

                    <div className="col-span-3 text-sm font-medium text-gray-400">
                      {candidate.date}
                    </div>

                    <div className="col-span-2 flex justify-end">
                      {candidate.status === 'Completed' ? (
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-all group">
                          <Eye size={18} className="group-hover:scale-110 transition-transform" /> 
                          <span className="text-sm">View</span>
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold transition-all group">
                          <Mail size={18} className="group-hover:scale-110 transition-transform" /> 
                          <span className="text-sm">Remind</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Pipeline Analytics Engine • {filtered.length} active candidates
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;