import BarChart from "../../../components/charts/BarChart";
import { sampleChartData } from "../../../data/chartData";
import { Search, Eye, Mail, Users, UserPlus, Briefcase, FileText } from 'lucide-react';
import { useState } from 'react';
import { candidatesData } from "../../../data/candidatesData";


const AdminDashboard = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = candidatesData.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(search.toLowerCase()) ||
            candidate.role.toLowerCase().includes(search.toLowerCase());
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

    // Mock data for employees (since no source exists yet)
    const totalEmployees = 142; // Example value
    const totalInterviews = candidatesData.length; // Using total candidates as proxy for interviews

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, Administrator</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Employees */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Employees</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalEmployees}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Users className="text-blue-600" size={24} />
                    </div>
                </div>

                {/* Total Candidates */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Candidates</p>
                        <h3 className="text-3xl font-bold text-gray-900">{candidatesData.length}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <FileText className="text-purple-600" size={24} />
                    </div>
                </div>

                {/* Total Interviews */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Interviews</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalInterviews}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <Briefcase className="text-green-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Quick Actions & Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors group">
                            <div className="p-2 bg-blue-100 rounded-md group-hover:bg-blue-200 transition-colors">
                                <UserPlus className="text-blue-700" size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Add Employee</div>
                                <div className="text-xs text-gray-500">Register a new staff member</div>
                            </div>
                        </button>

                        <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors group">
                            <div className="p-2 bg-indigo-100 rounded-md group-hover:bg-indigo-200 transition-colors">
                                <Users className="text-indigo-700" size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Manage Employees</div>
                                <div className="text-xs text-gray-500">View and edit staff details</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Interview Analytics</h2>
                    <div className="h-64 w-full">
                        <BarChart data={sampleChartData} />
                    </div>
                </div>
            </div>

            {/* Candidates Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Candidates</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{candidate.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {candidate.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className={`font-semibold ${candidate.score === null ? 'text-gray-400' :
                                                candidate.score >= 85 ? 'text-green-600' :
                                                    candidate.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {candidate.score ? `${candidate.score}%` : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {candidate.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No candidates found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
