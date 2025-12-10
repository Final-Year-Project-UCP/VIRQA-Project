'use client';

import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, AlertCircle } from 'lucide-react';

const TranscriptionDisplay = ({ transcription, isRecording }) => {
  const [copied, setCopied] = useState(false);
  const [confidence, setConfidence] = useState(85);

  useEffect(() => {
    // Simulate transcription confidence changes
    if (isRecording) {
      const interval = setInterval(() => {
        setConfidence(prev => Math.max(70, Math.min(95, prev + (Math.random() * 10 - 5))));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Type size={20} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Live Transcription</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Confidence Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Confidence:</div>
            <div className="flex items-center gap-1">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${confidence}%`,
                    backgroundColor: confidence > 80 ? '#10B981' : confidence > 60 ? '#F59E0B' : '#EF4444'
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{confidence}%</span>
            </div>
          </div>

          {/* Copy Button */}
          {transcription && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {/* Transcription Text Area */}
      <div className="relative">
        <div className={`
          min-h-[200px] max-h-[300px] overflow-y-auto p-4 
          border border-gray-300 rounded-lg bg-gray-50
          ${isRecording ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        `}>
          {transcription ? (
            <div className="space-y-2">
              {transcription.split('. ').map((sentence, index) => (
                <p key={index} className="text-gray-900 leading-relaxed">
                  {sentence.trim()}
                  {index < transcription.split('. ').length - 1 ? '.' : ''}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[150px] text-gray-500">
              <Type size={48} className="mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">No transcription yet</p>
              <p className="text-sm">
                {isRecording 
                  ? 'Start speaking to see live transcription...'
                  : 'Start recording to begin transcription'
                }
              </p>
            </div>
          )}
        </div>

        {/* Live Indicator */}
        {isRecording && (
          <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            LIVE
          </div>
        )}
      </div>

      {/* Transcription Tips */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-gray-500 mt-0.5" />
          <div className="text-sm text-gray-600">
            <span className="font-medium">Note:</span> Transcription accuracy may vary. 
            Speak clearly and at a moderate pace for best results. 
            You can edit the transcription after the interview if needed.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;