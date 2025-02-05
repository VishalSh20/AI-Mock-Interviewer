import { AssemblyAI } from "assemblyai";
export const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
  });

export const transcribeAudio = async (audioUrl) => {
    try {
        console.log(audioUrl);
        const transcript = await client.transcripts.transcribe({
            audio: audioUrl,
        });
        return transcript
    } catch (error) {
        throw new Error("Error transcribing audio: " + error.message);
    }
  };

