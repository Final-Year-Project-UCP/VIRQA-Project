import { Calendar, Clock, Users, Plus, ChevronRight, Mail, CheckCircle2, XCircle, Edit, ExternalLink, Settings } from 'lucide-react';

const InterviewListView = ({ interviews, onCreateNew, onViewInterview, onEditInterview }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'InProgress':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Completed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
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
        if (!timeStr) return 'TBD';
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                    <div
                        key={interview._id}
                        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden flex flex-col"
                    >
                        {/* Status Header */}
                        <div className="p-6 pb-2 flex items-center justify-between">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${getStatusColor(interview.status)}`}>
                                {interview.status}
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditInterview(interview);
                                    }}
                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    title="Edit Session"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-4 flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                                {interview.jobTitle}
                            </h3>
                            
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    {formatDate(interview.scheduledDate)}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    {formatTime(interview.startTime)} • {interview.duration}m
                                </div>
                            </div>
                        </div>

                        {/* Footer Progress */}
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-gray-50 mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {interview.candidates.slice(0, 3).map((c, idx) => (
                                            <div key={idx} className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-xs font-black text-blue-600 uppercase shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                                                {c.email.substring(0, 2)}
                                            </div>
                                        ))}
                                        {interview.candidates.length > 3 && (
                                            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                                                +{interview.candidates.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                                            {interview.candidates.length} Invited
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                            Batch Stats
                                        </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => onViewInterview(interview)}
                                    className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-blue-200"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InterviewListView;
