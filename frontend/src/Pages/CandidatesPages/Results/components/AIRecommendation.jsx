'use client';

import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, ThumbsUp, Target } from 'lucide-react';

const AIRecommendations = ({ feedback }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Lightbulb size={20} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Feedback & Recommendations</h2>
          <p className="text-sm text-gray-500 mt-1">Personalized insights to improve your performance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Strengths */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp size={18} className="text-green-600" />
            <h3 className="font-semibold text-green-900">Your Strengths</h3>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-green-800">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-orange-600" />
            <h3 className="font-semibold text-orange-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {feedback.weakAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-orange-800">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {feedback.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="p-1 bg-white rounded-lg mt-0.5 flex-shrink-0">
                  <AlertCircle size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium">{recommendation.title}</p>
                  <p className="text-blue-700 text-sm mt-1">{recommendation.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Tips */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Tips for Next Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feedback.quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-2">
                <Lightbulb size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;