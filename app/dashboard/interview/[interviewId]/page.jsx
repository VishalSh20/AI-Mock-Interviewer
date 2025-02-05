"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React,{useEffect, useState} from 'react'
import Webcam from 'react-webcam';


function Interview() {
  const {interviewId} = useParams();
  const [interviewData, setInterviewData]=useState();
  const [webCamEnabled, setWebCamEnabled]=useState();
 
  useEffect(()=>{
    console.log(interviewId)
    GetInterviewDetails();
  },[])
  /*
  Used to Get Interview Details by MockId/Interview Id
  */
  const GetInterviewDetails=async()=>{
   const result=await db.select().from(MockInterview) 
   .where(eq(MockInterview.mockId,interviewId))
   
    setInterviewData(result[0]);
  }

  return (
    <div className='my-10'>

      <h2 className='font-bold text-2xl'>Lets Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
 
      <div className='flex flex-col my-5 gap-5 '>

        <div className='flex flex-col p-5 rounded-lg border gap-5'>
          <h2 className='text-lg'><strong>Job Role/Job Position: </strong> {interviewData ? interviewData.jobPosition : "Loading"}</h2>
          <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong> {interviewData ? interviewData.jobDesc : "Loading"}</h2>
          <h2 className='text-lg'><strong>Years of Expericence: </strong> {interviewData ? interviewData.jobExperience : "Loading"}</h2>
        </div>

        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <p className='flex gap-2 items-center mt-3 text-yellow-500'> <Lightbulb/><strong>Information</strong> </p>
            <p className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It has 10 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time if you want.</p>
        </div>

        </div>

        <div>
        { webCamEnabled? <Webcam
        onUserMedia={()=>setWebCamEnabled(true)}
        onUserMediaError={()=>setWebCamEnabled(false)}
        mirrored = {true}
        style = {{
          height:300,
          width:300,
        }}
         /> 
         : 
         <> 
        <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
        <Button variant = "ghost" className="w-full" onClick={()=>setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
        </>
        }
        </div>
        </div>

        <div className = 'flex justify-end items-end'>
        <Link href = {'/dashboard/interview/'+interviewId+'/start'}>
        <Button>Start</Button>
        </Link>
        </div>
    </div>
  )
}

export default Interview