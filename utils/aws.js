import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_CREDENTIALS = {
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
};

export const textToSpeech = async (text) => {
  const pollyClient = new PollyClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: AWS_CREDENTIALS,
  });
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
  };
  const command = new SynthesizeSpeechCommand(params);
  const response = await pollyClient.send(command);
  
  if (!response.AudioStream) {
    throw new Error("No audio stream received from Polly.");
  }

  // Convert AudioStream (ReadableStream) to Blob
  const audioBuffer = await response.AudioStream.transformToByteArray();
  const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

  // Convert Blob to File (optional, for file-specific handling)
  const audioFile = new File([audioBlob], "speech.mp3", { type: "audio/mpeg" });

  return audioFile;
}

export const uploadAudioToS3 = async (audioBlob, interviewId, questionNumber) => {
    try {  
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials:AWS_CREDENTIALS,
      });
      
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);
      const key = `interview-${interviewId}-question-${questionNumber}-${Date.now()}.mp3`;
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key: key,
        Body: audioBuffer,
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const getCommand = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key:key,
      });
      const responseUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 36000 });
      return responseUrl;
    } catch (error) {
      console.error("Error uploading audio to S3:", error);
      throw error;      
    }
}