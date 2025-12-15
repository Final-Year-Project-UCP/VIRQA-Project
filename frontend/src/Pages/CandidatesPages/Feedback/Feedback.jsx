'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Star, Send, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Mock submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return; // simple validation

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            toast.success("Feedback submitted successfully!");
            // Reset form after delay
            setTimeout(() => {
                setIsSuccess(false);
                setRating(0);
                setCategory('');
                setMessage('');
            }, 3000);
        }, 1500);
    };

    const categories = [
        'General Feedback',
        'Feature Request',
        'Bug Report',
        'Interview Experience',
        'Other'
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-8xl mx-auto flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-sm">
                            <MessageSquare size={24} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            We Value Your Feedback
                        </h1>
                        <p className="text-gray-500 text-lg max-w-lg mx-auto">
                            Help us improve your experience. Your insights shape the future of our platform.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">

                        {/* Success Overlay */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-500">Your feedback has been submitted successfully.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                            {/* Rating Section */}
                            <div className="space-y-4 text-center">
                                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    How would you rate your experience?
                                </label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors duration-200 ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-100 text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="h-6 text-sm font-medium text-blue-600">
                                    {rating === 1 && "Need improvement"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent!"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Category Select */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Topic
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select a topic</option>
                                            {categories.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Just a placeholder for layout balance or maybe email display */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Tell us more
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder="What did you like? What can we do better?"
                                    className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || rating === 0}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform
                    ${isSubmitting || rating === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] shadow-blue-500/30'
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

                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Feedback;