import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SavedPlan } from "@/types";
import { MapPin, Clock, CalendarDays, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PlanPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) notFound();

    const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error || !data) notFound();

    const plan = data as SavedPlan;

    return (
        <div className="min-h-screen bg-[#080912] text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[300px] rounded-full bg-violet-700/10 blur-[100px]" />
            </div>
            <Navbar />
            <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
                {/* Back */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <Card className="bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border-violet-500/30 text-white shadow-2xl mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <MapPin className="h-6 w-6 text-violet-400" />
                                    {plan.city}
                                </CardTitle>
                                <CardDescription className="text-white/50 mt-1 flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {new Date(plan.arrival_datetime).toLocaleDateString()} →{" "}
                                        {new Date(plan.departure_datetime).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3.5 w-3.5" />${plan.budget.toLocaleString()} budget
                                    </span>
                                </CardDescription>
                            </div>
                            <Badge className="bg-emerald-600/80 text-white border-emerald-500/50 shrink-0">
                                {plan.plan.days.length} days
                            </Badge>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mt-3 bg-white/5 rounded-lg p-3 border border-white/10">
                            {plan.plan.trip_summary}
                        </p>
                    </CardHeader>
                </Card>

                {/* Days */}
                <div className="space-y-4">
                    {plan.plan.days.map((day) => (
                        <Card key={day.day} className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-cyan-400" />
                                    Day {day.day}
                                    <span className="text-white/50 font-normal text-sm ml-1">· {day.date}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-0">
                                    {day.schedule.map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex gap-4 py-3">
                                                <div className="flex items-start gap-2 min-w-[72px]">
                                                    <Clock className="h-3.5 w-3.5 text-violet-400 mt-0.5 shrink-0" />
                                                    <span className="text-violet-300 font-mono text-sm font-semibold">
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white/90 text-sm font-medium leading-snug">
                                                        {item.activity}
                                                    </p>
                                                    <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                            {idx < day.schedule.length - 1 && (
                                                <Separator className="bg-white/5" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
