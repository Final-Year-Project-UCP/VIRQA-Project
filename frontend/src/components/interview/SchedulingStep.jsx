import { useState } from 'react';
import { Calendar, Clock, Users, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const SchedulingStep = ({ formData, setFormData, onBack, onSubmit }) => {
    const [scheduleData, setScheduleData] = useState({
        startDate: '',
        startTime: '',
        duration: '60',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const handleSubmit = () => {
        if (!scheduleData.startDate) {
            toast.error('Please select a start date');
            return;
        }
        if (!scheduleData.startTime) {
            toast.error('Please select a start time');
            return;
        }

        const finalData = {
            ...formData,
            ...scheduleData
        };

        console.log('=== INTERVIEW CREATION DATA ===');
        console.log('Job Title:', finalData.jobTitle);
        console.log('Job Description:', finalData.jobDescription);
        console.log('Candidate Emails:', finalData.candidateEmails);
        console.log('AI Prompt:', finalData.aiPrompt);
        console.log('Start Date:', finalData.startDate);
        console.log('Start Time:', finalData.startTime);
        console.log('Duration:', finalData.duration, 'minutes');
        console.log('Timezone:', finalData.timezone);
        console.log('================================');

        onSubmit(finalData);
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            {/* Interview Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Interview Summary
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Position</span>
                        </div>
                        <p className="font-semibold text-gray-900">{formData.jobTitle}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Candidates</span>
                        </div>
                        <p className="font-semibold text-gray-900">{formData.candidateEmails?.length || 0} candidates</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">AI Prompt</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{formData.aiPrompt?.substring(0, 150)}...</p>
                    </div>
                </div>
            </div>

            {/* Scheduling Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Schedule Interview
                </h2>

                <div className="space-y-6">
                    {/* Date and Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={scheduleData.startDate}
                                onChange={(e) => setScheduleData({ ...scheduleData, startDate: e.target.value })}
                                min={today}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={scheduleData.startTime}
                                onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Interview Duration
                        </label>
                        <select
                            value={scheduleData.duration}
                            onChange={(e) => setScheduleData({ ...scheduleData, duration: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                        </select>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{scheduleData.timezone}</span>
                        </div>
                    </div>

                    {/* Preview */}
                    {scheduleData.startDate && scheduleData.startTime && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Interview Scheduled</p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(scheduleData.startDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {' at '}
                                        {new Date(`2000-01-01T${scheduleData.startTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Duration: {scheduleData.duration} minutes • {scheduleData.timezone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    Create Interview
                </button>
            </div>
        </div>
    );
};

export default SchedulingStep;
