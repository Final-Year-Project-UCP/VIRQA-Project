import openai from "../utils/openai.js";

/**
 * Converts text to speech using OpenAI TTS.
 * @param {string} text - The text to speak.
 * @returns {Promise<string>} Base64 encoded audio string
 */
export const convertTextToSpeech = async (text) => {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error in TTS conversion:", error);
    throw new Error("Text to speech conversion failed.");
  }
};
