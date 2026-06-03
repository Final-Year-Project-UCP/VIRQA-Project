'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Volume2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
};

const Lobby = ({ onJoin, session }) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [audioStream, setAudioStream] = useState(null);
    const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    // Get current user from storage or context (placeholder for now, will use generic "Candidate")
    const userName = "Me"; 

    useEffect(() => {
        let stream = null;

        const startAudio = async () => {
            if (isMicOn) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    setAudioStream(stream);

                    // Audio Visualization Setup
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                    sourceRef.current.connect(analyserRef.current);
                    analyserRef.current.fftSize = 256;

                    const bufferLength = analyserRef.current.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const draw = () => {
                        if (!analyserRef.current) return;
                        analyserRef.current.getByteFrequencyData(dataArray);

                        // Calculate average volume for simple ripple effect
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / bufferLength;
                        setVolumeLevel(average);

                        animationRef.current = requestAnimationFrame(draw);
                    };

                    draw();

                } catch (error) {
                    console.error("Error accessing microphone:", error);
                    setIsMicOn(false);
                }
            } else {
                if (audioStream) {
                    audioStream.getTracks().forEach(track => track.stop());
                    setAudioStream(null);
                }
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                setVolumeLevel(0);
            }
        };

        startAudio();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [isMicOn]);

    const toggleMic = () => setIsMicOn(!isMicOn);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex items-center justify-center py-6 min-h-[calc(100vh-200px)]"
        >
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[500px]">

                {/* Left: Audio Check Visualization */}
                <div className="w-full lg:w-3/5 bg-gray-900 p-8 flex flex-col items-center justify-center relative">

                    {/* Animated Audio Visualizer Circle */}
                    <div className="relative flex items-center justify-center">
                        {/* Ripples */}
                        <div className="absolute w-32 h-32 bg-indigo-500/30 rounded-full transition-all duration-75 ease-out"
                            style={{ transform: `scale(${1 + (volumeLevel / 50)})`, opacity: 0.5 }}></div>
                        <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full transition-all duration-100 ease-out delay-75"
                            style={{ transform: `scale(${1 + (volumeLevel / 40)})`, opacity: 0.3 }}></div>

                        {/* Center Icon */}
                        <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-2xl z-10">
                            {isMicOn ? (
                                <Mic size={40} className="text-white" />
                            ) : (
                                <MicOff size={40} className="text-red-500" />
                            )}
                        </div>
                    </div>

                    <div className="mt-12 w-full max-w-xs space-y-6">
                        <div className="text-center">
                            <h3 className="text-white font-medium text-lg mb-1">Audio Check</h3>
                            <p className="text-gray-400 text-sm">
                                {isMicOn ? (volumeLevel > 5 ? "Microphone is working" : "Listening...") : "Microphone is muted"}
                            </p>
                        </div>

                        {/* Mic Toggle Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={toggleMic}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isMicOn ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-red-500 text-white hover:bg-red-600'}`}
                            >
                                {isMicOn ? (
                                    <>
                                        <Mic size={18} /> Mute Microphone
                                    </>
                                ) : (
                                    <>
                                        <MicOff size={18} /> Unmute Microphone
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Join Details */}
                <div className="w-full lg:w-2/5 p-8 flex flex-col justify-between bg-white relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                        <Settings size={120} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 whitespace-nowrap">Join Interview Session</h1>
                        <p className="text-gray-500 mb-8 max-w-sm">You are joining an AI-powered technical interview. Please ensure you are in a quiet environment.</p>

                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Target Position</p>
                                <p className="font-bold text-gray-900 uppercase tracking-tight">{session?.jobTitle}</p>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                    C
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Assigned Candidate</p>
                                    <p className="text-xs text-gray-500 font-medium">Ready to begin</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {(() => {
                            const expiresAt = session?.expiresAt ? new Date(session.expiresAt) : null;
                            const isExpired = expiresAt && new Date() > expiresAt;
                            
                            return (
                                <button
                                    onClick={!isExpired ? onJoin : undefined}
                                    disabled={isExpired}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all transform flex items-center justify-center gap-2 ${
                                        isExpired 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isExpired ? <AlertCircle size={20} /> : <Volume2 size={20} />}
                                    {isExpired ? 'Deadline Over' : 'Start Interview'}
                                </button>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Lobby;
