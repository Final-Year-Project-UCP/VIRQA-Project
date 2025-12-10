'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

const RecordingControls = ({ isRecording, onStartRecording, onStopRecording, questionTimeLimit }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= questionTimeLimit) {
            onStopRecording();
            return prev;
          }
          return prev + 1;
        });
        
        // Simulate audio level
        setAudioLevel(Math.random() * 100);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, questionTimeLimit, onStopRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Recording Status */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isRecording ? 'bg-red-100' : 'bg-gray-100'}`}>
            {isRecording ? (
              <Mic size={24} className="text-red-600 animate-pulse" />
            ) : (
              <MicOff size={24} className="text-gray-600" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </h3>
            <p className="text-sm text-gray-500">
              {isRecording 
                ? `Time: ${formatTime(recordingTime)} / ${formatTime(questionTimeLimit)}`
                : 'Click the microphone to start recording your answer'
              }
            </p>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center gap-4">
          {/* Audio Level Visualizer */}
          {isRecording && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-gray-300 rounded-full transition-all duration-150"
                  style={{
                    height: `${audioLevel > i * 10 ? i * 3 + 10 : 4}px`,
                    backgroundColor: audioLevel > i * 10 ? '#EF4444' : '#D1D5DB'
                  }}
                />
              ))}
            </div>
          )}

          {/* Recording Button */}
          <button
            onClick={handleRecordingToggle}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {isRecording ? (
              <>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic size={20} />
                Start Recording
              </>
            )}
          </button>
        </div>
      </div>

      {/* Time Limit Warning */}
      {isRecording && recordingTime >= questionTimeLimit - 30 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} className="text-yellow-600" />
          <span className="text-sm text-yellow-700">
            {recordingTime >= questionTimeLimit
              ? 'Time limit reached! Recording will stop automatically.'
              : 'Less than 30 seconds remaining'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;