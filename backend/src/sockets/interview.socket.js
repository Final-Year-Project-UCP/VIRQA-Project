import { AIInterview } from "../models/aiInterview.model.js";
import InterviewSession from "../models/interviewSession.model.js";
import {
  streamInterviewerReply,
  buildContextFromInterview,
} from "../services/conversationService.js";
import { convertAudioToText } from "../services/sttService.js";
import { evaluateAnswer } from "../services/evaluationService.js";
import { createNotification } from "../utils/notificationUtils.js";

const adjustDifficulty = (currentDifficulty, overallScore) => {
  const levels = ["easy", "medium", "hard"];
  let currentIndex = levels.indexOf(currentDifficulty);
  if (currentIndex < 0) currentIndex = 1;

  if (overallScore > 75) {
    currentIndex = Math.min(levels.length - 1, currentIndex + 1);
  } else if (overallScore < 40) {
    currentIndex = Math.max(0, currentIndex - 1);
  }
  return levels[currentIndex];
};

async function loadSessionData(interview) {
  if (!interview.interviewSessionId) {
    return { interviewerName: "VIRQA AI", answerTimeLimit: 60 };
  }

  const session = await InterviewSession.findById(interview.interviewSessionId).populate(
    "createdBy",
    "fullName"
  );
  if (!session) {
    return { interviewerName: "VIRQA AI", answerTimeLimit: 60 };
  }

  return {
    jobDescription: session.jobDescription,
    skills: session.skills,
    generalQuestionCount: session.generalQuestionCount,
    scenarioQuestionCount: session.scenarioQuestionCount,
    answerTimeLimit: session.answerTimeLimit,
    interviewerName: session.createdBy?.fullName || "VIRQA AI",
  };
}

/**
 * Streams AI reply, persists question, emits completion events.
 */
async function emitInterviewerReply(socket, interview, sessionData, { resumeLast = false } = {}) {
  let replyText;

  if (resumeLast && interview.questions.length > interview.answers.length) {
    replyText = interview.questions[interview.questions.length - 1].text;
    socket.emit("ai-response-complete", {
      questionText: replyText,
      answerTimeLimit: sessionData.answerTimeLimit || 60,
    });
    socket.emit("next-question", {
      questionText: replyText,
      answerTimeLimit: sessionData.answerTimeLimit || 60,
    });
    socket.emit("processing-status", { message: null });
    return replyText;
  }

  const context = buildContextFromInterview(interview, sessionData);

  socket.emit("processing-status", { message: "Interviewer is responding..." });

  replyText = await streamInterviewerReply(context, (chunk) => {
    socket.emit("ai-response-chunk", { chunk });
  });

  interview.questions.push({ text: replyText });
  await interview.save();

  const payload = {
    questionText: replyText,
    answerTimeLimit: sessionData.answerTimeLimit || 60,
  };

  socket.emit("ai-response-complete", payload);
  socket.emit("next-question", payload);
  socket.emit("processing-status", { message: null });

  return replyText;
}

/**
 * Saves answer, evaluates in background, streams next AI turn.
 */
async function handleCandidateMessage(socket, interviewId, currentQuestionText, answerText) {
  const interview = await AIInterview.findById(interviewId);
  if (!interview) {
    socket.emit("interview-error", { message: "Interview session not found." });
    return;
  }

  interview.answers.push({
    questionText: currentQuestionText,
    transcribedText: answerText,
  });
  await interview.save();

  const sessionData = await loadSessionData(interview);

  // Score in background — do not block the live conversation
  const questionForEval = currentQuestionText;
  const answerForEval = answerText;
  const interviewIdForEval = interviewId;

  evaluateAnswer(questionForEval, answerForEval)
    .then(async (evaluation) => {
      const doc = await AIInterview.findById(interviewIdForEval);
      if (!doc) return;

      doc.scores.push({
        questionText: questionForEval,
        semanticScore: evaluation.semanticScore,
        technicalScore: evaluation.technicalScore,
        overallScore: evaluation.overallScore,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
      });
      doc.currentDifficulty = adjustDifficulty(doc.currentDifficulty, evaluation.overallScore);
      await doc.save();

      socket.emit("evaluation-result", { evaluation });
    })
    .catch((err) => {
      console.error("Background evaluation failed:", err);
    });

  const refreshed = await AIInterview.findById(interviewId);
  await emitInterviewerReply(socket, refreshed, sessionData);
}

export const registerInterviewSocketHandlers = (app, io) => {
  io.on("connection", (socket) => {
    console.log("Interview module: Client connected", socket.id);

    socket.on("start-interview", async (data) => {
      try {
        const { interviewId } = data;
        const interview = await AIInterview.findById(interviewId);
        if (!interview) {
          socket.emit("interview-error", { message: "Interview session not found." });
          return;
        }

        socket.join(interviewId);
        const sessionData = await loadSessionData(interview);

        const resumeLast =
          interview.questions.length > 0 &&
          interview.questions.length > interview.answers.length;

        await emitInterviewerReply(socket, interview, sessionData, { resumeLast });
      } catch (error) {
        console.error("Error in start-interview:", error);
        socket.emit("interview-error", { message: "Failed to start interview." });
      }
    });

    socket.on("send-audio", async (data) => {
      try {
        const { interviewId, currentQuestionText, audioBuffer } = data;
        const audioFileBuffer = Buffer.from(audioBuffer);

        socket.emit("processing-status", { message: "Listening..." });
        const transcribedText = await convertAudioToText(audioFileBuffer);
        socket.emit("transcription-result", { transcribedText });

        await handleCandidateMessage(socket, interviewId, currentQuestionText, transcribedText);
      } catch (error) {
        console.error("Error in send-audio:", error);
        socket.emit("interview-error", { message: "Failed to process your response." });
        socket.emit("processing-status", { message: null });
      }
    });

    socket.on("send-message", async (data) => {
      try {
        const { interviewId, currentQuestionText, message } = data;
        const text = (message || "").trim();
        if (!text) {
          socket.emit("interview-error", { message: "Message cannot be empty." });
          return;
        }

        socket.emit("transcription-result", { transcribedText: text });
        await handleCandidateMessage(socket, interviewId, currentQuestionText, text);
      } catch (error) {
        console.error("Error in send-message:", error);
        socket.emit("interview-error", { message: "Failed to process your message." });
        socket.emit("processing-status", { message: null });
      }
    });

    socket.on("interview-complete", async (data) => {
      try {
        const { interviewId } = data;
        const interview = await AIInterview.findById(interviewId);
        if (interview) {
          const totalScore = interview.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
          const avgScore = totalScore / (interview.scores.length || 1);

          interview.finalReport = `Candidate attained an average score of ${avgScore.toFixed(2)}. ${
            avgScore > 70
              ? "Recommended for next rounds."
              : "Requires more preparation in technical fundamentals."
          }`;
          interview.status = "completed";
          await interview.save();

          if (interview.interviewSessionId) {
            const session = await InterviewSession.findById(interview.interviewSessionId);
            if (session) {
              const candidateIndex = session.candidates.findIndex(
                (c) => c.candidateId.toString() === interview.candidateId.toString()
              );
              if (candidateIndex !== -1) {
                session.candidates[candidateIndex].status = "Completed";
                await session.save();

                await createNotification(app, {
                  recipientId: session.createdBy,
                  senderId: interview.candidateId,
                  title: "Interview Completed",
                  message: `Candidate has completed the interview for ${session.jobTitle}. You can now view the results.`,
                  type: "interview_completed",
                  data: { sessionId: session._id, candidateId: interview.candidateId },
                });
              }
            }
          }

          socket.emit("interview-completed-successfully", {
            finalReport: interview.finalReport,
            averageScore: avgScore,
          });
        }
      } catch (error) {
        console.error("Error in interview-complete:", error);
      }
    });
  });
};
