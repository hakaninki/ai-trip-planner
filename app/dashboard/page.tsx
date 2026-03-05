"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { SavedPlan } from "@/types";
import { MapPin, CalendarDays, DollarSign, PlusCircle, Eye } from "lucide-react";

export default function DashboardPage() {
    const [plans, setPlans] = useState<SavedPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/plans")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setPlans(data.plans);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#080912] text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[300px] rounded-full bg-violet-700/10 blur-[100px]" />
            </div>
            <Navbar />
            <main className="relative z-10 max-w-5xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Itineraries</h1>
                        <p className="text-white/40 text-sm mt-1">All your saved travel plans, ready to revisit</p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold">
                        <Link href="/planner">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Plan a Trip
                        </Link>
                    </Button>
                </div>

                {loading && <LoadingSpinner message="Loading your trips..." />}

                {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && plans.length === 0 && (
                    <div className="text-center py-24">
                        <div className="h-16 w-16 rounded-2xl border border-white/8 bg-white/4 flex items-center justify-center mx-auto mb-5">
                            <MapPin className="h-7 w-7 text-white/20" />
                        </div>
                        <h2 className="text-lg font-semibold text-white/60 mb-2">No itineraries yet</h2>
                        <p className="text-white/30 text-sm mb-6">Plan your first trip and it will appear here.</p>
                        <Button asChild className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold">
                            <Link href="/planner"><PlusCircle className="h-4 w-4 mr-2" />Plan a Trip</Link>
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className="bg-white/5 border-white/10 text-white hover:border-violet-500/40 transition-colors group"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
                                        {plan.city}
                                    </CardTitle>
                                    <Badge className="bg-violet-600/30 text-violet-300 border-violet-500/30 shrink-0 text-xs">
                                        {plan.plan.days.length}d
                                    </Badge>
                                </div>
                                <CardDescription className="text-white/50 text-xs">
                                    {new Date(plan.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                                <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                                    {plan.plan.trip_summary}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-white/50">
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />${plan.budget.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {new Date(plan.arrival_datetime).toLocaleDateString()}
                                    </span>
                                </div>
                                <Button size="sm" variant="outline" asChild className="w-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
                                    <Link href={`/plan/${plan.id}`}>
                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                        View Itinerary
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
