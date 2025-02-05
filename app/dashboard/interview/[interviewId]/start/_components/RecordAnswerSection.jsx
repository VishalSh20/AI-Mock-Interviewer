"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { uploadAudioToS3, textToSpeech } from '@/utils/aws'
import { transcribeAudio } from '@/utils/transcript.js'

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData, userResponse, setUserResponse}) {
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                await uploadToS3AndTranscribe(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            toast('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            toast.error('Failed to start recording');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            toast('Recording stopped, processing your answer...');
        }
    };

    const uploadToS3AndTranscribe = async (audioBlob) => {
        try {
            setLoading(true);
            const audioUrl = await uploadAudioToS3(audioBlob,interviewData?.mockId,activeQuestionIndex);
            console.log(audioUrl);            
            const transcriptionData = await transcribeAudio(audioUrl);
            
            console.log("Output of transcription", transcriptionData.text);
            if (transcriptionData.text.length) {
                setUserResponse(userResponse => {
                    let updatedResponse = [...userResponse];
                    updatedResponse[activeQuestionIndex] = transcriptionData.text;
                    return updatedResponse;
                });
            }
            toast.success('Recording processed successfully');
            
        } catch (error) {
            console.error('Error processing audio:', error);
            toast.error('Failed to process recording');
        } finally {
            setLoading(false);
        }
    };

    const handleRecordingButton = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5 
                transform transition-transform duration-300 hover:scale-[1.02]'>
                <Image src='/webcam.png' width={200} height={200} alt='web-cam-feed'
                    className='absolute'/>
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <Button 
                disabled={loading}
                variant="outline"
                className={`my-10 transform transition-all duration-300 
                    ${isHovered ? 'scale-105 shadow-lg' : ''}
                    ${isRecording ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-gray-100'}
                    active:scale-95`}
                onClick={handleRecordingButton}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isRecording ? (
                    <h2 className='text-red-600 flex gap-2 items-center'>
                        <StopCircle className="animate-pulse" /> Stop Recording
                    </h2>
                ) : (
                    <h2 className='flex gap-2 items-center'>
                        <Mic className={isHovered ? 'scale-110' : ''} /> Record Answer
                    </h2>
                )}
            </Button>
        </div>
    )
}

export default RecordAnswerSection