import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { CheckCircle, Briefcase, User, Award, Clock } from 'lucide-react';
import { SOCKET_URL } from '../config/api.js';
import AudioRecorder from '../components/AudioRecorder';

const InterviewConduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [interviewData, setInterviewData] = useState(null);

    // UI states
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [processingStatus, setProcessingStatus] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const [lastEvaluation, setLastEvaluation] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [finalReport, setFinalReport] = useState("");
    const [textInput, setTextInput] = useState("");
    const streamingRef = useRef("");

    // Timer state
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);

    // Audio Ref
    const audioRef = useRef(null);

    // Initialize mock start (if testing without prior setup)
    const handleStartDemo = async () => {
        try {
            // Usually, this is created by an admin and the candidate given a link with an ID.
            // For testing the module easily, we create an ad-hoc session if no ID exists.
            const res = await axios.post(`${SOCKET_URL}/api/v1/ai-interview/start`, {
                candidateId: "650c1f1f1c9d440000a1b1c1", // Fake ObjectID for demo
                candidateName: "Demo Candidate",
                role: "MERN Stack Developer",
                experience: "Intermediate"
            });
            if (res.data.success) {
                navigate(`/interview/${res.data.data._id}`);
            }
        } catch (error) {
            console.error("Failed to start demo session", error);
            alert("Ensure backend is running and MongoDB is connected.");
        }
    };

    useEffect(() => {
        if (!id) return;

        // Fetch interview data
        const fetchInterview = async () => {
            try {
                const res = await axios.get(`${SOCKET_URL}/api/v1/ai-interview/${id}`);
                setInterviewData(res.data.data);
                
                // Initialize timer if not completed
                if (res.data.data.status !== "completed" && res.data.data.interviewSessionId?.duration) {
                    setTimeLeft(res.data.data.interviewSessionId.duration * 60);
                }

                if (res.data.data.status === "completed") {
                    setIsCompleted(true);
                    setFinalReport(res.data.data.finalReport);
                }
            } catch (error) {
                console.error("Error fetching interview:", error);
            }
        };
        fetchInterview();

        // Connect socket
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("Connected to AI Interview Server");
        });

        newSocket.on("ai-response-chunk", ({ chunk }) => {
            streamingRef.current += chunk;
            setCurrentQuestion(streamingRef.current);
            setProcessingStatus("Interviewer is responding...");
        });

        newSocket.on("ai-response-complete", (data) => {
            streamingRef.current = "";
            const text = data.questionText;
            setCurrentQuestion(text);
            setTranscription(null);
            setProcessingStatus(null);

            if (data.audioBase64 && audioRef.current) {
                audioRef.current.src = `data:audio/mp3;base64,${data.audioBase64}`;
                audioRef.current.play().catch((e) => console.error("Audio playback failed:", e));
            } else if (window.speechSynthesis && text) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.05;
                window.speechSynthesis.speak(utterance);
            }
        });

        newSocket.on("next-question", (data) => {
            if (data?.questionText) setCurrentQuestion(data.questionText);
        });

        newSocket.on("processing-status", (data) => {
            setProcessingStatus(data.message);
        });

        newSocket.on("transcription-result", (data) => {
            setTranscription(data.transcribedText);
        });

        newSocket.on("evaluation-result", (data) => {
            setLastEvaluation(data.evaluation);
        });

        newSocket.on("interview-completed-successfully", (data) => {
            setIsCompleted(true);
            setFinalReport(data.finalReport);
        });

        newSocket.on("interview-error", (data) => {
            alert("Error: " + data.message);
            setProcessingStatus(null);
        });

        setSocket(newSocket);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                window.speechSynthesis.cancel();
                if (audioRef.current) audioRef.current.pause();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            newSocket.close();
            window.speechSynthesis.cancel();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, [id]);

    // Timer logic
    useEffect(() => {
        if (!isStarted || isCompleted || timeLeft === null) return;

        if (timeLeft <= 0) {
            setIsTimeUp(true);
            handleEndInterview();
            return;
        }

        const timerInfo = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerInfo);
    }, [isStarted, isCompleted, timeLeft]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startInterviewPhase = () => {
        if (socket && id) {
            socket.emit("start-interview", { interviewId: id });
            setIsStarted(true);
        }
    };

    const handleAudioRecorded = (audioBlob) => {
        if (socket && id && currentQuestion) {
            audioBlob.arrayBuffer().then((buffer) => {
                socket.emit("send-audio", {
                    interviewId: id,
                    currentQuestionText: currentQuestion,
                    audioBuffer: buffer,
                });
            });
        }
    };

    const handleSendText = () => {
        const msg = textInput.trim();
        if (!socket || !id || !currentQuestion || !msg) return;
        setTextInput("");
        socket.emit("send-message", {
            interviewId: id,
            currentQuestionText: currentQuestion,
            message: msg,
        });
    };

    const handleEndInterview = () => {
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        if (socket && id) {
            socket.emit("interview-complete", { interviewId: id });
        }
    };

    if (!id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">VIRQA AI Interview</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Start a mock AI interview session for a MERN Stack Developer.</p>
                    <button
                        onClick={handleStartDemo}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
                    >
                        Initialize Demo Interview
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Interview Completed</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl leading-relaxed text-left">
                        {interviewData?.interviewSessionId?.showResultToCandidate === false 
                            ? "Thank you for completing the interview. Your result will be announced soon by the employer."
                            : (finalReport || "Thank you for completing the interview. Your results are being processed.")}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10 font-sans">
            <audio ref={audioRef} className="hidden" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center border border-gray-100 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            Live AI Interview
                        </h1>
                        <div className="flex gap-4 mt-3 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {interviewData?.role || 'Loading...'}</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {interviewData?.experience || '...'}</span>
                            <span className="flex items-center gap-1 text-indigo-500"><Award className="w-4 h-4" /> Difficulty: <span className="uppercase">{interviewData?.currentDifficulty || 'Medium'}</span></span>
                        </div>
                    </div>
                    {isStarted && (
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold font-mono">
                                <Clock className="w-5 h-5 animate-pulse" /> 
                                {formatTime(timeLeft)}
                            </div>
                            <button
                                onClick={handleEndInterview}
                                className="px-6 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                            >
                                End Interview
                            </button>
                        </div>
                    )}
                </div>

                {!isStarted ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-10 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Ready to begin?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                            The AI interviewer will ask you questions dynamically based on your role. Please ensure your microphone is working properly.
                        </p>
                        <button
                            onClick={startInterviewPhase}
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
                        >
                            Start Answering
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Interaction Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700 min-h-[250px] flex flex-col justify-center">
                                <h3 className="text-sm uppercase tracking-wider font-semibold text-blue-500 mb-4">Interviewer</h3>
                                <p className="text-xl md:text-3xl font-medium text-gray-800 dark:text-gray-100 leading-snug">
                                    {currentQuestion || "Preparing your next question..."}
                                </p>
                            </div>

                            <AudioRecorder
                                onRecordingComplete={handleAudioRecorded}
                                isProcessing={!!processingStatus}
                            />

                            <div className="flex gap-2 mt-4">
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                                    disabled={!!processingStatus}
                                    placeholder="Or type your answer here..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendText}
                                    disabled={!textInput.trim() || !!processingStatus}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>

                        {/* Side Panel for Transcriptions and Feedback */}
                        <div className="space-y-6">

                            {/* Transcription Box */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                                    Speech to Text
                                    {processingStatus && processingStatus.includes("Transcribing") && <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>}
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 min-h-[100px] border border-gray-200 dark:border-gray-700">
                                    {transcription ? `"${transcription}"` : <span className="text-gray-400 italic">Your spoken words will appear here...</span>}
                                </div>
                            </div>

                            {/* Evaluation Box */}
                            {lastEvaluation && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">AI Evaluation (Last Answer)</h3>

                                    <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                        <span className="text-sm font-medium">Score</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${lastEvaluation.overallScore > 75 ? 'bg-green-500' : lastEvaluation.overallScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${lastEvaluation.overallScore}%` }}></div>
                                            </div>
                                            <span className="font-bold text-gray-700 dark:text-gray-200">{lastEvaluation.overallScore}/100</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                                        "{lastEvaluation.feedback}"
                                    </p>

                                    {lastEvaluation.strengths?.length > 0 && (
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-green-600 uppercase">Strengths</span>
                                            <ul className="text-sm text-gray-500 mt-1 pl-4 list-disc">
                                                {lastEvaluation.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>

            {processingStatus && (
                <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                    {processingStatus}
                </div>
            )}
        </div>
    );
};

export default InterviewConduct;
