"use client";

import { MockInterview, MockInterviewResponse } from "@/utils/schema";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const { interviewId } = useParams();
  const [responseList, setResponseList] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewData = async () => {
      if (!interviewId) return;

      try {
        setIsLoading(true);
        
        // Fetch interview details
        const interviewResult = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId))
          .limit(1);

        if (interviewResult.length > 0) {
          setInterviewData(interviewResult[0]);
        }

        // Fetch interview responses
        const responseResult = await db
          .select()
          .from(MockInterviewResponse)
          .where(eq(MockInterviewResponse.mockInterviewId, interviewId))
          .orderBy(MockInterviewResponse.id);

        setResponseList(responseResult);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          {interviewData && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{interviewData.jobPosition}</h2>
                <Badge variant="secondary">{interviewData.jobExperience}</Badge>
              </div>
              <p className="text-sm text-gray-600">{interviewData.jobDesc}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Created At: {new Date(interviewData.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {responseList.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              No interview responses available
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Interview Responses</h3>
              {responseList.map((response) => (
                <Card key={response.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Submitted At: {new Date(response.createdAt).toLocaleString()}
                    </p>
                    <Link
                      href={`/dashboard/interview/feedback/${response.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View Feedback →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}