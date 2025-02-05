"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle, X } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

function AddNewInterview() {
    const [openDailog, setOpenDailog] = useState(false)
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();
    
    const resetForm = () => {
        setJobPosition('');
        setJobDesc('');
        setJobExperience('');
        setLoading(false);
    }

    const handleDialogOpenChange = (open) => {
        if (!open) {
            resetForm();
        }
        setOpenDailog(open);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate inputs
            if (!jobPosition || !jobDesc || !jobExperience) {
                toast.error("Please fill in all fields", {
                    position: 'top-center'
                });
                setLoading(false);
                return;
            }

            // Prepare AI prompt
            const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview Questions along with Answer in JSON format, Give us question and answer field as a JSON array only and nothing else`;
  
            // Generate interview questions
            const result = await chatSession.sendMessage(InputPrompt);
            const MockJsonResp = (result.response.text())
                .replace('```json','')
                .replace('```','')
                .trim();

            // Validate AI response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(MockJsonResp);
                console.log(parsedResponse);
            } catch (parseError) {
                toast.error("Failed to parse AI response", {
                    position: 'top-center'
                });
                setLoading(false);
                return;
            }

            // Insert into database
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: MockJsonResp,
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                }).returning({mockId: MockInterview.mockId});

            // Success handling
            if (resp && resp.length > 0) {
                toast.success("Interview generated successfully", {
                    position: 'top-center'
                });
                handleDialogOpenChange(false);
                router.push(`/dashboard/interview/${resp[0]?.mockId}`);
            } else {
                throw new Error("Failed to create interview");
            }
        } catch (error) {
            console.error("Interview generation error:", error);
            toast.error(error.message || "Failed to generate interview. Please try again.", {
                position: 'top-center'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div 
                className='p-10 border rounded-lg bg-secondary
                hover:scale-105 hover:shadow-md cursor-pointer
                transition-all'
                onClick={() => setOpenDailog(true)}
            >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog 
                open={openDailog} 
                onOpenChange={handleDialogOpenChange}
                modal={true}
            >
                <DialogContent 
                    className="max-w-2xl" 
                    closeIcon={<X className="h-4 w-4" />}
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interviewing
                        </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about your job position, Job description and years of experience</h2>

                                    <div className='mt-7 my-3'>
                                        <label>Job Role/Job Position</label>
                                        <Input 
                                            placeholder="Ex. Full Stack Developer" 
                                            required
                                            value={jobPosition}
                                            onChange={(event) => setJobPosition(event.target.value)}
                                        />
                                    </div>
                                    <div className='mt-7 my-3'>
                                        <label>Job Description/Tech Stack</label>
                                        <Textarea 
                                            placeholder="Ex. React, Angular , NodeJs, MySql" 
                                            required
                                            value={jobDesc}
                                            onChange={(event) => setJobDesc(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input 
                                            placeholder="Ex. 5" 
                                            type="number" 
                                            max="50" 
                                            required
                                            value={jobExperience}
                                            onChange={(event) => setJobExperience(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <DialogClose asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle className='animate-spin mr-2'/>
                                                Generating from AI
                                            </>
                                        ) : (
                                            'Start Interview'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview