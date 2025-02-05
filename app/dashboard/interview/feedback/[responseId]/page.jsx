"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const { responseId } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallRating, setOverallRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!responseId) return;

    const GetFeedback = async () => {
      try {
        setIsLoading(true);
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.responseId, responseId))
          .orderBy(UserAnswer.id);

        setFeedbackList(result);
        
        // Calculate overall rating dynamically
        const totalQuestions = result.length;
        const totalRating = result.reduce((sum, item) => sum + (item.rating || 0), 0);
        const calculatedRating = totalQuestions > 0 
          ? ((totalRating / (totalQuestions * 10)) * 10).toFixed(1) 
          : 0;
        
        setOverallRating(parseFloat(calculatedRating));
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    GetFeedback();
  }, [responseId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-3/4 mt-2" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-20 w-full mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-green-500">
            🎉 Congratulations!
          </CardTitle>
          <p className="text-lg font-semibold">Here is your interview feedback</p>
        </CardHeader>
        <CardContent>
          {feedbackList.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No Interview Feedback Record Found
            </p>
          ) : (
            <>
              <h2 className="text-primary text-lg my-3">
                Your overall interview rating: <strong>{overallRating}/10</strong>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Below are the interview questions along with correct answers, your responses, and feedback for improvement.
              </p>
              <Separator />
              <div className="space-y-4 mt-4">
                {feedbackList.map((item, index) => (
                  <Collapsible key={index} className="border rounded-lg p-3">
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-2 bg-gray-100 rounded-md text-left">
                      <span className="font-medium">{item.question}</span>
                      <ChevronsUpDown className="h-5 w-5 text-gray-600" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 space-y-2">
                        <div className="p-2 border rounded-lg text-sm text-red-600 bg-red-50">
                          <strong>Rating:</strong> {item.rating}/10
                        </div>
                        <div className="p-2 border rounded-lg text-sm bg-red-100 text-red-900">
                          <strong>Your Answer:</strong> {item.userAns}
                        </div>
                        <div className="p-2 border rounded-lg text-sm bg-green-100 text-green-900">
                          <strong>Correct Answer:</strong> {item.correctAns}
                        </div>
                        <div className="p-2 border rounded-lg text-sm bg-blue-100 text-blue-900">
                          <strong>Feedback:</strong> {item.feedback}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </>
          )}
          <div className="mt-6 flex justify-center">
            <Button onClick={() => router.replace("/dashboard")}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;