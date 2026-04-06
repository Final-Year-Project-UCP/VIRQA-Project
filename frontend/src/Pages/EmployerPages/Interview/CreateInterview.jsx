import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StepIndicator from '../../../components/interview/StepIndicator';
import JobDetailsStep from '../../../components/interview/JobDetailsStep';
import AIPromptStep from '../../../components/interview/AIPromptStep';
import SchedulingStep from '../../../components/interview/SchedulingStep';
import InterviewListView from '../../../components/interview/InterviewListView';
import EmptyInterviewState from '../../../components/interview/EmptyInterviewState';
import InterviewDetailsView from '../../../components/interview/InterviewDetailsView';
import { api } from '../../../config/api.js';

const CreateInterview = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'form' | 'details'
  const [currentStep, setCurrentStep] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    candidateEmails: [],
    aiPrompt: '',
    startDate: '',
    startTime: '',
    duration: '60',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

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

  // ── Create/Update Mutation ──
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return api.patch(`employee/interview/${editingId}`, {
          jobTitle: payload.jobTitle,
          jobDescription: payload.jobDescription,
          topic: payload.aiPrompt,
          scheduledDate: payload.startDate,
          startTime: payload.startTime,
          duration: parseInt(payload.duration) || 60
        });
      } else {
        return api.post('employee/interview/create', {
          jobTitle: payload.jobTitle,
          jobDescription: payload.jobDescription,
          topic: payload.aiPrompt,
          scheduledDate: payload.startDate,
          startTime: payload.startTime,
          duration: parseInt(payload.duration) || 60,
          candidateEmails: payload.candidateEmails
        });
      }
    },
    onSuccess: () => {
      toast.success(editingId ? 'Interview updated!' : 'Interview created and invites sent!');
      queryClient.invalidateQueries(['myInterviews']);
      if (editingId) queryClient.invalidateQueries(['interview', editingId]);
      handleBackToList();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  });

  const steps = [
    { title: 'Job Details', subtitle: 'Title & Description' },
    { title: 'AI Prompt', subtitle: 'Generate & Review' },
    { title: 'Schedule', subtitle: 'Date & Time' }
  ];

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      jobTitle: '',
      jobDescription: '',
      candidateEmails: [],
      aiPrompt: '',
      startDate: '',
      startTime: '',
      duration: '60',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    setCurrentStep(0);
    setCurrentView('form');
  };

  const handleEditSession = (session) => {
    setEditingId(session._id);
    setFormData({
      jobTitle: session.jobTitle,
      jobDescription: session.jobDescription,
      candidateEmails: session.candidates.map(c => c.email),
      aiPrompt: session.topic,
      startDate: session.scheduledDate.split('T')[0],
      startTime: session.startTime,
      duration: session.duration.toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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
        <p className="text-gray-600 font-medium tracking-tight">Syncing with server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* VIEW: List */}
        {currentView === 'list' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recruitment Dashboard</h1>
                    <p className="text-gray-500 font-medium">Manage your AI-powered interview sessions and candidates.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-white transition-all">Analytics</button>
                    <button 
                        onClick={handleCreateNew}
                        className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-200 transition-all"
                    >
                        New Session
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

        {/* VIEW: Details */}
        {currentView === 'details' && singleRecord && (
          <InterviewDetailsView 
            session={singleRecord} 
            onBack={handleBackToList}
            onEdit={handleEditSession}
          />
        )}

        {/* VIEW: Form (Add/Edit) */}
        {currentView === 'form' && (
          <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">
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
                        {editingId ? 'Edit Session Config' : 'Setup New Assessment Batch'}
                    </h1>
                    <p className="text-gray-500 font-medium italic">Step through the wizard to configure your AI session.</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-blue-50/50 rounded-2xl border border-blue-50 shadow-sm">
                    <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-sm font-bold text-blue-700 tracking-tight">AI Agent Ready</span>
                </div>
            </div>

            <StepIndicator currentStep={currentStep} steps={steps} />

            <div className="transition-all duration-300">
              {currentStep === 0 && (
                <JobDetailsStep
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 1 && (
                <AIPromptStep
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
        )}
      </div>
    </div>
  );
};

export default CreateInterview;
