import BarChart from "../../../components/charts/BarChart";
import { sampleChartData } from "../../../data/chartData";
import { Search, Eye, Mail } from 'lucide-react';
import { useState } from 'react';
import { candidatesData } from "../../../data/candidatesData";


const EmployeeDashboard = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = candidatesData.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || candidate.status === filter;//to check if candidate is searching after applying filter
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    'All': candidatesData.length,
    'Completed': candidatesData.filter(c => c.status === 'Completed').length,
    'In Progress': candidatesData.filter(c => c.status === 'In Progress').length,
    'Pending': candidatesData.filter(c => c.status === 'Pending').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-8xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
          <p className="text-gray-600">Overview of interviews and candidate pipeline</p>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Average score of last 7 interviews</h2>


          <div className="lg:h-72 md:h-88 sm:74 w-full">
            <BarChart data={sampleChartData} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates by name or role..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Completed', 'In Progress', 'Pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold">{candidatesData.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">{statusCounts.Completed}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{statusCounts['In Progress']}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.Pending}</div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Candidates ({filtered.length})</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No candidates found. Try a different search.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filtered.map(candidate => (
                <div key={candidate.id} className="p-4 hover:bg-gray-50">
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-600">{candidate.role}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Score</div>
                        <div className={`font-semibold ${candidate.score === null ? 'text-gray-400' :
                          candidate.score >= 85 ? 'text-green-600' :
                            candidate.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {candidate.score ? `${candidate.score}%` : 'N/A'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Updated: {candidate.date}
                      </div>
                    </div>

                    <button className={`w-full flex items-center justify-center py-2 rounded-lg text-sm font-medium ${candidate.status === 'Completed'
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                      }`}>
                      {candidate.status === 'Completed' ? (
                        <>
                          <Eye size={16} className="mr-2" /> View Report
                        </>
                      ) : (
                        <>
                          <Mail size={16} className="mr-2" /> Send Reminder
                        </>
                      )}
                    </button>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="font-semibold text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-600">{candidate.role}</div>
                    </div>

                    <div className="col-span-2">
                      <div className={`font-semibold ${candidate.score === null ? 'text-gray-400' :
                        candidate.score >= 85 ? 'text-green-600' :
                          candidate.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {candidate.score ? `${candidate.score}%` : 'N/A'}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>

                    <div className="col-span-3 text-sm text-gray-600">
                      Updated: {candidate.date}
                    </div>

                    <div className="col-span-2">
                      {candidate.status === 'Completed' ? (
                        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <Eye size={16} className="mr-1" /> View Report
                        </button>
                      ) : (
                        <button className="flex items-center text-orange-600 hover:text-orange-800 text-sm font-medium">
                          <Mail size={16} className="mr-1" /> Send Reminder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filtered.length} of {candidatesData.length} candidates
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;