'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Clock } from 'lucide-react';

const QuestionSection = ({ question, currentQuestion, totalQuestions }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Volume2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Question {currentQuestion}</h2>
            <p className="text-sm text-gray-500">of {totalQuestions} total questions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>Time limit: {Math.floor(question.timeLimit / 60)}:{String(question.timeLimit % 60).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Audio Player */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={question.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>

      {/* Question Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Question Text</h3>
        <p className="text-gray-900 text-lg leading-relaxed">{question.text}</p>
      </div>

      {/* Question Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for answering</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Structure your answer clearly</li>
          <li>• Use specific examples from your experience</li>
          <li>• Keep your answer within the time limit</li>
        </ul>
      </div>
    </div>
  );
};

export default QuestionSection;