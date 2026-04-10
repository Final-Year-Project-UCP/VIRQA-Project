import { useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import StepIndicator from '../../../components/interview/StepIndicator';
import CandidateInfoStep from '../../../components/interview/CandidateInfoStep';
import InterviewConfigStep from '../../../components/interview/InterviewConfigStep';
import QuestionGenerationStep from '../../../components/interview/QuestionGenerationStep';
import QuestionSelectionStep from '../../../components/interview/QuestionSelectionStep';
import SchedulingStep from '../../../components/interview/SchedulingStep';
import InterviewListView from '../../../components/interview/InterviewListView';
import EmptyInterviewState from '../../../components/interview/EmptyInterviewState';
import InterviewDetailsView from '../../../components/interview/InterviewDetailsView';
import { api } from '../../../config/api.js';

const STEPS = [
    { title: 'Candidates',    subtitle: 'Name & Email' },
    { title: 'Configuration', subtitle: 'AI Parameters' },
    { title: 'Schedule',      subtitle: 'Date & Time' },
];

const defaultFormData = () => ({
    // Step 1 – Candidates
    candidates: [],                 // [{name, email}]

    // Step 2 – Config
    domain: '',
    skills: [],
    experienceLevel: 'Junior',
    difficulty: 'Medium',
    questionType: '',
    numberOfQuestions: 5,
    generalQuestionCount: 3,
    scenarioQuestionCount: 2,
    answerTimeLimit: 60,
    jobDescription: '',

    // Step 3 – Generated (No longer used in UI)
    generatedQuestions: [],

    // Step 4 – Selected (No longer used in UI)
    selectedQuestions: [],

    // Step 5 – Schedule
    startDate: '',
    startTime: '',
    duration: '60',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    expiresAt: '',
    showResultToCandidate: false,
});

const CreateInterview = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list' | 'form' | 'details'
    const [currentStep, setCurrentStep] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [formData, setFormData] = useState(defaultFormData());
    const queryClient = useQueryClient();

    // ── Fetch All Interviews ──
    const { data: records, isLoading: listLoading } = useQuery({
        queryKey: ['myInterviews'],
        queryFn: async () => {
            const res = await api.get('employee/interviews');
            return res.data?.data || [];
        }
    });

    // ── Fetch Single Interview (Details) ──
    const { data: singleRecord, isLoading: detailLoading } = useQuery({
        queryKey: ['interview', selectedSessionId],
        queryFn: async () => {
            if (!selectedSessionId) return null;
            const res = await api.get(`employee/interview/${selectedSessionId}`);
            return res.data?.data;
        },
        enabled: !!selectedSessionId
    });

    // ── Create / Update Mutation ──
    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            if (editingId) {
                // Legacy edit: send basic scheduling fields
                return api.patch(`employee/interview/${editingId}`, {
                    jobTitle: payload.domain || 'General Interview',
                    scheduledDate: payload.startDate,
                    startTime: payload.startTime,
                    duration: parseInt(payload.duration) || 60,
                    expiresAt: payload.expiresAt,
                    showResultToCandidate: payload.showResultToCandidate,
                });
            }
            // Full creation with structured config
            return api.post('employee/interview/create', {
                candidates: payload.candidates,
                domain: payload.domain,
                skills: payload.skills,
                experienceLevel: payload.experienceLevel,
                difficulty: payload.difficulty,
                generalQuestionCount: payload.generalQuestionCount,
                scenarioQuestionCount: payload.scenarioQuestionCount,
                answerTimeLimit: payload.answerTimeLimit,
                jobDescription: payload.jobDescription,
                questionType: payload.questionType,
                numberOfQuestions: payload.numberOfQuestions,
                generatedQuestions: [],
                selectedQuestions: [],
                scheduledDate: payload.startDate,
                startTime: payload.startTime,
                duration: parseInt(payload.duration) || 60,
                expiresAt: payload.expiresAt,
                showResultToCandidate: payload.showResultToCandidate,
            });
        },
        onSuccess: () => {
            toast.success(editingId ? 'Interview updated!' : 'Interview created! Invites sent to candidates.');
            queryClient.invalidateQueries(['myInterviews']);
            if (editingId) queryClient.invalidateQueries(['interview', editingId]);
            handleBackToList();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Action failed. Please try again.');
        }
    });

    // ── Navigation Helpers ──
    const handleCreateNew = () => {
        setEditingId(null);
        setFormData(defaultFormData());
        setCurrentStep(0);
        setCurrentView('form');
    };

    const handleEditSession = (session) => {
        setEditingId(session._id);
        // Pre-fill with existing data
        setFormData({
            ...defaultFormData(),
            candidates: session.candidates?.map(c => ({ name: c.name || '', email: c.email })) || [],
            domain: session.domain || session.jobTitle || '',
            skills: session.skills || [],
            experienceLevel: session.experienceLevel || 'Junior',
            difficulty: session.difficulty || 'Medium',
            generalQuestionCount: session.generalQuestionCount || 3,
            scenarioQuestionCount: session.scenarioQuestionCount || 2,
            jobDescription: session.jobDescription || '',
            questionType: session.questionType || '',
            numberOfQuestions: session.numberOfQuestions || 5,
            generatedQuestions: [],
            selectedQuestions: [],
            startDate: session.scheduledDate?.split('T')[0] || '',
            startTime: session.startTime || '',
            duration: session.duration?.toString() || '60',
            expiresAt: session.expiresAt ? session.expiresAt.slice(0, 16) : '',
            showResultToCandidate: session.showResultToCandidate || false,
        });
        setCurrentStep(0);
        setCurrentView('form');
    };

    const handleShowDetails = (session) => {
        setSelectedSessionId(session._id);
        setCurrentView('details');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setEditingId(null);
        setSelectedSessionId(null);
        setCurrentStep(0);
    };

    const handleSubmit = (finalData) => {
        saveMutation.mutate(finalData);
    };

    const isLoading = listLoading || (currentView === 'details' && detailLoading);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium tracking-tight">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* ═══════════════ VIEW: LIST ═══════════════ */}
                {currentView === 'list' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recruitment Dashboard</h1>
                                <p className="text-gray-500 font-medium">Manage your AI-powered interview sessions and candidates.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                                <button className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-white transition-all">
                                    Analytics
                                </button>
                                <button
                                    onClick={handleCreateNew}
                                    className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-200 transition-all"
                                >
                                    + New Session
                                </button>
                            </div>
                        </div>

                        {records?.length > 0 ? (
                            <InterviewListView
                                interviews={records}
                                onCreateNew={handleCreateNew}
                                onViewInterview={handleShowDetails}
                                onEditInterview={handleEditSession}
                            />
                        ) : (
                            <EmptyInterviewState onCreateNew={handleCreateNew} />
                        )}
                    </div>
                )}

                {/* ═══════════════ VIEW: DETAILS ═══════════════ */}
                {currentView === 'details' && singleRecord && (
                    <InterviewDetailsView
                        session={singleRecord}
                        onBack={handleBackToList}
                        onEdit={handleEditSession}
                    />
                )}

                {/* ═══════════════ VIEW: FORM (Wizard) ═══════════════ */}
                {currentView === 'form' && (
                    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-700 ease-out">
                        
                        {/* Top Navigation & Status */}
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={handleBackToList}
                                className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 transition-all font-bold text-sm bg-white rounded-xl border border-gray-100 shadow-sm"
                                disabled={saveMutation.isPending}
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                            </button>
                            <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white border border-indigo-50 rounded-2xl shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Live Configuration</span>
                            </div>
                        </div>

                        {/* Main Wizard Card */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                            {/* Card Header Section */}
                            <div className="p-10 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2.5 bg-blue-50 rounded-xl">
                                            <Sparkles className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">New Session</span>
                                    </div>
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                        {editingId ? 'Refine Session' : 'Setup Interview'}
                                    </h1>
                                    <p className="text-gray-500 font-medium text-lg">
                                        {STEPS[currentStep].subtitle}
                                    </p>
                                </div>
                                <div className="pb-1">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-sm font-bold text-gray-400">Step</span>
                                        <span className="text-sm font-black text-gray-900">{currentStep + 1}</span>
                                        <span className="text-sm font-bold text-gray-200">/</span>
                                        <span className="text-sm font-bold text-gray-300">{STEPS.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider & Indicator */}
                            <div className="px-10 mt-8">
                                <StepIndicator currentStep={currentStep} steps={STEPS} />
                            </div>

                            {/* Content Body */}
                            <div className="p-10 pt-4 transition-all duration-500 min-h-[400px]">
                                {currentStep === 0 && (
                                    <CandidateInfoStep
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={() => setCurrentStep(1)}
                                    />
                                )}
                                {currentStep === 1 && (
                                    <InterviewConfigStep
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={() => setCurrentStep(2)}
                                        onBack={() => setCurrentStep(0)}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <SchedulingStep
                                        formData={formData}
                                        setFormData={setFormData}
                                        onBack={() => setCurrentStep(1)}
                                        onSubmit={handleSubmit}
                                        isSubmitting={saveMutation.isPending}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateInterview;
