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
  const { role, experience, difficulty, history } = context;

  let historyPrompt = "";
  if (history && history.length > 0) {
    historyPrompt = "Here is the history of the interview so far:\n";
    history.forEach((turn, i) => {
      historyPrompt += `Q: ${turn.question}\nA: ${turn.answer || "No answer provided."}\n\n`;
    });
    historyPrompt += "Based on these previous answers, please generate the next question.";
  } else {
    historyPrompt = "This is the very first question of the interview. Start with a foundational conceptual question related to the role.";
  }

  const prompt = `
You are an expert technical interviewer hiring a ${experience} ${role}.
The current difficulty level for the next question should be: ${difficulty}.

${historyPrompt}

Requirements for the question:
1. Make it conversational, concise, and focused.
2. Directly relate it to the role and the requested difficulty level.
3. If this is not the first question, try to naturally transition from the candidate's last answer if possible, but keep pushing their technical boundaries according to the difficulty.
4. Output ONLY the question text. Do not include quotes, prefixes like "Question:", or extra commentary.
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
