import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../../config/api';

const InterviewFeedbackModal = ({ session, onClose, onSubmitSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [category, setCategory] = useState('Interview Experience');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const categories = [
        'Interview Experience',
        'Technical Issues',
        'Question Quality',
        'General Feedback',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please provide a rating.");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/feedback/submit', {
                interviewSessionId: session?._id,
                rating,
                category,
                message
            });

            setIsSuccess(true);
            setTimeout(() => {
                onSubmitSuccess?.();
                onClose?.();
            }, 2500);

        } catch (error) {
            console.error("Feedback submission error:", error);
            toast.error(error?.response?.data?.message || "Failed to submit feedback.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Pattern */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 opacity-10 blur-xl"></div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-20"
                >
                    <X size={20} />
                </button>

                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
                        >
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner"
                            >
                                <CheckCircle size={40} className="w-10 h-10" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Feedback Received!</h3>
                            <p className="text-slate-500 font-medium">Thank you for helping us improve our interview experience. You can now view your results.</p>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit} 
                            className="p-8 md:p-10 relative z-10"
                        >
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-sm border border-indigo-100/50">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">How was your interview?</h2>
                                <p className="text-slate-500 text-sm">Your feedback helps us provide a better experience for future candidates.</p>
                            </div>

                            <div className="space-y-8">
                                {/* Rating Section */}
                                <div className="space-y-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className="p-1.5 transition-all outline-none"
                                            >
                                                <Star
                                                    size={36}
                                                    className={`transition-all duration-300 ${
                                                        star <= (hoveredRating || rating)
                                                            ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-md'
                                                            : 'fill-slate-100 text-slate-200 hover:scale-110'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="h-5 text-sm font-bold text-indigo-600">
                                        {rating === 1 && "Very Dissatisfied"}
                                        {rating === 2 && "Dissatisfied"}
                                        {rating === 3 && "Neutral"}
                                        {rating === 4 && "Satisfied"}
                                        {rating === 5 && "Extremely Satisfied"}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Topic</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium appearance-none"
                                        >
                                            {categories.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Detailed Feedback</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            placeholder="What went well? Did you face any issues?"
                                            className="w-full h-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium placeholder-slate-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || rating === 0}
                                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all
                                        ${isSubmitting || rating === 0
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Submit Feedback</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default InterviewFeedbackModal;
