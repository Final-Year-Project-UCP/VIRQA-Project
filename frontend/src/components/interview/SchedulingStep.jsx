import { useState } from 'react';
import { Calendar, Clock, Users, Layers, Gauge, CheckCircle2, Loader2, Sparkles, Target } from 'lucide-react';
import { toast } from 'react-toastify';

const DIFFICULTY_BADGE = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
};

const SchedulingStep = ({ formData, setFormData, onBack, onSubmit, isSubmitting }) => {
    const [scheduleData, setScheduleData] = useState({
        startDate: formData.startDate || '',
        startTime: formData.startTime || '',
        duration: formData.duration || '60',
        expiresAt: formData.expiresAt || '',
        showResultToCandidate: formData.showResultToCandidate || false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const handleSubmit = () => {
        if (!scheduleData.startDate) { toast.error('Please select a start date'); return; }
        if (!scheduleData.startTime) { toast.error('Please select a start time'); return; }

        const finalData = { ...formData, ...scheduleData };
        onSubmit(finalData);
    };

    const today = new Date().toISOString().split('T')[0];
    const candidateCount = formData.candidates?.length || formData.candidateEmails?.length || 0;
    const selectedCount = formData.selectedQuestions?.length || 0;

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Interview Summary ── */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
                <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Interview Summary
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs text-gray-500 font-medium">Domain</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm truncate">{formData.domain || '—'}</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Target className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs text-gray-500 font-medium">Experience</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm">{formData.experienceLevel || '—'}</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Gauge className="w-3.5 h-3.5 text-orange-600" />
                            <span className="text-xs text-gray-500 font-medium">Difficulty</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[formData.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                            {formData.difficulty || '—'}
                        </span>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs text-gray-500 font-medium">Candidates</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm">{candidateCount} invited</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs text-gray-500 font-medium">Questions</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm">{selectedCount} selected</p>
                    </div>
                    {formData.skills?.length > 0 && (
                        <div className="bg-white/70 rounded-xl p-3.5 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium mb-1.5">Top Skills</p>
                            <div className="flex flex-wrap gap-1">
                                {formData.skills.slice(0, 2).map(s => (
                                    <span key={s} className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-bold">{s}</span>
                                ))}
                                {formData.skills.length > 2 && <span className="text-xs text-gray-400">+{formData.skills.length - 2}</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Scheduling Form ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Schedule Interview
                </h2>

                <div className="space-y-5">
                    {/* Date and Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Start Date <span className="text-red-400">*</span></label>
                            <input
                                type="date"
                                value={scheduleData.startDate}
                                onChange={e => setScheduleData({ ...scheduleData, startDate: e.target.value })}
                                min={today}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Start Time <span className="text-red-400">*</span></label>
                            <input
                                type="time"
                                value={scheduleData.startTime}
                                onChange={e => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Duration</label>
                        <select
                            value={scheduleData.duration}
                            onChange={e => setScheduleData({ ...scheduleData, duration: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                        </select>
                    </div>
                    
                    {/* Expiration and Settings */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Interview Expiration (Optional)</label>
                            <input
                                type="datetime-local"
                                value={scheduleData.expiresAt}
                                onChange={e => setScheduleData({ ...scheduleData, expiresAt: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                            <span className="text-xs text-gray-500 mt-1 inline-block">Default: 24h after start time</span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mt-6 h-[46px]">
                                <input 
                                    type="checkbox" 
                                    checked={scheduleData.showResultToCandidate}
                                    onChange={e => setScheduleData({ ...scheduleData, showResultToCandidate: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                                />
                                <span className="text-sm font-semibold text-gray-700">Show Results to Candidate</span>
                            </label>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Timezone</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{scheduleData.timezone}</span>
                        </div>
                    </div>

                    {/* Confirmation preview */}
                    {scheduleData.startDate && scheduleData.startTime && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-green-800 text-sm">Interview will be scheduled for</p>
                                    <p className="text-sm text-green-700 mt-0.5">
                                        {new Date(scheduleData.startDate).toLocaleDateString('en-US', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                        {' at '}
                                        {new Date(`2000-01-01T${scheduleData.startTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric', minute: '2-digit', hour12: true
                                        })}
                                    </p>
                                    <p className="text-xs text-green-600 mt-0.5">
                                        Duration: {scheduleData.duration} minutes • {candidateCount} candidate invite{candidateCount !== 1 ? 's' : ''} will be sent
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
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    disabled={isSubmitting}
                >
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-green-300'}`}
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Creating Interview...</>
                    ) : (
                        <><CheckCircle2 className="w-5 h-5" /> Create Interview</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SchedulingStep;
