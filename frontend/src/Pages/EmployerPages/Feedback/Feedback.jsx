import { useState } from 'react';
import { Search, Star, Calendar, User, Briefcase, MessageSquare, Mail } from 'lucide-react';

const Feedback = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInterview, setSelectedInterview] = useState('all');

    // Simplified feedback data - what candidates submit
    const feedbackData = [
        {
            id: 1,
            candidateName: 'John Doe',
            candidateEmail: 'john.doe@example.com',
            interviewTitle: 'Senior Frontend Developer',
            date: '2025-12-15',
            rating: 5,
            feedback: 'Great interview experience! The AI interviewer asked relevant questions about React and TypeScript. The questions were challenging but fair. I appreciated the focus on real-world scenarios. The platform was easy to use and the interview flow was smooth.',
            allowEmail: true
        },
        {
            id: 2,
            candidateName: 'Jane Smith',
            candidateEmail: 'jane.smith@example.com',
            interviewTitle: 'Full Stack Engineer',
            date: '2025-12-14',
            rating: 4,
            feedback: 'Very comprehensive interview covering both frontend and backend topics. Questions were quite challenging which I appreciated. Would have liked a bit more time for some of the coding questions. Overall positive experience and the AI was professional.',
            allowEmail: true
        },
        {
            id: 3,
            candidateName: 'Michael Johnson',
            candidateEmail: 'michael.j@example.com',
            interviewTitle: 'UI/UX Designer',
            date: '2025-12-13',
            rating: 3,
            feedback: 'The interview was okay. Some questions felt generic and not specific to the role. Would have preferred more focus on design thinking and portfolio discussion. Had some audio issues at the beginning which was frustrating.',
            allowEmail: false
        },
        {
            id: 4,
            candidateName: 'Sarah Williams',
            candidateEmail: 'sarah.w@example.com',
            interviewTitle: 'Senior Frontend Developer',
            date: '2025-12-12',
            rating: 5,
            feedback: 'Excellent interview process! The AI asked insightful questions and adapted based on my responses. Really impressed with how natural the conversation felt. Best AI interview I\'ve done. Would definitely recommend this platform.',
            allowEmail: true
        },
        {
            id: 5,
            candidateName: 'David Brown',
            candidateEmail: 'david.b@example.com',
            interviewTitle: 'Full Stack Engineer',
            date: '2025-12-11',
            rating: 4,
            feedback: 'Good interview experience. Questions were relevant and covered a wide range of topics. The AI was responsive and professional throughout. Minor suggestion: would be helpful to have a practice mode before the actual interview.',
            allowEmail: true
        },
        {
            id: 6,
            candidateName: 'Emily Davis',
            candidateEmail: 'emily.d@example.com',
            interviewTitle: 'UI/UX Designer',
            date: '2025-12-10',
            rating: 2,
            feedback: 'Not a great experience. The AI seemed to have trouble understanding my design-related answers. Questions felt too technical and not enough focus on UX methodology. Platform needs improvement for design roles. Audio quality was poor.',
            allowEmail: false
        }
    ];

    // Get unique interview titles for filter
    const interviewTitles = ['all', ...new Set(feedbackData.map(f => f.interviewTitle))];

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
    const avgRating = (feedbackData.reduce((acc, f) => acc + f.rating, 0) / feedbackData.length).toFixed(1);
    const emailAllowedCount = feedbackData.filter(f => f.allowEmail).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Candidate Feedback</h1>
                    <p className="text-gray-600 mt-2">Review feedback submitted by candidates after their interviews</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Feedback</p>
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
                                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
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
                                <p className="text-sm text-gray-600 mb-1">Email Allowed</p>
                                <p className="text-3xl font-bold text-gray-900">{emailAllowedCount}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by candidate or interview..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Interview Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Interview</label>
                            <select
                                value={selectedInterview}
                                onChange={(e) => setSelectedInterview(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {interviewTitles.map(title => (
                                    <option key={title} value={title}>
                                        {title === 'all' ? 'All Interviews' : title}
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria</p>
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
                                            {feedback.allowEmail && (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    Email Allowed
                                                </span>
                                            )}
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
                        Showing {filteredFeedback.length} of {feedbackData.length} feedback entries
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
