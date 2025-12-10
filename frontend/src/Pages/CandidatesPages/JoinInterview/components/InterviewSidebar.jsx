'use client';

import React from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  HelpCircle, 
  AlertCircle,
  Volume2,
  Zap
} from 'lucide-react';

const InterviewSidebar = ({ questions, currentQuestionIndex, onQuestionSelect, isRecording }) => {
  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    if (index < currentQuestionIndex) return 'completed';
    return 'upcoming';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Questions List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Questions List
        </h3>
        
        <div className="space-y-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(index);
            
            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)}
                disabled={isRecording}
                className={`
                  w-full text-left p-3 rounded-lg transition-all
                  ${status === 'current'
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'hover:bg-gray-50 border border-gray-200'
                  }
                  ${isRecording ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : status === 'current' ? (
                      <div className="relative">
                        <Circle size={18} className="text-blue-600" />
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75" />
                      </div>
                    ) : (
                      <Circle size={18} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Question {index + 1}
                      </span>
                      {status === 'current' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {question.text.substring(0, 50)}...
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{formatTime(question.timeLimit)}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interview Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interview Stats
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Volume2 size={16} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Questions Answered</span>
            </div>
            <span className="font-semibold text-gray-900">
              {currentQuestionIndex} / {questions.length}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <span className="font-semibold text-gray-900">
              {Math.round((currentQuestionIndex / questions.length) * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={16} className="text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700">Avg. Time per Question</span>
            </div>
            <span className="font-semibold text-gray-900">2:30</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap size={16} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Performance Score</span>
            </div>
            <span className="font-semibold text-gray-900">82%</span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          <HelpCircle size={20} className="inline mr-2" />
          Quick Tips
        </h3>
        
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Listen to the question carefully before answering</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Structure your answers clearly (Situation, Task, Action, Result)</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Speak clearly and at a moderate pace for better transcription</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Use the flag feature to mark questions for review</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewSidebar;