'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Maximize2, Minimize2, BarChart2, MessageSquare, BrainCircuit, Send, Shield, XCircle, AlertCircle, Timer, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, SOCKET_URL } from '../../../../config/api.js';
import { io } from 'socket.io-client';
import axios from 'axios';

const ActiveSession = ({ onLeave, session }) => {
    const role = session?.jobTitle || "Technical Resource";
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Countdown & Interaction State
    const [countdown, setCountdown] = useState(3);
    const [hasCountdownFinished, setHasCountdownFinished] = useState(false);
    const [isRoomEntered, setIsRoomEntered] = useState(false);

    // AI & Socket State
    const [socket, setSocket] = useState(null);
    const [aiInterviewId, setAiInterviewId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [displayedQuestion, setDisplayedQuestion] = useState("");
    const [statusMessage, setStatusMessage] = useState("Preparing Session...");
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [finalReport, setFinalReport] = useState("");

    // Timer States
    const [timeLeft, setTimeLeft] = useState(null);
    const [maxTimeLimit, setMaxTimeLimit] = useState(60);

    // Media States
    const [isMicOn, setIsMicOn] = useState(true);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const chatEndRef = useRef(null);
    const transcriptionScrollRef = useRef(null);

    // Initialize the WebSocket and request an interview session entry after user enters
    useEffect(() => {
        if (!isRoomEntered) return;

        let newSocket;

        const initializeAI = async () => {
            try {
                setStatusMessage("Syncing with AI Server...");

                // 1. Create/Resume Interview Session Entry
                const response = await api.post('/ai-interview/start', {
                    candidateId: session?.candidates?.[0]?.candidateId || "anonymous",
                    interviewSessionId: session?._id,
                    role: role,
                    experience: "Intermediate",
                    difficulty: "medium"
                });

                const interviewData = response.data.data;
                const interviewId = interviewData._id;
                setAiInterviewId(interviewId);

                if (interviewData.status === "completed") {
                    toast.warning("This interview has already been completed.");
                    onLeave();
                    return;
                }

                // 2. Restore Chat History
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

                // 3. Connect Socket
                const backendUrl = SOCKET_URL.replace(/\/api\/v1\/?$/, '');
                const token = localStorage.getItem('token');

                newSocket = io(backendUrl, {
                    withCredentials: true,
                    reconnection: true,
                    auth: { token }
                });
                setSocket(newSocket);

                newSocket.on("connect", () => {
                    setStatusMessage(existingChat.length === 0 ? "Analyzing profile..." : "Resuming...");
                    newSocket.emit("start-interview", { interviewId });
                });

                newSocket.on("next-question", (data) => {
                    const aiQuestion = data.questionText;
                    const limit = data.answerTimeLimit || 60;
                    setCurrentQuestion(aiQuestion);
                    setMaxTimeLimit(limit);
                    setTimeLeft(null); // Reset until AI finishes speaking
                    setStatusMessage("AI is speaking...");
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
                    toast.success("Interview completed successfully.");
                    onLeave();
                });

                newSocket.on("interview-error", (data) => {
                    console.error("Socket error:", data.message);
                    setStatusMessage("Error: " + data.message);
                });

            } catch (error) {
                console.error("AI Initialization failed", error);
                const errorMsg = error.response?.data?.message || "Connection failed. Please retry.";
                setStatusMessage("Error: " + errorMsg);
                toast.error(errorMsg);
            }
        };

        initializeAI();
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(timeInterval);
            window.speechSynthesis.cancel();
            if (newSocket) newSocket.close();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, [isRoomEntered, session, role, onLeave]);

    // Handle visibility change (tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                window.speechSynthesis.cancel();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Speech Synthesis for TTS with Real-Time Chat Streaming
    const speak = (text) => {
        if (!window.speechSynthesis) {
            setChatHistory(prev => [...prev, { sender: 'AI Interviewer', text }]);
            return;
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => (v.name.includes("Google") || v.name.includes("Female") || v.lang.startsWith("en"))) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.1;

        // Add empty message to history for streaming
        setChatHistory(prev => [...prev, { sender: 'AI Interviewer', text: '', isStreaming: true }]);

        let charIndex = 0;
        const typeTimer = setInterval(() => {
            setChatHistory(prev => {
                const newHistory = [...prev];
                const last = newHistory[newHistory.length - 1];
                if (last && last.isStreaming) {
                    last.text = text.substring(0, charIndex + 1);
                }
                return newHistory;
            });
            charIndex++;
            if (charIndex >= text.length) {
                clearInterval(typeTimer);
                // Mark as finished streaming
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const last = newHistory[newHistory.length - 1];
                    if (last) last.isStreaming = false;
                    return newHistory;
                });
            }
        }, 30);

        utterance.onstart = () => {
            setAiSpeaking(true);
        };

        utterance.onend = () => {
            setAiSpeaking(false);
            setStatusMessage("Listening...");
            setTimeLeft(maxTimeLimit);
            if (isMicOn) startRecording();
        };

        window.speechSynthesis.speak(utterance);
    };

    // Auto-scroll chat and transcript
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Countdown Logic (Entry)
    useEffect(() => {
        if (countdown === null) return;
        const timer = setTimeout(() => {
            if (typeof countdown === 'number') {
                if (countdown > 1) setCountdown(countdown - 1);
                else setCountdown('READY');
            } else if (countdown === 'READY') {
                setCountdown(null);
                setHasCountdownFinished(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // Answer Timer Logic (Auto-submit)
    useEffect(() => {
        if (timeLeft === null || aiSpeaking) return;

        if (timeLeft <= 0) {
            toast.info("Time limit reached! Submitting automatically...");
            stopRecordingAndSend();
            setTimeLeft(null);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, aiSpeaking]);

    const handleEnterRoom = async () => {
        try {
            if (containerRef.current?.requestFullscreen) {
                await containerRef.current.requestFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen permission deferred.");
        }
        setIsRoomEntered(true);
    };

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
            toast.error("Microphone access denied.");
        }
    };

    const stopRecordingAndSend = () => {
        setTimeLeft(null);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                setIsRecording(false);

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
        if (isRecording && isMicOn) stopRecordingAndSend();
    };

    const handleFinish = async () => {
        if (window.confirm("Submit findings and end interview? Result will be analyzed instantly.")) {
            window.speechSynthesis.cancel();
            if (socket && aiInterviewId) {
                socket.emit("interview-complete", { interviewId: aiInterviewId });
            }
            onLeave();
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // --- Loading / Intro States ---
    if (!isRoomEntered) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-emerald-950/20 opacity-50"></div>
                <div className="relative z-10 max-w-xl">
                    <AnimatePresence mode="wait">
                        {!hasCountdownFinished ? (
                            <motion.div
                                key="countdown"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                className="text-8xl md:text-9xl font-black text-white/20 tracking-tighter"
                            >
                                {countdown}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="enter"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
                                    <h2 className="text-3xl font-bold text-white mb-4">Secure Interview Room</h2>
                                    <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                                        Ensure you are in a quiet environment. Once you begin, all browser UI will be hidden for a focused experience.
                                    </p>
                                    <button
                                        onClick={handleEnterRoom}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3"
                                    >
                                        <BrainCircuit className="animate-pulse" />
                                        Begin Live Interview
                                    </button>
                                </div>
                                <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-4">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    Encrypted End-to-End Analysis Active
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] bg-slate-950 overflow-hidden flex flex-col lg:flex-row text-slate-100 font-sans select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 opacity-40"></div>

            {/* LEFT COLUMN: LIVE TRANSCRIPT & INTERACTION */}
            <div className="w-full lg:w-[400px] xl:w-[450px] h-1/2 lg:h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 relative z-20">
                <div className="p-6 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                            Live Assessment
                        </h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Real-time Dialogue Stream</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-300">{statusMessage}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
                    {chatHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                            <MessageSquare size={48} className="mb-4" />
                            <p className="text-sm font-medium">Interview stream starting...</p>
                        </div>
                    )}

                    {chatHistory.map((chat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${chat.sender === 'You' ? 'items-end' : 'items-start'}`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${chat.sender === 'You' ? 'text-indigo-400' : 'text-slate-500'}`}>
                                {chat.sender}
                            </span>
                            <div className={`max-w-[90%] p-4 text-sm leading-relaxed shadow-sm ${chat.sender === 'You'
                                    ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 rounded-2xl rounded-tr-none'
                                    : 'bg-slate-800/50 border border-white/5 text-slate-100 rounded-2xl rounded-tl-none font-medium'
                                }`}>
                                {chat.text}
                                {chat.isStreaming && <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-1 align-middle"></span>}
                            </div>
                        </motion.div>
                    ))}

                    {(aiSpeaking || statusMessage.includes("Thinking")) && !chatHistory.some(c => c.isStreaming) && (
                        <div className="flex gap-1.5 ml-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* RIGHT COLUMN: VISUALS & CONTROLS */}
            <div className="flex-1 h-1/2 lg:h-full flex flex-col relative z-10">

                {/* Visual Interaction Hub */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="relative mb-12">
                        {aiSpeaking && (
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping scale-[2]"></div>
                        )}
                        <div className={`relative w-56 h-56 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-b from-indigo-500/40 to-slate-900 shadow-2xl transition-all duration-1000 ${aiSpeaking ? 'scale-110 shadow-indigo-500/20' : 'scale-100'}`}>
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                                {session?.createdBy?.profilePhoto ? (
                                    <img src={session.createdBy.profilePhoto} className="w-full h-full object-cover opacity-60" alt="Specialist" />
                                ) : (
                                    <BrainCircuit size={80} className="text-indigo-500/20" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">AI Technical Specialist</p>
                        <h2 className="text-2xl font-black text-white mb-2">{session?.createdBy?.fullName || "VIRQA AI"}</h2>
                        <div className="flex items-center justify-center gap-4 text-indigo-400/80 font-bold uppercase tracking-widest text-[10px]">
                            <span>{role}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* Microphone Visualizer & Answer Timer */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="relative group">
                            {timeLeft !== null && (
                                <svg className="absolute -inset-4 w-22 h-22 transform -rotate-90">
                                    <circle
                                        cx="44" cy="44" r="38"
                                        stroke="white" strokeWidth="2" fill="transparent"
                                        className="opacity-10"
                                    />
                                    <motion.circle
                                        cx="44" cy="44" r="38"
                                        stroke={timeLeft <= 10 ? "#ef4444" : "#4f46e5"}
                                        strokeWidth="4" fill="transparent"
                                        strokeDasharray={239}
                                        animate={{ strokeDashoffset: 239 - (239 * timeLeft) / maxTimeLimit }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </svg>
                            )}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative z-10 ${isRecording ? 'bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                                {isRecording ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
                            </div>
                        </div>

                        {timeLeft !== null && (
                            <div className={`mt-6 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all flex items-center gap-2 ${timeLeft <= 10 ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold'}`}>
                                <Clock size={12} />
                                <span className="text-xs tabular-nums uppercase tracking-tighter">
                                    Ends in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        )}
                        {!timeLeft && isRecording && <p className="text-[10px] font-black text-emerald-500 uppercase mt-4 tracking-widest">Voice Capture Active</p>}
                    </div>
                </div>

                {/* Simplified Controls */}
                <div className="p-10 border-t border-white/5 bg-slate-900/60 backdrop-blur-3xl">
                    <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMic}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isMicOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
                            >
                                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                                {isMicOn ? "Mic On" : "Mic Off"}
                            </button>
                            <button
                                onClick={stopRecordingAndSend}
                                disabled={!isRecording || aiSpeaking}
                                className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 transition-all ${(!isRecording || aiSpeaking) ? 'bg-slate-800/20 text-slate-700 cursor-not-allowed border border-white/5' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/30 active:scale-95'}`}
                            >
                                <Send size={18} />
                                Submit Answer
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleFullScreen} className="p-4 bg-slate-800/50 text-slate-500 hover:text-white rounded-2xl transition-all border border-white/5">
                                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                            <button
                                onClick={handleFinish}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs uppercase tracking-widest"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveSession;
