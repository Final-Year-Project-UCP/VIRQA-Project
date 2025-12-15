import { Calendar, Clock, Users, Plus, Edit } from 'lucide-react';

const InterviewListView = ({ interviews, onCreateNew, onViewInterview }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Scheduled Interviews</h2>
                    <p className="text-gray-600 mt-1">Manage and create AI-powered interviews</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Interview
                </button>
            </div>

            {/* Interview Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                    <div
                        key={interview.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {interview.jobTitle}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(interview.status)}`}>
                                    {interview.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {interview.jobDescription}
                            </p>

                            {/* Interview Details */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>{formatDate(interview.startDate)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>{formatTime(interview.startTime)} • {interview.duration} min</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span>{interview.candidateCount} candidates</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Created {formatDate(interview.createdAt)}
                            </span>
                            <button
                                onClick={() => onViewInterview(interview)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InterviewListView;
