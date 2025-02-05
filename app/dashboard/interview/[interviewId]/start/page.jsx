"use client"
import { db } from '@/utils/db';
import { MockInterview, MockInterviewResponse, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { act, useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { chatSession } from '@/utils/GeminiAIModal'
import moment from 'moment'
import { useParams } from 'next/navigation';
import { textToSpeech } from '@/utils/aws';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';

function StartInterview() {
    const {interviewId} = useParams();
    const [interviewData , setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [userResponse, setUserResponse] = useState(null);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const router = useRouter();
    const {user} = useUser();

    useEffect(()=>{
        GetInterviewDetails();
    },[]);

      /* 
  Used to Get Interview Details by MockId/Interview Id
  */
  const GetInterviewDetails=async()=>{
    const result=await db.select().from(MockInterview) 
    .where(eq(MockInterview.mockId,interviewId))
    
    const jsonMockResp=JSON.parse(result[0].jsonMockResp);
    console.log(jsonMockResp);
    const questions = jsonMockResp;
    for(const ques of questions){
      ques.questionAudio = await loadQuestionAudio(ques.question);
    }
     setMockInterviewQuestion(jsonMockResp);
     setUserResponse(questions.map(q => ''));
     setInterviewData(result[0]);
   }

   const loadQuestionAudio = async (questionText)=>{
    try {
        const audioFile = await textToSpeech(questionText);
        return audioFile;
    } catch (error) {
        console.error("error in loading audio - "+error.message);
        toast.error('Failed to load audio');
        return null;
    }
  }

     const UpdateUserAnswer = async (answer, index, responseId) => {
          const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
          ", User Answer:" + answer +
          ", Depending on the question and user answer for give interview question" +
          "Please give the rating for answer between 1 to 10,feedback as area of improvement if any" +
          "in just 3 to 5 lines to improve it, and appropriate answer to the question in JSON format, nothing else, just JSON with fields - rating, feedback, answer";
  
          const result = await chatSession.sendMessage(feedbackPrompt);
          const mockJsonResp = (result.response.text()).replace('```json','').replace('```','');
          if(mockJsonResp[mockJsonResp.length-1]==='/'){
            mockJsonResp = mockJsonResp.slice(0, -1);
          }
          const JsonFeedbackResp = JSON.parse(mockJsonResp);
  
          const resp = await db.insert(UserAnswer)
          .values({
              mockIdRef: interviewData?.mockId,
              responseId:responseId,
              question: mockInterviewQuestion[activeQuestionIndex]?.question,
              correctAns: JsonFeedbackResp?.answer,
              userAns: answer,
              feedback: JsonFeedbackResp?.feedback,
              rating: JsonFeedbackResp?.rating,
              userEmail: user?.primaryEmailAddress?.emailAddress,
              createdAt: moment().format('DD-MM-YYYY')
          });
  
      };
  
      const handleSubmit = async ()=>{
        try {
          setIsSubmitting(true);
          const resp = await db.insert(MockInterviewResponse)
          .values({
            id:uuidv4(),
            mockInterviewId: interviewData?.mockId,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
          }).returning({responseId:MockInterviewResponse.id});
          console.log(resp);
          for(let i=0;i<mockInterviewQuestion.length;i++){
            await UpdateUserAnswer(userResponse[i],i,resp[0]?.responseId);
          }
          router.push('/dashboard/interview/feedback/'+resp[0]?.responseId);
          
        } catch (error) {
          console.error("Error in submitting interview - "+error.message);
          toast.error("Interview submission failed");
        }
      }

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                <QuestionsSection
                 mockInterviewQuestion = {mockInterviewQuestion}
                activeQuestionIndex= {activeQuestionIndex}
                 />

                {/* Video/Audio Recording */}

                <RecordAnswerSection
                     mockInterviewQuestion = {mockInterviewQuestion}
                     activeQuestionIndex= {activeQuestionIndex}
                     interviewData={interviewData}
                     userResponse={userResponse}
                     setUserResponse={setUserResponse}
                />
        </div>

        <div className='flex justify-end gap-6'>
         { activeQuestionIndex>0 &&
         <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} >Previous Question</Button> }
         { activeQuestionIndex != mockInterviewQuestion?.length-1 && 
         <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} >Next Question</Button> }
         { activeQuestionIndex == mockInterviewQuestion?.length-1 &&
          <Button
          onClick={handleSubmit}
          >End Interview</Button> 
          }
        </div>

    </div>
  )
}

export default StartInterview