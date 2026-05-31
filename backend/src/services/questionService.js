import {
  generateInterviewerReply,
  streamInterviewerReply,
  buildContextFromInterview,
} from "./conversationService.js";

/**
 * @deprecated Use conversationService directly. Kept for imports.
 */
export const generateQuestion = async (context) => {
  return generateInterviewerReply(context);
};

export { streamInterviewerReply, buildContextFromInterview };
