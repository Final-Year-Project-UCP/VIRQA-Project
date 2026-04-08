import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, isProcessing }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // release mic
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access your microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner my-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Your Answer</h3>
            
            {isProcessing ? (
                <div className="flex flex-col items-center text-blue-500 animate-pulse">
                    <Loader className="w-12 h-12 animate-spin mb-2" />
                    <span className="text-sm font-semibold">Processing logic...</span>
                </div>
            ) : isRecording ? (
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center mb-4">
                        <div className="absolute w-16 h-16 bg-red-400 rounded-full animate-ping opacity-75"></div>
                        <button
                            onClick={stopRecording}
                            className="relative z-10 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                            title="Stop Recording"
                        >
                            <Square className="w-8 h-8" />
                        </button>
                    </div>
                    <span className="text-red-500 font-semibold animate-pulse">Recording... Click to stop</span>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <button
                        onClick={startRecording}
                        className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg mb-4 hover:scale-105 active:scale-95"
                        title="Start Recording"
                    >
                        <Mic className="w-8 h-8" />
                    </button>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Click to start speaking</span>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
