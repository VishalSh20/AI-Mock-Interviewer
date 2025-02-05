import { Lightbulb, Volume2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
    function playAudio(audioFile) {
        if (!audioFile) {
          console.error("No audio file provided.");
          toast.error("No audio file to play.");
          return;
        }
      
        const audioUrl = URL.createObjectURL(audioFile); // Convert file to a temporary URL
        const audio = new Audio(audioUrl);
      
        audio.play()
          .then(() => {
            console.log("Audio playing...");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            toast.error("Failed to play audio.");
          });
      
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); // Cleanup after playback
        };
      }
      

  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question,index)=>(
                <h2 
                key={index}
                className={`p-2 bg-secondary rounded-full
                 text-xs md:text-sm text-center cursor-pointer
                ${activeQuestionIndex==index&&'bg-primary text-white'}`}>Question #{index+1}</h2>

            ))}

            
        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <span>
        <Button
            onClick={()=>playAudio(mockInterviewQuestion[activeQuestionIndex]?.questionAudio)}
        >
        <Volume2 
        className='cursor-pointer'
        />
        </Button>
        
        </span>
            
        <div className='border rounded-lg p-5 bg-blue-100 '>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>

            <h2 className='text-sm text-primary mt-2'>Listen to the problem attentively and answer carefully</h2>
        </div>
   
    </div>
  )
}

export default QuestionsSection