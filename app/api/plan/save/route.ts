import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { SavePlanRequestSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { tripDetails, questions, plan } = SavePlanRequestSchema.parse(body);

        const { data, error } = await supabase
            .from("plans")
            .insert({
                user_id: user.id,
                city: tripDetails.city,
                arrival_datetime: tripDetails.arrivalDatetime,
                departure_datetime: tripDetails.departureDatetime,
                budget: tripDetails.budget,
                interests: tripDetails.interests,
                questions,
                plan,
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ plan: data });
    } catch (error) {
        console.error("[/api/plan/save]", error);
        return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
    }
}
