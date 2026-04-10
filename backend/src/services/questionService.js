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
  const { 
    role, 
    experience, 
    difficulty, 
    history, 
    questionIndex,
    jobDescription,
    skills,
    generalQuestionCount = 3,
    scenarioQuestionCount = 2
  } = context;

  const isGeneralPhase = questionIndex < generalQuestionCount;
  const isScenarioPhase = !isGeneralPhase && questionIndex < (generalQuestionCount + scenarioQuestionCount);
  
  const skillsText = Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "relevant technologies for the role";

  let phaseInstruction = "";
  if (isGeneralPhase) {
    phaseInstruction = `This is a GENERAL KNOWLEDGE phase. Ask a conceptual, high-level technical question focusing strictly on ${skillsText}. Assess foundational understanding.`;
  } else if (isScenarioPhase) {
    phaseInstruction = `CRITICAL: You are now in the SCENARIO phase. Generate a complex, real-world 'What if' scenario or a specific problem-solving challenge related to ${skillsText} in the context of this job. The question should be challenging and structural.`;
  } else {
    phaseInstruction = `This is a wrap-up phase. Ask a final sharp technical question or a specific nuance about ${skillsText}.`;
  }

  let historyPrompt = "";
  if (history && history.length > 0) {
    historyPrompt = "Recent History (DO NOT REPEAT THESE QUESTIONS):\n";
    history.slice(-3).forEach((turn, i) => {
      historyPrompt += `Q: ${turn.question}\nA: ${turn.answer || "No answer provided."}\n`;
    });
  }

  const prompt = `
You are a WORLD-CLASS Technical Interviewer for a ${experience} ${role} position.

### INTERVIEWER INSTRUCTIONS & CONTEXT:
${jobDescription || "Assess the candidate's proficiency in " + role}

### TARGET SKILLS (STRICT FOCUS):
${skillsText}

### CURRENT PHASE:
${phaseInstruction}

### DIFFICULTY LEVEL:
${difficulty.toUpperCase()}

${historyPrompt}

STRICT CONSTRAINTS:
1. Output ONLY the question text.
2. FOCUS: Questions MUST be about the skills listed above.
3. Tone: Professional, direct, and slightly challenging.
4. Length: 
    - Scenario Phase: 2-3 sentences max.
    - General Phase: 1-2 sentences max.
5. Do NOT say 'Great', 'Awesome', or 'Nice'. Get straight to the next challenge.
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
