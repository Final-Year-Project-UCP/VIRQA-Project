import { useState } from 'react';
import { Search, Star, Calendar, User, Briefcase, MessageSquare, Shield, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api.js';

const AdminFeedback = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInterview, setSelectedInterview] = useState('all');

    const { data: feedbackData = [], isLoading, error } = useQuery({
        queryKey: ['adminGlobalFeedback'],
        queryFn: async () => {
            const res = await api.get('/feedback/admin');
            return res.data?.data || [];
        }
    });

    // Get unique interview titles for filter
    const interviewTitles = ['all', ...new Set(feedbackData.map(f => f.interviewTitle))].filter(Boolean);

    // Filter feedback
    const filteredFeedback = feedbackData
        .filter(feedback => {
            const matchesSearch =
                feedback.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.interviewTitle.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesInterview = selectedInterview === 'all' || feedback.interviewTitle === selectedInterview;

            return matchesSearch && matchesInterview;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    // Calculate stats
    const avgRating = feedbackData.length > 0
        ? (feedbackData.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackData.length).toFixed(1)
        : "0.0";

    const uniqueCandidates = new Set(feedbackData.map(f => f.candidateEmail)).size;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Accessing feedback registry...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
                    <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Access Error</h3>
                    <p className="text-gray-500 mb-6">Could not fetch global feedback from server.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-blue-600" size={32} />
                        <h1 className="text-3xl font-bold text-gray-900">System Feedback</h1>
                    </div>
                    <p className="text-gray-600">Global overview of candidate sentiment and interview quality across the platform</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total System Signals</p>
                                <p className="text-3xl font-bold text-gray-900">{feedbackData.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Global Platform Score</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Candidates</p>
                                <p className="text-3xl font-bold text-gray-900">{uniqueCandidates}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Omni Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by candidate, email, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Interview Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Filter</label>
                            <select
                                value={selectedInterview}
                                onChange={(e) => setSelectedInterview(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {interviewTitles.map(title => (
                                    <option key={title} value={title}>
                                        {title === 'all' ? 'All Roles & Campaigns' : title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {filteredFeedback.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registry Empty</h3>
                            <p className="text-gray-600">No feedback matching your criteria was found.</p>
                        </div>
                    ) : (
                        filteredFeedback.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                                        <div className="flex-1 w-full">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feedback.candidateName}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span className="break-all">{feedback.candidateEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    <span>{feedback.interviewTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(feedback.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto justify-between md:justify-start">
                                            {renderStars(feedback.rating)}
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                                {feedback.category || "General Feedback"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Feedback Text */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            "{feedback.feedback}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Results Count */}
                {filteredFeedback.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Registry reflects {filteredFeedback.length} of {feedbackData.length} signals
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFeedback;
