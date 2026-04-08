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
  // We need to write the buffer to a temporary file because 
  // OpenAI's API library expects a file stream for the whisper model.
  const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.webm`);
  
  try {
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error in STT conversion:", error);
    throw new Error("Speech to text conversion failed.");
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
