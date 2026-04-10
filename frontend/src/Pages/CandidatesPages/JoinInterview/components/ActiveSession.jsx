'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Maximize2, Minimize2, BarChart2, MessageSquare, BrainCircuit, Send, Shield, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../../config/api.js';
import { io } from 'socket.io-client';
import axios from 'axios';

// Ensure this points to correct backend URL
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const ActiveSession = ({ onLeave, session }) => {
    const role = session?.jobTitle || "Technical Resource";
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Countdown State
    const [countdown, setCountdown] = useState(3);
    const [hasStarted, setHasStarted] = useState(false);

    // AI & Socket State
    const [socket, setSocket] = useState(null);
    const [aiInterviewId, setAiInterviewId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [displayedQuestion, setDisplayedQuestion] = useState("");
    const [statusMessage, setStatusMessage] = useState("Initializing...");
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [finalReport, setFinalReport] = useState("");

    // Media States
    const [isMicOn, setIsMicOn] = useState(true);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const chatEndRef = useRef(null);

    // Initialize the WebSocket and request an interview session entry
    useEffect(() => {
        if (!hasStarted) return;
        
        let newSocket;

        const initializeAI = async () => {
            try {
                // 1. Create/Resume Interview Session Entry in AI Collection
                const startUrl = `${SOCKET_URL}/api/v1/ai-interview/start`;
                console.log("Initializing AI interview at:", startUrl);
                const response = await axios.post(startUrl, {
                    candidateId: session?.candidates?.[0]?.candidateId || "anonymous",
                    interviewSessionId: session?._id,
                    role: role,
                    experience: "Intermediate",
                    difficulty: "medium"
                });

                const interviewData = response.data.data;
                const interviewId = interviewData._id;
                setAiInterviewId(interviewId);

                // 3. (Implicitly) Handle Re-entry (handled by catch block if 403, or the existing check logic below)
                if (interviewData.status === "completed") {
                    alert("This interview has already been completed.");
                    onLeave();
                    return;
                }

                // 2. Restore Chat History if Resuming
                const existingChat = [];
                if (interviewData.questions && interviewData.questions.length > 0) {
                    interviewData.questions.forEach((q, idx) => {
                        existingChat.push({ sender: 'AI Interviewer', text: q.text });
                        if (interviewData.answers && interviewData.answers[idx]) {
                            existingChat.push({ sender: 'You', text: interviewData.answers[idx].transcribedText });
                        }
                    });
                }
                setChatHistory(existingChat);

                // If resuming, the socket "start-interview" will re-emit the last question.
                // We'll set the status so the user knows they're resuming.
                if (existingChat.length > 0) {
                    setStatusMessage("Resuming your session...");
                }

                // 4. Connect Socket
                newSocket = io(SOCKET_URL, { withCredentials: true });
                setSocket(newSocket);

                newSocket.on("connect", () => {
                    if (existingChat.length === 0) {
                        setStatusMessage("Connected. Generating first question...");
                    }
                    newSocket.emit("start-interview", { interviewId });
                });

                newSocket.on("next-question", (data) => {
                    const aiQuestion = data.questionText;
                    setCurrentQuestion(aiQuestion);
                    setDisplayedQuestion(""); // Reset for typewriter
                    setStatusMessage("AI is speaking...");
                    
                    setChatHistory(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.text === aiQuestion && lastMsg.sender === 'AI Interviewer') {
                            return prev;
                        }
                        return [...prev, { sender: 'AI Interviewer', text: aiQuestion }];
                    });

                    speak(aiQuestion); 
                });

                newSocket.on("processing-status", (data) => {
                    setStatusMessage(data.message || "Thinking...");
                });

                newSocket.on("transcription-result", (data) => {
                    setChatHistory(prev => [...prev, { sender: 'You', text: data.transcribedText }]);
                });

                newSocket.on("interview-completed-successfully", (data) => {
                    setFinalReport(data.finalReport);
                    onLeave(); 
                });

                newSocket.on("interview-error", (data) => {
                    console.error("Socket error:", data.message);
                    setStatusMessage(data.message);
                });

            } catch (error) {
                console.error("AI Initialization failed", error);
                
                if (error.response && error.response.status === 403) {
                    alert(error.response.data.message || "Interview already completed.");
                    onLeave();
                } else {
                    setStatusMessage("Error connecting to AI Server.");
                }
            }
        };

        initializeAI();

        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(timeInterval);
            if (newSocket) newSocket.close();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, [hasStarted, session, role, onLeave]);

    // Speech Synthesis for TTS with boundary sync
    const speak = (text) => {
        if (!window.speechSynthesis) {
            setDisplayedQuestion(text); // Fallback if no speech
            return;
        }
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Google US English") || v.name.includes("en-GB") || v.name.includes("en-US")) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        
        // Sync text reveal with speech speed
        // Note: Simple typewriter effect that starts with speech
        let charIndex = 0;
        const typeTimer = setInterval(() => {
            setDisplayedQuestion(text.substring(0, charIndex + 1));
            charIndex++;
            if (charIndex >= text.length) clearInterval(typeTimer);
        }, 50); // roughly syncs with speech speed

        utterance.onstart = () => {
            setAiSpeaking(true);
            setControlsVisible(false); // Focus on question
        };

        utterance.onend = () => {
            setAiSpeaking(false);
            setControlsVisible(true);
            setStatusMessage("Listening...");
            if (isMicOn) startRecording();
        };

        window.speechSynthesis.speak(utterance);
    };

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Countdown Logic
    useEffect(() => {
        if (countdown === null) return;
        const timer = setTimeout(() => {
            if (typeof countdown === 'number') {
                if (countdown > 1) setCountdown(countdown - 1);
                else setCountdown('GO!');
            } else if (countdown === 'GO!') {
                setCountdown(null);
                setHasStarted(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // Security: Tab Switching & Fullscreen
    useEffect(() => {
        if (!hasStarted) return;

        // Auto-Fullscreen Trigger
        try {
            if (!document.fullscreenElement) {
                containerRef.current?.requestFullscreen().catch(err => console.log("Fullscreen defer:", err));
            }
        } catch (e) {
            console.warn("Fullscreen policy restricted trigger.");
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolationCount(prev => prev + 1);
                setShowViolationAlert(true);
                toast.error("Tab switching detected! This incident has been logged.");
            }
        };

        const handleBlur = () => {
            // Also fires when tab switches or window loses focus
            if (!document.hidden) {
                setViolationCount(prev => prev + 1);
                setShowViolationAlert(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, [hasStarted]);

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().then(() => setIsFullScreen(true)).catch(err => console.log(err));
        } else {
            document.exitFullscreen().then(() => setIsFullScreen(false));
        }
    };

    const showControls = () => {
        if (!hasStarted) return;
        setControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
    };

    const [showMobileTranscript, setShowMobileTranscript] = useState(false);
    const toggleTranscript = () => setShowMobileTranscript(!showMobileTranscript);

    // Audio Web API Logic
    const startRecording = async () => {
        if (!isMicOn || aiSpeaking) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Microphone access error:", error);
            setIsMicOn(false);
        }
    };

    const stopRecordingAndSend = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                // Stop tracks completely
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                setIsRecording(false);

                // Send to socket
                if (socket && aiInterviewId) {
                    audioBlob.arrayBuffer().then(buffer => {
                        socket.emit("send-audio", {
                            interviewId: aiInterviewId,
                            currentQuestionText: currentQuestion,
                            audioBuffer: buffer
                        });
                    });
                }
            };
            mediaRecorderRef.current.stop();
        }
    };

    const toggleMic = () => {
        setIsMicOn(!isMicOn);
        // If they turn off the mic, stop recording if it was happening
        if (isRecording && isMicOn) {
            stopRecordingAndSend();
        }
    };

    const handleFinish = async () => {
        if (window.confirm("Are you sure you want to end the interview? This will submit your assessment and you won't be able to join again.")) {
            if (socket && aiInterviewId) {
                socket.emit("interview-complete", { interviewId: aiInterviewId });
            }
            onLeave();
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={showControls}
            className={`relative w-full h-full bg-slate-950 overflow-hidden flex flex-col ${isFullScreen ? 'h-screen' : 'min-h-screen'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 animate-gradient-slow"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

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

            <motion.div
                className="flex flex-1 overflow-hidden relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: hasStarted ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Desktop Transcript Sidebar */}
                <div className={`${showMobileTranscript ? 'absolute inset-0 z-40 bg-slate-900 flex' : 'hidden'} lg:flex lg:relative w-full lg:w-80 xl:w-96 bg-slate-900/80 backdrop-blur-md border-r border-white/10 flex-col h-full`}>
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <MessageSquare size={18} className="text-indigo-400" />
                            Live Transcript
                        </h3>
                        {showMobileTranscript && (
                            <button onClick={toggleTranscript} className="lg:hidden text-white bg-slate-800 px-3 border border-slate-700 py-1 rounded">Close</button>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            {statusMessage}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {chatHistory.map((chat, idx) => (
                            <div key={idx} className={`flex flex-col gap-1 ${chat.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                <span className={`text-xs font-semibold ${chat.sender === 'You' ? 'text-slate-400 mr-1' : 'text-indigo-300 ml-1'}`}>
                                    {chat.sender}
                                </span>
                                <div className={`p-3 text-sm leading-relaxed ${chat.sender === 'You' ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl rounded-tr-none' : 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-100 rounded-2xl rounded-tl-none'}`}>
                                    {chat.text}
                                </div>
                            </div>
                        ))}
                        
                        {(aiSpeaking || statusMessage.includes("Thinking") || statusMessage.includes("Transcribing")) && (
                            <div className="flex gap-1 ml-4 mt-2 p-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Central Content Area */}
                <div className="flex-1 relative flex flex-col">
                    {/* Proctoring Overlay */}
                    <AnimatePresence>
                        {showViolationAlert && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 z-50 flex items-center justify-center p-6"
                            >
                                <div className="bg-red-600/90 backdrop-blur-xl border-2 border-red-400 p-8 rounded-[2.5rem] shadow-[0_0_100px_rgba(220,38,38,0.5)] max-w-md text-center">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <XCircle size={40} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Security Violation</h3>
                                    <p className="text-red-100 font-bold mb-8">Tab switching is strictly prohibited. Your session is being monitored. Further violations may result in immediate termination.</p>
                                    <button 
                                        onClick={() => setShowViolationAlert(false)}
                                        className="w-full py-4 bg-white text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all shadow-xl"
                                    >
                                        I Understand, Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {controlsVisible && (
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none"
                            >
                                <div className="bg-slate-900/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg pointer-events-auto flex items-center gap-4">
                                    <div>
                                        <h2 className="text-white font-semibold text-lg">{role}</h2>
                                        <div className="flex items-center gap-2 text-indigo-300 text-sm mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                            <span>Interview with {session?.createdBy?.fullName || "AI Specialist"}</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                            <Shield size={12} className="text-emerald-400" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">AI PROCTORED</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pointer-events-auto">
                                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-red-400 text-xs font-black flex items-center gap-2">
                                        <AlertCircle size={14} />
                                        VIOLATIONS: {violationCount}
                                    </div>
                                    <div className="text-white font-mono bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm tracking-wider">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative">
                        {/* Dynamic Question Bubble */}
                        <AnimatePresence>
                            {aiSpeaking && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                    className="absolute top-20 md:top-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-40"
                                >
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                                        <div className="absolute top-4 right-6 flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                        <p className="text-slate-800 text-lg md:text-xl font-bold leading-relaxed italic">
                                            "{displayedQuestion}"
                                            <span className="inline-block w-2.5 h-6 bg-indigo-600 ml-1 animate-pulse align-middle"></span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Fullscreen Recovery Button */}
                        {!isFullScreen && hasStarted && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleToggleFullScreen}
                                className="absolute bottom-32 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 flex items-center gap-2 border border-indigo-400"
                            >
                                <Maximize2 size={16} />
                                Re-enter Secure View
                            </motion.button>
                        )}

                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* AI Avatar */}
                            <div className={`flex flex-col items-center justify-center space-y-6 md:space-y-8 order-2 md:order-1 transition-all duration-700 ${aiSpeaking ? 'blur-sm grayscale opacity-30 mt-20' : ''}`}>
                                <div className="relative">
                                    {aiSpeaking && (
                                        <>
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse delay-75 transform scale-125"></div>
                                        </>
                                    )}

                                    <div className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600 p-1 shadow-[0_0_60px_-15px_rgba(79,70,229,0.5)] transition-all duration-500 ${aiSpeaking ? 'scale-105 shadow-[0_0_100px_-20px_rgba(79,70,229,0.8)]' : ''}`}>
                                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                                            {session?.createdBy?.profilePhoto ? (
                                                <img 
                                                    src={session.createdBy.profilePhoto} 
                                                    alt={session.createdBy.fullName} 
                                                    className="w-full h-full object-cover opacity-90"
                                                />
                                            ) : (
                                                <BrainCircuit size={56} className="text-indigo-400 relative z-10 md:w-16 md:h-16" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{session?.createdBy?.fullName || "AI Specialist"}</h3>
                                    <p className="text-indigo-200 text-xs md:text-sm font-medium px-4 py-1 bg-indigo-900/30 rounded-full inline-block border border-indigo-500/30 uppercase tracking-widest">
                                        {aiSpeaking ? "Speaking..." : statusMessage.includes("Thinking") ? "Evaluating..." : "Listening..."}
                                    </p>
                                </div>
                            </div>

                            {/* Candidate Audio */}
                            <div className={`flex flex-col items-center justify-center space-y-6 md:space-y-8 order-1 md:order-2 transition-all duration-700 ${aiSpeaking ? 'blur-sm grayscale opacity-30 mt-20' : ''}`}>
                                <div className="relative">
                                    {isMicOn && !aiSpeaking && (
                                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse transform scale-110"></div>
                                    )}

                                    <div className={`w-28 h-28 md:w-40 md:h-40 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-2xl relative transition-all ${isRecording ? 'border-emerald-500' : ''}`}>
                                        {isMicOn ? (
                                            <div className={`flex gap-1 h-8 items-center ${isRecording ? '' : 'opacity-20'}`}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

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
                                    onClick={toggleMic}
                                    className={`p-3 md:p-4 rounded-xl transition-all flex items-center gap-2 md:gap-3 font-medium ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                >
                                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                                    <span className="hidden md:inline">{isMicOn ? "Mute" : "Unmute"}</span>
                                </button>
                                
                                {/* Send Reply Manually Button - Key for triggering the loop */}
                                <button
                                    onClick={stopRecordingAndSend}
                                    disabled={!isRecording || aiSpeaking}
                                    className={`p-3 md:p-4 rounded-xl transition-all flex items-center gap-2 font-medium ${(!isRecording || aiSpeaking) ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)] animate-pulse'}`}
                                >
                                    <Send size={20} />
                                    <span className="hidden md:inline">Send Answer</span>
                                </button>
                            </div>

                            {/* Central Actions */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={toggleTranscript}
                                    className={`p-3 rounded-xl transition-all ${showMobileTranscript ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'} lg:hidden`}
                                >
                                    <MessageSquare size={20} />
                                </button>
                                <button className="hidden lg:block p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all text-slate-400 hover:text-white">
                                    <BarChart2 size={20} />
                                </button>
                            </div>

                            {/* End Call & Fullscreen */}
                            <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-4 border-l border-white/10 pl-2 md:pl-4">
                                <button
                                    onClick={handleToggleFullScreen}
                                    className="p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
                                >
                                    {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>

                                <button
                                    onClick={handleFinish}
                                    className="px-4 md:px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all flex items-center gap-2"
                                >
                                    <PhoneOff size={20} />
                                    <span className="hidden md:inline">End Session</span>
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
