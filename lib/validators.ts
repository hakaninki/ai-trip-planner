import { z } from "zod";

const InterestEnum = z.enum([
    "museums",
    "traditional_food",
    "nightlife",
    "nature",
    "shopping",
    "art_galleries",
    "historical_sites",
    "local_markets",
]);

export const TripDetailsSchema = z.object({
    city: z.string().min(1, "City is required"),
    arrivalDatetime: z.string().min(1, "Arrival datetime is required"),
    departureDatetime: z.string().min(1, "Departure datetime is required"),
    budget: z.number().int().positive(),
    interests: z.array(InterestEnum).min(1, "Select at least one interest"),
});

export const QuestionsAnswerSchema = z.array(
    z.object({
        id: z.string(),
        question: z.string(),
        answer: z.boolean(),
    })
);

export const GeneratePlanRequestSchema = z.object({
    tripDetails: TripDetailsSchema,
    answers: QuestionsAnswerSchema,
});

export const SavePlanRequestSchema = z.object({
    tripDetails: TripDetailsSchema,
    questions: QuestionsAnswerSchema,
    plan: z.object({
        trip_summary: z.string(),
        days: z.array(
            z.object({
                day: z.number(),
                date: z.string(),
                schedule: z.array(
                    z.object({
                        time: z.string(),
                        activity: z.string(),
                        location: z.string(),
                    })
                ),
            })
        ),
    }),
});
