import {
    Calendar, Clock, Users, ArrowLeft, Mail,
    CheckCircle2, XCircle, Edit, Trash2,
    Plus, Send, ExternalLink, Loader2
} from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../config/api.js';

const InterviewDetailsView = ({ session, onBack, onEdit }) => {
    const [newEmail, setNewEmail] = useState('');
    const queryClient = useQueryClient();

    // ── Add Candidate Mutation ──
    const addCandidateMutation = useMutation({
        mutationFn: async (email) => {
            const res = await api.post(`/employee/interview/${session._id}/candidate`, { email });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Candidate added and invite sent!');
            setNewEmail('');
            queryClient.invalidateQueries(['interview', session._id]);
            queryClient.invalidateQueries(['myInterviews']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to add candidate');
        }
    });

    // ── Delete Mutation ──
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/employee/interview/${session._id}`);
        },
        onSuccess: () => {
            toast.success('Interview session deleted');
            queryClient.invalidateQueries(['myInterviews']);
            onBack();
        },
        onError: () => {
            toast.error('Failed to delete session');
        }
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newEmail.trim()) return;
        addCandidateMutation.mutate(newEmail.trim().toLowerCase());
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Navigation & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium self-start"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sessions
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(session)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-bold shadow-sm"
                    >
                        <Edit className="w-4 h-4" /> Edit Session
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this session?')) {
                                deleteMutation.mutate();
                            }
                        }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-all font-bold shadow-sm"
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Session Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{session.jobTitle}</h1>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-200">
                                        {session.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium">Batch Management & Candidate Tracking</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <Calendar className="w-4 h-4" /> Date
                                </div>
                                <p className="text-gray-900 font-bold">{formatDate(session.scheduledDate)}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <Clock className="w-4 h-4" /> Time
                                </div>
                                <p className="text-gray-900 font-bold">{session.startTime} (Local Time)</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <Users className="w-4 h-4" /> Batch Size
                                </div>
                                <p className="text-gray-900 font-bold">{session.candidates?.length || 0} Participants</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Description Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                        <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed bg-blue-50/30 p-6 rounded-xl border border-blue-50/50">
                            {session.jobDescription}
                        </div>
                    </div>
                </div>

                {/* Right: Candidate Management */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Add Candidate Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Add Candidate
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-3">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="candidate@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={addCandidateMutation.isPending}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
                            >
                                {addCandidateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                Add & Invite
                            </button>
                        </form>
                    </div>

                    {/* Candidate List Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Attendance List</h2>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            {session.candidates?.map((candidate, idx) => (
                                <div key={idx} className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shrink-0">
                                                {candidate.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-gray-900 truncate pr-2">{candidate.email}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {candidate.inviteSent ?
                                                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3 h-3" /> Invited
                                                        </span> :
                                                        <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                                                            <XCircle className="w-3 h-3" /> Failed
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 rounded-lg text-blue-600">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetailsView;
