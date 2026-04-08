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
    { title: 'Configuration', subtitle: 'Domain & Skills' },
    { title: 'Generate',      subtitle: 'AI Questions' },
    { title: 'Select',        subtitle: 'Pick Questions' },
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

    // Step 3 – Generated
    generatedQuestions: [],

    // Step 4 – Selected
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
                questionType: payload.questionType,
                numberOfQuestions: payload.numberOfQuestions,
                generatedQuestions: payload.generatedQuestions,
                selectedQuestions: payload.selectedQuestions,
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
            questionType: session.questionType || '',
            numberOfQuestions: session.numberOfQuestions || 5,
            generatedQuestions: session.generatedQuestions || [],
            selectedQuestions: session.selectedQuestions || [],
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">

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

                {/* ═══════════════ VIEW: FORM (5-Step Wizard) ═══════════════ */}
                {currentView === 'form' && (
                    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                            <div className="space-y-1">
                                <button
                                    onClick={handleBackToList}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold mb-2 text-sm"
                                    disabled={saveMutation.isPending}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Cancel
                                </button>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {editingId ? 'Edit Interview Session' : 'Create New Interview'}
                                </h1>
                                <p className="text-gray-500 font-medium italic">
                                    Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                                <span className="text-sm font-bold text-indigo-700">AI-Powered Question Generation</span>
                            </div>
                        </div>

                        {/* Step Indicator */}
                        <StepIndicator currentStep={currentStep} steps={STEPS} />

                        {/* Step Content */}
                        <div className="transition-all duration-300">
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
                                <QuestionGenerationStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={() => setCurrentStep(3)}
                                    onBack={() => setCurrentStep(1)}
                                />
                            )}
                            {currentStep === 3 && (
                                <QuestionSelectionStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={() => setCurrentStep(4)}
                                    onBack={() => setCurrentStep(2)}
                                />
                            )}
                            {currentStep === 4 && (
                                <SchedulingStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    onBack={() => setCurrentStep(3)}
                                    onSubmit={handleSubmit}
                                    isSubmitting={saveMutation.isPending}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateInterview;
