import openai from "../utils/openai.js";

/**
 * Generates the next interview question based on the context.
 * @param {Object} context
 * @param {string} context.role - The job role (e.g., "Frontend Developer").
 * @param {string} context.experience - Experience level (e.g., "Intermediate").
 * @param {string} context.difficulty - Current difficulty level ("easy", "medium", "hard").
 * @param {Array} context.history - Array of { question, answer } from previous turns.
 * @returns {Promise<string>} The generated question.
 */
export const generateQuestion = async (context) => {
  const { role, experience, difficulty, history, questionIndex } = context;

  const isFirst = questionIndex === 0;
  const isScenarioPhase = questionIndex >= 2 && questionIndex <= 4; // Q3, Q4, Q5 as scenarios
  const isFinalPhase = questionIndex > 4;

  let phaseInstruction = "";
  if (isFirst) {
    phaseInstruction = "This is the very first question. Start with a foundational conceptual question to break the ice and assess basic understanding of the role.";
  } else if (isScenarioPhase) {
    phaseInstruction = "CRITICAL: You are now in the SCENARIO phase. Generate a complex, real-world 'What if' scenario or a specific problem-solving challenge that requires deep architectural or logic thinking. The question should be slightly longer but very structured.";
  } else if (isFinalPhase) {
    phaseInstruction = "You are in the FINAL phase. Keep questions short, precise, and focused on specific technical edge cases or rapid-fire knowledge checks.";
  } else {
    phaseInstruction = "This is a transition phase. Ask a knowledge-based question that bridges concepts with practical application.";
  }

  let historyPrompt = "";
  if (history && history.length > 0) {
    historyPrompt = "Recent History:\n";
    history.slice(-2).forEach((turn, i) => {
      historyPrompt += `Q: ${turn.question}\nA: ${turn.answer || "No answer provided."}\n`;
    });
  }

  const prompt = `
You are a WORLD-CLASS Technical Interviewer for a ${experience} ${role} position.
Current Difficulty Target: ${difficulty.toUpperCase()}

${phaseInstruction}

${historyPrompt}

STRICT CONSTRAINTS:
1. Output ONLY the question text.
2. Tone: Professional, direct, and slightly challenging.
3. Length: 
    - Scenario Phase: 2-3 sentences max.
    - Other Phases: 1-2 sentences max.
4. Do NOT say 'Great', 'Awesome', or 'Nice'. Get straight to the next challenge.
5. If the candidate failed to answer the last question properly, you may briefly re-explore it but keep moving.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant", // Groq fast model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback question
    return `Could you explain a challenging problem you solved recently related to ${role}?`;
  }
};
