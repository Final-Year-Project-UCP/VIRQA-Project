'use client';

import React, { useState } from 'react';
import InterviewHeader from './components/InterviewHeader';
import QuestionSection from './components/QuestionSection';
import RecordingControls from './components/RecordingControl';
import TranscriptionDisplay from './components/TranscriptionDetails';
import NavigationControls from './components/NavigationControl';
import InterviewSidebar from './components/InterviewSidebar';

const LiveInterviewPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewTime, setInterviewTime] = useState(0);

  // Mock interview data
  const interviewData = {
    role: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    interviewer: 'Sarah Johnson',
    duration: 45,
    totalQuestions: 8,
  };

  const questions = [
    {
      id: 1,
      audioUrl: '/api/audio/question1.mp3',
      text: 'Tell me about a challenging project you worked on and how you overcame the obstacles.',
      timeLimit: 180,
    },
    {
      id: 2,
      audioUrl: '/api/audio/question2.mp3',
      text: 'How do you handle disagreements with team members about technical decisions?',
      timeLimit: 120,
    },
    {
      id: 3,
      audioUrl: '/api/audio/question3.mp3',
      text: 'Describe your experience with modern frontend frameworks and which you prefer.',
      timeLimit: 150,
    },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // Start transcription service
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop transcription service
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTranscription('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <InterviewHeader
        role={interviewData.role}
        company={interviewData.company}
        interviewer={interviewData.interviewer}
        currentTime={interviewTime}
        totalTime={interviewData.duration}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Section */}
            <QuestionSection
              question={questions[currentQuestionIndex]}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Recording Controls */}
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              questionTimeLimit={questions[currentQuestionIndex].timeLimit}
            />

            {/* Transcription Display */}
            <TranscriptionDisplay
              transcription={transcription}
              isRecording={isRecording}
            />

            {/* Navigation Controls */}
            <NavigationControls
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              hasPrevious={currentQuestionIndex > 0}
              hasNext={currentQuestionIndex < questions.length - 1}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <InterviewSidebar
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={(index) => {
                setCurrentQuestionIndex(index);
                setTranscription('');
              }}
              isRecording={isRecording}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewPage;