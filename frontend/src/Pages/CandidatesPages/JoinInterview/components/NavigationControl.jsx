'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';

const NavigationControls = ({ onPrevious, onNext, currentQuestion, totalQuestions, hasPrevious, hasNext }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {currentQuestion} of {totalQuestions}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
              ${hasPrevious
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {/* Flag/Complete Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors">
            <Flag size={18} />
            Flag Question
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
              ${hasNext
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            {hasNext ? 'Next Question' : 'Complete Interview'}
            {hasNext ? <ChevronRight size={20} /> : <CheckCircle size={20} />}
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {!hasNext && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">All questions completed!</h4>
              <p className="text-sm text-green-700">
                Review your answers or submit the interview when ready.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationControls;