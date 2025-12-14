'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Maximize2, Minimize2, BarChart2, MessageSquare, MoreVertical, BrainCircuit, User } from 'lucide-react';

const ActiveSession = ({ onLeave, userName, interviewerName, role }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Countdown State
    const [countdown, setCountdown] = useState(3); // 3, 2, 1, 'GO!', null (started)
    const [hasStarted, setHasStarted] = useState(false);

    // Simulated stats
    const [isMicOn, setIsMicOn] = useState(true);
    const [aiSpeaking, setAiSpeaking] = useState(false); // Simulate AI activity

    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Countdown Logic
    useEffect(() => {
        if (countdown === null) {
            setHasStarted(true);
            return;
        }

        const timer = setTimeout(() => {
            if (typeof countdown === 'number') {
                if (countdown > 1) {
                    setCountdown(countdown - 1);
                } else {
                    setCountdown('GO!');
                }
            } else if (countdown === 'GO!') {
                setCountdown(null);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);


    useEffect(() => {
        // Only start clocks and AI simulation after interview starts
        if (!hasStarted) return;

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Simulate AI speaking periodically for demo effect
        const speakTimer = setInterval(() => {
            setAiSpeaking(prev => !prev);
        }, 4000);

        return () => {
            clearInterval(timer);
            clearInterval(speakTimer);
        };
    }, [hasStarted]);

    useEffect(() => {
        handleToggleFullScreen();
    }, []);

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().then(() => setIsFullScreen(true)).catch(err => console.log(err));
        } else {
            document.exitFullscreen().then(() => setIsFullScreen(false));
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const showControls = () => {
        if (!hasStarted) return; // Don't show controls during countdown
        setControlsVisible(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 3000);
    };

    /* New State for Mobile Transcript Toggle */
    const [showMobileTranscript, setShowMobileTranscript] = useState(false);

    /* Function to toggle transcript on mobile */
    const toggleTranscript = () => {
        setShowMobileTranscript(!showMobileTranscript);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={showControls}
            className={`relative w-full h-full bg-slate-950 overflow-hidden flex flex-col ${isFullScreen ? 'h-screen' : 'min-h-screen'}`}
        >
            {/* Background Animated Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 animate-gradient-slow"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Countdown Overlay */}
            <AnimatePresence>
                {!hasStarted && (
                    <motion.div
                        className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-white font-black text-9xl tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        >
                            {countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Container - Split View for Desktop */}
            <motion.div
                className="flex flex-1 overflow-hidden relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: hasStarted ? 1 : 0 }} // Fade in content after countdown
                transition={{ duration: 0.5 }}
            >

                {/* Desktop Transcript Sidebar (Visible on LG screens) */}
                <div className="hidden lg:flex w-80 xl:w-96 bg-slate-900/80 backdrop-blur-md border-r border-white/10 flex-col h-full">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <MessageSquare size={18} className="text-indigo-400" />
                            Live Transcript
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Syncing
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Mock Conversation */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-indigo-300 font-semibold ml-1">AI Interviewer</span>
                            <div className="bg-indigo-900/30 border border-indigo-500/20 text-indigo-100 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                                Could you describe a challenging technical problem you solved recently?
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-xs text-slate-400 font-semibold mr-1">You</span>
                            <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed">
                                Sure, in my last project, I had to optimize a large dataset rendering. We were facing performance issues when loading over 10,000 records.
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-indigo-300 font-semibold ml-1">AI Interviewer</span>
                            <div className="bg-indigo-900/30 border border-indigo-500/20 text-indigo-100 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                                That sounds interesting. What specific strategy did you use to handle the DOM updates?
                            </div>
                        </div>

                        {/* Live Typing Indicator */}
                        {(aiSpeaking || isMicOn) && (
                            <div className="flex gap-1 ml-4 mt-2 p-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Central Content Area (Audio Visuals) */}
                <div className="flex-1 relative flex flex-col">

                    {/* Top Header Information (Now inside main area to sit next to sidebar) */}
                    <AnimatePresence>
                        {controlsVisible && (
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none"
                            >
                                <div className="bg-slate-900/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
                                    <h2 className="text-white font-semibold text-lg">{role}</h2>
                                    <div className="flex items-center gap-2 text-indigo-300 text-sm mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                        <span>AI Interview Session</span>
                                    </div>
                                </div>

                                <div className="text-white font-mono bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm tracking-wider pointer-events-auto">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Visuals Container */}
                    <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">

                            {/* AI Avatar */}
                            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 order-2 md:order-1">
                                <div className="relative">
                                    {aiSpeaking && (
                                        <>
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse delay-75 transform scale-125"></div>
                                        </>
                                    )}

                                    <div className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600 p-1 shadow-[0_0_60px_-15px_rgba(79,70,229,0.5)] transition-all duration-500 ${aiSpeaking ? 'scale-105 shadow-[0_0_100px_-20px_rgba(79,70,229,0.8)]' : ''}`}>
                                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-30 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmV3eTh2YmF4bXF4eW12d3Z4eW12d3Z4eW12d3Z4eW12d3Z4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2r3o5G0gq7L2/giphy.gif')] bg-cover bg-center mix-blend-screen"></div>
                                            <BrainCircuit size={56} className="text-indigo-400 relative z-10 md:w-16 md:h-16" />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">AI Interviewer</h3>
                                    <p className="text-indigo-200 text-xs md:text-sm font-medium px-4 py-1 bg-indigo-900/30 rounded-full inline-block border border-indigo-500/30">
                                        {aiSpeaking ? "Speaking..." : "Listening..."}
                                    </p>
                                </div>
                            </div>

                            {/* Candidate Audio */}
                            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 order-1 md:order-2">
                                <div className="relative">
                                    {isMicOn && (
                                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse transform scale-110"></div>
                                    )}

                                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-2xl relative">
                                        {isMicOn ? (
                                            <div className="flex gap-1 h-8 items-center">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className="w-1.5 bg-emerald-400 rounded-full animate-music-bar" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }}></div>
                                                ))}
                                            </div>
                                        ) : (
                                            <MicOff size={28} className="text-slate-500 md:w-8 md:h-8" />
                                        )}

                                        <div className="absolute -bottom-3 bg-slate-700 text-white text-[10px] md:text-xs px-2 py-0.5 rounded border border-slate-600">
                                            You
                                        </div>
                                    </div>
                                </div>
                                <div className="h-4"></div> {/* Spacer to match alignment */}
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Transcript Overlay (Slide Up) */}
            <AnimatePresence>
                {showMobileTranscript && hasStarted && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-x-0 bottom-0 top-20 bg-slate-900 z-40 rounded-t-3xl border-t border-white/10 shadow-2xl lg:hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50 rounded-t-3xl">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <MessageSquare size={18} className="text-indigo-400" />
                                Live Transcript
                            </h3>
                            <button
                                onClick={() => setShowMobileTranscript(false)}
                                className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"
                            >
                                <MoreVertical size={20} className="rotate-90" /> {/* Using rotate as a 'close' metaphor or could allow verify later to import X */}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Same content as Desktop Transcript */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-indigo-300 font-semibold ml-1">AI Interviewer</span>
                                <div className="bg-indigo-900/30 border border-indigo-500/20 text-indigo-100 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                                    Could you describe a challenging technical problem you solved recently?
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-xs text-slate-400 font-semibold mr-1">You</span>
                                <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed">
                                    Sure, in my last project, I had to optimize a large dataset rendering.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Control Bar */}
            <AnimatePresence>
                {controlsVisible && hasStarted && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 z-50 p-6 flex justify-center items-end bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-2xl p-2 px-4 md:px-6 flex items-center gap-3 md:gap-4 shadow-2xl pointer-events-auto mb-2 md:mb-4">

                            {/* Audio Controls */}
                            <div className="flex items-center gap-2 mr-2 md:mr-4 border-r border-white/10 pr-2 md:pr-4">
                                <button
                                    onClick={() => setIsMicOn(!isMicOn)}
                                    className={`p-3 md:p-4 rounded-xl transition-all flex items-center gap-2 md:gap-3 font-medium ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                    title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                                >
                                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                                    <span className="hidden md:inline">{isMicOn ? "Mute" : "Unmute"}</span>
                                </button>
                            </div>

                            {/* Central Actions - Updated for Mobile Transcript Toggle */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleTranscript}
                                    className={`p-3 rounded-xl transition-all ${showMobileTranscript ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'} lg:hidden`} /* Only show on mobile/tablet */
                                    title="Show Transcript"
                                >
                                    <MessageSquare size={20} />
                                </button>

                                {/* Desktop: This button could perhaps scroll to bottom or do settings, keeping it for symmetry or functionality */}
                                <button className="hidden lg:block p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all text-slate-400 hover:text-white" title="Settings">
                                    <BarChart2 size={20} />
                                </button>
                            </div>

                            {/* End Call & Fullscreen */}
                            <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-4 border-l border-white/10 pl-2 md:pl-4">
                                <button
                                    onClick={handleToggleFullScreen}
                                    className="p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
                                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                >
                                    {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>

                                <button
                                    onClick={onLeave}
                                    className="px-4 md:px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all flex items-center gap-2"
                                >
                                    <PhoneOff size={20} />
                                    <span className="hidden md:inline">Leave</span>
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActiveSession;
