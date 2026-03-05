import { NextRequest, NextResponse } from "next/server";
import { TripDetailsSchema } from "@/lib/validators";
import { callGemini } from "@/lib/gemini";
import { buildQuestionsPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const tripDetails = TripDetailsSchema.parse(body);
        const prompt = buildQuestionsPrompt(tripDetails);
        const raw = await callGemini(prompt);
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const questions = JSON.parse(cleaned);
        return NextResponse.json({ questions });
    } catch (error) {
        console.error("[/api/questions]", error);
        return NextResponse.json(
            { error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}
