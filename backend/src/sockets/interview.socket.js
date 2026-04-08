import { AIInterview } from "../models/aiInterview.model.js";
import InterviewSession from "../models/interviewSession.model.js";
import { generateQuestion } from "../services/questionService.js";
import { convertAudioToText } from "../services/sttService.js";
import { evaluateAnswer } from "../services/evaluationService.js";
import { createNotification } from "../utils/notificationUtils.js";

/**
 * Adjusts difficulty string based on score.
 * > 75 -> harder, < 40 -> easier
 */
const adjustDifficulty = (currentDifficulty, overallScore) => {
  const levels = ["easy", "medium", "hard"];
  let currentIndex = levels.indexOf(currentDifficulty);
  
  if (overallScore > 75) {
    currentIndex = Math.min(levels.length - 1, currentIndex + 1);
  } else if (overallScore < 40) {
    currentIndex = Math.max(0, currentIndex - 1);
  }
  
  return levels[currentIndex];
};

export const registerInterviewSocketHandlers = (app, io) => {
  io.on("connection", (socket) => {
    console.log("Interview module: Client connected", socket.id);

    // Join a specific interview session room
    socket.on("start-interview", async (data) => {
      try {
        const { interviewId } = data; // the AIInterview document ID
        
        // Find existing record
        const interview = await AIInterview.findById(interviewId);
        if (!interview) {
          socket.emit("interview-error", { message: "Interview session not found." });
          return;
        }

        socket.join(interviewId);
        console.log(`Socket ${socket.id} joined interview ${interviewId}`);

        // Format history for question generation
        const history = interview.answers.map(ans => ({
          question: ans.questionText,
          answer: ans.transcribedText
        }));

        const context = {
          role: interview.role,
          experience: interview.experience,
          difficulty: interview.currentDifficulty,
          history,
          questionIndex: interview.questions.length // 0 for first
        };

        let questionToEmit;

        // Resume: Check if last question was actually answered
        if (interview.questions.length > 0 && interview.questions.length > interview.answers.length) {
          // Re-emit the last question instead of generating a new one
          questionToEmit = interview.questions[interview.questions.length - 1].text;
          console.log(`Resuming: Re-emitting last question for interview ${interviewId}`);
        } else {
          // Generate first question (or next question if all previous are answered)
          questionToEmit = await generateQuestion(context);
          
          // Save question to DB
          interview.questions.push({ text: questionToEmit });
          await interview.save();
        }

        socket.emit("next-question", {
          questionText: questionToEmit
        });
      } catch (error) {
        console.error("Error in start-interview event:", error);
        socket.emit("interview-error", { message: "Failed to start interview." });
      }
    });

    // Handle incoming audio from candidate
    socket.on("send-audio", async (data) => {
      try {
        const { interviewId, currentQuestionText, audioBuffer } = data;
        
        // Ensure buffer is handled properly. Note: socket.io handles ArrayBuffers well,
        // but if it comes as a distinct type from frontend, we cast it to node Buffer.
        const audioFileBuffer = Buffer.from(audioBuffer);
        
        socket.emit("processing-status", { message: "Transcribing your answer..." });
        const transcribedText = await convertAudioToText(audioFileBuffer);
        
        socket.emit("transcription-result", { transcribedText });
        
        socket.emit("processing-status", { message: "Evaluating your answer..." });
        const evaluation = await evaluateAnswer(currentQuestionText, transcribedText);
        
        socket.emit("evaluation-result", { evaluation });

        // Update database
        const interview = await AIInterview.findById(interviewId);
        if (interview) {
          // Save answer
          interview.answers.push({
            questionText: currentQuestionText,
            transcribedText
          });
          
          // Save score
          interview.scores.push({
            questionText: currentQuestionText,
            semanticScore: evaluation.semanticScore,
            technicalScore: evaluation.technicalScore,
            overallScore: evaluation.overallScore,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses
          });

          // Adjust difficulty
          interview.currentDifficulty = adjustDifficulty(interview.currentDifficulty, evaluation.overallScore);
          
          await interview.save();

          // Move to next question automatically, or you could let the front-end trigger it.
          // For simplicity in this loop, we'll auto-generate the next question.
          socket.emit("processing-status", { message: "Generating next question..." });
          
          const history = interview.answers.map(ans => ({
            question: ans.questionText,
            answer: ans.transcribedText
          }));

          const context = {
            role: interview.role,
            experience: interview.experience,
            difficulty: interview.currentDifficulty, // Uses updated difficulty
            history,
            questionIndex: interview.questions.length // Current count before push
          };

          const newQuestionText = await generateQuestion(context);
          interview.questions.push({ text: newQuestionText });
          await interview.save();

          socket.emit("next-question", {
            questionText: newQuestionText
          });
          socket.emit("processing-status", { message: null }); // clear status
        }
      } catch (error) {
        console.error("Error in send-audio processing loop:", error);
        socket.emit("interview-error", { message: "Failed to process audio answer." });
      }
    });

    socket.on("interview-complete", async (data) => {
        try {
            const { interviewId } = data;
            const interview = await AIInterview.findById(interviewId);
            if (interview) {
                // Determine final report from scores
                const totalScore = interview.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
                const avgScore = totalScore / (interview.scores.length || 1);
                
                interview.finalReport = `Candidate attained an average score of ${avgScore.toFixed(2)}. ${avgScore > 70 ? 'Recommended for next rounds.' : 'Requires more preparation in technical fundamentals.'}`;
                interview.status = "completed";
                await interview.save();

                // SYNC: Update the parent InterviewSession candidate status
                if (interview.interviewSessionId) {
                    const session = await InterviewSession.findById(interview.interviewSessionId);
                    if (session) {
                        const candidateIndex = session.candidates.findIndex(
                            c => c.candidateId.toString() === interview.candidateId.toString()
                        );
                        if (candidateIndex !== -1) {
                            session.candidates[candidateIndex].status = "Completed";
                            await session.save();
                            console.log(`Sync success: Updated candidate status to Completed in InterviewSession ${session._id}`);

                            // Notify the employer
                            await createNotification(app, {
                                recipientId: session.createdBy,
                                senderId: interview.candidateId,
                                title: "Interview Completed",
                                message: `Candidate has completed the interview for ${session.jobTitle}. You can now view the results.`,
                                type: "interview_completed",
                                data: { sessionId: session._id, candidateId: interview.candidateId }
                            });
                        }
                    }
                }

                socket.emit("interview-completed-successfully", { 
                    finalReport: interview.finalReport,
                    averageScore: avgScore
                });
            }
        } catch (error) {
            console.error("Error in interview-complete:", error);
        }
    });
  });
};
