'use client';

import React from 'react';
import ResultsHeader from './components/ResultHeader.jsx';
import TotalScoreCard from './components/TotalScoreCard.jsx';
import ScoreBreakdown from './components/ScoreBreakDown.jsx';
import AIRecommendations from './components/AIRecommendation.jsx';



const Results = () => {
  // Mock data - replace with actual API data
  const interviewData = {
    title: 'Senior Frontend Developer Interview',
    date: 'December 15, 2024',
    duration: '45 minutes',
    status: 'evaluated',
    interviewer: 'Sarah Chen'
  };

  const scoreData = {
    total: 82,
    percentile: 85,
    rank: 'Top 15%',
    betterThan: 85
  };

  const metricsData = [
    { name: 'Semantic Accuracy', score: 88 },
    { name: 'Fluency', score: 85 },
    { name: 'Tone / Sentiment', score: 90 },
    { name: 'Completeness', score: 78 },
    { name: 'Confidence Score', score: 80 },
    { name: 'Topic Coverage', score: 75 }
  ];

  const feedbackData = {
    strengths: [
      'Excellent technical knowledge in React and JavaScript',
      'Strong problem-solving approach demonstrated',
      'Good communication skills and clarity in explanations',
      'Professional tone maintained throughout'
    ],
    weakAreas: [
      'Could improve on system design questions',
      'Some answers were too brief - consider elaborating more',
      'Pace was slightly fast in technical explanations'
    ],
    recommendations: [
      {
        title: 'Practice System Design',
        description: 'Focus on high-level system architecture questions for senior roles'
      },
      {
        title: 'Expand Answer Depth',
        description: 'Provide more context and examples in your responses'
      },
      {
        title: 'Pacing Improvement',
        description: 'Practice speaking at a moderate pace for better clarity'
      }
    ],
    quickTips: [
      'Use STAR method for behavioral questions',
      'Include real-world examples in answers',
      'Ask clarifying questions before solving',
      'Summarize your solution at the end'
    ]
  };

  const transcriptData = [
    {
      speaker: 'interviewer',
      text: 'Can you walk me through your experience with React performance optimization?',
      timestamp: 30
    },
    {
      speaker: 'candidate',
      text: 'Certainly. I\'ve worked extensively on optimizing React applications. My approach includes using React.memo for component memoization, implementing useCallback and useMemo hooks to prevent unnecessary re-renders, and code splitting with React.lazy for better initial load times.',
      timestamp: 95
    },
    {
      speaker: 'interviewer',
      text: 'That\'s comprehensive. How do you handle state management in large applications?',
      timestamp: 180
    },
    {
      speaker: 'candidate',
      text: 'For large applications, I prefer using Redux Toolkit with RTK Query for server state. I also utilize React Context for theme and user preferences, and localStorage for persisting user settings.',
      timestamp: 240
    }
    // Add more transcript entries as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ResultsHeader interview={interviewData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TotalScoreCard score={scoreData} />
            <ScoreBreakdown metrics={metricsData} />
            <AIRecommendations feedback={feedbackData} />
          </div>

          {/* Right Column */}
         <div className="lg:col-span-1">
            
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;