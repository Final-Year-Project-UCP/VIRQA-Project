import React from 'react';
import { Calendar, Clock, Building, ArrowRight, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const ScheduledInterviews = ({ onJoin }) => {
    // Mock data for scheduled interviews
    const interviews = [
        {
            id: 1,
            role: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            interviewer: "Sarah Johnson",
            date: "Today",
            time: "10:30 AM",
            status: "ready", // ready, upcoming, completed
            duration: "45 min"
        },
        {
            id: 2,
            role: "Full Stack Engineer",
            company: "InnovateLabs",
            interviewer: "Mike Chen",
            date: "Tomorrow",
            time: "2:00 PM",
            status: "upcoming",
            duration: "60 min"
        },
        {
            id: 3,
            role: "React Native Specialist",
            company: "AppWorks",
            interviewer: "Jessica Williams",
            date: "Dec 16, 2025",
            time: "11:00 AM",
            status: "upcoming",
            duration: "30 min"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6 font-sans">
            <div className="max-w-8xl mx-auto">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Scheduled Interviews</h1>
                    <p className="mt-2 text-slate-500">View and join your upcoming technical interview sessions.</p>
                </div>

                {/* Interview List */}
                <div className="space-y-6">
                    {interviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl p-6 shadow-sm border ${interview.status === 'ready' ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-200'} hover:shadow-md transition-all duration-300`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                {/* Left: Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between md:hidden mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'ready'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {interview.status === 'ready' ? 'Ready to Join' : 'Upcoming'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">{interview.role}</h3>

                                    <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium">
                                        <Building size={16} className="text-slate-400" />
                                        {interview.company}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-indigo-500/80" />
                                            {interview.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} className="text-indigo-500/80" />
                                            {interview.time} ({interview.duration})
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Video size={16} className="text-indigo-500/80" />
                                            With {interview.interviewer}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action */}
                                <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                                    <span className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'ready'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {interview.status === 'ready' ? 'Ready to Join' : 'Upcoming'}
                                    </span>

                                    <button
                                        onClick={() => interview.status === 'ready' && onJoin(interview)}
                                        disabled={interview.status !== 'ready'}
                                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${interview.status === 'ready'
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:scale-[1.02]'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {interview.status === 'ready' ? 'Join Lobby' : 'Not Started'}
                                        {interview.status === 'ready' && <ArrowRight size={18} />}
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduledInterviews;
