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
    interviewerName = "VIRQA AI",
    candidateName = "Candidate",
    generalQuestionCount = 3,
    scenarioQuestionCount = 2
  } = context;

  const greetingCount = 2; // 2 greeting/ice-breaker turns (approx 2 mins of introduction/hobbies)
  
  const isGreetingPhase = questionIndex < greetingCount;
  const techIndex = questionIndex - greetingCount;
  const isGeneralPhase = !isGreetingPhase && techIndex < generalQuestionCount;
  const isScenarioPhase = !isGreetingPhase && !isGeneralPhase && techIndex < (generalQuestionCount + scenarioQuestionCount);
  
  const skillsText = Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "relevant technologies for the role";

  let phaseInstruction = "";
  if (isGreetingPhase) {
    if (questionIndex === 0) {
      phaseInstruction = `This is the INITIAL GREETING phase. Introduce yourself warmly as "${interviewerName}" — the interviewer conducting this live session on behalf of the company. Address the candidate by their first name "${candidateName.split(' ')[0]}" naturally in your opening (e.g. "Hi ${candidateName.split(' ')[0]}, I'm ${interviewerName}" or "Welcome ${candidateName.split(' ')[0]}! My name is ${interviewerName}"). Welcome them to the live interview session for the ${experience} ${role} role. Then ask a friendly, casual ice-breaker question to help them settle in — specifically asking about their day and their favorite hobbies or interests outside of work. Do NOT ask any technical questions yet.`;
    } else {
      phaseInstruction = `This is the SECOND GREETING phase. React warmly to what ${candidateName.split(' ')[0]} shared in the previous turn. Then ask another light ice-breaker question, such as what originally drew them into this field, what excites them most about this role, or a fun fact about themselves. You may naturally use their name once. Do NOT ask any technical questions yet.`;
    }
  } else if (isGeneralPhase) {
    phaseInstruction = `This is the GENERAL KNOWLEDGE phase. Ask ${candidateName.split(' ')[0]} a conceptual technical question focusing strictly on ${skillsText}. Assess foundational understanding of these technologies.`;
  } else if (isScenarioPhase) {
    phaseInstruction = `This is the SCENARIO phase. Give ${candidateName.split(' ')[0]} a practical, real-world 'What if' scenario or problem-solving challenge related to ${skillsText} in the context of this job. The question should test their architectural, structural, or debugging choices.`;
  } else {
    phaseInstruction = `This is the WRAP-UP phase. Thank ${candidateName.split(' ')[0]} warmly and ask a final sharp technical question or inquire about their favorite technical stack or a technology they are eager to learn next.`;
  }

  // Formatting history
  let historyPrompt = "";
  if (history && history.length > 0) {
    historyPrompt = "Recent History:\n";
    history.slice(-3).forEach((turn, i) => {
      historyPrompt += `Q: ${turn.question}\nA: ${turn.answer || "No answer provided."}\n`;
    });
  }

  // Tailor question based on Experience Level & Difficulty
  let tailoringInstruction = "";
  if (experience === "Fresh" || experience === "Junior" || difficulty.toLowerCase() === "easy") {
    tailoringInstruction = `
### STICKY REQUIREMENT: CANDIDATE IS A FRESHER / BEGINNER
- Generate **VERY SIMPLE**, clear, and **short** questions.
- Avoid advanced architecture, deep nuances, or complex jargon.
- Focus on basic definitions, standard concepts, and everyday usage.
- Ensure the tone is extremely encouraging, supportive, and accessible.
`;
  } else if (experience === "Mid" || difficulty.toLowerCase() === "medium") {
    tailoringInstruction = `
### STICKY REQUIREMENT: CANDIDATE IS MID-LEVEL
- Generate questions of moderate depth and standard technical concepts.
- Focus on practical implementations, standard design patterns, and debugging.
`;
  } else {
    tailoringInstruction = `
### STICKY REQUIREMENT: CANDIDATE IS SENIOR / EXPERT
- Generate highly challenging, deep architectural or technical questions.
- Focus on performance optimization, trade-offs, system design, scaling, and deep framework mechanics.
`;
  }

  const prompt = `
You are a WORLD-CLASS AI Technical Interviewer conducting this interview on behalf of the hiring company.
Your name is "${interviewerName}". You must introduce yourself by this name and say welcome ONLY on the very first turn (when questionIndex is 0). If ever asked who you are later, you can say "I'm ${interviewerName}".

### INTERVIEWER INSTRUCTIONS & CONTEXT:
${jobDescription || "Conduct a structured professional interview for the role of " + role}

### TARGET SKILLS (STRICT FOCUS):
${skillsText}

${tailoringInstruction}

### CURRENT PHASE:
${phaseInstruction}

### CONVERSATIONAL REALISM INSTRUCTIONS:
- You must act like a real human interviewer talking in real-time (like ChatGPT voice).
- If the candidate has provided an answer in the history, you MUST react to it in **1 short sentence** (e.g., "That sounds like an amazing hobby!", "Excellent explanation of the state lifecycle.", "That's a very solid approach to managing memory.") before asking your next question.
- Do NOT be a rigid bot. Make the transition feel extremely natural, conversational, and smooth.
- Do NOT list questions, number them, or write any meta-text. Output ONLY the response you would say out loud.

### RECENT CONVERSATION HISTORY (DO NOT REPEAT THESE QUESTIONS):
${historyPrompt}

STRICT CONSTRAINTS:
1. Output ONLY the verbal response — no lists, no numbering, no meta commentary.
2. Tone: Warm, human-like, realistic, and tailored to a ${experience} candidate.
3. Length: Keep the entire response to 1-3 sentences (excluding the opening greeting on turn 0 which may be slightly longer).
4. Address the candidate as "${candidateName.split(' ')[0]}" when it feels natural, but do not overuse it.
5. NO REPEATED GREETINGS: Do NOT say "Hi", "Hello", "Welcome", or introduce yourself/mention your name/company name on any turn after turn 0 (where history is not empty). On all turns after turn 0, go straight into a 1-sentence reaction to the candidate's last answer, then ask the next question.

`;

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant", // Groq fast model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback question
    return `Could you explain a challenging problem you solved recently related to ${role}?`;
  }
};
