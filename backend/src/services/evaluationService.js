import openai from "../utils/openai.js";

/**
 * Evaluates the candidate's answer.
 * @param {string} question - The question asked.
 * @param {string} answer - The candidate's transcribed answer.
 * @returns {Promise<Object>} The evaluation result containing scores and feedback.
 */
export const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are an expert technical interviewer evaluating a candidate's answer.
Question Asked: "${question}"
Candidate's Answer: "${answer}"

### SPECIAL EVALUATION RULES:
1. If the question asked is a casual greeting, introduction, ice-breaker, or hobby question (e.g. asking about hobbies, what they did today, how they got into the field, or introductions):
   - Do NOT evaluate it based on technical programming skills or programming code accuracy.
   - Evaluate it based on communication clarity, enthusiasm, responsiveness, and how warmly they introduced themselves.
   - Award a high "technicalScore" and "overallScore" (between 90 and 100) automatically to reward their initial communication and ensure their technical average grade is not penalized by these non-technical greeting questions.

Provide a highly objective evaluation of the candidate's answer.
Output the evaluation in pure JSON format exactly matching this structure (no markdown code blocks, just raw JSON):

{
  "semanticScore": <number between 0-100 indicating relevance to the question>,
  "technicalScore": <number between 0-100 indicating technical accuracy>,
  "overallScore": <number between 0-100 resulting from a weighted average>,
  "feedback": "<string, concise feedback explaining the evaluation>",
  "strengths": ["<string>", "<string>"],
  "weaknesses": ["<string>"]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more objective/consistent grading
      response_format: { type: "json_object" } // Enforce JSON
    });

    const content = response.choices[0].message.content;
    const evaluation = JSON.parse(content);
    return evaluation;
  } catch (error) {
    console.error("Error evaluating answer:", error);
    // Fallback if formatting or API fails
    return {
      semanticScore: 50,
      technicalScore: 50,
      overallScore: 50,
      feedback: "Failed to evaluate the answer correctly due to an internal error.",
      strengths: [],
      weaknesses: []
    };
  }
};
