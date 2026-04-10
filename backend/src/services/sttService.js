import openai from "../utils/openai.js";
import fs from "fs";
import os from "os";
import path from "path";

/**
 * Converts audio buffer to text using OpenAI Whisper API.
 * @param {Buffer} audioBuffer - The audio binary data
 * @returns {Promise<string>} The transcribed text
 */
export const convertAudioToText = async (audioBuffer) => {
  const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.webm`);
  
  try {
    fs.writeFileSync(tempFilePath, audioBuffer);
    console.log(`STT: Processing transient audio file: ${tempFilePath} (${audioBuffer.length} bytes)`);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
    });

    if (!transcription || !transcription.text) {
      console.warn("STT: Received empty transcription from Groq.");
      return "";
    }

    console.log(`STT: Transcription successful (${transcription.text.length} chars)`);
    return transcription.text;
  } catch (error) {
    console.error("STT: Conversion failure DETAILS:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data || "No response data"
    });
    throw new Error(`Speech to text failed: ${error.message}`);
  } finally {
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkErr) {
        console.error("STT: Failed to delete temp file:", unlinkErr);
      }
    }
  }
};
