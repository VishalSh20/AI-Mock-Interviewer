CREATE TABLE IF NOT EXISTS "mockInterviewResponse" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockInterviewId" integer NOT NULL,
	"startTime" varchar NOT NULL,
	"endTime" varchar,
	"status" varchar NOT NULL,
	"userEmail" varchar NOT NULL,
	"createdAt" varchar NOT NULL,
	"responseId" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "responseId" varchar NOT NULL;