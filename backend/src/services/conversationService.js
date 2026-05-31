import openai from "../utils/openai.js";

const MODEL = "llama-3.1-8b-instant";

/**
 * Builds the system prompt for a fully dynamic, real-time interview conversation.
 */
export const buildSystemPrompt = (context) => {
  const {
    role,
    experience,
    difficulty = "medium",
    jobDescription = "",
    skills = [],
    interviewerName = "VIRQA AI",
    candidateName = "Candidate",
    turnCount = 0,
    targetTurns = 12,
  } = context;

  const firstName = (candidateName || "Candidate").split(" ")[0];
  const skillsText =
    Array.isArray(skills) && skills.length > 0
      ? skills.join(", ")
      : "technologies relevant to this role";

  let levelGuide = "";
  const exp = String(experience || "").toLowerCase();
  if (exp.includes("fresh") || exp.includes("junior") || difficulty === "easy") {
    levelGuide =
      "Keep language accessible. Ask clear, foundational questions. Be encouraging.";
  } else if (exp.includes("mid") || difficulty === "medium") {
    levelGuide =
      "Ask practical implementation and debugging questions at moderate depth.";
  } else {
    levelGuide =
      "Ask deep technical questions: trade-offs, architecture, performance, and scaling.";
  }

  return `You are ${interviewerName}, a senior technical interviewer conducting a LIVE voice interview on behalf of the hiring company.

ROLE: ${role}
CANDIDATE LEVEL: ${experience}
CURRENT DIFFICULTY: ${difficulty}
CANDIDATE NAME: ${candidateName} (use first name "${firstName}" naturally, not every sentence)

JOB CONTEXT:
${jobDescription || `Professional interview for ${role}.`}

SKILLS TO EXPLORE (weave organically — no checklist):
${skillsText}

${levelGuide}

### REAL-TIME CONVERSATION RULES (CRITICAL)
- You are in a live back-and-forth call like ChatGPT Voice — NOT a rigid Q&A script.
- ALWAYS react to what the candidate just said in 1 short sentence before your next move.
- Dynamically choose: follow-up, clarification, deeper probe, related new topic, encouragement, or wrap-up.
- If their answer was vague or short, ask a specific follow-up on the same topic.
- If they demonstrated strong knowledge, probe harder on that topic before moving on.
- If they went off-topic, gently steer back to role-relevant skills.
- Never use numbered questions, bullet lists, or meta phrases like "Next question" or "Phase 2".
- Output ONLY the words you would speak aloud (1–4 sentences, slightly longer only on turn 0).
- Turn 0 (no prior candidate messages): briefly introduce yourself as ${interviewerName}, welcome ${firstName}, and open with a natural ice-breaker tied to the role or their day.
- After turn 0: do NOT re-introduce yourself or say "Welcome" again.
- Conversation depth so far: ~${turnCount} exchanges. Aim for roughly ${targetTurns} meaningful exchanges before closing; when near that, thank them and ask one final thoughtful question or invite closing thoughts.
- Output plain speech only — no JSON, markdown, or labels.`;
};

/**
 * Converts stored Q/A pairs into OpenAI-style chat messages.
 */
export const buildChatMessages = (context) => {
  const { history = [] } = context;
  const messages = [{ role: "system", content: buildSystemPrompt(context) }];

  for (const turn of history) {
    if (turn.question) {
      messages.push({ role: "assistant", content: turn.question });
    }
    if (turn.answer) {
      messages.push({ role: "user", content: turn.answer });
    }
  }

  return messages;
};

/**
 * Streams the interviewer's next spoken reply token-by-token.
 * @param {Object} context
 * @param {(chunk: string) => void} onChunk
 * @returns {Promise<string>} Full response text
 */
export const streamInterviewerReply = async (context, onChunk) => {
  const messages = buildChatMessages(context);
  let fullText = "";

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.85,
      max_tokens: 280,
      stream: true,
    });

    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta?.content || "";
      if (piece) {
        fullText += piece;
        onChunk(piece);
      }
    }

    return fullText.trim() || getFallbackReply(context);
  } catch (error) {
    console.error("Error streaming interviewer reply:", error);
    const fallback = getFallbackReply(context);
    if (onChunk) onChunk(fallback);
    return fallback;
  }
};

/**
 * Non-streaming reply (resume / fallback).
 */
export const generateInterviewerReply = async (context) => {
  const messages = buildChatMessages(context);
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.85,
      max_tokens: 280,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating interviewer reply:", error);
    return getFallbackReply(context);
  }
};

function getFallbackReply(context) {
  const name = (context.candidateName || "there").split(" ")[0];
  if (!context.history?.length) {
    return `Hi ${name}, I'm ${context.interviewerName || "your interviewer"}. Thanks for joining — how has your day been so far?`;
  }
  return `Thanks for sharing that, ${name}. Could you walk me through a recent challenge you faced related to ${context.role}?`;
}

/**
 * Builds conversation context from an AIInterview document + session metadata.
 */
export const buildContextFromInterview = (interview, sessionData = {}) => {
  const history = interview.answers.map((ans) => ({
    question: ans.questionText,
    answer: ans.transcribedText,
  }));

  const general = sessionData.generalQuestionCount ?? 3;
  const scenario = sessionData.scenarioQuestionCount ?? 2;
  const targetTurns = Math.max(8, 2 + general + scenario + 2);

  return {
    role: interview.role,
    experience: interview.experience,
    difficulty: interview.currentDifficulty,
    history,
    turnCount: interview.answers.length,
    targetTurns,
    candidateName: interview.candidateName || "Candidate",
    jobDescription: sessionData.jobDescription,
    skills: sessionData.skills,
    interviewerName: sessionData.interviewerName || "VIRQA AI",
  };
};
