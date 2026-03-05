import { NextRequest, NextResponse } from "next/server";
import { GeneratePlanRequestSchema } from "@/lib/validators";
import { callGemini } from "@/lib/gemini";
import { buildPlanPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tripDetails, answers } = GeneratePlanRequestSchema.parse(body);
        const prompt = buildPlanPrompt(tripDetails, answers);
        const raw = await callGemini(prompt);
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const plan = JSON.parse(cleaned);
        return NextResponse.json({ plan });
    } catch (error) {
        console.error("[/api/plan/generate]", error);
        return NextResponse.json(
            { error: "Failed to generate plan" },
            { status: 500 }
        );
    }
}
