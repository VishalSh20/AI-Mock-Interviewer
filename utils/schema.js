import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperiance').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});

export const MockInterviewResponse = pgTable('mockInterviewResponse', {
    id: varchar('id').primaryKey(),
    mockInterviewId: varchar('mockInterviewId').notNull(),
    userEmail: varchar('userEmail').notNull(),
    createdAt: varchar('createdAt').notNull(),
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    responseId: varchar('responseId').notNull(), // reference to MockInterviewResponse
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt')
});