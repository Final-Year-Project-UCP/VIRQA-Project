'use client';

import React from 'react';
import { Star, TrendingUp, Award, Target, Zap } from 'lucide-react';

const TotalScoreCard = ({ score }) => {
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { 
      level: 'Excellent', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      ringColor: 'ring-green-500',
      gradient: 'from-green-500 to-emerald-600'
    };
    if (score >= 80) return { 
      level: 'Very Good', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      ringColor: 'ring-blue-500',
      gradient: 'from-blue-500 to-cyan-600'
    };
    if (score >= 70) return { 
      level: 'Good', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      ringColor: 'ring-yellow-500',
      gradient: 'from-yellow-500 to-amber-600'
    };
    if (score >= 60) return { 
      level: 'Average', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      ringColor: 'ring-orange-500',
      gradient: 'from-orange-500 to-red-500'
    };
    return { 
      level: 'Needs Improvement', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      ringColor: 'ring-red-500',
      gradient: 'from-red-500 to-rose-600'
    };
  };

  const performance = getPerformanceLevel(score.total);
  const circumference = 2 * Math.PI * 60; // 2*π*r where r=60

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Performance Score</h2>
            <p className="text-sm text-gray-500 mt-1">Overall interview evaluation</p>
          </div>
        </div>
        <Award size={28} className="text-blue-600" />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular Progress - Professional Version */}
        <div className="relative">
          <div className="relative w-40 h-40">
            {/* Background Circle */}
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 140 140">
              {/* Background track */}
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              
              {/* Progress arc */}
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (score.total / 100) * circumference}
                strokeLinecap="round"
                className={`text-blue-500 transition-all duration-1000 ease-out ${performance.ringColor}`}
              />
              
              {/* Animated glow effect */}
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (score.total / 100) * circumference}
                className="text-blue-200 animate-pulse"
                opacity="0.5"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{score.total}</div>
                <div className="text-sm text-gray-500 font-medium">SCORE</div>
              </div>
            </div>

            {/* Animated progress indicator */}
            <div 
              className="absolute top-0 left-1/2 w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1.5 shadow-lg"
              style={{
                transform: `rotate(${score.total * 3.6 - 90}deg) translateX(60px) rotate(${90 - score.total * 3.6}deg)`
              }}
            />
          </div>

          {/* Performance badge */}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-bold ${performance.bgColor} ${performance.color} border-2 border-white shadow-lg`}>
            {performance.level}
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={16} className="text-green-600" />
                <div className="text-2xl font-bold text-gray-900">{score.percentile}%</div>
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Percentile</div>
              <div className="text-xs text-gray-500 mt-1">Among all candidates</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={16} className="text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{score.rank}</div>
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rank</div>
              <div className="text-xs text-gray-500 mt-1">Your position</div>
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Performance Level</span>
              <span className={`font-semibold ${performance.color}`}>{performance.level}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Better Than</span>
              <span className="font-semibold text-gray-900">{score.betterThan}% of candidates</span>
            </div>

            {/* Mini progress bar for percentile */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Performance Distribution</span>
                <span>Top {score.percentile}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${performance.gradient} transition-all duration-1000 ease-out`}
                  style={{ width: `${score.percentile}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-around p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{score.questions}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{score.duration}m</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{score.accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3">
          <Star size={18} className="text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {score.total >= 80 ? 'Outstanding Performance! 🎉' : 
               score.total >= 70 ? 'Strong Performance! 👍' : 
               score.total >= 60 ? 'Good Foundation! 💪' : 
               'Keep Practicing! 📚'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {score.total >= 80 ? 'You demonstrated excellent skills and knowledge.' :
               score.total >= 70 ? 'You showed strong capabilities with some areas to improve.' :
               score.total >= 60 ? 'Solid foundation with opportunities for growth.' :
               'Focus on key areas to improve your performance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreCard;