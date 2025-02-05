import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function Dashboard() {
  return (
    <div className='relative min-h-screen w-full bg-gradient-to-br   p-6 md:p-10 overflow-hidden'>
     
      {/* Content Container */}
      <div className='relative z-10'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='font-bold text-3xl text-blue-900 tracking-tight'>
              Dashboard
            </h2>
            <p className='text-blue-700/80 mt-2 text-sm'>
              Create and Start your AI MockUp Interview Journey
            </p>
          </div>
       </div>

        <Card className='bg-white/90 shadow-lg border-blue-100/50 border p-6 backdrop-blur-sm'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <AddNewInterview/>
          </div>
        </Card>
        
        <Separator className='my-8 bg-blue-200/50' />

        {/* Previous Interview List */}
        <Card className='bg-white/90 shadow-lg border-blue-100/50 border p-6 backdrop-blur-sm'>
          <h3 className='text-xl font-semibold text-blue-900 mb-4'>
            Previous Interviews
          </h3>
          <InterviewList/>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard