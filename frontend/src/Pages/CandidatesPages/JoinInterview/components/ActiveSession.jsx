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
    const isFullscreenSupported = typeof document !== 'undefined' && !!(
        document.fullscreenEnabled || 
        document.webkitFullscreenEnabled || 
        document.mozFullScreenEnabled || 
        document.msFullscreenEnabled
    );
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
    const [statusMessage, setStatusMessage] = useState("Preparing Session...");
    const [textInput, setTextInput] = useState("");
    const streamingIndexRef = useRef(null);
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [finalReport, setFinalReport] = useState("");

    // Timer States
    const [timeLeft, setTimeLeft] = useState(null);
    const [maxTimeLimit, setMaxTimeLimit] = useState(60);

    // Overall Interview Countdown
    const totalInterviewSeconds = (session?.duration || 30) * 60;
    const [totalTimeLeft, setTotalTimeLeft] = useState(totalInterviewSeconds);

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

                let candidateId = localStorage.getItem("userId");
                let candidateName = "Candidate";
                try {
                    const profileRes = await api.get("/user/profile");
                    const profile = profileRes.data?.data || profileRes.data;
                    candidateId = profile?._id || candidateId;
                    candidateName = profile?.fullName || candidateName;
                } catch {
                    const myEntry = session?.candidates?.find(
                        (c) => c.candidateId?._id || c.candidateId
                    );
                    if (myEntry) {
                        candidateId = myEntry.candidateId?._id || myEntry.candidateId;
                    }
                }

                const experienceLevel = session?.experienceLevel || "Junior";
                const sessionDifficulty = (session?.difficulty || "Medium").toLowerCase();

                // 1. Create/Resume Interview Session Entry
                const response = await api.post('/ai-interview/start', {
                    candidateId: candidateId || session?.candidates?.[0]?.candidateId,
                    candidateName,
                    interviewSessionId: session?._id,
                    role: role,
                    experience: experienceLevel,
                    difficulty: sessionDifficulty,
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

                newSocket.on("ai-response-chunk", ({ chunk }) => {
                    setStatusMessage("Interviewer is thinking...");
                    setChatHistory((prev) => {
                        const next = [...prev];
                        const idx = streamingIndexRef.current;
                        if (idx === null || idx === undefined || next[idx]?.sender !== "AI Interviewer" || !next[idx]?.isTyping) {
                            streamingIndexRef.current = next.length;
                            next.push({ sender: "AI Interviewer", text: "", isTyping: true });
                        }
                        return next;
                    });
                });

                newSocket.on("ai-response-complete", (data) => {
                    const aiQuestion = data.questionText;
                    setCurrentQuestion(aiQuestion);
                    setTimeLeft(null);
                    streamingIndexRef.current = null;

                    setChatHistory((prev) => {
                        const next = [...prev];
                        const streamingIdx = next.findIndex((m) => m.isStreaming || m.isTyping);
                        if (streamingIdx >= 0) {
                            next[streamingIdx] = {
                                sender: "AI Interviewer",
                                text: "",
                                isTyping: true,
                                isStreaming: false,
                            };
                        } else if (!next.some((m) => m.sender === "AI Interviewer" && m.text === aiQuestion)) {
                            next.push({ sender: "AI Interviewer", text: "", isTyping: true });
                        }
                        return next;
                    });

                    setStatusMessage("AI is speaking...");
                    speak(aiQuestion);
                });

                newSocket.on("next-question", (data) => {
                    if (!data?.questionText) return;
                    setCurrentQuestion(data.questionText);
                });

                newSocket.on("processing-status", (data) => {
                    setStatusMessage(data.message || "Listening...");
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

    // Monitor fullscreen state
    useEffect(() => {
        const handleFullScreenChange = () => {
            const isCurrentlyFull = !!(
                document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement || 
                document.msFullScreenElement
            );
            setIsFullScreen(isCurrentlyFull);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        setIsFullScreen(!!(
            document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullScreenElement
        ));

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    const speak = (text) => {
        if (!text?.trim()) return;

        if (!window.speechSynthesis) {
            setChatHistory((prev) => {
                const next = [...prev];
                const idx = next.map((c, i) => ({ c, i })).reverse().find(({ c }) => c.sender === "AI Interviewer")?.i;
                if (idx !== undefined && idx >= 0) {
                    next[idx] = {
                        ...next[idx],
                        text: text,
                        isTyping: false,
                        isStreaming: false
                    };
                } else {
                    next.push({
                        sender: "AI Interviewer",
                        text: text,
                        isTyping: false,
                        isStreaming: false
                    });
                }
                return next;
            });
            setStatusMessage("Listening...");
            setTimeLeft(maxTimeLimit);
            if (isMicOn) startRecording();
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
            voices.find(
                (v) =>
                    v.name.includes("Google") ||
                    v.name.includes("Female") ||
                    v.lang.startsWith("en")
            ) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.05;

        let speechStarted = false;

        const finalizeChat = () => {
            setChatHistory((prev) => {
                const next = [...prev];
                const idx = next.map((c, i) => ({ c, i })).reverse().find(({ c }) => c.sender === "AI Interviewer")?.i;
                if (idx !== undefined && idx >= 0) {
                    next[idx] = {
                        ...next[idx],
                        text: text,
                        isTyping: false,
                        isStreaming: false
                    };
                }
                return next;
            });
        };

        utterance.onstart = () => {
            speechStarted = true;
            setAiSpeaking(true);
            setChatHistory((prev) => {
                const next = [...prev];
                const idx = next.map((c, i) => ({ c, i })).reverse().find(({ c }) => c.sender === "AI Interviewer")?.i;
                if (idx !== undefined && idx >= 0) {
                    next[idx] = {
                        ...next[idx],
                        text: "",
                        isTyping: false,
                        isStreaming: true
                    };
                }
                return next;
            });
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const wordIndex = event.charIndex;
                let nextSpace = text.indexOf(' ', wordIndex);
                if (nextSpace === -1) nextSpace = text.length;
                const spokenText = text.substring(0, nextSpace);

                setChatHistory((prev) => {
                    const next = [...prev];
                    const idx = next.map((c, i) => ({ c, i })).reverse().find(({ c }) => c.sender === "AI Interviewer")?.i;
                    if (idx !== undefined && idx >= 0) {
                        next[idx] = {
                            ...next[idx],
                            text: spokenText,
                            isTyping: false,
                            isStreaming: true
                        };
                    }
                    return next;
                });
            }
        };

        utterance.onend = () => {
            finalizeChat();
            setAiSpeaking(false);
            setStatusMessage("Listening...");
            setTimeLeft(maxTimeLimit);
            if (isMicOn) startRecording();
        };

        utterance.onerror = () => {
            finalizeChat();
            setAiSpeaking(false);
            setStatusMessage("Listening...");
            setTimeLeft(maxTimeLimit);
            if (isMicOn) startRecording();
        };

        setTimeout(() => {
            if (!speechStarted) {
                finalizeChat();
                setAiSpeaking(false);
                setStatusMessage("Listening...");
                setTimeLeft(maxTimeLimit);
                if (isMicOn) startRecording();
            }
        }, 1500);

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
                setIsRoomEntered(true); // Automatically enter room and start interview
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

    // Overall Interview Countdown — starts when room is entered
    useEffect(() => {
        if (!isRoomEntered) return;
        setTotalTimeLeft(totalInterviewSeconds);
        const interval = setInterval(() => {
            setTotalTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    toast.warning("Interview time is up!");
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRoomEntered]);

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

    const submitCandidateTurn = (payload) => {
        if (!socket || !aiInterviewId || !currentQuestion) return;
        setTimeLeft(null);
        window.speechSynthesis?.cancel();
        socket.emit(payload.event, {
            interviewId: aiInterviewId,
            currentQuestionText: currentQuestion,
            ...payload.data,
        });
    };

    const stopRecordingAndSend = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
                setIsRecording(false);

                audioBlob.arrayBuffer().then((buffer) => {
                    submitCandidateTurn({
                        event: "send-audio",
                        data: { audioBuffer: buffer },
                    });
                });
            };
            mediaRecorderRef.current.stop();
        }
    };

    const sendTextMessage = () => {
        const msg = textInput.trim();
        if (!msg || aiSpeaking) return;
        setTextInput("");
        submitCandidateTurn({ event: "send-message", data: { message: msg } });
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
                                {chat.isTyping ? (
                                    <div className="flex gap-1.5 py-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                ) : (
                                    <>
                                        {chat.text}
                                        {chat.isStreaming && <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-1 align-middle"></span>}
                                    </>
                                )}
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

                <div className="p-4 border-t border-white/5 bg-slate-900/60">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
                            disabled={aiSpeaking || !currentQuestion}
                            placeholder="Type a reply instead of speaking..."
                            className="flex-1 px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 disabled:opacity-40"
                        />
                        <button
                            type="button"
                            onClick={sendTextMessage}
                            disabled={!textInput.trim() || aiSpeaking || !currentQuestion}
                            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                            aria-label="Send message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: VISUALS & CONTROLS */}
            <div className="flex-1 h-1/2 lg:h-full flex flex-col relative z-10">

                {/* Total Interview Countdown — top right */}
                {(() => {
                    const totalMins = Math.floor(totalTimeLeft / 60);
                    const totalSecs = totalTimeLeft % 60;
                    const pct = totalTimeLeft / totalInterviewSeconds;
                    const radius = 20;
                    const circ = 2 * Math.PI * radius;
                    const offset = circ * (1 - pct);
                    const isLow = totalTimeLeft <= 300; // last 5 min
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={`absolute top-4 right-4 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-xl ${
                                isLow
                                    ? 'bg-red-500/20 border-red-500/40 animate-pulse'
                                    : 'bg-slate-900/70 border-white/10'
                            }`}
                        >
                            {/* Circular progress */}
                            <svg width="48" height="48" className="-rotate-90 shrink-0">
                                <circle
                                    cx="24" cy="24" r={radius}
                                    fill="transparent"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeOpacity="0.1"
                                />
                                <circle
                                    cx="24" cy="24" r={radius}
                                    fill="transparent"
                                    stroke={isLow ? '#ef4444' : '#4f46e5'}
                                    strokeWidth="3"
                                    strokeDasharray={circ}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                                />
                                {/* Clock icon inside — rendered upright via nested transform */}
                            </svg>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Session Time</span>
                                <span className={`text-lg font-black tabular-nums ${
                                    isLow ? 'text-red-400' : 'text-white'
                                }`}>
                                    {String(totalMins).padStart(2, '0')}:{String(totalSecs).padStart(2, '0')}
                                </span>
                            </div>
                        </motion.div>
                    );
                })()}

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
                                        initial={{ strokeDashoffset: 239 }}
                                        animate={{ strokeDashoffset: timeLeft !== null && maxTimeLimit ? 239 - (239 * timeLeft) / maxTimeLimit : 239 }}
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

            {/* Secure Fullscreen Guard Overlay */}
            {!isFullScreen && isFullscreenSupported && isRoomEntered && (
                <div className="fixed inset-0 z-[10000] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="max-w-md p-8 bg-slate-900/80 border border-white/10 rounded-[2rem] shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-red-500/10 opacity-30 rounded-[2rem] pointer-events-none"></div>
                        <div className="w-16 h-16 mx-auto mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 animate-pulse">
                            <Maximize2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Fullscreen Mode Required</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            To maintain interview security and integrity, you must remain in fullscreen mode. Minimizing the window or exiting fullscreen is not allowed until the interview is complete.
                        </p>
                        <button
                            onClick={async () => {
                                try {
                                    const elem = containerRef.current || document.documentElement;
                                    if (elem.requestFullscreen) {
                                        await elem.requestFullscreen();
                                    } else if (elem.webkitRequestFullscreen) {
                                        await elem.webkitRequestFullscreen();
                                    } else if (elem.mozRequestFullScreen) {
                                        await elem.mozRequestFullScreen();
                                    } else if (elem.msRequestFullscreen) {
                                        await elem.msRequestFullscreen();
                                    }
                                } catch (err) {
                                    console.error("Fullscreen restoration failed:", err);
                                }
                            }}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Maximize2 size={16} />
                            Restore Fullscreen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveSession;
