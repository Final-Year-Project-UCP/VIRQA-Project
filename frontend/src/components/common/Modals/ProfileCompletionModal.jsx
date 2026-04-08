import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, XCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionModal = ({ isOpen, onClose, data }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const requirements = [
        { label: 'Professional Bio', completed: !!data?.professionalBio, icon: User },
        { label: 'Technical Skills', completed: data?.skills?.length > 0, icon: Sparkles },
        { label: 'Contact Number', completed: !!data?.phoneNumber, icon: ShieldCheck },
        { label: 'Location', completed: !!data?.location, icon: CheckCircle },
    ];

    const completedCount = requirements.filter(r => r.completed).length;
    const progress = Math.round((completedCount / requirements.length) * 100);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-white/20"
                >
                    {/* Header Decoration */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-500" />
                    
                    <div className="p-8">
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                                <User size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h2>
                            <p className="text-slate-500">To unlock the best AI-driven interview matching, we need a bit more information about you.</p>
                        </div>

                        {/* Progress Section */}
                        <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-slate-700">{progress}% Complete</span>
                                <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-100 rounded-full">
                                    {completedCount}/{requirements.length} Steps
                                </span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Checkbox List */}
                        <div className="space-y-3 mb-8">
                            {requirements.map((req, index) => (
                                <div 
                                    key={index} 
                                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                                        req.completed 
                                            ? 'bg-emerald-50/50 border-emerald-100' 
                                            : 'bg-white border-slate-200 hover:border-blue-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${req.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <req.icon size={18} />
                                        </div>
                                        <span className={`text-sm font-medium ${req.completed ? 'text-emerald-700' : 'text-slate-600'}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                    {req.completed ? (
                                        <CheckCircle size={18} className="text-emerald-500" />
                                    ) : (
                                        <XCircle size={18} className="text-slate-300" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    onClose?.();
                                    navigate('/api/v1/candidates/profile');
                                }}
                                className="group flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                <span>Go to Profile</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
                            >
                                I'll do this later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileCompletionModal;
