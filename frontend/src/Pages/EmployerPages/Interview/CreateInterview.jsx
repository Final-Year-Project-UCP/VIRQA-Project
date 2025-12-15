import { useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '../../../components/interview/StepIndicator';
import JobDetailsStep from '../../../components/interview/JobDetailsStep';
import AIPromptStep from '../../../components/interview/AIPromptStep';
import SchedulingStep from '../../../components/interview/SchedulingStep';
import InterviewListView from '../../../components/interview/InterviewListView';
import EmptyInterviewState from '../../../components/interview/EmptyInterviewState';

const CreateInterviewForm = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [currentStep, setCurrentStep] = useState(0);
  const [editingInterview, setEditingInterview] = useState(null);

  // Dummy scheduled interviews data
  const [scheduledInterviews, setScheduledInterviews] = useState([
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      jobDescription: 'We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern web technologies. The ideal candidate will have 5+ years of experience building scalable web applications.',
      candidateCount: 8,
      startDate: '2025-12-20',
      startTime: '14:00',
      duration: 60,
      status: 'Scheduled',
      createdAt: '2025-12-15',
      aiPrompt: 'You are an AI interviewer...'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Engineer',
      jobDescription: 'Join our team as a Full Stack Engineer. You will work on both frontend and backend systems, building features that impact millions of users.',
      candidateCount: 12,
      startDate: '2025-12-22',
      startTime: '10:00',
      duration: 90,
      status: 'Scheduled',
      createdAt: '2025-12-14',
      aiPrompt: 'You are an AI interviewer...'
    },
    {
      id: 3,
      jobTitle: 'UI/UX Designer',
      jobDescription: 'We need a creative UI/UX Designer to craft beautiful and intuitive user experiences. Experience with Figma and design systems is required.',
      candidateCount: 5,
      startDate: '2025-12-18',
      startTime: '15:30',
      duration: 45,
      status: 'In Progress',
      createdAt: '2025-12-10',
      aiPrompt: 'You are an AI interviewer...'
    }
  ]);

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

  const steps = [
    { title: 'Job Details', subtitle: 'Title & Description' },
    { title: 'AI Prompt', subtitle: 'Generate & Review' },
    { title: 'Schedule', subtitle: 'Date & Time' }
  ];

  const handleCreateNew = () => {
    setEditingInterview(null);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewInterview = (interview) => {
    setEditingInterview(interview);
    setFormData({
      jobTitle: interview.jobTitle,
      jobDescription: interview.jobDescription,
      candidateEmails: [], // Would be populated from backend
      aiPrompt: interview.aiPrompt,
      startDate: interview.startDate,
      startTime: interview.startTime,
      duration: interview.duration.toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    setCurrentStep(0);
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingInterview(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (finalData) => {
    if (editingInterview) {
      // Update existing interview
      setScheduledInterviews(prev =>
        prev.map(interview =>
          interview.id === editingInterview.id
            ? {
              ...interview,
              ...finalData,
              candidateCount: finalData.candidateEmails?.length || interview.candidateCount
            }
            : interview
        )
      );
      toast.success('Interview updated successfully!');
    } else {
      // Create new interview
      const newInterview = {
        id: scheduledInterviews.length + 1,
        jobTitle: finalData.jobTitle,
        jobDescription: finalData.jobDescription,
        candidateCount: finalData.candidateEmails?.length || 0,
        startDate: finalData.startDate,
        startTime: finalData.startTime,
        duration: parseInt(finalData.duration),
        status: 'Scheduled',
        createdAt: new Date().toISOString().split('T')[0],
        aiPrompt: finalData.aiPrompt
      };

      setScheduledInterviews(prev => [...prev, newInterview]);
      toast.success('Interview created successfully!');
    }

    // Return to list view
    setTimeout(() => {
      handleBackToList();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-8xl mx-auto">
        {currentView === 'list' ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
              <p className="text-gray-600 mt-2">
                Create and manage AI-powered interviews
              </p>
            </div>

            {/* List or Empty State */}
            {scheduledInterviews.length > 0 ? (
              <InterviewListView
                interviews={scheduledInterviews}
                onCreateNew={handleCreateNew}
                onViewInterview={handleViewInterview}
              />
            ) : (
              <EmptyInterviewState onCreateNew={handleCreateNew} />
            )}
          </>
        ) : (
          <>
            {/* Form View Header */}
            <div className="mb-8">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Interviews</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingInterview ? 'Edit Interview' : 'Create a New Interview'}
              </h1>
              <p className="text-gray-600 mt-2">
                Follow the steps below to set up your AI-powered interview
              </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} steps={steps} />

            {/* Step Content */}
            <div className="transition-all duration-300">
              {currentStep === 0 && (
                <JobDetailsStep
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                />
              )}

              {currentStep === 1 && (
                <AIPromptStep
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 2 && (
                <SchedulingStep
                  formData={formData}
                  setFormData={setFormData}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateInterviewForm;
