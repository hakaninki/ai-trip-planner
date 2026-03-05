import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("plans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ plans: data });
    } catch (error) {
        console.error("[/api/plans]", error);
        return NextResponse.json(
            { error: "Failed to fetch plans" },
            { status: 500 }
        );
    }
}
