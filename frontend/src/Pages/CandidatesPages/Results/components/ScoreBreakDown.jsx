'use client';

import React from 'react';
import { Star, Target, MessageCircle, Zap, CheckCircle, Clock } from 'lucide-react';

const ScoreBreakdown = ({ metrics }) => {
  const getMetricIcon = (metric) => {
    const icons = {
      'Semantic Accuracy': <Target size={18} />,
      'Fluency': <MessageCircle size={18} />,
      'Tone / Sentiment': <Zap size={18} />,
      'Completeness': <CheckCircle size={18} />,
      'Confidence Score': <Star size={18} />,
      'Topic Coverage': <Clock size={18} />
    };
    return icons[metric] || <Star size={18} />;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getBarColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Breakdown</h2>

      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {getMetricIcon(metric.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(metric.score)}`}>
                    {metric.score}/100
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getBarColor(metric.score)}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= Math.ceil(metric.score / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {Math.ceil(metric.score / 20)}/5 stars
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Chips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Performance Summary</h4>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(metric.score)}`}
            >
              {metric.name}: {metric.score}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;