"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TripPlan, TripDetails, YesNoQuestion } from "@/types";
import {
    MapPin, Clock, Save, RefreshCw, CheckCircle2,
    CalendarDays, Loader2
} from "lucide-react";

interface Props {
    plan: TripPlan;
    tripDetails: TripDetails;
    questions: YesNoQuestion[];
    onRegenerate: () => void;
}

export function StepPlanView({ plan, tripDetails, questions, onRegenerate }: Props) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/plan/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripDetails,
                    questions: questions.map((q) => ({
                        id: q.id,
                        question: q.question,
                        answer: q.answer as boolean,
                    })),
                    plan,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Failed to save");
            }
            setSaved(true);
            setTimeout(() => router.push("/dashboard"), 1200);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save plan");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border-violet-500/30 text-white shadow-2xl">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-violet-400" />
                                Your {tripDetails.city} Itinerary
                            </CardTitle>
                            <CardDescription className="text-white/60 mt-1">
                                {plan.days.length} days · ${tripDetails.budget.toLocaleString()} budget
                            </CardDescription>
                        </div>
                        <Badge className="bg-violet-600/30 text-violet-300 border-violet-500/30 shrink-0">
                            Ready to Save
                        </Badge>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mt-2 bg-white/5 rounded-lg p-3 border border-white/10">
                        {plan.trip_summary}
                    </p>
                </CardHeader>
            </Card>

            {/* Day-by-Day Schedule */}
            <div className="space-y-4">
                {plan.days.map((day) => (
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

            {/* Action Buttons */}
            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                    {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold"
                >
                    {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</>
                    ) : saved ? (
                        <><CheckCircle2 className="h-4 w-4 mr-2" />Saved! Redirecting...</>
                    ) : (
                        <><Save className="h-4 w-4 mr-2" />Save Itinerary</>
                    )}
                </Button>
                <Button
                    onClick={onRegenerate}
                    variant="outline"
                    className="flex-1 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                </Button>
            </div>
        </div>
    );
}
