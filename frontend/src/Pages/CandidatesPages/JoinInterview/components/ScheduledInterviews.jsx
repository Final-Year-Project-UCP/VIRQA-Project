import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Building, ArrowRight, Video, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewCard = ({ interview, onJoin }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isReady, setIsReady] = useState(false);

    const isCompleted = interview.candidates?.some(c => c.status === "Completed");

    useEffect(() => {
        if (isCompleted) return; // Don't run timer if already completed

        const calculateTime = () => {
            const now = new Date();
            const dateStr = interview.scheduledDate.split('T')[0];
            const sessionDate = new Date(`${dateStr}T${interview.startTime}:00`);
            const diff = sessionDate - now;

            if (diff <= 0) {
                setTimeLeft('Starts Now');
                setIsReady(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 24) {
                setTimeLeft(`${Math.floor(hours / 24)}d left`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m left`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s left`);
            }
            setIsReady(diff <= 0); 
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [interview, isCompleted]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${isReady && !isCompleted ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-200'} hover:shadow-md transition-all duration-300 ${isCompleted ? 'opacity-75 grayscale-[0.5]' : ''}`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{interview.jobTitle}</h3>
                        {!isReady && !isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <Timer size={10} /> {timeLeft}
                            </span>
                        )}
                        {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Assessment Submitted
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium">
                        <Building size={16} className="text-slate-400" />
                        {interview.createdBy?.organization || "Corporate Hiring"}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-indigo-500/80" />
                            {formatDate(interview.scheduledDate)}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-indigo-500/80" />
                            {interview.startTime} ({interview.duration}m)
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Video size={16} className="text-indigo-500/80" />
                            With {interview.createdBy?.fullName || "AI Interviewer"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted 
                        ? 'bg-slate-100 text-slate-500' 
                        : isReady 
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                        {isCompleted ? 'Completed' : isReady ? 'Ready to Join' : 'Upcoming'}
                    </span>

                    <button
                        onClick={() => !isCompleted && isReady && onJoin(interview)}
                        disabled={isCompleted || !isReady}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isCompleted
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : isReady
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:scale-[1.02]'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isCompleted ? 'Assessment Done' : isReady ? 'Join Lobby' : 'Not Started'}
                        {isReady && !isCompleted && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ScheduledInterviews = ({ interviews, onJoin }) => {
    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Scheduled Interviews</h1>
                    <p className="mt-2 text-slate-500">View and join your upcoming technical interview sessions.</p>
                </div>

                {/* Interview List */}
                <div className="space-y-6">
                    {interviews.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                            <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No scheduled interviews found.</p>
                        </div>
                    ) : (
                        interviews.map((interview) => (
                            <InterviewCard 
                                key={interview._id} 
                                interview={interview} 
                                onJoin={onJoin} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduledInterviews;
